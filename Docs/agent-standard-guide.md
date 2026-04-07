# 에이전트 규격 관리 가이드

> 팀 공유 에이전트(agents/*.md)의 품질을 검증하고, 규격에 맞게 수정하는 프로세스.
> 모든 수정은 dry-run 프리뷰 후 승인을 거쳐 적용한다.

---

## 팀 공유 vs 개인 로컬

### 배치 경로

```
[프로젝트repo]/.claude/agents/     ← 팀 공유 (git commit)
[프로젝트repo]/.claude/skills/     ← 팀 공유 (git commit)
[프로젝트repo]/.claude/commands/   ← 팀 공유 (git commit)
~/.claude/agents/                   ← 개인용 (git 미추적)
```

> 참고: CLAUDE_SETUP_PLAN.md §5.1에서 `.gitignore` 수정이 필요함.
> 현재 `.claude` 디렉토리 전체가 `.gitignore`에 포함되어 있어 팀 공유 설정이 commit 불가.

### 배치 판단 기준

| 기준 | 팀 공유 (repo) | 개인 로컬 (~/) |
|---|---|---|
| 2명 이상이 같은 종류의 작업을 함 | O | — |
| 프로젝트 도메인 지식이 필요 | O | — |
| 본인만 쓰는 개인 워크플로우 | — | O |
| CLAUDE_SETUP_PLAN에 정의된 에이전트 | O (필수) | — |

### 팀 공유 에이전트 수정 규칙

1. **팀 repo의 `.claude/agents/`를 직접 수정하고 PR로 리뷰** — 개인 로컬에서 포크하지 않는다
2. **개인 로컬에 같은 이름의 에이전트를 만들지 않는다** — 이름이 같으면 로컬이 팀 것을 덮어씀
3. **팀 에이전트를 보강하고 싶으면** — 프롬프트 E (dry-run) → 프롬프트 F (승인 후 수정) → PR
4. **개인 에이전트가 팀에도 유용하면** — 프롬프트 C의 "배치: 팀 공유 승격" 판정 후 PR

### 충돌 방지 체크리스트

```bash
# 개인 로컬 에이전트 중 팀 repo와 이름이 겹치는 것 감지
echo "=== 이름 충돌 감지 ==="
TEAM_DIR="[프로젝트repo]/.claude/agents"
LOCAL_DIR=~/.claude/agents

for f in "$LOCAL_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  if [ -f "$TEAM_DIR/$name" ]; then
    echo "⚠️ 충돌: $name — 개인 로컬이 팀 에이전트를 덮어씀"
  fi
done

# 개인 로컬 에이전트 중 팀 에이전트와 description이 유사한 것 감지
echo "=== description 유사도 감지 ==="
for local in "$LOCAL_DIR"/*.md; do
  [ -f "$local" ] || continue
  local_desc=$(sed -n 's/^description: *"\?\(.*\)"\?$/\1/p' "$local")
  [ -z "$local_desc" ] && continue

  for team in "$TEAM_DIR"/*.md; do
    [ -f "$team" ] || continue
    team_desc=$(sed -n 's/^description: *"\?\(.*\)"\?$/\1/p' "$team")
    [ -z "$team_desc" ] && continue

    # 간단한 키워드 겹침 체크 (3단어 이상 공통이면 유사)
    common=$(comm -12 <(echo "$local_desc" | tr ' ' '\n' | sort -u) <(echo "$team_desc" | tr ' ' '\n' | sort -u) | wc -l)
    if [ "$common" -gt 3 ]; then
      echo "⚠️ 유사: $(basename "$local") ↔ $(basename "$team") — 공통 키워드 ${common}개"
    fi
  done
done
```

---

## 규격 개요

### Agent / Skill / Command 역할 분리

| 구분 | 역할 | 크기 | 호출 방식 |
|---|---|---|---|
| **Agent** | 자율 실행자. 격리 컨텍스트에서 독립 실행 후 요약 반환 | 지시 200단어 이하 + 핵심 지식 제한 없음 | 자동 위임(description 매칭) 또는 `@에이전트명` 또는 `claude --agent 에이전트명` |
| **Skill** | 도메인 지식. 에이전트 또는 세션에 주입되는 참고 자료 | 제한 없음 (참조 자료) | 에이전트 `skills:` 필드(preload) 또는 `/skill명`(user-invoke) |
| **Command** | 원샷 트리거. 사용자가 즉시 실행하는 단축 명령 | 프롬프트 1개 | `/command명 [인자]` |

### 분류 판단 기준

```
"이 기능은 자율적으로 탐색·판단·실행해야 하는가?"
  → Yes → Agent

"이 내용은 다른 에이전트/세션에서 참조하는 지식인가?"
  → Yes → Skill

"사용자가 특정 시점에 한 번 실행하면 되는 작업인가?"
  → Yes → Command
```

**경계 케이스:**
- 에이전트 본문에 체크리스트 500줄 → **본문은 줄이고 체크리스트는 Skill로 분리**
- 에이전트를 호출하는 간단 트리거 → **Command로 만들어서 /명령어로 호출**
- Skill이 자체적으로 판단/실행 필요 → **Agent로 승격** 또는 Skill에 `context: fork` 설정하여 서브에이전트 컨텍스트에서 실행
- Skill을 Claude가 자동 호출하면 안 됨 → `disable-model-invocation: true` 설정

---

## 1단계: 규격 검증 (Lint)

### 1-1. frontmatter 필수 필드 검증

```bash
# agents/ 디렉토리의 모든 .md 파일에서 frontmatter 검증
AGENTS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/agents"  # 팀 repo 기준, 없으면 현재 디렉토리

echo "=== frontmatter 검증 ==="
for f in "$AGENTS_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .md)
  [[ "$name" == "README" ]] && continue

  has_frontmatter=$(head -1 "$f" | grep -c '^---')
  if [ "$has_frontmatter" -eq 0 ]; then
    echo "❌ $name — frontmatter 없음"
    continue
  fi

  has_name=$(sed -n '/^---$/,/^---$/p' "$f" | grep -c '^name:')
  has_desc=$(sed -n '/^---$/,/^---$/p' "$f" | grep -c '^description:')
  has_tools=$(sed -n '/^---$/,/^---$/p' "$f" | grep -cE '^(tools|disallowedTools):')
  has_memory=$(sed -n '/^---$/,/^---$/p' "$f" | grep -c '^memory:')

  status="✅"
  issues=""
  [ "$has_name" -eq 0 ] && status="❌" && issues="$issues name누락"
  [ "$has_desc" -eq 0 ] && status="❌" && issues="$issues description누락"
  [ "$has_tools" -eq 0 ] && status="⚠️" && issues="$issues tools미설정"
  [ "$has_memory" -eq 0 ] && issues="$issues memory미설정"

  echo "$status $name $issues"
done
```

### 1-2. 본문 크기 검증

> **기준 설명:**
> - 지시(instruction) = 역할, 워크플로우, 성공 기준, 제약 → 200단어 이하 권장
> - 핵심 도메인 지식 = 에이전트가 이것 없이 동작 못하는 것 → 본문 유지, 크기 제한 없음
> - 참조 자료 = 체크리스트, 점수 체계, API 명세 등 → skill로 분리 대상
>
> 스크립트는 전체 단어 수만 측정하므로, 큰 파일은 프롬프트 E에서 A/B/C 분류를 하여 판단한다.

```bash
echo "=== 본문 크기 검증 ==="
for f in "$AGENTS_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .md)
  [[ "$name" == "README" ]] && continue

  size=$(wc -c < "$f")
  lines=$(wc -l < "$f")
  words=$(wc -w < "$f")

  status="✅"
  if [ "$words" -gt 5000 ]; then
    status="⚠️ 참조 자료 skill 분리 검토 필요 (프롬프트 E에서 A/B/C 분류)"
  elif [ "$words" -gt 2000 ]; then
    status="ℹ️ 핵심 지식 포함 가능 — 프롬프트 E에서 확인"
  fi

  echo "$status $name — ${words}단어, ${lines}줄, ${size}bytes"
done
```

### 1-3. Skill 분리 후보 감지

```bash
echo "=== 도메인 지식 분리 후보 ==="
for f in "$AGENTS_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .md)
  [[ "$name" == "README" ]] && continue

  # 에이전트 본문에 긴 테이블, 코드 블록, 체크리스트가 있으면 skill 분리 후보
  tables=$(grep -c '|.*|.*|' "$f")
  codeblocks=$(grep -c '```' "$f")
  checkitems=$(grep -c '^\- \[' "$f")

  if [ "$tables" -gt 20 ] || [ "$codeblocks" -gt 10 ]; then
    echo "⚠️ $name — 테이블 ${tables}행, 코드블록 ${codeblocks}개 → skill 분리 후보"
  fi
done
```

### 1-4. 중복 감지

```bash
echo "=== 에이전트 ↔ skill 중복 감지 ==="
SKILLS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/skills"  # 팀 repo 기준

for agent in "$AGENTS_DIR"/*.md; do
  [ -f "$agent" ] || continue
  aname=$(basename "$agent" .md)
  [[ "$aname" == "README" ]] && continue

  for skill in "$SKILLS_DIR"/*.md; do
    [ -f "$skill" ] || continue
    sname=$(basename "$skill" .md)

    # 공통 라인 수 계산 (50줄 이상 겹치면 중복)
    common=$(comm -12 <(sort "$agent") <(sort "$skill") | wc -l)
    if [ "$common" -gt 50 ]; then
      echo "⚠️ $aname ↔ $sname — 공통 ${common}줄 (중복 의심)"
    fi
  done
done
```

---

## 2단계: Dry-Run 규격 수정 프리뷰

### 프롬프트 E: 규격 검증 + 수정 프리뷰

> **파일을 수정하지 않고** 각 에이전트의 규격 위반 사항과 수정안을 보여주는 단계.

```
프로젝트의 .claude/agents/ 디렉토리의 모든 에이전트 .md 파일을 읽고
규격 위반 사항과 skill 분리 계획을 한 번에 진단해줘.
파일은 수정하지 마. 프리뷰만 보여줘.

## 규격 기준

### A. frontmatter (필수/권장)

필수:
- name: 소문자+하이픈, 64자 이내
- description: 10~250자, 앞쪽에 키워드 배치, "Use when [트리거]" 패턴 권장

권장:
- tools 또는 disallowedTools: 에이전트 역할에 맞는 도구 제한
- memory: project (팀 공유) / user (개인) / local (프로젝트 로컬)

선택:
- model: 모델 지정 (inherit이면 부모 세션 따름)
- effort: low / medium / high / max (Opus 4.6 전용)
- maxTurns: 최대 턴 수
- skills: preload할 skill 이름 목록
- mcpServers: 에이전트 전용 MCP 서버
- permissionMode: 에이전트 권한 모드
- hooks: 에이전트 전용 훅 설정
- isolation: worktree 격리 실행
- disabled: true로 설정하면 자동 위임에서 제외 (퇴역 시 활용)

### B. 본문 구조
- 지시(instruction) 부분 200단어 이하 (핵심 도메인 지식은 제한 없음)
- 필수 섹션: 역할 (1문장), 워크플로우 (번호 목록), 성공 기준, 제약
- 도메인 지식(테이블, 체크리스트, API 명세)은 본문이 아닌 skills로 분리

### C. Skill 분리
- 에이전트 본문에 테이블 20행 이상 → skill로 분리 (이 수치는 에이전트 성격에 따라 조정 가능)
- 에이전트 본문에 코드 블록 10개 이상 → skill로 분리 (동일)
- 여러 에이전트가 공유하는 지식 → 공통 skill로 분리

### D. 중복 제거
- 에이전트 본문과 skill 파일이 50줄 이상 겹침 → 에이전트에서 제거, skill 참조로 대체
- 동일 내용이 여러 파일에 존재 → 단일 소스로 통합

### E. Command 분리
- 에이전트를 트리거하는 간단한 프롬프트 → commands/로 분리
- 사용자가 /명령어로 빠르게 실행하는 원샷 작업 → commands/로 분리

## 각 에이전트에 대해 아래 형식으로 정리:

---
### [에이전트명]
**현재 상태:**
- frontmatter: 있음/없음 (필드 목록)
- 본문: N단어, N줄
- 도메인 지식 비율: 약 N% (skill 분리 대상)
- 중복: [skill명]과 N줄 겹침

**위반 사항:**
1. [규격 A/B/C/D/E] — 구체적 설명

**수정안 (diff 형태):**
```diff
+ 추가할 내용
- 제거할 내용
```

**분리할 Skill:**
- skills/[이름].md — [어떤 내용을 이동하는지]
- 공유 여부: 다른 에이전트도 참조하는지
- 기존 skill 중복: 기존 skills/에 유사 내용이 있는지

**생성할 Command:**
- commands/[이름].md — [어떤 용도]
---

마지막에 전체 요약 테이블:

| 에이전트 | frontmatter | 본문 크기 | skill 분리 | 중복 제거 | command 분리 | 변경 규모 |
|---|---|---|---|---|---|---|
```

### 프롬프트 F: 규격 수정 실행 (승인 후)

```
프롬프트 E의 프리뷰에서 승인된 수정만 적용해줘.

수정 대상: [에이전트명 리스트]
수정 제외: [스킵할 에이전트]
추가 지시: [있으면 기재]

실행 순서:
1. Skill 파일 먼저 생성 (.claude/skills/[이름].md)
2. 에이전트 .md 수정 (frontmatter 추가 + 본문 축소 + skills 참조)
3. 에이전트 본문에서 skill로 이동한 내용 제거
4. 기존 skill과 중복되는 내용이 있으면 통합
5. Command 파일 생성 (.claude/commands/[이름].md)
6. 중복 제거 (skill과 겹치는 에이전트 본문 제거)

각 파일 수정 전에 변경 내용을 보여주고 확인을 받아줘.
수정 완료 후 1단계 검증 스크립트를 다시 실행하여 규격 통과를 확인해줘.
```

---

## 3단계: Skill 규격

### Skill이란

Skill은 에이전트 또는 메인 세션에 **주입되는 도메인 지식**이다.
에이전트 본문(시스템 프롬프트)과 다른 점:

| | 에이전트 본문 | Skill |
|---|---|---|
| **역할** | 행동 지시 + 핵심 도메인 지식 | 참조/보조 자료 |
| **크기** | 지시 200단어 이하 + 핵심 지식은 필요한 만큼 | 제한 없음 |
| **로드 시점** | 에이전트 시작 시 항상 | `skills:` 지정 시 항상 / 미지정 시 on-demand |
| **공유** | 1개 에이전트 전용 | 여러 에이전트가 공유 가능 |

> **중요: "200단어"는 지시(instruction) 부분의 권장치이지, 본문 전체 제한이 아니다.**
> 에이전트가 skill 로드 실패 시에도 기본 동작이 가능하도록, 핵심 도메인 지식은 본문에 유지해야 한다.

### Skill 파일 구조

#### 최소 규격 (필수)

```markdown
---
name: skill-name
description: 이 skill이 제공하는 지식을 한 줄로 설명.
---

# Skill: [이름]

[도메인 지식 본문]
```

#### 공식 지원 frontmatter 필드

| 필드 | 필수 | 설명 |
|---|---|---|
| `name` | O | skill 식별자 |
| `description` | O | 설명. Claude가 자동 호출 여부를 판단하는 데 사용 |
| `allowed-tools` | — | skill 실행 시 허용할 도구 (공백 구분 문자열 또는 YAML 리스트) |
| `user-invocable` | — | true면 `/skill명`으로 사용자 직접 호출 가능 |
| `disable-model-invocation` | — | true면 Claude 자동 호출 방지 (사용자 명시 호출만 허용) |
| `argument-hint` | — | `/skill명` 뒤에 올 인자의 힌트 텍스트 |
| `context` | — | `fork`이면 서브에이전트 컨텍스트에서 실행 |
| `agent` | — | 특정 에이전트로 skill을 실행 |
| `model` | — | 모델 지정 |
| `effort` | — | low / medium / high / max |
| `paths` | — | 파일 패턴 필터 (이 패턴의 파일 작업 시만 활성화) |
| `shell` | — | 셸 명령 실행 설정 |
| `hooks` | — | skill 전용 훅 |

#### 권장 규격

```markdown
---
name: skill-name
description: 이 skill이 제공하는 지식을 한 줄로 설명. 언제 참조하는지 키워드 포함.
allowed-tools: Read, Glob, Grep       # 이 skill을 직접 실행할 때 허용할 도구
---

# Skill: [이름]

## 목적
이 skill이 왜 필요한지 1-2문장.

## 사용하는 에이전트
- [에이전트명] — [이 skill을 어떤 맥락에서 참조하는지]
- [에이전트명] — [동일]

## 내용
(도메인 지식 본문)

## 관련 파일
| 파일 | 용도 |
|------|------|
| `path/to/file` | 설명 |
```

### Skill 분류 기준

| 유형 | 설명 | 예시 | 에이전트 연결 |
|---|---|---|---|
| **아키텍처** | 프로젝트 구조, URL, 라우팅, 서비스 간 관계 | `project-architecture.md` | seo-expert, geo-expert 공유 |
| **체크리스트** | 진단 항목, 점수 체계, 리포트 템플릿 | `seo-checklist.md` | seo-expert 전용 |
| **API 명세** | 외부 서비스 API, 인증, 엔드포인트, DTO | `blog-publish-api.md` | blog-publisher, geo-content-writer 공유 |
| **전략/가이드** | 키워드 전략, 콘텐츠 가이드, 엔진별 특성 | `geo-engine-comparison.md` | geo-expert 전용 |
| **지식 베이스** | 도메인 배경 지식, 개념 정의, 비교표 | `geo-fundamentals.md` | geo-expert, geo-content-writer 공유 |
| **구조/패턴** | 프로젝트 내 코드 패턴, 파일 구조, 컨벤션 | `i18n-structure.md` | i18n-worker 전용 |

### Skill 네이밍 규칙

```
[도메인]-[내용].md

seo-architecture.md      (SEO 도메인, 아키텍처 내용)
seo-checklist.md          (SEO 도메인, 체크리스트 내용)
geo-engine-comparison.md  (GEO 도메인, 엔진 비교 내용)
geo-fundamentals.md       (GEO 도메인, 기초 지식)
blog-publish-api.md       (Blog 도메인, API 명세 내용)
i18n-structure.md         (i18n 도메인, 구조/패턴)
project-architecture.md   (공통 도메인, 아키텍처 내용)
```

### Skill 작성 가이드

#### 에이전트에서 분리할 때

기존 에이전트 본문에서 skill로 분리하는 절차:

```
1. 에이전트 본문의 내용을 3종류로 분류한다:

   [A] 지시 (instruction) — 역할, 워크플로우, 성공 기준, 제약
       → 본문에 유지. 200단어 이하 권장.

   [B] 핵심 도메인 지식 — 이것 없이 에이전트가 제대로 동작 못하는 것
       (서비스 구조, 핵심 규칙, 파일 경로, 아키텍처 등)
       → 본문에 유지. 크기 제한 없음.
       → 판단 기준: "skill 로드가 실패하면 에이전트가 무력화되는가?" → Yes면 본문 유지

   [C] 참조/보조 자료 — 있으면 좋지만 없어도 기본 동작 가능한 것
       (상세 체크리스트, 점수 체계, 리포트 템플릿, API 명세, 코드 예시)
       → skill로 분리

2. [C]에 해당하는 내용만 skills/[도메인]-[내용].md 로 이동

3. 에이전트 frontmatter에 skills: 필드로 연결
   ---
   skills:
     - seo-checklist
   ---

4. 에이전트 본문에서 [C]만 제거. [A]+[B]는 반드시 유지.

⚠️ 주의: 모든 도메인 지식을 skill로 빼면 안 된다.
skill 로드 실패 시 에이전트가 빈 껍데기가 되기 때문이다.
```

#### 새로 작성할 때

```
1. "이 지식이 어떤 에이전트에서 필요한가?" 를 먼저 결정
   → 1개 에이전트 전용: 해당 에이전트의 보조 skill
   → 여러 에이전트 공유: 공통 skill (project- 접두어)

2. "이 지식은 얼마나 자주 변경되는가?" 를 확인
   → 자주 변경: skill 파일에 "마지막 검증일" 표시
   → 거의 안 변함: 한번 작성하면 오래 유지

3. "사용자가 직접 호출할 필요가 있는가?"
   → 있다: allowed-tools 필드 추가 + commands/에 트리거 command도 작성
   → 없다: 에이전트만 참조 (allowed-tools 불필요)
```

#### 기존 문서(doc/)를 skill로 전환할 때

프로젝트에 이미 `/doc/` 하위에 기술 문서가 있는 경우,
그 문서를 그대로 skill로 전환하거나 참조할 수 있다.

```
방법 A: 문서를 skill로 이동
  doc/tech/PAYMENT_CURRENCY.md → .claude/skills/payment-currency.md
  장점: skill 디렉토리에서 일괄 관리
  단점: doc/ 에서 참조하던 다른 문서/CLAUDE.md 링크 깨짐

방법 B: skill이 doc/를 참조하도록 작성 (권장)
  .claude/skills/payment-guide.md 본문에:
  "상세 내용은 doc/tech/PAYMENT_CURRENCY.md를 참조하라"
  장점: 기존 문서 구조 유지, 중복 없음
  단점: skill 단독으로는 불완전

방법 C: CLAUDE.md의 @import로 대체
  CLAUDE.md에 @doc/tech/PAYMENT_CURRENCY.md
  장점: 가장 간단
  단점: skill 고유 기능(에이전트 주입, allowed-tools) 사용 불가
```

### Skill 로드 방식

| 방식 | 설정 | 로드 시점 | 토큰 소비 | 사용 시점 |
|---|---|---|---|---|
| **preload** | 에이전트 `skills:` 필드에 명시 | 에이전트 시작 시 **항상** 전체 주입 | 높음 (항상 소비) | 에이전트가 **매번** 이 지식을 필요로 할 때 |
| **auto-invoke** | description 매칭 (기본 동작) | Claude가 작업과 매칭될 때 자동 로드 | 중간 (매칭 시만) | Claude가 판단하여 필요할 때 자동 사용 |
| **on-demand** | `skills:` 미지정, 본문에 "필요 시 참조" 안내 | 에이전트가 필요할 때 직접 읽기 | 낮음 (필요 시만) | 가끔 참조하는 보조 지식 |
| **user-invoke** | `user-invocable: true` + `/skill명` | 사용자가 호출할 때 | 낮음 | 메인 세션에서 직접 사용 |
| **fork** | `context: fork` | 호출 시 서브에이전트 컨텍스트에서 실행 | 별도 컨텍스트 | Skill이 자율적 판단/실행을 필요로 할 때 |

> `disable-model-invocation: true`를 설정하면 auto-invoke를 차단하고 user-invoke만 허용한다.

**preload vs on-demand 판단:**
```
"이 에이전트가 호출될 때 80% 이상 이 skill을 참조하는가?"
  → Yes → preload (skills: 필드)
  → No  → on-demand (본문에 참조 안내만)
```

### Skill 검증

#### 1. skill 파일 lint

```bash
SKILLS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/skills"

echo "=== skill 검증 ==="
for f in "$SKILLS_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .md)

  has_frontmatter=$(head -1 "$f" | grep -c '^---')
  if [ "$has_frontmatter" -eq 0 ]; then
    echo "❌ $name — frontmatter 없음"
    continue
  fi

  has_name=$(sed -n '/^---$/,/^---$/p' "$f" | grep -c '^name:')
  has_desc=$(sed -n '/^---$/,/^---$/p' "$f" | grep -c '^description:')

  status="✅"
  issues=""
  [ "$has_name" -eq 0 ] && status="❌" && issues="$issues name누락"
  [ "$has_desc" -eq 0 ] && status="❌" && issues="$issues description누락"

  words=$(wc -w < "$f")
  echo "$status $name — ${words}단어 $issues"
done
```

#### 2. 에이전트 ↔ skill 연결 확인

```bash
echo "=== 에이전트 skills: 필드 검증 ==="
AGENTS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/agents"
SKILLS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/skills"

for f in "$AGENTS_DIR"/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .md)
  [[ "$name" == "README" ]] && continue

  # frontmatter에서 skills: 필드 추출
  skills=$(sed -n '/^skills:/,/^[^ -]/p' "$f" | grep '^ *- ' | sed 's/^ *- //')

  for skill in $skills; do
    if [ ! -f "$SKILLS_DIR/$skill.md" ]; then
      echo "❌ $name → skills/$skill.md 파일 없음 (깨진 참조)"
    else
      echo "✅ $name → $skill"
    fi
  done
done
```

#### 3. 고아 skill 감지 (어디서도 참조하지 않는 skill)

```bash
echo "=== 미참조 skill 감지 ==="
for f in "$SKILLS_DIR"/*.md; do
  [ -f "$f" ] || continue
  skill_name=$(basename "$f" .md)

  # 어떤 에이전트의 skills: 필드에서도 참조되지 않는 skill
  referenced=$(grep -rl "- $skill_name" "$AGENTS_DIR"/*.md 2>/dev/null | wc -l)
  if [ "$referenced" -eq 0 ]; then
    echo "⚠️ $skill_name — 어떤 에이전트에서도 참조하지 않음 (고아 skill)"
  fi
done
```

### Skill 작성 예시

#### 예시 1: 에이전트에서 분리한 체크리스트 skill

```markdown
---
name: seo-checklist
description: SEO 진단 체크리스트. 항목별 점수 체계, 확인 방법, 리포트 템플릿 포함.
---

# Skill: SEO Checklist

## 사용하는 에이전트
- seo-expert — 페이지 SEO 감사 시 이 체크리스트로 점수를 산출

## 진단 항목

### 1. Overview (메타태그) — 5점
| # | 체크 항목 | 점수 | 확인 방법 |
|---|----------|------|----------|
| 1 | SEO 컴포넌트 적용됨 | 1 | 페이지 파일에서 SEO 컴포넌트 검색 |
...
```

#### 예시 2: 여러 에이전트가 공유하는 아키텍처 skill

```markdown
---
name: project-architecture
description: 프로젝트 서비스 아키텍처. URL 구조, 서비스별 플랫폼, 라우팅 규칙.
---

# Skill: Project Architecture

## 사용하는 에이전트
- seo-expert — URL canonical, hreflang 설정 시 참조
- geo-expert — 서비스별 AI 인용 전략 수립 시 참조

## 서비스 구조

| 서비스 | URL | 플랫폼 | 상태 |
|--------|-----|--------|------|
| Main | `example.com/` | Next.js | Production |
| Blog | `example.com/blog/` | CMS | Production |
| Docs | `example.com/docs/` | Docusaurus | Production |
...
```

#### 예시 3: 기존 doc/를 참조하는 가이드 skill

```markdown
---
name: payment-guide
description: 결제 시스템 가이드. 결제 수단별 연동, 구독/환불 절차.
---

# Skill: Payment Guide

## 사용하는 에이전트
- (현재 직접 연결된 에이전트 없음 — 메인 세션에서 on-demand 참조)

## 핵심 요약
- 국내 결제: [PG사] — KRW 전용
- 해외 결제: Stripe — 멀티 커런시

## 상세 문서
아래 파일을 직접 읽어서 참조하라:
- `doc/tech/PAYMENT.md` — 결제 연동 상세
- `doc/PAYMENT_ENDPOINTS.md` — API 엔드포인트 목록
```

---

## 4단계: Command 규격

### Command 파일 구조

```markdown
---
name: command-name
description: /command-name 으로 실행. [무엇을 하는지 한 줄].
---

[Claude에게 전달할 프롬프트. 간결하게.]

대상: $ARGUMENTS (사용자가 /command-name 뒤에 입력한 인자)
```

### Command 분류 기준

| 유형 | 설명 | 예시 |
|---|---|---|
| **진단** | 특정 대상을 빠르게 점검 | `/seo-review landing`, `/geo-review pricing` |
| **조회** | 현황을 빠르게 확인 | `/blog-status`, `/agent-health` |
| **트리거** | 에이전트 기반 대규모 작업 시작 | `/seo-audit` → seo-expert 에이전트 호출 |

### Command 네이밍 규칙

```
[도메인]-[동작].md

seo-review.md       (SEO, 리뷰)
seo-audit.md        (SEO, 감사)
geo-review.md       (GEO, 리뷰)
blog-status.md      (Blog, 상태 조회)
agent-health.md     (Agent, 건강 체크)
```

### Agent를 트리거하는 Command 패턴

```markdown
---
name: seo-audit
description: /seo-audit 로 전체 사이트 SEO 감사를 시작한다.
---

seo-expert 에이전트를 사용하여 전체 공개 페이지의 SEO 감사를 수행해줘.

대상: 랜딩(/), 가격(/pricing), 블로그(/ko/blog, /en/blog), Docs(/docs/)
각 페이지별 7대 항목 진단 리포트를 생성하고 우선순위별 개선 사항을 정리해줘.
```

---

## 5단계: Agent 규격 템플릿

### 최소 규격 (필수)

```markdown
---
name: "agent-name"
description: "Use when [트리거]. [역할] 전문. [키워드1], [키워드2], [키워드3]."
tools: Read, Glob, Grep, Bash
memory: project
---

# Agent Name

## 역할
한 문장.

## 워크플로우
1. 단계 1
2. 단계 2
3. 단계 3

## 성공 기준
- 기준 1
- 기준 2

## 제약
- 하지 않는 것

## 핵심 지식
(이 에이전트가 동작하기 위해 반드시 필요한 도메인 지식.
skill 로드 실패 시에도 기본 동작이 가능하도록 여기에 포함.
크기 제한 없음.)
```

### 권장 규격 (선택 필드 포함)

```markdown
---
name: "agent-name"
description: "Use when [트리거]. [역할] 전문. [키워드1], [키워드2], [키워드3]."
tools: Read, Edit, Glob, Grep, Bash
disallowedTools: Write
model: inherit                   # 부모 세션 모델 사용
effort: high                     # low / medium / high / max (Opus 4.6 전용)
maxTurns: 15
memory: project                  # project(.claude/) / user(~/.claude/) / local(프로젝트 로컬)
skills:
  - reference-checklist          # [C] 참조 자료만 skill로
  - reference-templates
# --- 아래는 필요 시 추가 ---
# mcpServers: [...]              # 에이전트 전용 MCP 서버
# permissionMode: default        # 에이전트 권한 모드
# hooks: { ... }                 # 에이전트 전용 훅
# isolation: worktree            # git worktree 격리 실행
# disabled: false                # true면 자동 위임에서 제외
---

# Agent Name

## 역할
한 문장: 무엇을 하고 왜 존재하는지.

## 워크플로우
1. 요청 분석
2. 아래 핵심 지식 + skills 참조
3. 코드/설정 탐색
4. 진단/실행/리포트
5. memory에 패턴 기록

## 핵심 지식
(skill 로드 없이도 에이전트가 동작할 수 있는 필수 도메인 지식.
서비스 구조, 핵심 규칙, 파일 경로 등. 크기 제한 없음.)

## 성공 기준
- 측정 가능한 결과 1
- 측정 가능한 결과 2

## 제약
- 하지 않는 것 (불필요한 시도 방지)
- 다른 에이전트 담당 영역 명시
```

### description 작성 가이드

```
구조: "Use when [트리거 조건]. [역할 한 줄]. [반복 키워드 나열]."

좋은 예:
"Use when SEO 개선, hreflang 검증, 메타태그 점검, sitemap/robots 분석 필요 시. [프로젝트명] SEO 전문. 크롤링, noIndex, 접근성, Core Web Vitals."
"Expert code reviewer. Use proactively after code changes."  ← 적극 위임 유도

나쁜 예:
"SEO를 분석한다."
"SEO 관련 작업을 수행하는 에이전트."

> "Use proactively"를 description에 포함하면 Claude가 관련 작업 시 적극적으로 자동 위임한다.
```

키워드 소스: 임시 서브에이전트 감사(subagent-audit-guide.md)에서 반복 생성된 description을 그대로 사용.

---

## 체크리스트

### 규격 검증 (수시)

- [ ] 1-1 frontmatter 필수 필드 검증 통과
- [ ] 1-2 지시(instruction) 부분 200단어 이하 + 핵심 도메인 지식 본문 유지 + 참조 자료만 skill 분리
- [ ] 1-3 도메인 지식이 skill로 분리됨
- [ ] 1-4 에이전트 ↔ skill 중복 없음

### 규격 수정 (필요 시)

- [ ] 프롬프트 E로 규격 검증 + skill 분리 계획 dry-run 프리뷰 확인
- [ ] 프리뷰 검토 → 승인/수정/스킵 결정
- [ ] 프롬프트 F로 수정 실행 (승인된 것만) — skill 생성, 에이전트 수정, command 생성 포함
- [ ] 수정 후 검증: agent lint + skill lint + 연결 확인 + 고아 skill 감지

### Skill 분리/추가 시

- [ ] 분리 대상 식별 (테이블 20행+, 코드블록 10개+, 여러 에이전트 공유 지식)
- [ ] preload vs on-demand 판단 (Skill 로드 방식 테이블 참조)
- [ ] 기존 skill과 중복 없는지 확인
- [ ] 기존 doc/ 문서와 관계 확인 (이동 vs 참조 vs @import)
- [ ] 프롬프트 E로 프리뷰 → 승인 → 프롬프트 F로 실행
- [ ] skill lint + 에이전트 ↔ skill 연결 확인 + 고아 skill 감지

### 신규 에이전트 추가 시

- [ ] Agent / Skill / Command 분류 판단
- [ ] 5단계 템플릿 기반으로 에이전트 작성
- [ ] 도메인 지식은 skill로 분리 (200단어 초과 시)
- [ ] skill은 3단계 규격 준수 (frontmatter, 사용 에이전트 명시)
- [ ] 기존 에이전트/skill과 역할 겹침 없는지 확인
- [ ] 전체 검증 통과 (agent lint + skill lint + 연결 + 고아)
- [ ] `claude agents` 명령어로 로드 확인
- [ ] README.md 업데이트

---

## FAQ

**Q: 에이전트 본문이 200단어를 넘으면 무조건 skill로 분리해야 하나?**

A: "200단어"는 **지시(instruction) 부분**의 권장치이지, 본문 전체 제한이 아니다. 에이전트 본문은 3종류로 구분한다:
- **[A] 지시** (역할, 워크플로우, 제약) → 200단어 이하 권장
- **[B] 핵심 도메인 지식** (이것 없이 에이전트가 동작 못하는 것) → 본문에 유지, 크기 제한 없음
- **[C] 참조 자료** (체크리스트, 점수 체계, API 명세 등) → skill로 분리

22KB 에이전트를 1.3KB로 줄이면 skill 로드 실패 시 에이전트가 무력화된다. [A]+[B]는 본문에 남기고 [C]만 분리하는 것이 올바른 접근이다.

**Q: `skills:` 필드에 명시한 skill 파일이 없으면 어떻게 되나?**

A: Claude Code가 에러를 내는지 무음으로 무시하는지는 버전에 따라 다를 수 있다. 안전하게 대응하려면:
1. **에이전트 배치 후 반드시 skill 연결 확인 스크립트(3단계 검증)를 실행**하여 깨진 참조를 감지
2. **핵심 도메인 지식은 본문 [B]에 유지** — skill이 로드 안 되어도 기본 동작 가능하도록
3. `claude agents` 명령으로 에이전트 로드 상태를 확인 — 여기서 skill 오류가 표시되면 수정

**Q: 프롬프트 E에서 `[프로젝트경로]`가 뭔가?**

A: 프롬프트 E는 Claude에게 전달하는 텍스트이므로, 실행 시 Claude가 현재 프로젝트의 `.claude/agents/` 를 자동으로 찾는다. 별도 경로 지정이 필요하면 실행 프롬프트에서 명시하라. (예: "팀 공유 에이전트 경로: /path/to/repo/.claude/agents/")

**Q: skills 필드에 등록하면 항상 로드되나?**

A: 그렇다. `skills:` 필드에 명시한 skill은 에이전트 시작 시 전체 내용이 컨텍스트에 주입된다 (preload). 선택적으로 로드하려면 Skill 로드 방식 테이블(3단계)을 참조하라.

**Q: command와 skill의 차이가 헷갈린다.**

A:
- **Command**: `/seo-review landing` — 사용자가 실행하면 프롬프트가 Claude에 전달됨. 메인 세션에서 동작.
- **Skill**: 에이전트 내부에서 참조하는 지식. Claude가 description 매칭으로 자동 호출하거나, 에이전트가 필요할 때 읽음.
- Skill도 `user-invocable: true` 설정 시 `/skill명`으로 사용자 직접 호출 가능. 이 경우 command와 비슷하게 동작하지만, 주 목적은 에이전트에 지식 제공.
- Skill에 `context: fork`를 설정하면 서브에이전트 컨텍스트에서 실행되어 자율적 작업이 가능. 자세한 동작 방식은 Skill 로드 방식 테이블(3단계) 참조.

**Q: 기존 에이전트를 수정할 때 skill로 분리하면 기존 동작이 깨지지 않나?**

A: `skills:` 필드로 연결하면 에이전트 시작 시 자동 주입되므로, 에이전트 입장에서는 본문에 있던 것과 동일하게 참조 가능. 오히려 본문이 짧아져서 핵심 지시에 더 집중한다.

**Q: 이 가이드와 subagent-audit-guide.md의 관계는?**

A:
- **subagent-audit-guide.md** = 개인용. 본인 `.claude/` 세션을 분석하여 "어떤 에이전트가 필요한지" 발견
- **이 가이드 (agent-standard-guide.md)** = 팀용. 발견된 에이전트를 "규격에 맞게 작성/검증/수정"
- 감사 결과(dry-run 프리뷰)가 이 가이드의 입력이 되고, 이 가이드의 규격을 적용한 에이전트가 감사의 효과 측정 대상이 됨.
