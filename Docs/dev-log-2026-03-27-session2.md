# TransTaste 개발 로그
> 2026-03-27 세션 2

---

## 세션 요약

기획 리포트 7개(frontend v1~v3, backend v1~v2, content-arch v4, ai-comparison) 기반으로 Phase 1~6 전체 구현 완료.

**커밋**: `34706bf` — 50 files changed, 9,124 insertions

---

## 1. 리포트 분석 → 종합 계획 작성

7개 리포트를 전부 읽고 Phase 0~7 종합 구현 계획 작성.
리포트 간 충돌 없음 확인. 각 리포트가 서로 다른 레이어를 정의하여 상호 보완적.

- 계획: `Docs/implementation-plan.md`
- 사람 작업: `Docs/manual-tasks.md` (API 키, 계정 생성 등)

---

## 2. Phase 1 — 실 API 연동 (SubAgent 3개 병렬)

| Agent | 작업 | 파일 수 |
|---|---|---|
| A | API route + Claude 프롬프트 + AI Provider 추상화 + 타입 확장 | 4 |
| B | useCamera Promise 수정 + 카메라/로딩/결과 실 플로우 + 입력 4종 | 6 |
| C | ErrorScreen(6종) + LowConfidenceBanner + NoCreditScreen | 3 |

**핵심 구현:**
- Claude Vision API 프로덕션 프롬프트 (브랜드명/톤가이드/알러지4단계/disclosure/warning)
- API 키 없으면 mock fallback (개발 편의)
- sessionStorage 기반 페이지 간 데이터 전달 (base64 이미지)

---

## 3. Phase 2 — Supabase + Auth + UI (SubAgent 3개 병렬)

| Agent | 작업 |
|---|---|
| A | Supabase 클라이언트 + DB 스키마 SQL(7테이블) + Auth 훅 + 쿼리 헬퍼 |
| B | 온보딩 /onboarding (2단계: 소개→언어+알러지+식이 설정) |
| C | 프로필 /profile (크레딧/언어/알러지/계정) |

**DB 스키마**: users, user_settings, passes, scan_cache, scan_history, payments, phrase_favorites
**자동 트리거**: auth.users INSERT → users + user_settings 자동 생성

---

## 4. Phase 3+4 — 캐싱 + 결제 (SubAgent 1개)

- **Redis 캐싱**: L1 정확 매칭 + L2 정규화 매칭 + hit_count 집계
- **Stripe**: Checkout Session + Webhook (7일/30일 패스, 50크레딧)
- api/analyze에 캐시 통합 (히트 시 크레딧 미차감)
- Stripe lazy init으로 키 없어도 빌드 성공

---

## 5. Phase 6 — 식당 컴패니언 V1.5 (SubAgent 3개 병렬)

| Agent | 작업 |
|---|---|
| A | 대화 프리셋 /phrases — 24개 문구, 5개국어, 예측 답변 |
| B | 팁 & 문화 /tip-culture — 15개국, 팁 계산기, 식사 에티켓 |
| C | 주문서 /order + Present Mode /order/present + CartProvider + allergen-i18n |

---

## 6. CC 리뷰 피드백 반영 (2회)

### 리뷰 3차 피드백 → 수정 4건
| 문제 | 수정 |
|---|---|
| History 404 | /history 페이지 생성 + BottomNav 라우트 수정 |
| "7 left" 불명확 | "7 scans left"로 변경 |
| Combo 버튼 목록 가림 | 하단 패딩 추가 |
| Bottom Sheet 스크롤 | 이미 처리됨 확인 |

### 리뷰 4차 피드백 → 수정 5건
| 문제 | 수정 |
|---|---|
| URL 모달 구분 불명확 | 링크 아이콘 + "Fetch & Analyze" + 안내 텍스트 |
| Combo 버튼 무반응 | scrollIntoView 추가 |
| 신규 페이지 접근 불가 | 홈 Travel Tools + BottomNav Profile 탭 |
| 온보딩 자동 진입 없음 | 최초 실행 감지 + 리다이렉트 |
| 온보딩 인디케이터 | 비활성 점 색상 강화 |

---

## 최종 라우트 (15개)

```
/                    홈 (입력 4종 + Travel Tools)
/onboarding          온보딩 (언어+알러지+식이)
/camera              카메라 뷰파인더
/loading-scan        로딩 + API 호출
/results             결과 리스트
/history             스캔 히스토리
/profile             프로필
/phrases             식당 대화 프리셋 (5개국어)
/tip-culture         팁 & 문화 가이드 (15개국)
/order               주문서 (사용자 언어)
/order/present       서버에게 보여주기 (현지어)
/api/analyze         메뉴 분석 API
/api/stripe/checkout 결제 세션 생성
/api/stripe/webhook  결제 완료 처리
```

## 최종 파일 구조

```
TransTaste/
├── Docs/                          # 리포트 + 계획
├── poc/                           # 기존 POC (보존)
├── supabase/
│   └── schema.sql                 # DB 스키마
├── public/
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx             # CartProvider 통합
│   │   ├── page.tsx               # 홈 (4종 입력 + Travel Tools + 온보딩 리다이렉트)
│   │   ├── globals.css
│   │   ├── onboarding/page.tsx
│   │   ├── camera/page.tsx
│   │   ├── loading-scan/page.tsx
│   │   ├── results/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── phrases/page.tsx
│   │   ├── tip-culture/page.tsx
│   │   ├── order/page.tsx
│   │   ├── order/present/page.tsx
│   │   └── api/
│   │       ├── analyze/route.ts   # Claude Vision + 캐싱
│   │       └── stripe/
│   │           ├── checkout/route.ts
│   │           └── webhook/route.ts
│   ├── components/
│   │   ├── ui/                    # Button, Badge, BottomSheet, BottomNav(4탭)
│   │   ├── camera/CameraView.tsx
│   │   ├── loading/LoadingScreen.tsx
│   │   ├── dish/                  # DishRow, DishCard, FlavorRadar, IngredientChip, AllergyTag
│   │   ├── common/               # CreditBadge, FunFactCard, LockedBlock, RecentHistory,
│   │   │                         # ErrorScreen, LowConfidenceBanner, NoCreditScreen
│   │   ├── paywall/              # TripPassPaywall, ComboRecommendation
│   │   └── order/CartProvider.tsx
│   ├── lib/
│   │   ├── types.ts               # v2 타입 (AllergenSummary, Disclosure 등)
│   │   ├── mock-data.ts
│   │   ├── constants.ts
│   │   ├── cache.ts               # Redis 캐싱
│   │   ├── allergen-i18n.ts       # 알러지 다국어
│   │   ├── phrases-data.ts        # 대화 프리셋 데이터
│   │   ├── tip-culture-data.ts    # 팁/문화 데이터
│   │   ├── ai/
│   │   │   ├── provider.ts        # AI Provider 추상화
│   │   │   └── claude.ts          # Claude 구현
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── queries.ts
│   └── hooks/
│       ├── useCamera.ts
│       ├── useCredits.ts
│       ├── useAuth.ts
│       └── useCart.ts
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 다음 단계

- Phase 0: API 키 세팅 → POC 실 테스트
- Phase 5: Vercel 배포 + 도메인
- Phase 7: 유료 콘텐츠 (FlavorRadar, FunFact 접기, 공유 카드, QR 메뉴, 모델 라우팅)
- manual-tasks.md 참조하여 외부 계정 생성
