# TransTaste 개발 로그
> 2026-04-02~03 세션 6

---

## 세션 요약

백엔드/프론트엔드/콘텐츠 아키텍처 리포트 3종(v3/v4/v5) 기반 3-Phase 일괄 개선.
Phase 1(버그 수정 5건), Phase 2(v1.5 핵심 개선 5건), Phase 3(v2 콘텐츠 강화 5건) 총 15개 태스크 중 실제 작업 11건, 이미 구현 확인 4건.

**변경**: 16 modified + 3 new files, ~2,500 insertions

---

## Phase 1 — 버그 수정

### 1. 히스토리 URL 고유화
- `src/app/history/page.tsx` — `/results?id=scan_xxx` 쿼리 파라미터로 라우팅
- `src/app/results/page.tsx` — `useSearchParams`로 URL에서 캐시 키 읽기, `Suspense` boundary 추가
- 히스토리에서 같은 결과를 재방문할 수 있도록 고유 URL 보장

### 2. 카메라 X 버튼
- **이미 구현 확인** — `CameraView.tsx` lines 33-44에 X(닫기) 버튼 존재

### 3. BottomNav z-index 충돌
- `src/app/results/page.tsx` — Dish list `pb-4` → `pb-40`으로 변경
- BottomNav(z-40) + sticky bottom bar에 마지막 dish들이 가려지는 문제 해결

### 4. Popular Dishes 클릭
- **코드 확인 결과 정상 작동** — onClick 핸들러가 sessionStorage 설정 후 `/loading-scan`으로 라우팅

### 5. 크레딧 차감 시점 변경
- `src/app/loading-scan/page.tsx` — API 호출 전 차감 → 성공 응답 확인 후에만 차감
- SSE `done` 이벤트 또는 JSON 200 응답 시점에 `credits.useCredit()` 호출
- `not_menu`, `ocr_failed`, 네트워크 에러 시 크레딧 미차감

---

## Phase 2 — v1.5 핵심 개선

### 6. 페이월 재구조화
- **이미 충족 확인** — 알러지/식이 정보는 Phase 1(무료) 구간(DishCard lines 222-308)에 표시 중

### 7. 발음 가이드 추가
- `src/lib/ai/claude.ts` — 두 프롬프트(SYSTEM_PROMPT, SYSTEM_PROMPT_LITE)에 `pronunciation` 필드 추가
- `src/lib/types.ts` — `Translation` 인터페이스에 `pronunciation?: string`
- `src/components/dish/DishRow.tsx` — 영어 번역 아래 이탤릭 로마자 발음 표시
- `src/components/dish/DishCard.tsx` — 스피커 아이콘 + 발음 가이드 표시
- `src/app/loading-scan/page.tsx` — 스트리밍 프리뷰에도 발음 표시
- API 비용 추가 없음 (기존 토큰 범위 내)

### 8. 알러지 4단계 행동 시스템
- **이미 구현 확인** — types.ts에 `AllergenRiskDetail(main/sub/possible)`, DishCard/DishRow에 4단계 UI 존재

### 9. SSE 스트리밍 렌더링 강화
- `src/app/loading-scan/page.tsx` — `Dish` → `DishLite` 타입 변경
- 스트리밍 프리뷰 카드에 발음, `price_display`, 알러지 리스크 배지 추가
- danger/warning/check 등급별 색상 배지

### 10. 회화 프리셋 8개 언어 확장
- `src/lib/phrases-data.ts` — 42개 phrase에 es(스페인어)/fr(프랑스어)/it(이탈리아어) 번역 추가
- `src/app/phrases/page.tsx` — LANGUAGES 배열에 3개 언어 추가
- `src/lib/i18n/en.json`, `ko.json` — `langEs`, `langFr`, `langIt` 레이블

---

## Phase 3 — v2 콘텐츠 강화

### 11. QR 코드 디코딩
- `jsqr@1.4.0` 설치 (~50KB)
- `src/hooks/useCamera.ts` — 500ms 주기로 카메라 프레임에서 QR 스캔
- `src/components/camera/CameraView.tsx` — `onQrDetected` 콜백 prop 추가, URL 유효성 검증
- `src/app/camera/page.tsx` — QR 감지 시 URL → `scanInputType: "url"`로 loading-scan 연결
- 별도 UI 없이 카메라 뷰에서 자동 감지

### 12. 다중 이미지 갤러리
- **이미 구현 확인** — camera/page.tsx에 MAX_IMAGES=10, `|||` 구분자, claude.ts 멀티이미지 분할 처리

### 13. 환율 토글
- `src/app/api/exchange-rate/route.ts` — 신규 API 라우트
  - open.er-api.com (무료) 또는 exchangerate-api.com (API 키 지원)
  - Redis 23시간 TTL 캐싱
  - `GET /api/exchange-rate?from=JPY&to=KRW` 형태
- `src/hooks/useExchangeRate.ts` — 클라이언트 훅
  - localStorage에서 `home_currency` 읽기
  - 통화 심볼 매핑 (26개 통화)
  - `convert(amount, fromCurrency)` 함수
- `src/app/results/page.tsx` — 환율 토글 버튼 UI (필터 위)
- `src/components/dish/DishRow.tsx` — `convertedPrice` prop으로 변환 가격 표시 (`≈ ₩17,500`)
- `src/lib/i18n/en.json`, `ko.json` — `showConverted`, `showOriginal` 키

### 14. Fun Fact 톤 리프레이밍
- `src/lib/ai/claude.ts` — 프롬프트 개선:
  - 성적 콘텐츠 키워드 금지 (sexual, erotic, seductive 추가)
  - 전쟁/기근 리프레이밍 규칙 추가
  - `fun_fact_detail` 접기 가이드 (호불호 음식은 Deep Dive로 분리)

### 15. 키오스크/손글씨 메뉴 인식
- `src/lib/ai/claude.ts` — "MENU FORMAT RECOGNITION" 섹션 신규:
  - 키오스크 UI 필터링 (버튼/네비 무시)
  - 손글씨/칠판 OCR 가이드 (컨텍스트 기반 추론)
  - 싯가(시가) 감지 → price: null, "Market Price" 표시
  - 호텔 룸서비스/기내식 인식

---

## Handoff — 미착수 항목

### Phase 4 (v3 장기)
| 항목 | 설명 | 난이도 |
|------|------|--------|
| 영수증 번역 파이프라인 | receipt 모드 분기, 0.5 크레딧 정책, 별도 프롬프트 | 중 |
| 원문-번역 비교 split-view | 스캔 이미지 + 번역 결과 좌우/상하 분할 | 중 |
| 칼로리 추정치 | AI 추정 + 면책 문구, DishCard에 표시 | 하 |

### 인프라/운영
| 항목 | 설명 |
|------|------|
| `home_currency` 온보딩 추가 | 환율 토글이 작동하려면 onboarding에서 홈 통화 설정 필요 |
| `EXCHANGE_RATE_API_KEY` 환경변수 | 무료 fallback은 있지만, 프로덕션에선 유료 키 권장 (1500 req/month 제한) |
| 서버 크레딧 검증 | 현재 클라이언트 localStorage — 스푸핑 가능. Supabase Auth + RLS 필요 |
| POC API 테스트 | test-menu.mjs, test-brand.mjs 실행하여 프롬프트 검증 |

### 콘텐츠
| 항목 | 설명 |
|------|------|
| 회화 expectedResponses es/fr/it | 42개 phrase 중 expectedResponses가 있는 항목에 es/fr/it 응답 추가 |
| 로컬 데이터 테이블 | 식이 문화(20개국), EU 14대 알러지 표준 |
| ASO 키워드 | "파파고 대안" 등 앱스토어 키워드 준비 |

---

## 기술 부채

- `Dish` vs `DishLite` 타입 이중 정의 — 통합 필요 (loading-scan에서 `DishLite`로 변경 완료)
- results/page.tsx `as unknown as DishLite` 캐스팅 다수 — MenuAnalysisResult의 dishes 타입을 DishLite로 통일하면 해소
- phrases-data.ts 1300줄+ — 언어별 JSON 분리 고려
