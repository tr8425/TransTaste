# TransTaste 개발 로그
> 2026-03-28 세션 4 (야간)

---

## 세션 요약

i18n 전수 적용 + 불호 식품 기능 + QA v5~v7 + Vercel 배포.
한국어/영어 즉시 전환 구현, 모든 사용자 대면 페이지/컴포넌트에 번역 적용.

**변경**: 30+ files, ~1,200 insertions

---

## 1. i18n 인프라 구축

### 번역 시스템
- `src/lib/i18n/en.json` — 영어 ~250키
- `src/lib/i18n/ko.json` — 한국어 ~250키
- `src/lib/i18n/index.ts` — `t()`, `useTranslation()` (hydration-safe), `getUILocale()`

### 키 구조 (15개 네임스페이스)
```
common, onboarding, home, loading, results, dish, order,
present, travel, phrases, tipCulture, profile, paywall,
payment, history, camera, disclaimer, errors,
nav, allergens, dietary, categories, flavor, risk
```

### Hydration 대응
- v5 QA에서 SSR/CSR mismatch 발견
- `useTranslation()` 훅: SSR은 영어 → 클라이언트 마운트 후 사용자 언어 전환
- `setLocale` 노출로 언어 변경 시 즉시 반영 (새로고침 불필요)

---

## 2. i18n 적용 페이지/컴포넌트

### 페이지 (전체 적용)
| 페이지 | 키 수 | 주요 항목 |
|--------|-------|----------|
| 온보딩 | 12 | 기능 소개, 버튼, 알레르기, 면책 |
| 홈 | 12 | 히어로, 버튼, 모달, Travel 배너, 인기 요리 |
| 프로필 | 25+ | 크레딧, 언어, 알레르기 태그, 식이, 불호, 팁, API, 계정 |
| Travel | 10 | 헤더, Quick Phrase 칩, 도구 카드 |
| Phrases | 3 | 헤더, 부제, 응답 레이블 |
| 로딩 스캔 | 4 | 상태 메시지 (분석 중, 발견, 스캔 중) |
| 결과 | 12 | 헤더, 요리 수, 카테고리 필터, 페이월, 에러, 주문 |
| 기록 | 5 | 헤더, 빈 상태 |

### 컴포넌트
| 컴포넌트 | 주요 변경 |
|----------|----------|
| BottomNav | 5탭 라벨 (홈/여행/스캔/기록/프로필) |
| AllergyTag | 알레르겐 이름 번역 (갑각류, 땅콩, 대두 등) |
| DishRow | 위험도 뱃지 (알레르기/확인 필요/직원 문의) |
| DishCard | 전체 모달 (알레르기 섹션, 가격대, 카테고리, 면책, 페이월, 식이 태그) |
| CreditBadge | "N 스캔 남음" |
| RecentHistory | "최근 스캔" |
| TripPassPaywall | 제목/부제/상품명/설명/뱃지/문구 |

---

## 3. 불호 식품 기능

### 프로필 UI
- "Disliked Ingredients" 섹션 (자유 텍스트 태그 입력)
- Enter → 칩 추가, × → 삭제, 중복 방지
- localStorage `disliked_ingredients: ["고수", "오이"]`

### API 연동
- `loading-scan` → 사용자 설정(언어, 알레르기, 불호) API body에 포함
- Claude 프롬프트: "User dislikes: 고수, 오이. Add disliked_ingredients array if matched."

### 결과 표시
- DishRow: 회색 칩으로 불호 재료 표시
- DishCard: 😐 "선호하지 않는 재료 포함: 고수" 경고 박스

---

## 4. 소프트 페이월 Race Condition 수정

- v4 QA에서 크레딧 0인데 스캔되는 버그 발견
- 원인: `useCredits` 훅 state가 기본값(10)으로 초기화 → useEffect 전에 스캔 시작
- 수정: localStorage 직접 읽기로 변경 → 크레딧 0 확실히 차단

---

## 5. API 키 입력 수정

- IIFE value → controlled state (`apiKeyInput`)
- 복사 붙여넣기 (Ctrl+V) 정상 동작
- 마운트 시 localStorage에서 기존 키 로드

---

## 6. Vercel 배포

- 첫 배포 성공: https://transtaste.vercel.app
- Mock 모드 (환경변수 미설정)
- 프로필에서 API 키 직접 입력 시 실제 스캔 가능
- robots.txt: 전체 Disallow (개발 중)

---

## 7. QA 3라운드 (v5~v7)

| 버전 | API | 주요 검증 | 결과 |
|------|-----|----------|------|
| v5 | 0회 | 빌드 오류 해소, 페이월 수정, i18n 3개 페이지 | 전건 PASS |
| v6 | 0회 | 프로필 i18n 즉시 전환, API 키, 불호 식품 | 전건 PASS |
| v7 | 0회 | 전체 i18n 확대 (홈, 결과, 기록, 태그, 뱃지) | 13 PASS, 13 FAIL → 수정 |

**v7 FAIL 항목 전수 수정 완료 (최종 커밋)**

---

## 8. 변경 파일 주요 목록

### 신규
- `src/lib/i18n/en.json`, `ko.json`, `index.ts` (v5에서 생성, v7까지 확장)

### i18n 적용
- `src/app/page.tsx`, `results/page.tsx`, `loading-scan/page.tsx`, `history/page.tsx`
- `src/app/onboarding/page.tsx`, `profile/page.tsx`, `travel/page.tsx`, `phrases/page.tsx`
- `src/components/ui/BottomNav.tsx`
- `src/components/dish/AllergyTag.tsx`, `DishRow.tsx`, `DishCard.tsx`
- `src/components/common/CreditBadge.tsx`, `RecentHistory.tsx`
- `src/components/paywall/TripPassPaywall.tsx`

### 기능 추가
- `src/app/profile/page.tsx` — 불호 식품 태그 입력, API 키 controlled input
- `src/app/loading-scan/page.tsx` — 사용자 설정 API body 포함, 크레딧 race condition 수정
- `src/lib/ai/provider.ts`, `claude.ts` — dislikedIngredients 프롬프트
- `src/lib/types.ts` — DishLite에 disliked_ingredients 필드

---

## 9. 남은 미번역 (의도적 보류)

| 항목 | 이유 |
|------|------|
| Fun Fact 로딩 카드 (10개) | 한국어 번역 10개 별도 작성 필요 |
| `/camera` 일부 | 사용 빈도 낮음, 다음 세션 |
| `/order` 일부 | 다음 세션 |
| `/foods/*`, `/guide/*` | SEO 콘텐츠, 영어 고정 |
| `/terms`, `/privacy` | 법적 문서, 영어 고정 |

---

## 10. 오늘 전체 (세션 2~4) 누적

| 항목 | 수치 |
|------|------|
| 커밋 | 6개 |
| 변경 파일 | 60+ |
| 신규 파일 | 20+ |
| 삽입 라인 | ~8,000 |
| QA 라운드 | 7회 (v1~v7) |
| 버그 수정 | 25+ |
| i18n 키 | ~250 (en+ko) |
| API 호출 | 2/3회 (잔여 1회) |
