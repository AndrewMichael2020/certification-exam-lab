#!/usr/bin/env python3
"""Stage approved inputs and run lockfile CI in disposable OrbStack containers."""
import base64
import hashlib
import re
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
HARNESS = Path("/Users/antvibe/Documents/Dev/scripts/codex-node-isolated-run")
OUTPUT = ROOT / ".local-ci"


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def preservation():
    manifest = json.loads((ROOT / "docs/gh-600-preservation-baseline.json").read_text())
    failures = []
    for item in manifest["files"]:
        file = ROOT / item["path"]
        if not file.is_file() or file.stat().st_size != item["bytes"] or digest(file) != item["sha256"]:
            failures.append(item["path"])
    return {"checked": len(manifest["files"]), "failures": failures}


def main():
    os.chdir(ROOT)
    OUTPUT.mkdir(exist_ok=True)
    before = preservation()
    if before["failures"]:
        raise SystemExit("Preservation check failed: " + ", ".join(before["failures"]))
    lock = json.loads((ROOT / "package-lock.json").read_text())
    version = lock["packages"]["node_modules/@playwright/test"]["version"]
    image = f"mcr.microsoft.com/playwright:v{version}-noble"
    context = subprocess.check_output(["docker", "context", "show"], text=True).strip()
    if context != "orbstack":
        raise SystemExit("Select the OrbStack Docker context before local CI.")
    info = subprocess.run(["docker", "image", "inspect", image], capture_output=True, text=True)
    if info.returncode:
        raise SystemExit(f"Matching browser image missing. Run: docker pull {image}")
    image_id = json.loads(info.stdout)[0]["Id"]
    for package in lock["packages"].values():
        resolved = package.get("resolved", "")
        if resolved and not resolved.startswith("https://registry.npmjs.org/"):
            raise SystemExit("Review the non-npm registry dependency before CI.")
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    diff = subprocess.check_output(["git", "diff", "--binary", "HEAD"])
    inputs = {}
    qa_artifacts = []
    with tempfile.TemporaryDirectory(prefix="cert-ci-") as temporary:
        stage = Path(temporary)
        # Explicit allowlist: no env/config files, private attempts, or unrelated scripts.
        files = [ROOT / name for name in ["package.json", "package-lock.json", "tsconfig.json", "vitest.config.ts", "playwright.config.ts", "docs/gh-600-preservation-baseline.json", "data/published.json", "data/exams/exams.json", "scripts/e2e-server.ts", "scripts/ci-checks.mjs", "scripts/export-exam-pdf.ts", "scripts/import-exam.ts", "scripts/package-reviewed-exam.ts"]]
        for directory in ["src", "tests", "public", "prompts", "packs"]:
            files.extend(file for file in (ROOT / directory).rglob("*") if file.is_file() and file.name != ".DS_Store")
        manifest = json.loads((ROOT / "docs/gh-600-preservation-baseline.json").read_text())
        files.extend(ROOT / item["path"] for item in manifest["files"] if item["path"].endswith(".pdf"))
        for file in sorted(set(files)):
            if file.is_symlink() or file.name.startswith(".env"):
                raise SystemExit("Refusing an env file or symlink in CI inputs.")
            relative = file.relative_to(ROOT)
            destination = stage / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, destination)
            inputs[str(relative)] = digest(file)
        env = {"PATH": os.environ["PATH"], "HOME": os.environ["HOME"], "CODEX_ORBSTACK_USAGE_LOG": str(OUTPUT / "harness-usage.jsonl")}
        command = [str(HARNESS), "--project", "--network", "--test", "--image", image, "--memory", "3g", "--cpus", "2", "--command", "node scripts/ci-checks.mjs", str(stage)]
        run = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, env=env)
        details = None
        with (OUTPUT / "latest.log").open("w") as log:
            for line in run.stdout:
                match = re.match(r"LOCAL_QA_(PDF|IMAGE) (.+)", line)
                if match:
                    payload = json.loads(match[2])
                    name = payload["name"]
                    if not re.fullmatch(r"(ai-103|gh-600)-(practice|questions|answers)\.pdf|(ai-103|gh-600)-practice\.png|setup-preview\.png", name):
                        raise SystemExit("Unexpected QA artifact name")
                    artifact = OUTPUT / "session-2b-qa" / name
                    artifact.parent.mkdir(exist_ok=True)
                    artifact.write_bytes(base64.b64decode(payload["base64"], validate=True))
                    qa_artifacts.append({"path": str(artifact), "sha256": digest(artifact), "bytes": artifact.stat().st_size})
                    line = f"QA artifact captured: {name}\n"
                print(line, end="", flush=True)
                log.write(line)
                if line.startswith("LOCAL_CI_REPORT "):
                    details = json.loads(line[len("LOCAL_CI_REPORT "):])
        exit_code = run.wait()
    after = preservation()
    report = {"capturedAt": datetime.now(timezone.utc).isoformat(), "commit": commit, "diffSha256": hashlib.sha256(diff).hexdigest(), "inputSha256": inputs, "image": image, "imageId": image_id, "context": context, "install": "npm ci --ignore-scripts --no-audit --no-fund", "command": "node scripts/ci-checks.mjs", "runtime": details, "qaArtifacts": qa_artifacts, "preservationBefore": before, "preservationAfter": after, "exitCode": exit_code}
    (OUTPUT / "latest.json").write_text(json.dumps(report, indent=2) + "\n")
    print(f"Report: {OUTPUT / 'latest.json'}")
    return exit_code if exit_code else int(bool(after["failures"]) or details is None)


if __name__ == "__main__":
    sys.exit(main())
