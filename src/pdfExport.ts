/**
 * Shared PDF export logic used by both the server API route (dev mode) and
 * the standalone CLI script (scripts/export-exam-pdf.ts).
 *
 * generateExamPdf(exam) → writes data/packs/<pack-id>/exports/<stem>.pdf, optionally uploads to
 * GCS if GCS_BUCKET is configured, and returns { outPath, filename, gcsUrl }.
 */

import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { contentHash, resolvePack } from "./packs.js";
import { identifierSchema } from "./importValidation.js";
import { assertStoragePath, withStorageWrite } from "./persistence.js";
import { dataPath } from "./runtime.js";
import path from "node:path";
import { ExamSet } from "./types.js";
import { gcsConfigured, uploadPdf } from "./storage.js";

export const pdfKindSchema = z.enum(["practice", "questions", "answers"]);
export type PdfKind = z.infer<typeof pdfKindSchema>;
const PDF_LAYOUT_VERSION = "3";
const kindTitle: Record<PdfKind, string> = { practice: "Practice with answers", questions: "Practice questions", answers: "Answer review" };
const typeTitles: Record<string, string> = {
  single_choice: "Single choice", multi_select: "Multiple select", sequence_order: "Sequence",
  matching_magnet: "Matching", dropdown_completion: "Configuration", case_study_child: "Case study",
  code_or_config_artifact: "Configuration", log_or_artifact_interpretation: "Exhibit",
  policy_control_selection: "Policy selection",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function domainColor(id: string): string {
  const map: Record<string, string> = {
    A: "#dbeafe", B: "#ede9fe", C: "#dcfce7",
    D: "#fef3c7", E: "#ffe4e6", F: "#e0f2fe",
  };
  return map[id] ?? "#f3f4f6";
}

function diffColor(d: string): string {
  if (d === "easy") return "#dcfce7";
  if (d === "hard") return "#ffebe9";
  return "#fff8c5";
}

function isCorrectOption(q: ExamSet["questions"][number], optId: string): boolean {
  const ca = q.correctAnswer;
  if (Array.isArray(ca)) return ca.includes(optId);
  if (typeof ca === "string") return ca === optId;
  return false;
}

function renderCaseStudyBlock(cs: NonNullable<ExamSet["caseStudies"]>[number]): string {
  const sections = cs.sections.map((s) => `
    <div class="cs-section">
      <div class="cs-section-heading">${esc(s.heading)}</div>
      <div class="cs-section-body">${esc(s.body)}</div>
    </div>`).join("");
  return `<div class="cs-panel">
    <div class="cs-header">Case study - ${esc(cs.title)}</div>
    ${cs.intro ? `<p class="cs-intro">${esc(cs.intro)}</p>` : ""}
    ${sections}
  </div>`;
}

function renderOptions(q: ExamSet["questions"][number], showAnswers: boolean): string {
  const bank = ["sequence_order", "matching_magnet", "dropdown_completion"].includes(q.type)
    && showAnswers ? renderOptions(q, false) : "";
  if (!showAnswers) {
    if (q.type === "matching_magnet") return `<div class="options"><p>Match each row to a choice.</p>${q.options.map(o => `<div class="opt"><strong>${esc(o.id)}.</strong><span>${esc(o.text)}<br>Match: __________</span></div>`).join("")}<p><strong>Choice bank</strong></p><ul>${(q.matchChoices ?? []).map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
    if (q.type === "dropdown_completion") return `<div class="options"><p>${esc(q.statementTemplate ?? "").replace(/\{\{[^{}]+\}\}/g, "[__________]")}</p>${(q.slots ?? []).map(slot => `<p>${esc(slot.id)}: ${slot.choices.map(esc).join(" / ")}</p>`).join("")}</div>`;
    return `<div class="options">${q.type === "sequence_order" ? "<p>Arrange these steps in order:</p>" : ""}${q.options.map(o => `<div class="opt"><strong>${esc(o.id)}.</strong><span>${esc(o.text)}</span></div>`).join("")}</div>`;
  }
  if (q.type === "sequence_order") {
    const ca = q.correctAnswer as { order?: string[] };
    const order = ca?.order ?? q.options.map((o) => o.id);
    return `${bank}<div class="options">
      <div class="match-hint">Correct order:</div>
      ${order.map((id, i) => {
        const opt = q.options.find((o) => o.id === id);
        return `<div class="opt correct">
          <span class="opt-id">${i + 1}. ${esc(id)}</span>
          <span>${esc(opt?.text ?? id)}</span>
        </div>`;
      }).join("")}
    </div>`;
  }

  if (q.type === "matching_magnet") {
    const ca = q.correctAnswer as { pairs?: Record<string, string> };
    const correctPairs = ca?.pairs ?? {};
    return `${bank}<div class="options">
      <div class="match-hint">Correct matches:</div>
      ${q.options.map((opt) => `
        <div class="opt correct">
          <span class="opt-id">${esc(opt.id)}. ${esc(opt.text)}</span>
          <span>→ <strong>${esc(correctPairs[opt.id] ?? "—")}</strong></span>
        </div>`).join("")}
    </div>`;
  }

  if (q.type === "dropdown_completion") {
    const ca = q.correctAnswer as { pairs?: Record<string, string> };
    const correctPairs = ca?.pairs ?? {};
    const template = q.statementTemplate ?? "";
    const parts = template.split(/(\{\{[^}]+\}\})/);
    const rendered = parts.map((part) => {
      const m = part.match(/^\{\{([^}]+)\}\}$/);
      if (!m) return `<span>${esc(part)}</span>`;
      const slotId = m[1];
      const correct = correctPairs[slotId] ?? slotId;
      return `<span class="dc-answer">${esc(correct)}</span>`;
    }).join("");
    return `${bank}<div class="options">
      <div class="match-hint">Completed statement:</div>
      <div class="dc-statement">${rendered}</div>
    </div>`;
  }

  return `<div class="options">
    ${q.options.map((opt) => {
      const correct = isCorrectOption(q, opt.id);
      return `<div class="opt ${correct ? "correct" : ""}">
        <span class="opt-id">${esc(opt.id)}</span>
        <span>${esc(opt.text)}</span>
        ${correct ? `<span class="tick">✓</span>` : ""}
      </div>`;
    }).join("")}
  </div>`;
}

function renderExplanation(q: ExamSet["questions"][number]): string {
  if (!q.explanation) return "";
  const { whyCorrect, whyDistractorsWrong, examStrategyNote } = q.explanation;
  const distractors = Object.entries(whyDistractorsWrong ?? {})
    .map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(String(v))}</li>`)
    .join("");
  const tags = (q.objectiveTags ?? []).map((t) => `<span class="tag">${esc(t)}</span>`).join(" ");
  return `<div class="explanation">
    <div class="exp-title">Why the correct answer is right</div>
    <div class="exp-body">${esc(whyCorrect ?? "")}</div>
    ${distractors ? `<div class="exp-title">${["matching_magnet", "sequence_order", "dropdown_completion"].includes(q.type) ? "Answer and step notes" : "Why the other options are wrong"}</div><ul class="distractor-list">${distractors}</ul>` : ""}
    ${examStrategyNote ? `<div class="strategy-note">Note: ${esc(examStrategyNote)}</div>` : ""}
    ${tags ? `<div class="tags">${tags}</div>` : ""}
    <div class="sources"><strong>Sources</strong>${q.sourceRefs.map(source => `<p>${esc(source.sourceId ?? "Historical reference")}: ${source.url && /^https?:\/\//i.test(source.url) ? `<a href="${esc(source.url)}">${esc(source.title)}</a><br><span>${esc(source.url)}</span>` : esc(source.title)}${source.snapshotSha256 ? `<br><small>Snapshot SHA-256: ${esc(source.snapshotSha256)}</small>` : ""}</p>`).join("")}</div>
  </div>`;
}

function renderQuestion(q: ExamSet["questions"][number], index: number, exam: ExamSet, kind: PdfKind): string {
  const cs = exam.caseStudies?.find((c) => c.id === q.caseStudyId);
  const typeLabel = typeTitles[q.type] ?? q.type.replace(/_/g, " ");
  return `<div class="question" data-type="${q.type}" id="q${index + 1}">
    <div class="q-header">
      <span class="q-num">Q${index + 1}</span>
      <span class="badge domain" style="background:${domainColor(q.domainId)}">
        Domain ${esc(q.domainId)}: ${esc(q.domainName)}
      </span>
      <span class="badge type">${esc(typeLabel)}</span>
      <span class="badge diff" style="background:${diffColor(q.difficulty)}">${esc(q.difficulty)}</span>
    </div>
    ${cs ? renderCaseStudyBlock(cs) : ""}
    <p class="stem">${esc(q.stem)}</p>
    ${q.scenario ? `<div class="scenario">${esc(q.scenario)}</div>` : ""}
    ${q.artifact ? `<div class="artifact">
      <div class="artifact-title">${esc(q.artifact.title)}</div>
      <pre><code>${esc(q.artifact.content)}</code></pre>
    </div>` : ""}
    ${renderOptions(q, kind !== "questions")}
    ${kind === "questions" ? "" : renderExplanation(q)}
  </div>`;
}

export function buildExamHtml(exam: ExamSet, kind: PdfKind = "practice"): string {
  pdfKindSchema.parse(kind);
  const pack = resolvePack(exam.pack);
  const identity = `${pack.examCode} - v${pack.version}`;
  const status = exam.release?.status === "synthetic" ? "Synthetic mechanics fixture - not study material" : exam.compatibility ? "Historical practice material" : exam.release?.status === "released" ? "Reviewed practice material" : "DRAFT - independent content audit pending";
  const date = new Date(exam.createdAt).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });

  const questionsHtml = exam.questions.map((q, i) => renderQuestion(q, i, exam, kind)).join("\n");

  const answerKey = exam.questions.map((q, i) => {
    const ca = q.correctAnswer;
    let ans: string;
    if (typeof ca === "string") {
      ans = ca;
    } else if (Array.isArray(ca)) {
      ans = ca.join(", ");
    } else if (ca && typeof ca === "object" && "pairs" in ca) {
      // matching: show "Option text → choice text" for each pair
      ans = Object.entries((ca as { pairs: Record<string, string> }).pairs)
        .map(([k, v]) => `${k} → ${v}`)
        .join(" | ");
    } else if (ca && typeof ca === "object" && "order" in ca) {
      // Complete IDs identify the detailed steps above without truncating distinctions.
      ans = (ca as { order: string[] }).order
        .map((id, idx) => `${idx + 1}. ${id}`)
        .join(" → ");
    } else {
      ans = JSON.stringify(ca);
    }
    return `<tr><td><a href="#q${i + 1}">Q${i + 1}</a></td><td>${esc(typeTitles[q.type] ?? q.type.replace(/_/g, " "))}</td><td><strong>${esc(ans)}</strong></td></tr>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${esc(identity)} - ${esc(kindTitle[kind])} - ${date}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11pt; color: #1f2328; line-height: 1.5; }

    /* Cover */
    .cover { page-break-after: always; display: flex; flex-direction: column;
             align-items: center; justify-content: center; min-height: 220mm; text-align: center; }
    .cover h1 { font-size: 28pt; margin-bottom: 12px; }
    .cover .subtitle { font-size: 14pt; color: #57606a; margin-bottom: 24px; }
    .cover .meta { font-size: 11pt; color: #57606a; max-width: 100%; overflow-wrap: anywhere; }
    .cover .lineage { font-size: 9pt; margin-top: 20px; }
    .sources { margin-top: 12px; font-size: 8.5pt; overflow-wrap: anywhere; }
    .sources p { margin-top: 6px; }
    a { color: #0550ae; }
    .opt span { min-width: 0; overflow-wrap: anywhere; }
    td { overflow-wrap: anywhere; }
    tr { break-inside: avoid; }

    /* Questions */
    .question { page-break-inside: ${kind === "questions" ? "avoid" : "auto"}; border: 1px solid #d0d7de;
                border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .q-header { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 10px; }
    .q-num { font-weight: 700; font-size: 12pt; min-width: 36px; }
    .badge { padding: 2px 8px; border-radius: 12px; font-size: 8.5pt;
             font-weight: 600; border: 1px solid rgba(0,0,0,.08); }
    .badge.type { background: #f3f4f6; }

    .stem { font-size: 11.5pt; font-weight: 500; margin-bottom: 8px; }
    .scenario { background: #f6f8fa; border-left: 3px solid #0969da;
                padding: 8px 12px; margin-bottom: 10px; font-size: 10.5pt; }

    /* Artifact */
    .artifact { margin-bottom: 12px; }
    .artifact-title { font-size: 9pt; font-weight: 600; color: #57606a; margin-bottom: 4px; }
    pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px;
          padding: 10px 14px; font-size: 9pt; white-space: pre-wrap;
          word-break: break-all; font-family: "Consolas", "Monaco", monospace; }

    /* Options */
    .options { margin-bottom: 12px; }
    .opt { display: flex; align-items: baseline; gap: 8px; padding: 5px 8px;
           border-radius: 4px; margin-bottom: 4px; font-size: 10.5pt; }
    .opt.correct { background: #dafbe1; border: 1px solid #1a7f37; }
    .opt-id { font-weight: 700; min-width: 20px; }
    .tick { color: #1a7f37; font-weight: 700; margin-left: auto; }
    .match-hint { font-size: 9.5pt; color: #57606a; margin-bottom: 6px; }
    .choices-note { font-size: 9pt; color: #57606a; margin-top: 6px; }
    .dc-statement { font-size: 10.5pt; line-height: 2; white-space: pre-line; }
    .question[data-type="dropdown_completion"] .options > p:first-child { white-space: pre-line; }
    .question[data-type="sequence_order"] .opt-id { flex: 0 0 24px; white-space: nowrap; }
    .question[data-type="matching_magnet"] .opt { display: grid; grid-template-columns: minmax(0,1fr) 155px; align-items: start; }
    .question[data-type="matching_magnet"] .opt:not(.correct) { grid-template-columns: 24px minmax(0,1fr); }
    .question[data-type="matching_magnet"] .opt-id { min-width: 0; }
    .stem { break-inside: avoid; break-after: avoid; }
    .section-title, .q-header, .exp-title, .artifact-title { break-after: avoid; }
    .opt, .cs-panel, .options, .exp-body, .distractor-list li, .sources p, .artifact { break-inside: avoid; }
    .sources > strong { display: block; break-after: avoid; }
    .dc-answer { background: #dafbe1; border: 1px solid #1a7f37; border-radius: 3px;
                 padding: 1px 6px; font-weight: 600; color: #1a7f37; }

    /* Explanation */
    .explanation { background: #f6f8fa; border-radius: 6px; padding: 12px 16px; margin-top: 10px; }
    .exp-title { font-weight: 600; font-size: 10pt; margin-bottom: 4px; margin-top: 8px; }
    .exp-title:first-child { margin-top: 0; }
    .exp-body { font-size: 10pt; color: #444; margin-bottom: 6px; }
    .distractor-list { font-size: 10pt; color: #444; padding-left: 20px; margin-bottom: 6px; }
    .distractor-list li { margin-bottom: 2px; }
    .strategy-note { font-size: 9.5pt; color: #9a6700; background: #fff8c5;
                     border-radius: 4px; padding: 6px 10px; margin-top: 6px; }
    .tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
    .tag { background: #e0f2fe; color: #0c4a6e; border-radius: 10px;
           padding: 2px 8px; font-size: 8pt; }

    /* Case study */
    .cs-panel { background: #fffbeb; border: 1px solid #f59e0b;
                border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; }
    .cs-header { font-weight: 700; font-size: 10pt; margin-bottom: 6px; color: #92400e; }
    .cs-intro { font-size: 10pt; margin-bottom: 8px; }
    .cs-section { margin-bottom: 8px; }
    .cs-section-heading { font-weight: 600; font-size: 10pt; margin-bottom: 2px; }
    .cs-section-body { font-size: 10pt; color: #444; }

    /* Answer key */
    .answer-key { page-break-before: always; }
    .answer-key h2 { font-size: 16pt; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
    th, td { border: 1px solid #d0d7de; padding: 5px 10px; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
    .answer-key th:first-child, .answer-key td:first-child { width: 10%; white-space: nowrap; }
    .answer-key th:nth-child(2), .answer-key td:nth-child(2) { width: 25%; }
    tr:nth-child(even) td { background: #fafbfc; }

    /* Section title */
    .section-title { font-size: 18pt; font-weight: 700; margin: 32px 0 20px; page-break-before: always; }
    .section-title:first-of-type { page-break-before: avoid; }

    @page { margin: 20mm 18mm; }
  </style>
</head>
<body>

  <!-- Cover -->
  <div class="cover">
    <h1>${esc(pack.title)}</h1>
    <div class="subtitle">${esc(identity)} - ${esc(kindTitle[kind])}</div>
    <div class="meta">
      ${exam.questions.length} questions &nbsp;·&nbsp; ${date}<br/>
      <small>${kind === "questions" ? "Answer independently; use the separate answer review after completion." : "Answer keys, explanations and source citations included."}</small>
      <p>${esc(status)}</p>
      <p>Independent practice resource. Scores do not represent an official scaled score.</p>
      <div class="lineage">Exam: ${esc(exam.id)}<br>Package revision: ${esc(exam.release?.revision ?? (exam.compatibility ? "historical" : "unreleased"))}<br>Exam SHA-256: ${contentHash(exam)}${pack.objectiveEffectiveDate ? `<br>Objectives effective: ${esc(pack.objectiveEffectiveDate)}` : ""}</div>
    </div>
  </div>

  <!-- Questions -->
  <h2 class="section-title">${kind === "questions" ? "Practice Questions" : "Questions &amp; Answers"}</h2>
  ${questionsHtml}

  <!-- Answer Key -->
  ${kind !== "questions" ? `<div class="answer-key">
    <h2>Quick Answer Key</h2>
    <table>
      <thead><tr><th>#</th><th>Type</th><th>Correct Answer</th></tr></thead>
      <tbody>${answerKey}</tbody>
    </table>
  </div>` : ""}

</body>
</html>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

/** Historical names are used only to locate preserved PDFs, never for new writes. */
export function legacyPdfStem(exam: Pick<ExamSet, "id" | "createdAt" | "questions">): string {
  const date = new Date(exam.createdAt).toISOString().slice(0, 10);
  return `gh-600-${date}-${exam.questions.length}q-${exam.id.slice(0, 8)}`;
}
export function examPdfStem(exam: ExamSet, kind: PdfKind = "practice"): string {
  pdfKindSchema.parse(kind); identifierSchema.parse(exam.id);
  const pack = resolvePack(exam.pack);
  const date = new Date(exam.createdAt).toISOString().slice(0, 10);
  return `${pack.id}-v${pack.version}-${date}-${exam.questions.length}q-${exam.id}-${contentHash(exam).slice(0, 12)}-${kind}-r${PDF_LAYOUT_VERSION}`;
}
export function pdfLocation(exam: ExamSet, kind: PdfKind = "practice") {
  const pack = resolvePack(exam.pack);
  const filename = `${examPdfStem(exam, kind)}.pdf`;
  return { filename, localDir: dataPath("packs", pack.id, "exports"),
    outPath: dataPath("packs", pack.id, "exports", filename),
    objectName: `packs/${pack.id}/exports/${filename}`,
    url: `/api/exams/${encodeURIComponent(exam.id)}/pdf-file?kind=${kind}` };
}

export async function generateExamPdf(exam: ExamSet, kind: PdfKind = "practice") {
  const location = pdfLocation(exam, kind);
  await withStorageWrite(async () => {
    await assertStoragePath(location.outPath);
    fs.mkdirSync(location.localDir, { recursive: true });
    await assertStoragePath(location.outPath);
    if (fs.existsSync(location.outPath)) return;
    // No HTML files or remote assets are loaded during PDF rendering.
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const temporary = path.join(location.localDir, `.${randomUUID()}.tmp`);
    try {
      const page = await browser.newPage();
      await page.route("**/*", route => route.abort());
      await page.setContent(buildExamHtml(exam, kind), { waitUntil: "load" });
      const buffer = await page.pdf({ format: "A4", printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `<div style="font:9px Arial;width:100%;text-align:center">${esc(exam.pack!.id)} v${esc(exam.pack!.version)} - ${esc(kindTitle[kind])}</div>`,
        footerTemplate: '<div style="font:9px Arial;width:100%;text-align:center">Independent practice - Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
        margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" } });
      fs.writeFileSync(temporary, buffer, { flag: "wx", mode: 0o600 });
      const fd = fs.openSync(temporary, "r"); try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
      fs.linkSync(temporary, location.outPath);
    } finally {
      await browser.close();
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  });
  const gcsUrl = gcsConfigured() ? await uploadPdf(location.outPath, location.objectName) : null;
  return { ...location, gcsUrl };
}
