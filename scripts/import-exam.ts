/** Offline JSON import; dependencies intentionally exclude the provider client. */
import { readFile } from "node:fs/promises";
import { assembleImportedExam } from "../src/importer.js";
import { saveExam } from "../src/persistence.js";

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const files = args.filter(arg => arg !== "--check");
if (files.length !== 1 || files[0].startsWith("--")) {
  console.error("Usage: npm run import-exam -- [--check] /absolute/path/package.json");
  process.exit(1);
}
try {
  const exam = assembleImportedExam(JSON.parse(await readFile(files[0], "utf8")));
  if (!checkOnly) await saveExam(exam);
  console.log(JSON.stringify({ action: checkOnly ? "validated" : "imported", id: exam.id, pack: exam.pack,
    questionCount: exam.questions.length, status: exam.release.status, packageSha256: exam.release.packageSha256,
    itemSha256: exam.release.itemSha256 }));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Import failed");
  process.exitCode = 1;
}
