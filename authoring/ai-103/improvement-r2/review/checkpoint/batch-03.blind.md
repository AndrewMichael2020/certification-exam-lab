# AI-103 pilot — blind questions

Package: ai103-improvement-r2-checkpoint-20; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-checkpoint-20-q004

Complete the Azure OpenAI v1 client for keyless inference. The calling identity has the inference role at the resource scope.

```text
token_provider = get_bearer_token_provider(credential, "{{audience}}")
client = OpenAI(base_url="{{endpoint}}", api_key=token_provider)
```

- Choices for **audience**: https://ai.azure.com/.default | https://management.azure.com/.default | https://search.azure.com/.default
- Choices for **endpoint**: https://resource.openai.azure.com/openai/v1/ | https://resource.services.ai.azure.com/api/projects/support | https://resource.search.windows.net/

## Q2 — ai103-improvement-r2-checkpoint-20-q005

Complete the AI Projects Python 2.8.0 constructor for project operations.

```text
project = AIProjectClient(endpoint={{endpoint}}, credential={{credential}})
```

- Choices for **endpoint**: project_endpoint | openai_v1_base_url | search_endpoint
- Choices for **credential**: DefaultAzureCredential() | AzureKeyCredential(resource_key) | project_endpoint

## Q3 — ai103-improvement-r2-checkpoint-20-q006

A catalog requires exact part-code matches and semantic symptom matches. Which design combines both retrieval signals before optional reranking?

- **A.** Vector retrieval alone, with a larger candidate count.
- **B.** Semantic reranking of keyword-only candidates.
- **C.** Keyword and vector retrieval with fused rankings.
- **D.** Keyword retrieval alone, with boosted identifier fields.

## Q4 — ai103-improvement-r2-checkpoint-20-q007

A secured agent has the required runtime roles. Search resolves to a public IP from the agent network even though public access is disabled. The private endpoint exists. What should be investigated next?

- **A.** The Search role assignments on the identity used by the deployment pipeline.
- **B.** The query-time semantic ranking configuration on the target index.
- **C.** The private endpoint connection approval state for the runtime subnet.
- **D.** Private DNS resolution and links for the agent network.

## Q5 — ai103-improvement-r2-checkpoint-20-q008

Complete the current Python client calls for an existing agent named helpdesk and its project OpenAI client.

```text
agent = project.agents.{{operation}}(agent_name="helpdesk")
client = project.{{client}}()
```

- Choices for **operation**: get | get_agent | create_version
- Choices for **client**: get_openai_client | get_search_client | get_agent_client

## Q6 — ai103-improvement-r2-checkpoint-20-q009

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

## Q7 — ai103-improvement-r2-checkpoint-20-q010

A Responses turn must consult at least one attached tool. Complete the request-level control.

```text
response = client.responses.create(model=deployment, input=message, tools=tools, tool_choice="{{mode}}")
```

- Choices for **mode**: auto | required | none

## Q8 — ai103-improvement-r2-checkpoint-20-q011

Complete a supported strict Responses schema: note must be present and can be null; unknown properties are rejected.

```text
schema = {"type": "object", "properties": {"note": {"type": ["string", "null"]}},
          "required": {{required}}, "additionalProperties": {{extra}}}
# response text.{{location}} contains the json_schema format
```

- Choices for **required**: ["note"] | [] | ["string", "null"]
- Choices for **extra**: False | True
- Choices for **location**: format | response_format | metadata

