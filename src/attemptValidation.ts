import { z } from "zod";
import { contentHash, samePack } from "./packs.js";
import { identifierSchema, requireInvariant, unique } from "./importValidation.js";
import { scoreAttempt } from "./scoring.js";
import type { Attempt, ExamSet } from "./types.js";

export const attemptInputSchema = z.object({ examId: identifierSchema,
  answers: z.record(z.string(), z.unknown()),
  confidence: z.record(z.string(), z.enum(["guessed", "somewhat_confident", "confident"])).default({}),
  flagged: z.array(z.string()).default([]) }).strict();

export function validateAttemptInput(exam: ExamSet, input: z.infer<typeof attemptInputSchema>): void {
  requireInvariant(input.examId === exam.id, "Attempt exam identity mismatch");
  const ids = new Set(exam.questions.map(q => q.id));
  requireInvariant([...Object.keys(input.answers), ...Object.keys(input.confidence), ...input.flagged].every(id => ids.has(id)), "Attempt contains foreign question IDs");
  unique(input.flagged, "flagged question IDs");
  for (const [id, answer] of Object.entries(input.answers)) {
    const q = exam.questions.find(q => q.id === id)!;
    const options = q.options.map(o => o.id);
    if (q.type === "multi_select") {
      requireInvariant(Array.isArray(answer) && answer.every(v => typeof v === "string" && options.includes(v)), "Invalid submitted multi-select references"); unique(answer, "submitted references");
    } else if (q.type === "sequence_order") {
      const parsed = z.object({ order: z.array(z.string()) }).strict().parse(answer);
      unique(parsed.order, "submitted sequence"); requireInvariant(parsed.order.every(v => options.includes(v)), "Invalid submitted sequence references");
    } else if (q.type === "matching_magnet" || q.type === "dropdown_completion") {
      const parsed = z.object({ pairs: z.record(z.string(), z.string()) }).strict().parse(answer);
      for (const [key, value] of Object.entries(parsed.pairs)) {
        const choices = q.type === "matching_magnet" ? (options.includes(key) ? q.matchChoices : undefined) : q.slots?.find(s => s.id === key)?.choices;
        requireInvariant(choices && (!value || choices.includes(value)), "Invalid submitted pairs references");
      }
    } else requireInvariant(typeof answer === "string" && (!answer || options.includes(answer)), "Invalid submitted answer reference");
  }
}

export function validateStoredAttempt(attempt: Attempt, exam: ExamSet): Attempt {
  identifierSchema.parse(attempt.id);
  z.iso.datetime({ offset: true }).parse(attempt.createdAt);
  const input = attemptInputSchema.parse({ examId: attempt.examId, answers: attempt.answers, confidence: attempt.confidence, flagged: attempt.flagged });
  validateAttemptInput(exam, input);
  requireInvariant(samePack(attempt.pack, exam.pack) && attempt.examSha256 === contentHash(exam), "Attempt pack/exam hash mismatch");
  requireInvariant(contentHash(attempt.score) === contentHash(scoreAttempt(exam.questions, attempt.answers)), "Attempt score integrity mismatch");
  return attempt;
}
