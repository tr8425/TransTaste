# TransTaste — 다음 작업 계획
> 작성일: 2026-03-27

## 현재 완료 상태

- [x] POC 스크립트 작성 (test-menu.mjs)
- [x] 프론트엔드 UI Shell (Next.js 14 + TS + Tailwind)
- [x] 목업 데이터 기반 5개 화면 + 15개 컴포넌트
- [x] UIUX 리뷰 반영 (7건)
- [x] GitHub 레포 연결 (tr8425/TransTaste)

---

## Phase A: POC 검증 (다음 세션 우선)

| 순서 | 작업 | 비고 |
|---|---|---|
| A-1 | ANTHROPIC_API_KEY 세팅 | 환경변수 또는 `.env.local` |
| A-2 | `poc/test-menu.mjs` 실행 — 텍스트 5종 | 한/중/일/태/혼합 |
| A-3 | 결과 검증 (JSON 파싱률, 응답시간, 번역품질, 비용) | 목표: 5/5 통과, <5초, <$0.03/회 |
| A-4 | 프롬프트 튜닝 (필요시) | fun_fact 품질, 알러지 정확도 |
| A-5 | 이미지 테스트 (실제 메뉴판 사진) | 로컬 파일 or URL |

**판단 기준:**
- 모두 통과 → Phase B 진행
- fun_fact 미흡 → 프롬프트 튜닝 후 재테스트
- JSON 불안정 → 프롬프트 구조 재설계

---

## Phase B: 실 API 연동 (UI → 백엔드 연결)

| 순서 | 작업 | 파일 |
|---|---|---|
| B-1 | `.env.local`에 API 키 세팅 | `.env.local` |
| B-2 | `/api/analyze` 라우트를 실제 Claude API 호출로 교체 | `src/app/api/analyze/route.ts` |
| B-3 | 카메라 촬영 → 이미지 업로드 → API 호출 → 결과 표시 연결 | camera → loading → results 흐름 |
| B-4 | 이미지 압축 (canvas 리사이즈 max 1024px, JPEG 80%) | `useCamera.ts` 개선 |
| B-5 | 에러 핸들링 (API 실패, 타임아웃, JSON 파싱 실패) | 전역 에러 UI |

---

## Phase C: Supabase 연동

| 순서 | 작업 | 비고 |
|---|---|---|
| C-1 | Supabase 프로젝트 생성 | supabase.com |
| C-2 | DB 스키마 생성 (users, passes, scan_cache, scan_history, payments) | backend report 참조 |
| C-3 | Supabase Auth 연동 (이메일 또는 소셜 로그인) | |
| C-4 | 크레딧 시스템 실 구현 (localStorage → Supabase) | `useCredits.ts` → API 호출 |
| C-5 | 스캔 히스토리 저장/조회 | Recent Scans 실 데이터 |

---

## Phase D: 캐싱 + 비용 최적화

| 순서 | 작업 | 비고 |
|---|---|---|
| D-1 | Upstash Redis 세팅 | upstash.com |
| D-2 | 캐시 키 설계: `SHA256(음식명 + 소스언어 + 타겟언어)` | TTL 30일 |
| D-3 | API 라우트에 캐시 로직 추가 (hit → 즉시 반환, miss → Claude 호출) | |
| D-4 | 음식 사진 연동 (Google Custom Search API) | image_search_query 활용 |

---

## Phase E: 결제 (Stripe)

| 순서 | 작업 | 비고 |
|---|---|---|
| E-1 | Stripe 계정 + 상품 생성 (7일 패스, 30일 패스, 50크레딧) | |
| E-2 | Checkout Session API 연동 | `TripPassPaywall` → 실 결제 |
| E-3 | Webhook으로 결제 완료 시 Supabase 크레딧/패스 업데이트 | |
| E-4 | 결제 후 잠금 해제 플로우 테스트 | |

---

## Phase F: 배포 + PWA 마무리

| 순서 | 작업 | 비고 |
|---|---|---|
| F-1 | Vercel 배포 | GitHub 연동 자동 배포 |
| F-2 | transtaste.app 도메인 연결 | namecheap 구매 후 |
| F-3 | PWA icons 제작 (192, 512) | 현재 placeholder |
| F-4 | Service Worker 캐싱 전략 적용 | 오프라인 히스토리 열람 |
| F-5 | 모바일 실기기 테스트 (iOS Safari, Android Chrome) | |

---

## 우선순위 요약

```
즉시:  A (POC 검증) — API 키만 있으면 바로 가능
1주차: B (실 API 연동) — 핵심 기능 완성
2주차: C + D (Supabase + 캐싱) — 사용자 관리 + 비용 절감
3주차: E + F (결제 + 배포) — 수익화 + 출시
```
