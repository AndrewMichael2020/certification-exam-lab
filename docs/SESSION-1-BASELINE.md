# Session 1: local CI and baseline

Implemented October 7, 2026 (America/Vancouver) on local branch
`session-1-local-ci`, from `6b4eb7527a4a21e7bbfaffbad5771321ad849332`.

## Original baseline

- Sanitized tracked source staged in a read-only host mount; lockfile dependencies
  installed in an ephemeral Node 22 container. Original tests/fixtures unchanged.
- Vitest 4.1.6: six files, **15 tests passed**. TypeScript build passed.
- Original `npm run dev` failed with `node: .env: not found` (exit 9). Browser
  startup could not proceed through that command without adding credentials/env.
- All **21 tracked preservation hashes matched**. No private attempts, ignored
  data, or untracked data artifacts existed, so no private backup was needed.
- Audit planner/count/validation findings remain known defects; passing original
  unit tests does not establish those stronger contracts.

## Changes and verification

Local CI now uses credential-free startup, explicit runtime data root, offline
provider/cloud guards, dedicated loopback servers, and disposable fixture data.
The original E2E suite stopped its exam loops whenever Submit was visible; that
button is always visible. Fixed the tests to navigate by question counter, assert
20-question completion, and verify all nine formats were encountered. Matching and
case-study assertions now fail when their fixtures are missing.

Final command: `python3 scripts/local-ci.py`, exit 0. Completed checks:
**18 unit tests passed, TypeScript build passed, and eight Chromium checks passed**. The browser checks
cover complete answering/scoring/review, matching/case panels, unchanged original
PDF serving, API/CLI PDF export into temporary data, offline provider rejection,
and production publication/mutation gates. Actual tool versions, image ID,
input hashes, stage statuses and durations are in the generated
`.local-ci/latest.json`; command output is in `.local-ci/latest.log`.

All four retained PDFs parse and contain GH-600 identity and answer-key text:
125, 20, 19, and 93 pages respectively (100q, first 10q, second 10q, 68q).
Rendered pages 3, 4, and 20 of the first 10-question PDF were inspected: code,
continuation/explanations, and answer key are readable. Long items span pages;
this is a representative preservation check, not a full layout/content audit.

The first harness run's checks finished, but its default telemetry path was outside
the writable project. The durable runner directs metadata into `.local-ci/`.
Its timeout watcher also held stdout after container exit; the durable runner uses
per-stage process timeouts instead. The identified orphan watcher was removed.
Sandbox `nice(5)` warnings did not prevent the checks from executing.

## Changed code/config paths

All paths are absolute. The existing preservation manifest and historical corpus,
PDFs, prompts, published list, and unit-question fixture were retained unchanged.

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/package.json`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/playwright.config.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/runtime.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/persistence.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/server.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/generation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/storage.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/pdfExport.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/local-ci.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/ci-checks.mjs`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/e2e-server.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/export-exam-pdf.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/runtime.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/exam.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/baseline.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/.gitignore`

Documentation: this note, `docs/LOCAL-CI.md`, and the Session 1 status update in
`docs/AI-103-READINESS-PLAN.md`.

## Handoff

Session 1 is complete: the final local report shows zero failing stages and
both preservation checks matched all 21 files. No commit, push, deployment, or API generation was
requested or performed. Disposable task containers/server processes were removed at closeout; cleanup dry-run identified only the pre-existing `.DS_Store`,
which was retained.

Next: Session 2A pack identity, GH-600 compatibility adapter, offline import and
storage contracts. Start with the readiness plan's coupled contract work, then
rerun `python3 scripts/local-ci.py` with the new targeted tests. Session 2B UI/PDF
integration and Session 3 content authoring/audit remain unimplemented.
