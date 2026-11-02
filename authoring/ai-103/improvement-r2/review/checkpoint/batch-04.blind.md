# AI-103 pilot — blind questions

Package: ai103-improvement-r2-checkpoint-20; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-checkpoint-20-q012

An image safety policy evaluates four harm categories and rejects any severity of 4 or 6. Which TWO implementation decisions match the image:analyze 2024-09-01 contract? Select TWO answers.

- **A.** Request FourSeverityLevels for the image analysis.
- **B.** Average all categories before applying the rejection threshold.
- **C.** Use EightSeverityLevels as the documented image output scale.
- **D.** Treat HTTP success as an approval verdict.
- **E.** Evaluate the policy against each of the four harm categories.

## Q2 — ai103-improvement-r2-checkpoint-20-q013

A model supports masked image edits. The client must change one area of an existing image. Which TWO inputs are directly relevant to the edit definition? Select TWO answers.

- **A.** A same-size PNG mask marking edit areas with transparent pixels.
- **B.** A JPEG mask with the source dimensions but no transparency.
- **C.** A mask resized to the requested output dimensions instead of the source dimensions.
- **D.** A same-size mask whose opaque pixels mark the replacement area.
- **E.** The source image and a prompt describing the intended change.

## Q3 — ai103-improvement-r2-checkpoint-20-q014

A team evaluates the video-analysis 2026-06-01-preview contract for fast events and tiny labels. Which TWO limitations belong in its evaluation plan? Select TWO answers.

- **A.** OCR retains original source resolution for every sampled frame.
- **B.** Scene segmentation removes the temporal frame-sampling limit.
- **C.** About one-frame-per-second sampling can miss brief events.
- **D.** Every source frame is analyzed, but only key frames are returned.
- **E.** Resizing to 512 by 512 can lose small or distant details.

## Q4 — ai103-improvement-r2-checkpoint-20-q015

Mixed-language segments were submitted together for translation. Which TWO changes directly target the documented input problem? Select TWO answers.

- **A.** Use the intended source language for each segment.
- **B.** Separate single-language segments.
- **C.** Increase the translated response length limit.
- **D.** Detect one source language and submit the whole mixture unchanged.
- **E.** Move the unchanged mixture to the document endpoint.

## Q5 — ai103-improvement-r2-checkpoint-20-q016

A source document exceeds the embedding input limit. Arrange the dependency chain that produces searchable chunk vectors.

- **A.** Embed each prepared chunk.
- **B.** Index the chunk text and its compatible vectors.
- **C.** Read the document text.
- **D.** Create chunks within the input limit.

## Q6 — ai103-improvement-r2-checkpoint-20-q017

A configured document analyzer returns a long-running operation. Arrange the dependency chain for sending completed extraction to a RAG pipeline.

- **A.** Submit document analysis.
- **B.** Wait for successful operation completion.
- **C.** Pass that result to downstream ingestion.
- **D.** Read the completed structured/Markdown result.

## Q7 — ai103-improvement-r2-checkpoint-20-q018

Match each speech requirement to the relevant capability. Use each selected choice once; one choice is unused.

- **A.** Recognize source speech and obtain target-language text
- **B.** Adapt recognition to specialist terminology using domain data
- **C.** Render supplied text as spoken audio

Choices: Custom Speech | Speech translation | Text-to-speech synthesis | Image analysis

## Q8 — ai103-improvement-r2-checkpoint-20-q019

Match each text task to the most targeted Language capability. Use each selected choice once; one choice is unused.

- **A.** Locate personal identifiers for redaction
- **B.** Label organizations and locations using predefined categories
- **C.** Identify a message language for routing

Choices: PII detection | Language detection | Named entity recognition | Sentiment analysis

