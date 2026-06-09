# Plan Review — 02-landing-page

Reviewed: 2026-06-09
Plan: 6 tasks across 4 waves

## BLOCKING
(none)

## FLAG
- [wave-order] t-3 (Features section) sits in wave 2 but declares no `depends_on` and uses none
  of t-1's output (StoreBadges / site config). It only needs FeatureRow, which it creates itself.
  It could run in wave 1 alongside t-1 for parallelism — its wave-2 placement appears to be grouping-
  by-theme rather than a real dependency.
  Suggestion: drop t-3 to wave 1 (or leave it as a wave-2 no-dep task knowingly); confirm the wave
  number reflects an actual data dependency, not just visual grouping.

- [granularity] t-3 creates 4 files (Features.svelte + test, FeatureRow.svelte + test) and bundles
  two distinct surfaces: the generic alternating-row component (FeatureRow) and the
  Capability-Slot-specific content/example/learn-more logic (Features). The FeatureRow alternation
  contract and the Capability-Slot-depth contract (decision `capability_slot_depth`) are independent
  failure surfaces.
  Suggestion: consider splitting FeatureRow (presentational, alternation) from Features (content +
  Capability-Slot example/docs link). Not blocking — 4 files is borderline and the two are tightly
  related — but it is the one split candidate in the plan.

- [test-contract] t-6's AA-contrast contract ("if any element drops below AA contrast ... the
  AxeBuilder no-violations assertion fails") relies on the default AxeBuilder analyze(), which the
  shell e2e uses without a `wcag2aa` tag filter. Default axe-core does NOT run all WCAG AA contrast
  rules at AA level out of the box in every config, and c-4 specifically asserts "WCAG AA contrast".
  Suggestion: name the rule explicitly — `.withTags(['wcag2aa'])` (or `color-contrast`) — so the
  contract actually pins the AA surface c-4 demands rather than axe defaults.

## NOTE
- [coverage] All six criteria are covered: c-1 (t-2,t-5), c-2 (t-3,t-5), c-3 (t-1,t-4),
  c-4 (t-6), c-5 (t-1,t-6), c-6 (t-5,t-6). No gaps.

- [locked-decisions] No conflicts found. t-1 self-hosts badges under /badges/* and asserts a
  local img src (honors download_cta + r-01); t-3 orders rows Capability-Slot → Privacy → FOSS and
  carries the concrete example + docs link (honors features_layout + capability_slot_depth);
  t-2 ships a screenshot placeholder + dual CTA (honors hero_framing). The plan's contracts actively
  defend these locked decisions.

- [strengths] Test contracts are unusually specific and failure-oriented — they name the breaking
  surface (anchor href equals configured URL, img src is a local /badges/* path, exactly three rows
  in order, non-localhost origin host-check) rather than "tests pass". This is exactly right.

- [strengths] The plan correctly grounds itself in existing repo patterns: t-6 mirrors real
  mechanisms in e2e/shell.e2e.ts (page.on('request') host-check, AxeBuilder, 320px viewport), and
  t-5 preserves the #features / #download anchors that src/lib/components/Header.svelte already
  points at. No invented infrastructure.

- [forbidden-actions] No rule violations. runtime.mode is "native" (not docker), so pnpm/vite use
  is fine; t-5's prerender contract aligns with r-02 (static), and badge self-hosting aligns with
  r-01. No server routes proposed.

- [antipattern] The secondary hero CTA (t-2) and Header both link to /docs, a route that does not
  yet exist in src/routes (docs deferred to a later phase). This is consistent with the already-
  shipped Header behaviour (phase 01 links /docs too), so it is an intentional forward-reference,
  not a plan defect — recording only so it is not mistaken for a dead link during t-6's anchor check
  (t-6 only resolves in-page #features/#download anchors, not /docs, which is correct).

## Summary
Solid, well-grounded plan with specific contracts and clean coverage; the only substantive items are
a possible wave-2→wave-1 drop for t-3, a borderline split of FeatureRow from Features, and tightening
t-6's contrast contract to an explicit AA tag.
