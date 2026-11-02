# AI-103 package improvement: implementation handoff for Sol

Prepared 11 October 2026. Repository: `/Users/antvibe/Documents/Dev/cert-exam-lab-local`.

## Objective and implementation instruction

Improve the AI-103 practice package's technical accuracy, diagnostic value, case-study depth, code fluency and objective coverage. Preserve GH-600 content and behavior. Implement this plan in the current workspace, preserving its existing uncommitted work. Use the existing subscription authoring and offline review/import workflow. Do not create another chat, invoke paid generation, push, deploy, publish or change scoring as part of this work.

The primary deliverable is a revised, reviewable pair of 100-question AI-103 sets with questions-only and practice-with-answers PDFs, an explicit coverage matrix, item-level evidence and a blind review packet. Advance to released packaging only when genuine independent acceptance for the exact revision is available. A complete draft handoff is a valid implementation milestone; never manufacture review acceptance to finish the release stage.

This plan is the current scope for package improvement. Historical session plans remain evidence of prior work; their deadlines, completed migrations and model-routing suggestions are not new tasks. Sol owns implementation, integration and verification. The existing independent audit route is a user-operated review handoff; do not silently substitute an external provider or automatically dispatch agents.

## Findings that drive the changes

The comparison examined the supplied 10-question commercial demo, our two 100-question sets, relevant current Microsoft documentation and the retained review of the earlier 25-question draft. The demo helps identify question formats and missing decisions; its provenance does not establish actual exam authenticity or an authoritative key. Author original scenarios and source answers from primary documentation. Do not ingest the demo into the source registry or copy its case, questions or explanations.

| Priority | Finding | Required improvement |
|---|---|---|
| P0 | Set B Q85-89 disclose the requested sequence in their stems; Q83-84 and the other sequence items also need inspection. | Review all 20 sequence items. Require knowledge of dependencies; replace items whose only challenge is paraphrasing the stated order. |
| P0 | Several distractors are implausible, such as A Q61's audio-analyzer alternative. | Audit all 200 items. Use realistic competing services, configuration errors and incomplete solutions. Record why each distractor fails under the scenario. |
| P0 | `booklets-100/assemble.py` derives objective tags from every claim sharing a source and domain. | Assign objective tags explicitly per item. A citation to a broad page must not count as evidence that every linked objective is assessed. |
| P0 | Booklet JSON is a standalone draft format, not a reviewed importer package; its plan differs from the runtime planner. | Produce canonical draft packages against the existing plan, schema, batch and review contracts. Do not relabel or directly import old booklet JSON. |
| P1 | Shared case bodies are about 53-62 words and children often work without them. | Write substantive multi-section cases whose answers require selecting relevant constraints from the case. |
| P1 | Each set has three exhibits and no code-completion answer structure. | Exercise existing dropdown completion, configuration and artifact interpretation support with source-matched Python/JSON. |
| P1 | Exact inference roles, automatic memory scope, forced tool calling and mixed-language translation troubleshooting are weak or absent. | Add original implementation and diagnosis questions for each; see the topic matrix below. |
| P1 | Sets A/B revisit many of the same decisions in similar positions. | Retain reinforcement where useful, but make B a materially different diagnostic exercise rather than a noun-swapped A. |
| P1 | Eight knowledge objectives remain partial; video generation/editing was deliberately excluded. | Reassess each partial objective against evidence, and report deliberate omissions separately from evidence gaps. Preserve the video-generation exclusion unless the user changes it. |
| P2 | The app has custom practice scoring; a percentage is not an official scaled score. | Leave shared scoring untouched. Keep practice-score interpretation clear in AI-103 guidance; defer scoring redesign. |

The retained 25-question review does not validate these 200 questions. Do not report its findings as still present without checking the corrected draft, or transfer its acceptance to new items.

## Preservation boundary and allowed changes

Before editing implementation, record HEAD, tracked diff identity and an inventory/hash baseline of task-relevant tracked and untracked files. This checkout is already substantially dirty. Compare this task's changes to that starting state, not merely to HEAD; never reset or overwrite another session's work.

1. Verify all 21 entries in `docs/gh-600-preservation-baseline.json`. Preserve that manifest unchanged. If an entry already differs, report the pre-existing mismatch and investigate without rewriting the reference hash.
2. Capture a supplemental before/after inventory of `packs/gh-600/`, shared source/UI/config/test files, legacy prompts and any existing GH-600 runtime artifacts. Record private runtime hashes locally without copying attempts or content into committed reports or audit packets. File additions/removals must be detected as well as modified bytes.
3. Preserve all existing AI-103 evidence versions, pilot/audit directories, `authoring/ai-103/booklets-100/` and the original PDFs. Create new revisions with unique exam/item identities and a lineage map.
4. Use temporary data roots for import, browser, score and export checks. Never run a test against the user's real attempts/publication store. No default pack fallback.

| Path or area | Change policy |
|---|---|
| `authoring/ai-103/improvement-r2/` | New AI-103 authoring, assembly, checks, coverage, review packets and reports. Main work area. |
| `packs/ai-103/1.2.0/` | Proposed new immutable evidence/runtime revision. First check that the version is unused; select the next unused revision if necessary. Copy retained evidence byte-for-byte, then add/version the changed evidence here. |
| `output/pdf/ai-103-improvement-r2/` | New revision's learner PDFs. Preserve original filenames in the old directory. |
| `docs/AI-103-IMPROVEMENT-CLOSEOUT.md` | New implementation evidence and remaining-work record. |
| New AI-103-specific tests under `tests/` | Allowed; exercise new contracts without weakening existing tests. |
| `src/packs.ts` | Narrow planned exception: register the new AI-103 manifest. Preserve both GH-600 entries/constants and resolution behavior. Prefer explicit new-version selection; change `CURRENT_AI103` only if necessary for activation and covered by tests. |
| `packs/gh-600/`, legacy GH-600 files, existing attempts/publications | No changes. |
| Shared scoring, planner, validation, compatibility, renderer, server and UI | No changes in the main path. Existing capabilities are sufficient. Record a concrete blocker before proposing a separate shared-engine change; continue independent content work. |
| Dependencies, lockfile, cloud workflows, deployment configuration, global Codex configuration | No changes. |

Content isolation plus regression checks is the protection strategy; do not claim a guarantee of zero regressions merely because GH-600 data hashes match. Baseline and final behavioral checks are also required for the registry exception.

## Stage 1: inventory, coverage and revision skeleton

Read these current contracts before implementing: `docs/OFFLINE-IMPORT.md`, `docs/LOCAL-CI.md`, `src/packs.ts`, `src/blueprint.ts`, `src/importValidation.ts`, `src/reviewPackaging.ts`, `src/auditMarkdown.ts`, and `src/pdfExport.ts`. Use them as existing interfaces, not a refactoring list.

Inventory the old 200 questions into `authoring/ai-103/improvement-r2/item-disposition.json`. For each item record old set/ID/hash, keep/revise/replace decision, the reason, tested decision, primary objective, source evidence and intended new ID. Initially mark unreviewed judgments as pending.

Create an objective coverage matrix for all 64 official bullets. Distinguish:

- evidence readiness: sufficient, partial, version conflict;
- actual assessment: item IDs and the specific skill tested;
- deliberate exclusion: video generation/editing under the existing decision;
- remaining work: missing item, missing source, or unresolved technical interpretation.

Maintain authoring-only annotations in sidecar files rather than adding fields rejected by the strict importer schema. Do not reuse automatic source-wide tagging. A reviewer must be able to explain why answering each item demonstrates its primary objective; secondary tags require real additional assessment.

Stage acceptance: the old files remain unchanged; every old item has a disposition record; all official bullets have an explicit status; no coverage claim comes solely from domain weights or source co-occurrence.

## Stage 2: refresh only the evidence needed

Recheck the official AI-103 guide and the relevant current service/API documents. Capture exact URLs, UTC retrieval time, content hashes, claim excerpts and API/SDK/preview context in the new AI-103 version. Keep source IDs stable for unchanged sources; do not reuse an ID for an unrelated document. Update the new version's asset hashes, source mappings, knowledge notes, prompts and runtime manifest coherently. Do not edit 1.1.0 to make new hashes pass.

| Topic | Required distinction or exercise | Primary starting source |
|---|---|---|
| Keyless inference and RBAC | Authentication vs authorization; exact role and scope for the named endpoint; inference permission vs management permission. | [Azure OpenAI v1 API](https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle) |
| Memory implementation | Low-level explicit scope vs memory-search tool `{{$userId}}`; attaching the tool; caller identity vs end-user identity behind a backend. | [Memory usage](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/memory-usage) |
| Tool calling | `auto`, `required`, `none`, tool selection, execution ownership and result correlation. Keep classic run and Responses request shapes separate. | [Tool best practices](https://learn.microsoft.com/azure/ai-foundry/agents/concepts/tool-best-practice?view=foundry) |
| Translator failures | Mixed-language text, segmentation, detection limits and choosing text/document workflows. | [Translator known issues](https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/known-issues) |
| Project/agent SDK | Credentials, project endpoint, retrieving an existing agent, obtaining the OpenAI client, version-specific method names. | [Agents operations](https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.operations.agentsoperations?view=azure-python) |
| Prompt controls | System instructions vs examples/temperature/top-p; domain boundaries; limitations of instruction-only enforcement. | [System-message design](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions) |
| Search ingestion | Exact skills, chunking/embedding, mappings, vectorizer/index compatibility and semantic reranking boundaries. | [Integrated vectorization](https://learn.microsoft.com/en-us/azure/search/search-how-to-integrated-vectorization) |
| Document processing | Choosing Content Understanding vs Document Intelligence from actual task requirements; extraction vs downstream business validation. | [Content Understanding documents](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview) |

These URLs are research starting points, not automatic evidence approval. Resolve redirects and version changes before capturing. Do not execute Azure operations or install SDKs on the host to author questions. Syntax/schema checks and documentation verification must be distinguished from executed service validation.

Reassess all eight partial objectives explicitly: A1.01 model comparisons; A3.02 drift monitoring; B2.03 native Content Understanding agent integration; B3.02 reflection/evaluation; C2.07 pro-mode/current-mode differences; C2.08 object/region detection; C3.02 image prompt injection; C3.03 visual policy controls. Promote only when the precise authored scope has sufficient evidence. Otherwise retain partial status and keep released items out of that objective. Do not weaken the importer to admit partial objectives.

Stage acceptance: new-version pack resolution validates all assets; every planned answer and critical distractor distinction has primary evidence; unsupported claims and exclusions remain visible in the authoring matrix.

## Stage 3: a 20-question design checkpoint

Before rewriting 200 items, build a 20-question canonical draft using the current planner for the explicit new AI-103 pack reference. Include examples of repaired sequencing, realistic service-choice distractors, two substantive shared cases, code completion, RBAC, memory, forced tool calls and Translator diagnosis. Fit them within the actual planner's domains, batches and supported format groups.

Use the existing `dropdown_completion` contract (`statementTemplate`, `slots`, `correctAnswer.pairs`) for code blanks. It already participates in the single-choice planning group. Do not change the question union, scoring or shared renderer to introduce a duplicate format. Use standalone dropdown items where the existing case-child contract would require a schema change.

Render and inspect both unanswered and answered forms. Check that code blanks, all choices, per-slot explanations and the solution are independently readable. Test the existing browser flow with a mechanics fixture in a disposable store; retain real study material as draft until reviewed. Do not describe a synthetic mechanics test as content acceptance.

Checkpoint acceptance: no stem supplies its solution; cases materially affect answers; all formats work with current contracts; coverage/source mappings are explicit; questions can be solved without consulting the key. If the format fails twice without material improvement, narrow the failing example and record the blocker rather than redesigning the engine.

## Stage 4: revise both 100-question sets

Generate the exact blueprint before writing each set. Retain domain counts A28/B33/C13/D13/E13 unless the official outline has changed. The current runtime's 100-question format allocation is 42 single-choice-group items, 18 multi-select, 10 sequence, 8 matching, 16 case children and 6 code/configuration artifacts, with four cases. Confirm this at implementation time. Existing standalone booklets use different proportions; do not force their old plan through validation.

Use `buildAssessedBlueprint` with all four difficulty counts after editorial assessment, rather than inflating labels to the default hard/very-hard quotas. This changes assessed difficulty only; format/domain/batch/case quotas must still match. Difficulty remains an author/reviewer estimate until learner data exists.

Content acceptance criteria for each revised set:

- Four distinct multi-section cases, typically 350-600 words when that detail earns its place, with four children each. At least three children per case must depend on named case facts. Across those children, require combining constraints, interpreting an exhibit, and distinguishing a plausible alternative. Respect the planner's case-domain assignment. No answer should depend on answering an earlier child correctly.
- At least ten meaningful code/configuration/exhibit tasks, including at least six dropdown-completion items and four failure-diagnosis tasks. Categories may overlap. These are local authoring targets, not claims about official exam proportions. Six existing artifact slots plus dropdowns within the single-choice group can satisfy them without planner edits.
- All sequence questions test a defensible dependency order. If multiple orders work, add a necessary operational constraint rather than spelling out the full order. Explain dependency edges in the answer notes. Replace arbitrary sequences entirely.
- Every distractor represents an identifiable misconception, wrong scope/API, omitted requirement or plausible competing service. Reject gratuitous absurdities and conspicuous absolute-word cues. Correctness takes priority over equal option lengths.
- Replace the old assembler's forced 18-20% longest-key acceptance band with descriptive diagnostics and editorial review. Do not pad answers or wrong choices to meet a narrow percentage. Recompute position/length/cue statistics after the final option order, and resolve obvious systematic cues before review.
- Cover every topic in Stage 2 with both a basic implementation decision and a different troubleshooting/constraint decision across the pair. Source exact API syntax, role names and SDK generations explicitly.
- Compare A/B by tested decision and solution path, not just string similarity. Every concept family repeated across sets needs a documented difference in failure mode, constraint or required reasoning. Reusing a source alone is not duplication; changing company names alone is not variation.
- Separate assessed coverage from excluded/partial objectives. No unsupported claim of full syllabus coverage or calibrated exam readiness.

Build one coherent authoring/assembly pipeline under the new directory. Fix root inputs, not generated JSON only. Preserve unchanged source captures, use deterministic output, and ensure rerunning assembly produces the same content hashes. Finalize question wording, option order, IDs, case context and evidence before independent review.

## Stage 5: independent review and adjudication

Prepare blind packets through the existing exporter and separate keyed evidence packets in batches of roughly 5-10 items; keep complete shared cases together. Record canonical draft hashes and `itemRevisionHash(question, cases)`, which includes case context. Do not reuse the old booklet report's question-only hashes as review bindings for case children.

The reviewer should solve first, then assess answer correctness, plausible alternatives, evidence sufficiency, API/version compatibility, objective fit, difficulty and answer cues. A matching answer letter alone is insufficient. Retain disagreements and resolve them against sources. Updating shared case context invalidates all affected child reviews; any substantive post-review edit needs new review hashes and acceptance.

Provide the user a ready-to-send manual audit packet; do not invoke a provider or claim an independent review occurred. Continue assembly, PDF QA and preservation verification while external review is pending. If no accepted audit has returned, finish with draft PDFs, complete packets and a precise release-blocker list.

After genuine acceptance, use `scripts/package-reviewed-exam.ts` to create a fresh immutable release directory, then `scripts/import-exam.ts --check` through the documented invocation. Validate in a disposable data root first. Do not write to the real learner library in this work unless the user separately requests local import. Never publish.

## Stage 6: verification and GH-600 regression evidence

Use `python3 scripts/local-ci.py` for the existing OrbStack baseline and final registry/runtime checks. Read `/Users/antvibe/Documents/Dev/scripts/codex-harness-help` before new dependency-installing or generated-code execution. Use the current installed harness and locked dependencies; do not pull an arbitrary new image or change host dependencies. If the configured image/runtime is unavailable, report it and continue checks that do not depend on it.

Run the baseline before implementation and final checks once the revision is stable. Attribute failures against the baseline; do not repair unrelated GH-600 failures or weaken tests. Additional task-specific checks must cover:

| Check | Required result |
|---|---|
| Preservation | Original 21 GH-600 hashes pass; supplemental GH-600/shared-file inventory matches except the declared AI-103 registry addition and new tests. Existing AI-103 artifacts remain unchanged. |
| Structure | Explicit pack/version; valid canonical draft shape; exact counts/batches/case links; valid answer/slot IDs; explicit objectives; source/asset hashes resolve. |
| Coverage truth | Each claimed objective traces to an actual tested decision and evidence. Partial/excluded scopes are not silently counted as covered. |
| Review integrity | All released items bind to accepted exact-content reviews. Changed cases, stale reviews, missing evidence and unreconciled verdicts remain rejected. Preserve existing negative tests. |
| GH-600 behavior | Existing historical read/compatibility, planning, scoring, attempts, review, PDF and pack-isolation tests pass without altered expectations. Original downloadable PDF bytes remain unchanged. |
| AI-103 browser mechanics | In a disposable store: select explicit revision, complete dropdown/matching/sequence/case items, submit, review and export. Inspect long code and long case layouts. |
| PDF content | Each question appears once; all choices and exhibits are present; questions-only has no answers; practice keys match JSON; links work; no clipping or broken code wrapping. Inspect all-page contact sheets plus full-size case/code/structured-item samples. |
| Reproducibility | Assembly hashes are stable on rerun. PDF hashes identify delivered files; do not require byte-identical regenerated PDFs if timestamps/metadata differ. |
| Scope | Task diff stays within the allowlist; shared scoring/planning/validation/rendering remain unchanged. `git diff --check` plus equivalent checks for new untracked files passes. |

The normal CI stages `src/`, `tests/`, `public/`, `prompts/` and `packs/`, not the new authoring directory. Stage authoring inputs through a separate explicit, credential-free allowlist for content assembly/PDF checks. Do not mistake a green app CI run for execution of the new authoring checks.

No broad scoring project belongs here. Preserve the existing practice score and GH-600 expectations. A later pack-specific scoring policy would need versioned attempt semantics and its own regression plan. Current Microsoft component-credit/scaled-score guidance does not establish the exact scoring of every AI-103 item type.

## Expected outputs and closeout

Under `authoring/ai-103/improvement-r2/`, deliver a concise README/runbook, item disposition/lineage, explicit coverage matrix, new authoring/assembly/check scripts, two canonical draft packages, quality diagnostics, evidence/review packets, PDF QA records and preservation results. Keep private baseline hashes and runtime inventories in ignored local storage. New evidence belongs under the new AI-103 pack revision. Record any version/directory adjustment in the README.

Produce four learner PDFs under `output/pdf/ai-103-improvement-r2/`: Set A and Set B, each questions-only and practice-with-answers. Keep authoring deliberations, audit commentary and internal validation details in sidecars/chat, not inside learner explanations. Use source links where useful. Report draft/released state accurately in the handoff and manifests.

Close out with:

1. Full absolute paths for every created/changed code file and the deliverables.
2. Completed, partial and pending stages, including independent review status.
3. Concrete examples of repaired answer cues, stronger cases and new implementation coverage.
4. Actual verification results and the exact GH-600 preservation/regression outcome, including pre-existing failures.
5. Outstanding objective gaps/exclusions and any material API/version uncertainty.
6. Explicit local import, commit, push and deployment state; do not infer any of them from artifact creation.

The preferred implementation order is preservation baseline, explicit coverage/evidence mapping, a 20-item checkpoint, the revised pair, blind audit handoff, then accepted release packaging if audit results become available. Deliver accurate, reviewable progress at each checkpoint without expanding into unrelated engine work.
