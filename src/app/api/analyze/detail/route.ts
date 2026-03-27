import { NextRequest, NextResponse } from "next/server";
import { fetchDishDetail } from "@/lib/ai/claude";
import { MenuInput } from "@/lib/ai/provider";
import { InputType, DishDetail } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";
import { createHash } from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function buildDishCacheKey(phase1Key: string, dishOriginal: string): string {
  return createHash("sha256")
    .update(`detail:${phase1Key}:${dishOriginal}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Mock mode
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "network_error", reason: "No API key configured (mock mode)" },
        { status: 422, headers: corsHeaders }
      );
    }

    let body: {
      input?: string;
      inputType?: string;
      dishOriginal?: string;
      dishCategory?: string;
      outputLanguage?: string;
      allergenPreset?: string[];
      dietaryBeliefs?: string[];
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "network_error", reason: "Invalid JSON" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!body.input || !body.dishOriginal) {
      return NextResponse.json(
        { error: "network_error", reason: "Missing input or dishOriginal" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inputType = (body.inputType || "image") as InputType;

    // Build cache keys
    const cacheInput = inputType === "image" ? body.input.slice(0, 200) : body.input;
    const phase1Key = buildCacheKey({
      input: cacheInput,
      inputType,
      srcLang: "auto",
      tgtLang: body.outputLanguage || "en",
    });
    const dishKey = buildDishCacheKey(phase1Key, body.dishOriginal);

    // Check cache
    const cached = await getCached(dishKey);
    if (cached) {
      return NextResponse.json(cached, { headers: corsHeaders });
    }

    // Fetch from Claude
    const menuInput: MenuInput = {
      input: body.input,
      inputType,
      outputLanguage: body.outputLanguage,
      allergenPreset: body.allergenPreset,
      dietaryBeliefs: body.dietaryBeliefs,
    };

    const result = await fetchDishDetail(
      menuInput,
      body.dishOriginal,
      body.dishCategory || "main"
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: "ocr_failed", reason: result.error },
        { status: 422, headers: corsHeaders }
      );
    }

    // Cache and return
    await setCache(dishKey, result.data as unknown as object);
    return NextResponse.json(result.data as DishDetail, { headers: corsHeaders });
  } catch (err) {
    console.error("Detail API error:", err);
    return NextResponse.json(
      { error: "network_error", reason: err instanceof Error ? err.message : "Internal error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
