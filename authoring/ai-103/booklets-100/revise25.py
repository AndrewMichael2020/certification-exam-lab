"""Apply the accepted 25-item review while preserving the reviewed baseline."""
import copy, json, re
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
draft = json.loads((HERE / 'review-25q/original-25q.draft.json').read_text())
q = draft['questions']
def options(n, texts, notes):
    item=q[n-1]
    item['options']=[dict(id=chr(65+i),text=t) for i,t in enumerate(texts)]
    item['explanation']['whyDistractorsWrong']=notes

options(1,[
 'Use a handoff to transfer responsibility to the next available specialist.',
 'Use a group chat whose coordinator chooses the next speaker from the conversation history.',
 'Use a sequential workflow: extraction feeds policy evaluation, which feeds drafting.',
 'Run extraction and policy evaluation concurrently, then send both results to the drafting agent.'
],dict(A='A handoff routes responsibility dynamically; it does not encode this fixed data dependency.',B='Dynamic speaker selection does not enforce the required stage order.',D='Policy evaluation needs extracted facts before it can produce its decision.'))
q[0]['explanation']['whyCorrect']='Sequential orchestration passes the output of each stage to the next in a defined order. The policy decision depends on extraction, and drafting depends on that decision.'
q[0]['sourceRefs']=[dict(sourceId='S051',title='Microsoft Agent Framework orchestration patterns',url='https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/',docType='microsoft_learn')]
options(2,[
 'Validate arguments, obtain approval for the proposed shipment, then execute with a least-privileged identity.',
 'Approve the proposal and execute its unvalidated arguments with a least-privileged identity.',
 'Validate arguments, execute with a least-privileged identity, and ask the supervisor to confirm the shipment afterwards.',
 'Validate arguments, obtain approval for the proposed shipment, then execute with the service administrator identity.'
],dict(B='Approval does not replace application validation of untrusted arguments.',C='The supervisor must approve before shipment creation.',D='An administrator identity exceeds the required execution privileges.'))
q[3]['explanation']['whyCorrect']="The case names the Foundry account's system-assigned identity as the connection principal. Use that identity for the keyless Search connection and assign the documented Search Index Data Contributor role required by this agent-tool setup."
q[3]['explanation']['examStrategyNote']='Check the runtime principal as well as the service role. Developer access does not establish agent access.'
q[4]['options'][1]['id']='additionalProperties'
q[4]['slots'][1]['id']='additionalProperties'
q[4]['statementTemplate']=q[4]['statementTemplate'].replace('{{additional}}','{{additionalProperties}}')
q[4]['correctAnswer']['pairs']['additionalProperties']=q[4]['correctAnswer']['pairs'].pop('additional')
if 'additional' in q[4]['explanation']['whyDistractorsWrong']:
 q[4]['explanation']['whyDistractorsWrong']['additionalProperties']=q[4]['explanation']['whyDistractorsWrong'].pop('additional')
options(8,[
 'Use session history for learned preferences, a curated knowledge base for the manual, and file search for the uploaded receipt.',
 'Use memory for preferences and the manual; use file search for the receipt.',
 'Use persistent memory for learned preferences, a curated knowledge base for the manual, and persistent memory for the receipt.',
 'Use memory for learned preferences, a knowledge base for the manual, and file search for the receipt.'
],dict(A='Session history does not supply persistent cross-session preferences.',B='Curated company content belongs in a maintained knowledge source.',C='File search is intended for the document uploaded in this interaction.'))
q[8]['stem']=q[8]['stem'].replace('follows that SDK generation','is appropriate for azure-ai-projects 2.x')
options(9,[
 'Construct AIProjectClient with an Azure OpenAI v1 inference endpoint and an Entra credential, then request its OpenAI client.',
 'Construct AIProjectClient with the project endpoint and an Entra credential, then call get_openai_client().',
 'Construct AIProjectClient with the new project endpoint and pass the resource API key as an AzureKeyCredential, then call get_openai_client().',
 'Construct AIProjectClient with an Entra credential and the connected Search service endpoint.'
],dict(A='AIProjectClient requires a project endpoint, not the inference endpoint.',C='The specified client supports Entra authentication, not resource-key authentication.',D='The Search endpoint is a different service boundary.'))
options(10,[
 'Response Completeness (preview), comparing answer coverage with a reference answer.',
 'Document Retrieval, scoring the relevance of documents returned by the search stage.',
 'Groundedness, comparing generated claims with the context supplied to the model.',
 'Relevance, scoring how closely the generated answer addresses the user question.'
],dict(A='Completeness measures coverage, not whether claims follow from the retrieved context.',B='Retrieval evaluation measures the search stage, not the support for the generated extension.',D='A relevant answer can still contain an unsupported claim.'))
options(11,[
 'Enable Application Insights request logging with separate service-call entries identified by service name.',
 'Record final text and end-to-end latency for each request as one structured Application Insights event.',
 'Export timed service spans with operation names to Application Insights, assigning an independent trace identifier to each service.',
 'Export one request trace with timed, nested operation spans and consistent attributes to Application Insights.'
],dict(A='Service names do not establish the request and parent-operation relationships.',B='Total latency does not isolate the slow operation.',C='Independent trace identifiers break the shared request journey.'))
options(13,[
 'The indexer execution history, restricted to the Success status of the most recent completed run.',
 'The index schema, especially fields configured as non-retrievable.',
 'The indexer run details, including document-level errors and warnings for the ingestion window.',
 'The search response count and query latency measured after the most recent ingestion run completed.'
],dict(A='A successful run can still contain document-level errors.',B='Retrievable controls fields in results; it does not diagnose which source documents failed ingestion.',D='Query metrics describe serving behavior, not individual ingestion failures.'))
q[13]['stem']='A managed-compute deployment in Foundry (new, preview) needs additional accelerator capacity. The subscription has unused VM quota for the matching GPU family and region. Which request addresses the deployment capacity limit?'
options(14,[
 'Request a larger serverless model tokens-per-minute allocation in the region.',
 'Request managed-compute quota for the accelerator SKU and region through the Foundry quota process.',
 'Request a larger subscription-wide total of regional vCPUs to cover the accelerator-backed deployment.',
 'Request a VM-family quota increase for that region through the process used for classic managed online endpoints.'
],dict(A='Serverless token throughput does not allocate managed-compute accelerators.',C='The managed-compute preview has a separate accelerator quota.',D='Existing Azure VM quota cannot be applied to this managed-compute allocation.'))
q[13]['explanation']['whyCorrect']='Managed-compute quota is specific to the accelerator SKU and region and is separate from Azure VM quota.'
q[13]['explanation']['examStrategyNote']='Identify whether the limit concerns serverless model throughput, classic VM resources or Foundry managed compute.'
options(15,[
 'Export full spans with tool-content recording enabled, and restrict the Application Insights resource to the designated engineering team.',
 'Redact sensitive fields before export, then generate unrelated trace identifiers for the evaluation and request paths.',
 'Export raw spans with request and evaluation identifiers, then remove sensitive attributes in a nightly retention job.',
 'Keep request and evaluation identifiers, redact sensitive fields before export, and enforce access and retention controls.'
],dict(A='Restricted access does not justify recording access tokens in telemetry.',B='Unrelated identifiers prevent evaluation-to-request correlation.',C='Sensitive values have already entered telemetry before the nightly job.'))
q[16].update(stem='An image-editing feature must replace a product background while preserving the product region. The selected GPT image deployment supports masked editing. Which TWO inputs define the requested edit?',options=[dict(id=k,text=t) for k,t in zip('ABCDE',[
 'The source image submitted as input to the editing request.',
 'A text response-format schema describing the intended image dimensions and colors.',
 'A mask for the region to edit, supplied with the source image and an editing prompt.',
 'A higher image count, used to mark which pixels belong to the editable background.',
 'A quality setting that encodes the boundary between the product and the surrounding background.'
])],correctAnswer=['A','C'],explanation=dict(whyCorrect='Masked image editing combines the original image with a region mask and a prompt describing the desired change. Mask support depends on the chosen model.',whyDistractorsWrong=dict(B='A text-output schema does not specify editable pixels.',D='Image count controls the number of outputs, not the edit region.',E='Quality is an output control, not a spatial mask.')),sourceRefs=copy.deepcopy(next(x for x in json.loads((ROOT/'packs/ai-103/1.1.0/sources/registry.json').read_text())['sources'] if x['id']=='S017')))
src=q[16]['sourceRefs'];q[16]['sourceRefs']=[dict(sourceId=src['id'],title=src['title'],url=src['url'],snapshotSha256=src['sha256'],docType='microsoft_learn')]
q[16]['objectiveTags']=['AI103-C1.03']
options(18,[
 'Name the search icon by its visual appearance, such as a magnifying glass.',
 'Give the search button an accessible name that states its search action.',
 'Give the decorative wave a description that explains its color and position in the page header.',
 'Omit the decorative image alt attribute so assistive technology can use the image source filename.',
 'Use an empty alt attribute for the decorative wave.'
],dict(A='For a functional image, communicate the action or destination.',C='A decorative image does not add meaningful content requiring description.',D='Omitting alt differs from explicitly marking the image as decorative with empty alt.'))
options(19,[
 'Test and train a custom recognition model with domain data and compare its accuracy with a baseline.',
 'Update the application to a neural text-to-speech voice whose pronunciation dictionary includes the equipment terms.',
 'Deploy the selected recognition model to a custom endpoint.',
 'Evaluate the trained recognizer using the same labeled recordings used during its training, then compare the scores.',
 'Deploy the selected recognition model by setting its model identifier as the text-to-speech voice name in the client.'
],dict(B='Changing synthesis pronunciation does not repair speech recognition.',D='Held-out evaluation data is needed for a useful generalization comparison.',E='A recognition model is deployed through a custom recognition endpoint, not a synthesis voice setting.'))
q[18]['explanation']['whyCorrect']='Use representative domain data to evaluate and train a recognizer, compare performance on held-out recordings, and deploy the selected model to a custom endpoint.'
q[19]['options'][4]['text']='Send the Italian source transcript to SpeechSynthesizer configured with a German voice to produce the translation.'
q[19]['explanation']['whyDistractorsWrong']['E']='Choosing a synthesis voice does not translate source-language text; synthesize the translated target text.'
q[22]['explanation']['whyCorrect']='Stop inactive sessions to free active compute while retaining required state. Use backoff with jitter for transient regional limits, and seek support when the regional problem persists.'
q[22]['explanation']['whyDistractorsWrong']['A']='Stopping an unneeded active session addresses its compute use while preserving the state required by the scenario.'
for case in draft['caseStudies']:
 case['intro']='Answer each question using the shared scenario. Your answers do not change the scenario.'
def clean(value):
 if isinstance(value,str):
  return re.sub(r'\bcaptured\s+', '', value, flags=re.I).replace('for this feature generation','for managed compute in Foundry (new)')
 if isinstance(value,list):return [clean(v) for v in value]
 if isinstance(value,dict):return {k:clean(v) for k,v in value.items()}
 return value
draft=clean(draft);draft['id']='ai103-practice25-20261008-r2';draft['revision']='2';draft['reviews']=[]
(HERE/'corrected-25q.draft.json').write_text(json.dumps(draft,indent=2,ensure_ascii=False)+'\n')
print('Preserved original; saved corrected 25-item draft.')
