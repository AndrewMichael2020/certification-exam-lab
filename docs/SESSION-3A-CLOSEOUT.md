# Session 3A — source interpretation and question writing

Completed October 7, 2026 (America/Vancouver; artifacts dated October 8 UTC).
Author: GPT-6 Astra, visible Ultra effort, through the Codex subscription route at
Andrew's request. This records source-based authoring and local artifact checks.

## Delivered

- Ten original AI-103 questions, with complete correct answers and explanations
  for every distractor, structured step, matching row and dropdown slot.
- One fictional Cedar Atlas case with two independent children covering deployment
  selection and private Search connection identity/authorization. Ten items met the
  requested case requirement without increasing the agreed pilot size.
- All five domains, 11 ready objective bullets and 15 captured public sources from
  `ai-103@1.1.0`. No partial objective is used. Each item binds its exact source
  titles, URLs and snapshot SHA-256s; the pilot evidence map adds precise line ranges.
- Exact planner quotas: A/B/C/D/E = 3/3/2/1/1; four single-choice-category items
  (including dropdown and function trace), two multi-selects, one sequence, one
  matching item and two case children. Provisional difficulty = 4 medium / 4 hard /
  2 very_hard. These are author estimates, not empirical or official calibration.
- Three draft PDFs: questions only (10 pages), answer review (15 pages), and combined
  practice with answers (15 pages). Covers and page headers say draft/audit pending.
- Exactly five self-contained Claude handoff files, using a blind solve followed by
  key/explanation review. The handoff includes project context, public excerpts,
  exact item hashes, an unfilled response template and strict read-only file access.

## Status and next action

**Session 3A is complete. Independent content acceptance is pending.** The package
ID is `ai103-pilot-001-r1`, revision `1`; root status remains `draft`, and `reviews`
is empty. Item `validationStatus: validated` means mechanical checks passed. The
normal importer requires reviewed release content and does not accept this draft.
The PDFs are previews of the authored draft; they do not establish a released exam.

Next is **Session 3B**: give Claude files 00/01/02 first, retain its blind answers,
then supply 03/04. Return the completed JSON and findings to Codex for substantive
adjudication. Changed items require fresh hashes and targeted re-audit. Record the
actual reviewer/model label shown in Claude; no Claude interaction has been performed
here. Session 3C follows with reviewed import and final browser/PDF acceptance.
Broader bank expansion should use the pilot audit findings.

## Local checks and review

The actual repository `importPackageSchema` was extended in the temporary authoring
runner only to permit the literal root status `draft`. It parsed/normalized every
field. The actual `validateAssembly` and pack resolver then checked exact planning,
question/domain/format/difficulty totals, objective readiness, registered source
identity and asset hashes, answers, explanations, duplicates, batches and case links.
Author/provenance agreement and case-inclusive canonical item hashes were computed.
This did not alter the application schema or use synthetic status to bypass review.

Two read-only internal review passes covered Q1–Q5 and Q6–Q10. Main-agent corrections
before freezing revision 1:

| Item | Finding and resolution |
|---|---|
| Q2 / shared case | The Search guide's detailed setup names the containing Foundry account's system-assigned identity and two Search roles. The case now pins that principal, enables Search RBAC, grants Search Service Contributor in advance, and asks for the missing Search Index Data Contributor plus the connection change. The guide's broader “project identity” wording is disclosed in the source handoff. |
| Q3 | Scoped schema adherence to successful, non-refusal structured output. |
| Q4 | Clarified that outgoing output strings are decoded for readability and serialization is already correct; the decision concerns originating call IDs. |
| Q9 | Used the snapshot's `recognize_once()` method rather than an uncited asynchronous variant. |
| Evidence map | Added direct lifecycle, role, REST contract, retained-state and Speech sequence/synthesis locators where the frozen claim summaries alone were too narrow. Frozen pack files were preserved. |
| Difficulty | Q2/Q3 very_hard and Q6 hard labels need independent calibration. The handoff explicitly asks Claude to assess them; labels are not presented as measured difficulty. |

This internal review is author-side scrutiny, not the independent Claude audit.
No Azure examples or infrastructure operations were executed.

The isolated OrbStack runner used the existing Playwright 1.60.0 Noble image and
lockfile, with `npm ci --ignore-scripts --no-audit --no-fund` in container-local
storage. Only allowlisted source/pack/prompt/package files entered the container;
no credentials or learner attempts were supplied. The host mount was read-only.
There was no application test-suite run in this phase. The generated artifact checks
were draft validation, PDF extraction/rendering, transfer consistency and preservation.

PDF extraction confirms all ten stems, all answer explanations in the two answer
variants, 15 source links and their snapshot hashes, draft labels and package hashes.
Questions-only has no answer key or explanation section. All 40 final pages were
rasterized and inspected as contact sheets; representative structured-item and key
pages were inspected individually. No clipping/overlap was observed in that review.
Long case explanations and source lists continue across pages.

The preview used the existing pure `buildExamHtml` renderer with local in-memory
presentation adjustments: draft/lineage labels, provisional-difficulty notice,
answer-note headings, page-break controls, dropdown line breaks, sequence number
widths, matching columns and complete structured answer IDs in the quick key.
No release manifest, importer, storage writer or upload function was called. Session
3C must consider these preview layout adjustments when producing the released output.

Preservation checks matched all **248 protected pre-phase files**, including all
**196 pack files** and the separate **21-file historical GH-600 inventory**. No
application source, tests, package/lock files or runtime exam data changed in this
phase. Ephemeral containers were removed. No server, host dependency installation,
commit, push, deployment, paid provider generation or cloud upload was created.
Cleanup dry-run listed seven `.DS_Store` files; they were retained.

## Deliverable locations

Root: `/Users/antvibe/Documents/Dev/cert-exam-lab-local`.

Authoring and evidence:

- [pilot.draft.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/pilot.draft.json)
- [blueprint.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/blueprint.json)
- [evidence-map.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/evidence-map.json)
- [structural-report.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/structural-report.json)
- [preservation-report.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/preservation-report.json)
- [pdf-review.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/pdf-review.json)

Five-file Claude handoff:

1. [00-START-HERE.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/00-START-HERE.md)
2. [01-BLIND-QUESTIONS.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/01-BLIND-QUESTIONS.md)
3. [02-SOURCE-EVIDENCE.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/02-SOURCE-EVIDENCE.md)
4. [03-AUTHOR-KEY.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/03-AUTHOR-KEY.md)
5. [04-AUDIT-RETURN-TEMPLATE.json](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/04-AUDIT-RETURN-TEMPLATE.json)

PDFs are under
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/output/pdf/`:
`ai-103-pilot-001-r1-questions.pdf`, `ai-103-pilot-001-r1-answers.pdf`,
and `ai-103-pilot-001-r1-practice.pdf`. Their final byte hashes are in the structural
and PDF review reports. Ignored raster evidence is in
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/.local-ci/session-3a-qa/`.

Documentation updated:

- [README.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/README.md)
- [AI-103-READINESS-PLAN.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-READINESS-PLAN.md)
- [SESSION-3A-CLOSEOUT.md](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/SESSION-3A-CLOSEOUT.md)

Temporary authoring/rendering helper code created or edited during this phase:
`/private/tmp/author-ai103-pilot.py`, `/private/tmp/ai103-session3a-preview.ts`,
`/private/tmp/run-ai103-session3a-preview.py`, `/private/tmp/build-ai103-audit.py`.
They are local working helpers; no helper was added to application source. The final
preview helper hash and exact isolated command/image/input hashes are retained in
`structural-report.json`.
