import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from '../../../src/packs.js';

const root = 'packs/ai-103/1.2.0';
const read = (p: string) => JSON.parse(fs.readFileSync(`${root}/${p}`, 'utf8'));
const write = (p: string, v: unknown) => fs.writeFileSync(`${root}/${p}`, JSON.stringify(v, null, 2) + '\n');
const receiptPath = 'authoring/ai-103/improvement-r2/research/exact-refresh-receipts.json';
const receipts = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
const fetchedAtFor = (id: string) => {
  const receipt = receipts.find((r: any) => r.sourceId === id);
  if (!receipt) throw new Error(`Missing exact retrieval receipt: ${id}`);
  return receipt.retrievedAt;
};
const capturedAt = fetchedAtFor('S001');
const added: [string, string, string, string[]][] = [
  ['S051', 'Azure OpenAI v1 API', 'https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle', ['AI103-A3.04','AI103-B1.01','AI103-B1.05']],
  ['S052', 'Use Azure OpenAI without keys', 'https://learn.microsoft.com/en-us/azure/developer/ai/keyless-connections', ['AI103-A3.04','AI103-B1.01']],
  ['S053', 'Create and use memory in Foundry Agent Service (preview)', 'https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage', ['AI103-A1.04','AI103-B2.01','AI103-B2.02']],
  ['S054', 'Tool best practices for Microsoft Foundry Agent Service', 'https://learn.microsoft.com/azure/foundry/agents/concepts/tool-best-practice', ['AI103-A4.04','AI103-B2.01','AI103-B2.02','AI103-B2.05']],
  ['S055', 'Azure Translator known issues and troubleshooting', 'https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/known-issues', ['AI103-D1.03']],
  ['S056', 'AI Projects AgentsOperations Python reference', 'https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.operations.agentsoperations?view=azure-python', ['AI103-A2.03','AI103-B1.05','AI103-B1.06']],
  ['S057', 'System message design', 'https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions', ['AI103-B3.01','AI103-D1.04']],
  ['S058', 'Integrated vectorization REST configuration', 'https://learn.microsoft.com/en-us/azure/search/search-how-to-integrated-vectorization', ['AI103-A1.03','AI103-B1.02','AI103-E1.01','AI103-E1.02','AI103-E1.03','AI103-E1.04']],
  ['S059', 'Content Understanding document solutions', 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview', ['AI103-E2.01','AI103-E2.02','AI103-E2.03']],
  ['S060', 'Model comparison in Foundry', 'https://learn.microsoft.com/en-us/azure/foundry/how-to/benchmark-model-in-catalog', ['AI103-A1.01']],
  ['S061', 'Agent accuracy and drift monitoring', 'https://learn.microsoft.com/en-us/agents/center-of-excellence/measure-report-value', ['AI103-A3.02']],
  ['S062', 'Content Understanding Agent Framework context provider', 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/integrations/agent-framework', ['AI103-B2.03']],
  ['S063', 'Agent Framework evaluation', 'https://learn.microsoft.com/en-us/agent-framework/agents/evaluation', ['AI103-B3.02']],
  ['S064', 'Content Understanding version history', 'https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/whats-new', ['AI103-C2.07']],
  ['S065', 'Azure ML image-region labeling', 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2', ['AI103-C2.08']],
  ['S067', 'Microsoft 365 watermark policy', 'https://learn.microsoft.com/en-us/microsoft-365/copilot/watermarks', ['AI103-C3.03']],
];
const registry = read('sources/registry.json');
const manifest = read('runtime-manifest.json');
const outline = registry.sources.find((s: any) => s.id === 'S001');
const updates = [[outline.id, outline.title, outline.url, []], ...added];
for (const [id, title, url, objectiveIds] of updates) {
  const snapshot = `sources/snapshots/${id}-20261011.md`;
  const body = fs.readFileSync(`${root}/${snapshot}`, 'utf8');
  if (!body.includes('# ') || body.includes('McpServerError:')) throw new Error(`Invalid source ${id}`);
  const item = { id, title, url, objectiveIds, snapshot, sha256: sha256(Buffer.from(body)), status: 'fetched', fetchedAt: fetchedAtFor(id) };
  const existing = registry.sources.findIndex((s: any) => s.id === id);
  if (existing >= 0) registry.sources[existing] = { ...registry.sources[existing], ...item };
  else registry.sources.push({ ...item, kind: 'official-documentation', groups: [], versionContext: 'Captured 2026-10-11; use only the explicit version/scope in the excerpt.' });
  const ix = manifest.sources.findIndex((s: any) => s.id === id);
  if (ix >= 0) manifest.sources[ix] = item; else manifest.sources.push(item);
}
// Same FAQ, same stable source ID; the older snapshot remains available as lineage.
const faq = manifest.sources.find((s: any) => s.id === 'S048');
faq.snapshot = 'sources/snapshots/S066-20261011.md'; faq.sha256 = sha256(fs.readFileSync(`${root}/${faq.snapshot}`)); faq.fetchedAt = fetchedAtFor('S048');
Object.assign(registry.sources.find((s: any) => s.id === 'S048'), faq);
registry.capturedAt = capturedAt; write('sources/registry.json', registry);
const objectives = read('objectives.json');
for (const o of objectives.objectives) o.outlineCaptureSha256 = manifest.sources.find((s: any) => s.id === 'S001').sha256;
objectives.capturedAt = capturedAt; write('objectives.json', objectives);
const reasons: Record<string, [string[], string]> = {
 'AI103-A1.01': [['S060','S003'], 'Model comparisons document benchmark trade-offs; task-specific small/code/multimodal comparison evidence remains incomplete.'],
 'AI103-A3.02': [['S061','S013'], 'Accuracy/drift monitoring guidance exists; a version-specific Foundry drift implementation contract is not established.'],
 'AI103-B2.03': [['S062'], 'The Agent Framework context provider is documented. This is distinct from a native Foundry Agent Service tool contract; cross-surface integration remains partial.'],
 'AI103-B3.02': [['S063','S038'], 'Agent evaluation and reasoning summaries are documented; hidden chain-of-thought and an implemented self-critique loop are not established by these sources.'],
 'AI103-C2.07': [['S064','S023','S024'], 'Historical pro/agentic-mode and current GA/preview surfaces differ. Keep version conflict visible; no current pro-mode parity item.'],
 'AI103-C2.08': [['S065','S019'], 'Azure ML region labeling is documented, but does not establish Content Understanding object/region extraction behavior.'],
 'AI103-C3.02': [['S048','S016'], 'Prompt Shields documents text-only detection. OCR plus text checking is a composed workflow, not evidence of native image-pixel injection detection.'],
 'AI103-C3.03': [['S067','S042'], 'Microsoft 365 watermark policy is a different product surface. Azure visual brand/prohibited-symbol policy remains incomplete.'],
};
const coverage = read('coverage.json');
for (const o of coverage.objectives) if (reasons[o.id]) {
  o.reason = reasons[o.id][1]; o.reassessedSourceIds = reasons[o.id][0]; o.reassessedAt = capturedAt;
  const before = fs.readFileSync(`${root}/${o.note}`, 'utf8').split('\n\n## 1.2.0 reassessment')[0];
  fs.writeFileSync(`${root}/${o.note}`, before + `\n\n## 1.2.0 reassessment\n\n${o.reason}\nSources: ${reasons[o.id][0].join(', ')}.\n`);
}
write('coverage.json', coverage);
for (const [name, text] of [['author','Author original AI-103 items with explicit primary bullet tags and exact plan batches. Record tested decisions, evidence locators, version context and A/B reasoning differences in sidecars. Use assessed difficulty. Video generation/editing and partial objectives remain outside these sets.'], ['review','Solve blind first. Then check the keyed evidence: unique answer, competing solutions, each distractor, case constraints, dependency edges, API/SDK versions, objective fit, difficulty and cues. Bind verdicts to itemRevisionHash including shared context.']]) {
  fs.writeFileSync(`${root}/prompts/${name}.md`, `# AI-103 1.2.0 ${name}\n\n${text}\n`);
}
fs.writeFileSync(`${root}/knowledge/improvement-notes.md`, '# Implementation evidence additions\n\nKeyless inference: S051/S052. Memory tool and low-level scope: S053. Responses tool choice: S054. Translator mixed languages: S055. Current agents retrieval: S056 with retained AI Projects 2.8.0 S002. System controls: S057. Search REST examples: S058. Document analysis: S059.\n\nPartial objective reassessments are recorded in coverage.json. Domain weights and outline date are unchanged.\n');
for (const relative of Object.values(manifest.knowledge) as string[]) {
  const before = fs.readFileSync(`${root}/${relative}`, 'utf8').split('\n\nSee improvement-notes.md for the 1.2.0 implementation additions')[0];
  fs.writeFileSync(`${root}/${relative}`, before + '\n\nSee improvement-notes.md for the 1.2.0 implementation additions and coverage.json for objective reassessments.\n');
}
manifest.version = '1.2.0';
write('manifest.json', { id:'ai-103', version:'1.2.0', inheritedFrom:'1.1.0', capturedAt, objectiveEffectiveDate:'2026-04-16', evidenceReadiness:{ready:56,partial:8}, runtimeManifest:'runtime-manifest.json' });
manifest.assets = {};
function walk(dir: string) { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p = path.join(dir,e.name); if (e.isDirectory()) walk(p); else if (e.name !== '.DS_Store' && p !== `${root}/runtime-manifest.json`) manifest.assets[path.relative(root,p)] = sha256(fs.readFileSync(p)); } }
walk(root); write('runtime-manifest.json', manifest);
console.log('Prepared ai-103@1.2.0 evidence: ' + Object.keys(manifest.assets).length + ' assets');

console.log('Evidence manifest hash: ' + sha256(fs.readFileSync(`${root}/runtime-manifest.json`)));
