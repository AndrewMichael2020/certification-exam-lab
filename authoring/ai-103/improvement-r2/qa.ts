/** Real draft rendering and separate disposable synthetic import/attempt tests. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { chromium, expect, type Page } from '@playwright/test';
import { contentHash } from '../../../src/packs.js';
import { itemRevisionHash, validateAssembly, validateImport } from '../../../src/importValidation.js';
import { syntheticPackage } from '../../../tests/fixtures/importPackage.js';
import { computeAntiBias } from '../../../src/antiBias.js';
import { buildExamHtml } from '../../../src/pdfExport.js';
import type { ExamSet } from '../../../src/types.js';

const base = 'authoring/ai-103/improvement-r2';
const qaRoot = `${base}/qa`; fs.mkdirSync(qaRoot, { recursive: true });
const out = 'output/pdf/ai-103-improvement-r2'; fs.mkdirSync(out, { recursive: true });
const mode = process.argv[2] ?? 'checkpoint';
const names = mode === 'checkpoint' ? ['checkpoint'] : ['a'];
const initialHashes = names.map(n => contentHash(JSON.parse(fs.readFileSync(`${base}/${n}.draft.json`, 'utf8'))));
execFileSync('./node_modules/.bin/tsx', [`${base}/assemble.ts`, mode], { stdio: 'inherit' });
assert.deepEqual(names.map(n => contentHash(JSON.parse(fs.readFileSync(`${base}/${n}.draft.json`, 'utf8')))), initialHashes, 'Assembly must be reproducible');
const reports: any[] = [];
const disposable = fs.mkdtempSync(path.join(os.tmpdir(), 'ai103-qa-store-'));
const server = spawn('./node_modules/.bin/tsx', ['src/server.ts'], { env: { ...process.env,
  EXAM_DATA_ROOT: disposable, STUDY_OFFLINE: '1', OPENAI_API_KEY: '', GCS_BUCKET: '', NODE_ENV: 'development', HOST: '127.0.0.1', PORT: '3137', REQUESTS_PER_MINUTE: '5000' }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = ''; server.stdout.on('data', chunk => logs += chunk); server.stderr.on('data', chunk => logs += chunk);
const url = 'http://127.0.0.1:3137';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
await context.route('**/*', async route => {
  const host = new URL(route.request().url()).hostname;
  if (host === '127.0.0.1' || host === 'localhost') await route.continue(); else await route.abort();
});
const json = async (route: string, data?: unknown) => {
  const response = await fetch(url + route, data === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
  return { status: response.status, data: await response.json() };
};
async function answer(page: Page, q: any) {
  const card = page.locator('#questionCard');
  if (q.type === 'dropdown_completion' || q.type === 'matching_magnet') {
    for (const [key, value] of Object.entries(q.correctAnswer.pairs)) await card.locator(`select[data-match-key="${key}"]`).selectOption(String(value));
  } else if (q.type === 'sequence_order') {
    // Default visual order is not a submitted answer until an ordering control is used.
    await card.locator('[data-seq-down="0"]').click();
    for (let target = 0; target < q.correctAnswer.order.length; target++) {
      const wanted = q.correctAnswer.order[target];
      let position = (await card.locator('.seq-item').evaluateAll(nodes => nodes.map(n => (n as HTMLElement).dataset.id))).indexOf(wanted);
      while (position > target) { await card.locator(`[data-seq-up="${position}"]`).click(); position--; }
    }
  } else {
    for (const key of Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]) await card.locator(`.option-btn[data-opt="${key}"]`).click();
  }
}
async function start(page: Page, id: string) {
  await page.goto(url); await page.locator('#packSelect').selectOption('ai-103');
  await page.locator(`[data-exam-id="${id}"][data-exam-mode="exam"]`).click();
  await expect(page.locator('#view-exam')).toBeVisible();
  await expect(page.locator('#examIdentity')).toContainText('v1.2.0');
}
try {
  let healthy = false;
  for (let i = 0; i < 100; i++) { try { healthy = (await fetch(url + '/healthz')).ok; } catch {} if (healthy) break; await new Promise(r => setTimeout(r, 100)); }
  assert(healthy, logs);
  const planned = await json('/api/exams/blueprint', { pack: { id: 'ai-103', version: '1.2.0' }, questionCount: mode === 'checkpoint' ? 20 : 100 });
  assert.equal(planned.status, 200); assert.equal(planned.data.pack.version, '1.2.0');
  for (const name of names) {
    const draft = JSON.parse(fs.readFileSync(`${base}/${name}.draft.json`, 'utf8'));
    validateAssembly(draft.plan, draft.questions, draft.caseStudies);
    const rejected = await json('/api/exams/import', draft); assert.equal(rejected.status, 400);
    assert.throws(() => validateImport({ ...draft, status: 'released' }));
    const changed = structuredClone(draft.caseStudies); changed[0].sections[0].body += ' Updated fact.';
    for (const q of draft.questions.filter((q: any) => q.caseStudyId === changed[0].id)) assert.notEqual(itemRevisionHash(q, changed), itemRevisionHash(q, draft.caseStudies));
    const exam: ExamSet = { id: draft.id, pack: draft.pack, createdAt: draft.provenance.authoredAt, plan: draft.plan, questions: draft.questions, caseStudies: draft.caseStudies, antiBias: computeAntiBias(draft.questions) };
    const page = await context.newPage();
    // Preview actual study material in memory; it is never imported or persisted.
    await page.route('**/api/exams?*', route => route.fulfill({ json: [{ ...exam, isPublished: false }] }));
    await page.route(`**/api/exams/${exam.id}`, route => route.fulfill({ json: exam }));
    await start(page, exam.id);
    const seen = new Set<string>(); let dropdownScreenshot = false;
    for (const [index, q] of exam.questions.entries()) {
      await expect(page.locator('#examCounter')).toHaveText(`Q ${index + 1} / ${exam.questions.length}`);
      seen.add(q.type);
      if (q.caseStudyId) {
        await expect(page.locator('.case-study-panel')).toBeVisible();
        if (index === 0) await page.screenshot({ path: `${qaRoot}/${name}-case-browser.png`, fullPage: true });
      }
      if (q.type === 'dropdown_completion') {
        assert.equal(await page.locator('.dc-select').count(), q.slots!.length);
        for (const slot of q.slots!) assert.deepEqual(await page.locator(`.dc-select[data-match-key="${slot.id}"] option`).allTextContents(), ['▼', ...slot.choices]);
        if (!dropdownScreenshot) { await page.screenshot({ path: `${qaRoot}/${name}-code-browser.png`, fullPage: true }); dropdownScreenshot = true; }
      }
      await answer(page, q);
      if (index < exam.questions.length - 1) await page.locator('#nextBtn').click();
    }
    await page.goto(url); await page.locator('#packSelect').selectOption('ai-103');
    await page.locator(`[data-exam-id="${exam.id}"][data-exam-mode="review"]`).click();
    const dropdownIndex = exam.questions.findIndex(q => q.type === 'dropdown_completion');
    for (let i = 0; i < dropdownIndex; i++) await page.locator('#nextBtn').click();
    await answer(page, exam.questions[dropdownIndex]);
    await expect(page.locator('#questionCard .explanation-block')).toBeVisible();
    await page.locator('#questionCard .explanation-block details').evaluateAll(nodes => nodes.forEach(n => (n as HTMLDetailsElement).open = true));
    await expect(page.locator('#questionCard .dc-correct')).toHaveCount(exam.questions[dropdownIndex].slots!.length);
    await page.screenshot({ path: `${qaRoot}/${name}-answered-code-browser.png`, fullPage: true });
    await page.close();
    const pdfRecords: any[] = [];
    for (const kind of ['questions', 'practice'] as const) {
      const print = await context.newPage();
      await print.setContent(buildExamHtml(exam, kind));
      await print.addStyleTag({ content: 'pre,code,.options p,.dc-statement{white-space:pre-wrap;overflow-wrap:anywhere} .question{break-inside:avoid;page-break-inside:avoid} .case-context{break-before:page;break-after:page} .sources small{display:none} .cover{min-height:700px} .badge.diff{display:none} .options{break-inside:avoid} .cs-panel{break-inside:auto} .cover .meta{line-height:1.8} .artifact pre{font-size:8.5pt;line-height:1.35} .question[data-type="matching_magnet"]{font-size:10pt;padding:10px;line-height:1.3} .question[data-type="matching_magnet"] .opt{padding:4px 8px;margin-bottom:3px} .question[data-type="matching_magnet"] .explanation{padding:10px;margin-top:10px} .question[data-type="matching_magnet"] .sources{font-size:8pt;line-height:1.25} .question[data-type="matching_magnet"] .stem{font-size:10.5pt;margin-bottom:10px} .question[data-type="matching_magnet"] .opt.correct{grid-template-columns:minmax(0,1fr) 230px} .question[data-type="matching_magnet"] .options ul{padding-left:18px}' });
      const createdLabel = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium', timeStyle: 'long', timeZone: 'America/Vancouver',
      }).format(new Date(exam.createdAt));
      await print.evaluate(({ label, kind, cases, total, createdLabel }) => {
        const cover = document.querySelector('.cover')!;
        cover.innerHTML = `<h1>AI-103 Practice</h1><div class="subtitle">${label}</div><div class="meta">${total} questions<br>${kind === 'questions' ? 'Questions only' : 'Answers, explanations and source links'}<br>Prep suite created: ${createdLabel}</div>`;
        const seen = new Set();
        for (const parent of cases) {
          const children = parent.questionIds.map((id: string) => document.querySelector(`[data-item-id="${id}"]`));
          // Shared renderer uses sequential element IDs; find their panels by title.
          const panels = Array.from(document.querySelectorAll('.cs-panel')).filter(p => p.querySelector('.cs-header')!.textContent!.endsWith(parent.title));
          if (!panels.length) continue;
          const first = panels[0]; const section = document.createElement('section'); section.className = 'case-context';
          section.append(first.cloneNode(true)); first.closest('.question')!.before(section);
          for (const panel of panels) { const p = document.createElement('p'); p.textContent = `Use shared case: ${parent.title}.`; panel.replaceWith(p); }
        }
        document.querySelectorAll('.sources small').forEach(n => n.remove());
        document.querySelector('.section-title')?.remove();
      }, { label: name === 'checkpoint' ? 'Design checkpoint' : `Set ${name.toUpperCase()}`, kind, cases: exam.caseStudies, total: exam.questions.length, createdLabel });
      assert.equal(await print.locator('.question').count(), exam.questions.length);
      assert.equal(await print.locator('.explanation').count(), kind === 'questions' ? 0 : exam.questions.length);
      for (const [index, q] of exam.questions.entries()) {
        const card = print.locator(`#q${index + 1}`); const text = await card.innerText();
        assert(text.includes(q.stem));
        for (const choice of q.slots?.flatMap(s => s.choices) ?? q.options.map(o => o.text)) assert(text.includes(choice), `${q.id}: omitted choice ${choice}`);
        if (kind === 'practice') { assert(text.includes(q.explanation.whyCorrect)); for (const note of Object.values(q.explanation.whyDistractorsWrong)) assert(text.includes(note)); }
      }
      const overflow = await print.locator('.question,.options,.artifact,.cs-panel').evaluateAll(nodes => nodes.filter(n => n.scrollWidth > n.clientWidth + 2).map(n => ({ id: n.id, width: n.clientWidth, scrollWidth: n.scrollWidth })));
      assert.deepEqual(overflow, [], 'Horizontal content clipping');
      const stem = name === 'checkpoint' ? 'AI-103-Checkpoint-20' : `AI-103-Set-${name.toUpperCase()}-100`;
      const file = `${out}/${stem}-${kind === 'questions' ? 'Questions-Only' : 'Practice-With-Answers'}.pdf`;
      await print.emulateMedia({ media: 'print' });
      await print.pdf({ path: file, format: 'A4', printBackground: true, displayHeaderFooter: true,
        margin: { top: '15mm', right: '15mm', bottom: '18mm', left: '15mm' }, headerTemplate: '<div></div>',
        footerTemplate: '<div style="font:9px Arial;text-align:center;width:100%">AI-103 Practice · <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
      pdfRecords.push({ path: file, sha256: (await import('../../../src/packs.js')).sha256(fs.readFileSync(file)), questions: exam.questions.length, explanations: kind === 'practice' ? exam.questions.length : 0, horizontalOverflow: overflow });
      await print.close();
    }
    reports.push({ packageId: draft.id, canonicalDraftHash: contentHash(draft), structure: 'pass', realDraftBrowserFormats: [...seen], draftImportRejected: true, sharedCaseChangesInvalidateChildren: true, pdfRecords });
  }
  const fixture = syntheticPackage({ id: 'ai-103', version: '1.2.0' }, 30, 'improvement-r2-mechanics-only');
  fixture.caseStudies[0].sections[0].body = Array(45).fill('Synthetic inventory context has no certification claim.').join(' ');
  const inserted = await json('/api/exams/import', fixture); assert.equal(inserted.status, 201, JSON.stringify(inserted.data));
  const page = await context.newPage(); await start(page, fixture.id);
  const seen = new Set<string>();
  for (const [index, q] of fixture.questions.entries()) {
    seen.add(q.type); await answer(page, q);
    if (index < fixture.questions.length - 1) await page.locator('#nextBtn').click();
  }
  const submitted = page.waitForResponse(r => r.url().endsWith('/api/attempts') && r.request().method() === 'POST');
  await page.locator('#submitBtn').click(); const response = await submitted; assert.equal(response.status(), 200);
  const attempt = await response.json(); assert.equal(attempt.score.overall, 100, JSON.stringify(attempt.score)); assert.equal(attempt.pack.version, '1.2.0');
  await expect(page.locator('#view-results')).toBeVisible();
  await page.locator('#reviewBtn').click(); await expect(page.locator('#view-review')).toBeVisible();
  await page.locator('.review-item-header').first().click(); await expect(page.locator('.review-item').first().locator('.explanation-block')).toBeVisible();
  await page.screenshot({ path: `${qaRoot}/synthetic-review-browser.png`, fullPage: false });
  assert.equal(seen.size, 9);
  const readBack = await json(`/api/attempts/${attempt.id}`); assert.equal(readBack.status, 200);
  const exported = await json(`/api/exports/attempt/${attempt.id}`); assert.equal(exported.status, 200);
  const pdf = await json(`/api/exams/${fixture.id}/pdf?kind=questions`, {}); assert.equal(pdf.status, 200, JSON.stringify(pdf.data));
  const downloaded = await fetch(url + `/api/exams/${fixture.id}/pdf-file?kind=questions`); assert.equal(downloaded.status, 200); assert(Buffer.from(await downloaded.arrayBuffer()).subarray(0, 5).toString() === '%PDF-');
  await page.close();
  fs.writeFileSync(`${qaRoot}/${mode}-report.json`, JSON.stringify({ reports, reproducibility: 'canonical hashes identical on two consecutive assemblies', mechanics: { syntheticOnly: true, formats: [...seen], score: attempt.score.overall, import: 'pass', review: 'pass', attemptExport: 'pass', pdfExport: 'pass', temporaryStore: true }, independentContentReview: 'pending' }, null, 2) + '\n');
  console.log(`QA passed: ${reports.length} draft(s), 9 synthetic formats, disposable import/score/review/export.`);
} finally {
  await context.close(); await browser.close(); server.kill('SIGTERM');
  fs.rmSync(disposable, { recursive: true, force: true });
}
