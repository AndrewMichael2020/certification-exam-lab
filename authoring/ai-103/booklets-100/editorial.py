"""Substantive distractor refinements and question-specific presentation."""
from varied import SETS

def option(set_id, number, letter, text, reason=None):
    q=SETS[set_id][number-1]
    q['options'][ord(letter)-65]['text']=text
    if reason is not None:q['explanation']['whyDistractorsWrong'][letter]=reason

# Make short keys comparable to plausible alternatives, using technical scope.
option('A',1,'A','Data Zone Standard, using EU capacity with token-based charges for interactive requests.')
option('A',5,'A','Request the regional accelerator-SKU allocation through the Foundry managed-compute quota process.')
option('A',8,'A','Export a correlated request trace with timed nested spans for retrieval, generation and the tool call.')
option('A',11,'A','Store learned preferences in persistent memory and use maintained knowledge for the current manual.')
option('A',13,'A','Task Completion (preview), assessing whether the agent delivered the requested end-to-end outcome.')
option('A',14,'A','Document Retrieval against the supplied query-document relevance labels for the two candidate retrievers.')
option('B',1,'A','Inference processing can extend beyond the EU despite keeping the resource in its existing EU region.')
option('B',5,'A','Check the managed-compute accelerator-SKU quota in R2; the R1 approval is scoped to its own region.')
option('B',9,'A','Apply operational log access restrictions and retention periods to the redacted trace storage.')
option('B',13,'A','Task Adherence (preview), assessing compliance with the instruction to use a read-only workflow.')
option('B',14,'A','Groundedness against the supplied passages, which tests the unsupported claim in the generated answer.')
option('B',15,'A','The tool-call intervention point, configured to inspect the proposed purchasing action before execution.')

# Replace length cues with realistic request, validation and retrieval mistakes.
option('A',20,'D','Generate a new result identifier for each function_call_output and keep a client-side table linking it to its originating call.',
       'The output itself must carry the originating call_id; a client-side table does not replace the service contract.')
option('A',21,'B','Validate the JSON field names and data types, then execute under the application identity when that structural check passes.',
       'Structural validation does not enforce the stated business-value and account-authorization constraints.')
option('A',23,'B','Run vector similarity first, then use a lexical sort on the returned document identifiers to supply the exact-term ranking.',
       'Sorting identifiers is not keyword retrieval over indexed content and cannot recover candidates absent from the vector list.')
option('A',24,'B','Keep model Y and rescale its vector values to the numerical range of the model X vectors before running nearest-neighbor search.',
       'Rescaling values does not establish compatibility between unrelated learned embedding spaces.')
option('A',27,'B','Initialize AIProjectClient with the project endpoint and an AzureKeyCredential wrapping the Foundry resource API key.',
       'The documented client version supports Entra credentials, not resource-key authentication.')
option('A',31,'B','Keep parallel_tool_calls enabled and attach the same strict parameter schema to each function so every parallel result has a shared definition.',
       'Repeating the schema does not replace the documented requirement to disable parallel tool calls for this flow.')
option('A',60,'B','Generate one vector from the full document by reducing the requested embedding dimension while leaving the input text unchanged.',
       'Output dimensionality does not remove the embedding model input-length limit.')
option('A',63,'B','Retain the field value and confidence, and reconstruct its source page later by searching for the same formatted amount in the document.',
       'Repeated values can occur in multiple places; retained grounding references identify the evidence for this extracted field.')
option('B',19,'B','The application treated a schema-valid function request as proof of a completed business operation and synthesized a successful result.',
       'This restates the defect described by the key rather than an independent alternative.')
# Avoid a duplicate defensible answer: the alternative below is a distinct mistake.
option('B',19,'B','The host should first send the success result back to the model, then execute the reservation if the model confirms that the JSON was valid.',
       'This still reports success before execution; model confirmation of JSON does not create the reservation.')
option('B',20,'D','Assign an output identifier based on a sorted combination of the function name and arguments, and retain call_id only in application logs.',
       'The Responses output contract requires the originating call_id, not a derived identifier retained only outside the request.')
option('B',21,'B','Expand the JSON Schema with a description naming the permitted accounts and accept any generated arguments that satisfy its declared types.',
       'A descriptive schema does not enforce authorization for the actual caller and target account.')
option('B',23,'B','The semantic reranker creates a numerical representation from the merged scores that can replace the stored document vectors on later queries.',
       'Reranker scores are not index-time embeddings and do not replace the content vectorization stage.')
option('B',24,'B','Keep the stored vectors and add the old model name to the query metadata so the service can reinterpret the new model vectors in the old space.',
       'Metadata does not transform representations between unrelated embedding models.')
option('B',26,'D','Tool Call Success, using the successful inventory response as evidence that the final answer faithfully represents its returned quantity.',
       'Successful execution does not establish how the agent uses or reports the result.')
option('B',28,'B','Keep the format configuration inside text.format and select the Chat Completions endpoint, relying on the identical schema to make the request portable.',
       'The schema can be reused when supported, but the request location must follow the destination API contract.')
option('B',60,'B','Increase the retry budget and keep the current ingestion concurrency so the queued workload can eventually consume more tokens than the assigned quota.',
       'A retry budget does not increase a persistently exhausted quota; demand or allocated capacity must change.')
option('B',62,'B','Submit the document as a new analysis on each polling interval and select whichever operation first returns a completed content object.',
       'Track the existing operation; repeated submissions create extra analysis work and do not poll the original request.')
option('B',64,'B','Duplicate the established suppliers\' training invoices and change their filenames to the new supplier, preserving the existing verified field labels.',
       'The content still lacks the new layout; filenames do not supply representative examples.')

# Replace off-topic distractors with neighboring capabilities or plausible API errors.
option('A',19,'C','The tool registry, executing the function description as code.', 'A name, description and schema do not implement the function body.')
option('A',19,'D','The inference endpoint, executing the client\'s function when JSON validates.', 'The host application implements and executes the business function.')
option('B',19,'C','The function declaration needed to include the reservation result as a default argument.', 'A default argument is not proof that the business operation ran.')
option('B',19,'D','The host should use the function name in place of the business service endpoint.', 'A declared function name does not replace the implemented service call.')
option('A',21,'C','Normalize both values to strings and then check their JSON types.', 'Type normalization does not validate the amount or account scope.')
option('B',21,'C','A schema example with the desired account and a successful result.', 'An example does not authorize the current caller.')
option('B',21,'D','A tool output stating that the requested account exists.', 'Existence does not establish permission for the caller to modify it.')
option('A',27,'C','An OAuth token issued for the connected Search resource.', 'The token audience must be appropriate to the project service.')
option('A',27,'D','The project endpoint URL passed as a credential string.', 'An endpoint identifies the resource but is not an authentication credential.')
option('B',27,'B','Call responses.create() directly on the project connection manager.', 'Project connection management is not the OpenAI Responses client surface.')
option('B',27,'C','Construct an OpenAI client using the Search connection endpoint.', 'The Search endpoint is not the project-provided inference client endpoint.')
option('B',27,'D','Use the project\'s storage client as the Responses transport.', 'A storage client does not implement the Responses API.')
option('A',28,'C','In the function-call output payload after model execution.', 'A returned tool output does not configure the requested response format.')
option('A',28,'D','In the input message\'s metadata under schema.', 'Input metadata is not the Responses format-setting location.')
option('A',32,'D','A policy-adherence score produced by an agent evaluator.', 'The returned reasoning summary is not an evaluator result.')
option('B',33,'B','Increase the unsupported parameter until the API accepts its value.', 'An unsupported parameter is not made valid by changing its magnitude.')
option('B',33,'C','Rename the parameter in a prompt while sending the old request field.', 'The service validates request fields independently of prompt wording.')
option('B',33,'D','Set the unsupported control through the old model\'s deployment metadata.', 'Old deployment metadata does not define the new model request contract.')
option('A',36,'B','The tool\'s maximum result count.', 'Count limits results but does not choose which index they come from.')
option('A',36,'C','The tool\'s vector-versus-keyword query mode.', 'Query mode changes retrieval behavior inside the selected index.')
option('A',36,'D','The retrieval filter for the current unrelated index.', 'A filter does not redirect the tool to the intended index.')
option('B',35,'B','Whether the requested feature is supported on the selected Responses API.', 'This is the same issue as the key and is replaced below.')
option('B',35,'B','Whether shortening encoded documents removes the API support restriction.', 'Smaller inputs do not enable a feature on an unsupported API.')
option('B',35,'C','Whether enabling structured outputs activates the Spotlighting feature.', 'Structured output formatting is a separate capability.')
option('B',35,'D','Whether citations in the final answer demonstrate that Spotlighting was applied.', 'Citation output does not establish which input protection ran.')
option('A',37,'D','Tool Output Utilization, measuring use of the translation result.', 'Output use is downstream of choosing the wrong capability.')
option('A',44,'D','The default size accepted by a different deployment in the same resource.', 'Another deployment does not define the chosen model\'s accepted controls.')
option('B',44,'B','The base model catalog identifier when its deployment has a different name.', 'The documented Azure call selects the deployment by its deployed name.')
option('B',44,'D','The image endpoint\'s API version string.', 'API version and model deployment are separate request settings.')
option('A',45,'D','Enable image output formatting on the text-only message.', 'Output configuration does not supply visual input.')
option('B',45,'D','Put two image URLs into each of six text fields.', 'Embedding URLs as plain text is not supplying fewer supported image inputs.')
option('A',53,'B','Translate the detected language code into the output language.', 'A language code is not the source content to translate.')
option('A',53,'C','Apply a pronunciation lexicon to the synthesis of the original text.', 'Pronunciation does not enforce terminology in translation.')
option('A',53,'D','Use general-language translation and treat glossary matches as informational.', 'The requirement calls for evaluating terminology customization, not merely observing glossary matches.')
option('B',53,'B','Detect each document language and save that label as its translated output.', 'Language detection does not translate the document.')
option('B',53,'C','Translate extracted filenames through the text translation endpoint.', 'Translating names does not translate document contents.')
option('B',53,'D','Generate a summary in the target language and return it as the translated document.', 'A summary omits document content and is not a document translation.')
option('A',56,'B','A speech-to-text endpoint connected to a text-only response consumer.', 'This supplies recognition but not the combined managed generation and synthesis.')
option('A',56,'C','A text-to-speech endpoint configured to read prewritten responses.', 'This supplies synthesis but not the combined conversational input and model response.')
option('A',56,'D','A Speech translation recognizer returning target-language strings.', 'Translation is not the stated managed speech-to-speech agent stack.')
option('B',56,'B','Whether using the previous model\'s name as an alias enables its old features.', 'An alias does not establish feature support in the new configuration.')
option('B',56,'C','Whether a common endpoint hostname guarantees identical regional features.', 'A common endpoint pattern does not establish regional capability parity.')
option('B',56,'D','Whether client-side voice labels can override model compatibility limits.', 'Client labels do not add service capabilities.')
option('A',57,'B','The transport connection establishment and authentication flow.', 'Connectivity is necessary but does not define how turns and interruptions are handled.')
option('A',57,'C','The response transcript\'s punctuation and capitalization.', 'Text formatting does not coordinate live audio state.')
option('A',57,'D','The voice\'s output format for archived complete responses.', 'Archive encoding does not define interruption and turn behavior.')
option('B',57,'B','The static voice chosen for synthesized speech.', 'Voice identity does not define turn-ending and interruption behavior.')
option('B',57,'C','The complete-session transcript formatting.', 'Formatting a transcript does not coordinate input and output audio.')
option('B',57,'D','The connection URL after a successful transport handshake.', 'An established transport does not itself define correct turn management.')
option('A',61,'B','The image-search analyzer applied to the complete document.', 'The requirement targets document layout and structured Markdown, not image search.')
option('A',61,'C','The audio-search analyzer after naming each document as an audio item.', 'Renaming does not change content modality or analyzer capability.')
option('A',61,'D','A custom field containing the entire source filename as Markdown.', 'A filename does not preserve extracted document structure.')
option('B',61,'B','A text-splitting skill over the raw document text alone.', 'Splitting does not recover the page layout and image-location metadata.')
option('B',61,'D','A query-time vectorizer configured on the document title.', 'Query vectorization does not extract layout from source documents.')
option('A',64,'B','Rename a returned generic field to renewal_date after extraction.', 'Renaming does not teach the analyzer to extract the required domain-specific value.')
option('A',64,'C','Use the document-search summary as the typed renewal-date field.', 'A summary is not the requested domain-specific typed extraction.')

# Practical configuration exhibits; each remains one single-answer item.
SETS['A'][19]['artifact']={'title':'Function requests (illustrative)','kind':'json','content':'[{"name":"get_stock","call_id":"call_a"},\n {"name":"get_stock","call_id":"call_b"}]'}
SETS['A'][28]['artifact']={'title':'Property definition','kind':'json','content':'"note": {"type": ["string", "null"]}'}
SETS['A'][58]['artifact']={'title':'Current OCR input path','kind':'json','content':'"imageAction": "none"\nOCR input: /document/normalized_images/*'}
SETS['B'][27]['artifact']={'title':'Migrated request fragment','kind':'json','content':'POST .../chat/completions\n{"text":{"format":{"type":"json_schema", "...":"..."}}}'}
SETS['B'][46]['artifact']={'title':'Returned severity values','kind':'json','content':'{"Hate":0,"SelfHarm":2,"Sexual":0,"Violence":4}'}
SETS['B'][55]['artifact']={'title':'Deployment change','kind':'log','content':'Prototype: model M1, region R1\nProposed:  model M2, region R2'}

option('A',1,'B','Global Standard in an EU resource, relying on the resource region to keep inference processing within the EU.', 'Global processing is not restricted to the EU by the resource location.')
option('A',5,'D','Request a larger subscription-wide regional vCPU allocation and count that capacity toward the Foundry managed-compute accelerator deployment.', 'Foundry managed-compute quota is separate from the subscription VM allocation.')
option('A',8,'B','Record a structured event for each request containing final text, total elapsed time and the names of every participating service.', 'Aggregate request timing and service names do not identify timed nested operations.')
option('A',11,'B','Store learned preferences in the prior session conversation history and retrieve the current manual from the maintained knowledge base.', 'Prior session state is not the persistent cross-session memory requested.')
option('A',13,'B','Task Adherence (preview), using the fact that the agent obeyed its operating policy to judge whether all requested deliverables were completed.', 'Policy adherence does not establish delivery of the entire requested outcome.')
option('A',14,'B','Groundedness, using a hypothetical final answer to infer whether the two retrievers placed all relevant documents at the correct rank positions.', 'Groundedness of an answer is not labeled measurement of the retrieved document ranking.')
option('B',1,'B','Keeping the resource in an EU region also keeps the Global Standard deployment\'s inference processing inside the same EU boundary.', 'The processing boundary follows deployment type, not just resource location.')
option('B',5,'B','Check the Azure VM quota for the matching GPU family in R2 and count that unused allocation toward the managed-compute accelerator requirement.', 'Azure VM quota is separate from the managed-compute allocation.')
option('B',9,'B','Increase sampling so the unrestricted telemetry workspace contains a representative trace for each request category and evaluation outcome.', 'Sampling does not restrict access or apply the required retention policy.')
option('B',13,'B','Task Completion (preview), treating successful delivery of the requested result as evidence that the read-only workflow instruction was obeyed.', 'Completing the task does not establish policy adherence.')
option('B',14,'B','Document Retrieval, using the identical retrieved passages to conclude that any later difference in generated claims must already be context-supported.', 'Retrieval evaluation does not establish support for the generated claim.')
option('B',15,'B','The final-output intervention, configured to inspect the purchase receipt and ask for human approval before displaying the already completed action.', 'The purchase has executed before this check; the required inspection must precede execution.')
option('B',2,'C','Standard deployment with synchronous inference.', 'This uses the standard interactive path rather than the specified batch completion and charging model.')
option('B',3,'D','Change the application\'s trusted origins.', 'Trusted origins do not grant RBAC permissions on the target resource.')
option('B',6,'C','Retry the same request with a shorter delay.', 'Shorter delays do not resolve the persistent regional capacity limit.')
option('B',10,'C','Model answer-quality alerts.', 'Answer quality does not directly measure Search query-serving latency or throttling.')
option('B',19,'D','A missing result default in the tool schema.', 'A schema default does not execute the reservation or establish its outcome.')
option('B',29,'B','Set additionalProperties to true.', 'That explicitly permits additional properties.')
option('B',65,'D','The private endpoint resource ID and subnet assignment, evaluated from the developer\'s successful network connection to the same service.', 'Resource configuration and a developer connection do not establish the agent runtime network path.')
option('B',36,'B','Keep retrieval unfiltered and place a department instruction in the system message so the model chooses which returned passages to use.', 'This asks the model to ignore content after retrieval rather than narrowing the returned results.')
option('A',49,'C','Increase output length to recover source frames omitted by the sampling stage.', 'Output length cannot recover visual evidence that was not sampled.')
option('A',77,'C','Increase summary length to include the source frames omitted by sampling.', 'Generating a longer summary does not recover unsampled frames.')
option('B',56,'C','Use a common endpoint hostname as the basis for regional feature compatibility.', 'A common endpoint pattern does not establish regional capability parity.')
option('B',75,'C','Describe the button\'s color, outline and position in the header.', 'Functional alternative text should communicate the download action.')
option('B',77,'E','Disable segmentation to make sampling include every source frame.', 'Disabling segmentation does not remove the documented frame-sampling limitation.')
option('B',20,'D','Assign an output identifier based on a sorted combination of the function name and arguments, and retain call_id in application logs.', 'The returned function_call_output must itself use the originating call_id.')
