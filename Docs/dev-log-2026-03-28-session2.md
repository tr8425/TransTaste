# TransTaste 개발 로그
> 2026-03-28 세션 2

---

## 세션 요약

QA 체계 구축 → 3라운드 QA(v1~v3) → 버그 수정 8건 → BottomNav 5탭 구조 변경 → 수익 전략 보완 → SEO 기반 구축 → 에이전트 설정

**변경**: 20+ files changed, 6 new files, ~800 insertions

---

## 1. QA 체계 구축 및 3라운드 QA

### QA 방침 문서 작성
- `Docs/QA-policy-chrome.md` (v1) — 전체 기능 12개 영역 체크리스트
- API 호출 제한 규칙: 이미지 분석 + 텍스트 분석 + 요리 상세 **총 3회 이내**
- Claude Chrome에 전달하여 브라우저 기반 QA 수행

### QA v1 결과 → 8건 버그 발견, 7건 수정
### QA v2 결과 → 수정 전건 PASS, 잔여 Low 2건
### QA v3 결과 → BottomNav 변경 + Low 이슈 수정 검증용

---

## 2. 버그 수정 (QA v1 기반)

### [긴급] 온보딩 ↔ 프로필 localStorage 키 불일치
- **원인**: 온보딩은 `output_language`(snake_case), 프로필은 `outputLanguage`(camelCase)
- **수정**: `profile/page.tsx`의 모든 키를 snake_case로 통일
- **파일**: `src/app/profile/page.tsx`

### [높음] 프로필 알레르기 선택지 불일치
- **원인**: 온보딩 14개 vs 프로필 7개
- **수정**: 프로필 알레르기 14개 + 식이 제한 6개로 확장
- **파일**: `src/app/profile/page.tsx`

### [보통] 결제 성공/취소 피드백 없음
- **수정**: `useSearchParams`로 `?payment=success|cancelled` 감지, 배너 표시 (6초 + rAF)
- **파일**: `src/app/profile/page.tsx`

### [보통] LockedBlock 렌더링 미흡
- **원인**: detail null일 때 빈 skeleton만 표시 → blur 처리 시 거의 안 보임
- **수정**: 샘플 FlavorRadar + Ingredient 칩 + Fun Fact 안내를 placeholder로 표시, 자물쇠 아이콘 활성화
- **파일**: `src/components/dish/DishCard.tsx`

### [보통] 텍스트 분석 시 원어명에 가격 포함
- **원인**: Claude 프롬프트에 "original은 요리명만" 지시 부재
- **수정**: Full/Lite/Detail 프롬프트 3곳에 규칙 추가
- **파일**: `src/lib/ai/claude.ts`

### [Low] 터치 영역 44px 미달
- **수정**: Gallery/URL/Text 버튼 + 최근 스캔 캐러셀에 `min-h-[44px]` 적용
- **파일**: `src/app/page.tsx`, `src/components/common/RecentHistory.tsx`

### [Low] 결제 배너 타이머 불안정
- **수정**: `requestAnimationFrame` 후 타이머 시작, 5초 → 6초
- **파일**: `src/app/profile/page.tsx`

### [Low] 회화집 영어 탭 스크롤 밖 숨김
- **수정**: `overflow-x-auto` → `flex-1` 균등 배분으로 5개 탭 모두 표시
- **파일**: `src/app/phrases/page.tsx`

---

## 3. BottomNav 5탭 구조 변경

### Before
```
Home | [Scan] | History | Profile
```

### After
```
Home | Travel | [Scan] | History | Profile
```

- **Travel 탭 신규**: 회화집 + 팁가이드 + 주문 페이지로의 허브
- **`/travel` 페이지 생성**: Quick Phrase 칩, 3개 도구 카드, 언어별 Travel Tip
- **홈 Travel Tools**: 3칸 그리드 → 컴팩트 배너 링크로 변경
- **파일**: `src/components/ui/BottomNav.tsx`, `src/app/travel/page.tsx`, `src/app/page.tsx`

---

## 4. 수익 전략 보완

### [Critical] 스캔 시 크레딧 미차감 수정
- `loading-scan/page.tsx`에 `canScan()` + `useCredit()` 추가
- 크레딧 소진 시 전용 "No scans remaining" 소프트 페이월 화면 추가 (`results/page.tsx`)

### [Critical] 페이월 → Stripe 연결
- `handlePurchase`에서 `/api/stripe/checkout`으로 실 결제 요청
- Stripe 미설정 시 로컬 크레딧 관리로 폴백 (개발/데모 모드)

### [High] 상품 ID 정렬
- `constants.ts`: `credits50` → `credits_50`
- `profile/page.tsx`: `handlePurchase`에서 ID 매핑 (`7d` → `pass_7d`, `30d` → `pass_30d`)

### 문구 수정
- "Cancel anytime" → "Instant access" (일회성 결제에 정확한 문구)

---

## 5. SEO 기반 구축

### Root 메타데이터 강화
- 제목 템플릿: `%s — TransTaste`
- 160자 설명, Open Graph, Twitter Cards 추가
- `metadataBase` 설정

### 페이지별 메타데이터
- `travel/layout.tsx`, `phrases/layout.tsx`, `tip-culture/layout.tsx`, `results/layout.tsx`
- 각 페이지 고유 title + description + OG tags

### SEO 파일
- `public/robots.txt` — API/카메라/로딩 차단, sitemap 연결
- `src/app/sitemap.ts` — 6개 공개 페이지 동적 sitemap

### 구조화 데이터
- `layout.tsx`에 JSON-LD `WebApplication` 스키마 추가
- 앱 이름, 설명, 가격 범위, 기능 목록 포함

---

## 6. 프로젝트 관리 설정

### CLAUDE.md 작성
- 프로젝트 개요, 기술 스택, 디렉토리 구조, 주요 규칙, API 라우트, 환경변수, 수익 모델

### SubAgent 설정 (`.claude/agents/`)
| 에이전트 | 역할 |
|----------|------|
| `dev-maintainer.md` | 버그 수정, 코드 품질, 빌드 검증, 성능 관리 |
| `marketing-seo.md` | SEO/GEO/ASO, 메타데이터, 콘텐츠 마케팅, 랜딩 페이지 |

---

## 7. 변경 파일 전체 목록

| 파일 | 변경 |
|------|------|
| `CLAUDE.md` | **신규** — 프로젝트 가이드 |
| `.claude/agents/dev-maintainer.md` | **신규** — 개발 유지보수 에이전트 |
| `.claude/agents/marketing-seo.md` | **신규** — 마케팅/SEO 에이전트 |
| `src/app/layout.tsx` | OG, Twitter, JSON-LD, 제목 템플릿 |
| `src/app/sitemap.ts` | **신규** — 동적 sitemap |
| `src/app/page.tsx` | Travel Tools 배너, 버튼 44px |
| `src/app/travel/page.tsx` | **신규** — Travel Tools 허브 |
| `src/app/travel/layout.tsx` | **신규** — 메타데이터 |
| `src/app/phrases/page.tsx` | 언어 탭 flex-1 |
| `src/app/phrases/layout.tsx` | **신규** — 메타데이터 |
| `src/app/tip-culture/page.tsx` | no-tip 안내 배너 |
| `src/app/tip-culture/layout.tsx` | **신규** — 메타데이터 |
| `src/app/results/page.tsx` | 크레딧 소진 소프트 페이월 |
| `src/app/results/layout.tsx` | **신규** — 메타데이터 (noindex) |
| `src/app/loading-scan/page.tsx` | 크레딧 확인 + 차감 |
| `src/app/profile/page.tsx` | localStorage 키 통일, 알레르기 14개, 결제 배너, Stripe 연결, 팁 설정 |
| `src/app/onboarding/page.tsx` | (변경 없음 — 기준 포맷) |
| `src/components/ui/BottomNav.tsx` | Travel 탭 추가, 5탭 간격 |
| `src/components/dish/DishCard.tsx` | LockedBlock placeholder |
| `src/components/common/RecentHistory.tsx` | 44px 터치 영역 |
| `src/components/paywall/TripPassPaywall.tsx` | 문구 수정 |
| `src/lib/ai/claude.ts` | 프롬프트 가격 분리 규칙 |
| `src/lib/constants.ts` | 상품 ID 정렬 |
| `src/hooks/useCredits.ts` | (변경 없음 — 기존 로직 활용) |
| `public/robots.txt` | **신규** |
| `Docs/QA-policy-chrome.md` | **신규** — QA v1 |
| `Docs/QA-policy-chrome-v2.md` | **신규** — QA v2 |
| `Docs/QA-policy-chrome-v3.md` | **신규** — QA v3 |

---

## 8. 남은 과제

### 오늘 밤 예정
- [ ] Vercel 배포 (핸드폰에서 실제 사용 테스트)

### 향후
- [ ] 공개 랜딩/마케팅 페이지 구축
- [ ] 서버사이드 크레딧 검증 (Supabase Auth 연동)
- [ ] API 레이트 리밋 추가
- [ ] OG 이미지 생성
- [ ] FAQ 페이지 + FAQPage 스키마
- [ ] i18n 메타 태그 (hreflang)
