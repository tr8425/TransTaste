# 서브에이전트 세션 감사 및 통합 가이드

> `.claude/projects/` 내 누적된 임시 세션·서브에이전트를 분석하여,
> 재사용 가능한 정식 에이전트로 통합하는 프로세스.

## 배경

Claude Code는 대화 중 `Agent` 도구로 서브에이전트를 생성할 때, 기존에 정의된 커스텀 에이전트(`agents/*.md`)가 아닌 **내장 타입(Explore, general-purpose, Plan)** 으로 임시 생성하는 경우가 많다.

이렇게 생성된 임시 에이전트는:
- 프로젝트 도메인 지식 없이 범용으로 동작
- 세션 종료 후 `<uuid>/subagents/` 폴더에 로그만 남김
- 같은 종류의 작업이 반복되어도 매번 새로 생성됨

이 가이드는 이 누적 데이터를 분석하여 **정식 에이전트로 승격**시키는 절차를 설명한다.

---

## 사전 준비

### 의존성 확인

```bash
# 필수 도구 확인
echo "=== 의존성 체크 ==="
command -v python3 >/dev/null && echo "✅ python3" || echo "❌ python3 — 스크립트 실행에 필수"
command -v git >/dev/null && echo "✅ git" || echo "❌ git — 커밋 분석에 필수"
echo ""
echo "python3 버전: $(python3 --version 2>/dev/null || echo '미설치')"
```

### 플랫폼별 주의사항

| 플랫폼 | `~/.claude/` 경로 | 주의 |
|---|---|---|
| macOS | `/Users/[name]/.claude/` | 기본 동작 |
| Linux | `/home/[name]/.claude/` | 기본 동작 |
| WSL | `/mnt/c/Users/[name]/.claude/` 또는 `/home/[name]/.claude/` | 경로 깊이 다를 수 있음 |

> 아래 스크립트들은 `~/.claude/projects/` 를 기준으로 동작하므로 대부분의 환경에서 호환됩니다.
> 다만 `awk -F/` 로 경로를 파싱하는 부분은 홈 디렉토리 깊이에 따라 필드 번호가 달라질 수 있습니다.
> 문제가 생기면 `echo "$meta" | awk -F/ '{for(i=1;i<=NF;i++) print i": "$i}'` 로 필드 번호를 확인하세요.

---

## 1단계: 현황 스캔

### 1-1. 프로젝트별 세션 수 확인

```bash
# 각 프로젝트의 세션 폴더/파일 수 확인
for proj in ~/.claude/projects/*/; do
  name=$(basename "$proj")
  sessions=$(ls "$proj" 2>/dev/null | grep -cE '^[0-9a-f]{8}-')
  echo "$name: $sessions sessions"
done
```

### 1-2. 서브에이전트 메타 전수 추출

```bash
# 모든 서브에이전트의 타입과 설명을 한 파일로 추출
OUTPUT=~/.claude/subagent-audit-$(date +%Y%m%d).tsv
echo -e "project\tsession\tagent_type\tdescription" > "$OUTPUT"

for meta in ~/.claude/projects/*/*/subagents/*.meta.json; do
  [ -f "$meta" ] || continue
  # projects/ 이후의 경로에서 프로젝트명과 세션 ID를 추출 (홈 디렉토리 깊이 무관)
  rel=${meta#*/.claude/projects/}
  proj=$(echo "$rel" | cut -d/ -f1)
  session=$(echo "$rel" | cut -d/ -f2)
  type=$(python3 -c "import json,sys; print(json.load(open('$meta')).get('agentType',''))" 2>/dev/null)
  desc=$(python3 -c "import json,sys; print(json.load(open('$meta')).get('description',''))" 2>/dev/null)
  echo -e "$proj\t$session\t$type\t$desc" >> "$OUTPUT"
done

echo "추출 완료: $OUTPUT"
echo "총 서브에이전트: $(tail -n +2 "$OUTPUT" | wc -l)"
```

### 1-2b. description 누락 서브에이전트 보완

description이 빈 서브에이전트는 키워드 분류가 불가능하다.
세션 jsonl의 첫 사용자 메시지에서 작업 의도를 추출하여 보완한다.

```bash
TSV=~/.claude/subagent-audit-$(date +%Y%m%d).tsv
PATCHED=~/.claude/subagent-audit-$(date +%Y%m%d)-patched.tsv

head -1 "$TSV" > "$PATCHED"

while IFS=$'\t' read -r proj session atype desc; do
  if [ -z "$desc" ]; then
    # 세션 jsonl에서 첫 사용자 메시지 추출
    jsonl=~/.claude/projects/"$proj"/"$session".jsonl
    if [ -f "$jsonl" ]; then
      desc=$(grep '"type":"user"' "$jsonl" | head -1 | python3 -c "
import json,sys
try:
  msg = json.load(sys.stdin)
  content = msg.get('message',{}).get('content','')
  if isinstance(content, list):
    content = ' '.join(c.get('text','') for c in content if isinstance(c, dict))
  print(content[:100].replace('\t',' ').replace('\n',' ').replace('\r',' ').replace('\"',''))
except: print('')" 2>/dev/null)
    fi
  fi
  echo -e "$proj\t$session\t$atype\t$desc" >> "$PATCHED"
done < <(tail -n +2 "$TSV")

EMPTY_BEFORE=$(tail -n +2 "$TSV" | awk -F'\t' '$4==""' | wc -l)
EMPTY_AFTER=$(tail -n +2 "$PATCHED" | awk -F'\t' '$4==""' | wc -l)
echo "보완 전 빈 description: $EMPTY_BEFORE → 보완 후: $EMPTY_AFTER"
echo "이후 분석은 patched TSV를 사용한다."
```

> 이 스크립트는 빈 description을 세션의 첫 사용자 프롬프트 앞 100자로 채운다.
> 완벽하지 않지만 키워드 분류의 커버리지를 크게 높인다.

### 1-3. 카테고리 빠른 확인 (키워드 기반)

> **용도:** 프롬프트 A 실행 전 전체 규모를 빠르게 파악하는 용도.
> 키워드 중복으로 합계가 전체보다 클 수 있으며, 정확한 분류는 프롬프트 A에서 의미 기반으로 수행한다.

```bash
# ⚠️ 1-2b에서 생성한 patched TSV를 사용한다 (빈 description 보완 후)
TSV=~/.claude/subagent-audit-$(date +%Y%m%d)-patched.tsv
[ ! -f "$TSV" ] && TSV=~/.claude/subagent-audit-$(date +%Y%m%d).tsv

echo "=== 코드 탐색/리뷰 ==="
grep -i 'explore\|find\|check\|확인\|탐색\|조사\|분석\|review\|코드\|component\|hook\|구조' "$TSV" | wc -l

echo "=== SEO 관련 ==="
grep -i 'seo\|meta.*tag\|hreflang\|sitemap\|robots\|crawl\|noindex\|canonical\|heading' "$TSV" | wc -l

echo "=== 프론트엔드/UI ==="
grep -i 'FE\|frontend\|컴포넌트\|페이지\|landing\|pricing\|modal\|UI\|CTA\|button\|form' "$TSV" | wc -l

echo "=== GEO 관련 ==="
grep -i 'geo\|citation\|구조화.*데이터\|json-ld\|ai.*검색\|perplexity\|llms\.txt' "$TSV" | wc -l

echo "=== 백엔드/API ==="
grep -i 'BE\|backend\|api\|nestjs\|pub-api\|controller\|service\|dto\|migration\|fastapi' "$TSV" | wc -l

echo "=== 인프라/배포 ==="
grep -i 'infra\|deploy\|docker\|terraform\|lambda\|cloudfront\|build\|config\|webpack' "$TSV" | wc -l

echo "=== 콘텐츠/블로그 ==="
grep -i 'blog\|콘텐츠\|content\|초안\|draft\|키워드\|keyword\|writer\|InBlog' "$TSV" | wc -l

echo "=== i18n/번역 ==="
grep -i 'i18n\|번역\|translation\|언어\|locale\|다국어' "$TSV" | wc -l

echo "=== 문서/가이드 ==="
grep -i 'doc\|문서\|가이드\|docusaurus\|users.*guide\|README' "$TSV" | wc -l

echo "=== 경쟁사/시장 ==="
grep -i 'competitor\|경쟁\|leonardo\|G2\|리뷰.*조사\|Paperclip' "$TSV" | wc -l

echo ""
echo "→ 대략적인 규모 파악 후 프롬프트 A에서 의미 기반으로 재분류한다."
```

---

## 1.5단계: Git 히스토리 크로스 레퍼런스

서브에이전트 메타만으로는 "무엇을 시도했는지"만 보인다.
Git 히스토리를 교차 분석하면 **"실제로 무엇이 바뀌었는지"** 를 함께 볼 수 있다.

### 1.5-1. 본인의 Claude 관여 커밋 추출

> **중요: 반드시 본인 커밋만 필터링한다.**
> 다른 팀원의 커밋을 분석에 포함하면 잘못된 에이전트 범위가 산출된다.
> 예: SNS 기능은 다른 작업자 담당인데, 본인의 에이전트 작업 범위로 잡히는 문제.

`Co-Authored-By: Claude` 태그가 있는 커밋만으로는 부족하다.
커밋 메시지를 직접 작성하거나, 훅을 건너뛴 경우 태그가 누락되기 때문이다.

**실제 프로젝트 예시:**
전체 6,838커밋 중 `Co-Authored-By: Claude`가 있는 것은 430개(6%)뿐이었다.
나머지 94% 중 Claude가 관여했지만 태그가 없는 커밋이 상당수 존재한다.

#### 사전 준비: 본인 Git Author 설정

```bash
# 본인의 git author name 확인
git config user.name

# ⚠️ git config user.name과 실제 커밋의 author가 다를 수 있다!
# 반드시 실제 커밋에서 확인:
git log --all --format="%an" | sort | uniq -c | sort -rn | head -10

# 본인 이름을 찾아 환경변수로 설정
export MY_GIT_AUTHOR="[본인 커밋에 표시되는 이름]"

# 여러 이름을 사용했다면 모두 지정 (--author는 OR 조건)
# export MY_GIT_AUTHORS="--author=[이름1] --author=[이름2]"
```

> **팀원이 여러 이름을 쓴 경우** (예: 회사 PC / 개인 PC)
> ```bash
> # 본인이 사용한 모든 author name 확인
> git log --all --format="%an" | sort -u | grep -i "[본인이름]"
> ```
> 여러 개면 `--author` 를 반복 사용:
> `git log --author="[이름1]" --author="[이름2]" ...`

#### 방법 A: 태그 기반 (확실한 것만)

```bash
OUTPUT_GIT=~/.claude/git-audit-$(date +%Y%m%d).tsv
echo -e "hash\tdate\tauthor\tsubject\tfiles_changed\tinsertions\tdeletions\tdetection" > "$OUTPUT_GIT"

git log --since="2025-01-01" --all --author="$MY_GIT_AUTHOR" --format="%H" --grep="Co-Authored-By: Claude" | while read h; do
  date=$(git log -1 --format="%ai" "$h")
  author=$(git log -1 --format="%an" "$h")
  subject=$(git log -1 --format="%s" "$h")
  stat=$(git diff-tree --shortstat "$h" 2>/dev/null | tail -1 | sed 's/^ //')
  files=$(echo "$stat" | grep -oE '[0-9]+ file' | grep -oE '[0-9]+')
  ins=$(echo "$stat" | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
  del=$(echo "$stat" | grep -oE '[0-9]+ deletion' | grep -oE '[0-9]+')
  echo -e "$h\t$date\t$author\t$subject\t${files:-0}\t${ins:-0}\t${del:-0}\tco-authored" >> "$OUTPUT_GIT"
done

echo "태그 기반: $(tail -n +2 "$OUTPUT_GIT" | wc -l) 커밋"
```

#### 방법 B: 휴리스틱 (태그 없는 Claude 커밋 포함)

태그가 없어도 Claude가 작성했을 가능성이 높은 커밋을 추가로 수집한다.

```bash
# 방법 A 실행 후 이어서 실행

# 휴리스틱 1: [claude] prefix (본인 커밋만)
git log --since="2025-01-01" --all --author="$MY_GIT_AUTHOR" --format="%H %s" \
  --invert-grep --grep="Co-Authored-By: Claude" \
  | grep -iE '^\w+ \[claude\]' \
  | while read h subject; do
    date=$(git log -1 --format="%ai" "$h")
    stat=$(git diff-tree --shortstat "$h" 2>/dev/null | tail -1)
    files=$(echo "$stat" | grep -oE '[0-9]+ file' | grep -oE '[0-9]+')
    ins=$(echo "$stat" | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
    del=$(echo "$stat" | grep -oE '[0-9]+ deletion' | grep -oE '[0-9]+')
    echo -e "$h\t$date\t$MY_GIT_AUTHOR\t$subject\t${files:-0}\t${ins:-0}\t${del:-0}\theuristic-prefix"
  done >> "$OUTPUT_GIT"

# 휴리스틱 2: 세션 활성 시간대에 만들어진 본인 커밋
# (서브에이전트 세션 jsonl의 타임스탬프와 커밋 시간이 같은 날)
for jsonl in ~/.claude/projects/*/????????-????-????-????-????????????.jsonl; do
  [ -f "$jsonl" ] || continue
  session_ts=$(head -1 "$jsonl" | python3 -c "import json,sys; print(json.load(sys.stdin).get('timestamp','')[:19])" 2>/dev/null)
  [ -z "$session_ts" ] && continue
  session_date=$(echo "$session_ts" | cut -c1-10)

  git log --since="$session_date 00:00" --until="$session_date 23:59" --all \
    --author="$MY_GIT_AUTHOR" --format="%H" \
    --invert-grep --grep="Co-Authored-By: Claude" 2>/dev/null | while read h; do
    # 이미 TSV에 있으면 스킵
    grep -q "$h" "$OUTPUT_GIT" && continue
    date=$(git log -1 --format="%ai" "$h")
    subject=$(git log -1 --format="%s" "$h")
    stat=$(git diff-tree --shortstat "$h" 2>/dev/null | tail -1)
    files=$(echo "$stat" | grep -oE '[0-9]+ file' | grep -oE '[0-9]+')
    ins=$(echo "$stat" | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
    del=$(echo "$stat" | grep -oE '[0-9]+ deletion' | grep -oE '[0-9]+')
    echo -e "$h\t$date\t$MY_GIT_AUTHOR\t$subject\t${files:-0}\t${ins:-0}\t${del:-0}\theuristic-session-time"
  done >> "$OUTPUT_GIT"
done

# 휴리스틱 3: 커밋 메시지에 Claude/agent/generated 키워드 (본인 커밋만)
git log --since="2025-01-01" --all --author="$MY_GIT_AUTHOR" --format="%H %s" \
  --invert-grep --grep="Co-Authored-By: Claude" \
  | grep -iE 'generated|auto-generated|agent|서브에이전트' \
  | while read h subject; do
    grep -q "$h" "$OUTPUT_GIT" && continue
    date=$(git log -1 --format="%ai" "$h")
    stat=$(git diff-tree --shortstat "$h" 2>/dev/null | tail -1)
    files=$(echo "$stat" | grep -oE '[0-9]+ file' | grep -oE '[0-9]+')
    ins=$(echo "$stat" | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
    del=$(echo "$stat" | grep -oE '[0-9]+ deletion' | grep -oE '[0-9]+')
    echo -e "$h\t$date\t$MY_GIT_AUTHOR\t$subject\t${files:-0}\t${ins:-0}\t${del:-0}\theuristic-keyword"
  done >> "$OUTPUT_GIT"

echo "전체 수집: $(tail -n +2 "$OUTPUT_GIT" | wc -l) 커밋"
echo "=== detection 유형별 ==="
tail -n +2 "$OUTPUT_GIT" | cut -f7 | sort | uniq -c | sort -rn
```

#### detection 필드 해석

| 값 | 의미 | 신뢰도 |
|---|---|---|
| `co-authored` | `Co-Authored-By: Claude` 태그 존재 | 확실 |
| `heuristic-prefix` | `[claude]` 등 커밋 메시지 prefix | 높음 |
| `heuristic-keyword` | generated, agent 등 키워드 포함 | 중간 |
| `heuristic-session-time` | Claude 세션 활성 시간대와 겹침 | 낮음 (수동 커밋 가능) |

> **참고:** 휴리스틱은 오탐(false positive)이 있을 수 있다.
> 특히 `heuristic-session-time`은 같은 날 수동 커밋도 포함될 수 있으므로,
> 프롬프트 B-2 분석 시 "이 커밋이 정말 Claude가 만든 것인지"를
> diff 내용과 세션 로그를 대조하여 확인하는 과정이 필요하다.

### 1.5-2. 본인의 Claude 커밋이 가장 많이 수정한 경로 (핫 영역)

```bash
# 본인의 Claude 커밋에서 변경된 파일 경로의 디렉토리별 빈도
git log --since="2025-01-01" --all --author="$MY_GIT_AUTHOR" --format="%H" --grep="Co-Authored-By: Claude" \
  | while read h; do git diff-tree --no-commit-id --name-only -r "$h" 2>/dev/null; done \
  | sed 's|/[^/]*$||' \
  | sort | uniq -c | sort -rn | head -20
```

이 결과는 에이전트가 **실제로 어떤 디렉토리를 주로 수정하는지** 보여준다.
에이전트 정의에 포함할 `tools` 경로 제한이나 프롬프트 내 "작업 범위"를 결정하는 근거가 된다.

### 1.5-3. 본인 커밋의 prefix 기반 작업 유형 분류

```bash
# [FE], [BE], [SEO] 등 prefix별 빈도 (본인 커밋만)
git log --since="2025-01-01" --all --author="$MY_GIT_AUTHOR" --format="%s" --grep="Co-Authored-By: Claude" \
  | grep -oE '^\[[^\]]+\](\[[^\]]+\])?' \
  | sort | uniq -c | sort -rn | head -20
```

### 1.5-4. 세션 ↔ 커밋 시간대 매칭

> **용도:** 세션과 커밋의 날짜 대응을 빠르게 확인하는 보조 스크립트.
> 출력 결과는 프롬프트 B-2 실행 시 컨텍스트로 제공한다.

```bash
# 서브에이전트 세션 시점과 커밋 시점을 대조하여 어떤 세션이 어떤 커밋을 만들었는지 추정
# TSV + git-audit TSV를 날짜 기준으로 조인

SESSION_TSV=~/.claude/subagent-audit-$(date +%Y%m%d).tsv
GIT_TSV=~/.claude/git-audit-$(date +%Y%m%d).tsv

echo "=== 세션별 근접 커밋 매칭 ==="
while IFS=$'\t' read -r proj session atype desc; do
  # 세션 jsonl 첫 줄에서 타임스탬프 추출
  jsonl=~/.claude/projects/"$proj"/"$session".jsonl
  [ -f "$jsonl" ] || continue
  session_date=$(head -1 "$jsonl" | python3 -c "import json,sys; print(json.load(sys.stdin).get('timestamp','')[:10])" 2>/dev/null)
  [ -z "$session_date" ] && continue

  # 같은 날 Claude 커밋 찾기
  commits=$(grep "$session_date" "$GIT_TSV" | cut -f3 | head -3 | tr '\n' ' | ')
  [ -n "$commits" ] && echo "$session_date | $desc → $commits"
done < <(tail -n +2 "$SESSION_TSV")

# → 이 출력을 프롬프트 B-2에 함께 제공하면 세션-커밋 교차 분석 정확도가 높아진다.
```

### 분석 시 활용 포인트

| 서브에이전트 메타 (시도) | Git 히스토리 (결과) | 교차 분석으로 알 수 있는 것 |
|---|---|---|
| `"SEO description 중복 분석"` | `[FE][SEO] claude SEO audit Minor issue 수정` | 임시 에이전트가 실제 코드 수정까지 이어졌는지 |
| `"GEO 블로그 초안 작성"` | (해당 날짜 커밋 없음) | 리서치만 하고 커밋은 안 된 작업 → 프로세스 개선 필요 |
| (서브에이전트 기록 없음) | `[BE][refactor] audio.controller.ts CLAUDE.md 위반 수정` | 에이전트 없이 메인 세션에서 직접 처리한 작업 → 에이전트화 후보 |

---

## 2단계: 분석 프롬프트

아래 프롬프트를 Claude Code에서 실행하면, 세션 데이터를 기반으로 통합 리포트를 생성한다.

### 프롬프트 A: 전수 분석

```
다음 TSV 파일을 읽어서 분석해줘: ~/.claude/subagent-audit-YYYYMMDD-patched.tsv

참고: 이 TSV의 description 필드는 두 가지 소스가 섞여 있다.
- 원본 meta.json에서 추출한 것 (정확)
- 세션 첫 메시지에서 보완한 것 (100자 잘림, 부정확할 수 있음)
키워드 분류 시 이 점을 감안하고, 애매한 것은 jsonl 내용을 직접 확인해줘.

1. 서브에이전트를 의미 기준으로 카테고리 분류 (중복 허용)
2. 각 카테고리별:
   - 빈도 (몇 번 생성되었는지)
   - 대표적인 description 예시 3~5개
   - 이미 agents/ 디렉토리에 정의된 에이전트와 겹치는지 여부
3. 정식 에이전트로 승격할 가치가 있는 카테고리 추천
   - 기준: 3회 이상 반복 + 도메인 지식이 도움되는 작업
4. 결과를 마크다운 테이블로 정리
```

### 프롬프트 B: 기존 에이전트 갭 분석

```
[프로젝트경로]/agents/ 디렉토리의 기존 에이전트 정의를 모두 읽고,
~/.claude/subagent-audit-YYYYMMDD-patched.tsv 의 임시 서브에이전트 목록과 대조해줘.

확인할 것:
1. 기존 에이전트가 커버하는데도 임시로 생성된 것 → 호출 누락
2. 기존 에이전트가 커버하지 못하는 반복 패턴 → 신규 에이전트 후보
3. 기존 에이전트의 범위를 확장하면 커버 가능한 것 → 업데이트 후보

각 항목별로 구체적 description 예시와 함께 정리해줘.
```

### 프롬프트 B-2: Git 히스토리 크로스 분석

```
다음 두 파일을 읽어서 교차 분석해줘:
- 서브에이전트 메타: ~/.claude/subagent-audit-YYYYMMDD-patched.tsv
- Claude 커밋 이력: ~/.claude/git-audit-YYYYMMDD.tsv

주의: git-audit TSV는 본인(author=[이름]) 커밋만 포함되어 있다.
다른 팀원의 작업 영역은 분석 대상이 아니다.
git log를 추가로 실행할 때도 반드시 --author="[이름]"을 사용해줘.

분석할 것:
1. 서브에이전트가 생성되었고 실제 커밋도 있는 작업 → 효과적, 에이전트 유지
2. 서브에이전트가 생성되었지만 커밋이 없는 작업 → 리서치 전용 or 실패한 작업
3. 커밋은 있지만 서브에이전트 기록이 없는 작업 → 메인 세션에서 직접 처리, 에이전트화 후보
4. Claude 커밋이 가장 많이 수정한 디렉토리 Top 10 → 에이전트 작업 범위 정의에 활용

각 항목을 구체적 예시와 함께 테이블로 정리해줘.
```

### 프롬프트 C: Dry-Run — 에이전트 프리뷰

> **파일을 생성하지 않고** 어떤 에이전트가 만들어질지 미리 보여주는 단계.
> 이 결과를 보고 승인/수정/삭제를 결정한 뒤 프롬프트 D에서 실제 생성한다.
>
> 실행 전 비용 우선순위를 먼저 뽑아두면 후보 선정에 활용할 수 있다 (아래 B-3 참고).

### 프롬프트 B-3: 토큰 비용 기반 우선순위 (프롬프트 C 실행 전 선택 실행)

임시 서브에이전트 중 **가장 토큰을 많이 소비한 것부터** 정식 에이전트로 승격하면 비용 절감 효과가 크다.

> 참고: [claude-code-token-usage-analyzer](https://gist.github.com/kieranklaassen/7b2ebb39cbbb78cc2831497605d76cc6) — 프로젝트/세션/서브에이전트별 토큰 소비를 분석하는 Python 스크립트

```
~/.claude/projects/ 내 서브에이전트 jsonl 파일의 크기를 기준으로
가장 비용이 높은 임시 서브에이전트 Top 20을 뽑아줘.

분석 방법:
1. 각 서브에이전트 jsonl 파일 크기 (토큰 소비의 근사치)
2. 동일 description 패턴끼리 그룹화하여 누적 비용 계산
3. 내장 타입(Explore, general-purpose)만 대상

결과 형식:
| 순위 | 카테고리 (description 패턴) | 호출 횟수 | 총 jsonl 크기 | 기존 에이전트 대응 |
|---|---|---|---|---|

이 순위가 높을수록 정식 에이전트로 승격했을 때 비용 절감 효과가 크다.
커스텀 에이전트는 도메인 지식이 내장되어 있어 탐색/재시도가 줄어들기 때문이다.
```

```
프롬프트 A, B, B-2, (B-3) 분석 결과를 종합하여 생성할 에이전트 목록을 제안해줘.
파일은 생성하지 마. 프리뷰만 보여줘.

입력:
- 서브에이전트 메타: ~/.claude/subagent-audit-YYYYMMDD-patched.tsv
- Claude 커밋 이력: ~/.claude/git-audit-YYYYMMDD.tsv
- 개인 로컬 에이전트: ~/.claude/projects/[프로젝트명]/agents/
- 팀 공유 에이전트: [프로젝트repo]/.claude/agents/  (git 추적)
- 팀 공유 스킬: [프로젝트repo]/.claude/skills/  (git 추적)

⚠️ 중복 방지: 팀 공유 에이전트/스킬과 겹치는 후보는 "이미 팀에 존재"로 표시.
개인 로컬에만 있고 팀에 없는 것은 "팀 공유 승격 후보"로 표시.

팀 설계 문서가 있으면 함께 참조: [프로젝트repo]/doc/CLAUDE_SETUP_PLAN.md
→ 여기에 설계된 에이전트/스킬과 감사 결과를 대조하여, 설계만 되고 미구현인 것도 표시.

각 에이전트 후보에 대해 아래 형식으로 정리해줘:

---
### [번호]. [에이전트명]
- **판정**: 신규 생성 | 기존 업데이트 | 불필요 (스킵)
- **배치**: 팀 공유 (repo .claude/agents/) | 개인 로컬 (~/.claude/agents/) | 기존 팀 에이전트에 병합
- **근거**: 임시 에이전트 N회 생성 + 커밋 N건 or 커밋 전용 (세션 기록 없음)
- **기존 에이전트와 관계**: 없음 | [에이전트명]과 중복 | [에이전트명] 범위 확장
- **팀 공유 상태**: 팀 repo에 이미 존재 | 개인 로컬에만 존재 | 양쪽 모두 없음
- **역할 (1줄)**: ...
- **주요 작업 범위**:
  - 디렉토리: web/components/..., nestjs/src/...
  - 커밋 prefix: [FE], [BE][fix], ...
- **도구 제한**: tools: Read, Edit, ... / disallowedTools: ...
- **대표 작업 예시**:
  - (서브에이전트) "..."
  - (서브에이전트) "..."
  - (커밋) "..."
---

마지막에 요약 테이블을 추가해줘:

| # | 에이전트명 | 판정 | 배치 | 서브에이전트 횟수 | 관련 커밋 수 | 기존 에이전트 |
|---|---|---|---|---|---|---|

그리고 아래 질문에 답해줘:
1. 기존 에이전트 중 이번 분석으로 업데이트가 필요한 것은?
2. 서브에이전트도 없고 커밋도 적어서 에이전트화할 필요 없는 영역은?
3. 여러 카테고리에 걸쳐 있어서 하나로 합칠지 분리할지 판단이 필요한 것은?
4. 개인 로컬에만 있는 에이전트 중 팀 공유로 승격해야 할 것은? (다른 팀원도 같은 작업을 반복할 가능성)
5. 팀 repo에 이미 있는 에이전트와 겹치는 개인 에이전트가 있는가? (중복 제거 대상)
```

사용자가 프리뷰를 검토한 후:
- **승인** → 프롬프트 D로 진행
- **수정** → "2번은 기존 seo-expert에 병합해줘", "4번은 불필요" 등 피드백
- **재분석** → 조건 변경 후 프롬프트 C 재실행

### 프롬프트 D: 에이전트 정의 생성 (승인 후)

```
프롬프트 C의 프리뷰에서 승인된 에이전트만 생성해줘.

생성 대상: [번호 리스트, 예: 1, 3, 5]
수정 사항: [있으면 기재, 예: "3번은 역할에 migration도 포함"]
배치 경로: [프로젝트경로]/agents/

기존 에이전트 참고: [프로젝트경로]/agents/seo-expert.md 의 구조를 따라줘.

각 에이전트 .md에 포함할 것:
- frontmatter (name, description, tools/disallowedTools, memory)
- 역할 정의
- 실행 조건 (언제 이 에이전트를 사용하는지)
- 체크리스트 또는 워크플로우
- 프로젝트 고유 컨텍스트 (경로, 설정 파일 위치 등)
- 작업 범위 (git 히스토리 기반으로 이 에이전트가 주로 수정하는 디렉토리)

frontmatter에 memory 설정을 반드시 포함해줘:
- 팀 공유 에이전트 → memory: project (git으로 공유 가능)
- 개인 에이전트 → memory: user (전체 프로젝트 공통) 또는 memory: local (해당 프로젝트만)

생성 전에 각 파일의 경로와 첫 20줄을 보여주고 확인을 받아줘.
```

---

## 3단계: 세션 아카이브

분석이 끝나면 세션 파일을 아카이브한다. **삭제하지 않는다.**

```bash
# 프로젝트별로 _archive 폴더를 만들고 세션 파일을 이동
PROJECT="$HOME/.claude/projects/[프로젝트명]"

mkdir -p "$PROJECT/_archive"

# 활성 세션 ID 감지 (sessions-index.json에서 가장 최근 세션)
ACTIVE_SESSION=""
if [ -f "$PROJECT/sessions-index.json" ]; then
  ACTIVE_SESSION=$(python3 -c "
import json
with open('$PROJECT/sessions-index.json') as f:
  sessions = json.load(f)
if sessions:
  print(sessions[-1].get('id',''))
" 2>/dev/null)
fi

# UUID 패턴에 매칭되는 폴더와 jsonl만 이동 (활성 세션 제외)
cd "$PROJECT"
for item in ????????-????-????-????-???????????? \
            ????????-????-????-????-????????????.jsonl; do
  [ -e "$item" ] || continue
  basename_item=$(basename "$item" .jsonl)
  # 활성 세션이면 스킵
  if [ "$basename_item" = "$ACTIVE_SESSION" ] || [ "$(basename "$item")" = "$ACTIVE_SESSION" ]; then
    echo "⏭️ 활성 세션 스킵: $item"
    continue
  fi
  mv "$item" _archive/
done

# 보존되는 것: agents/, memory/, CLAUDE.md, sessions-index.json 등
```

### 주의사항

- **현재 활성 세션은 자동 감지하여 스킵한다** — `claude --resume`으로도 확인 가능
- `agents/`, `memory/`, `CLAUDE.md`는 절대 이동하지 않는다
- `sessions-index.json`이 있으면 그대로 둔다 (세션 목록 인덱스)

---

## 4단계: 결과 적용

### 신규 에이전트 배치

배치 경로는 에이전트의 공유 범위에 따라 결정한다 (상세는 agent-standard-guide.md §팀 공유 vs 개인 로컬 참조).

```
[프로젝트repo]/.claude/agents/[에이전트명].md   ← 팀 공유 (git commit)
~/.claude/agents/[에이전트명].md                 ← 개인용 (git 미추적)
```

> 프롬프트 D에서 생성 시 `배치` 필드 판정을 기준으로 경로를 결정한다.

### 하위 프로젝트에서도 사용하려면

방법 A: 심볼릭 링크
```bash
# 하위 프로젝트에서 상위 프로젝트의 에이전트를 참조
ln -s ../../../[상위-프로젝트-해시]/agents \
  ~/.claude/projects/[하위-프로젝트-해시]/agents
```

방법 B: 복사
```bash
cp -r ~/.claude/projects/[상위]/agents/ ~/.claude/projects/[하위]/agents/
```

방법 C: 글로벌 커맨드로 등록 (프로젝트 무관)
```bash
# ~/.claude/commands/ 에 배치하면 모든 프로젝트에서 /[커맨드명] 으로 사용 가능
cp [에이전트].md ~/.claude/commands/
```

### 에이전트 영속 메모리 설정

에이전트에 `memory` 필드를 추가하면, 호출할 때마다 지식이 누적되어 **자기 개선**된다.

```yaml
---
name: seo-expert
description: SEO 분석·개선 전문가
memory: project    # 팀원 전체가 공유하는 학습 내용
---
```

| memory 스코프 | 저장 위치 | 공유 범위 | 사용 시점 |
|---|---|---|---|
| `project` | `.claude/agent-memory/<에이전트명>/` | git 커밋으로 팀 공유 가능 | 팀 공유 에이전트 (SEO, GEO 등) |
| `user` | `~/.claude/agent-memory/<에이전트명>/` | 본인 전체 프로젝트 | 개인 워크플로우 에이전트 |
| `local` | `.claude/agent-memory-local/<에이전트명>/` | 본인 + 해당 프로젝트만 | 프로젝트 특화 에이전트 |

**자기 개선 패턴:**
- 에이전트가 SEO 감사를 수행할 때마다 발견한 패턴을 메모리에 기록
- 다음 호출 시 MEMORY.md 첫 200줄이 시스템 프롬프트에 자동 주입
- 반복될수록 에이전트가 프로젝트 고유 이슈를 사전에 파악

> 참고: [Addy Osmani — Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/) — git 히스토리, 진행 로그, 태스크 상태, 지식 베이스 4가지 영속 채널을 조합하는 패턴

### agents/README.md 업데이트

신규 에이전트를 추가했다면 README.md의 에이전트 목록 테이블과 의존성 다이어그램도 업데이트한다.

---

## 5단계: 에이전트 검증

생성한 에이전트가 실제로 호출되는지 확인한다.

### 5-0. 에이전트 설정 린팅

> 참고: [agnix](https://github.com/agent-sh/agnix) — AI 에이전트 설정 파일 전용 린터 (385 규칙)

에이전트 `.md` 파일의 frontmatter, 도구 설정, 구조적 문제를 자동 검증한다.

```bash
# agnix 설치 (npm)
npm install -g agnix

# 에이전트 디렉토리 전체 린팅
agnix lint [프로젝트경로]/agents/

# 특정 파일만
agnix lint [프로젝트경로]/agents/seo-expert.md

# 자동 수정 가능한 항목 수정
agnix lint --fix [프로젝트경로]/agents/
```

검증 항목 예시:
- frontmatter 필수 필드 누락 (name, description)
- 존재하지 않는 도구명 참조
- tools와 disallowedTools 충돌
- description이 너무 짧거나 모호한 경우

### 5-1. 로드된 에이전트 목록 확인

```bash
# 현재 프로젝트에서 Claude가 인식하는 에이전트 전체 목록
claude agents

# 출력 예시:
# Project agents (from .claude/agents/):
#   seo-expert — SEO 분석·개선. 메타태그, sitemap, 구조화 데이터...
#   geo-expert — AI 검색 엔진 인용 최적화...
# User agents (from ~/.claude/agents/):
#   (none)
```

여기 목록에 나오지 않으면 파일 경로나 frontmatter 형식에 문제가 있는 것이다.

### 5-2. 단독 실행 테스트

```bash
# 에이전트를 메인 에이전트로 실행하여 동작 확인
claude --agent [에이전트명] "간단한 테스트 작업 설명"

# 예시
claude --agent seo-expert "현재 landing 페이지의 메타태그 상태를 점검해줘"
```

이 모드에서는 해당 에이전트 정의가 시스템 프롬프트로 로드되어
역할, 도구 제한, 체크리스트가 모두 적용된 상태로 실행된다.

### 5-3. 서브에이전트 호출 확인

일반 세션에서 에이전트가 자동 위임되는지 확인한다.

```bash
# 일반 세션 시작 후 에이전트가 자동 선택되는지 테스트
claude "SEO 메타태그를 점검해줘"
# → seo-expert가 자동 위임되면 성공
# → Explore나 general-purpose가 생성되면 description 개선 필요
```

**자동 위임이 안 될 때 체크할 것:**
1. 에이전트 `.md`의 `description`이 작업과 매칭되는지 — Claude는 이 필드로 위임 여부를 판단. "Use proactively"를 포함하면 적극 위임
2. `disabled: true`가 설정되어 있지 않은지 — disabled면 자동 위임에서 완전 제외
3. 에이전트 파일이 현재 프로젝트의 `agents/`에 있는지 — 다른 프로젝트에만 있으면 안 보임
4. `@에이전트명`으로 명시 호출해보기 — 이것도 안 되면 파일 경로 문제
5. `claude agents` 명령으로 로드 상태 확인 — 목록에 안 나오면 frontmatter 형식 문제

### 5-4. 도구 제한 확인

```bash
# 에이전트가 차단된 도구를 사용하려 하면 거부되는지 확인
claude --agent [에이전트명] "[차단된 도구를 유도하는 작업]"

# 예시: i18n-worker에서 Bash가 차단되었는지 확인
claude --agent i18n-worker "npm run build 실행해줘"
# → 도구 차단 메시지가 나오면 정상
```

### 5-5. 세션 후 메타 확인

테스트 세션 종료 후, 서브에이전트 메타가 올바른 타입으로 기록되었는지 확인:

```bash
# 가장 최근 세션의 서브에이전트 메타 확인
LATEST=$(ls -t ~/.claude/projects/[프로젝트명]/*/subagents/*.meta.json 2>/dev/null | head -1)
[ -f "$LATEST" ] && cat "$LATEST"
# agentType이 커스텀 에이전트명이면 정상, "Explore"면 위임 실패
```

---

## 6단계: 주기적 재실행

이 프로세스는 일회성이 아니다. 세션은 계속 쌓이고, 새로운 작업 패턴이 나타난다.

### 권장 주기

| 시점 | 실행 범위 | 목적 |
|---|---|---|
| **월 1회** | 1단계 + 1.5단계 스크립트 | 새로 쌓인 임시 에이전트 현황 파악 |
| **분기 1회** | 전체 (1~5단계) | 에이전트 추가/업데이트/퇴역 결정 |
| **대규모 기능 출시 후** | 프롬프트 B + B-2 | 새 작업 영역에 에이전트가 필요한지 확인 |

### 증분 분석 스크립트

이전 감사 이후 새로 생긴 세션만 추출한다.

```bash
# 마지막 감사 날짜 이후의 세션만 추출
# 마지막 감사 날짜를 자동 감지 (가장 최근 TSV 파일의 날짜)
LAST_AUDIT=$(ls -t ~/.claude/subagent-audit-*.tsv 2>/dev/null | head -1 | grep -oE '[0-9]{8}' | head -1 | sed 's/\(....\)\(..\)\(..\)/\1-\2-\3/')
[ -z "$LAST_AUDIT" ] && LAST_AUDIT="2025-01-01"  # 첫 실행이면 전체 스캔
echo "마지막 감사: $LAST_AUDIT"
OUTPUT=~/.claude/subagent-audit-incremental-$(date +%Y%m%d).tsv
echo -e "project\tsession\tagent_type\tdescription\tsession_date" > "$OUTPUT"

for meta in ~/.claude/projects/*/*/subagents/*.meta.json; do
  [ -f "$meta" ] || continue
  # projects/ 이후의 경로에서 프로젝트명과 세션 ID를 추출 (홈 디렉토리 깊이 무관)
  rel=${meta#*/.claude/projects/}
  proj=$(echo "$rel" | cut -d/ -f1)
  session=$(echo "$rel" | cut -d/ -f2)

  # 세션 날짜 확인
  jsonl=~/.claude/projects/"$proj"/"$session".jsonl
  [ -f "$jsonl" ] || continue
  session_date=$(head -1 "$jsonl" | python3 -c "import json,sys; print(json.load(sys.stdin).get('timestamp','')[:10])" 2>/dev/null)
  [ -z "$session_date" ] && continue

  # 마지막 감사 이후만
  [[ "$session_date" < "$LAST_AUDIT" ]] && continue

  type=$(python3 -c "import json,sys; print(json.load(open('$meta')).get('agentType',''))" 2>/dev/null)
  desc=$(python3 -c "import json,sys; print(json.load(open('$meta')).get('description',''))" 2>/dev/null)
  echo -e "$proj\t$session\t$type\t$desc\t$session_date" >> "$OUTPUT"
done

echo "신규 서브에이전트: $(tail -n +2 "$OUTPUT" | wc -l)"
echo "=== 유형 분포 ==="
tail -n +2 "$OUTPUT" | cut -f3 | sort | uniq -c | sort -rn
```

### 효과 측정

에이전트 도입 전후를 비교한다.

```bash
# 에이전트 도입일 설정
AGENT_DEPLOY_DATE="2026-04-07"

echo "=== 도입 전: 임시 에이전트 비율 ==="
BEFORE_TOTAL=0; BEFORE_BUILTIN=0
for meta in ~/.claude/projects/*/*/subagents/*.meta.json; do
  [ -f "$meta" ] || continue
  # 간소화: 전체 중 Explore/general-purpose 비율
  type=$(python3 -c "import json; print(json.load(open('$meta')).get('agentType',''))" 2>/dev/null)
  BEFORE_TOTAL=$((BEFORE_TOTAL + 1))
  [[ "$type" == "Explore" || "$type" == "general-purpose" || "$type" == "Plan" ]] && BEFORE_BUILTIN=$((BEFORE_BUILTIN + 1))
done
echo "전체: $BEFORE_TOTAL, 내장 타입: $BEFORE_BUILTIN ($(( BEFORE_BUILTIN * 100 / BEFORE_TOTAL ))%)"

echo ""
echo "=== 도입 후 목표 ==="
echo "내장 타입 비율이 줄어들면 커스텀 에이전트가 활용되고 있는 것"
echo "- 목표: 내장 타입 비율 50% 이하"
echo "- 이상적: 내장 타입 비율 20% 이하 (대부분 커스텀 에이전트로 위임)"
```

---

## 7단계: 에이전트 퇴역

사용되지 않거나 더 이상 필요 없는 에이전트를 정리한다.

### 퇴역 판단 기준

| 기준 | 조건 | 조치 |
|---|---|---|
| **미사용** | 최근 2개월간 호출 기록 없음 | 퇴역 후보 |
| **중복** | 다른 에이전트와 작업 범위 80% 이상 겹침 | 병합 |
| **작업 종료** | 해당 기능/프로젝트가 완료됨 | 즉시 퇴역 |
| **대체됨** | 새 에이전트가 상위 호환 | 구 에이전트 퇴역 |

### 퇴역 프로세스

**방법 A: `disabled: true` 설정 (권장 — 공식 지원)**

frontmatter에 `disabled: true`를 추가하면 Claude가 자동 위임하지 않는다.
파일을 이동하지 않으므로 git 이력이 깔끔하고, 복원도 한 줄 수정으로 가능하다.

```yaml
---
name: old-agent
description: ...
disabled: true    # 퇴역: 2026-04-07, 사유: new-agent에 병합
---
```

**방법 B: `_retired/` 폴더로 이동 (완전 제거)**

```bash
# 1. 퇴역 대상 에이전트를 _retired/ 폴더로 이동 (삭제하지 않음)
AGENTS_DIR="[프로젝트경로]/agents"
mkdir -p "$AGENTS_DIR/_retired"

# 2. 퇴역 사유를 파일 상단에 기록
echo "---" > /tmp/retire-header.md
echo "# RETIRED: $(date +%Y-%m-%d)" >> /tmp/retire-header.md
echo "# 사유: [에이전트명]에 병합됨" >> /tmp/retire-header.md
echo "---" >> /tmp/retire-header.md
cat "$AGENTS_DIR/[에이전트명].md" >> /tmp/retire-header.md
mv /tmp/retire-header.md "$AGENTS_DIR/_retired/[에이전트명].md"

# 3. 원본 삭제
rm "$AGENTS_DIR/[에이전트명].md"

# 4. README.md에서 제거
```

### 미사용 에이전트 감지

```bash
# 최근 2개월 세션에서 커스텀 에이전트 호출 횟수 확인
SINCE="2026-02-01"
echo "=== 커스텀 에이전트 호출 빈도 ==="

for meta in ~/.claude/projects/*/*/subagents/*.meta.json; do
  [ -f "$meta" ] || continue
  # 홈 디렉토리 깊이 무관한 경로 파싱
  rel=${meta#*/.claude/projects/}
  proj=$(echo "$rel" | cut -d/ -f1)
  session=$(echo "$rel" | cut -d/ -f2)
  jsonl=~/.claude/projects/"$proj"/"$session".jsonl
  [ -f "$jsonl" ] || continue
  session_date=$(head -1 "$jsonl" | python3 -c "import json,sys; print(json.load(sys.stdin).get('timestamp','')[:10])" 2>/dev/null)
  [[ "$session_date" < "$SINCE" ]] && continue
  python3 -c "import json; print(json.load(open('$meta')).get('agentType',''))" 2>/dev/null
done | sort | uniq -c | sort -rn

echo ""
echo "위 목록에 없는 agents/*.md 파일 = 퇴역 후보"
```

---

## 팀 공유 가이드

### .claude/projects/ 경로 문제

`.claude/projects/` 하위의 프로젝트 디렉토리명은 **로컬 절대경로를 인코딩**한 것이다.

```
/Users/alice/Documents/GitHub/my-project
→ -Users-alice-Documents-GitHub-my-project

/Users/bob/dev/my-project
→ -Users-bob-dev-my-project
```

따라서 **같은 프로젝트를 다른 경로에 clone한 팀원은 프로젝트 디렉토리명이 다르다.**

### 팀원에게 공유할 때

**1. 이 가이드 자체는 그대로 공유 가능** — 스크립트에서 `~/.claude/projects/*/` 와일드카드를 사용하므로 경로 무관.

**2. 에이전트 파일은 프로젝트 repo에 커밋하여 공유:**
```bash
# 에이전트를 프로젝트 repo의 .claude/agents/에 배치
cp ~/.claude/projects/[내경로]/agents/*.md [프로젝트repo]/.claude/agents/
cd [프로젝트repo]
git add .claude/agents/
git commit -m "팀 공유: Claude 커스텀 에이전트 추가"
```
이렇게 하면 팀원이 clone할 때 자동으로 에이전트가 포함된다.

**3. 개인별 에이전트와 팀 에이전트를 분리:**

```
[프로젝트repo]/.claude/agents/       ← git 추적, 팀 공유 (SEO, GEO 등)
~/.claude/agents/                      ← 개인용, git 미추적 (개인 워크플로우)
```

**4. 멀티 도구 팀: AGENTS.md 병행**

팀원 중 Cursor, Windsurf, Copilot 등 다른 AI 코딩 도구를 사용하는 경우,
공통 규칙은 도구 무관 표준인 **AGENTS.md**에, Claude 전용 설정은 **CLAUDE.md**에 분리한다.

```
[프로젝트repo]/
├── AGENTS.md                  ← 도구 무관 공통 규칙 (빌드 명령, 코드 컨벤션, 테스트)
├── CLAUDE.md                  ← Claude 전용 (에이전트 위임 규칙, MCP 설정 등)
└── .claude/agents/            ← Claude 커스텀 에이전트 (Claude Code 전용)
```

> 참고: [AGENTS.md vs CLAUDE.md: A Practical Guide](https://thepromptshelf.dev/blog/agents-md-vs-claude-md/)
> 참고: [rule-porter](https://github.com/nedcodes-ok/rule-porter) — CLAUDE.md ↔ Cursor .mdc ↔ Windsurf 등 양방향 변환 도구

**5. 팀원에게 전달할 퀵스타트:**

```
1. 프로젝트를 최신으로 pull
2. export MY_GIT_AUTHOR="[본인 git 이름]"
3. 1단계 스크립트 실행 → TSV 생성
4. 1.5단계 스크립트 실행 → Git TSV 생성
5. 프롬프트 A를 Claude Code에 붙여넣기 → 분석 결과 확인
6. 프롬프트 C로 dry-run → 본인에게 필요한 에이전트 확인
7. 필요하면 프롬프트 D로 개인용 에이전트 생성 (팀 에이전트는 repo에서 공유)
```

---

## 체크리스트

### 초기 감사 (최초 1회)

- [ ] 1-2 스크립트로 서브에이전트 TSV 추출 완료
- [ ] 1.5-1 스크립트로 Git 커밋 TSV 추출 완료
- [ ] 프롬프트 A로 전수 분석 완료
- [ ] 프롬프트 B로 갭 분석 완료
- [ ] 프롬프트 B-2로 Git 크로스 분석 완료
- [ ] 프롬프트 B-3로 토큰 비용 기반 우선순위 확인
- [ ] 프롬프트 C로 dry-run 프리뷰 확인
- [ ] 프리뷰 검토 → 승인/수정/삭제 결정
- [ ] 프롬프트 D로 승인된 에이전트만 생성
- [ ] 에이전트 .md 파일 배치
- [ ] 하위 프로젝트 접근 설정 (심링크/복사/글로벌)
- [ ] README.md 업데이트
- [ ] 5단계: agnix 린팅 + `claude agents` 확인 + 단독 실행 + 서브에이전트 호출 + 도구 제한
- [ ] 세션 파일 _archive/ 이동
- [ ] 팀원에게 공유

### 정기 점검 (월 1회)

- [ ] 증분 분석 스크립트로 신규 임시 에이전트 확인
- [ ] 내장 타입(Explore/general-purpose) 비율 변화 확인
- [ ] 새 에이전트가 필요한 패턴 발견 시 프롬프트 C 재실행

### 분기 점검 (3개월 1회)

- [ ] 미사용 에이전트 감지 스크립트 실행
- [ ] 퇴역 후보 검토 → `disabled: true` 설정 또는 `_retired/` 이동
- [ ] 에이전트 description 갱신 (자동 위임률 개선)
- [ ] 팀 에이전트 repo 커밋 최신화

---

## FAQ

**Q: 프롬프트 A~H를 한 세션에서 전부 실행해도 되나?**

A: 서브에이전트 수백 개 + 커밋 수백 개 + 에이전트 파일 전문 읽기를 한 세션에서 하면 컨텍스트가 부족할 수 있다. 권장 분리:
- **Phase 1~2** (스캔 + 분석): 한 세션
- **Phase 3** (프롬프트 C dry-run): 별도 세션 (Phase 1-2의 TSV 파일을 참조)
- **Phase 4** (프롬프트 E+G 규격 검증): 별도 세션
- 또는 통합 실행 프롬프트를 사용하되, Claude가 `/compact`를 권유하면 따른다.

**Q: 같은 날 스크립트를 두 번 실행하면?**

A: TSV 파일이 같은 이름(`subagent-audit-20260407.tsv`)이므로 덮어쓴다. 이전 결과를 보존하려면 실행 전에 기존 TSV를 백업하거나, 파일명에 시간을 추가(`$(date +%Y%m%d-%H%M)`)하라.

**Q: 임시 서브에이전트가 왜 기존 에이전트를 사용하지 않았나?**

A: 주요 원인 4가지:
1. **description 매칭 실패** — Claude는 에이전트의 `description` 필드로 자동 위임 여부를 판단. description이 모호하거나 키워드가 부족하면 내장 타입으로 생성됨. "Use proactively" 패턴을 포함하면 적극 위임.
2. **프로젝트 경로 불일치** — 에이전트가 상위 프로젝트의 `agents/`에 정의되어 있지만 작업은 하위 프로젝트에서 실행. 하위 프로젝트에서 상위 에이전트를 자동 참조하지 못함.
3. **명시적 호출 부재** — description 매칭만으로는 위임이 안 되는 경우, `@에이전트명`으로 명시해야 함.
4. **작업 범위 불일치** — 기존 에이전트의 "실행 조건"에 해당하지 않는 미묘한 변형 작업.

**Q: 어떤 기준으로 정식 에이전트로 승격하나?**

A: 다음 조건 중 2개 이상 해당:
- 3회 이상 유사 패턴으로 반복 생성됨
- 도메인 지식(체크리스트, 설정 파일 경로 등)이 결과 품질에 영향을 줌
- 여러 세션/팀원이 공통으로 필요로 하는 작업

**Q: _archive는 언제 삭제해도 되나?**

A: 분석 TSV 추출이 완료되고, 통합 에이전트 정의가 확정된 후에는 삭제 가능. 다만 과거 대화를 `claude --resume [세션ID]`로 복원할 필요가 없다면.

**Q: GUI로 세션을 관리할 수 없나?**

A: 커뮤니티 도구가 있다:
- [CC-Cleaner](https://github.com/tk-425/CC-Cleaner) — Vue 3 웹 GUI, 프로젝트별 세션 크기 확인, 고아 데이터 감지, 일괄 삭제 (휴지통 이동)
- [claude-code-analytics](https://github.com/sujankapadia/claude-code-analytics) — 세션 KPI 대시보드, 도구 사용 분포, 비용 분석
- [Claudex](https://github.com/hesreallyhim/awesome-claude-code) — 웹 기반 대화 이력 브라우저

**Q: 이런 에이전트 감사 워크플로우를 다른 사람도 하고 있나?**

A: 2026-04 기준, 세션 데이터를 분석하여 임시 서브에이전트를 정식 에이전트로 통합하는 공개된 워크플로우는 확인되지 않았다. 관련 도구들은 존재하지만 각각 다른 목적:
- **토큰 분석**: [token-usage-analyzer gist](https://gist.github.com/kieranklaassen/7b2ebb39cbbb78cc2831497605d76cc6) — 비용 분석
- **세션 뷰어**: [claude-code-transcripts](https://github.com/simonw/claude-code-transcripts) — 세션 공유/열람
- **에이전트 마켓플레이스**: [wshobson/agents](https://github.com/wshobson/agents) (75 플러그인, 182 에이전트), [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (130+ 에이전트)
- **설정 린터**: [agnix](https://github.com/agent-sh/agnix) — 에이전트 설정 검증
- **규칙 변환**: [rule-porter](https://github.com/nedcodes-ok/rule-porter) — CLAUDE.md ↔ Cursor ↔ Windsurf 변환

이 가이드의 "세션 감사 → 갭 분석 → dry-run → 통합" 프로세스는 현재 고유한 접근이다.
