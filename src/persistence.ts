import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { dataPath, dataRoot } from "./runtime.js";
import { adaptLegacyAttempt, adaptLegacyExam } from "./compatibility.js";
import { validateStoredExam } from "./importer.js";
import { validateStoredAttempt } from "./attemptValidation.js";
import { contentHash, listPacks, packRefSchema, resolvePack, samePack } from "./packs.js";
import { identifierSchema, requireInvariant } from "./importValidation.js";
import type { Attempt, ExamSet, PackRef } from "./types.js";

function absent(error: unknown) { return (error as NodeJS.ErrnoException).code === "ENOENT"; }
export async function assertStoragePath(file: string): Promise<void> {
  const relative = path.relative(dataRoot, file);
  requireInvariant(relative && !relative.startsWith("..") && !path.isAbsolute(relative), "Invalid storage path");
  let current = dataRoot;
  for (const segment of relative.split(path.sep)) {
    current = path.join(current, segment);
    try { requireInvariant(!(await fs.lstat(current)).isSymbolicLink(), "Storage path may not contain a symlink"); }
    catch (error) { if (absent(error)) return; throw error; }
  }
}
async function readArray<T>(file: string): Promise<T[]> {
  await assertStoragePath(file);
  try {
    const value = JSON.parse(await fs.readFile(file, "utf8"));
    requireInvariant(Array.isArray(value), `Corrupt legacy array: ${path.basename(file)}`);
    return value;
  } catch (error) { if (absent(error)) return []; throw error; }
}
async function children(directory: string): Promise<string[]> {
  await assertStoragePath(directory);
  try { return await fs.readdir(directory); } catch (error) { if (absent(error)) return []; throw error; }
}
async function packRecords<T>(kind: "exams" | "attempts"): Promise<T[]> {
  const rows: T[] = [];
  for (const id of await children(dataPath("packs"))) {
    packRefSchema.shape.id.parse(id);
    const directory = dataPath("packs", id, kind);
    for (const name of await children(directory)) {
      if (!name.endsWith(".json")) continue;
      identifierSchema.parse(name.slice(0, -5));
      const file = path.join(directory, name);
      const stat = await fs.lstat(file);
      requireInvariant(!stat.isSymbolicLink(), "Storage artifact may not be a symlink");
      const row = JSON.parse(await fs.readFile(file, "utf8"));
      requireInvariant(row.id === name.slice(0, -5) && row.pack?.id === id, "Storage path/identity mismatch");
      resolvePack(row.pack);
      rows.push(row);
    }
  }
  return rows;
}

/** Reject concurrent mutations initially; no whole-array read/modify/write race. */
export async function withStorageWrite<T>(run: () => Promise<T>): Promise<T> {
  await fs.mkdir(dataRoot, { recursive: true });
  const lock = dataPath(".write-lock");
  let handle;
  try { handle = await fs.open(lock, "wx", 0o600); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("Another storage write is in progress; retry after it finishes (inspect .write-lock after a crashed process)");
    throw error;
  }
  try { return await run(); }
  finally { await handle.close(); await fs.unlink(lock); }
}

/** Sync then atomically link a complete file without replacing an existing revision. */
async function writeImmutable(file: string, row: unknown): Promise<void> {
  await assertStoragePath(file);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await assertStoragePath(file);
  const temporary = path.join(path.dirname(file), `.${randomUUID()}.tmp`);
  const handle = await fs.open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(JSON.stringify(row, null, 2) + "\n"); await handle.sync(); await handle.close();
    try { await fs.link(temporary, file); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      requireInvariant(contentHash(JSON.parse(await fs.readFile(file, "utf8"))) === contentHash(row), "Artifact ID already exists with different content; use a new ID/revision");
    }
  } finally { await handle.close().catch(() => {}); await fs.unlink(temporary); }
}

async function readExams(): Promise<ExamSet[]> {
  const legacy = (await readArray<ExamSet>(dataPath("exams", "exams.json"))).map(adaptLegacyExam);
  const current = (await packRecords<ExamSet>("exams")).map(validateStoredExam);
  const all = [...legacy, ...current];
  requireInvariant(new Set(all.map(e => e.id)).size === all.length, "Ambiguous duplicate exam ID across stores/packs");
  return all;
}
export async function saveExam(input: ExamSet): Promise<void> {
  const exam = validateStoredExam(input); identifierSchema.parse(exam.id);
  await withStorageWrite(async () => {
    const existing = await getExam(exam.id);
    requireInvariant(!existing || (!existing.compatibility && contentHash(existing) === contentHash(exam)), "Exam ID already exists; history/revisions are immutable");
    await writeImmutable(dataPath("packs", exam.pack.id, "exams", `${exam.id}.json`), exam);
  });
}
export async function getExam(id: string, pack?: PackRef): Promise<ExamSet | null> {
  identifierSchema.parse(id); if (pack) resolvePack(pack);
  return (await readExams()).find(e => e.id === id && (!pack || samePack(pack, e.pack))) ?? null;
}
export async function listExams(pack?: PackRef | string) {
  if (typeof pack === "string") {
    packRefSchema.shape.id.parse(pack);
    requireInvariant(listPacks().some(p => p.id === pack), `Unknown pack ${pack}`);
  } else if (pack) resolvePack(pack);
  return (await readExams()).filter(e => !pack || (typeof pack === "string" ? e.pack?.id === pack : samePack(pack, e.pack))).map(e => ({
    id: e.id, pack: e.pack!, createdAt: e.createdAt, questionCount: e.questions.length,
    compatibility: e.compatibility, releaseStatus: e.release?.status ?? "legacy",
  }));
}
export async function saveAttempt(input: Attempt): Promise<void> {
  await withStorageWrite(async () => {
    const exam = await getExam(input.examId, input.pack);
    requireInvariant(exam, "Attempt exam not found in its pack");
    const attempt = validateStoredAttempt(input, exam);
    const existing = await getAttempt(attempt.id);
    requireInvariant(!existing || contentHash(existing) === contentHash(attempt), "Attempt ID already exists with different content");
    await writeImmutable(dataPath("packs", attempt.pack!.id, "attempts", `${attempt.id}.json`), attempt);
  });
}
export async function getAttempt(id: string): Promise<Attempt | null> {
  identifierSchema.parse(id);
  const legacy = await readArray<Attempt>(dataPath("attempts", "attempts.json"));
  const current = await packRecords<Attempt>("attempts");
  const found = [...legacy, ...current].filter(a => a.id === id);
  requireInvariant(found.length <= 1, "Ambiguous duplicate attempt ID across stores/packs");
  if (!found.length) return null;
  const attempt = found[0];
  const exam = await getExam(attempt.examId);
  requireInvariant(exam, "Attempt refers to a missing exam");
  return legacy.includes(attempt) ? adaptLegacyAttempt(attempt, exam) : validateStoredAttempt(attempt, exam);
}
