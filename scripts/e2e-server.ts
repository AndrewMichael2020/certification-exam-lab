import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { ExamSet, PracticeQuestion } from "../src/types.js";

// Only this process owns this store. Never seed the user's configured data root.
const root = fs.mkdtempSync(path.join(os.tmpdir(), "cert-e2e-"));
process.env.EXAM_DATA_ROOT = root;
process.env.STUDY_OFFLINE = "1";
process.env.HOST = "127.0.0.1";
process.env.REQUESTS_PER_MINUTE = "1000"; // Browser/PDF regression suite shares one loopback client.
delete process.env.OPENAI_API_KEY;
delete process.env.GCS_BUCKET;
fs.mkdirSync(path.join(root, "exams"));
const originals: ExamSet[] = JSON.parse(fs.readFileSync("data/exams/exams.json", "utf8"));
const types: PracticeQuestion["type"][] = ["single_choice", "multi_select", "sequence_order", "matching_magnet", "dropdown_completion", "case_study_child", "code_or_config_artifact", "log_or_artifact_interpretation", "policy_control_selection"];
const questions: PracticeQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const type = types[i % types.length];
  return {
    id: `ci-question-${i + 1}`, examCode: "GH-600", domainId: "ABCDEF"[i % 6],
    domainName: "Synthetic CI domain", objectiveTags: ["ci-mechanics"], type,
    difficulty: "medium", stem: `Synthetic CI item ${i + 1}: ${type === "multi_select" ? "Select TWO options." : "Choose an option."}`,
    options: [{ id: "A", text: "Synthetic option one" }, { id: "B", text: "Synthetic option two" }, { id: "C", text: "Synthetic option three" }],
    correctAnswer: type === "sequence_order" ? { order: ["A", "B", "C"] }
      : type === "matching_magnet" ? { pairs: { A: "Choice one", B: "Choice two", C: "Choice three" } }
      : type === "dropdown_completion" ? { pairs: { slot1: "Choice one" } }
      : type === "multi_select" ? ["A", "B"] : "A",
    ...(type === "matching_magnet" ? { matchChoices: ["Choice one", "Choice two", "Choice three"] } : {}),
    ...(type === "dropdown_completion" ? { statementTemplate: "Synthetic statement {{slot1}}.", slots: [{ id: "slot1", choices: ["Choice one", "Choice two"] }] } : {}),
    ...(type === "case_study_child" ? { caseStudyId: "ci-case" } : {}),
    ...(type === "code_or_config_artifact" || type === "log_or_artifact_interpretation" ? { artifact: { title: "Synthetic configuration", kind: "json" as const, content: '{"synthetic": true}' } } : {}),
    explanation: { whyCorrect: "Synthetic explanation for testing mechanics only.", whyDistractorsWrong: { B: "Synthetic distractor explanation.", C: "Synthetic distractor explanation." } },
    sourceRefs: [], metadata: { generatedAt: "2026-01-01T00:00:00Z", model: "synthetic-ci", reasoningEffort: "none", batchId: "ci", validationStatus: "validated" },
  };
});
const fixture: ExamSet = {
  ...originals[0], id: "ci-gh600-fixture", createdAt: "2026-01-01T00:00:00Z",
  questions, caseStudies: [{ id: "ci-case", title: "Synthetic CI case", intro: "Mechanics only.", sections: [{ heading: "Overview", body: "Synthetic case context." }], questionIds: questions.filter(q => q.caseStudyId).map(q => q.id) }],
};
fs.writeFileSync(path.join(root, "exams", "exams.json"), JSON.stringify([fixture, ...originals]));
fs.copyFileSync("data/published.json", path.join(root, "published.json"));
for (const name of fs.readdirSync("data/exams")) {
  if (name.endsWith(".pdf")) fs.copyFileSync(path.join("data/exams", name), path.join(root, "exams", name));
}
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => { fs.rmSync(root, { recursive: true, force: true }); process.exit(0); });
}
await import("../src/server.js");
