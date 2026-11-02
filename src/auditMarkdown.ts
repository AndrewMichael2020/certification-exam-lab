import type { CaseStudy, PackRef, PracticeQuestion } from "./types.js";

/** A closing fence inside an exhibit must never terminate its outer code block. */
export function fencedExhibit(content: string): string {
  const longest = Math.max(0, ...[...content.matchAll(/`+/g)].map(match => match[0].length));
  const fence = "`".repeat(Math.max(3, longest + 1));
  return `${fence}text\n${content}\n${fence}`;
}

type BlindPacket = {
  id: string;
  revision: string;
  pack: PackRef;
  questions: PracticeQuestion[];
  caseStudies: CaseStudy[];
};

/** Blind presentation excludes keys, explanations, difficulty estimates and review verdicts. */
export function buildBlindQuestionsMarkdown(draft: BlindPacket): string {
  const lines = ["# AI-103 pilot — blind questions", "",
    `Package: ${draft.id}; revision: ${draft.revision}; pack: ${draft.pack.id}@${draft.pack.version}.`, "",
    "Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.", ""];
  for (const context of draft.caseStudies) {
    const numbers = context.questionIds.map(id => draft.questions.findIndex(q => q.id === id) + 1);
    lines.push(`## Shared case: ${context.title}`, "", `Applies to ${numbers.map(n => `Q${n}`).join(" and ")}. Each child is independent.`, "", context.intro, "");
    for (const section of context.sections) lines.push(`### ${section.heading}`, "", section.body, "");
  }
  draft.questions.forEach((question, index) => {
    lines.push(`## Q${index + 1} — ${question.id}`, "");
    if (question.caseStudyId) lines.push(`Use shared case ${question.caseStudyId} above.`, "");
    lines.push(question.stem, "");
    if (question.scenario) lines.push(question.scenario, "");
    if (question.artifact) lines.push(`### ${question.artifact.title}`, "", fencedExhibit(question.artifact.content), "");
    if (question.type === "dropdown_completion") {
      lines.push(fencedExhibit(question.statementTemplate ?? ""), "");
      for (const slot of question.slots ?? []) lines.push(`- Choices for **${slot.id}**: ${slot.choices.join(" | ")}`);
    } else {
      for (const option of question.options) lines.push(`- **${option.id}.** ${option.text}`);
      if (question.matchChoices) lines.push("", `Choices: ${question.matchChoices.join(" | ")}`);
    }
    lines.push("");
  });
  return `${lines.join("\n")}\n`;
}
