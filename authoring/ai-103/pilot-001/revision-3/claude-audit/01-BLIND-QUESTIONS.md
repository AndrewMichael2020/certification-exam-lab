# AI-103 pilot — blind questions

Package: ai103-pilot-001-r3; revision: 3; pack: ai-103@1.1.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Case study: Cedar Atlas support agent

Applies to Q1 and Q2. Each child is independent.

Cedar Atlas is a fictional equipment supplier building an internal support agent. Answer each child independently using this shared context; earlier answers do not change its facts.

### Inference and workload requirements

The agent answers interactive support requests. Processing may use capacity across EU countries but must not leave the EU. Traffic is irregular, and finance wants usage-based token charges without a reserved capacity commitment. Responses must be available during the user interaction. Assume the chosen model supports the listed deployment types and sufficient quota is available.

### Retrieval and network requirements

Company manuals are indexed in Azure AI Search. Foundry Agent Service uses standard setup with private networking. Public access to Search must stay disabled. Private endpoint routing and DNS resolution have been verified from the relevant network. An authorized developer can query the index from that network.

### Identity findings

The agent uses the documented Azure AI Search tool and a project connection to the correct index. The connection currently uses a Search API key. For this setup, the keyless connection principal is the system-assigned managed identity of the Foundry account containing the project. Search RBAC is enabled. That identity already has Search Service Contributor on Search, and no other Search role. The developer and deployment pipeline have provisioning permissions; neither is intended as the runtime connection principal. The agent's model calls already succeed, but its retrieval tool cannot query the company index.

## Q1 — ai103-pilot001-q01

Use shared case case-1 above.

Which model deployment type meets the case study's processing-boundary, billing and interactive-response requirements?

- **A.** Global Standard
- **B.** Data Zone Standard
- **C.** Data Zone Provisioned
- **D.** Data Zone Batch

## Q2 — ai103-pilot001-q02

Use shared case case-1 above.

Which connection and authorization change lets the agent query the index while preserving the case study's network and runtime-identity requirements?

- **A.** Keep the key-based Search connection; grant Search Index Data Contributor to the developer.
- **B.** Authenticate the Search connection as the deployment pipeline; grant Search Index Data Contributor to that identity.
- **C.** Authenticate the Search connection with the Foundry account's system-assigned managed identity; grant it Foundry User only.
- **D.** Authenticate the Search connection with the Foundry account's system-assigned managed identity; grant it Search Index Data Contributor.

## Q3 — ai103-pilot001-q03

Complete the three settings for a supported model using strict structured outputs through the Responses API. Every successful, non-refusal structured output must contain order_id and note; when no note exists, note must be null. Extra properties must be disallowed. The property definitions below are already correct.

### Existing property definitions (illustrative JSON Schema fragment)

```text
{
  "type": "object",
  "properties": {
    "order_id": {
      "type": "string"
    },
    "note": {
      "type": [
        "string",
        "null"
      ]
    }
  }
}
```

```text
required: {{required}}
additionalProperties: {{additional}}
Responses request format location: {{format}}
```

- Choices for **required**: ["order_id"] | ["order_id", "note"] | []
- Choices for **additional**: true | false
- Choices for **format**: response_format | text.format | JSON mode without a schema

## Q4 — ai103-pilot001-q04

Two function requests in a Responses flow call the same local function for different products. Both local executions succeed. Which change is required when returning the outputs shown in this illustrative trace?

### Illustrative application trace, not a captured Azure error

```text
Output strings are decoded below for readability; serialization is already correct.

Requested function calls:
  call_id=call_red  name=get_stock  arguments={"sku":"R-14"}
  call_id=call_blue name=get_stock  arguments={"sku":"B-27"}

Local execution results:
  call_red  -> {"sku":"R-14","available":0}
  call_blue -> {"sku":"B-27","available":8}

Current outgoing records:
  type=function_call_output call_id=get_stock output={"sku":"R-14","available":0}
  type=function_call_output call_id=get_stock output={"sku":"B-27","available":8}
```

- **A.** Keep get_stock as call_id and send the two outputs in the same order as the requests.
- **B.** Combine both results into one output and use get_stock as the identifier for the combined call.
- **C.** Return each result with its originating call_id: call_red for R-14 and call_blue for B-27.
- **D.** Replace call_id with the function name in a tool_call_id field while retaining function_call_output.

## Q5 — ai103-pilot001-q05

A user asks an agent for quotes from two carriers and a comparison table with delivery dates. Traces show successful calls to both carriers with correct parameters. The agent follows its system policy against modifying records, but its final response includes only one quote and no comparison table. Which evaluator most directly measures this failure to deliver the requested outcome?

- **A.** Task Completion (preview)
- **B.** Tool Call Success
- **C.** Task Adherence (preview)
- **D.** Groundedness

## Q6 — ai103-pilot001-q06

An application uses the captured Sora 2 preview v1 interface to remix a previously completed video. The call returns the result below. Which next step lets the application display the requested edit?

### Illustrative v1 remix request and result

````text
```python
video = client.videos.remix(
    video_id="video_original_01",
    prompt="Change only the lighting to warm late-afternoon light."
)
```

```json
{
  "id": "video_remix_02",
  "status": "queued",
  "remixed_from_video_id": "video_original_01"
}
```
````

- **A.** Download the content for video_original_01, because a remix updates the original video in place.
- **B.** Track video_remix_02 until it completes successfully, then retrieve that new video's content.
- **C.** Display the returned JSON as the completed media, because the remix call succeeded.
- **D.** Submit another videos.create request with the same prompt, because a queued remix cannot complete.

## Q7 — ai103-pilot001-q07

Two groups of hosted-agent requests fail as described below. Required persisted session state must be retained, and policy forbids moving either workload to another region. Model token usage is below its quota. Which TWO initial actions address the reported failure layers without violating those requirements?

### Illustrative error summary

```text
Group P: HTTP 429, code=session_quota_exceeded
  Many sessions no longer need active compute; their required state must be retained.

Group R: HTTP 429, code=regional_session_quota_exceeded
  Session creation fails intermittently in the approved region; the client currently retries immediately with no delay.
```

- **A.** For group P, stop sessions that no longer need active compute without deleting required retained state.
- **B.** For group P, delete all stored sessions so that neither active compute nor persisted state consumes capacity.
- **C.** For both groups, raise the model deployment's tokens-per-minute quota as the sole corrective action.
- **D.** For group R, route the workload immediately to a different region with spare session capacity.
- **E.** For group R, retry with exponential backoff and jitter within the approved region.

## Q8 — ai103-pilot001-q08

An app uses the captured Azure Content Safety image:analyze API contract (2024-09-01). Its policy checks all four harm categories, rejects an image when any category is Medium or High, and otherwise allows it. Which TWO implementation choices match that policy and the documented image API?

- **A.** Allow any image when the API returns HTTP success, because successful analysis means the content is approved.
- **B.** Reject when any returned category has severity 4 or 6; otherwise allow the image under the stated policy.
- **C.** Request EightSeverityLevels for images and reject only severity values 5, 6 or 7.
- **D.** Request only the Violence category, because it includes the other three harm categories.
- **E.** Analyze all four categories using FourSeverityLevels, whose documented values are 0, 2, 4 and 6.

## Q9 — ai103-pilot001-q09

Arrange these steps for a Python Speech SDK workflow that translates one Italian utterance into German text and then synthesizes that translated text with a separately configured German voice. Credentials, a supported input device and the German synthesis voice are already available. Assume the recognition/translation succeeds.

- **A.** Construct TranslationRecognizer with the completed translation configuration and the audio input configuration.
- **B.** Read the German text from result.translations["de"] and pass that text to the separately configured German SpeechSynthesizer.
- **C.** Create SpeechTranslationConfig, set the recognition locale to it-IT, add de as a target language, and create the audio input configuration.
- **D.** Invoke recognize_once() on the recognizer and confirm that the returned reason is TranslatedSpeech.

## Q10 — ai103-pilot001-q10

Match each Azure AI Search ingestion requirement to the component that directly performs it. Choose one component per row; each component may be used at most once, and one choice is unused. All target index fields and required service resources already exist.

- **A.** Copy an unchanged metadata_storage_name field from the data source into the index field file_name.
- **B.** Copy OCR text already produced at an enrichment-tree path into the target searchable index field.
- **C.** Analyze document structure and emit a Markdown or text representation that preserves layout information.
- **D.** Read characters from the indexer's normalized image inputs and emit extracted text.

Choices: outputFieldMappings | OCR skill | Query-time vectorizer | fieldMappings | Document Layout skill

