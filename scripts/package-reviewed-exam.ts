/** Offline exact-audit conversion. Output files do not import or publish an exam. */
import fs from "node:fs";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { packageReviewedDraft } from "../src/reviewPackaging.js";

const args = process.argv.slice(2);
try {
  if (args.length !== 3) throw new Error("Usage: tsx scripts/package-reviewed-exam.ts <draft.json> <accepted-audit.json> <new-output-directory>");
  const [draftFile, auditFile, output] = args.map(a => path.resolve(a));
  const result = packageReviewedDraft(JSON.parse(fs.readFileSync(draftFile, "utf8")), JSON.parse(fs.readFileSync(auditFile, "utf8")));
  if (fs.existsSync(output)) throw new Error("Output directory already exists; preserve it and choose a new directory");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const staging = path.join(path.dirname(output), `.review-package-${randomUUID()}`);
  fs.mkdirSync(staging);
  try {
    for (const [name, value] of [["package.released.json", result.package], ["exam.json", result.exam], ["release-manifest.json", result.exam.release]]) {
      fs.writeFileSync(path.join(staging, name as string), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
    }
    fs.copyFileSync(auditFile, path.join(staging, "accepted-audit.json"));
    const artifacts = Object.fromEntries(fs.readdirSync(staging).map(name => [name, createHash("sha256").update(fs.readFileSync(path.join(staging, name))).digest("hex")]));
    fs.writeFileSync(path.join(staging, "package-manifest.json"), JSON.stringify({ ...result.audit, artifacts }, null, 2) + "\n");
    fs.renameSync(staging, output);
  } finally { if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true }); }
  console.log(JSON.stringify({ id: result.package.id, output, status: "released package prepared; import separately" }));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Packaging failed"); process.exitCode = 1;
}
