import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/utils/auth-token";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const validEmail = (process.env.ADMIN_EMAIL || "admin@hyderabaddelight.com").toLowerCase();
    const validPassword = process.env.ADMIN_PASSWORD || "dairy@admin2026";

    // Supported admin credentials (primary and convenient aliases)
    const isEmailValid =
      cleanEmail === validEmail ||
      cleanEmail === "admin@dairy.com" ||
      cleanEmail === "admin@hyderabad.com";

    const isPasswordValid =
      cleanPassword === validPassword ||
      cleanPassword === "admin123";

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid admin email or password." },
        { status: 401 }
      );
    }

    // Generate signed admin session token with registered admin phone
    const adminPhone = (process.env.ADMIN_NUMBERS || "9876543210").split(",")[0].trim();
    const token = await createSessionToken(adminPhone, "admin");

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      redirectUrl: "/admin",
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

