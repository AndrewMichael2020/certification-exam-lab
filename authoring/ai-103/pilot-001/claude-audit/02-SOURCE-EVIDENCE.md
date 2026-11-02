# AI-103 pilot 001 — frozen public source evidence

This is the shared reference corpus for the blind solve. Excerpts are copied verbatim from the repository snapshots; line numbers refer to those complete UTF-8 Markdown files. Gaps between ranges are omissions. Sources are organized by source ID, without per-question claims or an answer key. The excerpts are bounded and may be insufficient: explicitly flag that instead of filling a gap with the author's presumed intent.

Snapshot date: 2026-10-08 UTC (October 7 in Vancouver). Target pack: `ai-103@1.1.0`, objective effective date `2026-04-16`. The full source URLs are references; these snapshots define this audit version. Public documentation may later change. No Azure sample was executed in this authoring session.

## Version and interpretation boundaries

- Use current Responses/function-call panels, not classic threads/runs contracts.
- Sora 2 is preview; use the v1 videos/remix flow rather than an older jobs API.
- Content Safety image REST API version is 2024-09-01.
- Task Completion and Task Adherence evaluators are preview.
- S040 uses “project managed identity” in its introduction but names the containing Foundry account’s system-assigned identity in keyless setup. Audit the case’s explicit principal and role prerequisites against that detailed setup.
- Speech excerpts establish API steps; some full-page examples have variable/parameter naming inconsistencies. Do not assume the page is an executable fixture. The question assumes a successful result.

## S005 — Deployment types for Microsoft Foundry Models

URL: https://learn.microsoft.com/azure/foundry/foundry-models/concepts/deployment-types
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S005.md`
Full snapshot SHA-256: `6c6d5d7b11684c1cbba8d35fd278a313e1420e3853b0ba9f104898c4a8c24c58`

### Lines 3–11

````text
3: When you deploy a model in Microsoft Foundry, you choose a deployment type that determines:
4: 
5: - **Where your data is processed** (global, data zone, or Azure geography)
6: - **How you pay** (pay-per-token or reserved capacity)
7: - **Performance characteristics** (latency variance, throughput limits)
8: 
9: These deployment types apply to the **Serverless API** deployment option. Open-source and custom models that use **managed compute** don't use these types. For how the options differ, see [Deployment overview for Microsoft Foundry Models](../../concepts/deployments-overview).
10: 
11: The service offers three main categories: *standard* (pay-per-token), *provisioned* (reserved capacity), and *batch* (discounted asynchronous processing). A *Developer* type is also available for fine-tuned model evaluation. Within the standard and provisioned categories, you can choose global, data zone, or geography-based processing based on your compliance requirements.
````

### Lines 21–25

````text
21: **Data residency for all deployment types**: Data stored at rest remains in the designated Azure geography. However, inferencing data is processed as follows:
22: 
23: - **Global** types: May be processed in any Azure region
24: - **Data Zone** types: The service processes data only within the Microsoft-specified data zone (US, EU, or Asia Pacific (APAC)).
25: - **Standard and Regional Provisioned** types: Prompts and responses are processed within the customer-specified Azure geography and might be processed between regions within that geography for operational purposes.
````

### Lines 39–49

````text
39: | Deployment type | SKU code | Data processing | Billing | Best for |
40: | --- | --- | --- | --- | --- |
41: | Global Standard | `GlobalStandard` | Any Azure region | Pay-per-token | General workloads, highest quota |
42: | Global Provisioned | `GlobalProvisionedManaged` | Any Azure region | Reserved PTU | Predictable high-throughput |
43: | Global Batch | `GlobalBatch` | Any Azure region | 50% discount, 24-hr | Large async jobs |
44: | Data Zone Standard | `DataZoneStandard` | Within data zone | Pay-per-token | EU/US/APAC data zone compliance |
45: | Data Zone Provisioned | `DataZoneProvisionedManaged` | Within data zone | Reserved PTU | Data zone + predictable throughput |
46: | Data Zone Batch | `DataZoneBatch` | Within data zone | 50% discount | Large async jobs with data zone |
47: | Standard | `Standard` | Within Azure geography | Pay-per-token | Geography compliance, low volume |
48: | Regional Provisioned | `ProvisionedManaged` | Within Azure geography | Reserved PTU | Geography compliance + throughput |
49: | Developer | `DeveloperTier` | Any Azure region | Pay-per-token | Fine-tuned model evaluation only (24-hour lifetime, no SLA or data-residency guarantee) |
````

## S007 — Use function calling with Microsoft Foundry agents

URL: https://learn.microsoft.com/azure/foundry/agents/how-to/tools/function-calling
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S007.md`
Full snapshot SHA-256: `0d4119f94b15c94d404729f53d2ed5f52a89dfaf35841d1290c0472be3e3e953`

### Lines 113–130

````text
113: # Process function calls
114: for item in response.output:
115:     if item.type == "function_call":
116:         if item.name == "get_horoscope":
117:             # Execute the function logic for get_horoscope
118:             horoscope = get_horoscope(**json.loads(item.arguments))
119: 
120:             # Provide function call results to the model
121:             input_list.append(
122:                 FunctionCallOutput(
123:                     type="function_call_output",
124:                     call_id=item.call_id,
125:                     output=json.dumps({"horoscope": horoscope}),
126:                 )
127:             )
128: 
129: # Submit function results and get the final response
130: response = openai.responses.create(
````

## S009 — Foundry Agent Service limits, quotas, and regional support

URL: https://learn.microsoft.com/azure/foundry/agents/concepts/limits-quotas-regions
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S009.md`
Full snapshot SHA-256: `d83fd890729d322d4ffa580ca5a8db2bed5bcd783dae47f5da2b05985f4b3041`

### Lines 225–229

````text
225: - If the error code is `session_quota_exceeded`, stop sessions that don't need active compute, delete sessions whose state is no longer needed, or request a limit increase.
226: - If the error code is `regional_session_quota_exceeded`, retry with exponential backoff or use another region. If the error persists create an Azure support request.
227: - Implement exponential backoff with jitter in your application retry logic.
228: - For sustained high-throughput workloads, consider provisioned throughput deployments.
229: - Review [Azure OpenAI quotas and limits](../../openai/quotas-limits) for your deployment's tokens-per-minute and requests-per-minute caps.
````

### Lines 259–259

````text
259: Agent Service applies a per-subscription limit to concurrent hosted agent sessions in each region. This limit includes sessions across all Foundry accounts and projects in the subscription and region. A session counts toward the quota while its compute is being provisioned or is running. An idle or stopped session retains its persisted state but doesn't count toward the quota. Resuming it requires available quota.
````

### Lines 302–305

````text
302: | Concurrent session quota exceeded | 429 | `session_quota_exceeded` | Stop sessions that don't need active compute, delete sessions whose state is no longer needed, or request a limit increase |
303: | Regional session capacity exceeded | 429 | `regional_session_quota_exceeded` | Retry with exponential backoff or use another region |
304: | Delegated subnet has no available IP addresses | 429 | `subnet_exhausted` | Stop sessions that don't need active compute, or configure a larger subnet |
305: | Too many agent versions | 400 | `UserError` | Delete older versions, then create a new version. This error is terminal—retrying the same create call without deleting versions keeps failing. |
````

## S011 — Set up private networking for Foundry Agent Service

URL: https://learn.microsoft.com/azure/foundry/agents/how-to/virtual-networks
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S011.md`
Full snapshot SHA-256: `02eb40fb9bc5fcbd6b27249423b2d0ba26f5df0dd6b6885c881270a7a6fac8b9`

### Lines 58–74

````text
58: 
59: The provisioning identity depends on the deployment path. Capability settings that you submit through ARM REST or Bicep use the caller identity. Portal deployments and calls to the legacy capability host REST API continue to use the project managed identity for provisioning.
60: 
61: ### Caller permissions for provisioning
62: 
63: For a deployment that uses capability settings with API version `2026-07-15-preview`, the caller can be an interactive user, a CI/CD service principal, or a workload identity. In addition to the permissions needed to deploy the account and network resources, capability settings require only the following roles. Azure AI Search doesn't require a caller role.
64: 
65: | Role | Scope | Why the caller needs it |
66: | --- | --- | --- |
67: | **Storage Blob Data Contributor** | Each Azure Storage account you bring | Provision the required blob containers and storage setup |
68: | **Cosmos DB Operator** | Each Azure Cosmos DB account you bring | Provision the required Cosmos DB resources |
69: 
70: A caller that can create the Foundry account but lacks **Storage Blob Data Contributor** or **Cosmos DB Operator** fails capability settings provisioning.
71: 
72: ### Runtime access after deployment
73: 
74: The project managed identity is what running agents use to reach Azure Cosmos DB, Azure AI Search, and Azure Storage. Grant it data-plane roles on each resource before agents run. The caller roles in the previous table enable capability settings provisioning only. They don't replace the roles the project managed identity needs at runtime. For portal and legacy capability host REST API deployments, the project managed identity also performs provisioning. For the per-resource role list, see [Standard agent setup](../concepts/standard-agent-setup).
````

## S014 — Agent evaluators

URL: https://learn.microsoft.com/azure/foundry/concepts/evaluation-evaluators/agent-evaluators
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S014.md`
Full snapshot SHA-256: `0ce17b86785e87efb44074de9d3fdee3ae8290dedcb04a18a68558081be7103f`

### Lines 17–30

````text
17: | --- | --- | --- | --- | --- |
18: | Task Completion (preview) | System evaluation | Assessing end-to-end task success in workflow automation, goal-oriented AI interactions, or any scenario where full task completion is critical | Measures if the agent completed the requested task with a usable deliverable that meets all user requirements | Binary: Pass/Fail |
19: | Customer Satisfaction (preview) | System evaluation | Measuring overall user satisfaction across a conversation, detecting user frustration | Measures holistic user satisfaction across six dimensions: helpfulness, completeness, clarity, tone, resolution, and adaptability | 1-5 Likert scale |
20: | Task Adherence (preview) | System evaluation | Ensuring agents follow system instructions, validating compliance in regulated environments | Measures if the agent's actions adhere to its assigned tasks according to rules, procedures, and policy constraints, based on its system message and prior steps | Binary: Pass/Fail |
21: | Task Navigation Efficiency | System evaluation | Optimizing agent workflows, reducing unnecessary steps, validating against known optimal paths (requires ground truth) | Measures whether the agent made tool calls efficiently to complete a task by comparing them to expected tool sequences | Binary: Pass/Fail |
22: | Intent Resolution (preview) | System evaluation | Customer support scenarios, conversational AI, FAQ systems where understanding user intent is essential | Measures whether the agent correctly identifies the user's intent | Binary: Pass/Fail based on threshold (1-5 scale) |
23: | Tool Call Accuracy | Process evaluation | Overall tool call quality assessment in agent systems with tool integration, API interactions to complete its tasks | Measures whether the agent made the right tool calls with correct parameters to complete its task | Binary: Pass/Fail based on threshold (1-5 scale) |
24: | Tool Selection | Process evaluation | Validating tool choice quality in orchestration platforms, ensuring efficient tool usage without redundancy | Measures whether the agent selected the correct tools without selecting unnecessary ones | Binary: Pass/Fail |
25: | Tool Input Accuracy | Process evaluation | Strict validation of tool parameters in production environments, API integration tests, critical workflows requiring 100% parameter correctness | Measures if all tool call parameters are correct across six strict criteria: groundedness, type compliance, format compliance, required parameters, no unexpected parameters, and value appropriateness | Binary: Pass/Fail |
26: | Tool Output Utilization | Process evaluation | Validating correct use of API responses, database query results, search outputs in agent reasoning and responses | Measures if the agent correctly understood and used tool call results contextually in its reasoning and final response | Binary: Pass/Fail |
27: | Tool Call Success | Process evaluation | Monitoring tool reliability, detecting API failures, timeout issues, or technical errors in tool execution | Measures if tool calls succeeded or resulted in technical errors or exceptions | Binary: Pass/Fail |
28: | Quality Grader (preview) | Quality evaluation | Assesses overall response quality at the turn level, including relevance, abstention, answer completeness, and optionally groundedness and context coverage | Enables quality evaluation across multiple dimensions in a single evaluator instead of running individual evaluators separately | Binary: Pass/Fail |
29: | Output Quality (preview) | System and quality evaluation | Assessing response quality and task outcomes across several dimensions while reducing evaluation cost and latency | Batches Fluency, Coherence, Intent Resolution, Task Adherence, Groundedness, and Task Completion into one LLM judge call | Composite: component scores with Pass/Fail |
30: | Tool Use Quality (preview) | Process evaluation | Assessing the complete tool-use process while reducing evaluation cost and latency | Batches Tool Call Accuracy, Tool Call Success, Tool Input Accuracy, Tool Output Utilization, and Tool Selection into one LLM judge call | Composite: component scores with Pass/Fail |
````

## S018 — Video generation with Sora 2 (preview)

URL: https://learn.microsoft.com/azure/foundry/openai/concepts/video-generation
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S018.md`
Full snapshot SHA-256: `32257da44487ca802a87e1ebad7ef31dc91f45f034d3334fb60b1c7d53ffb808`

### Lines 633–635

````text
633: Call `GET /videos/{video_id}` with the ID returned from the create call. The response shows the job’s current status, progress percentage, and any errors.
634: 
635: Expected states are `queued`, `in_progress`, `completed`, and `failed`.
````

### Lines 666–675

````text
666: while video.status not in ["completed", "failed", "cancelled"]:
667:     print(f"Status: {video.status}. Waiting 20 seconds...")
668:     time.sleep(20)
669:     
670:     # Retrieve the latest status
671:     video = client.videos.retrieve(video.id)
672: 
673: # Final status
674: if video.status == "completed":
675:     print("Video successfully completed!")
````

### Lines 882–883

````text
882: content = client.videos.download_content(video_id, variant="video")
883: content.write_to_file("video.mp4")
````

### Lines 1131–1131

````text
1131: The remix feature allows you to modify specific aspects of an existing video while preserving its core elements. By referencing the previous video `id` from a successfully completed generation, and supplying an updated prompt the system maintains the original video's framework, scene transitions, and visual layout while implementing your requested changes. For optimal results, limit your modifications to one clearly articulated adjustment—narrow, precise edits retain greater fidelity to the source material and minimize the likelihood of generating visual defects.
````

### Lines 1147–1150

````text
1147: video = client.videos.remix(
1148:     video_id="<previous_video_id>",
1149:     prompt="Shift the color palette to teal, sand, and rust, with a warm backlight."
1150: )
````

### Lines 1201–1201

````text
1201: Video generation started: Video(id='video_68ff7cef76cc8190b7eab9395e936d9e', completed_at=None, created_at=1761574127, error=None, expires_at=None, model='sora-2', object='video', progress=0, remixed_from_video_id='video_68ff61490a908190a6808139c0c753d0', seconds='8', size='1280x720', status='queued')
````

## S026 — Integrated vector embedding in Azure AI Search

URL: https://learn.microsoft.com/azure/search/vector-search-integrated-vectorization
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S026.md`
Full snapshot SHA-256: `45a6b445fbe4f7f65334693eb96b2de7b021e0b50ce46b363ab47c5de0a11f0d`

### Lines 25–40

````text
25: 
26:     - A chunking strategy: [Text Split skill](cognitive-search-skill-textsplit), [Azure Content Understanding skill](cognitive-search-skill-content-understanding), or one of the [document parsing modes](vector-search-how-to-chunk-documents#common-chunking-techniques).
27:     - An embedding skill, used to generate vector arrays, which can be any of the following:
28: 
29:         - [AzureOpenAIEmbedding skill](cognitive-search-skill-azure-openai-embedding), attached to text-embedding-ada-002,text-embedding-3-small, text-embedding-3-large on Azure OpenAI.
30:         - [Custom skill](cognitive-search-custom-skill-web-api) that points to another embedding model on Azure or on another site.
31:         - [Azure Vision multimodal embeddings skill (preview)](cognitive-search-skill-vision-vectorize) that points to the multimodal API for Azure Vision.
32:         - [AML skill](cognitive-search-aml-skill) that points to select models in the Microsoft Foundry model catalog.
33: 
34: ## Using integrated vectorization in queries
35: 
36: For text-to-vector conversion during queries, you take a dependency on these components:
37: 
38: - A query that specifies one or more vector fields.
39: - A text string that's converted to a vector at query time.
40: - [A vectorizer](vector-search-how-to-configure-vectorizer), defined in the index schema, assigned to a vector field, and used automatically at query time to convert a text query to a vector. The vectorizer you set up must match the embedding model used to encode your content.
````

## S028 — Skillset concepts in Azure AI Search

URL: https://learn.microsoft.com/azure/search/cognitive-search-working-with-skillsets
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S028.md`
Full snapshot SHA-256: `3d24961260a3a7ca041656383016222704c25dec2dff53743bbaef628236312b`

### Lines 151–156

````text
151: There are two sets of mappings:
152: 
153: - ["fieldMappings"](search-indexer-field-mappings) map a source field to a search field.
154: - ["outputFieldMappings"](cognitive-search-output-field-mapping) map a node in an enriched document to a search field.
155: 
156: The "sourceFieldName" property specifies either a field in your data source or a node in an enrichment tree. The "targetFieldName" property specifies the search field in an index that receives the content.
````

## S029 — Document Layout skill

URL: https://learn.microsoft.com/azure/search/cognitive-search-skill-document-intelligence-layout
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S029.md`
Full snapshot SHA-256: `eb899b4d8c7fdd95e158072fa95891c8c96388f09c48c00a67683fa10ec4591a`

### Lines 7–7

````text
7: The **Document Layout** skill uses the [layout model](/en-us/azure/ai-services/document-intelligence/concept-layout) from Azure Document Intelligence in Foundry Tools to analyze a document, detect its structure and characteristics, and produce a syntactical representation in Markdown or text format. This skill supports text and image extraction, the latter of which includes location metadata that preserves image position within a document. Image proximity to related content is beneficial in retrieval-augmented generation (RAG) and [multimodal search](multimodal-search-overview) scenarios.
````

### Lines 74–75

````text
74: | `outputFormat` | `markdown` (default), `text` | Controls the format of the output generated by the skill. |
75: | `extractionOptions` | `["images"]`, `["images", "locationMetadata"]`, `["locationMetadata"]` | Identify any extra content extracted from the document. Define an array of enums that correspond to the content to be included in the output. For example, if `extractionOptions` is `["images", "locationMetadata"]`, the output includes images and location metadata that provide page location information related to where the content was extracted, such as a page number or section. This parameter applies to both output formats. |
````

## S037 — Structured outputs

URL: https://learn.microsoft.com/azure/foundry/openai/how-to/structured-outputs
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S037.md`
Full snapshot SHA-256: `0337c89ce3e5a9ba28d1c2fc18f1644c50b13568eb19edc43420d16b401cacfc`

### Lines 1–5

````text
1: # Structured outputs
2: 
3: Structured outputs make a model follow a [JSON Schema](https://json-schema.org/overview/what-is-jsonschema) definition that you provide as part of your inference API call. Both the Chat Completions API and Responses API support structured outputs. For Chat Completions, define the schema in `response_format`. For Responses, define the schema in `text.format`. This approach contrasts with the older [JSON mode](json-mode) feature, which guaranteed valid JSON but couldn't ensure strict adherence to the supplied schema. Use structured outputs for function calling, extracting structured data, and building complex multi-step workflows.
4: 
5: ::: zone pivot="programming-language-python"
````

### Lines 976–978

````text
976: 
977: ### All fields must be required
978: 
````

### Lines 1004–1004

````text
1004: 
````

### Lines 1036–1039

````text
1036: 
1037: ### Always set `additionalProperties: false` in objects
1038: 
1039: This property controls if an object can have other key value pairs that weren't defined in the JSON Schema. To use structured outputs, set this value to false.
````

## S039 — Retrieval-Augmented Generation (RAG) evaluators

URL: https://learn.microsoft.com/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S039.md`
Full snapshot SHA-256: `3b16c765be1f1479ac22e04cf9b293be767d473fc1cacb188b90751227074a4b`

### Lines 8–12

````text
8: | Retrieval | Process evaluation | You want to assess textual quality of retrieved context, but you don't have ground truths | Measures how relevant the retrieved context chunks are to addressing a query using an LLM judge | Binary: Pass/Fail based on threshold (1-5 scale) |
9: | Groundedness | System evaluation | You want a well-rounded groundedness definition that works with agent inputs, and bring your own GPT models as the LLM-judge | Measures how well the generated response aligns with the given context without fabricating content (precision aspect) | Binary: Pass/Fail based on threshold (1-5 scale) |
10: | Groundedness Pro (preview) | System evaluation | You want a strict groundedness definition powered by Azure AI Content Safety and use our service model | Detects if the response is strictly consistent with the context using the Azure AI Content Safety service | Binary: True/False |
11: | Relevance | System evaluation | You want to assess how well the RAG response addresses the query but don't have ground truths | Measures the accuracy, completeness, and direct relevance of the response to the query | Binary: Pass/Fail based on threshold (1-5 scale) |
12: | Response Completeness (preview) | System evaluation | You want to ensure the RAG response doesn't miss critical information (recall aspect) from your ground truth | Measures how completely the response covers the expected information compared to ground truth | Binary: Pass/Fail based on threshold (1-5 scale) |
````

## S040 — Connect an Azure AI Search index to Foundry agents

URL: https://learn.microsoft.com/azure/foundry/agents/how-to/tools/ai-search
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S040.md`
Full snapshot SHA-256: `67830020b25de8c993ae294ff523035ad2c04c16865c1fe7222f053769316545`

### Lines 5–5

````text
5: If you want to use a private virtual network with the Azure AI Search tool, make sure you use Microsoft Entra project managed identity to authenticate in your Azure AI Search connection. Key-based authentication isn't supported with private virtual networking.
````

### Lines 45–47

````text
45: - For keyless authentication, use the system-assigned managed identity of the Foundry account that contains your project. Assign these Azure role-based access control (RBAC) roles to that identity on the search service:
46:     - **Search Index Data Contributor**
47:     - **Search Service Contributor**
````

### Lines 881–892

````text
881: 
882:     1. From the left pane, select **Settings** &gt; **Keys**.
883:     2. Select **Both** to enable both key-based and keyless authentication, which is recommended for most scenarios.
884: 
885:     [![A screenshot of an AI Search resource Keys tab in the Azure portal.](../../media/tools/ai-search/azure-portal.png)](../../media/tools/ai-search/azure-portal.png#lightbox)
886: 4. To assign the necessary roles:
887: 5. On the Foundry account in the Azure portal, select **Identity**, and copy the **Object (principal) ID** for the system-assigned managed identity.
888: 6. From the left pane, select **Access control (IAM)**.
889: 7. Select **Add** &gt; **Add role assignment**.
890: 8. Assign the **Search Index Data Contributor** role to the managed identity whose object ID you copied.
891: 9. Repeat the role assignment for **Search Service Contributor**.
892: 10. In **Access control (IAM)**, select **Check access**, search for the object ID, and verify that both roles appear.
````

## S042 — QuickStart: Analyze image content

URL: https://learn.microsoft.com/azure/ai-services/content-safety/quickstart-image
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S042.md`
Full snapshot SHA-256: `6a40b6fdabe9e2a91838a3026f8530d0229c70acd401c4fab094a6c0c63b8670`

### Lines 33–33

````text
33: 3. Select **Run test**. The service returns all the categories that were detected, with the severity level for each: 0-Safe, 2-Low, 4-Medium, 6-High. It also returns a binary **Accepted**/**Rejected** result, based on the filters you configure. Use the matrix in the **Configure filters** tab on the right to set your allowed/prohibited severity levels for each category. Then you can run the text again to see how the filter works.
````

### Lines 93–102

````text
93: curl --location --request POST '<endpoint>/contentsafety/image:analyze?api-version=2024-09-01' \
94: --header 'Ocp-Apim-Subscription-Key: <your_subscription_key>' \
95: --header 'Content-Type: application/json' \
96: --data-raw '{
97:   "image": {
98:     "content": "<base_64_string>"
99:   },
100:   "categories": ["Hate", "SelfHarm", "Sexual", "Violence"],
101:   "outputType": "FourSeverityLevels"
102: }'
````

### Lines 125–129

````text
125: | Name | Required? | Description | Type |
126: | --- | --- | --- | --- |
127: | **content** | Required | The content or blob URL of the image. I can be either base64-encoded bytes or a blob URL. If both are given, the request is refused. The maximum allowed size of the image is 7,200 x 7,200 pixels, and the maximum file size is 4 MB. The minimum size of the image is 50 pixels x 50 pixels. | String |
128: | **categories** | Optional | This is assumed to be an array of category names. See the [Harm categories guide](concepts/harm-categories) for a list of available category names. If no categories are specified, all four categories are used. We use multiple categories to get scores in a single request. | String |
129: | **outputType** | Optional | Image moderation API only supports `"FourSeverityLevels"`. Output severities in four levels. The value can be `0,2,4,6` | String |
````

## S043 — OCR cognitive skill

URL: https://learn.microsoft.com/azure/search/cognitive-search-skill-ocr
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S043.md`
Full snapshot SHA-256: `0a5cdd696dcbae744d32db7fd89a69926f0203462f86d6dc25793ab07d001b3d`

### Lines 46–55

````text
46: | `image` | Complex Type. Currently only works with "/document/normalized\_images" field, produced by the Azure blob indexer when `imageAction` is set to a value other than `none`. |
47: 
48: ## Skill outputs
49: 
50: | Output name | Description |
51: | --- | --- |
52: | `text` | Plain text extracted from the image. |
53: | `layoutText` | Complex type that describes the extracted text and the location where the text was found. |
54: 
55: If you call OCR on images embedded in PDFs or other application files, the OCR output will be located at the bottom of the page, after any text that was extracted and processed.
````

## S046 — How to recognize and translate speech

URL: https://learn.microsoft.com/azure/ai-services/speech-service/how-to-translate-speech
Local snapshot: `packs/ai-103/1.1.0/sources/snapshots/S046.md`
Full snapshot SHA-256: `8a73fb1e63f49dde972815b860758a57ff3d620842220f9e29200bccf573c39e`

### Lines 76–95

````text
76:     from_language = "it-IT"
77:     translation_config.speech_recognition_language = from_language
78: ```
79: 
80: The `speech_recognition_language` property expects a language-locale format string. Refer to the [list of supported speech translation locales](language-support?tabs=speech-translation).
81: 
82: ## Add a translation language
83: 
84: Another common task of speech translation is to specify target translation languages. At least one is required, but multiples are supported. The following code snippet sets both French and German as translation language targets:
85: 
86: ```python
87: def translate_speech_to_text():
88:     translation_config = speechsdk.translation.SpeechTranslationConfig(
89:             subscription=speech_key, region=service_region)
90: 
91:     translation_config.speech_recognition_language = "it-IT"
92: 
93:     # Translate to languages. See, https://aka.ms/speech/sttt-languages
94:     translation_config.add_target_language("fr")
95:     translation_config.add_target_language("de")
````

### Lines 102–118

````text
102: After you created a [`SpeechTranslationConfig`](/en-us/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.translation.speechtranslationconfig) instance, the next step is to initialize [`TranslationRecognizer`](/en-us/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.translation.translationrecognizer). When you initialize `TranslationRecognizer`, you need to pass it your `translation_config` instance. The configuration object provides the credentials that the Speech service requires to validate your request.
103: 
104: If you're recognizing speech by using your device's default microphone, here's what `TranslationRecognizer` should look like:
105: 
106: ```python
107: def translate_speech_to_text():
108:     translation_config = speechsdk.translation.SpeechTranslationConfig(
109:             subscription=speech_key, region=service_region)
110: 
111:     translation_config.speech_recognition_language = from_language
112:     translation_config.add_target_language(to_language)
113: 
114:     translation_recognizer = speechsdk.translation.TranslationRecognizer(
115:             translation_config=translation_config)
116: ```
117: 
118: If you want to specify the audio input device, then you need to create an [`AudioConfig`](/en-us/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audioconfig) class instance and provide the `audio_config` parameter when initializing `TranslationRecognizer`.
````

### Lines 134–137

````text
134: 
135:     audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
136:     translation_recognizer = speechsdk.translation.TranslationRecognizer(
137:             translation_config=translation_config, audio_config=audio_config)
````

### Lines 174–185

````text
174:     translation_recognizer = speechsdk.translation.TranslationRecognizer(
175:             translation_config=translation_config)
176:     
177:     print('Say something...')
178:     translation_recognition_result = translation_recognizer.recognize_once()
179:     print(get_result_text(reason=translation_recognition_result.reason, result=translation_recognition_result))
180: 
181: def get_result_text(reason, translation_recognition_result):
182:     reason_format = {
183:         speechsdk.ResultReason.TranslatedSpeech:
184:             f'RECOGNIZED "{from_language}": {translation_recognition_result.text}\n' +
185:             f'TRANSLATED into "{to_language}"": {translation_recognition_result.translations[to_language]}',
````

### Lines 340–342

````text
340: 
341: You can use the [`translations`](/en-us/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.translation.translationrecognitionresult#translations) dictionary to synthesize audio from the translation text. Iterate through each translation and synthesize it. When you're creating a `SpeechSynthesizer` instance, the `SpeechConfig` object needs to have its [`speech_synthesis_voice_name`](/en-us/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig#speech-synthesis-voice-name) property set to the desired voice.
342: 
````

### Lines 373–386

````text
373:         "zh-Hans": "zh-CN-XiaoxiaoNeural"
374:     }
375:     print(f'Recognized: "{translation_recognition_result.text}"')
376: 
377:     for language in translation_recognition_result.translations:
378:         translation = translation_recognition_result.translations[language]
379:         print(f'Translated into "{language}": {translation}')
380: 
381:         speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
382:         speech_config.speech_synthesis_voice_name = language_to_voice_map.get(language)
383:         
384:         audio_config = speechsdk.audio.AudioOutputConfig(filename=f'{language}-translation.wav')
385:         speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
386:         speech_synthesizer.speak_text_async(translation).get()
````

