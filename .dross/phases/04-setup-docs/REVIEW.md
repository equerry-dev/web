# Plan Review — 04-setup-docs

Reviewed: 2026-06-10
Plan: 6 tasks across 3 waves

## BLOCKING
- (none)

## FLAG
- [granularity] t-5 touches 5 files (nav.ts, +page.svelte, docs-index.svelte.test.ts, and two .svx route deletions) spanning nav-data + index-page + test + route-deletion — at the 5-file split threshold. It holds together as one atomic "rewire to the new page set" unit: deleting the old placeholder routes and rewiring docsNav must land together or the sidebar dead-links, and the two .svx entries are pure deletions, not authored content, so a split would leave an inconsistent intermediate state. Borderline; defensible as-is.
  Suggestion: Leave as one task. If a smaller commit is later wanted, peel the index orientation + maturity callout (+page.svelte and its test assertions) into a separate wave-2 task and keep nav-rewire + route-deletion together.

## NOTE
- [locked-decisions] The prior BLOCKING is resolved: t-5 now explicitly places all four pages "under a single 'Setup' group (per the locked page_structure decision)" in the exact locked order install -> default-assistant -> add-a-provider -> capability-slots, and its contract fails if they aren't all under one group. No new conflict was introduced with the other locked decisions — provider_example (t-3 stays Ollama-first + compact reference), screenshots (no screenshot/asset tasks), and maturity_disclosure (single index callout + inline coming-soon markers, no per-page banner) are all honored.
- [test-contract] The prior ordering FLAG is resolved: t-5's contract now names a concrete unit-level guard ("the new order assertion in docs-index.svelte.test.ts fails") rather than the order-agnostic nav.spec.ts tests it previously (incorrectly) cited, with t-6's prev/next e2e as a second integration-level layer. c-5 ordering is now guarded at both levels.
- [coverage] Full coverage with deliberate redundancy where it matters: c-1->t-1, c-2->t-2, c-3->t-3, c-4->t-4, c-5->t-5+t-6, c-6->t-5+t-6. Waves are tight (four independent page-writes parallel in wave 1; t-5 genuinely needs the pages to exist; t-6 genuinely needs the live nav/index), and no rule is violated (no third-party scripts per r-01, static .svx/.svelte output per r-02, r-03 honesty baked into contracts).

## Summary
Both prior findings are verifiably resolved and the amendment introduced no new conflict; the only open item is a borderline, defensible granularity FLAG on t-5, so the plan is sound and ready to execute.
