# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q045

A catalog requires exact part-code matches and semantic symptom matches. Which design combines both retrieval signals before optional reranking?

- **A.** Vector retrieval alone, with a larger candidate count.
- **B.** Semantic reranking of keyword-only candidates.
- **C.** Keyword and vector retrieval with fused rankings.
- **D.** Keyword retrieval alone, with boosted identifier fields.

## Q2 — ai103-improvement-r2-set-a-100-q046

An agent proposes a consequential account change. Which host boundary should decide whether it executes?

- **A.** The host’s caller authorization and action approval gate.
- **B.** A valid model response schema.
- **C.** A lower generation temperature.
- **D.** A more detailed tool description.

## Q3 — ai103-improvement-r2-set-a-100-q047

A catalog app must create a new product-scene image from a text brief, with no source image supplied. Its supported GPT image deployment is available. Which operation matches this input contract?

- **A.** Call images.edit with the brief as its source image file.
- **B.** Send the brief to a vision chat request and treat the text response as image bytes.
- **C.** Call images.edit with a mask but no source image.
- **D.** Call images.generate with the deployment and text prompt.

## Q4 — ai103-improvement-r2-set-a-100-q048

An application switches between two GPT image deployments with different quality and size options. What should its request builder use?

- **A.** One fixed list copied from an older image model.
- **B.** The union of both models' parameters, sent to each deployment for consistency.
- **C.** The supported controls of the selected deployed image model.
- **D.** The default size accepted by a different deployment in the same resource.

## Q5 — ai103-improvement-r2-set-a-100-q049

A vision-enabled chat model must describe damage visible in a supplied photograph. Which message construction gives it the actual visual input?

- **A.** Include text instructions and image_url content in the message.
- **B.** Enable image output formatting on the text-only message.
- **C.** Put the image filename in a text message.
- **D.** Describe an image path in the system prompt while keeping the image local to the client.

## Q6 — ai103-improvement-r2-set-a-100-q050

A magnifying-glass image is the visible label of a search button. Which text alternative best communicates the function?

- **A.** Small circular lens with a diagonal handle on a blue background.
- **B.** search-icon-v3.png.
- **C.** Magnifying glass icon.
- **D.** Search the catalog.

## Q7 — ai103-improvement-r2-set-a-100-q051

A Content Understanding video preview samples about one frame per second. A safety event lasts 0.2 seconds and the output does not mention it. Which conclusion is justified?

- **A.** The absence of a mention proves the event did not occur.
- **B.** Increase output length to recover source frames omitted by the sampling stage.
- **C.** The sampled analysis may have missed the brief event.
- **D.** The analyzer must have sampled every source frame because the request succeeded.

## Q8 — ai103-improvement-r2-set-a-100-q052

A production document-image workflow needs capabilities available in Content Understanding 2025-11-01. A newer preview offers unrelated features. Which API selection follows the documented production guidance?

- **A.** Use the 2025-11-01 GA API for the required production capabilities.
- **B.** Use the retired 2025-05-01-preview because its examples are familiar.
- **C.** Use 2026-06-01-preview because its date is newer.
- **D.** Alternate API versions randomly to compare response speed in production.

## Q9 — ai103-improvement-r2-set-a-100-q053

A poster has a low visual harm score but includes text telling an agent to reveal credentials. Which conclusion follows from the harm result?

- **A.** The image harm score is a groundedness measurement.
- **B.** Visual harm severity; instruction trust is a separate check.
- **C.** A successful harm request establishes the text is authorized.
- **D.** The poster text has passed instruction-trust validation.

