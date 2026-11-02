"""Extract checkpoint PDFs, check completeness, and render every page for inspection."""
from pathlib import Path
import ast, hashlib, json, re, subprocess, sys
from pypdf import PdfReader
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
name = sys.argv[1] if len(sys.argv) > 1 else 'checkpoint'
assert name in ['checkpoint', 'a']
QA = HERE / ('qa/pdf' if name == 'checkpoint' else 'qa/pdf/a'); QA.mkdir(parents=True, exist_ok=True)
draft = json.loads((HERE / f'{name}.draft.json').read_text())
compact = lambda text: ''.join(text.split())
report = []
for kind in ['Questions-Only', 'Practice-With-Answers']:
    stem = 'AI-103-Checkpoint-20' if name == 'checkpoint' else 'AI-103-Set-A-100'
    file = ROOT / f'output/pdf/ai-103-improvement-r2/{stem}-{kind}.pdf'
    reader = PdfReader(file); text = '\n'.join(page.extract_text() for page in reader.pages)
    collapsed = compact(text); questions_only = kind == 'Questions-Only'
    assert ('Quick Answer Key' not in text) == questions_only
    assert ('Why the correct answer is right' not in text) == questions_only
    for q in draft['questions']:
        assert collapsed.count(compact(q['stem'])) == 1, f'{q["id"]}: stem must appear once'
        for value in q.get('slots', []):
            for choice in value['choices']: assert compact(choice) in collapsed
        if q['type'] != 'dropdown_completion':
            for choice in q['options']: assert compact(choice['text']) in collapsed
        if q.get('artifact'): assert compact(q['artifact']['content']) in collapsed
        if not questions_only:
            assert compact(q['explanation']['whyCorrect']) in collapsed
            for note in q['explanation']['whyDistractorsWrong'].values(): assert compact(note) in collapsed
    links = []
    for page in reader.pages:
        for ref in page.get('/Annots', []):
            annotation = ref.get_object(); action = annotation.get('/A', {})
            if action.get('/URI'): links.append(str(action['/URI']))
    if not questions_only:
        expected = {s['url'] for q in draft['questions'] for s in q['sourceRefs']}
        assert expected <= set(links), expected - set(links)
        key_text = compact(text.split('Quick Answer Key', 1)[1])
        titles = {'single_choice': 'Single choice', 'multi_select': 'Multiple select', 'sequence_order': 'Sequence',
          'matching_magnet': 'Matching', 'dropdown_completion': 'Configuration', 'case_study_child': 'Case study', 'code_or_config_artifact': 'Configuration'}
        for index, q in enumerate(draft['questions'], 1):
            key = q['correctAnswer']
            answer = key if isinstance(key, str) else ', '.join(key) if isinstance(key, list) else ' | '.join(f'{k} → {v}' for k, v in key['pairs'].items()) if 'pairs' in key else ' → '.join(f'{i + 1}. {value}' for i, value in enumerate(key['order']))
            assert compact(f'Q{index} {titles[q["type"]]} {answer}') in key_text, f'Q{index}: PDF key differs from canonical JSON'
    if name == 'a':
        for index, page in enumerate(reader.pages):
            page_text = page.extract_text()
            assert index == 0 or 'Case study - ' in page_text or re.search(r'\bQ\d+\b', page_text), f'Page {index + 1}: orphaned content'
    render = QA / kind; render.mkdir(exist_ok=True)
    for previous in render.glob('page-*.png'): previous.unlink()
    subprocess.run(['pdftoppm', '-r', '55', '-png', str(file), str(render / 'page')], check=True, capture_output=True)
    pages = sorted(render.glob('page-*.png'))
    assert len(pages) == len(reader.pages)
    cols = 4; width = 260; height = 395
    sheet = Image.new('RGB', (cols * width, ((len(pages) + cols - 1) // cols) * height), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, png in enumerate(pages):
        page = Image.open(png); page.thumbnail((width - 10, height - 28))
        x = (i % cols) * width; y = (i // cols) * height
        sheet.paste(page, (x + 5, y + 22)); draw.text((x + 8, y + 4), f'Page {i + 1}', fill='black')
    contact = QA / f'{kind}-contact-sheet.png'; sheet.save(contact)
    if name == 'a':
        for previous in QA.glob(f'{kind}-contact-sheet-part-*.png'): previous.unlink()
        for y in range(0, sheet.height, height * 5):
            sheet.crop((0, y, sheet.width, min(y + height * 5, sheet.height))).save(QA / f'{kind}-contact-sheet-part-{y // (height * 5) + 1}.png')
    (QA / f'{kind}.txt').write_text(text)
    report.append({'path': str(file.relative_to(ROOT)), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
      'pages': len(reader.pages), 'questionStemsExactlyOnce': len(draft['questions']), 'choicesAndExhibits': 'pass',
      'answersAbsent' if questions_only else 'answersAndSlotNotesPresent': True,
      'quickAnswerKeyMatchesCanonicalJson': not questions_only,
      'sourceLinkTargetsPresent': len(set(links)), 'contactSheet': str(contact.relative_to(ROOT))})
# Check completed Python examples syntactically without installing or executing service SDKs.
syntax = []
for q in draft['questions']:
    if q['type'] != 'dropdown_completion': continue
    code = q['statementTemplate']
    for key, value in q['correctAnswer']['pairs'].items(): code = code.replace('{{' + key + '}}', value)
    ast.parse(code)
    syntax.append(q['id'])
record = {'pdfs': report, 'completedPythonExamplesAstParse': syntax, 'azureExecution': 'not performed',
  'visualInspection': 'pending main-agent review of contact sheets and full-size samples'}
(QA / 'verification.json').write_text(json.dumps(record, indent=2) + '\n')
print(f'PDF checks passed: {sum(p["pages"] for p in report)} pages, {len(draft["questions"])} stems each, all choices/exhibits, source links, {len(syntax)} syntax-only examples.')
