# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Harbor maintenance knowledge

Applies to Q1 and Q2 and Q3 and Q4. Each child is independent.

Harbor maintains manuals for several equipment departments. Its new assistant must answer policy and catalog questions with current evidence and distinguish factual support from useful but unrelated prose. Search, embedding and generation are separately observable components. Each child question uses the same architecture and an independent observation.

### Corpus and index

The Search index stores chunk text, a filterable department field, a catalog identifier and one vector field. Maintenance staff often search by exact identifiers such as HX-104 as well as by descriptions of symptoms. The current corpus was embedded with deployment harbor-embed-x. A proposed query deployment harbor-embed-y has the same vector dimensions but uses an unrelated model. The index is not automatically regenerated when a developer changes a query-time setting. The source documents and their department labels are authoritative.

### Access and retrieval

The application authenticates each employee and derives an allowed department from its own authorization service. Department boundaries apply before evidence is returned to the model. A generated instruction asking the model to ignore unauthorized passages is not the access filter. The team can configure keyword retrieval, vector retrieval and hybrid retrieval. An optional semantic reranker operates on retrieved candidates; it does not create content embeddings or rename index fields. Query vectors must be compatible with the content vectors being searched.

### Evaluation evidence

A held-out test includes queries, relevance judgments for candidate documents, retrieved passages and generated answers. One passage says the repair warranty lasts twelve months. An answer says twenty-four months while staying on the user’s topic. Another answer quotes the twelve-month passage correctly but responds to a shipping-time question. The team wants separate measurements for retrieval quality, contextual support and response relevance rather than one total score. A successful query response establishes transport success, not answer correctness.

### Operations

Indexer logs record document-level errors and warnings. An overall successful run still requires checking whether required documents entered the index. An embedding model change needs a planned reindexing path and evaluation before rollout. Engineers retain safe request identifiers to correlate Search requests with agent traces. They do not put service credentials in model-visible tool errors. A reviewer should combine the named corpus, access and evaluation facts to choose each answer; previous child answers are not prerequisites and do not alter the configuration in this case.

### Diagnostic exhibit

Evaluation exhibit: {"contentEmbedding":"harbor-embed-x","queryEmbedding":"harbor-embed-y","dimensionsMatch":true,"passageWarrantyMonths":12,"answerWarrantyMonths":24}. The authorized department is derived from the employee session, not either deployment name.

## Q1 — ai103-improvement-r2-set-a-100-q005

Use shared case case-2 above.

Harbor must serve HX-104 identifiers and descriptions of symptoms. Which retrieval approach combines those signals?

- **A.** Semantic reranking without initial retrieval.
- **B.** Hybrid keyword and vector retrieval with ranked-list fusion.
- **C.** Vector search followed by alphabetical identifier sorting.
- **D.** Keyword retrieval followed by increasing generation temperature.

## Q2 — ai103-improvement-r2-set-a-100-q006

Use shared case case-2 above.

Harbor tests harbor-embed-y for queries while content remains from harbor-embed-x. Equal dimensions did not preserve relevance. Which correction targets the mismatch?

- **A.** Normalize vector magnitudes and retain both current embedding models.
- **B.** Enable semantic ranking and leave embedding compatibility unresolved.
- **C.** Use a validated compatible embedding configuration for content and queries.
- **D.** Increase vector candidate count and retain the unrelated query model.

## Q3 — ai103-improvement-r2-set-a-100-q007

Use shared case case-2 above.

Harbor answers twenty-four months from a passage saying twelve. It stays on topic. Which evaluation isolates this defect?

- **A.** Groundedness
- **B.** Tool selection
- **C.** Query latency
- **D.** Relevance

## Q4 — ai103-improvement-r2-set-a-100-q008

Use shared case case-2 above.

Harbor’s employee is authorized for one department. Which control enforces that boundary before passages reach the model?

- **A.** Remove other departments from citations after the answer is generated.
- **B.** Use the employee’s department in a system instruction after retrieval.
- **C.** Rerank the unfiltered results and retain only the highest-scoring passage.
- **D.** Apply the authenticated employee’s department as a retrieval filter.

