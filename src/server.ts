import express from "express";
import { ZodError } from "zod";
import { dataPath, host, offline } from "./runtime.js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { legacyPdfStem, generateExamPdf, pdfLocation, pdfKindSchema } from "./pdfExport.js";
import { v4 as uuidv4 } from "uuid";

const IS_DEV = process.env.NODE_ENV !== "production";

const PUBLISHED_PATH = dataPath("published.json");

/** Always reads published.json; returns [] if missing/invalid. */
function readPublishedIds(): string[] {
  if (!existsSync(PUBLISHED_PATH)) return [];
  try {
    const raw = JSON.parse(readFileSync(PUBLISHED_PATH, "utf8")) as { examIds?: string[] };
    return Array.isArray(raw.examIds) ? raw.examIds : [];
  } catch { return []; }
}

/** Writes the published list to disk. */
function writePublishedIds(ids: string[]): void {
  writeFileSync(PUBLISHED_PATH, JSON.stringify({ examIds: ids }, null, 2) + "\n", "utf8");
}

/** For production filtering — returns null only in dev (show all). */
function loadPublishedIds(): string[] | null {
  if (IS_DEV) return null;
  return readPublishedIds();
}

function isExamPublished(examId: string): boolean {
  const published = loadPublishedIds();
  return published === null || published.includes(examId);
}

import { assembleExam, createPlan, generateBatch, validateBatch } from "./generation.js";
import { getAttempt, getExam, listExams, saveAttempt, saveExam } from "./persistence.js";
import { packCatalog } from "./presentation.js";
import { buildBlueprint } from "./blueprint.js";
import { assertStoragePath } from "./persistence.js";
import { identifierSchema } from "./importValidation.js";
import { assembleImportedExam } from "./importer.js";
import { contentHash, packRefSchema, resolvePack } from "./packs.js";
import { attemptInputSchema, validateAttemptInput } from "./attemptValidation.js";
import { scoreAttempt } from "./scoring.js";
import { buildDomainSubskillDrill, buildMistakeReplay, buildWeakDomainDrill } from "./studyLoops.js";
import { Attempt, BatchPlan, GenerationPlan } from "./types.js";
import {
  blueprintRequestSchema,
  generateBatchRequestSchema,
  validateBatchRequestSchema,
} from "./validators.js";

function reqPack(query: express.Request["query"]) {
  if (query.packId === undefined && query.packVersion === undefined) return undefined;
  return packRefSchema.parse({ id: query.packId, version: query.packVersion });
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/healthz", (_req, res) => {
  return res.status(200).json({ ok: true, service: "gh-600-prep", timestamp: new Date().toISOString() });
});

// Reports runtime config for the frontend.
// isDev     → whether the generate section should be shown
// hasApiKey → whether generation is possible (dev only)
// examCount → total visible exams
app.get("/api/config", async (_req, res) => {
  const exams = await listExams();
  const published = loadPublishedIds();
  const visible = published ? exams.filter((e) => published.includes(e.id)) : exams;
  return res.json({
    isDev: IS_DEV,
    hasApiKey: !offline && Boolean(process.env.OPENAI_API_KEY),
    examCount: visible.length,
  });
});

app.get("/api/packs", (_req, res) => res.json(packCatalog()));
app.get("/api/packs/:id/blueprint", (req, res) => {
  const ref = packRefSchema.parse({ id: req.params.id, version: req.query.version });
  return res.json(buildBlueprint(Number(req.query.questionCount), ref));
});

// List stored exams (summary only — no questions).
// In production returns only exams listed in data/published.json.
// In dev, returns all exams with an `isPublished` flag on each.
app.get("/api/exams", async (_req, res) => {
  const pack = _req.query.packId !== undefined && _req.query.packVersion === undefined
    ? packRefSchema.shape.id.parse(_req.query.packId) : reqPack(_req.query);
  const all = await listExams(pack);
  const published = loadPublishedIds();
  if (published) {
    // Production: filter to published list only
    return res.json(all.filter((e) => published.includes(e.id)));
  }
  // Dev: return all with isPublished flag
  const publishedSet = new Set(readPublishedIds());
  return res.json(all.map((e) => ({ ...e, isPublished: publishedSet.has(e.id) })));
});

const windowMs = 60_000;
const configuredLimit = Number(process.env.REQUESTS_PER_MINUTE ?? 120);
const maxPerWindow = Number.isInteger(configuredLimit) && configuredLimit > 0 ? configuredLimit : 120;
const requestTracker = new Map<string, { count: number; resetAt: number }>();

function pruneExpiredRequestBuckets(now = Date.now()): void {
  for (const [key, bucket] of requestTracker) {
    if (now > bucket.resetAt) {
      requestTracker.delete(key);
    }
  }
}

app.use((req, res, next) => {
  const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const bucket = requestTracker.get(key);
  if (!bucket || now > bucket.resetAt) {
    if (bucket) {
      requestTracker.delete(key);
    }
    requestTracker.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (bucket.count >= maxPerWindow) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }
  bucket.count += 1;
  return next();
});

setInterval(() => pruneExpiredRequestBuckets(), windowMs).unref();
app.use(express.static(path.join(process.cwd(), "public")));
// Serve generated PDFs from data/exams/. In production, only published exams are visible.
app.use("/exams", async (req, res, next) => {
  if (IS_DEV) return next();

  const requested = path.basename(req.path);
  const published = loadPublishedIds() ?? [];
  for (const id of published) {
    const exam = await getExam(id);
    if (exam && `${legacyPdfStem(exam)}.pdf` === requested) return next();
  }

  return res.status(404).json({ error: "Exam not found" });
});
app.use("/exams", express.static(dataPath("exams")));

function requireDevMode(_req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!IS_DEV) {
    return res.status(403).json({ error: "Exam generation is only available in dev mode." });
  }
  return next();
}

function requireProviderGeneration(_req: express.Request, res: express.Response, next: express.NextFunction) {
  if (offline) return res.status(503).json({ error: "Provider generation is disabled in offline study mode." });
  return next();
}

app.post("/api/exams/blueprint", requireDevMode, (req, res) => {
  const parsed = blueprintRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.json(createPlan(parsed.data.questionCount, parsed.data.pack));
});

app.post("/api/questions/generate-batch", requireDevMode, requireProviderGeneration, async (req, res) => {
  const parsed = generateBatchRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { questions, caseStudy } = await generateBatch(
    parsed.data.plan as unknown as GenerationPlan,
    parsed.data.batch as BatchPlan,
    parsed.data.existingQuestionStems
  );
  return res.json({ questions, caseStudy });
});

app.post("/api/questions/validate-batch", requireDevMode, (req, res) => {
  const parsed = validateBatchRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  return res.json({ questions: validateBatch(parsed.data.questions) });
});

const importExam: express.RequestHandler = async (req, res) => {
  const exam = assembleImportedExam(req.body);
  await saveExam(exam);
  return res.status(201).json(exam);
};
app.post("/api/exams/import", requireDevMode, importExam);
// Assembly uses the same review gate; it cannot bypass the importer.
app.post("/api/exams/assemble", requireDevMode, importExam);

app.post("/api/attempts", async (req, res) => {
  const parsed = attemptInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const exam = await getExam(parsed.data.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  validateAttemptInput(exam, parsed.data);
  const score = scoreAttempt(exam.questions, parsed.data.answers);
  const attempt: Attempt = {
    id: uuidv4(),
    examId: exam.id,
    pack: exam.pack,
    examSha256: contentHash(exam),
    createdAt: new Date().toISOString(),
    answers: parsed.data.answers,
    confidence: parsed.data.confidence,
    flagged: parsed.data.flagged,
    score,
  };
  await saveAttempt(attempt);
  return res.json(attempt);
});

app.get("/api/attempts/:id", async (req, res) => {
  const attempt = await getAttempt(req.params.id);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  return res.json(attempt);
});

// NOTE: /api/exams/generate must be registered BEFORE /api/exams/:id
// to prevent Express matching "generate" as a dynamic :id parameter.

// ── Publish toggle (dev only) ─────────────────────────────────────────────────
// POST /api/exams/:id/publish  { published: true|false }
app.post("/api/exams/:id/publish", (req, res) => {
  if (!IS_DEV) return res.status(403).json({ error: "Only available in dev mode." });
  const { published } = req.body as { published?: boolean };
  if (typeof published !== "boolean") return res.status(400).json({ error: "Body must be { published: true|false }" });
  const ids = readPublishedIds();
  const next = published
    ? Array.from(new Set([...ids, req.params.id]))
    : ids.filter((id) => id !== req.params.id);
  writePublishedIds(next);
  console.log(`[PUBLISH] exam ${req.params.id} → ${published ? "published" : "unpublished"} (total published: ${next.length})`);
  return res.json({ ok: true, published, examId: req.params.id, totalPublished: next.length });
});


// GET  /api/exams/:id/pdf-status  → { exists: bool, url: string|null, filename: string|null }
// POST /api/exams/:id/pdf         → triggers Playwright PDF build

async function findPdf(exam: import("./types.js").ExamSet, kind: import("./pdfExport.js").PdfKind) {
  const { resolvePdfStatus } = await import("./storage.js");
  const location = pdfLocation(exam, kind);
  await assertStoragePath(location.outPath);
  const current = await resolvePdfStatus(location.filename, location.localDir, location.url, location.objectName);
  if (current.exists) return { ...location, ...current, historical: false };
  if (kind === "practice" && exam.compatibility) {
    const filename = `${legacyPdfStem(exam)}.pdf`;
    const outPath = dataPath("exams", filename);
    await assertStoragePath(outPath);
    const old = await resolvePdfStatus(filename, dataPath("exams"));
    if (old.exists) return { filename, outPath, ...old, historical: true };
  }
  return { ...location, ...current, historical: false };
}
app.get("/api/exams/:id/pdf-status", async (req, res) => {
  if (!isExamPublished(req.params.id)) return res.status(404).json({ error: "Exam not found" });
  const exam = await getExam(req.params.id);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const kind = pdfKindSchema.parse(req.query.kind ?? "practice");
  const status = await findPdf(exam, kind);
  return res.json({ exists: status.exists, url: status.url, filename: status.exists ? status.filename : null, kind, pack: exam.pack, historical: status.historical });
});
app.get("/api/exams/:id/pdf-file", async (req, res) => {
  if (!isExamPublished(req.params.id)) return res.status(404).json({ error: "Exam not found" });
  const exam = await getExam(req.params.id);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const status = await findPdf(exam, pdfKindSchema.parse(req.query.kind ?? "practice"));
  if (!status.exists) return res.status(404).json({ error: "PDF not found" });
  if (status.url?.startsWith("https://")) return res.redirect(status.url);
  return res.download(status.outPath, status.filename);
});
app.post("/api/exams/:id/pdf", requireDevMode, async (req, res) => {
  const exam = await getExam(identifierSchema.parse(req.params.id));
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const kind = pdfKindSchema.parse(req.query.kind ?? "practice");
  const result = await generateExamPdf(exam, kind);
  return res.json({ ok: true, kind, pack: exam.pack, url: result.gcsUrl ?? result.url, filename: result.filename, path: result.outPath });
});

// The client connects once; the server streams batch progress and sends the
// finished exam on completion.  The generation terminal is never exposed to
// the user — they only see a progress overlay with human-readable status.
app.get("/api/exams/generate", requireDevMode, requireProviderGeneration, async (req, res) => {
  const parsed = blueprintRequestSchema.safeParse({ questionCount: Number(req.query.questionCount), pack: reqPack(req.query) });
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const plan = createPlan(parsed.data.questionCount, parsed.data.pack);
  if (!resolvePack(plan.pack).providerGeneration) return res.status(400).json({ error: "Use offline import for this pack" });
  const questionCount = parsed.data.questionCount;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let closed = false;
  req.on("close", () => {
    closed = true;
    console.log(`[SSE] Client disconnected (questionCount=${questionCount})`);
  });

  // Keepalive: send SSE comment every 15 s so proxies/browsers don't drop the idle connection
  // during long OpenAI calls (case_study batches can take 60–90 s).
  const keepAlive = setInterval(() => {
    if (!closed) res.write(": keepalive\n\n");
  }, 15_000);

  const send = (data: object) => {
    if (!closed) res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  console.log(`[SSE] Generation started — questionCount=${questionCount}`);

  try {
    console.log(`[SSE] Plan created — ${plan.batches.length} batches, ${plan.totalQuestions} questions`);
    send({ type: "plan", totalBatches: plan.batches.length, totalQuestions: plan.totalQuestions });

    const allQuestions: ReturnType<typeof validateBatch> = [];
    const allCaseStudies: import("./types.js").CaseStudy[] = [];
    const usedCaseStudyThemes: string[] = [];

    for (let i = 0; i < plan.batches.length; i++) {
      if (closed) { console.log(`[SSE] Aborted at batch ${i} — client closed`); break; }
      const batch = plan.batches[i];
      console.log(`[SSE] Batch ${i + 1}/${plan.batches.length} starting — domain=${batch.domainId ?? "mixed"} type=${batch.typeFocus.join(",")} count=${batch.questionCount}`);
      send({
        type: "batch_start",
        index: i,
        total: plan.batches.length,
        domainId: batch.domainId ?? null,
        domainName: batch.domainName ?? null,
        typeFocus: batch.typeFocus,
        questionCount: batch.questionCount,
      });

      const { questions: generated, caseStudy } = await generateBatch(
        plan,
        batch,
        allQuestions.map((q) => q.stem),
        usedCaseStudyThemes
      );
      console.log(`[SSE] Batch ${i + 1} raw=${generated.length} questions received`);
      if (caseStudy) {
        allCaseStudies.push(caseStudy);
        // Record title + overview snippet so subsequent case-study batches avoid repeating the theme
        const overview = caseStudy.sections?.find((s: { heading: string }) => s.heading === "Overview");
        usedCaseStudyThemes.push(
          `${caseStudy.title}: ${(overview as { body?: string } | undefined)?.body?.slice(0, 150) ?? ""}`
        );
      }
      const validated = validateBatch(generated);
      const accepted = validated.filter((q) => q.metadata.validationStatus !== "rejected");
      allQuestions.push(...accepted);
      console.log(`[SSE] Batch ${i + 1} accepted=${accepted.length} running_total=${allQuestions.length}`);

      send({ type: "batch_done", index: i, accepted: accepted.length, running: allQuestions.length });
    }

    if (closed) return;
    const exam = assembleExam(
      plan,
      allQuestions as import("./types.js").PracticeQuestion[],
      allCaseStudies
    );
    await saveExam(exam);
    console.log(`[SSE] Exam assembled — id=${exam.id} questions=${exam.questions.length}`);
    send({ type: "complete", examId: exam.id, exam });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[SSE] Generation error:`, err);
    send({ type: "error", message: msg });
  } finally {
    clearInterval(keepAlive);
    res.end();
  }
});

app.get("/api/exams/:id", async (req, res) => {
  if (!isExamPublished(req.params.id)) return res.status(404).json({ error: "Exam not found" });
  const exam = await getExam(req.params.id);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  return res.json(exam);
});

app.get("/api/study/weak-domain-drill/:attemptId", async (req, res) => {
  const attempt = await getAttempt(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  const exam = await getExam(attempt.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const limit = Number(req.query.limit || 10);
  return res.json({ questions: buildWeakDomainDrill(exam.questions, attempt, limit) });
});

app.get("/api/study/mistake-replay/:attemptId", async (req, res) => {
  const attempt = await getAttempt(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  const exam = await getExam(attempt.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const limit = Number(req.query.limit || 20);
  return res.json({ questions: buildMistakeReplay(exam.questions, attempt, limit) });
});

app.get("/api/study/domain-subskill-drill/:attemptId", async (req, res) => {
  const attempt = await getAttempt(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  const exam = await getExam(attempt.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  const limit = Number(req.query.limit || 12);
  return res.json({ questions: buildDomainSubskillDrill(exam.questions, attempt, limit) });
});

app.get("/api/exports/attempt/:attemptId", async (req, res) => {
  const attempt = await getAttempt(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  const exam = await getExam(attempt.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });

  const payload = {
    generatedAt: new Date().toISOString(),
    attemptId: attempt.id,
    examId: exam.id,
    pack: exam.pack,
    examSha256: contentHash(exam),
    score: attempt.score,
    flagged: attempt.flagged,
    confidence: attempt.confidence,
    incorrect: exam.questions
      .filter((q) => attempt.score.incorrectQuestionIds.includes(q.id))
      .map((q) => ({ id: q.id, domainId: q.domainId, objectiveTags: q.objectiveTags, type: q.type })),
  };
  res.setHeader("content-type", "application/json");
  res.setHeader("content-disposition", `attachment; filename=\"attempt-${attempt.id}-report.json\"`);
  return res.send(JSON.stringify(payload, null, 2));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    const fields = [...new Set(error.issues.map(issue => issue.path.join(".") || "package"))];
    return res.status(400).json({ error: `Invalid fields: ${fields.slice(0, 8).join(", ")}${fields.length > 8 ? ", …" : ""}. Check the package and retry.` });
  }
  const message = error instanceof Error ? error.message : "Request failed";
  const status = message.includes("write is in progress") || message.includes("already exists") ? 409 : 400;
  return res.status(status).json({ error: message });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, host, () => {
  console.log(`Certification Exam Lab running on http://${host}:${port}`);
  console.log(`[CONFIG] model=${process.env.OPENAI_MODEL ?? "gpt-5.5"} hasApiKey=${Boolean(process.env.OPENAI_API_KEY)} effort=${process.env.OPENAI_REASONING_EFFORT ?? "medium"}`);
});
