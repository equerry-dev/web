# Plan Review — 03-docs-system

Reviewed: 2026-06-10
Plan: 6 tasks across 4 waves

## BLOCKING
(none)

All 8 criteria are covered:
- c-1 → t-5
- c-2 → t-1, t-3
- c-3 → t-2, t-5, t-6
- c-4 → t-3, t-5, t-6
- c-5 → t-5, t-6
- c-6 → t-4, t-6
- c-7 → t-1, t-4, t-6
- c-8 → t-2, t-4, t-6

No locked-decision conflicts found. The plan honors all four locked decisions:
- nav_source → t-1 builds `src/lib/docs/nav.ts` as a hand-authored config (no frontmatter/FS magic).
- sidebar_structure → t-1/t-3 use grouped sections ("grouped nav").
- docs_entry → t-5 ships a `/docs` landing index `+page.svelte`, not a redirect.
- code_theming → t-2 uses dual light+dark Shiki themes switched via CSS at build time.

No forbidden actions: runtime.mode is `native` (project.toml), so the implied pnpm/vite usage is permitted. r-01 (no third-party/runtime requests) and r-02 (static) are explicitly tested in t-2/t-5/t-6.

## FLAG

- [granularity] t-5 touches 6 files and spans 3 layers (mdsvex config in
  svelte.config.js + route layout/loader + content pages). It also bundles four
  distinct deliverables: the two-column layout, the `/docs` landing index, the
  sample `.svx` pages, AND removing the `handleHttpError` exception. It is the
  integration keystone so some breadth is inherent, but the layout-assembly vs.
  sample-content vs. prerender-exception-removal are separable.
  Suggestion: consider splitting sample `.svx` pages + 404-exception removal into
  a thin follow-on task so the layout wiring can be reviewed/tested independently;
  if kept as one, ensure the commit body enumerates the four sub-deliverables.

- [wave-order] t-4 declares `depends_on = ["t-1", "t-2"]` but only DocsPrevNext
  needs t-1's adjacency helper and only DocsToc needs t-2's heading metadata
  *shape*. Neither component needs t-2's actual built output to be unit-tested —
  t-2 produces a runtime pipeline, t-4 consumes a metadata contract. The t-2
  dependency is a contract dependency, not a build-output dependency, so t-4
  could arguably run in wave 1 alongside t-1/t-2 against a stubbed heading type.
  Suggestion: if the TOC heading type can be defined in t-1 (or a shared type
  module), t-4 drops to wave 2 cleanly on t-1 alone; otherwise leave as-is and
  note that the t-2 link is a type/contract dependency.

- [convention] t-6's e2e file is placed at `src/routes/docs/docs.e2e.ts`, but
  every existing e2e test lives in the top-level `/e2e/` dir (`e2e/landing.e2e.ts`,
  `e2e/theme.e2e.ts`, `e2e/shell.e2e.ts`). playwright.config.ts uses
  `testMatch: '**/*.e2e.{ts,js}'` so the file WILL be collected, but the location
  breaks the established convention and scatters e2e specs.
  Suggestion: place the docs e2e at `e2e/docs.e2e.ts` to match the existing three
  e2e files unless there's a reason to colocate.

- [test-contract] t-6 asserts "axe reports no AA contrast violations ... in both
  light and dark" — this is the only check for c-4's WCAG AA contrast requirement,
  yet the contract doesn't name how the dark theme is toggled in the test (the app
  uses a ThemeToggle / class-based theme). An axe run that only ever sees the
  default theme would silently pass the "both" claim.
  Suggestion: specify in the contract that the test flips the theme (e.g. toggles
  the dark class / clicks ThemeToggle) and re-runs axe, so "both light and dark"
  is actually exercised rather than asserted once.

## NOTE

- [strength] Coverage is layered well: foundational criteria (c-2, c-7, c-8) are
  asserted at the unit level in t-1/t-2/t-4 AND re-asserted end-to-end in t-6, so
  a regression in the assembled section is caught even if a unit test drifts.

- [strength] Test contracts are mostly specific and name the breaking surface:
  "the current route's link gets aria-current=\"page\"", "renders Shiki token
  spans (not raw text)", "removing the /docs 404 handleHttpError exception no
  longer fails prerender". These name what breaks, not "tests pass".

- [strength] The plan correctly tracks the existing
  `handleHttpError` 404 exception in svelte.config.js (the temporary /docs
  allowance, confirmed present in the repo) and schedules its removal in t-5 with
  a prerender assertion — a real loose end that an LLM plan often forgets.

- [note] svelte.config.js is edited by both t-2 (wave 1) and t-5 (wave 3). They
  run sequentially across waves so there's no parallel-edit conflict, but the
  executor should re-read the file before the t-5 edit rather than assume the
  t-2 state.

- [note] project.toml test_command is `pnpm test:unit -- --run` (unit only); e2e
  runs via `pnpm test:e2e`. The dross verify step keys off test_command, so t-6's
  e2e assertions won't run under the default gate unless e2e is invoked
  explicitly. Worth confirming the verify flow runs playwright for this phase.

## Summary
Solid, well-covered plan with no blocking issues — the flags are refinements
(t-5 breadth, t-4 wave placement, e2e file location, and making the dark-theme
axe check actually toggle the theme) rather than gaps.
