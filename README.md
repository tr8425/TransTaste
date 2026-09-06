코드는 Claude Code(Opus)가 작성했고, 기획/명세/하네스/검증 시나리오/최종 판단은 김태령이 맡았습니다. 커밋의 Co-Authored-By 트레일러가 그 기록입니다.

# TransTaste

Scan any foreign menu, understand every dish. 사진·텍스트·URL로 받은 외국어 메뉴를 번역하고 알레르기 정보, 맛 프로필, 식문화 팁을 정리하는 모바일 우선 PWA입니다.

제품 정책, QA 계획, 사용자 검증 프로토콜과 기능 역명세는 [`Docs/`](Docs/)에 정리되어 있습니다.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Claude Vision (Anthropic SDK) · Supabase · Upstash Redis · Stripe

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 in mobile viewport (375px).

## Screens

- `/` — Home (camera CTA, credits, recent scans)
- `/camera` — Camera viewfinder with corner guides
- `/loading-scan` — Loading animation with fun facts
- `/results` — Dish list with filters, detail cards, combo recommendations

## POC Script

Original Claude Vision API test script is in `poc/`.

```bash
cd poc && npm install
ANTHROPIC_API_KEY=sk-ant-your-key-here node test-menu.mjs
```

## Tech Stack

Next.js 14 + TypeScript + Tailwind CSS (PWA)
