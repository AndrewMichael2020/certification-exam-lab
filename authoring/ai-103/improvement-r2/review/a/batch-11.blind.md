# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q073

A support agent needs a remembered user preference, current corporate policy and a receipt uploaded for this interaction. Which TWO assignments are appropriate? Select TWO answers.

- **A.** Use memory as the maintained full-text corporate policy repository.
- **B.** Use the knowledge base for policy and file search for the receipt.
- **C.** Use conversation state as the cross-session preference store.
- **D.** Use the temporary receipt as the source of the company's standing policy.
- **E.** Use persistent memory for interaction-derived preferences.

## Q2 — ai103-improvement-r2-set-a-100-q074

A proxy calls a memory-enabled prompt agent for two users using one managed identity. Which TWO requirements implement separate preferences? Select TWO answers.

- **A.** Use a single static scope for every resident.
- **B.** Put user display names only in the prompt.
- **C.** Use the memory tool’s {{$userId}} scope.
- **D.** Rely on new conversation IDs as memory partitions.
- **E.** Send a verified user key through x-memory-user-id.

## Q3 — ai103-improvement-r2-set-a-100-q075

A support agent needs a domain boundary and a measurable fallback for missing evidence. Which TWO activities address those requirements? Select TWO answers.

- **A.** State the domain and fallback in system instructions.
- **B.** Assume one successful example establishes compliance.
- **C.** Evaluate representative and adversarial queries against that behavior.
- **D.** Remove the fallback to reduce prompt length.
- **E.** Treat a low temperature as complete policy enforcement.

## Q4 — ai103-improvement-r2-set-a-100-q076

A specialist agent proposes an action that a deterministic host rule must approve. Which TWO responsibilities should the design keep explicit? Select TWO answers.

- **A.** The host’s rule/authorization gate before action execution.
- **B.** The orchestration’s handoff and completion conditions.
- **C.** The model’s acknowledgement treated as business approval.
- **D.** A trace display label treated as an executable rule.
- **E.** Tool registration treated as universal caller permission.

## Q5 — ai103-improvement-r2-set-a-100-q077

A Python OpenAI 2.x application extracts events with Responses structured output. The client is configured and the supported model is deployed. On the successful non-refusal path, arrange these operations; business validation needs the parsed field values.

- **A.** Read the successful response.output_parsed object.
- **B.** Define the Pydantic event model.
- **C.** Call responses.parse with the event model as text_format.
- **D.** Validate the parsed date and participants against application rules.

## Q6 — ai103-improvement-r2-set-a-100-q078

A Language NER pipeline must send organization and location records to a JSON-consuming application. The host constructs the records from returned entity categories and verifies the resulting JSON against the consumer’s schema. Arrange the data dependencies.

- **A.** Construct JSON records from the returned organization and location entities.
- **B.** Read the source text into the extraction worker.
- **C.** Run named entity recognition on that text.
- **D.** Validate the constructed JSON against the consumer schema before sending it.

## Q7 — ai103-improvement-r2-set-a-100-q079

A transcript may be held temporarily in a restricted worker. The searchable store may receive only a version redacted using the entities returned by PII detection. The worker has no existing detection result. Arrange the data dependencies.

- **A.** Read the transcript into the restricted worker.
- **B.** Build the redacted representation using the returned detected entities.
- **C.** Write that redacted representation to the searchable store.
- **D.** Analyze that text with PII detection.

## Q8 — ai103-improvement-r2-set-a-100-q080

A mixed-language notice must be translated into French. Its language spans are known, and quality review compares the complete reconstructed notice with the original, including references across segments. Arrange this application workflow.

- **A.** Translate each prepared segment to French with its source language specified.
- **B.** Reconstruct the notice from the successful segment translations.
- **C.** Review the complete translated notice against the original before delivery.
- **D.** Prepare single-language segments with their intended source-language labels.

## Q9 — ai103-improvement-r2-set-a-100-q081

A compliance extractor may forward a result for approval only after its cited fields are verified against the supplied policy. Its model, client and policy are ready, but its domain instructions and strict output schema have not been defined. Arrange these operations.

- **A.** Define the domain boundary, missing-evidence fallback and supported field schema.
- **B.** Check the successful extracted fields and citations against the supplied policy.
- **C.** Forward the verified result to the authorized approval queue.
- **D.** Request extraction using those instructions, schema and policy text.

