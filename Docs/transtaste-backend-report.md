# Transtaste — 백엔드 현황 리포트
> 작성일: 2026-03-26 | 버전: v0.1

---

## 1. 프로젝트 확정 사항 요약

| 항목 | 결정 내용 |
|---|---|
| **서비스명** | Transtaste (transtaste.app 도메인 가용 확인) |
| **플랫폼** | 웹 PWA 먼저 → React Native 포팅 |
| **백엔드** | Vercel Functions + Supabase (서버리스) |
| **AI API** | Claude API 단일 시작 (claude-sonnet-4-5) |
| **결제** | Stripe (웹 우선으로 앱스토어 수수료 30% 회피) |
| **캐싱** | Upstash Redis |
| **수익 모델** | Free 10회 / Credits ($1.99~$3.99) / Trip Pass ($2.99~$5.99) |

---

## 2. 경쟁 서비스 분석 결과

### 2.1 menulens.app (직접 경쟁)
- **현황**: 사이드 프로젝트 수준, 방치 상태로 판단
- **실패 원인**:
  - 번역 + 사진 외 부가 가치 없음
  - 수익 모델 없음 (완전 무료, 비용 부담 공지까지 노출)
  - 개인정보 경고문 직접 노출 ("Your data isn't private!")
  - 개발자가 다수 사이드 프로젝트 병행 중 (집중도 부재)

### 2.2 TransMenu (App Store)
- 번역 + 환율 변환 수준, 구조화 데이터 없음
- Lifetime Membership + 광고형 수익 모델

### 2.3 Google Lens
- **진짜 경쟁자**: Vision 기능 계속 강화 중 (2024년 말 비디오/음성 추가)
- **약점**: 맥락 이해 부재, 재료/알러지/먹는법 구조화 없음, 조합 추천 없음
- **전략**: 정면 승부 아닌 "Google Lens가 못하는 것" 집중

### 2.4 포지셔닝 결론
```
Google Lens  →  "이게 뭔지" 알려줌 (번역)
Transtaste   →  "이걸 어떻게 즐길지" 알려줌 (경험 가이드)
```

---

## 3. 기술 스택 확정

```
Frontend    Next.js 14 + TypeScript + Tailwind CSS
Backend     Vercel Functions (서버리스 API Route)
Database    Supabase (PostgreSQL + Auth + Storage)
Cache       Upstash Redis
AI          Claude API — claude-sonnet-4-5 (Vision + 분석 통합)
Payment     Stripe
Image       Google Custom Search API (음식 사진)
Deploy      Vercel
```

---

## 4. 시스템 아키텍처

### 4.1 요청 흐름
```
[사용자]
  │
  ├─ 카메라/갤러리 → 이미지 압축 (프론트)
  │
  ▼
[Vercel API Route]
  ├─ 1. 크레딧 / Trip Pass 유효성 검증 (Supabase)
  ├─ 2. Redis 캐시 확인 (SHA256 해시 키)
  │     └─ Hit  → 즉시 반환 (< 500ms)
  │     └─ Miss → Claude API 호출
  │
  ├─ 3. Claude Vision API (OCR + 번역 + 분석 통합 단일 호출)
  ├─ 4. 결과 Redis 캐싱 (TTL 30일)
  ├─ 5. Supabase 히스토리 저장
  │
  └─ 6. 병렬: Google Custom Search (음식 사진)
  │
  ▼
[프론트엔드 카드 렌더링]
```

### 4.2 캐싱 전략
- **캐시 키**: `SHA256(음식명_원문 + 소스언어 + 타겟언어)`
- **TTL**: 30일 (음식 정보는 자주 바뀌지 않음)
- **예상 히트율**: 60~80% (인기 음식 집중 분포)
- **효과**: API 비용 최대 80% 절감

### 4.3 DB 스키마 (Supabase)
```sql
users        — id, email, credits_remaining, created_at
passes       — id, user_id, type(7d|30d), starts_at, expires_at
scan_cache   — id, dish_hash, result_json, language, hit_count, created_at
scan_history — id, user_id, dish_hash, scanned_at
payments     — id, user_id, type, amount_usd, stripe_id, created_at
```

---

## 5. AI 프롬프트 설계

### 5.1 단일 호출 전략
OCR + 번역 + 재료 분석 + Fun Fact + 조합 추천을 **하나의 API 호출**로 처리.
멀티 호출 대비 지연시간 50% 감소, 비용 40% 절감.

### 5.2 응답 JSON 구조
```json
{
  "original": "불도장",
  "translation": {
    "literal": "부처님이 담을 넘는 요리",
    "meaning": "고급 해산물 찜",
    "english": "Buddha Jumps Over the Wall"
  },
  "confidence": "high",
  "flavor_profile": { "sweet":2, "salty":4, "spicy":1, "sour":1, "umami":5, "rich":5 },
  "ingredients": {
    "core": ["전복", "해삼", "상어 지느러미", "돼지 족발"],
    "allergens": ["shellfish", "pork"],
  },
  "dietary": { "halal": false, "vegan": false, "vegetarian": false },
  "fun_fact": "냄새가 너무 좋아 수행 중인 스님도 담을 뛰어넘는다는 전설에서 유래",
  "how_to_eat": "돌솥째 제공. 뚜껑을 열어 향을 먼저 즐긴 뒤 숟가락으로 국물부터 맛본다",
  "price_tier": "premium",
  "image_search_query": "Buddha Jumps Over the Wall Chinese soup dish"
}
```

---

## 6. 비용 구조

### 6.1 API 비용 (Claude Sonnet 기준)
| 시나리오 | 토큰 | 비용/회 |
|---|---|---|
| 텍스트 분석 (메뉴명 5개) | ~2,000 in / ~800 out | ~$0.018 |
| 이미지 분석 (메뉴판 1장) | ~3,500 in / ~1,200 out | ~$0.028 |
| 캐시 히트 | 0 | $0.000 |

### 6.2 월간 비용 시뮬레이션 (캐시 히트율 60% 가정)
| 월 스캔 수 | API 비용 | 인프라 | 합계 |
|---|---|---|---|
| 1,000회 | ~$7 | $0 (무료 티어) | ~$7 |
| 10,000회 | ~$70 | ~$45 | ~$115 |
| 50,000회 | ~$350 | ~$150 | ~$500 |

### 6.3 손익분기점
- Trip Pass 7일 ($2.99) 기준: **월 39건 판매**으로 1만 스캔 인프라 커버
- 현실적 달성 가능한 초기 목표

---

## 7. POC 테스트 현황

### 7.1 테스트 스크립트 완성
- **파일**: `transtaste-poc/test-menu.mjs`
- **테스트 대상**: 한국어 / 일본어 / 중국어 / 태국어 / 혼합 메뉴 5종
- **이미지 테스트**: 로컬 파일 / URL 모두 지원

### 7.2 검증 항목
| 항목 | 목표 기준 |
|---|---|
| JSON 파싱 성공률 | 5/5 (100%) |
| 응답 시간 (신규) | < 5초 |
| 응답 시간 (캐시) | < 500ms |
| 번역 품질 (literal + meaning) | 정확 |
| fun_fact 품질 | 제네릭하지 않고 진짜 흥미로운가 |
| 알러지 정확도 | 오탐/누락 없는가 |
| 비용/회 | < $0.03 |

### 7.3 실행 방법
```bash
cd transtaste-poc
npm install
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs           # 텍스트 5종
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs ./menu.jpg # 이미지 테스트
```

### 7.4 다음 판단 기준
- ✅ 모든 항목 통과 → Next.js 프로젝트 세팅 진행
- ⚠️ fun_fact 품질 미흡 → 프롬프트 튜닝 후 재테스트
- ❌ JSON 불안정 → 프롬프트 구조 재설계

---

## 8. 개발 로드맵

### Phase 1 — POC 검증 (현재)
- [x] 프롬프트 설계
- [x] 테스트 스크립트 작성
- [ ] 실제 API 테스트 실행 및 품질 검증
- [ ] 프롬프트 튜닝

### Phase 2 — MVP (1~3주)
- [ ] Next.js 프로젝트 초기 세팅
- [ ] Supabase 스키마 + Auth
- [ ] Vercel API Route (캐싱 포함)
- [ ] 카메라/갤러리 업로드 UI
- [ ] 음식 카드 컴포넌트
- [ ] Stripe 크레딧 / Trip Pass 결제

### Phase 3 — V2 (4~6주)
- [ ] 맛 레이더 차트
- [ ] 음식 이미지 연동
- [ ] 메뉴 조합 추천
- [ ] 조회 히스토리 (오프라인 대응)

### Phase 4 — 포팅
- [ ] React Native 포팅 (카메라 UX 개선)
- [ ] App Store / Google Play 출시

---

## 9. 미결 사항

| 항목 | 상태 | 비고 |
|---|---|---|
| POC 테스트 실행 | ⏳ 대기 중 | API 키 필요 |
| transtaste.app 도메인 구매 | ⏳ 미완 | namecheap 최종 확인 필요 |
| 로고 / 브랜드 컬러 | ⏳ 미정 | UIUX 설계 후 결정 |
| 출시 타겟 언어 우선순위 | ⏳ 미정 | 한/중/일/태 우선 권장 |
