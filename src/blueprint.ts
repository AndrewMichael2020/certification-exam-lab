import type { BatchPlan, DifficultyCounts, GenerationPlan, ItemTypeBlueprint, PackRef } from "./types.js";
import { LEGACY_GH600, resolvePack, samePack } from "./packs.js";

/** Largest remainder rounding; manifest order breaks ties deterministically. */
export function allocateCounts(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map(w => w * total / sum);
  const counts = exact.map(Math.floor);
  const order = exact.map((n, i) => ({ i, remainder: n - counts[i] })).sort((a, b) => b.remainder - a.remainder || a.i - b.i);
  for (let left = total - counts.reduce((a, b) => a + b, 0), i = 0; left > 0; left--, i++) counts[order[i].i]++;
  return counts;
}

export function buildBlueprint(totalQuestions: number, ref: PackRef): GenerationPlan {
  if (!Number.isInteger(totalQuestions) || totalQuestions < 1 || totalQuestions > 200) throw new Error("Question count must be an integer between 1 and 200");
  const pack = resolvePack(ref);
  if (samePack(ref, LEGACY_GH600)) throw new Error("GH-600 1.0.0 is read-only history; use 1.1.0 for new plans");
  const counts = allocateCounts(pack.domains.map(d => d.weight), totalQuestions);
  const domains = pack.domains.map((d, i) => ({ id: d.id, name: d.name, count: counts[i] }));
  // Practice format proportions; no assertion of official exam format parity.
  const keys: (keyof ItemTypeBlueprint)[] = ["single_choice", "multi_select", "sequence_order", "matching_magnet", "case_study", "code_or_config_artifact"];
  const itemCounts = allocateCounts([42, 18, 10, 8, 16, 6], totalQuestions);
  if (totalQuestions < 10) { itemCounts[0] += itemCounts[2] + itemCounts[3] + itemCounts[4]; itemCounts[2] = itemCounts[3] = itemCounts[4] = 0; }
  const itemTypes = Object.fromEntries(keys.map((key, i) => [key, itemCounts[i]])) as unknown as ItemTypeBlueprint;
  const cases = Math.min(itemTypes.case_study, totalQuestions >= 100 ? 4 : totalQuestions >= 70 ? 3 : totalQuestions >= 20 ? 2 : totalQuestions >= 10 ? 1 : 0);
  const difficultyCounts = allocateCounts([35, 45, 20], totalQuestions);
  const difficulty = Object.fromEntries((["medium", "hard", "very_hard"] as const).map((key, i) => [key, difficultyCounts[i]])) as DifficultyCounts;
  const remaining = [...counts];
  const batches: BatchPlan[] = [];
  const add = (index: number, count: number, type: keyof ItemTypeBlueprint, caseStudyId?: string) => {
    remaining[index] -= count;
    batches.push({ id: `batch-${batches.length + 1}`, domainId: domains[index].id, domainName: domains[index].name,
      typeFocus: [type], difficultyFocus: ["medium", "hard", "very_hard"], questionCount: count, ...(caseStudyId ? { caseStudyId } : {}) });
  };
  // Allocate intact case groups first, then consume remaining domain capacity exactly.
  if (cases) {
    const sizes = allocateCounts(Array(cases).fill(1), itemTypes.case_study);
    sizes.forEach((size, i) => {
      const index = remaining.indexOf(Math.max(...remaining));
      if (remaining[index] < size) throw new Error("Case group cannot fit domain quota");
      add(index, size, "case_study", `case-${i + 1}`);
    });
  }
  for (const type of keys.filter(k => k !== "case_study")) {
    let left = itemTypes[type];
    while (left > 0) {
      const index = remaining.indexOf(Math.max(...remaining));
      const count = Math.min(left, remaining[index], 10);
      if (!count) throw new Error("Invalid planner capacity");
      add(index, count, type); left -= count;
    }
  }
  return { pack: pack.ref, planningVersion: pack.planningVersion, totalQuestions, domains, itemTypes, caseStudyCount: cases, difficulty, batches };
}

export const ASSESSED_PLANNING_VERSION = "exact-quotas-assessed-difficulty-v1";

/** Offline reviewed content may declare assessed counts rather than inflate labels to a target. */
export function buildAssessedBlueprint(total: number, ref: PackRef, counts: unknown): GenerationPlan {
  const keys = ["easy", "medium", "hard", "very_hard"] as const;
  if (!counts || typeof counts !== "object" || Array.isArray(counts)) throw new Error("Assessed difficulty counts are required");
  const values = counts as Record<string, unknown>;
  if (Object.keys(values).length !== keys.length || keys.some(k => !Number.isInteger(values[k]) || Number(values[k]) < 0) || keys.reduce((n, k) => n + Number(values[k]), 0) !== total) {
    throw new Error("Assessed difficulty requires all four nonnegative integer counts totaling the question count");
  }
  const plan = buildBlueprint(total, ref);
  return { ...plan, planningVersion: ASSESSED_PLANNING_VERSION,
    difficulty: Object.fromEntries(keys.map(k => [k, values[k]])) as DifficultyCounts,
    batches: plan.batches.map(batch => ({ ...batch, difficultyFocus: [...keys] })) };
}
