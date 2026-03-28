# TransTaste 개발 로그
> 2026-03-28 세션 3

---

## 세션 요약

수익/보안/법적/SEO/GEO 기반 구축 + 콘텐츠 페이지 + i18n + 5라운드 QA.
기획 문서(marketing, audit) 대응 항목을 전수 개발 반영.

**변경**: 35+ files changed, 15 new files, ~2,500 insertions

---

## 1. 프로젝트 관리 설정

- **CLAUDE.md** 작성 — 프로젝트 가이드 (스택, 구조, 규칙, 수익 모델)
- **SubAgent 설정** — `.claude/agents/dev-maintainer.md`, `marketing-seo.md`
- **기획 에이전트 프롬프트** — `Docs/prompt-for-planning-agent.md`

---

## 2. 수익 시스템 보강

### 크레딧 차감 구현
- `loading-scan/page.tsx`에 스캔 전 크레딧 확인 + 차감
- v4 QA에서 race condition 발견 → v5에서 localStorage 직접 읽기로 수정
- 정상 차감 확인: 10 → 9 → 8...

### 소프트 페이월 (크레딧 소진 시)
- `results/page.tsx`에 인라인 가격 카드 3개 표시
  - 7-Day Trip Pass $2.99 (코랄 강조)
  - 50 Scan Credits $1.99
  - 30-Day Trip Pass $5.99

### Stripe 연결
- `profile/page.tsx` handlePurchase → `/api/stripe/checkout` 실 요청
- Stripe 미설정 시 로컬 크레딧 관리로 폴백

### 상품 ID 정렬
- `constants.ts`: `credits50` → `credits_50` 통일
- `profile/page.tsx`: ID 매핑 (`7d` → `pass_7d`)

### 문구 수정
- "Cancel anytime" → "Instant access"

### Free 10회
- `useCredits.ts`: 7 → 10으로 변경, 마케팅 문서와 통일

---

## 3. 보안

### API 레이트 리밋
- `src/lib/rate-limit.ts` — Upstash Redis 기반 sliding window (fail-open)
- `/api/analyze`: IP당 20회/시간
- `/api/analyze/detail`: IP당 30회/시간
- 429 + Retry-After 헤더

### 사용자 API 키 직접 입력
- 프로필에 키 입력란 추가 (type=password, localStorage 저장)
- 3단계 폴백: 사용자 키 > 서버 env > Mock 모드
- `x-api-key` 헤더로 서버 전달 → `claude.ts` 3곳에서 우선 사용

---

## 4. 법적 대응

### 앱 내 면책 고지 3개소
- 온보딩: 알레르기 설정 하단
- DishCard: 알레르겐 태그 하단
- Present Mode: 주문 목록 하단

### 이용약관 + 개인정보처리방침
- `/terms` — 8개 섹션 (Not a Medical Device 강조)
- `/privacy` — 9개 섹션 (Health-Related Data, GDPR, PIPA 대응)
- 프로필 하단 Terms/Privacy 링크 연결

---

## 5. SEO/GEO 기반

### 메타데이터
- Root: 제목 템플릿, 160자 설명, Open Graph, Twitter Cards
- 페이지별: travel, phrases, tip-culture, results, terms, privacy 각 layout
- `robots: noindex, nofollow` (개발 중 크롤링 차단)

### 구조화 데이터
- JSON-LD `WebApplication` 스키마 (이름, 설명, 가격, 기능 목록)

### SEO 파일
- `public/robots.txt` — 전체 Disallow (개발 중)
- `src/app/sitemap.ts` — 동적 생성 (foods, guide, 약관 포함)
- `public/llms.txt` — AI 크롤러용 서비스 설명

---

## 6. 콘텐츠 페이지

### 음식별 SEO 페이지 (`/foods/[slug]`)
- 시드 데이터 5개: Bulgogi, Bibimbap, Pad Thai, Ramen, Tom Yum Goong
- `src/lib/food-database.ts` — 음식 데이터 (원문, 번역, 재료, 알레르겐, Fun Fact, 먹는 방법)
- `/foods` 인덱스 + `/foods/[slug]` 상세 (SSG 정적 생성)

### 국가별 가이드 (`/guide/[country]`)
- 기존 `tip-culture-data.ts`의 20개국 재활용
- `/guide` 인덱스 + `/guide/[country]` 상세 (SSG 정적 생성)

### sitemap 연동
- foods 5개 + guide 20개 자동 포함

---

## 7. 알레르기 4단계 UI

### DishRow 위험도 뱃지
- danger → 빨강 "ALLERGEN"
- warning → 주황 "CHECK"
- check → 노랑 "ASK STAFF"
- safe → 뱃지 없음

### DishCard 행동 가이드
- danger: "Contains your allergen. Consider an alternative dish."
- warning: "May contain allergens. Ask staff if it can be prepared without."
- check: "Possible allergen presence. Ask staff to confirm ingredients."

### disclosure 렌더링
- DishCard에 "Cultural Note" 섹션 추가

---

## 8. Present Mode 개선

- 요리명: 40px (text-[40px])
- 번역: 18px로 원문 하단 병기
- 수량: 30px (text-3xl)
- 헤더/합계 크기 확대
- 면책 고지 추가

---

## 9. i18n

### 인프라
- `src/lib/i18n/en.json` — 영어 ~180키
- `src/lib/i18n/ko.json` — 한국어 ~180키
- `src/lib/i18n/index.ts` — `t()`, `useTranslation()`, `getUILocale()`

### 적용 페이지
- 온보딩: 12키 (기능 소개, 버튼, 알레르기 섹션)
- Travel: 10키 (헤더, Quick Phrase 칩, 도구 카드)
- Phrases: 3키 (헤더, 부제, 응답 레이블)

### Hydration 대응
- v5 QA에서 SSR/CSR mismatch 발견 → `useTranslation()` 훅으로 해결
- SSR: 영어 → 클라이언트 마운트 후 사용자 언어 전환

---

## 10. QA 5라운드

| 버전 | API | 주요 검증 | 결과 |
|------|-----|----------|------|
| v1 | 1회 | 전체 기능 12영역 | 8건 버그 발견 |
| v2 | 1회 | v1 수정 회귀 + 신규 기능 | 전건 PASS, Low 2건 |
| v3 | 0회 | BottomNav 5탭 + v2 잔여 | 전건 PASS |
| v4 | 0회 | 수익/보안/SEO/콘텐츠 | 빌드 오류 + 소프트 페이월 race condition |
| v5 | 0회 | v4 수정 + i18n | **전건 PASS** |

**API 총 사용: 2/3회 (잔여 1회 보존)**

---

## 11. 변경 파일 전체 목록

### 신규 파일 (15개)
| 파일 | 내용 |
|------|------|
| `CLAUDE.md` | 프로젝트 가이드 |
| `.claude/agents/dev-maintainer.md` | 개발 유지보수 에이전트 |
| `.claude/agents/marketing-seo.md` | 마케팅/SEO 에이전트 |
| `src/lib/rate-limit.ts` | API 레이트 리밋 |
| `src/lib/food-database.ts` | 음식 시드 데이터 |
| `src/lib/i18n/en.json` | 영어 번역 |
| `src/lib/i18n/ko.json` | 한국어 번역 |
| `src/lib/i18n/index.ts` | i18n 유틸리티 |
| `src/app/foods/page.tsx` | 음식 인덱스 |
| `src/app/foods/[slug]/page.tsx` | 음식 상세 |
| `src/app/guide/page.tsx` | 국가 인덱스 |
| `src/app/guide/[country]/page.tsx` | 국가 상세 |
| `src/app/terms/page.tsx` | 이용약관 |
| `src/app/privacy/page.tsx` | 개인정보처리방침 |
| `public/llms.txt` | AI 크롤러용 서비스 설명 |

### 수정 파일 (20+ 개)
| 파일 | 변경 |
|------|------|
| `src/hooks/useCredits.ts` | Free 7→10 |
| `src/app/loading-scan/page.tsx` | 크레딧 확인, API 키 전달, race condition 수정 |
| `src/app/results/page.tsx` | 소프트 페이월, 알레르기 no_credits 분기 |
| `src/app/profile/page.tsx` | Stripe 연결, 상품 ID, API 키 입력, Terms 링크 |
| `src/app/onboarding/page.tsx` | 면책 고지, i18n 적용 |
| `src/app/travel/page.tsx` | i18n 적용 |
| `src/app/phrases/page.tsx` | i18n 적용 |
| `src/app/order/present/page.tsx` | 글씨 40px, 번역 병기, 면책 |
| `src/app/layout.tsx` | OG, JSON-LD, robots noindex |
| `src/app/sitemap.ts` | foods/guide/terms/privacy 추가 |
| `src/components/dish/DishRow.tsx` | 알레르기 4단계 뱃지 |
| `src/components/dish/DishCard.tsx` | 행동 가이드, disclosure, 면책 |
| `src/components/paywall/TripPassPaywall.tsx` | 문구 수정 |
| `src/lib/constants.ts` | 상품 ID 정렬 |
| `src/lib/ai/provider.ts` | MenuInput apiKey 추가 |
| `src/lib/ai/claude.ts` | input.apiKey 우선 사용 |
| `src/hooks/useDishDetail.ts` | 사용자 키 전달 |
| `src/app/api/analyze/route.ts` | 레이트 리밋, 사용자 키 |
| `src/app/api/analyze/detail/route.ts` | 레이트 리밋, 사용자 키 |
| `public/robots.txt` | 개발 중 전체 차단 |
| 레이아웃 4개 | travel, phrases, tip-culture, results 메타데이터 |

---

## 12. 다음 작업

### 오늘 밤
- [x] Vercel 배포 (소프트 런치, Mock 모드)

### 향후
- [ ] i18n 나머지 페이지 적용 (홈, 프로필, 결과, 주문 등 ~155키)
- [ ] 공개 랜딩 페이지
- [ ] 서버사이드 크레딧 검증 (Supabase Auth)
- [ ] FAQPage 스키마
- [ ] OG 이미지
- [ ] 음식 시드 데이터 50개로 확장
- [ ] robots.txt Allow 전환 + sitemap 활성화 (공개 시)
