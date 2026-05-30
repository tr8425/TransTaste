# TransTaste — 사람이 해야 하는 작업 (잔여)

> 작성: 2026-05-31 (세션 10) | 출처: `transtaste-manual-tasks.md` 잔여 항목 추출
>
> 이 문서는 **AI(Claude)가 단독으로 끝낼 수 없는 작업**만 모은 것입니다.
> 대부분 외부 대시보드(Supabase·Stripe·도메인) 작업이거나, 사람이 선행해야
> 그 다음 코드 작업을 AI가 이어받을 수 있는 항목입니다.
>
> 프론트엔드 기능은 세션 9~10에서 대부분 완료됨 (상세: `transtaste-manual-tasks.md`).
> **남은 출시 블로커는 전부 아래 인프라 항목.**

---

## 범례
| 표시 | 의미 |
|---|---|
| 👤 | 사람만 가능 (대시보드 / 구매 / 결정) |
| 👤→🤖 | 사람이 키·설정 준비 → 이후 코드 작업은 Claude가 가능 |
| 🔴 | P0 출시 블로커 / 🟠 P1 출시 전 필수 / 🟡 P2 이후 |

---

## 🔴 P0 — 출시 블로커

### 1. Supabase Auth 연결 (2-4) 👤→🤖
**사람 (대시보드):**
1. Supabase Dashboard → Authentication → Providers → **Email** 활성화
2. (선택) Site URL / Redirect URL에 `https://transtaste.app`, `http://localhost:3000` 추가
3. 완료되면 Claude에게 "Email Auth 켰다" 알려주기

**이후 Claude가:** `/login`·`/signup` 라우트 신규 작성, Supabase Auth UI 연결, 세션 상태를 프로필에 반영
- 현재 상태: `/login`·`/signup` 라우트 자체가 없음 (QA v3: 404)

### 2. 로그아웃 기능 (2-5) 👤→🤖
- **2-4 선행 필요.** Auth 연결 후 Claude가 프로필의 로그인 스텁 → 실제 `signOut()` + 세션 클리어 구현

### 3. 크레딧 서버 검증 (2-6) 👤→🤖
- 현재 크레딧이 client-side localStorage라 API 키 직접 입력/우회 시 차감 안 됨 (출시 블로커)
- **사람:** Supabase에 크레딧 테이블 설계 승인 (또는 스키마 검토)
- **이후 Claude가:** 서버 API Route에서 차감·검증 처리 (Supabase 세션 기반). 2-4 선행 권장

---

## 🟠 P1 — 출시 전 필수 (결제)

### 4. Stripe 상품 4개 생성 (4-2) 👤
Stripe Dashboard → Products에서 아래 4개 생성, 각 `price_id`를 Claude에게 전달:

| 상품명 | 가격 | 참고 price_id |
|---|---|---|
| 7일 Trip Pass | $2.99 | `price_pass_7d` |
| 30일 Trip Pass | $5.99 | `price_pass_30d` |
| Credits 50회 | $1.99 | `price_credits_50` |
| **Credits 150회** | **$3.99** | `price_credits_150` *(신규 — 기존 문서 누락)* |

### 5. Stripe Checkout 실연동 (4-5) 👤→🤖
- 현재 페이월 탭 시 `/profile`로 이동만 함
- **4-2 선행 (price_id 필요).** 이후 Claude가 Checkout 세션 생성 → 결제 → unlock 흐름 연결

### 6. Webhook 엔드포인트 등록 (4-4) 👤
- Stripe Dashboard → Webhooks → `https://transtaste.app/api/stripe/webhook` 등록
- **도메인(아래 9) 확정 후 진행 권장.** `STRIPE_WEBHOOK_SECRET`을 Vercel env에 반영

---

## 🟡 P2 / 운영

### 7. Vercel 배포 확인 👤
- main push로 프로덕션 배포 자동 트리거됨. Vercel Dashboard에서 최신 커밋(`9fc39a8`) 배포 성공 확인
- (선택) `npm i -g vercel` 후 `vercel logs`로 CLI 확인 가능 — 설치 시 Claude가 배포 진단 가능

### 8. 라이브 API 검증 (1-14 / 7-11) 👤→🤖
- 실제 `ANTHROPIC_API_KEY` 호출이 필요한 검증 (영어 메뉴 발음 null 확인, low_confidence 에러 재현)
- **API 예산 소비** → 사람 승인 후 Claude가 실 스캔으로 확인 (현재는 프롬프트·렌더 코드상 처리 완료 상태)

### 9. 도메인 구매·연결 (5-3 / 5-4) 👤
- namecheap에서 `transtaste.app` 구매 → Vercel Dashboard → Domains 추가
- 6번(Webhook URL)의 선행 조건

---

## 한눈에 보기 — 의존성

```
[👤 Supabase Email Auth 켜기] ─► 🤖 /login·/signup ─► 🤖 로그아웃(2-5)
                              └─► 🤖 서버 크레딧 검증(2-6)
[👤 Stripe 상품 4개]          ─► 🤖 Checkout 연동(4-5) ─► 🤖 결제내역 페이지
[👤 도메인 구매·연결]          ─► 👤 Stripe Webhook 등록(4-4)
[👤 API 예산 승인]            ─► 🤖 라이브 스캔 검증(1-14/7-11)
```

## 다음에 사람이 하면 가장 좋은 순서
1. **Supabase Email Auth 활성화** (P0 체인 3개를 푸는 열쇠)
2. **Stripe 상품 4개 생성** (결제 체인 시작)
3. **도메인 구매·연결** → Stripe Webhook 등록
4. 위 중 하나라도 끝나면 Claude에게 알려주면 해당 코드 작업 바로 착수
