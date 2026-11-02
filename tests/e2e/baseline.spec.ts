import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

test("offline study blocks provider calls and serves every preserved PDF unchanged", async ({ request }) => {
  const config = await (await request.get("/api/config")).json();
  expect(config.hasApiKey).toBe(false);
  expect(config.examCount).toBe(7);
  expect((await request.get("/api/exams/generate?questionCount=1")).status()).toBe(503);
  expect((await request.post("/api/questions/generate-batch", { data: {} })).status()).toBe(503);
  const manifest = JSON.parse(fs.readFileSync("docs/gh-600-preservation-baseline.json", "utf8"));
  for (const file of manifest.files.filter((f: { path: string }) => f.path.endsWith(".pdf"))) {
    const response = await request.get(`/exams/${file.path.split("/").pop()}`);
    expect(response.ok()).toBe(true);
    const bytes = await response.body();
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(file.sha256);
  }
});

test("synthetic PDF export stays in the disposable data store", async ({ request }) => {
  const response = await request.post("/api/exams/ci-gh600-fixture/pdf");
  expect(response.ok()).toBe(true);
  const result = await response.json();
  expect(result.filename).toMatch(/^gh-600-v1\.0\.0-2026-01-01-20q-ci-gh600-fixture-[a-f0-9]{12}-practice-r3\.pdf$/);
  expect(result.path).toMatch(/\/cert-e2e-[^/]+\/packs\/gh-600\/exports\//);
  expect(result.url).toBe("/api/exams/ci-gh600-fixture/pdf-file?kind=practice");
  const pdf = await request.get(result.url);
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const status = await (await request.get("/api/exams/ci-gh600-fixture/pdf-status")).json();
  expect(status.exists).toBe(true);
  expect(status.url).toBe(result.url);
  const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/export-exam-pdf.ts", "ci-gh600-fixture"], {
    env: { ...process.env, EXAM_DATA_ROOT: path.resolve(path.dirname(result.path), "../../.."), STUDY_OFFLINE: "1", GCS_BUCKET: "synthetic-ci-bucket" },
    encoding: "utf8", timeout: 15_000,
  });
  expect(cli.status, cli.stderr).toBe(0);
  expect(fs.readFileSync(result.path).subarray(0, 5).toString()).toBe("%PDF-");
});

test("production filters the library and retains dev-only mutation gates", async ({ playwright }) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cert-production-"));
  fs.mkdirSync(path.join(root, "exams"));
  fs.copyFileSync("data/exams/exams.json", path.join(root, "exams/exams.json"));
  fs.copyFileSync("data/published.json", path.join(root, "published.json"));
  const child = spawn(process.execPath, ["dist/server.js"], {
    env: { ...process.env, EXAM_DATA_ROOT: root, HOST: "127.0.0.1", PORT: "4318", NODE_ENV: "production", STUDY_OFFLINE: "1", OPENAI_API_KEY: "", GCS_BUCKET: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const api = await playwright.request.newContext({ baseURL: "http://127.0.0.1:4318" });
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Production test server startup timed out")), 10_000);
      child.once("error", error => { clearTimeout(timer); reject(error); });
      child.once("exit", code => { clearTimeout(timer); reject(new Error(`Production test server exited: ${code}`)); });
      child.stdout.on("data", data => { if (String(data).includes("running on http://")) { clearTimeout(timer); resolve(); } });
    });
    const published = JSON.parse(fs.readFileSync("data/published.json", "utf8")).examIds;
    const exams = JSON.parse(fs.readFileSync("data/exams/exams.json", "utf8"));
    const hidden = exams.find((exam: { id: string }) => !published.includes(exam.id));
    const listed = await (await api.get("/api/exams")).json();
    expect(listed.map((exam: { id: string }) => exam.id).sort()).toEqual([...published].sort());
    expect((await api.get(`/api/exams/${hidden.id}`)).status()).toBe(404);
    expect((await api.get(`/api/exams/${published[0]}`)).ok()).toBe(true);
    expect((await api.post(`/api/exams/${published[0]}/publish`, { data: { published: false } })).status()).toBe(403);
    expect((await api.post(`/api/exams/${published[0]}/pdf`)).status()).toBe(403);
    expect((await api.get(`/api/exams/${hidden.id}/pdf-file`)).status()).toBe(404);
    expect((await api.get(`/api/exams/${hidden.id}/pdf-status`)).status()).toBe(404);
    expect((await api.get("/api/packs")).ok()).toBe(true);
    expect((await api.get("/api/packs/ai-103/blueprint?version=1.1.0&questionCount=10")).ok()).toBe(true);
    expect((await api.post("/api/exams/import", { data: {} })).status()).toBe(403);
    expect((await api.post("/api/exams/assemble", { data: {} })).status()).toBe(403);
    expect((await api.post("/api/exams/blueprint", { data: { questionCount: 20 } })).status()).toBe(403);
  } finally {
    await api.dispose();
    if (child.exitCode === null) {
      await new Promise<void>(resolve => { child.once("exit", () => resolve()); child.kill("SIGTERM"); });
    }
    fs.rmSync(root, { recursive: true, force: true });
  }
});
