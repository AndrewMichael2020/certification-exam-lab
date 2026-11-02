# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: North support memory and response contracts

Applies to Q1 and Q2 and Q3 and Q4. Each child is independent.

North runs a support assistant for individual subscribers. A web backend authenticates users locally and calls a Foundry prompt agent on their behalf. Subscribers can retain preferences across sessions, ask about current support policies and receive structured summaries. The team is testing the distinction between stored conversation history, persistent memory and curated knowledge.

### Caller and end user

All response calls authenticate to Foundry with one backend managed identity. The memory search tool is attached to the agent and uses scope {{$userId}}. In the current implementation the backend sends no x-memory-user-id header. The application has a verified tenant identifier and subscriber identifier in its authenticated session. Those identifiers can be combined into a stable application-owned memory key. The host must derive that key from the authenticated session rather than accept an arbitrary customer identifier from a prompt.

### Memory operations

The service also runs an administrative job that calls the low-level memory search API directly. The job uses the same backend identity. It supplies a subscriber identifier in the query text but omits the explicit scope parameter. The job must search the intended subscriber partition. Current support policy is maintained in a knowledge store, while language and unit preferences may be distilled from conversations. Changing a conversation title does not change either memory’s partition or the lifecycle of the organizational knowledge.

### Structured application result

The client sends requests through Responses, not Chat Completions. A summary object has ticket_id and note properties; note accepts a string or null. Both keys must be present, and unknown properties must be rejected by the supported strict schema. The model supports that schema. A missing note is represented by null. The application handles refusal outcomes separately from successful objects. A developer has copied a response_format field from a Chat Completions example into the Responses request builder.

### Behavior and monitoring

A system instruction limits the assistant to subscriber support and gives an explicit clarification path when evidence is missing. Product staff propose replacing that instruction with a low temperature. A workflow specialist and a retrieval specialist may also be composed, with the host retaining control of routing and result validation. Trace spans record latency and safe user-correlation identifiers; access tokens and full personal messages are redacted before export. These controls must be considered at their own boundaries. Every child observation is independent and requires the fixed case facts rather than an inferred result from a previous child.

### Diagnostic exhibit

Backend exhibit: {"caller":"shared backend principal","memoryToolScope":"{{$userId}}","memoryUserHeader":null,"directSearchScope":null}. The Responses request builder also copied the Chat Completions response_format field; these are distinct defects against the stated per-subscriber and output contracts.

## Q1 — ai103-improvement-r2-set-a-100-q013

Use shared case case-4 above.

North uses one backend principal and {{$userId}} with no header. Which implementation separates authenticated subscribers?

- **A.** Place the subscriber key only in a natural-language prompt.
- **B.** Send the authenticated subscriber key in x-memory-user-id.
- **C.** Create a new conversation title for each subscriber.
- **D.** Retain the backend identity as the shared user partition.

## Q2 — ai103-improvement-r2-set-a-100-q014

Use shared case case-4 above.

North’s administrative job searches low-level memory with the subscriber named only in query text. What must change?

- **A.** Rely on {{$userId}} being inferred from the query text.
- **B.** Supply the authorized subscriber scope on the direct API call.
- **C.** Use the subscriber’s display name as the conversation title.
- **D.** Attach the query to a longer conversation.

## Q3 — ai103-improvement-r2-set-a-100-q015

Use shared case case-4 above.

North’s Responses builder copied response_format from Chat Completions. Where should its structured-result format be configured?

- **A.** Chat Completions response_format left unchanged on Responses.
- **B.** The returned function_call_output record.
- **C.** The conversation title.
- **D.** Responses text.format.

## Q4 — ai103-improvement-r2-set-a-100-q016

Use shared case case-4 above.

North wants a domain boundary and clarification when evidence is missing. Which design addresses behavior and enforcement?

- **A.** Use tone examples as the complete access control.
- **B.** Ask the model to authorize its own booking actions.
- **C.** Define role/fallback, evaluate behavior and enforce host permissions.
- **D.** Lower temperature and remove the system instruction.

