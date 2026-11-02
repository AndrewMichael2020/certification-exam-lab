# Local CI

Run from `/Users/antvibe/Documents/Dev/cert-exam-lab-local`:

```sh
python3 scripts/local-ci.py
```

`npm run ci:local` runs the same command when Node/npm are available on the host.
Python 3, Docker's `orbstack` context, and the installed Codex Node isolation
harness are prerequisites. Host `node_modules` and API credentials are unnecessary.
The matching Microsoft Playwright image must already be cached. If the runner
reports it missing, approve/download the exact image it names; currently:

```sh
docker pull mcr.microsoft.com/playwright:v1.60.0-noble
```

The image tag is derived from `package-lock.json`, and its local image ID is recorded.
CI stages an explicit input allowlist in a temporary directory, rejects symlink/env
file inputs and non-npm dependency registries, mounts it read-only, and uses
`codex-node-isolated-run --project`. The harness copies inputs to `/var/tmp/work`
inside a disposable container and installs with
`npm ci --ignore-scripts --no-audit --no-fund`. Dependency lifecycle scripts are
disabled. Network is enabled for npm downloads; app generation and cloud PDF access
are explicitly blocked by `STUDY_OFFLINE=1`. Container networking is not an egress
firewall. No credentials or private attempts are staged or forwarded.

The command runs Vitest, TypeScript build, and Chromium Playwright tests. Each test
stage has a three-minute process timeout. Browser servers use dedicated ports 4317
and 4318, bind to loopback inside the container, and are never published to the Mac.
An occupied test port causes failure rather than server reuse. The browser server
creates its own disposable store with a synthetic 20-question fixture containing
all nine supported formats, plus copies of the original corpus/PDFs. Production
filtering and mutation gates are checked in a separate temporary store. Fixture
content tests mechanics and carries no exam-content quality endorsement.

CI checks all 21 preservation hashes before and after execution, downloads all
four original PDFs and compares their hashes, and exercises synthetic PDF export
through both API and CLI. It verifies PDF file headers, identity, local storage,
and status lookup. Full PDF layout/citation quality review remains a release check.
Session 2A adds both-pack import/assembly, all-format answer validation, exact quota,
review-hash, atomic/immutable storage, attempt binding and mixed-pack drill checks,
plus offline API/CLI import and production import/assembly gates. The complete
versioned packs are staged; runtime `data/packs/` and private attempts are excluded.

Session 2B adds both-pack selector/import/plan preview, configurable practice timing,
all-format exam and Practice interactions, source review, report/drill identity,
empty/error/stale-preview handling, and three immutable PDF variants per pack.
It captures six synthetic PDFs and three browser screenshots under the ignored
`.local-ci/session-2b-qa/` for main-agent visual inspection; the report records their
hashes and sizes. These artifacts contain mechanics fixtures only. PDF text/link
checks and representative raster review are recorded in the Session 2B closeout.

Reports are private/ignored in `.local-ci/latest.json` and `.local-ci/latest.log`.
The JSON records commit, tracked diff hash, exact staged input hashes, image ID,
tool versions, stage commands/status/durations, and before/after preservation.
Harness metadata goes to `.local-ci/harness-usage.jsonl`, avoiding a write outside
the project. The temporary source copy and container outputs are removed on normal
completion. No host dependencies/build outputs, commits, pushes, or deployments
are produced. Existing Kubernetes workloads are independent of this harness.

## Study startup

```sh
STUDY_OFFLINE=1 npm run dev
```

This starts the app at `http://127.0.0.1:3000` with optional `.env` loading.
It requires an existing Node/dependency installation; CI does not install on the
host. In an already installed project, `npm run build` then
`STUDY_OFFLINE=1 npm start` starts the compiled app. Offline mode permits local
study, attempts, and PDFs while rejecting provider generation and cloud storage.

- `EXAM_DATA_ROOT`: absolute or cwd-relative runtime data directory. Default:
  `/Users/antvibe/Documents/Dev/cert-exam-lab-local/data` when started here. Exams,
  attempts, publication entries, PDF output and serving all use this root.
- `HOST`: explicit bind address. Development defaults to `127.0.0.1`;
  `NODE_ENV=production` defaults to `0.0.0.0` for container compatibility.
- `PORT`: server port, default 3000.
- `REQUESTS_PER_MINUTE`: positive whole-number request limit, default 120. The
  disposable dev regression server uses 1000 for sequential full-flow checks;
  the separate production server retains 120.
- `STUDY_OFFLINE=1`: blocks provider generation and cloud PDF storage even if
  provider/bucket variables are configured.

The baseline proves Node 22 unit/build operation and Node 24 local CI. Node 20
deployment compatibility must be checked before any deployment. The legacy
provider retries/checkpoint defects remain deferred. Session 2A verifies the new
offline import/storage contracts; Session 2B verifies the selector, source-aware
study flow and both-pack PDF integration. Reviewed AI-103 authoring/manual audit
remains Session 3 work.
