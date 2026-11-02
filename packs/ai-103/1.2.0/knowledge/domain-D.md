# D — Text analysis and speech

Official range: 10–15%. Local practice weight: 13%, a planning choice. Eight bullets have evidence for bounded authoring; this is not a claim that every language/audio API has been exercised.

## Text outputs with a contract

Use defined Language capabilities for NER/PII/language detection and schema-constrained generation for domain extraction or summaries. The current overview separates actively evolving core features from supported legacy sentiment/summarization features. Language summarization has a future March 31, 2029 retirement; new-project guidance favors Foundry. Retirement does not remove a word from the exam outline. [F030A, F031A–B]

Strict structured output differs from JSON mode. Chat Completions uses response_format; Responses uses text.format. The supported subset requires required fields and additionalProperties false, using nullable required fields for optional values. Inspect extracted meaning and source support separately from parseable structure. [F037A–C]

Sentiment/tone, personal data and harmful content are different signals. An angry support message can be legitimate; a pleasant message can expose sensitive data. Configure the right category/tool/action. Safety moderation does not prove PII removal or domain compliance. [F015A, F030A, F048A]

Translator offers text, synchronous-document, asynchronous-document and customization paths. The captured current overview separates v3 from the 2026-06-06 GA text API. Synchronous single-document and asynchronous batch modes differ in storage/formatting needs. A domain translation should preserve required terminology and be evaluated against representative examples. [F032A]

## Speech is several stages

| Task | Useful service/interface | Distinction |
| --- | --- | --- |
| Recognize domain speech | Speech STT / Custom Speech | Recognition model, not custom synthesis voice |
| Generate spoken output | Speech TTS | Separate artifact from recognized text |
| Managed conversation | Voice Live | Integrated recognition/generation/synthesis |
| Audio-capable realtime interaction | Eligible GPT Realtime API | Session/channel/turn configuration matters |
| Translate source speech | Speech translation | Target text and target audio are separate outputs |

Custom Speech evaluates/trains recognition with domain data and deploys a custom endpoint. Improve transcription errors before blaming the answer model for misunderstood product codes. Integrating customization into an agent still requires compatibility checks for the selected product/channel. [F033A, F034A]

Voice Live integrates recognition, generation and synthesis. Realtime audio supports different connection modes, turn detection and interruption handling. A transcript-only flow does not establish general audio reasoning; study the input/output/session contract that actually supports the required modality. [F035A, F036A]

Speech translation configures a source recognition locale and target language(s). Inspect recognition/translation status and handle NoMatch/Canceled; synthesize target speech when the chosen workflow requires it. The code-reading file shows configuration primitives, not an executed microphone/cloud example. [F046A]

For domain extraction or compliance summaries, use explicit schema/instructions, cite source clauses and review factual correctness. A correctly formatted model summary is not an authoritative compliance judgment.



See improvement-notes.md for the 1.2.0 implementation additions and coverage.json for objective reassessments.
