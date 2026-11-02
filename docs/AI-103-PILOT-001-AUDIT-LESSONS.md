# AI-103 pilot 001 — lessons from the independent audit

Review of Andrew's returned Opus 5.5 audit, before proceeding to revision work.
This note records findings and recommendations; it does not revise questions,
convert audit verdicts into release records, or change the importer/planner.

## Verified audit binding and result

The returned audit identifies `ai103-pilot001-audit-r1`, package
`ai103-pilot-001-r1`, revision `1`, and `ai-103@1.1.0`. Its canonical package hash
matches the current draft:
`0ceafb2d5784ffa424193a00ff62ffb47731c6f902e9c766010db3fe582b358b`.
All ten item hashes, source-ID sets and item revisions match. Case-child hashes
include the shared case. The four handoff file byte hashes match their recorded
values. Canonical package hashing is distinct from hashing the formatted file bytes.

The recorded blind answers and final proposed answers agree with all ten author
keys, after normalizing dropdown/matching maps into the app's `pairs` representation
and treating multi-select order as irrelevant. Verdicts: eight accept, two revise
(Q2/Q7), no reject or unverifiable. The supplied files report reviewer label
`claude-opus-5-5[1m]`, last served `claude-opus-5-5`, medium effort. This is recorded
reviewer provenance, not independently authenticated model/session information.

The strong result is the audit's separation of answer agreement from item quality.
It found defects despite agreeing with the intended keys. Agreement alone cannot
establish unambiguous wording, complete explanation evidence or learner difficulty.

## Lessons for authoring and review

1. **A defensible intended answer still needs sufficient scenario conditions.**
   Q7's log says retries already fail with regional capacity errors. Frozen S009,
   lines 225–227, distinguishes retry/backoff from escalation if errors persist.
   The audit's proposed intermittent-failure/no-delay scenario would make the
   intended retry choice clearer. Alternatively, a persistent-failure scenario
   needs an appropriate escalation choice. The learner should not have to infer
   the author's intended stage of remediation from the available options.

2. **Review every explanation claim, including claims about wrong options.**
   Q2's “Foundry User is a project role” assertion is unsupported by its supplied
   excerpts; showing that the required Search role is absent is enough to explain
   why that option fails. Its “documented retrieval problem” wording also lacks
   a case symptom. Q4's comparison with another API pattern similarly exceeds
   the provided evidence. Prefer the narrow explanation the evidence supports,
   or capture explicit support for an additional assertion.

3. **Evidence extraction needs semantic checking after locator/hash checking.**
   Q3's handoff contains a required-fields heading and a blank line at 1004 but
   omits the substantive body. The frozen S037 snapshot already contains the
   required-fields statement at line 979 and the null-union explanation at 1005.
   This is a handoff omission, not a need to refresh the source snapshot. Include
   complete supporting passages, examples and exceptions; flag empty or
   heading-only excerpts during packet preparation. A correct snapshot hash
   does not establish that the chosen excerpt supports an explanation.

4. **Difficulty should come from the decision, not the format or label.**
   Opus's clearest downgrades are Q2/Q3 from very_hard to medium and Q6 from hard
   to easy. Several other items expose the answer through shared vocabulary or
   plainly impossible alternatives. Use business requirements, observed symptoms
   and plausible competing remedies that require knowledge to distinguish.
   Q5 is a useful positive example: close evaluator concepts are separated by
   a meaningful scenario condition. Multiple dropdowns or code blocks alone do
   not establish hard difficulty. One strong model's perfect solve is not
   empirical calibration for human learners; the textual reasoning is the useful
   evidence here.

5. **The current difficulty contract needs an explicit decision before revision.**
   `src/blueprint.ts` enforces a 35/45/20 medium/hard/very_hard allocation;
   `src/importValidation.ts` excludes easy and requires exact difficulty totals.
   Consequently, merely applying Opus's lower labels will fail the current
   importer. Recommended direction: separate requested difficulty targets from
   reviewer assessments, and choose an explicit versioned planning/import policy
   for honest released labels. Do not inflate labels to satisfy a quota. This
   note recommends that decision; it makes no application change.

6. **A case should require synthesis and keep children independent.**
   Cedar Atlas explicitly supplies the correct principal and missing role, and
   its context refers to deployment types “listed in Q1.” Prefer a self-contained
   context with current configuration and observable symptoms; remove sibling
   references. Include details that exercise relevance judgments without adding
   arbitrary noise or hidden prerequisites. The audit did not establish an
   official case word count. More children and greater length are design
   suggestions, not requirements to impose on this ten-item pilot.

7. **Documentation tensions need bounded interpretation.**
   S040's introduction and S011 describe a project identity, while S040's detailed
   keyless setup names the containing account's system-assigned identity. The
   case stipulation limits the question but does not reconcile those documents
   generally. State the exact setup boundary and identify which detailed
   instructions support it. Avoid turning this stipulated scenario into a
   general platform rule in future questions.

8. **Apply audit suggestions through the product contract.**
   Q9's proposed selection of four steps from six exceeds the current sequence
   format, which requires every option exactly once. Adopt a stronger dependency
   decision within that format, or deliberately implement a separate format
   later. Treat audit suggestions as proposals to adjudicate, not instructions
   to execute automatically. Domain weighting in this small pilot is adequate
   for its purpose; that does not establish broad objective coverage.

## Recommended next work block

First resolve the difficulty policy. Then prepare a preserved new draft revision
with Q2/Q7 corrections, complete Q3 evidence, and a supported/narrower Q4 explanation.
Reassess difficulty and improve the weakest cues without gratuitously rewriting
every accepted item. Q3/Q4's accepted verdicts still require their identified
explanation-evidence gaps to be closed before release.

Retain the blind-first workflow and return explicit findings/dispositions against
the new hashes. Any shared-case edit invalidates both Q1 and Q2 review bindings;
any item difficulty/content edit invalidates that item's binding. A changed
packet needs its own transfer hashes. The returned JSON is an audit response,
not an importable release-review package.

The pilot remains draft with empty reviews and has not been released. This review
used local frozen evidence; it did not verify current Azure behavior, run Azure
examples, or inspect the three draft PDFs. Session 3C must still check released
browser/PDF presentation after content adjudication. No question, pack snapshot,
application code or runtime storage changed during this lessons review.

## Inputs and traceability

- [Blind answers](/Users/antvibe/Downloads/phase1-blind-answers.md), SHA-256
  `c4f5d1266d95bbaf9018211aec387907ba9f5489431a6dacacf8c3bf0d7ff390`.
- [Audit summary](/Users/antvibe/Downloads/audit-summary.md), SHA-256
  `617d4739980a2ee1e288aab6b33b2e25d517352c431b64f7e23d103766e73123`.
- [Audit JSON](/Users/antvibe/Downloads/ai103-pilot001-audit-r1.claude.json), SHA-256
  `acc543487b83f8aaca81fbe30b48d851e79cdca3ae136e7922b2f65132042f2c`.
- [Pilot draft](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/pilot.draft.json).
- [Evidence handoff](/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/pilot-001/claude-audit/02-SOURCE-EVIDENCE.md).
- [Session 3A closeout](/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/SESSION-3A-CLOSEOUT.md).

Only this lessons note was created for the current request:
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-PILOT-001-AUDIT-LESSONS.md`.
