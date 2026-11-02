# AI-103 pilot 001 — author key and explanations

**Phase 2 only.** Record a blind answer to every question before reading this file. Compare with your own answer; do not treat agreement as evidence. Source mappings are the author's claims to audit.

Package ID: `ai103-pilot-001-r1`; revision `1`; canonical package SHA-256: `0ceafb2d5784ffa424193a00ff62ffb47731c6f902e9c766010db3fe582b358b`.

Author provenance: `gpt-6-astra`, visible effort `ultra`, route `codex-subscription`. Status: `draft`; no independent review acceptance is recorded. Item metadata `validated` means mechanical checks only.

Difficulty is provisional and uncalibrated. Explicitly assess whether Q2/Q3 warrant very_hard and whether Q6 warrants hard; suggest stronger discriminating decisions where needed. Exact 4/4/2 counts are authoring-plan quotas, not proof of real difficulty.

## Q1 — ai103-pilot001-q01

Item revision: `1`; canonical item SHA-256: `88268cdf183f7d13476c0c67e2fce969096c1b65d2a410e009627dba60133d10`.
Batch: `batch-1`; domain: `A`; provisional difficulty: `medium`.

### Author answer

```json
"B"
```

### Explanation

Data Zone Standard processes requests within the selected data zone and uses pay-per-token billing. It matches the approved EU boundary and an interactive workload without a reserved-throughput commitment.

### Option / step / slot notes

- **A:** Global Standard uses global processing. Selecting an EU resource location does not convert the global processing boundary into the required EU data-zone boundary.
- **C:** Data Zone Provisioned respects the data-zone boundary but uses reserved provisioned throughput units, contrary to the stated billing requirement.
- **D:** Data Zone Batch respects the data-zone boundary but is for asynchronous batch workloads, which the case explicitly excludes for interactive responses.

### Claimed objective and evidence alignment

- `AI103-A2.02` — Choose appropriate deployment options (ready)
- Frozen claim IDs: F005A, F005B
- Source IDs: S005
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q2 — ai103-pilot001-q02

Item revision: `1`; canonical item SHA-256: `a137efa41e0e79e90094adcb6c97acab1c1b27ec8f125c355b2cd3313cf20ece`.
Batch: `batch-1`; domain: `A`; provisional difficulty: `very_hard`.

### Author answer

```json
"D"
```

### Explanation

The captured Search tool guide requires managed-identity authentication for private networking. Its keyless setup identifies the system-assigned identity of the Foundry account containing the project and requires both Search Service Contributor and Search Index Data Contributor on Search. The case already grants the first role and enables RBAC; D supplies the missing role and changes the connection to the documented identity. Provisioning access for a developer or pipeline does not substitute for the runtime connection's access.

### Option / step / slot notes

- **A:** The captured tool guide does not support key-based authentication with private virtual networking. Granting a role to the developer also does not authorize the managed identity used by the connection.
- **B:** The documented keyless setup uses the containing Foundry account's system-assigned identity. The pipeline is a provisioning identity in this case, not the configured runtime principal.
- **C:** Foundry User is a project role; it does not supply the missing Search Index Data Contributor role on the Search service.

### Claimed objective and evidence alignment

- `AI103-A3.04` — Configure security, including managed identity, private networking, keyless credentials, and role policies (ready)
- Frozen claim IDs: F011A, F040B
- Source IDs: S011, S040
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q3 — ai103-pilot001-q03

Item revision: `1`; canonical item SHA-256: `624c26da0a23c47516773028503499c0527a4adc46925943cef2470786d6ffcf`.
Batch: `batch-2`; domain: `B`; provisional difficulty: `very_hard`.

### Author answer

```json
{
  "pairs": {
    "required": "[\"order_id\", \"note\"]",
    "additional": "false",
    "format": "text.format"
  }
}
```

### Explanation

The strict schema includes both properties in required. The existing string-or-null type represents an absent note without omitting its key. additionalProperties must be false. For the Responses API, the strict JSON-schema format is configured under text.format; response_format is the Chat Completions location.

### Option / step / slot notes

- **required:** Choose ["order_id", "note"]. Choosing only ["order_id"] omits note from the required list, and [] makes neither field required. The captured strict-schema subset requires all defined fields; nullable values provide optional semantics.
- **additional:** Choose false. true permits fields outside the declared contract and violates the documented strict-schema requirement. Nullability of note does not permit extra object properties.
- **format:** Choose text.format for Responses. response_format belongs to Chat Completions. JSON mode alone guarantees valid JSON without enforcing this schema.

### Claimed objective and evidence alignment

- `AI103-B3.01` — Tune generation behavior, such as prompt engineering and adjusting model parameters (ready)
- Frozen claim IDs: F037A, F037B
- Source IDs: S037
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q4 — ai103-pilot001-q04

Item revision: `1`; canonical item SHA-256: `b8087677071536fd7beb195cb7656004d5e5947477864dd6a2dc3dd657e5bbb9`.
Batch: `batch-2`; domain: `B`; provisional difficulty: `hard`.

### Author answer

```json
"C"
```

### Explanation

A function_call_output must carry the originating function call's call_id. The name identifies the function, while call_red and call_blue distinguish these two invocations. Matching each returned result to its actual call preserves the association before the model continues.

### Option / step / slot notes

- **A:** Output order does not replace the required call_id association. Both invocations share the same function name, so get_stock is not either originating call identifier.
- **B:** The model requested two distinct calls. Merging their results under the shared function name fails to return outputs associated with the two originating call IDs.
- **D:** The captured Responses example uses function_call_output with call_id. Substituting a differently named field from another API pattern does not satisfy that contract.

### Claimed objective and evidence alignment

- `AI103-B1.03` — Design workflows, tool-augmented flows, and multistep reasoning pipelines (ready)
- `AI103-B2.02` — Build agents that integrate retrieval, function-calling, and conversation memory (ready)
- Frozen claim IDs: F007A, F007B
- Source IDs: S007
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q5 — ai103-pilot001-q05

Item revision: `1`; canonical item SHA-256: `6ff7672fc7463cc6b0118e17ba49669360e83543aaabe87a27967b05caf9f8e5`.
Batch: `batch-2`; domain: `B`; provisional difficulty: `medium`.

### Author answer

```json
"A"
```

### Explanation

Task Completion evaluates whether the agent produced a usable deliverable meeting all user requirements. Successful carrier calls and compliance with the system policy do not establish that the requested two-carrier comparison was delivered.

### Option / step / slot notes

- **B:** Tool Call Success measures technical success or errors in tool execution. Both calls succeeded here, so that measure does not directly capture the omitted final deliverable.
- **C:** Task Adherence measures compliance with assigned rules, procedures and policy constraints. The stated system policy was followed; the described failure is incomplete task delivery.
- **D:** Groundedness checks fidelity to supplied context. The single quote could be fully grounded while the response still omits the second quote and comparison table.

### Claimed objective and evidence alignment

- `AI103-B2.06` — Integrate monitoring into deployed agents, evaluate agent behavior, and perform error analysis (ready)
- Frozen claim IDs: F014A, F014B, F039A
- Source IDs: S014, S039
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q6 — ai103-pilot001-q06

Item revision: `1`; canonical item SHA-256: `4658dd9a64cd01897a1b0184bde266770491dfe762fb11c934778d0a7ab0497e`.
Batch: `batch-3`; domain: `C`; provisional difficulty: `hard`.

### Author answer

```json
"B"
```

### Explanation

The remix returns a new video operation with its own ID and queued status. The application must track that operation through completion and retrieve its generated content. The original completed video is the remix input, not the newly edited output.

### Option / step / slot notes

- **A:** The result identifies a new video and separately records remixed_from_video_id. Downloading the original ID retrieves the source video, not the requested edit.
- **C:** A successful creation response acknowledges the operation. queued is not a completed state, and the JSON record is status metadata rather than finished video content.
- **D:** Queued work is part of the documented asynchronous lifecycle. Submitting a new generation request does not complete or retrieve this remix and can create unnecessary work.

### Claimed objective and evidence alignment

- `AI103-C1.04` — Implement workflows to edit generated videos (ready)
- Frozen claim IDs: F018A, F018B
- Source IDs: S018
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q7 — ai103-pilot001-q07

Item revision: `1`; canonical item SHA-256: `185a0440ceac077610e2ad81ead5b8db6acef3933c27f96806f7a1f326c27ceb`.
Batch: `batch-4`; domain: `A`; provisional difficulty: `hard`.

### Author answer

```json
[
  "A",
  "E"
]
```

### Explanation

Group P reports the concurrent session quota layer; the guide recommends stopping sessions that do not need active compute, deleting state only when no longer needed, or requesting a limit increase. Group R reports regional session capacity; bounded backoff with jitter is compatible with the prohibition on moving regions. The returned codes identify limits distinct from model tokens-per-minute.

### Option / step / slot notes

- **B:** Deleting all stored sessions violates the explicit requirement to retain required persisted state. The documented choices distinguish stopping unneeded active compute from deleting sessions whose state is no longer needed.
- **C:** The errors identify session and regional capacity limits, not the model token quota. Increasing tokens-per-minute alone does not address those reported layers.
- **D:** Another region is a documented option in some circumstances, but the scenario explicitly forbids moving either workload outside the approved region.

### Claimed objective and evidence alignment

- `AI103-A3.01` — Manage quotas, scaling, rate limits, and cost footprints for model and agent workloads (ready)
- Frozen claim IDs: F009A, F009B
- Source IDs: S009
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q8 — ai103-pilot001-q08

Item revision: `1`; canonical item SHA-256: `e2c17a6009fcc757ef690691025bab1f9e67dcb76e0124b67c688125bd1a5bc2`.
Batch: `batch-5`; domain: `C`; provisional difficulty: `medium`.

### Author answer

```json
[
  "B",
  "E"
]
```

### Explanation

The documented image moderation contract supports FourSeverityLevels: 0 Safe, 2 Low, 4 Medium and 6 High. Analyzing all four categories and rejecting any result at 4 or 6 implements the stated rule. HTTP success indicates successful analysis; the app still applies its acceptance policy.

### Option / step / slot notes

- **A:** Successful analysis is not itself a content-approval decision. The result supplies category severities, and acceptance depends on the configured policy.
- **C:** The captured image API supports FourSeverityLevels, not the proposed eight-level output. The proposed threshold also fails to follow the stated Medium-or-High rule for the documented values.
- **D:** Hate, SelfHarm, Sexual and Violence are separate categories. Requesting only Violence omits signals that the policy explicitly requires.

### Claimed objective and evidence alignment

- `AI103-C3.01` — Implement filters to classify unsafe or disallowed visual content (ready)
- Frozen claim IDs: F042A
- Source IDs: S042
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q9 — ai103-pilot001-q09

Item revision: `1`; canonical item SHA-256: `8e3336da727d7bd44d3c5b413a95a9ee7e39f7b05933ff7e446e4f2e9da932a2`.
Batch: `batch-6`; domain: `D`; provisional difficulty: `medium`.

### Author answer

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

### Explanation

The recognizer depends on the configuration, recognition/translation depends on the recognizer, and text synthesis depends on the successful translation result. The source recognition locale it-IT and translation target de have distinct roles. A German voice alone does not translate Italian input.

### Option / step / slot notes

- **A:** This follows C because TranslationRecognizer consumes the configured translation and audio objects. It must precede the recognition call in D.
- **B:** This comes last because the German text is obtained from the successful translation result. Synthesizing before that result is available would not use the requested translated text.
- **C:** This comes first because the source locale, target language and input must be defined before the recognizer is constructed.
- **D:** This follows recognizer construction and precedes extraction/synthesis. The result reason confirms successful speech translation before its translations dictionary is used.

### Claimed objective and evidence alignment

- `AI103-D2.04` — Translate speech into other languages by using language models and Foundry Tools (ready)
- Frozen claim IDs: F046A
- Source IDs: S046
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Q10 — ai103-pilot001-q10

Item revision: `1`; canonical item SHA-256: `607c29550929f6fe7972a3cb30dc263c7d08bb624df9fa6a2033c65e5216f549`.
Batch: `batch-7`; domain: `E`; provisional difficulty: `hard`.

### Author answer

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

### Explanation

fieldMappings maps source fields; outputFieldMappings maps enriched document nodes into index fields. The Document Layout skill uses Document Intelligence layout analysis to produce structured Markdown or text. The OCR skill reads normalized image inputs and emits extracted text. A query-time vectorizer serves query embedding, not these ingestion or field-routing tasks.

### Option / step / slot notes

- **A:** Use fieldMappings because the value is an unchanged source field. outputFieldMappings is for a node produced in the enrichment tree, which this row does not require.
- **B:** Use outputFieldMappings because OCR has already produced an enriched node. Re-running OCR or changing a source-field mapping does not perform the required enriched-node-to-index routing.
- **C:** Use Document Layout skill because the requirement is structural analysis and Markdown/text output. OCR focuses on character extraction from images and does not replace the stated layout-analysis contract.
- **D:** Use OCR skill because normalized images must be converted into text. The source and output mappings route data but do not themselves recognize characters.

### Claimed objective and evidence alignment

- `AI103-E1.03` — Implement enrichment by using custom or built-in skills for text, images, and layout (ready)
- Frozen claim IDs: F028A, F029A, F043A, F026A
- Source IDs: S028, S029, S043, S026
- Audit the exact excerpts in file 02, including the pilot’s supplemental locators; a frozen claim ID alone is not sufficient proof.

## Hash semantics

Hashes use SHA-256 of compact canonical JSON: object keys sorted recursively, arrays in existing order. A standalone item hashes the complete question. Each case child hashes `{question, caseStudy}` including the complete shared case. Metadata, option order and explanations are included. A change to the shared case invalidates both child reviews. Package hash covers the complete draft, including its empty reviews array. Hashes do not authenticate the reviewer.

