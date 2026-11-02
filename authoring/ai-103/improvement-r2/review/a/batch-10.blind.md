# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q063

A product catalog needs exact codes and semantic candidates, with optional semantic reranking. Which TWO statements describe the stages correctly? Select TWO answers.

- **A.** Hybrid retrieval combines keyword and vector ranked lists.
- **B.** Semantic ranking renames source fields during ingestion.
- **C.** Semantic reranking generates the indexed vectors.
- **D.** A query vectorizer uses a compatible embedding configuration.
- **E.** Keyword sorting makes vectorization unnecessary for the vector path.

## Q2 — ai103-improvement-r2-set-a-100-q064

A document enrichment pipeline needs layout-aware Markdown and OCR for normalized images. Which TWO skill choices directly target these outputs? Select TWO answers.

- **A.** The OCR skill receiving normalized images.
- **B.** The Document Intelligence Layout skill.
- **C.** A semantic query configuration.
- **D.** An output field alias without a producing skill.
- **E.** An Azure OpenAI chat output-token setting.

## Q3 — ai103-improvement-r2-set-a-100-q065

An agent retrieves an unrelated Search index and returns content from another department. Which TWO tool configuration controls address the stated defects? Select TWO answers.

- **A.** A resource name containing the department.
- **B.** A supported filter using the authorized department.
- **C.** A larger unfiltered candidate set.
- **D.** The correct connected index name.
- **E.** A longer model answer.

## Q4 — ai103-improvement-r2-set-a-100-q066

A document pipeline must extract invoice fields and support amount verification. Which TWO design choices address those requirements? Select TWO answers.

- **A.** Retain source locations for reviewer inspection.
- **B.** Treat high confidence as permission to pay.
- **C.** Replace field types with filename parsing.
- **D.** Define the required field schema.
- **E.** Discard coordinates after assigning confidence.

## Q5 — ai103-improvement-r2-set-a-100-q067

A RAG pipeline needs a clean document representation before retrieval. Which TWO Content Understanding outputs or behaviors fit? Select TWO answers.

- **A.** A completed analysis result consumed after successful polling.
- **B.** Markdown representing document structure.
- **C.** A generated final answer used as the source document.
- **D.** A queued operation treated as extracted text.
- **E.** A raw poller serialized into the vector field.

## Q6 — ai103-improvement-r2-set-a-100-q068

A custom contract analyzer misses renewal dates in a new layout. Which TWO inputs should guide improvement? Select TWO answers.

- **A.** A typed renewal-date field definition.
- **B.** A high threshold reported as proof of correctness.
- **C.** Renaming every unrelated date as renewal_date.
- **D.** Tune the query semantic configuration without changing the extraction field definition.
- **E.** Representative examples with verified values.

## Q7 — ai103-improvement-r2-set-a-100-q069

An agent proposes a refund. The application requires user confirmation, and the model supplies untrusted arguments. Which TWO host responsibilities are needed before the side effect? Select TWO answers.

- **A.** Obtain confirmation for the specific proposed refund.
- **B.** Return the payment credential to the model for approval checking.
- **C.** Execute the refund before displaying its confirmation dialog.
- **D.** Validate the arguments and authorize the target account.
- **E.** Treat valid JSON as sufficient permission to issue the refund.

## Q8 — ai103-improvement-r2-set-a-100-q070

A strict Responses output must contain code and comment. Comment may be null, and additional fields are prohibited. Which TWO schema decisions satisfy those constraints? Select TWO answers.

- **A.** Allow arbitrary extra fields and validate just the required names.
- **B.** Keep comment required and allow its type to include null.
- **C.** Represent absent comment as an omitted property with no nullable type.
- **D.** Set additionalProperties to false on the object schema.
- **E.** Omit comment from required when its value is unavailable.

## Q9 — ai103-improvement-r2-set-a-100-q071

A RAG system must find exact equipment identifiers and semantic paraphrases. It uses a vector index built with model X. Which TWO design choices fit? Select TWO answers.

- **A.** Use an unrelated model with matching dimensions as proof of vector compatibility.
- **B.** Sort hybrid candidates by filename after RRF to preserve relevance.
- **C.** Replace embeddings with semantic reranking during ingestion.
- **D.** Use query embeddings compatible with the indexed model X vectors.
- **E.** Combine keyword and vector retrieval through hybrid search.

## Q10 — ai103-improvement-r2-set-a-100-q072

An agent receives hostile user prompts and malicious instructions inside retrieved text. Which TWO controls align with those different entry points? Select TWO answers.

- **A.** Treat retrieved-document instructions as lower-trust indirect attacks.
- **B.** Approve retrieved instructions because the source URL uses HTTPS.
- **C.** Scan final answers as proof that proposed tool calls were safe before execution.
- **D.** Treat tool output as a new developer message when it names a system role.
- **E.** Assess direct user attacks at the input boundary.

