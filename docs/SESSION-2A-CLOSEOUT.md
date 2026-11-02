# Session 2A closeout: pack identity, compatibility, import/storage

Completed October 7, 2026 (America/Vancouver) on the existing local branch
`session-1-local-ci`. The user lifted the earlier implementation pause. Existing
Session 1 work and the completed knowledge-base revision were retained.

## Completed contracts

- Registered `ai-103@1.1.0` through a separate runtime manifest binding the original
  research snapshot. It provides exact bullet IDs, bounded ready/partial status,
  mapped captured sources, domain notes and local author/review prompts. All eight
  partial objectives remain excluded. No AI-103 study questions were authored.
- Copied GH-600 material byte-for-byte into `gh-600@1.1.0` for corrected future
  planning. Historical stored arrays adapt in memory to `gh-600@1.0.0`; no historical
  plans/counts, questions/answers, dates, IDs, PDFs or publication entries changed.
- New planning requires explicit identity and exact domain/format/difficulty/batch
  totals. All planned sizes 1, 10, 20, 25, 30, 50, 70, 100, 200 assemble correctly
  for both packs. Missing/unknown packs never fall back to GH-600.
- Offline JSON CLI and dev API imports validate structure and answers for all nine
  enabled formats, ready objective/source membership and hashes, counts, duplicates,
  batches, explanations and full case links. Assembly shares the same gate.
- Released content requires accepted reviews for every exact item revision;
  shared case context is included in each child's review hash. Synthetic fixtures
  retain an explicit synthetic status. Recorded reviews do not replace content
  adjudication or establish authenticity of a manually entered reviewer label.
- The importer constructs a manifest with package/item/runtime/asset hashes and
  visible author/reviewer provenance. Accepted item content/order is preserved.
- New exams/attempts use immutable per-pack files with synced atomic writes,
  concurrent-write rejection, safe identical reimports, global ID conflict checks,
  read/write integrity validation and path/symlink checks. Legacy arrays are never
  created/rewritten by these operations. Corruption fails visibly.
- Attempts bind pack and exam content hash, validate submitted references and scores;
  drills reject mixed packs with shared domain letters. Library API filters exact
  pack revisions. Production import/assembly mutation gates remain intact.
- Planner/importer/hash/check modules do not depend on the provider client. AI-103
  provider generation is rejected before a client call. Knowledge resolution has
  no domain-only cache or missing-material fallback.

## Verification and preservation

Final command: `python3 scripts/local-ci.py`, exit **0**.

- **75 unit tests passed** across nine files; **TypeScript build passed**.
- **10 Chromium/API/CLI checks passed**: full legacy exam answering/scoring/review,
  all-format rendering, original PDF serving and local API/CLI PDF preservation,
  production gates, plus both-pack offline import/load/score/attempt-review/drill/
  JSON report and CLI check/import/rejection flows. AI-103 browser labels and PDF
  presentation are not claimed by these API checks.
- All **21 GH-600 preservation hashes matched** before/after CI. All **154 original
  AI-103 1.1.0 knowledge-base files matched** the pre-implementation snapshot.
  The new runtime manifest/prompts are additive; the research manifest stays intact.
- Every staged CI input still matches the final code/config state. Tool versions:
  Node v24.15.0, npm 11.12.1, Playwright 1.60.0. Stage results, input hashes and the
  cached image ID are in `.local-ci/latest.json`; output in `.local-ci/latest.log`.
  The research comparison is recorded in `.local-ci/session-2a-preservation.json`.
- Dependencies, build outputs and fixture stores stayed inside disposable OrbStack
  containers. No host dependencies/builds or private runtime records were produced.
  Task containers/browser servers were removed at completion. Cleanup dry-run
  identified only the pre-existing `.DS_Store`, which was retained.

## Changed code/config paths in this resumed phase

All paths below are absolute. Earlier Session 1 edits listed in its closeout are
not relisted unless changed in this phase.

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/.gitignore`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/package.json`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/types.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/packs.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/compatibility.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/blueprint.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/importValidation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/importer.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/attemptValidation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/persistence.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/generation.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/server.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/studyLoops.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/validators.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/import-exam.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/generate.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/scripts/local-ci.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/fixtures/importPackage.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/import.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/persistence.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/blueprint.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/schema.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/runtime.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/fullMockOps.test.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/import.spec.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/tests/e2e/baseline.spec.ts`

## Added pack material and documentation

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.1.0/runtime-manifest.json`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.1.0/prompts/author.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.1.0/prompts/review.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/gh-600/1.1.0/manifest.json`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/gh-600/1.1.0/knowledge/` and
  `/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/gh-600/1.1.0/prompts/`:
  byte-identical copies of all 1.0.0 material; their hashes are in the manifest.
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/OFFLINE-IMPORT.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/SESSION-2A-CLOSEOUT.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-READINESS-PLAN.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/AI-103-KNOWLEDGE-BASE-PLAN.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/docs/LOCAL-CI.md`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/README.md`

## Remaining and next step

Session 2A is complete within the approved offline import/storage scope. Session
2B remains: selector, server-driven preview UI, pack identity on browser/review/
export views, practice timing/score language, pack-specific PDF names/paths, and
both-pack browser/PDF integration. Session 3 remains: original question authoring,
manual Claude review, source adjudication, revisions and final reviewed study bank.

The historical paid provider workflow does not supply the required release
manifest and cannot persist a new completed study exam. Its draft/checkpoint/
retry upgrade and source-refresh activation remain deferred; no paid generation
was exercised. Deployment packaging remains unverified until explicitly requested.

No commit, push, deployment, cloud upload or provider generation was performed.
Recommended next task: Session 2B using these passing contracts and deterministic
fixtures, followed by the ten-question pilot from the 1.1.0 ready-only packets.
