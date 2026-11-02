import { buildBlueprint } from "../../src/blueprint.js";
import { CURRENT_AI103, resolvePack } from "../../src/packs.js";
import type { PackRef } from "../../src/types.js";
import type { ImportPackage } from "../../src/importValidation.js";

/** Mechanics-only synthetic content, never exam preparation evidence. */
export function syntheticPackage(ref: PackRef = CURRENT_AI103, count = 30, id = `synthetic-${ref.id}`): ImportPackage {
  ref = { ...ref };
  const pack = resolvePack(ref);
  const plan = buildBlueprint(count, ref);
  const difficulties = Object.entries(plan.difficulty).flatMap(([difficulty, n]) => Array(n).fill(difficulty));
  const questions: ImportPackage["questions"] = [];
  const caseStudies: ImportPackage["caseStudies"] = [];
  for (const batch of plan.batches) {
    const domain = pack.domains.find(d => d.id === batch.domainId)!;
    const objective = domain.objectives.find(o => o.status !== "partial")!;
    const source = pack.sources.find(s => !s.objectiveIds || s.objectiveIds.includes(objective.id))!;
    for (let i = 0; i < batch.questionCount; i++) {
      const type = batch.typeFocus[0] === "case_study" ? "case_study_child" : batch.typeFocus[0];
      const options = [{ id: "A", text: "Synthetic first option" }, { id: "B", text: "Synthetic second option" }, { id: "C", text: "Synthetic third option" }];
      const structured = type === "sequence_order" || type === "matching_magnet";
      const q: ImportPackage["questions"][number] = {
        id: `${id}-q${questions.length + 1}`, pack: ref, revision: "1", examCode: pack.examCode,
        domainId: domain.id, domainName: domain.name, objectiveTags: [objective.id], type,
        difficulty: difficulties[questions.length], stem: `Synthetic mechanics item ${questions.length + 1} for ${id}.`,
        options, correctAnswer: type === "multi_select" ? ["A", "B"] : type === "sequence_order" ? { order: ["A", "B", "C"] }
          : type === "matching_magnet" ? { pairs: { A: "One", B: "Two", C: "Three" } } : "A",
        ...(type === "matching_magnet" ? { matchChoices: ["One", "Two", "Three"] } : {}),
        ...(type === "case_study_child" ? { caseStudyId: batch.caseStudyId } : {}),
        ...(type === "code_or_config_artifact" ? { artifact: { title: "Synthetic JSON", kind: "json", content: '{"synthetic":true}' } } : {}),
        explanation: { whyCorrect: "Synthetic correct-answer explanation; mechanics only.", whyDistractorsWrong: Object.fromEntries((structured ? ["A", "B", "C"] : type === "multi_select" ? ["C"] : ["B", "C"]).map(k => [k, "Synthetic explanation; no substantive exam claim."])) },
        sourceRefs: [{ sourceId: source.id, title: source.title, url: source.url, snapshotSha256: source.sha256, docType: "official_docs" }],
        metadata: { generatedAt: "2026-10-07T20:00:00Z", model: "synthetic-ci", reasoningEffort: "none", batchId: batch.id, validationStatus: "validated" },
      };
      questions.push(q);
    }
    if (batch.caseStudyId) caseStudies.push({ id: batch.caseStudyId, title: "Synthetic case", intro: "Mechanics only.", sections: [{ heading: "Context", body: "Synthetic public test content." }], questionIds: questions.filter(q => q.caseStudyId === batch.caseStudyId).map(q => q.id) });
  }
  // These formats share the choice-item practice quota, and retain their batch IDs.
  const singles = questions.filter(q => q.type === "single_choice");
  if (singles.length >= 3) {
    Object.assign(singles[0], { type: "dropdown_completion", statementTemplate: "Synthetic {{slot1}} statement.", slots: [{ id: "slot1", choices: ["One", "Two"] }], correctAnswer: { pairs: { slot1: "One" } }, explanation: { whyCorrect: "Synthetic key explanation.", whyDistractorsWrong: { slot1: "Synthetic slot explanation." } } });
    Object.assign(singles[1], { type: "log_or_artifact_interpretation", artifact: { title: "Synthetic log", kind: "log", content: "Synthetic test log." } });
    singles[2].type = "policy_control_selection";
  }
  return { schemaVersion: 1, id, revision: "1", pack: ref, plan,
    provenance: { route: "synthetic-fixture", model: "synthetic-ci", reasoningEffort: "none", authoredAt: "2026-10-07T20:00:00Z" },
    status: "synthetic", questions, caseStudies, reviews: [] };
}
