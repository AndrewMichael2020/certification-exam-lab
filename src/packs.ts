import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import type { PackRef } from "./types.js";

export const packRefSchema = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), version: z.string().regex(/^\d+\.\d+\.\d+$/) }).strict();
const shaSchema = z.string().regex(/^[a-f0-9]{64}$/);
const manifestSchema = z.object({
  id: z.string(), version: z.string(), examCode: z.string(), title: z.string(),
  objectiveEffectiveDate: z.string().nullable(), status: z.enum(["foundation", "ready"]),
  planningVersion: z.literal("exact-quotas-v1"), domainIdPolicy: z.string(),
  domains: z.array(z.object({ id: z.string(), name: z.string(), weight: z.number().positive(),
    officialRange: z.tuple([z.number(), z.number()]).optional(),
    objectives: z.array(z.object({ id: z.string(), title: z.string(), status: z.enum(["ready", "partial"]).optional() })).min(1) })).min(1),
  supportedFormats: z.array(z.string()).min(1),
  timing: z.object({ minutesPerQuestion: z.number().positive(), kind: z.literal("practice") }),
  providerGeneration: z.boolean(),
  sources: z.array(z.object({ id: z.string(), title: z.string(), url: z.url(), snapshot: z.string(),
    sha256: shaSchema, status: z.enum(["fetched", "inherited"]), fetchedAt: z.string().optional(), objectiveIds: z.array(z.string()).optional() })).min(1),
  knowledge: z.record(z.string(), z.string()),
  prompts: z.object({ author: z.string(), review: z.string() }), assets: z.record(z.string(), shaSchema),
}).strict();
export type ExamPack = z.infer<typeof manifestSchema> & { ref: PackRef; manifestSha256: string; root: string };
const registry: Record<string, string> = {
  "gh-600@1.0.0": "packs/gh-600/1.0.0/manifest.json",
  "gh-600@1.1.0": "packs/gh-600/1.1.0/manifest.json",
  "ai-103@1.1.0": "packs/ai-103/1.1.0/runtime-manifest.json",
  "ai-103@1.2.0": "packs/ai-103/1.2.0/runtime-manifest.json",
};
export const LEGACY_GH600: PackRef = { id: "gh-600", version: "1.0.0" };
export const CURRENT_GH600: PackRef = { id: "gh-600", version: "1.1.0" };
export const CURRENT_AI103: PackRef = { id: "ai-103", version: "1.1.0" };
export const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
/** Stable hashes bind review to JSON values, independent of object key order. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).filter(k => (value as Record<string, unknown>)[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${canonicalJson((value as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(value);
}
export const contentHash = (value: unknown) => sha256(canonicalJson(value));
export function samePack(a: PackRef | undefined, b: PackRef | undefined): boolean {
  return Boolean(a && b && a.id === b.id && a.version === b.version);
}

function assetPath(root: string, relative: string): string {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).some(s => s === ".." || !s)) throw new Error("Invalid pack asset path");
  const target = path.join(root, relative);
  const real = fs.realpathSync(target);
  if (!real.startsWith(`${fs.realpathSync(root)}${path.sep}`)) throw new Error("Pack asset escapes its directory");
  return target;
}
export function resolvePack(input: unknown): ExamPack {
  const ref = packRefSchema.parse(input);
  const registered = registry[`${ref.id}@${ref.version}`];
  if (!registered) throw new Error(`Unknown pack ${ref.id}@${ref.version}`);
  const root = path.dirname(path.resolve(registered));
  const raw = fs.readFileSync(path.resolve(registered));
  const manifest = manifestSchema.parse(JSON.parse(raw.toString()));
  if (!samePack(ref, manifest)) throw new Error("Registered pack identity mismatch");
  if (new Set(manifest.domains.map(d => d.id)).size !== manifest.domains.length || manifest.domains.reduce((sum, d) => sum + d.weight, 0) !== 100) throw new Error("Invalid pack domain weights/identities");
  if (new Set(manifest.sources.map(s => s.id)).size !== manifest.sources.length) throw new Error("Duplicate pack source identity");
  for (const domain of manifest.domains) if (new Set(domain.objectives.map(o => o.id)).size !== domain.objectives.length) throw new Error("Duplicate objective identity");
  for (const [relative, expected] of Object.entries(manifest.assets)) {
    if (sha256(fs.readFileSync(assetPath(root, relative))) !== expected) throw new Error(`Pack asset hash mismatch: ${relative}`);
  }
  for (const relative of [...Object.values(manifest.knowledge), ...Object.values(manifest.prompts)]) {
    if (!manifest.assets[relative]) throw new Error(`Missing registered pack material: ${relative}`);
  }
  for (const domain of manifest.domains) if (!manifest.knowledge[domain.id]) throw new Error(`Missing domain knowledge: ${domain.id}`);
  for (const source of manifest.sources) if (manifest.assets[source.snapshot] !== source.sha256) throw new Error(`Source snapshot hash mismatch: ${source.id}`);
  return { ...manifest, ref, root, manifestSha256: sha256(raw) };
}
export function readPackMaterial(ref: PackRef, kind: "author" | "review" | "knowledge", domainId?: string): string {
  const pack = resolvePack(ref);
  const relative = kind === "knowledge" ? pack.knowledge[domainId ?? ""] : pack.prompts[kind];
  if (!relative) throw new Error(`Missing ${kind} material for ${pack.id}/${domainId ?? ""}`);
  // Resolution validates hashes on every access; no shared domain-only cache or fallback.
  return fs.readFileSync(assetPath(pack.root, relative), "utf8");
}
export const listPacks = () => Object.keys(registry).map(key => {
  const [id, version] = key.split("@"); const pack = resolvePack({ id, version });
  const { root: _root, assets: _assets, knowledge: _knowledge, prompts: _prompts, ...summary } = pack;
  return summary;
});
