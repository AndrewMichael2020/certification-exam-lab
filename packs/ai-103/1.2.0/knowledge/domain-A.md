# A — Plan and manage an Azure AI solution

Official range: 25–30%. Local practice weight: 28%, a planning choice. Sixteen mapped bullets; two are partial. Start with the service/deployment/security decisions below; use individual objective notes when a distinction is unclear.

## Choose the service before the model name

A model generates or interprets content. Azure AI Search retrieves indexed evidence. Content Understanding converts documents/images/audio/video into useful representations. An agent orchestrates tools and interactions. Long-term memory holds durable interaction-derived context; it is distinct from an organizational knowledge corpus. The memory guide explicitly recommends curated knowledge bases for organizational grounding and file search for user uploads. [F003B, F006A–C, F021B, F026A]

| Need | Useful choice | Failure to avoid |
| --- | --- | --- |
| Exact product IDs plus conceptual symptom search | Keyword + vector hybrid retrieval | Pure similarity loses important identifiers |
| Personal language preference across sessions | Scoped long-term memory, preview | Unsafely sharing memory across users |
| Current organization policy | Curated retrieval with source references | Treating an old conversation as policy authority |
| Structured facts from a scanned file | Document extraction/layout/analyzer | Assuming raw indexed files already expose the fields |

Exact model winners for small/code/multimodal tasks require additional task-specific evidence and evaluation. A1.01 remains partial; avoid memorizing a universal “best model.”

## Deployment decisions are independent axes

Choose capacity/billing and processing boundary explicitly. Standard is token-billed, provisioned reserves capacity, and batch is asynchronous. Global, data-zone and Azure-geography deployment types constrain processing differently. They are not interchangeable answers to a residency requirement. Current preview managed compute uses Foundry accelerator quota separate from Azure VM quota; classic managed-compute recipes use a different resource generation. [F004A–B, F005A–B]

Basic agents use Microsoft-managed state; standard setup uses customer-managed subscription resources. Private networking needs dependency connectivity and DNS, not just one private endpoint. The current AI Projects Python client is Entra-only; Foundry RBAC applies with Entra credentials, whereas keys bypass those role restrictions. A private Search-agent connection requires the documented project managed identity. [F002A, F009C, F010A, F011A, F040B]

## Operating evidence

Separate rate limits, active-session quotas and model throughput. Inspect the error code, bound retries with jitter, and release unused sessions. Persistently exhausted quota needs a capacity/concurrency decision. Search monitoring includes indexer run errors/warnings as well as latency/throttling/storage alerts. Service health and answer quality are different measurements. [F009A–B, F027A, F044A]

Use traces for model/tool timing and evaluator results for grounding, relevance and task behavior. A3.02 supports these observations but remains partial for a turnkey drift-detector recipe. For CI/CD, the documented hosted-agent template uses OIDC and deploys/invokes existing infrastructure; that response check is not a factual-quality gate. [F012A, F013A–B, F039A–B]

Guardrails have input, tool-call, tool-return and output boundaries, with agent controls in preview. Validate arguments and enforce authorization in code. Preserve source locations and approval events while minimizing sensitive telemetry. S015's “most/least restrictive” adjectives conflict with its flagging ranges: use explicit severity levels plus the configured action. [F007C, F015A + S015 conflict log, F016A]

Read [A objective notes](objectives/AI103-A1.01.md), [code interpretation](code-reading.md), and [conflict log](../evidence/version-conflicts.md) for the corresponding bounded scope.



See improvement-notes.md for the 1.2.0 implementation additions and coverage.json for objective reassessments.
