# TransTaste 개발 로그
> 2026-04-08 세션 8

---

## 세션 요약

Claude Code 에이전트 체계 구축. agent-standard-guide.md / subagent-audit-guide.md 기반으로 프로젝트 전용 에이전트 4개, 스킬 3개, 커맨드 2개를 작성.

**변경**: `.claude/` 하위 10개 파일 생성/수정 (gitignore 대상), `Docs/` 가이드 2개 추가

---

## 작업 내역

### 1. 에이전트 규격 가이드 작성 (Docs/)

| 파일 | 내용 |
|------|------|
| `Docs/agent-standard-guide.md` | 팀 공유 에이전트 품질 검증 프로세스 — frontmatter 규격, Agent/Skill/Command 역할 분리, Skill 로드 방식, 템플릿 |
| `Docs/subagent-audit-guide.md` | 임시 서브에이전트 세션 감사 → 정식 에이전트 승격 7단계 프로세스 |

### 2. 기존 에이전트 규격화 (2개)

#### dev-maintainer.md
- **Before**: frontmatter 없음, 역할/제약/성공 기준 미분리
- **After**: `name`, `description`, `tools`, `memory`, `skills` frontmatter 추가. 워크플로우/성공 기준/제약/핵심 지식 구조화. `project-architecture`, `type-schema` skill 참조.
- description에 "Use when" 트리거 패턴 적용

#### marketing-seo.md
- **Before**: frontmatter 없음, 체크리스트와 지시가 혼재
- **After**: 동일 규격화. `project-architecture` skill 참조. 타겟 오디언스/SEO 규칙/GEO 규칙을 핵심 지식으로 정리.

### 3. 신규 에이전트 생성 (2개)

#### i18n-worker.md
- ko/en JSON 동기화, 하드코딩 제거, 키 네이밍 일관성 전담
- `Bash`, `Write` 도구 차단 (JSON Edit만 허용) — 파괴적 작업 방지
- `i18n-conventions`, `project-architecture` skill preload

#### prompt-engineer.md
- Claude API 프롬프트 최적화, JSON 스키마 정합성, 스트리밍 파서 전담
- 2-Phase AI 파이프라인 (claude.ts → types.ts → stream-parser.ts) 전문
- `type-schema`, `project-architecture` skill preload

### 4. Skills 생성 (3개)

| 스킬 | 참조 에이전트 | 내용 |
|------|---------------|------|
| `project-architecture` | 전체 4개 | 라우팅 테이블, 2-Phase AI 파이프라인, API 라우트, 클라이언트 저장소, 결제 흐름, 디렉토리 맵 |
| `type-schema` | dev-maintainer, prompt-engineer | DishLite/DishDetail 타입 3계층, FlavorProfile 6축, AllergenType 7종, ErrorCode 14종 |
| `i18n-conventions` | i18n-worker, dev-maintainer | 키 네이밍 3단계 규칙, ko/en 동기화 절차, useTranslation 사용법, labelKey 패턴 |

### 5. Commands 생성 (2개)

| 커맨드 | 용도 |
|--------|------|
| `/build-check` | lint + build + 페이지 크기 빠른 점검 |
| `/i18n-audit` | ko/en 키 동기화 + 하드코딩 탐지 (i18n-worker 에이전트 호출) |

---

## 에이전트 체계 전체 구조

```
.claude/
  agents/
    dev-maintainer.md       ← 규격화 (버그 수정, 빌드, 코드 품질)
    marketing-seo.md        ← 규격화 (SEO, GEO, ASO, 콘텐츠)
    i18n-worker.md          ← 신규 (ko/en 동기화, 하드코딩 제거)
    prompt-engineer.md      ← 신규 (Claude 프롬프트 최적화)
  skills/
    project-architecture.md ← 전 에이전트 공유 아키텍처
    type-schema.md          ← 타입 시스템 참조
    i18n-conventions.md     ← i18n 규칙 참조
  commands/
    build-check.md          ← /build-check
    i18n-audit.md           ← /i18n-audit
```

### 에이전트 간 역할 경계

```
dev-maintainer ──→ i18n 키 추가 ──→ i18n-worker
                ──→ SEO/메타데이터 ──→ marketing-seo
                ──→ 프롬프트 수정 ──→ prompt-engineer

prompt-engineer ──→ UI 변경 ──→ dev-maintainer
                ──→ 타입 변경 시 영향 목록 제시

i18n-worker ──→ 빌드 검증 ──→ dev-maintainer
```

### Skill preload 매트릭스

| | project-architecture | type-schema | i18n-conventions |
|---|:---:|:---:|:---:|
| dev-maintainer | O | O | - |
| marketing-seo | O | - | - |
| i18n-worker | O | - | O |
| prompt-engineer | O | O | - |

---

## 설계 판단

### .gitignore 문제
- 현재 `.claude/` 전체가 `.gitignore`에 포함 → 에이전트/스킬이 git 추적 안 됨
- agent-standard-guide.md에서는 `.claude/agents/`, `.claude/skills/`를 팀 공유(git commit) 권장
- **현재 1인 프로젝트이므로 당장은 문제 없음**, 팀 확장 시 `.gitignore` 수정 필요:
  ```gitignore
  .claude/*
  !.claude/agents/
  !.claude/skills/
  !.claude/commands/
  ```

### Skill preload vs on-demand 판단
- `project-architecture`: 전 에이전트 80%+ 참조 → preload
- `type-schema`: dev-maintainer, prompt-engineer가 매번 필요 → preload
- `i18n-conventions`: i18n-worker가 매번 필요 → preload

### 도구 제한 근거
- i18n-worker: JSON 파일 수정만 하므로 `Bash`(빌드), `Write`(새 파일) 불필요 → 차단
- 나머지 에이전트: 빌드 검증이 워크플로우에 포함 → `Bash` 허용

---

## Handoff

### 즉시 가능
- `/build-check`, `/i18n-audit` 커맨드 테스트
- `@prompt-engineer` 또는 `@i18n-worker` 호출하여 자동 위임 확인

### 향후
- `.gitignore` 수정하여 에이전트/스킬 git 추적 활성화 (팀 공유 준비)
- 에이전트 사용 후 효과 측정 (내장 타입 비율 감소 확인)
- 분기 점검 시 subagent-audit-guide.md 절차 실행
