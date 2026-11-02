import type { Attempt, ExamSet } from "./types.js";
import { LEGACY_GH600, samePack } from "./packs.js";

/** Call only for records read from the old arrays, never for new requests. */
export function adaptLegacyExam(value: ExamSet): ExamSet {
  if (value.pack || value.plan?.pack || !Array.isArray(value.questions) || !value.questions.length || value.questions.some(q => q.examCode !== "GH-600" || q.pack)) {
    throw new Error(`Legacy exam ${value.id ?? "unknown"} has mixed, unknown, or explicit pack identity`);
  }
  return { ...value, pack: { ...LEGACY_GH600 }, compatibility: "legacy-gh-600",
    plan: { ...value.plan, pack: { ...LEGACY_GH600 } },
    questions: value.questions.map(q => ({ ...q, pack: { ...LEGACY_GH600 } })) };
}
export function adaptLegacyAttempt(value: Attempt, exam: ExamSet): Attempt {
  if (value.pack || value.examSha256 || value.examId !== exam.id || exam.compatibility !== "legacy-gh-600" || !samePack(exam.pack, LEGACY_GH600)) throw new Error("Legacy attempt does not match a historical GH-600 exam");
  return { ...value, pack: { ...LEGACY_GH600 } };
}
