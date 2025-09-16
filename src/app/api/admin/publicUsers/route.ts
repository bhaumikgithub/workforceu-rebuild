import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from "bcryptjs";
import Stripe from 'stripe';

// Use the Stripe secret key (never use publishable key here)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const subdomain = searchParams.get("subdomain");

    // subdomain check
    if (subdomain) {
        const existing = await prisma.subdomains.findUnique({
            where: { domain: subdomain },
        });
        return NextResponse.json({ exists: !!existing });
    }

    // Listing query
    const {
        search = '',
        page = '1',
        pageSize = '50',
        sortField = 'first_name',
        sortOrder = 'asc'
    } = Object.fromEntries(req.nextUrl.searchParams);

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
    const sortableFields: (keyof Prisma.usersOrderByWithRelationInput)[] = [
        'id',
        'first_name',
        'last_name',
        'email',
        'user_type',
        'status',
    ];
    let orderBy: Prisma.usersOrderByWithRelationInput;

    if (sortableFields.includes(sortField as keyof Prisma.usersOrderByWithRelationInput)) {
        orderBy = { [sortField]: sortOrder as Prisma.SortOrder };
    } else {
        orderBy = { first_name: 'asc' }; // 👈 fallback to first_name asc
    }

    // Build filter
    const whereFilter: any = {
        user_type: { in: ['po_user', 'so_user'] },
    };

    if (search) {
        whereFilter.OR = [
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { email: { contains: search } },
        ];
    }

    // Total count
    const total = await prisma.users.count({ where: whereFilter });

    // Fetch current page
    const users = await prisma.users.findMany({
        where: whereFilter,
        orderBy,
        skip,
        take,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_type: true,
            status: true,
            subdomain: {
                select: {
                    domain: true,
                    name: true,
                    company_type: {
                        select: {
                            name: true
                        }
                    },
                },
            },
        },
    });

    // Map for frontend
    const data = users.map(u => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        userType: u.user_type === 'po_user' ? 'Primary User' : 'Employee',
        status: u.status ? 'Active' : 'Inactive',
        clientId: u.subdomain?.domain || '',
        companyType: u.subdomain?.name || '',
        businessType: u.subdomain?.company_type?.name || '',
    }));

    return NextResponse.json({ data, total, page: parseInt(page) });
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        // 1. Create Tenant
        const tenant = await prisma.subdomains.create({
            data: {
                name: data.company_name,
                domain: data.subdomain_value, // assuming subdomain
                company_type_id: Number(data.company_type_id),
                regular_hours: Number(data.regular_hours),
                week_start_day: Number(data.week_start_day),
                status: "active",
            },
        });

        // Create Location
        const location = await prisma.locations.create({
            data: {
                location_name: data.location_name,
                subdomain_id: tenant.id, // assuming subdomain
                status: "active",
            },
        });

        // 2. Create User
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.users.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_number: data.phone,
                mobile: data.mobile,
                fax: data.fax,
                subdomain_id: tenant.id,
                password: hashedPassword,
                original_password: data.password,
                account_type: 1,
                time_zone_id: Number(data.timezone),
                location_id: location.id,
                country_id: Number(data.country_id),
                state_id: Number(data.state_id),
                city: data.city,
                address: data.address,
                zip_code: data.pincode,
                user_type: "po_user"

            },
        });

        // 3. Handle Stripe subscription if payment_type is 'CC'
        if (data.payment_type === "CC") {
            // 1. Create customer
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
                name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
            });

            // 2. Attach Payment Method
            if (!data.paymentMethod) {
                return NextResponse.json({ message: "Payment method required" }, { status: 400 });
            }

            await stripe.paymentMethods.attach(data.paymentMethod, {
                customer: customer.id,
            });

            // 3. Set default payment method
            await stripe.customers.update(customer.id, {
                invoice_settings: { default_payment_method: data.paymentMethod },
            });

            // 4. Create subscription
            const subscriptionData: Stripe.SubscriptionCreateParams = {
                customer: customer.id,
                items: [{ price: data.subscription_plan }],
                expand: ["latest_invoice.payment_intent.payment_method"],
            };

            if (data.coupon) {
                subscriptionData.discounts = [{ coupon: data.coupon }];
            }

            const subscription = await stripe.subscriptions.create(subscriptionData);

            const invoice = subscription.latest_invoice as Stripe.Invoice & {
                payment_intent?: Stripe.PaymentIntent & {
                    payment_method?: Stripe.PaymentMethod;
                };
            };

            const paymentIntent = invoice.payment_intent;
            const card = (paymentIntent?.payment_method as Stripe.PaymentMethod)?.card;

            // 6. Save to DB
            await prisma.subscription.create({
                data: {
                    user_id: user.id,
                    plan_id: data.subscription_plan,
                    stripe_subscription_id: subscription.id,
                    subscription_start_date: new Date(),
                    employee_limit: data.employee_limit ?? null,
                    customer_id: customer.id,
                    coupan_id: data.coupon ?? null,
                    interval: subscription.items.data[0].plan.interval,
                    plan_name:
                        subscription.items.data[0].plan.nickname ??
                        (subscription.items.data[0].plan.product as any)?.name ??
                        null,
                    stripe_status: true,
                    invoice_id: invoice?.id ?? null,
                    amount: subscription.items.data[0].plan.amount ?? null,
                    last_payment_attempted_date: paymentIntent
                        ? new Date(paymentIntent.created * 1000)
                        : null,
                },
            });

            await prisma.paymentMethod.create({
                data: {
                    user_id: user.id,
                    stripe_payment_method_id: data.paymentMethod,
                    card_brand: card?.brand ?? null,
                    last_4: card?.last4 ?? null,
                    exp_month: card?.exp_month ?? null,
                    exp_year: card?.exp_year ?? null,
                },
            });

            return NextResponse.json({
                subscriptionId: subscription.id,
                paymentStatus: paymentIntent?.status ?? "unknown",
            });
        }

        return NextResponse.json({ message: "Public User created successfully", user });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: err.message || "Failed to create user" }, { status: 500 });
    }
}