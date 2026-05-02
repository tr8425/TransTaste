# Onboarding Playwright 테스트 계획 (보류)

**상태:** 기록 보관용. 현재 MVP 단계에서 오버스펙으로 판단하여 실행 보류.
**작성일:** 2026-04-17
**재검토 시점:** 결제/크레딧/API 쪽 테스트 먼저 도입 후, 리그레션 리스크 커지면 재고려

---

## 판단 근거 (왜 지금은 안 하는가)

| 근거 | 설명 |
|------|------|
| 온보딩은 **state 기반 단일 페이지** | URL 변경 없이 `step` state만 전환. E2E 브라우저 테스트의 장점(라우팅, 네트워크) 거의 필요 없음 |
| **i18n 때문에 셀렉터 깨지기 쉬움** | Step 2에서 `handleLanguageChange`가 UI locale 즉시 변경 → `getByRole('button', { name: 'Save & Start Scanning' })` 같은 텍스트 셀렉터가 깨짐. `data-testid` 추가 필요 |
| **1인 개발자 유지보수** | 30개 테스트 케이스는 과부하 |
| **투자 우선순위** | `useCredits`(Pass 만료), `/api/analyze`(결제 사이드이펙트) 쪽 단위 테스트가 더 가치 있음 |

---

## 플로우 구조 요약

```
Step 0 (계획서상 Step 1): Why TransTaste? (비교 화면)
  → [Next] 클릭 → setStep(1)
Step 1 (계획서상 Step 2): 기능 소개 (TransTaste 타이틀 + 3 features)
  → [Get Started] 클릭 → setStep(2)
Step 2 (계획서상 Step 3): 사용자 설정
  - I speak... (8개 언어, 단일 선택, 기본 en)
  - My home currency (12개 통화, 단일 선택, 기본 KRW)
  - Any allergies? (14개, 복수 선택, 기본 없음)
  - Dietary preferences (6개, 복수 선택, 기본 없음)
  → [Save & Start Scanning] → localStorage 저장 + router.push('/')
  → [Skip for now] → _done 플래그만 저장 + router.push('/')
```

⚠️ **내부 `step` state는 0-indexed** (계획서는 1-indexed 표기)

---

## 데이터 상수 검증 (실제 코드 기준)

| 섹션 | 개수 | 기본값 | 동작 |
|------|:-:|:-:|------|
| `LANGUAGES` | 8 | `en` | 단일 선택, 선택 시 UI locale 즉시 변경 |
| `CURRENCIES` | 12 | `KRW` | 단일 선택 |
| `ALLERGENS` | 14 | `[]` | 복수 토글 |
| `DIETARY` | 6 | `[]` | 복수 토글 |

---

## 알려진 잠재 버그 (테스트 작성 시 드러날 것)

1. **`handleSave`는 `transtaste_onboarding_done` 플래그를 저장하지 않음**
   — `handleSkip`은 저장함
   — 저장 후 재방문 시 온보딩 다시 뜰 가능성 (리다이렉트 로직 검증 필요)
2. **Step 2에서 뒤로가기 불가** — Back 버튼 없음. UX상 의도된 것인지 확인 필요

---

## 권장 테스트 전략 (도입 시)

### 옵션 A: Vitest + React Testing Library (추천)

**이유:** 온보딩은 state-only, 브라우저 실제 렌더링 필요 없음

**핵심 7~10개 케이스:**
1. Step 0 → 1 → 2 전환
2. 언어 선택 시 `setLocale` 호출 및 상태 변경
3. 알러지 토글 (복수 선택/해제)
4. 식단 토글 (복수 선택/해제)
5. `handleSave` → localStorage `transtaste_user_settings` 내용 검증
6. `handleSkip` → `transtaste_onboarding_done` 저장 검증
7. 기본값 렌더링 (en / KRW, 알러지·식단 빈 상태)

### 옵션 B: Playwright 최소 스모크 (1 파일, 3 테스트)

**필수 사전 작업:** 주요 버튼에 `data-testid` 추가
- `data-testid="onboarding-next"`
- `data-testid="onboarding-get-started"`
- `data-testid="onboarding-save"`
- `data-testid="onboarding-skip"`
- `data-testid="lang-{code}"`, `data-testid="currency-{code}"`, etc.

**테스트 3개:**
1. Happy path: Next → Get Started → 선택 → Save → localStorage 검증
2. Skip path: Next → Get Started → Skip → `_done` 플래그 검증
3. 언어 변경 시 UI locale 스위치 검증

---

## 셀렉터 전략 (i18n 대응)

```typescript
// ❌ 깨지기 쉬움 (locale 바뀌면 텍스트 변경)
page.getByRole('button', { name: 'Next' })

// ✅ 안정적
page.getByTestId('onboarding-next')
page.locator('[data-testid="lang-ko"]')
```

---

## 전체 테스트 케이스 목록 (참고용)

### Step 0 — Why TransTaste

| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 1 | `/onboarding` 접속 시 Step 0 표시 | "Why TransTaste?" heading visible |
| 2 | 첫 번째 dot 활성화 (coral) | `bg-coral` class on first dot |
| 3 | Google Translate + TransTaste 두 카드 표시 | 두 카드 visible |
| 4 | TransTaste 카드 강조 상태 | `border-coral/30` class |
| 5 | [Next] 클릭 → Step 1로 | TransTaste 로고 visible |

### Step 1 — Introduction

| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 1 | 3개 feature 항목 표시 (Scan / Allergens / Chat) | 3개 아이콘 + 텍스트 visible |
| 2 | "10 free scans included" 배지 표시 | `onboarding.freeScans` 텍스트 visible |
| 3 | 두 번째 dot 활성화 | `bg-coral` on second dot |
| 4 | [Get Started] 클릭 → Step 2 | "I speak..." section visible |

### Step 2 — Settings

**언어**
| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 1 | 기본값 English 선택 | en 버튼에 `border-coral` + `CheckIcon` |
| 2 | 한국어 클릭 → en 해제, ko 선택 + locale 변경 | `setLocale("ko")` 호출됨 |
| 3 | 8개 언어 렌더링 | 언어 버튼 8개 존재 |

**통화**
| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 4 | 기본값 KRW | KRW 버튼 강조 |
| 5 | USD 클릭 → KRW 해제 | 단일 선택 |
| 6 | 12개 통화 렌더링 | 통화 버튼 12개 |

**알러지**
| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 7 | 기본값 없음 | 모든 버튼 `bg-cream-dark` |
| 8 | Peanuts + Milk 동시 선택 유지 | 복수 선택 |
| 9 | 재클릭 시 해제 (토글) | `allergens` state에서 제거 |
| 10 | Disclaimer 텍스트 표시 | `disclaimer.onboarding` visible |

**식단**
| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 11 | 기본값 없음 | 모든 버튼 미선택 |
| 12 | Vegan + Halal 복수 선택 | 동시 선택 유지 |

**저장/Skip**
| # | 케이스 | 예상 결과 |
|---|--------|-----------|
| 13 | [Save & Start Scanning] → localStorage 저장 + `/`로 이동 | `transtaste_user_settings` 키에 JSON |
| 14 | [Skip for now] → `_done=true` 저장 + `/`로 이동 | `transtaste_onboarding_done=true` |

---

## 재개 체크리스트

이 계획을 다시 실행할 시점:

- [ ] 결제/크레딧 쪽 단위 테스트 선행 완료
- [ ] 온보딩 플로우에 대한 리그레션 이슈 실제 발생
- [ ] 또는 출시 직전 스모크 테스트 필요 시점
- [ ] 투입 시간: 옵션 A 기준 약 2~3시간, 옵션 B 기준 약 1시간
