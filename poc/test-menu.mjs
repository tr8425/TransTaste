/**
 * Transtaste - Claude Vision API POC
 * 
 * 테스트 목표:
 *   1. 다국어 메뉴판 OCR 인식 품질
 *   2. 음식 정보 분석 품질 (번역, 재료, 맛, Fun Fact 등)
 *   3. 응답 구조화 신뢰도
 * 
 * 사용법:
 *   ANTHROPIC_API_KEY=sk-... node test-menu.mjs [image_path_or_url]
 * 
 * 이미지 없이 실행 시: 텍스트 기반 테스트 (메뉴명 직접 입력)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// 핵심 프롬프트 (이게 제품 품질의 전부)
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a world-class food expert and culinary translator specializing in helping travelers understand foreign menus.

Your job is to analyze menu items and return structured JSON with rich, accurate, and engaging food information.

CRITICAL RULES:
- Always return valid JSON only. No markdown, no explanation outside JSON.
- If you cannot identify a dish with confidence, set "confidence": "low" and still provide best-effort info.
- For allergens, only include what is commonly present — do not guess excessively.
- fun_fact should be genuinely interesting: name origin, cultural story, or surprising fact. Never generic.
- how_to_eat should be practical advice a first-timer needs. Skip if dish is universally known (e.g., pizza).
- flavor_profile scores are 0-5 integers.`;

const MENU_ANALYSIS_PROMPT = (menuText) => `
Analyze the following menu items and return a JSON array.

Menu items:
${menuText}

Return this exact JSON structure (array of dish objects):
[
  {
    "original": "original dish name as written",
    "language_detected": "ko/zh/ja/th/vi/fr/es/etc",
    "translation": {
      "literal": "word-for-word translation",
      "meaning": "what it actually is (colloquial/descriptive name)",
      "english": "best English equivalent name"
    },
    "confidence": "high/medium/low",
    "category": "appetizer/main/soup/noodle/rice/dessert/drink/etc",
    "flavor_profile": {
      "sweet": 0,
      "salty": 0,
      "spicy": 0,
      "sour": 0,
      "umami": 0,
      "rich": 0
    },
    "ingredients": {
      "core": ["main ingredient 1", "main ingredient 2"],
      "common_additions": ["optional topping or side"],
      "allergens": ["shellfish/pork/gluten/dairy/nuts/egg/soy"]
    },
    "dietary": {
      "halal": true,
      "vegan": false,
      "vegetarian": false,
      "gluten_free": false
    },
    "price_tier": "budget/mid/premium",
    "fun_fact": "One genuinely interesting cultural or historical fact about this dish",
    "how_to_eat": "Practical first-timer advice (null if obvious)",
    "image_search_query": "best English search query to find a photo of this dish"
  }
]`;

const IMAGE_MENU_PROMPT = `
This is a restaurant menu photo. Please:
1. Extract ALL menu items you can see (name + price if visible)
2. Analyze each dish using your culinary knowledge
3. Return a JSON object with this structure:

{
  "menu_language": "detected primary language",
  "restaurant_type": "cuisine type guess (e.g. Korean BBQ, Japanese Ramen, etc.)",
  "items_found": 0,
  "dishes": [
    {
      "original": "dish name as written on menu",
      "price": "price as shown or null",
      "language_detected": "ko/zh/ja/th/etc",
      "translation": {
        "literal": "word-for-word",
        "meaning": "what it actually is",
        "english": "English name"
      },
      "confidence": "high/medium/low",
      "category": "appetizer/main/soup/noodle/rice/dessert/drink/side/etc",
      "flavor_profile": {
        "sweet": 0, "salty": 0, "spicy": 0,
        "sour": 0, "umami": 0, "rich": 0
      },
      "ingredients": {
        "core": [],
        "allergens": []
      },
      "dietary": {
        "halal": null,
        "vegan": false,
        "vegetarian": false
      },
      "fun_fact": "interesting cultural/historical fact",
      "how_to_eat": "practical advice for first-timers or null",
      "image_search_query": "English search query for food photo"
    }
  ],
  "recommended_combo": {
    "budget": { "items": [], "reason": "" },
    "balanced": { "items": [], "reason": "" }
  }
}

Return ONLY valid JSON.`;

// ─────────────────────────────────────────────
// 테스트 케이스 (텍스트 기반)
// ─────────────────────────────────────────────

const TEST_MENUS = {
  korean: `불도장 38,000원
삼겹살 15,000원
된장찌개 9,000원
비빔냉면 12,000원
막걸리 4,000원`,

  japanese: `天ぷら盛り合わせ 2,800円
とんこつラーメン 1,200円
おでん 800円
抹茶パフェ 980円`,

  chinese: `佛跳墙 388元
夫妻肺片 68元
麻婆豆腐 38元
担担面 32元`,

  thai: `ผัดไทย 120฿
ต้มยำกุ้ง 180฿
ข้าวมันไก่ 80฿
มะม่วงข้าวเหนียว 60฿`,

  mixed: `Pho Bo 85,000đ
불고기 버거 12,900원
Pad Kra Pao 150฿
Laksa 8.50 SGD`
};

// ─────────────────────────────────────────────
// 실행 로직
// ─────────────────────────────────────────────

async function testTextMenu(label, menuText) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📋 테스트: ${label}`);
  console.log("=".repeat(60));
  console.log("입력:\n" + menuText);
  console.log("\n⏳ 분석 중...\n");

  const start = Date.now();

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: MENU_ANALYSIS_PROMPT(menuText),
      },
    ],
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const raw = response.content[0].text;

  // 토큰 비용 계산
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const cost = (inputTokens * 3 + outputTokens * 15) / 1_000_000;

  try {
    const parsed = JSON.parse(raw);
    console.log("✅ JSON 파싱 성공");
    console.log(`⏱  응답 시간: ${elapsed}s`);
    console.log(`🪙 토큰: input=${inputTokens}, output=${outputTokens}, 비용=$${cost.toFixed(5)}`);
    console.log(`📦 음식 ${parsed.length}개 분석:\n`);

    parsed.forEach((dish, i) => {
      console.log(`[${i + 1}] ${dish.original}`);
      console.log(`    번역: ${dish.translation.literal} → "${dish.translation.meaning}"`);
      console.log(`    영어: ${dish.translation.english}`);
      console.log(`    신뢰도: ${dish.confidence} | 카테고리: ${dish.category}`);
      console.log(`    맛: 단${dish.flavor_profile.sweet} 짠${dish.flavor_profile.salty} 매${dish.flavor_profile.spicy} 신${dish.flavor_profile.sour} 감${dish.flavor_profile.umami}`);
      console.log(`    핵심재료: ${dish.ingredients.core.join(", ")}`);
      console.log(`    알러지: ${dish.ingredients.allergens.join(", ") || "없음"}`);
      console.log(`    할랄:${dish.dietary.halal} 비건:${dish.dietary.vegan}`);
      if (dish.fun_fact) console.log(`    💡 ${dish.fun_fact}`);
      if (dish.how_to_eat) console.log(`    🍴 ${dish.how_to_eat}`);
      console.log();
    });

    return { success: true, elapsed, cost, count: parsed.length };
  } catch (e) {
    console.log("❌ JSON 파싱 실패");
    console.log("Raw 응답:\n", raw.slice(0, 500));
    return { success: false, elapsed, cost };
  }
}

async function testImageMenu(imagePath) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📸 이미지 테스트: ${imagePath}`);
  console.log("=".repeat(60));

  let imageContent;

  if (imagePath.startsWith("http")) {
    // URL 이미지
    imageContent = {
      type: "image",
      source: { type: "url", url: imagePath },
    };
  } else {
    // 로컬 파일
    const imageData = fs.readFileSync(imagePath);
    const base64 = imageData.toString("base64");
    const ext = path.extname(imagePath).toLowerCase().slice(1);
    const mediaType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    imageContent = {
      type: "image",
      source: { type: "base64", media_type: mediaType, data: base64 },
    };
  }

  const start = Date.now();

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          imageContent,
          { type: "text", text: IMAGE_MENU_PROMPT },
        ],
      },
    ],
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const raw = response.content[0].text;
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const cost = (inputTokens * 3 + outputTokens * 15) / 1_000_000;

  console.log(`⏱  응답 시간: ${elapsed}s`);
  console.log(`🪙 토큰: input=${inputTokens}, output=${outputTokens}, 비용=$${cost.toFixed(5)}\n`);

  // JSON 추출 (마크다운 코드블록 제거)
  const jsonMatch = raw.match(/```json\n?([\s\S]*?)\n?```/) || raw.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : raw;

  try {
    const parsed = JSON.parse(jsonStr.trim());
    console.log(`✅ 파싱 성공`);
    console.log(`🍽  레스토랑 타입: ${parsed.restaurant_type}`);
    console.log(`🌐 메뉴 언어: ${parsed.menu_language}`);
    console.log(`📦 인식된 메뉴 수: ${parsed.items_found}개\n`);

    parsed.dishes?.forEach((dish, i) => {
      console.log(`[${i + 1}] ${dish.original} ${dish.price ? `(${dish.price})` : ""}`);
      console.log(`    → ${dish.translation.english} (${dish.translation.meaning})`);
      console.log(`    신뢰도: ${dish.confidence}`);
      if (dish.fun_fact) console.log(`    💡 ${dish.fun_fact}`);
      console.log();
    });

    if (parsed.recommended_combo) {
      console.log("🎯 추천 조합:");
      console.log(`  가성비: ${parsed.recommended_combo.budget?.items?.join(" + ")} — ${parsed.recommended_combo.budget?.reason}`);
      console.log(`  균형: ${parsed.recommended_combo.balanced?.items?.join(" + ")} — ${parsed.recommended_combo.balanced?.reason}`);
    }

    return { success: true, elapsed, cost, data: parsed };
  } catch (e) {
    console.log("❌ JSON 파싱 실패. Raw 출력:");
    console.log(raw.slice(0, 800));
    return { success: false, raw };
  }
}

async function runAllTests() {
  const results = [];
  const arg = process.argv[2];

  if (arg) {
    // 이미지 경로/URL이 주어진 경우
    const result = await testImageMenu(arg);
    results.push({ label: "image", ...result });
  } else {
    // 텍스트 테스트 전체 실행
    for (const [label, menu] of Object.entries(TEST_MENUS)) {
      const result = await testTextMenu(label, menu);
      results.push({ label, ...result });

      // API 레이트 리밋 방지
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // 최종 요약
  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 테스트 결과 요약");
  console.log("=".repeat(60));

  let totalCost = 0;
  results.forEach((r) => {
    const status = r.success ? "✅" : "❌";
    console.log(`${status} ${r.label.padEnd(12)} | ${r.elapsed}s | $${r.cost?.toFixed(5) || "N/A"}`);
    if (r.cost) totalCost += r.cost;
  });

  console.log(`\n💰 총 테스트 비용: $${totalCost.toFixed(5)}`);
  console.log(`📌 메뉴판 1회 분석 예상 비용: $${(totalCost / results.filter(r=>r.success).length).toFixed(5)}`);
}

runAllTests().catch(console.error);
