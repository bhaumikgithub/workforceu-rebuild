import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/states?country_id=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("country_id");

  if (!countryId) {
    return NextResponse.json(
      { message: "country_id is required" },
      { status: 400 }
    );
  }

  try {
    const states = await prisma.states.findMany({
      where: { country_id: Number(countryId) },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(states);
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to fetch states", error: err.message },
      { status: 500 }
    );
  }
}
