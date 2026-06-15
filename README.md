# نقش — قبل العقد · Naqsh — Pre-Aqd

A privacy-first, **offline-capable** Arabic (RTL) pre-marriage compatibility
instrument. No backend, no network at runtime, no analytics. Everything runs on
the device; data never leaves it.

> v6 — ground-up rebuild on Vite + React + TypeScript, shipping as a static,
> offline-capable bundle.

## Hard constraints honored

- **No backend / no runtime network.** No fetch, API, telemetry, remote fonts, or
  CDN. The Arabic webfont (IBM Plex Sans Arabic) is bundled locally via the
  `@fontsource` npm package. Verified: `dist` contains no external asset URLs.
- **Offline-capable.** A service worker (`vite-plugin-pwa`) precaches all assets
  (cache-first). Works fully after first load with no connection.
- **Privacy-absolute.** State is in-memory; `localStorage` persistence is **opt-in,
  default OFF**, and clearable. Nothing is ever uploaded.
- **Static output.** `npm run build` → `dist/` deployable to any static host; uses
  relative (`./`) asset paths so it also works from a sub-path.
- **Arabic-first, RTL.** `dir="rtl"`, logical CSS properties only
  (`margin-inline`, `inset-inline-start`, …) — never physical `left`/`right`.
- **Halal-compatible content.** Moroccan Muslim pre-aqd context; descriptive, not
  prescriptive.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript (strict, no `any`) |
| State | Zustand (single typed store) |
| Charts | Recharts (radar), bundled locally |
| Styling | CSS Modules + global tokens, logical properties |
| Offline | `vite-plugin-pwa` (generateSW precache) |
| Font | `@fontsource/ibm-plex-sans-arabic` (self-hosted woff2) |
| Tests | Vitest (pure scoring engine) |
| Lint | ESLint (flat) + Prettier |

## Commands

```bash
npm install        # install deps (font woff2 ships in node_modules — no CDN)
npm run dev        # dev server
npm run build      # type-check + static build → dist/
npm run preview    # serve the built bundle as plain static files
npm test           # run scoring-engine unit tests
npm run lint       # eslint
npm run typecheck  # tsc strict, no emit
```

## Flows

Three modes selected on the intake screen (default highlight: **Couple**):

- **Solo** — one person, self-reflection map (no comparison).
- **Couple** — two people on one device: A answers → **handoff lockout** → B answers.
- **Facilitator** — wali/counselor operates one device; adds a neutral framing
  intro and a **merged comparison** view (largest gaps first + talking points).

Results: radar (A vs B overlay) · per-axis gap breakdown · overall alignment % ·
dealbreaker conflict list · client-side export (printable HTML + JSON).

## Review gate (question bank)

Every authored question ships as `status: 'DRAFT'` and is **excluded from
production scoring**. DRAFT questions render only when the app is opened with
`?review=1` (visibly marked, with a review banner).

- Drafted bank: `src/data/questions.ts`
- Reviewer document: [`QUESTIONS_FOR_REVIEW.md`](./QUESTIONS_FOR_REVIEW.md)
- To go live: change a question's `status` to `'APPROVED'` after owner sign-off.

Because the production build excludes DRAFT, a freshly-built app shows an
"questions under review" gate until items are approved. **Preview the full
experience at `/?review=1`.**

## Scoring engine

Pure, isolated, React-free (`src/features/scoring/engine.ts`), fully unit-tested:

- Per-axis weighted score per participant (0–100).
- Per-axis gap = weighted mean per-question absolute divergence.
- Overall alignment = `100 − weighted mean of axis gaps` (axis-weighted).
- Dealbreakers: if either flags a question **and** answers diverge ≥ 50%, it
  surfaces as a conflict — a high overall % never buries a hard conflict.

Covered by tests: identical → 100, maximal divergence → 0, weighting,
dealbreaker surfacing/threshold, solo mode.

## Architecture

```
src/
  app/        App shell + Zustand store
  features/
    intake/        mode selection, names, persistence opt-in
    assessment/    question runner + handoff lockout
    scoring/       pure engine + tests
    results/       radar, axis breakdown, dealbreakers, export
    facilitator/   intro + merged comparison
  data/         axes.ts, questions.ts (DRAFT-gated)
  lib/          storage (opt-in), export (Blob), i18n strings
  components/    shared UI
  types.ts      shared domain types
```

## Offline / network verification

After `npm run build`:

1. `npm run preview`, load once, then go offline (DevTools → Network → Offline) and
   reload — the app still works (service worker precache).
2. Network tab is empty after first load (no runtime requests).
3. `dist/` contains no external asset URLs (audited).
