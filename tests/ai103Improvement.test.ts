import { expect, it } from 'vitest';
import { CURRENT_AI103, CURRENT_GH600, LEGACY_GH600, resolvePack } from '../src/packs.js';
import { buildBlueprint } from '../src/blueprint.js';
import { itemRevisionHash, validateImport } from '../src/importValidation.js';
import { syntheticPackage } from './fixtures/importPackage.js';

const revision = { id: 'ai-103', version: '1.2.0' };
it('resolves the explicit improvement pack without changing current or historical identities', () => {
  expect(resolvePack(revision).ref).toEqual(revision);
  expect(CURRENT_AI103).toEqual({ id: 'ai-103', version: '1.1.0' });
  expect(resolvePack(CURRENT_GH600).examCode).toBe('GH-600');
  expect(resolvePack(LEGACY_GH600).examCode).toBe('GH-600');
  expect(() => resolvePack({ id: 'ai-103', version: '99.0.0' })).toThrow('Unknown pack');
});
it('keeps the hundred-item domain, format and intact-case quotas', () => {
  const plan = buildBlueprint(100, revision);
  expect(plan.domains.map(d => d.count)).toEqual([28, 33, 13, 13, 13]);
  expect(plan.itemTypes).toEqual({ single_choice: 42, multi_select: 18, sequence_order: 10, matching_magnet: 8, case_study: 16, code_or_config_artifact: 6 });
  expect(plan.batches.filter(b => b.caseStudyId).map(b => [b.domainId, b.questionCount])).toEqual([['B', 4], ['B', 4], ['A', 4], ['B', 4]]);
});
it('rejects partial objectives and mismatched frozen sources in the new revision', () => {
  const fixture = syntheticPackage(revision);
  const invalid = structuredClone(fixture);
  invalid.questions.find(q => q.domainId === 'A')!.objectiveTags = ['AI103-A1.01'];
  expect(() => validateImport(invalid)).toThrow('partial objective');
  const changedSource = structuredClone(fixture);
  changedSource.questions[0].sourceRefs[0].snapshotSha256 = '0'.repeat(64);
  expect(() => validateImport(changedSource)).toThrow('unregistered source');
});
it('requires real accepted reviews for release and binds every child to shared context', () => {
  const fixture = syntheticPackage(revision);
  const child = fixture.questions.find(q => q.caseStudyId)!;
  const initial = itemRevisionHash(child, fixture.caseStudies);
  fixture.caseStudies[0].sections[0].body += ' Changed context.';
  expect(itemRevisionHash(child, fixture.caseStudies)).not.toBe(initial);
  expect(() => validateImport({ ...fixture, status: 'released', provenance: { ...fixture.provenance, route: 'codex-subscription' } })).toThrow('Release requires accepted review');
});
