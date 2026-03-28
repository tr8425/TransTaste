# TransTaste — Project Guide

## What is TransTaste?
Mobile-first PWA that helps international travelers understand foreign restaurant menus.
Scan a menu photo/text/URL → get translations, allergen warnings, flavor profiles, and cultural dining tips.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **AI:** Anthropic Claude API (Vision + Text) via `@anthropic-ai/sdk`
- **Database:** Supabase (PostgreSQL + Auth stub)
- **Cache:** Upstash Redis (30-day TTL)
- **Payments:** Stripe (checkout sessions + webhooks)
- **Hosting:** Vercel (planned)

## Project Structure
```
src/
  app/                    # Next.js App Router pages
    api/analyze/          # Menu analysis API (Phase 1 lite + Phase 2 detail)
    api/stripe/           # Checkout + webhook
    camera/               # Camera capture + gallery
    history/              # Scan history
    loading-scan/         # SSE streaming loading screen
    onboarding/           # First-launch setup
    order/                # Cart + order presentation
    phrases/              # Restaurant phrasebook (5 languages)
    profile/              # Settings + payments
    results/              # Menu analysis results
    tip-culture/          # Tipping & dining etiquette guide
    travel/               # Travel Tools hub
  components/
    common/               # FunFactCard, LockedBlock, RecentHistory, etc.
    dish/                 # DishCard, DishRow, FlavorRadar, AllergyTag, etc.
    order/                # CartProvider, CartContext
    paywall/              # TripPassPaywall
    ui/                   # BottomNav, BottomSheet
  hooks/                  # useCredits, useDishDetail
  lib/
    ai/                   # Claude prompts (claude.ts) + provider abstraction
    constants.ts          # App-wide constants, pricing
    types.ts              # TypeScript interfaces
    phrases-data.ts       # Phrasebook data (50+ phrases, 5 languages)
    tip-culture-data.ts   # 20+ countries tipping/culture data
    local-data/           # Spicy scale, extreme foods
    supabase/             # Client + queries
```

## Key Conventions
- **localStorage key:** `transtaste_user_settings` (snake_case fields: `output_language`, `allergen_preset`, `dietary_beliefs`)
- **Session data:** `sessionStorage` for scan images, results, cart (cleared on tab close)
- **Styling:** Custom Tailwind palette — coral (#D85A30), cream (#FDFAF5), brown-dark (#2C1A0E)
- **Mobile viewport:** 375px optimized, max-width 430px
- **BottomNav:** 5 tabs [Home, Travel, **Scan**(center CTA), History, Profile]. Hidden on `/camera`, `/loading-scan`, `/order/present`

## API Routes
- `POST /api/analyze` — Menu analysis (image/url/text). Supports SSE streaming (`stream: true`). Returns mock data if `ANTHROPIC_API_KEY` missing.
- `POST /api/analyze/detail` — Single dish Phase 2 detail (flavor radar, ingredients, fun facts)
- `POST /api/stripe/checkout` — Create Stripe checkout session
- `POST /api/stripe/webhook` — Handle payment completion

## Environment Variables
```
ANTHROPIC_API_KEY=         # Required for real analysis (mock without)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Development
```bash
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Revenue Model
- **Free tier:** 10 scans at signup
- **Trip Pass:** 7-day ($2.99) / 30-day ($5.99) — unlimited scans
- **Credits:** 50 scans for $1.99
- **Paywall:** Phase 2 dish details + combo recommendations locked behind Trip Pass

## Rules for AI Agents
1. **Never commit `.env.local`** or any file containing API keys
2. **Mock mode first** — test UI without consuming API credits
3. **API call budget** — coordinate with user before making calls that consume `ANTHROPIC_API_KEY`
4. **Mobile-first** — all UI changes must work at 375px viewport
5. **Snake_case** for localStorage settings keys (aligned with onboarding)
6. **No unnecessary dependencies** — prefer native browser APIs and Tailwind
7. **Korean/English bilingual** — user communicates in Korean, code/comments in English

## Known Limitations (Phase 1)
- Auth is stub-only (no real sign-in)
- Credits are client-side localStorage (no server validation yet)
- Scan history is mock data
- Offline mode not implemented
