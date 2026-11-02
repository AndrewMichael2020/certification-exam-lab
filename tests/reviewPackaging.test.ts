import { expect, it } from "vitest";
import { buildAssessedBlueprint } from "../src/blueprint.js";
import { assembleImportedExam } from "../src/importer.js";
import { itemRevisionHash } from "../src/importValidation.js";
import { contentHash } from "../src/packs.js";
import { packageReviewedDraft } from "../src/reviewPackaging.js";
import { syntheticPackage } from "./fixtures/importPackage.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function fixture() {
  const draft = { ...syntheticPackage(), status: "draft" };
  draft.provenance.route = "codex-subscription";
  draft.questions[0].difficulty = "easy";
  const counts = { easy: 0, medium: 0, hard: 0, very_hard: 0 };
  draft.questions.forEach(q => counts[q.difficulty]++);
  draft.plan = buildAssessedBlueprint(draft.questions.length, draft.pack, counts);
  const audit = { templateOnly: false, packetId: "synthetic-audit", packageId: draft.id, revision: draft.revision, pack: draft.pack,
    draftPackageSha256: contentHash(draft), reviewer: { actualModelLabel: "Synthetic review fixture", visibleModeIfAny: null, reviewedAtUtc: "2026-10-08T12:00:00Z" },
    items: draft.questions.map(q => ({ itemId: q.id, itemRevision: q.revision, itemSha256: itemRevisionHash(q, draft.caseStudies),
      sourceIds: q.sourceRefs.map(s => s.sourceId), blindAnswer: q.correctAnswer, finalProposedAnswer: q.correctAnswer,
      verdict: "accept", rationale: "Synthetic mechanics test only.", sourceEvidence: q.sourceRefs.map(s => ({ sourceId: s.sourceId, lines: "1-2", supports: "Synthetic evidence" })) })) };
  return { draft, audit };
}
it("accepts an assessed mix without changing the original planner or weakening exact quotas", () => {
  const { draft, audit } = fixture();
  const result = packageReviewedDraft(draft, audit);
  expect(result.exam.questions[0].difficulty).toBe("easy");
  expect(result.exam.release.reviews).toHaveLength(30);
  expect(() => assembleImportedExam(draft)).toThrow();
  const old = syntheticPackage(); old.questions[0].difficulty = "easy";
  expect(() => assembleImportedExam(old)).toThrow("Difficulty quota");
  for (const counts of [{ easy: 30 }, { easy: -1, medium: 31, hard: 0, very_hard: 0 }, { easy: 1.5, medium: 28.5, hard: 0, very_hard: 0 }, { easy: 30, medium: 0, hard: 0, very_hard: 0, extra: 0 }]) {
    expect(() => buildAssessedBlueprint(30, draft.pack, counts)).toThrow();
  }
  const corrupt = structuredClone(result.package); corrupt.plan.domains[0].count++;
  expect(() => assembleImportedExam(corrupt)).toThrow("Plan differs");
});
it("rejects stale, incomplete, non-accepted and answer-mismatched audits before release", () => {
  for (const mutate of [
    (a: any) => a.items[0].verdict = "revise", (a: any) => a.templateOnly = true,
    (a: any) => a.items.pop(), (a: any) => a.items[0].itemSha256 = "0".repeat(64),
    (a: any) => a.draftPackageSha256 = "0".repeat(64), (a: any) => a.items[0].finalProposedAnswer = "foreign",
    (a: any) => a.items[0].blindAnswer = null, (a: any) => a.items[0].sourceEvidence = [],
  ]) {
    const { draft, audit } = fixture(); mutate(audit); expect(() => packageReviewedDraft(draft, audit)).toThrow();
  }
});
it("CLI creates an immutable release bundle only after a supplied accepted audit", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "review-package-test-"));
  try {
    const { draft, audit } = fixture();
    const input = path.join(root, "draft.json"), returned = path.join(root, "audit.json"), output = path.join(root, "release");
    fs.writeFileSync(input, JSON.stringify(draft)); fs.writeFileSync(returned, JSON.stringify(audit));
    const run = () => spawnSync(process.execPath, ["--import", "tsx", "scripts/package-reviewed-exam.ts", input, returned, output], { encoding: "utf8" });
    expect(run().status).toBe(0);
    expect(JSON.parse(fs.readFileSync(path.join(output, "package.released.json"), "utf8")).status).toBe("released");
    expect(JSON.parse(fs.readFileSync(path.join(output, "package-manifest.json"), "utf8")).artifacts).toHaveProperty("accepted-audit.json");
    const before = fs.readFileSync(path.join(output, "exam.json"));
    expect(run().status).toBe(1); expect(fs.readFileSync(path.join(output, "exam.json"))).toEqual(before);
    fs.rmSync(output, { recursive: true }); audit.items[0].verdict = "revise";
    fs.writeFileSync(returned, JSON.stringify(audit)); expect(run().status).toBe(1); expect(fs.existsSync(output)).toBe(false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
