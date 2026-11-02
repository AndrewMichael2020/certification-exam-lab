import { expect, test, type Page } from "@playwright/test";
import { syntheticPackage } from "../fixtures/importPackage.js";
import { CURRENT_AI103, CURRENT_GH600 } from "../../src/packs.js";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

async function importInBrowser(page: Page, id: string, ref = CURRENT_AI103) {
  const draft = syntheticPackage(ref, 30, id);
  await page.locator("#importFile").setInputFiles({ name: `${id}.json`, mimeType: "application/json", buffer: Buffer.from(JSON.stringify(draft)) });
  await page.locator("#importBtn").click();
  await expect(page.locator("#importStatus")).toContainText("Imported 30 questions");
  return draft;
}
async function answer(page: Page, q: ReturnType<typeof syntheticPackage>["questions"][number]) {
  if (typeof q.correctAnswer === "string") await page.locator(`.option-btn[data-opt='${q.correctAnswer}']`).click();
  else if (Array.isArray(q.correctAnswer)) for (const id of [...q.correctAnswer].reverse()) await page.locator(`.option-btn[data-opt='${id}']`).click();
  else if ("pairs" in q.correctAnswer) {
    for (const [id, value] of Object.entries(q.correctAnswer.pairs)) await page.locator(`[data-match-key='${id}']`).selectOption(value);
  } else {
    // Exercise reorder controls, then restore the fixture's A/B/C sequence.
    await page.locator("[data-seq-down='0']").click(); await page.locator("[data-seq-up='1']").click();
  }
}

for (const ref of [CURRENT_AI103, CURRENT_GH600]) test(`${ref.id} selector → import → answer → score → review → drill → export`, async ({ page, request }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/"); await expect(page.locator("#packSelect")).toBeEnabled();
  await page.locator("#packSelect").selectOption(ref.id);
  const draft = await importInBrowser(page, `browser-${ref.id}`, ref);
  await page.locator("#questionCount").fill("100");
  const plan = await (await request.get(`/api/packs/${ref.id}/blueprint?version=${ref.version}&questionCount=100`)).json();
  for (const d of plan.domains) await expect(page.locator(`[data-domain='${d.id}'] .dist-count`)).toHaveText(`${d.count}q`);
  await expect(page.locator("#examList .exam-list-identity").first()).toContainText(ref.id.toUpperCase());
  await expect(page.locator("#examList")).not.toContainText(ref.id === "ai-103" ? "GH-600" : "AI-103");
  await page.locator("#minutesPerQuestion").fill("0.5");
  await page.locator(`[data-exam-id='${draft.id}'][data-exam-mode='exam']`).click();
  await expect(page.locator("#examIdentity")).toContainText(`${ref.id.toUpperCase()} · v1.1.0`);
  await expect(page.locator("#examTimer")).toHaveText(/Practice timer · (15:00|14:59)/);
  await expect(page.locator("#packSelect")).toBeDisabled();
  await page.locator("#packSelect").evaluate((select: HTMLSelectElement) => { select.value = select.value === "ai-103" ? "gh-600" : "ai-103"; select.dispatchEvent(new Event("change")); });
  await expect(page.locator("#examIdentity")).toContainText(ref.id.toUpperCase());
  const formats = new Set<string>();
  for (let i = 0; i < draft.questions.length; i++) {
    const q = draft.questions[i]; formats.add(q.type);
    await expect(page.locator("#examCounter")).toHaveText(`Q ${i + 1} / 30`);
    await answer(page, q);
    if (i < draft.questions.length - 1) await page.locator("#nextBtn").click();
  }
  expect(formats.size).toBe(9);
  await page.locator("#flagBtn").click();
  await page.locator("#submitBtn").click();
  await expect(page.locator("#scorePercent")).toHaveText("100%");
  await expect(page.locator("#scoreSummary")).toContainText("Practice score");
  await expect(page.locator("#scoreSummary")).not.toContainText("Passed!");
  await expect(page.locator("#domainBreakdown")).toContainText(plan.domains[0].name);
  await expect(page.locator("#resultsIdentity")).toContainText(ref.id.toUpperCase());
  await page.locator("#reviewBtn").click();
  await expect(page.locator("#reviewIdentity")).toContainText(ref.id.toUpperCase());
  const multiIndex = draft.questions.findIndex(q => q.type === "multi_select");
  await expect(page.locator(".review-item").nth(multiIndex).locator(".ans-same")).toHaveCount(1);
  await page.locator(".review-item-header").first().click();
  await expect(page.locator(".review-item").first().locator(".source-refs a")).toHaveAttribute("href", draft.questions[0].sourceRefs[0].url);
  await page.locator("#backToResultsBtn").click(); await page.locator("#analyticsBtn").click();
  await expect(page.locator("#analyticsIdentity")).toContainText(ref.id.toUpperCase());
  await page.locator("#weakDrillBtn").click(); await expect(page.locator("#drillResult")).toContainText(ref.id.toUpperCase());
  const downloading = page.waitForEvent("download"); await page.locator("#exportAttemptBtn").click();
  const download = await downloading; expect(download.suggestedFilename()).toContain(`${ref.id}-v1.1.0-attempt-`);
  const report = JSON.parse(fs.readFileSync((await download.path())!, "utf8")); expect(report.pack).toEqual(ref);
  await page.locator("#backToResultsBtn2").click(); await page.locator("#newExamBtn").click();
  await expect(page.locator("#packSelect")).toBeEnabled();
  await page.locator("#packSelect").selectOption(ref.id);
  await page.locator(`[data-exam-id='${draft.id}'][data-exam-mode='review']`).click();
  await expect(page.locator("#examTimer")).toHaveText("Practice");
  await answer(page, draft.questions[0]); await expect(page.locator("#questionCard .source-refs a")).toBeVisible();
  for (const type of ["matching_magnet", "dropdown_completion", "multi_select", "sequence_order"]) {
    const index = draft.questions.findIndex(q => q.type === type);
    await page.locator("#qMap button").nth(index).click();
    await answer(page, draft.questions[index]);
    await expect(page.locator("#questionCard .source-refs a")).toBeVisible();
  }
  console.log(`LOCAL_QA_IMAGE ${JSON.stringify({ name: `${ref.id}-practice.png`, base64: (await page.screenshot()).toString("base64") })}`);
  expect(errors).toEqual([]);
});

test("empty packs, malformed imports, invalid counts and stale previews stay visible and correct", async ({ page }) => {
  await page.goto("/"); await expect(page.locator("#packSelect")).toBeEnabled();
  await page.locator("#packSelect").selectOption("ai-103");
  // Keep this check independent of previously imported mechanics fixtures.
  await page.route("**/api/exams?packId=ai-103", route => route.fulfill({ json: [] }));
  await page.locator("#packSelect").selectOption("gh-600"); await page.locator("#packSelect").selectOption("ai-103");
  await expect(page.locator("#noExamsMsg")).toBeVisible();
  await page.locator("#importFile").setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from('{"schemaVersion":1}') });
  await page.locator("#importBtn").click(); await expect(page.locator("#importStatus")).toContainText("Invalid fields:");
  await page.locator("#questionCount").fill("201"); await expect(page.locator("#domainDistPreview")).toContainText("between 1 and 200");
  await page.route("**/api/packs/ai-103/blueprint?*questionCount=10", async route => { await new Promise(resolve => setTimeout(resolve, 350)); await route.continue(); });
  const pending = page.waitForRequest(request => request.url().includes("ai-103/blueprint") && request.url().includes("questionCount=10"));
  await page.locator("#questionCount").fill("10"); await pending;
  await page.locator("#packSelect").selectOption("gh-600"); await page.locator("#questionCount").fill("20");
  await expect(page.locator("#domainDistPreview .form-label")).toContainText("GH-600 v1.1.0 · 20 questions");
  await page.waitForTimeout(400);
  console.log(`LOCAL_QA_IMAGE ${JSON.stringify({ name: "setup-preview.png", base64: (await page.screenshot({ fullPage: true })).toString("base64") })}`);
  await expect(page.locator("#domainDistPreview .form-label")).toContainText("GH-600 v1.1.0 · 20 questions");
});

test("PDFs for both packs have separate question/answer variants and immutable download identities", async ({ page, request, playwright }, testInfo) => {
  let dataRoot = "";
  for (const ref of [CURRENT_AI103, CURRENT_GH600]) {
    const draft = syntheticPackage(ref, 30, `pdf-${ref.id}`);
    expect((await request.post("/api/exams/import", { data: draft })).status()).toBe(201);
    for (const kind of ["practice", "questions", "answers"]) {
      const result = await (await request.post(`/api/exams/${draft.id}/pdf?kind=${kind}`)).json();
      expect(result.filename).toContain(`${ref.id}-v1.1.0-`); expect(result.filename).toContain(`-${kind}-r3.pdf`);
      expect(result.path).toContain(`/packs/${ref.id}/exports/`);
      dataRoot = path.resolve(path.dirname(result.path), "../../..");
      const pdf = await request.get(result.url); expect(pdf.ok()).toBe(true);
      const bytes = await pdf.body(); expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
      const status = await (await request.get(`/api/exams/${draft.id}/pdf-status?kind=${kind}`)).json(); expect(status.url).toBe(result.url);
      await testInfo.attach(`${ref.id}-${kind}.pdf`, { body: bytes, contentType: "application/pdf" });
      // Sanitized mechanics-only PDFs are forwarded for main-agent visual inspection.
      console.log(`LOCAL_QA_PDF ${JSON.stringify({ name: `${ref.id}-${kind}.pdf`, base64: bytes.toString("base64") })}`);
      const retry = await (await request.post(`/api/exams/${draft.id}/pdf?kind=${kind}`)).json(); expect(retry.filename).toBe(result.filename);
      expect(await (await request.get(retry.url)).body()).toEqual(bytes);
    }
  }
  await page.goto("/"); await page.locator("#packSelect").selectOption("ai-103");
  const card = page.locator(".exam-list-item").filter({ has: page.locator("[data-exam-id='pdf-ai-103']") });
  await card.locator(".pdf-kind").selectOption("questions"); await expect(card.locator(".btn-pdf-download")).toBeVisible();
  const downloading = page.waitForEvent("download"); await card.locator(".btn-pdf-download").click();
  const download = await downloading; expect(download.suggestedFilename()).toContain("-questions-r3.pdf");
  await card.locator(".pdf-kind").selectOption("answers"); await card.locator(".btn-pdf-generate").click();
  await expect(card.locator(".pdf-feedback")).toHaveText("PDF ready");
  await expect(card.locator(".btn-pdf-generate")).toBeEnabled();
  // Exact CLI IDs win over another ID with the same prefix; both use the pack renderer.
  expect((await request.post("/api/exams/import", { data: syntheticPackage(CURRENT_AI103, 30, "pdf-ai-103-extra") })).status()).toBe(201);
  const cli = spawnSync(process.execPath, ["--import", "tsx", "scripts/export-exam-pdf.ts", "pdf-ai-103", "--kind", "questions"], {
    env: { ...process.env, EXAM_DATA_ROOT: dataRoot, STUDY_OFFLINE: "1", GCS_BUCKET: "" }, encoding: "utf8", timeout: 15_000,
  });
  expect(cli.status, cli.stderr).toBe(0);
  expect(JSON.parse(cli.stdout)).toMatchObject({ id: "pdf-ai-103", pack: CURRENT_AI103, kind: "questions" });
  const publishedFile = path.join(dataRoot, "published.json");
  const originalPublished = fs.readFileSync(publishedFile);
  fs.writeFileSync(publishedFile, JSON.stringify({ examIds: ["pdf-ai-103"] }));
  const child = spawn(process.execPath, ["dist/server.js"], {
    env: { ...process.env, EXAM_DATA_ROOT: dataRoot, HOST: "127.0.0.1", PORT: "4318", NODE_ENV: "production", STUDY_OFFLINE: "1", OPENAI_API_KEY: "", GCS_BUCKET: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const api = await playwright.request.newContext({ baseURL: "http://127.0.0.1:4318" });
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Production PDF server startup timed out")), 10_000);
      child.once("error", error => { clearTimeout(timer); reject(error); });
      child.once("exit", code => { clearTimeout(timer); reject(new Error(`Production PDF server exited: ${code}`)); });
      child.stdout.on("data", data => { if (String(data).includes("running on http://")) { clearTimeout(timer); resolve(); } });
    });
    for (const kind of ["practice", "questions", "answers"]) {
      expect((await api.get(`/api/exams/pdf-ai-103/pdf-status?kind=${kind}`)).ok()).toBe(true);
      expect((await api.get(`/api/exams/pdf-ai-103/pdf-file?kind=${kind}`)).ok()).toBe(true);
      expect((await api.get(`/api/exams/pdf-gh-600/pdf-file?kind=${kind}`)).status()).toBe(404);
      expect((await api.get(`/api/exams/pdf-gh-600/pdf-status?kind=${kind}`)).status()).toBe(404);
    }
    expect((await api.post("/api/exams/pdf-ai-103/pdf?kind=answers")).status()).toBe(403);
  } finally {
    await api.dispose();
    if (child.exitCode === null) await new Promise<void>(resolve => { child.once("exit", () => resolve()); child.kill("SIGTERM"); });
    fs.writeFileSync(publishedFile, originalPublished);
  }
});


test("AI-103 revisions select distinct planning contracts and survive import", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("#packSelect")).toBeEnabled();
  const values = await page.locator("#packSelect option").evaluateAll(options => options.map(o => o.value));
  expect(new Set(values).size).toBe(values.length);
  await page.locator("#packSelect").selectOption("ai-103@1.2.0");
  await expect(page.locator("#packSubtitle")).toContainText("planning v1.2.0");
  await expect(page.locator("#domainDistPreview .form-label")).toContainText("AI-103 v1.2.0");
  const ref = { id: "ai-103", version: "1.2.0" };
  const draft = await importInBrowser(page, "browser-ai103-v120", ref);
  await expect(page.locator("#packSelect")).toHaveValue("ai-103@1.2.0");
  await page.locator(`[data-exam-id='${draft.id}'][data-exam-mode='exam']`).click();
  await expect(page.locator("#examIdentity")).toContainText("AI-103 · v1.2.0");
  const plan = await (await request.get("/api/packs/ai-103/blueprint?version=1.2.0&questionCount=30")).json();
  expect(plan.pack).toEqual(ref);
});
