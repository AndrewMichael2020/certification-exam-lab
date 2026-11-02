# AI-103 pilot 001 r2 — audit summary (pass 3)

Packet ai103-pilot001-audit-r2, package ai103-pilot-001-r2, revision 2.
Reviewer: claude-opus-5-5[1m] (session record; last served claude-opus-5-5), effort level xhigh (session record), reviewed 2026-10-08T07:16:08Z.
This pass was independent: no prior audit output in the project folder was read.

## Result

- Blind answers (recorded before 03 and 04 were opened) match the author key on all 10 items.
- Verdicts: 8 accept, 2 revise, 0 reject, 0 unverifiable. No key changes.
- Release recommendation: revise before release. Fix Q6 and Q2, re-render 01, and issue the changed items as a new bound revision.

## Blockers

1. **Q6 exhibit rendering (blocking).** In 01, lines 109-124 put ```` ```python ```` and ```` ```json ```` fences inside a ```` ```text ```` fence. Under CommonMark/GFM, line 115 closes the outer block and the bare fence on line 124 opens a new block that runs until line 142. Once rendered, Q6's options and Q7's heading and stem all appear inside one code block. The fix is a four-backtick outer fence (02 already uses one) or two sibling blocks. The key is unaffected.

## Revise, non-blocking

2. **Q2 A rationale.** The sentence "does not authorize the managed identity used by the connection" is wrong for option A, which keeps the key-based connection. Replacement text is in the JSON.
3. **Q2 stipulation.** The case stipulation is sufficient and keeps the item independent of the source conflict. The sources say "project managed identity" in S040 L5 and S011 L74, and "account system-assigned identity" in S040 L45 and L887. The explanation should say the stipulation is what settles this, because a learner who checks S011 will otherwise find the conflict unexplained.

## Focus-area checks

| Area | Finding |
| --- | --- |
| Q2 wording, role and case stipulation | Key correct. Stipulation sufficient. Explanation needs two fixes (above). |
| Q3 required and null evidence | Complete: S037 L977-1031 (all required, null union) and L1037-1039, L3. Accept. |
| Q4 call_id explanation | Correct in substance. "Must" and "example requires" are stronger than one code sample (S007 L113-127) supports. Optional rewording only. |
| Q7 initial versus persistent retries | Consistent. "Initial actions" and "intermittently" scope backoff as the first response. The explanation states the support-request escalation from S009 L226 correctly, and that escalation is not an option. Accept. |
| Q6 nested code blocks | Confirmed defect (blocker 1). |

## Difficulty

I agree with 9 of the 10 labels. **Q7 hard should be medium**: each distractor is ruled out by an explicit stem constraint (B by the retained-state rule, C by tokens below quota, D by the region policy). Q2, Q3 and Q8 are borderline easy because of stem or option cues, but medium is defensible for all three.
Author counts were easy 3, medium 6, hard 1. Reviewer counts are easy 3, medium 7, hard 0, very_hard 0.

## Notes

- Hash checks: the byte hashes of 01-04 match 00. The item hashes in 03 and 04 are identical and in the same order. The canonical draft hash cannot be recomputed from the packet.
- Packaging: 01 does not say which items belong to the Cedar Atlas case. Only Q1 and Q2 use it, and it causes no conflict.
- Q8: distractor D is weak, and E's value list confirms B's thresholds. Neither blocks a practice item.
- Only frozen evidence was used; no live sources were consulted. Commands run: file listing, sha256sum, a grep/diff hash cross-check, date, and jq validation of the JSON. No scenario code, repositories or Azure operations.

## Files

- `ai103-pilot001-audit-r2-pass3.claude.json`: completed template 04, bound to all 10 item hashes
- `phase1-blind-answers-r2-pass3.md`: Phase 1 blind answers with source IDs and line ranges
- `audit-summary-r2-pass3.md`: this summary
