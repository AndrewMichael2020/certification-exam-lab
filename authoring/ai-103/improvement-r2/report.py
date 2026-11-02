"""Checkpoint coverage, old-item lineage and preservation; no learner-store writes."""
from pathlib import Path
import hashlib, json, re, zipfile

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
LOCAL = ROOT / '.local-ci/improvement-r2'
def read(path): return json.loads(Path(path).read_text())
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def canonical(value): return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()
def write(path, value): Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')

draft = read(HERE / 'checkpoint.draft.json')
evidence = read(HERE / 'checkpoint.evidence.json')
manifest = read(ROOT / 'packs/ai-103/1.2.0/runtime-manifest.json')
objectives = read(ROOT / 'packs/ai-103/1.2.0/objectives.json')['objectives']
readiness = {o['id']: o for o in read(ROOT / 'packs/ai-103/1.2.0/coverage.json')['objectives']}
sources = {s['id']: s for s in manifest['sources']}
excluded = {'AI103-C1.02', 'AI103-C1.04'}
matrix = []
for objective in objectives:
    id = objective['id']; ready = readiness[id]
    assessed = [q for q in draft['questions'] if id in q['objectiveTags']]
    matrix.append({'objectiveId': id, 'officialWording': objective['officialWording'],
      'evidenceReadiness': 'version conflict' if id == 'AI103-C2.07' else 'partial' if ready['status'] == 'partial' else 'sufficient for documented authored scope',
      'reassessmentReason': ready.get('reason'), 'excluded': id in excluded,
      'assessment': [{'itemId': q['id'], 'primary': q['objectiveTags'][0] == id, 'testedDecision': q['stem'], 'sourceIds': [s['sourceId'] for s in q['sourceRefs']]} for q in assessed],
      'remainingWork': 'Video generation/editing deliberately excluded.' if id in excluded else ready.get('reason', 'Evidence remains partial.') if ready['status'] == 'partial' else 'Independent content review pending.' if assessed else 'No checkpoint item; assess during 200-item regeneration.'})
assert len(matrix) == 64
assert not any(o['assessment'] for o in matrix if o['excluded'] or o['evidenceReadiness'] in ['partial', 'version conflict'])
write(HERE / 'objective-coverage.json', {'scope': '20-item checkpoint only; no full syllabus claim', 'officialBulletCount': 64, 'items': matrix})

lineage = []
for letter in 'ab':
    old = read(ROOT / f'authoring/ai-103/booklets-100/set-{letter}.json')
    for q in old['questions']:
        children = next((c for c in old['caseStudies'] if c['id'] == q.get('caseStudyId')), None)
        reused = [e['itemId'] for e in evidence['items'] if q['id'] in e['oldItemIds']]
        decision = 'revise' if reused else 'replace' if q['type'] in ['sequence_order', 'case_study_child'] else 'revise'
        lineage.append({'oldSet': letter.upper(), 'oldItemId': q['id'], 'oldQuestionOnlyHash': canonical(q),
          'oldContextBoundHash': canonical({'question': q, 'caseStudy': children}) if children else canonical(q),
          'proposedDisposition': decision, 'dispositionReview': 'pending',
          'reason': 'Revised checkpoint item with explicit primary objective and importer-compatible mechanics.' if reused else
            'New dependency-order task or substantive shared case required by the revision contract.' if q['type'] in ['sequence_order', 'case_study_child'] else
            'Wording, objective fit and critical alternatives require fresh review before reuse.',
          'oldTestedDecision': q['stem'], 'oldObjectiveTags': q['objectiveTags'], 'oldSources': q['sourceRefs'],
          'checkpointItemIds': reused, 'intendedFullSetItemId': None, 'fullSetAssignment': 'pending regeneration'})
assert len(lineage) == 200
write(HERE / 'item-disposition.json', {'state': 'proposed dispositions; full pair not regenerated', 'oldItemCount': 200, 'items': lineage})

# Exact frozen-source locators for checkpoint review. These are claim excerpts, not approvals.
needles = {
 'S051': ['Cognitive Services OpenAI User', 'https://ai.azure.com/.default', '/openai/v1/'],
 'S052': ['Cognitive Services OpenAI User'],
 'S002': ['AIProjectClient', 'DefaultAzureCredential', 'get_openai_client'],
 'S003': ['project endpoint', 'DefaultAzureCredential'],
 'S017': ['mask', 'edit', 'fully transparent pixels'], 'S022': ['sampling', '512', 'small'],
 'S056': ['get(agent_name', 'agent_name'],
 'S053': ['x-memory-user-id', 'MemorySearchPreviewTool', 'specify `scope` explicitly', 'agent_reference'],
 'S054': ['required', 'auto', 'none'],
 'S007': ['call_id', 'function_call_output'],
 'S011': ['DNS', 'private'],
 'S025': ['hybrid', 'RRF'],
 'S037': ['additionalProperties', 'required', 'text.format'],
 'S042': ['2024-09-01', 'FourSeverityLevels', '0, 2, 4, 6'],
 'S023': ['edit', 'mask'],
 'S020': ['audio', 'video'],
 'S055': ['1006', '3007', 'mixed'],
 'S026': ['chunk', 'embedding'], 'S058': ['Text Split', 'embedding', 'vectorizer'],
 'S021': ['result', 'begin_analyze'],
 'S030': ['personally', 'language', 'entity'],
 'S033': ['speech', 'translation'], 'S034': ['custom', 'domain'], 'S046': ['translation', 'synthesis'],
 'S043': ['imageAction', 'normalized_images'], 'S028': ['outputFieldMappings', 'normalized_images'],
}
records = []
for source_id in sorted({s['sourceId'] for q in draft['questions'] for s in q['sourceRefs']}):
    source = sources[source_id]; file = ROOT / 'packs/ai-103/1.2.0' / source['snapshot']
    assert sha(file) == source['sha256']
    lines = file.read_text().splitlines(); excerpts = []
    for needle in needles.get(source_id, []):
        hits = [i for i, line in enumerate(lines) if needle.lower() in line.lower()][:2]
        for index in hits:
            start = max(0, index - 2); end = min(len(lines), index + 9)
            excerpts.append({'claimLocator': needle, 'lineStart': start + 1, 'lineEnd': end, 'text': '\n'.join(lines[start:end])})
    assert excerpts, f'Missing explicit evidence locator: {source_id}'
    records.append({'sourceId': source_id, 'url': source['url'], 'snapshot': source['snapshot'], 'snapshotSha256': source['sha256'],
      'fetchedAt': source.get('fetchedAt'), 'excerpts': excerpts, 'serviceExecution': 'not performed'})
write(HERE / 'review/checkpoint/frozen-source-excerpts.json', {'state': 'evidence for manual review; no review verdicts', 'sources': records})

blind = [(HERE / 'checkpoint.blind.md', 'questions.md'), (HERE / 'checkpoint.audit-template.json', 'audit-template.json'),
         (HERE / 'review/checkpoint/frozen-source-excerpts.json', 'frozen-source-excerpts.json')]
blind += [(ROOT / 'packs/ai-103/1.2.0' / r['snapshot'], 'sources/' + r['snapshot'].split('/')[-1]) for r in records]
keyed = [(HERE / name, name) for name in ['checkpoint.draft.json', 'checkpoint.evidence.json', 'checkpoint.diagnostics.json']]
for label, files in [('blind', blind), ('keyed', keyed)]:
    with zipfile.ZipFile(HERE / f'checkpoint-audit-{label}.zip', 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for file, name in sorted(files, key=lambda pair: pair[1]):
            entry = zipfile.ZipInfo(name, date_time=(2026, 10, 11, 20, 30, 22)); entry.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(entry, file.read_bytes())

baseline = read(LOCAL / 'baseline.json')['files']
protected_changes = []; preserved = 0
registry_line = '  "ai-103@1.2.0": "packs/ai-103/1.2.0/runtime-manifest.json",\n'
for rel, identity in baseline.items():
    file = ROOT / rel
    if not file.is_file(): protected_changes.append({'path': rel if not rel.startswith('data/') else '[private runtime]', 'change': 'removed'}); continue
    digest = sha(file)
    if digest == identity['sha256']: preserved += 1; continue
    if rel == 'src/packs.ts':
        current = file.read_text(); assert current.count(registry_line) == 1
        assert hashlib.sha256(current.replace(registry_line, '').encode()).hexdigest() == identity['sha256']
        continue
    protected_changes.append({'path': rel if not rel.startswith('data/') else '[private runtime]', 'change': 'modified'})
gh = read(ROOT / 'docs/gh-600-preservation-baseline.json')['files']
gh_failures = [f['path'] for f in gh if not (ROOT / f['path']).is_file() or sha(ROOT / f['path']) != f['sha256']]
assert not protected_changes, protected_changes
assert not gh_failures, gh_failures
scope_roots = ['src', 'public', 'tests', 'prompts', 'scripts', 'packs', 'authoring', 'docs', 'output', 'data']
current = {}
for folder in scope_roots:
    for file in (ROOT / folder).rglob('*'):
        if file.is_file() and file.name != '.DS_Store' and '__pycache__' not in file.parts:
            current[str(file.relative_to(ROOT))] = {'sha256': sha(file), 'bytes': file.stat().st_size}
for rel in baseline:
    if '/' not in rel and (ROOT / rel).is_file(): current[rel] = {'sha256': sha(ROOT / rel), 'bytes': (ROOT / rel).stat().st_size}
added = sorted(set(current) - set(baseline))
allow = lambda p: p.startswith(('authoring/ai-103/improvement-r2/', 'packs/ai-103/1.2.0/', 'output/pdf/ai-103-improvement-r2/')) or p in ['tests/ai103Improvement.test.ts', 'docs/AI-103-IMPROVEMENT-CLOSEOUT.md']
unexpected = [p for p in added if not allow(p)]
assert not unexpected, unexpected
write(LOCAL / 'after-inventory.json', current)  # Private runtime inventory stays ignored locally.
write(HERE / 'preservation.json', {'startingFileCount': len(baseline), 'identicalStartingFiles': preserved,
  'allowedModifiedFile': 'src/packs.ts: one explicit AI-103 registry entry only', 'gh600OriginalHashes': {'checked': len(gh), 'failures': gh_failures},
  'protectedChanges': protected_changes, 'allowlistedAddedFileCount': len(added), 'unexpectedAdditions': unexpected,
  'privateRuntimeHashes': 'retained only in ignored .local-ci/improvement-r2', 'oldAI103Artifacts': 'unchanged', 'commitPushDeployment': 'not performed'})
print(f'Report: 64 bullets, 200 pending dispositions, {len(records)} frozen checkpoint sources, {len(gh)} GH-600 hashes preserved.')
