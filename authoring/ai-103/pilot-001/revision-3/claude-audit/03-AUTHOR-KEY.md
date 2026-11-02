# Author key and correction delta - revision 3

This is a focused correction check following two completed revision-2 blind solves. Prior verdicts below remain historical. Verify the supplied current text and rendered Q6 exhibit. No acceptance is prefilled. All keys, stems, options and shared-case text are unchanged. Q1/Q2/Q4/Q7 explanations or difficulty changed; six canonical item hashes are preserved.

Both prior audits agreed with all ten keys. First pass: 7 accept / 3 revise (Q2/Q6/Q7). Independent pass 3: 8 accept / 2 revise (Q2/Q6). Q7 was assessed medium by both. Current estimates: 3 easy / 7 medium / 0 hard / 0 very_hard. These are practice judgments, not empirical calibration.

## Q1 - ai103-pilot001-q01

Current item revision: 3; SHA-256: ca7940b793990fc43f8bd09b0cbd3628372ed279afee50125356d4118a7e8eb7
Previous item revision: 2; SHA-256: ff2516e6617fe35b8db17fad20d6c898b0473c479a421a49284349540fb61710
Prior verdicts (first / pass 3): accept / accept
Current difficulty: medium; previous: medium

### Current key
```json
"B"
```

Data Zone Standard processes requests within the selected data zone and uses pay-per-token billing. It matches the approved EU boundary and an interactive workload without a reserved-throughput commitment.

- **A:** Global Standard uses global processing. Selecting an EU resource location does not convert the global processing boundary into the required EU data-zone boundary.
- **C:** Data Zone Provisioned respects the data-zone boundary but uses reserved provisioned throughput units, contrary to the stated billing requirement.
- **D:** Data Zone Batch respects the data-zone boundary but processes asynchronous batch workloads. That conflicts with the case requirement for responses to be available during the user interaction.

Sources: S005

### Exact explanation changes

Before (D): Data Zone Batch respects the data-zone boundary but is for asynchronous batch workloads, which the case explicitly excludes for interactive responses.

After (D): Data Zone Batch respects the data-zone boundary but processes asynchronous batch workloads. That conflicts with the case requirement for responses to be available during the user interaction.

## Q2 - ai103-pilot001-q02

Current item revision: 3; SHA-256: 1f5d996723959cc80e2d463a773ab3ad29d32a7b587878e5a3e1acab72f93586
Previous item revision: 2; SHA-256: 40c4ea6f85bc00579fc708a78f11b1ed270ecd022d0af4cae6356412621e3e63
Prior verdicts (first / pass 3): revise / revise
Current difficulty: medium; previous: medium

### Current key
```json
"D"
```

The captured Search tool guide excludes key-based authentication with private networking. Its detailed keyless setup names the system-assigned identity of the Foundry account containing the project and specifies both Search Service Contributor and Search Index Data Contributor on Search. The case stipulates that account identity as the connection principal, enables RBAC and grants Search Service Contributor; D adds the missing Search Index Data Contributor and changes the connection authentication. The captured sources also use the term 'project managed identity' (S040 line 5 and S011 line 74), while S040 lines 45 and 887 name the account identity. The case stipulation settles the principal for this item; it does not resolve that broader documentation wording conflict. Provisioning permissions on a developer or pipeline do not replace the connection principal's resource access.

- **A:** The captured tool guide does not support key-based authentication with private virtual networking. Keeping the key leaves that unsupported authentication method in place; granting a Search role to the developer does not change the agent connection's authentication.
- **B:** The documented keyless setup uses the containing Foundry account's system-assigned identity. The pipeline is a provisioning identity in this case, not the configured runtime principal.
- **C:** This option does not grant Search Index Data Contributor on the Search service, which the captured keyless setup requires in addition to Search Service Contributor.

Sources: S011, S040

### Exact explanation changes

Before (whyCorrect): The captured Search tool guide requires managed-identity authentication for private networking. Its keyless setup identifies the system-assigned identity of the Foundry account containing the project and requires both Search Service Contributor and Search Index Data Contributor on Search. The case already grants the first role and enables RBAC; D supplies the missing role and changes the connection to the documented identity. Provisioning access for a developer or pipeline does not substitute for the runtime connection's access.

After (whyCorrect): The captured Search tool guide excludes key-based authentication with private networking. Its detailed keyless setup names the system-assigned identity of the Foundry account containing the project and specifies both Search Service Contributor and Search Index Data Contributor on Search. The case stipulates that account identity as the connection principal, enables RBAC and grants Search Service Contributor; D adds the missing Search Index Data Contributor and changes the connection authentication. The captured sources also use the term 'project managed identity' (S040 line 5 and S011 line 74), while S040 lines 45 and 887 name the account identity. The case stipulation settles the principal for this item; it does not resolve that broader documentation wording conflict. Provisioning permissions on a developer or pipeline do not replace the connection principal's resource access.

Before (A): The captured tool guide does not support key-based authentication with private virtual networking. Granting a role to the developer also does not authorize the managed identity used by the connection.

After (A): The captured tool guide does not support key-based authentication with private virtual networking. Keeping the key leaves that unsupported authentication method in place; granting a Search role to the developer does not change the agent connection's authentication.

## Q3 - ai103-pilot001-q03

Current item revision: 2; SHA-256: 31d35d4d2a7e954e8a23d8b9a4cc2e8d77e593b3307bfc6f09fa4a2941dd0745
Previous item revision: 2; SHA-256: 31d35d4d2a7e954e8a23d8b9a4cc2e8d77e593b3307bfc6f09fa4a2941dd0745
Prior verdicts (first / pass 3): accept / accept
Current difficulty: medium; previous: medium

### Current key
```json
{
  "pairs": {
    "required": "[\"order_id\", \"note\"]",
    "additional": "false",
    "format": "text.format"
  }
}
```

The strict schema includes both properties in required. The existing string-or-null type represents an absent note without omitting its key. additionalProperties must be false. For the Responses API, the strict JSON-schema format is configured under text.format; response_format is the Chat Completions location.

- **required:** Choose ["order_id", "note"]. Choosing only ["order_id"] omits note from the required list, and [] makes neither field required. The captured strict-schema subset requires all defined fields; nullable values provide optional semantics.
- **additional:** Choose false. true permits fields outside the declared contract and violates the documented strict-schema requirement. Nullability of note does not permit extra object properties.
- **format:** Choose text.format for Responses. response_format belongs to Chat Completions. JSON mode alone guarantees valid JSON without enforcing this schema.

Sources: S037

## Q4 - ai103-pilot001-q04

Current item revision: 3; SHA-256: 59fbf4231d6237e98bda4d81da8ec4fc2b5650e9c070bccbf7647c64d3de0905
Previous item revision: 2; SHA-256: 7a2910a2963af9a93ca5ed8d22cdec871047aaf94582caf1b03280109896838d
Prior verdicts (first / pass 3): accept / accept
Current difficulty: easy; previous: easy

### Current key
```json
"C"
```

The documented flow returns each function_call_output with the call_id of the function_call it answers. In this trace, get_stock is the function name shared by both invocations; call_red and call_blue identify the separate calls. Returning each result with its originating ID follows that documented pattern and preserves the association before the model continues.

- **A:** The documented pattern copies the originating call_id into each result. Keeping the shared name get_stock in that field does not follow the pattern, even when results are sent in request order.
- **B:** The model requested two distinct calls. Merging their results under the shared function name fails to return outputs associated with the two originating call IDs.
- **D:** The captured function_call_output example uses call_id populated from the originating call. This option removes that field and substitutes a function name under another field, so it does not follow the shown pattern.

Sources: S007

### Exact explanation changes

Before (whyCorrect): A function_call_output must carry the originating function call's call_id. The name identifies the function, while call_red and call_blue distinguish these two invocations. Matching each returned result to its actual call preserves the association before the model continues.

After (whyCorrect): The documented flow returns each function_call_output with the call_id of the function_call it answers. In this trace, get_stock is the function name shared by both invocations; call_red and call_blue identify the separate calls. Returning each result with its originating ID follows that documented pattern and preserves the association before the model continues.

Before (A): Output order does not replace the required call_id association. Both invocations share the same function name, so get_stock is not either originating call identifier.

After (A): The documented pattern copies the originating call_id into each result. Keeping the shared name get_stock in that field does not follow the pattern, even when results are sent in request order.

Before (D): The captured function_call_output example requires the call_id field populated from the originating call. This option removes that field and substitutes a function name, so it does not follow the shown contract.

After (D): The captured function_call_output example uses call_id populated from the originating call. This option removes that field and substitutes a function name under another field, so it does not follow the shown pattern.

## Q5 - ai103-pilot001-q05

Current item revision: 2; SHA-256: 2612907e04fc9fdc1d9a90e89c0e765f8b68f2719945c85b38617c13b00f9981
Previous item revision: 2; SHA-256: 2612907e04fc9fdc1d9a90e89c0e765f8b68f2719945c85b38617c13b00f9981
Prior verdicts (first / pass 3): accept / accept
Current difficulty: medium; previous: medium

### Current key
```json
"A"
```

Task Completion evaluates whether the agent produced a usable deliverable meeting all user requirements. Successful carrier calls and compliance with the system policy do not establish that the requested two-carrier comparison was delivered.

- **B:** Tool Call Success measures technical success or errors in tool execution. Both calls succeeded here, so that measure does not directly capture the omitted final deliverable.
- **C:** Task Adherence measures compliance with assigned rules, procedures and policy constraints. The stated system policy was followed; the described failure is incomplete task delivery.
- **D:** Groundedness checks fidelity to supplied context. The single quote could be fully grounded while the response still omits the second quote and comparison table.

Sources: S014, S039

## Q6 - ai103-pilot001-q06

Current item revision: 2; SHA-256: e7c9fa6faea465dd927be2389e616d5b227e7ccd94510bb2e92e12f36443b261
Previous item revision: 2; SHA-256: e7c9fa6faea465dd927be2389e616d5b227e7ccd94510bb2e92e12f36443b261
Prior verdicts (first / pass 3): revise / revise
Current difficulty: easy; previous: easy

### Current key
```json
"B"
```

The remix returns a new video operation with its own ID and queued status. The application must track that operation through completion and retrieve its generated content. The original completed video is the remix input, not the newly edited output.

- **A:** The result identifies a new video and separately records remixed_from_video_id. Downloading the original ID retrieves the source video, not the requested edit.
- **C:** A successful creation response acknowledges the operation. queued is not a completed state, and the JSON record is status metadata rather than finished video content.
- **D:** Queued work is part of the documented asynchronous lifecycle. Submitting a new generation request does not complete or retrieve this remix and can create unnecessary work.

Sources: S018

### Presentation correction

Canonical item unchanged. The original exporter wrapped nested triple-backtick content in another triple-backtick fence. Rendered Q6 options and the Q7 heading became code. The new exporter uses a longer enclosing fence. Actual rendered check: ten question headings, all four Q6 choices outside the exhibit, Q7 rendered as a heading. Confirm the fix in file 01.

## Q7 - ai103-pilot001-q07

Current item revision: 3; SHA-256: c849ef09bcc65ea034217ea00de12015357a643fcd8cdf6a11e7b945fecb19f0
Previous item revision: 2; SHA-256: c97da0405ba27044292bef1c51b198cc626e416df579925a5360f922ed9e55b0
Prior verdicts (first / pass 3): revise / accept
Current difficulty: medium; previous: hard

### Current key
```json
[
  "A",
  "E"
]
```

Group P reports the concurrent session quota layer; the guide recommends stopping sessions that do not need active compute, deleting state only when no longer needed, or requesting a limit increase. Group R reports regional session capacity; exponential backoff with jitter is compatible with the prohibition on moving regions. The returned codes identify limits distinct from model tokens-per-minute. Backoff is an initial response to the intermittent regional error; if it persists, the guide directs an Azure support request. It is not a guarantee of regional capacity becoming available.

- **B:** Deleting all stored sessions violates the explicit requirement to retain required persisted state. The documented choices distinguish stopping unneeded active compute from deleting sessions whose state is no longer needed.
- **C:** The errors identify session and regional capacity limits, not the model token quota. Increasing tokens-per-minute alone does not address those reported layers.
- **D:** Another region is a documented option in some circumstances, but the scenario explicitly forbids moving either workload outside the approved region.

Sources: S009

### Exact explanation changes

Before (whyCorrect): Group P reports the concurrent session quota layer; the guide recommends stopping sessions that do not need active compute, deleting state only when no longer needed, or requesting a limit increase. Group R reports regional session capacity; bounded backoff with jitter is compatible with the prohibition on moving regions. The returned codes identify limits distinct from model tokens-per-minute. Backoff is an initial response to the intermittent regional error; if it persists, the guide directs an Azure support request. It is not a guarantee of regional capacity becoming available.

After (whyCorrect): Group P reports the concurrent session quota layer; the guide recommends stopping sessions that do not need active compute, deleting state only when no longer needed, or requesting a limit increase. Group R reports regional session capacity; exponential backoff with jitter is compatible with the prohibition on moving regions. The returned codes identify limits distinct from model tokens-per-minute. Backoff is an initial response to the intermittent regional error; if it persists, the guide directs an Azure support request. It is not a guarantee of regional capacity becoming available.

## Q8 - ai103-pilot001-q08

Current item revision: 2; SHA-256: 3594149034eb4fe2a91754d781ad248cc0c9bbf11757da1642fcc379e2e2d28c
Previous item revision: 2; SHA-256: 3594149034eb4fe2a91754d781ad248cc0c9bbf11757da1642fcc379e2e2d28c
Prior verdicts (first / pass 3): accept / accept
Current difficulty: medium; previous: medium

### Current key
```json
[
  "B",
  "E"
]
```

The documented image moderation contract supports FourSeverityLevels: 0 Safe, 2 Low, 4 Medium and 6 High. Analyzing all four categories and rejecting any result at 4 or 6 implements the stated rule. HTTP success indicates successful analysis; the app still applies its acceptance policy.

- **A:** Successful analysis is not itself a content-approval decision. The result supplies category severities, and acceptance depends on the configured policy.
- **C:** The captured image API supports FourSeverityLevels, not the proposed eight-level output. The proposed threshold also fails to follow the stated Medium-or-High rule for the documented values.
- **D:** Hate, SelfHarm, Sexual and Violence are separate categories. Requesting only Violence omits signals that the policy explicitly requires.

Sources: S042

## Q9 - ai103-pilot001-q09

Current item revision: 2; SHA-256: 2451ff9a3933330be814baf1438629fc2e85b71a29b9e48c7bffb3a016bc69ef
Previous item revision: 2; SHA-256: 2451ff9a3933330be814baf1438629fc2e85b71a29b9e48c7bffb3a016bc69ef
Prior verdicts (first / pass 3): accept / accept
Current difficulty: easy; previous: easy

### Current key
```json
{
  "order": [
    "C",
    "A",
    "D",
    "B"
  ]
}
```

The recognizer depends on the configuration, recognition/translation depends on the recognizer, and text synthesis depends on the successful translation result. The source recognition locale it-IT and translation target de have distinct roles. A German voice alone does not translate Italian input.

- **A:** This follows C because TranslationRecognizer consumes the configured translation and audio objects. It must precede the recognition call in D.
- **B:** This comes last because the German text is obtained from the successful translation result. Synthesizing before that result is available would not use the requested translated text.
- **C:** This comes first because the source locale, target language and input must be defined before the recognizer is constructed.
- **D:** This follows recognizer construction and precedes extraction/synthesis. The result reason confirms successful speech translation before its translations dictionary is used.

Sources: S046

## Q10 - ai103-pilot001-q10

Current item revision: 2; SHA-256: c59dd6128fabe5d321941654c470f313e21645f923c4698f903c2044b60a8034
Previous item revision: 2; SHA-256: c59dd6128fabe5d321941654c470f313e21645f923c4698f903c2044b60a8034
Prior verdicts (first / pass 3): accept / accept
Current difficulty: medium; previous: medium

### Current key
```json
{
  "pairs": {
    "A": "fieldMappings",
    "B": "outputFieldMappings",
    "C": "Document Layout skill",
    "D": "OCR skill"
  }
}
```

fieldMappings maps source fields; outputFieldMappings maps enriched document nodes into index fields. The Document Layout skill uses Document Intelligence layout analysis to produce structured Markdown or text. The OCR skill reads normalized image inputs and emits extracted text. A query-time vectorizer serves query embedding, not these ingestion or field-routing tasks.

- **A:** Use fieldMappings because the value is an unchanged source field. outputFieldMappings is for a node produced in the enrichment tree, which this row does not require.
- **B:** Use outputFieldMappings because OCR has already produced an enriched node. Re-running OCR or changing a source-field mapping does not perform the required enriched-node-to-index routing.
- **C:** Use Document Layout skill because the requirement is structural analysis and Markdown/text output. OCR focuses on character extraction from images and does not replace the stated layout-analysis contract.
- **D:** Use OCR skill because normalized images must be converted into text. The source and output mappings route data but do not themselves recognize characters.

Sources: S028, S029, S043, S026

## Scope and deferred design notes

Accepted cueing/distractor observations are retained as later item-bank improvements. This is a small foundational pilot. Do not infer hard-question coverage, complete objective coverage, official exam parity or measured learner difficulty. Frozen sources are the authority for this exercise; no Azure execution or live currency check is claimed. Q6 concerns queued completion (not a cancelled-state lifecycle); Q8 uses the captured category severities; Q10 asks about OCR on normalized image inputs.

