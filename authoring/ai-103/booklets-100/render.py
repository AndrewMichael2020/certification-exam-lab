"""Render the four requested PDFs using a disposable, allowlisted local project."""
from pathlib import Path
import os,shutil,tempfile,subprocess,re,json,base64,hashlib
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2];OUT=ROOT/'output/pdf'
assert subprocess.check_output(['docker','context','show'],text=True).strip()=='orbstack'
OUT.mkdir(parents=True,exist_ok=True)
reports=[];pdfs={}
with tempfile.TemporaryDirectory(prefix='ai103-booklets-') as tmp:
    stage=Path(tmp)
    for folder in ['src','packs','prompts']:
        for f in (ROOT/folder).rglob('*'):
            if not f.is_file() or f.name=='.DS_Store':continue
            assert not f.is_symlink() and not f.name.startswith('.env')
            dest=stage/f.relative_to(ROOT);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
    for name in ['package.json','package-lock.json','tsconfig.json']:shutil.copy2(ROOT/name,stage/name)
    for name in ['set-a.json','set-b.json','render.ts']:shutil.copy2(HERE/name,stage/name)
    cmd=['/Users/antvibe/Documents/Dev/scripts/codex-node-isolated-run','--project','--network','--run','--image','mcr.microsoft.com/playwright:v1.60.0-noble','--memory','3g','--cpus','2','--command','STUDY_OFFLINE=1 ./node_modules/.bin/tsx render.ts',str(stage)]
    env={'PATH':os.environ['PATH'],'HOME':os.environ['HOME'],'CODEX_ORBSTACK_USAGE_LOG':str(ROOT/'.local-ci/harness-usage.jsonl')}
    proc=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,env=env)
    for line in proc.stdout:
        m=re.match(r'BOOKLET_(PDF|REPORT) (.+)',line)
        if not m:print(line,end='',flush=True);continue
        data=json.loads(m[2]);name=data['filename']
        assert re.fullmatch(r'AI-103-Set-[AB]-(Questions-Only|Practice-With-Answers)-100.pdf',name)
        if m[1]=='PDF':pdfs[name]=base64.b64decode(data['base64'],validate=True)
        else:reports.append(data)
    code=proc.wait();assert code==0,code
    assert len(pdfs)==4 and len(reports)==4
    for name,pdf in pdfs.items():
        (OUT/name).write_bytes(pdf)
        next(r for r in reports if r['filename']==name)['sha256']=hashlib.sha256(pdf).hexdigest()
    (HERE/'render-report.json').write_text(json.dumps(reports,indent=2)+'\n')
    print('Created four PDFs:',', '.join(pdfs),flush=True)
