# TransTaste QA 방침 v3 — Claude Chrome 전달용

> **작성일:** 2026-03-28
> **버전:** v3 (BottomNav 5탭 구조 변경 + QA v2 잔여 수정)
> **대상:** Claude Chrome (브라우저 기반 QA 수행자)
> **앱 URL:** http://localhost:3000 (개발 서버)
> **이전 버전:** QA-policy-chrome-v2.md

---

## 0. 이번 QA의 목적

v2 QA에서 모든 주요 버그가 수정 완료 판정되었다. 이번 v3 QA는 **구조 변경(BottomNav 5탭 + Travel 페이지)의 검증**과 **v2 잔여 Low 이슈 2건 수정 확인**에 집중한다.

### 주요 변경 사항
1. BottomNav: 4탭 → 5탭 `[Home, Travel, Scan, History, Profile]`
2. `/travel` 페이지 신규 추가 (회화집+팁가이드+주문 허브)
3. 홈 Travel Tools 영역 UI 변경 (3칸 그리드 → 컴팩트 배너)
4. 결제 배너 타이머 안정화 (hydration 이후 시작, 6초)
5. 회화집 언어 탭 5개 모두 화면에 표시 (스크롤 불필요)

---

## 1. API 호출 제한

> **총 3회 한도 중 누적 2회 사용 → 잔여 1회**

이번 QA에서는 API 호출이 필요한 검증 항목이 없다. 잔여 1회는 보존.
모든 검증은 **Mock 모드**에서 수행 가능.

---

## 2. BottomNav 5탭 구조 검증 (핵심)

### 2.1 탭 배치 및 동작

**변경 내용:** `[Home, Travel, [Scan], History, Profile]` — Scan이 가운데 CTA 버튼

**검증 절차:**
- [ ] 하단 내비게이션에 5개 탭이 모두 표시되는지 확인
- [ ] 탭 순서: Home → Travel → Scan(가운데, 코랄색 원형 CTA) → History → Profile
- [ ] 각 탭 클릭 시 올바른 페이지로 이동:
  - Home → `/`
  - Travel → `/travel`
  - Scan → `/camera`
  - History → `/history`
  - Profile → `/profile`
- [ ] 현재 페이지의 탭이 활성(코랄색) 표시
- [ ] Scan 버튼이 다른 탭보다 위로 돌출(-mt-5)되어 있고 원형 코랄 배경
- [ ] 5탭이 모바일 뷰포트(375px)에서 겹치거나 잘리지 않는지 확인
- [ ] 탭 라벨 텍스트(Home, Travel, Scan, History, Profile)가 모두 읽을 수 있는 크기

### 2.2 BottomNav 숨김 동작

**기존 규칙:** 카메라, 로딩 스캔, 주문 제시 화면에서 BottomNav 숨김

- [ ] `/camera` 진입 → BottomNav 숨김
- [ ] `/loading-scan` 진입 → BottomNav 숨김
- [ ] `/order/present` 진입 → BottomNav 숨김
- [ ] `/travel` 진입 → BottomNav **표시** (숨기면 안 됨)

---

## 3. Travel 페이지 검증 (`/travel`) — 신규

### 3.1 페이지 레이아웃

- [ ] 헤더: "Travel Tools" 제목 + "Everything you need at the restaurant" 부제
- [ ] Quick Phrase 칩 4개 가로 스크롤:
  - "Water, please" / "Check, please" / "No spicy" / "Allergic to..."
- [ ] 도구 카드 3개 세로 목록:
  - Phrases (💬) → `/phrases`로 이동
  - Tip & Culture (💡) → `/tip-culture`로 이동
  - Order (📋) → `/order`로 이동
- [ ] 각 카드에 이모지 아이콘 + 제목 + 설명 + 화살표(>) 표시
- [ ] Travel Tip 카드 (하단, 주황색 배경)

### 3.2 네비게이션 동작

- [ ] Quick Phrase 칩 탭 → `/phrases`로 이동
- [ ] Phrases 카드 탭 → `/phrases`로 이동
- [ ] Tip & Culture 카드 탭 → `/tip-culture`로 이동
- [ ] Order 카드 탭 → `/order`로 이동
- [ ] 각 하위 페이지에서 BottomNav의 Travel 탭이 비활성 표시 (하위 페이지는 별도 경로)
- [ ] 각 하위 페이지에서 BottomNav Travel 탭 클릭 → `/travel`로 복귀

### 3.3 Travel Tip 카드

- [ ] 기본 상태(스캔 이력 없음): 일반 여행 팁 텍스트 표시
- [ ] `menu_language`가 localStorage에 "ja"로 설정된 경우: 일본 관련 팁 표시
- [ ] `menu_language`가 "ko"인 경우: 한국 관련 팁 표시

---

## 4. 홈 화면 변경 검증 (`/`)

### 4.1 Travel Tools 영역 변경

**변경 내용:** 3칸 그리드(Phrases, Tip Guide, Order) → 컴팩트 배너 링크 1개

- [ ] "Travel Tools" 배너 카드 표시 (🌍 아이콘 + 제목 + 부제 + 화살표)
- [ ] 배너 탭 → `/travel`로 이동
- [ ] 기존 3칸 그리드가 사라졌는지 확인 (Phrases/Tip Guide/Order 개별 링크 제거)

### 4.2 기존 홈 기능 회귀

- [ ] 카메라 CTA 버튼 정상
- [ ] Gallery/URL/Text 버튼 정상 (min-h 44px 유지)
- [ ] 최근 스캔 캐러셀 정상
- [ ] 인기 요리 섹션 정상

---

## 5. v2 잔여 이슈 수정 확인

### 5.1 결제 배너 타이머 안정화

**수정 내용:** `requestAnimationFrame`으로 첫 paint 이후 타이머 시작, 5초 → 6초로 연장

**검증 절차:**
- [ ] `/profile?payment=success` 접근
- [ ] 초록색 배너가 충분히 오래 표시되는지 확인 (체감 5초 이상)
- [ ] 배너 표시 중 X 버튼 클릭 → 즉시 닫힘
- [ ] `/profile?payment=cancelled` 접근 → 주황색 배너 동일하게 동작

### 5.2 회화집 언어 탭 전체 표시

**수정 내용:** `overflow-x-auto` 스크롤 → `flex-1` 균등 배분으로 5개 탭 모두 표시

**검증 절차:**
- [ ] 회화집(`/phrases`) 진입
- [ ] Japanese, Chinese, Thai, Vietnamese, English 5개 탭이 스크롤 없이 모두 보임
- [ ] 각 탭 텍스트가 잘리지 않고 읽을 수 있음
- [ ] 모바일 뷰포트(375px)에서도 5개 탭 모두 표시
- [ ] 각 탭 선택 시 해당 언어의 회화 카드 정상 표시

---

## 6. 테스트 환경

### Mock 모드
`ANTHROPIC_API_KEY` 미설정 시 자동 Mock. 이번 QA는 전체 Mock 모드로 수행 가능.

### 브라우저 스토리지 초기화
```
DevTools > Application > Storage > Clear site data
```

### 모바일 뷰포트
Chrome DevTools > Toggle Device Toolbar > 375px (iPhone SE) 기준

---

## 7. 버그 보고 형식

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

## 8. QA 우선순위

1. **P0 (필수):** 2.1 BottomNav 5탭 배치 + 동작, 3.1~3.2 Travel 페이지 레이아웃 + 네비게이션
2. **P1 (높음):** 4.1 홈 Travel Tools 변경, 2.2 BottomNav 숨김 동작
3. **P2 (보통):** 5.1 결제 배너 타이머, 5.2 회화집 언어 탭
4. **P3 (낮음):** 3.3 Travel Tip 카드 언어별 분기, 4.2 홈 기존 기능 회귀

---

## 9. 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/components/ui/BottomNav.tsx` | Travel 탭 추가, 5탭 간격 조정 |
| `src/app/travel/page.tsx` | **신규** — Travel Tools 허브 페이지 |
| `src/app/page.tsx` | Travel Tools 3칸 그리드 → 배너 링크 |
| `src/app/profile/page.tsx` | 결제 배너 타이머 rAF + 6초 |
| `src/app/phrases/page.tsx` | 언어 탭 flex-1 균등 배분 |
