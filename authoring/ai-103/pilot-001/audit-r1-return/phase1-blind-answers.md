# AI-103 pilot 001 — Phase 1 blind answers (recorded before reading files 03/04)

Recorded 2026-10-08 from files 01 and 02 only. Input hashes verified: 01 = 15321d39…1c6bb, 02 = 191ddc1c…cea658 (match file 00).

| Q | Blind answer | Evidence (source: snapshot lines) | Ambiguity / evidence gaps |
|---|---|---|---|
| Q1 | **B** Data Zone Standard | S005: 11, 24, 44 (vs 41, 45, 46) | None. Global = any region (23, 41); Provisioned = reserved PTU (45); Batch = async (11, 46). |
| Q2 | **D** | S040: 5, 45–47, 887–891; S011: 74 | S040:5 says "project managed identity" while S040:45 names the account's system-assigned identity; the case stipulates the latter, so no answer change. Option C ("Foundry User only") is not covered by any excerpt; it is wrong only because Search Index Data Contributor is missing. |
| Q3 | required = `["order_id","note"]`; additional = `false`; format = `text.format` | S037: 3, 977, 1037–1039 | Excerpt 977–978 is only the heading "All fields must be required"; its body (and the null-union pattern for optional fields) is omitted. Heading is sufficient for the answer, but the nullable-type rationale is not evidenced in file 02. |
| Q4 | **C** | S007: 113–127 (124 `call_id=item.call_id`) | The excerpt shows one call; it does not explicitly state the rule for multiple parallel calls or that order is irrelevant. D's `tool_call_id` (Chat Completions field) is not in the corpus. Answer is a direct inference, not a quoted rule. |
| Q5 | **A** Task Completion (preview) | S014: 18 (vs 20, 27); S039: 9 | None material. C (Task Adherence) is the closest distractor; stem explicitly says policy was followed. |
| Q6 | **B** | S018: 633–635, 666–675, 882–883, 1131, 1147–1150, 1201 | Corpus never states in prose that remix creates a new video ID; it is shown by example (1201: new id + `remixed_from_video_id`, status queued). Adequate. |
| Q7 | **A, E** | S009: 225–227, 259, 302–303 | Stem says group R retries "report insufficient regional capacity"; per S009:226 persistent errors call for a support request, which no option offers. E is the only region-compliant option but it is not guaranteed to resolve R. Wording slightly undermines E. |
| Q8 | **B, E** | S042: 33, 93–102, 128–129 | S042:33 (0-Safe/2-Low/4-Medium/6-High) comes from the Studio "Run test" section, not the REST reference; mapping is still the documented one. B is only correct together with all four categories being analyzed (E). |
| Q9 | **C → A → D → B** | S046: 76–95, 102, 118, 135–137, 178, 183–185, 341, 377–386 | Page has a function-signature inconsistency (181); irrelevant to order. |
| Q10 | A → **fieldMappings**; B → **outputFieldMappings**; C → **Document Layout skill**; D → **OCR skill**; unused: Query-time vectorizer | S028: 151–156; S029: 7, 74; S043: 46, 50–53; S026: 40 | None. |
