import { NextResponse } from "next/server";
import { seedDairy } from "@/db/seed-dairy";

export async function GET() {
  try {
    await seedDairy();
    return NextResponse.json({
      success: true,
      message: "Hyderabad Delight Dairy database successfully seeded with all categories, products, and banners!",
    });
  } catch (error: any) {
    console.error("Database seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
