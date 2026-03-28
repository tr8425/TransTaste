# TransTaste QA 방침 v2 — Claude Chrome 전달용

> **작성일:** 2026-03-28
> **버전:** v2 (버그 수정 후 회귀 + 신규 기능 검증)
> **대상:** Claude Chrome (브라우저 기반 QA 수행자)
> **앱 URL:** http://localhost:3000 (개발 서버)
> **이전 버전:** QA-policy-chrome.md (v1)

---

## 0. 이번 QA의 목적

v1 QA에서 발견된 8건의 버그 중 7건을 수정했다. 이번 QA는 **수정 사항의 회귀 검증**과 **신규 기능 검증**에 집중한다. v1에서 정상 확인된 항목은 재검증 대상에서 제외한다.

---

## 1. API 호출 제한 (변경 없음)

> **API Key를 소비하는 모든 기능의 총 호출 횟수는 최대 3회로 제한한다.**
> v1에서 텍스트 분석 1회 사용 → **잔여 2회**

- Mock 모드 우선 사용. 실제 API는 수정된 프롬프트 검증 시에만 사용.
- 텍스트 분석 1회로 #6(원어명 가격 분리) 검증 권장.

---

## 2. 수정 버그 회귀 검증 (필수)

### 2.1 [긴급 수정] 온보딩 ↔ 프로필 설정값 공유 검증

**수정 내용:** 프로필 페이지의 localStorage 키를 온보딩과 동일한 snake_case로 통일
(`outputLanguage` → `output_language`, `allergens` → `allergen_preset`, `dietary` → `dietary_beliefs`)

**검증 절차:**
- [ ] localStorage 초기화 (DevTools > Application > Clear site data)
- [ ] 온보딩 완료: 언어=한국어, 알레르기=Shellfish+Eggs, 식이=Halal 선택 후 저장
- [ ] DevTools에서 `transtaste_user_settings` 키 확인 → `output_language`, `allergen_preset`, `dietary_beliefs` 키 사용 확인
- [ ] 프로필(`/profile`) 진입 → 온보딩에서 선택한 값이 정확히 표시되는지 확인
  - Language: 한국어 선택됨
  - Allergies: Shellfish, Eggs 표시
  - Dietary: Halal 표시
- [ ] 프로필에서 설정 변경 (언어→English, 알레르기에 Soy 추가) → 저장
- [ ] 온보딩을 다시 실행하지 않고 다른 페이지(회화집, 주문 등)에서 변경된 설정 반영 확인

**특히 확인:**
- [ ] 회화집(`/phrases`): 프로필에서 변경한 출력 언어가 반영되는지
- [ ] 주문(`/order`): 프로필에서 추가한 알레르기가 알레르기 배너에 반영되는지

---

### 2.2 [높음 수정] 프로필 알레르기 선택지 14개 동기화

**수정 내용:** 프로필 알레르기 목록을 7개 → 14개(온보딩과 동일)로 확장. 식이 제한도 4개 → 6개로 확장.

**검증 절차:**
- [ ] 프로필(`/profile`) → ALLERGIES "Edit" 클릭
- [ ] 14개 알레르기 항목이 모두 표시되는지 확인:
  Shellfish, Peanuts, Tree Nuts, Milk, Eggs, Fish, Soy, Wheat/Gluten, Sesame, Celery, Mustard, Lupin, Molluscs, Sulphites
- [ ] 각 항목 선택/해제 토글 동작
- [ ] DIETARY "Edit" 클릭 → 6개 식이 제한 항목 확인:
  Vegan, Vegetarian, Halal, Kosher, No Beef (Hindu), No Alcohol
- [ ] 온보딩 14개 항목 목록과 정확히 일치하는지 대조

---

### 2.3 [보통 수정] 결제 성공/취소 피드백 배너

**수정 내용:** `/profile?payment=success|cancelled` 쿼리 파라미터 감지 후 배너 표시 (5초 후 자동 소멸)

**검증 절차:**
- [ ] URL 직접 입력: `http://localhost:3000/profile?payment=success`
  - 초록색 배너 "Payment successful! Your scans have been updated." 표시
  - 5초 후 자동 사라짐
  - X 버튼으로 즉시 닫기 가능
- [ ] URL 직접 입력: `http://localhost:3000/profile?payment=cancelled`
  - 주황색 배너 "Payment was cancelled. No charges were made." 표시
  - 동일한 자동 소멸 + 수동 닫기 동작
- [ ] 일반 `/profile` 접근 시 배너 미표시 확인

---

### 2.4 [보통 수정] LockedBlock 렌더링 개선

**수정 내용:** 잠금 상태에서 detail 미로딩 시 빈 skeleton 대신 샘플 FlavorRadar + Ingredient 칩 + Fun Fact 안내 텍스트를 placeholder로 표시. 자물쇠 아이콘 표시.

**검증 절차 (Mock 모드에서 테스트):**
- [ ] 결과(`/results`) → 아무 요리 탭 → 바텀시트 오픈
- [ ] 잠금 영역에 다음이 블러 처리되어 보이는지 확인:
  - Flavor Profile 레이더 차트 (샘플 데이터)
  - Ingredients 칩 3개 (Main ingredient, Seasoning, Spice)
  - Fun Fact 안내 텍스트
- [ ] 자물쇠 아이콘이 블러 위에 중앙 표시
- [ ] "Unlock flavors, facts & more — $2.99" 버튼 정상 렌더링

---

### 2.5 [보통 수정] 텍스트 분석 시 원어명에서 가격 분리 — [API 사용: 1회 소비]

**수정 내용:** Claude 프롬프트에 "original 필드는 요리명만, 가격 제외" 규칙 추가

**검증 절차 (실제 API 1회 사용):**
- [ ] 홈 → Text 모달 → 다음 텍스트 입력:
  ```
  불고기 18000
  비빔밥 12000
  된장찌개 9000
  ```
- [ ] 결과 확인:
  - `original` 필드: "불고기" (가격 숫자 미포함)
  - `price` 필드: "18000"
  - `price_display` 필드: "₩18,000"
- [ ] 바텀시트에서 요리명과 가격이 분리되어 표시되는지 확인

---

## 3. 신규 기능 검증

### 3.1 [신규] 팁 불필요 국가 안내 배너 + "이번 여행동안 안보기"

**기능 설명:** 팁이 불필요한 국가(Japan, Korea 등) 선택 시 초록색 안내 배너 표시. "Don't show for this trip (7 days)" 클릭 시 7일간 숨김. 프로필에서 재활성화 가능.

**검증 절차:**
- [ ] localStorage 초기화
- [ ] 팁 가이드(`/tip-culture`) 진입 → Japan 탭 선택
- [ ] 초록색 배너 표시 확인:
  - "No tip needed here!" 제목
  - "Tipping is not expected in Japan..." 설명
  - "Don't show for this trip (7 days)" 링크 버튼
- [ ] Korea 탭 전환 → 동일한 배너 표시 (no-tip 국가이므로)
- [ ] USA 탭 전환 → 배너 미표시 (팁 문화 있는 국가) + 팁 계산기 표시
- [ ] Japan 탭 복귀 → "Don't show for this trip (7 days)" 클릭
- [ ] 배너 즉시 사라짐 확인
- [ ] 다른 no-tip 국가(Korea) 전환 → 배너 여전히 숨겨져 있음
- [ ] 페이지 새로고침 → 배너 여전히 숨겨져 있음 (localStorage 확인)
- [ ] DevTools에서 `transtaste_no_tip_dismissed` 키 확인 → 7일 후 날짜가 저장되어 있음

**프로필 재활성화 검증:**
- [ ] 프로필(`/profile`) → "Tip Guide" 섹션 표시 확인
- [ ] "No-tip country info" 설명 텍스트 + "Reset" 버튼 확인
- [ ] "Reset" 클릭
- [ ] 팁 가이드로 이동 → Japan 선택 → 배너 다시 표시됨

**경유 시나리오 (다국가 여행):**
- [ ] 배너를 숨긴 상태에서 USA(팁 필요 국가) → Japan(no-tip) 순서로 전환
- [ ] USA에서는 팁 계산기 정상, Japan에서는 배너 숨김 유지

---

### 3.2 [신규] 홈 버튼 터치 영역 44px 확보

**수정 내용:** Gallery/URL/Text 버튼 및 최근 스캔 캐러셀 항목에 `min-h-[44px]` 적용

**검증 절차:**
- [ ] 홈(`/`) → Gallery/URL/Text 버튼 영역 확인
  - DevTools Elements에서 각 버튼의 computed height ≥ 44px
- [ ] 최근 스캔 캐러셀 항목 확인
  - DevTools Elements에서 각 항목의 computed height ≥ 44px
- [ ] 모바일 뷰포트(375px)에서 버튼 크기가 터치하기 편한지 시각적 확인

---

## 4. v1에서 "코드 이상 없음" 판정 항목 — 재확인

### 4.1 회화집 영어 탭 표시

**v1 판정:** 코드에 English 탭 존재. overflow-x-auto 스크롤 영역 밖에 숨겨져 QA에서 미발견.

- [ ] 회화집(`/phrases`) → 언어 탭 영역을 좌우 스크롤
- [ ] English 탭이 스크롤 시 나타나는지 확인
- [ ] English 선택 → 영어 번역 + 발음 카드 정상 표시

---

## 5. 테스트 환경 설정

### API 호출 배분 계획 (잔여 2회)

| 순서 | 용도 | 입력 | 소비 |
|------|------|------|------|
| 1 | #2.5 원어명 가격 분리 검증 | 텍스트: `불고기 18000\n비빔밥 12000\n된장찌개 9000` | 1회 |
| 2 | 예비 (필요 시 이미지 또는 상세 검증) | — | 1회 |

### 브라우저 스토리지 초기화

테스트 시작 전:
```
DevTools > Application > Storage > Clear site data
```

### Mock 모드

`ANTHROPIC_API_KEY` 미설정 시 자동 Mock. UI/UX 테스트는 Mock 우선.

---

## 6. 버그 보고 형식 (v1과 동일)

```
[심각도] 페이지/기능 — 문제 요약
- 재현 경로: 홈 → ...
- 기대 동작: ...
- 실제 동작: ...
- 스크린샷: (가능하면 첨부)
- 브라우저/디바이스: Chrome / Desktop
```

**심각도:** Critical > High > Medium > Low

---

## 7. QA 우선순위

1. **P0 (필수):** 2.1 설정값 공유, 2.5 원어명 가격 분리
2. **P1 (높음):** 2.2 알레르기 14개 동기화, 2.3 결제 배너, 2.4 LockedBlock
3. **P2 (보통):** 3.1 팁 안내 배너 + 숨기기 + 재활성화, 3.2 터치 영역 44px
4. **P3 (낮음):** 4.1 회화집 영어 탭 스크롤 확인

---

## 8. 변경 파일 목록 (참고)

| 파일 | 변경 내용 |
|------|----------|
| `src/app/profile/page.tsx` | localStorage 키 통일, 알레르기 14개 확장, 식이 6개 확장, 결제 배너, 팁 가이드 설정 섹션 |
| `src/components/dish/DishCard.tsx` | LockedBlock placeholder 콘텐츠 개선 |
| `src/lib/ai/claude.ts` | 프롬프트에 "original은 요리명만" 규칙 추가 (Full, Lite, Detail) |
| `src/app/page.tsx` | Gallery/URL/Text 버튼 min-h-[44px] |
| `src/components/common/RecentHistory.tsx` | 캐러셀 항목 min-h-[44px] |
| `src/app/tip-culture/page.tsx` | no-tip 국가 안내 배너 + 7일 숨기기 기능 |
