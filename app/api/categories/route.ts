import { NextResponse } from "next/server";
import { PRESET_CATEGORIES } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ data: PRESET_CATEGORIES });
}
