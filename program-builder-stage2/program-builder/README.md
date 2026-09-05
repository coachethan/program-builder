# Program Builder

## Setup

This sandbox has no network access, so none of this has been run through a real
`npm install` / `next build` / `next dev` / `npm test`. The engine logic is fully verified
(see below); the `.tsx` component files are hand-authored carefully but not compiled or
rendered by a real toolchain. Run this before trusting it further:

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # runs tests/programGenerator.test.ts via Jest
npm run build    # production build + type-check
```

## What's verified

- `lib/programGenerator.ts` — 33/33 tests passing, `tsc --strict` clean. Every rule was verified
  against explicit examples given during design, including two full sequences checked verbatim
  (not just exercise counts).
- `tests/programGenerator.test.ts` is the real Jest-syntax suite, generated from the same 33
  checks. It can't run under actual Jest here (not installed, no network), but every assertion
  was run and passed via a minimal shim against the real compiled logic.
- `lib/applySwap.ts` — simple, no linked/cascading behavior (that mechanism was built, then
  explicitly retired at the user's request — chest and shoulder swaps are independent).

## What's NOT verified (needs real tooling)

- The `.tsx` component files have not been type-checked or rendered in a real Next.js dev server.
- No visual QA / screenshot pass.
- The "Export to Google Sheets" button in `ReviewExport.tsx` is a disabled placeholder —
  Google OAuth + Sheets integration is a separate, not-yet-started stage.

## Current rule set (Full Body, 2-3 day)

**No priority ("None"):** fixed 7-exercise sequence — Chest (press/fly swappable) → Row choice →
Shoulder (press/raise swappable) → Bicep (swappable to tricep) → Calf → Leg ext → RDL.

**Upper-focus** (priority 1 is chest/back/shoulders/arms): 5 upper exercises + 3 lower
(Calf → Leg ext → RDL, fixed). Priority 1 gets 2 exercises (its natural pair) except Chest,
which always stays at 1 (a 6-set/week volume cap). Arms fills whatever's left to reach exactly 5;
if that's only 1 slot, triceps is dropped first, unless Arms is priority 1 (then it's protected
at 2, guaranteed). Chest defaults to fly specifically when Shoulders is priority 1, otherwise
press. Chest and shoulder swaps are independent (press↔fly, press↔raise) — not linked to each
other.

**Lower-focus** (priority 1 is legs/glutes): 5 lower exercises (always calf-first) + 3 upper,
fixed (Chest press → Row choice → Shoulder press/raise, no arms). Four distinct sequences
depending on exactly which of legs/glutes is selected and in what order — see `buildFullBody*`
functions in `lib/programGenerator.ts` for the exact sequences, each tied to a specific
user-confirmed example.

**Upper/Lower (4-day):** Upper day is unconstrained (6 exercises, chest/lat/trap/shoulder/
bicep/tricep, triceps never cut). Lower day is calf-led, capped at 5, using the same four
legs/glutes sequences as Full Body's lower-focus block (now including the Abduction machine
for glutes-involving scenarios).

## Structure

```
app/
  page.tsx              Screen 1 — landing (live generator preview)
  build/page.tsx          Screens 2-5 — wizard: days -> priorities (incl. None) -> generating -> result
components/
  StepProgress, ChipGroup, GeneratingState, RIRTimeline,
  ExerciseRow (swap + remove), ProgramView, SwapModal, ReviewExport
lib/
  programGenerator.ts    the full rule engine
  applySwap.ts             swap application (independent, non-linked)
  exercises.json           24 exercises, incl. Adductor and Abduction machines
tests/
  programGenerator.test.ts
```

## Not yet built (next stage)

Google OAuth and Google Sheets export — needs real credentials and a live environment.
