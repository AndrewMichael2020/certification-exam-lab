# AI-103 25-question set: solve before reading the key

Reviewer: claude-opus-5-5[1m] (session record; last served claude-opus-5-5), effort level xhigh (session record), 2026-10-08.

## Method

The answers are printed in the same PDF, so this is a key-hidden solve, not a strict blind pass.

1. I ran `pdftotext -raw` on the PDF and removed the form feeds.
2. A script kept each item's header, stem, exhibit and options, and deleted every ✓ mark. It hid everything from the first "Why the correct answer is right", "Answer and step notes", "Correct order:" or "Correct matches:" line up to the next item header, and it stopped before the quick key.
3. I answered from that stripped text and saved the answers at 08:09:53Z, before reading any key.
4. The case study 2 scenario sat inside a hidden block, after the Q2 sources, so I read it separately and recorded Q3 and Q4 at 08:10:07Z. I had already written Q4 = D as a provisional answer before reading the case.

## Answers recorded before the key, compared with the key

| Item | My answer | Key | Match |
| --- | --- | --- | --- |
| Q1 | C | C | yes |
| Q2 | A | A | yes |
| Q3 | B | B | yes |
| Q4 | D | D | yes |
| Q5 | shown completed: verify only | required ["order_id","note"], false, text.format | verified |
| Q6 | C | C | yes |
| Q7 | A | A | yes |
| Q8 | D | D | yes |
| Q9 | B | B | yes |
| Q10 | C | C | yes |
| Q11 | D | D | yes |
| Q12 | A | A | yes |
| Q13 | C | C | yes |
| Q14 | B (flagged uncertain, then verified on S004) | B | yes |
| Q15 | D | D | yes |
| Q16 | B, E | B, E | yes |
| Q17 | A, D | A, D | yes (removal item) |
| Q18 | B, E | B, E | yes |
| Q19 | A, C | A, C | yes |
| Q20 | B, D | B, D | yes |
| Q21 | shown completed: verify only | C-A-D-B | verified |
| Q22 | shown completed: verify only | B-D-A-C | verified |
| Q23 | shown completed: verify only | stop sessions / backoff with jitter / support request | verified |
| Q24 | shown completed: verify only | PII / language detection / prebuilt NER | verified |
| Q25 | B | B | yes |

21 of 21 solvable items match the key. The 4 verify-only items and Q5 check out against their sources (see review-25q.md).

A caution on what this match means: in 11 of the 15 single-answer items the keyed option is the longest, and most distractors carry absolutes. A solver can reach these keys from the option wording alone, so the match supports key correctness, not item difficulty.
