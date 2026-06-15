# SUMMARY.md — Naqsh Qabl Al-Aqd (v6) build context

> Handoff note for a future Claude / contributor. Explains **what exists, why it's
> built this way, and where to touch things.** Read this before making changes.

## What this is

**نقش — قبل العقد (Naqsh — Pre-Aqd)**: a privacy-first, **offline-capable** Arabic
(RTL) pre-marriage compatibility instrument. Two people (or a facilitator/wali)
answer a question bank on one device; the app shows per-axis alignment, an overall
score, dealbreaker conflicts, and an exportable sheet. **No backend, no network at
runtime, no analytics.** Built to a detailed PRD ("v6 Claude Code Handoff").

Status: fully built, tested, deployed. PR #1 open. Question bank approved & live.

## Stack & key decisions

- **Vite 5 + React 18 + TypeScript (strict, no `any`)**.
- **Zustand** single store (`src/app/store.ts`) — drives the phase state machine.
- **Recharts** radar chart (bundled locally, no CDN).
- **CSS Modules + global tokens** (`src/styles/global.css`); **logical CSS properties
  only** (`margin-inline`, `inset-inline-start`, …) — never physical `left`/`right`.
- **Font:** `@fontsource/ibm-plex-sans-arabic` — woff2 ships **inside the npm package**,
  so it bundles at build time with **zero runtime network**. This was the deliberate
  workaround for the "no CDN / no remote fonts" constraint (jsdelivr etc. are also
  blocked by the sandbox egress policy anyway).
- **PWA:** `vite-plugin-pwa` (generateSW) precaches all assets → true offline after
  first load. `base: './'` (relative paths) so it works from any sub-path / static host.
- **Persistence:** `localStorage`, **opt-in, default OFF, clearable** (`src/lib/storage.ts`).

## Architecture map

```
src/
  app/
    App.tsx        # phase router + header/footer + empty-gate
    store.ts       # Zustand store: mode, phase, participants, answers, persistence
    store.test.ts  # flow/state-machine tests
  features/
    intake/        IntakeScreen      # mode select (default=Couple), names, persist toggle
    facilitator/   FacilitatorIntro  # neutral framing screen (facilitator mode only)
    assessment/    AssessmentScreen, QuestionCard, HandoffScreen (device-handoff lockout)
    scoring/       engine.ts (PURE, no React) + engine.test.ts
    results/       ResultsScreen, RadarPanel, AxisBreakdown, Dealbreakers,
                   FacilitatorComparison, ExportPanel, useResult.ts
  data/
    axes.ts            # 8 axes + relative weights
    questions.ts       # question bank + getActiveQuestions(reviewMode)
    questionOptions.ts # reusable likert/binary option sets
  lib/
    storage.ts     # opt-in localStorage wrapper
    export.ts      # client-side Blob download: printable HTML + JSON
    i18n/strings.ts# all Arabic UI copy (single source of truth)
  components/       # ProgressBar, Toggle, Badge (DraftBadge/BandPill)
  types.ts         # shared domain types
```

## Flow / state machine (store `phase`)

`intake` → (`facilitatorIntro` if facilitator) → `assessment` (participant `a`) →
`handoff` (couple/facilitator only; **A's answers locked & hidden**) → `assessment`
(participant `b`) → `results`. Solo skips handoff and B entirely.

Modes: **solo** (self-reflection, no comparison), **couple** (default highlight),
**facilitator** (adds intro + merged comparison/talking-points view). Mode defaults
to `couple` if the user never taps a card.

## Scoring engine (the important part) — `src/features/scoring/engine.ts`

Pure functions, fully unit-tested. Key behaviors:
- Answer values normalized to 0..1 via each question's option min/max.
- **Per-axis own score** (0–100) per participant = weighted mean of normalized answers.
- **Per-axis gap** = weighted mean of per-question |A−B| (true divergence, not diff of
  averages — avoids cancellation).
- **Overall alignment** = `100 − (axis-weighted mean of axis gaps)`. Identical → 100,
  maximal divergence → 0.
- **Dealbreakers:** if **either** participant flags a question AND divergence ≥ 0.5,
  it surfaces as a conflict — sorted largest-divergence first. Design rule: **a high
  overall % must never bury a hard dealbreaker conflict** (tested).
- Bands: `alignmentBand` (high ≥75 / med ≥50 / low) and `gapBand` (high ≤20 / med ≤40 /
  low) — always paired with icon+label in UI, never color alone (a11y).

## Review gate (DO NOT bypass without owner sign-off)

Questions have `status: 'DRAFT' | 'APPROVED'`. `getActiveQuestions(reviewMode)` returns
APPROVED always + DRAFT only when `?review=1`. **Production excludes DRAFT from scoring.**
`QUESTIONS_FOR_REVIEW.md` documents every question (AR + EN gloss, axis, type, weight,
dealbreaker flag, rationale) for owner review.

**Current state:** the owner reviewed and **APPROVED all 34 questions** (8 axes: deen,
family, finance, children, roles, communication, lifestyle, mobility). They are live in
the production build now — no `?review=1` needed. New questions should still start DRAFT.

## Commands

```bash
npm install        # font woff2 comes via @fontsource (no CDN)
npm run dev        # dev server
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve built bundle as plain static files
npm test           # vitest (engine + flow) — 23 tests
npm run lint       # eslint flat config, clean
npm run typecheck  # tsc strict
```

## Verification done

- 23 tests pass (16 engine + 7 flow); ESLint clean; TS strict; `vite build` succeeds.
- `dist` audited: **no external asset URLs** (only inert library strings like React's
  error-decoder link — not fetches). Served as plain static files: index/js/sw/woff2 → 200.
- PWA SW precaches 32 entries (~1.1 MiB) for offline.

## Git / deploy state

- Branch: **`claude/naqsh-build-h42i8x`**. Base: **`main`** (created as an empty root
  commit because the repo started empty; feature history was rebased onto it so the PR
  shows the full build).
- **PR #1**: `claude/naqsh-build-h42i8x` → `main` (open, not merged).
- **Live preview** via GitHub Pages: **https://limohaa.github.io/Naqsh-Qabl-Alaqd/**
  - Workflow: `.github/workflows/deploy-pages.yml` (build + deploy-pages). Auto-redeploys
    on push to `main` or the feature branch; also `workflow_dispatch`.
  - Pages had to be enabled once manually (Settings → Pages → Source = GitHub Actions);
    the workflow token can't enable it. Runs #1/#2 failed for that reason; **run #3 = success**.

## Constraints to keep honoring (from PRD §1)

No backend / no runtime network · offline-capable · privacy-absolute (no data leaves
device) · static output · Arabic-first RTL + logical CSS only · halal-compatible content
(descriptive, never prescriptive fiqh) · DRAFT review gate for new questions.

## Likely next tasks / ideas

- Merge PR #1 once reviewed.
- Optional: dark mode (PRD says optional, not built); FR/EN i18n (scaffolded via optional
  `textFr`/`labelFr` fields, not populated); code-split Recharts to shrink the 536 kB JS
  chunk; richer facilitator talking-point prompts; per-question result drill-down.
