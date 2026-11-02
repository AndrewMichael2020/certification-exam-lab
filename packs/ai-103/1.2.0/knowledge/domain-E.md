# E — Extraction and grounding

Official range: 10–15%. Local practice weight: 13%, a planning choice. Eight bullets have bounded documented support.

## Ingestion is a pipeline

Multimodal files need useful representations before reliable retrieval. Content Understanding's document/image/audio/video search analyzers provide different outputs; preserve document/page or segment/time context as you chunk/index the results. Search does not automatically interpret arbitrary raw media simply because a file has been uploaded. [F021B–D, F026A]

Integrated vectorization adds indexing-time chunking/embedding and query-time vectorization. The query embedding model must match the indexed content's embedding model. Retry policies cannot rescue indefinitely exhausted model quota. Keyword, vector, hybrid and semantic ranking remain different stages. [F025A–B, F026A–B]

For exact codes plus paraphrased concepts, combine keyword and vector evidence with RRF. Semantic reranking can refine retrieved candidates; it is not the embedding operation. Apply appropriate filters and preserve metadata needed for citations.

## Skills, layout and searchable fields

A skillset works on an enriched document tree. Skill context determines where and how often a skill executes. Source fieldMappings and enriched outputFieldMappings serve different purposes. A correct enrichment result can disappear from retrieval when the mapping is wrong. [F028A]

OCR depends on normalized images from the indexer's imageAction configuration. It emits text/layout text, which must be mapped or merged into the index. The Document Layout skill uses Document Intelligence to produce Markdown/text and can preserve images/location metadata. Use meaningful section chunks so a warning is not separated from the instruction it qualifies. [F029A, F043A]

| Symptom | First useful inspection |
| --- | --- |
| Scanned-page text missing | Normalized-image/OCR input and output mappings |
| New files absent | Indexer history, item errors/warnings |
| Wrong relevant passage | Chunking/query/hybrid/semantic configuration |
| Accurate extraction cannot be cited | Dropped page/span/source metadata |
| Agent knows stale facts | Ingestion freshness and retrieval corpus |

## Extraction plus provenance

Content Understanding's GA Python SDK 1.1.0 uses API 2025-11-01. Begin analysis, poll the long-running operation, then read fields/content/markdown. Keep preview-only properties and retired analyzer definitions out of that GA recipe. [F021A, F021C, F024A]

A schema defines the target information; OCR/layout provides its document structure. Field confidence can route uncertain values for review. Source estimation/grounding links values to page/coordinates/spans; retaining those links lets a downstream agent cite evidence. Confidence is not a universal accuracy guarantee and a grounded value can still require review. [F045A–B]

Connect the completed index to the agent/workflow through a documented Search tool or function. The Search tool requires a project connection and index; private networking requires the documented project managed identity. Adding a retrieval tool does not ingest missing files or grant downstream permissions. [F040A–B]

The strongest study judgment is to trace a wrong answer backward: output, evidence context, retrieved chunk, index field, enrichment, original source. Fix the stage whose evidence fails before changing the model.



See improvement-notes.md for the 1.2.0 implementation additions and coverage.json for objective reassessments.
