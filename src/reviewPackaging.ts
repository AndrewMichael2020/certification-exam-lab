import { importPackageSchema, itemRevisionHash, requireInvariant } from "./importValidation.js";
import { assembleImportedExam } from "./importer.js";
import { contentHash, samePack } from "./packs.js";
import { z } from "zod";

const auditSchema = z.object({
  templateOnly: z.literal(false), packetId: z.string().min(1), packageId: z.string(), revision: z.string(),
  pack: z.object({ id: z.string(), version: z.string() }), draftPackageSha256: z.string(),
  reviewer: z.object({ actualModelLabel: z.string().trim().min(1), visibleModeIfAny: z.string().nullable(), reviewedAtUtc: z.iso.datetime({ offset: true }) }),
  items: z.array(z.object({ itemId: z.string(), itemRevision: z.string(), itemSha256: z.string(),
    sourceIds: z.array(z.string()), blindAnswer: z.unknown().refine(v => v !== null && v !== undefined, "Blind answer required"),
    finalProposedAnswer: z.unknown(), verdict: z.literal("accept"), rationale: z.string().trim().min(1),
    sourceEvidence: z.array(z.object({ sourceId: z.string(), lines: z.string().min(1), supports: z.string().min(1) })).min(1),
  })),
});

function normalizedAnswer(answer: unknown, key: unknown): unknown {
  if (Array.isArray(key) && Array.isArray(answer)) return [...answer].sort();
  if (key && typeof key === "object" && "pairs" in key && answer && typeof answer === "object" && !("pairs" in answer)) return { pairs: answer };
  return answer;
}

/** Converts a supplied exact-revision accepted audit; never manufactures acceptance. */
export function packageReviewedDraft(draftInput: unknown, auditInput: unknown) {
  const draft = importPackageSchema.extend({ status: z.literal("draft") }).parse(draftInput);
  requireInvariant(draft.reviews.length === 0, "Draft must not contain pre-filled acceptance records");
  const audit = auditSchema.parse(auditInput);
  requireInvariant(audit.packageId === draft.id && audit.revision === draft.revision && samePack(audit.pack, draft.pack), "Audit package identity mismatch");
  requireInvariant(audit.draftPackageSha256 === contentHash(draft), "Audit draft hash mismatch");
  requireInvariant(audit.items.length === draft.questions.length && new Set(audit.items.map(i => i.itemId)).size === audit.items.length, "Audit must cover every item exactly once");
  const reviews = draft.questions.map(q => {
    const item = audit.items.find(i => i.itemId === q.id);
    requireInvariant(item && item.itemRevision === q.revision && item.itemSha256 === itemRevisionHash(q, draft.caseStudies), `Stale or missing audit item: ${q.id}`);
    const key = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : q.correctAnswer;
    requireInvariant(contentHash(normalizedAnswer(item.finalProposedAnswer, key)) === contentHash(key), `Proposed answer differs from key: ${q.id}`);
    requireInvariant(item.sourceEvidence.every(e => item.sourceIds.includes(e.sourceId)) && item.sourceIds.every(id => item.sourceEvidence.some(e => e.sourceId === id)), `Missing/foreign evidence: ${q.id}`);
    return { itemId: q.id, itemSha256: item.itemSha256, verdict: "accept" as const,
      reviewer: audit.reviewer.actualModelLabel, reviewedAt: audit.reviewer.reviewedAtUtc,
      sourceIds: item.sourceIds, rationale: item.rationale };
  });
  const candidate = { ...draft, status: "released" as const, reviews };
  const exam = assembleImportedExam(candidate);
  return { package: candidate, exam, audit: { packetId: audit.packetId, reviewer: audit.reviewer, draftPackageSha256: audit.draftPackageSha256 } };
}
