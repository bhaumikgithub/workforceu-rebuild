import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { subdomain } = await req.json();

    if (!subdomain) {
      return NextResponse.json({ exists: false, message: "Subdomain is required" });
    }

    const tenant = await prisma.subdomains.findFirst({
      where: { domain: subdomain },
    });

    if (!tenant) {
      return NextResponse.json({ exists: false, message: "Subdomain does not exist" });
    }

    return NextResponse.json({ exists: true });
  } catch (error) {
    return NextResponse.json({ exists: false, message: "Server error" });
  }
}
