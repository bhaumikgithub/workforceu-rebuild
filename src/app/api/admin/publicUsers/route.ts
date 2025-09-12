import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient,Prisma  } from '@prisma/client';
import bcrypt from "bcryptjs";

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

    // // 3. Handle Stripe subscription if payment_type is 'CC'
    // if (data.payment_type === "CC") {
    //   // Create Stripe Customer
    //   const customer = await stripe.customers.create({
    //     email: user.email,
    //     name: `${user.first_name} ${user.last_name}`,
    //   });

    //   // Attach Payment Method
    //   if (!data.paymentMethod) {
    //     return NextResponse.json({ message: "Payment method required" }, { status: 400 });
    //   }

    //   await stripe.paymentMethods.attach(data.paymentMethod, {
    //     customer: customer.id,
    //   });

    //   // Set default payment method
    //   await stripe.customers.update(customer.id, {
    //     invoice_settings: { default_payment_method: data.paymentMethod },
    //   });

    //   // Create subscription
    //   const subscriptionData: Stripe.SubscriptionCreateParams = {
    //     customer: customer.id,
    //     items: [{ price: data.subscription_plan }],
    //     expand: ["latest_invoice.payment_intent"],
    //   };

    //   if (data.coupon) subscriptionData.coupon = data.coupon;

    //   await stripe.subscriptions.create(subscriptionData);
    // }

    return NextResponse.json({ message: "Public User created successfully", user });
  } catch (err: any) {
    	console.error(err);
    	return NextResponse.json({ message: err.message || "Failed to create user" }, { status: 500 });
	}
}