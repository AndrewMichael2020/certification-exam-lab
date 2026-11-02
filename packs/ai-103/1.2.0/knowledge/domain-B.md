# B — Generative applications and agents

Official range: 30–35%. Local practice weight: 33%, a planning choice. Sixteen mapped bullets; B2.03 and B3.02 are partial.

## Recognize the generation before reading the call

The captured SDK table separates new Foundry Python 2.x from classic 1.x. AIProjectClient uses a project endpoint and Entra credentials; the project exposes an OpenAI client for Responses/conversation operations. Direct Azure OpenAI v1, Anthropic and individual Tools have different endpoint families. Inspect package, client, endpoint, model deployment and authentication together. [F002A, F003A–B]

A model deployment name in a request is not proof that every modality/tool is supported. Verify the selected request contract before copying a tutorial. The code-reading file contains documented fragments; none were executed against Azure.

## RAG and tool execution

RAG retrieves relevant evidence, passes it into generation and retains references. Match query/index embeddings; combine exact terms and vectors when both matter. Evaluate retrieval separately from the final response. Groundedness measures fidelity to supplied context; relevance measures whether the response addresses the query. Grounded but incomplete output remains incomplete. [F025A–B, F026A, F039A–B]

A function schema tells the model what it may request. The application performs the function and returns an output correlated with call_id. Validate arguments and constrain permissions before execution. An agent with a correctly named tool can still choose it incorrectly, pass wrong values or ignore its result. [F007A–C, F014A]

| Evidence of a failure | What to inspect |
| --- | --- |
| Useful document absent | Ingestion/index/retrieval |
| Correct tool chosen, wrong account argument | Tool input accuracy and application validation |
| Successful tool response ignored | Tool output utilization |
| Safe-looking answer omits the user's deliverable | Task completion |
| Answer conflicts with assigned policy | Task adherence and actual enforcement |

Use scoped persistent memory for stable preferences and conversation state for active turns. Keep current policy evidence in retrieval. The documented Search tool needs a connection and index name; direct native Content Understanding tool behavior is not established across generations. B2.03 therefore permits only documented Search/function concepts and flags a CU wrapper as a composed design. [F006A–C, F040A–B]

## Orchestration and oversight

Sequential orchestration fits fixed dependencies. Dynamic group/handoff control fits specialist routing. Human-in-loop steps wait for approval or missing input. The December 1 retirement affects the visual designer and in-portal execution; YAML workflows can migrate to hosted agents, and Agent Framework is the recommended new-code path. These packets support pattern selection and approval semantics, not unverified current Framework Python methods. [F008A–B]

Bound iteration, validate side effects, and use traces to inspect the actual sequence. OpenTelemetry spans show operation timing; correlated evaluations show whether behavior fulfilled the task. Minimize sensitive information in telemetry. [F007C, F013A–B, F014A–B]

## Output controls and reasoning

For extraction, strict structured outputs enforce a supported schema; JSON mode alone does not. Chat Completions uses response_format, Responses uses text.format. Reasoning summaries are not a universal raw internal thought interface. The generic prompt-engineering guide explicitly excludes its techniques from reasoning-model recommendations. [F037A–C, F038A, F047A]

B3.02 remains partial: a bounded review-and-revise loop can be designed, but self-critique is not independent truth and the outline's chain-of-thought-evaluation wording lacks one captured implementation contract. Learn observable quality checks and current summaries; do not infer exam removal from changing product terminology.



See improvement-notes.md for the 1.2.0 implementation additions and coverage.json for objective reassessments.
