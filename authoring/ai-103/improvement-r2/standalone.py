"""Explicit choice/code/diagnosis designs and retained-item editorial decisions."""
from content import *

def standalone(s):
    A=[]; B=[]; C=[]; D=[]; E=[]
    # The 20 A-group choices address different failures in each set.
    amap={1:'A2.02',2:'A2.02',3:'A3.04',4:'A3.04',5:'A3.01',6:'A3.01',7:'A2.04',8:'A4.03',9:'A4.03',10:'A3.03',
          11:'A1.04',12:'A2.03',13:'A4.02',14:'A4.02',15:'A4.01',16:'A1.04',17:'A2.01',18:'A1.02'}
    # Retain bounded decisions, not the old automatically broadened objective tags.
    for n in [1,2,3,4,5,6,7,8,9,10,11,13,14,15,17,18]:
        q=base(s,n,amap[n]); A.append(q)
    # Replace off-boundary distractors in retained questions with realistic competing diagnoses.
    patch_option(A[3], 'B' if s=='A' else 'A',
      'The private endpoint connection approval state for the runtime subnet.' if s=='A' else 'Private DNS zone links for the runtime subnet.',
      'The stated failure is name resolution to a public address.' if s=='A' else 'The case already confirms private resolution and an established network connection; the current defect is authorization.')
    if s=='A':
        patch_option(A[5],'C','Increase the model deployment’s reserved inference throughput.','Model throughput is separate from active hosted-session capacity.')
        patch_option(A[13],'B','A direct attack submitted in the authenticated user’s message.','The malicious text came from retrieved document content, not the direct user input.')
        patch_option(A[13],'C','A harmless quoted example accepted without examining its attempted instruction.','The retrieved instruction attempts to override the agent and disclose credentials.')
    else:
        # Preserve diagnosed retry exhaustion: no new immediate-retry "solution".
        patch_option(A[5],'A' if A[5]['correctAnswer']!='A' else 'B','Increase the underlying model’s token allocation.','The case identifies regional hosted-session capacity, not model token throttling.')
    A += [
      dropdown('A','A3.04',['S051','S052'],
        ('Complete the Azure OpenAI v1 client for keyless inference. The calling identity has the inference role at the resource scope.' if s=='A' else
         'An Azure OpenAI v1 client was copied from a dated AzureOpenAI example. Complete the replacement client; authentication and inference roles are already configured.'),
        'token_provider = get_bearer_token_provider(credential, "{{audience}}")\nclient = OpenAI(base_url="{{endpoint}}", api_key=token_provider)',
        {'audience':['https://ai.azure.com/.default','https://management.azure.com/.default','https://search.azure.com/.default'],
         'endpoint':['https://resource.openai.azure.com/openai/v1/','https://resource.services.ai.azure.com/api/projects/support','https://resource.search.windows.net/']},
        {'audience':'https://ai.azure.com/.default','endpoint':'https://resource.openai.azure.com/openai/v1/'},
        'The named v1 example uses the ai.azure.com token audience and the resource /openai/v1/ base URL. Authentication still requires authorization on the called resource.',
        {'audience':'Use the v1 example’s inference token audience, rather than an ARM or Search audience.','endpoint':'This is the direct resource v1 surface, not project management or Search.'}),
      dropdown('A','A2.03',['S002','S003'],
        ('Complete the AI Projects Python 2.8.0 constructor for project operations.' if s=='A' else
         'A project-management client was given an inference base URL and resource-key credential. Complete its 2.8.0 replacement.'),
        'project = AIProjectClient(endpoint={{endpoint}}, credential={{credential}})',
        {'endpoint':['project_endpoint','openai_v1_base_url','search_endpoint'],
         'credential':['DefaultAzureCredential()','AzureKeyCredential(resource_key)','project_endpoint']},
        {'endpoint':'project_endpoint','credential':'DefaultAzureCredential()'},
        'The retained AI Projects 2.8.0 reference uses a Foundry project endpoint and Entra credentials. Project and direct inference clients have different roles.',
        {'endpoint':'Choose the endpoint of the named project for project operations.','credential':'The 2.8.0 client supports Entra credentials; a URL is not a credential and resource-key construction is not this client contract.'}),
      single('A','A1.03',['S025','S026'],
        ('A catalog requires exact part-code matches and semantic symptom matches. Which design combines both retrieval signals before optional reranking?' if s=='A' else
         'A catalog uses only vector similarity and misses exact part-code matches. Which added retrieval signal should be evaluated?'),
        ['Keyword and vector retrieval with fused rankings.','Vector retrieval alone, with a larger candidate count.','Keyword retrieval alone, with boosted identifier fields.','Semantic reranking of keyword-only candidates.'],'A',
        'Keyword evidence complements semantic vectors. Evaluate hybrid retrieval for the actual query set; ranking quality is distinct from generation and authentication.',
        ['A larger vector candidate count does not add keyword retrieval.','Boosted keyword fields do not add vector retrieval.','Reranking keyword candidates does not combine keyword and vector retrieval.']),
      single('A','A4.04',['S054'],
        ('An agent proposes a consequential account change. Which host boundary should decide whether it executes?' if s=='A' else
         'A model’s tool arguments are valid JSON but a proposed operation is outside the caller’s account. What control targets the failure?'),
        ['A lower generation temperature.','A more detailed tool description.','Host validation, caller authorization and required action approval.','A valid model response schema.'],'C',
        'The host controls operations and validates values and authority. Descriptions and structured output help represent intent but are not action permission.',
        ['Sampling does not establish caller authority.','Descriptions are not an executable permission check.','A response schema does not authorize an action.']),
    ]
    # Ten B-group choices: four meaningful dropdown tasks, plus distinct operational choices.
    B += [
      dropdown('B','B1.06',['S002','S056'],
        ('Complete the current Python client calls for an existing agent named helpdesk and its project OpenAI client.' if s=='A' else
         'A new Foundry migration calls classic get_agent with an assistant ID. Complete the current calls for the existing agent name.'),
        'agent = project.agents.{{operation}}(agent_name="helpdesk")\nclient = project.{{client}}()',
        {'operation':['get','get_agent','create_version'],'client':['get_openai_client','get_search_client','get_agent_client']},
        {'operation':'get','client':'get_openai_client'},
        'The current operations reference exposes get(agent_name). The retained 2.8.0 project library provides get_openai_client for Responses and conversations.',
        {'operation':'Retrieve the existing named definition; do not mix classic retrieval or create a new version.','client':'Obtain the documented OpenAI client for Responses operations.'}),
      dropdown('B','B2.02',['S053'],
        ('Complete a backend memory-search tool definition and response header for per-user preferences. user_key is derived from the authenticated session.' if s=='A' else
         'Per-user preferences were pooled because every response used the backend identity. Complete the tool and header repair.'),
        'from azure.ai.projects.models import MemorySearchPreviewTool, PromptAgentDefinition\ntool = MemorySearchPreviewTool(memory_store_name="preferences", scope="{{scope}}")\nagent = project.agents.create_version(agent_name="support",\n    definition=PromptAgentDefinition(model=deployment, tools=[tool]))\nresponse = client.responses.create(input=message,\n    extra_body={"agent_reference": {"name": agent.name, "type": "agent_reference"}},\n    extra_headers={"{{header}}": user_key})',
        {'scope':['{{$userId}}','backend-shared','conversation-title'],'header':['x-memory-user-id','x-request-id','Authorization']},
        {'scope':'{{$userId}}','header':'x-memory-user-id'},
        'The memory tool resolves the placeholder from the memory-user header, falling back to caller TID/OID without it. A backend must supply its authenticated end-user key.',
        {'scope':'Use the documented per-user placeholder; static scope pools users and a title is not a partition key.','header':'The memory-user header carries end-user identity; a trace ID does not select a user and Authorization identifies the calling service.'}),
      dropdown('B','B2.01',['S054'],
        ('A Responses turn must consult at least one attached tool. Complete the request-level control.' if s=='A' else
         'An agent answers without a tool despite an instruction to perform a lookup. The attached model/tool contract is supported. Complete the request-level repair.'),
        'response = client.responses.create(model=deployment, input=message, tools=tools, tool_choice="{{mode}}")',
        {'mode':['auto','required','none']},{'mode':'required'},
        'required demands one or more calls. It does not by itself select one exact function, execute host code or grant permission.',
        {'mode':'auto leaves tool use to the model; none prevents it. The host remains responsible for validation and execution.'}),
      dropdown('B','B3.01',['S037'],
        ('Complete a supported strict Responses schema: note must be present and can be null; unknown properties are rejected.' if s=='A' else
         'A schema permits null note values but sometimes omits the note key. Complete the strict Responses contract.'),
        'schema = {"type": "object", "properties": {"note": {"type": ["string", "null"]}},\n          "required": {{required}}, "additionalProperties": {{extra}}}\n# response text.{{location}} contains the json_schema format',
        {'required':['["note"]','[]','["string", "null"]'],'extra':['False','True'],'location':['format','response_format','metadata']},
        {'required':'["note"]','extra':'False','location':'format'},
        'Nullable value types do not make a property optional in the supported strict subset. Responses uses text.format, unlike the Chat Completions field.',
        {'required':'Require the key while retaining a nullable value type.','extra':'additionalProperties false disallows unknown fields.','location':'Use the documented Responses request shape.'}),
      base(s,32,'B3.03'),
      single('B','B3.01',['S057'],
        ('A support assistant should stay within product support and ask for clarification when evidence is insufficient. Which prompt control expresses both?' if s=='A' else
         'A support assistant has examples of the desired tone but answers unrelated tax questions. Which prompt change targets its missing role boundary?'),
        ['A low temperature with no role instructions.','An explicit system role, domain boundary and fallback behavior.','A larger retrieval top-k value alone.','More tone examples without defining scope.'],'B',
        'System messages express role, scope and fallback. Test behavior and apply other mitigations because instructions do not guarantee compliance.',
        ['Temperature affects sampling rather than defining the task boundary.','Retrieval quantity does not state domain behavior.','Examples of tone do not replace an explicit scope/fallback contract.']),
      single('B','B2.04',['S008'],
        ('A deterministic workflow sends a request to a retrieval specialist and then a policy specialist. What must its orchestration represent?' if s=='A' else
         'Two specialists exchange messages indefinitely because completion and handoff rules were omitted. Which workflow design change addresses the fault?'),
        ['One larger model context replacing all flow rules.','Tool descriptions treated as executable routing code.','Explicit handoff, completion and control-flow conditions for specialist work.','Separate trace IDs with no shared request context.'],'C',
        'Multi-agent orchestration needs explicit workflow control and termination conditions. Distinct specialist roles do not themselves supply a valid process.',
        ['Context size does not define routing or completion.','Descriptions are not the orchestrator’s executable flow.','Uncorrelated telemetry makes diagnosis harder and does not define completion.']),
      base(s,37,'B2.06'),
      base(s,36,'B1.02'),
      base(s,42,'B1.04'),
    ]
    # New source S057 explicitly maps the behavioral subset of D1.04; no hidden-CoT claims.
    C=[base(s,n,o) for n,o in [(43,'C1.03'),(44,'C1.05'),(45,'C2.01'),(46,'C2.04'),(49,'C2.06'),(50,'C2.05')]]
    if s=='A':
        # Replace C3.02's overbroad inherited tagging with a direct visual-harm task.
        C.append(single('C','C3.01',['S042','S048'],'A poster has a low visual harm score but includes text telling an agent to reveal credentials. Which conclusion follows from the harm result?',
         ['The poster text has passed instruction-trust validation.','A successful harm request establishes the text is authorized.','The score describes analyzed visual harm categories; instruction trust needs a separate text-boundary check.','The image harm score is a groundedness measurement.'],'C',
         'Visual harm classification is distinct from text prompt-attack detection. The FAQ describes text-only Prompt Shields; the harm score does not authorize instructions.',
         ['Harm classification does not establish instruction trust.','HTTP success is not authorization of embedded text.','Groundedness is a different assessment.']))
    else:
        C.append(base(s,48,'C3.01'))
    C.append(single('C','C2.02',['S019'],
      ('A vision model receives two images of the same machine. The app needs a concise caption comparing visible differences. What should be supplied?' if s=='A' else
       'A two-image comparison caption discusses only the first image because the request sent the second filename as plain text. Which request repair targets this?'),
      ['Both supported image inputs with an explicit comparison/caption instruction.','The second local filename in a system message.','An image-generation output format on a text-only request.','An embedding vector in place of the image pixels.'],'A',
      'The vision request must actually include both images using its supported image content shape. The instruction specifies comparison and desired detail.',
      ['A remote model cannot read a client-local filename.','Image output formatting does not supply visual input.','A text embedding is not the supported image content contract.']))
    C += [
      dropdown('C','C2.03',['S019'],
        ('Complete a vision chat message so a question about a supplied inspection photo is grounded in actual image input.' if s=='A' else
         'A photo QA client sends a URL as plain message text. Complete the supported multimodal content block.'),
        'content = [{"type": "text", "text": question},\n           {"type": "{{kind}}", "{{field}}": {"url": photo_url}}]',
        {'kind':['image_url','text','image_output'],'field':['image_url','file_name','caption']},
        {'kind':'image_url','field':'image_url'},
        'The documented chat shape includes an image_url content part with its URL. The question text describes what to inspect; it does not provide pixels.',
        {'kind':'Use the image input content type for the vision chat surface.','field':'The image_url object contains the source; a filename or generated caption is not equivalent input.'}),
      dropdown('C','C1.03',['S017'],
        ('The selected image model supports masking. Complete an edit request for a source image and a mask already sized to match it.' if s=='A' else
         'An image-edit request changes areas outside the desired region because it omitted the mask. Complete the supported request inputs.'),
        'result = client.images.edit(model=deployment, image={{source}}, mask={{mask}}, prompt=edit_instruction)',
        {'source':['source_image_file','source_filename_text','prior_caption_text'],'mask':['matching_mask_file','size_string','quality_string']},
        {'source':'source_image_file','mask':'matching_mask_file'},
        'The supported edit consumes source image data and a spatial mask. Size and quality controls do not substitute for the edit mask.',
        {'source':'Supply the image bytes/file accepted by this endpoint, not its name or a caption.','mask':'Supply the matching mask as an input; a size/quality value is a different control.'})
    ]
    D=[
      single('D','D1.03',['S055'],
       ('A Translator text request contains one sentence with English and German spans. Some words remain untranslated. Which preparation targets the documented limitation?' if s=='A' else
        'An auto-detected document translation selects one source language for a file containing two languages. Which preprocessing change should be tested?'),
       ['Increase the translation output length.','Split content into single-language segments and use the intended source language for each.','Retry the same mixed sentence until detection changes.','Replace source-language selection with a target voice name.'],'B',
       'The known-issues page distinguishes mixed-language text and document failures and recommends intended-source-language handling or single-language segmentation.',
       ['The failure concerns source-language mixture rather than length.','Unchanged retries do not resolve the documented input limitation.','A synthesis voice is not a Translator source-language control.']),
      single('D','D1.04',['S057'],
       ('A domain compliance summarizer needs a defined scope and an explicit escalation when evidence is missing. Which instruction design addresses it?' if s=='A' else
        'A compliance summary includes unrelated legal advice despite low temperature. Which behavioral contract should be added and evaluated?'),
       ['A domain role with the allowed task, output requirements and a missing-evidence fallback.','A lower top-p value alone.','A longer output limit alone.','A deployment name containing compliance.'],'A',
       'System instructions define task scope and fallback, while evaluation checks behavior. Sampling, length and names do not establish those requirements.',
       ['Sampling does not state the permitted task.','Length does not define scope.','A deployment label is not an instruction contract.'])
    ]
    # E-group exact quota is ten multi-selects, allowing coverage of ingestion and documents.
    E=extraction(s)
    return dict(A_single=A,B_single=B,C_single=C,D_single=D,E_multi=E)

def extraction(s):
    if s=='A':
      xs=[base('A',80,'E1.04'),base('A',81,'E2.02'),base('A',82,'E2.03')]
      xs += [
       multi('E','E1.01',['S058','S026'],'Long manuals exceed embedding limits, and the query vectorizer uses an unrelated model. Which TWO configuration corrections address the two failures?',
        ['Chunk the source text within input limits.','Use content/query embeddings from a compatible model configuration.','Increase the answer-generation token limit.','Rescale query vectors from the unrelated model.','Disable indexing warnings.'],['A','B'],
        'Chunking addresses embedding input size; compatible query/content vectors address representation mismatch. These are separate ingestion and retrieval requirements.',
        ['Answer length does not enlarge embedding input limits.','Rescaling does not align learned embedding spaces.','Suppressing warnings does not fix either defect.']),
       multi('E','E1.02',['S025','S058'],'A product catalog needs exact codes and semantic candidates, with optional semantic reranking. Which TWO statements describe the stages correctly?',
        ['Hybrid retrieval combines keyword and vector ranked lists.','Semantic reranking generates the indexed vectors.','A query vectorizer uses a compatible embedding configuration.','Semantic ranking renames source fields during ingestion.','Keyword sorting makes vectorization unnecessary for the vector path.'],['A','C'],
        'Hybrid retrieval combines complementary lists. Query vectorization supplies the vector path; semantic reranking operates after candidate retrieval.',
        ['Reranking does not produce stored embeddings.','Field mapping is an ingestion concern.','A vector query still requires compatible vectorization.']),
       multi('E','E1.03',['S029','S043'],'A document enrichment pipeline needs layout-aware Markdown and OCR for normalized images. Which TWO skill choices directly target these outputs?',
        ['A semantic query configuration.','The Document Intelligence Layout skill.','The OCR skill receiving normalized images.','An Azure OpenAI chat output-token setting.','An output field alias without a producing skill.'],['B','C'],
        'Layout and OCR are producing enrichment capabilities. Their outputs still need the appropriate index mappings.',
        ['Query semantics do not extract document layout.','Generation length does not configure enrichment skills.','A mapping does not create an absent enrichment output.']),
       multi('E','E1.05',['S040','S054'],'An agent retrieves an unrelated Search index and returns content from another department. Which TWO tool configuration controls address the stated defects?',
        ['The correct connected index name.','A supported filter using the authorized department.','A longer model answer.','A resource name containing the department.','A larger unfiltered candidate set.'],['A','B'],
        'Select the intended index and enforce the supported retrieval filter. The authorized field value comes from the host’s access context.',
        ['Length does not change retrieved data.','A display name does not filter documents.','More unfiltered candidates leave the boundary defect.']),
       multi('E','E2.01',['S059','S045'],'A document pipeline must extract invoice fields and support amount verification. Which TWO design choices address those requirements?',
        ['Treat high confidence as permission to pay.','Define the required field schema.','Retain source locations for reviewer inspection.','Replace field types with filename parsing.','Discard coordinates after assigning confidence.'],['B','C'],
        'The schema defines extraction targets; grounding locations connect extracted values to the source. Downstream payment validation is separate.',
        ['Confidence is not business authorization.','A filename does not supply typed document fields.','Discarding locations weakens evidence review.']),
       multi('E','E2.02',['S059','S021'],'A RAG pipeline needs a clean document representation before retrieval. Which TWO Content Understanding outputs or behaviors fit?',
        ['Markdown representing document structure.','A completed analysis result consumed after successful polling.','A queued operation treated as extracted text.','A generated final answer used as the source document.','A raw poller serialized into the vector field.'],['A','B'],
        'Structured/Markdown extraction and completed analysis results support downstream processing. An operation handle is not the extracted representation.',
        ['Queued work has not yielded a completed representation.','A final answer is downstream generation rather than the source representation.','The poller is control state, not an embedding vector.']),
       multi('E','E2.03',['S059','S045'],'A custom contract analyzer misses renewal dates in a new layout. Which TWO inputs should guide improvement?',
        ['A typed renewal-date field definition.','Representative examples with verified values.','A larger answer font in the client.','Renaming every unrelated date as renewal_date.','A high threshold reported as proof of correctness.'],['A','B'],
        'Define the intended field and use representative labeled evidence to improve extraction. Evaluate results on separate documents.',
        ['Presentation does not change extraction.','Renaming an unrelated date does not identify the business field.','A confidence threshold is not verification.']),
      ]
    else:
      xs=[base('B',80,'E2.01'),base('B',81,'E1.01'),base('B',82,'E1.02')]
      xs += [
       multi('E','E1.03',['S028','S058'],'A skill-created text field is empty, while a renamed original title field is misrouted. Which TWO mapping distinctions should be applied?',
        ['outputFieldMappings for skill-produced enrichment nodes.','fieldMappings for original source-field renaming.','Semantic ranking for both aliases.','A query-time filter to generate the missing text.','Treat both values as function-call outputs.'],['A','B'],
        'The mappings differ by data origin. A field mapper does not generate an absent skill result; verify the producing skill as well.',
        ['Reranking is not an ingestion mapper.','Query filtering does not create enrichment output.','The values are index ingestion fields, not tool correlation records.']),
       multi('E','E1.04',['S043','S028'],'OCR returned text, but no enriched text reached the index; public source images were never normalized. Which TWO stages need correction?',
        ['Enable normalized image inputs for OCR.','Map the produced OCR node through outputFieldMappings.','Apply a semantic ranker as image normalization.','Copy the poller ID into the text field.','Increase inference output length.'],['A','B'],
        'The configured input path and output mapping are both required. Fixing one does not supply the other.',
        ['Reranking does not normalize images.','An operation identifier is not extracted text.','Generation length does not configure indexer input or mapping.']),
       multi('E','E1.05',['S040','S054'],'A Search tool connects successfully but cites an old index and leaks another team’s passages. Which TWO checks address the defects?',
        ['The configured index name and project connection.','The authorized retrieval filter on a supported field.','The final answer’s punctuation.','The model deployment display name.','The total number of generated tokens.'],['A','B'],
        'A successful connection does not prove the correct index or access filter. Inspect both retrieval controls.',
        ['Punctuation does not change retrieval.','A deployment label is not an index/filter setting.','Token totals do not enforce the data boundary.']),
       multi('E','E2.01',['S059','S045'],'An invoice extractor returned a high-confidence total that violates a procurement rule. Which TWO next design steps are appropriate?',
        ['Treat confidence as permission to pay.','Perform the separate procurement validation.','Keep grounding references for source inspection.','Move the procurement rule into the confidence number.','Discard the original document because extraction succeeded.'],['B','C'],
        'Extraction and source grounding support verification; business authorization remains downstream. The rule violation must be checked by the application.',
        ['Confidence estimates extraction certainty, not procurement authority.','A numeric confidence does not encode business approval.','Successful extraction is not a reason to remove review evidence.']),
       multi('E','E2.02',['S021','S059'],'A worker indexed a poller display string instead of document content. Which TWO corrections restore the asynchronous extraction path?',
        ['Retain the long-running operation until completion.','Read the completed structured/Markdown result for downstream indexing.','Start a fresh analysis for every poll.','Use the operation ID as the document embedding.','Treat HTTP acceptance as a completed extraction.'],['A','B'],
        'The operation handle tracks work; only the successful completed result contains the representation to ingest.',
        ['Repeated submissions are not polling.','An operation ID is not an embedding.','Acceptance and completion are different states.']),
       multi('E','E2.03',['S045','S059'],'An analyzer schema contains the needed fields but fails on unfamiliar supplier layouts. Which TWO improvements provide useful evidence for tuning and review?',
        ['Representative labeled examples for those layouts.','Field source and confidence estimation.','Renaming the supplier’s file to match a known vendor.','Treating all returned dates as invoice dates.','Using output fluency as verified accuracy.'],['A','B'],
        'Examples support analyzer quality; source/confidence outputs support review. Evaluate separately instead of treating fluent output as evidence of correctness.',
        ['Filename changes do not teach document layout.','Different date semantics need the defined fields.','Fluency does not verify extracted values.']),
       multi('E','E1.01',['S058','S026'],'After a vector-model migration, indexed and query vectors have equal length but relevance collapses. Which TWO checks belong in the rollout?',
        ['Content/query embedding-model compatibility.','Reindexing and held-out retrieval evaluation for the new configuration.','Final answer temperature as the vector alignment setting.','Alphabetical sorting as a model migration test.','Matching dimensions reported as complete semantic compatibility.'],['A','B'],
        'Dimensions satisfy a field-shape constraint, while compatible representation and evaluated ingestion/query behavior are also required.',
        ['Sampling does not align vectors.','Alphabetic order does not measure semantic retrieval.','Equal length does not establish a shared embedding space.']),
      ]
    assert len(xs)==10
    return xs

def b_multi(s):
    # Five retained multi-select designs, plus three new constraint combinations.
    xs=[base(s,n,o) for n,o in [(70,'B2.01'),(71,'B1.05'),(72,'B1.04'),(73,'B2.05'),(74,'B1.06')]]
    xs += [
      multi('B','B2.02',['S053'],
       ('A proxy calls a memory-enabled prompt agent for two users using one managed identity. Which TWO requirements implement separate preferences?' if s=='A' else
        'A new conversation per user did not fix pooled memory behind a backend. Which TWO changes address the actual partition mechanism?'),
       ['Use the memory tool’s {{$userId}} scope.','Send a verified user key through x-memory-user-id.','Use a single static scope for every resident.','Put user display names only in the prompt.','Rely on new conversation IDs as memory partitions.'],['A','B'],
       'The tool’s scope-resolution mechanism is separate from conversation lifecycle. The backend must provide an authorized end-user key.',
       ['A static scope intentionally shares memory.','Prompt naming does not select the tool’s partition.','A conversation ID does not substitute for the memory tool’s scope.']),
      multi('B','B3.01',['S057'],
       ('A support agent needs a domain boundary and a measurable fallback for missing evidence. Which TWO activities address those requirements?' if s=='A' else
        'Tone examples and low temperature did not prevent unsupported out-of-domain answers. Which TWO changes should be tested?'),
       ['State the domain and fallback in system instructions.','Evaluate representative and adversarial queries against that behavior.','Treat a low temperature as complete policy enforcement.','Assume one successful example establishes compliance.','Remove the fallback to reduce prompt length.'],['A','B'],
       'Instructions specify desired behavior, and evaluation checks it. Add host/filter controls when the task requires enforcement.',
       ['Temperature does not guarantee policy compliance.','One example does not establish behavior across cases.','Removing fallback leaves missing-evidence behavior unspecified.']),
      multi('B','B3.04',['S008','S007'],
       ('A specialist agent proposes an action that a deterministic host rule must approve. Which TWO responsibilities should the design keep explicit?' if s=='A' else
        'A model-generated plan bypassed a required rule check in a hybrid workflow. Which TWO responsibilities repair that boundary?'),
       ['The host’s rule/authorization gate before action execution.','The orchestration’s handoff and completion conditions.','The model’s acknowledgement treated as business approval.','Tool registration treated as universal caller permission.','A trace display label treated as an executable rule.'],['A','B'],
       'Hybrid orchestration separates proposals from deterministic rules and supplies explicit flow control. Tool availability does not grant permission.',
       ['A model statement does not supply the required approval.','Registration does not authorize every caller.','A label is not a rule implementation.'])
    ]
    return xs

def matches(s):
    a=[base(s,93,'A3.01' if s=='B' else 'A2.02'),base(s,94,'A2.01' if s=='B' else 'A3.03')]
    a += [
      matching('A','A3.04',['S051','S052','S010'],'Match each keyless inference observation to the boundary to inspect.',
       ['No Entra token can be acquired','A token is acquired but the resource denies inference','The role exists only on a different resource'],
       ['Credential/authentication configuration','Inference authorization for the caller','Role assignment scope covering the called resource'],
       'Generation sampling parameters','Authentication, permission and scope are separate boundaries.'),
      matching('A','A4.01',['S015','S016'],'Match each trust boundary to the relevant inspection point.',
       ['A user’s submitted attack instruction','An instruction inserted into a retrieved document','A harmful generated response'],
       ['User-input protection','External-context/indirect-attack protection','Final-output inspection'],
       'Model token quota','Protect each content boundary; a safe earlier input does not establish safety of later content.')
    ]
    b=[base(s,95,'B2.06' if s=='A' else 'B1.04'),base(s,96,'B2.02' if s=='A' else 'B2.05'),
      matching('B','B2.01',['S054'],'Match each response-turn requirement to the documented tool_choice mode.',
       ['Model may decide whether a tool helps','One or more tool calls are necessary','The turn must produce no tool calls'],
       ['auto','required','none'],'A specific tool execution receipt','Request modes control tool invocation intent; execution and receipts remain host responsibilities.')]
    c=[base(s,97,'C2.04' if s=='A' else 'C3.01')]
    return a,b,c

def artifacts(s):
    E=[];C=[];D=[]
    for n,o in [(59,'E1.04'),(61,'E1.03')]:
        old=base(s,n,o)
        if n==59:
            # A real producing-input/mapping distinction, not a wrong-service caricature.
            old=single('E','E1.04',['S043','S028'],'The index has no OCR text. Which one configuration defect in this exhibit blocks the OCR input path?',
             ['The blob indexer’s imageAction is none.','The text output mapping names the correct enriched node.','The index’s ocr_text field is searchable.','The OCR skill uses the normalized image wildcard.'],'A',
             'The normalized image collection must exist for the OCR skill input. The exhibit’s output path is already correct.',
             ['This correctly maps the produced node after the skill runs.','Searchability is appropriate for retrieval.','The wildcard matches the skill’s normalized-image input.'],kind='code_or_config_artifact',
             artifact=dict(title='Blob OCR pipeline',kind='json',content='''{
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
}'''))
        else:
            old=single('E','E1.03',['S029','S059'],'The pipeline needs layout-derived Markdown for indexing. Which producing capability should replace the enrichment stage in this exhibit?',
             ['OCR only, with no layout extraction.','Document Intelligence Layout skill.','A semantic query configuration.','A field mapper without a producing skill.'],'B',
             'The Layout skill extracts document layout into Markdown and related structure for enrichment. OCR alone does not supply this layout-aware representation.',
             ['OCR supplies text, not the requested layout capability.','Query-time semantics do not produce ingestion output.','A mapping cannot create the missing representation.'],kind='code_or_config_artifact',
             artifact=dict(title='Required enrichment output',kind='json',content='{"input":"source document","requiredOutput":"layout-aware Markdown","consumer":"Search indexer skillset"}'))
        E.append(old)
    E.append(single('E','E2.03',['S045','S059'],
      ('A custom extractor uses the following result. What should happen before the application posts the invoice amount?' if s=='A' else
       'A new invoice layout produces the following result. What action preserves the downstream verification requirement?'),
      ['Post because the JSON parsed.','Route the field for evidence review and business validation.','Use the confidence as payment authorization.','Replace the source amount with the highest nearby number.'],'B',
      'The result carries low confidence and source grounding for inspection. Extraction does not authorize payment or resolve the business rule.',
      ['Parsing verifies shape, not the amount or payment permission.','Confidence estimates extraction, not authority.','A nearby number need not be the required field.'],kind='code_or_config_artifact',
      artifact=dict(title='Invoice analyzer result',kind='json',content='{"total":{"value":1460.00,"confidence":0.42,"source":{"page":2,"span":"invoice total"}},"rule":"verified totals only"}')))
    C.append(base(s,47,'C3.01'))
    C.append(single('C','C2.05',['S020','S021'],'A Content Understanding client uses SDK 1.1.0, while its request contains a preview-only option. Which diagnosis is supported by the exhibit?',
      ['The SDK/API contract and requested capability must be reconciled.','Changing the inference resource key fixes the analyzer schema.','The operation identifier is itself the extracted field result.','A newer date in an unrelated example establishes feature support.'],'A',
      'The retained SDK reference pins its supported API. Select a compatible capability/version before using a preview field; syntax checking does not prove a service call succeeds.',
      ['Credentials do not make an unsupported schema field valid.','The operation handle tracks work rather than supplying analyzed content.','Unrelated examples do not establish this client’s capability.'],kind='code_or_config_artifact',
      artifact=dict(title='Versioned client configuration',kind='json',content='{"sdk":"azure-ai-contentunderstanding 1.1.0","api":"2025-11-01","requested":"preview-only analyzer option","validation":"request shape rejected"}')))
    D.append(single('D','D1.03',['S055'],'The translation result leaves part of this input unchanged. Which cause and response best fit the documented condition?',
      ['The single sentence mixes source languages; segment it into single-language inputs with the intended source language.','The target language needs a speech-synthesis voice.','The request needs more generated tokens.','The result should be accepted because detection returned one language.'],'A',
      'The known-issues page identifies mixed-language sentences as a text translation limitation. A detected language for the whole input does not resolve the mixture.',
      ['A voice is not a text translation control.','Generation length does not address source language mixture.','Detection is not proof that the whole mixed sentence translated correctly.'],kind='code_or_config_artifact',
      artifact=dict(title='Text translation diagnosis',kind='json',content=('{"text":"Replace the filter, dann starten Sie die Pumpe.","detectedLanguage":"en","target":"fr","symptom":"German clause unchanged"}' if s=='A' else
       '{"text":"Bitte prüfen Sie das Ventil, then record the reading.","detectedLanguage":"de","target":"es","symptom":"English clause unchanged"}'))))
    return E,C,D
