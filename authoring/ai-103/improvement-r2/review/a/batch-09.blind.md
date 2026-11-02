# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q054

A vision model receives two images of the same machine. The app needs a concise caption comparing visible differences. What should be supplied?

- **A.** Attach only the first image and describe the second image’s filename.
- **B.** Both supported image inputs with an explicit comparison/caption instruction.
- **C.** Attach both images but ask only for an independent caption of the first.
- **D.** Send a text-only comparison request containing both image URLs as prose.

## Q2 — ai103-improvement-r2-set-a-100-q055

Complete a vision chat message so a question about a supplied inspection photo is grounded in actual image input.

```text
content = [{"type": "text", "text": question},
           {"type": "{{kind}}", "{{field}}": {"url": photo_url}}]
```

- Choices for **kind**: image_url | text | image_output
- Choices for **field**: image_url | file_name | caption

## Q3 — ai103-improvement-r2-set-a-100-q056

The selected image model supports masking. Complete an edit request for a source image and a mask already sized to match it.

```text
result = client.images.edit(model=deployment, image={{source}}, mask={{mask}}, prompt=edit_instruction)
```

- Choices for **source**: source_image_file | source_filename_text | prior_caption_text
- Choices for **mask**: matching_mask_file | size_string | quality_string

## Q4 — ai103-improvement-r2-set-a-100-q057

A Translator text request contains one sentence with English and German spans. Some words remain untranslated. Which preparation targets the documented limitation?

- **A.** Submit the same mixture to document translation with autodetection.
- **B.** Retry the same mixed sentence until detection changes.
- **C.** Provide a glossary while keeping the mixed-language sentence intact.
- **D.** Segment by source language and translate each segment explicitly.

## Q5 — ai103-improvement-r2-set-a-100-q058

A domain compliance summarizer needs a defined scope and an explicit escalation when evidence is missing. Which instruction design addresses it?

- **A.** A deployment name containing compliance.
- **B.** Domain instructions with a missing-evidence fallback.
- **C.** A longer output limit alone.
- **D.** A lower top-p value alone.

## Q6 — ai103-improvement-r2-set-a-100-q059

A blob OCR pipeline has imageAction none and incorrectly maps a skill-produced text node with fieldMappings. Which TWO changes repair the data path? Select TWO answers.

- **A.** Keep imageAction none and use a larger searchable field.
- **B.** Map enriched OCR text into the index with outputFieldMappings.
- **C.** Move the OCR text mapping into the semantic query request.
- **D.** Enable original-image extraction but keep the OCR text mapping in fieldMappings.
- **E.** Generate normalized images for the OCR skill input.

## Q7 — ai103-improvement-r2-set-a-100-q060

A team uses Content Understanding SDK 1.1.0 for production document extraction. Which TWO implementation choices align with the referenced contract? Select TWO answers.

- **A.** Use capabilities compatible with its 2025-11-01 API version.
- **B.** Submit the same document repeatedly as a substitute for polling.
- **C.** Wait for analysis completion before consuming the structured result.
- **D.** Treat the initial poller as completed Markdown content.
- **E.** Mix preview-only analyzer fields into the request with no version change.

## Q8 — ai103-improvement-r2-set-a-100-q061

A custom analyzer must extract an amount from unfamiliar invoice layouts and support reviewer verification. Which TWO features or inputs are useful? Select TWO answers.

- **A.** A high confidence threshold used as proof that all accepted values are correct.
- **B.** Representative labeled examples with verified field values.
- **C.** Generated explanations used as substitutes for labeled source values.
- **D.** Removing source coordinates to standardize the JSON shape.
- **E.** Field source and confidence estimation for the extraction results.

## Q9 — ai103-improvement-r2-set-a-100-q062

Long manuals exceed embedding limits, and the query vectorizer uses an unrelated model. Which TWO configuration corrections address the two failures? Select TWO answers.

- **A.** Chunk the source text within input limits.
- **B.** Increase the answer-generation token limit.
- **C.** Disable indexing warnings.
- **D.** Rescale query vectors from the unrelated model.
- **E.** Use content/query embeddings from a compatible model configuration.

