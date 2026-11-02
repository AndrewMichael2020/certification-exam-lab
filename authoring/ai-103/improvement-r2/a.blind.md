# AI-103 — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Rotor equipment reservations

Applies to Q1 and Q2 and Q3 and Q4. Each child is independent.

Rotor rents industrial equipment to authenticated business customers. Its assistant can explain availability and propose reservations, but the inventory API remains the system of record. The operations team is replacing a text-only prototype with a Responses-based prompt agent. Each question concerns an independent request against the configuration below.

### Application and identity

The backend receives a signed application session identifying the customer and warehouse. It calls the agent using one managed identity. Two host functions are registered: get_stock(part_id, warehouse_id) and reserve_part(part_id, warehouse_id, quantity, customer_id). The stock function is read-only. The reservation function changes inventory and returns a reservation number after the database commits. The managed identity can reach the API, while application authorization must restrict each customer to its own account. JSON schema validation checks shape and types; inventory limits and account ownership are enforced by the host.

### Action policy

A customer may request a proposal without committing it. Reservations costing more than 250 currency units require a supervisor to approve the exact customer, item, quantity and quoted amount. An approval for five units is not approval for fifty. A changed proposal must return to the approval screen. The host does not infer approval from manuals, tool-returned text or the agent saying that approval was obtained. The operations log records the proposal, approving principal and committed reservation number so that an incident can be reconstructed.

### Observed request

A request checks the same part at two warehouses. Responses returns two function calls named get_stock with call_id values rotor-east and rotor-west. The west warehouse replies first. The host must submit function_call_output records after obtaining the actual results. A separate request asks for a guaranteed fresh stock lookup rather than an answer from the model’s prior knowledge. Both functions are attached and the chosen model supports function calling. No inventory lookup has happened merely because a function call is present in the model output.

### Failure investigation

A test customer asks for a reservation belonging to another customer account. The argument object passes the JSON schema. A second test approves five units, but a later model turn changes the quantity to fifty before execution. A third test asks for a proposal only, while a developer considers forcing tools on every turn. Engineers need to choose controls at the correct boundary rather than relying on a single system instruction. The questions do not assume that a correct earlier answer changes these independently stated observations.

### Diagnostic exhibit

Request exhibit: {"calls":[{"name":"get_stock","call_id":"rotor-east"},{"name":"get_stock","call_id":"rotor-west"}],"completionOrder":["rotor-west","rotor-east"]}. The reservation tests are separate requests, not effects of this lookup.

## Shared case: Harbor maintenance knowledge

Applies to Q5 and Q6 and Q7 and Q8. Each child is independent.

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

## Shared case: Lumen regional engineering assistant

Applies to Q9 and Q10 and Q11 and Q12. Each child is independent.

Lumen operates an engineering assistant for staff in the European Union. Its platform team is designing deployment, identity and retrieval controls together, with separate principals for deployment and runtime. The service must answer interactively and retain existing learner and operational records during the migration described here.

### Workload boundary

The processing policy permits inference across EU countries but forbids processing outside that data zone. Interactive requests cannot wait for a nightly batch. Demand varies across the day and procurement wants on-demand token billing rather than reserved throughput. The selected model is available for every deployment family considered in the questions, and the relevant quota has already been confirmed. The resource’s region alone is not the organization’s definition of the inference processing boundary.

### Inference identity

The backend calls an Azure OpenAI resource through its /openai/v1/ endpoint using Microsoft Entra credentials. Its runtime managed identity currently has Reader on that resource and no inference data role. Token acquisition succeeds, but inference is denied. The team wants the documented inference role at the resource scope without granting model-management permissions. Developers’ personal roles and the GitHub deployment principal are separate from the runtime identity. A resource key is not part of the approved runtime design.

### Project and Search

An AI Projects Python 2.8.0 client is used for Foundry project operations, with a project endpoint and an Entra credential. Search public access is disabled. The private endpoint exists, and the agent connection is explicitly pinned to the named runtime principal. That principal has Search Index Data Reader for the target index. From the runtime subnet, however, the Search hostname resolves to a public address. From a developer laptop on another network it resolves privately and querying succeeds. The network observations do not transfer from the laptop to the agent subnet.

### Release process

A GitHub deployment workflow obtains a token using an established OIDC trust. It does not store a client secret. The workflow principal’s project role is assigned on a different project, while its endpoint variable points to the intended Lumen project. An authorization denial therefore needs identity and scope analysis after authentication succeeds. Operations retain redacted request spans and release identifiers to investigate failures. Each question asks for a single independent decision; repairing one defect is not assumed to repair the others. A proposed change must satisfy the named runtime, region and billing facts rather than simply resemble a working developer setup.

### Diagnostic exhibit

Runtime exhibit: {"tokenAcquired":true,"inferenceRole":"Reader","searchRole":"Search Index Data Reader","searchDns":"public address","publicSearchAccess":false}. These observations belong to the runtime identity and subnet; the developer’s successful call uses a different network.

## Shared case: North support memory and response contracts

Applies to Q13 and Q14 and Q15 and Q16. Each child is independent.

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

## Q1 — ai103-improvement-r2-set-a-100-q001

Use shared case case-1 above.

In Rotor’s two-warehouse request, west completes first. Which output correlation preserves the API contract?

- **A.** Replace the call_id with a newly generated receipt ID.
- **B.** Associate results with completion position.
- **C.** Associate each result with its originating call_id.
- **D.** Associate both results with get_stock.

## Q2 — ai103-improvement-r2-set-a-100-q002

Use shared case case-1 above.

Rotor’s fresh availability turn must use a tool rather than answer from prior knowledge. Both tools are available. Which request-level mode requires tool use?

- **A.** none
- **B.** required
- **C.** parallel_tool_calls=true
- **D.** auto

## Q3 — ai103-improvement-r2-set-a-100-q003

Use shared case case-1 above.

In Rotor’s cross-account reservation test, the JSON schema passes. Which check must decide whether the host may execute?

- **A.** Apply the warehouse’s rate limit and accept the supplied customer ID.
- **B.** Validate caller ownership and reservation business constraints.
- **C.** Validate the argument types and permit any schema-valid account.
- **D.** Check that the selected function is registered and has a description.

## Q4 — ai103-improvement-r2-set-a-100-q004

Use shared case case-1 above.

Rotor approved five units, then the proposal changed to fifty. What should the host do?

- **A.** Reapprove the changed argument tuple before execution.
- **B.** Execute fifty units and append the old approval record.
- **C.** Reuse the approval because the function name is unchanged.
- **D.** Accept the agent’s claim that the old approval covers the new quantity.

## Q5 — ai103-improvement-r2-set-a-100-q005

Use shared case case-2 above.

Harbor must serve HX-104 identifiers and descriptions of symptoms. Which retrieval approach combines those signals?

- **A.** Semantic reranking without initial retrieval.
- **B.** Hybrid keyword and vector retrieval with ranked-list fusion.
- **C.** Vector search followed by alphabetical identifier sorting.
- **D.** Keyword retrieval followed by increasing generation temperature.

## Q6 — ai103-improvement-r2-set-a-100-q006

Use shared case case-2 above.

Harbor tests harbor-embed-y for queries while content remains from harbor-embed-x. Equal dimensions did not preserve relevance. Which correction targets the mismatch?

- **A.** Normalize vector magnitudes and retain both current embedding models.
- **B.** Enable semantic ranking and leave embedding compatibility unresolved.
- **C.** Use a validated compatible embedding configuration for content and queries.
- **D.** Increase vector candidate count and retain the unrelated query model.

## Q7 — ai103-improvement-r2-set-a-100-q007

Use shared case case-2 above.

Harbor answers twenty-four months from a passage saying twelve. It stays on topic. Which evaluation isolates this defect?

- **A.** Groundedness
- **B.** Tool selection
- **C.** Query latency
- **D.** Relevance

## Q8 — ai103-improvement-r2-set-a-100-q008

Use shared case case-2 above.

Harbor’s employee is authorized for one department. Which control enforces that boundary before passages reach the model?

- **A.** Remove other departments from citations after the answer is generated.
- **B.** Use the employee’s department in a system instruction after retrieval.
- **C.** Rerank the unfiltered results and retain only the highest-scoring passage.
- **D.** Apply the authenticated employee’s department as a retrieval filter.

## Q9 — ai103-improvement-r2-set-a-100-q009

Use shared case case-3 above.

Which deployment fits Lumen’s interactive EU-processing and on-demand billing requirements?

- **A.** Global Standard in an EU resource.
- **B.** Data Zone Standard in the EU.
- **C.** Data Zone Provisioned.
- **D.** Data Zone Batch.

## Q10 — ai103-improvement-r2-set-a-100-q010

Use shared case case-3 above.

Lumen’s runtime obtains a token but Reader-only inference is denied. Which documented role at the called Azure OpenAI resource supplies inference permission?

- **A.** A deployment workflow’s role on another project.
- **B.** Reader on the Foundry project only.
- **C.** Cognitive Services OpenAI User.
- **D.** Search Index Data Reader.

## Q11 — ai103-improvement-r2-set-a-100-q011

Use shared case case-3 above.

Lumen’s Search role is correct, but the runtime resolves Search publicly. What should be repaired first?

- **A.** The runtime principal’s model-token quota.
- **B.** The semantic configuration on the Search index.
- **C.** The developer laptop’s working Search role.
- **D.** Private DNS resolution and subnet links.

## Q12 — ai103-improvement-r2-set-a-100-q012

Use shared case case-3 above.

Lumen’s OIDC token succeeds but deployment is denied. Which authorization correction targets the case defect?

- **A.** Change the runtime Search role.
- **B.** Use the endpoint string as a credential.
- **C.** Scope the workflow’s deployment role to the intended project.
- **D.** Rotate a long-lived secret into GitHub.

## Q13 — ai103-improvement-r2-set-a-100-q013

Use shared case case-4 above.

North uses one backend principal and {{$userId}} with no header. Which implementation separates authenticated subscribers?

- **A.** Place the subscriber key only in a natural-language prompt.
- **B.** Send the authenticated subscriber key in x-memory-user-id.
- **C.** Create a new conversation title for each subscriber.
- **D.** Retain the backend identity as the shared user partition.

## Q14 — ai103-improvement-r2-set-a-100-q014

Use shared case case-4 above.

North’s administrative job searches low-level memory with the subscriber named only in query text. What must change?

- **A.** Rely on {{$userId}} being inferred from the query text.
- **B.** Supply the authorized subscriber scope on the direct API call.
- **C.** Use the subscriber’s display name as the conversation title.
- **D.** Attach the query to a longer conversation.

## Q15 — ai103-improvement-r2-set-a-100-q015

Use shared case case-4 above.

North’s Responses builder copied response_format from Chat Completions. Where should its structured-result format be configured?

- **A.** Chat Completions response_format left unchanged on Responses.
- **B.** The returned function_call_output record.
- **C.** The conversation title.
- **D.** Responses text.format.

## Q16 — ai103-improvement-r2-set-a-100-q016

Use shared case case-4 above.

North wants a domain boundary and clarification when evidence is missing. Which design addresses behavior and enforcement?

- **A.** Use tone examples as the complete access control.
- **B.** Ask the model to authorize its own booking actions.
- **C.** Define role/fallback, evaluate behavior and enforce host permissions.
- **D.** Lower temperature and remove the system instruction.

## Q17 — ai103-improvement-r2-set-a-100-q017

An interactive assistant may process requests across EU countries but cannot process them outside the EU. Usage varies, and the team wants token-based billing. The model supports all listed types. Which deployment fits?

- **A.** Data Zone Standard, using EU capacity with token-based charges for interactive requests.
- **B.** Global Standard in an EU resource, relying on the resource region to keep inference processing within the EU.
- **C.** Data Zone Batch, submitting requests to the asynchronous batch queue.
- **D.** Data Zone Provisioned, with EU processing and reserved throughput.

## Q18 — ai103-improvement-r2-set-a-100-q018

A service has predictable sustained model traffic and needs allocated throughput. Its processing boundary is already satisfied by the chosen region. Which deployment characteristic should drive the selection?

- **A.** Developer deployment for experimentation with the selected model.
- **B.** Batch processing with deferred completion for groups of requests.
- **C.** Standard token billing with capacity shared across on-demand requests.
- **D.** Provisioned capacity with a throughput commitment.

## Q19 — ai103-improvement-r2-set-a-100-q019

Developers have scoped Foundry RBAC roles, but a shared resource key authenticates the application. A developer can perform an operation that their role excludes. Which change makes the role assignments effective for those calls?

- **A.** Move the application behind a private endpoint while retaining key authentication.
- **B.** Rotate the shared resource key and continue assigning each developer the same key.
- **C.** Store the shared key in a vault and distribute it to authorized developers.
- **D.** Authenticate with Entra identities carrying the intended scoped roles.

## Q20 — ai103-improvement-r2-set-a-100-q020

A secured agent has the required runtime roles. Search resolves to a public IP from the agent network even though public access is disabled. The private endpoint exists. What should be investigated next?

- **A.** Private DNS resolution and links for the agent network.
- **B.** The query-time semantic ranking configuration on the target index.
- **C.** The private endpoint connection approval state for the runtime subnet.
- **D.** The Search role assignments on the identity used by the deployment pipeline.

## Q21 — ai103-improvement-r2-set-a-100-q021

A Foundry managed-compute preview deployment needs more accelerators. Matching GPU VM quota is available in the same region. Which quota should the team request?

- **A.** Request a larger subscription-wide regional vCPU allocation and count that capacity toward the Foundry managed-compute accelerator deployment.
- **B.** An increase to the classic managed-endpoint GPU VM-family quota for that region.
- **C.** Request the regional accelerator-SKU allocation through the Foundry managed-compute quota process.
- **D.** Additional tokens per minute on the serverless language model deployment.

## Q22 — ai103-improvement-r2-set-a-100-q022

A hosted agent returns session_quota_exceeded. Several sessions no longer need active compute, but their stored state is still required. What should the operator do?

- **A.** Stop the inactive sessions that are consuming active capacity.
- **B.** Delete the completed sessions together with their stored conversation state.
- **C.** Increase the model deployment’s reserved inference throughput.
- **D.** Increase the tokens-per-minute allocation for the underlying chat model.

## Q23 — ai103-improvement-r2-set-a-100-q023

A GitHub workflow must deploy a hosted agent with no long-lived Azure credential stored in GitHub. Which identity setup fits the documented deployment pattern?

- **A.** A client-secret credential copied into GitHub and rotated before each release.
- **B.** A project endpoint variable used as the workflow's authentication credential.
- **C.** Federated OIDC authentication with a scoped deployment identity.
- **D.** The runtime agent identity inferred from the agent name in the workflow file.

## Q24 — ai103-improvement-r2-set-a-100-q024

An agent request traverses retrieval, generation and a business tool. Engineers need to attribute a latency increase to one operation and its parent request. Which telemetry structure supports that?

- **A.** Timed service events whose correlation key is the service name shared by all requests.
- **B.** Record a structured event for each request containing final text, total elapsed time and the names of every participating service.
- **C.** Export a correlated request trace with timed nested spans for retrieval, generation and the tool call.
- **D.** Independent traces for each operation, each with a newly generated request identifier.

## Q25 — ai103-improvement-r2-set-a-100-q025

Tool arguments include account numbers and an access token. Engineers need useful traces for incident diagnosis. Which collection policy best fits?

- **A.** Export full content spans to a restricted workspace, then delete secrets in a nightly job.
- **B.** Store raw access tokens in encrypted span attributes accessible to incident responders.
- **C.** Remove the request and evaluation identifiers while preserving raw tool arguments.
- **D.** Redact sensitive fields before export and preserve safe correlation data.

## Q26 — ai103-improvement-r2-set-a-100-q026

An indexer reports Success, but several known source documents are absent from Search. Where should the investigation start?

- **A.** The successful run label and aggregate index document count.
- **B.** The semantic ranker configuration used by the question-answering application.
- **C.** The run's document-level errors and warnings.
- **D.** The service's query-latency dashboard for searches made after the run.

## Q27 — ai103-improvement-r2-set-a-100-q027

Complete the current Python client calls for an existing agent named helpdesk and its project OpenAI client.

```text
agent = project.agents.{{operation}}(agent_name="helpdesk")
client = project.{{client}}()
```

- Choices for **operation**: get | get_agent | create_version
- Choices for **client**: get_openai_client | get_search_client | get_agent_client

## Q28 — ai103-improvement-r2-set-a-100-q028

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

## Q29 — ai103-improvement-r2-set-a-100-q029

A Responses turn must consult at least one attached tool. Complete the request-level control.

```text
response = client.responses.create(model=deployment, input=message, tools=tools, tool_choice="{{mode}}")
```

- Choices for **mode**: auto | required | none

## Q30 — ai103-improvement-r2-set-a-100-q030

Complete a supported strict Responses schema: note must be present and can be null; unknown properties are rejected.

```text
schema = {"type": "object", "properties": {"note": {"type": ["string", "null"]}},
          "required": {{required}}, "additionalProperties": {{extra}}}
# response text.{{location}} contains the json_schema format
```

- Choices for **required**: ["note"] | [] | ["string", "null"]
- Choices for **extra**: False | True
- Choices for **location**: format | response_format | metadata

## Q31 — ai103-improvement-r2-set-a-100-q031

A supported reasoning model returns a reasoning summary through Responses. A product manager wants to label it 'the model's complete internal reasoning'. Which description is accurate?

- **A.** A policy-adherence score produced by an agent evaluator.
- **B.** An API-provided reasoning summary.
- **C.** A raw transcript containing each internal reasoning step.
- **D.** A deterministic execution log for the model's hidden operations.

## Q32 — ai103-improvement-r2-set-a-100-q032

A support assistant should stay within product support and ask for clarification when evidence is insufficient. Which prompt control expresses both?

- **A.** A system-defined domain and missing-evidence fallback.
- **B.** More tone examples without defining scope.
- **C.** A low temperature with no role instructions.
- **D.** A larger retrieval top-k value alone.

## Q33 — ai103-improvement-r2-set-a-100-q033

A deterministic workflow sends a request to a retrieval specialist and then a policy specialist. What must its orchestration represent?

- **A.** One larger model context replacing all flow rules.
- **B.** Separate trace IDs with no shared request context.
- **C.** Explicit specialist handoff and completion conditions.
- **D.** Tool descriptions treated as executable routing code.

## Q34 — ai103-improvement-r2-set-a-100-q034

An agent calls the translation tool for a request that requires stock availability. The translation call is valid and succeeds. Which evaluation pinpoints the mistake?

- **A.** Tool Call Success.
- **B.** Tool Output Utilization.
- **C.** Tool Selection.
- **D.** Tool Input Accuracy.

## Q35 — ai103-improvement-r2-set-a-100-q035

A Search tool points at the right service but retrieves an unrelated index. Which agent-tool configuration should be corrected first?

- **A.** The retrieval filter for the current unrelated index.
- **B.** The tool's maximum result count.
- **C.** The configured index name and project connection.
- **D.** The tool's vector-versus-keyword query mode.

## Q36 — ai103-improvement-r2-set-a-100-q036

A response is fully supported by context and addresses the question, but omits two required parts of the reference answer. Which additional metric is most targeted?

- **A.** Response Completeness (preview).
- **B.** Groundedness repeated against the same supplied context.
- **C.** Response relevance.
- **D.** Response safety screening.

## Q37 — ai103-improvement-r2-set-a-100-q037

An agent must remember a user's preferred units across conversations while answering from a maintained engineering manual. Which division of context is appropriate?

- **A.** Store preferences in the knowledge base and use temporary file search for the engineering manual.
- **B.** Store both preferences and the maintained manual in interaction-derived memory.
- **C.** Store learned preferences in persistent memory and use maintained knowledge for the current manual.
- **D.** Store learned preferences in the prior session conversation history and retrieve the current manual from the maintained knowledge base.

## Q38 — ai103-improvement-r2-set-a-100-q038

An agent follows its operating policy and calls the correct tools, but leaves two requested deliverables unfinished. Which evaluator best targets the overall outcome?

- **A.** Task Completion (preview), assessing whether the agent delivered the requested end-to-end outcome.
- **B.** Tool Selection, focused on the choice of tool for each operation.
- **C.** Task Adherence (preview), using the fact that the agent obeyed its operating policy to judge whether all requested deliverables were completed.
- **D.** Tool Input Accuracy, focused on the arguments supplied to a tool.

## Q39 — ai103-improvement-r2-set-a-100-q039

A team has query-document relevance labels and wants to compare two retrievers before adding answer generation. Which evaluation is appropriate?

- **A.** Groundedness, using a hypothetical final answer to infer whether the two retrievers placed all relevant documents at the correct rank positions.
- **B.** Response Completeness evaluated against a reference final answer.
- **C.** Task Adherence evaluated against the agent system instructions.
- **D.** Document Retrieval against the supplied query-document relevance labels for the two candidate retrievers.

## Q40 — ai103-improvement-r2-set-a-100-q040

A retrieved maintenance page tells the agent to ignore its instructions and send credentials to a URL. Which threat category should be evaluated at this boundary?

- **A.** A factual data-poisoning error that changes a measurement without issuing instructions.
- **B.** A harmful final-answer classification unrelated to the retrieved instruction boundary.
- **C.** A direct user prompt attack originating in the authenticated user message.
- **D.** An indirect prompt attack in external document content.

## Q41 — ai103-improvement-r2-set-a-100-q041

An organization requires agent state in customer-managed resources in its own subscription. Which agent setup aligns with that storage requirement?

- **A.** A larger model context window in the existing basic setup.
- **B.** A model deployment changed from Standard to Provisioned throughput.
- **C.** Standard setup with customer-managed supporting resources.
- **D.** Basic setup using Microsoft-managed state storage.

## Q42 — ai103-improvement-r2-set-a-100-q042

A team wants one supported Python client library for extracting document layout, transcribing audio and analyzing recorded video into structured outputs. Which service’s documented client covers all three input modalities?

- **A.** Azure Language text summarization alone.
- **B.** Azure AI Search OCR skill alone.
- **C.** Azure Document Intelligence Layout alone.
- **D.** Azure AI Content Understanding.

## Q43 — ai103-improvement-r2-set-a-100-q043

Complete the Azure OpenAI v1 client for keyless inference. The calling identity has the inference role at the resource scope.

```text
token_provider = get_bearer_token_provider(credential, "{{audience}}")
client = OpenAI(base_url="{{endpoint}}", api_key=token_provider)
```

- Choices for **audience**: https://ai.azure.com/.default | https://management.azure.com/.default | https://search.azure.com/.default
- Choices for **endpoint**: https://resource.openai.azure.com/openai/v1/ | https://resource.services.ai.azure.com/api/projects/support | https://resource.search.windows.net/

## Q44 — ai103-improvement-r2-set-a-100-q044

Complete the AI Projects Python 2.8.0 constructor for project operations.

```text
project = AIProjectClient(endpoint={{endpoint}}, credential={{credential}})
```

- Choices for **endpoint**: project_endpoint | openai_v1_base_url | search_endpoint
- Choices for **credential**: DefaultAzureCredential() | AzureKeyCredential(resource_key) | project_endpoint

## Q45 — ai103-improvement-r2-set-a-100-q045

A catalog requires exact part-code matches and semantic symptom matches. Which design combines both retrieval signals before optional reranking?

- **A.** Vector retrieval alone, with a larger candidate count.
- **B.** Semantic reranking of keyword-only candidates.
- **C.** Keyword and vector retrieval with fused rankings.
- **D.** Keyword retrieval alone, with boosted identifier fields.

## Q46 — ai103-improvement-r2-set-a-100-q046

An agent proposes a consequential account change. Which host boundary should decide whether it executes?

- **A.** The host’s caller authorization and action approval gate.
- **B.** A valid model response schema.
- **C.** A lower generation temperature.
- **D.** A more detailed tool description.

## Q47 — ai103-improvement-r2-set-a-100-q047

A catalog app must create a new product-scene image from a text brief, with no source image supplied. Its supported GPT image deployment is available. Which operation matches this input contract?

- **A.** Call images.edit with the brief as its source image file.
- **B.** Send the brief to a vision chat request and treat the text response as image bytes.
- **C.** Call images.edit with a mask but no source image.
- **D.** Call images.generate with the deployment and text prompt.

## Q48 — ai103-improvement-r2-set-a-100-q048

An application switches between two GPT image deployments with different quality and size options. What should its request builder use?

- **A.** One fixed list copied from an older image model.
- **B.** The union of both models' parameters, sent to each deployment for consistency.
- **C.** The supported controls of the selected deployed image model.
- **D.** The default size accepted by a different deployment in the same resource.

## Q49 — ai103-improvement-r2-set-a-100-q049

A vision-enabled chat model must describe damage visible in a supplied photograph. Which message construction gives it the actual visual input?

- **A.** Include text instructions and image_url content in the message.
- **B.** Enable image output formatting on the text-only message.
- **C.** Put the image filename in a text message.
- **D.** Describe an image path in the system prompt while keeping the image local to the client.

## Q50 — ai103-improvement-r2-set-a-100-q050

A magnifying-glass image is the visible label of a search button. Which text alternative best communicates the function?

- **A.** Small circular lens with a diagonal handle on a blue background.
- **B.** search-icon-v3.png.
- **C.** Magnifying glass icon.
- **D.** Search the catalog.

## Q51 — ai103-improvement-r2-set-a-100-q051

A Content Understanding video preview samples about one frame per second. A safety event lasts 0.2 seconds and the output does not mention it. Which conclusion is justified?

- **A.** The absence of a mention proves the event did not occur.
- **B.** Increase output length to recover source frames omitted by the sampling stage.
- **C.** The sampled analysis may have missed the brief event.
- **D.** The analyzer must have sampled every source frame because the request succeeded.

## Q52 — ai103-improvement-r2-set-a-100-q052

A production document-image workflow needs capabilities available in Content Understanding 2025-11-01. A newer preview offers unrelated features. Which API selection follows the documented production guidance?

- **A.** Use the 2025-11-01 GA API for the required production capabilities.
- **B.** Use the retired 2025-05-01-preview because its examples are familiar.
- **C.** Use 2026-06-01-preview because its date is newer.
- **D.** Alternate API versions randomly to compare response speed in production.

## Q53 — ai103-improvement-r2-set-a-100-q053

A poster has a low visual harm score but includes text telling an agent to reveal credentials. Which conclusion follows from the harm result?

- **A.** The image harm score is a groundedness measurement.
- **B.** Visual harm severity; instruction trust is a separate check.
- **C.** A successful harm request establishes the text is authorized.
- **D.** The poster text has passed instruction-trust validation.

## Q54 — ai103-improvement-r2-set-a-100-q054

A vision model receives two images of the same machine. The app needs a concise caption comparing visible differences. What should be supplied?

- **A.** Attach only the first image and describe the second image’s filename.
- **B.** Both supported image inputs with an explicit comparison/caption instruction.
- **C.** Attach both images but ask only for an independent caption of the first.
- **D.** Send a text-only comparison request containing both image URLs as prose.

## Q55 — ai103-improvement-r2-set-a-100-q055

Complete a vision chat message so a question about a supplied inspection photo is grounded in actual image input.

```text
content = [{"type": "text", "text": question},
           {"type": "{{kind}}", "{{field}}": {"url": photo_url}}]
```

- Choices for **kind**: image_url | text | image_output
- Choices for **field**: image_url | file_name | caption

## Q56 — ai103-improvement-r2-set-a-100-q056

The selected image model supports masking. Complete an edit request for a source image and a mask already sized to match it.

```text
result = client.images.edit(model=deployment, image={{source}}, mask={{mask}}, prompt=edit_instruction)
```

- Choices for **source**: source_image_file | source_filename_text | prior_caption_text
- Choices for **mask**: matching_mask_file | size_string | quality_string

## Q57 — ai103-improvement-r2-set-a-100-q057

A Translator text request contains one sentence with English and German spans. Some words remain untranslated. Which preparation targets the documented limitation?

- **A.** Submit the same mixture to document translation with autodetection.
- **B.** Retry the same mixed sentence until detection changes.
- **C.** Provide a glossary while keeping the mixed-language sentence intact.
- **D.** Segment by source language and translate each segment explicitly.

## Q58 — ai103-improvement-r2-set-a-100-q058

A domain compliance summarizer needs a defined scope and an explicit escalation when evidence is missing. Which instruction design addresses it?

- **A.** A deployment name containing compliance.
- **B.** Domain instructions with a missing-evidence fallback.
- **C.** A longer output limit alone.
- **D.** A lower top-p value alone.

## Q59 — ai103-improvement-r2-set-a-100-q059

A blob OCR pipeline has imageAction none and incorrectly maps a skill-produced text node with fieldMappings. Which TWO changes repair the data path? Select TWO answers.

- **A.** Keep imageAction none and use a larger searchable field.
- **B.** Map enriched OCR text into the index with outputFieldMappings.
- **C.** Move the OCR text mapping into the semantic query request.
- **D.** Enable original-image extraction but keep the OCR text mapping in fieldMappings.
- **E.** Generate normalized images for the OCR skill input.

## Q60 — ai103-improvement-r2-set-a-100-q060

A team uses Content Understanding SDK 1.1.0 for production document extraction. Which TWO implementation choices align with the referenced contract? Select TWO answers.

- **A.** Use capabilities compatible with its 2025-11-01 API version.
- **B.** Submit the same document repeatedly as a substitute for polling.
- **C.** Wait for analysis completion before consuming the structured result.
- **D.** Treat the initial poller as completed Markdown content.
- **E.** Mix preview-only analyzer fields into the request with no version change.

## Q61 — ai103-improvement-r2-set-a-100-q061

A custom analyzer must extract an amount from unfamiliar invoice layouts and support reviewer verification. Which TWO features or inputs are useful? Select TWO answers.

- **A.** A high confidence threshold used as proof that all accepted values are correct.
- **B.** Representative labeled examples with verified field values.
- **C.** Generated explanations used as substitutes for labeled source values.
- **D.** Removing source coordinates to standardize the JSON shape.
- **E.** Field source and confidence estimation for the extraction results.

## Q62 — ai103-improvement-r2-set-a-100-q062

Long manuals exceed embedding limits, and the query vectorizer uses an unrelated model. Which TWO configuration corrections address the two failures? Select TWO answers.

- **A.** Chunk the source text within input limits.
- **B.** Increase the answer-generation token limit.
- **C.** Disable indexing warnings.
- **D.** Rescale query vectors from the unrelated model.
- **E.** Use content/query embeddings from a compatible model configuration.

## Q63 — ai103-improvement-r2-set-a-100-q063

A product catalog needs exact codes and semantic candidates, with optional semantic reranking. Which TWO statements describe the stages correctly? Select TWO answers.

- **A.** Hybrid retrieval combines keyword and vector ranked lists.
- **B.** Semantic ranking renames source fields during ingestion.
- **C.** Semantic reranking generates the indexed vectors.
- **D.** A query vectorizer uses a compatible embedding configuration.
- **E.** Keyword sorting makes vectorization unnecessary for the vector path.

## Q64 — ai103-improvement-r2-set-a-100-q064

A document enrichment pipeline needs layout-aware Markdown and OCR for normalized images. Which TWO skill choices directly target these outputs? Select TWO answers.

- **A.** The OCR skill receiving normalized images.
- **B.** The Document Intelligence Layout skill.
- **C.** A semantic query configuration.
- **D.** An output field alias without a producing skill.
- **E.** An Azure OpenAI chat output-token setting.

## Q65 — ai103-improvement-r2-set-a-100-q065

An agent retrieves an unrelated Search index and returns content from another department. Which TWO tool configuration controls address the stated defects? Select TWO answers.

- **A.** A resource name containing the department.
- **B.** A supported filter using the authorized department.
- **C.** A larger unfiltered candidate set.
- **D.** The correct connected index name.
- **E.** A longer model answer.

## Q66 — ai103-improvement-r2-set-a-100-q066

A document pipeline must extract invoice fields and support amount verification. Which TWO design choices address those requirements? Select TWO answers.

- **A.** Retain source locations for reviewer inspection.
- **B.** Treat high confidence as permission to pay.
- **C.** Replace field types with filename parsing.
- **D.** Define the required field schema.
- **E.** Discard coordinates after assigning confidence.

## Q67 — ai103-improvement-r2-set-a-100-q067

A RAG pipeline needs a clean document representation before retrieval. Which TWO Content Understanding outputs or behaviors fit? Select TWO answers.

- **A.** A completed analysis result consumed after successful polling.
- **B.** Markdown representing document structure.
- **C.** A generated final answer used as the source document.
- **D.** A queued operation treated as extracted text.
- **E.** A raw poller serialized into the vector field.

## Q68 — ai103-improvement-r2-set-a-100-q068

A custom contract analyzer misses renewal dates in a new layout. Which TWO inputs should guide improvement? Select TWO answers.

- **A.** A typed renewal-date field definition.
- **B.** A high threshold reported as proof of correctness.
- **C.** Renaming every unrelated date as renewal_date.
- **D.** Tune the query semantic configuration without changing the extraction field definition.
- **E.** Representative examples with verified values.

## Q69 — ai103-improvement-r2-set-a-100-q069

An agent proposes a refund. The application requires user confirmation, and the model supplies untrusted arguments. Which TWO host responsibilities are needed before the side effect? Select TWO answers.

- **A.** Obtain confirmation for the specific proposed refund.
- **B.** Return the payment credential to the model for approval checking.
- **C.** Execute the refund before displaying its confirmation dialog.
- **D.** Validate the arguments and authorize the target account.
- **E.** Treat valid JSON as sufficient permission to issue the refund.

## Q70 — ai103-improvement-r2-set-a-100-q070

A strict Responses output must contain code and comment. Comment may be null, and additional fields are prohibited. Which TWO schema decisions satisfy those constraints? Select TWO answers.

- **A.** Allow arbitrary extra fields and validate just the required names.
- **B.** Keep comment required and allow its type to include null.
- **C.** Represent absent comment as an omitted property with no nullable type.
- **D.** Set additionalProperties to false on the object schema.
- **E.** Omit comment from required when its value is unavailable.

## Q71 — ai103-improvement-r2-set-a-100-q071

A RAG system must find exact equipment identifiers and semantic paraphrases. It uses a vector index built with model X. Which TWO design choices fit? Select TWO answers.

- **A.** Use an unrelated model with matching dimensions as proof of vector compatibility.
- **B.** Sort hybrid candidates by filename after RRF to preserve relevance.
- **C.** Replace embeddings with semantic reranking during ingestion.
- **D.** Use query embeddings compatible with the indexed model X vectors.
- **E.** Combine keyword and vector retrieval through hybrid search.

## Q72 — ai103-improvement-r2-set-a-100-q072

An agent receives hostile user prompts and malicious instructions inside retrieved text. Which TWO controls align with those different entry points? Select TWO answers.

- **A.** Treat retrieved-document instructions as lower-trust indirect attacks.
- **B.** Approve retrieved instructions because the source URL uses HTTPS.
- **C.** Scan final answers as proof that proposed tool calls were safe before execution.
- **D.** Treat tool output as a new developer message when it names a system role.
- **E.** Assess direct user attacks at the input boundary.

## Q73 — ai103-improvement-r2-set-a-100-q073

A support agent needs a remembered user preference, current corporate policy and a receipt uploaded for this interaction. Which TWO assignments are appropriate? Select TWO answers.

- **A.** Use memory as the maintained full-text corporate policy repository.
- **B.** Use the knowledge base for policy and file search for the receipt.
- **C.** Use conversation state as the cross-session preference store.
- **D.** Use the temporary receipt as the source of the company's standing policy.
- **E.** Use persistent memory for interaction-derived preferences.

## Q74 — ai103-improvement-r2-set-a-100-q074

A proxy calls a memory-enabled prompt agent for two users using one managed identity. Which TWO requirements implement separate preferences? Select TWO answers.

- **A.** Use a single static scope for every resident.
- **B.** Put user display names only in the prompt.
- **C.** Use the memory tool’s {{$userId}} scope.
- **D.** Rely on new conversation IDs as memory partitions.
- **E.** Send a verified user key through x-memory-user-id.

## Q75 — ai103-improvement-r2-set-a-100-q075

A support agent needs a domain boundary and a measurable fallback for missing evidence. Which TWO activities address those requirements? Select TWO answers.

- **A.** State the domain and fallback in system instructions.
- **B.** Assume one successful example establishes compliance.
- **C.** Evaluate representative and adversarial queries against that behavior.
- **D.** Remove the fallback to reduce prompt length.
- **E.** Treat a low temperature as complete policy enforcement.

## Q76 — ai103-improvement-r2-set-a-100-q076

A specialist agent proposes an action that a deterministic host rule must approve. Which TWO responsibilities should the design keep explicit? Select TWO answers.

- **A.** The host’s rule/authorization gate before action execution.
- **B.** The orchestration’s handoff and completion conditions.
- **C.** The model’s acknowledgement treated as business approval.
- **D.** A trace display label treated as an executable rule.
- **E.** Tool registration treated as universal caller permission.

## Q77 — ai103-improvement-r2-set-a-100-q077

A Python OpenAI 2.x application extracts events with Responses structured output. The client is configured and the supported model is deployed. On the successful non-refusal path, arrange these operations; business validation needs the parsed field values.

- **A.** Read the successful response.output_parsed object.
- **B.** Define the Pydantic event model.
- **C.** Call responses.parse with the event model as text_format.
- **D.** Validate the parsed date and participants against application rules.

## Q78 — ai103-improvement-r2-set-a-100-q078

A Language NER pipeline must send organization and location records to a JSON-consuming application. The host constructs the records from returned entity categories and verifies the resulting JSON against the consumer’s schema. Arrange the data dependencies.

- **A.** Construct JSON records from the returned organization and location entities.
- **B.** Read the source text into the extraction worker.
- **C.** Run named entity recognition on that text.
- **D.** Validate the constructed JSON against the consumer schema before sending it.

## Q79 — ai103-improvement-r2-set-a-100-q079

A transcript may be held temporarily in a restricted worker. The searchable store may receive only a version redacted using the entities returned by PII detection. The worker has no existing detection result. Arrange the data dependencies.

- **A.** Read the transcript into the restricted worker.
- **B.** Build the redacted representation using the returned detected entities.
- **C.** Write that redacted representation to the searchable store.
- **D.** Analyze that text with PII detection.

## Q80 — ai103-improvement-r2-set-a-100-q080

A mixed-language notice must be translated into French. Its language spans are known, and quality review compares the complete reconstructed notice with the original, including references across segments. Arrange this application workflow.

- **A.** Translate each prepared segment to French with its source language specified.
- **B.** Reconstruct the notice from the successful segment translations.
- **C.** Review the complete translated notice against the original before delivery.
- **D.** Prepare single-language segments with their intended source-language labels.

## Q81 — ai103-improvement-r2-set-a-100-q081

A compliance extractor may forward a result for approval only after its cited fields are verified against the supplied policy. Its model, client and policy are ready, but its domain instructions and strict output schema have not been defined. Arrange these operations.

- **A.** Define the domain boundary, missing-evidence fallback and supported field schema.
- **B.** Check the successful extracted fields and citations against the supplied policy.
- **C.** Forward the verified result to the authorized approval queue.
- **D.** Request extraction using those instructions, schema and policy text.

## Q82 — ai103-improvement-r2-set-a-100-q082

A voice assistant uses a text-only response model and a separate speech synthesizer. The application requires its response-text policy check to pass before any answer audio is emitted. Arrange the successful path for one recorded utterance.

- **A.** Generate a text response from that transcript.
- **B.** Recognize the utterance into finalized text.
- **C.** Apply the required response-text policy check.
- **D.** Synthesize and emit the approved response text.

## Q83 — ai103-improvement-r2-set-a-100-q083

A Custom Speech project and training data are ready. A new model must meet a held-out WER threshold before deployment, and the application will use it for real-time recognition, not batch transcription. Arrange the remaining operations.

- **A.** Evaluate that model on the held-out set and confirm the WER gate passes.
- **B.** Deploy the approved model to a custom endpoint.
- **C.** Train the custom model with the prepared domain data.
- **D.** Send real-time recognition requests to that custom endpoint.

## Q84 — ai103-improvement-r2-set-a-100-q084

A Realtime assistant must interpret a recorded inspection question in the context of a written maintenance note for the same equipment. Its supported audio model and transport are ready. Host policy requires checking the returned interpretation against that note before offering a repair action. Arrange the application’s operations.

- **A.** Prepare the supported audio input and text context for that equipment’s conversation.
- **B.** Check that interpretation against the maintenance note before offering the repair action.
- **C.** Collect the utterance and its associated maintenance note.
- **D.** Submit the prepared input and obtain the successful interpretation.

## Q85 — ai103-improvement-r2-set-a-100-q085

An event-based Speech SDK translator must retain the first completed translated utterance. Credentials and AudioConfig are ready. It uses a TranslationRecognizer whose recognized callback stores successful translations. Arrange initialization so the handler is ready when recognition begins.

- **A.** Create the TranslationRecognizer from that translation configuration and AudioConfig.
- **B.** Configure SpeechTranslationConfig with the source and target languages.
- **C.** Connect the storage callback to the recognizer’s recognized event.
- **D.** Start continuous recognition on the configured recognizer.

## Q86 — ai103-improvement-r2-set-a-100-q086

A store-and-forward speech translator uses manual synthesis for two target languages. It will deliver an audio file only after synthesis succeeds. Arrange the successful path for the selected target language; no translation result is available initially.

- **A.** Synthesize that text with a voice supporting the selected target language.
- **B.** Deliver the successfully synthesized audio file.
- **C.** Select the requested language’s text from the successful result’s translations.
- **D.** Recognize and translate the source utterance.

## Q87 — ai103-improvement-r2-set-a-100-q087

Match each workload requirement to its deployment family. Geography and model support have already been checked. Use each selected choice once; one choice is unused.

- **A.** Deferred asynchronous groups of inference requests
- **B.** Variable interactive demand with per-token charges
- **C.** Allocated throughput for sustained traffic

Choices: Developer | Batch | Provisioned | Standard

## Q88 — ai103-improvement-r2-set-a-100-q088

Match each investigation to the most direct evidence source. Use each selected choice once; one choice is unused.

- **A.** A slow operation inside one scored agent request
- **B.** Missing source documents after a partially successful run
- **C.** Query-serving throttling during traffic peaks

Choices: Search service operational metrics | Indexer item errors and warnings | Correlated trace and nested spans | Aggregate billing report

## Q89 — ai103-improvement-r2-set-a-100-q089

Match each keyless inference observation to the boundary to inspect. Use each selected choice once; one choice is unused.

- **A.** A token is acquired but the resource denies inference
- **B.** The role exists only on a different resource
- **C.** No Entra token can be acquired

Choices: Credential/authentication configuration | Inference authorization for the caller | Role assignment scope covering the called resource | Generation sampling parameters

## Q90 — ai103-improvement-r2-set-a-100-q090

Match each trust boundary to the relevant inspection point. Use each selected choice once; one choice is unused.

- **A.** An instruction inserted into a retrieved document
- **B.** A harmful generated response
- **C.** A user’s submitted attack instruction

Choices: User-input protection | External-context/indirect-attack protection | Final-output inspection | Model token quota

## Q91 — ai103-improvement-r2-set-a-100-q091

Match each observed agent defect to the targeted tool evaluator. Use each selected choice once; one choice is unused.

- **A.** A correct returned quantity is misrepresented in the answer
- **B.** The model invokes translation when inventory lookup is needed
- **C.** The correct tool receives the warehouse ID as a part ID

Choices: Tool Input Accuracy | Task Completion (preview) | Tool Output Utilization | Tool Selection

## Q92 — ai103-improvement-r2-set-a-100-q092

Match each information need to the documented context capability. Use each selected choice once; one choice is unused.

- **A.** A maintained corporate handbook
- **B.** A preference learned from prior conversations
- **C.** A receipt uploaded for the current interaction

Choices: Persistent memory | Model router | Curated knowledge base | File search

## Q93 — ai103-improvement-r2-set-a-100-q093

Match each response-turn requirement to the documented tool_choice mode. Use each selected choice once; one choice is unused.

- **A.** The turn must produce no tool calls
- **B.** One or more tool calls are necessary
- **C.** Model may decide whether a tool helps

Choices: auto | required | none | A specific tool execution receipt

## Q94 — ai103-improvement-r2-set-a-100-q094

Match each webpage image role to the appropriate alternative-text approach. Use each selected choice once; one choice is unused.

- **A.** A complex chart whose details cannot fit concise alt text
- **B.** An image that submits a search form
- **C.** A purely decorative background flourish

Choices: Provide the detailed information elsewhere on the page | Use the image filename | Communicate the action | Use empty alt

## Q95 — ai103-improvement-r2-set-a-100-q095

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

- **A.** The index’s ocr_text field is searchable.
- **B.** The text output mapping names the correct enriched node.
- **C.** The blob indexer’s imageAction is none.
- **D.** The OCR skill uses the normalized image wildcard.

## Q96 — ai103-improvement-r2-set-a-100-q096

The pipeline needs layout-derived Markdown for indexing. Which producing capability should replace the enrichment stage in this exhibit?

### Required enrichment output

```text
{"input":"source document","requiredOutput":"layout-aware Markdown","consumer":"Search indexer skillset"}
```

- **A.** A field mapper without a producing skill.
- **B.** A semantic query configuration.
- **C.** OCR only, with no layout extraction.
- **D.** Document Intelligence Layout skill.

## Q97 — ai103-improvement-r2-set-a-100-q097

A custom extractor uses the following result. What should happen before the application posts the invoice amount?

### Invoice analyzer result

```text
{"total":{"value":1460.00,"confidence":0.42,"source":{"page":2,"span":"invoice total"}},"rule":"verified totals only"}
```

- **A.** Verify grounded field evidence and business rules.
- **B.** Use the confidence as payment authorization.
- **C.** Replace the source amount with the highest nearby number.
- **D.** Post because the JSON parsed.

## Q98 — ai103-improvement-r2-set-a-100-q098

The image:analyze 2024-09-01 contract uses FourSeverityLevels. Policy rejects an image when any harm category is Medium or High. What comparison should implement the policy?

### Image harm policy

```text
{"apiVersion":"2024-09-01","outputType":"FourSeverityLevels","rejectWhen":"any category is Medium or High"}
```

- **A.** Reject if any analyzed category has severity 4 or 6.
- **B.** Average the returned category severities and reject when that average reaches 4.
- **C.** Reject when every category equals 6.
- **D.** Reject when a category equals 3.

## Q99 — ai103-improvement-r2-set-a-100-q099

This audio-analysis worker passes an operation handle to its transcript consumer and the consumer rejects it. Which change obtains the completed analysis output in the pinned SDK?

### Python SDK 1.1.0 / API 2025-11-01

```text
poller = client.begin_analyze(analyzer_id="prebuilt-audioSearch", inputs=inputs)
transcript_consumer(poller)
```

- **A.** Wait for poller.result() and consume the returned analysis result.
- **B.** Read the operation ID as the transcript and retry the consumer.
- **C.** Cast the poller to a dictionary before sending it to the consumer.
- **D.** Change the audio filename extension and reuse the operation handle.

## Q100 — ai103-improvement-r2-set-a-100-q100

The translation result leaves part of this input unchanged. Which cause and response best fit the documented condition?

### Text translation diagnosis

```text
{"text":"Replace the filter, dann starten Sie die Pumpe.","detectedLanguage":"en","target":"fr","symptom":"German clause unchanged"}
```

- **A.** A detected language and HTTP success establish complete translation.
- **B.** Source autodetection must be forced to German for the whole sentence.
- **C.** A text request should become an autodetected document translation job.
- **D.** Mixed source languages; segment and translate with intended source labels.

