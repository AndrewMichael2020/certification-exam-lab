import { spawnSync } from "node:child_process";
import fs from "node:fs";

// Executed only inside the disposable project copy.
const stages = [];
for (const args of [["test"], ["run", "build"], ["run", "test:e2e"]]) {
  const started = Date.now();
  const result = spawnSync("npm", args, { stdio: "inherit", timeout: 180_000, env: { ...process.env, STUDY_OFFLINE: "1", OPENAI_API_KEY: "", GCS_BUCKET: "" } });
  stages.push({ command: `npm ${args.join(" ")}`, exitCode: result.status ?? 1, seconds: (Date.now() - started) / 1000 });
}
const report = {
  node: process.version,
  npm: spawnSync("npm", ["--version"], { encoding: "utf8" }).stdout.trim(),
  playwright: JSON.parse(fs.readFileSync("node_modules/@playwright/test/package.json", "utf8")).version,
  stages,
};
console.log(`LOCAL_CI_REPORT ${JSON.stringify(report)}`);
process.exit(stages.some(stage => stage.exitCode !== 0) ? 1 : 0);
