import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("state_id");
  const query = searchParams.get("q") || "";

  if (!stateId) {
    return NextResponse.json({ error: "state_id is required" }, { status: 400 });
  }

  try {
    const cities = await prisma.city.findMany({
      where: {
        state_id: Number(stateId),
        status: "active",
        name: {
          contains: query,
        },
      },
      select: { id: true, name: true },
      take: 10,
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("City fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
