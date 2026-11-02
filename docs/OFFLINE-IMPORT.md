# Offline exam package contract (Session 2A)

Run from `/Users/antvibe/Documents/Dev/cert-exam-lab-local` with an existing
Node/dependency installation. Neither command loads `.env` or calls a provider:

```sh
npm run import-exam -- --check /absolute/path/package.json
EXAM_DATA_ROOT=/absolute/path/study-data npm run import-exam -- /absolute/path/package.json
```

`--check` validates and prints package/item hashes without creating a data store.
Without it, the importer writes an immutable ExamSet. Omit `EXAM_DATA_ROOT` to
use the project's `data/`. The local CI command installs only inside an ephemeral
container and exercises both commands against disposable data.

The dev server accepts the same package at `POST /api/exams/import`. It returns
201 with the assembled exam; invalid input returns 400 and conflicts/concurrent
writes return 409. `POST /api/exams/assemble` uses the identical review gate.
Both routes return 403 in production. Offline study mode permits these local
imports. `POST /api/exams/blueprint` requires `{ "pack": { "id": "ai-103",
"version": "1.1.0" }, "questionCount": 10 }` and returns the complete plan.
The planner/importer modules have no provider dependency.

## Identity and evidence

- New packs: `ai-103@1.1.0` and `gh-600@1.1.0`. Missing/unknown identities fail.
- Historical GH-600 arrays are read-only and adapted in memory to `gh-600@1.0.0`.
  That identity cannot create new plans. The adapter preserves legacy quotas,
  question order/answers, timestamps, IDs, PDFs and publication entries.
- AI-103 `runtime-manifest.json` binds the preserved 1.1.0 research manifest,
  notes, snapshots, coverage and local prompts. The historical research manifest
  continues to describe its original staged state. All 154 original files remain
  unchanged. Runtime activation adds no questions or content-review claim.
- Only ready objective **bullet** IDs may be imported for AI-103, such as
  `AI103-A1.02`. The eight partial bullets remain excluded. Every objective needs
  a captured source mapped to that bullet. Source ID, exact registered URL/title
  and SHA-256 must agree; fragments/alternate URLs are not silently normalized.
- Every asset is hash-checked on resolution; missing/changed knowledge fails.
  The resolver accepts registered references, never client paths or registries.
  There is no global domain-only knowledge cache or GH-600 fallback.

## Package JSON

The root has exactly these fields:

| Field | Contract |
|---|---|
| `schemaVersion` | `1` |
| `id` | Stable globally unique exam/package ID; letters, digits, `-`, `_`, max 128; starts alphanumeric |
| `revision` | Nonempty revision label; changed packages use a new ID as well |
| `pack` | Required `{id, version}` registered reference |
| `plan` | Exact full result of `buildBlueprint(count, pack)`; extra fields or changed quotas fail |
| `provenance` | `{route, model, reasoningEffort, authoredAt}`; visible labels and ISO timestamp |
| `status` | `synthetic` or `released` |
| `questions` | Complete 1–200-item array; no drafts/unresolved items |
| `caseStudies` | Linked case contexts, or `[]` (default) |
| `reviews` | Current exact-item review records, or `[]` for synthetic mechanics fixtures |

Use `tests/fixtures/importPackage.ts` as a **mechanics-only** construction example.
Real authoring uses the preserved objective notes and ready-only packets. Obtain
and follow the plan before writing the batch; it includes domain and format quotas,
integer difficulty totals and explicit batch/case IDs. All quotas must match the
assembled content; the importer never truncates, pads or silently reallocates it.
The format proportions and 1.2-minute timing in this runtime are practice design
choices, with no assertion of official AI-103 parity.

Each item requires `id`, `revision`, `pack`, `examCode`, `domainId`, exact manifest
`domainName`, objective bullet tags, supported `type`, `difficulty`, `stem`, options,
format-specific `correctAnswer`, explanations, sources and metadata. Optional
scenario/artifact/case/slot fields follow `src/importValidation.ts`. Metadata carries
`generatedAt`, visible `model`/`reasoningEffort`, plan `batchId` and
`validationStatus: "validated"`; its author fields must agree with package provenance.
Every source reference includes `sourceId`, `snapshotSha256`, registered `title`/
`url` and a supported `docType`.

| Item format | Answer and related requirements |
|---|---|
| Single choice, case child, code/config, log, policy | One existing option ID; case child has exactly one linked parent; code/log has an artifact |
| Multi-select | At least two distinct existing IDs; at least one distractor |
| Sequence | `{order: [...]}` is a permutation of all option IDs |
| Matching | `{pairs: {...}}` covers every option ID; values belong to `matchChoices` |
| Dropdown | `{pairs: {...}}` covers every slot; keys agree with `{{slot}}` placeholders and values belong to that slot's choices |

Choice items explain every non-correct option under `whyDistractorsWrong`.
Structured items explain every step/row/slot under its ID plus `whyCorrect`.
Blank/duplicate options, duplicate IDs, normalized duplicate stems, unknown batches,
wrong domains/formats/difficulties and incomplete or foreign case links fail.
Dropdown/log/policy items occupy the planner's `single_choice` practice category;
case children occupy `case_study`. This mapping applies consistently to batches
and total format quotas.

## Review and immutable release

### Assessed difficulty and returned-audit packaging

The original `exact-quotas-v1` plans remain unchanged. Offline reviewed content can
use `exact-quotas-assessed-difficulty-v1`, constructed by `buildAssessedBlueprint`.
It preserves exact domain/format/case/batch allocations and declares all four
nonnegative integer difficulty counts (`easy`, `medium`, `hard`, `very_hard`) totaling
the item count. Item labels must match those declared counts exactly. This policy
supports honest reviewer estimates rather than forcing the default 35/45/20 target;
it does not establish empirical or official difficulty. Released items still need
accepted exact-item reviews. Browser planning previews continue to show the default
authoring allocation.

For a blind Markdown handoff, export a validated draft into a new file:

```sh
./node_modules/.bin/tsx scripts/export-blind-questions.ts \
  /absolute/path/pilot.draft.json /absolute/path/new-blind-questions.md
```

The exporter omits answers/explanations, labels shared-case children and dropdown
choices, and uses fences longer than any inner backtick run. It refuses to overwrite
an existing output. This export changes no item hash, review status or source file.

After a completed independent audit of the exact draft, prepare an immutable bundle:

```sh
./node_modules/.bin/tsx scripts/package-reviewed-exam.ts \
  /absolute/path/pilot.draft.json /absolute/path/accepted-audit.json \
  /absolute/path/new-release-directory
```

The draft must have status `draft` and empty reviews. The returned audit must have
`templateOnly: false`, matching package/revision/pack and canonical draft hash,
complete unique item IDs/revisions/hashes, recorded blind answers, accepted verdicts,
final answers matching the key, supporting source locators, and reviewer/date fields.
The tool converts those supplied records and applies the normal release validator.
It records the actual supplied reviewer label; it never invents acceptance or
authenticates a remote model session. Source locators are recorded for adjudication;
structural validation does not establish their truth.

Output is `package.released.json`, assembled `exam.json`, `release-manifest.json`,
the unchanged accepted audit, and a byte-hash `package-manifest.json`. Existing output
directories are preserved. Draft, stale, incomplete and revise verdicts fail before
any output is written. This command packages only; import the resulting package
through the normal CLI/browser after adjudication. It neither publishes nor uploads.

`synthetic` requires route `synthetic-fixture` and remains explicitly labeled
mechanics content. `released` requires `codex-subscription` and an accepted current
review for every item. Passing structure does not establish answer correctness.

A review is `{itemId, itemSha256, verdict, reviewer, reviewedAt, sourceIds, rationale}`.
Only `accept` may enter a released exam; `revise`, `reject`, `unverifiable`, absent,
stale, duplicate, unknown or incorrectly sourced reviews fail. Review time cannot
precede the item author's time. `sourceIds` must exactly cover the item's references.
The reviewer label records what the user actually entered; this local importer
checks its binding to content and does not authenticate a remote audit session.

`itemRevisionHash(question, cases)` is SHA-256 over canonical JSON of the question
for standalone items; case children hash `{question, caseStudy}` including the
complete shared parent. Changing shared context invalidates every affected child
review. Canonical JSON sorts object keys, preserves array order and omits undefined
object fields. Do not edit after review without recalculating the hash and obtaining
review of the changed revision. `--check` on a validated synthetic fixture prints
all item hashes for testing; authors can use the exported pure hash helper to prepare
manual review packets before submitting a released package.

The server computes the release manifest: package/revision hash, runtime manifest
hash, all prompt/knowledge/source asset hashes, every item hash, provenance and
review records. It preserves accepted item content and order; it does not shuffle
reviewed options. The same validation runs on storage reads and writes.

## Storage and attempts

New files live under the configured data root:

```text
packs/<pack-id>/exams/<exam-id>.json
packs/<pack-id>/attempts/<attempt-id>.json
```

Old `exams/exams.json` and `attempts/attempts.json` are never initialized or rewritten
by reads/new writes. IDs remain globally unique because existing URLs/publication
entries identify exams by ID. A changed revision or another pack cannot reuse that
ID. Reimporting identical content is safe and leaves the original file intact.
Atomic writes sync a temporary file then link it without replacement. Storage paths
reject symlinks and traversal. Corrupt/inconsistent records fail visibly instead of
appearing as an empty library. Runtime per-pack content and locks are Git-ignored.

A `.write-lock` rejects simultaneous mutations with an actionable error; no automatic
retry loop runs. It is removed after success/failure. After a crashed process, inspect
that lock and verify no writer remains before removing it. A failed input never enters
the completed exam store. Offline authored drafts stay in their source files.

Attempts derive pack and canonical exam hash from the retrieved immutable exam.
Submitted answers/confidence/flags must reference its questions; answers may be
incomplete but cannot use foreign IDs/choices. Scores are computed and checked on
persistence. Historical attempts receive only in-memory compatibility identity;
new attempts on historical exams are stored separately and bound to the adapted
exam's hash. Drills reject mixed packs sharing domain letters.

`GET /api/exams?packId=ai-103&packVersion=1.1.0` filters by exact revision.
Omitting both parameters reads all registered history/current stores. Unknown
references fail; a version without a pack ID fails. `GET /api/exams?packId=gh-600`
groups historical and current revisions under one selector entry. Cards and study
views retain the exact exam revision.

## Browser and PDF use (Session 2B)

Select AI-103 or GH-600 in the local browser. The Practice plan preview requests
`GET /api/packs/:id/blueprint?version=1.1.0&questionCount=30` and shows the same exact
domain/format/case allocations used by the importer. `GET /api/packs` returns public
identity/domain/timing metadata. Historical GH-600 1.0.0 is listed in that catalog
for study labels but cannot create new plans. Both read endpoints work in production.

Use **Import package** in development to choose an already reviewed local JSON file.
Invalid or incomplete content remains outside storage. A successful import selects
its pack and refreshes the library. Empty packs and failed imports stay visible.
Practice timing is configurable from 0.1 to 10 minutes per question; opening an
exam freezes its pack and timer. Practice mode is untimed and permits answer changes.
Scores, drills, reports and source-linked review use the exam's own identity.

Each exam card offers **Practice with answers**, **Questions only**, or **Answer
review**. Build PDF is development-only; available published downloads work in
production. Questions-only papers omit answers, explanations and the answer key.
Answer/combined papers include objectives, linked sources and snapshot SHA-256s.
All variants include code/version, package revision, immutable exam hash, content
status and page numbers. Synthetic fixtures are explicitly labeled as mechanics
content. CLI export uses the same renderer and storage:

```sh
STUDY_OFFLINE=1 npm run export-pdf -- <exam-id> --kind questions
STUDY_OFFLINE=1 npm run export-pdf -- <exam-id> --kind answers
```

Omit `--kind` for combined practice; omit the ID for latest, or use a unique ID
prefix. Export names bind pack/version, full exam ID, content hash, variant and
layout revision. Files live in `packs/<pack-id>/exports/`; repeated builds reuse the
same immutable PDF. The original four GH-600 PDFs remain at their historical paths
and are offered as the default practice download when no new export exists.
Status/download endpoints are `/api/exams/:id/pdf-status?kind=questions` and
`/api/exams/:id/pdf-file?kind=questions`; production publication filtering applies
to both. Development builds use `POST /api/exams/:id/pdf?kind=questions`.

The legacy paid provider route has no reviewed release manifest and cannot write a
new completed study exam through this boundary. Its draft/checkpoint/retry upgrade,
source refresh activation and deployment packaging remain deferred.
