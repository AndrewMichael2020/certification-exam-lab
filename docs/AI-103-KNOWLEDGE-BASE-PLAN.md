# AI-103 knowledge base: scouting and preparation

Planned October 7, 2026 (America/Vancouver). Exam target: October 13.
Status: **KB1–KB5 completed for a staged question-generation evidence pack; 56 objectives support bounded authoring and eight remain partial. Exam-engine implementation remains paused**.

Accepted revision: [`packs/ai-103/1.1.0`](../packs/ai-103/1.1.0/README.md). Its entrypoint
now describes the question-generation workflow; see the
[readiness review](../packs/ai-103/1.1.0/READINESS-REVIEW.md) for checks and gaps.
The earlier `1.0.0` foundation remains unchanged and is still the resolver's
registered version. The new knowledge revision is not activated in the engine.

## Decision and current evidence

Scope correction from Andrew: prioritize test-exam generation and presentation
in the app, with more attention on generation quality. The knowledge base is an
authoring and review input. A learner study schedule is outside repository scope.

The readiness plan mentioned an objective-to-source map, dated snapshots, and
domain knowledge, but did not make their preparation a sufficiently explicit
prerequisite. Complete the phase below before substantive question authoring.
Pack/import plumbing may use synthetic fixtures after implementation resumes;
successful fixture imports cannot establish content readiness.

Before this work there was no AI-103 pack or knowledge base in this repository.
During the now-paused Session 2A work, the official outline was captured and a
foundation manifest, brief domain outlines, and draft prompt templates were added.
Those outlines are placeholders for research. They contain no service-level answer
evidence and are not an authored or reviewed study bank.

The official [AI-103 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
was re-opened in this session. It identifies objectives effective April 16, 2026,
five domains, and Python experience. The foundation's `AI103-A1` style identifiers
are local group IDs, not Microsoft's official numbered objective IDs. Expand them
to a stable mapping for **every skills-measured bullet**, preserving the parent IDs.

## Research questions

1. What does each official objective require the learner to choose, configure,
   implement, evaluate, or troubleshoot?
2. Which primary documentation supports those decisions, including limitations,
   authentication, deployment, safety, and operational tradeoffs?
3. Which API/SDK generation does a Python example actually use? What is GA,
   preview, renamed, deprecated, or restricted by region/model/deployment?
4. Where do services overlap, and what source-backed distinction supports a
   correct answer over plausible distractors?
5. What remains unsupported or contradictory, and therefore cannot yet support
   a released practice question?

## Work sequence and gates

### KB1 — Freeze the exam scope and map every objective

- Extract the complete current skills-measured outline into a dated, structured
  objective map: domain, subsection, local bullet ID, exact official wording,
  primary URL/anchor, effective date, and capture hash.
- Include image/video generation and editing, multimodal understanding and
  indirect injection, text analysis, speech, and extraction. Do not substitute
  a historical AI-102 outline or assume older vision/NLP service coverage.
- Identify practice weights separately from official ranges; item mixtures and
  local timers remain practice choices.
- Mark every objective `unresearched` initially. Heading coverage is insufficient.

Exit: every official bullet is represented once; omissions, duplicate IDs, and
changes since the captured outline are visible.

### KB2 — Scout primary sources across all five domains

Start with the official documentation families below, then follow the concepts,
implementation guides, Python/REST references, limitations, and change notices
that actually answer the mapped objectives. Landing pages are discovery seeds,
not evidence that a specific implementation claim has been established.

| Domain | Investigation | Primary starting points |
|---|---|---|
| A: planning and management | Model/service selection; retrieval and memory; Foundry projects/deployments; CI/CD; managed identity, RBAC and networking; quotas, monitoring, safety and oversight | [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/), followed by the relevant Azure identity, security, monitoring and Content Safety references |
| B: generation and agents | Python SDKs/connectors; RAG; tool/function schemas; memory; agent workflows and coordination; evaluation; prompt/model controls; tracing and production operation | Foundry model, Agent Service, SDK, evaluation and tracing documentation linked from the Foundry index |
| C: vision and multimodal | Image/video generation and editing; visual grounding and accessibility; video analysis; Content Understanding modes and analyzers; content filters, watermark/policy controls and image-borne prompt injection | Foundry model documentation and [Content Understanding](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/) |
| D: text and speech | Entities, structured outputs, summaries, sentiment/safety and translation; speech recognition/synthesis, custom speech, agent modalities and audio reasoning | Foundry Language/Translator references and [Azure Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/) |
| E: extraction and grounding | Ingestion/indexing; semantic/hybrid/vector search; enrichment and OCR; document layouts/fields; Content Understanding analyzers and downstream representations | [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/), Content Understanding, and relevant Document Intelligence references |

Source selection was expanded at Andrew's request: include Microsoft Learn paths
and modules, official recorded training and shows, verified Microsoft-owned GitHub
repositories, Microsoft developer blogs, and credible named practitioners' study
accounts. Use GH-600 only as a loose reference; choose the AI-103 structure by its
objectives and the remaining study time. Re-use prior methods only where useful.

Distinguish evidence roles. Docs/API references establish technical behavior;
training and videos teach it; repositories illustrate a pinned implementation;
release blogs explain dated changes; firsthand accounts inform preparation.
Community names, Microsoft-like branding, popularity, and reported scores do not
establish official provenance or technical correctness. Reject exam dumps,
unsupported pass guarantees, deceptive attribution, and unsafe download requests
using observable evidence, regardless of author nationality. Do not execute
downloaded samples while scouting. Label unwatched video metadata and inaccessible
transcripts accurately, and distinguish named firsthand reports from independently
verified credentials. A trusted publisher is not a code security audit.

For each objective, select the smallest sufficient set of primary evidence.
Re-use a source across objectives when justified. Search-result summaries,
unsourced notes, community exam dumps, and model recollection are not answer evidence.
Official training and practice assessments supplement scope and study; do not
scrape or reproduce assessment questions into the bank.

Exit: all objectives have candidate sources, with gaps explicitly recorded.

### KB3 — Capture usable evidence and resolve version conflicts

- Save necessary public documentation excerpts with canonical URL, heading/anchor,
  fetched-at UTC, documented update date if available, objective IDs, content hash,
  and extraction method. Keep verbatim source text separate from authored notes.
- Preserve code blocks, tables, limits, prerequisites, and qualification language.
  Never strip a preview warning or a version condition from its associated claim.
- Record service name, Python package/API version, client/class/method, endpoint
  family, auth mechanism, region/model constraints, and GA/preview status when
  relevant. Unknown values remain unknown.
- Distinguish current Foundry and classic documentation. Do not combine client
  calls, resource types, or authentication examples from incompatible generations.
- Check consequential claims against reference documentation or official release
  notes. Resolve conflicts by date/version/context and preserve the decision log.
- Stage captures before activating a new immutable pack revision. Do not refresh
  files in place after questions or reviews bind to their hashes.

Suggested evidence ledger columns: claim ID, objective ID, source ID, excerpt
locator, observation, counterevidence, service/API version, status, confidence,
gap, and the action needed to resolve it. Label findings `documented`, `observed`,
`inferred`, or `unknown`; a documentation example is not a locally executed example.

Exit: decisive facts used in notes have traceable evidence; unresolved conflicts
are marked and excluded from authoring packets that require those facts.

### KB4 — Prepare the local knowledge base and authoring packets

For each objective, produce a concise note containing:

- What the objective requires and its local ID.
- Source-backed service choices and decision criteria.
- Prerequisites, configuration/authentication steps, limitations, and failure modes.
- Python/code interpretation examples tied to the captured SDK/API generation.
- Comparisons that could support plausible distractors, with evidence for both
  the preferred choice and why each alternative would not fit the scenario.
- Primary excerpt/source IDs and any unresolved gap.

Build per-domain summaries from these notes. Prepare bounded authoring packets
with only the relevant objectives, evidence excerpts, version constraints, and
provenance requirements. These packets will support the later Astra authoring and
manual Claude solve-first/key-comparison audit. No question authoring or Claude
audit is claimed in this planning phase.

Proposed durable artifacts, relative to a newly staged AI-103 pack revision:

| Artifact | Purpose |
|---|---|
| `objectives.json` | Every official skills-measured bullet and parent mapping |
| `sources/registry.json` | Canonical primary URLs, dates, status, version and objective mapping |
| `sources/snapshots/` | Necessary public evidence excerpts and hashes |
| `evidence/claims.json` | Claim-to-excerpt ledger, contradictions and confidence |
| `knowledge/objectives/` | Evidence-backed notes per objective |
| `knowledge/domain-A.md` through `domain-E.md` | Concise domain summaries |
| `coverage.json` | Ready, partial, unsupported and excluded objectives |
| `authoring/packets/` | Bounded evidence packets for question writing |
| `manifest.json` | Registered immutable version, mappings, hashes and readiness |

Exit: a packet can support a source-grounded answer and its distractor explanations
without searching unrelated material or relying on uncited model memory.

### KB5 — Readiness review before substantive authoring

- Account for every official bullet as ready, partial, unsupported, or excluded
  with a reason. Publish the gaps; do not silently call partial coverage complete.
- Confirm each ready objective has evidence-backed notes and relevant source
  excerpts. A study-guide bullet establishes scope, not a product-behavior answer.
- Confirm source/manifest hashes, locator resolution, code/version consistency,
  and no foreign GH-600 source/prompt reuse in AI-103 packets.
- Inspect samples from every domain and each consequential service/SDK comparison.
- Begin the ten-question pilot only on ready objectives, spanning all five
  domains if evidence permits. Full-bank readiness requires the unresolved
  objective gaps to be addressed or explicitly disclosed.

This review has run for revision 1.1.0. All 64 official bullets, 50 primary
sources, 79 claims with 130 excerpt references, 64 notes, five summaries, nine
API reading fragments, 14 bounded packets and 17 study supplements are recorded.
Fifty-six objectives have supported authoring scopes; eight remain partial and
are excluded from the packets. This establishes bounded knowledge readiness;
question correctness and release approval still require the later content review
and manual audit process.

## Models, execution and checkpoints

Andrew's current routing request: **Astra high** leads research judgment and final
review; one **GPT-6.1 Sol extra-high** helper produces the draft knowledge base.
The main agent owns integration, verification and acceptance. The helper works in
a separate temporary draft directory and cannot alter the exam engine or original
packs. Recommend **Astra max** for later question writing and **Sol 6.1 high** when
Session 2A contracts resume. Model-picker changes remain user actions. Use local
deterministic tools for extraction, coverage, references and hashes.

Research uses public primary documentation and local files in this subscription
workflow. Paid Azure resources, cloud API exercises, credential setup, additional
provider calls, and publication are not required for KB1–KB5. Any later executable
examples must distinguish static checks from actual Azure behavior.

Work in three bounded passes: objective/source discovery; targeted evidence and
notes; coverage/conflict review. Save evidence between passes. Check subscription
allowance before substantive research and at a phase boundary when available;
do not promise a percentage cost. After two passes without useful new evidence,
record the gap and change the query or narrow the claim.

Priority after this review: generate and review a ten-question pilot from the
supported packets, improve answer/distractor quality, then expand the reviewed
bank. Resume the pack/import contracts and app/PDF presentation work when the
implementation pause is lifted. KB1–KB5 are recorded, with eight partial objectives
kept visible. Reduce question volume before reducing content-review quality.

## Pause checkpoint

Session 2A is **partial and paused at Andrew's request**. The resolver, compatibility
adapter, type extensions and planner edits are saved but untested. Offline importer
and new per-pack persistence are not implemented. Session 1 results predate these
edits and must not be represented as verification of the current working tree.

Code files edited/created during the partial 2A work:

- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/types.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/blueprint.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/packs.ts`
- `/Users/antvibe/Documents/Dev/cert-exam-lab-local/src/compatibility.ts`

Foundation materials are saved under
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/gh-600/1.0.0/` and
`/Users/antvibe/Documents/Dev/cert-exam-lab-local/packs/ai-103/1.0.0/`.
Original GH-600 files were retained. No imports, question authoring, audit,
provider generation, commit, push, or deployment occurred during this partial work.

Next priority: **question generation and content review using the 1.1.0 evidence
packets**, followed by import and presentation in the app. Resolve partial
objectives only as needed for question scope. Session 2A remains paused.
No application code changed during KB1–KB5; all
76 pre-research baseline files and 21 original GH-600 artifacts retain their hashes.

## Session 2A completion update

Andrew lifted the implementation pause. Session 2A is now complete; the pause
checkpoint above records the earlier boundary. `runtime-manifest.json` and two
local author/review prompts were added beside revision 1.1.0's immutable research
snapshot. Its original manifest, notes, packets and all 154 original files remain
unchanged. The new runtime resolves ready objective bullets and captured source
IDs/hashes; the eight partial objectives remain excluded from import.

See `docs/SESSION-2A-CLOSEOUT.md` for implementation/verification and
`docs/OFFLINE-IMPORT.md` for the package contract. Session 2B app/PDF presentation
and Session 3 question generation/manual content review remain pending.
