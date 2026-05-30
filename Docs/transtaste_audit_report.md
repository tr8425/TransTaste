# TransTaste 종합 감사 & 개선 로드맵

> 작성 기준: 직접 브라우저 탐색 + 경쟁사 리서치 (2026년 5월)  
> 대상 URL: https://transtaste.vercel.app  
> 버전: v0.2.0

---

## 목차

1. [서비스 현황 요약](#1-서비스-현황-요약)
2. [시장 및 경쟁 환경](#2-시장-및-경쟁-환경)
3. [경쟁사 벤치마킹](#3-경쟁사-벤치마킹)
4. [페이지별 상세 감사](#4-페이지별-상세-감사)
5. [버그 및 이슈 목록](#5-버그-및-이슈-목록)
6. [개선 방안 — UX / 기능](#6-개선-방안--ux--기능)
7. [개선 방안 — 수익화 구조](#7-개선-방안--수익화-구조)
8. [개선 방안 — 마케팅 채널](#8-개선-방안--마케팅-채널)
9. [우선순위 실행 계획](#9-우선순위-실행-계획)

---

## 1. 서비스 현황 요약

| 항목 | 내용 |
|------|------|
| 서비스명 | TransTaste — Travel Menu Translator |
| 기술 스택 | Next.js / Vercel (추정) |
| 현재 버전 | v0.2.0 |
| 상태 | 개발 중단 (v0.2.0에서 멈춤) |
| 수익화 | Freemium — 기본 5회 무료 스캔 |
| 핵심 기능 | 카메라/갤러리/URL/텍스트 입력 → AI 메뉴 번역 + 알레르기 + 칼로리 |
| 부가 기능 | Phrasebook (8개 언어), Tip & Culture 가이드 (30개국+), 히스토리, 프로필 |
| 플랫폼 | 웹 전용 (PWA 지원) |
| 커스텀 도메인 | transtaste.app (OG 태그 기준, 실제 연결 여부 확인 필요) |

### 강점 (유지해야 할 것)

- 메뉴 번역 + 회화 Phrasebook + 팁/문화 가이드를 하나로 묶은 **올인원 번들**이 경쟁사에 없는 차별점
- Phrasebook에 "Server might say" 예상 응답까지 포함한 실용적인 대화 구성 (8개 언어 동일 품질)
- 스캔 결과 화면 완성도가 예상보다 높음 — 발음 가이드, 칼로리, 알레르기 태그, 카테고리 필터 탭 구현
- 프로필에 알레르기, 식이 선호, 싫어하는 재료, 환율 자동감지까지 세팅 구조 존재
- 웹앱이라 설치 없이 바로 사용 가능, 30% 앱스토어 수수료 없음

---

## 2. 시장 및 경쟁 환경

### 시장 규모

| 시장 | 2025 규모 | CAGR | 2033~2035 전망 |
|------|----------|------|--------------|
| 번역 앱 전체 | $15B | 18% | $50B (2033) |
| AI 번역 서비스 | $5.2B | 25.6% | $50.7B (2035) |
| 여행 앱 전체 | $14B | 15.6% | $64B (2035) |
| 여행 앱 다운로드 | 4.2B 건 | — | — |

### 수익화 시장 시그널

- 2024년 전체 앱 매출 $127B 중 **구독 앱이 48% 차지** (전체 앱의 5%만 구독)
- 2025년 AI 앱 IAP 매출 **+254% YoY**, $5B 돌파
- 상위 1% 앱이 전체 IAP 수익의 92.2% 독식 → 틈새라도 상위권 진입 시 의미 있는 수익 가능
- 인디 솔로 개발자도 여행 특화 앱으로 $10K MRR 달성 사례 존재

### 주요 리스크

- Google Lens가 2025년 4월 메뉴 번역 기능을 대폭 강화, 100+ 언어, 완전 무료
- "단순 번역" 포지션으로는 구글과 경쟁 불가 → **음식 설명 + 알레르기 + 문화 맥락** 레이어가 존재 이유

---

## 3. 경쟁사 벤치마킹

### 서비스별 핵심 지표

| 서비스 | 플랫폼 | 평점 | 다운로드 | 수익화 | 특징 |
|--------|--------|------|---------|--------|------|
| **TransTaste** | 웹 (PWA) | — | 측정 불가 | 5회 무료 + 페이월 | 올인원, 웹 전용 |
| Menu Translator App | iOS + Android | iOS 4.1 / Android 4.7 | — | Freemium | 2024.09 출시, 활발한 업데이트 |
| Kuli Kuli | iOS + Android | iOS 4.53 | **2.5M+** | IAP 구독 | 중국계, TikTok UGC 성장 |
| MenuGuide AI | iOS + Android | — | — | IAP 구독 | 솔로 인디, "현지어 주문 전송" |
| Waygo | iOS + Android | 4.6 (수천 리뷰) | — | $4.99 언락 | 오프라인, 레거시 |
| Google Lens | iOS + Android + Web | 4.6~4.8 | 5억+ MAU | 완전 무료 | 2025년 강화, 범용 |

### 기능 비교 매트릭스

| 기능 | TransTaste | Menu Translator | Kuli Kuli | MenuGuide AI | Waygo | Google Lens |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| 카메라 메뉴 스캔 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 음식 상세 설명 | ✓ | ✓ | ✓ | ✓ | — | — |
| 알레르기 경고 | △ 기본 | ✓ | ✓ | ✓ | — | — |
| 스캔 히스토리 저장 | ✓ (버그) | ✓ | — | — | — | — |
| 오프라인 작동 | — | — | — | — | ✓ | ✓ (팩) |
| 회화 Phrasebook | **✓ 상세** | — | — | — | — | — |
| 팁/문화 가이드 | **✓ 30국+** | — | — | — | — | — |
| 현지어 주문 전송 | △ 미완성 | — | — | ✓ | — | — |
| 칼로리 추정 | ✓ | ✓ | — | — | — | — |
| 음식 사진 표시 | — | ✓ | ✓ | ✓ | △ 중문만 | — |
| 발음 가이드 | ✓ | ✓ | ✓ | — | ✓ | — |
| 웹 앱 (브라우저) | **✓** | — | — | — | — | — |
| 핸드라이팅 인식 | ? | ✓ | ✓ | — | ✓ | △ |
| 다국어 프로필 알레르기 | ✓ 기초 | ✓ | ✓ | ✓ | — | — |
| 현지 환율 변환 | ✓ | ✓ | — | ✓ | — | — |
| Flavor 레이더 차트 | **✓** | — | — | — | — | — |
| Combo 추천 | **✓** | — | — | — | — | — |

**TransTaste 독점 기능:** Phrasebook (서버 응답 포함), 팁/문화 30국+, Flavor 레이더 차트, Combo 추천

### 경쟁사에서 배울 점

#### Kuli Kuli — 성장 전략

- **TikTok UGC 자연 발생**: 유저가 자발적으로 "kulikuli is the most useful app 🍙 #travelhacks" 영상을 올림. 광고비 0원으로 2.5M+ 다운로드 달성
- **앱스토어 릴리즈 노트 스토리텔링**: "TRAVEL LOG #6 The clouds hid the moon..." 식의 감성 문장으로 업데이트 노트를 작성 → 브랜드 개성 + 재방문 유인
- **기능 확장으로 세그먼트 확대**: 코스메틱 번역, Omikuji 번역 등 J-뷰티/여행 덕후 세그먼트 진입 → 각 기능이 새로운 ASO 키워드 채널

#### Menu Translator App — 운영 전략

- **유저 피드백 2주 내 패치**: 카메라 클릭음 불만 → 2주 안에 수정 릴리즈. 빠른 대응이 Google Play 4.7 유지의 핵심
- **랜딩페이지 SEO**: 별도 웹사이트(menutranslatorapp.com)에 여행 블로거 추천사, 구체적 사용 사례 삽입
- **반면교사**: Instagram 175포스트에 팔로워 22명 → SNS 직접 운영은 초기 ROI 극히 낮음

#### MenuGuide AI — 포지셔닝 전략

- "현지어로 주문 대신 전송" 기능을 전면에 내세워 경쟁사에 없는 USP 포지셔닝
- 앱스토어 카피라이팅 집중: "One tap, and MenuGuide AI does everything for you. It even orders in the local language."
- 무료 제공량 A/B 테스트: "50% more free content (12 items per menu)" 업데이트로 전환율 최적화

#### Waygo — 레거시 교훈

- 2012~2014년 SXSW 수상, TechCrunch/NBC 미디어 커버리지로 쌓은 인지도가 2025년 현재도 롱테일 유입 중
- **"오프라인 translation"** 키워드 독점 → 기능 자체가 ASO 마케팅
- 업데이트 중단 후 신규 마케팅 없이도 인지도만으로 생존 → 초기 브랜딩의 중요성

---

## 4. 페이지별 상세 감사

### `/` 홈

**확인된 내용**
- 헤더: "TransTaste" 로고 + 스캔 카운터 (현재 5 scans left)
- 중앙 CTA: 카메라 버튼 (크고 명확)
- 보조 입력: Gallery / URL / Text 3가지 모드
- Recent Scans 섹션 (개발 더미 데이터 51일 전 노출 중)
- Popular Dishes Nearby (Pho Bo, Omakase, Tom Yum, Xiao Long Bao 하드코딩)
- 하단 네비: Home / Travel / Camera(CTA) / History / Profile

**문제점**
- 첫 화면에서 "5 scans left" 카운터가 바로 노출 → 경험 전 제약 인식
- "Popular Dishes Nearby"가 위치 권한 없이 하드코딩으로 표시 → "Nearby"라는 단어 허위
- Recent Scans에 51일 전 개발 더미 데이터 노출 (신규 유저가 보면 혼란)
- 스캔 결과가 얼마나 좋은지 미리 볼 수 없음 → 첫 인상에서 가치 제안 전달 실패

---

### `/camera` 카메라 스캔

**확인된 내용**
- 데스크탑에서 카메라 없음 → fallback: "Camera not available / Choose from Gallery" 처리
- 플래시 버튼, 갤러리 버튼, 셔터 버튼 UI 존재

**문제점**
- 카메라 없음 상태에서도 플래시 아이콘 노출 → 동작 안 하는 UI 요소
- 카메라 권한 요청 전 사전 설명 없음

---

### `/loading-scan` 로딩

**확인된 내용**
- 귀여운 음식 이모지 애니메이션 + "Analyzing your menu... / Identifying dishes, flavors & allergens"
- 로딩 중 food trivia 카드 표시

**문제점**
- 일본 음식(Ramen, Gyoza, Karaage) 스캔 시 "Kimchi has over 200 varieties across Korea" 출력 → 무관한 팁
- 팁이 스캔 언어/국가에 맞게 필터링되지 않음

---

### `/results` 스캔 결과

**확인된 내용**
- 상단: "Menu Results / 3 dishes found · Japanese" + 언어 레이블
- 카테고리 필터 탭: All / Main / Soup / Noodle / Rice / Side / Drink
- 각 음식 카드: 이모지/아이콘 + 이름 + 번역명 + 발음 + 칼로리 + 알레르기 태그 + (+) 버튼
- 카드 클릭 시 상세 팝업: 이름, 어원 설명, 한 줄 설명, 현지명, 발음 (🔊 아이콘), 가격대, 카테고리, 칼로리, 알레르기 배지 + "AI-generated info" 주의 문구
- 상세 팝업 하단: Flavor 레이더 차트 + 상세 설명 텍스트 → **blur + 잠금 처리**
- "Unlock flavors, facts & more — $2.99" + "7-Day Trip Pass · One-time payment"
- "Add to Order" 버튼 (하단)
- Combo Recommendations 버튼 → 클릭 시 블러 처리된 조합 추천 2개 노출 + "Hide Combos" 토글
- 우측 상단: "Japanese Ramen" 레이블 (스캔 세션 식별용)

**긍정적 평가**
- 결과 화면 자체의 완성도가 예상보다 높음
- Flavor 레이더 차트, Combo 추천은 경쟁사에 없는 독자적 기능
- 알레르기 AI 면책 문구 포함으로 법적 리스크 관리

**문제점**
- 잠긴 콘텐츠가 정확히 무엇인지 unlock 전에 알 수 없음 ("flavors, facts & more"만 표시)
- "Add to Order" 클릭 시 동작 미확인 (/order 페이지 미구현 상태와 연동 의심)
- 음식 사진 없음 → 경쟁사 대비 시각적 임팩트 부족

---

### `/history` 히스토리

**확인된 내용**
- "Scan History / Your recent menu scans" 헤더
- 각 항목: 이모지/아이콘 + 원어 이름 + 번역명 + 경과 시간
- 방금 스캔한 3개(1분 전) + 51일 전 개발 더미 데이터 다수

**심각한 버그**
- **중복 저장 버그**: 唐揚げ가 5번, 海老フライ가 5번 이상 반복 출현
- **번역 일관성 없음**: 동일 음식이 영어 번역, 한국어 번역, 히라가나 원문 등 제각각으로 저장
- 더미 데이터 51일 전 항목이 실제 유저 히스토리처럼 노출 (초기화 미처리)
- 개별 항목 삭제 기능 없음 (전체 삭제도 없음)
- 히스토리 항목 클릭 시 결과 페이지로 이동되는지 미확인

---

### `/profile` 프로필

**확인된 내용**
- 스캔 카운터 (4 scans left) + **"Get More Scans"** CTA 버튼
- LANGUAGE 섹션: "I speak" (English) / "Menu language" (Auto-detect) / "Home Currency" (₩ KRW, 자동감지)
- ALLERGIES: Shellfish, Celery 태그 + Edit 링크
- DIETARY PREFERENCES: "No dietary preferences selected" + Edit 링크
- DISLIKED INGREDIENTS: 자유 입력 텍스트필드 (e.g. cilantro, cucumber)
- TIP GUIDE: "Show banner when visiting countries where tipping isn't expected" + Reset 버튼
- **API KEY**: "Use your own Anthropic API key for unlimited scans" + 마스킹 입력필드 (이미 값 입력됨) + "Stored locally on your device only. Never sent to our servers."
- ACCOUNT: "Not signed in" + Sign In 링크
- 하단: TransTaste v0.2.0 / Terms / Privacy

**문제점**
- API KEY 필드가 일반 유저 프로필 페이지에 노출 → 비개발자에게 혼란, 개발용 기능이 프로덕션에 노출
- "Get More Scans" 버튼이 실제로는 콘텐츠 잠금 해제 플랜(Flavor/Facts)을 판매 → 버튼 레이블과 실제 기능 불일치
- 플랜 설명에 "스캔 횟수 추가" 옵션이 없어서 유저가 스캔을 늘리려면 어떻게 해야 하는지 불명확
- Sign In 기능이 있는데 로그인 시 무엇이 달라지는지 안내 없음
- 알레르기 설정이 스캔 결과에 어떻게 반영되는지 연결고리 설명 없음

---

### 결제 모달 (Get More Scans 클릭 시)

**확인된 내용**
- "Want to explore deeper?" 헤더
- 3가지 플랜:
  - **TRAVELER PICK**: 7-Day Trip Pass — $2.99 "Perfect for a week-long trip"
  - 30-Day Trip Pass — $5.99 "For the extended explorer"
  - 50 Credits — $1.99 "Pay as you go"
- "One-time payment · No subscription · Instant access"

**문제점**
- "50 Credits"가 스캔 50회인지, 상세 조회 50회인지 불명확
- 스캔 카운터(5 scans left)와 콘텐츠 잠금(Flavor/Facts)이 별개 개념인데 하나의 플랜으로 통합 → 유저가 뭘 사는지 혼란
- 결제 후 실제로 어떻게 달라지는지 미리 볼 수 없음 (기능 비교 미제공)
- 구독 없음(No subscription)은 강점인데 더 강조되어야 함

---

### `/travel` 트래블 허브

**확인된 내용**
- Quick phrase 버튼: 💧Water / 💳Check / 🌶️No spicy / ⚠️Allergic to... → 모두 /phrases로 이동
- 3개 섹션 카드: Phrases / Tip & Culture / Order
- 하단 Travel Tip: "Take a photo of your hotel's address in the local language..."

**문제점**
- Order 카드 → /order 클릭 시 빈 페이지 (기능 미구현 상태로 링크 살아있음)
- Travel Tip이 매번 동일한 하드코딩 문구 → 재방문 유인 없음
- 팁 내용이 메뉴 번역과 무관 (호텔 주소 사진)

---

### `/phrases` 레스토랑 Phrasebook

**확인된 내용**
- 8개 언어 탭: Japanese / Chinese / Thai / Vietnamese / Spanish / French / Italian / English
- 카테고리 탭: Basics / Ordering / Payment / Issues / Greetings / Other
- 각 문구: 영어 설명 + 현지어 + 발음 로마자 + "Server might say" 예상 응답 2개 (일본어, 스페인어 동일 수준)
- 즐겨찾기 별표 아이콘 (각 문구)

**문제점**
- **탭 레이블 잘림**: "Japanes" (Japanese에서 e 누락), "Vietname" (Vietnamese에서 se 누락) — overflow truncation 버그
- 발음 가이드 🔊 아이콘 실제 오디오 재생 여부 미확인
- 메타 설명 "5 Asian languages"인데 실제 탭은 8개 언어 (SEO 불일치)
- Greetings, Other 탭 내용 품질 미확인

---

### `/tip-culture` 팁 & 문화 가이드

**확인된 내용**
- 34개국 탭 (🇯🇵🇰🇷🇨🇳🇹🇭🇻🇳🇺🇸🇬🇧🇫🇷... 등)
- 각 국가: 팁 기준 + 식당 문화 배지 + 식사 에티켓 + 영업시간 + "Good to know" 리스트
- 일본 탭 품질 예시: "No tip", 자유 물/유료 구분, 젓가락 예절, 라스트 오더 안내 등 상세

**긍정적 평가**
- 경쟁사 중 이 수준의 문화 가이드를 제공하는 서비스 없음 → 핵심 차별점
- 한국어 번역 포함 (한국 유저 타겟 의식)

---

## 5. 버그 및 이슈 목록

### Critical (서비스 신뢰도에 즉각 영향)

| # | 위치 | 내용 | 영향 |
|---|------|------|------|
| C-1 | /history | 唐揚げ, 海老フライ 등 동일 항목 5번+ 중복 저장 | 히스토리 사용 불가 수준 |
| C-2 | /travel → /order | Order 페이지 완전 빈 상태인데 링크 살아있음 | 빈 페이지 노출, 미완성 인상 |
| C-3 | /results | "Add to Order" 버튼 → 미구현 페이지 연결 의심 | 핵심 전환 경로 단절 |

### High (UX 및 전환율에 큰 영향)

| # | 위치 | 내용 | 영향 |
|---|------|------|------|
| H-1 | / 홈 | "5 scans left" 첫 화면 상단 노출 | 경험 전 제약 인식 |
| H-2 | / 홈 | Recent Scans 51일 전 더미 데이터 노출 | 신뢰도 저하 |
| H-3 | / 홈 | "Popular Dishes Nearby" 하드코딩 (위치 무관) | "Nearby" 허위 문구 |
| H-4 | /profile | "Get More Scans" 버튼이 스캔 추가가 아닌 콘텐츠 잠금 해제 판매 | 버튼 의미 불일치 |
| H-5 | /profile | API KEY 필드 일반 유저에게 노출 | 비개발자 혼란, 키 노출 리스크 |
| H-6 | 결제 모달 | 스캔 횟수와 콘텐츠 잠금이 같은 플랜으로 통합 | 유저가 뭘 사는지 모름 |
| H-7 | OG 태그 | og:image URL이 transtaste.app 참조 → 연결 여부 불명 | SNS 공유 썸네일 404 위험 |

### Medium (품질 및 완성도)

| # | 위치 | 내용 | 영향 |
|---|------|------|------|
| M-1 | /phrases | "Japanes", "Vietname" 탭 레이블 truncation 버그 | 비전문적 인상 |
| M-2 | /loading-scan | 스캔 언어와 무관한 팁 출력 (일본→한국 김치 팁) | 사소하지만 맥락 없음 |
| M-3 | /travel | Travel Tip 하드코딩 단일 문구 | 재방문 유인 없음 |
| M-4 | /results | 음식 사진 없음 | 경쟁사 대비 시각 임팩트 부족 |
| M-5 | /phrases 메타 | "5 Asian languages" 설명 ≠ 실제 8개 언어 탭 | SEO 불일치 |
| M-6 | /history | 개별/전체 삭제 기능 없음 | 히스토리 관리 불가 |
| M-7 | /results | 잠긴 콘텐츠 미리보기 없음 (뭘 잠금해제하는지 모름) | 결제 전환율 저하 |

### Low (폴리시)

| # | 위치 | 내용 |
|---|------|------|
| L-1 | /camera | 데스크탑 카메라 없음 상태에서 플래시 버튼 노출 |
| L-2 | /profile | Sign In 시 달라지는 점 안내 없음 |
| L-3 | 결제 모달 | "50 Credits" 크레딧 단위 불명확 |

---

## 6. 개선 방안 — UX / 기능

### 6-1. 홈 화면 개선

**문제**: 스캔 카운터 조기 노출, 더미 데이터, 허위 Nearby, 결과 미리보기 없음

**개선안**

```
기존: 첫 화면 상단 "5 scans left" 고정 노출
개선: 첫 스캔 후부터만 표시, 또는 스캔 버튼 하단 소형 텍스트로 이동

기존: "Popular Dishes Nearby" 하드코딩
개선 A: "Popular Dishes to Try" 문구 변경 (5분 fix)
개선 B: 실제 위치 기반 구현
개선 C: 섹션 제거 → "How It Works" 3단계 설명으로 대체

기존: Recent Scans에 51일 전 더미 데이터
개선: 첫 방문 시 "스캔하면 여기 기록됩니다" 플레이스홀더 표시, 실제 스캔 후 표시

신규 추가: 홈에 스캔 결과 미리보기 예시 섹션
  → "이런 결과가 나와요" 실제 스크린샷 + Flavor 차트 샘플
  → 경쟁사 Kuli Kuli: 앱스토어 스크린샷으로 결과 화면 선보임
```

### 6-2. 히스토리 중복 버그 수정

**문제**: 동일 항목 5번+ 중복 저장, 번역 언어 혼재

**개선안**

```javascript
// 저장 전 중복 체크 로직 추가
// dish 이름(원어) + 스캔 세션 ID 기준으로 중복 제거
// 번역 언어를 프로필 "I speak" 설정 기준으로 고정

// 추가 필요 기능:
// - 개별 항목 스와이프 삭제 (모바일 UX 표준)
// - 전체 삭제 옵션
// - 히스토리 항목 클릭 → 기존 결과 페이지 재조회
// - 경쟁사 Menu Translator App: 스캔 히스토리를 가장 호평받는 기능으로 운영
```

### 6-3. 결과 화면 보강

**문제**: 음식 사진 없음, 잠긴 콘텐츠 미리보기 없음

**개선안**

```
음식 사진 추가:
  - Open Food Images API 또는 Unsplash food 카테고리 연동
  - 경쟁사 Menu Translator App, Kuli Kuli, MenuGuide AI 모두 음식 사진 제공
  - 사진 없으면 아이콘+이름만으로 경쟁력 부족

잠긴 콘텐츠 미리보기:
  - 기존: 전체 blur + 자물쇠 아이콘
  - 개선: Flavor 차트를 50% 노출 (희미하게) + "Full flavor profile unlocked"
  - 설명 텍스트 첫 문장만 노출 후 "..."으로 자름
  - 경쟁사 MenuGuide AI: "50% more free content" 업데이트로 전환율 최적화

Add to Order 기능:
  - /order 페이지 구현 후 연결
  - 또는 단기: "Add to Order" → 장바구니 역할 (선택 목록 저장)
  - 최종: MenuGuide AI처럼 "현지어로 선택 메뉴 카드 생성 → 직원에게 보여주기"
```

### 6-4. /order 페이지 구현 또는 임시 처리

**단기 (1일)**: /travel 페이지의 Order 링크를 `display:none` 또는 "Coming Soon" 처리

**중기 (1~2주)**: 기본 Order 빌더 구현
```
1. 결과 화면에서 (+) 버튼 → 주문 리스트에 추가 (이미 (+) 버튼 존재)
2. /order 페이지: 선택된 메뉴 목록 표시
3. "현지어 주문 카드 생성" 버튼 → 직원에게 보여줄 카드 화면
4. 벤치마크: MenuGuide AI의 "It even orders in the local language" 기능
```

### 6-5. Profile 페이지 정리

**API KEY 필드 처리**
```
단기: 숨기거나 "Developer Settings" 접힘 섹션 하단으로 이동
중기: 자체 API 키 사용 = 무제한 스캔으로 명확히 안내
      (개발자 or power user 대상 옵션으로 포지셔닝)
```

**알레르기-스캔 연결 명시**
```
기존: Allergies 섹션 Edit 링크만 있음
개선: "설정한 알레르기가 스캔 결과에 자동 경고로 표시됩니다" 안내 문구 추가
     → 설정의 가치를 알아야 설정함
```

**Sign In 혜택 명시**
```
기존: "Not signed in / Sign In" 링크만
개선: "로그인하면 히스토리가 기기 간 동기화됩니다" 등 혜택 명시
     → 로그인 전환 유도
```

### 6-6. Phrases 탭 truncation 수정

```css
/* 기존: 탭 텍스트 overflow 없이 잘림 */
/* 개선안 A: 국기 + 축약어 사용 */
🇯🇵 JP  /  🇨🇳 CN  /  🇹🇭 TH  /  🇻🇳 VN  /  🇪🇸 ES  /  🇫🇷 FR  /  🇮🇹 IT  /  🇬🇧 EN

/* 개선안 B: 가로 스크롤 탭 (overflow-x: auto) */
/* 벤치마크: 대부분의 모바일 다국어 앱이 가로 스크롤 탭 사용 */
```

### 6-7. 로딩 팁 맥락화

```javascript
// 기존: 랜덤 팁 (스캔 내용 무관)
// 개선: 감지된 언어/국가 기준 팁 필터링
const tipsByLanguage = {
  ja: ["일본 식당에서 맨 먼저 나오는 물은 무료입니다", "..."],
  zh: ["중국 식당에서 팁은 필요 없습니다", "..."],
  // ...
}
```

### 6-8. 음식 사진 추가 (벤치마크 기반)

경쟁사 현황:
- Menu Translator App: 시각 미리보기 핵심 기능
- Kuli Kuli: 중국어 음식 사진 제공
- MenuGuide AI: "See images of each dish right on your screen" 마케팅 포인트

구현 방안:
- Unsplash API (무료, food 카테고리)
- 음식명 → Google Images 검색 + 캐시
- AI 생성 음식 일러스트 (DALL-E 등)

---

## 7. 개선 방안 — 수익화 구조

### 현재 구조의 문제

```
현재 상황:
  스캔 카운터 (5 scans left) ← 무엇을 위한 제한인가?
  Flavor/Facts 잠금 ($2.99) ← 무엇을 위한 잠금인가?
  → 두 개념이 혼재되어 유저가 뭘 사야 하는지 모름
```

### 개선된 수익화 구조 제안

```
Free 티어 (현재 유지):
  - 기본 스캔 5회/일 (or 영구 5회 → 일별 리셋으로 변경 권장)
  - 번역 + 알레르기 + 칼로리 기본 정보
  - Phrasebook, Tip Guide 무제한 (콘텐츠 유인)

Traveler Pass (일회성, 여행 전 구매 타겟):
  - 7일 $2.99 (현행 유지) — "Perfect for a week-long trip"
  - 30일 $5.99 (현행 유지) — "For the extended explorer"
  - 포함: 무제한 스캔 + Flavor 차트 + Combo 추천 + 상세 설명 + Order 빌더

Credit Pack (가끔 여행하는 유저):
  - 50 Credits $1.99 (현행 유지, 단 "크레딧 = 프리미엄 스캔 1회"로 명확화)

--- 중기 추가 검토 ---
Pro 구독 ($3.99~4.99/월):
  - 무제한 스캔 + 전체 기능 + 기기 간 히스토리 동기화
  - 경쟁사 대비: 구독 앱이 전체 앱 5%지만 수익 48% 차지
```

### 결제 모달 개선

```
현재: 무엇을 unlock하는지 설명 부족
개선:
  1. 잠긴 콘텐츠 미리보기 → "이런 게 열립니다" 예시 이미지
  2. 3개 플랜 비교표 (기능 체크 표)
  3. "No subscription" 강조 → 여행 전 일회성 구매 심리에 맞음
  4. 첫 결제 유저 대상 "First trip discount" 이벤트 가격 검토
```

---

## 8. 개선 방안 — 마케팅 채널

### 채널별 효과 및 TransTaste 적용 가능성

| 채널 | 비용 | 유입 속도 | 지속성 | 적용 전략 |
|------|------|---------|--------|---------|
| ProductHunt 런칭 | 0 | 런칭일 폭발 | 단기 | **즉시 실행** — 웹앱이라 설치 불필요, 기술 커뮤니티 피드백 + 백링크 |
| Reddit 여행 커뮤니티 | 0 | 중간 | 장기 | r/solotravel, r/japantravel 등 진심 답변으로 자연 소개 |
| SEO (웹) | 0 | 느림 | 장기 | "일본 식당 메뉴 읽는 법" 등 여행 콘텐츠 → transtaste 내 쌓기 |
| TikTok 데모 영상 | 소액 | 빠름 | 중간 | 실제 식당 스캔 30초 데모, 마이크로 인플루언서 협찬 |
| 여행 블로그 리뷰 | 낮음 | 중간 | 길음 | 이메일 아웃리치로 리뷰 요청 → SEO 백링크 |
| 앱스토어 출시 + ASO | 개발 | 2~3개월 | 장기 | Kuli Kuli 2.5M의 주 채널, PWA → 네이티브 래핑 검토 |
| Instagram 운영 | 시간 | 느림 | 중간 | **비추** — Menu Translator App 175포스트/22팔로워 사례 반면교사 |

### Kuli Kuli 마케팅 전략 복제 포인트

1. **TikTok UGC 유발**: 실제 식당에서 스캔하는 영상이 자연스럽게 공유되는 구조
   - 결과 화면에 "Share this menu" 기능 추가 → 스크린샷 공유 용이하게
   - 예상 해시태그: #travelhacks #japanfood #menutranslator

2. **릴리즈 노트 스토리텔링**: 업데이트 노트를 감성적 짧은 글로 작성
   - 벤치마크: Kuli Kuli "TRAVEL LOG #6 The clouds hid the moon..."
   - TransTaste 적용: 버전 업데이트마다 여행 에피소드 한 문장

3. **Reddit 장기 투자**: Google과 LLM이 Reddit 스레드를 신뢰 있는 추천으로 인덱싱
   - 타겟 서브레딧: r/solotravel (7M+), r/JapanTravel, r/china, r/ThailandTourism
   - 전략: 스팸 금지, 진심 답변 후 자연스러운 언급

### 앱스토어 진출 시 ASO 핵심 키워드

```
기본: "menu translator", "food translator", "travel menu"
롱테일: "japanese menu translator", "restaurant menu scanner",
        "food allergy travel", "menu translation japan"
차별화: "restaurant culture guide", "travel phrasebook",
        "tipping guide travel"
```

---

## 9. 우선순위 실행 계획

### Phase 0 — 지금 당장 (코드 최소 수정, 1~2일)

| 작업 | 난이도 | 효과 |
|------|--------|------|
| /order 링크 숨기거나 "Coming Soon" 처리 | ★☆☆ | 빈 페이지 노출 즉시 제거 |
| "Popular Dishes **Nearby**" → "Popular Dishes" 문구 수정 | ★☆☆ | 허위 문구 제거 |
| /phrases 탭 레이블 truncation 수정 (국기+축약어) | ★☆☆ | 시각적 완성도 |
| og:image 도메인 확인 및 수정 | ★☆☆ | SNS 공유 썸네일 |
| /phrases 메타 설명 "5 Asian languages" → "8 languages" 수정 | ★☆☆ | SEO 정합성 |
| API KEY 필드 개발자 전용 섹션으로 분리 또는 숨김 | ★★☆ | 유저 혼란 제거 |

### Phase 1 — 재개 시 우선 처리 (1~2주)

| 작업 | 난이도 | 효과 |
|------|--------|------|
| **History 중복 저장 버그 수정** | ★★☆ | 핵심 기능 복구 |
| 히스토리 개별/전체 삭제 기능 추가 | ★★☆ | 기본 UX |
| 51일 전 더미 데이터 초기화 로직 수정 | ★☆☆ | 신뢰도 |
| 스캔 카운터 표시 시점 변경 (첫 스캔 후부터) | ★★☆ | 첫인상 |
| 결제 모달 개선 (기능 비교, 미리보기) | ★★☆ | 전환율 |
| 수익화 구조 명확화 (스캔 vs 콘텐츠 잠금 분리) | ★★★ | 결제 이해도 |
| 로딩 팁 언어/국가 기반 필터링 | ★★☆ | 맥락 |

### Phase 2 — 성장 단계 (1~3개월)

| 작업 | 난이도 | 효과 |
|------|--------|------|
| **음식 사진 표시** (경쟁사 표준 기능) | ★★★ | 시각 임팩트, 경쟁력 |
| **/order 페이지 구현** (현지어 주문 카드) | ★★★ | 독자 차별화 |
| 스캔 결과 홈 미리보기 섹션 추가 | ★★☆ | 가치 제안 전달 |
| Travel Tip 로테이션 (5~10개 다양화) | ★☆☆ | 재방문 유인 |
| ProductHunt 런칭 준비 | ★★☆ | 초기 유입 |
| Reddit 커뮤니티 참여 시작 | ★☆☆ | 장기 유입 |

### Phase 3 — 확장 단계 (3개월+)

| 작업 | 난이도 | 효과 |
|------|--------|------|
| 앱스토어 출시 (iOS/Android) | ★★★★ | ASO 유입 채널 확보 |
| 히스토리 클라우드 동기화 (Sign In 연동) | ★★★★ | 리텐션 훅 |
| 알레르기 프로필 → 스캔 결과 자동 경고 강화 | ★★★ | 리텐션 + 안전 |
| 월정액 구독 플랜 추가 | ★★★ | 안정적 MRR |
| TikTok 데모 영상 + 마이크로 인플루언서 협찬 | ★★★ | 바이럴 유입 |

---

## 부록 — 경쟁사 주요 수치 참고

| 서비스 | 출시 | 총 다운로드 | 월 설치 | iOS 평점 | Android 평점 |
|--------|------|-----------|--------|---------|------------|
| Menu Translator App | 2024.09 | — | — | 4.1 (9) | 4.7 (268) |
| Kuli Kuli | 2023.09 | 2.5M+ | ~25,000 (Android) | 4.53 (140) | 2.67 (110) |
| MenuGuide AI | 2024.10 | — | — | — | — |
| Waygo | 2012 | — | — | 4.6 (수천) | — |
| Google Lens | — | 5억+ MAU | — | 4.6~4.8 | — |

---

*이 문서는 https://transtaste.vercel.app 직접 브라우저 탐색, 경쟁사 앱스토어/플레이스토어 리서치, 시장 조사 데이터를 종합하여 작성되었습니다.*
