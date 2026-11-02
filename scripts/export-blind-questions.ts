/** Offline blind Markdown export; leaves the source package and review status untouched. */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { importPackageSchema, validateAssembly } from "../src/importValidation.js";
import { buildBlindQuestionsMarkdown } from "../src/auditMarkdown.js";

try {
  const args = process.argv.slice(2);
  if (args.length !== 2) throw new Error("Usage: tsx scripts/export-blind-questions.ts <draft.json> <new-output.md>");
  const [input, output] = args.map(value => path.resolve(value));
  const draft = importPackageSchema.extend({ status: z.literal("draft") }).parse(JSON.parse(fs.readFileSync(input, "utf8")));
  validateAssembly(draft.plan, draft.questions, draft.caseStudies);
  fs.writeFileSync(output, buildBlindQuestionsMarkdown(draft), { flag: "wx" });
  console.log(JSON.stringify({ id: draft.id, output, questionCount: draft.questions.length }));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Blind Markdown export failed");
  process.exitCode = 1;
}
