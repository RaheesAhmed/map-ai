import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchByCategory } from "@/lib/services/overpass";
import { processComboSearch } from "@/lib/services/combo";

const comboRequestSchema = z.object({
  categoryA: z.string().min(1),
  categoryB: z.string().min(1),
  centerLat: z.number().min(-90).max(90).optional(),
  centerLon: z.number().min(-180).max(180).optional(),
  radius: z.number().positive().max(50000).optional(),
  limit: z.number().int().positive().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = comboRequestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message } },
        { status: 400 },
      );
    }

    const { categoryA, categoryB, centerLat, centerLon, radius, limit } = parsed.data;

    const [resultA, resultB] = await Promise.all([
      searchByCategory(categoryA, centerLat, centerLon, radius, limit),
      searchByCategory(categoryB, centerLat, centerLon, radius, limit),
    ]);

    const comboResult = processComboSearch(resultA.locations, resultB.locations, limit ?? 100);

    return NextResponse.json({ data: comboResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API /combos]", message);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 },
    );
  }
}
