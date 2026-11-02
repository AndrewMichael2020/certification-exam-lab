import { z } from "zod";
import { ASSESSED_PLANNING_VERSION, buildAssessedBlueprint, buildBlueprint } from "./blueprint.js";
import { contentHash, packRefSchema, resolvePack, samePack, type ExamPack } from "./packs.js";
import type { CaseStudy, GenerationPlan, PracticeQuestion } from "./types.js";

export const identifierSchema = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/);
const text = z.string().trim().min(1);
const timestamp = z.iso.datetime({ offset: true });
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const artifact = z.object({ title: text, kind: z.enum(["yaml", "json", "markdown", "log", "policy", "pr_diff", "workflow_output", "terminal_output"]), content: text }).strict();
export const importedQuestionSchema = z.object({
  id: identifierSchema, pack: packRefSchema, revision: text, examCode: text,
  domainId: text, domainName: text, objectiveTags: z.array(text).min(1),
  type: z.enum(["single_choice", "multi_select", "sequence_order", "matching_magnet", "dropdown_completion", "case_study_child", "code_or_config_artifact", "log_or_artifact_interpretation", "policy_control_selection"]),
  difficulty: z.enum(["easy", "medium", "hard", "very_hard"]), stem: z.string().min(5), scenario: text.optional(),
  artifact: artifact.optional(), caseStudyId: identifierSchema.optional(),
  options: z.array(z.object({ id: text, text }).strict()).min(2),
  matchChoices: z.array(text).min(2).optional(), statementTemplate: text.optional(),
  slots: z.array(z.object({ id: identifierSchema, choices: z.array(text).min(2) }).strict()).min(1).optional(),
  correctAnswer: z.union([text, z.array(text).min(1), z.object({ order: z.array(text).min(1) }).strict(), z.object({ pairs: z.record(text, text) }).strict()]),
  explanation: z.object({ whyCorrect: text, whyDistractorsWrong: z.record(text, text), examStrategyNote: text.optional() }).strict(),
  sourceRefs: z.array(z.object({ sourceId: text, snapshotSha256: hash, title: text, url: z.url(),
    repo: text.optional(), docType: z.enum(["official_docs", "official_repo", "study_guide", "github_docs", "microsoft_learn"]) }).strict()).min(1),
  metadata: z.object({ generatedAt: timestamp, model: text, reasoningEffort: text, batchId: identifierSchema,
    validationStatus: z.enum(["draft", "validated", "needs_review", "rejected"]),
    correctOptionLengthRank: z.enum(["shortest", "middle", "longest"]).optional(), ambiguityScore: z.number().min(0).max(1).optional() }).strict(),
}).strict();
export const caseStudySchema = z.object({ id: identifierSchema, title: text, intro: text,
  sections: z.array(z.object({ heading: text, body: text }).strict()).min(1),
  artifacts: z.array(artifact).optional(), questionIds: z.array(identifierSchema).min(1) }).strict();
export const reviewSchema = z.object({ itemId: identifierSchema, itemSha256: hash,
  verdict: z.enum(["accept", "revise", "reject", "unverifiable"]), reviewer: text, reviewedAt: timestamp,
  sourceIds: z.array(text).min(1), rationale: text }).strict();
export const provenanceSchema = z.object({ route: z.enum(["codex-subscription", "synthetic-fixture"]),
  model: text, reasoningEffort: text, authoredAt: timestamp }).strict();

// Compare the full JSON plan with the server planner; no client paths/registries survive.
export const importPackageSchema = z.object({ schemaVersion: z.literal(1), id: identifierSchema, revision: text,
  pack: packRefSchema, plan: z.custom<GenerationPlan>(), provenance: provenanceSchema,
  status: z.enum(["synthetic", "released"]), questions: z.array(importedQuestionSchema).min(1).max(200),
  caseStudies: z.array(caseStudySchema).default([]), reviews: z.array(reviewSchema).default([]) }).strict();
export type ImportPackage = z.infer<typeof importPackageSchema>;

export function requireInvariant(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}
export function unique(values: string[], label: string) {
  requireInvariant(new Set(values).size === values.length, `Duplicate ${label}`);
}
const equalMembers = (a: string[], b: string[]) => a.length === b.length && a.every(v => b.includes(v));

/** A shared case is part of every child's reviewable revision. */
export function itemRevisionHash(question: PracticeQuestion, cases: CaseStudy[]): string {
  if (!question.caseStudyId) return contentHash(question);
  const parent = cases.find(c => c.id === question.caseStudyId);
  requireInvariant(parent, `Missing case-study parent: ${question.caseStudyId}`);
  return contentHash({ question, caseStudy: parent });
}

/** Checks mechanics only. Passing this never implies semantic answer/source review. */
export function validateQuestion(q: PracticeQuestion, ref: ImportPackage["pack"], pack: ExamPack = resolvePack(ref)): void {
  requireInvariant(samePack(q.pack, ref) && q.examCode === pack.examCode, `Question ${q.id}: pack/exam identity mismatch`);
  const domain = pack.domains.find(d => d.id === q.domainId);
  requireInvariant(domain && domain.name === q.domainName, `Question ${q.id}: domain mismatch`);
  unique(q.objectiveTags, "objective tags");
  for (const id of q.objectiveTags) {
    const objective = domain.objectives.find(o => o.id === id);
    requireInvariant(objective && objective.status !== "partial", `Question ${q.id}: unknown or partial objective ${id}`);
    requireInvariant(q.sourceRefs.some(s => {
      const source = pack.sources.find(p => p.id === s.sourceId);
      return source && (!source.objectiveIds || source.objectiveIds.includes(id));
    }), `Question ${q.id}: no mapped source for objective ${id}`);
  }
  requireInvariant(pack.supportedFormats.includes(q.type), `Unsupported format ${q.type}`);
  unique(q.sourceRefs.map(s => s.sourceId!), "source references");
  for (const source of q.sourceRefs) {
    const registered = pack.sources.find(s => s.id === source.sourceId);
    requireInvariant(registered && source.url === registered.url && source.title === registered.title && source.snapshotSha256 === registered.sha256,
      `Question ${q.id}: unregistered source URL/title/snapshot`);
  }
  const ids = q.options.map(o => o.id);
  unique(ids, "option IDs"); unique(q.options.map(o => o.text.trim().toLowerCase()), "option text");
  const answer = q.correctAnswer;
  if (q.type === "multi_select") {
    requireInvariant(Array.isArray(answer) && answer.length >= 2 && answer.length < ids.length && answer.every(id => ids.includes(id)), `Question ${q.id}: invalid multi-select answer`);
    unique(answer, "answer references");
  } else if (q.type === "sequence_order") {
    requireInvariant(typeof answer === "object" && !Array.isArray(answer) && "order" in answer && equalMembers(answer.order, ids), `Question ${q.id}: invalid sequence answer`);
    unique(answer.order, "sequence references");
  } else if (q.type === "matching_magnet" || q.type === "dropdown_completion") {
    requireInvariant(typeof answer === "object" && !Array.isArray(answer) && "pairs" in answer, `Question ${q.id}: missing pairs answer`);
    if (q.type === "matching_magnet") {
      requireInvariant(q.matchChoices && equalMembers(Object.keys(answer.pairs), ids) && Object.values(answer.pairs).every(v => q.matchChoices!.includes(v)), `Question ${q.id}: invalid matching references`);
      unique(q.matchChoices, "matching choices");
    } else {
      requireInvariant(q.slots && q.statementTemplate, `Question ${q.id}: missing dropdown slots/template`);
      unique(q.slots.map(s => s.id), "slot IDs");
      const placeholders = [...q.statementTemplate.matchAll(/\{\{([^{}]+)\}\}/g)].map(m => m[1]);
      requireInvariant(equalMembers(Object.keys(answer.pairs), q.slots.map(s => s.id)) && equalMembers(placeholders, q.slots.map(s => s.id)) && q.slots.every(s => s.choices.includes(answer.pairs[s.id])), `Question ${q.id}: invalid dropdown references`);
      q.slots.forEach(s => unique(s.choices, "slot choices"));
    }
  } else requireInvariant(typeof answer === "string" && ids.includes(answer), `Question ${q.id}: invalid single answer reference`);
  requireInvariant((q.type === "case_study_child") === Boolean(q.caseStudyId), `Question ${q.id}: invalid case-study link`);
  if (q.type === "code_or_config_artifact" || q.type === "log_or_artifact_interpretation") requireInvariant(q.artifact, `Question ${q.id}: missing artifact`);
  const why = q.explanation.whyDistractorsWrong;
  if (typeof answer === "string" || Array.isArray(answer)) {
    const correct = typeof answer === "string" ? [answer] : answer;
    requireInvariant(equalMembers(Object.keys(why), ids.filter(id => !correct.includes(id))), `Question ${q.id}: missing or unknown distractor explanations`);
  } else {
    // Structured items explain each row/step/slot in addition to the overall key.
    const keys = "order" in answer ? ids : Object.keys(answer.pairs);
    requireInvariant(equalMembers(Object.keys(why), keys), `Question ${q.id}: missing structured answer explanations`);
  }
}

export function validateAssembly(plan: GenerationPlan, questions: PracticeQuestion[], cases: CaseStudy[]): void {
  requireInvariant(plan?.pack, "Explicit plan pack is required");
  const expected = plan.planningVersion === ASSESSED_PLANNING_VERSION
    ? buildAssessedBlueprint(plan.totalQuestions, plan.pack, plan.difficulty)
    : buildBlueprint(plan.totalQuestions, plan.pack);
  const pack = resolvePack(plan.pack);
  requireInvariant(contentHash(plan) === contentHash(expected), "Plan differs from registered pack planner");
  requireInvariant(questions.length === plan.totalQuestions, "Incomplete exam: question count mismatch");
  unique(questions.map(q => q.id), "question IDs");
  unique(questions.map(q => q.stem.trim().replace(/\s+/g, " ").toLowerCase()), "question stems");
  for (const q of questions) validateQuestion(importedQuestionSchema.parse(q), plan.pack, pack);
  for (const d of plan.domains) requireInvariant(questions.filter(q => q.domainId === d.id).length === d.count, `Domain quota mismatch: ${d.id}`);
  for (const [difficulty, count] of Object.entries(plan.difficulty)) requireInvariant(questions.filter(q => q.difficulty === difficulty).length === count, `Difficulty quota mismatch: ${difficulty}`);
  const formatGroup = (q: PracticeQuestion) => q.type === "case_study_child" ? "case_study"
    : ["dropdown_completion", "log_or_artifact_interpretation", "policy_control_selection"].includes(q.type) ? "single_choice" : q.type;
  for (const [format, count] of Object.entries(plan.itemTypes)) requireInvariant(questions.filter(q => formatGroup(q) === format).length === count, `Format quota mismatch: ${format}`);
  for (const batch of plan.batches) {
    const items = questions.filter(q => q.metadata.batchId === batch.id);
    requireInvariant(items.length === batch.questionCount && items.every(q => q.domainId === batch.domainId && batch.typeFocus.includes(formatGroup(q) as keyof GenerationPlan["itemTypes"]) && q.caseStudyId === batch.caseStudyId), `Batch quota/link mismatch: ${batch.id}`);
  }
  requireInvariant(questions.every(q => plan.batches.some(b => b.id === q.metadata.batchId)), "Unknown batch identity");
  unique(cases.map(c => c.id), "case IDs");
  requireInvariant(cases.length === plan.caseStudyCount, "Case-study count mismatch");
  for (const c of cases) {
    caseStudySchema.parse(c); unique(c.questionIds, "case question IDs");
    requireInvariant(equalMembers(c.questionIds, questions.filter(q => q.caseStudyId === c.id).map(q => q.id)), `Case links mismatch: ${c.id}`);
  }
  requireInvariant(questions.every(q => !q.caseStudyId || cases.some(c => c.id === q.caseStudyId)), "Missing case-study parent");
}

export function validateImport(input: unknown): ImportPackage {
  const draft = importPackageSchema.parse(input);
  requireInvariant(samePack(draft.pack, draft.plan?.pack), "Package/plan pack mismatch");
  validateAssembly(draft.plan, draft.questions, draft.caseStudies);
  requireInvariant((draft.status === "synthetic") === (draft.provenance.route === "synthetic-fixture"), "Synthetic status/provenance mismatch");
  for (const q of draft.questions) {
    requireInvariant(q.metadata.validationStatus === "validated", `Item ${q.id} is unresolved/draft`);
    requireInvariant(q.metadata.model === draft.provenance.model && q.metadata.reasoningEffort === draft.provenance.reasoningEffort && Date.parse(q.metadata.generatedAt) <= Date.parse(draft.provenance.authoredAt), `Item ${q.id}: authoring provenance mismatch`);
  }
  unique(draft.reviews.map(r => r.itemId), "review item IDs");
  for (const review of draft.reviews) {
    const q = draft.questions.find(q => q.id === review.itemId);
    requireInvariant(q && review.itemSha256 === itemRevisionHash(q, draft.caseStudies), `Stale/unknown review: ${review.itemId}`);
    requireInvariant(review.verdict === "accept" && Date.parse(review.reviewedAt) >= Date.parse(q.metadata.generatedAt), `Unresolved review: ${review.itemId}`);
    unique(review.sourceIds, "review source IDs");
    requireInvariant(equalMembers(review.sourceIds, q.sourceRefs.map(s => s.sourceId)), `Review source mismatch: ${q.id}`);
  }
  if (draft.status === "released") requireInvariant(draft.reviews.length === draft.questions.length, "Release requires accepted review of every exact item revision");
  return draft;
}
