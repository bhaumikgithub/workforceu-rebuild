import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from "bcryptjs";
import Stripe from 'stripe';
import { format } from "date-fns";

// Use the Stripe secret key (never use publishable key here)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const userType = searchParams.get("user_type"); // read from query
    const userIdParam = searchParams.get("user_id"); // comes as string | null
    const userId = userIdParam ? Number(userIdParam) : undefined;
    const subdomain = searchParams.get("subdomain");
    // Fetch single user by ID
    if (id) {
        const user = await prisma.users.findUnique({
            where: { id: Number(id) },
            include: {
                department: {
                    select: {
                        department_name: true
                    }
                },
                state: {
                    select: {
                        name: true
                    }
                },
                country: {
                    select: {
                        name: true
                    }
                },
                subdomain: {
                    select: {
                        domain: true,
                        name: true,
                        regular_hours: true,
                        week_start_day: true,
                        company_type: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                    },
                },
                subscriptions: {
                    select: {
                        employee_limit: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone_number,
            status: user.status === "active" ? "Yes" : "No",
            clientId: user.subdomain?.domain || "",
            companyName: user.subdomain?.name || "",
            companyTypeId: user.subdomain?.company_type?.id || "",
            companyType: user.subdomain?.company_type?.name || "",
            address: [
                user.address,
                user.address_2,
                user.city,
                user.state,
                user.zip_code
            ].filter(Boolean).join(', '),
            dateEmployed: format(new Date(user.created_at), "MM/dd/yyyy"), // or your actual field 
            department: user.department?.department_name || "",
            payType: user.pay_type === "flat_rate" ? "Flat Rate" : "Hourly",
            reimbursement: user.reimbursement ?? 0,
            position: user.position ?? "",
            isPrimary: user.user_type === "po_user" ? 1 : 0,
            poUserId: user.user_type === "po_user" ? user.id : user.owner_id,
            employeeLimit: user.subscriptions?.[0]?.employee_limit ?? 0,
            regularHours: user.subdomain?.regular_hours || "",
            weekStartDay: user.subdomain?.week_start_day || "",
        });
    }
    // subdomain check
    if (subdomain) {
        const existing = await prisma.subdomains.findUnique({
            where: { domain: subdomain, deleted_at: null },
        });
        return NextResponse.json({ exists: !!existing });
    }

    if (userType === "po_user" && userId) {
        const poUsers = await prisma.users.findMany({
            where: {
                OR: [
                    { status: "active", deleted_at: null, owner_id: userId }, // employees
                    { id: userId } // include the owner themselves
                ]
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        return NextResponse.json({ poUsers });
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

        // 1️. Create Tenant
        const tenant = await prisma.subdomains.create({
            data: {
                name: data.company_name,
                domain: data.subdomain_value,
                company_type_id: Number(data.company_type_id),
                regular_hours: Number(data.regular_hours),
                week_start_day: Number(data.week_start_day),
                status: 'active',
            },
        });

        // 2️. Create Location
        const location = await prisma.locations.create({
            data: {
                location_name: data.location_name,
                subdomain_id: tenant.id,
                status: 'active',
            },
        });

        // 3️. Create User
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
                user_type: 'po_user',
            },
        });

        // 4️. Handle Stripe subscription
        if (data.payment_type === 'CC') {
            if (!data.paymentMethod) {
                return NextResponse.json({ message: 'Payment method required' }, { status: 400 });
            }

            // Create Stripe customer
            const customer = await stripe.customers.create({
                email: user.email ?? undefined,
                name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
            });

            // Attach payment method & set default
            await stripe.paymentMethods.attach(data.paymentMethod, { customer: customer.id });
            await stripe.customers.update(customer.id, {
                invoice_settings: { default_payment_method: data.paymentMethod },
            });

            // Create subscription with expand to get payment intent
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: data.subscription_plan }],
                expand: ['latest_invoice.payment_intent.payment_method'],
                discounts: data.coupon ? [{ coupon: data.coupon }] : undefined,
            });
            const currentPeriodStart = subscription.items.data[0].current_period_start;
            const currentPeriodEnd = subscription.items.data[0].current_period_end;

            const subscriptionStartDate = currentPeriodStart
                ? new Date(currentPeriodStart * 1000)
                : new Date();

            const subscriptionEndDate = currentPeriodEnd
                ? new Date(currentPeriodEnd * 1000)
                : null;

            // Plan info
            const plan = subscription.items.data[0].plan;

            // Or when retrieving a Plan directly
            const planObject = await stripe.plans.retrieve(data.subscription_plan, {
                expand: ['product'], // Expand the product object associated with the plan
            });

            const planName = planObject.nickname ?? (planObject.product as any)?.name ?? null;

            const interval = plan.interval;
            const planAmountInDollars = subscription.items.data[0].plan.amount! / 100;

            // Payment intent & card
            const invoice = subscription.latest_invoice as Stripe.Invoice & {
                payment_intent?: Stripe.PaymentIntent & { payment_method?: Stripe.PaymentMethod };
            };
            const paymentIntent = invoice?.payment_intent;
            const card = paymentIntent?.payment_method as Stripe.PaymentMethod | undefined;

            // Last payment attempted date
            const lastPaymentAttemptedDate = paymentIntent
                ? new Date(paymentIntent.created * 1000)
                : null;

            // Save subscription to DB
            await prisma.subscription.create({
                data: {
                    user_id: user.id,
                    plan_id: data.subscription_plan,
                    stripe_subscription_id: subscription.id,
                    subscription_start_date: subscriptionStartDate,
                    subscription_end_date: subscriptionEndDate,
                    employee_limit: data.employee_limit ?? null,
                    customer_id: customer.id,
                    coupan_id: data.coupon ?? null,
                    interval,
                    plan_name: planName,
                    stripe_status: true,
                    invoice_id: invoice?.id ?? null,
                    amount: planAmountInDollars,
                    last_payment_attempted_date: lastPaymentAttemptedDate,
                },
            });

            // Save payment method
            await prisma.paymentMethod.create({
                data: {
                    user_id: user.id,
                    stripe_payment_method_id: data.paymentMethod,
                    card_brand: card?.card?.brand ?? null,
                    last_4: card?.card?.last4 ?? null,
                    exp_month: card?.card?.exp_month ?? null,
                    exp_year: card?.card?.exp_year ?? null,
                },
            });

            return NextResponse.json({
                subscriptionId: subscription.id,
                paymentStatus: paymentIntent?.status ?? 'unknown',
            });
        }

        // 5️. No credit card, just return user
        return NextResponse.json({ message: 'Public User created successfully', user });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: err.message || 'Failed to create user' }, { status: 500 });
    }
}

// src/app/api/admin/publicUsers/route.ts
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const userId = parseInt(id);
    const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: { deleted_at: new Date() },
    });

    return NextResponse.json({ success: true, user: updatedUser });
}
