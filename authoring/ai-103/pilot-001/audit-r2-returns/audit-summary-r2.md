# AI-103 pilot 001: revision 2 audit summary

Packet ai103-pilot001-audit-r2, package ai103-pilot-001-r2. Reviewed 2026-10-08.
Reviewer model label (from session metadata): claude-opus-5-5[1m], last served claude-opus-5-5, effort xhigh for Phase 2. Phase 1 blind answers were saved before Andrew switched effort to xhigh at 07:02Z; the earlier level was not recorded.

**Release recommendation: not ready.** Revise Q2, Q6 and Q7, rebind those three hashes, and re-review only the changed text. The other seven are accepted at their current hashes.

## Blind versus key

All ten Phase 1 blind answers match the author key. The blind answers were saved to `phase1-blind-answers-r2.md` before 03 and 04 were opened. Byte hashes for 01 to 04 match 00-START-HERE.md.

That first Phase 1 ran before the switch to extra high, so Phase 1 was rerun at extra high in a fresh context that saw only 00, 01 and 02. The rerun is saved as `phase1-blind-answers-r2-xhigh-rerun.md`. All ten rerun answers match both the original blind answers and the key, and the rerun independently found the Q6 rendering defect.

## Blockers

| Item | Verdict | Problem | Fix |
| --- | --- | --- | --- |
| Q2 | revise | The A explanation says the developer's role "does not authorize the managed identity used by the connection", but in option A the connection stays key-based and uses no managed identity. | Reword A: keeping the key leaves the connection on an unsupported method, and a developer role does not change how the connection authenticates. Key D unchanged. |
| Q6 | revise | The stimulus nests ```python and ```json fences inside a ```text fence (01 L109-124). Under CommonMark rules, a stray fence at L124 turns Q6's options and the Q7 stem into one code block. This was inferred from the rules, not render-tested. | Use a four-backtick outer fence or two sibling fences. Key B and explanations unchanged. Confirm whether the defect is in the item or in the exporter. |
| Q7 | revise | The difficulty is labelled hard. Every distractor is eliminated by an explicit stem constraint (retained state, token usage below quota, region policy), which leaves exactly A and E. | Relabel as medium. To keep a hard item, remove "Model token usage is below its quota" so that C must be rejected from the error codes. |

## Focus areas from the handoff

- **Q2 wording and the case stipulation:** resolved. Case line 19 fixes the principal, and no option offers a project managed identity, so the conflict between S040 and S011 cannot make two options defensible. Only the A explanation needs work.
- **Q3 required and null evidence:** complete. S037 L977-1031 and L1037-1039 cover required, the nullable union and additionalProperties, and L3 covers text.format.
- **Q4 call_id explanation:** correct. It now separates the function name from the per-call IDs. A minor optional point: S007 shows call_id by example, so "shows" is more accurate than "requires".
- **Q7 initial versus persistent escalation:** consistent with S009 L226. Backoff is the initial action and a support request follows if the error persists. "Bounded" is unsupported wording and optional to drop.

## Difficulty findings

The Phase 2 review agrees with 9 of 10 labels. The only disagreement is Q7, which moves from hard to medium. The assessed counts would then be easy 3, medium 7, hard 0, so the set would have no hard item.

The extra-high blind rerun rated the set easier still: easy 6, medium 4, hard 0. It rated Q1, Q5 and Q7 easy. Both reads agree on two points: no item is hard, and Q1, Q5 and Q7 can be answered mainly by eliminating options against explicit stem constraints. Q7 stays a blocker. Q1 and Q5 are accepted at medium, though easy is also defensible. If the author wants a genuine hard item, the fix is distractors that need domain knowledge to reject rather than stem stipulations. These remain practice estimates, not measured difficulty.

## Non-blocking notes

- Q1: the D explanation says the case "explicitly excludes" batch. The case implies this through its interactive-response requirement but does not name batch.
- Source gap: S040 L5 and S011 L74 say "project managed identity", while S040 L45 and L887 say the account's system-assigned identity. The stipulation covers Q2 only.
- No live sources were checked. All findings are against the frozen evidence.
