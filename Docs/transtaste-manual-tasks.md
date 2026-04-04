# TransTaste — 사람이 직접 해야 하는 작업 목록
> 최초 작성: 2026-03-27 | 최종 수정: 2026-04-03
> QA v2·v3 결과 및 기능 명세 v2 기준으로 상태 갱신

---

## 범례

| 표시 | 의미 |
|---|---|
| ✅ | 완료 확인 (QA 또는 배포 환경에서 동작 확인) |
| ⏳ | 진행 중 / 부분 완료 |
| ❌ | 미완료 — 출시 전 필수 |
| 🔴 | P0 출시 블로커 |
| 🟠 | P1 출시 전 필수 |
| 🟡 | P2 다음 스프린트 |

---

## Phase 0: POC 검증

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 0-1 | ✅ | Anthropic API 키 발급 | https://console.anthropic.com → API Keys |
| 0-2 | ✅ | `.env.local` 파일 생성 | `ANTHROPIC_API_KEY=sk-ant-...` 추가 |
| 0-3 | ✅ | POC 테스트 실행 | QA v2에서 실제 API 응답 동작 확인됨 |

---

## Phase 1: 앱 핵심 플로우 (추가)

> 기존 문서에 없던 Phase. QA v2·v3 결과에서 파악된 구현 상태 정리.

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 1-1 | ✅ | 카메라 스캔 → 결과 플로우 | QA v2 회귀 테스트 통과 |
| 1-2 | ✅ | 스트리밍 렌더링 | QA v3 A-2 확인 (~38초 → 캐시 5초) |
| 1-3 | ✅ | Redis 캐싱 | QA v3 E-1 통과. 1차→2차 스캔 응답 단축 확인 |
| 1-4 | ✅ | 발음 가이드 | QA v3 A-1 통과. `translation.pronunciation` 경로 동작 |
| 1-5 | ✅ | 알러지 4단계 감지 | QA API 연동 후 확인 |
| 1-6 | ✅ | 식이 신념 감지 | halal·vegan·vegetarian·gluten_free 동작 확인 |
| 1-7 | ✅ | 페이월 모달 | QA API 연동 후 확인 |
| 1-8 | 🔴 ❌ | **output_language 프롬프트 전달** | QA v3 G: ko 설정에도 fun_fact·재료·how_to_eat 영어 고정. 프롬프트 최상단에 언어 지시 추가 필요 |
| 1-9 | 🔴 ❌ | **스캔/히스토리 단위 정규화** | QA v3 H: 요리 단위 나열. resultKey 기준 그룹핑 필요 |
| 1-10 | 🟠 ❌ | **크레딧 Infinity 버그 수정** | QA v3 NEW-1: API 키 입력 시 "undefined회" 표시 |
| 1-11 | 🟠 ❌ | **에러 메시지 한국어 통일** | QA v3 F-2: 영어 하드코딩 잔존 |
| 1-12 | 🟡 ❌ | URL 유효성 검사 | QA v3 NEW-2: 잘못된 URL에도 버튼 활성화 |
| 1-13 | 🟡 ❌ | 모달 모바일 잘림 수정 | QA v3 NEW-3: 390×732 뷰포트에서 버튼 가려짐 |
| 1-14 | 🟡 ❌ | 영어 메뉴 발음 처리 | QA v3 A-1: 영어 메뉴에 한국어 음성전사 표기 |

---

## Phase 2: Supabase

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 2-1 | ✅ | Supabase 프로젝트 생성 | https://supabase.com → New Project |
| 2-2 | ✅ | 환경변수 추가 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 2-3 | ⏳ | DB 스키마 실행 | `supabase/schema.sql` 실행. user_settings 테이블 확인 필요 (localStorage는 동작하나 서버 저장 미확인) |
| 2-4 | 🔴 ❌ | **Auth 프로바이더 설정 + UI 연결** | Dashboard → Auth → Email 활성화. QA v3: /login·/signup 404, 버튼 onClick 없음. Supabase Auth UI 컴포넌트 연결 필요 |
| 2-5 | 🔴 ❌ | **로그아웃 기능 구현** | QA v3 C-3: 로그아웃 버튼 없음 |
| 2-6 | 🔴 ❌ | **크레딧 서버 검증** | QA v3 B-1: API 키 우회 시 차감 미동작. 서버 API Route에서 차감 처리 필요 (출시 블로커) |

---

## Phase 3: 캐싱

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 3-1 | ✅ | Upstash Redis 계정 생성 | https://upstash.com |
| 3-2 | ✅ | 환경변수 추가 | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| 3-3 | ✅ | 캐싱 동작 확인 | QA v3 E-1: 동일 텍스트 재스캔 5초 이하 확인 |
| 3-4 | ⏳ | 환율 API 캐싱 | Exchangerate API 무료 티어 연동 + 일 1회 TTL 캐싱. v2+ 기능 |

---

## Phase 4: 결제 (Stripe)

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 4-1 | ✅ | Stripe 계정 생성 | https://stripe.com |
| 4-2 | 🟠 ❌ | **상품 4개 생성** | 기존 3개 → 4개로 변경. 아래 목록 참고 |
| 4-3 | ✅ | 환경변수 추가 | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| 4-4 | 🟠 ❌ | **Webhook 엔드포인트 등록** | `https://transtaste.app/api/stripe/webhook` |
| 4-5 | 🟠 ❌ | **Stripe Checkout 실연동** | QA v3 B-3: 페이월 탭 시 /profile로 이동. Checkout 연결 필요 |

**Stripe 상품 목록 (기능 명세 v2 기준 — 기존 3개에서 4개로 변경):**

| 상품명 | 가격 | stripe_price_id | 변경 사항 |
|---|---|---|---|
| 7일 Trip Pass | $2.99 | price_pass_7d | 기존 유지 |
| 30일 Trip Pass | $5.99 | price_pass_30d | 기존 유지 |
| Credits 50회 | $1.99 | price_credits_50 | 기존 유지 |
| Credits 150회 | $3.99 | price_credits_150 | **신규 추가** — 기존 문서 누락 항목 |

---

## Phase 5: 배포

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 5-1 | ✅ | Vercel 프로젝트 연결 | transtaste.vercel.app에서 QA 진행 완료 |
| 5-2 | ✅ | 환경변수 복사 | Vercel env로 API 키 관리 중 (프로필 노출 이슈 해결 예정) |
| 5-3 | ⏳ | 도메인 구매 | namecheap에서 transtaste.app 구매 (미결 사항으로 남아있음) |
| 5-4 | ⏳ | 도메인 연결 | Vercel Dashboard → Domains → transtaste.app 추가 |
| 5-5 | 🟡 ❌ | PWA 아이콘 제작 | 192×192, 512×512 PNG 제작 → public/ 교체 |
| 5-6 | 🟠 ❌ | **og:image 제작 및 등록** | QA v2 1-6: og:image 없음. SNS 공유 시 썸네일 없음 |
| 5-7 | 🟡 ❌ | 페이지별 title 분리 | QA v2: 모든 페이지 동일 title. 홈/결과/프로필 각각 설정 필요 |
| 5-8 | 🟡 ❌ | html lang 속성 수정 | QA v3 발견 4: `<html lang="en">` → `lang="ko"` (또는 동적 적용) |

---

## Phase 6: 로컬 데이터 제작

| # | 상태 | 작업 | 방법 / 비고 |
|---|---|---|---|
| 6-1 | ⏳ | 대화 프리셋 번역 데이터 | 여행 회화책 기반 6카테고리 × 6개국어 수작업. v1.5 필요 |
| 6-2 | ⏳ | 팁/문화 데이터 20개국 | 리서치 후 JSON 작성. v1.5 필요 |
| 6-3 | ⏳ | 발효/특이식품 주의 목록 | 큐레이션 후 JSON 작성 |
| 6-4 | ⏳ | 매운맛 국가별 스케일 | 리서치 후 JSON 작성 |
| 6-5 | 🔴 ❌ | **알러지 배너 현지어 JSON** | Equal Eats형 알러지 카드용. EU 14대 알러지 × 8개 언어. `/data/allergy-phrases.json` |
| 6-6 | 🟡 ❌ | 레이더 차트 라벨 i18n | QA v3 G: "Umami"·"Rich"·"Salty" 영어 고정. 프론트 i18n으로 처리 (Umami→감칠맛 등) |

---

## Phase 7: QA 미결 항목 (신규)

> QA 진행 중 발견됐으나 아직 미해결인 항목.

| # | 우선순위 | 작업 | 비고 |
|---|---|---|---|
| 7-1 | 🔴 | **홈 Recent Scans URL 고유화** | QA v2 1-1: 모든 칩이 /results로만 이동. id 파라미터 없음 |
| 7-2 | 🔴 | **Popular Dishes 클릭 처리** | QA v2 1-3: 클릭 시 페이지 상단 스크롤만. hover 없음. 비활성화 처리 또는 기능 연결 |
| 7-3 | 🟠 | **카메라 X 버튼 경로 수정** | QA v2 1-2: X 탭 시 /results로 이동. 홈(/)으로 수정 |
| 7-4 | 🟠 | **히스토리 삭제 기능** | QA v2 6-3: 개별·전체 삭제 없음 |
| 7-5 | 🟠 | **프로필 누락 항목** | QA v2 5-1: 로그아웃·결제내역·FAQ 없음 |
| 7-6 | 🟠 | **BottomNav 카메라 탭 aria-label** | QA v2 9-1: 스크린리더 접근성 |
| 7-7 | 🟡 | **온보딩 브라우저 언어 감지** | QA v3 발견 5: 한국어 브라우저에도 English 기본 선택 |
| 7-8 | 🟡 | **H1 헤딩 구조 수정** | QA v2 9-2: 로고가 H1. 슬로건을 H1으로 |
| 7-9 | 🟡 | **카테고리 탭 sticky 처리** | 피드백 문서: 스크롤 시 탭 사라짐 |
| 7-10 | 🟡 | **카메라 스캔 피드백 UX** | 피드백 문서: 스캔 중 시각적 피드백 없음 |
| 7-11 | ⏳ | **F-1 low_confidence 에러** | QA v3 미테스트 (API 키 오류). 다음 세션에서 재테스트 필요 |

---

## 환경변수 최종 목록 (.env.local)

```bash
# Phase 0 — AI
ANTHROPIC_API_KEY=sk-ant-...

# Phase 2 — Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Phase 3 — Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Phase 4 — Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Phase 5 — Image Search
GOOGLE_CUSTOM_SEARCH_API_KEY=AIza...
GOOGLE_CUSTOM_SEARCH_CX=xxx:yyy

# Phase 5 — 환율 (v2+ — Exchangerate API)
EXCHANGE_RATE_API_KEY=...
```

> ⚠️ 기존 문서에서 Image Search 주석이 "Phase 3"으로 잘못 표기되어 있었음. Phase 5로 수정.

---

## 출시 전 필수 체크리스트 (P0 + P1 요약)

```
🔴 P0 — 이것 없이는 출시 불가
  □ output_language 프롬프트 전달 수정 (1-8) — 다국어 전면 미동작
  □ 스캔/히스토리 단위 정규화 (1-9) — 요리 단위로 나열
  □ Supabase Auth UI 연결 (2-4) — /login·/signup 404
  □ 로그아웃 기능 구현 (2-5)
  □ 크레딧 서버 검증 (2-6) — API 키 우회 시 차감 미동작
  □ 홈 Recent Scans URL 고유화 (7-1)
  □ 알러지 배너 현지어 JSON 제작 (6-5)

🟠 P1 — 출시 전 반드시
  □ 크레딧 Infinity 버그 수정 (1-10) — "undefined회" 표시
  □ 에러 메시지 한국어 통일 (1-11)
  □ Stripe 상품 4개 생성 — Credits 150회 추가 (4-2)
  □ Stripe Checkout 실연동 (4-5)
  □ Webhook 엔드포인트 등록 (4-4)
  □ og:image 제작 및 등록 (5-6)
  □ 카메라 X 버튼 경로 수정 (7-3)
  □ 히스토리 삭제 기능 (7-4)
  □ 프로필 누락 항목 추가 (7-5)
```
