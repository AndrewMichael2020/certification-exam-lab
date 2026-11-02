# Session 3C checkpoint — corrected package preparation and presentation QA

> Historical revision-2 checkpoint. Both returned audits are now adjudicated;
> revision 3 corrections and focused acceptance instructions are in
> [the current closeout](SESSION-3-FINAL-CORRECTIONS.md).

Prepared October 8, 2026 UTC on the existing local branch. **Session 3C remains
partial:** fresh independent acceptance of revision 2, real released import and
final released browser/PDF checks are still required. The local preparation and
draft presentation work available before that review is complete.

## Completed now

- Archived Andrew's three original Opus audit returns unchanged in
  `authoring/ai-103/pilot-001/audit-r1-return/`; original revision 1 remains intact.
- Prepared `ai103-pilot-001-r2`, revision 2, as a draft with empty reviews. Q2's
  unsupported role claim and undocumented-problem wording are corrected; the
  shared case now gives a retrieval symptom and current roles rather than naming
  the missing role. Q4's explanation is limited to the captured call-ID contract.
  Q7 describes intermittent failures with immediate retries and initial backoff;
  its explanation covers support escalation for persistent errors. Q3's packet
  now includes the frozen required-fields/null-union body at S037:979/1005.
- Assessed difficulty is easy 3 / medium 6 / hard 1 / very_hard 0. Separate
  `exact-quotas-assessed-difficulty-v1` plans support explicit assessed totals,
  keeping the original planner and all existing plans byte-equivalent. Exact
  domain, format, case, batch and item/review/source checks remain mandatory.
- New exact-audit packaging module/CLI validates supplied acceptance against the
  complete canonical draft and every item revision/hash/key/source. It produces
  an immutable release bundle only after a matching completed accepted audit.
  It does not import, publish, upload, or manufacture reviewer acceptance.
- Promoted the substantive Session 3A print-layout adjustments into the shared
  renderer: long explanations can continue, meaningful blocks stay intact,
  structured notes use appropriate headings, dropdown lines are preserved,
  matching/sequence columns remain readable, and complete structured answer IDs
  survive the quick key. Export layout revision is now 2, preserving old exports.
  Browser dropdown templates also preserve their lines. Unreleased previews are
  labeled draft instead of reviewed material.
- Prepared three explicitly draft revision-2 PDFs and a new five-file independent
  audit packet with byte and canonical hashes. Revision editor provenance is
  recorded honestly; every item now requires a fresh exact-hash review.

## Verification that actually ran

- `python3 scripts/local-ci.py`: **81 unit tests, TypeScript build and 14 Chromium
  checks passed**. Includes both-pack historical/import/scoring/review/drill/PDF
  regressions, assessed-policy exactness, stale/incomplete/non-accept audit rejection,
  answer mismatch, and actual CLI release-bundle creation/overwrite rejection using
  synthetic review fixtures. CI did not receive the authored pilot or private data.
- Separate isolated actual-pilot preflight parsed the draft, used the real resolver
  and `validateAssembly`, checked provenance/item hashes, rejected the old audit,
  and verified that the normal API rejects draft import.
- Actual pilot browser **preview** completed all ten questions and scored 100%
  with the real scoring function; source-linked review and revised dropdown
  presentation were inspected. The preview intercepted the draft exam and attempt
  requests and kept scoring in memory. This proves presentation mechanics, not a
  released import or persisted learner attempt. No draft was disguised as synthetic
  or furnished with fabricated acceptance.
- Three PDFs passed text/link checks: every paper has all ten question headers;
  questions-only has ten pages and no answer key/explanations; answer/combined
  papers have fourteen pages each and fifteen links/snapshot references. All
  covers/headers retain draft status, revision and hashes. All 38 pages were
  rasterized and inspected in contact sheets, with detailed dropdown, matching
  and key inspection. No clipping/overlap was observed; final samples rerendered.
- All **216 protected pre-phase data/pack/revision-1 files** remain unchanged,
  including all **196 pack files**. The separate 21-file GH-600 preservation
  inventory passed before/after CI. `git diff --check` passed.

Evidence is in revision 2's `preflight-report.json`, `pdf-review.json`,
`preservation-report.json`, `preparation-manifest.json`, and the ignored
`.local-ci/latest.json` / `.local-ci/session-3c-qa/`. The preflight report records
the exact code/helper inputs and cached isolated image. Dependencies/builds ran
inside disposable OrbStack containers; no host installation or runtime exam store
was created. Task containers/servers are removed. Cleanup dry-run found only
`.DS_Store` candidates and retained them. No provider call, Azure execution,
commit, push, deployment or cloud upload was performed.

## Remaining prerequisite and finish sequence

The original [review workflow](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/00-START-HERE.md)
states: “Do not provide accept records for revised text: a new revision needs a
new bound review.” Its returned Opus audit likewise recommends revision and fresh
bound review. Revision 1's accept verdicts cannot be attached to revision 2 hashes.

Run the prepared packet in a fresh Opus audit context:

1. First send [00-START-HERE.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/claude-audit/00-START-HERE.md),
   [01-BLIND-QUESTIONS.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/claude-audit/01-BLIND-QUESTIONS.md) and
   [02-SOURCE-EVIDENCE.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/claude-audit/02-SOURCE-EVIDENCE.md).
   Ask for blind answers, then stop.
2. Then send [03-AUTHOR-KEY.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/claude-audit/03-AUTHOR-KEY.md) and
   [04-AUDIT-RETURN-TEMPLATE.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/claude-audit/04-AUDIT-RETURN-TEMPLATE.json).
   Return the completed JSON and findings for adjudication.

After accepted exact-revision review, use an existing dependency installation:

```sh
./node_modules/.bin/tsx scripts/package-reviewed-exam.ts \
  authoring/ai-103/pilot-001/revision-2/pilot.draft.json \
  /absolute/path/completed-audit-r2.json \
  authoring/ai-103/pilot-001/revision-2/release
npm run import-exam -- --check authoring/ai-103/pilot-001/revision-2/release/package.released.json
STUDY_OFFLINE=1 npm run import-exam -- authoring/ai-103/pilot-001/revision-2/release/package.released.json
STUDY_OFFLINE=1 npm run export-pdf -- ai103-pilot-001-r2 --kind questions
STUDY_OFFLINE=1 npm run export-pdf -- ai103-pilot-001-r2 --kind answers
STUDY_OFFLINE=1 npm run export-pdf -- ai103-pilot-001-r2 --kind practice
```

These finish commands have not run on real content; synthetic CLI tests passed.
Adjudicate returned findings before packaging. Real final acceptance must verify
the persisted release/attempt/hash lineage, both-pack browser regression and final
released PDF labels/text/links/layout. If another correction changes a hash, obtain
review of that revision. The prepared draft PDFs are previews, not final releases.

## Changed code files — full paths

- [types.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/types.ts)
- [blueprint.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/blueprint.ts)
- [importValidation.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/importValidation.ts)
- [reviewPackaging.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/reviewPackaging.ts) — new.
- [package-reviewed-exam.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/package-reviewed-exam.ts) — new.
- [pdfExport.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/pdfExport.ts)
- [app.js](/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/app.js)
- [styles.css](/Users/antvibe/Documents/Dev/cert-exam-lab-local/public/styles.css)
- [local-ci.py](/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/local-ci.py)
- [reviewPackaging.test.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/reviewPackaging.test.ts) — new.
- [baseline.spec.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/baseline.spec.ts)
- [packs.spec.ts](/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/packs.spec.ts)

Other changed documentation: `/Users/antvibe/Documents/Dev/cert-exam-lab-local/README.md`,
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/OFFLINE-IMPORT.md`,
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-READINESS-PLAN.md`, and
this checkpoint. New draft/artifact files are under the full absolute directory
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-2/`;
their complete paths and hashes are in its `preparation-manifest.json`.

Temporary QA/packet helper code: `/private/tmp/session3c-qa.ts`,
`/private/tmp/run-session3c-qa.py`, `/private/tmp/build-session3c-audit.py`.
These are retained as local working helpers; the preflight binds the rendering
helper hash. No memory files were changed.
