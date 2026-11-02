"""Explicit editorial inputs. No objective inference from a page or domain."""
import copy, json
from pathlib import Path
from cases import CASES

ROOT=Path(__file__).resolve().parents[3]
OLD={s:json.loads((ROOT/f'authoring/ai-103/booklets-100/set-{s.lower()}.json').read_text()) for s in 'AB'}
def tag(s):return 'AI103-'+s
def item(domain, objective, sources, stem, options, key, why, notes, kind='single_choice', **extra):
    ids=[chr(65+i) for i in range(len(options))]
    return dict(domainId=domain,objectiveTags=[tag(objective)],sourceIds=sources,stem=stem,
      options=[dict(id=i,text=t) for i,t in zip(ids,options)],correctAnswer=key,type=kind,difficulty='medium',
      explanation=dict(whyCorrect=why,whyDistractorsWrong=dict(notes)),_decision=stem,_origin=[],**extra)
def single(d,o,s,stem,choices,key,why,wrong,**extra):
    return item(d,o,s,stem,choices,key,why,zip([chr(65+i) for i in range(len(choices)) if chr(65+i)!=key],wrong),**extra)
def multi(d,o,s,stem,choices,keys,why,wrong,**extra):
    return item(d,o,s,stem+' Select TWO answers.',choices,keys,why,zip([chr(65+i) for i in range(len(choices)) if chr(65+i) not in keys],wrong),'multi_select',**extra)
def dropdown(d,o,s,stem,template,slots,keys,why,notes):
    # Options satisfy the common schema; rendered answers come only from slots.
    q=item(d,o,s,stem,['Complete the configured fields.','Inspect all slot choices.'],dict(pairs=keys),why,notes,'dropdown_completion',
      statementTemplate=template,slots=[dict(id=k,choices=v) for k,v in slots.items()])
    return q
def sequence(o,s,stem,steps,why,edges):
    q=item('D',o,s,stem,steps,dict(order=list('ABCD')[:len(steps)]),why,zip(list('ABCD')[:len(steps)],edges),'sequence_order')
    q['_edges']=[dict(before=chr(65+i),after=chr(66+i),reason=edges[i+1]) for i in range(len(steps)-1)]
    return q
def matching(d,o,s,stem,rows,values,unused,why):
    return item(d,o,s,stem+' Use each selected choice once; one choice is unused.',rows,dict(pairs=dict(zip(list('ABCD'),values))),why,
      zip(list('ABCD'),[f'{row}: {value}.' for row,value in zip(rows,values)]),'matching_magnet',matchChoices=values+[unused])
def base(s,n,o,changes=None):
    q=copy.deepcopy(OLD[s]['questions'][n-1])
    q['objectiveTags']=[tag(o)]; q['_origin']=[q['id']];q['_decision']=q['stem']
    q.pop('id');q.pop('domainName',None);q.pop('sourceRefs',None);q.pop('metadata',None);q.pop('caseStudyId',None)
    if changes:q.update(changes)
    # All keys/options are editorial inputs before deterministic final shuffling.
    return q
def patch_option(q,id,text,reason):
    next(o for o in q['options'] if o['id']==id)['text']=text
    q['explanation']['whyDistractorsWrong'][id]=reason
    return q

def case_children(s):
    if s=='A':
      return [
        [single('B','B2.01',['S007'],'In Rotor’s two-warehouse request, west completes first. Which output correlation preserves the API contract?',
          ['Associate each result with its originating call_id.','Associate both results with get_stock.','Associate results with completion position.','Replace the call_id with a newly generated receipt ID.'],'A',
          'rotor-east and rotor-west identify distinct proposed calls even though the function name matches. Completion order does not change function_call_output correlation.',
          ['The shared name cannot distinguish the two calls.','A slower call can complete later; position is not the correlation key.','A business receipt is not the originating function call identifier.']),
         single('B','B2.02',['S054','S007'],'Rotor’s fresh availability turn must use a tool rather than answer from prior knowledge. Both tools are available. Which request-level mode requires tool use?',
          ['auto','required','none','parallel_tool_calls=true'],'B',
          'required demands one or more tool calls. The host still checks which action is proposed, its authorization and any approval requirement.',
          ['auto permits a response without a tool call.','none prevents tool calls.','Permitting parallel calls does not require a tool call.']),
         single('B','B2.05',['S007','S054'],'In Rotor’s cross-account reservation test, the JSON schema passes. Which check must decide whether the host may execute?',
          ['Whether quantity is a JSON number.','Whether the model selected a registered function.','Whether the authenticated customer owns the requested account and the quantity satisfies business constraints.','Whether the tool description includes the word customer.'],'C',
          'The backend session identifies the customer. Shape validation does not establish ownership or valid inventory quantities.',
          ['The schema already passes; numeric type does not authorize the account.','Registration does not grant this caller permission for another account.','A description does not enforce runtime account authorization.']),
         single('B','B2.05',['S007','S054'],'Rotor approved five units, then the proposal changed to fifty. What should the host do?',
          ['Reuse the approval because the function name is unchanged.','Execute fifty units and append the old approval record.','Execute five units while reporting that fifty were booked.','Request approval for the changed argument tuple before execution.'],'D',
          'The case approval binds customer, item, quantity and amount. Changed arguments require a new approval, followed by truthful reporting of the committed result.',
          ['Approval applies to the exact proposal, not a function category.','Appending evidence after the side effect cannot supply prior approval.','Silently executing a different quantity and misreporting it violates the action and receipt contract.'])],
        [single('B','B1.02',['S025'],'Harbor must serve HX-104 identifiers and descriptions of symptoms. Which retrieval approach combines those signals?',
          ['Semantic reranking without initial retrieval.','Vector search followed by alphabetical identifier sorting.','Hybrid keyword and vector retrieval with ranked-list fusion.','Keyword retrieval followed by increasing generation temperature.'],'C',
          'Harbor’s exact identifiers benefit from keyword retrieval and descriptive queries benefit from vectors. Hybrid search fuses the ranked candidates; a semantic reranker can operate afterward.',
          ['Reranking requires retrieved candidates and does not replace retrieval.','Alphabetical sorting is not a keyword relevance ranking.','Generation temperature does not add vector retrieval.']),
         single('B','B1.02',['S026','S058'],'Harbor tests harbor-embed-y for queries while content remains from harbor-embed-x. Equal dimensions did not preserve relevance. Which correction targets the mismatch?',
          ['Use compatible content and query embeddings, or regenerate content for a validated new embedding configuration.','Increase the number of final-answer tokens.','Rescale unrelated query vectors to match the old vectors’ numeric range.','Enable semantic ranking and leave embedding compatibility unresolved.'],'A',
          'The case uses unrelated models. Dimension compatibility is necessary for vector fields but does not create a shared semantic space.',
          ['Output length changes generation, not the embedding space.','Numeric rescaling does not align unrelated learned representations.','Reranking is an additional stage and does not repair the vector representation contract.']),
         single('B','B1.04',['S039'],'Harbor answers twenty-four months from a passage saying twelve. It stays on topic. Which evaluation isolates this defect?',
          ['Relevance','Groundedness','Query latency','Tool selection'],'B',
          'The warranty claim contradicts the supplied passage. Groundedness examines answer support in context, distinct from topical relevance.',
          ['The answer can be on topic while unsupported.','Transport timing does not assess factual support.','The defect described is a generated claim, not a selected tool.']),
         single('B','B1.02',['S040','S054'],'Harbor’s employee is authorized for one department. Which control enforces that boundary before passages reach the model?',
          ['Add a system instruction to ignore other departments.','Let the model remove disallowed citations.','Include all departments and shorten the answer.','Derive and apply a retrieval filter from the authenticated employee’s allowed department.'],'D',
          'The case requires access filtering before evidence is returned. A supported filter on the filterable department field narrows retrieval; the host supplies the authorized value.',
          ['Instructions do not prevent unauthorized passages from entering context.','Citation filtering occurs after the unauthorized data has already been returned.','A shorter response does not enforce the retrieval boundary.'])],
        [single('A','A2.02',['S005'],'Which deployment fits Lumen’s interactive EU-processing and on-demand billing requirements?',
          ['Global Standard in an EU resource.','Data Zone Batch.','Data Zone Provisioned.','Data Zone Standard in the EU.'],'D',
          'Lumen permits EU-wide processing, requires interactive completion and wants token billing. Data Zone Standard satisfies those constraints given the stated model availability and quota.',
          ['The resource region alone does not constrain Global processing to the EU.','Batch is asynchronous and conflicts with the interactive workload.','Provisioned introduces reserved throughput rather than the requested on-demand billing.']),
         single('A','A3.04',['S051','S052'],'Lumen’s runtime obtains a token but Reader-only inference is denied. Which documented role at the called Azure OpenAI resource supplies inference permission?',
          ['Cognitive Services OpenAI User.','Reader on the Foundry project only.','Search Index Data Reader.','A deployment workflow’s role on another project.'],'A',
          'The named /openai/v1/ endpoint requires the runtime identity’s inference permission. Cognitive Services OpenAI User is the documented inference role; scope must cover the called resource.',
          ['Management reading does not grant the named inference permission.','That role applies to Search data, not Azure OpenAI inference.','A different principal and different resource scope do not authorize this runtime call.']),
         single('A','A3.04',['S011'],'Lumen’s Search role is correct, but the runtime resolves Search publicly. What should be repaired first?',
          ['The runtime principal’s model-token quota.','Private DNS resolution and links for the runtime subnet.','The developer laptop’s working Search role.','The semantic configuration on the Search index.'],'B',
          'Public access is disabled and the runtime resolves to a public address. Repair its private DNS path and connectivity; the laptop observation is from another network.',
          ['Model quota does not change Search hostname resolution.','The case already distinguishes the developer from the runtime network.','Semantic relevance settings do not repair the network path.']),
         single('A','A2.04',['S012','S010'],'Lumen’s OIDC token succeeds but deployment is denied. Which authorization correction targets the case defect?',
          ['Rotate a long-lived secret into GitHub.','Change the runtime Search role.','Assign the workflow principal the required deployment role on the intended project.','Use the endpoint string as a credential.'],'C',
          'Authentication works. The workflow role is scoped to a different project; align deployment authorization with the target while retaining federation.',
          ['Changing credential style does not correct the role’s resource scope.','Runtime Search access belongs to a different operation and principal.','An endpoint locates a service and is not an authentication credential.'])],
        [single('B','B2.02',['S053'],'North uses one backend principal and {{$userId}} with no header. Which implementation separates authenticated subscribers?',
          ['Create a new conversation title for each subscriber.','Pass a stable authenticated tenant/subscriber key in x-memory-user-id on each response call.','Retain the backend identity as the shared user partition.','Place the subscriber key only in a natural-language prompt.'],'B',
          'Without the header the tool falls back to the caller’s Entra identity. North’s caller is the shared backend. Derive an authorized end-user key and send the documented header.',
          ['A title does not define the memory tool’s scope.','The shared caller cannot provide separate subscriber partitions.','Prompt text does not replace the documented scope-resolution input.']),
         single('B','B2.02',['S053'],'North’s administrative job searches low-level memory with the subscriber named only in query text. What must change?',
          ['Use the subscriber’s display name as the conversation title.','Attach the query to a longer conversation.','Specify the intended subscriber scope explicitly on the direct memory API operation.','Rely on {{$userId}} being inferred from the query text.'],'C',
          'Direct memory operations require explicit scope; automatic identity extraction is a memory-search tool behavior. The admin job must select its authorized subscriber partition.',
          ['Display naming does not supply the direct operation’s scope.','Conversation length does not choose a memory partition.','The low-level API does not infer scope from query text.']),
         single('B','B1.05',['S037'],'North’s Responses builder copied response_format from Chat Completions. Where should its structured-result format be configured?',
          ['Responses text.format.','The returned function_call_output record.','The conversation title.','Chat Completions response_format left unchanged on Responses.'],'A',
          'The case explicitly uses Responses. Its structured-output request shape places the format under text.format; note’s nullable value and required presence are separate schema concerns.',
          ['A tool result is not the model response-format configuration.','Conversation naming does not configure the response schema.','This retains the request-shape error being diagnosed.']),
         single('B','B3.01',['S057'],'North wants a domain boundary and clarification when evidence is missing. Which design addresses behavior and enforcement?',
          ['Lower temperature and remove the system instruction.','Use tone examples as the complete access control.','Ask the model to authorize its own booking actions.','Keep explicit role/fallback instructions, evaluate behavior, and enforce tool permissions in the host.'],'D',
          'System instructions express the domain and fallback, but they do not guarantee compliance. Evaluation and host action controls implement the case’s separate behavioral and permission boundaries.',
          ['Temperature does not define an allowed domain or fallback.','Tone examples do not authorize actions.','The case gives action authority to the host, not model self-approval.'])],
      ]
    return [
      [single('B','B2.02',['S054'],'Fleet’s intake turn must collect a date without tools. Which tool_choice mode fits this turn?',
       ['auto','required','none','Omit the parameter and rely on the booking example.'],'C','none prevents tool calls. This is distinct from the later availability turn that must consult tools.',
       ['auto permits tool use.','required forces at least one tool despite the missing date.','An example does not impose the request-level prohibition.']),
       single('B','B2.01',['S007'],'Fleet’s south result completes before north. Which field must each function_call_output preserve?',
       ['The originating fleet-north or fleet-south call_id.','The shared list_slots function name.','The result’s completion position.','The backend managed identity’s object ID.'],'A','Each output is correlated to its originating Responses call. The sites and completion order do not replace call_id.',
       ['The same function name appears twice.','Concurrency changes completion order.','The principal identifies authorization, not the proposed call.']),
       single('B','B2.05',['S007','S054'],'Fleet’s host returned success without contacting book_visit. Which change restores the action receipt contract?',
       ['Rename the model acknowledgement to booking_receipt.','Execute the validated, authorized and approved action, then report the service’s committed result.','Record a successful tool-selection score instead of calling the service.','Ask the model to invent a receipt matching the expected pattern.'],'B','Only the dispatch service issues a receipt after commit. Proposal, schema and approval are prerequisites, not evidence that booking happened.',
       ['Relabeling text does not commit the action.','Selection is not execution.','A generated identifier does not establish a real booking.']),
       single('B','B2.05',['S054','S007'],'Fleet’s overtime proposal changes engineer after approval. Which host rule follows the stored approval contract?',
       ['Reuse approval if the site matches.','Book the new engineer before contacting the customer.','Revalidate and obtain approval for the changed tuple before booking.','Treat a vendor note saying approved as a replacement.'],'C','The case approval binds engineer, site, slot and amount; changing an engineer invalidates that authorization.',
       ['A partial tuple match is insufficient.','The case requires prior approval for the exact tuple.','Vendor content is not the approving principal.'])],
      [single('B','B1.02',['S025'],'Stonebridge proposes semantic reranking instead of creating embeddings. Which correction applies?',
       ['Reranking changes the original source-field mappings.','Reranking creates stored vectors from the corpus.','Reranking makes keyword retrieval unnecessary for exact part numbers.','Reranking operates on retrieved candidates; it does not replace embedding generation.'],'D','Stonebridge still needs content and query vectorization for its vector path. Semantic reranking is an additional retrieval stage.',
       ['Mappings are ingestion configuration.','Semantic reranking does not create corpus embeddings.','The exact identifiers remain useful keyword evidence.']),
       single('B','B1.02',['S058','S026'],'Stonebridge switched only the query vectorizer to warranty-v2. What migration resolves the representation mismatch?',
       ['Validate v2 and regenerate index vectors with that compatible configuration before switching queries.','Keep v1 vectors and resize the final answer.','Treat equal dimensions as proof of interchangeability.','Change division labels to match the new deployment name.'],'A','An embedding-model migration must align indexed content and query embeddings. The controlled reindexing and held-out evaluation in the case provide a rollout path.',
       ['Generation length does not rebuild embeddings.','Equal dimensions do not align unrelated semantic spaces.','Division labels enforce access, not vector compatibility.']),
       single('B','B1.04',['S039'],'Stonebridge quotes the warranty accurately when asked to schedule a visit. Which evaluation captures the immediate mismatch?',
       ['Groundedness alone.','Response relevance to the user’s scheduling question.','Embedding dimensions.','Tool input shape.'],'B','The quotation may be supported but does not answer the scheduling question. Relevance separates this from the unsupported-policy incident.',
       ['Context support alone cannot assess whether the question was answered.','The observed failure is a topical mismatch.','No malformed tool call is described.']),
       single('B','B1.02',['S040','S054'],'Stonebridge retrieves both divisions despite a system instruction. Which change targets the access defect?',
       ['Increase the model’s attention to the instruction.','Remove other-division citations after generation.','Apply the authorized division value as a supported Search retrieval filter.','Enable semantic reranking on the unfiltered result.'],'C','The filterable division exists and the host knows the employee’s allowed division. Enforce that boundary in retrieval before returning passages.',
       ['Model attention does not prevent data disclosure into context.','Citation removal happens after retrieval.','Reranking changes relevance ordering, not authorization scope.'])],
      [single('A','A3.01',['S009'],'Summit’s regional_session_quota_exceeded persists after suitable retries. Regions cannot change. What is the documented next step?',
       ['Delete all stored sessions.','Increase Search replicas.','Repeat immediate retries indefinitely.','Open an Azure support request with the persistent regional error details.'],'D','The regional-capacity incident persists after appropriate backoff. Escalation follows the documented path without violating geography or state retention.',
       ['Deleting state conflicts with the case and does not establish regional capacity.','Search replicas are unrelated to hosted session capacity.','The stipulated retry period already failed; immediate looping is not a capacity remedy.']),
       single('A','A3.04',['S051','S052'],'Summit’s v1 runtime role is on an unrelated resource. Tokens and networking work. What authorization change is required?',
       ['Assign the inference role to the runtime principal at a scope covering the called Azure OpenAI resource.','Copy the operator’s endpoint variable without changing runtime roles.','Switch to the laptop’s Search credential.','Increase model-token quota.'],'A','The role must cover the actual resource and calling principal. A working token establishes authentication, not resource authorization.',
       ['The endpoint is already known; it does not change role scope.','Search credentials and the laptop principal do not authorize this inference call.','Quota does not fix the authorization boundary.']),
       single('A','A2.01',['S009'],'Which hosted-agent setup fits Summit’s customer-managed state requirement?',
       ['Basic setup plus more model throughput.','Standard setup with customer-managed supporting resources.','Basic setup plus a longer response window.','Delete sessions immediately after each request.'],'B','The case distinguishes agent storage ownership from model capacity. Standard setup uses the documented customer-managed supporting resources.',
       ['Increasing model throughput does not move agent state.','Response length does not change storage ownership.','The case requires retained state.']),
       single('A','A4.03',['S013'],'Summit cannot link a low evaluation score to an existing timed trace. Which addition repairs the missing evidence link?',
       ['Export raw tokens into every span.','Give each span an unrelated trace ID.','Retain a safe request identifier linked from the evaluation record to the trace.','Replace evaluation IDs with model display names.'],'C','The timing and access controls already exist. Safe evaluation-to-request correlation supplies the missing navigation path.',
       ['Credentials are not correlation keys and must remain redacted.','Unrelated identifiers destroy request correlation.','A display name does not identify the evaluated request.'])],
      [single('B','B1.06',['S056','S002'],'City’s new AI Projects code needs maintenance-help, an existing agent. Which project operation matches the current reference?',
       ['project.agents.get(agent_name="maintenance-help")','project.agents.get_agent("asst_maintenance-help")','Use the Search endpoint as the agent name.','Construct AgentsOperations directly with the name.'],'A','The reference exposes get(agent_name) through AIProjectClient.agents. The case names a new Foundry agent rather than a classic assistant ID.',
       ['This is the copied classic shape under investigation.','A Search endpoint is neither this agent name nor the project endpoint.','The operations class is accessed through the client, not directly instantiated.']),
       single('B','B2.02',['S053'],'City’s static city-shared memory scope mixes resident preferences. Which tool configuration and call input implement the intended partitions?',
       ['Keep city-shared and change conversation titles.','Use {{$userId}} and pass an authenticated resident key in x-memory-user-id.','Put the resident’s display name in the tool description.','Create longer conversations under the backend identity.'],'B','The memory tool resolves the placeholder from the header before falling back to caller identity. City must derive the key from its authenticated resident session.',
       ['Titles do not change a static scope.','A description is not the documented resolution input.','The shared backend and longer history do not provide resident partitions.']),
       single('B','B3.01',['S057','S054'],'City proposes low temperature as the sole domain and booking control. Which design addresses both requirements?',
       ['Keep only the tone examples.','Use temperature as the host authorization rule.','State role/fallback instructions, evaluate responses, and enforce booking authorization in host code.','Let the scheduling specialist grant its own permissions.'],'C','Instructions express the conversational boundary; evaluation measures behavior. The host enforces the separate action permission and approval contract.',
       ['Tone examples do not define the full scope or enforce actions.','A sampling parameter is not authorization.','A specialist cannot replace the host’s authority boundary.']),
       single('B','B2.01',['S007','S054'],'City’s lookup returns a connection string and not-found code. What should the host return to the model?',
       ['The raw exception because it came from a trusted service.','The exception in a code block.','The credential renamed diagnostic_context.','A sanitized result retaining the useful not-found code and removing the credential.'],'D','The case locates service secrets in protected host context. Preserve safe error information while excluding the connection string from model-visible output.',
       ['A trusted service can still return sensitive data.','Formatting does not remove the secret.','Renaming does not change the data disclosed.'])],
    ]
