# TransTaste QA 방침 v7 — Claude Chrome 전달용

> **작성일:** 2026-03-28
> **버전:** v7 (전체 i18n 확대 적용 검증)
> **대상:** Claude Chrome (브라우저 기반 QA 수행자)
> **앱 URL:** http://localhost:3000 (개발 서버)
> **이전 버전:** QA-policy-chrome-v6.md

---

## 0. 이번 QA의 목적

v6에서 온보딩/프로필/Travel/Phrases에 i18n을 적용했고, v7에서 **나머지 전체 페이지 + 컴포넌트**로 확대했다. 이번 QA는 한국어 전환 시 모든 화면에서 영어가 남아있지 않은지 전수 검증한다.

**API 호출:** 0회 (잔여 1회 보존). Mock 모드.

---

## 1. 테스트 준비

### 한국어 설정 방법
```
DevTools > Console:
localStorage.setItem("transtaste_user_settings", JSON.stringify({
  "output_language": "ko",
  "allergen_preset": ["shellfish", "eggs"],
  "dietary_beliefs": ["halal"],
  "disliked_ingredients": ["고수", "오이"]
}))
```
페이지 새로고침 후 검증.

### 영어 복귀
프로필 > Language > English 선택, 또는:
```
localStorage.setItem("transtaste_user_settings", JSON.stringify({"output_language":"en"}))
```

---

## 2. BottomNav 한국어 (P0)

- [ ] 하단 탭 5개 한국어 표시: "홈" / "여행" / "스캔" / "기록" / "프로필"
- [ ] 영어 전환 시: "Home" / "Travel" / "Scan" / "History" / "Profile"

---

## 3. 홈 화면 한국어 (`/`) (P0)

- [ ] 히어로: "메뉴판을 찍으면, 모든 요리를 이해합니다"
- [ ] 부제: "외국 메뉴판에 카메라를 가리키면 번역, 알레르기, 재미있는 사실을 즉시 확인하세요"
- [ ] 입력 버튼: "갤러리" / "URL" / "텍스트"
- [ ] Travel 배너: "여행 도구" / "회화, 팁, 식사 가이드"
- [ ] 인기 요리: "근처 인기 요리"
- [ ] URL 모달: "메뉴 이미지 URL 붙여넣기" / "불러와서 분석"
- [ ] 텍스트 모달: "요리명 입력" / placeholder에 한국어 / "요리 분석"

---

## 4. 로딩 스캔 한국어 (`/loading-scan`) (P1)

> Mock 스캔으로 확인. 한국어 설정 상태에서 텍스트 분석 실행.

- [ ] 초기 상태: "메뉴를 분석하고 있어요..."
- [ ] 부제: "요리, 맛, 알레르기를 확인하는 중"
- [ ] 요리 발견 후: "{N}개 요리 발견"

---

## 5. 결과 화면 한국어 (`/results`) (P1)

### 카테고리 필터
- [ ] "전체" / "메인" / "국/찌개" / "면" / "밥" / "반찬" / "음료" / "디저트"
- [ ] (영어: "All" / "Main" / "Soup" / "Noodle" / "Rice" / "Side" / "Drink" / "Dessert")

### 알레르겐 태그 한국어
- [ ] Mock 결과의 알레르겐 태그가 한국어로 표시:
  - "대두" (soy), "글루텐" (gluten), "참깨" (sesame), "달걀" (egg) 등
- [ ] (영어 전환 시 "Soy", "Gluten", "Sesame", "Egg")

### 위험도 뱃지 한국어
- [ ] "알레르기" (danger) / "확인 필요" (warning) / "직원 문의" (check)

### 소프트 페이월 한국어 (크레딧 0)
- [ ] "스캔 횟수가 없습니다"
- [ ] "무료 스캔을 모두 사용했습니다. 계속 사용하려면:"

### 에러 상태
- [ ] "문제가 발생했습니다"

---

## 6. 기록 화면 한국어 (`/history`) (P1)

- [ ] 헤더: "스캔 기록"
- [ ] 부제: "최근 메뉴 스캔"
- [ ] 빈 상태: "아직 스캔 기록이 없습니다" / "메뉴를 스캔하면 여기에 기록이 표시됩니다"
- [ ] 버튼: "메뉴 스캔하기"

---

## 7. Trip Pass 모달 한국어 (P2)

- [ ] 프로필 > "스캔 추가 구매" 클릭
- [ ] 모달 제목: "더 알아보고 싶으세요?"
- [ ] 부제: "맛 프로필, 재미있는 사실, 먹는 방법 잠금 해제"
- [ ] 건너뛰기 버튼: "건너뛰기"
- [ ] 하단 문구: "일회성 결제 · 구독 없음 · 즉시 이용"

---

## 8. 영어 전체 복귀 확인 (P2)

- [ ] 프로필에서 English 선택
- [ ] 위 모든 페이지 순회 → 영어로 복귀 확인
- [ ] BottomNav, 알레르겐 태그, 카테고리 필터, 위험도 뱃지 모두 영어

---

## 9. 아직 미적용 페이지 (영어 유지 정상)

> 아래 페이지는 i18n 미적용. 영어가 표시되는 것이 현재 정상.

- `/camera` — 카메라 촬영/갤러리 화면
- `/order` — 주문 상세 (일부)
- `/order/present` — 서버 보여주기 (menu_language 기반, i18n 대상 아님)
- `/foods/*`, `/guide/*` — SEO 콘텐츠 (영어 고정)
- `/terms`, `/privacy` — 법적 문서 (영어 고정)

---

## 10. QA 우선순위

1. **P0:** 2 BottomNav, 3 홈 전체
2. **P1:** 4 로딩 스캔, 5 결과 (필터+태그+뱃지+페이월), 6 기록
3. **P2:** 7 모달, 8 영어 복귀 전체

---

## 11. 변경 파일

| 파일 | 변경 |
|------|------|
| `src/lib/i18n/en.json` | nav, allergens, dietary, categories, flavor, risk 키 추가 |
| `src/lib/i18n/ko.json` | 동일 한국어 번역 추가 |
| `src/components/ui/BottomNav.tsx` | useTranslation, 탭 라벨 t() |
| `src/components/dish/AllergyTag.tsx` | useTranslation, 알레르겐 이름 번역 |
| `src/components/dish/DishRow.tsx` | useTranslation, 위험도 뱃지 t() |
| `src/components/paywall/TripPassPaywall.tsx` | useTranslation, 제목/부제/문구 t() |
| `src/app/page.tsx` | useTranslation, 홈 전체 문자열 |
| `src/app/loading-scan/page.tsx` | useTranslation, 상태 메시지 |
| `src/app/results/page.tsx` | useTranslation, 필터/에러/페이월 |
| `src/app/history/page.tsx` | useTranslation, 전체 문자열 |
