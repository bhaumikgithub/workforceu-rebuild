import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/masterData
export async function GET() {
  try {
    const [companyTypes, timezones, countries] = await Promise.all([
      prisma.company_types.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.timezones.findMany({
        select: { id: true, utc: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.countries.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      companyTypes,
      timezones,
      countries,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to fetch master data", error: err.message },
      { status: 500 }
    );
  }
}
