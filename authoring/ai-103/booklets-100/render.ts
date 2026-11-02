import fs from 'node:fs';
import { chromium } from 'playwright';
import { buildExamHtml } from './src/pdfExport.js';

process.env.STUDY_OFFLINE='1';
const browser=await chromium.launch();
try {
  for(const setId of ['A','B']) {
    const exam=JSON.parse(fs.readFileSync(`set-${setId.toLowerCase()}.json`,'utf8'));
    for(const kind of ['questions','practice'] as const) {
      const page=await browser.newPage();
      await page.route('**/*',route=>route.abort());
      const html=buildExamHtml(exam,kind).replace('</style>',`
        @page { size:A4; margin:17mm; }
        body { width:176mm; font-family:Arial,sans-serif; font-size:10.5pt; color:#193044; line-height:1.43; }
        .question-page { break-before:page; break-after:page; }
        .cover { align-items:flex-start; text-align:left; min-height:225mm; justify-content:flex-start; padding-top:14mm; }
        .cover .eyebrow { color:#087e8b; font-size:12pt; font-weight:bold; letter-spacing:1.2px; margin-bottom:11mm; }
        .cover h1 { color:#132e45; font-size:38pt; line-height:1.05; margin:0 0 6mm; }
        .cover h2 { color:#087e8b; font-size:22pt; margin:0 0 8mm; }
        .cover .deck { font-size:13pt; color:#4b6274; max-width:145mm; margin-bottom:7mm; }
        .cover .guide { border-top:3px solid #087e8b; padding-top:5mm; margin-top:5mm; max-width:165mm; }
        .cover p { margin-bottom:3mm; }
        .coverage { font-size:9.5pt; width:100%; margin:5mm 0; }
        .coverage td,.coverage th { padding:6px 9px; border-color:#cbd9df; }
        .section-title { display:none; }
        .question { border:1px solid #cbd9df; border-top:3px solid #087e8b; border-radius:3px; padding:12px 16px; margin-bottom:16px;
          break-inside:avoid; ${kind==='practice'?'break-before:page;':''} }
        .question .stem { font-size:10.6pt; line-height:1.43; margin-bottom:9px; }
        .q-header { gap:5px; margin-bottom:9px; }
        .q-num { color:#087e8b; font-size:13pt; }
        .badge { font-size:7.4pt; padding:2px 6px; }
        .opt { padding:4px 6px; font-size:10pt; line-height:1.37; }
        .opt-id { min-width:24px; }
        .options ul { margin:6px 0 6px 21px; }
        .options li { margin-bottom:3px; font-size:9.5pt; }
        .match-hint { margin-top:10px; color:#087e8b; font-weight:bold; }
        .explanation { border-left:3px solid #087e8b; background:#f1f7f8; padding:9px 11px; margin-top:10px; }
        .exp-title { font-size:9.5pt; margin-bottom:4px; }
        .exp-body,.distractor-list { font-size:9.2pt; line-height:1.38; }
        .distractor-list li { margin-bottom:3px; }
        .sources { font-size:7.2pt; margin-top:9px; }
        .sources p { margin-top:4px; }
        .artifact pre { font-size:8.5pt; line-height:1.35; padding:8px; white-space:pre-wrap; }
        .case-page { break-before:page; break-after:page; padding-top:18mm; }
        .case-page h2 { font-size:25pt; color:#087e8b; margin-bottom:8mm; }
        .case-page .cs-panel { background:#f5fafb; border-color:#78abb2; padding:20px; }
        .case-page .cs-header { color:#193044; font-size:15pt; }
        .case-page .cs-intro,.case-page .cs-section-body { font-size:11pt; line-height:1.55; }
        .case-page .cs-section { margin-top:6mm; }
        .case-page .cs-section-heading { font-size:11pt; color:#087e8b; }
        .case-ref { padding:6px 9px; border-left:3px solid #c79636; background:#fff8e6; font-size:9pt; margin-bottom:8px; }
        .answer-line { margin-top:12px; font-size:9pt; color:#4b6274; }
        .answer-key h2 { color:#087e8b; }
        .answer-key table { font-size:8pt; }
        .answer-key th,.answer-key td { padding:5px 7px; }
        .answer-key thead { display:table-header-group; }
        .answer-key tr { break-inside:avoid; }
        .answer-key td:first-child { width:9%; }
        .answer-key td:nth-child(2) { width:18%; }
      </style>`);
      await page.setContent(html,{waitUntil:'load'});
      await page.evaluate(({setId,kind,cases})=>{
        const cover=document.querySelector('.cover')!;
        cover.innerHTML=`<div class="eyebrow">AZURE AI / EXAM PRACTICE</div><h1>AI-103<br>Practice Set ${setId}</h1><h2>${kind==='questions'?'Questions only':'Practice with answers'}</h2>
        <div class="deck">Developing AI Apps and Agents on Azure<br>100 original questions &middot; 8 October 2026</div>
        <table class="coverage"><thead><tr><th>Coverage</th><th>Questions</th></tr></thead><tbody>
        <tr><td>Plan and manage an Azure AI solution</td><td>28</td></tr><tr><td>Generative AI and agentic solutions</td><td>33</td></tr>
        <tr><td>Computer vision</td><td>13</td></tr><tr><td>Text analysis and speech</td><td>13</td></tr><tr><td>Information extraction</td><td>13</td></tr></tbody></table>
        <div class="guide"><p><strong>How to use this booklet</strong></p>
        <p>${kind==='questions'?'Answer the questions before opening the companion practice edition. This booklet contains no solutions or answer key.':'Try each question before checking the highlighted solution and explanation. For a separate attempt, use the companion questions-only booklet.'}</p>
        <p>Choose one answer unless the question says to select two. For sequences, arrange the lettered steps. For matching, use the provided choice bank; one choice is unused.</p>
        <p>64 single-answer items, including case studies and exhibits; 18 multiple-select; 10 sequences; 8 matching. Case-scenario links connect the relevant questions.</p>
        <p style="font-size:9pt;color:#627887">Objectives effective 16 April 2026. Difficulty labels are author estimates. This is independent practice material, not an official exam or a prediction of your exam score.</p></div>`;
        document.querySelectorAll('.tags,.sources small').forEach(n=>n.remove());
        document.querySelectorAll('.sources p').forEach(p=>{
          if(p.firstChild?.nodeType===Node.TEXT_NODE)p.firstChild.remove();
          p.querySelectorAll('br').forEach((br,i)=>{if(i>0)br.remove()});
        });
        cases.forEach((cs:any,i:number)=>{
          const first=document.querySelector(`#q${cs.numbers[0]}`)!;
          const panel=first.querySelector('.cs-panel')!;
          const section=document.createElement('section');section.className='case-page';section.id=`case-${i+1}`;
          const title=document.createElement('h2');title.textContent=`Case study ${i+1}`;section.append(title);
          const p=document.createElement('p');p.style.marginBottom='20px';
          p.innerHTML=`Questions ${cs.numbers.map((n:number)=>`<a href="#q${n}">${n}</a>`).join(', ')}.`;section.append(p);
          section.append(panel.cloneNode(true));first.before(section);
          for(const n of cs.numbers){const q=document.querySelector(`#q${n}`)!;q.querySelector('.cs-panel')!.remove();
            const ref=document.createElement('p');ref.className='case-ref';ref.innerHTML=`Use <a href="#case-${i+1}">case study ${i+1}: ${cs.title}</a>.`;q.querySelector('.q-header')!.after(ref)}
        });
        if(kind==='questions')document.querySelectorAll('.question').forEach(q=>{
          const line=document.createElement('p');line.className='answer-line';line.textContent='Your answer: __________________________________';q.append(line);
        });
        if(kind==='questions') {
          const nodes=Array.from(document.querySelectorAll('.question,.case-page'));
          let group:HTMLElement|null=null;let used=0;
          for(const node of nodes){
            if(node.classList.contains('case-page')){group=null;used=0;continue;}
            const height=node.getBoundingClientRect().height+18;
            if(!group||used+height>925){group=document.createElement('section');group.className='question-page';node.before(group);used=0;}
            group.append(node);used+=height;
          }
        }
      },{setId,kind,cases:exam.caseStudies.map((c:any)=>({title:c.title,numbers:c.questionIds.map((id:string)=>exam.questions.findIndex((q:any)=>q.id===id)+1)}))});
      const report=await page.evaluate(()=>({questions:document.querySelectorAll('.question').length,
        explanations:document.querySelectorAll('.explanation').length,keys:document.querySelectorAll('.answer-key').length,
        cases:document.querySelectorAll('.case-page').length,
        questionHeights:Array.from(document.querySelectorAll('.question')).map(q=>({id:q.id,height:q.getBoundingClientRect().height})),
        horizontalOverflow:Array.from(document.querySelectorAll('.question,.options,.artifact')).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}));
      if(report.questions!==100||report.cases!==2||report.horizontalOverflow.length)throw new Error(JSON.stringify(report));
      if(kind==='questions'&&(report.explanations||report.keys))throw new Error('Answer leak in questions edition');
      if(kind==='practice'&&report.explanations!==100)throw new Error('Missing explanation');
      const filename=`AI-103-Set-${setId}-${kind==='questions'?'Questions-Only':'Practice-With-Answers'}-100.pdf`;
      const buffer=await page.pdf({format:'A4',printBackground:true,displayHeaderFooter:true,
        headerTemplate:`<div style="font:9px Arial;width:100%;text-align:center;color:#627887">AI-103 &nbsp; | &nbsp; Set ${setId} &nbsp; | &nbsp; ${kind==='questions'?'Questions only':'Practice with answers'}</div>`,
        footerTemplate:'<div style="font:9px Arial;width:100%;text-align:center;color:#627887">Independent practice &nbsp; | &nbsp; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
        margin:{top:'17mm',bottom:'17mm',left:'17mm',right:'17mm'}});
      console.log('BOOKLET_PDF '+JSON.stringify({filename,base64:buffer.toString('base64')}));
      console.log('BOOKLET_REPORT '+JSON.stringify({filename,...report}));await page.close();
    }
  }
}finally{await browser.close()}
