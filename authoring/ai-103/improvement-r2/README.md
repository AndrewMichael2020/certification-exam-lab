# AI-103 improvement: one 100-question package

The current deliverable is one canonical 100-question draft, `ai103-improvement-r2-set-a-100`, explicitly bound to `ai-103@1.2.0`. The user reduced the original pair to one package. No Set B was generated. The earlier 20-item checkpoint and its PDFs/review packets remain byte-for-byte unchanged.

`AI-103-100Q-Draft-Package.zip` contains the canonical draft, both learner PDFs, blind/keyed audit archives, exact evidence pack, coverage, lineage, diagnostics, verification and authoring inputs/scripts. Its manifest identifies every included file by SHA-256. Independent content review is pending; there are no accepted reviews. Real learner-library import and release packaging have not occurred.

## Reproduce and verify

Run from `/Users/antvibe/Documents/Dev/cert-exam-lab-local`:

```sh
python3 -B authoring/ai-103/improvement-r2/run.py single
/Users/antvibe/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -B authoring/ai-103/improvement-r2/verify-pdf.py a
# Inspect the newly rendered contact sheets and full-size samples before recording visual acceptance.
python3 -B authoring/ai-103/improvement-r2/single-report.py
```

For PDF creation, perform the installed PDF skill's artifact-operation marker before the first authoring command. The report deliberately refuses to seal the final package while visual inspection is pending. `verify-pdf.py` resets that status on every run; record acceptance only after inspecting the current renders.

`run.py` requires the active OrbStack context and cached Playwright 1.60.0 image. It stages a credential-free repository allowlist, installs locked dependencies inside the ephemeral container and writes generated outputs back only after successful checks. Service calls are not executed. The real learner store is never staged by the authoring runner. Browser network access is restricted to the temporary local server. Reproduction uses the existing repository's unchanged original booklets for lineage inputs.

`run.py checkpoint` still reproduces the separately frozen first-test checkpoint. `run.py evidence` is a separate evidence operation; do not change the frozen pack or question/source/context bytes after review without new bindings.

## Verified structure and editorial scope

- Exactly 100 items: domains A28/B33/C13/D13/E13; format groups 42 single-choice, 18 multi-select, 10 sequence, 8 matching, 16 case children and 6 code/configuration artifacts.
- Eight dropdown items are included in the single-choice group. Together with six artifacts they provide 14 implementation/exhibit tasks. OCR input production, absent layout output, uncertain invoice extraction, poller/result confusion and mixed-language translation provide five artifact diagnoses.
- Four cases have 403, 383, 412 and 414 words, diagnostic exhibits and four independently answerable children each. They cover tool correlation/approval, retrieval/grounding/access, regional/runtime identity and subscriber-memory/output contracts.
- Ten sequences use explicit data, object or release-gate dependencies. Their explanations and evidence sidecars record every adjacent dependency edge.
- Difficulty estimates are 38 easy and 62 medium, with no forced hard quota. These are author estimates, pending independent assessment.
- Correct metric options now use concise metric names, keyless/memory explanations retain exact endpoint and scope distinctions, and alternatives target realistic authorization, retrieval, input and API mistakes. Position and length diagnostics are descriptive; no longest-key acceptance band or padding rule is used.
- Two consecutive assemblies have identical canonical hashes. Every item has an explicit primary objective, registered source hashes and a context-bound review hash. Changed case facts invalidate all affected child hashes.

## Review handoff and coverage

Send `a-audit-blind.zip` first. It contains all 100 questions, null-verdict templates, exact source excerpts and full frozen source captures. Thirteen batches keep four complete cases intact and split remaining items into nine groups of 9-10. Supply `a-audit-keyed.zip` after the reviewer solves blind. Preserve the actual reviewer output and adjudicate answer correctness, alternatives, source support, API generations, objective fit, difficulty and answer cues. Matching answer letters alone are insufficient. No reviewer or provider was invoked.

`a.objective-coverage.json` records all 64 official bullets: 50 assessed, four evidence-ready but unassessed (B1.01, B1.03, B1.05, B3.03), eight partial/version-conflict scopes and two exclusions. Partial objectives remain A1.01, A3.02, B2.03, B3.02, C2.07, C2.08, C3.02 and C3.03. Video generation/editing C1.02 and C1.04 remain excluded. This package makes no full-syllabus or calibrated-readiness claim. Fifty distinct frozen sources support the authored scope.

`a.item-disposition.json` inventories all 200 original items. Revised origins link to actual new identities/hashes; unselected originals remain unchanged. The checkpoint's coverage/disposition reports are retained as historical checkpoint evidence.

## Verification and preservation

`qa/single-report.json` records actual draft browser exam/practice rendering and the independent synthetic nine-format mechanics test: disposable import, submission, 100% mechanics score, saved-attempt read, review, JSON and PDF exports. Draft imports and unreviewed release attempts remain rejected.

`qa/pdf/a/verification.json` records both PDF hashes and page counts, exactly one occurrence of every stem, complete choices/exhibits, answer-free questions-only text, complete practice explanations/slot notes, canonical JSON answer-key agreement and all 50 practice source-link targets. It also records eight Python AST checks, all-page contact sheets and visual acceptance. SDK syntax checks are not executed Azure validation.

`a.preservation.json` compares the 652-file starting inventory: old evidence/booklets/audits/PDFs, checkpoint outputs, GH-600, shared code, dependency files and real learner data remain unchanged. All 21 original GH-600 reference hashes pass. Private runtime inventories remain in ignored local storage.

The prior registry CI remains applicable because its shared/test/runtime inputs are unchanged: 89 unit tests and build pass; 12/14 browser tests pass. Two baseline failures expect r2 PDF filenames while the existing renderer emits r3 (`tests/e2e/baseline.spec.ts:24`, `tests/e2e/packs.spec.ts:106`). The ID-only setup selector still resolves AI-103 planning to 1.1.0; explicit 1.2.0 API planning and library-card study pass. Both shared-engine follow-ups remain outside this content task.

No real local import, commit, push, deployment, publication or paid generation occurred.

## Code files created or changed for the single package

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/single-inputs.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/single-report.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/assemble.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/qa.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/run.py`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/authoring/ai-103/improvement-r2/verify-pdf.py`
