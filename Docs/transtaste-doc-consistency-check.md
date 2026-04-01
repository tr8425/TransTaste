# Transtaste — 문서 정합성 검토 보고서
> 작성일: 2026-03-30 | 목적: 개발팀 전달 전 최신 결정사항 vs 문서 불일치 확인

---

## 개발 전달용 최신 문서 목록

| 문서 | 최신 버전 | 개발 연관성 |
|---|---|---|
| transtaste-frontend-report-v3.md | v0.5 | ✅ 주요 참조 |
| transtaste-backend-report-v2.md | v0.4 | ✅ 주요 참조 |
| transtaste-content-arch-v4.md | v0.5 | ✅ 주요 참조 |
| transtaste-i18n-strategy-v1.md | v0.1 | ✅ 신규 추가 |
| transtaste-faq-strategy-v1.md | v0.1 | ✅ 신규 추가 |
| transtaste-qa-claude-chrome-v1.md | v0.1 | ✅ 버그 목록 |

구버전 (참조 불필요):
- transtaste-frontend-report.md (v0.1)
- transtaste-frontend-report-v2.md (v0.2)
- transtaste-backend-report.md (v0.1)

---

## 불일치 항목 — 즉시 수정 필요

### 🔴 1. Free 스캔 횟수

| 항목 | 실제 구현 (브리핑) | 문서 |
|---|---|---|
| Free 스캔 횟수 | **7회** | backend-v2, content-arch-v4 → **10회** |

**수정 필요 파일:**
- `transtaste-backend-report-v2.md` line 28
- `transtaste-content-arch-v4.md` line 261

---

### 🔴 2. BottomNav 탭 수

| 항목 | 실제 구현 (브리핑) | 문서 |
|---|---|---|
| BottomNav | **5탭** (Home/Travel/Scan/History/Profile) | frontend-v3 → **3탭** |

**수정 필요 파일:**
- `transtaste-frontend-report-v3.md` line 45, 65, 366

---

### 🔴 3. 알러지 / 식이 신념 무료 이동 — 미반영 문서

이번 세션에서 결정된 페이월 개편이 frontend-v3에는 반영됐으나,
backend-v2와 content-arch-v4에는 미반영.

**결정 내용:**
```
무료 구간으로 이동:
  알러지 4단계 감지 (main/sub/possible/none)
  식이 신념 6종 (비건/할랄/채식/코셔/힌두/금주)

유료 유지:
  맛 프로필 레이더, 상세 재료, 먹는 법
  Fun Fact, 콤보 추천, 싫어하는 재료 감지
```

**수정 필요 파일:**
- `transtaste-backend-report-v2.md` — 크레딧 차감 로직 섹션
- `transtaste-content-arch-v4.md` — result_json Phase 구분 섹션

---

### 🔴 4. 캐싱 설명 오류

이전 문서의 "캐시 히트율 상승 → 마진 극대화" 표현이 부정확.
marketing-v1, audit-v1은 수정됐으나 backend-v2 미확인.

**정확한 내용:**
```
이미지(카메라) 스캔 → 매번 해시 다름 → 캐싱 불가 → 항상 Vision API 호출
캐싱 유효 케이스: URL 입력, 텍스트 입력 (실사용 비중 낮음)
캐싱의 실제 가치: 서버 비용 부분 절감 + hit_count 데이터 축적
"마진 극대화"는 과장된 표현
```

**확인 필요 파일:**
- `transtaste-backend-report-v2.md` line 95 (히트율 60~80% 표기)

---

## 미반영 신규 결정사항 — 개발 액션 필요

### 🟠 5. 이벤트 Phase 2 무료 시스템

backend-v2에 미반영. 개발 구현 필요.

```
서버 사이드 환경변수:
  FREE_EVENT_UNTIL=YYYY-MM-DD
  → 해당 날짜까지 Phase 2 전체 무료
  → 만료 시 자동으로 페이월 복귀
  → 코드 변경 없이 on/off 가능

활용 시점:
  런칭 기념 (1주일)
  황금연휴 / 여름 성수기 / 추석
```

---

### 🟠 6. 온보딩 포지셔닝 슬라이드 추가

frontend-v3에 명시됐으나 구현 여부 미확인.

```
개편 흐름:
  슬라이드 1 — "왜 Transtaste인가" (신규)
  슬라이드 2 — 기능 소개 3가지 (기존)
  슬라이드 3 — 언어/알러지 설정 (기존)

슬라이드 1 내용:
  Google Translate: 번역만
  Transtaste: 번역 + 알러지 경고 + 대안 추천 + 서버와 대화
```

---

### 🟠 7. i18n 미번역 문자열 수정

`transtaste-i18n-strategy-v1.md` 참조. 즉시 수정 필요.

```
미번역 확인 항목:
  "RECENT SCANS" 섹션 타이틀
  "2h ago / Yesterday" 타임스탬프
  Tip & Culture 본문 일부
  에러 메시지 일부

수정 방법:
  타임스탬프 → Intl.RelativeTimeFormat 사용 (한 줄)
  정적 문자열 → i18n 키로 교체
```

---

### 🟠 8. FAQ / 도움말 진입점 추가

`transtaste-faq-strategy-v1.md` 참조. 신규 구현.

```
즉시 (쉬운 것):
  "⚡ 10 scans left" 배지 → 클릭 시 팝오버
  Show to Server 버튼 하단 "실제 결제 아님" 텍스트
  Confirmed 후 목록 초기화 안내
  페이월 블러 영역 힌트 텍스트

단기:
  온보딩 알러지 ⓘ 아이콘
  결제 모달 플랜 추천 가이드
  프로필 하단 "도움말" 링크 + /faq 페이지
```

---

### 🟡 9. Show to Server Confirmed 초기화

frontend-v3에 버그로 등록됨 (line 686). 구현 필요.

```
현재: Confirmed 후 주문 목록 초기화 안 됨
개선: "주문 마쳤나요? 목록을 비울 수 있습니다 [비우기]" 안내
```

---

### 🟡 10. Skip for now 버튼 가려짐

온보딩 2단계에서 BottomNav z-index에 가려짐. 즉시 수정.

```
현재: "Skip for now" 버튼이 BottomNav 뒤에 숨김
수정: padding-bottom 또는 z-index 조정
```

---

### 🟡 11. user-scalable=no 제거

```
현재: maximum-scale=1, user-scalable=no 설정
수정: user-scalable=yes 또는 해당 속성 제거
근거: WCAG 접근성 지침 위반
```

---

## 알려진 Known Issues (우선순위별)

브리핑에서 인지하고 있는 미구현 항목.

| 항목 | 우선순위 | 비고 |
|---|---|---|
| 인증 (실제 로그인) | 🔴 출시 블로커 | 현재 stub만 존재 |
| 크레딧 서버사이드 검증 | 🔴 출시 블로커 | 현재 localStorage만 (우회 가능) |
| API 레이트 리밋 | 🔴 출시 블로커 | /api/analyze 무제한 호출 가능 |
| 공개 랜딩 페이지 | 🔴 출시 블로커 | 앱 셸만 존재 |
| 이용약관 / 면책 고지 | 🔴 출시 블로커 | 변호사 검토 필요 |
| OG 이미지 | 🟠 출시 시 | SNS 공유 시 이미지 없음 |
| FAQ 스키마 | 🟠 출시 시 | GEO 전략 연결 |
| robots.txt 전환 | 🟠 출시 시 | 현재 noindex |
| 스캔 히스토리 URL 고유화 | 🟡 단기 | /results?id=xxx 파라미터 |
| Popular Dishes 클릭 | 🟡 단기 | 현재 반응 없음 |
| 북마크 저장 경로 | 🟡 중기 | 즐겨찾기 기능 구현 필요 |
| 오프라인 지원 | 🟡 중기 | Service Worker 없음 |

---

## 요약

```
문서 수정 필요 (개발팀 참조 전 업데이트):
  Free 10회 → 7회
  BottomNav 3탭 → 5탭
  알러지/식이신념 무료 이동 반영 (backend-v2, content-arch-v4)

신규 구현 필요 (이번 세션 결정):
  이벤트 Phase2 무료 시스템
  온보딩 포지셔닝 슬라이드
  i18n 미번역 문자열
  FAQ 진입점 (단계별)

버그 수정 (QA 기반):
  Confirmed 초기화
  Skip for now 가려짐
  user-scalable 제거
  카메라 뒤로가기 버튼
```
