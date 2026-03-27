# TransTaste 개발 로그
> 2026-03-28 세션 1

---

## 세션 요약

실 API 호출 테스트 중 발견된 버그 수정 + 응답 속도/품질 최적화.
스트리밍, 스키마 2단계 분리, Fun Fact 조건부 생성, 가격 통화 표기 구현.

**변경**: 12 files changed, 3 new files, ~1,380 insertions

---

## 1. 버그 수정 — 다중 이미지 base64 처리

**문제**: 프론트에서 여러 이미지를 `|||` 구분자로 join하여 전송하는데, 백엔드가 통째로 하나의 base64로 Claude API에 전달 → `invalid base64 data` 에러

**수정**: `buildUserMessage()`에서 `|||`로 split → 각각 별도의 `ImageBlockParam`으로 변환. 다중 이미지일 때 "하나의 메뉴로 통합 분석" 지시 추가.

| 파일 | 변경 |
|---|---|
| `src/lib/ai/claude.ts` | `buildUserMessage()` 다중 이미지 처리 |

---

## 2. 스트리밍 구현 (SSE)

**문제**: 16개 메뉴 분석에 ~2분 소요, 사용자는 빈 로딩 화면만 보는 상태

**구현**:
- `createMenuAnalysisStream()` — `client.messages.stream()` + SSE 이벤트 방출
- `IncrementalDishParser` — 스트리밍 JSON에서 dish 객체를 점진적 추출 (brace-balanced, string-aware)
- `loading-scan` 페이지에서 SSE 소비 → dish 카드 실시간 표시

| 이벤트 | 데이터 | 용도 |
|---|---|---|
| `meta` | `menu_meta` 객체 | 레스토랑 타입, 언어 표시 |
| `dish` | 개별 dish 객체 | 카드 슬라이드인 애니메이션 |
| `done` | 전체 결과 | sessionStorage 저장 → /results 이동 |
| `error` | 에러 객체 | 에러 화면 이동 |

**React Strict Mode 이슈**: dev 모드에서 `useEffect` 이중 실행으로 fetch가 abort됨 → `startedRef`로 중복 실행 차단, cleanup에서 abort 제거

| 파일 | 변경 |
|---|---|
| `src/lib/ai/stream-parser.ts` | **NEW** — IncrementalDishParser 클래스 |
| `src/lib/ai/claude.ts` | `createMenuAnalysisStream()` 추가 |
| `src/app/api/analyze/route.ts` | `stream: true` 요청 시 SSE 반환 |
| `src/app/loading-scan/page.tsx` | SSE 소비 + 실시간 dish 카드 + 3분 타임아웃 |

---

## 3. 스키마 2단계 분리

**Before**: 모든 dish에 전체 스키마(~30필드) 강제 생성 → 출력 토큰 과다, 느림
**After**: Phase 1(리스트용 10필드) + Phase 2(상세 lazy-load)

### Phase 1 — `SYSTEM_PROMPT_LITE` (스트리밍)
`original`, `price`, `currency`, `price_display`, `translation`, `category`, `dietary`, `allergens`, `allergen_risk`, `price_tier`, `image_search_query`, `recommended_combo`

### Phase 2 — `SYSTEM_PROMPT_DETAIL` (dish 탭 시)
`flavor_profile`, `ingredients.core`, `fun_fact`, `fun_fact_detail`, `how_to_eat`, `warning`, `disclosure`, `options`, `allergen_summary`

### 새 타입
```typescript
DishLite     // Phase 1 리스트용
DishDetail   // Phase 2 상세용
MenuAnalysisResultLite  // Phase 1 응답 전체
```

### 새 API
- `POST /api/analyze/detail` — 단일 dish 상세 분석 (non-streaming, max_tokens: 4096)

### 새 Hook
- `useDishDetail(dish, menuInput)` — Phase 2 on-demand fetch + in-memory 캐시

| 파일 | 변경 |
|---|---|
| `src/lib/types.ts` | `DishLite`, `DishDetail`, `MenuAnalysisResultLite` 추가 |
| `src/lib/ai/claude.ts` | `SYSTEM_PROMPT_LITE`, `SYSTEM_PROMPT_DETAIL`, `fetchDishDetail()` |
| `src/app/api/analyze/detail/route.ts` | **NEW** — Phase 2 API 엔드포인트 |
| `src/hooks/useDishDetail.ts` | **NEW** — Phase 2 fetch hook |
| `src/components/dish/DishRow.tsx` | `Dish` → `DishLite`, `dish.allergens` 직접 참조 |
| `src/components/dish/DishCard.tsx` | `DishLite` + `DishDetail` 분리 props, 스켈레톤 로딩, 에러/재시도 |
| `src/app/results/page.tsx` | `useDishDetail` hook 연동, `menuInputForDetail` sessionStorage 보존 |

### 예상 효과
| 항목 | Before | After |
|---|---|---|
| Phase 1 출력 토큰 | ~8,000 | ~3,000 (~60% 감소) |
| Phase 2 | 전부 강제 생성 | 탭한 2-3개만 |
| `max_tokens` | 16,384 | 8,192 (P1) + 4,096 (P2) |

---

## 4. Fun Fact 조건부 생성

**문제**: 공기밥 "쌀은 세계에서 가장 많이 소비되는 곡물" 같은 억지 Fun Fact

**수정**: 프롬프트에 생성 조건/null 조건 명시
- 생성: 이름 유래 반전, 문화적 맥락, 잘 알려지지 않은 역사
- null: 보편적 아이템, 뻔한 사실, 억지 느낌

**결과** (16개 메뉴 테스트): 8개 null, 8개 생성 — Kriek Boon(야생발효), Bangers(어원), Gravlax(노르딕 보존법) 등 의미 있는 것만 남음

| 파일 | 변경 |
|---|---|
| `src/lib/ai/claude.ts` | Fun Fact 규칙 전면 교체 |
| `src/lib/types.ts` | `fun_fact: string` → `string \| null` |
| `src/components/common/FunFactCard.tsx` | `fact` null 시 `return null` |
| `src/components/dish/DishCard.tsx` | fun_fact/warning 없으면 섹션 숨김 |

---

## 5. 가격 통화 표기

**문제**: `"price": "17.0"` → $17인지 ₩17,000인지 불명확

**수정**: 프롬프트에 통화 규칙 추가 + 타입에 `currency`, `price_display` 필드 추가

```
Before: 17.0
After:  ₩17,000 (currency: "KRW", price_display: "₩17,000")
```

국가별 포맷: ₩+콤마(한국), ¥(일본), $(미국), ฿(태국), €(유럽)

| 파일 | 변경 |
|---|---|
| `src/lib/types.ts` | `DishLite` + `Dish`에 `currency`, `price_display` 추가 |
| `src/lib/ai/claude.ts` | 3개 프롬프트 모두 가격 규칙 추가 |
| `src/lib/mock-data.ts` | mock 데이터 통화 형식 업데이트 |
| `src/components/dish/DishRow.tsx` | `price_display` 우선 표시 |
| `src/components/dish/DishCard.tsx` | `price_display` 우선 표시 |

---

## 6. 기타 개선

| 항목 | 변경 |
|---|---|
| 이미지 해상도 | 1024px → 768px (`useCamera.ts`) — 입력 토큰 ~30% 감소 |
| 타임아웃 | 3분 (loading-scan) — 프로그레스 바 180초 애니메이션 |
| Fun Fact 순환 | loading 화면에서 8초마다 다른 Fun Fact 표시 |
| `recommended_combo` 파서 버그 | `dishesArrayDone` 플래그로 배열 종료 후 스캔 중지 |
| `undefined` → `null` | Claude가 JSON에 JS `undefined` 리터럴 출력 → 파싱 전 치환 |

---

## 신규 파일 목록

```
src/lib/ai/stream-parser.ts        — IncrementalDishParser
src/app/api/analyze/detail/route.ts — Phase 2 detail API
src/hooks/useDishDetail.ts          — Phase 2 fetch hook
```

---

## 알려진 이슈 / TODO

1. **Phase 1 속도 측정 필요** — SYSTEM_PROMPT_LITE 적용 후 실제 응답 시간 비교 (예상: ~50-70초)
2. **sessionStorage 크기** — 다중 이미지 base64가 5-10MB 제한에 걸릴 수 있음 → 서버사이드 저장 검토
3. **Mock 데이터 호환** — Mock Dish에 `allergens`/`allergen_risk` 없어서 optional chaining 필요
4. **Detail 스켈레톤 UX** — 실제 기기에서 스켈레톤 → 상세 전환 자연스러운지 확인 필요
5. **OCR 전처리 분리** — 이미지 → OCR → 텍스트 → Haiku (비용 절감, 안정화 후 검토)
