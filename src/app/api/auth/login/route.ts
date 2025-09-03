import { NextResponse } from "next/server";
import { login } from "@/lib/services/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { status: false, message: "Password is required" },
        { status: 400 }
      );
    }

    const { user, token } = await login(email, password);

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
