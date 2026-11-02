# AI-103: two 100-question practice sets

Created 8 October 2026 in the Codex conversation. No paid generation API was used. These are standalone practice booklets; they have not been imported or marked released in the study application.

## Deliverables

Four PDFs are in `output/pdf/` at the repository root:

- `AI-103-Set-A-Questions-Only-100.pdf` - 40 pages.
- `AI-103-Set-A-Practice-With-Answers-100.pdf` - 106 pages.
- `AI-103-Set-B-Questions-Only-100.pdf` - 40 pages.
- `AI-103-Set-B-Practice-With-Answers-100.pdf` - 106 pages.

Each set has 100 questions: 64 single-answer items (including eight case-study questions and configuration exhibits), 18 multiple-select, 10 sequence and eight matching items. Domain counts are A 28, B 33, C 13, D 13 and E 13. The two sets share exam concepts but contain distinct question stems and decisions. Sora generation/remix is excluded; video understanding is retained. Domain weighting does not establish coverage of every objective bullet.

## Review application

`review-25q/` preserves the five supplied Opus files byte-for-byte, their receipt hashes, and the original 25-question JSON. The original reviewed PDF is unchanged so its hash remains meaningful.

`corrected-25q.draft.json` contains the review corrections: a vision replacement for Q17, substantive distractor revisions, consistent case instructions, precise version wording, removal of source-line commentary from learner explanations, and the full `additionalProperties` label. Q1 now references the Microsoft Agent Framework orchestration documentation checked during this conversation, rather than the retiring Foundry workflow surface. That additional URL is an authoring reference; the immutable source pack was not modified.

The shared renderer now displays lettered unsolved banks before sequence and matching solutions and all dropdown choices before completion. It uses readable type labels and a bulleted matching bank. The booklet renderer removes authoring IDs and hashes from learner pages, adds source links to explanations and links case scenarios to their questions. It measures question blocks at print width to keep headers, stems and options together.

The review's statement that five of 25 items were verify-only leaves 20 independently solvable items, rather than its reported 21. This arithmetic correction does not change the accepted substantive findings.

## Measured option balance

| Measure | Set A | Set B |
| --- | --- | --- |
| Single-answer key strictly longest | 12/64 (18.75%) | 12/64 (18.75%) |
| Single-answer key strictly shortest | 15/64 (23.44%) | 13/64 (20.31%) |
| Multi-select unique longest is keyed | 4/18 (22.22%) | 5/18 (27.78%) |
| Multi-select keys are the two longest | 0/18 | 0/18 |
| Single-answer key positions | 16 each at A/B/C/D | 16 each at A/B/C/D |

Counts normalize whitespace and count characters. Longest and shortest require a unique extreme; top-two requires both keys to exceed every distractor. Ties at a boundary do not count. `option-lengths-set-a.csv`, `option-lengths-set-b.csv` and `quality-report.json` retain the detailed counts, rankings, content hashes and item hashes. The corrected 25-item draft has 3/15 single keys longest, zero single keys shortest, and 1/5 multi-select items with a keyed longest option.

## Evidence and verification

The source basis is the local AI-103 1.1.0 primary-evidence collection captured on 8 October 2026. Assembly verifies each used snapshot's hash. Source links accompany the practice explanations. These are documentation-based questions; no Azure deployment was executed to establish the answers.

`pdf-review.json` records final PDF hashes and page checks. Every question header appears once in the question section. All stems, option text and matching banks were found on their corresponding question page. All practice explanations were found. Questions-only editions have no explanation blocks or quick answer key. Final contact sheets covered every page; full-size samples included single-choice, sequence and matching pages. The cover spill, narrow matching rows and split question header observed during rendering were corrected before delivery.

The new 200 questions have author checks, not a fresh independent Opus review. Difficulty labels are author estimates, not measured item difficulty. No application unit or end-to-end suite was run for this document request. The existing runtime import/release gates remain in place.

## Reproduction

From the repository root:

```sh
python3 authoring/ai-103/booklets-100/revise25.py
python3 authoring/ai-103/booklets-100/assemble.py
python3 authoring/ai-103/booklets-100/render.py
```

`content.py`, `varied.py` and `editorial.py` are local authored content and revisions, not remote-generation clients. Assembly produces `set-a.json` and `set-b.json`. Rendering copies an allowlisted project into a disposable OrbStack container, installs dependencies there, blocks browser network requests and returns the four requested PDFs. Source files are mounted read-only, and environment files and local application data are excluded. `render.ts` runs inside that staged project through `render.py`.

Recommended next quality step: an independent content review of the two new sets using their questions-only editions before consulting the author keys.
