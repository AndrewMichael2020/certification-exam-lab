import { computeAntiBias } from "./antiBias.js";
import { contentHash, resolvePack } from "./packs.js";
import { itemRevisionHash, requireInvariant, validateImport } from "./importValidation.js";
import type { ExamSet, ImportedExamSet, PackGenerationPlan } from "./types.js";

/** Deterministic offline assembly preserves the exact reviewed item content/order. */
export function assembleImportedExam(input: unknown): ImportedExamSet {
  const draft = validateImport(input);
  const pack = resolvePack(draft.pack);
  return {
    id: draft.id, pack: draft.pack, createdAt: draft.provenance.authoredAt,
    plan: draft.plan as PackGenerationPlan, questions: draft.questions, caseStudies: draft.caseStudies,
    antiBias: computeAntiBias(draft.questions),
    release: { packageId: draft.id, revision: draft.revision, packageSha256: contentHash(draft),
      manifestSha256: pack.manifestSha256, assetSha256: pack.assets,
      itemSha256: Object.fromEntries(draft.questions.map(q => [q.id, itemRevisionHash(q, draft.caseStudies)])),
      provenance: draft.provenance, reviews: draft.reviews, status: draft.status },
  };
}

/** Used on writes AND reads so changed files cannot silently keep a valid release. */
export function validateStoredExam(exam: ExamSet): ImportedExamSet {
  requireInvariant(exam.release && !exam.compatibility, "New storage requires an imported release manifest; legacy records are read-only");
  const expected = assembleImportedExam({ schemaVersion: 1, id: exam.id, revision: exam.release.revision,
    pack: exam.pack, plan: exam.plan, questions: exam.questions, caseStudies: exam.caseStudies,
    provenance: exam.release.provenance, reviews: exam.release.reviews, status: exam.release.status });
  requireInvariant(contentHash(exam) === contentHash(expected), "Stored exam/release integrity mismatch");
  return expected;
}
