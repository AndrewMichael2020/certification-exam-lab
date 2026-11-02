import { afterEach, beforeEach, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { syntheticPackage } from "./fixtures/importPackage.js";
import { assembleImportedExam } from "../src/importer.js";
import { contentHash, CURRENT_AI103, CURRENT_GH600, LEGACY_GH600 } from "../src/packs.js";
import { scoreAttempt } from "../src/scoring.js";
import { buildWeakDomainDrill } from "../src/studyLoops.js";
import type { Attempt, ExamSet } from "../src/types.js";

let root: string;
let store: typeof import("../src/persistence.js");
beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "cert-storage-"));
  vi.stubEnv("EXAM_DATA_ROOT", root); vi.resetModules();
  store = await import("../src/persistence.js");
});
afterEach(async () => { vi.unstubAllEnvs(); vi.resetModules(); await fs.rm(root, { recursive: true, force: true }); });
const attemptFor = (exam: ExamSet): Attempt => ({ id: `attempt-${exam.id}`, pack: exam.pack, examSha256: contentHash(exam), examId: exam.id, createdAt: "2026-10-07T22:00:00Z", answers: {}, confidence: {}, flagged: [], score: scoreAttempt(exam.questions, {}) });

it("keeps legacy arrays byte-identical through exam/attempt writes and filters packs", async () => {
  await fs.mkdir(path.join(root, "exams")); await fs.mkdir(path.join(root, "attempts"));
  const bytes = await fs.readFile("data/exams/exams.json");
  await fs.writeFile(path.join(root, "exams/exams.json"), bytes);
  const original = JSON.parse(bytes.toString())[0];
  const oldAttempt = { ...attemptFor(original), id: "legacy-attempt" }; delete oldAttempt.pack; delete oldAttempt.examSha256;
  const attemptBytes = JSON.stringify([oldAttempt]); await fs.writeFile(path.join(root, "attempts/attempts.json"), attemptBytes);
  const ai = assembleImportedExam(syntheticPackage(CURRENT_AI103, 30));
  const gh = assembleImportedExam(syntheticPackage(CURRENT_GH600, 30));
  await store.saveExam(ai); await store.saveExam(gh);
  expect((await store.listExams(CURRENT_AI103)).map(e => e.id)).toEqual([ai.id]);
  expect(await store.listExams(LEGACY_GH600)).toHaveLength(6);
  expect(await store.getExam(ai.id, CURRENT_GH600)).toBeNull();
  expect((await store.getAttempt("legacy-attempt"))!.pack).toEqual(LEGACY_GH600);
  const adapted = (await store.getExam(original.id))!;
  await store.saveAttempt(attemptFor(adapted));
  await store.saveAttempt(attemptFor(ai));
  expect((await store.getAttempt(`attempt-${ai.id}`))!.examSha256).toBe(contentHash(ai));
  expect(await fs.readFile(path.join(root, "exams/exams.json"))).toEqual(bytes);
  expect(await fs.readFile(path.join(root, "attempts/attempts.json"), "utf8")).toBe(attemptBytes);
  const dirs = await fs.readdir(path.join(root, "packs/ai-103/exams")); expect(dirs).toEqual([`${ai.id}.json`]);
});
it("retries identical imports without overwrite, rejects new revisions and cross-pack ID collisions", async () => {
  const draft = syntheticPackage(); const exam = assembleImportedExam(draft);
  await store.saveExam(exam); await store.saveExam(exam);
  draft.revision = "2"; await expect(store.saveExam(assembleImportedExam(draft))).rejects.toThrow("already exists");
  await expect(store.saveExam(assembleImportedExam(syntheticPackage(CURRENT_GH600, 30, exam.id)))).rejects.toThrow("already exists");
  expect(await store.getExam(exam.id)).toEqual(exam);
});
it("rejects concurrent writes and leaves no partial/temp/lock artifact", async () => {
  let unblock!: () => void;
  const blocker = new Promise<void>(resolve => { unblock = resolve; });
  let entered!: () => void; const ready = new Promise<void>(resolve => { entered = resolve; });
  const writing = store.withStorageWrite(async () => { entered(); await blocker; });
  await ready;
  await expect(store.saveExam(assembleImportedExam(syntheticPackage()))).rejects.toThrow("write is in progress");
  unblock(); await writing;
  await store.saveExam(assembleImportedExam(syntheticPackage()));
  expect(await fs.readdir(root)).toEqual(["packs"]);
  expect(await fs.readdir(path.join(root, "packs/ai-103/exams"))).toEqual(["synthetic-ai-103.json"]);
});
it("invalid imports cannot create files or write legacy records", async () => {
  const original = JSON.parse(await fs.readFile("data/exams/exams.json", "utf8"))[0];
  await expect(store.saveExam(original)).rejects.toThrow("imported release");
  const exam = assembleImportedExam(syntheticPackage()); exam.questions.pop();
  await expect(store.saveExam(exam)).rejects.toThrow("Incomplete");
  expect(await fs.readdir(root)).toEqual([]);
});
it("checks attempt pack, hash, score and foreign references before writing", async () => {
  const exam = assembleImportedExam(syntheticPackage()); await store.saveExam(exam);
  for (const mutation of [
    (a: Attempt) => { a.pack = CURRENT_GH600; },
    (a: Attempt) => { a.examSha256 = "0".repeat(64); },
    (a: Attempt) => { a.score.overall = 100; },
    (a: Attempt) => { a.answers.foreign = "A"; },
    (a: Attempt) => { a.flagged = ["foreign"]; },
    (a: Attempt) => { a.answers[exam.questions[0].id] = "foreign"; },
  ]) {
    const attempt = attemptFor(exam); mutation(attempt); await expect(store.saveAttempt(attempt)).rejects.toThrow();
  }
  const valid = attemptFor(exam); await store.saveAttempt(valid);
  const wrong = { ...valid, createdAt: "2026-10-07T23:00:00Z" }; await expect(store.saveAttempt(wrong)).rejects.toThrow("already exists");
  expect(await store.getAttempt(valid.id)).toEqual(valid);
});
it("fails loudly on corrupt JSON, altered releases and path/pack mismatches", async () => {
  const exam = assembleImportedExam(syntheticPackage()); await store.saveExam(exam);
  const file = path.join(root, "packs/ai-103/exams", `${exam.id}.json`);
  await fs.writeFile(file, "{broken"); await expect(store.listExams()).rejects.toThrow();
  exam.release.itemSha256[exam.questions[0].id] = "0".repeat(64);
  await fs.writeFile(file, JSON.stringify(exam)); await expect(store.getExam(exam.id)).rejects.toThrow("integrity");
  exam.pack = CURRENT_GH600; await fs.writeFile(file, JSON.stringify(exam)); await expect(store.listExams()).rejects.toThrow("path/identity");
});
it("rejects records escaping storage through symlinks", async () => {
  await fs.mkdir(path.join(root, "packs/ai-103/exams"), { recursive: true });
  await fs.symlink(path.resolve("data/exams/exams.json"), path.join(root, "packs/ai-103/exams/escape.json"));
  await expect(store.listExams()).rejects.toThrow("symlink");
});
it("drills reject unrelated packs sharing domain letters", () => {
  const ai = assembleImportedExam(syntheticPackage());
  const gh = assembleImportedExam(syntheticPackage(CURRENT_GH600));
  expect(() => buildWeakDomainDrill([...ai.questions, ...gh.questions], attemptFor(ai))).toThrow("pack");
});

it("rejects directory symlinks before reading or writing outside the store", async () => {
  const outside = await fs.mkdtemp(path.join(os.tmpdir(), "cert-outside-"));
  try {
    await fs.mkdir(path.join(root, "packs"));
    await fs.symlink(outside, path.join(root, "packs/ai-103"));
    await expect(store.listExams()).rejects.toThrow("symlink");
    await expect(store.saveExam(assembleImportedExam(syntheticPackage()))).rejects.toThrow("symlink");
    expect(await fs.readdir(outside)).toEqual([]);
  } finally { await fs.rm(outside, { recursive: true, force: true }); }
});
