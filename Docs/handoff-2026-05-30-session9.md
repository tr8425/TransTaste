# 세션 핸드오프 — 2026-05-30 → 다음 세션

## 한 줄 요약

origin/main 대비 **5 commits ahead**, Playwright MCP 등록 완료. 다음 세션의 첫 번째 작업은
26건 변경에 대한 자체 브라우저 검증 → 통과 시 `git push origin main`.

---

## 즉시 시작 가이드

```bash
# 1) 변경 사항 확인
git log --oneline origin/main..HEAD

# 2) 의존성 + dev 서버
npm install   # 필요 시
npm run dev   # http://localhost:3000

# 3) Playwright MCP 도구 사용 가능 여부 확인
#    (이번 세션 종료 후 새 세션에서는 mcp__playwright__browser_* 가 surface됨)
```

세션이 시작되면 `claude mcp list`에서 `playwright: ✓ Connected` 인지 먼저 확인.
Failed to connect 시 `.mcp.json`의 `env.NODE_OPTIONS=--use-system-ca` 유지되어 있는지 점검.

---

## 검증 우선순위 — 26개 작업 → 페이지별 7개 시나리오로 묶음

각 시나리오는 `mcp__playwright__browser_navigate` + `browser_snapshot` + (필요 시) `browser_click` 조합.

### 시나리오 1 — 홈 `/`
- [ ] 200 OK, hydration 무에러
- [ ] **H1이 hero title** ("Scan any menu...") — accessibility tree에서 `heading level=1` 확인
- [ ] **로고**는 `<p aria-label="TransTaste">` (h1 아님)
- [ ] **"Popular Dishes"** 텍스트 (이전 "Nearby" 빠짐)
- [ ] URL 모달: 빈 입력 / "abc" / "ftp://..." → 버튼 disabled, "https://example.com" → enabled
- [ ] Recent Scans 칩 클릭 시 `/results?id=...` 쿼리 포함 이동

### 시나리오 2 — 카메라 `/camera`
- [ ] X 버튼 클릭 → `/` (홈)으로 이동 (이전: `router.back()`)
- [ ] 셔터 버튼 누르면 흰색 플래시 오버레이가 ~220ms 사이 표시되고 버튼 disabled

### 시나리오 3 — 트래블 `/travel`
- [ ] Phrases 카드 / Tip & Culture 카드: 일반 링크
- [ ] **Order 카드**: 회색 + "Soon" 배지 + 화살표 없음 + 클릭해도 이동 안 함
- [ ] Travel Tip 박스: 새로고침 여러 번 시 4가지 다른 문구 노출 (rotation)

### 시나리오 4 — 회화집 `/phrases`
- [ ] 언어 탭 8개 (🇯🇵 JP / 🇨🇳 CN / 🇹🇭 TH / 🇻🇳 VN / 🇪🇸 ES / 🇫🇷 FR / 🇮🇹 IT / 🇬🇧 EN)
- [ ] 탭 텍스트 **truncation 없음** ("Japanes" 같은 잘림 사라짐)
- [ ] 탭에 `aria-label` (풀네임), `title` 둘 다 있어 hover 시 풀네임
- [ ] 메타 description: "50+ restaurant phrases in **8 languages**"

### 시나리오 5 — 히스토리 `/history`
- [ ] 빈 상태: "No scans yet" + 카메라 CTA
- [ ] (sessionStorage에 더미 history 주입 후) 헤더 우측 "Clear all" 버튼 노출
- [ ] 행 우측에 X 삭제 버튼, 클릭 시 항목 + cached_results 동시 제거
- [ ] 행 클릭 시 `/results?id=scan_xxx` 이동

### 시나리오 6 — 프로필 `/profile`
- [ ] 첫 진입 시 API key 입력란 **숨김** (Advanced details 접힘)
- [ ] "Advanced" 클릭 → API key 섹션 펼쳐짐, 아래 화살표 회전
- [ ] 푸터 링크: **FAQ** / Terms / Privacy 3개

### 시나리오 7 — 결과 `/results`
※ 실제 스캔 없이 검증하려면 localStorage `transtaste_cached_results` 주입 필요.
sessionStorage 시드 스크립트는 `npm run dev` 후 브라우저 콘솔에서 실행 권장.
- [ ] 카테고리 필터가 **스크롤 시 sticky** — 상단에 backdrop blur로 고정
- [ ] 잠긴 dish 카드 클릭 → BottomSheet, 90dvh 캡, 하단 CTA "Add to Order" 보임
- [ ] 한국어 locale에서 "추가됨 ✓" / 영어에서 "Added ✓"

### 시나리오 8 — 신규 FAQ `/faq`
- [ ] 200 OK
- [ ] H1 "FAQ" / 한국어 locale "자주 묻는 질문"
- [ ] details 7개, 각 클릭 시 펼침/접힘
- [ ] 화살표 회전 애니메이션

### 시나리오 9 — 온보딩 `/onboarding`
- [ ] **한국어 브라우저** (`Accept-Language: ko-KR`)에서 첫 진입 시 언어 셀렉터 "한국어" 선택됨 (이전: 항상 English)
- [ ] 영어 브라우저는 "English" 그대로

### 시나리오 10 — 로딩 화면 `/loading-scan`
- [ ] 한국어 메뉴 스캔 모킹 시 funFacts가 김치 트리비아(2번) + 6번(일반)만 순환 — 일본 라멘(0/4/9) 안 나옴
- 검증 난이도 ↑ (mock 필요) — 시간 없으면 스킵 가능

---

## 다국어 검증 (모든 시나리오 공통)

- [ ] 한국어 locale 진입 시 `document.documentElement.lang === "ko"` (HtmlLangSync 동작)
- [ ] 에러 화면(`/results` direct entry without data): "Something went wrong" → ko에서 "오류가 발생했습니다"
- [ ] CreditBadge: `localStorage.transtaste_credits = '{"hasPass":true}'` 같은 잘못된 값 주입 후 "남은 스캔 undefined회" → "남은 스캔 0회"로 표시

---

## Playwright MCP 호출 패턴 (참고)

```ts
// 페이지 진입
await mcp__playwright__browser_navigate({ url: "http://localhost:3000/" });

// 접근성 트리 + 상호작용 ref 받기
const snapshot = await mcp__playwright__browser_snapshot();

// 클릭 (ref는 snapshot 결과에서 얻음)
await mcp__playwright__browser_click({
  element: "URL button in input row",
  ref: "...", // from snapshot
});

// 스크린샷 (회귀 비교용)
await mcp__playwright__browser_take_screenshot({ filename: "home.png" });

// 콘솔/네트워크 메시지
const messages = await mcp__playwright__browser_console_messages();
```

뷰포트는 모바일 우선 (375×667 또는 390×844 권장):
```ts
await mcp__playwright__browser_resize({ width: 390, height: 844 });
```

---

## 다음 세션 첫 번째 메시지 (참고 템플릿)

> "session9 handoff 확인 후 dev server 띄우고 Playwright MCP로 시나리오 1~9 순차 검증.
> 통과한 시나리오는 ✓로 체크하고 실패한 케이스만 재현 절차/스크린샷 첨부해서 보고."

---

## 검증 통과 후 다음 단계

1. `git push origin main` (5 commits)
2. Vercel preview / production 배포 확인
3. (선택) 사용자가 Supabase / Stripe 대시보드 작업 시 다시 호출 — 인프라 의존 P0 진행

---

## 환경 / 도구 메모

- Node `--use-system-ca` 필요 (회사 SSL 정책)
- `.mcp.json` 커밋됨 (팀 공유 가능)
- `.claude/settings.local.json`은 gitignore — `enabledMcpjsonServers: ["playwright"]` 사용자별 추가 필요
- Windows 환경 — PowerShell + Bash 둘 다 사용 가능

---

## 알려진 미해결

- Supabase Auth (2-4, 2-5, 2-6) — 대시보드 활성화 필요
- Stripe (4-2/4-4/4-5) — 대시보드 + Webhook
- 알러지 배너 EU 14대 × 8개 언어 콘텐츠 (6-5)
- 결제내역 페이지 (Stripe 의존)

위 항목은 인프라/콘텐츠 준비 완료 후 별도 세션에서 진행.
