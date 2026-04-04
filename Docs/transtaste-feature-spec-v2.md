# Transtaste — 기능 명세서 (Feature Specification)
> 대상 버전: v2 MVP | 작성일: 2026-04-03 | 최종 수정: 2026-04-03 | 기준 문서: frontend-v4, backend-v3, content-arch-v5
> QA 반영: v2 QA + API 연동 후 QA + v3 QA 결과 통합

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|---|---|---|
| v1.0 | 2026-04-03 | 최초 작성 — v1 완료 기준 + v2 MVP 신규 기능 전체 명세 |

---

## 1. 범위 정의

### 1.1 v1 완료 (QA 대상 — 기존 기능)

| 기능 | 라우트 | 상태 |
|---|---|---|
| 카메라 스캔 | /camera | ✅ 완료 |
| 스캔 결과 목록 | /results | ✅ 완료 |
| 음식 상세 카드 | /results → 바텀시트 | ✅ 완료 |
| 카테고리 필터 탭 | /results | ✅ 완료 |
| 최근 스캔 히스토리 칩 | /home | ✅ 완료 (URL 고유화 필요) |
| BottomNav 5탭 | 전체 | ✅ 완료 |
| CreditBadge | 헤더 | ✅ 완료 |
| 페이월 (LockedBlock) | /results | ✅ 완료 |
| 에러 화면 | /error | ✅ 완료 |
| 온보딩 3슬라이드 | /onboarding | ✅ 완료 |
| Popular Dishes 섹션 | /home | ✅ 완료 (클릭 인터랙션 미연결) |

### 1.2 v2 MVP (이번 QA 대상 — 신규 기능)

| 기능 | 우선순위 | 담당 섹션 |
|---|---|---|
| 온보딩 언어 + 알러지 프리셋 설정 | P0 | 섹션 3 |
| Supabase Auth + user_settings | P0 | 섹션 4 |
| 발음 가이드 (DishCard) | P0 | 섹션 5 |
| Equal Eats형 알러지 카드 전체화면 | P0 | 섹션 6 |
| 프로필 화면 (홈 통화 포함) | P0 | 섹션 7 |
| 히스토리 화면 | P1 | 섹션 8 |
| Claude Vision API 실연동 | P0 | 섹션 9 |
| Redis 캐싱 | P1 | 섹션 10 |
| Stripe 결제 (Credits + Trip Pass) | P0 | 섹션 11 |
| OCR 실패 에러 처리 | P1 | 섹션 12 |

---

## 2. 공통 원칙

### 2.1 언어 처리 원칙

```
UI 언어 (user_settings.output_language)
  → 앱 전반의 UI 텍스트, 주문서 화면
  → 사용자가 읽는 모든 것

메뉴 언어 (scan_result.menu_language)
  → 서버에게 보여주는 전체화면 모드
  → 현지어로 자동 변환
```

### 2.2 크레딧 차감 정책

| 액션 | 차감 |
|---|---|
| 이미지 스캔 (카메라/갤러리) | 1크레딧 |
| URL 입력 스캔 | 1크레딧 |
| 텍스트 직접 입력 | 0.5크레딧 |
| 영수증 번역 (v3) | 0.5크레딧 |
| 캐시 히트 결과 | 0크레딧 |
| 알러지 카드 전체화면 | 0크레딧 (로컬 데이터) |
| 회화 프리셋 | 0크레딧 (로컬 데이터) |

### 2.3 페이월 구조 (v0.6 확정)

**무료 구간:**
- 번역 (literal / meaning / english)
- 재료 요약
- 알러지 4단계 감지 (main/sub/possible/none)
- 식이 신념 6종 감지
- 대화 프리셋 연결
- 발음 가이드 (v2 신규)
- 칼로리 추정치 (v2+ — 무료 제공)

**유료 구간 (Phase 2):**
- 맛 프로필 레이더 차트 (6축)
- 상세 재료 설명
- 먹는 법 가이드
- Fun Fact / fun_fact_detail
- 콤보 추천
- 싫어하는 재료 감지 (취향 영역)

---

## 3. 온보딩 플로우

### 3.1 슬라이드 구조

```
슬라이드 0 — 포지셔닝 (신규)
  "메뉴 번역 앱은 많아요. Transtaste는 달라요."
  Google Translate → 번역만 / Transtaste → 번역 + 알러지 + 대화 + 문화

슬라이드 1 — 앱 소개
  핵심 기능 3가지 아이콘 설명

슬라이드 2 — 설정
  [언어 선택] + [알러지 프리셋] + [식이 신념 프리셋]
  [시작하기] 버튼
  [Skip for now] — 텍스트 링크, BottomNav 위에 z-index 배치
```

### 3.2 언어 선택

- 지원 언어: 한국어, 영어, 일본어, 중국어(간체), 태국어, 베트남어, 스페인어, 프랑스어
- 기본값: 브라우저/OS 언어 감지
- 선택 UI: 드롭다운 또는 그리드 선택 (한 번에 1개)
- 저장: `user_settings.output_language`

### 3.3 알러지 프리셋

EU 14대 알러지 기준:

| 코드 | 한국어 표시 | 영어 |
|---|---|---|
| gluten | 글루텐 | Gluten |
| crustacean | 갑각류 | Crustaceans |
| egg | 달걀 | Eggs |
| fish | 생선 | Fish |
| peanut | 땅콩 | Peanuts |
| soy | 대두 | Soybeans |
| milk | 우유 | Milk |
| nuts | 견과류 | Nuts |
| celery | 셀러리 | Celery |
| mustard | 겨자 | Mustard |
| sesame | 참깨 | Sesame |
| sulphite | 아황산염 | Sulphites |
| lupin | 루핀 | Lupin |
| mollusc | 연체류 | Molluscs |

- 복수 선택 가능
- 선택된 알러지는 스캔 결과에서 자동 강조
- 저장: `user_settings.allergy_presets[]`

### 3.4 식이 신념 프리셋

| 코드 | 한국어 | 배너 문구 |
|---|---|---|
| vegan | 비건 | 동물성 식품을 먹지 않아요 |
| vegetarian | 채식 | 육류를 먹지 않아요 |
| halal | 할랄 | 할랄 음식만 먹어요 |
| kosher | 코셔 | 코셔 음식만 먹어요 |
| hindu_beef | 힌두 (소고기 금기) | 소고기를 먹지 않아요 |
| no_alcohol | 금주 | 알코올 포함 음식을 피해요 |

- 복수 선택 가능
- 저장: `user_settings.dietary_presets[]`

---

## 4. Supabase Auth + user_settings

### 4.1 인증 방식

- 이메일 + 비밀번호 (기본)
- 소셜 로그인: Google (선택적, v2+)
- 비로그인 상태: 로컬스토리지 fallback (크레딧 제한 있음)

> 🔴 **QA v3 현황**: /login·/signup 404, 로그인 버튼 onClick 핸들러 없음.
> C-1(회원가입)·C-2(로그인)·C-3(로그아웃) 전체 미구현. Supabase Auth UI 연결 필요.
> 비로그인 localStorage fallback(C-4)만 동작 확인됨.

### 4.2 user_settings 스키마

```sql
CREATE TABLE user_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  output_language     text DEFAULT 'ko',
  home_currency       text DEFAULT 'KRW',  -- 환율 토글용
  allergy_presets     text[] DEFAULT '{}',
  dietary_presets     text[] DEFAULT '{}',
  disliked_ingredients text[] DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 4.3 크레딧 서버 검증 (출시 블로커)

- 클라이언트 크레딧 차감은 표시용만
- 실제 차감은 서버 API Route에서 처리
- 중복 스캔 방지: scan_cache 히트 시 0크레딧

> 🔴 **QA v3 NEW-1**: API 키 입력 시 크레딧이 `"Infinity"` 문자열로 저장.
> UI에서 "남은 스캔 undefined회" 표시. `Number.isFinite()` 검사 후
> 개발 모드 표시("무제한") 또는 서버 검증 강제 적용 필요.

---

## 5. 발음 가이드

### 5.1 적용 위치

- 음식 상세 카드 (DishCard) — 음식명 바로 아래
- 스캔 결과 목록 — 카드 내 서브텍스트

### 5.2 표시 형식

```
[음식명 원문]
발음: 부대-찌개          ← pronunciation 필드
[한국어 번역]
```

### 5.3 데이터 소스

- `result_json.dishes[].translation.pronunciation` 필드 (AI 생성)
  *(QA v3에서 실제 API 응답 경로 확인. 명세 경로 수정.)*
- 형식: 원어 발음 한글 음역, 음절 경계 하이픈(-)
- 영어 메뉴 주의: QA v3에서 영어 메뉴("Caesar Salad")에 한국어 음성전사 표기됨. 영어 메뉴는 IPA 또는 영어 발음 가이드 표시 고려
- 예시: "부대-찌개", "카르-보나-라", "팟-타이"
- 영어권 메뉴: 영어 발음 표기로 전환

### 5.4 무료/유료 구간

- **무료** (Phase 1 포함)

---

## 6. Equal Eats형 알러지 카드

### 6.1 진입 경로

```
주문서 화면 (/order)
  하단 버튼 그룹:
    [서버에게 보여주기 →]    ← 기존
    [🚨 알러지 카드 보여주기] ← 신규
```

### 6.2 전체화면 UI

```
┌─────────────────────────────────┐
│  ⚠️ 음식 알러지 안내               │
│  (현지어 자동 번역)               │
│                                  │
│  저는 다음 음식에 알러지가 있습니다: │
│  새우 / 게 / 갑각류               │
│                                  │
│  이 재료가 포함되지 않은           │
│  메뉴를 추천해 주세요.            │
│                                  │
│  [언어 전환 ▼]    [닫기 ✕]        │
└─────────────────────────────────┘
```

### 6.3 동작 규칙

- 현지어: `scan_result.menu_language` 기준 자동 선택
- 알러지 프리셋이 없으면: "프로필에서 알러지를 설정해주세요" 안내
- 언어 전환 버튼: 지원 언어 리스트에서 선택 (8개 언어)
- 배경: 흰색 고정 (다크모드 무시) — 서버가 읽기 쉽게
- 글씨 크기: 최소 20px (가독성)
- 화면 꺼짐 방지: Wake Lock API 적용
- 크레딧 차감: 없음 (로컬 JSON 데이터)

### 6.4 텍스트 소스

- 알러지 배너 문장: 로컬 JSON (`/data/allergy-phrases.json`)
- API 호출 없음
- 지원: EU 14대 알러지 × 8개 언어

---

## 7. 프로필 화면

### 7.1 라우트: `/profile`

### 7.2 섹션 구성

```
[헤더]
  사용자 이메일 / 닉네임
  크레딧 현황: ⚡ 7 left / Trip Pass D-3 등

[언어 설정]
  앱 표시 언어: 한국어 ▼
  홈 통화: KRW ▼         ← 환율 토글용 (v2+ 기능이나 설정은 v2에 추가)

[알러지 / 식이 설정]
  알러지: 갑각류, 글루텐 (편집)
  식이 신념: 비건 (편집)
  싫어하는 재료: (편집, 유료)

[결제 내역]
  현재 플랜 / 크레딧 잔량
  플랜 업그레이드 버튼

[기타]
  FAQ
  개인정보처리방침
  로그아웃
```

### 7.3 홈 통화 설정

- 옵션: KRW, JPY, USD, CNY, THB, VND (MVP 6종)
- 기본값: 앱 언어 기반 자동 감지
- 저장: `user_settings.home_currency`
- 실제 환율 변환은 v2+ (Exchangerate API) — 설정만 v2에 추가

---

## 8. 히스토리 화면

### 8.1 라우트: `/history`

### 8.2 데이터 구조

```typescript
interface ScanHistoryItem {
  id: string                // scan_cache.id
  created_at: string
  thumbnail_url?: string    // 스캔 이미지 썸네일
  restaurant_type: string   // menu_meta.restaurant_type
  country_detected: string  // menu_meta.country_detected
  items_found: number       // menu_meta.items_found
  first_dish_name: string   // dishes[0].translation.meaning
}
```

> 🔴 **QA v3 현황 (H-1·H-2)**: 스캔 단위가 아닌 요리 단위로 나열됨.
> 1번 스캔(3개 요리) → 칩 3개·히스토리 행 3개 표시. resultKey 기준 그룹핑 필요.

### 8.3 UI 구성

```
[필터: 전체 / 일본 / 태국 / 기타]

[스캔 카드]
  썸네일 | 식당 유형 + 국가 | 날짜
           items_found개 메뉴
  탭 → /results?id=xxx

[삭제 버튼] — 개별 삭제 (스와이프 또는 롱프레스)
[전체 삭제] — 설정 화면 or 히스토리 우상단
```

### 8.4 주의 사항

- 히스토리 URL 반드시 고유화: `/results?id=scan_cache_id`
- 동일 스캔이 여러 번 탭 시 같은 결과 보장
- 오프라인 대응: IndexedDB fallback (v2+, 현재는 서버 의존)

---

## 9. Claude Vision API 실연동

### 9.1 파이프라인

```
[카메라/갤러리/URL/텍스트 입력]
      ↓
[이미지 전처리] — 768px 리사이즈, JPEG 압축
      ↓
[Claude Vision API] — claude-sonnet-4-5
      ↓ (스트리밍)
[result_json 파싱] — 1단계: 기본 번역/알러지
      ↓ (lazy-load)
[2단계 상세 데이터] — 맛 프로필, Fun Fact (유료 구간)
```

### 9.2 프롬프트 적용 규칙

- 브랜드명 처리: `brand_part` / `food_part` 분리
- 발음 가이드: `translation.pronunciation` 필드 항상 포함
- 칼로리 추정: `calorie_estimate` 필드 (추정 불가 시 null)
- 알러지: `allergen_summary.overall_risk` 4단계
- Fun Fact 조건부: 억지 생성 금지

### 9.2-1 URL 입력 유효성 검사 규칙

> 🟠 **QA v3 NEW-2**: 잘못된 URL 입력 시 분석 버튼 활성화됨. 유효성 검사 없음.

최소 검증 규칙:
- `https://` 또는 `http://`로 시작하는가
- 이미지 확장자(jpg/jpeg/png/webp/gif)이거나 Content-Type 이미지 응답인가
- URL 길이 2048자 이하

구현 위치: URL 입력 필드 onChange 이벤트, 버튼 disabled 제어

### 9.3 입력 타입별 크레딧

| 타입 | 토큰(예상) | 비용/회 |
|---|---|---|
| 이미지 스캔 | ~3,500 in / ~1,200 out | ~$0.028 |
| URL | ~3,500 in / ~1,200 out | ~$0.028 |
| 텍스트 | ~800 in / ~600 out | ~$0.011 |
| 캐시 히트 | 0 | $0 |

---

## 10. Redis 캐싱 (Upstash)

### 10.1 캐시 키 전략

```
menu:{sha256(image_hash)}:{output_language}  → TTL 7일
exchange:{from}:{to}                          → TTL 23시간
```

### 10.2 히트율 목표

- 60% 이상 (동일 식당 반복 스캔 고려)

---

## 11. Stripe 결제

### 11.1 상품 구성

| 상품 | 가격 | stripe_price_id |
|---|---|---|
| Credits 50회 | $1.99 | price_credits_50 |
| Credits 150회 | $3.99 | price_credits_150 |
| 7일 Trip Pass | $2.99 | price_pass_7d |
| 30일 Trip Pass | $5.99 | price_pass_30d |

### 11.2 결제 플로우

```
[LockedBlock 탭] or [CreditBadge 탭]
      ↓
[페이월 모달]
  맛 프로필 윤곽 (힌트 공개)
  "이 기능을 보려면:"
  [7일 Trip Pass $2.99 — 추천]
  [50 크레딧 $1.99 — 텍스트 링크]
      ↓
[Stripe Checkout]
      ↓
[성공 → 크레딧/패스 즉시 반영]
[실패 → 에러 메시지 + 재시도]
```

### 11.3 구매 여행 기간별 추천 로직

```
여행 며칠 남았나요? (온보딩 또는 맥락형 CTA)
  1~3일 → "50 크레딧 $1.99 추천"
  4~7일 → "7일 패스 $2.99 추천"
  8일+  → "30일 패스 $5.99 추천"
```

---

## 12. OCR 실패 에러 처리

### 12.1 에러 유형

| 코드 | 원인 | 사용자 메시지 | 크레딧 |
|---|---|---|---|
| `not_menu` | 음식 메뉴판이 아님 | "메뉴판이 아닌 것 같아요. 다시 찍어볼까요?" | 차감 없음 |
| `low_confidence` | 이미지 품질 낮음 | "이미지가 흐릿해요. 더 밝은 곳에서 찍어보세요" | 0.5 차감 |
| `no_text` | 텍스트 없음 | "글자가 보이지 않아요. 메뉴판에 가까이 대보세요" | 차감 없음 |
| `api_error` | API 오류 | "잠깐 문제가 생겼어요. 다시 시도해주세요" | 차감 없음 |
| `rate_limit` | 크레딧 소진 | "스캔 횟수를 모두 사용했어요" + CTA | 차감 없음 |

### 12.2 UI 원칙

- 배경: 흰색 + 이모지 + 친근한 문구 (냉랭한 에러 금지)
- 대안 CTA 항상 제공 (재시도 / 텍스트 입력 / 크레딧 구매)

---

## 13. 기능별 무료/유료 구간 정리

| 기능 | 무료 | 유료 | 버전 |
|---|---|---|---|
| 메뉴 번역 (기본) | ✅ | — | v1 |
| 알러지 감지 4단계 | ✅ | — | v1 |
| 식이 신념 감지 | ✅ | — | v1 |
| 대화 프리셋 | ✅ | — | v1.5 |
| 팁 & 문화 정보 | ✅ | — | v1.5 |
| 발음 가이드 | ✅ | — | **v2** |
| 알러지 카드 전체화면 | ✅ | — | **v2** |
| 칼로리 추정치 | ✅ | — | v2+ |
| 환율 토글 | ✅ | — | v2+ |
| 맛 레이더 차트 | — | ✅ | v2/v3 |
| Fun Fact 상세 | — | ✅ | v3 |
| 먹는 법 가이드 | — | ✅ | v3 |
| 콤보 추천 | — | ✅ | v3 |
| 영수증 번역 | ✅ (0.5크레딧) | — | v3 |

---

## 14. 라우트 구조 (v2 기준)

```
/                     → 홈
/onboarding           → 온보딩 (최초 진입 시)
/camera               → 카메라 스캔
/loading-scan         → 스캔 로딩
/results?id=xxx       → 스캔 결과 목록
/results/:id/detail   → 음식 상세 (바텀시트)
/order                → 주문서
/order/present        → 서버에게 보여주기 (전체화면)
/order/allergy-card   → 알러지 카드 (전체화면) ← 신규
/history              → 스캔 히스토리
/history/:id          → 과거 스캔 결과
/phrases              → 대화 프리셋 (v1.5)
/tip-culture          → 팁 & 문화 (v1.5)
/profile              → 프로필
/profile/edit         → 알러지/언어 편집
/paywall              → 결제 페이지
/settings             → 앱 설정
/error                → 에러 화면
```

---

## 15. 접근성 필수 체크리스트

- [ ] 모든 이미지 버튼에 `aria-label` 필수
- [ ] `user-scalable=no` 제거 (WCAG 위반)
- [ ] 헤딩 계층: H1 = 핵심 슬로건, 로고는 링크/div로
- [ ] 색상만으로 의미 전달 금지 (알러지 위험도: 색 + 아이콘 + 텍스트)
- [ ] 알러지 카드 전체화면: 최소 글자 크기 20px
- [ ] Wake Lock API: 미지원 환경 fallback 처리
