# Transtaste — 백엔드 현황 리포트
> 작성일: 2026-03-28 | 최종 수정: 2026-04-02 | 버전: v0.6

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| v0.6 | 2026-04-02 | 경쟁사 심층 분석 반영 / result_json 발음·칼로리·영수증 필드 추가 / Exchangerate API 환율 캐싱 설계 / 영수증 파이프라인 분기 설계 / 로드맵 갱신 |
| v0.5 | 2026-03-30 | Free 10회→7회 정정 / 캐싱 이미지 불가 정정 / 알러지 무료 이동 반영 / 이벤트 Phase2 환경변수 설계 / 크레딧 서버검증 출시 블로커 명시 |
| v0.1 | 2026-03-26 | 최초 작성 |
| v0.2 | 2026-03-26 | 언어 설정 / 리서치 모드 / 브랜드명 처리 / 대화 프리셋 / 팁 문화 정보 / 알러지 프리셋 / 온보딩 / 프로필 / 에러 처리 반영 |
| v0.3 | 2026-03-27 | 주문서 기능 / 알러지 4단계 시스템 / 식이 신념 프리셋 / 메뉴 옵션 스키마 / 장바구니 세션 |
| v0.4 | 2026-03-28 | 스트리밍 API / 응답속도 최적화 / 가격 통화 표기 / Fun Fact 조건부 생성 / 2단계 스키마 분리 |

---

## 1. 프로젝트 확정 사항

| 항목 | 결정 내용 |
|---|---|
| **서비스명** | Transtaste (transtaste.app 도메인 가용 확인) |
| **포지션** | 식당 컴패니언 — 리서치 → 메뉴 해독 → 주문 대화 → 계산까지 |
| **플랫폼** | 웹 PWA 먼저 → React Native 포팅 |
| **백엔드** | Vercel Functions + Supabase (서버리스) |
| **AI API** | Claude API 단일 시작 (claude-sonnet-4-5) |
| **결제** | Stripe (웹 우선으로 앱스토어 수수료 30% 회피) |
| **캐싱** | Upstash Redis |
| **수익 모델** | Free 7회 / Credits ($1.99~$3.99) / Trip Pass ($2.99~$5.99) |

---

## 2. 경쟁 포지셔닝

| 기능 | Google Lens | 여행 회화앱 | menulens.app | **Transtaste** |
|---|---|---|---|---|
| 메뉴 번역 + 분석 | 번역만 | X | 번역 + 사진 | ✅ 재료/맛/유래/먹는법 |
| 재료 / 알러지 | X | X | X | ✅ 구조화 + 프리셋 |
| 식당 대화 프리셋 | X | ✅ | X | ✅ 예측 답변 포함 |
| 팁 / 문화 정보 | X | 일부 | X | ✅ 메뉴 총액 연동 |
| 브랜드명 음식 처리 | X | X | X | ✅ brand_part 분리 |
| URL / 텍스트 입력 | X | X | X | ✅ 리서치 모드 |
| 수익 모델 | 광고 | 구독 | 없음 | ✅ Trip Pass |

---

## 3. 기술 스택

```
Frontend    Next.js 14 + TypeScript + Tailwind CSS
Backend     Vercel Functions (서버리스 API Route)
Database    Supabase (PostgreSQL + Auth + Storage)
Cache       Upstash Redis
AI          Claude API — claude-sonnet-4-5
Payment     Stripe
Image       Google Custom Search API
Deploy      Vercel
```

---

## 4. 시스템 아키텍처

### 4.1 요청 흐름

```
[사용자 입력]
  ├─ 카메라 촬영
  ├─ 갤러리 업로드
  ├─ 이미지 URL         ← 신규 (리서치 모드)
  └─ 텍스트 직접 입력   ← 신규 (리서치 모드 / OCR 실패 폴백)
  │
  ▼
[Vercel API Route]
  ├─ 1. 크레딧 / Trip Pass 유효성 검증 (Supabase)
  ├─ 2. Redis 캐시 확인 (SHA256 해시 키)
  │     └─ Hit  → 즉시 반환 (< 500ms)
  │     └─ Miss → Claude API 호출
  │
  ├─ 3. Claude Vision API (단일 호출)
  │     OCR + 언어 감지 + 번역 + 브랜드명 분리 + 재료/알러지 +
  │     맛 프로필 + Fun Fact + 먹는법 + 조합 추천
  │
  ├─ 4. 결과 Redis 캐싱 (TTL 30일)
  ├─ 5. Supabase 히스토리 저장
  └─ 6. 병렬: Google Custom Search (음식 사진)
  │
  ▼
[프론트엔드 렌더링]
```

### 4.2 캐싱 전략

- 캐시 키: `SHA256(입력타입 + 내용해시 + 소스언어 + 타겟언어)`
- TTL: 30일
- 예상 히트율: URL/텍스트 입력 케이스에서만 유효
  이미지(카메라) 스캔은 캐싱 불가 (매번 Vision API 호출)
  실사용 이미지 스캔 비중이 높으므로 전체 히트율은 낮을 수 있음
- URL 입력의 경우 URL 자체를 해시 키에 포함

---

## 5. DB 스키마 (Supabase) — v0.3 갱신

### 5.1 신규/변경 테이블

```sql
-- 기존 유지
users        — id, email, credits_remaining, created_at
passes       — id, user_id, type(7d|30d), starts_at, expires_at
scan_history — id, user_id, dish_hash, scanned_at
payments     — id, user_id, type, amount_usd, stripe_id, created_at

-- 변경: scan_cache (입력 타입 필드 추가)
scan_cache (
  id           uuid PK,
  dish_hash    text UNIQUE,        -- SHA256 캐시 키
  result_json  jsonb,              -- 분석 결과 전체
  input_type   text,               -- 'image' | 'url' | 'text'  ← 신규
  language_src text,               -- 감지된 소스 언어
  language_tgt text,               -- 출력 언어
  hit_count    integer DEFAULT 0,
  created_at   timestamptz
)

-- 신규: user_settings (언어 + 알러지 프리셋)
user_settings (
  id              uuid PK,
  user_id         uuid FK → users.id,
  output_language text DEFAULT 'ko',    -- 출력 언어
  menu_language   text DEFAULT 'auto',  -- 메뉴 언어 (auto or 고정)
  allergen_preset text[],               -- ['shellfish','nuts','pork'...]
  dietary_beliefs  text[],               -- ['vegan','halal','kosher','hindu_no_beef','no_alcohol']
  created_at      timestamptz,
  updated_at      timestamptz
)

-- 신규: phrase_favorites (자주 쓰는 대화 즐겨찾기)
phrase_favorites (
  id         uuid PK,
  user_id    uuid FK → users.id,
  phrase_key text,    -- 'water_please', 'check_please' 등
  created_at timestamptz
)
```

### 5.2 result_json 구조 — v0.6 갱신

```json
{
  "dishes": [
    {
      "original": "박가부대찌개",
      "has_brand_name": true,
      "brand_part": "박가",
      "brand_note": "박씨 성을 가진 주인의 브랜드",
      "food_part": "부대찌개",
      "language_detected": "ko",
      "translation": {
        "literal": "박씨의 부대찌개",
        "meaning": "박씨 브랜드의 부대찌개 (미군 부대 식재료로 만든 찌개)",
        "english": "Park's Budae Jjigae (Army Base Stew)"
      },
      "pronunciation": "부대-찌개",
      "confidence": "high",
      "category": "main",
      "flavor_profile": {
        "sweet": 2, "salty": 4, "spicy": 3,
        "sour": 1, "umami": 4, "rich": 4
      },
      "ingredients": {
        "core": ["스팸", "소시지", "라면", "김치", "두부"],
        "allergens": ["pork", "gluten", "soy"],
        "optional": ["치즈", "버섯"]
      },
      "dietary": {
        "halal": false,
        "vegan": false,
        "vegetarian": false,
        "gluten_free": false
      },
      "calorie_estimate": 780,
      "fun_fact": "한국전쟁 이후 새로운 식재료를 창의적으로 받아들인 퓨전 감각. 지금은 K-푸드의 아이콘이에요.",
      "fun_fact_detail": {
        "label": "탄생 배경이 궁금하다면",
        "content": "한국전쟁 이후 미군 부대에서 유통된 햄·소시지를 김치·라면과 조합해 탄생했어요. 어려운 시대의 창의성이 만들어낸 음식이에요."
      },
      "disclosure": {
        "target_culture": "en",
        "message": "This dish has an interesting fusion origin story. The combination of American military rations with Korean ingredients created a uniquely Korean comfort food."
      },
      "warning": null,
      "how_to_eat": "끓는 상태로 나옴. 라면 사리는 기호에 따라 추가. 밥과 함께 먹는 게 일반적.",
      "price": "12000",
      "currency": "KRW",
      "price_display": "₩12,000",
      "price_tier": "budget",
      "warning": { "level": "taste|intensity|texture|alcohol|null", "message": "중립적 1문장" },
      "image_search_query": "budae jjigae army base stew Korean"
    }
  ],
  "menu_meta": {
    "language": "ko",
    "restaurant_type": "한식 분식",
    "country_detected": "KR",
    "items_found": 1
  },
  "combo_recommendation": {
    "budget": { "items": ["부대찌개", "공기밥"], "total": 12000, "reason": "기본 세트" },
    "balanced": { "items": ["부대찌개", "공기밥", "음료"], "total": 15000, "reason": "균형 세트" }
  }
}
```

**v0.6 신규 필드:**

| 필드 | 타입 | 설명 | 단계 |
|---|---|---|---|
| `pronunciation` | string | 음식명 한글 발음 표기 (예: "부대-찌개") | v2 MVP |
| `calorie_estimate` | number \| null | AI 추정 칼로리 (kcal). 추정 불가 시 null | v2+ |

---

## 6. AI 프롬프트 설계 — v0.3 갱신

### 6.1 추가된 프롬프트 규칙

```
브랜드명 처리 규칙 (신규):
  - 음식명 앞 인명/가게명은 brand_part 필드로 분리 보존
  - 인명 패턴: "박가" → "Park's", "최가네" → "Choi Family"
  - 수식어 패턴: "할머니손", "원조" → 의미 번역 ("Grandma's", "Original")
  - 순수 고유 브랜드: "봉추", "신전" → 음역 유지, 번역 시도 안 함
  - brand_note 필드에 처리 방식 설명 포함

언어 처리 규칙 (신규):
  - language_detected 필드 항상 포함 (ISO 639-1)
  - 한/중/일 혼재 시 dominant language 반환 + 각 항목별 language_detected
  - 번체/간체 중국어 구분: zh-Hant / zh-Hans
  - confidence가 low일 때 번역 결과에 "(불확실)" 주석 포함

리서치 모드 처리 (신규):
  - URL 입력: 이미지 fetch 후 동일 Vision 파이프라인
  - 텍스트 입력: OCR 스킵, 분석 레이어만 실행 (빠름, 비용 절감)

발음 가이드 규칙 (v0.6 신규):
  - 모든 음식명에 pronunciation 필드 포함
  - 원어 발음 기준 한글 음역 (예: "부대-찌개", "카르보나라", "파드타이")
  - 음절 경계는 하이픈(-)으로 표시 → 서버에게 말할 때 쉽게 따라 읽도록
  - 영어권 언어 감지 시: 영어 발음 표기로 전환

칼로리 추정 규칙 (v0.6 신규):
  - calorie_estimate 필드: AI 기반 추정 kcal (정수)
  - 추정 불가 케이스: null 반환 (추상적 메뉴명, 재료 불명확)
  - 조리 방식에 따른 변동 고려 → 중간값 기준으로 추정
  - 프론트에서 반드시 "AI 추정치 / 실제와 다를 수 있음" 면책 문구 노출
  - 목적: 참고용, 다이어트 근거 제공 X
```

### 6.2 비용 비교 (입력 타입별)

| 입력 타입 | 토큰 (예상) | 비용/회 | 특이사항 |
|---|---|---|---|
| 이미지 스캔 | ~3,500 in / ~1,200 out | ~$0.028 | Vision 처리 포함 |
| 이미지 URL | ~3,500 in / ~1,200 out | ~$0.028 | URL fetch 추가 |
| 텍스트 입력 | ~800 in / ~600 out | ~$0.011 | OCR 없음, 절반 이하 |
| 캐시 히트 | 0 | $0.000 | Redis 응답 |

---

## 7. 로컬 데이터 (API 호출 없음)

대화 프리셋, 팁 정보, 문화 카드는 서버 API 호출 없이 클라이언트 번들에 포함.

### 7.1 대화 프리셋 구조

```typescript
interface PhrasePreset {
  key: string;           // 'water_please'
  category: string;      // 'basic' | 'order' | 'payment' | 'complaint' | 'greeting'
  ko: string;            // "물 주세요"
  translations: {
    [lang: string]: {
      text: string;      // "お水をください"
      pronunciation: string; // "오미즈오 쿠다사이"
    }
  };
  expected_responses?: {
    [lang: string]: Array<{
      text: string;      // 서버 답변 버튼 텍스트
      meaning: string;   // 한국어 의미
    }>
  };
}
```

지원 언어 우선순위: 일본어, 중국어(간체), 태국어, 베트남어, 영어, 스페인어

### 7.2 팁/문화 데이터 구조

```typescript
interface CountryInfo {
  code: string;          // 'JP'
  tip: {
    type: 'none' | 'optional' | 'expected';
    range_min: number;   // 0
    range_max: number;   // 0
    note: string;        // "팁을 주면 오히려 실례가 될 수 있어요"
  };
  culture: {
    water: 'free' | 'paid' | 'self';
    side_dishes: boolean;  // 한국 반찬 무료 여부
    payment_location: 'table' | 'counter' | 'either';
    tax_included: boolean;
    notes: string[];
  };
}
```

---

## 8. 비용 구조 — v0.3 갱신

### 8.1 월간 비용 시뮬레이션 (캐시 히트율 60%)

| 월 스캔 수 | API 비용 | 인프라 | 합계 |
|---|---|---|---|
| 1,000회 | ~$8 | $0 (무료 티어) | ~$8 |
| 10,000회 | ~$80 | ~$45 | ~$125 |
| 50,000회 | ~$400 | ~$150 | ~$550 |

텍스트 입력 비율이 높아질수록 비용 절감 (이미지 대비 60% 저렴).

### 8.2 손익분기점

- Trip Pass 7일 ($2.99) 기준: 월 42건 판매로 1만 스캔 인프라 커버
- 대화 프리셋 / 팁 정보: API 비용 없음 (로컬 데이터)

---

## 9. 개발 로드맵 — v0.6 갱신

### MVP (1~3주)
- [ ] Next.js 프로젝트 세팅
- [ ] Supabase 스키마 (users, passes, scan_cache, user_settings)
- [ ] user_settings에 `home_currency` 필드 추가 (환율 토글용)
- [ ] 온보딩 플로우 (언어 + 알러지 프리셋 설정)
- [ ] 카메라 / 갤러리 / URL / 텍스트 입력 4종
- [ ] Claude Vision API + 브랜드명/발음/칼로리 프롬프트
- [ ] Redis 캐싱 레이어
- [ ] 음식 카드 UI (무료 구간) — 발음 가이드 포함
- [ ] OCR 실패 에러 처리 + 텍스트 폴백
- [ ] Stripe 결제 (Credits + Trip Pass)
- [ ] 프로필 화면 (크레딧 / 언어 / 알러지 / 홈 통화)
- [ ] Equal Eats형 알러지 카드 (주문서 배너 전체화면 확장)

### V1.5 (4~5주)
- [ ] 식당 대화 프리셋 (6 카테고리, 우선 5개국어)
- [ ] 서버 예측 답변 버튼 UX
- [ ] 팁 & 문화 정보 (로컬 데이터, 주요 20개국)
- [ ] 국가 자동 감지 + 팁 계산기
- [ ] phrase_favorites 즐겨찾기
- [ ] **Exchangerate API 연동** — 일 1회 fetch + Redis 캐싱, 추가 비용 사실상 0
- [ ] **PriceDisplay 환율 토글** — 탭으로 현지/홈 통화 전환
- [ ] **원문-번역 비교 뷰** — 스캔 이미지 split-view
- [ ] **칼로리 추정치 렌더링** — 면책 문구 포함

### V2 (6~8주)
- [ ] 맛 레이더 차트
- [ ] Fun Fact + 먹는 방법 (유료)
- [ ] 메뉴 조합 추천 (유료)
- [ ] SNS 공유 카드 생성
- [ ] 히스토리 오프라인 대응 (IndexedDB)

### V3 (이후)
- [ ] **영수증 번역 파이프라인** — receipt 모드 프롬프트, 환율 토글 연동
- [ ] React Native 포팅
- [ ] App Store / Google Play 출시
- [ ] B2B API

---

## 10. 미결 사항

| 항목 | 상태 | 비고 |
|---|---|---|
| POC API 테스트 실행 | ⏳ API 키 필요 | test-menu.mjs, test-brand.mjs 준비됨 |
| transtaste.app 도메인 구매 | ⏳ | namecheap 최종 확인 필요 |
| 로고 / 브랜드 컬러 확정 | ⏳ | 코랄 오렌지 방향 권장 |
| 대화 프리셋 번역 데이터 | ⏳ | 여행 회화책 기반 제작 필요 |
| 팁 데이터 20개국 정리 | ⏳ | 로컬 JSON 파일로 관리 |
| 알러지 태그 표준 목록 확정 | ⏳ | 글로벌 알러지 14종 기준 권장 |

---

## 11. 입력 검증 및 트롤링 방지 (신규)

### 11.1 3단계 방어선

**1단계 — Claude 응답 필터 (소프트 필터)**

프롬프트에 명시적 규칙 추가:
```
이미지가 다음에 해당하면 { "error": "not_menu", "reason": "..." } 만 반환:
  - 음식 메뉴판이 아닌 경우
  - 텍스트가 전혀 없는 경우
  - 음식과 무관한 내용 (풍경, 사람, 사물 등)
이 경우 분석을 진행하지 않는다.
```

**2단계 — 결과 검증 로직 (코드 필터)**

```typescript
function validateMenuResult(result: MenuAnalysisResult): ValidationResult {
  if (result.error === 'not_menu') return { valid: false, reason: result.reason }
  if (result.dishes.length === 0) return { valid: false, reason: 'no_dishes' }
  if (result.dishes.every(d => d.confidence === 'low'))
    return { valid: true, warning: 'low_confidence' }
  return { valid: true }
}
```

**3단계 — 크레딧 차감 시점 조정**

```
변경 전  요청 시점에 즉시 차감
변경 후  Claude 응답이 valid인 경우에만 차감

not_menu 응답 → 크레딧 차감 없음
OCR 실패      → 크레딧 차감 없음
valid 응답    → 크레딧 1회 차감
```

### 11.2 에러 응답 유형

| 코드 | 상황 | 화면 처리 | 크레딧 |
|---|---|---|---|
| `not_menu` | 음식 메뉴판 아님 | "메뉴판 이미지를 사용해주세요" | 차감 없음 |
| `no_text` | 텍스트 없음 | "글자가 보이는 메뉴판을 찍어주세요" | 차감 없음 |
| `ocr_failed` | 너무 어둡거나 흐릿함 | 에러 화면 + 텍스트 폴백 | 차감 없음 |
| `low_confidence` | 특이한 형태, 불확실 | 결과 표시 + 경고 배너 | 차감 |
| `partial` | 일부만 인식 | 인식된 항목만 표시 + 안내 | 차감 |

### 11.3 특이한 메뉴판 처리 방침

완벽한 인식 보장은 목표가 아님. confidence 필드로 불확실성을 사용자에게 투명하게 전달.

```
confidence = "high"   → 정상 표시
confidence = "medium" → 정상 표시
confidence = "low"    → 항목에 "?" 아이콘, "인식이 불확실합니다" 툴팁
전체 low_confidence   → 상단 경고 배너: "메뉴 인식이 불확실해요. 참고용으로만 사용하세요."
```

손글씨, 칠판, 빛바랜 메뉴판 등은 자연스럽게 low_confidence로 처리되며 크레딧은 차감.

---

## 12. Reverse Food Search — 음식 사진으로 검색 (후순위, V2 이후)

### 12.1 개요

이름 모르는 음식 사진으로 "이게 뭔지" 찾는 기능. 별도 모델 불필요.
기존 Claude Vision 파이프라인에 프롬프트만 변경.

### 12.2 기술 구조

```
입력: 음식 사진 1장 (메뉴판 아님)
↓
Claude Vision (다른 프롬프트)
"이 사진의 음식 이름과 정보를 알려줘"
↓
동일한 DishCard 형태로 결과 반환
```

별도 진입점: 홈 화면 또는 카메라에 "음식 검색" 탭 추가.

### 12.3 로드맵

V2 이후 진입점만 추가하면 구현 가능. 핵심 메뉴 분석 품질 안정화 후 진행.

---

## 13. 주문서 기능 — 백엔드 설계

### 13.1 범위

서버 사이드 주문 전송 없음. 장바구니는 클라이언트 세션에서만 관리.
Supabase 저장은 선택적 (주문 히스토리 기능 추가 시).

### 13.2 장바구니 상태 관리

```typescript
// 클라이언트 세션 전용 (앱 종료 시 초기화)
// Zustand 또는 React Context

interface CartItem {
  dish_hash: string          // scan_cache 키와 동일
  name_original: string
  name_translated: string
  price?: number
  currency?: string
  quantity: number
  allergen_risk: 'danger' | 'warning' | 'check' | 'safe'
  options_selected?: {       // 섹션 10 메뉴 옵션 연동
    label: string
    choice: string
    price_delta: number
  }[]
}

interface CartState {
  items: CartItem[]
  scan_session_id: string    // 어느 스캔에서 담았는지
  country_detected: string   // 팁 계산용
  menu_language: string      // Present Mode 현지어 생성용 (스캔 감지값)
  user_language: string      // 주문서 화면 사용자 언어 (output_language 설정값)
}

// 언어 사용 원칙:
// 주문서 화면 (/order)          → user_language (사용자 설정값, 예: 'ko')
// 전체화면 모드 (/order/present) → menu_language (스캔 감지값, 예: 'ja')
// 메뉴명 주문서                  → name_translated (번역된 사용자 언어)
// 메뉴명 전체화면                → name_original (현지 원문) + name_translated 병기
```

### 13.3 알러지 배너 데이터 생성

서버 호출 없음. 로컬 JSON + 프리셋 조합으로 클라이언트에서 생성.

```typescript
// src/lib/allergyBanner.ts

interface BannerPhrase {
  allergen: string       // 'shellfish' | 'vegan' | 'halal' ...
  phrases: {
    [lang: string]: string  // 'ja': 'エビアレルギーがあります'
  }
}

function generateBannerPhrases(
  allergenPreset: string[],
  dietaryBeliefs: string[],
  targetLang: string
): string[] {
  // 프리셋 + 신념 → 현지어 문장 배열 생성
  // priority: 알러지 severity 순 → 신념 순
  // 로컬 JSON 참조, API 호출 없음
}
```

### 13.4 result_json 스키마 추가 (섹션 5.2 갱신)

```json
{
  "dishes": [
    {
      // 기존 필드 유지
      "has_customization": true,
      "options": [
        {
          "label": "사리 선택",
          "type": "addon",
          "required": false,
          "choices": [
            { "name": "라면 사리", "name_translated": "Ramen noodle add-on", "price_delta": 1000 },
            { "name": "당면 사리", "name_translated": "Glass noodle add-on", "price_delta": 1000 }
          ]
        }
      ],
      "allergen_summary": {
        "preset_triggered": ["shellfish"],
        "overall_risk": "danger",
        "risk_details": [
          { "ingredient": "새우", "risk_level": "main" },
          { "ingredient": "게", "risk_level": "main" },
          { "ingredient": "새우젓", "risk_level": "possible" }
        ],
        "alternative_dishes": ["된장찌개", "육개장"]
      }
    }
  ]
}
```

### 13.5 DB 스키마 추가 (선택적)

주문 히스토리 저장이 필요한 경우 V2에서 추가.

```sql
-- 선택적: 주문서 히스토리 저장
order_history (
  id          uuid PK,
  user_id     uuid FK → users.id,
  scan_id     uuid FK → scan_history.id,
  items_json  jsonb,        -- CartItem[] 스냅샷
  total_price integer,
  currency    text,
  country     text,
  created_at  timestamptz
)
```

### 13.6 로드맵

| 단계 | 내용 |
|---|---|
| MVP | dietary_beliefs 컬럼 user_settings에 추가 |
| V1.5 | 로컬 allergyBanner.ts + 현지어 JSON 번들 |
| V1.5 | result_json에 allergen_summary / options 필드 추가 |
| V1.5 | CartState 클라이언트 세션 관리 |
| V2 | order_history 테이블 (선택적) |

---

## 14. 응답속도 최적화 (v0.4 신규)

### 14.1 스트리밍 API 전환

체감 대기 제거. 총 소요시간은 동일하지만 첫 dish가 0.5초 내 표시.

```typescript
// src/app/api/analyze/route.ts

export async function POST(req: Request) {
  // ... 캐시/크레딧 체크 ...

  const stream = await client.messages.stream({
    model: MODEL_ROUTER[inputType],
    max_tokens: calculateMaxTokens(estimatedDishes),
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: buildUserContent(input) }]
  })

  // dish 단위로 완성될 때마다 프론트에 전송
  return new Response(
    new ReadableStream({
      async start(controller) {
        let buffer = ''
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            buffer += chunk.delta.text
            // dish 객체 완성 감지 → 즉시 flush
            const dishes = extractCompleteDishes(buffer)
            for (const dish of dishes) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify(dish)}\n\n`)
              )
            }
          }
        }
        controller.close()
      }
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  )
}
```

### 14.2 2단계 스키마 분리

1단계 (빠름, 즉시 카드 렌더링):
```typescript
const SCHEMA_LIGHT = [
  'original', 'translation.meaning', 'price', 'currency', 'price_display',
  'category', 'allergen_summary', 'warning', 'confidence'
]
```

2단계 (탭 시 lazy-load, 별도 API):
```typescript
const SCHEMA_DETAIL = [
  'fun_fact', 'fun_fact_detail', 'flavor_profile', 'ingredients',
  'how_to_eat', 'disclosure', 'options', 'image_search_query'
]
```

엔드포인트: `GET /api/dish-detail?hash={dish_hash}`
캐시 히트 시 즉시 반환. 실제 탭하는 메뉴는 2~3개이므로 전체 상세 로드 불필요.

### 14.3 가격 통화 표기

환율 변환 없음. 메뉴판 원래 통화 그대로 표시.

```typescript
// 프롬프트 추가 규칙
// price_display: 메뉴판 원래 통화 기호 + 현지 단위
// currency: ISO 4217 코드
// 환율 변환 금지 — 현지 물가 맥락 없이 숫자 비교는 여행자 경험 저해

const CURRENCY_FORMAT: Record<string, (n: number) => string> = {
  KRW: (n) => `₩${n.toLocaleString('ko-KR')}`,
  JPY: (n) => `¥${n.toLocaleString('ja-JP')}`,
  USD: (n) => `$${n.toFixed(2)}`,
  THB: (n) => `฿${n.toLocaleString()}`,
  EUR: (n) => `€${n.toFixed(2)}`,
  GBP: (n) => `£${n.toFixed(2)}`,
  CNY: (n) => `¥${n.toFixed(0)}`,
  VND: (n) => `₫${n.toLocaleString()}`,
}
```

### 14.4 추가 최적화 방안

| 방법 | 효과 | 적용 시점 |
|---|---|---|
| 이미지 768px 축소 | 입력 토큰 30% 감소 | 즉시 |
| 병렬 처리 (이미지 검색) | 이미지 검색 대기 제거 | 즉시 |
| max_tokens 동적 조정 | 소규모 메뉴 토큰 절감 | 즉시 |
| Fun Fact 조건부 생성 | 출력 토큰 10~20% 감소 | 즉시 |
| OCR 전처리 분리 | 비용 절감 (품질 리스크) | 안정화 후 |

```typescript
// 이미지 전처리
const MAX_SIZE = 768  // 1024 → 768

// max_tokens 동적 조정
function calculateMaxTokens(estimatedDishes: number): number {
  return Math.min(estimatedDishes * 150, 2048)
}

// 병렬 처리
const [analysisResult, images] = await Promise.all([
  analyzeMenu(input),
  searchFoodImages(dishNames)
])
```

### 14.5 Fun Fact 조건부 생성 프롬프트 규칙

```
Fun Fact 생성 조건 (모두 해당할 때만 생성):
  - 이름 유래가 흥미롭거나 반전이 있을 때
  - 문화적 맥락이 여행자에게 실질적으로 유용할 때
  - 잘 알려지지 않은 역사나 에피소드가 있을 때

위 조건 해당 없으면 fun_fact: null 반환
억지 생성 금지:
  ❌ "쌀은 세계에서 가장 많이 소비되는 곡물이에요" (공기밥)
  ❌ "1886년 미국에서 탄생한 음료예요" (콜라)
  ✅ "Gravlax는 '묻힌 연어'라는 뜻으로..." (그라브락스)
  ✅ "Reinheitsgebot 맥주 순수령으로..." (바이리쉬 헬)
```

---

## 15. 환율 캐싱 설계 (v0.6 신규)

### 15.1 아키텍처

```
[Exchangerate API] → 일 1회 fetch → [Upstash Redis TTL 24h]
                                          ↓
                           [클라이언트 탭 토글 요청]
                                          ↓
                           [Redis 캐시 응답] → PriceDisplay 계산
```

### 15.2 API 선택

| 옵션 | 무료 티어 | 갱신 주기 | 선택 이유 |
|---|---|---|---|
| Exchangerate-API | 1,500 req/월 | 일 1회 | 월 30회 사용 → 여유 충분 |
| Open Exchange Rates | 1,000 req/월 | 시간별 | 무료 갱신 제한 있음 |
| Fixer.io | 100 req/월 | 시간별 | 무료 티어 너무 적음 |

**→ Exchangerate-API 선택.** 일 1회 fetch, Redis TTL 23시간으로 안전하게 재fetch.

### 15.3 구현

```typescript
// /api/exchange-rate.ts (Vercel Function)
export async function getExchangeRate(from: string, to: string): Promise<number> {
  const cacheKey = `exchange:${from}:${to}`
  
  // Redis 캐시 우선
  const cached = await redis.get(cacheKey)
  if (cached) return parseFloat(cached)
  
  // 캐시 미스 시 API fetch
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}`
  )
  const data = await res.json()
  const rate = data.conversion_rate
  
  // TTL 23h 캐싱
  await redis.set(cacheKey, rate.toString(), { ex: 82800 })
  return rate
}
```

### 15.4 지원 통화

MVP: KRW, JPY, USD, CNY, THB, VND (한국 여행자 주요 여행지 기준)
V2: EUR, GBP, AUD, SGD 추가

---

## 16. 영수증 번역 파이프라인 설계 (v0.6 신규, V3 구현)

### 16.1 파이프라인 분기

```typescript
// 입력 타입 감지
const inputType = detectInputType(image) // 'menu' | 'receipt' | 'unknown'

switch (inputType) {
  case 'menu':    return analyzeMenu(image)    // 기존 파이프라인
  case 'receipt': return analyzeReceipt(image) // 신규 파이프라인
  default:        return { type: 'not_menu' }
}
```

### 16.2 receipt_json 구조

```json
{
  "type": "receipt",
  "restaurant_name": "磯丸水産 渋谷店",
  "items": [
    {
      "original": "生ビール",
      "translation": "생맥주",
      "price": 600,
      "currency": "JPY",
      "price_display": "¥600",
      "note": null
    },
    {
      "original": "お通し",
      "translation": "기본 안주 (자동 제공)",
      "price": 300,
      "currency": "JPY",
      "price_display": "¥300",
      "note": "입장 시 자동 청구되는 일본 식당 관행. 다음엔 입장 시 '오토시 노 이라나이데스'라고 거절 가능해요."
    }
  ],
  "subtotal": 2100,
  "tax": 210,
  "total": 2310,
  "currency": "JPY",
  "cultural_notes": [
    "お通し(오토시)는 테이블 차지 개념 — 대부분 식당에서 1인당 자동 청구됩니다."
  ]
}
```

### 16.3 크레딧 정책

```
메뉴 스캔   1크레딧 (기존)
영수증 번역 0.5크레딧 (데이터 적고 분석 범위 좁음)
```

### 16.4 환율 토글 연동

- `total` 필드를 홈 통화로 즉시 환산 표시
- "오늘 총 지출: ¥2,310 ≈ ₩21,800" 형태로 노출

---

