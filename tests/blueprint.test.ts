import { describe, expect, it } from "vitest";
import { buildBlueprint as buildPackBlueprint } from "../src/blueprint.js";

const buildBlueprint = (count: number) => buildPackBlueprint(count, { id: "gh-600", version: "1.1.0" });

describe("buildBlueprint", () => {
  it("uses updated domain distribution for 100 (within official ranges)", () => {
    const plan = buildBlueprint(100);
    // New base: A=17, B=21, C=14, D=17, E=18, F=13 — all within official bands
    expect(plan.domains.map((d) => d.count)).toEqual([17, 21, 14, 17, 18, 13]);
    expect(plan.itemTypes.case_study).toBe(16);
  });

  it("all batches have an explicit domainId", () => {
    const plan = buildBlueprint(100);
    const untagged = plan.batches.filter((b) => !b.domainId);
    expect(untagged).toHaveLength(0);
  });

  it("scales to 30 and includes required types", () => {
    const plan = buildBlueprint(30);
    expect(plan.totalQuestions).toBe(30);
    expect(plan.itemTypes.case_study).toBeGreaterThan(0);
    expect(plan.itemTypes.multi_select).toBeGreaterThan(0);
    expect(plan.itemTypes.code_or_config_artifact).toBeGreaterThan(0);
  });

  it("scales to 70 with 3 case studies", () => {
    const plan = buildBlueprint(70);
    expect(plan.caseStudyCount).toBe(3);
  });
});
