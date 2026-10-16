# OWASP 보안 점검 (2026-10-16)

- 기준: OWASP Top 10 (2021), OWASP Top 10 for LLM Applications
- 대상: `tr8425/sample-menu-demo` 브랜치 (`cdceea6` 기준)
- 범위: API 라우트 6개, Supabase 스키마, 클라이언트 결제 처리, 런타임 의존성, git 이력의 비밀값

## 요약

가장 큰 위험은 API 비용이다. 로그인 없이 누구나 서버의 Anthropic 키로 분석을 돌릴 수 있는데 막는 장치가 약하다. 그다음은 공유 캐시가 사용자별 알레르기 설정을 무시하는 문제로, 알레르기 경고가 핵심 기능인 앱이라 안전 문제로 이어질 수 있다.

## 발견 사항

| # | 등급 | 분류 | 내용 | 상태 |
|---|---|---|---|---|
| 1 | 높음 | A04, LLM10 | 분석 API 비용 남용 | 조치 완료 |
| 2 | 높음 | A04 | 캐시 키에 알레르기·식단 설정 누락 | 조치 완료 |
| 3 | 높음 | A04, A08 | 결제 웹훅 미동작, 중복 지급 가능 | 조치 완료 |
| 4 | 높음 | A01 | 크레딧·패스 권한이 클라이언트에 있음 | 일부 조치 (스키마) |
| 5 | 높음 | A06 | 취약한 의존성 (Next.js critical) | 일부 조치 |
| 6 | 중간 | A05 | 오류 응답에 내부 정보 노출 | 조치 완료 |
| 7 | 중간 | A05 | CSP, HSTS 없음 | 조치 완료 |
| 8 | 중간 | LLM01 | 프롬프트 인젝션 | 일부 조치 |
| 9 | 낮음 | A05 | checkout 리다이렉트 URL을 `origin` 헤더로 생성 | 조치 완료 |
| 10 | 낮음 | A01 | `scan_cache` RLS 꺼짐 | 조치 완료 (스키마) |
| 11 | 낮음 | A09 | 보안 이벤트 로그 없음 | 일부 조치 |

### 1. 분석 API 비용 남용 (A04, LLM10)

- `/api/analyze`, `/api/analyze/detail`은 로그인 없이 호출되고 서버의 `ANTHROPIC_API_KEY`로 과금된다.
- 요청 제한이 Redis가 없거나 오류가 나면 전부 통과시켰다 (`src/lib/rate-limit.ts`).
- 서버 쪽 입력 크기 제한이 없었다. 텍스트 길이, `|||`로 이은 이미지 개수, 배열 필드 모두 상한이 없었다.
- `Access-Control-Allow-Origin: *`라서 다른 사이트의 스크립트가 방문자 브라우저로 API를 부를 수 있었다. `request.json()`은 Content-Type을 보지 않으므로 preflight 없는 `text/plain` 요청도 실행됐다.
- IP를 `x-forwarded-for` 첫 값에서 읽어서, Vercel 밖에서는 위조할 수 있었다.

조치:
- `src/lib/api-guard.ts` 추가. 다른 출처의 브라우저 요청을 403으로, JSON이 아닌 요청을 415로 막는다. CORS 헤더는 제거했다 (같은 출처 요청에는 필요 없음).
- 운영 환경에서 실제 API 키를 쓰는 요청은 요청 제한을 확인할 수 없으면 503으로 막는다 (fail-closed). 키가 없는 데모 모드는 그대로 둔다.
- 입력 상한: 텍스트 20,000자, 이미지 10장(카메라 화면 상한과 같음), 이미지 1장당 base64 7MB, URL 2,048자(http/https만), 배열 20개·항목 60자, 요리 이름 200자.
- IP는 `request.ip`, `x-real-ip`, `x-forwarded-for` 순서로 읽는다.

### 2. 캐시 키에 알레르기·식단 설정 누락 (A04)

- 캐시 키가 입력값과 출력 언어로만 만들어져서, 먼저 분석한 사람의 알레르기 기준 결과가 30일 동안 다른 사용자에게 나갔다.

조치: `buildCacheKey`에 `allergenPreset`, `dietaryBeliefs`, `dislikedIngredients`를 정렬해 넣었다. detail 캐시도 같은 키를 쓴다.

### 3. 결제 웹훅 (A04, A08)

- checkout이 metadata에 `userId`를 넣지 않아서 웹훅이 항상 400을 돌려줬다.
- `passes.type` 제약이 `'7d'`, `'30d'`만 허용해서 3일 패스 insert가 실패했고, 오류를 확인하지 않았다.
- `stripe_session_id` 중복 방지가 없어서 Stripe가 재전송하면 결제와 패스가 두 번 기록될 수 있었다.
- service role 키가 없으면 anon 키로 대체되어 RLS에 조용히 막혔다.

조치:
- checkout은 `Authorization: Bearer <Supabase access token>`을 서버에서 검증하고, 확인된 사용자 id를 `client_reference_id`와 metadata에 넣는다. 토큰이 없으면 401.
- 웹훅은 `payment_status === 'paid'`인지 확인하고, `stripe_session_id`가 이미 있으면 다시 지급하지 않는다. DB 오류가 나면 500을 돌려줘서 Stripe가 재시도하게 한다.
- `createServerClient`는 service role 키가 없으면 예외를 던진다 (anon 대체 제거).
- 스키마: `passes.type`에 `'3d'` 추가, `payments.stripe_session_id`에 unique 제약.

### 4. 크레딧·패스 권한 (A01)

- 크레딧은 localStorage(`transtaste_credits`)에 있어서 사용자가 바꿀 수 있다. 알려진 Phase 1 제약.
- `users` 테이블 update 정책이 행 전체에 열려 있어서, 로그인을 붙이면 사용자가 자기 `credits_remaining`을 바꿀 수 있었다.
- `addCredits`, `deductCredit`가 브라우저용 클라이언트에 있었다.

조치:
- 스키마: `authenticated` 역할의 `users` update 권한을 `email` 컬럼으로 좁혔다.
- `addCredits`, `deductCredit`를 `queries.ts`에서 제거했다 (호출하는 곳 없음). 크레딧 차감은 서버 API로 옮겨야 한다.

남은 일: 실제 로그인 연결 후 크레딧 차감과 패스 확인을 서버에서 하도록 옮기기.

### 5. 취약한 의존성 (A06)

`npm audit --omit=dev` 결과 critical 1, high 4, moderate 1.

- `next@14.2.35` critical. 수정판이 16.4.2라 메이저 업그레이드(React 19 포함)가 필요하다. Image Optimizer `remotePatterns` 항목은 설정이 없어 해당 없음.
- `ws`, `nanoid`, `source-map-js`: 호환 범위 안에서 `npm audit fix`로 올렸다 (`package-lock.json`만 변경).
- Next.js 15부터 `NextRequest.ip`가 없어진다. 업그레이드할 때 `src/lib/api-guard.ts`의 `clientIp`를 `@vercel/functions`의 `ipAddress`로 바꿔야 한다.
- `postcss`(Next 내부 의존): Next 업그레이드와 함께 해결된다.
- `@anthropic-ai/sdk@0.80.0`: Memory Tool 관련이라 이 앱에 실제 영향은 낮다.

남은 일: Next.js 16 업그레이드는 별도 브랜치에서 진행.

### 6. 오류 응답 정보 노출 (A05)

- 500 응답에 `err.message`와 스택 한 줄(`_debug`), 429 응답에 요청자 IP, Anthropic 오류 원문이 담겼다.

조치: 스택과 IP가 담긴 `_debug`를 뺐다. 알 수 없는 오류와 AI 서비스 오류는 일반 문구로 바꾸고, 상세 내용은 서버 로그에만 남긴다. HTTP 상태 코드와 토큰 수만 담은 `_debug`는 결과 화면의 오류 표시에 쓰여서 남겼다.

### 7. 보안 헤더 (A05)

조치: `next.config.mjs`에 `Strict-Transport-Security`와 CSP를 추가했다. CSP는 Next.js 인라인 스크립트 때문에 `script-src 'unsafe-inline'`을 허용한다. nonce 방식은 모든 페이지를 동적 렌더링으로 바꿔야 해서 보류했다.

### 8. 프롬프트 인젝션 (LLM01)

- 메뉴 텍스트와 `dislikedIngredients` 같은 사용자 문자열이 프롬프트에 그대로 들어간다.
- 출력은 React가 텍스트로 렌더링하므로 XSS로 이어지지 않는다.

조치: 배열 필드 길이·개수 제한, `outputLanguage`를 지원 언어 코드로 제한. 캐시 키가 사용자 설정을 포함하게 되어 조작 결과가 다른 설정의 사용자에게 퍼지는 범위가 줄었다.

남은 일: 메뉴 본문은 구조상 자유 입력이라 완전히 막을 수 없다. 결과의 알레르기 판정을 로컬 데이터로 교차 확인하는 방안 검토.

### 9~11. 낮음

- 9: checkout 리다이렉트 URL은 `NEXT_PUBLIC_SITE_URL` 또는 요청 URL의 origin으로 만든다.
- 10: `scan_cache`에 RLS를 켜고 정책을 두지 않았다 (service role만 접근).
- 11: 요청 제한 초과, 출처 거부, 웹훅 서명 실패를 `[security]` 접두어로 서버 로그에 남긴다. 알림 연동은 남은 일.

## 추가 기능: 관리자 코드 (2026-10-16)

로그인 없이 서버의 API 키로 제한 없이 스캔하기 위한 소유자용 입력창. Profile 화면 맨 아래 "관리자 접근".

- 예전 기능과 다름: 2026-03 ~ 07에는 사용자가 자기 Anthropic 키를 넣는 입력란(`transtaste_api_key`, `x-api-key` 헤더)이 있었고 `de5b921`에서 제거됐다. 관리자 코드 기능은 없었다.
- 코드는 서버 환경변수 `ADMIN_ACCESS_CODE`(12자 이상)에만 있다. 비어 있거나 짧으면 기능이 꺼진다.
- `POST /api/admin/session`이 코드를 상수 시간 비교로 확인하고, 30일짜리 httpOnly·Secure·SameSite=Strict 쿠키(`tt_admin`)를 발급한다. 쿠키는 코드에서 파생한 키로 서명하므로, 코드를 바꾸면 기존 세션이 모두 무효가 된다.
- 코드 입력은 IP당 15분에 5회로 제한하고, 운영 환경에서 요청 제한을 확인할 수 없으면 503으로 막는다. 틀린 입력과 세션 발급은 `[security]` 로그에 남는다.
- 관리자 쿠키가 있는 요청은 분석 API의 요청 제한을 건너뛴다. 클라이언트는 `transtaste_credits`에 `passType: "admin"` 패스를 두어 무료 스캔 횟수와 페이월을 건너뛰고, 서버 세션이 사라지면 이 패스도 지운다.
- 관리자 모드를 끄면 쿠키를 지운다 (`DELETE /api/admin/session`).

운영 환경에서 쓰려면 Vercel에 `ADMIN_ACCESS_CODE`와 Upstash 변수를 넣어야 한다. Upstash 없이 로컬 `next start`로 쓸 때는 `RATE_LIMIT_FAIL_OPEN=true`를 넣는다. `next dev`에서는 필요 없다.

## 문제없음으로 확인한 항목

- git 이력 전체에서 실제 키 없음 (`sk-ant-your-key-here` 같은 예시 문자열만 있음).
- SQL을 직접 짜는 곳 없음. `dangerouslySetInnerHTML`은 고정 JSON-LD 한 곳.
- URL 입력은 Anthropic이 직접 가져가므로 서버 SSRF(A10) 없음.
- Stripe 웹훅 서명 검증 정상. `?payment=success`를 결제 증거로 쓰지 않음.

## 검증

- `tsc`, `next lint`, `npm run build` 통과. `qa:non-api` 57/57 (CSP 적용 상태, 콘솔 오류 없음).
- API 직접 호출로 확인: 다른 출처 403, `text/plain` 415, 입력 상한 초과 400, 운영 환경에서 Redis 없이 실제 키를 쓰는 요청 503.
- 관리자 코드: 틀린 코드 401, 맞는 코드 200과 쿠키 발급, 쿠키로 요청 제한 통과, 서명을 바꾼 쿠키 거부, 해제 시 쿠키 삭제. 실제 키 대신 가짜 키로 시험해 API 크레딧은 쓰지 않았다.

## 기존 DB에 적용할 SQL

`supabase/migrations/20261016_security_hardening.sql` 참고. `schema.sql`은 새로 만드는 DB 기준으로 같은 내용을 반영했다.

## 후속 수정 목록 (리뷰·QA, 2026-10-16)

`df1d7e9`까지를 Codex 1건, Claude 리뷰 2건(보안, 회귀), Claude QA 1건으로 검토한 결과. 아직 고치지 않았다.

| # | 등급 | 내용 | 위치 | 출처 | 상태 |
|---|---|---|---|---|---|
| F1 | 높음 | 태국어·아랍어·키릴 문자 텍스트 메뉴가 같은 캐시 키로 묶임. 다른 메뉴의 요리와 알레르기 결과가 30일간 나갈 수 있음. 원문 해시로 바꾸고 캐시 키에 버전을 붙인다 | `src/lib/cache.ts:10` | Codex, Claude 보안 | 완료 |
| F2 | 높음 | 전체 사용량 상한 없음. IP마다 시간당 분석 20회와 상세 30회까지 가능. Redis에 하루 전체 상한을 두고 Anthropic 콘솔 한도도 건다. 상한 값은 사용자 결정 필요 | `analyze/route.ts`, `detail/route.ts` | Codex, Claude 보안 | 완료 (하루 스캔 30, 상세 100) |
| F3 | 중간 | 싫어하는 재료가 20개 초과나 60자 초과면 모든 스캔이 400. 서버는 잘라서 받고, 입력란에 상한을 둔다 | `src/lib/api-guard.ts:85`, `profile/page.tsx:489`, `QuickDietarySetup.tsx:31` | Codex, Claude 회귀 | 완료 |
| F4 | 중간 | 요청 제한의 INCR와 EXPIRE가 따로 실행됨. 중간에 실패하면 그 IP가 영구 차단되고 관리자 코드 입력도 막힘 | `src/lib/rate-limit.ts:34` | Codex, Claude 보안 | 완료 |
| F5 | 중간 | 관리자 모드 끄기에서 쿠키 삭제가 실패해도 꺼진 것으로 표시됨 | `AdminAccess.tsx:52` | Codex | 완료 |
| F6 | 중간 | 마이그레이션의 unique 제약 추가가 재실행 시 실패하고, 실패하면 트랜잭션 전체가 적용되지 않음. 기존 중복 결제 확인도 필요. 결제를 켜기 전에 실행해야 함 | `supabase/migrations/20261016_security_hardening.sql:16` | Codex, Claude 회귀 | 완료 |
| F7 | 중간 | 상세 요청이 출력 언어와 알레르기 설정을 보내지 않아서 한국어 사용자도 영어 상세를 받음 (기존 문제) | `loading-scan/page.tsx:159` | Claude 회귀 | 완료 |
| F8 | 낮음 | 응답의 `_debug: "status=401"`, "Check your API key" 문구 노출 | `src/lib/ai/claude.ts:434`, `:544` | Claude QA | 완료 |
| F9 | 낮음 | 관리자 모드에서 사용량 카드에 패스 구매 버튼이 남아 있고, 만료일 표시 형식이 두 곳에서 다름 | `profile/page.tsx`, `AdminAccess.tsx` | Claude QA | 완료 |
| F10 | 낮음 | `activateAdmin`이 기존 7d/30d 패스를 덮어씀. 관리자 플래그를 패스와 분리 | `src/hooks/useCredits.ts:142` | Claude 회귀 | 완료 |
| F11 | 낮음 | `x-forwarded-host`를 같은 출처 판정에 씀. 지금은 악용 불가, CORS를 열면 우회 경로가 됨 | `src/lib/api-guard.ts:37` | Claude 보안 | 완료 |
| F12 | 낮음 | 관리자 쿠키 서명 키를 코드에서 만들어서, 쿠키가 유출되면 코드를 오프라인으로 추측 가능. 별도 `ADMIN_SESSION_SECRET` 사용 | `src/lib/admin-session.ts:33` | Claude 보안 | 완료 |
| F13 | 낮음 | 클라이언트 입력 상한 없음 (붙여넣기 2만 자, QR의 http 외 스킴, 홈 갤러리 업로드 미압축) | `page.tsx:133`, `CameraView` | Claude 회귀 | 완료 |
| F14 | 낮음 | 예시 데이터 결과에 "LIVE" 표시 (기존 문제) | 결과 화면 | Claude QA | 완료 |

확인된 것 (문제없음): 쿠키 위조, 타이밍 비교, 코드 교체 후 재사용, CSRF, Content-Type 우회는 세 리뷰 모두 발견하지 못했다. CSP로 깨지는 기능 없음. 로컬 QA 57/57, API·관리자·375px 시나리오 전부 통과.

운영 확인 (2026-10-16): 코드의 `claude-sonnet-4-20250514`가 종료되어 모든 실제 스캔이 404로 실패하고 있었다. `70b9794`에서 `claude-sonnet-5-5`로 바꾸고 `ANTHROPIC_MODEL`로 바꿀 수 있게 했다. 이후 텍스트 메뉴 스캔과 상세 200, 캐시 재요청 0.2초를 확인했다.

## 외부 QA 결과 반영 (2026-10-16)

사용자가 별도로 돌린 브라우저 QA 보고서 2건(`TransTaste_QA_2026-10-16_ko_fixed.txt`, `TransTaste_Admin_QA_2026-10-16_ko_fixed.txt`)을 코드와 대조했다.

| # | 등급 | 내용 | 코드 확인 | 위치 | 상태 |
|---|---|---|---|---|---|
| F15 | 높음 | 통화가 다른 메뉴의 항목을 담으면 숫자를 그대로 더하고 첫 항목 통화로 표시 (JPY 420 + US$5 = JPY 425). 직원용 카드도 같음. 장바구니가 `sourceResultKey`를 갖고 있지만 다른 결과에서 담을 때 확인하거나 분리하지 않음 | 확인 | `src/hooks/useCart.ts:126`, `order/page.tsx:71`, `order/present/page.tsx:59` | 완료 |
| F16 | 높음 | "내 조건으로 한눈에 보기"가 사용자 알레르기와 무관한 위험도를 씀. 프롬프트가 `allergen_risk`를 "흔한 알레르기 성분 전체" 기준으로 정의해서, 대두만 고른 사용자에게도 연어가 '피하는 편이 좋음'으로 나옴. 위험도를 사용자 설정과 `allergens`의 교집합으로 클라이언트에서 계산하는 방안 검토 (그러면 캐시 키에서 알레르기 설정을 뺄 수 있어 비용안 C3와도 맞물림) | 확인 | `src/lib/ai/claude.ts` ALLERGEN RISK 규칙, `results/page.tsx:224` | 완료 |
| F17 | 중간 | 예시 결과가 고정 데이터인데 "Contains your allergen", "내 조건으로" 같은 개인화 문구가 함께 나옴. 대두를 골라도 Edamame가 '명시된 우려 없음'에 들어감 | 보고서 기준 | 샘플 결과 화면 | 완료 |
| F18 | 중간 | 예시 배너 문구 "실제 AI 분석은 허용된 테스트 환경에서만"이 사실과 다름. 운영에 키가 들어간 뒤 비로그인 방문자도 무료 3회 안에서 실제 분석을 씀 (F2 비용 노출과 연결) | 확인 | `ko.json:146` `demoBanner` | 완료 |
| F19 | 낮음 | 알레르기 회화 문구의 발음 줄에 원어 재료명이 그대로 들어감 ("大豆o nuki de onegaishimasu"). 발음용 로마자 이름이 필요 | 확인 | `src/app/phrases/page.tsx:194` | 완료 |
| F20 | 낮음 | 7일 패스 가격 불일치: 잠금 버튼 문구는 $2.99, `/pricing`과 Stripe 상품은 $3.99. 제품 결정 필요 | 확인 | `en.json:164,533,542`, `pricing-experiment.ts:15`, `stripe/checkout/route.ts` | 결정 대기 |
| F21 | 낮음 | "안전한 대안" 문구가 "안전을 보장하지 않습니다" 안내와 충돌 | 보고서 기준 | 결과 화면 | 완료 |
| F22 | 낮음 | 회화 화면 장식 문구 "05 LANGUAGES"와 실제 8개 언어 불일치, 한국어 모드에 영어 일부 잔존 ("Soy allergy" 등) | 위치 추가 확인 필요 | `/phrases` | 완료 |

외부 QA가 실제 분석에 쓴 입력 (아티팩트 리포트에 포함할 것):
- 관리자 세션: 합성 메뉴 이미지 `synthetic-menu-ja.png` (PNG 900×620, 45,599 bytes, SHA-256 `5f8e7f300445e160ef83def6d6729f85afa4b334291149f75d9d2894504d5646`, Edamame 420 / Grilled salmon 980 / Tomato salad 650 JPY) 1회, 스페인어 합성 텍스트 메뉴 1회. 둘 다 성공.
- 비로그인 방문자: 합성 텍스트 "QA TEST MENU (synthetic) / Tomato soup - $5 / Green salad - $6" 1회. 성공, 무료 스캔 3회에서 2회로 감소.

### 수정 결과 (2026-10-16)

- F20(7일 패스 가격)을 뺀 F1~F22를 모두 고쳤다. F2 하루 상한은 기본 스캔 30회, 상세 100회이고 `DAILY_SCAN_LIMIT`, `DAILY_DETAIL_LIMIT`로 바꿀 수 있다. 캐시 응답과 관리자 요청은 세지 않는다.
- 함께 고친 것: 팁 안내가 국가 이름과 코드 불일치로 어디서도 나오지 않던 문제(`resolveTipCulture`, 홍콩·대만 추가), 예시 데이터에서 에다마메의 위험도가 `safe`로 잘못 들어간 문제, 홍콩 메뉴용 프롬프트(HK$ 표기, 차찬텡 약어, 광둥어 Jyutping).
- 검증: tsc, lint, build 통과, `qa:non-api` 57/57, API 시나리오 38/38, 375px 화면 시나리오(알레르기 기준, 통화 충돌 창, 통화별 합계, 팁 안내, 발음 줄, 관리자 카드, 입력 상한, 한국어 화면) 통과.

### 남은 항목

| # | 등급 | 내용 | 위치 |
|---|---|---|---|
| F20 | 낮음 | 7일 패스 가격 $2.99와 $3.99 중 결정 | 문구, `pricing-experiment.ts`, Stripe 상품 |
| F23 | 낮음 | 이전 버전에서 통화가 섞인 장바구니는 팁 안내가 첫 항목 통화 기준으로만 나옴 | `src/app/order/page.tsx` |
| F24 | 낮음 | 회화 화면 언어 버튼 8개가 375px에서 좁아 코드가 줄바꿈됨 | `src/app/phrases/page.tsx` 언어 선택 |
| F25 | 낮음 | 알레르기 미설정 상태의 대안 문구가 여전히 안전하다는 인상을 줄 수 있음 | 결과 화면 대안 문구 |
| F26 | 중간 | 홍콩: 직원용 카드와 회화 문구가 간체 표준중국어. 번체 카드와 광둥어(Jyutping) 회화 추가 필요 | `src/lib/allergen-i18n.ts`, `src/lib/phrases/data` |
