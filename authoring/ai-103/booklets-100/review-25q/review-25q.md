# AI-103 25-question practice set: review

File reviewed: AI-103-Practice-With-Answers-25-Questions.pdf, 29 pages, A4, Chromium (Skia/PDF m148), created 2026-10-08 08:05:39Z. File SHA-256 c7bdb05cd4b655811ddb5ff58ba3b8ab5e51f2327a223b5fe9114961fbf9f2ae. The cover prints exam ID ai103-practice25-20261008-r1 and practice content SHA-256 5654fd23…fb522. There are no item hashes.
Reviewer: claude-opus-5-5[1m] (session record; last served claude-opus-5-5), effort level xhigh (session record), reviewed 2026-10-08.

## Result

All 25 keys are correct, and each item has one defensible answer. Three findings need action, and all three come from Andrew's rules:

1. **Q17 is the Sora 2 video-remix item. Remove it** (Andrew's decision). Removing it leaves computer vision with 2 of 24 items (8%), which is below the study guide's 10 to 15% band, so it needs a computer vision replacement.
2. **The longest option is the keyed answer in 11 of 15 single-answer items (73%).** Andrew's target is 18 to 20%. Six of those items show the cue plainly, with the key from 24% to 88% longer than any distractor. The cue is reinforced by a second one: 27 of 60 distractors (45%) contain absolutes or hedges such as "only", "sole", "assume" or "without", but only 1 of 25 keyed options does.
3. **No "child" wording remains.** The only "child" in the PDF is "parent-child relationships" in the Q11 explanation, which is correct. Case study 1 still uses an older sentence, "Each question uses this shared context independently", while case study 2 uses the new "Answer each question using the shared scenario". Other authoring jargon that learners see is listed below, chiefly "captured" in 6 stems and one exhibit caption, and source line numbers in the Q4 explanation.

Verdicts: 8 accept, 16 revise, 1 remove (Q17). Machine-readable copy: [verdicts-25q.claude.json](verdicts-25q.claude.json).

Everything else is revision-level. Most distractors in about half the items are strawmen, so 12 of the 24 remaining items are easy rather than medium, and the set still has no hard item. One source is on a retirement clock: Foundry workflows (Q1) retire on 2026-12-01.

## How the solve was done

The answers are in the same PDF, so a strict blind solve was not possible. I extracted the text, removed every ✓ mark, hid each "Why the correct answer is right" block and everything after it up to the next item, and stopped before the quick key. I answered 21 items from that stripped text and saved the answers with a timestamp before opening any key. All 21 match. Q5 (dropdown) and Q21 to Q24 (sequence and matching) print only their completed solutions, so I verified them rather than solving them. Details are in [blind-solve-25q.md](blind-solve-25q.md).

## Andrew's longest-option rule

Method: I counted the characters in each option's text, with ✓ removed and wrapped lines joined by one space. An item counts as "keyed longest" when the keyed option has the strictly greatest count. There were no ties at the maximum. Per-item counts are in [option-lengths-25q.csv](option-lengths-25q.csv).

**Single-answer items (15: Q1 to Q4, Q6 to Q15, Q25).** The keyed option is the longest in 11 of 15 (73%). Against a target of 3 of 15 (20%), at least 8 items need to change.

| Margin of key over the longest distractor | Items |
| --- | --- |
| Conspicuous (+24% to +88%) | Q11 +88%, Q14 +73%, Q15 +72%, Q13 +64%, Q2 +49%, Q1 +24% |
| Slight (+1% to +10%) | Q4 +10%, Q7 +4%, Q9 +3%, Q8 +2%, Q25 +1% |
| Key not longest | Q3 (2nd), Q6 (3rd), Q10 (4th), Q12 (2nd) |

Q3 and Q7 have product names as options, so length carries no meaning there. Excluding them gives 10 of 13 (77%). To reach 3 of 15, fix the six conspicuous items, then lengthen one distractor in two of the slight items (Q8 and Q9 need only a few words), which leaves Q4, Q7 and Q25.

**Multi-select items (Q16 to Q20, choose 2 of 5), counted separately.** I counted an item when its single longest option is one of the two keys. That happens in 2 of 5 (Q19, Q20), which is 40% and equal to chance for 2 of 5. Both keys are the two longest options only in Q19 (chance is 10%). Without Q17 the count is 2 of 4. Andrew's target is for single-answer items, so applying it here is my extrapolation. Scaled the same way (about 0.75 times chance), the target would be about 30%, and Q19 A is the item to shorten.

**Second cue, absolutes.** 27 of 60 distractors contain one of: only, sole, assume, entirely, automatically, immediately, repeatedly, proof, guarantees, instead of, without, every. Only Q2 A among the 25 keyed options does ("execute only the approved action"). A learner who rejects every option with an absolute, then picks the longest of what remains, gets most of the single-answer items right without knowing the subject.

**Rewrite suggestions for the six conspicuous items.** Each replaces a strawman with a specific misconception of similar length that the cited source refutes.

- Q13: add "The indexer's latest run status, which reports Success for the run." S044 says a run can succeed while individual documents have errors, so this is a strong distractor.
- Q14: replace D with "Request a VM-family quota increase for the region, as for classic managed online endpoints." S004 says existing Azure VM quota can't be applied.
- Q11: replace A with "Enable request logging in Application Insights with one entry per service call, keyed by service name."
- Q15: replace A with "Export full spans with content recording on, and restrict the Application Insights resource to the team."
- Q2: replace C with "Validate the arguments, execute with a least-privileged identity, and ask the supervisor to confirm afterwards." This keeps everything except the before-execution approval.
- Q1: replace D with "Run the extraction and policy agents concurrently, then pass both outputs to the drafting agent."

Then trim each key to the length of its distractors.

## Removals (Andrew's decisions)

- **Q17 (Sora 2 preview v1 remix, AI103-C1.04): remove.** No other item mentions Sora, remix or video. Coverage effect: computer vision falls to 2 of 24 (8%). The study guide (skills measured as of April 16, 2026) still lists video generation and editing bullets (C1.02, C1.04), so removing the item leaves them uncovered. Replace it with a computer vision item that does not depend on Sora, for example image editing with masks (C1.03), captions (C2.02) or Content Understanding video analysis (C2.06).

## Learner-facing authoring jargon

| Where | Text | Suggested fix |
| --- | --- | --- |
| Case study 1 intro (p2) | "Each question uses this shared context independently." | Use the case 2 sentence: "Answer each question using the shared scenario. Your answers do not change the scenario." |
| Stems Q8, Q14, Q15, Q16, Q18, Q22, and the Q6 exhibit caption | "captured Foundry memory guidance", "captured new Foundry guide", "captured tracing guidance", "captured Azure Content Safety image:analyze API contract", "captured W3C decision tree", "captured Python SDK 1.1.0 workflow" | Use "documented" or name the doc. "Captured" refers to the author's source snapshots and means nothing to a learner. |
| 12 explanation sentences (Q4 ×4, Q5, Q6, Q9 ×2, Q12, Q14, Q16, Q24) and the cover | "The captured …", "captured AI-103 v1.1.0 source pack" | Same fix. |
| Q4 explanation (p7) | "(S040 line 5 and S011 line 74), while S040 lines 45 and 887 … The case stipulation settles the principal for this item; it does not resolve that broader documentation wording conflict." | Move to author notes. A learner needs only "The case names the account's system-assigned identity as the connection principal." |
| Item-type badges and quick key | "matching magnet", "log or artifact interpretation", "code or config artifact" | "Matching", "Exhibit", "Configuration" (or similar). |
| Q9 and Q14 stems, Q14 explanation | "follows that SDK generation", "for this feature generation", "The older classic VM-based recipe must not be substituted" | "for azure-ai-projects 2.x"; "for managed compute in Foundry (new)"; drop the sentence or say "Classic hub-based quota does not apply." |
| Cover | "Exam: ai103-practice25-20261008-r1", "Practice content SHA-256", "independent content audit pending" | Fine for a draft; drop them from the learner edition. The S-numbers and snapshot hashes under each item are optional for learners too. |

## Item verdicts

Verdicts: accept, revise (wording, cue or label change; the key stands), or remove. Sources marked "frozen" match the r2 frozen evidence snapshot hash, so the r2 evidence applies. Sources marked "live" were read on Microsoft Learn on 2026-10-08 (see Sources).

| Item | Key | Verdict | Evidence | Findings |
| --- | --- | --- | --- | --- |
| Q1 | C | Revise | S008 live | Key correct: the workflow page defines Sequential as "Passes the result from one agent to the next in a defined order". The key is the longest option by 24%, and A and D are strawmen. The page also says "Microsoft Foundry is retiring workflows on December 1, 2026", so re-source the item to Microsoft Agent Framework orchestration before then (I did not read that page). Easy. The explanation's last sentence, about human approval, belongs to Q2. |
| Q2 | A | Revise | S007 live | Key correct: "Treat tool arguments and tool outputs as untrusted input", "Don't pass secrets … in tool output", "Apply least privilege", "require explicit user confirmation for actions that change data". The key is longest by 49%, and B, C and D each restate a rule the case text forbids. Easy. |
| Q3 | B | Accept | S005 frozen | Carried from r2 Q1. |
| Q4 | D | Revise | S011, S040 frozen | Carried from r2 Q2. The key is correct. Remove the source line numbers and the stipulation commentary from the explanation (see jargon). |
| Q5 | ["order_id","note"], false, text.format | Revise | S037 frozen | Carried from r2 Q3. The key is correct. The dropdown choices are never shown, only the completed values, and the notes label "additional:" truncates "additionalProperties". The objective is a loose fit: B3.01 is about tuning generation behavior, while D1.01 names structured JSON outputs. That is optional, because moving the item changes domain counts. |
| Q6 | C | Accept | S007 frozen | Carried from r2 Q4. The trace renders as plain text, so the r3 raw-fence issue is gone. D (tool_call_id) is a good distractor. |
| Q7 | A | Accept | S014 frozen | Carried from r2 Q5. The evaluator names and "(preview)" labels match the source. |
| Q8 | D | Revise | S006 live | Key correct: "Use memory to capture user-specific or agent context that is learned and persists…", "Use a Foundry IQ knowledge base to ground your agent on curated organizational content", "Use the file search tool to search user-provided documents during an interaction". The key is longest by 2%, and A and C use absolutes. Remove "captured" from the stem. A1.04 ("Choose appropriate memory, tool, and knowledge integration services") fits better than B2.02 (optional). |
| Q9 | B | Revise | S002, S003 live | Key correct: the readme is titled version 2.8.0 and says "Entra ID is the only authentication method currently supported by the client" and "Use the .get_openai_client() method … run Responses". The SDK overview lists 2.x as Foundry (new) and 1.0.0 as Foundry (classic). Minor changes: replace "SDK generation" in the stem, and D's "assume" makes it self-refuting. |
| Q10 | C | Revise | S039 live | Key correct: Groundedness "Measures how well the generated response aligns with the given context without fabricating content". Every distractor carries its own refutation ("as the sole test", "without checking its context"), so the item is easy. The page labels Response Completeness "(preview)", and Q7 keeps such labels, so add it here for consistency. |
| Q11 | D | Revise | S013 live | Key correct: spans "can be nested to show hierarchical relationships", and traces are stored in Application Insights. The key is longest by 88%, and A, B and C are not plausible. Easy. |
| Q12 | A | Accept | S010 live | Key correct: "RBAC roles apply when you authenticate using Microsoft Entra ID. If you use key-based authentication instead, the key grants full access without role restrictions." C is a good distractor. |
| Q13 | C | Revise | S044 live | Key correct: "review start and end times, and detailed errors and warnings from a particular run" and "document-specific problems … are listed in the Errors and Warnings fields". The key is longest by 64%, and A, B and D are "Only…" strawmen. Easy. See the rewrite suggestion. |
| Q14 | B | Revise | S004 live | Key correct: "Quota is granted per accelerator SKU per region through the Foundry quota process and is separate from Azure VM quota … Existing Azure VM quota can't be applied to a managed compute deployment." Managed compute is "(preview)", which matches the stem. The key is longest by 73%, and C and D are not plausible, so the item is effectively A versus B. Fix "captured new Foundry guide" and "feature generation". |
| Q15 | D | Revise | S013 live | Key correct: "Don't store secrets, credentials, or tokens in … tool arguments", "Redact … before it appears in telemetry", "apply the same access controls and retention policies you use for logs and metrics", "Use consistent span attributes", "Correlate evaluation run IDs". The key is longest by 72%, and A and C are weak. Easy. |
| Q16 | B, E | Accept | S042 frozen | Carried from r2 Q8. The stem keeps "captured". |
| Q17 | A, D | **Remove** | S018 frozen | Sora 2 remix item (Andrew's decision). The key is consistent with the r2 evidence. I did not re-verify it. |
| Q18 | B, E | Revise (minor) | S050 live | Key correct: for a link or button image, "Use the alt attribute to communicate the destination of the link or action taken", and for decorative images, "Use an empty alt attribute". This aligns with study guide bullet C2.04 ("Configure generation of alt-text … aligned to accessibility guidelines"), so a W3C source is appropriate. A and C are weak. Easy. Remove "captured" from the stem. |
| Q19 | A, C | Revise | S034 live | Key correct: "deploy the model to a custom endpoint", and "Testing a model before and after training is optional but recommended". B, D and E are not plausible ("sole repair", "only ranks", "guarantees perfect"). A is the longest option. Easy. |
| Q20 | B, D | Accept | S046 frozen | Carried from r2 Q9, now multi-select. The translations dictionary is keyed by the target language (S046 L94-95, L185). The study guide puts speech translation under text analysis ("Translate speech into other languages", D2.04), which settles the r3 question about Domain D. E is weak. |
| Q21 | C-A-D-B | Revise (render) | S026 frozen | Order correct. The lettered steps are never printed, but the notes and the quick key use letters A to D. Easy. |
| Q22 | B-D-A-C | Revise (render) | S021 live | Order correct: "Begin Analysis", "Poll for Results", "Process Results", with `poller.result()` and `result.contents[0]` … `.markdown` in the 1.1.0 readme. It has the same missing-letter issue as Q21. Remove "captured" from the stem. |
| Q23 | Stop sessions / backoff with jitter / support request | Revise (minor) | S009 frozen | Carried from r2 Q7, now matching. The key matches S009 L225-227 and L302-303. The explanation and note A mention deleting sessions, which is not a listed choice. The rows are unlettered, and the "Choices:" line prints doubled punctuation ("jitter.,", "request.,"). |
| Q24 | PII / language detection / prebuilt NER | Accept | S030 live | Key correct: PII detection "identifies entities … associated with individuals", language detection "detects a wide range of languages and variant dialects", and prebuilt NER "categorizes them into predefined types". The rows are unlettered (cosmetic). |
| Q25 | B | Accept | S043, S028 frozen | The OCR `image` input "only works with /document/normalized_images … when imageAction is set to a value other than none" (S043 L46), and "outputFieldMappings map a node in an enriched document to a search field" (S028 L154). The key is longest by 1 character, which is not a visible cue. |

No item is unverifiable. Q17 is the only item I did not re-check, because it is being removed.

## Objective alignment and coverage

The study guide is "Study guide for Exam AI-103: Developing AI Apps and Agents on Azure", with skills measured as of April 16, 2026. That date matches the cover's "Objectives effective: 2026-04-16", and its five functional groups match the five domain names in the PDF. The guide does not number its bullets. Numbered in page order, every objective code in the PDF lands on a bullet that fits its item. Q5 (B3.01) and Q8 (B2.02) are the loose fits noted above.

Coverage against the guide's weights:

| Domain | Weight | This set (25) | Without Q17 (24) |
| --- | --- | --- | --- |
| A Plan and manage | 25-30% | 7 (28%) | 7 (29%) |
| B Generative AI and agents | 30-35% | 9 (36%) | 9 (38%) |
| C Computer vision | 10-15% | 3 (12%) | 2 (8%) |
| D Text analysis | 10-15% | 3 (12%) | 3 (13%) |
| E Information extraction | 10-15% | 3 (12%) | 3 (13%) |

With a computer vision replacement for Q17, only B sits one item above its band. That is acceptable for a 25-item practice set.

## Difficulty

The author labels count easy 4 (Q6, Q17, Q22, Q24), medium 21 and hard 0. My estimate for the 24 items that remain, based on how many distractors survive a first reading, is easy 12 (Q1, Q2, Q6, Q10, Q11, Q13, Q15, Q18, Q19, Q21, Q22, Q24), medium 12 (Q3, Q4, Q5, Q7, Q8, Q9, Q12, Q14, Q16, Q20, Q23, Q25) and hard 0. This is an inference, not a measured result. The r3 open point, that there is no hard item, still applies. Rewriting the strawman distractors fixes the length cue, the absolute cue and the easy items at once. The Q13 and Q14 rewrites above would each make a candidate hard item.

## Rendering

I checked pages 1, 2, 5, 7, 8, 9, 19, 24 and 26 to 29 visually, and every page through the extracted text. The ✓ marks and green highlight sit on the keyed options throughout, and nothing is clipped. The quick key agrees with every per-item key.

- Fixed since r3: no raw code fences (Q6 trace), no mid-word wrap, and the case heading no longer reads "Case study - Case study".
- Still present: matching and sequence rows have no letters (Q21 to Q24), but the notes and quick key refer to A to D. Either print the lettered option bank above the solution, or drop the letters from the notes and key.
- Q5 shows only the completed values. In a practice edition, show the three dropdowns with their choices before the solution, so learners can attempt the item.
- Q23 "Choices:" line: "Apply exponential backoff with jitter., Increase …, Create an Azure support request., Stop …" has a period before each comma.
- Each case scenario sits on its own page, ahead of its questions. That works in print. On screen, a "see case study 1, page 2" link would help.

## Sources

Live pages, all read on 2026-10-08. The date in brackets is the page's own "last updated" date.

| ID | Page | URL | Used for |
| --- | --- | --- | --- |
| Guide | Study guide for Exam AI-103 (skills as of 2026-04-16; updated 2026-04-14) | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103 | Domains, weights, objective fit |
| S002 | Azure AI Projects client library for Python, version 2.8.0 | https://learn.microsoft.com/python/api/overview/azure/ai-projects-readme?view=azure-python | Q9 |
| S003 | Get started with Microsoft Foundry SDKs and endpoints (2026-10-06) | https://learn.microsoft.com/azure/foundry/how-to/develop/sdk-overview | Q9 |
| S004 | Deployment overview for Microsoft Foundry Models (2026-09-28) | https://learn.microsoft.com/azure/foundry/concepts/deployments-overview | Q14 |
| S006 | Memory in Microsoft Foundry Agent Service (preview) | https://learn.microsoft.com/azure/foundry/agents/concepts/what-is-memory | Q8 |
| S007 | Use function calling with Microsoft Foundry agents (2026-06-02) | https://learn.microsoft.com/azure/foundry/agents/how-to/tools/function-calling | Q2 security bullets (not in the r2 frozen excerpt) |
| S008 | Build a workflow in Microsoft Foundry (Preview) (2026-07-31) | https://learn.microsoft.com/azure/foundry/agents/concepts/workflow | Q1, retirement notice |
| S010 | Role-based access control for Microsoft Foundry (2026-09-16) | https://learn.microsoft.com/azure/foundry/concepts/rbac-foundry | Q12 |
| S013 | Agent tracing overview (2026-08-28) | https://learn.microsoft.com/azure/foundry/observability/concepts/trace-agent-concept | Q11, Q15 |
| S021 | Azure AI Content Understanding client library for Python, version 1.1.0 | https://learn.microsoft.com/python/api/overview/azure/ai-contentunderstanding-readme?view=azure-python | Q22 |
| S030 | What is Azure Language in Foundry Tools (2026-07-21) | https://learn.microsoft.com/azure/ai-services/language-service/overview | Q24 |
| S034 | Custom speech overview (2026-02-25) | https://learn.microsoft.com/azure/ai-services/speech-service/custom-speech-overview | Q19 |
| S039 | RAG evaluators (2026-06-02) | https://learn.microsoft.com/azure/foundry/concepts/evaluation-evaluators/rag-evaluators | Q10 ("Document Retrieval" is not in the r2 frozen excerpt) |
| S044 | Monitor indexer status and results (2026-03-17) | https://learn.microsoft.com/azure/search/search-monitor-indexers | Q13 |
| S050 | W3C WAI, An alt Decision Tree | https://www.w3.org/WAI/tutorials/images/decision-tree/ | Q18 |

Frozen r2 evidence (uploads/hearth/e0787bcf-…): 14 of the 26 cited sources (S005, S007, S009, S011, S014, S018, S026, S028, S037, S039, S040, S042, S043, S046) print snapshot hashes identical to r2 file 02. The other 12 are new and are covered by the live reads above. I did not compare live page text to the PDF's new snapshot hashes, because no new snapshot files came with the PDF.

## Limits

- No item hashes, so these verdicts are not bound to item content for Codex. Send the Markdown packet with item hashes for a bound pass.
- I read the live pages through a fetch tool that returns quoted excerpts, not raw HTML. Each claim above quotes the excerpt it relies on.
- Difficulty estimates are judgement. Option lengths and cue-word counts are mechanical and reproducible from the PDF text with the method above.
- Read only. No Azure operations, no scenario code, no device access.
