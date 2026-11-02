# C — Vision and multimodal content

Official range: 10–15%. Local practice weight: 13%, a planning choice. Sixteen bullets; four are partial. This domain has the largest terminology/policy gaps.

## Generation and editing

The current Azure image guide retires DALL-E 3 and documents GPT image models. Model-specific inputs, masks, formats, sizes, count and quality determine valid generation/edit operations. A path named “dall-e” is historical URL naming, not evidence that DALL-E 3 remains usable. An inpainting workflow and a new-image generation call are different contracts. [F017A–C]

Sora 2 preview supports text/image-conditioned video and remix of generated videos. Creation is asynchronous: a job acknowledgement is not final media. Current v1 methods differ from older jobs-API examples present in the same long page. Remix with a prior video_id does not establish arbitrary imported-video timeline editing. [F018A–B]

## Understand the actual visual evidence

Vision-enabled chat includes image inputs alongside text. Request concise descriptions, detailed comparisons or grounded answers while distinguishing visible facts from speculation. The captured chat guide limits requests to ten images; limits and detail controls remain API/model-specific. [F019A–B]

Accessibility depends on purpose. W3C's decision tree distinguishes informative descriptions, functional action/destination, decorative empty alt and complex information supplied elsewhere. A generated caption is a draft, not an accessibility guarantee. The older Image Analysis 4.0 alt-text walkthrough is deprecated; current visual-model input guidance and W3C context guide this route. [F049A, F050A]

Content Understanding supplies analyzers and explicit field schemas. Its Python 1.1.0 reference maps to GA API 2025-11-01; new agentic/video examples can be 2026-06-01-preview. Select documentSearch for text-bearing images when document structure is needed. [F020A, F021A–D]

Video extraction combines transcript/keyframe/segment information. The documented enableSegment/contentCategories configuration can split whole-video versus custom segments, at model-token cost. About one-frame-per-second sampling and 512-square frames can miss brief events or small text. Preserve time ranges for verification. [F022A–B]

## Safety and policy boundaries

| Requirement | What the sources establish | What remains uncertain |
| --- | --- | --- |
| Harm moderation | Image/multimodal harm-category classification and severities | Workload-specific error rate |
| Image text tries to override instructions | Prompt Shields is text-only; OCR provides extracted text | Verified end-to-end image shielding and OCR-loss protection |
| Precise defect/object regions | Structured semantic extraction and document source regions | A validated object-detector/localization contract |
| Brand, watermark, prohibited-symbol rules | Application policy plus documented moderation | Complete platform enforcement guarantees |

The FAQ explicitly separates image/multimodal harm moderation from text-only Prompt Shields, protected-material and groundedness models. OCR plus text shielding is a composed design inference. Authorization and tool restrictions still belong outside the model. [F042A, F043A, F048A]

Keep C2.07 partial because the exam says pro-mode while current docs retire its sole API and recommend agentic mode. Keep C2.08, C3.02 and C3.03 partial for exact region detection, image-injection coverage and visual policy guarantees. Study the distinctions, but exclude unsupported methods/guarantees from answer keys. [F023A–B, F024A]

