export type QuestionType =
  | "single_choice"
  | "multi_select"
  | "sequence_order"
  | "matching_magnet"
  | "dropdown_completion"
  | "case_study_child"
  | "code_or_config_artifact"
  | "log_or_artifact_interpretation"
  | "policy_control_selection";

export type Difficulty = "easy" | "medium" | "hard" | "very_hard";
export type DifficultyCounts = Record<Exclude<Difficulty, "easy">, number> & { easy?: number };

export interface PackRef { id: string; version: string }
export interface AuthoringProvenance {
  route: "codex-subscription" | "synthetic-fixture";
  model: string;
  reasoningEffort: string;
  authoredAt: string;
}
export interface ReleaseManifest {
  packageId: string;
  revision: string;
  packageSha256: string;
  manifestSha256: string;
  assetSha256: Record<string, string>;
  itemSha256: Record<string, string>;
  provenance: AuthoringProvenance;
  reviews: ItemReview[];
  status: "synthetic" | "released";
}
export interface ItemReview {
  itemId: string;
  itemSha256: string;
  verdict: "accept" | "revise" | "reject" | "unverifiable";
  reviewer: string;
  reviewedAt: string;
  sourceIds: string[];
  rationale: string;
}

export interface AnswerOption {
  id: "A" | "B" | "C" | "D" | "E" | string;
  text: string;
}

export interface OrderedAnswer {
  order: string[];
}

export interface MatchingAnswer {
  pairs: Record<string, string>;
}

export interface DropdownSlot {
  id: string;
  choices: string[];
}

export interface QuestionArtifact {
  title: string;
  kind:
    | "yaml"
    | "json"
    | "markdown"
    | "log"
    | "policy"
    | "pr_diff"
    | "workflow_output"
    | "terminal_output";
  content: string;
}

export interface Explanation {
  whyCorrect: string;
  whyDistractorsWrong: Record<string, string>;
  examStrategyNote?: string;
}

export interface SourceRef {
  sourceId?: string;
  snapshotSha256?: string;
  title: string;
  url?: string;
  repo?: string;
  docType:
    | "official_docs"
    | "official_repo"
    | "study_guide"
    | "github_docs"
    | "microsoft_learn";
}

export interface QuestionMetadata {
  generatedAt: string;
  model: string;
  reasoningEffort: string;
  batchId: string;
  validationStatus: "draft" | "validated" | "needs_review" | "rejected";
  correctOptionLengthRank?: "shortest" | "middle" | "longest";
  ambiguityScore?: number;
}

export interface PracticeQuestion {
  id: string;
  pack?: PackRef;
  revision?: string;
  examCode: string;
  domainId: string;
  domainName: string;
  objectiveTags: string[];
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  scenario?: string;
  artifact?: QuestionArtifact;
  caseStudyId?: string;
  options: AnswerOption[];
  matchChoices?: string[];
  statementTemplate?: string;
  slots?: DropdownSlot[];
  correctAnswer: string | string[] | OrderedAnswer | MatchingAnswer;
  explanation: Explanation;
  sourceRefs: SourceRef[];
  metadata: QuestionMetadata;
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  intro: string;
  sections: CaseStudySection[];
  artifacts?: QuestionArtifact[];
  questionIds: string[];
}

export interface DomainBlueprint {
  id: string;
  name: string;
  count: number;
}

export interface ItemTypeBlueprint {
  single_choice: number;
  multi_select: number;
  sequence_order: number;
  matching_magnet: number;
  case_study: number;
  code_or_config_artifact: number;
}

export interface GenerationPlan {
  pack?: PackRef;
  planningVersion?: string;
  totalQuestions: number;
  domains: DomainBlueprint[];
  itemTypes: ItemTypeBlueprint;
  caseStudyCount: number;
  difficulty: DifficultyCounts;
  batches: BatchPlan[];
}

export interface BatchPlan {
  id: string;
  domainId?: string;
  domainName?: string;
  typeFocus: (keyof ItemTypeBlueprint)[];
  difficultyFocus: Difficulty[];
  caseStudyId?: string;
  questionCount: number;
}

export interface ExamSet {
  id: string;
  pack?: PackRef;
  compatibility?: "legacy-gh-600";
  release?: ReleaseManifest;
  createdAt: string;
  plan: GenerationPlan;
  questions: PracticeQuestion[];
  caseStudies: CaseStudy[];
  antiBias: {
    answerPositionDistribution: Record<string, number>;
    longestOptionCorrectRatio: number;
  };
}

/** New artifacts require identity; optional base fields exist for legacy JSON only. */
export type PackGenerationPlan = GenerationPlan & { pack: PackRef; planningVersion: string };
export type ImportedExamSet = ExamSet & { pack: PackRef; plan: PackGenerationPlan; release: ReleaseManifest };

export interface Attempt {
  id: string;
  pack?: PackRef;
  examSha256?: string;
  examId: string;
  createdAt: string;
  answers: Record<string, unknown>;
  confidence: Record<string, "guessed" | "somewhat_confident" | "confident">;
  flagged: string[];
  score: {
    overall: number;
    correct: number;
    total: number;
    byDomain: Record<string, number>;
    incorrectQuestionIds: string[];
  };
}
