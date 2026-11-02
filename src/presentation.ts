import { listPacks, LEGACY_GH600, samePack } from "./packs.js";

/** Public UI metadata, without filesystem paths, source bodies or authoring inputs. */
export function packCatalog() {
  return listPacks().map(pack => ({
    id: pack.id, version: pack.version, ref: pack.ref, examCode: pack.examCode,
    title: pack.title, objectiveEffectiveDate: pack.objectiveEffectiveDate,
    canPlan: !samePack(pack.ref, LEGACY_GH600), timing: pack.timing,
    domains: pack.domains.map(d => ({ id: d.id, name: d.name, weight: d.weight })),
    partialObjectiveCount: pack.domains.flatMap(d => d.objectives).filter(o => o.status === "partial").length,
  }));
}
