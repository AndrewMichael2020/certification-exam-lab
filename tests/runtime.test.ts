import { afterEach, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it("writes exams and attempts only under the explicit data root", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "cert-unit-"));
  try {
    vi.stubEnv("EXAM_DATA_ROOT", root); vi.resetModules();
    const persistence = await import("../src/persistence.js");
    const { assembleImportedExam } = await import("../src/importer.js");
    const { syntheticPackage } = await import("./fixtures/importPackage.js");
    const { contentHash } = await import("../src/packs.js");
    const { scoreAttempt } = await import("../src/scoring.js");
    const exam = assembleImportedExam(syntheticPackage(undefined, 20, "isolated-exam"));
    await persistence.saveExam(exam);
    expect(await persistence.getExam(exam.id)).toEqual(exam);
    const attempt = { id: "isolated-attempt", pack: exam.pack, examSha256: contentHash(exam), examId: exam.id, createdAt: "2026-10-07T22:00:00Z", answers: {}, confidence: {}, flagged: [], score: scoreAttempt(exam.questions, {}) };
    await persistence.saveAttempt(attempt);
    expect(await persistence.getAttempt(attempt.id)).toEqual(attempt);
    expect(JSON.parse(await fs.readFile(path.join(root, "packs/ai-103/exams/isolated-exam.json"), "utf8"))).toEqual(exam);
    await expect(fs.access(path.join(root, "exams/exams.json"))).rejects.toThrow();
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

it("uses loopback in development and the container interface in production", async () => {
  vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("HOST", undefined); vi.resetModules();
  expect((await import("../src/runtime.js")).host).toBe("127.0.0.1");
  vi.stubEnv("NODE_ENV", "production"); vi.resetModules();
  expect((await import("../src/runtime.js")).host).toBe("0.0.0.0");
});

it("offline mode disables cloud storage even with a bucket configured", async () => {
  vi.stubEnv("STUDY_OFFLINE", "1"); vi.stubEnv("GCS_BUCKET", "synthetic-ci-bucket"); vi.resetModules();
  const storage = await import("../src/storage.js");
  expect(storage.gcsConfigured()).toBe(false);
  expect(await storage.pdfExistsInGcs("fixture.pdf")).toBe(false);
  await expect(storage.uploadPdf("unused", "fixture.pdf")).rejects.toThrow("disabled");
});
