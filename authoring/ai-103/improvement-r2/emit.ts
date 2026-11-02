import fs from 'node:fs';
import path from 'node:path';
const mode=process.argv[2];
const roots=mode==='evidence'?['packs/ai-103/1.2.0']:['authoring/ai-103/improvement-r2','output/pdf/ai-103-improvement-r2','.local-ci/improvement-r2/qa'];
for(const root of roots) if(fs.existsSync(root)) walk(root);
function walk(dir:string) { for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
 const p=path.join(dir,e.name); if(e.isDirectory()) { if(e.name!=='__pycache__') walk(p); }
 else if(e.name!=='.DS_Store'&&!/\.(py|ts)$/.test(p)) console.log('IMPROVEMENT_FILE '+JSON.stringify({path:p,base64:fs.readFileSync(p).toString('base64')}));
}}
