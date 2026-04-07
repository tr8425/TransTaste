---
name: project-architecture
description: TransTaste 서비스 아키텍처. 라우팅, 2-Phase AI 파이프라인, 저장소 구조, 결제 흐름. 전 에이전트 공유.
---

# Skill: Project Architecture

## 사용하는 에이전트
- dev-maintainer — 버그 수정 시 영향 범위 파악
- marketing-seo — 페이지별 메타데이터 / 구조화 데이터 작업 시
- i18n-worker — 번역 키가 필요한 페이지/컴포넌트 식별
- prompt-engineer — AI 응답이 흐르는 전체 파이프라인 이해

## 서비스 구조

| 레이어 | 기술 | 비고 |
|--------|------|------|
| Framework | Next.js 14 App Router | TypeScript + Tailwind CSS |
| AI | Anthropic Claude API (Vision + Text) | `@anthropic-ai/sdk` |
| DB | Supabase (PostgreSQL + Auth stub) | Auth 미구현 |
| Cache | Upstash Redis | 30-day TTL |
| Payments | Stripe | checkout sessions + webhooks |
| Hosting | Vercel (planned) | — |

## 2-Phase AI 파이프라인

```
Phase 1 (SSE 스트리밍)
  POST /api/analyze → claude.ts → DishLite[] + MenuMeta + RecommendedCombo
  - 이미지/URL/텍스트 입력
  - stream: true → SSE로 점진 전송
  - ANTHROPIC_API_KEY 없으면 mock 반환

Phase 2 (온디맨드)
  POST /api/analyze/detail → DishDetail (flavor_profile, ingredients, fun_fact)
  - Trip Pass/크레딧 필요 (paywall)
  - 개별 dish에 대해 호출
```

## 페이지 라우팅

| 경로 | 용도 | BottomNav |
|------|------|-----------|
| `/` | 홈 (랜딩) | 표시 |
| `/onboarding` | 최초 설정 (언어, 알레르기) | 표시 |
| `/camera` | 메뉴 촬영/갤러리 | **숨김** |
| `/loading-scan` | SSE 스트리밍 로딩 | **숨김** |
| `/results` | 분석 결과 목록 | 표시 |
| `/order` | 장바구니 | 표시 |
| `/order/present` | 주문서 제시 | **숨김** |
| `/history` | 스캔 이력 | 표시 |
| `/profile` | 설정 + 결제 | 표시 |
| `/phrases` | 레스토랑 회화 (5개 언어) | 표시 |
| `/tip-culture` | 팁/식사 에티켓 (20+ 국가) | 표시 |
| `/travel` | 여행 도구 허브 | 표시 |
| `/foods`, `/foods/[slug]` | 음식 데이터베이스 | 표시 |
| `/guide`, `/guide/[country]` | 국가별 식사 가이드 | 표시 |
| `/privacy`, `/terms` | 법적 문서 | 표시 |

## API 라우트

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/api/analyze` | 메뉴 분석 (Phase 1, SSE) |
| POST | `/api/analyze/detail` | 디쉬 상세 (Phase 2) |
| POST | `/api/stripe/checkout` | Stripe 결제 세션 |
| POST | `/api/stripe/webhook` | Stripe 웹훅 |
| GET | `/api/event-status` | 무료 이벤트 플래그 |
| GET | `/api/exchange-rate` | 환율 조회 |

## 클라이언트 저장소

| 키 | 저장소 | 용도 |
|----|--------|------|
| `transtaste_user_settings` | localStorage | 언어, 알레르기, 식이 (snake_case 필드) |
| `transtaste_credits` | localStorage | 크레딧/패스 상태 |
| (scan data) | sessionStorage | 이미지, 결과, 카트 (탭 닫으면 삭제) |

## 결제 흐름

```
프로필 → TripPassPaywall → POST /api/stripe/checkout → Stripe Checkout
  → 결제 완료 → /api/stripe/webhook → 클라이언트 localStorage 업데이트
  - 7-Day Trip Pass: $2.99
  - 30-Day Trip Pass: $5.99
  - 50 Credits: $1.99
```

## 디렉토리 맵

```
src/
  app/           # 23 페이지 + 6 API 라우트
  components/
    common/      # CreditBadge, FunFactCard, LockedBlock, ...
    dish/        # DishCard, DishRow, FlavorRadar, AllergyTag, ...
    camera/      # CameraView
    loading/     # LoadingScreen
    order/       # CartProvider
    paywall/     # TripPassPaywall, ComboRecommendation
    ui/          # BottomNav, BottomSheet, Button, Badge, ...
  hooks/         # useAuth, useCredits, useCart, useCamera, useDishDetail, useExchangeRate
  lib/
    ai/          # claude.ts, provider.ts, stream-parser.ts
    i18n/        # index.ts, en.json, ko.json
    phrases/     # 5개 언어 레스토랑 회화 데이터
    supabase/    # client.ts, server.ts, queries.ts
    local-data/  # spicy-scale, extreme-foods
```
