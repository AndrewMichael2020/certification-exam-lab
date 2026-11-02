# AI-103 pilot 001 — Claude audit summary

Packet `ai103-pilot001-audit-r1`, package `ai103-pilot-001-r1` rev 1, draft SHA-256 `0ceafb2d…358b`.
Reviewer: `claude-opus-5-5[1m]` (session model; last served `claude-opus-5-5`), reviewed 2026-10-08 UTC.
Input file hashes for 01–04 matched file 00. Blind answers were recorded before reading the key (`phase1-blind-answers.md`).

## Result
- Blind answers matched the author key on 10/10 items. Key is correct on all ten under the frozen snapshots.
- **Accept (8):** Q1, Q3, Q4, Q5, Q6, Q8, Q9, Q10.
- **Revise (2):**
  - **Q2:** option C note claims "Foundry User is a project role", which no excerpt supports. The stem also cites a "documented retrieval problem" that the case never documents. The key D still stands.
  - **Q7:** the group R log says retries already report insufficient capacity. S009:226 then points to a support request, so key option E is not clearly sufficient. Fix: make R "intermittent failures, client retries immediately with no delay".
- **Reject / unverifiable:** none.

## Difficulty
The labels are too high. Q2 and Q3 are not very_hard (both medium), and Q6 is not hard (easy). The other items are also a step easier than labelled, except Q5 and Q7. The cause is the same throughout: the case and stems use the same nouns as the right option ("EU data zone", "lacks Search Index Data Contributor", `call_id=get_stock` next to `call_red`), and each distractor breaks a constraint stated in the stem. Concrete fixes for each item are in the JSON.

## Evidence gaps
- S037: the null-union text is missing from file 02. Checked against the live page (dated 2026-08-24) instead.
- S040 and S011 conflict on "project MI" versus "account system-assigned MI"; Q2 resolves this only by stipulation.
- The `tool_call_id` (Q4) and Foundry User (Q2) claims have no supporting excerpt.

## Coverage
The domain mix of 3/3/2/1/1 is close to the official weights (A 25–30%, B 30–35%, C/D/E 10–15%). C is slightly heavy, which is fine for 10 items.

## Limits
I ran nothing in Azure and opened no repository files. The three PDFs were not audited.

## Case-study length (Andrew's question)
No Microsoft primary source that I found states how long a case study is. Microsoft does say case studies "use complex scenarios" designed to test "your ability to identify the critical information needed to solve a problem and then analyze and synthesize it", that each case has several questions plus a review screen, and that you "can refer to scenario details as often as you'd like" ([Exam basics FAQ](https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions), updated 2025-06-30). The exam-experience page ([Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience), updated 2026-03-31) and the [AI-103 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103) give no length either, and the exam sandbox could not be fetched.
- **Length:** not proven, so I recommend no change on length.
- **Structure (supported by the quote above):** Cedar Atlas states the critical facts outright, so there is nothing to "identify". The case should mix relevant and irrelevant details, describe symptoms rather than root causes, and support more than two children.
