"""Assemble reproducible, reviewable booklet data and mechanical content checks."""
import collections, copy, csv, hashlib, json, random, re
from pathlib import Path
from editorial import SETS

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
PACK=ROOT/'packs/ai-103/1.1.0'
registry={s['id']:s for s in json.loads((PACK/'sources/registry.json').read_text())['sources']}
claims=json.loads((PACK/'evidence/claims.json').read_text())['claims']
objectives=json.loads((PACK/'objectives.json').read_text())
domains={d['domainId']:d['name'] for d in objectives['officialRanges']}
def digest(value):return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def source(sid):
    s=registry[sid]
    assert hashlib.sha256((PACK/s['snapshot']).read_bytes()).hexdigest()==s['sha256'],sid
    return dict(sourceId=sid,title=s['title'],url=s['url'],snapshotSha256=s['sha256'],docType='microsoft_learn')
def measure(q):
    counts={o['id']:len(' '.join(o['text'].split())) for o in q['options']}
    ca=q['correctAnswer'];keys=[ca] if isinstance(ca,str) else ca
    if not isinstance(keys,list):return None
    top=sorted(counts,key=counts.get,reverse=True);vals=list(counts.values())
    return dict(id=q['id'],type=q['type'],counts=counts,keys=keys,
      keyRanks={k:1+sum(v>counts[k] for v in vals) for k in keys},
      longestIsKey=counts[top[0]]>counts[top[1]] and top[0] in keys,
      singleKeyShortest=len(keys)==1 and counts[keys[0]]<min(v for k,v in counts.items() if k!=keys[0]),
      bothKeysTopTwo=len(keys)==2 and set(keys)==set(top[:2]) and counts[top[1]]>counts[top[2]],
      maximumTied=vals.count(max(vals))>1,minimumTied=vals.count(min(vals))>1)

reports={}; stems=set();all_options=[]
for set_id,raw in SETS.items():
    qs=copy.deepcopy(raw);rng=random.Random('ai103-booklets-100-'+set_id)
    single_keys=list('ABCD'*16);rng.shuffle(single_keys)
    multis=[list(pair) for pair in ['AB','CD','AE','BC','DE','AC','BD','CE','AD','BE','AB','CD','AE','BC','DE','AC','BD','CE']];rng.shuffle(multis)
    sk=0;mk=0
    for i,q in enumerate(qs,1):
        q['id']=f'ai103-set-{set_id.lower()}-q{i:03}'
        q['domainName']=domains[q['domainId']]
        q['sourceRefs']=[source(s) for s in q['sourceIds']]
        q['objectiveTags']=sorted({o for c in claims if c['sourceId'] in q['sourceIds'] for o in c.get('objectiveIds',[]) if o.startswith('AI103-'+q['domainId'])})
        if q['sourceIds']==['S016'] and q['domainId']=='B':
            q['objectiveTags']=['AI103-B2.05']  # Agent guardrails applied to retrieved content.
        assert q['objectiveTags'],(q['id'],'missing domain source objective')
        if 'orderedSteps' in q:
            steps=q.pop('orderedSteps');order=list(range(len(steps)));rng.shuffle(order)
            if order==list(range(len(steps))):order=order[1:]+order[:1]
            q['options']=[dict(id=chr(65+j),text=steps[k]) for j,k in enumerate(order)]
            q['correctAnswer']={'order':[chr(65+order.index(k)) for k in range(len(steps))]}
        elif 'matchingPairs' in q:
            pairs=q.pop('matchingPairs');q['options']=[dict(id=chr(65+j),text=p[0]) for j,p in enumerate(pairs)]
            q['matchChoices']=[p[1] for p in pairs]+[q.pop('unusedChoice')];rng.shuffle(q['matchChoices'])
            q['correctAnswer']={'pairs':{chr(65+j):p[1] for j,p in enumerate(pairs)}}
        else:
            keys=q['correctAnswer'] if isinstance(q['correctAnswer'],list) else [q['correctAnswer']]
            targets=multis[mk] if isinstance(q['correctAnswer'],list) else [single_keys[sk]]
            if len(keys)>1:mk+=1
            else:sk+=1
            ids=[chr(65+k) for k in range(len(q['options']))]; remaining=[k for k in ids if k not in targets];rng.shuffle(remaining)
            mapping=dict(zip(keys,targets)); mapping.update(zip([o['id'] for o in q['options'] if o['id'] not in keys],remaining))
            q['options']=sorted([dict(id=mapping[o['id']],text=o['text']) for o in q['options']],key=lambda o:o['id'])
            q['correctAnswer']=sorted(targets) if len(keys)>1 else targets[0]
            q['explanation']['whyDistractorsWrong']={mapping[k]:v for k,v in q['explanation']['whyDistractorsWrong'].items()}
            assert set(q['explanation']['whyDistractorsWrong'])==set(ids)-set(targets),q['id']
        if q['type']=='multi_select':q['stem']+=' Select TWO answers.'
        if q.get('artifact'):q['type']='code_or_config_artifact'
        # Conservative author estimates; no empirical difficulty claim.
        if i in [2,5,7,11,12,13,14,16,17,18,27,28,29,30,31,33,37,38,39,40,43,44,45,46,50,51,52,53,54,55,56,58,61,62,64]:
            q['difficulty']='easy'
        q['metadata']=dict(generatedAt='2026-10-08T00:00:00Z',model='Codex conversation',reasoningEffort='not recorded',batchId='booklet-'+set_id,validationStatus='draft')
        normalized=' '.join(q['stem'].lower().split());assert normalized not in stems,q['id'];stems.add(normalized)
        assert not re.search(r'\b(sora|remix|captured|frozen|matching magnet|sdk generation)\b',q['stem'],re.I)
        assert len({o['text'] for o in q['options']})==len(q['options'])
        all_options.extend((q['id'],o['id'],o['text']) for o in q['options'])
    assert len(qs)==100
    dc=dict(collections.Counter(q['domainId'] for q in qs));assert dc==dict(A=28,B=33,C=13,D=13,E=13),dc
    measures=[m for q in qs if (m:=measure(q))]
    singles=[m for m in measures if len(m['keys'])==1];multis=[m for m in measures if len(m['keys'])==2]
    stats=dict(singleCount=len(singles),singleKeyLongest=sum(m['longestIsKey'] for m in singles),
        singleKeyShortest=sum(m['singleKeyShortest'] for m in singles),multiCount=len(multis),
        multiLongestIsKey=sum(m['longestIsKey'] for m in multis),multiBothKeysTopTwo=sum(m['bothKeysTopTwo'] for m in multis))
    assert stats['singleCount']==64 and stats['multiCount']==18,stats
    assert 0.18<=stats['singleKeyLongest']/64<=0.20,stats
    assert stats['singleKeyShortest']/64<=0.25,stats
    assert stats['multiLongestIsKey']/18<=0.30 and stats['multiBothKeysTopTwo']/18<=0.10,stats
    # Shared scenarios deliberately do not supply hidden answers or change between items.
    cases=[dict(id='tools',title='Atlas service assistant',intro='Answer each question using the shared scenario. Your answers do not change the scenario.',
      sections=[dict(heading='Service context',body='Atlas sells replacement equipment and operates an internal assistant. Inventory lookups, reservations and shipment or account changes are implemented by host application functions.'),dict(heading='Operating rules',body='Business systems are authoritative for inventory and action outcomes. Tool inputs must be validated against business rules and the caller\'s account access. Actions requiring approval must be approved before execution. Each question describes a separate observation or proposed implementation.')],
      questionIds=[q['id'] for q in qs[18:22]]),
      dict(id='retrieval',title='Meridian knowledge assistant',intro='Answer each question using the shared scenario. Your answers do not change the scenario.',
      sections=[dict(heading='Knowledge workflow',body='Meridian maintains equipment manuals and policy documents in Azure AI Search. Its assistant retrieves evidence, drafts an answer and may call a business lookup tool.'),dict(heading='Review scope',body='Engineers assess retrieval, generation and tool behavior separately. The following questions describe independent observations and proposed changes; one answer does not change the configuration stated in another question.')],questionIds=[q['id'] for q in qs[22:26]])]
    for c in cases:
      for q in qs:
        if q['id'] in c['questionIds']:q['caseStudyId']=c['id'];q['type']='case_study_child'
    exam=dict(id='ai103-100-set-'+set_id.lower(),pack=dict(id='ai-103',version='1.1.0'),createdAt='2026-10-08T00:00:00Z',
      title=f'AI-103 Practice Set {set_id}',setId=set_id,questions=qs,caseStudies=cases,
      plan=dict(totalQuestions=100,domains=[dict(id=k,name=domains[k],count=v) for k,v in dc.items()],difficulty=dict(collections.Counter(q['difficulty'] for q in qs))),
      authoring=dict(status='draft',route='codex-conversation',paidGenerationApiCalls=0,independentReview='The supplied Opus review applies to the earlier 25-item baseline, not these 200 new questions.'))
    (HERE/f'set-{set_id.lower()}.json').write_text(json.dumps(exam,indent=2,ensure_ascii=False)+'\n')
    report=dict(**stats,domains=dc,difficulty=exam['plan']['difficulty'],contentSha256=digest(exam),itemSha256={q['id']:digest(q) for q in qs},
      singleAnswerPositions=dict(collections.Counter(m['keys'][0] for m in singles)),
      lengthMethod='Characters after whitespace normalization. Longest and shortest require a unique extreme. Top-two requires both keys above all distractors; ties at the boundary do not count.',items=measures)
    reports[set_id]=report
    with (HERE/f'option-lengths-set-{set_id.lower()}.csv').open('w',newline='') as f:
      writer=csv.writer(f);writer.writerow(['item','option','characters','keyed','length_rank'])
      for m in measures:
        for k,n in m['counts'].items():writer.writerow([m['id'],k,n,k in m['keys'],1+sum(v>n for v in m['counts'].values())])

report=dict(sets=reports,uniqueStems=len(stems),generatedQuestionCount=200,
  sourceBasis='Immutable local primary-source snapshots captured 2026-10-08; snapshot hashes checked during assembly.',
  reviewStatus='Author checks complete; new content has not received an independent Opus review.',paidGenerationApiCalls=0,
  baselineCorrection=dict(singleKeyLongest='3/15 (20%)',singleKeyShortest='0/15',multiLongestIsKey='1/5 (20%)',multiBothKeysTopTwo='0/5',replacement='Q17: supported masked image editing',blindSolveArithmetic='The earlier review named five verify-only items, leaving twenty, not twenty-one, independently solvable items.'))
(HERE/'quality-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({s:{k:v for k,v in r.items() if k in ['singleCount','singleKeyLongest','singleKeyShortest','multiCount','multiLongestIsKey','multiBothKeysTopTwo','domains','difficulty']} for s,r in reports.items()},indent=2))
