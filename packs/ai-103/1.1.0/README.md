# AI-103 question-generation evidence — staged revision 1.1.0

This pack supplies evidence for generating, reviewing and presenting practice exams in the local app. The priority is question quality: supported answer keys, plausible distractors, unambiguous scenarios, useful explanations and coverage of the exam objectives.

## Generation workflow

1. **Select a bounded batch.** Use [objective coverage](coverage.json), the [objective map](objectives.json) and the 14 packets listed in [the manifest](manifest.json). Begin with a ten-question pilot across all five domains; expand after content review.
2. **Generate original questions in Codex.** Give each item a stable ID, pack/version, objective, format, answer key, explanations for every option, and supporting claim/source locators. Use realistic service-selection, configuration, Python/API and troubleshooting scenarios. State the API generation when it affects the answer. Keep distractors plausible without introducing a second defensible answer.
3. **Review before release.** Check source support, answer uniqueness, distractor explanations, version consistency, duplication and coverage. Prepare the agreed manual Claude solve-first/key-comparison audit. Resolve disputed items against evidence and retain their revision history.
4. **Import and present reviewed exams.** The app must validate and assemble local drafts, present questions clearly, score attempts, and show answer/distractor explanations with citations. Keep question and answer PDF exports consistent with the reviewed item revisions.

Generation uses the agreed Codex subscription workflow. The app imports and presents the resulting files. More engineering is needed for that import path; Session 2A remains paused.

## Evidence inputs

- **64 official objectives; 56 have bounded authoring scopes, eight are partial.** Partial objectives remain outside authoring packets until their required evidence is resolved.
- **50 primary sources and 79 documented claims.** [Claim ledger](evidence/claims.json) contains exact excerpts, source locations and hashes.
- **64 objective notes and five domain summaries:** [A](knowledge/domain-A.md), [B](knowledge/domain-B.md), [C](knowledge/domain-C.md), [D](knowledge/domain-D.md), [E](knowledge/domain-E.md).
- [Python/API fragments](knowledge/code-reading.md) support code-interpretation items; [version conflicts](evidence/version-conflicts.md) constrain answer keys.
- [Resource inventory](RESOURCE-INVENTORY.md) provides supplementary context for authors and reviewers. Technical answer evidence comes from the captured primary sources.

See [readiness review](READINESS-REVIEW.md) for completed checks and gaps. This staged pack contains no authored questions and is not activated in the exam engine. Source text retains its ownership/licensing; captured examples were not executed.
