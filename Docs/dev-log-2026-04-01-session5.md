# TransTaste 개발 로그
> 2026-04-01 세션 5

---

## 세션 요약

UX 감사 리포트 + 마케팅 문서(v1) 대조 기반 전방위 수정.
SEO 블로커 해제, 핵심 차별 기능(대안 메뉴 추천, 서버 대화 프리셋) 구현, PC 스크롤 대응, 스캔 히스토리 캐싱, 대규모 데이터 보강.

**변경**: 25+ files, ~3,000 insertions

---

## 1. SEO/GEO 블로커 해제

### robots: noindex 제거
- `src/app/layout.tsx` — `robots: { index: true, follow: true }`로 변경
- `public/robots.txt` — 전면 Allow + GPTBot/ClaudeBot/PerplexityBot 명시 허용 + `/api/` Disallow + Sitemap 활성화

### llms.txt 수정
- `public/llms.txt` — 무료 스캔 수 7→10 오류 수정

---

## 2. i18n 버그 수정

### 페이월 크레딧 키 오류
- `TripPassPaywall.tsx` — `paywall.pass${keyId}` 패턴이 credits50일 때 `passcredits50`(존재하지 않는 키) 참조
- 키 매핑 로직을 `isPass` 분기로 개선, `paywall.credits50` 정확 참조

---

## 3. PC 수평 스크롤 대응

### HorizontalScroll 컴포넌트 신규
- `src/components/ui/HorizontalScroll.tsx`
- PC(md+): hover 시 좌/우 화살표 버튼, 60% 단위 smooth scroll
- 모바일: 기존 터치 스와이프 유지
- `scroll-snap` + `snap-start` + `ResizeObserver` 실시간 감지

### 적용 위치 (5곳)
| 컴포넌트 | 파일 |
|----------|------|
| 최근 스캔 칩 | `RecentHistory.tsx` |
| 카테고리 필터 | `results/page.tsx` |
| 빠른 회화 칩 | `travel/page.tsx` |
| 카테고리 탭 | `phrases/page.tsx` |
| 국가 선택 | `tip-culture/page.tsx` |

---

## 4. 최근 스캔 결과 캐싱

### 문제
- 히스토리 칩 클릭 → `/results`로 이동 → sessionStorage 비어서 빈 화면

### 해결
- `results/page.tsx` — 스캔 결과 전체를 `localStorage("transtaste_cached_results")`에 캐싱 (최대 10개)
- `RecentScan` 타입에 `resultKey` 필드 추가
- `RecentHistory.tsx`, `history/page.tsx` — 클릭 시 `sessionStorage("scanResultKey")` 설정 후 이동
- `results/page.tsx` — fresh result 없으면 캐시에서 로드

---

## 5. 마케팅 핵심 차별 기능 구현

### 5.1 대안 메뉴 추천 (alternative_dishes)
- **프롬프트**: `claude.ts` Phase 1 lite 스키마에 `alternative_dishes` 필드 추가
- **타입**: `DishLite`에 `alternative_dishes?: string[]` 추가
- **UI**: `DishCard.tsx` — danger/warning 시 초록 배경 "안전한 대안" 칩 표시
- **UI**: `DishRow.tsx` — 리스트 뷰에서 대안 2개 간략 표시
- 무료 사용자에게도 노출 (마케팅 핵심 차별점)

### 5.2 스캔→카트 언어/국가 연결
- `results/page.tsx` — `cart.setMenuLanguage()`, `cart.setCountryDetected()` 호출
- `/order/present` 주문서가 스캔 메뉴의 실제 언어로 표시

### 5.3 주문 페이지 알러지 언어 수정
- `order/page.tsx` — 알러지 라벨 영어 하드코딩 → 감지된 메뉴 언어 기반 표시

### 5.4 회화 템플릿 알러지 동적 연결
- `allergen-i18n.ts` — 17개 알러지 식재료의 6개 언어 이름 매핑 (`ALLERGEN_INGREDIENT_NAMES`)
- `phrases/page.tsx` — `no_ingredient` 템플릿을 사용자 알러지 프리셋 기반 자동 확장
- 예: 갑각류 프리셋 → "エビ・カニを抜きでお願いします" 카드 자동 생성

---

## 6. Mock 데이터 + 데모 모드

### API 키 없을 때 Mock 응답
- `api/analyze/route.ts` — 5개 일본 요리 mock 데이터 (`alternative_dishes` 포함)
- `demo: true` 플래그로 예시 데이터임을 명시

### 데모 배너
- `results/page.tsx` — `data.demo` 시 amber 배너 표시
- ko/en i18n 키 `results.demoBanner` 추가

---

## 7. 대규모 데이터 보강

### 회화 데이터 (phrases-data.ts): 24 → 44개
**+20개 추가 회화:**
- basic: 메뉴 요청, 영어 메뉴, 냅킨, 포크/숟가락
- order: 할랄 확인, 채식 메뉴, 조리시간, 저 테이블 것과 같은 거
- payment: 팁 포함 여부, 영수증
- complaint: 너무 짜요, 주문과 다름
- greeting: 인사, 작별
- other: 사진 허락, 영어 소통, 와이파이, 먹는 법

### 음식 DB (food-database.ts): 5 → 50개
**+45개, 12개 요리권:**
| 요리권 | 수 | 대표 |
|--------|---|------|
| 일본 | 7 | 스시, 텐푸라, 오코노미야키, 규동, 말차라떼 |
| 중국 | 7 | 마파두부, 베이징덕, 샤오롱바오, 궁바오지딩 |
| 베트남 | 4 | 퍼, 반미, 분짜, 고이꾸온 |
| 인도 | 5 | 버터치킨, 비리야니, 도사, 사모사, 차이 |
| 이탈리아 | 5 | 카르보나라, 마르게리타, 리소토, 티라미수 |
| 스페인 | 3 | 파에야, 가스파초, 추로스 |
| 멕시코 | 3 | 타코스, 몰레, 과카몰리 |
| 프랑스 | 3 | 크루아상, 부야베스, 크렘브륄레 |
| 그리스 | 2 | 무사카, 수블라키 |
| 터키 | 2 | 케밥, 바클라바 |
| 한국 | 2 | 김치찌개, 떡볶이 |
| 동남아 | 2 | 사테, 망고 스티키라이스 |

전 카테고리 커버: main, side, soup, noodle, rice, appetizer, dessert, drink

### 국가 가이드 (tip-culture-data.ts): 20 → 35개국
**+15개국:**
- 동아시아: 대만, 홍콩
- 동남아: 캄보디아, 필리핀, 네팔
- 중동: UAE, 이스라엘, 모로코
- 남미: 브라질, 아르헨티나, 페루
- 유럽: 네덜란드, 스위스
- 아프리카: 남아공, 이집트

---

## 8. 마케팅 문서 대비 갭 현황 (세션 후)

| 마케팅 약속 | 이전 | 이후 |
|------------|------|------|
| SEO/GEO 크롤링 | ❌ noindex | ✅ 해제 |
| 대안 메뉴 추천 | ❌ UI 없음 | ✅ 무료 표시 |
| 서버 대화 프리셋 | ❌ 빈칸만 | ✅ 알러지 자동 생성 |
| 주문서 언어 | ❌ 영어 고정 | ✅ 스캔 언어 반영 |
| 음식 페이지 50개 | 5개 (10%) | ✅ 50개 (100%) |
| 국가 가이드 | 20개국 | ✅ 35개국 |
| 회화 | 24개 | ✅ 44개 |
| 페이월 i18n 버그 | ❌ 키 노출 | ✅ 수정 |

---

## 보류 항목

| 항목 | 사유 |
|------|------|
| 동행자 알러지 임시 모드 | 사용자 시뮬레이션 후 결정 |
| Credits L 150회/$3.99 | 초기 데이터 확인 후 추가 |
| 맥락형 CTA | V1.5 목표 |
| 계정 로그인 연동 | V1 필수이나 별도 세션 |
| Mixpanel 연동 | 런칭 시 별도 처리 |

---

*작성: Claude Opus 4.6 | 기준: localhost:3000 로컬 빌드 (v0.2.0)*
