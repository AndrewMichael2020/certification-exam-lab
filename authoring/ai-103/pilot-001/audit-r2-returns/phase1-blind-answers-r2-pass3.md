# AI-103 pilot 001 r2 — Phase 1 blind answers (pass 3)

Packet ai103-pilot001-audit-r2, package ai103-pilot-001-r2, revision 2.
Recorded from 00-START-HERE.md, 01-BLIND-QUESTIONS.md and 02-SOURCE-EVIDENCE.md only, before 03-AUTHOR-KEY.md or 04-AUDIT-RETURN-TEMPLATE.json were opened. No prior audit output in the project folder was read.

Byte hashes checked before answering (sha256sum, read-only):
- 01-BLIND-QUESTIONS.md: 11c5942097a52289baddb4ad2e2e5e135e1f4944d58a9b90d62932c2d6e2924e (matches 00)
- 02-SOURCE-EVIDENCE.md: 1b88891e1a27880fd06fa876ca08ac9973f92eb2eebd96759bfef39646de7a12 (matches 00)

Line references are the snapshot line numbers printed inside 02 (for example S005 L41 is the line prefixed `41:` under S005). Q-line references are lines of 01.

| Q | Blind answer | Primary evidence |
| --- | --- | --- |
| Q1 | B. Data Zone Standard | S005 L11, L21-24, L41-46 |
| Q2 | D. Foundry account system-assigned MI on the connection; grant Search Index Data Contributor | S040 L5, L45-47, L886-892; case Q-lines 15, 19 |
| Q3 | required `["order_id", "note"]`; additionalProperties `false`; format `text.format` | S037 L3, L977-1031, L1037-1039 |
| Q4 | C. Return each output with its originating call_id (call_red, call_blue) | S007 L113-127 |
| Q5 | A. Task Completion (preview) | S014 L18, L20, L27; S039 L9 |
| Q6 | B. Track video_remix_02 to completion, then retrieve its content | S018 L633-635, L666-675, L882-883, L1131, L1147-1150, L1201 |
| Q7 | A and E | S009 L225-227, L259, L302-303 |
| Q8 | B and E | S042 L33, L93-102, L128-129 |
| Q9 | C, A, D, B | S046 L76-77, L88-95, L102, L114-118, L135-137, L178, L183-185, L341, L377-386 |
| Q10 | A fieldMappings; B outputFieldMappings; C Document Layout skill; D OCR skill; unused Query-time vectorizer | S028 L151-156; S029 L7, L74; S043 L46, L52; S026 L36-40 |

## Reasoning per item

**Q1 — B.** EU-only processing needs a Data Zone type (S005 L23-24, L44); Global may process in any region (L23, L41). Pay-per-token without reservation rules out Provisioned, which is reserved PTU (L11, L45). Interactive responses rule out Batch, which is discounted asynchronous processing (L11, L46; 24-hour window shown for Global Batch at L43).

**Q2 — D.** Key-based auth is not supported with private networking for the Search tool (S040 L5), which eliminates A. The case stipulates the Foundry account's system-assigned MI as the keyless connection principal (Q-line 19), and that identity needs Search Index Data Contributor plus Search Service Contributor (S040 L45-47, L890-891); it already holds the second, so the missing grant is Search Index Data Contributor. B uses the pipeline, which the case says is not the runtime principal. C grants Foundry User, which is not a Search role and leaves the Search data-plane grant missing (the "Foundry User" role itself has no supporting text in 02; its wrongness rests on S040 L45-47 naming the two required Search roles).
Blind concern: S040 L5 and S011 L74 say "project managed identity", while S040 L45 and L887 say the Foundry account's system-assigned MI. 02 L3 acknowledges the conflict and the case stipulation at Q-line 19 resolves it for this item. The key depends on that stipulation rather than on uncontested evidence.

**Q3 — required ["order_id","note"], additionalProperties false, text.format.** Strict structured outputs require every field in `required` (S037 L977-979), with optional semantics emulated by a `null` union while the field stays required (L1005, L1020, L1026-1028). `additionalProperties` must be false (L1037-1039), and the stem also requires disallowing extras. Responses places the schema in `text.format`; `response_format` is the Chat Completions location, and JSON mode does not enforce a schema (L3).

**Q4 — C.** The documented loop returns each function_call_output with `call_id=item.call_id` (S007 L114-124), so each result is paired with the call that requested it. A and D replace the call identifier with the function name; B merges two calls into one output. Blind concern: S007 shows one function and does not state in words that the API matches outputs by call_id rather than by order, or that `tool_call_id` is invalid in Responses. Rejecting A, B and D relies on the code pattern, not an explicit rule.

**Q5 — A.** Task Completion measures whether the requested task was completed with a usable deliverable meeting all user requirements (S014 L18). The tool calls succeeded (Tool Call Success, L27, would pass), the agent followed policy (Task Adherence, L20, targets system-instruction and policy compliance), and nothing indicates fabrication against context (Groundedness, S039 L9).

**Q6 — B.** A remix returns a new video job (`id` different from `remixed_from_video_id`, status `queued`; S018 L1201), which must be polled until `completed` (L633-635, L666-675) and then downloaded by its own id (L882-883). A is wrong because the remix is a new id; C is wrong because `queued` is not finished media; D is wrong because `queued` is an expected state (L635).
Blind concern (rendering): Q-lines 109-124 nest triple-backtick fences inside a triple-backtick `text` fence. Under CommonMark, line 110 (```` ```python ````) is literal content, line 115 closes the outer block, lines 117-123 form a separate JSON block, and line 124 opens a new unclosed fence that swallows the Q6 options, the Q7 heading and the Q7 stem until line 142. The outer fence needs four backticks (02 already uses ```` ````text ```` for this reason).

**Q7 — A and E.** For `session_quota_exceeded`, stopping sessions that don't need active compute frees quota while persisted state is retained (S009 L225, L259, L302). For `regional_session_quota_exceeded`, retry with exponential backoff and jitter (L226-227, L303); the other documented option (another region) is forbidden by policy. B deletes required state; C targets token quota, which is not the failing layer (L229 is a separate TPM/RPM pointer); D violates the region policy.
Blind note: L226 adds "If the error persists create an Azure support request." The stem's "initial actions" and "intermittently" keep E as the correct initial action; the support request is a later escalation and is not offered as an option, so no conflict.

**Q8 — B and E.** Image analysis supports only FourSeverityLevels with values 0, 2, 4, 6 (S042 L129), mapped to Safe, Low, Medium, High (L33), so Medium-or-High means 4 or 6. All four categories can be requested together (L100, L128). A treats HTTP success as approval; C uses a level scheme the image API does not support (L129); D assumes Violence includes the others, contradicted by the four separate categories (L100, L128).
Blind note: "captured ... API contract" is backed by a quickstart page (S042), not a REST reference; adequate for this item but the label slightly overstates the source.

**Q9 — C, A, D, B.** Configure translation (it-IT, add de) and audio input (S046 L76-77, L88-95, L118, L135); construct TranslationRecognizer with both (L114-115, L136-137); call recognize_once and check TranslatedSpeech (L178, L183); read `translations["de"]` and synthesize with a separately configured SpeechConfig/SpeechSynthesizer (L185, L341, L377-386).

**Q10 — A fieldMappings, B outputFieldMappings, C Document Layout skill, D OCR skill; Query-time vectorizer unused.** fieldMappings map a data-source field to an index field; outputFieldMappings map an enrichment-tree node to an index field (S028 L153-156). Document Layout emits Markdown or text with structure (S029 L7, L74). OCR reads `/document/normalized_images` and outputs text (S043 L46, L52). A vectorizer runs at query time, not during ingestion (S026 L36-40).
