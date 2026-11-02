# AI-103 25-question set: option-length requirement and distractor rewrites

Follows Andrew's 2026-10-08 messages: the longest option should be the keyed answer about 18 to 20% of the time, and the fix may need a requirement to make incorrect options longer. Measured baseline is in [review-25q.md](review-25q.md#andrews-longest-option-rule) and [option-lengths-25q.csv](option-lengths-25q.csv). Reviewer: claude-opus-5-5[1m], effort xhigh, 2026-10-08.

## Proposed authoring requirement

Paste-ready text for the author:

> **Option length and wording balance**
>
> 1. Write each distractor to the same standard as the key. It must be a complete, specific action or claim with the same kind of detail the key carries, such as a mechanism, scope, condition or reason. Each distractor stays wrong for one technical reason that a candidate with the target knowledge can name. Any added length must be plausible detail, not a second error.
> 2. When the key is longer than its distractors, lengthen at least one distractor first. Shorten the key only by removing words that are not needed to make it correct.
> 3. Across the single-answer items in a set, the keyed option may be the strictly longest option in no more than 20% of items, with a target from 18% to 20%. The keyed option should also not be the shortest in more than 25% of items, so that length carries no signal in either direction.
> 4. For multi-select items, the longest option may be one of the keys in no more than 30% of items, and the keys may be the two longest options in no more than 10% of items.
> 5. Do not use absolutes or hedges such as only, sole, always, never, assume, entirely, guarantees, without or instead of to make an option wrong. A distractor's error must be technical, not signalled by its wording. Such words are allowed only when the cited source uses them for the same point.
> 6. Before release, report each item's option character counts and the keyed option's length rank, plus the set-level rates for rules 3 and 4. A set that exceeds a limit is not released.

Notes: rule 4 scales Andrew's single-answer target to 2-of-5 items (chance is 40% and 10%). That scaling is my extrapolation, not his number. Rule 3's 25% floor on "key is shortest" prevents over-correcting into the opposite cue.

## Distractor rewrites for the items that break the target

Each rewrite keeps the original error and adds detail of the kind the key has. Character counts use the same method as the review: option text with ✓ removed and wrapped lines joined by one space.

| Item | Option | Current (chars) | Proposed text | New chars | Why it is still wrong |
| --- | --- | --- | --- | --- | --- |
| Q1 (key C, 119) | B | 86 | Let a group-chat coordinator pick whichever agent should speak next from the conversation so far, in any order it chooses. | 122 | Still no fixed extraction, policy, drafting order. |
| | D | 96 | Send the original customer request to all three agents in parallel, then keep whichever complete answer is returned first as the proposal. | 138 | Still skips the dependent stages. |
| Q2 (key A, 170) | B | 114 | Execute create_shipment as soon as the model returns a syntactically valid call with all required arguments, then notify the supervisor with the shipment details. | 162 | Approval still comes after execution. |
| | D | 109 | Return the service credential in a tool response so the model can verify its own authority to create shipments, then let the model call create_shipment once that check passes. | 175 | Still puts a secret in tool output and has no supervisor approval. |
| Q8 (key D, 129) | B | 127 | Put the warranty manual in interaction-derived memory so the agent learns it over time, and use the organizational knowledge base for the temporary receipt. | 156 | Still reverses memory and knowledge-base roles. Drops "only". |
| Q9 (key B, 136) | C | 106 | Construct AIProjectClient with the new project endpoint and pass the Foundry resource's API key as an AzureKeyCredential, then call get_openai_client(). | 152 | S002: "Entra ID is the only authentication method currently supported by the client." Drops "only". |
| Q11 (key D, 147) | B | 74 | Record the final answer, the total end-to-end latency and the user ID for each request as one Application Insights event. | 121 | Total latency only, with no per-operation timing or parent-child structure. Drops "without". |
| | C | 78 | Write a log line from each service with its own timestamp and operation name and export it to Application Insights, with no shared request or parent ID. | 152 | Still uncorrelated. Drops "without". |
| Q13 (key C, 95) | A | 54 | The search service's query volume and query latency metrics for the period after the ingestion run finished. | 108 | Query metrics do not explain ingestion failures. Drops "Only". |
| | B | 55 | The chat model deployment's tokens-per-minute allocation. | 57 | Answer-generation quota is unrelated to ingestion. Drops "Only". |
| | D | 58 | The temperature and top_p settings the application uses when it generates answers from the retrieved documents. | 111 | Generation settings act after retrieval. |
| Q14 (key B, 130) | A | 74 | Unused Azure VM quota for the matching GPU family in the same region is applied to the managed-compute deployment when it scales out. | 133 | S004: "Existing Azure VM quota can't be applied to a managed compute deployment." Drops "automatically". |
| | D | 69 | Switch the deployment to API key authentication, because key-based calls to managed compute are not counted against accelerator quota. | 134 | The authentication method does not change capacity allocation. |
| Q15 (key D, 148) | A | 84 | Record the raw tool arguments, including account identifiers and access tokens, as span attributes so engineers can replay a failing operation exactly. | 151 | S013: "Don't store secrets, credentials, or tokens in … tool arguments, or span attributes." Drops "every". |
| | C | 85 | Export the raw spans to Application Insights as they are produced, then run a nightly job that deletes access tokens and masks account identifiers. | 147 | Redaction still happens after storage. S013 says "before it appears in telemetry". Drops "rely entirely". |
| Q19 (keys A+C, multi) | B | 84 | Switch the application to a different neural text-to-speech voice that pronounces the equipment terms correctly, and leave recognition unchanged. | 145 | Synthesis still does not fix recognition. Drops "sole". |
| | D | 79 | Replace the speech-to-text model with a semantic ranking model that reorders search documents by their relevance to each spoken query. | 134 | Ranking still does not replace recognition. Drops "only". |

**Left unchanged on purpose:** Q4 (+10%), Q7 (product names, +1 character) and Q25 (+1 character). They are the 3 of 15 items where the key stays longest, by small margins that are not a visible cue. Q20 stays the one multi-select item whose longest option is a key.

## Result if adopted

Recomputed with the proposed text:

| Measure | Now | After rewrites |
| --- | --- | --- |
| Single-answer: key strictly longest | 11 of 15 (73%) | 3 of 15 (20%): Q4, Q7, Q25 |
| Single-answer: key shortest | 1 of 15 (Q10) | 1 of 15 (Q10) |
| Multi-select without Q17: longest option is a key | 2 of 4 (Q19, Q20) | 1 of 4 (Q20) |
| Multi-select without Q17: keys are the two longest | 1 of 4 (Q19) | 0 of 4 |
| Distractors with absolutes or hedges | 27 of 60 | 15 of 60 |

The keyed letters do not change, so the quick key stands.

## Explanation lines to update with the rewrites

- Q11 B: "The final text lacks the operation timing…" becomes "One event per request records total latency, but not per-operation timings or the parent-child structure."
- Q13 A: "Query counts describe search activity…" becomes "Query volume and latency describe search activity…".
- Q13 B: drop "by itself".
- Q19 D: "Search ranking is a different task…" still applies, and "semantic ranking" fits it.
- Every other "why wrong" line still applies as written.

These rewrites fix the length and wording cues. They do not make the items hard. The Q13 and Q14 replacement distractors in the review would also raise difficulty.
