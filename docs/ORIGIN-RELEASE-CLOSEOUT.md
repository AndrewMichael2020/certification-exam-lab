# Origin release closeout — November 2, 2026

GH-600 and AI-103 are delivered as separate versioned packs with separate learner
outputs. README links the preserved GH-600 PDF and the current AI-103 100-question
questions-only and practice-with-answers PDFs. The owner acceptance receipt records
approval of the exact current AI-103 content and PDF hashes.

## Repairs

- Updated stale PDF assertions to the existing layout revision 3. Exact pack/version,
  content hash, PDF variants, repeat-download bytes and production visibility remain checked.
- Made AI-103 1.1.0 and 1.2.0 selector values distinct and preserved the selected
  revision after import. Added browser coverage of versioned planning and exam identity.
- Included registered packs in the application container and excluded private runtime
  stores and disposable QA files from the build context.
- Updated compatible locked dependencies and pinned the patched form-data 2.x line
  under @types/request. Full and production dependency audits report zero vulnerabilities.
- Disabled GitHub Actions at repository level and removed push/PR workflow triggers.
  The retained workflow is manual-only; pushes do not deploy.

## Verification

`npm run ci:local` passed in disposable OrbStack isolation: 89 unit tests, TypeScript
build and 15 Chromium browser/API/CLI checks. The latter exercise both packs through
import, answering, scoring, review, drills and PDF exports, plus AI-103 version selection.
All 21 GH-600 preservation hashes match before and after. The final verified input
hashes and environment are in [LOCAL-VERIFICATION.json](LOCAL-VERIFICATION.json).

The Node 20 container builds successfully; an offline smoke check resolves GH-600
1.0.0/1.1.0 and AI-103 1.1.0/1.2.0 through `/api/packs`. The dependency audit reports
zero vulnerabilities for both production and development dependencies.

Application/config/test whitespace checks pass. Frozen authoring records and source
captures retain their original bytes, including historical CRLF and source whitespace.
Disposable Finder metadata was removed after reviewing cleanup candidates.

## Delivery scope

The commit includes the previously local pack/import implementation, authoring evidence,
PDFs, runtime tests and the repairs above. Local attempts, credentials and disposable CI
captures are excluded. Owner content acceptance is recorded separately from exact-item
independent review; JSON release/import validation remains enforced. The checked-in
AI-103 PDFs are available directly. No learner-data import or cloud deployment is part
of this source-and-output delivery.

## Changed code files included in this release

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/Dockerfile`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/assemble.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/content.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/editorial.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/render.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/render.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/revise25.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/booklets-100/varied.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/assemble.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/cases.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/checkpoint-inputs.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/content.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/emit.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/prepare-evidence.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/qa.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/report.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/run.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/single-inputs.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/single-report.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/standalone.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/verify-pdf.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/25q-revision/balance25.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.0.0/sources/ai-103-study-guide.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.1.0/sources/resources/ai103-course.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.1.0/sources/snapshots/S050.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.2.0/sources/resources/ai103-course.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.2.0/sources/snapshots/S050.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/playwright.config.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/app.js`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/index.html`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/styles.css`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/ci-checks.mjs`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/e2e-server.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/export-blind-questions.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/export-exam-pdf.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/generate.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/import-exam.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/local-ci.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/package-reviewed-exam.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/attemptValidation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/auditMarkdown.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/blueprint.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/compatibility.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/generation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/importValidation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/importer.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/packs.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/pdfExport.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/persistence.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/presentation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/reviewPackaging.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/runtime.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/server.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/storage.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/studyLoops.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/types.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/validators.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/ai103Improvement.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/auditMarkdown.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/blueprint.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/baseline.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/exam.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/import.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/packs.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/fixtures/importPackage.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/fullMockOps.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/import.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/pdfExport.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/persistence.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/reviewPackaging.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/runtime.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/schema.test.ts`
