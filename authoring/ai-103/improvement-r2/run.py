"""Allowlisted credential-free staging; execute authoring in cached OrbStack image."""
from pathlib import Path
import base64, hashlib, json, os, re, shutil, subprocess, sys, tempfile

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
QA=ROOT/'.local-ci/improvement-r2';QA.mkdir(parents=True,exist_ok=True)
IMAGE='mcr.microsoft.com/playwright:v1.60.0-noble'
mode=sys.argv[1] if len(sys.argv)>1 else 'checkpoint'
assert mode in ['evidence','checkpoint','assemble','single']
assert subprocess.check_output(['docker','context','show'],text=True).strip()=='orbstack'
image_id=json.loads(subprocess.check_output(['docker','image','inspect',IMAGE]))[0]['Id']
inputs={};outputs={}
with tempfile.TemporaryDirectory(prefix='ai103-improvement-') as tmp:
    stage=Path(tmp)
    files=[ROOT/n for n in ['package.json','package-lock.json','tsconfig.json']]
    for folder in ['src','public','packs','prompts','tests/fixtures','authoring/ai-103/improvement-r2']:
        files.extend(p for p in (ROOT/folder).rglob('*') if p.is_file() and p.name!='.DS_Store' and not p.suffix=='.pdf' and '__pycache__' not in p.parts)
    # The old inputs are immutable lineage, not runtime stores.
    files.extend(ROOT/f'authoring/ai-103/booklets-100/set-{s}.json' for s in ['a','b'])
    for f in sorted(set(files)):
        assert not f.is_symlink() and not f.name.startswith('.env')
        rel=f.relative_to(ROOT);dest=stage/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
        inputs[str(rel)]=hashlib.sha256(f.read_bytes()).hexdigest()
    prefix='authoring/ai-103/improvement-r2'
    if mode=='evidence':command=f'./node_modules/.bin/tsx {prefix}/prepare-evidence.ts && ./node_modules/.bin/tsx {prefix}/prepare-evidence.ts && ./node_modules/.bin/tsx {prefix}/emit.ts evidence'
    elif mode=='assemble':command=f'python3 {prefix}/checkpoint-inputs.py > {prefix}/checkpoint.inputs.json && ./node_modules/.bin/tsx {prefix}/assemble.ts checkpoint && ./node_modules/.bin/tsx {prefix}/emit.ts checkpoint'
    elif mode=='checkpoint':command=f'python3 {prefix}/checkpoint-inputs.py > {prefix}/checkpoint.inputs.json && ./node_modules/.bin/tsx {prefix}/assemble.ts checkpoint && ./node_modules/.bin/tsx {prefix}/qa.ts checkpoint && ./node_modules/.bin/tsx {prefix}/emit.ts checkpoint'
    elif mode=='single':command=f'python3 {prefix}/single-inputs.py > {prefix}/single.inputs.json && ./node_modules/.bin/tsx {prefix}/assemble.ts single && ./node_modules/.bin/tsx {prefix}/qa.ts single && ./node_modules/.bin/tsx {prefix}/emit.ts single'
    cmd=['/Users/antvibe/Documents/Dev/scripts/codex-node-isolated-run','--project','--network','--run','--image',IMAGE,'--memory','3g','--cpus','2','--command',command,str(stage)]
    env={'PATH':os.environ['PATH'],'HOME':os.environ['HOME'],'CODEX_ORBSTACK_USAGE_LOG':str(QA/'harness-usage.jsonl')}
    proc=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,env=env)
    log=[]
    for line in proc.stdout:
        if line.startswith('IMPROVEMENT_FILE '):
            p=json.loads(line[len('IMPROVEMENT_FILE '):]);relative=p['path']
            valid=relative.startswith('packs/ai-103/1.2.0/') if mode=='evidence' else any(relative.startswith(d) for d in [prefix+'/', 'output/pdf/ai-103-improvement-r2/', '.local-ci/improvement-r2/qa/'])
            assert valid and '..' not in Path(relative).parts and not relative.endswith('.py') and not relative.endswith('.ts')
            outputs[relative]=base64.b64decode(p['base64'],validate=True)
        else:
            print(line,end='',flush=True);log.append(line)
    code=proc.wait()
    if mode=='evidence' and code==0:
        hashes=[line.strip().split()[-1] for line in log if line.startswith('Evidence manifest hash: ')]
        assert len(hashes)==2 and hashes[0]==hashes[1], 'Evidence preparation must be idempotent'
    # Failure diagnostics may persist, but failed generated packages/PDFs never replace outputs.
    if code==0:
        for relative,data in outputs.items():
            dest=ROOT/relative;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
report={'mode':mode,'exitCode':code,'image':IMAGE,'imageId':image_id,'inputSha256':inputs,
 'outputSha256':{k:hashlib.sha256(v).hexdigest() for k,v in outputs.items()},'command':command}
(QA/f'{mode}-run.json').write_text(json.dumps(report,indent=2)+'\n')
(QA/f'{mode}-run.log').write_text(''.join(log))
print(f'{mode}: exit {code}, {len(outputs)} generated files',flush=True)
raise SystemExit(code)
