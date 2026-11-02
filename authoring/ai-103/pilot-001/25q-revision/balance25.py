"""Apply the option-length and wording balance requirement to the corrected 25-item draft."""
import csv, json, re
from pathlib import Path
HERE = Path(__file__).resolve().parent
SRC = HERE.parents[1] / 'booklets-100/corrected-25q.draft.json'
draft = json.loads(SRC.read_text())
q = draft['questions']
keys_before = [x['correctAnswer'] for x in q]

def option(n, letter, text, reason=None):
    item = q[n-1]
    next(o for o in item['options'] if o['id'] == letter)['text'] = text
    if reason is not None:
        item['explanation']['whyDistractorsWrong'][letter] = reason

# Rule 5: distractor errors are technical, not signalled by "only".
option(4, 'C', "Authenticate the Search connection with the Foundry account's system-assigned managed identity; grant it Foundry User on the account.")
option(16, 'C', 'Request EightSeverityLevels for images and reject results at severity 5 or above.')
option(16, 'D', 'Request the Violence category, because the service reports hate, self-harm and sexual content within its Violence severity.',
       'Hate, SelfHarm, Sexual and Violence are separate categories. Requesting Violence alone omits signals that the policy explicitly requires.')

# Rule 1: thin distractors carry the same kind of detail as the key.
option(8, 'B', 'Use memory for learned preferences and the warranty manual, and file search for the receipt.')
option(13, 'B', 'The index schema, especially whether fields holding the missing content are retrievable.',
       'Retrievable controls which fields appear in results; it does not diagnose which source documents failed ingestion.')

# Multi-select: keys must not be the shortest options either (no length signal in either direction).
option(17, 'A', 'The original product photo, supplied as the source image for the image edit request.')
option(18, 'B', 'Give the search button image alt text that states its action, such as "Search".')
option(18, 'E', 'Use an empty alt attribute (alt="") for the decorative wave so screen readers skip it.')
option(19, 'B', 'Switch to a neural text-to-speech voice whose pronunciation lexicon includes the equipment terms.')
option(19, 'C', "Deploy the selected recognition model to a custom endpoint and point the app's recognizer at that endpoint.")

assert [x['correctAnswer'] for x in q] == keys_before, 'keyed answers changed'
draft['id'] = 'ai103-practice25-20261008-r3'
draft['revision'] = '3'
draft['reviews'] = []
(HERE / 'balanced-25q.draft.json').write_text(json.dumps(draft, indent=2, ensure_ascii=False) + '\n')

# Rule 6: per-item option lengths, key rank, and set-level rates.
CUE = re.compile(r'\b(only|sole|solely|always|never|assumes?|entirely|guarantees?|without|instead of)\b', re.I)
rows, single, multi, cues, distractors = [], [], [], [], 0
for n, item in enumerate(q, 1):
    opts = item.get('options') or []
    ca = item['correctAnswer']
    keys = ca if isinstance(ca, list) else [ca]
    if item.get('slots') or not all(isinstance(k, str) for k in keys) or not all('text' in o for o in opts):
        continue
    lengths = {o['id']: len(' '.join(o['text'].split())) for o in opts}
    order = sorted(lengths, key=lambda k: -lengths[k])
    ranks = [order.index(k) + 1 for k in keys]
    for o in opts:
        if o['id'] not in keys:
            distractors += 1
            if CUE.search(o['text']):
                cues.append(f'Q{n}{o["id"]}')
    if len(keys) == 1:
        mx, mn = max(lengths.values()), min(lengths.values())
        k = keys[0]
        longest = lengths[k] == mx and list(lengths.values()).count(mx) == 1
        shortest = lengths[k] == mn and list(lengths.values()).count(mn) == 1
        single.append((n, longest, shortest))
    else:
        longest = order[0] in keys
        shortest = set(order[-len(keys):]) == set(keys)
        multi.append((n, longest, set(order[:len(keys)]) == set(keys), shortest))
    rows.append(dict(item=f'Q{n}', format='single' if len(keys) == 1 else f'multi ({len(keys)} of {len(opts)})',
                     keyed='+'.join(keys), **{f'len_{c}': lengths.get(c, '') for c in 'ABCDE'},
                     longest=order[0], keyed_rank_by_length='+'.join(map(str, ranks))))
with open(HERE / 'option-lengths-25q.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
summary = dict(
    single_key_longest=[f'Q{n}' for n, l, s in single if l], single_total=len(single),
    single_key_shortest=[f'Q{n}' for n, l, s in single if s],
    multi_longest_is_key=[f'Q{n}' for n, l, t, s in multi if l], multi_total=len(multi),
    multi_keys_two_longest=[f'Q{n}' for n, l, t, s in multi if t],
    multi_keys_two_shortest=[f'Q{n}' for n, l, t, s in multi if s],
    distractors_with_cue_words=cues, distractor_total=distractors)
summary['release_gate_pass'] = (len(summary['single_key_longest']) <= 0.20 * len(single)
    and len(summary['single_key_shortest']) <= 0.25 * len(single)
    and len(summary['multi_longest_is_key']) <= 0.30 * len(multi)
    and len(summary['multi_keys_two_longest']) <= 0.10 * len(multi))
(HERE / 'length-report.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary, indent=2))
