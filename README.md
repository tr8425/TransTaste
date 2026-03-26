# TransTaste

Scan any foreign menu, understand every dish.

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
ANTHROPIC_API_KEY=sk-ant-... node test-menu.mjs
```

## Tech Stack

Next.js 14 + TypeScript + Tailwind CSS (PWA)
