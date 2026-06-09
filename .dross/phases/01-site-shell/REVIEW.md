# Plan Review — 01-site-shell

Reviewed: 2026-06-09
Plan: 7 tasks across 4 waves

## BLOCKING
(none)

## FLAG
- [wave-order] t-6 (Footer, wave 3) declares `depends_on = ["t-3"]` only — it needs
  Button/BrandMark (t-3) but has no dependency on t-4 or t-5. It is placed in wave 3
  but could run in wave 2 alongside t-4/t-5. Keeping it in wave 3 serializes work
  that could parallelize.
  Suggestion: Move t-6 to wave 2 (its declared dependency t-3 is already wave 2), or
  confirm the wave-3 placement is an intentional batching choice.

- [test-contract] t-7's "zero third-party requests" contract reads "if loading / or
  a second route issues any non-same-origin network request...". This phase only
  creates one route (+page.svelte); docs/other routes land in a later phase, so the
  "second route" arm currently has no surface to exercise.
  Suggestion: Scope the assertion to the route(s) that exist in this phase, or note
  the second-route arm is forward-looking and presently a no-op.

- [granularity] t-2 ("Theme store + no-flash bootstrap") spans 3 layers — lib store
  (theme.svelte.ts), node unit (theme.spec.ts), HTML bootstrap (app.html), and e2e
  (theme.e2e.ts) — 4 files across lib/HTML/e2e. The no-FOUC behaviour is genuinely
  only verifiable end-to-end, so splitting risks an untestable seam, but the breadth
  meets the 3+-layer flag threshold.
  Suggestion: Keep as-is if the author judges no-flash is only meaningfully testable
  via the full store+bootstrap+e2e chain; otherwise consider peeling the e2e out.

## NOTE
- [prior-issue-1 RESOLVED] e2e files are now e2e/theme.e2e.ts (t-2) and
  e2e/shell.e2e.ts (t-7), both matching playwright.config.ts testMatch
  `**/*.e2e.{ts,js}`. The e2e/ directory is currently empty in the repo, so these
  are net-new and correctly named. No e2e contract is silently undiscovered.

- [prior-issue-2 RESOLVED] t-1 ("Component test harness", wave 1) adds a browser
  Vitest "client" project (vitest-browser-svelte + @vitest/browser playwright
  provider) matching src/**/*.svelte.{test,spec}.ts, plus @axe-core/playwright.
  Confirmed neither vitest-browser-svelte nor @axe-core/playwright is in
  package.json today, and the existing vite.config.ts server project explicitly
  EXCLUDEs src/**/*.svelte.{test,spec} — so a browser project is genuinely required
  and the two project includes do not overlap. The *.svelte.test.ts contracts in
  t-3..t-6 are now runnable, and t-3/t-4/t-5/t-6 all correctly depend on t-1
  (directly or transitively via t-3).

- [coverage] All six criteria are covered: c-1 (t-5, t-6, t-7), c-2 (t-2),
  c-3 (t-5), c-4 (t-7), c-5 (t-5, t-7), c-6 (t-3, t-4). t-1 carries `covers = []`,
  correct for a pure infra/harness task.

- [locked-decisions] No conflicts. nav_items (Features/Docs/GitHub/Download CTA) →
  t-5; mobile_nav (right-side focus-trapped slide-over, Esc closes + restores focus)
  → t-5; footer_scope (brand + Docs/GitHub/F-Droid/License + copyright) → t-6;
  brand_mark (wordmark 'Equerry' + placeholder geometric SVG) → t-3. Each locked
  decision is faithfully reflected in the matching task.

- [forbidden-actions] No rule violations. r-01 (no third-party assets) is actively
  enforced: t-4/t-5/t-6 use inline SVG icons, t-7 adds a zero-third-party e2e gate,
  fonts stay self-hosted (t-7 notes the system-ui fallback until static/fonts woff2
  exist). r-02 (static) untouched — no server/API routes; +layout.ts already sets
  prerender = true. runtime.mode is native and pnpm is permitted. r-03 (docs-vs-app)
  is out of scope for the shell phase.

- [files] Referenced files either exist or are created by an earlier task. t-2 edits
  the existing src/app.html; t-7 edits existing +layout.svelte / +page.svelte /
  layout.css and adds e2e/shell.e2e.ts. vite.config.ts and package.json (t-1) exist.
  No dangling file references.

- [strength] Test contracts are specific and failure-anchored — they name the exact
  breaking surface (pre-paint script removed -> FOUC e2e fails; Tab past last drawer
  item must wrap -> MobileNav focus-trap test fails; non-same-origin request ->
  zero-third-party assertion fails) rather than "tests pass".

- [strength] The no-FOUC requirement (c-2) is split across the layers where its
  failure modes actually manifest: a pure resolveInitialTheme(storage, prefersDark)
  helper tested as a node unit, and the app.html pre-paint script tested via e2e on
  first load. The harness task (t-1) is correctly isolated in wave 1 ahead of the
  component tasks that need it.

- [strength] The browser-vs-server Vitest split is handled cleanly: node units use
  *.spec.ts (theme.spec.ts, caught by the existing server project), component tests
  use *.svelte.test.ts (caught by the new t-1 browser project) — the include/exclude
  globs do not collide.

- [note] project.toml test_command `pnpm test:unit -- --run` runs all configured
  Vitest projects, so once t-1 registers the browser project the component tests run
  under the same command. Worth confirming t-1 installs the @vitest/browser
  playwright provider (its browser binary) so an unattended `--run` does not stall on
  a first-run browser download — t-1's contract covers project registration but not
  the provider/headless-install path.

## Summary
Both prior blocking issues are genuinely resolved and no new blockers were found;
the plan is good to proceed, with three non-blocking polish flags (t-6 wave
placement, t-7 second-route contract scope, t-2 layer breadth).
