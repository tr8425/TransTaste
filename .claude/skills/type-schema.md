---
name: type-schema
description: TransTaste 타입 시스템. DishLite/DishDetail 2-Phase 구조, 에러 코드, 알레르겐/식이 타입. AI 프롬프트·UI 작업 시 참조.
---

# Skill: Type Schema

## 사용하는 에이전트
- dev-maintainer — 타입 변경 시 영향 범위 파악
- prompt-engineer — AI 응답 JSON 스키마와 타입 정합성 확인

## 타입 3계층

```
DishLite (Phase 1, 스트리밍)
  → 빠른 응답, 목록 표시용
  → results 페이지에서 사용

DishDetail (Phase 2, 온디맨드)
  → 상세 정보, paywall 뒤
  → DishCard 확장 시 사용

MenuAnalysisResult (API 응답 래퍼)
  → menu_meta + dishes[] + recommended_combo
```

## 핵심 타입 요약

### DishLite (Phase 1)
| 필드 | 타입 | 용도 |
|------|------|------|
| original | string | 원본 메뉴명 |
| price, currency, price_display | string/number | 가격 |
| language_detected | string | 감지 언어 |
| translation | { literal, meaning, english, pronunciation } | 번역 |
| confidence | number | 인식 신뢰도 |
| category | string | main/soup/noodle/rice/side/drink/dessert |
| dietary | DietaryLabel[] | vegan/vegetarian/halal/gluten-free |
| allergens | AllergenType[] | 7종 |
| allergen_risk | 'high' \| 'medium' \| 'low' \| 'none' | 위험도 |
| estimated_calories | number | 추정 칼로리 |
| price_tier | string | 가격대 |
| image_search_query | string | 이미지 검색 쿼리 |

### DishDetail (Phase 2)
| 필드 | 타입 | 용도 |
|------|------|------|
| flavor_profile | FlavorProfile | 6축 레이더 차트 |
| ingredients | string[] | 재료 목록 |
| fun_fact, fun_fact_detail | string | 재미 사실 |
| how_to_eat | string | 먹는 방법 |
| warning, disclosure | string | 주의사항 |
| has_brand_name, brand_part, brand_note, food_part | string/boolean | 브랜드명 처리 |
| has_customization, options[] | boolean/array | 커스터마이징 |
| allergen_summary | string | 알레르겐 요약 |

### FlavorProfile (6축)
sweet, salty, spicy, sour, umami, rich — 각 0~5

### AllergenType (7종)
shellfish, pork, gluten, dairy, nuts, egg, soy

### DietaryLabel (4종)
vegan, vegetarian, halal, gluten-free

### ErrorCode (14종)
클라이언트: E_NO_CREDITS, E_INVALID_INPUT, E_RATE_LIMITED, E_NETWORK
API: E_NOT_MENU, E_OCR_FAIL, E_LANGUAGE_UNSUPPORTED, E_EMPTY_RESULT, E_PARTIAL_RESULT
AI: E_AI_OVERLOADED, E_AI_TIMEOUT, E_AI_INVALID_RESPONSE, E_AI_REFUSED
기타: E_UNKNOWN

## 관련 파일
| 파일 | 용도 |
|------|------|
| `src/lib/types.ts` | 전체 타입 정의 |
| `src/lib/constants.ts` | 상수, 색상, 가격, 카테고리 |
| `src/lib/ai/claude.ts` | AI 프롬프트 + JSON 스키마 |
| `src/lib/ai/stream-parser.ts` | SSE 스트리밍 파서 |
