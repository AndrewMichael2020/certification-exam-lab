"""One-package coverage, review archives, lineage and frozen-checkpoint preservation."""
from pathlib import Path
import hashlib, json, zipfile

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
LOCAL = ROOT / '.local-ci/improvement-r2'
def read(path): return json.loads(Path(path).read_text())
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def canonical(value): return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()
def write(path, value): Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
def archive(path, files):
    with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        for file, name in sorted(files, key=lambda pair: pair[1]):
            entry = zipfile.ZipInfo(name, date_time=(2026, 10, 11, 20, 45, 54))
            entry.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(entry, file.read_bytes())

draft = read(HERE / 'a.draft.json')
evidence = read(HERE / 'a.evidence.json')
assert len(draft['questions']) == 100 and len(draft['caseStudies']) == 4
assert draft['status'] == 'draft' and draft['reviews'] == []
assert canonical(draft) == evidence['canonicalDraftHash']
pack = ROOT / 'packs/ai-103/1.2.0'
manifest = read(pack / 'runtime-manifest.json')
objectives = read(pack / 'objectives.json')['objectives']
readiness = {o['id']: o for o in read(pack / 'coverage.json')['objectives']}
sources = {s['id']: s for s in manifest['sources']}
excluded = {'AI103-C1.02', 'AI103-C1.04'}
matrix = []
for o in objectives:
    identity = o['id']; ready = readiness[identity]
    assessed = [q for q in draft['questions'] if identity in q['objectiveTags']]
    matrix.append({'objectiveId': identity, 'officialWording': o['officialWording'],
      'evidenceReadiness': 'version conflict' if identity == 'AI103-C2.07' else 'partial' if ready['status'] == 'partial' else 'sufficient for documented authored scope',
      'reassessmentReason': ready.get('reason'), 'excluded': identity in excluded,
      'assessment': [{'itemId': q['id'], 'primary': q['objectiveTags'][0] == identity, 'testedDecision': q['stem'], 'sourceIds': [s['sourceId'] for s in q['sourceRefs']]} for q in assessed],
      'remainingWork': 'Video generation/editing deliberately excluded.' if identity in excluded else ready.get('reason', 'Evidence remains partial.') if ready['status'] == 'partial' else 'Independent content review pending.' if assessed else 'No item in this single package.'})
assert len(matrix) == 64
assert not any(o['assessment'] for o in matrix if o['excluded'] or o['evidenceReadiness'] in ['partial', 'version conflict'])
write(HERE / 'a.objective-coverage.json', {'scope': 'One 100-item package; no full syllabus or calibrated-readiness claim', 'officialBulletCount': 64, 'assessedBullets': sum(bool(o['assessment']) for o in matrix), 'items': matrix})

lineage = []
for letter in 'ab':
    old = read(ROOT / f'authoring/ai-103/booklets-100/set-{letter}.json')
    for q in old['questions']:
        case = next((c for c in old['caseStudies'] if c['id'] == q.get('caseStudyId')), None)
        bindings = [e for e in evidence['items'] if q['id'] in e['oldItemIds']]
        lineage.append({'oldSet': letter.upper(), 'oldItemId': q['id'], 'oldQuestionOnlyHash': canonical(q),
          'oldContextBoundHash': canonical({'question': q, 'caseStudy': case}) if case else canonical(q),
          'disposition': 'revised into this package' if bindings else 'not selected for this package', 'dispositionReview': 'pending',
          'reason': 'New identity, narrowed objective fit, assessed difficulty, final option order and fresh review bindings.' if bindings else 'Original retained unchanged; no second package requested.',
          'oldTestedDecision': q['stem'], 'newItems': [{'itemId': e['itemId'], 'testedDecision': e['testedDecision'], 'primaryObjective': e['primaryObjective'], 'itemRevisionHash': e['itemRevisionHash']} for e in bindings]})
assert len(lineage) == 200
write(HERE / 'a.item-disposition.json', {'state': 'One revised package; no second set created; judgments pending review', 'oldItemCount': 200, 'items': lineage})

# Locators come from the frozen claim ledger, with additional exact needles for new tasks.
# Objective assessment is assigned above from each actual decision, never from this ledger.
claims = read(pack / 'evidence/claims.json')['claims']
extra = {
 'S031': ['24 hours', 'Typical workflow'], 'S034': ['Test model quantitatively', 'Deploy a model'],
 'S046': ['recognized.connect', 'start_continuous_recognition', 'translations', 'manual'],
 'S037': ['text_format=CalendarEvent', 'output_parsed'], 'S030': ['PII detection', 'redact'],
 'S021': ['poller = await client.begin_analyze', 'result: AnalysisResult = await poller.result()', 'prebuilt-audioSearch'],
 'S017': ['images.generate'], 'S019': ['image_url'],
 'S048': ['Prompt Shields', 'text'],
 'S051': ['Cognitive Services OpenAI User', 'https://ai.azure.com/.default', '/openai/v1/'],
 'S052': ['Cognitive Services OpenAI User'],
 'S053': ['x-memory-user-id', 'MemorySearchPreviewTool', 'specify `scope` explicitly', 'agent_reference'],
 'S054': ['required', 'auto', 'none'], 'S055': ['1006', '3007', 'mixed'],
 'S056': ['get(agent_name', 'agent_name'], 'S057': ['role', 'fallback', 'guarantee'],
 'S058': ['Text Split', 'embedding', 'vectorizer'], 'S059': ['Markdown', 'schema', 'grounding'],
}
records = []
for source_id in sorted({s['sourceId'] for q in draft['questions'] for s in q['sourceRefs']}):
    source = sources[source_id]; file = pack / source['snapshot']
    assert sha(file) == source['sha256']
    lines = file.read_text().splitlines(); excerpts = []
    for claim in claims:
        if claim['sourceId'] != source_id: continue
        for locator in claim.get('locators', []):
            if locator['snapshot'] != source['snapshot']: continue
            start, end = locator['lineStart'], locator['lineEnd']
            assert 1 <= start <= end <= len(lines)
            actual = '\n'.join(lines[start - 1:end])
            assert actual == locator['excerpt'], f'{source_id}: stale claim locator'
            assert locator['sourceSha256'] == source['sha256']
            excerpts.append({'claimId': claim['id'], 'statement': claim['statement'], 'lineStart': start, 'lineEnd': end, 'text': actual})
    for needle in extra.get(source_id, []):
        for index in [i for i, line in enumerate(lines) if needle.lower() in line.lower()][:2]:
            start, end = max(0, index - 2), min(len(lines), index + 12)
            excerpts.append({'claimLocator': needle, 'lineStart': start + 1, 'lineEnd': end, 'text': '\n'.join(lines[start:end])})
    assert excerpts, f'Missing frozen source locator: {source_id}'
    records.append({'sourceId': source_id, 'url': source['url'], 'snapshot': source['snapshot'], 'snapshotSha256': source['sha256'], 'fetchedAt': source.get('fetchedAt'), 'excerpts': excerpts})
write(HERE / 'review/a/frozen-source-excerpts.json', {'state': 'Documentation evidence; independent review pending; Azure execution not performed', 'sources': records})
blind = [(HERE / 'a.blind.md', 'questions.md'), (HERE / 'a.audit-template.json', 'audit-template.json'), (HERE / 'review/a/frozen-source-excerpts.json', 'frozen-source-excerpts.json')]
blind += [(pack / r['snapshot'], 'sources/' + r['snapshot'].split('/')[-1]) for r in records]
blind += [(p, 'batches/' + p.name) for p in (HERE / 'review/a').glob('batch-*') if p.name.endswith(('.blind.md', '.template.json'))]
archive(HERE / 'a-audit-blind.zip', blind)
archive(HERE / 'a-audit-keyed.zip', [(HERE / n, n) for n in ['a.draft.json', 'a.evidence.json', 'a.diagnostics.json', 'a.objective-coverage.json']])

baseline = read(LOCAL / 'single-100-baseline.json')['files']
allowed = {f'authoring/ai-103/improvement-r2/{n}' for n in ['assemble.ts', 'qa.ts', 'run.py', 'verify-pdf.py', 'README.md']}
allowed.add('docs/AI-103-IMPROVEMENT-CLOSEOUT.md')
changes, preserved = [], 0
for rel, digest in baseline.items():
    file = ROOT / rel
    if file.is_file() and sha(file) == digest: preserved += 1; continue
    assert rel in allowed, f'Unexpected change: {rel if not rel.startswith("data/") else "private runtime"}'
    changes.append(rel)
current = {}
for folder in ['src', 'public', 'tests', 'scripts', 'prompts', 'packs', 'authoring', 'docs', 'output', 'data']:
    for file in (ROOT / folder).rglob('*'):
        if file.is_file() and not file.is_symlink() and file.name != '.DS_Store' and '__pycache__' not in file.parts:
            current[str(file.relative_to(ROOT))] = sha(file)
added = sorted(set(current) - set(baseline))
assert all(p.startswith(('authoring/ai-103/improvement-r2/', 'output/pdf/ai-103-improvement-r2/')) for p in added)
gh_file = ROOT / 'docs/gh-600-preservation-baseline.json'
gh = read(gh_file)['files']
assert sha(gh_file) == baseline[str(gh_file.relative_to(ROOT))]
assert all((ROOT / f['path']).is_file() and sha(ROOT / f['path']) == f['sha256'] for f in gh)
write(LOCAL / 'single-100-after-inventory.json', current)
write(HERE / 'a.preservation.json', {'startingFileCount': len(baseline), 'identicalStartingFiles': preserved, 'allowedChangedFiles': changes,
  'gh600OriginalHashesChecked': len(gh), 'gh600Failures': [], 'oldAI103AndCheckpointArtifacts': 'all unchanged', 'sharedCodeAndRealLearnerStore': 'all unchanged',
  'allowlistedAddedFileCount': len(added), 'privateRuntimeHashes': 'ignored local storage only', 'localImportCommitPushDeployment': 'not performed'})

pdfs = [ROOT / f'output/pdf/ai-103-improvement-r2/AI-103-Set-A-100-{kind}.pdf' for kind in ['Questions-Only', 'Practice-With-Answers']]
verification = HERE / 'qa/pdf/a/verification.json'
assert read(verification)['visualInspection'] == 'pass: all-page contact sheets and full-size case/code/structured samples inspected'
files = [(HERE / n, 'authoring/' + n) for n in ['a.draft.json', 'a.blind.md', 'a.evidence.json', 'a.diagnostics.json', 'a.objective-coverage.json', 'a.item-disposition.json', 'a.audit-template.json', 'a.preservation.json', 'a-audit-blind.zip', 'a-audit-keyed.zip', 'README.md']]
files += [(p, 'pdf/' + p.name) for p in pdfs]
files += [(p, 'evidence-pack/' + str(p.relative_to(pack))) for p in pack.rglob('*') if p.is_file() and p.name != '.DS_Store']
files += [(HERE / 'qa/single-report.json', 'verification/browser.json'), (verification, 'verification/pdf.json')]
files += [(HERE / n, 'pipeline/' + n) for n in ['single-inputs.py', 'single-report.py', 'content.py', 'standalone.py', 'cases.py', 'assemble.ts', 'qa.ts', 'run.py', 'emit.ts', 'verify-pdf.py']]
write(HERE / 'a.package-manifest.json', {'packageId': draft['id'], 'questionCount': 100, 'packageCount': 1, 'pack': draft['pack'],
  'state': 'draft; independent review pending', 'canonicalDraftHash': canonical(draft), 'acceptedReviews': 0,
  'files': [{'path': name, 'sha256': sha(file)} for file, name in sorted(files, key=lambda pair: pair[1])]})
files.append((HERE / 'a.package-manifest.json', 'manifest.json'))
archive(HERE / 'AI-103-100Q-Draft-Package.zip', files)
with zipfile.ZipFile(HERE / 'AI-103-100Q-Draft-Package.zip') as z:
    assert len([n for n in z.namelist() if n.endswith('.draft.json')]) == 1
    for record in read(HERE / 'a.package-manifest.json')['files']:
        assert hashlib.sha256(z.read(record['path'])).hexdigest() == record['sha256']
print(f'One 100-question archive verified; {len(records)} frozen sources; {sum(bool(o["assessment"]) for o in matrix)} assessed bullets; {len(gh)}/{len(gh)} GH-600 hashes preserved.')
