# Plan Review — 05-polish-deploy

Reviewed: 2026-06-10 (re-review after amendments)
Plan: 9 tasks across 3 waves

## BLOCKING
(none)

## FLAG
- [antipatterns] t-8 and t-9 both edit `.github/workflows/docker-publish.yml`, sit in the
  same wave (wave 3), and have no dependency between them. They touch different regions
  (t-8 rewrites the `lighthouse` job's `continue-on-error`/`if`; t-9 appends a docker-smoke
  step), but as independent same-wave tasks the second to commit will hit a stale-file /
  rebase hazard on the shared YAML.
  Suggestion: serialize them — add `depends_on = ["t-8"]` to t-9 (or vice-versa) so the
  workflow file is edited by one task at a time, or merge the two CI-wiring edits into a
  single task.

- [antipatterns] t-9 says "build the Docker image, run the container ... wired as a CI step"
  but does not say where it attaches. The workflow already has a `build-and-push` job that
  performs a full `docker build`; an unanchored smoke step can land as a second redundant
  image build, or in a place that runs after publish rather than gating it.
  Suggestion: have t-9 name the job it attaches to (e.g. a dedicated `docker-smoke` job
  `needs: test` that gates before `build-and-push`) so the script's CI contract is
  unambiguous.

## NOTE
- [test-contract] Prior BLOCKING is RESOLVED: t-7's file is now `e2e/build-output.e2e.ts`,
  which matches the Playwright `testMatch: '**/*.e2e.{ts,js}'` in `playwright.config.ts`,
  alongside the existing `e2e/*.e2e.ts` files. vitest's `include` (`src/**`) correctly does
  not (and should not) collect it. The spec will now actually run.

- [coverage] All 8 criteria covered: c-1 (t-4,t-5), c-2 (t-5,t-8), c-3 (t-7), c-4 (t-6),
  c-5 (t-9), c-6 (t-4), c-7 (t-3), c-8 (t-1,t-2,t-8). The t-7→t-9 split moved c-5 cleanly
  onto t-9 (nginx smoke) and left c-3 on t-7 (build-output) — no criterion was orphaned or
  double-lost in the split.

- [locked-decisions] t-8's amendment matches the `lighthouse_gate` decision exactly
  (a11y minScore 1.0, all four categories `error`, perf/BP/SEO >= 0.9, drop
  `continue-on-error` AND the PR-only `if`). Verified against the on-disk `lighthouserc.json`,
  which is precisely as t-8 describes (a11y `error` 0.9, perf/BP/SEO `warn` 0.9) and against
  the workflow's `lighthouse` job (`if: github.event_name == 'pull_request'`,
  `continue-on-error: true`). The "correct the existing file" framing is grounded, not
  authored from memory.

- [wave-order] The amended dependencies are coherent. t-8 now `depends_on` t-5, so the
  a11y=100 gate runs only after t-5's a11y sweep/fixes land — this fixes the prior soft-order
  concern. t-9 `depends_on` t-1,t-2,t-3,t-4 (needs nginx.conf, 404, umami, metadata before a
  serving smoke is meaningful). No wave-3 task lacks its wave-1/2 inputs.

- [test-contract] t-9's contract ("unknown path returns branded 404.html with 404 status")
  is load-bearing on t-4 wiring `error_page 404 /404.html` into `nginx.conf` — the current
  `nginx.conf` only has `try_files ... =404` (bare nginx 404). t-9 correctly depends on t-4;
  noting so the executor treats the `error_page` line as t-4's load-bearing output for t-9.

- [granularity] t-5 lists `e2e/theme.e2e.ts`, which already exists in the repo, so t-5 edits/
  extends it rather than creating it — consistent with its description. No issue.

## Summary
The prior BLOCKING is RESOLVED — t-7 now uses the `.e2e.ts` suffix Playwright collects, and
the t-7/t-9 split, the t-8 lighthouserc correction, and the t-5→t-8 dependency are all sound;
the only new issue is that t-8 and t-9 race on the same workflow YAML in the same wave (and
t-9's CI attachment point is unspecified), which warrants serializing but is not a blocker.
