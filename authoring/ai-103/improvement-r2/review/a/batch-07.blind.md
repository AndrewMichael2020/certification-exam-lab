# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q035

A Search tool points at the right service but retrieves an unrelated index. Which agent-tool configuration should be corrected first?

- **A.** The retrieval filter for the current unrelated index.
- **B.** The tool's maximum result count.
- **C.** The configured index name and project connection.
- **D.** The tool's vector-versus-keyword query mode.

## Q2 — ai103-improvement-r2-set-a-100-q036

A response is fully supported by context and addresses the question, but omits two required parts of the reference answer. Which additional metric is most targeted?

- **A.** Response Completeness (preview).
- **B.** Groundedness repeated against the same supplied context.
- **C.** Response relevance.
- **D.** Response safety screening.

## Q3 — ai103-improvement-r2-set-a-100-q037

An agent must remember a user's preferred units across conversations while answering from a maintained engineering manual. Which division of context is appropriate?

- **A.** Store preferences in the knowledge base and use temporary file search for the engineering manual.
- **B.** Store both preferences and the maintained manual in interaction-derived memory.
- **C.** Store learned preferences in persistent memory and use maintained knowledge for the current manual.
- **D.** Store learned preferences in the prior session conversation history and retrieve the current manual from the maintained knowledge base.

## Q4 — ai103-improvement-r2-set-a-100-q038

An agent follows its operating policy and calls the correct tools, but leaves two requested deliverables unfinished. Which evaluator best targets the overall outcome?

- **A.** Task Completion (preview), assessing whether the agent delivered the requested end-to-end outcome.
- **B.** Tool Selection, focused on the choice of tool for each operation.
- **C.** Task Adherence (preview), using the fact that the agent obeyed its operating policy to judge whether all requested deliverables were completed.
- **D.** Tool Input Accuracy, focused on the arguments supplied to a tool.

## Q5 — ai103-improvement-r2-set-a-100-q039

A team has query-document relevance labels and wants to compare two retrievers before adding answer generation. Which evaluation is appropriate?

- **A.** Groundedness, using a hypothetical final answer to infer whether the two retrievers placed all relevant documents at the correct rank positions.
- **B.** Response Completeness evaluated against a reference final answer.
- **C.** Task Adherence evaluated against the agent system instructions.
- **D.** Document Retrieval against the supplied query-document relevance labels for the two candidate retrievers.

## Q6 — ai103-improvement-r2-set-a-100-q040

A retrieved maintenance page tells the agent to ignore its instructions and send credentials to a URL. Which threat category should be evaluated at this boundary?

- **A.** A factual data-poisoning error that changes a measurement without issuing instructions.
- **B.** A harmful final-answer classification unrelated to the retrieved instruction boundary.
- **C.** A direct user prompt attack originating in the authenticated user message.
- **D.** An indirect prompt attack in external document content.

## Q7 — ai103-improvement-r2-set-a-100-q041

An organization requires agent state in customer-managed resources in its own subscription. Which agent setup aligns with that storage requirement?

- **A.** A larger model context window in the existing basic setup.
- **B.** A model deployment changed from Standard to Provisioned throughput.
- **C.** Standard setup with customer-managed supporting resources.
- **D.** Basic setup using Microsoft-managed state storage.

## Q8 — ai103-improvement-r2-set-a-100-q042

A team wants one supported Python client library for extracting document layout, transcribing audio and analyzing recorded video into structured outputs. Which service’s documented client covers all three input modalities?

- **A.** Azure Language text summarization alone.
- **B.** Azure AI Search OCR skill alone.
- **C.** Azure Document Intelligence Layout alone.
- **D.** Azure AI Content Understanding.

## Q9 — ai103-improvement-r2-set-a-100-q043

Complete the Azure OpenAI v1 client for keyless inference. The calling identity has the inference role at the resource scope.

```text
token_provider = get_bearer_token_provider(credential, "{{audience}}")
client = OpenAI(base_url="{{endpoint}}", api_key=token_provider)
```

- Choices for **audience**: https://ai.azure.com/.default | https://management.azure.com/.default | https://search.azure.com/.default
- Choices for **endpoint**: https://resource.openai.azure.com/openai/v1/ | https://resource.services.ai.azure.com/api/projects/support | https://resource.search.windows.net/

## Q10 — ai103-improvement-r2-set-a-100-q044

Complete the AI Projects Python 2.8.0 constructor for project operations.

```text
project = AIProjectClient(endpoint={{endpoint}}, credential={{credential}})
```

- Choices for **endpoint**: project_endpoint | openai_v1_base_url | search_endpoint
- Choices for **credential**: DefaultAzureCredential() | AzureKeyCredential(resource_key) | project_endpoint

