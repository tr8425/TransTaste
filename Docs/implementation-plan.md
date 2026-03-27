# TransTaste — 종합 구현 계획
> 작성일: 2026-03-27 | 소스: frontend-v3, backend-v2, content-arch-v4, ai-comparison 종합

---

## 현재 상태

- ✅ Next.js 14 UI 셸 (목업 데이터, 5화면, 15+ 컴포넌트, UIUX 리뷰 반영)
- ❌ 실 API 연동, DB, 캐싱, 결제, 온보딩, 프로필, 히스토리, 대화 프리셋, 팁/문화, 주문서

---

## Phase 0: POC 검증 (선행 필수)

| # | 작업 | 난이도 | 비고 |
|---|---|---|---|
| 0-1 | API 키 세팅 (.env.local) | - | 환경변수 |
| 0-2 | poc/test-menu.mjs 실행 (텍스트 5종) | 낮음 | JSON 파싱률, 응답시간, 비용 검증 |
| 0-3 | 이미지 메뉴판 테스트 | 낮음 | 실제 사진 |
| 0-4 | 프롬프트 튜닝 | 중간 | fun_fact 톤 가이드(content-arch §12) 반영 |

**통과 기준**: 5/5 JSON 파싱, <5초, <$0.03/회

---

## Phase 1: 실 API 연동 (UI→백엔드 연결)

| # | 작업 | 소스 리포트 | 파일 |
|---|---|---|---|
| 1-1 | /api/analyze → Claude Vision API 실연동 | Backend v2 §4 | api/analyze/route.ts |
| 1-2 | 프롬프트: 브랜드명 처리 + Fun Fact 톤 가이드 | Backend v2 §6, Content §12 | lib/claude.ts |
| 1-3 | 프롬프트: 알러지 4단계 + disclosure + warning | Content §11, §12 | 동일 |
| 1-4 | 이미지 압축 (canvas 1024px, JPEG 80%) | Frontend v2 §9 | useCamera.ts |
| 1-5 | 카메라→로딩→결과 실 플로우 연결 | Frontend v3 §4 | camera→loading→results |
| 1-6 | 입력 4종 UI (URL/텍스트 추가) | Frontend v3 §4.1 | home page |
| 1-7 | 에러 처리 (not_menu/ocr_failed/low_confidence) | Frontend v3 §4.10, Backend v2 §11 | 에러 컴포넌트 |
| 1-8 | 크레딧 차감 정책 (유효 결과만 차감) | Content §3.5 | api/analyze |
| 1-9 | AI Provider 추상화 인터페이스 | AI Comparison §7 | lib/ai/provider.ts |

---

## Phase 2: Supabase + Auth

| # | 작업 | 소스 리포트 |
|---|---|---|
| 2-1 | Supabase 프로젝트 생성 | Backend v2 §1 |
| 2-2 | DB 스키마: users, passes, scan_cache, scan_history, user_settings, payments | Backend v2 §5 |
| 2-3 | Auth (이메일/소셜) | Frontend v3 §4.9 |
| 2-4 | 크레딧 시스템 (localStorage→Supabase) | Backend v2 |
| 2-5 | 스캔 히스토리 저장/조회 | Frontend v3 §4 |
| 2-6 | 온보딩 플로우 (언어+알러지+식이신념 프리셋) | Frontend v3 §4.0, §14.6 |
| 2-7 | 프로필 화면 (/profile) | Frontend v3 §4.9 |
| 2-8 | 히스토리 화면 (/history) | Frontend v3 §3 |

---

## Phase 3: 캐싱 + 비용 최적화

| # | 작업 | 소스 리포트 |
|---|---|---|
| 3-1 | Upstash Redis 세팅 | Backend v2 §4.2 |
| 3-2 | L1: 정확 매칭 캐시 (SHA256) | Content §3.1 |
| 3-3 | L2: 정규화 매칭 캐시 | Content §3.2 |
| 3-4 | L3: Claude Prompt Caching (코드 1줄) | Content §3.3 |
| 3-5 | hit_count 집계 (Popular Dishes 준비) | Content §3.6 |
| 3-6 | 음식 사진 (Google Custom Search API) | Backend v1 §4.1 |

**예상 절감**: ~75% API 비용 감소

---

## Phase 4: 결제 (Stripe)

| # | 작업 |
|---|---|
| 4-1 | Stripe 상품 생성 (7일/30일 패스, 50크레딧) |
| 4-2 | Checkout Session API 연동 |
| 4-3 | Webhook → Supabase 크레딧/패스 업데이트 |
| 4-4 | 잠금 해제 플로우 (유료 구간 언블록) |

---

## Phase 5: 배포 + PWA

| # | 작업 |
|---|---|
| 5-1 | Vercel 배포 (GitHub 자동) |
| 5-2 | transtaste.app 도메인 연결 |
| 5-3 | PWA 아이콘 제작 (192, 512) |
| 5-4 | Service Worker 캐싱 (오프라인 히스토리) |
| 5-5 | 모바일 실기기 테스트 (iOS Safari, Android Chrome) |

---

## Phase 6: 식당 컴패니언 확장 (V1.5)

| # | 작업 | 소스 리포트 |
|---|---|---|
| 6-1 | 대화 프리셋 (/phrases) — 6카테고리, 5개국어 | Frontend v2 §4.6, Backend v2 §7.1 |
| 6-2 | 예측 답변 버튼 UX | Frontend v2 §4.6 |
| 6-3 | 팁 & 문화 카드 (/tip-culture) — 20개국 로컬 JSON | Frontend v2 §4.7, Backend v2 §7.2 |
| 6-4 | 팁 계산기 (메뉴 합계 연동) | Frontend v2 §4.7 |
| 6-5 | 주문서: 장바구니 + OrderSheet (/order) | Frontend v3 §14 |
| 6-6 | Present Mode (/order/present) — 현지어 전체화면 | Frontend v3 §14.5 |
| 6-7 | AllergyBanner (현지어 자동 생성) | Frontend v3 §14.6, Backend v2 §13.3 |
| 6-8 | 즐겨찾기 대화 프리셋 | Backend v2 §5.1 phrase_favorites |

---

## Phase 7: 유료 콘텐츠 + 확장 (V2)

| # | 작업 | 소스 리포트 |
|---|---|---|
| 7-1 | FlavorRadar 실 데이터 연동 | Frontend v1 §5 |
| 7-2 | FunFactCard + fun_fact_detail 접기 | Content §12.9 |
| 7-3 | HowToEat 카드 | Frontend v1 §4.5 |
| 7-4 | 조합 추천 (ComboRecommendation) | Backend v2 §5.2 |
| 7-5 | SNS 공유 카드 (ShareCard) | Frontend v1 §8 |
| 7-6 | QR 메뉴 대응 (jsQR) | Content §1 |
| 7-7 | 다중 이미지 갤러리 (최대 10장) | Content §2 |
| 7-8 | 모델 라우팅: 텍스트→Haiku | AI Comparison §5 |
| 7-9 | 메뉴 옵션/커스터마이징 파싱 | Content §10 |
| 7-10 | 대안 메뉴 추천 (알러지 danger 시) | Content §11.7 |
| 7-11 | 로컬 데이터 보강 (매운맛 스케일, 식이문화, 특이식품) | Content §4 |

---

## 타임라인

```
Phase 0   POC 검증         ← API 키 있으면 즉시
Phase 1   실 API 연동      ← 1주
Phase 2   Supabase+Auth    ← 1~2주
Phase 3   캐싱             ← 0.5주
Phase 4   Stripe 결제      ← 1주
Phase 5   배포+PWA         ← 0.5주
─── MVP 출시 ─────────────────
Phase 6   식당 컴패니언     ← 2~3주  (V1.5)
Phase 7   유료 콘텐츠+확장  ← 3~4주  (V2)
```

---

## 병렬화 가능 구간

### Phase 1 내부 병렬
- Agent A: API 라우트 + 프롬프트 (1-1, 1-2, 1-3, 1-8, 1-9)
- Agent B: 프론트엔드 플로우 (1-4, 1-5, 1-6)
- Agent C: 에러 UI (1-7)

### Phase 2 내부 병렬
- Agent A: 온보딩 + 프로필 UI (2-6, 2-7)
- Agent B: 히스토리 UI (2-8)
- (2-1~2-5는 Supabase 계정 필요 → 순차)

### Phase 6 내부 병렬
- Agent A: 대화 프리셋 (6-1, 6-2, 6-8)
- Agent B: 팁 & 문화 (6-3, 6-4)
- Agent C: 주문서 (6-5, 6-6, 6-7)
