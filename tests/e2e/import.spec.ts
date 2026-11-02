import { test, expect } from "@playwright/test";
import { syntheticPackage } from "../fixtures/importPackage.js";
import { CURRENT_AI103, CURRENT_GH600 } from "../../src/packs.js";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("offline import API plans, stores, scores, reviews and drills each pack", async ({ request }) => {
  expect((await request.post("/api/exams/blueprint", { data: { questionCount: 30 } })).status()).toBe(400);
  for (const ref of [CURRENT_AI103, CURRENT_GH600]) {
    const draft = syntheticPackage(ref, 30, `api-${ref.id}`);
    const preview = await request.post("/api/exams/blueprint", { data: { pack: ref, questionCount: 30 } });
    expect(preview.ok()).toBe(true); expect(await preview.json()).toEqual(draft.plan);
    const response = await request.post("/api/exams/import", { data: draft });
    expect(response.status()).toBe(201);
    const exam = await response.json();
    expect(exam.pack).toEqual(ref); expect(exam.questions).toEqual(draft.questions);
    expect(await (await request.get(`/api/exams/${exam.id}`)).json()).toEqual(exam);
    const library = await (await request.get(`/api/exams?packId=${ref.id}&packVersion=${ref.version}`)).json();
    expect(library.every((e: any) => e.pack.id === ref.id && e.pack.version === ref.version)).toBe(true);
    const answers = Object.fromEntries(exam.questions.map((q: any) => [q.id, q.correctAnswer]));
    const submitted = await request.post("/api/attempts", { data: { examId: exam.id, answers } });
    expect(submitted.ok()).toBe(true);
    const attempt = await submitted.json(); expect(attempt.score.overall).toBe(100); expect(attempt.pack).toEqual(ref); expect(attempt.examSha256).toMatch(/^[a-f0-9]{64}$/);
    const review = await (await request.get(`/api/attempts/${attempt.id}`)).json(); expect(review).toEqual(attempt);
    const drill = await (await request.get(`/api/study/weak-domain-drill/${attempt.id}`)).json();
    expect(drill.questions.length).toBeGreaterThan(0); expect(drill.questions.every((q: any) => q.pack.id === ref.id)).toBe(true);
    const exported = await (await request.get(`/api/exports/attempt/${attempt.id}`)).json(); expect(exported.pack).toEqual(ref);
    expect((await request.post("/api/attempts", { data: { examId: exam.id, answers: { foreign: "A" } } })).status()).toBe(400);
    const wrong = structuredClone(draft); wrong.questions.pop();
    expect((await request.post("/api/exams/import", { data: wrong })).status()).toBe(400);
    expect((await request.post("/api/exams/assemble", { data: { plan: draft.plan, questions: draft.questions } })).status()).toBe(400);
    const revised = structuredClone(draft); revised.revision = "2";
    expect((await request.post("/api/exams/import", { data: revised })).status()).toBe(409);
  }
  expect((await request.get("/api/exams?packId=unknown&packVersion=1.0.0")).status()).toBe(400);
});

test("offline CLI validates without persistence and imports into an explicit temporary store", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cert-import-cli-"));
  try {
    const file = path.join(root, "package.json");
    const draft = syntheticPackage(); fs.writeFileSync(file, JSON.stringify(draft));
    const env = { ...process.env, EXAM_DATA_ROOT: path.join(root, "store"), STUDY_OFFLINE: "1", OPENAI_API_KEY: "", GCS_BUCKET: "" };
    const check = spawnSync(process.execPath, ["--import", "tsx", "scripts/import-exam.ts", "--check", file], { env, encoding: "utf8" });
    expect(check.status, check.stderr).toBe(0); expect(fs.existsSync(env.EXAM_DATA_ROOT)).toBe(false);
    const imported = spawnSync(process.execPath, ["--import", "tsx", "scripts/import-exam.ts", file], { env, encoding: "utf8" });
    expect(imported.status, imported.stderr).toBe(0);
    const stored = path.join(root, "store/packs/ai-103/exams/synthetic-ai-103.json");
    expect(JSON.parse(fs.readFileSync(stored, "utf8")).pack).toEqual(CURRENT_AI103);
    draft.questions.pop(); fs.writeFileSync(file, JSON.stringify(draft));
    const bad = spawnSync(process.execPath, ["--import", "tsx", "scripts/import-exam.ts", file], { env, encoding: "utf8" });
    expect(bad.status).toBe(1); expect(bad.stderr).toContain("Incomplete");
    expect(JSON.parse(fs.readFileSync(stored, "utf8")).questions).toHaveLength(30);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
