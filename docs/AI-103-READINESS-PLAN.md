# AI-103 readiness: audit and implementation plan

## Latest status - revision 3 corrections

Both revision-2 Opus passes have been adjudicated. Revision 3 applies the material
corrections and passes draft browser, Markdown and PDF verification. Focused
independent acceptance, released import and final released checks remain.
See [the current closeout](SESSION-3-FINAL-CORRECTIONS.md). Historical checkpoints
below describe their original stages.

Prepared 2026-10-07 (America/Vancouver; evidence captured 2026-10-08 UTC).
Exam deadline: Tuesday, 2026-10-13, interpreting “next Tuesday.”
Baseline: `6b4eb7527a4a21e7bbfaffbad5771321ad849332`.

## Outcome and boundary

Preserve the GH-600 work that supported Andrew's May pass. Deliver a separate AI-103
pack, reviewed practice material, and usable local exam/practice and PDF presentation.
Prioritize generation of accurate, varied questions and useful answer/distractor
explanations, then the app workflow that imports and presents reviewed exams.
The learner study schedule is outside repository scope.

Authoring route clarified by Andrew: use models in this ChatGPT/Codex subscription
to write the AI-103 package into local files. Claude subscription audit is manual
copy-paste using the model Andrew names as Opus 5.5. The local app imports, validates,
assembles, presents, and scores those files; paid API generation is outside the
critical path. This decision supersedes the earlier API-oriented generation plan.

The initial source/configuration audit and Session 1 local baseline are complete.
See `docs/SESSION-1-BASELINE.md` and `docs/LOCAL-CI.md` for results and commands.
The later session updates below record completed pack extraction and pilot authoring;
independent content review remains pending.
“Presentation” here means the existing browser experience and printable practice/answer
PDFs; a slide deck is outside this deadline's critical path.

October 7 update: the implementation pause is lifted and Session 2A is complete.
The prerequisite knowledge work remains intact: revision 1.1.0 has 64 objective
notes, with 56 bounded authoring scopes and eight partial objectives. A separate
`runtime-manifest.json` activates the reviewed evidence for local imports without
rewriting its historical staged-research manifest or any of its 154 original files.

Session 2A provides explicit identity, exact planning, GH-600 read compatibility,
offline import/release validation, immutable per-pack storage and attempt/drill
isolation. See `docs/SESSION-2A-CLOSEOUT.md` and `docs/OFFLINE-IMPORT.md` for checks,
contract and paths. Session 2B selector/browser/PDF integration is also complete;
see `docs/SESSION-2B-CLOSEOUT.md` for synthetic browser/PDF evidence. Session 3A has
now authored the ten-question pilot and prepared its draft PDFs and five-file Claude
handoff. See `docs/SESSION-3A-CLOSEOUT.md`. Independent review/adjudication and release
remain pending; no reviewed AI-103 questions exist.

## Preservation baseline — captured now

`docs/gh-600-preservation-baseline.json` records SHA-256 hashes and sizes for 21 tracked
files: the original exam JSON, four PDFs, published allowlist, prompts, knowledge, and
question fixture. The corpus contains six exams and 233 questions, all tagged GH-600;
exam lengths are 20, 25, 10, 10, 100, and 68. All four published IDs resolve.

This manifest detects changes; it is not a backup or a correctness endorsement. Git
at the baseline commit retains the tracked originals. Before runtime work, make a
local backup of any existing untracked attempts/artifacts and verify its hashes;
keep those private files outside Git. Do not rewrite old exam IDs, questions,
answers, dates, PDFs, or publication entries to retrofit pack metadata.

## Audit findings and required adjustments

All paths below are relative to this repository. Findings describe the inspected
source and a dependency-free execution probe of the blueprint function; no full
application test suite has been executed in this audit.

| Priority | Evidence | Adjustment / acceptance condition |
|---|---|---|
| P0 | `src/types.ts:74`, `src/validators.ts:63`: question identity is fixed to GH-600; plans and exams lack pack/version identity. | Require a registered pack reference on new plans/exams. Strictly reject unknown packs and mismatched questions. Read legacy records through a GH-600 compatibility adapter without rewriting them. |
| P0 | `src/generation.ts:15-54`: global prompt cache, domain-only knowledge cache, and GH-600 fallback. `src/config.ts:8` supplies a shared source registry. | Resolve prompts, knowledge, domain names, and sources from the selected pack. Cache by pack/version/snapshot/domain; fail if required material is missing. |
| P0 | `scripts/fetch-knowledge.ts` writes `domain-A-docs.md` etc.; generation loads `domain-A.md` etc. | Make the pack manifest the single mapping for source inputs and generated knowledge. Stage refreshes and validate them before activation; no shared-directory overwrite. |
| P0 | `src/blueprint.ts:105-184`: declared quotas and requested batches are separate calculations. | Enforce exact question and per-domain totals. The execution probe yields A20/B23/C13/D15/E16/F13 for 100 questions, versus declared A17/B21/C14/D17/E18/F13. Requested totals 10/30/50/70/200 produce batch totals 11/29/49/68/205. Preserve legacy content; fix and version future planning behavior. |
| P0 | `src/generation.ts:163-198,268-290`: provider JSON is cast without applying `practiceQuestionSchema`; validation checks presence/wording. Server and CLI accept everything except `rejected`, which that heuristic never emits. | Validate structure, answer references, pack, objective IDs, source URLs, case links, counts, and domains before assembly. Record semantic review separately. Exclude unresolved items from a released study set. |
| P0 | `src/server.ts:279-330`: SSE disconnect can break the loop and still save a partial exam. | Preserve batch checkpoints as drafts; incomplete or cancelled runs must not become completed exams. Bound retries and resume from checkpoints. |
| P0 | `src/persistence.ts`: whole-array storage, no pack filtering, and read/modify/write saves. | Read legacy GH-600 data unchanged. Store new artifacts per pack and ID; use atomic writes and reject concurrent generation initially. Tie attempts to exam and pack; never aggregate unrelated domain IDs. |
| P1 | `public/app.js:216-247` duplicates GH-600 weights; `public/index.html:17` and `src/pdfExport.ts:190,278,307` hard-code GH-600. | Pack selector, pack-filtered library, server-supplied distribution preview, exam identity on every study/review/export view, and pack-specific filenames. |
| P1 | `public/app.js:355,744` uses 1.2 minutes/question and a 70% “Passed!” threshold. | Configurable practice timing and “practice score” language. Do not equate a percentage to Microsoft's scaled score or claim official format/timing parity. |
| P1 | `tests/e2e/exam.spec.ts` opens the first stored exam; Playwright reuses an existing server; npm dev requires `.env`. | Deterministic fixtures, temporary data roots, a dedicated local server/port, and no credential requirement for CI or taking stored exams. |
| P1 | `.github/workflows/ci.yml` runs tests/build then deploys on a push to main. `Dockerfile` runs npm installs and bakes data into the image. | Make a local CI entry point. Treat any future push/deployment separately; do not use the deployment image as the local CI harness. Include new packs in runtime packaging when needed. |

Additional quality issue: `reviewReasoningEffort` and review prompt files do not
establish an executed independent review stage. Unrestricted provider web search
does not enforce the registry either. Source support must be checked against the
pack's approved URLs/snapshots. Prompt instructions alone are insufficient.

Scope adjustment: provider routing, paid-generation retries, and SSE generation
cancellation remain recorded defects in the legacy path. They need not be rebuilt
for AI-103 before Tuesday. Keep that path unavailable for AI-103; implement the same
pack/count/source safeguards at the new local import boundary. Deterministic
planning and validation should be reusable without importing the provider client.

## Minimum pack design

Use `packs/gh-600/<version>/` and `packs/ai-103/<version>/`, registered through a
typed `ExamPack` resolver. A pack holds exam code/title, version, objective effective
date, domain ranges and chosen study weights, objective IDs, supported item formats,
timing policy, source registry/snapshot hashes, knowledge files, author/reviewer
prompts, and release status. New outputs record that identity plus prompt/source
hashes, actual author/reviewer model, generation time, and review results.

Copy the GH-600 source material byte-for-byte into its initial pack and retain the
original paths during compatibility work. Preserve its existing fixtures and run
them unchanged first. Corrected future GH-600 planning receives a new explicit
version; historical artifacts retain their original behavior and attribution.

Pass pack identity through local authoring packets, planning, import, validation,
assembly, storage, drills, and PDF export. The server resolves pack contents itself;
it must not trust client-supplied paths or source registries. No default to GH-600
for a missing pack on a new import or authoring request. Legacy inference is limited to
known stored records whose questions consistently identify GH-600; mixed/unknown
records fail with an actionable error.

Proposed new storage: `data/packs/<pack-id>/exams/<exam-id>.json`, with separate
attempt and export directories. Read both stores for GH-600 history, but write new
AI-103 material only to its own directory. Temporary CI data never uses either
real store. Keep generated artifacts ignored unless deliberately released.

## AI-103 source baseline

Checked against the official [AI-103 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
on October 7 local time. It shows objectives effective April 16, 2026.

| Domain (paraphrased) | Official range | Proposed study weight |
|---|---:|---:|
| Azure AI solution planning and management | 25–30% | 28% |
| Generative AI applications and agents | 30–35% | 33% |
| Computer vision | 10–15% | 13% |
| Text analysis | 10–15% | 13% |
| Information extraction | 10–15% | 13% |

The selected weights sum to 100%; they are our practice allocation. Small drills
need integer rounding and cannot always match every range. Allocate the full
reviewed bank across all five domains and report coverage by objective.

Build a dated objective-to-source map from that guide and current Microsoft
documentation for Foundry, agents/SDKs, AI Search, Content Understanding, language,
speech, vision, and responsible AI. Include Python/code interpretation. Verify SDK
names and preview/GA status per question; GH-600 examples and AI-102 outlines are
not substitutes. Snapshot only the necessary official material with URL, fetched
time, objective mapping, and content hash.

The [certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
also links the official practice assessment through AI Skills Navigator and the
exam sandbox. Use these alongside local material. Exact exam question count,
duration, and item-type proportions were not established in this audit; do not
invent them or copy GH-600's proportions as official AI-103 rules.

## Model routing and token discipline

Added October 7 at Andrew's request: prioritize maximum intelligence for exam
writing, and precision/performance for the harness. These are recommended task
assignments, not claims that a model was switched or evaluated on this repository.
Use two primary models and switch at completed work boundaries.

| Work | Recommended model / effort | Boundary |
|---|---|---|
| Objective/source interpretation, pack contract, difficult design decisions | GPT-6 Astra (`gpt-6-astra`), high | Set the acceptance contract once; use max for unresolved substantive questions. |
| Exam questions, scenarios, answers, distractor explanations | GPT-6 Astra, max | Highest-quality writing lane; pilot first, then small domain batches. |
| Independent answer/source audit | Claude subscription, Opus 5.5 (Andrew's selected label), manual copy-paste | User transfers bounded packets and returns findings. No Claude API or helper integration. Record the model label actually shown; availability was not independently verified. |
| Content adjudication after audit | GPT-6 Astra, max | Resolve findings against evidence, repair only affected items, and retain a resolution log. Model agreement alone is not proof of correctness. |
| Harness, pack plumbing, persistence, UI/PDF integration | GPT-6.1 Sol (`gpt-6.1-sol`), medium | One continuous implementation phase. Use high for a specific difficult migration, concurrency, or regression issue. |
| Type checks, hashes, schema checks, scoring, quotas, CI and browser assertions | Local deterministic tools | No LLM call inside normal CI. Sol interprets failures and applies repairs. |
| Cosmetic edits and routine formatting within the current phase | Keep the phase's model; concise output | Avoid another model/session for a few cheap operations. Do not introduce a third model merely to format JSON. |

The live [Astra model page](https://developers.openai.com/api/docs/models/gpt-6-astra)
positions Astra as the most capable model and supports max effort. The
[GPT-6.1 Sol page](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
describes a lower-cost option for complex work, with medium as the default effort.
The assignments above are our quality/cost judgment; “max” is not a factual-accuracy
guarantee. Keep citations, executable checks, and release review as the acceptance
criteria. Main Codex retains final edits, integration, verification, and acceptance.

### Apply the choices by phase

1. Finish the contract/source decisions on Astra high. Record a short handoff:
   accepted design, changed paths, check results, unresolved issues, next command.
2. Use Sol medium for Session 1, high for Session 2's coupled pack/import/storage
   contracts, then medium for UI/PDF integration. After two attempts without material
   progress, shrink the problem and take it to Astra with the evidence.
3. Use Astra max for Session 3 authoring here, grouped by domain, saving each batch
   directly to local draft files. Hand off bounded Claude audit packets after local
   structural checks; keep this Codex context for adjudicating returned findings.
4. Use Sol medium for any substantial final packaging work. Return to Astra only
   for unresolved content or design judgments. A small formatting correction does
   not justify a model switch.

Model changes in this Codex chat are explicit user/model-picker actions; this plan
does not change the active model. It does not create chats or delegate work.
The study-package authoring uses this subscription, not the app's OpenAI API client.
There is no API key setup or per-token API spending step in this workflow. Track
subscription allowance where visible; do not convert API prices into subscription
credits or invent per-question dollar costs. Claude audit remains a user-operated
copy-paste workflow; do not silently substitute a helper or remote API.

### Cache discipline

Keep the selected model through a coherent phase; group authoring by domain and
save durable files at each checkpoint. Reuse the agreed contract and source IDs,
read only relevant excerpts, and return concise findings/diffs. Do not repeatedly
paste the whole bank or re-read the whole repository. Switch effort/model at a
checkpoint when the task warrants it, with a short handoff.

[OpenAI's API caching guidance](https://developers.openai.com/api/docs/guides/prompt-caching)
explains prefix reuse, but Codex controls its requests and Claude controls its own
subscription interface. This plan promises no cache hit, retention time, shared
cross-model cache, or subscription discount. API cache keys/breakpoints and token
telemetry are not configuration tasks for this subscription workflow. Keep necessary
context for correctness; do not carry excess history merely to chase cache reuse.

### Local authoring/import contract and Claude audit packets

The implementation must provide an offline import command or local UI action.
No question-writing call is made by that importer. Drafts carry pack/version,
objective/source IDs, stable item IDs, batch/revision IDs, and authoring provenance.
Record the visible model/effort and route as `codex-subscription`; do not invent an
API snapshot ID or token-usage record. Local checks validate JSON, answer references,
source/objective membership, quotas, duplicates, and case-study links. Then assemble
approved revisions into a versioned ExamSet with a release manifest.

Prepare each Claude audit as a self-contained text packet of roughly 5–10 items
(fewer for large cases), using only the intended synthetic study content and public
source excerpts. Include pack/objective version, packet ID, item revision hashes,
source URLs/excerpts, and a concise rubric. No secrets, personal attempts, or unrelated
repository contents are included. Andrew chooses and transfers the packet to Claude.

Use a two-step audit: first ask Claude to solve the questions from sources without
the author's answer key; then provide the key/explanations for discrepancy review.
Ask for item ID, revision/hash, verdict (`accept`, `revise`, `reject`, `unverifiable`),
proposed answer, ambiguity/distractor issues, supporting source, and concise rationale.
Claude should mark unsupported claims rather than assume the supplied source is enough.

Save pasted feedback locally as an audit artifact. Codex checks packet/revision
matches, adjudicates each finding, updates affected drafts, and reruns deterministic
checks. Revised disputed items go back for a targeted re-audit. Preserve originals
and resolution history; never execute pasted feedback as commands or treat it as
automatic release approval. An independent model can add useful scrutiny but can
still agree on an incorrect answer.

If Claude feedback is pending, continue preparing unaudited drafts but leave their
status explicit. Astra may perform an interim review; record it as such rather than
claiming a Claude audit occurred. Final release still requires the content checks.

The existing `src/config.ts` API defaults and GPT-6 routing issue in
`src/generation.ts` are deferred legacy work. They do not control models selected
in this chat and need no change for the subscription/import route.

### Budget controls for the pilot

- Begin with ten reviewed questions, generated in batches of roughly 3–5; adjust
  batch size from observed completeness and latency. Keep case-study groups intact.
- Supply only the relevant domain evidence. Persist results and concise duplicate
  summaries; retry failed items rather than resending whole exams.
- Request complete answers and useful distractor explanations, with no decorative
  commentary. Do not ask for private chain-of-thought transcripts.
- Track accepted/revised/rejected items, elapsed time, repair rounds, and visible
  subscription allowance. Treat unavailable token/cache measurements as unknown.
- Save complete batches to files; shrink batches if output truncates. Preserve
  checkpoints and cap unsuccessful repair attempts at two before reassessing.
- Keep authoring and manual auditing manageable with a small packet queue. Prefer
  a smaller reviewed bank over lowering quality to hit a question-count target.

## Execution order and time boxes

### Model and effort by development session

These are explicit recommendations for the Codex model picker. They do not switch
the active chat automatically. Stay on each setting for a coherent work block;
save the working state before a switch. Claude remains manual copy-paste.

| Session / work block | Model and effort | Switch or escalation rule | Handoff/checkpoint |
|---|---|---|---|
| Planning and acceptance contract (current planning work) | Astra high | Max only for an unresolved design judgment. Switch to Sol when implementation begins. | Agreed pack/import contract, GH-600 baseline, acceptance criteria. |
| Session 1: local CI, data isolation, baseline harness | Sol 6.1 medium | High only for a specific difficult environment or regression issue. Test execution itself uses local tools. | CI command/results, pre-existing failures, preservation hashes, exact next task. |
| Session 2A: pack identity, compatibility adapter, import/storage invariants | Sol 6.1 high | Keep high through this coupled implementation and its targeted checks. After two unsuccessful repairs, isolate the failing contract for Astra high/max. | Working import path, rejection cases, GH-600 compatibility results. |
| Session 2B: selector, preview, browser/PDF integration | Sol 6.1 medium | Switch down once 2A's contracts pass. Keep medium through integration checks and ordinary repairs. | Synthetic AI-103/GH-600 browser flow, PDF evidence, remaining defects. |
| Session 3A: source interpretation and question writing | Astra max | Keep one authoring phase, grouped by domain. No per-question model switching. | Versioned draft batches, objective/source map, local structural results. |
| Session 3B: independent content audit | Claude Opus 5.5 via Andrew's subscription UI | Andrew selects the available mode there; this plan assumes no undocumented Claude effort control. Astra max adjudicates returned findings here. | Packet/revision IDs, pasted audit, evidence-backed resolutions, targeted re-audits. |
| Session 3C: import, final package and presentation QA | Sol 6.1 medium | Use a separate work block only if packaging needs substantial code work; routine file assembly can stay with the current model and local tools. | Released JSON/PDF hashes, browser/PDF checks, both-pack regression results. |
| Final content corrections and packaging | Astra max for substantive question/answer revisions | Sol medium only for a bounded app defect. Freeze unrelated feature work. | Revised items and audit status, final local exam package. |

At every handoff record changed file paths, decisions, checks that actually ran,
failures/unknowns, and the next command in a short local session note. Preserve
the original artifacts and current draft revisions; do not paste the entire chat
or question bank into the next work block. Inspect available subscription allowance
at major phase boundaries where tooling/UI permits, without promising cache savings.

### Session 1 — preserve and establish the local baseline (1–2 hours)

Model: **Sol 6.1 / medium**. OrbStack and deterministic tools execute the checks.

1. Work on a local feature branch from the recorded commit. Verify preservation
   hashes; back up private artifacts if present. Keep GH-600 immediately accessible.
2. Add a repeatable local CI script/runbook. Capture baseline unit/build results,
   then a GH-600 browser smoke run using disposable fixture data. Record pre-existing
   failures separately so extraction cannot hide them.
3. Add explicit data-root and loopback host configuration; make study startup
   work without an API key. Complete a basic browser/PDF preservation check.

Exit: known baseline, original artifacts intact, local CI command available.

### Knowledge-base prerequisite — AI-103 scouting and evidence preparation

Complete KB1–KB3 from `docs/AI-103-KNOWLEDGE-BASE-PLAN.md`: map every official
objective bullet, scout primary service/SDK sources, capture dated evidence, and
resolve version conflicts. Prepare objective notes and authoring packets (KB4),
then complete the knowledge-readiness review (KB5) before substantive authoring.
This work is now complete as staged knowledge revision 1.1.0: 50 primary sources,
79 claims, 64 objective notes and 14 bounded authoring packets, reviewed by the
main agent after the requested Sol 6.1 extra-high draft. Eight objective gaps remain
explicit; no reviewed AI-103 questions exist yet.

### Session 2 — pack isolation and AI-103 foundation (3–5 hours)

Model: **Sol 6.1 / high** for core pack/import/storage work, then **medium** for
UI/PDF integration once the contracts pass. These are two work blocks, not repeated
switches between individual files.

1. Implement resolver/types and GH-600 compatibility first, then pack-aware
   blueprint, offline JSON import, runtime validation, assembly, and persistence.
2. Add AI-103 manifest, source map/snapshot, prompts, and small synthetic fixtures.
   Initially use supported formats; mark their mixture as a practice design choice.
3. Add selector, source-aware review display, and pack-driven PDF identity. Serve
   preview counts from the same planner that generation uses.
4. Run targeted isolation and regression checks before authoring the pilot here.

Exit: a synthetic AI-103 exam can be imported, taken, scored, reviewed, and exported;
switching to GH-600 still works, and no legacy content has changed.

### Session 3 — reviewed material and presentation (3–5 hours, by Friday)

Models: **Astra / max** for writing and adjudication; **Claude Opus 5.5** for manual
independent audit; **Sol 6.1 / medium** if substantial packaging code remains.

1. Write a ten-question pilot here using Astra max, spanning all domains. Save
   drafts locally, run structural checks, and prepare Claude copy-paste audit packets.
2. Incorporate Andrew's returned Claude findings, resolve every answer/distractor
   against primary evidence, and import accepted revisions. Record visible models,
   revisions, audit status, repair limits, and subscription allowance where available.
3. Expand to a 30-question diagnostic, then a reviewed bank of about 100 unique
   questions if review capacity permits. Track objective gaps rather than filling
   them with unreviewed output. Avoid a second large mock until the first is sound.
4. Present domain/objective coverage, citations, why each answer is right/wrong,
   flagged-item review, weak-domain drills, and separate question/answer PDFs.
   Record a release manifest and review status; render representative PDF pages.

Exit: usable AI-103 study package with no unresolved answer/source/identity defects,
plus retained GH-600 functionality and baseline hash comparison.

### Final content corrections and app presentation

Prioritize unsupported or ambiguous answers, weak distractors, repeated scenarios
and objective gaps. Correct disputed items in a new package revision; preserve
exams already attempted. Present accepted revisions with readable questions,
scoring, source-linked explanations and consistent question/answer PDFs.

Time boxes are estimates. If pack extraction threatens Friday's study deadline,
freeze the broader refactor and deliver a separately versioned AI-103 JSON/PDF
study package with a narrow validated importer. Do not modify shared GH-600 prompts
to force AI-103 generation. Reduce question volume before reducing review quality.

## Local CI contract

At the initial planning audit: Docker's active context is `orbstack`, Linux ARM64. Node 22/24 images
and Microsoft Playwright images are cached; repository `node_modules` is absent.
No install, image pull, paid generation, application test, or deployment ran here.

Use the installed `codex-node-isolated-run --project` harness after inspecting its
install command. Stage a sanitized copy containing tracked project inputs plus
the intended new files; exclude `.env`, credentials, attempts, and unrelated local
files. Package downloads come from the lockfile's registries; no repository/source
upload is required. Installation runs inside the ephemeral container. Poll before
new install/configuration work as required by the global operating instructions.

The implementation's single CI entry point should:

1. Use `npm ci` with the existing lockfile in a disposable Node container and run
   Vitest plus TypeScript build. Keep outputs/container dependencies off the host.
2. Run deterministic pack/plan/contract checks and baseline hash comparison.
3. Run Playwright against a dedicated test server with temporary data and synthetic
   AI-103 + GH-600 fixtures. Match the browser image version to the locked Playwright
   package; cached image presence alone does not prove compatibility.
4. Verify PDF identity, readable code/citations, page clipping, and both practice
   and answer exports. Disable GCS/cloud upload in this local path.
5. Save a compact local report with commit/diff, tool versions, commands, failures,
   and preservation results. Shut down only this task's containers/server.

Do not upgrade the lockfile as part of pack extraction unless baseline evidence
requires it. Check compatibility with the existing Node 20 deployment configuration
before any later deployment decision; local Node 22 success does not prove parity.
GitHub Actions availability and subscription billing were not queried. Local CI
must succeed without depending on either.

## Release checks

- GH-600 baseline hashes match; original exams and PDFs remain usable. Private
  attempts are preserved and are absent from test fixtures and Git changes.
- Alternate GH-600 → AI-103 → GH-600 in one process to expose cache leakage.
  Unknown pack, missing source, wrong exam code, foreign objective/source, and
  mixed-pack assembly all fail before persistence or a provider call.
- Blueprint totals match batches and returned questions for 1, 10, 20, 25, 30,
  50, 70, 100, and 200 items; domain quotas and case-study links remain consistent.
- Validate answers for every enabled type, duplicate detection, draft/review
  separation, cancellation, resume, and bounded retry behavior.
- Both packs complete load → answer → submit → score → review → drill → export
  with deterministic fixtures. A UI selection cannot change the identity of an
  exam already in progress.
- Every released AI-103 item has a valid objective, reviewed answer/distractors,
  supporting source evidence, and pack/model provenance. Coverage gaps are visible.
- Publication filtering and dev-only mutation gates continue to work. Local CI
  has no API credentials and cannot deploy or upload. A broad production/security
  redesign is deferred beyond this personal study deadline.

## Status after Session 1

Completed: initial discovery/source audit and plan, tracked preservation inventory,
local branch `session-1-local-ci` from the recorded baseline, original 15-test/build
baseline, and implemented local CI/data-root/loopback/offline harness. Original
credential-free startup failed on missing `.env`; startup now loads `.env` optionally.
Final local CI passed 18 unit tests, TypeScript build, and eight Chromium checks.
All 21 preservation hashes matched before and after. All four original PDFs were
served unchanged and parsed; representative code/continuation/answer pages were
visually inspected. Synthetic API/CLI PDF export and production gates passed.

No private data artifacts needed backup. Historical exams, PDFs, publication data,
prompts, and original unit-question fixture remain unchanged. Dependencies/builds
were confined to disposable OrbStack containers; task containers/servers were
removed. Existing Kubernetes workloads were retained. No commit, push, deployment,
or provider generation was performed. Detailed evidence and absolute changed-file
paths are in `docs/SESSION-1-BASELINE.md`; the ignored machine report is
`.local-ci/latest.json`.

## Status after Session 2A

Completed: registered AI-103 1.1.0 runtime evidence and GH-600 1.1.0 future planning;
legacy GH-600 1.0.0 read adapter; exact quotas; offline JSON CLI/dev import and
assembly gates; format, objective, source, duplicate, count, case and review-hash
validation; immutable atomic per-pack exams/attempts; content-bound attempt scoring
and pack-isolated drills. Reviews of case children bind their shared case context.

Validation uses deterministic synthetic content, not authored study material.
The release gate checks recorded exact-revision reviews, not the truth of a model's
answer or authenticity of a manually entered reviewer label. All 21 historical
GH-600 artifacts and 154 original knowledge-base files remain byte-identical.
Detailed results and changed paths are in `docs/SESSION-2A-CLOSEOUT.md`.

Remaining: Session 2B selector, preview UI, browser/PDF identity and integration;
Session 3 ten-question pilot, manual Claude audit, adjudication and reviewed bank.
The eight partial objectives stay excluded until a new evidence revision resolves
their gaps. Legacy paid-generation retries/checkpoints and deployment packaging
remain deferred. No provider generation, commit, push or deployment was performed.

Next: Session 2B, then author and review the pilot with the activated 1.1.0 packets.

## Status after Session 2B

Completed: public pack catalog, selector grouping GH-600 history/current revisions,
exact server-driven planning preview, local JSON import controls, configurable
practice timing with frozen attempt identity, source-linked browser review and
pack-aware reports/drills. All nine formats complete the synthetic exam flow for
both packs. Practice mode accepts editable choice/structured answers and reveals
explanations/sources. Practice scores make no official pass/scaled-score claim.

PDFs support separate questions-only, answer-review and combined practice variants,
with code/version, immutable exam/revision/hash, objective tags and source snapshot
citations. New exports use immutable per-pack paths; original PDFs remain unchanged.
Published downloads and development-only builds preserve the existing gates.

Verification and absolute changed-file paths are in `docs/SESSION-2B-CLOSEOUT.md`.
Remaining: Session 3 pilot authoring, manual independent audit, adjudication and
reviewed bank. Eight partial objectives remain excluded. Paid generation and
deployment packaging remain deferred. Next: author the ten-question pilot using
the ready-only 1.1.0 packets and prepare exact-revision manual review material.

## Current checkpoint — Session 3C preparation

Session 3A authored pilot revision 1; Andrew returned the Opus 5.5 audit with eight
accept and two revise verdicts. Revision 2 now corrects Q2/Q7, narrows Q4's unsupported
explanation, completes the frozen Q3 evidence handoff and recalibrates difficulty.
The original draft/audit are preserved. A separate assessed-difficulty planning
policy and exact-audit release bundler are implemented without changing old plans.

Revision-2 draft browser/PDF preflight is complete. **Session 3C is not complete:**
fresh independent acceptance of the revision-2 hashes, real released import and
final released browser/PDF verification remain. The prepared five-file audit packet
and finish commands are in `docs/SESSION-3C-CHECKPOINT.md`. No audit acceptance is
carried across changed content, metadata or shared-case hashes.

## Status after Session 3A

Completed: ten original source-linked questions across all five domains, including
one shared case with two independent children; complete keys, distractor/step/slot
explanations; the exact ten-item planner allocation; objective/evidence mapping;
actual draft-schema/assembly checks; three visibly labeled draft PDFs; and a
self-contained five-file, two-stage Claude audit handoff with strict read-only
repository access. The author used GPT-6 Astra / Ultra at Andrew's explicit request.
Difficulty labels remain provisional and are an explicit audit question.

The package is `authoring/ai-103/pilot-001/pilot.draft.json`, ID
`ai103-pilot-001-r1`, revision `1`. It references 11 ready objective bullets and 15
captured public sources. Its root status is `draft`; `reviews` remains empty.
Per-item mechanical validation does not establish semantic acceptance. The existing
release gate excludes this draft from completed study storage.

Remaining: Session 3B manual Claude audit, evidence-backed adjudication and targeted
re-audit of changed items; then Session 3C released import and final presentation
acceptance. Broader question-bank expansion follows the pilot findings. The eight
partial objectives, legacy paid generation and deployment packaging remain deferred.

Next: send audit files 00/01/02 first, preserve Claude's blind answers, then send
03/04 and return the completed audit to Codex. Paths, checks, preservation evidence
and preview-rendering notes are in `docs/SESSION-3A-CLOSEOUT.md`.
