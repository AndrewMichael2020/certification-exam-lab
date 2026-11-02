# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q082

A voice assistant uses a text-only response model and a separate speech synthesizer. The application requires its response-text policy check to pass before any answer audio is emitted. Arrange the successful path for one recorded utterance.

- **A.** Generate a text response from that transcript.
- **B.** Recognize the utterance into finalized text.
- **C.** Apply the required response-text policy check.
- **D.** Synthesize and emit the approved response text.

## Q2 — ai103-improvement-r2-set-a-100-q083

A Custom Speech project and training data are ready. A new model must meet a held-out WER threshold before deployment, and the application will use it for real-time recognition, not batch transcription. Arrange the remaining operations.

- **A.** Evaluate that model on the held-out set and confirm the WER gate passes.
- **B.** Deploy the approved model to a custom endpoint.
- **C.** Train the custom model with the prepared domain data.
- **D.** Send real-time recognition requests to that custom endpoint.

## Q3 — ai103-improvement-r2-set-a-100-q084

A Realtime assistant must interpret a recorded inspection question in the context of a written maintenance note for the same equipment. Its supported audio model and transport are ready. Host policy requires checking the returned interpretation against that note before offering a repair action. Arrange the application’s operations.

- **A.** Prepare the supported audio input and text context for that equipment’s conversation.
- **B.** Check that interpretation against the maintenance note before offering the repair action.
- **C.** Collect the utterance and its associated maintenance note.
- **D.** Submit the prepared input and obtain the successful interpretation.

## Q4 — ai103-improvement-r2-set-a-100-q085

An event-based Speech SDK translator must retain the first completed translated utterance. Credentials and AudioConfig are ready. It uses a TranslationRecognizer whose recognized callback stores successful translations. Arrange initialization so the handler is ready when recognition begins.

- **A.** Create the TranslationRecognizer from that translation configuration and AudioConfig.
- **B.** Configure SpeechTranslationConfig with the source and target languages.
- **C.** Connect the storage callback to the recognizer’s recognized event.
- **D.** Start continuous recognition on the configured recognizer.

## Q5 — ai103-improvement-r2-set-a-100-q086

A store-and-forward speech translator uses manual synthesis for two target languages. It will deliver an audio file only after synthesis succeeds. Arrange the successful path for the selected target language; no translation result is available initially.

- **A.** Synthesize that text with a voice supporting the selected target language.
- **B.** Deliver the successfully synthesized audio file.
- **C.** Select the requested language’s text from the successful result’s translations.
- **D.** Recognize and translate the source utterance.

## Q6 — ai103-improvement-r2-set-a-100-q087

Match each workload requirement to its deployment family. Geography and model support have already been checked. Use each selected choice once; one choice is unused.

- **A.** Deferred asynchronous groups of inference requests
- **B.** Variable interactive demand with per-token charges
- **C.** Allocated throughput for sustained traffic

Choices: Developer | Batch | Provisioned | Standard

## Q7 — ai103-improvement-r2-set-a-100-q088

Match each investigation to the most direct evidence source. Use each selected choice once; one choice is unused.

- **A.** A slow operation inside one scored agent request
- **B.** Missing source documents after a partially successful run
- **C.** Query-serving throttling during traffic peaks

Choices: Search service operational metrics | Indexer item errors and warnings | Correlated trace and nested spans | Aggregate billing report

## Q8 — ai103-improvement-r2-set-a-100-q089

Match each keyless inference observation to the boundary to inspect. Use each selected choice once; one choice is unused.

- **A.** A token is acquired but the resource denies inference
- **B.** The role exists only on a different resource
- **C.** No Entra token can be acquired

Choices: Credential/authentication configuration | Inference authorization for the caller | Role assignment scope covering the called resource | Generation sampling parameters

## Q9 — ai103-improvement-r2-set-a-100-q090

Match each trust boundary to the relevant inspection point. Use each selected choice once; one choice is unused.

- **A.** An instruction inserted into a retrieved document
- **B.** A harmful generated response
- **C.** A user’s submitted attack instruction

Choices: User-input protection | External-context/indirect-attack protection | Final-output inspection | Model token quota

