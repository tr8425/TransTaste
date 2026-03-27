import { NextRequest, NextResponse } from "next/server";
import { MOCK_MENU_RESULT } from "@/lib/mock-data";
import { selectProvider } from "@/lib/ai/provider";
import { MenuInput } from "@/lib/ai/provider";
import { createMenuAnalysisStream } from "@/lib/ai/claude";
import { isAnalysisError, InputType, MenuAnalysisResult } from "@/lib/types";
import { buildCacheKey, getCached, setCache } from "@/lib/cache";

const VALID_INPUT_TYPES: InputType[] = ['image', 'url', 'text'];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // If no API key, return mock data for development
    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(MOCK_MENU_RESULT, { headers: corsHeaders });
    }

    // Parse request body
    let body: {
      input?: string;
      inputType?: string;
      outputLanguage?: string;
      allergenPreset?: string[];
      dietaryBeliefs?: string[];
      stream?: boolean;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "network_error", reason: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate required fields
    if (!body.input || typeof body.input !== 'string') {
      return NextResponse.json(
        { error: "network_error", reason: "Missing or invalid 'input' field" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inputType = (body.inputType || 'image') as InputType;
    if (!VALID_INPUT_TYPES.includes(inputType)) {
      return NextResponse.json(
        { error: "network_error", reason: `Invalid inputType: ${body.inputType}. Must be one of: ${VALID_INPUT_TYPES.join(', ')}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Build cache key
    const cacheInput = inputType === 'image'
      ? body.input.slice(0, 200)
      : body.input;
    const cacheKey = buildCacheKey({
      input: cacheInput,
      inputType,
      srcLang: 'auto',
      tgtLang: body.outputLanguage || 'en',
    });

    // Check cache before calling AI
    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: corsHeaders });
    }

    // Build menu input
    const menuInput: MenuInput = {
      input: body.input,
      inputType,
      outputLanguage: body.outputLanguage,
      allergenPreset: body.allergenPreset,
      dietaryBeliefs: body.dietaryBeliefs,
    };

    // Streaming mode: return SSE stream
    if (body.stream) {
      console.log('[TransTaste] Streaming mode requested, inputType:', inputType);
      const readable = createMenuAnalysisStream(menuInput, cacheKey);
      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
          ...corsHeaders,
        },
      });
    }

    // Non-streaming mode: select AI provider and analyze
    const provider = await selectProvider(inputType);
    const result = await provider.analyzeMenu(menuInput);

    // Return error responses with appropriate status codes
    if (isAnalysisError(result)) {
      const statusCode = result.error === 'network_error' ? 502 : 422;
      return NextResponse.json(result, { status: statusCode, headers: corsHeaders });
    }

    // Cache successful result
    const country = (result as MenuAnalysisResult).menu_meta?.country_detected;
    await setCache(cacheKey, result, country);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      {
        error: "network_error",
        reason: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
