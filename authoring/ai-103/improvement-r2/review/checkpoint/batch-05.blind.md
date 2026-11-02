# AI-103 pilot — blind questions

Package: ai103-improvement-r2-checkpoint-20; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-checkpoint-20-q020

The index has no OCR text. Which one configuration defect in this exhibit blocks the OCR input path?

### Blob OCR pipeline

```text
{
  "indexer": {
    "parameters": {"configuration": {"imageAction": "none"}},
    "outputFieldMappings": [{
      "sourceFieldName": "/document/normalized_images/*/text",
      "targetFieldName": "ocr_text"
    }]
  },
  "skill": {
    "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
    "context": "/document/normalized_images/*",
    "inputs": [{"name": "image", "source": "/document/normalized_images/*"}],
    "outputs": [{"name": "text", "targetName": "text"}]
  },
  "indexField": {"name": "ocr_text", "type": "Collection(Edm.String)", "searchable": true}
}
```

- **A.** The OCR skill uses the normalized image wildcard.
- **B.** The blob indexer’s imageAction is none.
- **C.** The text output mapping names the correct enriched node.
- **D.** The index’s ocr_text field is searchable.

