# TransTaste 세션 8 Handoff
> 2026-04-08

---

## 세션 요약

에이전트 체계 구축(4 agents, 3 skills, 2 commands) + 각 에이전트별 담당 영역 점검 + 일부 수정 착수.

---

## 완료된 작업

| 에이전트 | 작업 | 상태 |
|----------|------|------|
| (공통) | 에이전트 4개, 스킬 3개, 커맨드 2개 작성 + git 추적 활성화 | **커밋 완료** (`30a28e4`) |
| (공통) | agent-standard-guide.md, subagent-audit-guide.md, devlog 세션8 | **커밋 완료** (`f6952d9`) |
| dev-maintainer | `menu_language` → `transtaste_user_settings`에서 읽도록 수정 (travel, tip-culture) | **완료**, 빌드 통과 |
| i18n-worker | 스킬 문서 키 네이밍 3단계→2단계 정정 (`i18n-conventions.md`) | **완료** |
| marketing-seo | OG 이미지, PWA 아이콘, 페이지 metadata, sitemap | **미착수** |
| prompt-engineer | 비스트리밍 프롬프트, 런타임 검증, Phase 2 mock | **미착수** |

---

## 미커밋 변경사항

```
modified: src/app/travel/page.tsx            — menu_language 키 수정
modified: src/app/tip-culture/page.tsx       — menu_language 키 수정
modified: .claude/skills/i18n-conventions.md — 2단계 네이밍 정정
```

---

## 다음 세션 TODO

### marketing-seo (HIGH → MEDIUM)

| # | 우선순위 | 작업 | 참고 |
|---|----------|------|------|
| 1 | HIGH | OG 이미지 생성 | `src/app/opengraph-image.tsx` — Next.js ImageResponse, 1200x630, coral(#D85A30) 배경, 흰색 "TransTaste" + "Travel Menu Translator" |
| 2 | HIGH | PWA 아이콘 생성 | `src/app/icon.tsx` (32x32), `src/app/apple-icon.tsx` (180x180) — coral 배경 흰색 "T" |
| 3 | MEDIUM | 페이지 metadata 추가 | `/history` (Scan History), `/onboarding` (Get Started), `/profile` (My Profile) |
| 4 | MEDIUM | sitemap에 `/history` 추가 | `src/app/sitemap.ts` |
| 5 | MEDIUM | 페이지별 JSON-LD | `/foods/[slug]` → Recipe/Article, `/guide/[country]` → Article |
| 6 | LOW | manifest.json 보강 | categories, id, screenshots 추가 |

### prompt-engineer (MEDIUM → LOW)

| # | 우선순위 | 작업 | 위치 |
|---|----------|------|------|
| 1 | MEDIUM | 비스트리밍 Phase 1에 `SYSTEM_PROMPT_LITE` 사용 | `claude.ts:594` — 현재 풀 프롬프트 사용으로 토큰 낭비 |
| 2 | MEDIUM | DishDetail 런타임 필드 검증 추가 | `claude.ts:828` — flavor_profile(6키), ingredients(배열) 최소 체크 |
| 3 | MEDIUM | DishLite 개별 객체 최소 필드 검증 | `claude.ts:566` — original(string), translation(object), category(string) 체크, 불량 객체 필터링 |
| 4 | LOW | Phase 2 mock 데이터 추가 | `detail/route.ts:50` — Phase 1과 일관성 (현재 E_AUTH 에러 반환) |
| 5 | LOW | `disliked_ingredients` 스키마 정식 등록 | `claude.ts:405` — 현재 프리텍스트 주입, SYSTEM_PROMPT_LITE에 필드 추가 |
| 6 | LOW | 레거시 에러 코드 통일 | `types.ts` — `not_menu` 등 → `E_` 접두어로 통일 |
| 7 | LOW | category enum 불일치 | SYSTEM_PROMPT_LITE에 `salad` 포함, SYSTEM_PROMPT에는 없음 |

### dev-maintainer (완료, 추가 없음)

점검 항목 전부 PASS. `menu_language` 키 수정 완료 (미커밋).

### i18n-worker (완료, 추가 없음)

386키 완전 동기화. 하드코딩 없음. 스킬 문서 정정 완료 (미커밋).

---

## 에이전트 체계 현황

```
.claude/
  agents/
    dev-maintainer.md       — 버그 수정, 빌드, 코드 품질
    marketing-seo.md        — SEO, GEO, ASO, 콘텐츠
    i18n-worker.md          — ko/en 동기화, 하드코딩 제거
    prompt-engineer.md      — Claude 프롬프트 최적화
  skills/
    project-architecture.md — 전 에이전트 공유 아키텍처
    type-schema.md          — 타입 시스템 참조
    i18n-conventions.md     — i18n 규칙 참조
  commands/
    build-check.md          — /build-check
    i18n-audit.md           — /i18n-audit
```

### 에이전트 호출 방법
- 자동 위임: 관련 작업 요청 시 description 매칭으로 자동 선택
- 명시 호출: `@dev-maintainer`, `@marketing-seo`, `@i18n-worker`, `@prompt-engineer`
- 커맨드: `/build-check`, `/i18n-audit`
