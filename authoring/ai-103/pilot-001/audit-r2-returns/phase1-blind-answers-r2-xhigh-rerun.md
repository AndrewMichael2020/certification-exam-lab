# AI-103 pilot 001 revision 2: Phase 1 blind answers, extra-high rerun

Recorded 2026-10-08 at about 07:07Z, at effort xhigh, in a fresh worker context that was allowed to read only 00-START-HERE.md, 01-BLIND-QUESTIONS.md and 02-SOURCE-EVIDENCE.md. It did not see 03, 04 or the earlier blind answers. This rerun exists because the original Phase 1 (`phase1-blind-answers-r2.md`, saved about 07:01Z) ran before Andrew switched the session to extra high. The original file is preserved unchanged.

Line ranges are the snapshot line numbers printed inside 02.

| Q | Rerun answer | Matches original blind answer | Evidence | Rerun difficulty |
| --- | --- | --- | --- | --- |
| Q1 | B | yes | S005 L11, L21-25, L39-49 | easy |
| Q2 | D | yes | S040 L5, L45-47, L887-892; S011 L74 | medium |
| Q3 | required ["order_id", "note"]; additional false; format text.format | yes | S037 L3, L977-979, L1005, L1020-1028, L1037-1039 | medium |
| Q4 | C | yes | S007 L113-127 | easy |
| Q5 | A | yes | S014 L18, L20, L27; S039 L9 | easy |
| Q6 | B | yes | S018 L633-635, L666-675, L882-883, L1131, L1147-1150, L1201 | easy |
| Q7 | A, E | yes | S009 L225-227, L259, L302-303 | easy |
| Q8 | B, E | yes | S042 L33, L93-102, L127-129 | medium |
| Q9 | C, A, D, B | yes | S046 L76-95, L102-118, L134-137, L174-185, L341, L381-386 | easy |
| Q10 | A fieldMappings; B outputFieldMappings; C Document Layout skill; D OCR skill; unused Query-time vectorizer | yes | S028 L151-156; S029 L7, L74; S043 L46-53; S026 L36-40 | medium |

Rerun difficulty counts: easy 6, medium 4, hard 0.

## Defects the rerun found blind

- Q6: nested code fences in 01 L109-124 break Markdown rendering. Q6 options A-D, the Q7 heading, the Q7 stem and the Q7 error summary render as one code block. This is the same defect the original Phase 1 found.
- Q7: all three distractors are eliminated by explicit stem constraints (retained state, token usage below quota, region policy). D is a source-sanctioned remedy, wrong only because of the policy constraint.
- Q5: the stem stipulates away Tool Call Success and Task Adherence.
- Q2: the source conflict between project and account managed identity does no harm, because the case stipulates the account identity and no option uses the project identity. The case facts narrow the choice to C versus D.
- Q3: "JSON mode without a schema" is a mode, not a request location, so it is a weak distractor. The template line and the choice line share the label "required:".
- Q4: S007 shows a single call, so pairing by call_id across several calls is an inference, though a sound one.
- Q10: S029 L7 says Document Layout supports image extraction, a slight overlap with row D. Row D's wording still forces OCR.
- Cosmetic, in 02: S037 L1036-1039 is printed twice. S018 L666 polls for "cancelled", but L635 lists four states.
