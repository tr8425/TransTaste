# TransTaste — 사람이 직접 해야 하는 작업 목록
> 작성일: 2026-03-27

---

## Phase 0: POC 검증

| # | 작업 | 방법 |
|---|---|---|
| 0-1 | Anthropic API 키 발급 | https://console.anthropic.com → API Keys |
| 0-2 | `.env.local` 파일 생성 | 프로젝트 루트에 `ANTHROPIC_API_KEY=sk-ant-your-key-here` 추가 |
| 0-3 | POC 테스트 실행 | `cd poc && ANTHROPIC_API_KEY=sk-ant-your-key-here node test-menu.mjs` |

---

## Phase 2: Supabase

| # | 작업 | 방법 |
|---|---|---|
| 2-1 | Supabase 프로젝트 생성 | https://supabase.com → New Project |
| 2-2 | 환경변수 추가 | `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가 |
| 2-3 | DB 스키마 실행 | Supabase Dashboard SQL Editor에서 `supabase/schema.sql` 실행 |
| 2-4 | Auth 프로바이더 설정 | Dashboard → Auth → Providers → Google/Email 활성화 |

---

## Phase 3: 캐싱

| # | 작업 | 방법 |
|---|---|---|
| 3-1 | Upstash Redis 계정 생성 | https://upstash.com → Create Database |
| 3-2 | 환경변수 추가 | `.env.local`에 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 추가 |

---

## Phase 4: 결제 (Stripe)

| # | 작업 | 방법 |
|---|---|---|
| 4-1 | Stripe 계정 생성 | https://stripe.com |
| 4-2 | 상품 3개 생성 | Dashboard → Products → 7일 패스($2.99), 30일 패스($5.99), 50크레딧($1.99) |
| 4-3 | 환경변수 추가 | `.env.local`에 `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` 추가 |
| 4-4 | Webhook 엔드포인트 등록 | Dashboard → Webhooks → `https://transtaste.app/api/stripe/webhook` |

---

## Phase 5: 배포

| # | 작업 | 방법 |
|---|---|---|
| 5-1 | Vercel 프로젝트 연결 | https://vercel.com → Import Git Repository |
| 5-2 | 환경변수 복사 | Vercel Dashboard → Settings → Environment Variables에 .env.local 내용 전부 추가 |
| 5-3 | 도메인 구매 | namecheap에서 transtaste.app 구매 |
| 5-4 | 도메인 연결 | Vercel Dashboard → Domains → transtaste.app 추가 |
| 5-5 | PWA 아이콘 제작 | 192x192, 512x512 PNG 제작 → public/ 교체 |

---

## Phase 6: 로컬 데이터 제작

| # | 작업 | 방법 |
|---|---|---|
| 6-1 | 대화 프리셋 번역 데이터 | 여행 회화책 기반 6카테고리 × 6개국어 수작업 |
| 6-2 | 팁/문화 데이터 20개국 | 리서치 후 JSON 작성 |
| 6-3 | 발효/특이식품 주의 목록 | 큐레이션 후 JSON 작성 |
| 6-4 | 매운맛 국가별 스케일 | 리서치 후 JSON 작성 |

---

## 환경변수 최종 목록 (.env.local)

```bash
# Phase 0 — AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

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

# Phase 3 — Image Search
GOOGLE_CUSTOM_SEARCH_API_KEY=AIza...
GOOGLE_CUSTOM_SEARCH_CX=xxx:yyy
```
