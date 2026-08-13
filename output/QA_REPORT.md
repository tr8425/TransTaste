# MengTo non-API QA report

Date: 2026-08-13
Branch: `tr8425/design-mengto`

## Scope

Application API routes and external services were explicitly excluded. Browser requests matching `/api/*` were blocked during interaction tests.

Covered:

- Production build, TypeScript, Next.js lint, and i18n synchronization.
- Fourteen deterministic non-API routes.
- Client-side navigation, alternate input expansion, URL validation, modal behavior, sample flow routing, phrase language state, country state, FAQ disclosure, profile anchors, camera fallback controls, keyboard focus, and reduced motion.
- Runtime page exceptions, console warnings/errors, and horizontal overflow.
- Independent Claude Code source review.

## QA rounds

### Round 1 — baseline

- Build: passed; 115 static pages generated.
- i18n: passed; Korean 822 keys / English 822 keys.
- Browser: 38/39 initial checks passed.
- The single failure was a QA selector defect: profile section navigation uses semantic anchors, while the test expected buttons.
- Product console errors: 0.
- Product uncaught page errors: 0.

### Round 2 — corrected harness

- Corrected the profile navigation selector.
- Browser: 39/39 passed.
- All fourteen routes rendered and showed zero horizontal overflow.

### Round 3 — interaction and accessibility

- Added Escape-key dismissal to the home URL/text modal.
- Expanded coverage for phrase language selection, country selection, FAQ disclosure, profile hash navigation, keyboard focus visibility, and reduced motion.
- Browser: 45/45 passed.
- Keyboard focus outline: 3px.
- Reduced-motion animation duration: `0.00001s`.

### Round 4 — repeatability

- Re-ran the full 45-check browser suite against the rebuilt production server.
- Result: 45/45 passed again.

### Claude Code independent review

- Claude Code 2.1.229, Sonnet, safe mode, read-only tools.
- Claude reviewed the modal change and QA runner independently.
- Result: no confirmed functional or accessibility bugs.

## Route results

The following routes rendered with content, no uncaught exceptions, no console errors, and no horizontal overflow:

`/`, `/travel`, `/phrases`, `/foods`, `/guide`, `/pricing`, `/profile`, `/faq`, `/terms`, `/privacy`, `/tip-culture`, `/history`, `/order`, `/camera`.

## Changes produced by QA

- Home input modals now close with `Escape` and remove their listener on unmount.
- Added repeatable `npm run qa:non-api` Edge/CDP regression runner.

## Remaining boundary

Populated analysis results, external AI translation, exchange-rate requests, event ingestion, Supabase, and Stripe were not exercised because API-related verification was excluded by request.
