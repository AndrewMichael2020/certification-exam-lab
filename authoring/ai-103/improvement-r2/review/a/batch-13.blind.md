# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q091

Match each observed agent defect to the targeted tool evaluator. Use each selected choice once; one choice is unused.

- **A.** A correct returned quantity is misrepresented in the answer
- **B.** The model invokes translation when inventory lookup is needed
- **C.** The correct tool receives the warehouse ID as a part ID

Choices: Tool Input Accuracy | Task Completion (preview) | Tool Output Utilization | Tool Selection

## Q2 — ai103-improvement-r2-set-a-100-q092

Match each information need to the documented context capability. Use each selected choice once; one choice is unused.

- **A.** A maintained corporate handbook
- **B.** A preference learned from prior conversations
- **C.** A receipt uploaded for the current interaction

Choices: Persistent memory | Model router | Curated knowledge base | File search

## Q3 — ai103-improvement-r2-set-a-100-q093

Match each response-turn requirement to the documented tool_choice mode. Use each selected choice once; one choice is unused.

- **A.** The turn must produce no tool calls
- **B.** One or more tool calls are necessary
- **C.** Model may decide whether a tool helps

Choices: auto | required | none | A specific tool execution receipt

## Q4 — ai103-improvement-r2-set-a-100-q094

Match each webpage image role to the appropriate alternative-text approach. Use each selected choice once; one choice is unused.

- **A.** A complex chart whose details cannot fit concise alt text
- **B.** An image that submits a search form
- **C.** A purely decorative background flourish

Choices: Provide the detailed information elsewhere on the page | Use the image filename | Communicate the action | Use empty alt

## Q5 — ai103-improvement-r2-set-a-100-q095

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

- **A.** The index’s ocr_text field is searchable.
- **B.** The text output mapping names the correct enriched node.
- **C.** The blob indexer’s imageAction is none.
- **D.** The OCR skill uses the normalized image wildcard.

## Q6 — ai103-improvement-r2-set-a-100-q096

The pipeline needs layout-derived Markdown for indexing. Which producing capability should replace the enrichment stage in this exhibit?

### Required enrichment output

```text
{"input":"source document","requiredOutput":"layout-aware Markdown","consumer":"Search indexer skillset"}
```

- **A.** A field mapper without a producing skill.
- **B.** A semantic query configuration.
- **C.** OCR only, with no layout extraction.
- **D.** Document Intelligence Layout skill.

## Q7 — ai103-improvement-r2-set-a-100-q097

A custom extractor uses the following result. What should happen before the application posts the invoice amount?

### Invoice analyzer result

```text
{"total":{"value":1460.00,"confidence":0.42,"source":{"page":2,"span":"invoice total"}},"rule":"verified totals only"}
```

- **A.** Verify grounded field evidence and business rules.
- **B.** Use the confidence as payment authorization.
- **C.** Replace the source amount with the highest nearby number.
- **D.** Post because the JSON parsed.

## Q8 — ai103-improvement-r2-set-a-100-q098

The image:analyze 2024-09-01 contract uses FourSeverityLevels. Policy rejects an image when any harm category is Medium or High. What comparison should implement the policy?

### Image harm policy

```text
{"apiVersion":"2024-09-01","outputType":"FourSeverityLevels","rejectWhen":"any category is Medium or High"}
```

- **A.** Reject if any analyzed category has severity 4 or 6.
- **B.** Average the returned category severities and reject when that average reaches 4.
- **C.** Reject when every category equals 6.
- **D.** Reject when a category equals 3.

## Q9 — ai103-improvement-r2-set-a-100-q099

This audio-analysis worker passes an operation handle to its transcript consumer and the consumer rejects it. Which change obtains the completed analysis output in the pinned SDK?

### Python SDK 1.1.0 / API 2025-11-01

```text
poller = client.begin_analyze(analyzer_id="prebuilt-audioSearch", inputs=inputs)
transcript_consumer(poller)
```

- **A.** Wait for poller.result() and consume the returned analysis result.
- **B.** Read the operation ID as the transcript and retry the consumer.
- **C.** Cast the poller to a dictionary before sending it to the consumer.
- **D.** Change the audio filename extension and reuse the operation handle.

## Q10 — ai103-improvement-r2-set-a-100-q100

The translation result leaves part of this input unchanged. Which cause and response best fit the documented condition?

### Text translation diagnosis

```text
{"text":"Replace the filter, dann starten Sie die Pumpe.","detectedLanguage":"en","target":"fr","symptom":"German clause unchanged"}
```

- **A.** A detected language and HTTP success establish complete translation.
- **B.** Source autodetection must be forced to German for the whole sentence.
- **C.** A text request should become an autodetected document translation job.
- **D.** Mixed source languages; segment and translate with intended source labels.

