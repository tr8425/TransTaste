# TransTaste 개발 로그
> 2026-05-30 세션 9

---

## 세션 요약

`Docs/transtaste_audit_report.md`(직접 브라우저 탐색 + 경쟁사 리서치 기반) 발견 사항을
Phase 0 / P0 / P1 / P2 우선순위로 일괄 처리. 5개 커밋, 26개 작업.
세션 말미에 다음 세션 자체 검증을 위해 Playwright MCP 설치 (이번 세션에서는 미사용).

**변경 규모**: origin/main 대비 5 commits ahead, 30+ files modified, 새 페이지 1개(`/faq`),
새 컴포넌트 1개(`HtmlLangSync`).

---

## 커밋 시퀀스

| Commit | 범위 | 핵심 변경 |
|---|---|---|
| `833ab15` | Phase 0 + P0 (11건) | history 세션 dedupe, claude.ts `languageDirective`, og:image 환경변수 폴백, /order Coming Soon, /phrases 탭 truncation, API key Advanced 분리, 카메라 X 버튼 홈으로, useCredits NaN/Infinity 가드 |
| `e51b9cc` | P1/P2 (6건) | history 개별/전체 삭제, /results 에러 legacy 코드 매핑, BottomNav aria-label, 홈 H1 hero title로, 온보딩 navigator.language, URL 모달 isValidHttpUrl, FlavorRadar SVG title i18n |
| `f299688` | P2 UX polish (4건) | results 필터 sticky, CameraView 셔터 플래시 + 버튼 락, BottomSheet/Paywall 90dvh + safe-area, 영어 메뉴 pronunciation null 가이드 |
| `0bda740` | FAQ + 콘텐츠 (3건) | `/faq` 7-Q&A 페이지 신설, travel tip 4-tip 로테이션, loading-scan funFacts 언어별 풀 |
| `8ab8f68` | a11y (1건) | `HtmlLangSync` 클라이언트 컴포넌트로 `<html lang>` 동기화 |

---

## 처리된 작업 매트릭스 (audit_report → manual-tasks 매핑)

### Phase 0 (즉시 수정)
- [x] /order Coming Soon, "Nearby" 문구 제거, /phrases 탭 truncation
- [x] /phrases 메타 5→8 languages, metadataBase 환경변수 폴백, API key 분리

### P0 (출시 블로커)
- [x] 1-9 히스토리 중복 (1 스캔 = 1 세션 + resultKey dedupe)
- [x] 1-8 output_language 프롬프트 (언어 풀네임 + 필드별 적용)
- [x] 7-1 Recent Scans URL 고유화 (`?id=`)
- [x] 7-3 카메라 X 버튼 → 홈

### P1 (출시 전 필수)
- [x] 1-10 크레딧 undefined (useCredits + CreditBadge 가드)
- [x] 7-4 히스토리 삭제 (개별 + 전체)
- [x] 1-11 에러 메시지 i18n 통일 (legacy 코드 매핑)
- [x] 7-6 BottomNav aria-label + aria-current

### P2
- [x] 7-7 온보딩 브라우저 언어 감지
- [x] 7-8 H1 구조 (로고 → hero title)
- [x] 1-12 URL 유효성 검사
- [x] 7-9 카테고리 탭 sticky
- [x] 7-10 카메라 셔터 플래시 + 락
- [x] 1-13 모달 dvh + safe-area
- [x] 1-14 영어 메뉴 pronunciation null
- [x] 5-8 html lang 동기화

### 잔여작업 (이번 세션 추가 정리)
- [x] Add to Order 동작 점검 (정상 — outdated 보고서)
- [x] FAQ 페이지 신설 (7-5 일부)
- [x] Travel tip 로테이션 (M-3)
- [x] 로딩 funFacts 언어 필터링 (M-2 / 6-7)

---

## 검증 상태

- `npm run lint` — clean (5회 통과)
- `npx tsc --noEmit` — clean
- `npm run build` — 통과, `/faq` 신규 라우트 정상 (3.1 kB / 130 kB)
- i18n: ko/en 키 100% 동기화 (i18n-worker 보고)

자체 브라우저 검증은 **세션 9에서 미수행** — Playwright MCP 설치만 완료, 다음 세션에서 진행.

---

## Playwright MCP 설치 메모

- 패키지: `@playwright/mcp@latest` (Microsoft 공식)
- 등록 위치: `.mcp.json` (project scope — 팀 공유 가능)
- 자동 승인: `.claude/settings.local.json`에 `enabledMcpjsonServers: ["playwright"]`
- SSL: 회사 네트워크 자체 CA 사용 — `NODE_OPTIONS=--use-system-ca` env로 우회
- 상태: ✓ Connected (`claude mcp list`), 도구 schema는 다음 세션에 surface

---

## 남은 작업 (다음 세션 이후)

코드로 처리 불가능 — 인프라/콘텐츠 의존:
- 🔴 Supabase Auth UI + 로그아웃 + 크레딧 서버 검증 (2-4, 2-5, 2-6)
- 🟠 Stripe Checkout 실연동 (4-2, 4-4, 4-5)
- 🟠 결제내역 페이지 (Stripe 의존)
- 🟠 알러지 배너 EU 14대 × 8개 언어 콘텐츠 (6-5)
