# Session 2B — selector, preview, browser/PDF integration

Completed October 7, 2026 (America/Vancouver), on the existing local branch
`session-1-local-ci`. Session 1/2A and knowledge-base work were retained.

## Delivered

- Public pack metadata and selector for AI-103/GH-600. GH-600 cards group history
  and current exams while retaining each exam's exact revision and content status.
  Default startup keeps historical GH-600 immediately accessible.
- Practice allocation preview uses the server's exact planner for domain, format
  and case counts. Invalid counts, empty libraries, import errors and late responses
  remain visible and do not replace a newer selection.
- Development browser import uses the existing offline validation/release gate.
  Timing is configurable; exam identity/timing freeze on opening. Pack-specific
  domain labels, practice scoring, source-linked review, drills and report downloads
  follow the opened exam throughout the session.
- Both packs support all nine formats. Fixed the existing Practice choice handler
  that ignored clicks, enabled editable structured Practice answers with explanations,
  and made review feedback agree with scored multi-select sets regardless of order.
- Three PDF variants: questions only, answer review, and combined practice with
  answers. Covers/headers identify pack/version, content status, package revision
  and immutable exam hash. Answer exports include objectives, linked citations and
  full snapshot hashes. Questions-only exports omit keys and explanations.
- API and CLI share the renderer and immutable per-pack export paths. Names bind
  full exam ID, content hash, variant and layout revision. Exact CLI IDs take
  precedence over overlapping prefixes. Repeated exports reuse unchanged bytes.
  Original GH-600 PDFs remain available through historical lookup.
- Production publication filtering applies to PDF status/downloads. Import and
  PDF builds retain development-only gates. Fixed a late PDF-status response that
  could overwrite the build indicator while a build was still running.

## Verification and preservation

Run `python3 scripts/local-ci.py` from the project root. Final result is recorded
in `.local-ci/latest.json` and `.local-ci/latest.log`; dependencies/builds/browser
servers run inside a disposable OrbStack container with no API credentials.

Final verification: **78 unit tests passed, TypeScript build passed, 14 Chromium
tests passed**. Final CI capture: `2026-10-08T05:46` UTC. All stages returned zero;
historical preservation checks passed before and after execution.

- Browser checks import 30-question mechanics packages for both packs, compare
  100-question previews with the planner, exercise all formats, score 100%, review
  sources, create drills, download reports, and verify untimed editable Practice.
  Active identity survives attempted selector changes; new sessions restore it.
- Empty/invalid import/count states and deliberately delayed preview responses
  are exercised. Screenshots of setup and both-pack Practice were inspected.
- Six actual PDFs are generated/downloaded; API idempotence compares exact bytes.
  CLI imported-pack export and production published/hidden download gates are
  checked alongside historical PDF and legacy CLI regression checks.
- PDF text/link extraction verifies all 30 question headers in each paper, code/
  version and lineage on covers, page footers, 30 source URLs and snapshot hashes
  in every answer/combined variant, and no key/explanation leak into question-only
  papers. Question papers have 11 pages; answer/combined papers have 24 pages.
- Poppler rasters were inspected for cover, case/choice, code/log, dropdown,
  matching, sequence and answer-key pages. Question labels, long citations/hashes,
  structured answers and table continuation are readable without observed clipping.
  The answer-key column was corrected to keep Q20–Q30 labels on one line.
- All 21 historical preservation files and all 196 pre-phase pack assets remain
  byte-identical; no pack asset was added or removed in this phase. This includes
  the 154 original AI-103 knowledge-base files preserved in Session 2A.

Ignored local evidence: `.local-ci/session-2b-qa/` contains six synthetic PDFs,
three browser screenshots, representative page rasters and `pdf-review.json`.
They test mechanics; they are not reviewed preparation material. The CI report
binds the input and artifact hashes, cached image ID and actual stage outcomes.

## Files changed in this phase

Code, presentation and verification files (full absolute paths):

- [presentation.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/presentation.ts) — new public catalog.
- [persistence.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/persistence.ts) — pack grouping and shared path guard.
- [server.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/server.ts) — catalog/preview and gated PDF serving/builds.
- [pdfExport.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/pdfExport.ts) — pack identity, variants and immutable rendering.
- [storage.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/storage.ts) — export URLs/object keys.
- [export-exam-pdf.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/export-exam-pdf.ts) — pack-aware CLI.
- [e2e-server.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/e2e-server.ts) — disposable regression request limit.
- [local-ci.py](/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/local-ci.py) — sanitized QA artifact capture.
- [app.js](/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/app.js) — selector/import/preview, study/review and PDF controls.
- [index.html](/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/index.html) — pack setup and identity controls.
- [styles.css](/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/styles.css) — responsive setup/source/PDF styling.
- [pdfExport.test.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/pdfExport.test.ts) — new identity/variant/catalog checks.
- [baseline.spec.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/baseline.spec.ts) — historical PDF/CLI and production regressions.
- [packs.spec.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/packs.spec.ts) — new both-pack browser/PDF integration checks.

Documentation changed:

- [README.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/README.md)
- [OFFLINE-IMPORT.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/OFFLINE-IMPORT.md)
- [LOCAL-CI.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/LOCAL-CI.md)
- [AI-103-READINESS-PLAN.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-READINESS-PLAN.md)
- [SESSION-2B-CLOSEOUT.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/SESSION-2B-CLOSEOUT.md)

## Remaining and next step

Session 2B is complete; no required integration work remains. Session 3 needs
the ten-question AI-103 pilot, manual independent audit, substantive adjudication
and a reviewed bank. No real AI-103 questions were authored or released here.
The eight partial objectives remain excluded. PDF quality for substantive long
questions/cases must be checked again when the actual package exists.

Paid provider retries/checkpoints, cloud upload, Node 20 deployment validation and
deployment packaging remain deferred. The tested local runtime is Node 24.15.0,
TypeScript strict, Playwright 1.60.0. No commit, push, deployment or provider call
was performed. Test containers/servers are removed; host dependencies/builds and
runtime exams/attempts were not created. Cleanup dry-run found only pre-existing
`.DS_Store` files, which were retained.

Recommended next work block: Session 3A, author the bounded ten-question pilot
from ready-only AI-103 1.1.0 packets and prepare exact-revision manual review material.
