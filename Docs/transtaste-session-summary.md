# Transtaste — 세션 마무리 정리
> 작성일: 2026-03-28 | 다음 세션 핸드오프용

---

## 현재 상태 한 줄 요약

**v1 구현 완료 + QA 3라운드 통과 + Vercel 배포 직전**
기획 문서 일체 완성. 출시 블로커 항목만 남은 상태.

---

## 다음 세션 시작 방법

브리핑 프롬프트(`transtaste-briefing.md`) + 아래 문서 중 필요한 것 첨부:

| 문서 | 용도 |
|---|---|
| transtaste-frontend-report-v3.md | UX/화면 설계 논의 |
| transtaste-backend-report-v2.md | API/DB/성능 논의 |
| transtaste-content-arch-v4.md | AI 프롬프트/콘텐츠 논의 |
| transtaste-marketing-v1.md | SEO/GEO/수익화 논의 |
| transtaste-audit-v1.md | 리스크/법적 사항 논의 |
| transtaste-planning-log.md | 전체 맥락 파악 |

---

## 즉시 처리 필요 (출시 블로커)

### 1순위 — 오늘
- [ ] Vercel 배포 (소프트 런치, 비공개 URL)
- [ ] 크레딧 서버 사이드 검증 (현재 localStorage만 → 우회 가능)
- [ ] API 레이트 리밋 (/api/analyze 무제한 호출 가능)

### 2순위 — 이번 주
- [ ] 이용약관 + 개인정보처리방침 초안
- [ ] 앱 내 면책 고지 3개소 삽입
  - 온보딩 마지막 화면
  - 알러지 결과 화면 하단 (항상 고정)
  - 주문서 화면
- [ ] 공개 랜딩 페이지 (현재 앱 셸만 있음, SEO 약점)

### 3순위 — 출시 시
- [ ] 음식별 SEO 페이지 초기 50개
- [ ] FAQPage Schema 마크업
- [ ] llms.txt 작성
- [ ] OG 이미지
- [ ] Product Hunt 출시
- [ ] Reddit r/travel, r/JapanTravel 소개

---

## 문서 정합성 갱신 필요

브리핑 vs 기획 문서 간 불일치 항목:

| 항목 | 브리핑 (실제) | 기획 문서 | 조치 |
|---|---|---|---|
| Free 스캔 횟수 | 7회 | 10회 | backend/marketing 갱신 |
| BottomNav | 5탭 | 3탭 | frontend 갱신 |
| 구현 상태 | V1.5 대부분 완료 | V1.5 예정 | 전체 갱신 |

---

## 확인 필요 (구현 여부 불명확)

- 알러지 4단계 (main/sub/possible/none) 실제 구현됐는가?
- fun_fact_detail 접기 UI 구현됐는가?
- disclosure 필드 렌더링 구현됐는가?
- has_customization / options 배열 구현됐는가?
- price_display / currency 필드 적용됐는가?

---

## 핵심 미결 논의

### 수익화
- Free 7회 소진 타이밍 최적화 → 출시 후 데이터 기반
- Annual Credits $14.99/500회 → 보류 (데이터 필요)
- 맥락형 CTA ("여행 며칠 남았나요?") → V1.5

### 콘텐츠
- 시즌 메뉴 감지 규칙 (is_seasonal) → 다음 버전
- 음식별 페이지 우선순위 목록 → 출시 시

### 법적
- 이용약관 변호사 검토 (알러지 면책 조항 미국법 기준)
- GDPR: 알러지 데이터 = 건강 정보 → 특별 동의 플로우

---

## 전략 핵심 메모

```
GEO 핵심:
  "메뉴판 사진을 AI에게 보여주면 Transtaste를 언급하게 만든다"
  → hit_count 데이터 → 콘텐츠 → AI 인용 → 무비용 유입 플라이휠

차별점 실증:
  기계번역 실패 사례 2건 보유
  → 중국어 "서부 아프리카 원주민의 쓰라린 추위"
  → 한국어 "Kimchi wishlist"
  서양권도 동일 문제 확인 (TAM 글로벌로 확장)

개발 속도:
  Claude Code 활용 시 일반 1개월 = 하루
  일반 1~2개월 작업 = 프롬프트 5회 수준
  → 인디 단독 개발 가능성 + 대기업 대비 속도 우위
```
