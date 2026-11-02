import { expect, it } from "vitest";
import { buildBlindQuestionsMarkdown, fencedExhibit } from "../src/auditMarkdown.js";
import { syntheticPackage } from "./fixtures/importPackage.js";

it("uses a minimum three-backtick fence for plain exhibits", () => {
  expect(fencedExhibit("a log line")).toBe("```text\na log line\n```");
});

it("chooses a fence longer than every inner backtick run", () => {
  for (const count of [3, 4, 7]) {
    const inner = "`".repeat(count);
    const content = `${inner}python\nrequest()\n${inner}\n\n${inner}json\n{}\n${inner}`;
    expect(fencedExhibit(content)).toBe(`${"`".repeat(count + 1)}text\n${content}\n${"`".repeat(count + 1)}`);
  }
});

it("keeps following choices and question headings outside a nested exhibit", () => {
  const draft = syntheticPackage(undefined, 10);
  draft.questions[5].artifact = { title: "Nested exhibit", kind: "markdown", content: "```python\nrequest()\n```\n\n```json\n{}\n```" };
  const markdown = buildBlindQuestionsMarkdown(draft);
  const exhibit = fencedExhibit(draft.questions[5].artifact!.content);
  expect(markdown).toContain(`${exhibit}\n\n- **A.** Synthetic first option`);
  expect(markdown.indexOf("## Q7")).toBeGreaterThan(markdown.indexOf(exhibit) + exhibit.length);
  expect(markdown).toContain("Applies to Q1 and Q2. Each child is independent.");
  expect(markdown).not.toContain("Synthetic correct-answer explanation");
  expect(markdown).not.toContain("whyDistractorsWrong");
});

it("labels dropdown choice lists separately from the settings template", () => {
  const draft = syntheticPackage();
  const markdown = buildBlindQuestionsMarkdown(draft);
  expect(markdown).toContain("- Choices for **slot1**: One | Two");
  expect(markdown).not.toContain("Synthetic key explanation");
});
