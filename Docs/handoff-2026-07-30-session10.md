# 세션 핸드오프 — 2026-07-30

## 한 줄 요약

TransTaste는 API 키 없이도 핵심 가치를 시연하는 로컬 데모와 3일·7일·30일 가격 의향 검증 흐름까지 준비되었다. 실 AI·Supabase·Stripe를 검증하기 전에는 프로덕션 배포하지 않는다.

## 현재 실행·배포 상태

- 로컬 production build: `http://127.0.0.1:3000`
- 로컬 데모 플래그: `ENABLE_DEMO_ANALYSIS=true`
- Vercel 프로젝트 연결: 기존 연결 유지
- Vercel 배포: 미실행
- Supabase: 미설정
- Stripe: 미설정, checkout 기본 비활성
- Unity MCP: 이 레포의 `.codex/config.toml`에서만 비활성

로컬 서버는 세션 종료 시 중지한다. 다음 세션에서는 아래처럼 다시 시작한다.

```powershell
$env:ENABLE_DEMO_ANALYSIS = "true"
npm run build
npm start -- -H 127.0.0.1 -p 3000
```

## 다음 세션에서 먼저 읽을 문서

1. `Docs/260730_product_policy_decisions.md`
2. `Docs/260730_policy_implementation_status.md`
3. `Docs/260730_local_demo_qa_report.md`
4. `Docs/260730_product_viability_review.md`
5. `Docs/260730_codex_design_flow_plan.md`

`260730_product_policy_decisions.md`에서 코멘트가 없는 항목은 권장안대로 반영했다. 이후 정책을 변경할 때는 구현보다 이 문서를 먼저 갱신한다.

## 확정된 제품 방향

- 무료 사용량: 계정이 아닌 현재 로컬 기준 누적 3회 가설
- 여행 패스: 3일·7일·30일을 모두 판매 후보로 유지
- 추천 상품: 중앙값인 7일 패스
- 가격: 시장 조사와 사용자 검증 전까지 확정하지 않음
- 30일 패스: 낮은 선택률이 예상되더라도 장기 체류 수요와 앵커 역할 때문에 유지
- 결제 투자: 개발 가능성은 준비하되 실제 구매 신호가 확인되기 전 Stripe 구현 보류
- 계정·동기화: Supabase 투자 판단 전 로컬 우선 데모 유지
- 공개 BYOK: 사용하지 않음

현재 UI의 `$1.99 / $3.99 / $9.99`는 확정 가격이 아니라 실험 가설이다.

## 구현 경계

### 데모

- `ENABLE_DEMO_ANALYSIS=true`에서만 고정 분석·상세 데이터 사용
- 결제 없이 가격 관심 이벤트를 `localStorage`에 기록·내보내기 가능
- 실제 카메라가 없어도 갤러리 및 텍스트 입력으로 핵심 흐름 시연 가능

### 프로덕션

- 데모 플래그를 설정하지 않음
- Anthropic 키가 없으면 분석 API는 `503 E_SERVICE_UNAVAILABLE`
- Stripe는 `ENABLE_STRIPE_CHECKOUT=true`와 서버 키가 모두 있어야 checkout 가능
- 결제 성공 URL만으로 권한을 부여하지 않음

## 검증 완료

- ESLint, i18n 동기화, Next.js production build 통과
- 모바일 Chromium 핵심 플로우와 21개 라우트 QA
- 데모 분석·상세·카트·직원 제시·가격 관심 기록 연결
- 카메라 이미지 미리보기, 회화 딥링크, 프로필 섹션 탐색 회귀 확인
- 브라우저 콘솔 오류 0건

상세 증거와 스크린샷 링크는 `Docs/260730_local_demo_qa_report.md`에 있다.

## 다음 작업 우선순위

### 1. 개발비 투입 전 검증

- `Docs/260730_user_validation_protocol.md`의 인터뷰·테스트를 실행
- `Docs/260730_user_validation_scorecard.csv`에 관찰값 기록
- 여행 커뮤니티·소규모 현장 테스트 등 개발 외 유입 방식을 별도 예산으로 평가
- 3일·7일·30일 선택률과 가격 거부 이유 수집

### 2. 실 AI Preview 평가

- 프로덕션이 아닌 Preview/로컬에만 Anthropic 키 연결
- 최소 20개 실제 메뉴 이미지로 인식 정확도, 위험 누락, 지연, 이미지당 비용 기록
- 알레르기 판단은 원어민·식품 안전 관점의 수동 검수 포함

### 3. 인프라 투자 게이트

- 구매 의향과 반복 사용 신호가 기준치를 넘으면 Stripe entitlement 설계
- 계정 간 동기화·기록 보존 요구가 확인되면 Supabase 설계
- 도입 시 개인정보처리방침과 실제 데이터 흐름을 다시 일치시킴

## 알려진 주의점

- `.env.local`은 커밋하지 않는다.
- `ENABLE_DEMO_ANALYSIS=true`를 Vercel Production에 설정하지 않는다.
- Supabase service role, Stripe secret, webhook secret은 클라이언트 변수로 만들지 않는다.
- 로컬 가격 관심 이벤트는 실제 시장 데이터가 아니며 브라우저 삭제·중복의 한계가 있다.
- 데모 데이터의 AI 안전성은 실제 모델 성능을 증명하지 않는다.
- Vercel CLI는 현재 설치되어 있지 않다. 다음 배포 작업 전에 필요하면 `npm i -g vercel`로 설치한다.

## 권장 다음 요청

> handoff-2026-07-30-session10.md를 기준으로 실제 메뉴 20개 Preview 평가 계획을 실행하고, 결과가 인프라 투자 기준을 충족하는지 판정해줘.
