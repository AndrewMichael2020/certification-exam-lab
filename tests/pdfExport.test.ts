import { expect, it } from "vitest";
import { assembleImportedExam } from "../src/importer.js";
import { syntheticPackage } from "./fixtures/importPackage.js";
import { CURRENT_AI103, CURRENT_GH600 } from "../src/packs.js";
import { buildExamHtml, examPdfStem, legacyPdfStem, pdfLocation } from "../src/pdfExport.js";
import { packCatalog } from "../src/presentation.js";

it("exports each pack with explicit identity, immutable exam lineage and captured sources", () => {
  for (const ref of [CURRENT_AI103, CURRENT_GH600]) {
    const exam = assembleImportedExam(syntheticPackage(ref));
    const html = buildExamHtml(exam);
    expect(html).toContain(`${ref.id.toUpperCase()} - v1.1.0`);
    expect(html).toContain(exam.id);
    expect(html).toContain("Synthetic mechanics fixture - not study material");
    expect(html).toContain("Snapshot SHA-256");
    expect(html).toContain(exam.questions[0].sourceRefs[0].url);
    expect(html).toContain("Quick Answer Key");
    const location = pdfLocation(exam);
    expect(location.localDir).toContain(`/packs/${ref.id}/exports`);
    expect(examPdfStem(exam)).toContain(exam.id);
    expect(examPdfStem(exam)).not.toEqual(legacyPdfStem(exam));
    expect(new Set(["practice", "questions", "answers"].map(kind => examPdfStem(exam, kind as any))).size).toBe(3);
  }
});
it("question-only exports hide every format's keys and explanations", () => {
  const exam = assembleImportedExam(syntheticPackage());
  const paper = buildExamHtml(exam, "questions");
  expect(paper).not.toContain('class="opt correct"');
  expect(paper).not.toContain('class="explanation"');
  expect(paper).not.toContain("Quick Answer Key");
  expect(paper).not.toContain("Correct order:");
  expect(paper).not.toContain("Correct matches:");
  expect(paper).not.toContain('class="dc-answer"');
  expect(paper).toContain("Match: __________");
  expect(paper).toContain("[__________]");
  const answers = buildExamHtml(exam, "answers");
  expect(answers).toContain("Answer review");
  expect(answers).toContain('class="opt correct"');
  expect(answers).toContain('class="explanation"');
});
it("catalog publishes practice policy without filesystem or source assets", () => {
  const catalog = packCatalog();
  expect(catalog.find(p => p.id === "gh-600" && p.version === "1.0.0")?.canPlan).toBe(false);
  expect(catalog.find(p => p.id === "ai-103")?.partialObjectiveCount).toBe(8);
  expect(JSON.stringify(catalog)).not.toContain("sources/snapshots");
  expect(JSON.stringify(catalog)).not.toContain("root");
});
