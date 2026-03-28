# TransTaste QA 방침 v6 — Claude Chrome 전달용

> **작성일:** 2026-03-28
> **버전:** v6 (프로필 i18n 즉시 전환 + API 키 입력 수정 + 불호 식품 기능)
> **대상:** Claude Chrome (브라우저 기반 QA 수행자)
> **앱 URL:** http://localhost:3000 (개발 서버)
> **이전 버전:** QA-policy-chrome-v5.md

---

## 0. 이번 QA의 목적

1. **프로필 i18n 즉시 전환** — 언어 select 변경 시 프로필 전체 UI 즉시 한국어/영어 전환
2. **온보딩 i18n 즉시 전환** — 언어 선택 버튼 탭 시 Step1~2 UI 즉시 전환
3. **API 키 입력 수정** — 복사 붙여넣기 동작, controlled input
4. **불호 식품 기능 (신규)** — 프로필에서 자유 텍스트 태그 입력, 스캔 시 프롬프트 전달

**API 호출:** 0회 (잔여 1회 보존). Mock 모드 전체 수행.

---

## 1. 프로필 i18n 즉시 전환 검증 (P0)

### 1.1 영어 → 한국어 전환

- [ ] 프로필(`/profile`) 진입
- [ ] Language 섹션 → "I speak" 드롭다운에서 "한국어" 선택
- [ ] **즉시** (새로고침 없이) 프로필 전체 UI가 한국어로 전환되는지 확인:
  - 헤더: "프로필"
  - 크레딧: "남은 스캔 10회" (또는 해당 숫자)
  - 버튼: "스캔 추가 구매"
  - Language 섹션: "언어" / "내가 사용하는 언어" / "메뉴 언어"
  - Allergies: "알레르기" / "선택된 알레르기 없음" / "편집"/"완료"
  - Dietary: "식이 선호도"
  - Disliked Ingredients: "불호 식품"
  - Tip Guide: "팁 가이드"
  - API Key: "API 키"
  - Account: "계정" / "로그인되지 않음" / "로그인"
  - Footer: "이용약관" / "개인정보처리방침"

### 1.2 한국어 → 영어 복귀

- [ ] "내가 사용하는 언어" 드롭다운에서 "English" 선택
- [ ] **즉시** 영어로 복귀:
  - "Profile", "scans left", "Get More Scans" 등 모두 영어

### 1.3 결제 배너 i18n

- [ ] `/profile?payment=success` 접근 (한국어 상태)
- [ ] 배너: "결제가 완료되었습니다! 스캔 횟수가 업데이트되었습니다."

---

## 2. 온보딩 i18n 즉시 전환 검증 (P0)

### 2.1 언어 선택 시 즉시 전환

- [ ] localStorage 초기화 (Clear site data)
- [ ] `/onboarding` 진입 → Step 1은 영어 (기본값)
- [ ] "Get Started" 클릭 → Step 2 진입
- [ ] Step 2에서 "한국어" 버튼 탭
- [ ] **즉시** Step 2 UI가 한국어로 전환:
  - "내가 사용하는 언어..."
  - "알레르기가 있으세요?" / "매번 스캔할 때 알려드릴게요"
  - 면책 고지 한국어
  - "식이 선호도"
  - "저장하고 스캔 시작" / "나중에 하기"

### 2.2 다시 English 선택

- [ ] "English" 버튼 탭 → 즉시 영어 복귀

---

## 3. API 키 입력 검증 (P1)

- [ ] 프로필 → "API Key" 섹션
- [ ] 입력란에 텍스트 직접 타이핑 가능
- [ ] **복사 붙여넣기** (Ctrl+V) 동작 확인
- [ ] 입력 후 DevTools에서 `transtaste_api_key` 값 확인
- [ ] 입력란 비우기 → `transtaste_api_key` 삭제 확인

---

## 4. 불호 식품 기능 검증 (P0 — 신규)

### 4.1 프로필 UI

- [ ] 프로필 → "Disliked Ingredients" 섹션 표시 (알레르기 아래, Tip Guide 위)
- [ ] 안내 텍스트: "Ingredients you prefer to avoid (not allergies)"
- [ ] 입력란 placeholder: "Type and press Enter (e.g. cilantro, cucumber)"

### 4.2 태그 입력

- [ ] "cilantro" 입력 → Enter → 칩 태그 추가됨
- [ ] "cucumber" 입력 → Enter → 두 번째 칩 추가됨
- [ ] 중복 입력 시 추가되지 않음 (같은 텍스트 입력 → 무시)
- [ ] Enter 후 입력란 자동 비워짐

### 4.3 태그 삭제

- [ ] 칩의 × 버튼 클릭 → 해당 태그 삭제
- [ ] localStorage `transtaste_user_settings`에서 `disliked_ingredients` 배열 확인

### 4.4 한국어 전환

- [ ] 언어를 한국어로 변경
- [ ] 섹션 제목: "불호 식품"
- [ ] 안내: "알레르기가 아닌 개인적으로 피하고 싶은 재료"
- [ ] placeholder: "입력 후 Enter (예: 고수, 오이)"

### 4.5 Mock 스캔 후 표시 확인

> Mock 모드에서는 Claude가 disliked_ingredients를 반환하지 않으므로 UI에 표시되지 않는 것이 정상입니다.
> 실제 API 호출 시에만 검증 가능한 항목:

- [ ] (참고) 스캔 결과에서 불호 식품 포함 요리 → DishRow에 회색 칩 표시
- [ ] (참고) DishCard 바텀시트 → 😐 "Contains ingredients you dislike: ..." 경고 박스

**대신 확인할 것:**
- [ ] 스캔 API 요청 body에 `dislikedIngredients` 필드 포함되는지 DevTools Network 탭에서 확인
  - 불호 식품 설정된 상태 → 스캔 실행 → `/api/analyze` 요청 Payload에 `dislikedIngredients: ["cilantro", "cucumber"]` 존재

---

## 5. 테스트 환경

### i18n 전환 테스트 순서
1. 프로필에서 한국어 선택 → 프로필 UI 한국어 확인
2. 온보딩에서 언어 전환 확인
3. Travel, Phrases도 한국어 유지 확인

### Mock 모드
`ANTHROPIC_API_KEY` 미설정 → 자동 Mock

### 브라우저 스토리지 초기화
```
DevTools > Application > Storage > Clear site data
```

---

## 6. QA 우선순위

1. **P0:** 1.1~1.2 프로필 i18n 즉시 전환, 2.1~2.2 온보딩 즉시 전환, 4.1~4.4 불호 식품 UI
2. **P1:** 3 API 키 붙여넣기, 4.5 스캔 body 확인
3. **P2:** 1.3 결제 배너 i18n, 기존 Travel/Phrases 한국어 유지 확인

---

## 7. 변경 파일 목록

| 파일 | 변경 |
|------|------|
| `src/lib/i18n/index.ts` | useTranslation에 setLocale 노출 |
| `src/lib/i18n/en.json` | 프로필 25키 + 불호 식품 4키 + dish 1키 추가 |
| `src/lib/i18n/ko.json` | 동일 한국어 번역 추가 |
| `src/app/profile/page.tsx` | i18n 적용 (25키), 언어 변경 시 setLocale, API 키 controlled input, 불호 식품 태그 입력 UI |
| `src/app/onboarding/page.tsx` | 언어 선택 시 handleLanguageChange → setLocale 즉시 반영 |
| `src/lib/ai/provider.ts` | MenuInput에 dislikedIngredients 추가 |
| `src/lib/ai/claude.ts` | 프롬프트에 disliked_ingredients 컨텍스트 추가 |
| `src/lib/types.ts` | DishLite에 disliked_ingredients 필드 추가 |
| `src/app/api/analyze/route.ts` | body에 dislikedIngredients 추가, menuInput에 전달 |
| `src/app/loading-scan/page.tsx` | 사용자 설정(언어, 알레르기, 불호) API body에 포함 |
| `src/components/dish/DishRow.tsx` | 불호 식품 회색 칩 표시 |
| `src/components/dish/DishCard.tsx` | 불호 식품 😐 경고 박스 표시 |
