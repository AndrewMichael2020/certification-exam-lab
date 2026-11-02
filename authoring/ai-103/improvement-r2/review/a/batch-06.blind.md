# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q026

An indexer reports Success, but several known source documents are absent from Search. Where should the investigation start?

- **A.** The successful run label and aggregate index document count.
- **B.** The semantic ranker configuration used by the question-answering application.
- **C.** The run's document-level errors and warnings.
- **D.** The service's query-latency dashboard for searches made after the run.

## Q2 — ai103-improvement-r2-set-a-100-q027

Complete the current Python client calls for an existing agent named helpdesk and its project OpenAI client.

```text
agent = project.agents.{{operation}}(agent_name="helpdesk")
client = project.{{client}}()
```

- Choices for **operation**: get | get_agent | create_version
- Choices for **client**: get_openai_client | get_search_client | get_agent_client

## Q3 — ai103-improvement-r2-set-a-100-q028

Complete a backend memory-search tool definition and response header for per-user preferences. user_key is derived from the authenticated session.

```text
from azure.ai.projects.models import MemorySearchPreviewTool, PromptAgentDefinition
tool = MemorySearchPreviewTool(memory_store_name="preferences", scope="{{scope}}")
agent = project.agents.create_version(agent_name="support",
    definition=PromptAgentDefinition(model=deployment, tools=[tool]))
response = client.responses.create(input=message,
    extra_body={"agent_reference": {"name": agent.name, "type": "agent_reference"}},
    extra_headers={"{{header}}": user_key})
```

- Choices for **scope**: {{$userId}} | backend-shared | conversation-title
- Choices for **header**: x-memory-user-id | x-request-id | Authorization

## Q4 — ai103-improvement-r2-set-a-100-q029

A Responses turn must consult at least one attached tool. Complete the request-level control.

```text
response = client.responses.create(model=deployment, input=message, tools=tools, tool_choice="{{mode}}")
```

- Choices for **mode**: auto | required | none

## Q5 — ai103-improvement-r2-set-a-100-q030

Complete a supported strict Responses schema: note must be present and can be null; unknown properties are rejected.

```text
schema = {"type": "object", "properties": {"note": {"type": ["string", "null"]}},
          "required": {{required}}, "additionalProperties": {{extra}}}
# response text.{{location}} contains the json_schema format
```

- Choices for **required**: ["note"] | [] | ["string", "null"]
- Choices for **extra**: False | True
- Choices for **location**: format | response_format | metadata

## Q6 — ai103-improvement-r2-set-a-100-q031

A supported reasoning model returns a reasoning summary through Responses. A product manager wants to label it 'the model's complete internal reasoning'. Which description is accurate?

- **A.** A policy-adherence score produced by an agent evaluator.
- **B.** An API-provided reasoning summary.
- **C.** A raw transcript containing each internal reasoning step.
- **D.** A deterministic execution log for the model's hidden operations.

## Q7 — ai103-improvement-r2-set-a-100-q032

A support assistant should stay within product support and ask for clarification when evidence is insufficient. Which prompt control expresses both?

- **A.** A system-defined domain and missing-evidence fallback.
- **B.** More tone examples without defining scope.
- **C.** A low temperature with no role instructions.
- **D.** A larger retrieval top-k value alone.

## Q8 — ai103-improvement-r2-set-a-100-q033

A deterministic workflow sends a request to a retrieval specialist and then a policy specialist. What must its orchestration represent?

- **A.** One larger model context replacing all flow rules.
- **B.** Separate trace IDs with no shared request context.
- **C.** Explicit specialist handoff and completion conditions.
- **D.** Tool descriptions treated as executable routing code.

## Q9 — ai103-improvement-r2-set-a-100-q034

An agent calls the translation tool for a request that requires stock availability. The translation call is valid and succeeds. Which evaluation pinpoints the mistake?

- **A.** Tool Call Success.
- **B.** Tool Output Utilization.
- **C.** Tool Selection.
- **D.** Tool Input Accuracy.

