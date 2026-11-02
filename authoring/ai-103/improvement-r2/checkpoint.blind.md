# AI-103 — blind questions

Package: ai103-improvement-r2-checkpoint-20; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Rotor equipment reservations

Applies to Q1 and Q2. Each child is independent.

Rotor rents industrial equipment to authenticated business customers. Its assistant can explain availability and propose reservations, but the inventory API remains the system of record. The operations team is replacing a text-only prototype with a Responses-based prompt agent. Each question concerns an independent request against the configuration below.

### Application and identity

The backend receives a signed application session identifying the customer and warehouse. It calls the agent using one managed identity. Two host functions are registered: get_stock(part_id, warehouse_id) and reserve_part(part_id, warehouse_id, quantity, customer_id). The stock function is read-only. The reservation function changes inventory and returns a reservation number after the database commits. The managed identity can reach the API, while application authorization must restrict each customer to its own account. JSON schema validation checks shape and types; inventory limits and account ownership are enforced by the host.

### Action policy

A customer may request a proposal without committing it. Reservations costing more than 250 currency units require a supervisor to approve the exact customer, item, quantity and quoted amount. An approval for five units is not approval for fifty. A changed proposal must return to the approval screen. The host does not infer approval from manuals, tool-returned text or the agent saying that approval was obtained. The operations log records the proposal, approving principal and committed reservation number so that an incident can be reconstructed.

### Observed request

A request checks the same part at two warehouses. Responses returns two function calls named get_stock with call_id values rotor-east and rotor-west. The west warehouse replies first. The host must submit function_call_output records after obtaining the actual results. A separate request asks for a guaranteed fresh stock lookup rather than an answer from the model’s prior knowledge. Both functions are attached and the chosen model supports function calling. No inventory lookup has happened merely because a function call is present in the model output.

### Failure investigation

A test customer asks for a reservation belonging to another customer account. The argument object passes the JSON schema. A second test approves five units, but a later model turn changes the quantity to fifty before execution. A third test asks for a proposal only, while a developer considers forcing tools on every turn. Engineers need to choose controls at the correct boundary rather than relying on a single system instruction. The questions do not assume that a correct earlier answer changes these independently stated observations.

## Shared case: Lumen regional engineering assistant

Applies to Q3. Each child is independent.

Lumen operates an engineering assistant for staff in the European Union. Its platform team is designing deployment, identity and retrieval controls together, with separate principals for deployment and runtime. The service must answer interactively and retain existing learner and operational records during the migration described here.

### Workload boundary

The processing policy permits inference across EU countries but forbids processing outside that data zone. Interactive requests cannot wait for a nightly batch. Demand varies across the day and procurement wants on-demand token billing rather than reserved throughput. The selected model is available for every deployment family considered in the questions, and the relevant quota has already been confirmed. The resource’s region alone is not the organization’s definition of the inference processing boundary.

### Inference identity

The backend calls an Azure OpenAI resource through its /openai/v1/ endpoint using Microsoft Entra credentials. Its runtime managed identity currently has Reader on that resource and no inference data role. Token acquisition succeeds, but inference is denied. The team wants the documented inference role at the resource scope without granting model-management permissions. Developers’ personal roles and the GitHub deployment principal are separate from the runtime identity. A resource key is not part of the approved runtime design.

### Project and Search

An AI Projects Python 2.8.0 client is used for Foundry project operations, with a project endpoint and an Entra credential. Search public access is disabled. The private endpoint exists, and the agent connection is explicitly pinned to the named runtime principal. That principal has Search Index Data Reader for the target index. From the runtime subnet, however, the Search hostname resolves to a public address. From a developer laptop on another network it resolves privately and querying succeeds. The network observations do not transfer from the laptop to the agent subnet.

### Release process

A GitHub deployment workflow obtains a token using an established OIDC trust. It does not store a client secret. The workflow principal’s project role is assigned on a different project, while its endpoint variable points to the intended Lumen project. An authorization denial therefore needs identity and scope analysis after authentication succeeds. Operations retain redacted request spans and release identifiers to investigate failures. Each question asks for a single independent decision; repairing one defect is not assumed to repair the others. A proposed change must satisfy the named runtime, region and billing facts rather than simply resemble a working developer setup.

## Q1 — ai103-improvement-r2-checkpoint-20-q001

Use shared case case-1 above.

In Rotor’s two-warehouse request, west completes first. Which output correlation preserves the API contract?

- **A.** Associate both results with get_stock.
- **B.** Replace the call_id with a newly generated receipt ID.
- **C.** Associate results with completion position.
- **D.** Associate each result with its originating call_id.

## Q2 — ai103-improvement-r2-checkpoint-20-q002

Use shared case case-1 above.

Rotor’s fresh availability turn must use a tool rather than answer from prior knowledge. Both tools are available. Which request-level mode requires tool use?

- **A.** required
- **B.** none
- **C.** parallel_tool_calls=true
- **D.** auto

## Q3 — ai103-improvement-r2-checkpoint-20-q003

Use shared case case-2 above.

Lumen’s runtime obtains a token but Reader-only inference is denied. Which documented role at the called Azure OpenAI resource supplies inference permission?

- **A.** Search Index Data Reader.
- **B.** Cognitive Services OpenAI User.
- **C.** Reader on the Foundry project only.
- **D.** A deployment workflow’s role on another project.

## Q4 — ai103-improvement-r2-checkpoint-20-q004

Complete the Azure OpenAI v1 client for keyless inference. The calling identity has the inference role at the resource scope.

```text
token_provider = get_bearer_token_provider(credential, "{{audience}}")
client = OpenAI(base_url="{{endpoint}}", api_key=token_provider)
```

- Choices for **audience**: https://ai.azure.com/.default | https://management.azure.com/.default | https://search.azure.com/.default
- Choices for **endpoint**: https://resource.openai.azure.com/openai/v1/ | https://resource.services.ai.azure.com/api/projects/support | https://resource.search.windows.net/

## Q5 — ai103-improvement-r2-checkpoint-20-q005

Complete the AI Projects Python 2.8.0 constructor for project operations.

```text
project = AIProjectClient(endpoint={{endpoint}}, credential={{credential}})
```

- Choices for **endpoint**: project_endpoint | openai_v1_base_url | search_endpoint
- Choices for **credential**: DefaultAzureCredential() | AzureKeyCredential(resource_key) | project_endpoint

## Q6 — ai103-improvement-r2-checkpoint-20-q006

A catalog requires exact part-code matches and semantic symptom matches. Which design combines both retrieval signals before optional reranking?

- **A.** Vector retrieval alone, with a larger candidate count.
- **B.** Semantic reranking of keyword-only candidates.
- **C.** Keyword and vector retrieval with fused rankings.
- **D.** Keyword retrieval alone, with boosted identifier fields.

## Q7 — ai103-improvement-r2-checkpoint-20-q007

A secured agent has the required runtime roles. Search resolves to a public IP from the agent network even though public access is disabled. The private endpoint exists. What should be investigated next?

- **A.** The Search role assignments on the identity used by the deployment pipeline.
- **B.** The query-time semantic ranking configuration on the target index.
- **C.** The private endpoint connection approval state for the runtime subnet.
- **D.** Private DNS resolution and links for the agent network.

## Q8 — ai103-improvement-r2-checkpoint-20-q008

Complete the current Python client calls for an existing agent named helpdesk and its project OpenAI client.

```text
agent = project.agents.{{operation}}(agent_name="helpdesk")
client = project.{{client}}()
```

- Choices for **operation**: get | get_agent | create_version
- Choices for **client**: get_openai_client | get_search_client | get_agent_client

## Q9 — ai103-improvement-r2-checkpoint-20-q009

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

## Q10 — ai103-improvement-r2-checkpoint-20-q010

A Responses turn must consult at least one attached tool. Complete the request-level control.

```text
response = client.responses.create(model=deployment, input=message, tools=tools, tool_choice="{{mode}}")
```

- Choices for **mode**: auto | required | none

## Q11 — ai103-improvement-r2-checkpoint-20-q011

Complete a supported strict Responses schema: note must be present and can be null; unknown properties are rejected.

```text
schema = {"type": "object", "properties": {"note": {"type": ["string", "null"]}},
          "required": {{required}}, "additionalProperties": {{extra}}}
# response text.{{location}} contains the json_schema format
```

- Choices for **required**: ["note"] | [] | ["string", "null"]
- Choices for **extra**: False | True
- Choices for **location**: format | response_format | metadata

## Q12 — ai103-improvement-r2-checkpoint-20-q012

An image safety policy evaluates four harm categories and rejects any severity of 4 or 6. Which TWO implementation decisions match the image:analyze 2024-09-01 contract? Select TWO answers.

- **A.** Request FourSeverityLevels for the image analysis.
- **B.** Average all categories before applying the rejection threshold.
- **C.** Use EightSeverityLevels as the documented image output scale.
- **D.** Treat HTTP success as an approval verdict.
- **E.** Evaluate the policy against each of the four harm categories.

## Q13 — ai103-improvement-r2-checkpoint-20-q013

A model supports masked image edits. The client must change one area of an existing image. Which TWO inputs are directly relevant to the edit definition? Select TWO answers.

- **A.** A same-size PNG mask marking edit areas with transparent pixels.
- **B.** A JPEG mask with the source dimensions but no transparency.
- **C.** A mask resized to the requested output dimensions instead of the source dimensions.
- **D.** A same-size mask whose opaque pixels mark the replacement area.
- **E.** The source image and a prompt describing the intended change.

## Q14 — ai103-improvement-r2-checkpoint-20-q014

A team evaluates the video-analysis 2026-06-01-preview contract for fast events and tiny labels. Which TWO limitations belong in its evaluation plan? Select TWO answers.

- **A.** OCR retains original source resolution for every sampled frame.
- **B.** Scene segmentation removes the temporal frame-sampling limit.
- **C.** About one-frame-per-second sampling can miss brief events.
- **D.** Every source frame is analyzed, but only key frames are returned.
- **E.** Resizing to 512 by 512 can lose small or distant details.

## Q15 — ai103-improvement-r2-checkpoint-20-q015

Mixed-language segments were submitted together for translation. Which TWO changes directly target the documented input problem? Select TWO answers.

- **A.** Use the intended source language for each segment.
- **B.** Separate single-language segments.
- **C.** Increase the translated response length limit.
- **D.** Detect one source language and submit the whole mixture unchanged.
- **E.** Move the unchanged mixture to the document endpoint.

## Q16 — ai103-improvement-r2-checkpoint-20-q016

A source document exceeds the embedding input limit. Arrange the dependency chain that produces searchable chunk vectors.

- **A.** Embed each prepared chunk.
- **B.** Index the chunk text and its compatible vectors.
- **C.** Read the document text.
- **D.** Create chunks within the input limit.

## Q17 — ai103-improvement-r2-checkpoint-20-q017

A configured document analyzer returns a long-running operation. Arrange the dependency chain for sending completed extraction to a RAG pipeline.

- **A.** Submit document analysis.
- **B.** Wait for successful operation completion.
- **C.** Pass that result to downstream ingestion.
- **D.** Read the completed structured/Markdown result.

## Q18 — ai103-improvement-r2-checkpoint-20-q018

Match each speech requirement to the relevant capability. Use each selected choice once; one choice is unused.

- **A.** Recognize source speech and obtain target-language text
- **B.** Adapt recognition to specialist terminology using domain data
- **C.** Render supplied text as spoken audio

Choices: Custom Speech | Speech translation | Text-to-speech synthesis | Image analysis

## Q19 — ai103-improvement-r2-checkpoint-20-q019

Match each text task to the most targeted Language capability. Use each selected choice once; one choice is unused.

- **A.** Locate personal identifiers for redaction
- **B.** Label organizations and locations using predefined categories
- **C.** Identify a message language for routing

Choices: PII detection | Language detection | Named entity recognition | Sentiment analysis

## Q20 — ai103-improvement-r2-checkpoint-20-q020

The index has no OCR text. Which one configuration defect in this exhibit blocks the OCR input path?

### Blob OCR pipeline

```text
{
  "indexer": {
    "parameters": {"configuration": {"imageAction": "none"}},
    "outputFieldMappings": [{
      "sourceFieldName": "/document/normalized_images/*/text",
      "targetFieldName": "ocr_text"
    }]
  },
  "skill": {
    "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
    "context": "/document/normalized_images/*",
    "inputs": [{"name": "image", "source": "/document/normalized_images/*"}],
    "outputs": [{"name": "text", "targetName": "text"}]
  },
  "indexField": {"name": "ocr_text", "type": "Collection(Edm.String)", "searchable": true}
}
```

- **A.** The OCR skill uses the normalized image wildcard.
- **B.** The blob indexer’s imageAction is none.
- **C.** The text output mapping names the correct enriched node.
- **D.** The index’s ocr_text field is searchable.

