import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient,Prisma  } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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
            company_type: { select: { name: true } },
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
