# TransTaste MengTo final redesign report

## Outcome

The MengTo direction is now the shared visual system across the complete product surface, not only the home screen. Existing routes, localization, scan data flow, cart behavior, pricing experiment, and legal content remain intact.

## Art direction

- Visual thesis: a compact night-market field guide that turns an unfamiliar menu into a clear decision.
- Brand system: saffron coral `#ff6b2c`, ink `#171712`, field paper `#f3efe7`, graphite `#655f55`.
- Typography: Archivo Black for decisive display moments; Manrope for product copy; Noto Sans fallbacks for Korean and Japanese.
- Signature: measured paper grid, hard editorial rules, offset print shadows, and a tactile central scan control.
- Assets: product content and honest interface icons only. No stock media, invented people, testimonials, logos, or unsupported claims.

## Screens covered

- Entry and capture: home, camera, scan setup, scan loading.
- Decision and order: results, dish detail, order builder, server presentation.
- Travel knowledge: travel hub, phrasebook, tipping culture, country guides.
- Discovery: food guide, food detail, FAQ.
- Account and commercial: history, profile, onboarding, pricing.
- Legal and metadata: terms, privacy, app icons, social preview colors.

## Interaction and accessibility

- Visible 3px coral keyboard focus throughout the app.
- Touch/press states keep a physical print-button response.
- Disabled states retain semantic color while reducing saturation.
- `prefers-reduced-motion` resolves animations immediately.
- No smooth-scroll interception was added.
- Three.js was omitted because it does not support the camera-to-decision task.
- Motion uses bounded CSS entrance and tactile states; there is no continuous offscreen animation.

## Validation

- `npm run build`: passed.
- TypeScript and Next.js lint gate: passed.
- i18n synchronization: passed, Korean 822 keys / English 822 keys.
- Static generation: 115 pages generated.
- `git diff --check`: passed.
- Representative HTTP route check: 14/14 returned 200.
- Chromium visual checks: home, travel, phrases, foods, guide, pricing, profile, and camera.
- Desktop, compact shell, and forced reduced-motion captures created.

## Known validation boundary

The populated results and server-presentation screens require scan/cart session data. Their source and production build were validated, while visual captures focus on routes that can be entered deterministically without fabricating user data.

## Artifact index

Open [gallery.html](playwright/gallery.html) for the visual overview. Individual PNG files are stored beside it.
