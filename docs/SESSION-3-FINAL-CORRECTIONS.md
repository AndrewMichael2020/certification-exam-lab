# Session 3 - two-pass adjudication and revision 3 corrections

**Current state: corrections and draft verification complete; focused independent
acceptance, released import and released browser/PDF acceptance remain pending.**
Prepared October 8, 2026 UTC. This supersedes the revision-2 preparation checkpoint.

## Adjudication

Both supplied Opus audits bind to the preserved revision-2 package and item hashes.
Both agree with all ten keys. The first returns 7 accept / 3 revise (Q2/Q6/Q7);
independent pass 3 returns 8 accept / 2 revise (Q2/Q6). The six supplied files are
archived byte-for-byte in `authoring/ai-103/pilot-001/audit-r2-returns/`, with a receipt.
Reviewer/model labels are recorded as supplied, not independently authenticated.

Revision 3 applies the substantive findings:

- **Q2:** option A's explanation now addresses its actual key authentication;
  the correct explanation explicitly acknowledges the project/account wording
  conflict and the case's stipulated connection principal.
- **Q6:** the blind Markdown exporter uses an enclosing fence longer than any
  nested fence. All four choices and the Q7 heading render outside the exhibit.
- **Q7:** difficulty changes from hard to medium. The explanation uses the captured
  exponential-backoff-with-jitter guidance and retains persistent-error escalation.
- **Q1/Q4:** explanations now describe the scenario conflict and shown `call_id`
  pattern without the unsupported explicit-ban or API-validation claims.
- **Packet:** case children and dropdown choices are clearly labeled; overlapping
  source excerpts are merged. Source snapshots remain unchanged.

All stems/options/keys and the shared case remain unchanged. Only Q1/Q2/Q4/Q7
canonical item hashes change. Q6 retains its hash but needs the presentation fix
accepted. Q3/Q5/Q8/Q9/Q10 retain their previously accepted hashes. Estimates are
3 easy / 7 medium / 0 hard / 0 very hard. This foundational pilot does not establish
hard-question coverage, measured learner difficulty, official exam parity or full
objective coverage. Non-blocking cue/distractor notes are retained for later design.

The complete disposition and exact old/new hashes are in
[ADJUDICATION.md](../authoring/ai-103/pilot-001/revision-3/ADJUDICATION.md) and
[adjudication.json](../authoring/ai-103/pilot-001/revision-3/adjudication.json).

## Verification performed

- Isolated CI: **85 unit tests, TypeScript build and 14 Chromium checks passed**.
  Four new tests cover safe fences, question/choice boundaries and dropdown labels.
- Actual revision-3 draft schema, assembly, source resolver, provenance and hashes
  pass. Both old audit returns are rejected as release inputs. Normal import
  rejects the unaudited draft.
- Actual draft browser preview completes ten items and scores 100% using the real
  scoring function; dropdown controls and source-linked review were inspected.
  Read/attempt requests were intercepted and scored in memory. This does not
  claim a released import or persisted learner attempt.
- Rendered Markdown reproduced the original defect: nine question headings, Q7
  inside code, no separate Q6 choice list. The corrected export has ten headings,
  all four Q6 choices and Q7 outside the exhibit.
- Three draft PDFs: questions 10 pages; answers/practice 14 pages each. All ten
  stems survive extraction. Answer/practice variants contain every explanation,
  all 15 source links and snapshot hashes. Questions-only has no key or explanation.
  Draft identity, package revision and hashes remain visible. All 38 pages were
  rasterized and visually inspected; Q2 and the structured quick key received
  larger detailed inspection. No clipping or overlap was observed.
- All **299 pre-turn protected files** match the captured baseline, including the
  original drafts/audits/PDFs and all pack/runtime data. The 21-file GH-600 CI
  preservation check also passed. `git diff --check` passed.

During QA, a temporary helper retained its revision-2 output/input path. The
misdirected run was discarded. The affected revision-2 blind document and preflight
report were reconstructed deterministically and matched their preexisting hashes
before restoration; all 14 revision-2 manifest artifacts were then verified. The
corrected helper asserted revision 3 and reran successfully. Only that rerun is
used as revision-3 evidence. Recovery details are retained in ignored
`.local-ci/qa-path-error/`.

Evidence: revision 3's `preflight-report.json`, `pdf-review.json`,
`preservation-report.json`, `preparation-manifest.json`; ignored CI records and
rendered images in `.local-ci/latest.json` and `.local-ci/session-3-final-qa/`.
Task containers and preview servers are removed. Cleanup dry-run found only
`.DS_Store` candidates; these were retained. Dependencies and builds ran in
disposable OrbStack containers. No host install,
provider call, Azure execution, release import, commit, push or deployment occurred.

## Remaining acceptance and finish sequence

The existing [offline import contract](OFFLINE-IMPORT.md#review-and-immutable-release)
requires an accepted review of the exact changed revision. A correction written by
Codex is not a new Opus acceptance. The draft has empty reviews; no verdict has been
manufactured and the release gate remains in force.

Send **all five files together** from
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-3/claude-audit/`:

1. `00-START-HERE.md` - focused instructions and transfer hashes.
2. `01-BLIND-QUESTIONS.md` - corrected presentation.
3. `02-SOURCE-EVIDENCE.md` - complete frozen evidence with merged ranges.
4. `03-AUTHOR-KEY.md` - full current key/explanations plus exact before/after changes.
5. `04-AUDIT-RETURN-TEMPLATE.json` - current package/item hashes; verdicts unfilled.

The template preserves the actual pass-3 blind answers and their source provenance.
A new blind solve is unnecessary for this focused correction check. Ask the reviewer
to verify Q1/Q2/Q4/Q7 changes and Q6 presentation, confirm the five unchanged accepted
items, and return explicit verdicts on all ten current hashes. Evidence entries
must use the registered Sxxx IDs; packet filenames belong in narrative notes.

After a completed accepted return: adjudicate it, run
`scripts/package-reviewed-exam.ts` against the revision-3 draft and exact audit into
a new immutable release directory, import the released package through the normal
local boundary, then verify persisted attempts and final released PDFs. The
packaging/import code is already implemented; these release actions await the
review artifact. Historical artifacts remain preserved.

## Files changed or created in this correction turn

New code files:

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/auditMarkdown.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/export-blind-questions.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/auditMarkdown.test.ts`

Draft/data deliverables: new revision-3 blueprint, draft, adjudication, evidence,
audit packet and three draft PDFs under
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/revision-3/`;
six original audit returns plus receipt in sibling `audit-r2-returns/`.

Documentation updated: this closeout, `README.md`, `docs/AI-103-READINESS-PLAN.md`,
`docs/SESSION-3C-CHECKPOINT.md` and `docs/OFFLINE-IMPORT.md`.
