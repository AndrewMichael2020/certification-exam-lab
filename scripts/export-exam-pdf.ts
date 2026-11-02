/** Export either legacy or imported exams using the same pack-aware renderer as the API. */
import { getExam, listExams } from "../src/persistence.js";
import { generateExamPdf, pdfKindSchema } from "../src/pdfExport.js";

async function main() {
  const args = process.argv.slice(2);
  const kindIndex = args.indexOf("--kind");
  const kind = pdfKindSchema.parse(kindIndex >= 0 ? args[kindIndex + 1] : "practice");
  if (kindIndex >= 0) args.splice(kindIndex, 2);
  if (args.length > 1 || args.some(a => a.startsWith("--"))) throw new Error("Usage: npm run export-pdf -- [examId] [--kind practice|questions|answers]");
  const summaries = await listExams();
  const target = args[0];
  const exact = target ? summaries.find(e => e.id === target) : undefined;
  const matches = exact ? [exact] : target ? summaries.filter(e => e.id.startsWith(target)) : [];
  if (target && matches.length !== 1) throw new Error("Exam ID must match exactly one stored exam");
  const id = target ? matches[0].id : summaries.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]?.id;
  if (!id) throw new Error("No exams found");
  const exam = await getExam(id);
  if (!exam) throw new Error("Exam not found");
  const result = await generateExamPdf(exam, kind);
  console.log(JSON.stringify({ id: exam.id, pack: exam.pack, kind, path: result.outPath, filename: result.filename }));
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Export failed"); process.exitCode = 1; });
