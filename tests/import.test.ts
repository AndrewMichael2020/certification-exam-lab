import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync, cpSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { buildBlueprint } from "../src/blueprint.js";
import { assembleImportedExam, validateStoredExam } from "../src/importer.js";
import { importedQuestionSchema, itemRevisionHash, validateQuestion } from "../src/importValidation.js";
import { adaptLegacyExam } from "../src/compatibility.js";
import { contentHash, CURRENT_AI103, CURRENT_GH600, LEGACY_GH600, resolvePack, readPackMaterial } from "../src/packs.js";
import { syntheticPackage } from "./fixtures/importPackage.js";

for (const ref of [CURRENT_AI103, CURRENT_GH600]) describe(`${ref.id} exact planning/assembly`, () => {
  for (const count of [1, 10, 20, 25, 30, 50, 70, 100, 200]) it(`assembles exactly ${count} items with domain/type/difficulty/batch quotas`, () => {
    const draft = syntheticPackage(ref, count);
    const exam = assembleImportedExam(draft);
    expect(exam.questions).toHaveLength(count);
    expect(exam.plan.batches.reduce((n, b) => n + b.questionCount, 0)).toBe(count);
    for (const d of exam.plan.domains) expect(exam.plan.batches.filter(b => b.domainId === d.id).reduce((n, b) => n + b.questionCount, 0)).toBe(d.count);
    expect(validateStoredExam(exam)).toEqual(exam);
    expect(exam.questions).toEqual(draft.questions);
  });
});

it("accepts all nine supported formats and rejects broken answer references for each", () => {
  const draft = syntheticPackage();
  expect(new Set(draft.questions.map(q => q.type)).size).toBe(9);
  for (const type of new Set(draft.questions.map(q => q.type))) {
    const q = structuredClone(draft.questions.find(q => q.type === type)!);
    validateQuestion(importedQuestionSchema.parse(q), draft.pack);
    q.correctAnswer = type === "sequence_order" ? { order: ["A", "A", "C"] }
      : type === "matching_magnet" || type === "dropdown_completion" ? { pairs: { foreign: "Unknown" } }
      : type === "multi_select" ? ["A", "A"] : "foreign";
    expect(() => validateQuestion(q, draft.pack), type).toThrow();
  }
});

const badChanges: Array<[string, (d: ReturnType<typeof syntheticPackage>) => void]> = [
  ["missing pack", d => { delete (d as any).pack; }],
  ["unknown pack", d => { d.pack.version = "99.0.0"; }],
  ["plan mismatch", d => { d.plan.totalQuestions++; }],
  ["mixed pack", d => { d.questions[0].pack = CURRENT_GH600; }],
  ["unknown exam code", d => { d.questions[0].examCode = "GH-600"; }],
  ["invalid format", d => { (d.questions[0] as any).type = "essay"; }],
  ["unknown objective", d => { d.questions[0].objectiveTags = ["unknown"]; }],
  ["partial objective", d => { const q = d.questions.find(q => q.domainId === "A")!; q.objectiveTags = ["AI103-A1.01"]; }],
  ["missing source", d => { d.questions[0].sourceRefs = []; }],
  ["unregistered URL", d => { d.questions[0].sourceRefs[0].url = "https://example.com"; }],
  ["stale source hash", d => { d.questions[0].sourceRefs[0].snapshotSha256 = "0".repeat(64); }],
  ["wrong source objective", d => { const s = resolvePack(d.pack).sources[0]; d.questions[0].sourceRefs = [{ sourceId: s.id, title: s.title, url: s.url, snapshotSha256: s.sha256, docType: "official_docs" }]; }],
  ["duplicate IDs", d => { d.questions[1].id = d.questions[0].id; }],
  ["duplicate stems", d => { d.questions[1].stem = `  ${d.questions[0].stem.toUpperCase()}  `; }],
  ["missing question", d => { d.questions.pop(); }],
  ["wrong domain", d => { d.questions[0].domainId = "Z"; }],
  ["wrong batch", d => { d.questions[0].metadata.batchId = "missing"; }],
  ["wrong difficulty quota", d => { d.questions[0].difficulty = d.questions[0].difficulty === "hard" ? "medium" : "hard"; }],
  ["missing case", d => { d.caseStudies.pop(); }],
  ["bad case link", d => { d.caseStudies[0].questionIds = ["missing"]; }],
  ["draft item", d => { d.questions[0].metadata.validationStatus = "draft"; }],
  ["unresolved item", d => { d.questions[0].metadata.validationStatus = "needs_review"; }],
  ["missing explanations", d => { d.questions[0].explanation.whyDistractorsWrong = {}; }],
  ["invented provenance", d => { d.provenance.model = "other"; }],
  ["client path", d => { (d as any).root = "/tmp"; }],
];
for (const [label, mutate] of badChanges) it(`rejects ${label}`, () => {
  const draft = syntheticPackage(); mutate(draft);
  expect(() => assembleImportedExam(draft)).toThrow();
});

function reviewedPackage() {
  const d = syntheticPackage(); d.status = "released"; d.provenance.route = "codex-subscription";
  d.reviews = d.questions.map(q => ({ itemId: q.id, itemSha256: itemRevisionHash(q, d.caseStudies), verdict: "accept", reviewer: "Synthetic manual audit fixture", reviewedAt: "2026-10-07T21:00:00Z", sourceIds: q.sourceRefs.map(s => s.sourceId), rationale: "Synthetic review contract test; not real content approval." }));
  return d;
}
it("requires accepted reviews bound to every exact item and records hashes/provenance", () => {
  const draft = reviewedPackage();
  const exam = assembleImportedExam(draft);
  expect(exam.release.itemSha256[draft.questions[0].id]).toBe(itemRevisionHash(draft.questions[0], draft.caseStudies));
  expect(exam.release.assetSha256).toEqual(resolvePack(draft.pack).assets);
  expect(exam.release.manifestSha256).toBe(resolvePack(draft.pack).manifestSha256);
  const unreviewed = reviewedPackage(); unreviewed.reviews.pop(); expect(() => assembleImportedExam(unreviewed)).toThrow("every exact");
  for (const verdict of ["revise", "reject", "unverifiable"] as const) {
    const bad = reviewedPackage(); bad.reviews[0].verdict = verdict; expect(() => assembleImportedExam(bad)).toThrow("Unresolved");
  }
  const stale = reviewedPackage(); stale.questions[0].stem += " edited"; expect(() => assembleImportedExam(stale)).toThrow("Stale");
  const caseEdited = reviewedPackage(); caseEdited.caseStudies[0].intro += " Edited context."; expect(() => assembleImportedExam(caseEdited)).toThrow("Stale");
  const tampered = structuredClone(exam); tampered.release.packageSha256 = "0".repeat(64); expect(() => validateStoredExam(tampered)).toThrow("integrity");
});
it("legacy adaptation preserves all six original exams and cannot be used as an import", () => {
  const originals = JSON.parse(readFileSync("data/exams/exams.json", "utf8"));
  const hash = contentHash(originals);
  expect(originals).toHaveLength(6);
  for (const original of originals) {
    const adapted = adaptLegacyExam(original);
    expect(adapted.pack).toEqual(LEGACY_GH600);
    expect(adapted.id).toBe(original.id);
    expect(adapted.questions.map(q => q.correctAnswer)).toEqual(original.questions.map((q: any) => q.correctAnswer));
    expect(() => validateStoredExam(adapted)).toThrow("read-only");
    expect(() => adaptLegacyExam(adapted)).toThrow();
    expect(() => adaptLegacyExam({ ...original, questions: [{ ...original.questions[0], examCode: "AI-103" }] })).toThrow();
  }
  expect(contentHash(originals)).toBe(hash);
  expect(() => buildBlueprint(10, LEGACY_GH600)).toThrow("read-only");
  expect(() => buildBlueprint(10, undefined as any)).toThrow();
});
it("resolves pack-specific knowledge and fails on changed assets without fallback", () => {
  expect(readPackMaterial(CURRENT_AI103, "knowledge", "A")).not.toEqual(readPackMaterial(CURRENT_GH600, "knowledge", "A"));
  expect(() => readPackMaterial(CURRENT_AI103, "knowledge", "F")).toThrow();
  const temporary = mkdtempSync(path.join(os.tmpdir(), "cert-assets-"));
  try {
    cpSync("packs/gh-600/1.1.0", `${temporary}/packs/gh-600/1.1.0`, { recursive: true });
    writeFileSync(`${temporary}/packs/gh-600/1.1.0/prompts/generate-batch.prompt.md`, "Changed asset");
    const result = spawnSync(process.execPath, ["--import", path.resolve("node_modules/tsx/dist/loader.mjs"), "--input-type=module", "-e", `import { resolvePack } from ${JSON.stringify(path.resolve("src/packs.ts"))}; resolvePack({id:"gh-600",version:"1.1.0"});`], { cwd: temporary, encoding: "utf8" });
    expect(result.status).not.toBe(0); expect(result.stderr).toContain("hash mismatch");
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
it("uses AI-103's own weights and blocks provider generation before any client call", async () => {
  expect(buildBlueprint(100, CURRENT_AI103).domains.map(d => d.count)).toEqual([28, 33, 13, 13, 13]);
  const { generateBatch } = await import("../src/generation.js");
  const plan = buildBlueprint(10, CURRENT_AI103);
  await expect(generateBatch(plan, plan.batches[0], [])).rejects.toThrow("unavailable for AI-103");
  await expect(generateBatch({ ...plan, pack: undefined }, plan.batches[0], [])).rejects.toThrow();
});
