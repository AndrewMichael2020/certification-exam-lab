/** Deterministic offline assembly through the unchanged registered planner. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { buildBlueprint, buildAssessedBlueprint } from '../../../src/blueprint.js';
import { contentHash, resolvePack } from '../../../src/packs.js';
import { importPackageSchema, validateAssembly, itemRevisionHash } from '../../../src/importValidation.js';
import { buildBlindQuestionsMarkdown } from '../../../src/auditMarkdown.js';
import { packageReviewedDraft } from '../../../src/reviewPackaging.js';
import type { PracticeQuestion, CaseStudy } from '../../../src/types.js';

const root = 'authoring/ai-103/improvement-r2';
const mode = process.argv[2] ?? 'checkpoint';
const input = JSON.parse(fs.readFileSync(`${root}/${mode}.inputs.json`, 'utf8'));
const specs = Array.isArray(input) ? input : [input];
const ref = { id: 'ai-103', version: '1.2.0' };
const pack = resolvePack(ref);
const authoredAt = '2026-10-11T20:37:42Z';
const provenance = { route: 'codex-subscription', model: 'Codex GPT-6 main agent', reasoningEffort: 'not exposed', authoredAt };
const write = (name: string, data: unknown) => {
  const target = path.join(root, name); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
};

for (const spec of specs) {
  const authoredAt = spec.authoredAt ?? provenance.authoredAt;
  const itemProvenance = { ...provenance, authoredAt };
  const template = buildBlueprint(spec.total, ref);
  const pools = new Map(spec.pools.map((p: any) => [`${p.domain}/${p.group}`, structuredClone(p.items)]));
  const questions: PracticeQuestion[] = [], cases: CaseStudy[] = [], annotations: any[] = [];
  let caseIndex = 0;
  for (const batch of template.batches) {
    if (batch.caseStudyId) {
      const raw = structuredClone(spec.cases[caseIndex++]); delete raw._children;
      cases.push({ ...raw, id: batch.caseStudyId, questionIds: [] });
    }
    const pool = pools.get(`${batch.domainId}/${batch.typeFocus[0]}`) as any[];
    if (!pool || pool.length < batch.questionCount) throw new Error(`Missing pool ${batch.id}: ${batch.domainId}/${batch.typeFocus[0]}`);
    for (let i = 0; i < batch.questionCount; i++) {
      const raw = pool.shift();
      const id = `${spec.id}-q${String(questions.length + 1).padStart(3, '0')}`;
      const annotation = { itemId: id, testedDecision: raw._decision, oldItemIds: raw._origin ?? [], dependencyEdges: raw._edges ?? [] };
      delete raw._decision; delete raw._origin; delete raw._edges;
      const sources = raw.sourceIds.map((sourceId: string) => {
        const source = pack.sources.find(s => s.id === sourceId);
        if (!source) throw new Error(`Unregistered source ${sourceId}`);
        return { sourceId, title: source.title, url: source.url, snapshotSha256: source.sha256, docType: 'microsoft_learn' };
      });
      delete raw.sourceIds; delete raw.pack; delete raw.revision; delete raw.examCode;
      // Hash ordering distributes positions without selecting for a length target.
      const ordered = [...raw.options].sort((a, b) => contentHash([id, a.id]).localeCompare(contentHash([id, b.id])));
      const mapping = Object.fromEntries(ordered.map((o, n) => [o.id, String.fromCharCode(65 + n)]));
      raw.options = ordered.map(o => ({ ...o, id: mapping[o.id] }));
      const key = raw.correctAnswer;
      if (typeof key === 'string') raw.correctAnswer = mapping[key];
      else if (Array.isArray(key)) raw.correctAnswer = key.map(k => mapping[k]);
      else if ('order' in key) raw.correctAnswer = { order: key.order.map((k: string) => mapping[k]) };
      else if (raw.type === 'matching_magnet') raw.correctAnswer = { pairs: Object.fromEntries(Object.entries(key.pairs).map(([k, v]) => [mapping[k], v])) };
      if (raw.type !== 'dropdown_completion') raw.explanation.whyDistractorsWrong = Object.fromEntries(Object.entries(raw.explanation.whyDistractorsWrong).map(([k, v]) => [mapping[k], v]));
      annotation.dependencyEdges = annotation.dependencyEdges.map((e: any) => ({ ...e, before: mapping[e.before], after: mapping[e.after] }));
      const q: PracticeQuestion = { ...raw, id, pack: ref, revision: '2', examCode: pack.examCode,
        domainName: batch.domainName, ...(batch.caseStudyId ? { type: 'case_study_child', caseStudyId: batch.caseStudyId } : {}),
        sourceRefs: sources, metadata: { generatedAt: authoredAt, model: provenance.model, reasoningEffort: provenance.reasoningEffort, batchId: batch.id, validationStatus: 'draft' } };
      questions.push(q); annotations.push(annotation);
      if (batch.caseStudyId) cases.at(-1)!.questionIds.push(id);
    }
  }
  for (const [key, remaining] of pools) if ((remaining as any[]).length) throw new Error(`Unused pool ${key}`);
  const counts = Object.fromEntries(['easy', 'medium', 'hard', 'very_hard'].map(d => [d, questions.filter(q => q.difficulty === d).length]));
  const plan = buildAssessedBlueprint(spec.total, ref, counts);
  const draft = importPackageSchema.extend({ status: z.literal('draft') }).parse({ schemaVersion: 1, id: spec.id, revision: '2', pack: ref, plan, provenance: itemProvenance, status: 'draft', questions, caseStudies: cases, reviews: [] });
  validateAssembly(plan, questions, cases);
  const name = spec.setId;
  write(`${name}.draft.json`, draft);
  write(`${name}.blind.md`, buildBlindQuestionsMarkdown(draft).replace('AI-103 pilot — blind questions', 'AI-103 — blind questions'));
  const bindings = annotations.map((a, i) => ({ ...a, testedDecision: questions[i].stem, primaryObjective: questions[i].objectiveTags[0], itemRevisionHash: itemRevisionHash(questions[i], cases), sources: questions[i].sourceRefs }));
  write(`${name}.evidence.json`, { packageId: draft.id, canonicalDraftHash: contentHash(draft), packManifestHash: pack.manifestSha256, assessmentState: 'author estimate; independent review pending', items: bindings });
  const singled = questions.filter(q => typeof q.correctAnswer === 'string');
  const longest = singled.filter(q => q.options.find(o => o.id === q.correctAnswer)!.text.length === Math.max(...q.options.map(o => o.text.length)));
  write(`${name}.diagnostics.json`, { itemCount: questions.length, domains: plan.domains, formats: plan.itemTypes, assessedDifficulty: counts,
    answerPositions: Object.fromEntries(['A', 'B', 'C', 'D', 'E'].map(k => [k, singled.filter(q => q.correctAnswer === k).length])),
    longestKeyRatio: longest.length / singled.length, longestKeyItems: longest.map(q => q.id),
    caseWordCounts: cases.map(c => ({ id: c.id, words: [c.intro, ...c.sections.map(s => s.body)].join(' ').split(/\s+/).length })),
    structuredItems: questions.filter(q => q.type === 'dropdown_completion').map(q => q.id),
    absoluteWordItems: questions.filter(q => q.options.some(o => /\b(always|never|only|indefinitely)\b/i.test(o.text))).map(q => q.id) });
  // Complete cases stay together. Non-case questions form bounded blind-review batches.
  const groups: PracticeQuestion[][] = cases.map(c => questions.filter(q => q.caseStudyId === c.id));
  const rest = questions.filter(q => !q.caseStudyId);
  if (spec.total === 100) {
    const batches = Math.ceil(rest.length / 10);
    for (let i = 0; i < batches; i++) groups.push(rest.slice(Math.floor(i * rest.length / batches), Math.floor((i + 1) * rest.length / batches)));
  } else for (let i = 0; i < rest.length; i += 8) groups.push(rest.slice(i, i + 8));
  const auditTemplate = (group: PracticeQuestion[], packetId: string) => ({ templateOnly: true, packetId, packageId: draft.id, revision: draft.revision,
    pack: ref, draftPackageSha256: contentHash(draft), reviewer: { actualModelLabel: null, visibleModeIfAny: null, reviewedAtUtc: null },
    instructions: 'Solve blind first. Assess alternatives, evidence, API/version, objective fit, difficulty and cues. Null verdicts are not reviews.',
    items: group.map(q => ({ itemId: q.id, itemRevision: q.revision, itemSha256: itemRevisionHash(q, cases), sourceIds: q.sourceRefs.map(s => s.sourceId),
      blindAnswer: null, finalProposedAnswer: null, verdict: null, rationale: null,
      sourceEvidence: q.sourceRefs.map(s => ({ sourceId: s.sourceId, lines: null, supports: null })) })) });
  const fullTemplate = auditTemplate(questions, `${draft.id}-manual-audit`);
  assert.throws(() => packageReviewedDraft(draft, fullTemplate));
  write(`${name}.audit-template.json`, fullTemplate);
  groups.forEach((group, i) => {
    const selectedCases = cases.filter(c => group.some(q => q.caseStudyId === c.id));
    const prefix = `review/${name}/batch-${String(i + 1).padStart(2, '0')}`;
    write(`${prefix}.blind.md`, buildBlindQuestionsMarkdown({ ...draft, questions: group, caseStudies: selectedCases }));
    write(`${prefix}.keyed.json`, { canonicalDraftHash: contentHash(draft), questions: group, caseStudies: selectedCases, evidence: bindings.filter(b => group.some(q => q.id === b.itemId)) });
    write(`${prefix}.template.json`, auditTemplate(group, `${draft.id}-batch-${i + 1}`));
  });
  console.log(`Assembled ${draft.id}: ${contentHash(draft)}`);
}
