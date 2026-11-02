"""Multiple-select, sequence and matching items for the two practice sets."""
from content import item, SETS

# Five planning multiple-select questions per set.
item('A','A','S010 S011',
 """An Entra-authenticated agent must query Search over private networking. The endpoint exists, but DNS resolves publicly and the runtime identity lacks Search access. Which TWO changes address the observed blockers?""",
 """*Correct private DNS resolution from the agent network.|*Grant the required Search role to the actual runtime principal.|Grant the same role to the developer account used to create the endpoint.~Developer permissions do not authorize the runtime.|Keep public DNS resolution and rotate the client's Entra token.~Token rotation does not repair the network path.|Increase Search replicas to provide capacity for private connections.~Replica count does not correct DNS or missing authorization.""",
 """Private access needs both a working private network path and authorization for the caller. Fix the two independently identified failures.""",difficulty='hard')
item('B','A','S010 S011',
 """A developer can query Search privately, but an agent is denied. The team wants to establish whether the agent has equivalent access. Which TWO observations are directly relevant?""",
 """*The address and route used from the agent's runtime network.|*The connection principal and its role scope on the Search resource.|The roles assigned to the developer's interactive account.~Those belong to a different caller.|The resource region displayed beside the agent's model deployment.~That does not establish Search network reachability or access.|The final answer style requested in the agent's instructions.~Answer style does not determine service authorization.""",
 """Check the agent's own network path and identity. A developer's successful request does not establish either for a separate runtime.""",difficulty='hard')
item('A','A','S005 S004',
 """A deployment review compares an EU Data Zone Standard model endpoint with Foundry managed-compute preview. Which TWO statements accurately describe these choices?""",
 """*Data Zone Standard defines a processing boundary and usage-based charging.|*Managed-compute quota is scoped by accelerator SKU and region.|Unused Azure GPU VM quota is directly reusable by managed compute.~The managed-compute allocation is separate.|An EU resource location gives Global Standard the same processing boundary as EU Data Zone.~The Global processing boundary is broader.|Changing a serverless deployment to Batch preserves synchronous response behavior.~Batch uses asynchronous processing.""",
 """Deployment type determines inference processing and billing behavior. The managed-compute preview has its own SKU-and-region accelerator quota.""",difficulty='hard')
item('B','A','S005',
 """A job can wait for asynchronous results, but its data-processing policy still restricts geography. Which TWO considerations belong in its deployment decision?""",
 """*Select a supported Batch deployment for the deferred workload.|*Choose a deployment boundary consistent with the processing policy.|Use Global Batch because asynchronous completion removes geographic restrictions.~Completion mode does not waive data policy.|Use a resource name containing EU as proof of EU processing.~Naming does not establish a processing boundary.|Choose Provisioned solely because it supports multiple requests.~Concurrency alone does not identify the appropriate batch billing and completion model.""",
 """Completion model and geography remain separate requirements. Batch can fit deferred work, but its boundary must also satisfy the policy.""",difficulty='hard')
item('A','A','S013',
 """An observability design must diagnose slow tool calls and connect them to low-scoring evaluation runs. Tool payloads may contain secrets. Which TWO measures belong in the design?""",
 """*Use nested operation spans with request and evaluation correlation identifiers.|*Redact sensitive payload fields before exporting telemetry.|Assign unrelated request identifiers at each service boundary.~That prevents a connected request journey.|Export credentials to a restricted workspace for exact request reproduction.~Credentials should not enter telemetry.|Replace timed spans with a daily average latency metric.~A daily aggregate cannot isolate the operation in an individual scored request.""",
 """Structured, correlated traces support diagnosis. Redaction before storage preserves that value while excluding sensitive content.""",difficulty='hard')
item('B','A','S013',
 """A trace has operation timing and redacted content, but evaluation IDs are missing and access is broader than the logging policy permits. Which TWO changes address these gaps?""",
 """*Add evaluation-to-request correlation identifiers.|*Apply the required trace-storage access and retention controls.|Record raw tool credentials to make correlation easier.~Credentials are not correlation identifiers.|Remove operation timings because content is already redacted.~Timing remains useful diagnostic information.|Create one new trace ID per span to avoid shared identifiers.~That breaks request relationships.""",
 """Correlation connects outcomes to their request traces. Storage access and retention controls apply to traces as they do to operational logs.""",difficulty='hard')
item('A','A','S009',
 """A hosted-agent client encounters transient regional_session_quota_exceeded. Model token capacity is available. Moving regions is allowed, but preserving session state matters. Which TWO documented responses are appropriate?""",
 """*Use exponential backoff with jitter for transient failures.|*Assess an allowed regional alternative if regional capacity remains constrained.|Increase token quota as the direct remedy for this session error.~The reported limit is regional session capacity.|Delete required state as the first response to an intermittent regional failure.~That violates the state requirement and misdiagnoses the transient limit.|Retry continuously with no delay to reserve the next free session.~Aggressive retries do not follow the documented backoff approach.""",
 """Use code-specific remedies. Backoff handles transient regional failures; an alternative region can be considered when the workload permits it.""")
item('B','A','S009',
 """Two failures occur: session_quota_exceeded with unneeded active sessions, and model-token throttling on sustained traffic. Which TWO diagnoses are correctly scoped?""",
 """*Review active sessions when addressing the session limit.|*Review underlying model throughput for the token throttling.|Use Search storage expansion as the remedy for both failures.~Search storage is neither reported constraint.|Treat both errors as evidence of invalid Entra credentials.~Authentication and quota are different failure classes.|Stop sessions as proof that model token throughput has increased.~Session cleanup does not allocate more model throughput.""",
 """Agent-service limits and underlying model quotas coexist. Read the returned code and address the resource implicated by that failure.""",difficulty='hard')
item('A','A','S012',
 """A GitHub deployment workflow should avoid long-lived credentials and deploy into one approved project. Which TWO elements are required by that design?""",
 """*A configured federated OIDC trust for the workflow identity.|*Deployment permissions at the intended resource scope.|A project endpoint variable used as a bearer credential.~The endpoint is configuration, not authentication.|The agent's conversation ID used as the federation issuer.~A conversation identifier does not define the GitHub identity trust.|An owner role on an unrelated subscription to cover deployment anywhere.~An unrelated scope does not authorize the target project.""",
 """Federation establishes trusted token acquisition; role assignments authorize deployment at the correct scope. Non-secret project variables configure the target.""")
item('B','A','S014 S039',
 """An agent obeys policy but omits requested deliverables and invents one fact absent from retrieved context. Which TWO evaluations directly target the described quality defects?""",
 """*Task Completion (preview) for the missing deliverables.|*Groundedness for contextual support of the generated fact.|Task Adherence as the direct measure of missing deliverables.~The scenario states that policy is obeyed; completion is the missing outcome.|Tool Input Accuracy as proof of the invented final claim.~Argument accuracy does not establish support for generated claims.|Search latency as the completeness measure.~Timing does not measure answer coverage.""",
 """Task completion and groundedness address separate defects: unfinished user outcomes and unsupported generated content.""",difficulty='hard')

# Five generative/agent multiple-select questions per set.
item('A','B','S007',
 """An agent proposes a refund. The application requires user confirmation, and the model supplies untrusted arguments. Which TWO host responsibilities are needed before the side effect?""",
 """*Validate the arguments and authorize the target account.|*Obtain confirmation for the specific proposed refund.|Treat valid JSON as sufficient permission to issue the refund.~Syntax does not establish authorization or approval.|Execute the refund before displaying its confirmation dialog.~Confirmation would occur after the side effect.|Return the payment credential to the model for approval checking.~The host should keep secrets out of tool results.""",
 """The host must validate and authorize the operation, then obtain confirmation before executing that approved proposal.""",difficulty='hard')
item('B','B','S007',
 """Two tool calls finish concurrently and one result contains a secret in an error message. Which TWO output-handling rules apply?""",
 """*Return each result with its originating call_id.|*Sanitize sensitive error content before returning it to the model.|Associate both outputs with the common function name.~The calls require distinct correlation identifiers.|Use result completion order as the identifier contract.~Completion order does not replace call_id.|Keep the error intact because it came from an internal service.~Internal results may still contain secrets or untrusted content.""",
 """Preserve the call relationship and minimize sensitive output. These are independent obligations even when execution is concurrent.""",difficulty='hard')
item('A','B','S037',
 """A strict Responses output must contain code and comment. Comment may be null, and additional fields are prohibited. Which TWO schema decisions satisfy those constraints?""",
 """*Keep comment required and allow its type to include null.|*Set additionalProperties to false on the object schema.|Omit comment from required when its value is unavailable.~The contract requires the property to be present.|Allow arbitrary extra fields and validate just the required names.~The contract prohibits additional fields.|Represent absent comment as an omitted property with no nullable type.~That changes both presence and value semantics.""",
 """Use required nullable fields for optional information and disallow additional properties. The supported strict subset treats presence and nullability separately.""")
item('B','B','S037',
 """A client moves strict structured output from Chat Completions to Responses. Which TWO implementation details need to be handled correctly?""",
 """*Place the response format in Responses text.format.|*Handle refusal outcomes separately from successful structured results.|Keep response_format in the same top-level position as Chat Completions.~The destination API uses a different request location.|Treat JSON parsing success as full compliance with the business schema.~Valid JSON alone does not demonstrate schema adherence.|Remove required nullable fields to reduce the request size.~That changes the intended output contract.""",
 """Adapt the API-specific format location and preserve robust handling of non-success outcomes such as refusals.""",difficulty='hard')
item('A','B','S025 S026',
 """A RAG system must find exact equipment identifiers and semantic paraphrases. It uses a vector index built with model X. Which TWO design choices fit?""",
 """*Combine keyword and vector retrieval through hybrid search.|*Use query embeddings compatible with the indexed model X vectors.|Use an unrelated model with matching dimensions as proof of vector compatibility.~Dimension equality does not establish a shared representation.|Replace embeddings with semantic reranking during ingestion.~Reranking does not generate stored vectors.|Sort hybrid candidates by filename after RRF to preserve relevance.~Filename order is not relevance ranking.""",
 """Hybrid retrieval supplies complementary lexical and semantic signals. Vector relevance also depends on compatible query and content representations.""",difficulty='hard')
item('B','B','S039',
 """A RAG evaluation needs to distinguish search quality from unsupported generation. Labeled query-document judgments and generated answers with context are available. Which TWO assessments fit?""",
 """*Evaluate document retrieval against the relevance judgments.|*Evaluate groundedness against each answer's supplied context.|Use answer relevance as proof that all claims are context-supported.~Relevance and support are different properties.|Use retrieval latency as a replacement for relevance judgments.~Latency measures operations rather than retrieval quality.|Use token count as the amount of ground-truth support.~Length does not establish evidence support.""",
 """Evaluate each pipeline stage with evidence appropriate to it: labeled retrieval results for search and context-grounded claims for generation.""",difficulty='hard')
item('A','B','S015 S016',
 """An agent receives hostile user prompts and malicious instructions inside retrieved text. Which TWO controls align with those different entry points?""",
 """*Assess direct user attacks at the input boundary.|*Treat retrieved-document instructions as lower-trust indirect attacks.|Treat tool output as a new developer message when it names a system role.~Text inside a result does not acquire a privileged role.|Approve retrieved instructions because the source URL uses HTTPS.~Transport security does not establish instruction authority.|Scan final answers as proof that proposed tool calls were safe before execution.~A final scan occurs after earlier tool actions.""",
 """User input and retrieved content create different attack paths. Apply controls at the relevant boundaries and preserve instruction authority.""",difficulty='hard')
item('B','B','S015',
 """A purchase agent needs to prevent unsafe actions and inspect receipts returned by the vendor tool. Which TWO intervention points correspond to those requirements?""",
 """*Tool-call inspection before the proposed purchase executes.|*Tool-response inspection before returned vendor content is used.|Final-output inspection used as prior approval of the purchase.~A final output check cannot approve a completed side effect in advance.|User-input scanning used as inspection of the later vendor receipt.~The receipt is not present at the original input boundary.|Deployment-time validation used as approval for each future purchase.~Deployment checks do not inspect individual runtime proposals.""",
 """Tool-call and tool-response interventions protect different sides of execution. A deployment or final-answer check does not substitute for either boundary.""",difficulty='hard')
item('A','B','S006',
 """A support agent needs a remembered user preference, current corporate policy and a receipt uploaded for this interaction. Which TWO assignments are appropriate?""",
 """*Use persistent memory for interaction-derived preferences.|*Use the knowledge base for policy and file search for the receipt.|Use conversation state as the cross-session preference store.~Session state is short-term context.|Use memory as the maintained full-text corporate policy repository.~Curated policy belongs in a maintained knowledge source.|Use the temporary receipt as the source of the company's standing policy.~The uploaded transaction document is not the curated policy authority.""",
 """Memory, curated knowledge and temporary document search serve different information needs. Assign each source according to its origin and lifecycle.""")
item('B','B','S002 S003',
 """A new Foundry Python app uses azure-ai-projects 2.8.0 and needs Responses plus project operations. Which TWO setup choices follow the documented client pattern?""",
 """*Initialize AIProjectClient with the Foundry project endpoint and Entra credentials.|*Obtain its OpenAI client through get_openai_client().|Use the Azure OpenAI inference endpoint as the project-management endpoint.~The endpoint families expose different operations.|Use a resource key as the AIProjectClient credential.~The specified client supports Entra authentication.|Mix classic 1.0.0 project examples into the 2.x request builder unchanged.~Version-specific examples must match the client contract.""",
 """Use a coherent 2.x project endpoint and authentication setup, then obtain the supported inference client from AIProjectClient.""")

# Three vision multiple-select questions per set.
item('A','C','S042',
 """An image safety policy evaluates four harm categories and rejects any severity of 4 or 6. Which TWO implementation decisions match the image:analyze 2024-09-01 contract?""",
 """*Request FourSeverityLevels for the image analysis.|*Evaluate the policy against each of the four harm categories.|Use EightSeverityLevels as the documented image output scale.~The referenced image contract uses four levels.|Treat HTTP success as an approval verdict.~Success means the analysis request completed.|Average all categories before applying the rejection threshold.~An average does not implement an any-category policy.""",
 """The image contract uses values 0, 2, 4 and 6. Analyze the required categories and apply the application's explicit threshold policy.""")
item('B','C','S050',
 """A site has an image-only download button and a decorative border. Which TWO accessibility choices fit their functions?""",
 """*Give the button an alternative naming its download action.|*Use an empty alt attribute for the decorative border.|Describe the button's pixels without naming the action.~Functional images need an action or destination label.|Omit alt from the decorative border and rely on its filename.~An explicit empty alt identifies decorative content.|Use the same 'image' label for both elements.~That does not communicate the button function or mark the decoration properly.""",
 """Alternative text depends on purpose. Communicate the action for a functional image and use empty alt for a purely decorative image.""")
item('A','C','S017',
 """A model supports masked image edits. The client must change one area of an existing image. Which TWO inputs are directly relevant to the edit definition?""",
 """*The source image and a prompt describing the intended change.|*A mask matching the source-image dimensions.|The output image count used as a pixel-region selector.~Count controls outputs, not spatial edit boundaries.|A JSON response schema specifying the image's subject.~A text schema is not an edit mask.|The chat model temperature used to resize the source.~Temperature does not resize an image or define the edit region.""",
 """A supported edit request uses the source, edit instructions and spatial mask. Model-specific controls and input requirements still apply.""")
item('B','C','S019 S017',
 """A product offers photograph descriptions and image edits. Which TWO API-design distinctions should it preserve?""",
 """*Vision chat receives supported image content alongside text instructions.|*Image editing uses the selected image model's supported edit inputs.|A photograph filename in plain text supplies the image pixels to a remote model.~A local filename is not image content.|A captioning response is itself the edited image asset.~Description and image generation are different outputs.|All image deployments accept the same mask and quality settings.~Controls vary by model.""",
 """Image understanding and image editing have different request and response contracts. Provide actual visual inputs and use model-specific editing capabilities.""")
item('A','C','S022',
 """A team evaluates the documented video-analysis preview for fast events and tiny labels. Which TWO limitations belong in its evaluation plan?""",
 """*About one-frame-per-second sampling can miss brief events.|*Resizing to 512 by 512 can lose small or distant details.|A longer output summary guarantees observation of unsampled frames.~Output length cannot recover unobserved evidence.|More natural-language categories increase the original video resolution.~Categories guide analysis rather than changing the source pixels.|Successful job completion proves all source frames were inspected.~Execution success does not alter the sampling contract.""",
 """Evaluate the feature against its temporal and spatial resolution. Do not interpret a missing detection as proof that the original video lacks an event or detail.""")
item('B','C','S022',
 """An analyzer uses enableSegment and natural-language contentCategories for customized video analysis. Which TWO planning statements follow the documented behavior?""",
 """*Segmentation controls the granularity of video analysis.|*Segmentation can consume model tokens even when no fields are defined.|Removing all fields makes segmentation token-free.~The documented segmentation process can still consume tokens.|A content category is a command to preserve all original frames.~Categories are not a lossless frame-sampling control.|Disabling segmentation guarantees detection of subsecond events.~Sampling limits still apply.""",
 """Video segmentation and requested categories affect how content is analyzed. Their cost and sampling constraints should be assessed separately.""")

# Two text multiple-select questions per set.
item('A','D','S034',
 """A domain recognizer needs improvement and a useful accuracy estimate before rollout. Which TWO activities support that workflow?""",
 """*Use representative domain recordings and transcriptions for customization.|*Compare the selected model with a baseline on held-out evaluation data.|Evaluate solely on the same recordings used to train the model.~Training-set performance is not a held-out comparison.|Change the synthesizer voice to repair recognition errors.~Synthesis pronunciation is distinct from recognition.|Select the largest training archive regardless of transcription quality.~Unreliable labels undermine customization and evaluation.""",
 """Custom Speech uses domain data for training and evaluation. Representative held-out recordings support a meaningful comparison with the base recognizer.""")
item('B','D','S031',
 """A team compares extractive and abstractive summaries for an evidence-sensitive workflow. Which TWO statements are accurate?""",
 """*Extractive summarization selects sentences from the source.|*Abstractive summarization creates a compact rewording of the content.|An abstractive summary's fluent style establishes its factual support.~Fluency does not establish fidelity.|An extractive summary necessarily covers every important source point.~Selection can omit important material.|A summarization API converts a source citation into independent verification.~Source references support review but do not perform it.""",
 """The two methods differ in whether they select or generate wording. Both need evaluation for the workflow's coverage and fidelity requirements.""")
item('A','D','S046',
 """A Speech SDK app must translate English speech into German and speak the translated result. Which TWO stages are configured correctly?""",
 """*Recognize en-US input and configure de as a translation target.|*Send the successful German translation text to the synthesis step.|Set the recognition source to de-DE because German is the output.~The recognition language must match the spoken source.|Read the en-US entry as the German translation.~Target translations are keyed by the configured target language.|Treat setting the translation target as execution of a separate synthesizer.~Translation configuration does not mean that synthesis has run.""",
 """Recognition source, translation target and synthesis are distinct parts of the flow. Read the target-language text before synthesizing that text.""")
item('B','D','S030',
 """A routing pipeline must choose the language-specific queue and locate personal identifiers for redaction. Which TWO Language capabilities directly fit?""",
 """*Language detection for identifying the text's language.|*PII detection for locating personal information.|Sentiment analysis used as the language identifier.~Emotional tone is a different output.|General NER used as proof that all personal information was redacted.~Entity categories do not establish completion of a PII workflow.|Abstractive summarization used as the source language label.~A summary is not a language-detection result.""",
 """Use task-specific outputs: language detection for routing and PII detection to support redaction. Apply and verify the redaction separately.""")

# Three extraction multiple-select questions per set.
item('A','E','S043 S028',
 """A blob OCR pipeline has imageAction none and incorrectly maps a skill-produced text node with fieldMappings. Which TWO changes repair the data path?""",
 """*Generate normalized images for the OCR skill input.|*Map enriched OCR text into the index with outputFieldMappings.|Keep imageAction none and use a larger searchable field.~Field size does not create normalized images.|Move the OCR text mapping into the semantic query request.~A query does not configure enrichment output ingestion.|Use the embedding dimension as the OCR imageAction value.~Vector dimensions are not image processing configuration.""",
 """OCR needs normalized image inputs, and the enrichment output needs a mapping to the target index field. Fix both sides of the pipeline.""",difficulty='hard')
item('B','E','S045',
 """An invoice workflow must route uncertain values to reviewers and let them locate the supporting text. Which TWO retained outputs meet those needs?""",
 """*The estimated field confidence for review routing.|*Source page, coordinate or span references for evidence lookup.|A model deployment name used as the evidence location.~It identifies the model, not the source passage.|The formatted amount stripped of all source metadata.~The value alone cannot locate supporting evidence.|A high confidence score treated as an authorization to pay.~Confidence is not business authorization.""",
 """Confidence and grounding serve complementary purposes: deciding what to review and finding the source evidence for that review.""")
item('A','E','S021 S020',
 """A team uses Content Understanding SDK 1.1.0 for production document extraction. Which TWO implementation choices align with the referenced contract?""",
 """*Use capabilities compatible with its 2025-11-01 API version.|*Wait for analysis completion before consuming the structured result.|Mix preview-only analyzer fields into the request with no version change.~The feature and API versions must be compatible.|Treat the initial poller as completed Markdown content.~The poller represents the long-running operation.|Submit the same document repeatedly as a substitute for polling.~Repeated submission creates additional operations.""",
 """Match the SDK's supported API and follow the asynchronous analysis lifecycle. Completed structured content is available after successful completion.""")
item('B','E','S026',
 """Long source documents and persistent embedding throttling block a Search vectorization pipeline. Which TWO adjustments directly address these separate constraints?""",
 """*Chunk content to fit the embedding model's input limits.|*Align ingestion demand with available embedding-model quota.|Increase chat response length to enlarge embedding input capacity.~Chat generation limits do not change embedding limits.|Retry the unchanged workload indefinitely to create more quota.~Retries do not allocate persistent capacity.|Replace query vectors with unrelated same-length numerical arrays.~Arbitrary vectors do not preserve semantic retrieval.""",
 """Input size and throughput quota are different embedding constraints. Chunking addresses document size; capacity or scheduling changes address sustained quota exhaustion.""",difficulty='hard')
item('A','E','S045',
 """A custom analyzer must extract an amount from unfamiliar invoice layouts and support reviewer verification. Which TWO features or inputs are useful?""",
 """*Representative labeled examples with verified field values.|*Field source and confidence estimation for the extraction results.|Generated explanations used as substitutes for labeled source values.~Explanations are not verified labels.|A high confidence threshold used as proof that all accepted values are correct.~Thresholding does not create a correctness guarantee.|Removing source coordinates to standardize the JSON shape.~That discards useful evidence references.""",
 """Good labeled examples support extraction quality; confidence and grounding support review. Neither should be confused with independent verification.""")
item('B','E','S025 S028',
 """A Search solution must index skill-generated text and then combine exact-term and semantic retrieval. Which TWO configurations belong at the appropriate stages?""",
 """*Use outputFieldMappings for the enriched text's index field.|*Use hybrid search to combine keyword and vector result lists.|Use fieldMappings to read an enrichment node as an original source field.~The node was generated by a skill.|Use semantic reranking as the source-to-index field mapper.~Reranking is a query stage.|Use a query filter to generate document embeddings during ingestion.~Filters do not create stored vectors.""",
 """Separate ingestion and retrieval responsibilities. Output mappings populate enriched fields, while hybrid retrieval combines complementary ranking signals.""",difficulty='hard')

def sequence(set_id, domain, sources, stem, steps, why):
    SETS[set_id].append(dict(domainId=domain,sourceIds=sources.split(),stem=stem,
        type='sequence_order',difficulty='medium',orderedSteps=steps,
        explanation=dict(whyCorrect=why,whyDistractorsWrong={})))

# Ten dependency-based sequence items per set: A3, B2, C1, D2, E2.
sequence('A','A','S013',
 """A telemetry pipeline must preserve correlation and prevent secrets from reaching storage. Arrange this specific data path from collection to evaluation-linked diagnosis.""",
 ['Collect operation spans with request identifiers.','Redact sensitive span fields before export.','Export the sanitized spans to the telemetry store.','Use retained request and evaluation identifiers to investigate scored runs.'],
 'Collection supplies the spans, redaction precedes storage, and the stored correlated traces support diagnosis. Access and retention controls also apply.')
sequence('B','A','S013',
 """A support run has already been evaluated and its score is low. Arrange the prescribed investigation: start from the evaluation record, locate its trace, inspect the slow child operation, then record the diagnosis.""",
 ['Read the evaluation run identifier and linked request identifier.','Locate the corresponding request trace.','Inspect the timed child spans to identify the slow operation.','Record the operation-level diagnosis with its correlation references.'],
 'The identifiers connect the evaluation to the request; nested timing then identifies the operation supporting the diagnosis.')
sequence('A','A','S009',
 """Regional moves are prohibited. Arrange this incident response for regional_session_quota_exceeded, where policy requires suitable retry before escalation.""",
 ['Identify the returned error as a regional session-capacity limit.','Apply exponential backoff with jitter to the transient failure.','Confirm that the same regional failure persists after appropriate retries.','Open an Azure support request with the persistent failure details.'],
 'Code-specific diagnosis comes first. The scenario requires backoff before treating the problem as persistent and escalating it.')
sequence('B','A','S010 S011',
 """A private endpoint exists. Troubleshooting policy requires confirming DNS, then network reachability, then checking authorization after an actual denial. Arrange this investigation.""",
 ['Resolve the service hostname from the agent runtime network.','Confirm connectivity to the resulting private endpoint address.','Inspect the denied request to identify its runtime connection principal.','Check that principal\'s required role assignments on the target resource.'],
 'This prescribed procedure separates DNS and network access from identity authorization. Developer access is not substituted for runtime evidence.')
sequence('A','A','S012',
 """The federated identity and roles are already provisioned. Arrange the runtime deployment path: obtain a token through the configured trust, use it to deploy, invoke the deployed agent, then inspect that invocation.""",
 ['Obtain an Entra token through the workflow\'s configured OIDC federation.','Deploy the hosted agent using the authorized workflow identity.','Invoke the newly deployed agent with the intended request.','Inspect the invocation outcome and associated operational evidence.'],
 'Token acquisition precedes the authorized deployment call; invocation requires the deployed target, and its outcome can then be inspected.')
sequence('B','A','S005',
 """A deployment decision follows the company checklist in this order: geography, completion mode, billing, then supported model availability. Arrange the checks for a deferred document-classification job.""",
 ['Identify the permitted inference processing boundary.','Confirm that asynchronous batch completion fits the job.','Select the compatible batch charging and deployment choice.','Check that the required model and capacity are available for that choice.'],
 'The ordering is specified by the scenario checklist. Deployment type decisions combine geography, completion and charging, followed by model availability checks.')
sequence('A','B','S007',
 """A model has proposed a side-effecting function call. Arrange the host flow where business validation must pass before approval is requested.""",
 ['Validate the proposed arguments and caller authorization.','Obtain confirmation for the validated proposed action.','Execute the approved action with the scoped host identity.','Return the sanitized result using the originating call_id.'],
 'Validation precedes the requested confirmation; execution follows approval, and the actual result is correlated back to the originating call.')
sequence('B','B','S007',
 """A read-only function call has been returned by Responses. Arrange this continuation path: execute validated input, sanitize the result, return it with its identifier, then continue generation.""",
 ['Validate the arguments and execute the authorized read-only function.','Remove sensitive fields from the returned tool data.','Submit function_call_output with the originating call_id.','Continue the model response using the correlated function output.'],
 'The host obtains an actual result, sanitizes it before model exposure, preserves its call association and then continues the response.')
sequence('A','B','S025 S026',
 """A hybrid retrieval design embeds the text query before retrieval, fuses the keyword and vector lists, then applies an enabled semantic reranker. Arrange those stages.""",
 ['Generate a query vector compatible with the indexed content vectors.','Run keyword and vector retrieval to obtain their ranked candidate lists.','Combine the result lists using reciprocal rank fusion.','Apply the configured semantic reranker to the fused candidates.'],
 'Query vectors are needed for vector retrieval. Fusion needs both lists, and semantic reranking is the additional stage in this stated design.')
sequence('B','B','S006 S007',
 """A receipt assistant follows this prescribed request flow: receive an uploaded receipt, retrieve its evidence, draft a proposed refund, then obtain approval before execution. Arrange the stages.""",
 ['Receive the user-provided receipt for the interaction.','Use file search to retrieve relevant receipt evidence.','Prepare and validate a refund proposal using that evidence.','Obtain approval before executing the proposed refund.'],
 'File search supplies evidence for the proposal; evidence is not authorization, so the side effect still requires confirmation.')
sequence('A','C','S042',
 """All four image harm categories are configured. Arrange the application path from submitted image to the recorded allow/reject decision.""",
 ['Submit the supported image input for harm analysis.','Read the successfully returned category severity values.','Apply the configured any-category rejection threshold.','Record the decision with the category evidence supporting it.'],
 'Analysis yields severities, the application applies policy to those values, and then records the resulting decision. HTTP success is not the verdict.')
sequence('B','C','S017',
 """An image deployment already supports the requested edit. Arrange this preparation workflow: load the source, build a matching mask, submit the edit, then inspect its result.""",
 ['Load the source image and determine its dimensions.','Prepare the edit mask with the required matching dimensions.','Submit the source, mask and edit prompt to the supported deployment.','Inspect the returned image against the requested edit and preserved region.'],
 'Mask preparation depends on the source dimensions. The result can be inspected after the edit request completes.')
sequence('A','D','S046',
 """Credentials are available. Arrange the specified speech-translation-to-audio workflow, with translation completed before synthesis is called.""",
 ['Configure the spoken source language and the target translation language.','Run recognition and translation for the incoming speech.','Read the successful translation text under the target-language key.','Pass the target text to the configured synthesis step.'],
 'The source and target configuration precedes translation. Synthesis needs the successful target-language text rather than the source transcript.')
sequence('B','D','S046',
 """A successful speech translation result is available for German. Arrange the client\'s prescribed playback path: choose target text, submit it to synthesis, obtain audio, then play it.""",
 ['Select the de entry from the translation result.','Submit that German text to the configured SpeechSynthesizer.','Receive the successful synthesis audio result.','Play the produced audio through the client output device.'],
 'The target text is the synthesis input; playback depends on the produced audio. Translation success alone does not mean audio was synthesized.')
sequence('A','D','S034',
 """A Custom Speech project has a separate held-out evaluation set. Arrange the customization path where training data is prepared first and deployment follows model selection.""",
 ['Prepare representative domain training recordings and accurate transcriptions.','Train a custom recognition model with that domain data.','Compare the custom and baseline recognizers on held-out recordings.','Deploy the selected custom model to an endpoint for application use.'],
 'Training depends on prepared data, evaluation compares the trained model, and deployment follows the selection decision.')
sequence('B','D','S030 S032',
 """Company policy requires language routing, then redaction, then translation of the redacted text. Arrange this text-processing workflow.""",
 ['Detect the submitted text\'s language for routing.','Detect personal-information spans in the routed text.','Apply the required redactions using those detected spans.','Translate the approved redacted text into the target language.'],
 'The ordering follows the stated company policy. Language detection, PII detection, redaction and translation are separate operations.')
sequence('A','E','S026',
 """The index and model deployments are configured. Arrange the per-document ingestion operations for long content that requires chunking.""",
 ['Retrieve the source document text.','Split the text into chunks within the embedding input limit.','Generate an embedding for each prepared chunk.','Write the chunk text and compatible vectors into the index.'],
 'Source text is needed for splitting; the chunks are needed for embedding; the resulting vectors are needed for indexing.')
sequence('B','E','S043 S028',
 """The OCR skill and index schema are configured. Arrange the document data path from normalized images through searchable enriched text.""",
 ['Produce normalized images through the blob indexer imageAction setting.','Pass those image inputs through the OCR skill.','Obtain the OCR text in the enriched document tree.','Map the enriched OCR text into the searchable index field.'],
 'The OCR skill needs normalized images. Its enriched text output must then be mapped into the target index.')
sequence('A','E','S021',
 """A Content Understanding analyzer is ready. Arrange the application\'s long-running analysis workflow from submission through downstream use.""",
 ['Begin analysis with the document and configured analyzer.','Wait for the submitted operation to finish successfully.','Read its structured content and Markdown results.','Pass the extracted representation to the downstream application.'],
 'The returned operation is not the completed content. Poll to successful completion before consuming the extraction result.')
sequence('B','E','S045',
 """An invoice field has low confidence. Company policy requires evidence inspection and confirmation before posting. Arrange that review workflow.""",
 ['Route the uncertain field to a human review queue.','Open the field\'s referenced source page and region.','Confirm or correct the value using the source evidence.','Post the approved value to the downstream system.'],
 'Confidence triggers the review path; grounding locates the evidence. Posting follows the required human confirmation.')

def match(set_id, domain, sources, stem, pairs, unused, why):
    SETS[set_id].append(dict(domainId=domain,sourceIds=sources.split(),stem=stem+' Use each selected choice once; one choice is unused.',
        type='matching_magnet',difficulty='medium',matchingPairs=pairs,unusedChoice=unused,
        explanation=dict(whyCorrect=why,whyDistractorsWrong={})))

# Eight matching items per set: A2, B2, C1, D2, E1.
match('A','A','S005',
 'Match each workload requirement to its deployment family. Geography and model support have already been checked.',
 [('Variable interactive demand with per-token charges','Standard'),('Allocated throughput for sustained traffic','Provisioned'),('Deferred asynchronous groups of inference requests','Batch')],
 'Developer','Standard is usage-based interactive serving; Provisioned allocates throughput; Batch serves asynchronous work. Developer is the unused experimentation choice.')
match('B','A','S009',
 'Match each observed agent limit to the next listed response. Retained session state must be preserved; regional moves are prohibited.',
 [('Unneeded active sessions cause session_quota_exceeded','Stop the unneeded active sessions'),('Transient regional_session_quota_exceeded','Use exponential backoff with jitter'),('Regional session failure persists after suitable retries','Open an Azure support request')],
 'Increase Search storage','The remedies follow the returned limit and scenario constraints. Search storage is unrelated to these session-capacity failures.')
match('A','A','S013 S027 S044',
 'Match each investigation to the most direct evidence source.',
 [('A slow operation inside one scored agent request','Correlated trace and nested spans'),('Missing source documents after a partially successful run','Indexer item errors and warnings'),('Query-serving throttling during traffic peaks','Search service operational metrics')],
 'Image generation quality settings','Use operation traces for request-level timing, indexer details for ingestion failures, and service metrics for serving health.')
match('B','A','S009 S010 S011',
 'Match each design requirement to the configuration area that controls it.',
 [('Agent state stored in customer-managed resources','Standard agent setup'),('Private service hostname resolution from the agent network','Private DNS and network configuration'),('Scoped permissions enforced for service calls','Entra authentication with RBAC')],
 'Model output temperature','Storage setup, network resolution and identity permissions solve separate requirements. Output temperature does not configure them.')
match('A','B','S014',
 'Match each observed agent defect to the targeted tool evaluator.',
 [('The model invokes translation when inventory lookup is needed','Tool Selection'),('The correct tool receives the warehouse ID as a part ID','Tool Input Accuracy'),('A correct returned quantity is misrepresented in the answer','Tool Output Utilization')],
 'Task Completion (preview)','Selection concerns the chosen capability, input accuracy concerns arguments, and output utilization concerns returned information. Task Completion is a broader outcome metric.')
match('B','B','S039 S014',
 'Match each evaluation question to the most directly relevant measure.',
 [('Are the answer\'s claims supported by its supplied passages?','Groundedness'),('Does the answer address the user\'s question?','Relevance'),('Did the agent deliver the requested overall outcome?','Task Completion (preview)')],
 'Search latency','Contextual support, response relevance and task completion are different quality properties. Search latency is operational timing.')
match('A','B','S006',
 'Match each information need to the documented context capability.',
 [('A preference learned from prior conversations','Persistent memory'),('A maintained corporate handbook','Curated knowledge base'),('A receipt uploaded for the current interaction','File search')],
 'Model router','Memory, curated knowledge and file search serve different origins and lifecycles of information. Routing selects among models.')
match('B','B','S015',
 'Match each content boundary to its agent guardrail intervention point.',
 [('A proposed purchase action before execution','Tool call'),('Data returned by the vendor service before agent use','Tool response'),('The completed answer before user delivery','Final output')],
 'User input','The controls align with the moment data or action crosses a boundary. User-input inspection happens before these later artifacts exist.')
match('A','C','S050',
 'Match each webpage image role to the appropriate alternative-text approach.',
 [('An image that submits a search form','Communicate the action'),('A purely decorative background flourish','Use empty alt'),('A complex chart whose details cannot fit concise alt text','Provide the detailed information elsewhere on the page')],
 'Use the image filename','Image purpose determines its alternative. A complex chart needs access to its detailed information in addition to a suitable concise alternative.')
match('B','C','S042 S048 S019',
 'Match each visual-content requirement to the relevant capability.',
 [('Assess visual harm categories in an uploaded image','Image Content Safety analysis'),('Describe objects in a supplied photograph','Vision-enabled chat'),('Assess malicious instructions in extracted poster text','Text Prompt Shields')],
 'Custom Speech recognition','Visual description, image harm classification and text instruction security are distinct tasks with different input contracts.')
match('A','D','S030',
 'Match each text task to the most targeted Language capability.',
 [('Locate personal identifiers for a redaction workflow','PII detection'),('Identify the language for message routing','Language detection'),('Label organizations and locations using predefined categories','Named entity recognition')],
 'Sentiment analysis','Each capability returns a different text analysis. Sentiment measures emotional tone and is unused here.')
match('B','D','S031 S032',
 'Match each requested output to the relevant text-processing approach.',
 [('A summary made from selected source sentences','Extractive summarization'),('A concise reworded synthesis of document ideas','Abstractive summarization'),('The document\'s content in another language','Document translation')],
 'Language detection','Extraction preserves selected sentences; abstraction generates new wording; translation changes language. Detecting a language does not produce those outputs.')
match('A','D','S033 S034 S046',
 'Match each speech requirement to the relevant capability.',
 [('Adapt recognition to specialist terminology using domain data','Custom Speech'),('Recognize source speech and obtain target-language text','Speech translation'),('Render supplied text as spoken audio','Text-to-speech synthesis')],
 'Image analysis','Recognition customization, translation and synthesis are separate capabilities. Translation text and synthesized audio are distinct outputs.')
match('B','D','S046',
 'Match each Italian-to-German speech workflow setting or value to its purpose.',
 [('it-IT on speech_recognition_language','Spoken source language'),('de added as the translation target','Requested output language'),('The successful de translation string sent to SpeechSynthesizer','Text input for synthesis')],
 'Recognition endpoint credential','Language identifiers and the translated text have different roles. None of these values is a credential.')
match('A','E','S028 S043 S045',
 'Match each extraction requirement to the configuration or output that directly serves it.',
 [('Produce image inputs for a blob OCR skill','Indexer imageAction'),('Write a skill-produced text node into an index field','outputFieldMappings'),('Locate the evidence supporting an extracted field','Source page, coordinates and spans')],
 'Answer-generation temperature','OCR inputs, enrichment-to-index mappings and grounding references belong to different stages of the extraction path.')
match('B','E','S028 S045 S021',
 'Match each extraction task to its most direct mechanism.',
 [('Rename an original source field during ingestion','fieldMappings'),('Route an uncertain extracted value for review','Estimated field confidence'),('Track an analysis request until results are ready','Long-running operation poller')],
 'Semantic reranking','Source mapping, uncertainty routing and asynchronous operation tracking solve different problems. Reranking applies to retrieved candidates.')
