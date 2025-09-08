import { NextResponse } from "next/server";
import { login } from "@/lib/services/auth";

export async function POST(req: Request) {
  try {
    const { email, password , domain} = await req.json();

    if (!email || !password || !domain) {
        return NextResponse.json(
            { success: false, message: "Missing required fields" },
            { status: 400 }
        );
    }

    const { user, token } = await login(email, password , domain);

    return NextResponse.json({
        status: true,
        message: "Login successful",
        user,
        token,
    });
    } catch (err: any) {
        return NextResponse.json(
        { status: false, message: err?.message || "Login failed" },
        { status: 400 }
        );
    }
}
