# Python and API reading fragments

These are excerpts from captured official examples, interpreted for study. They were not executed, and no packages, credentials or Azure resources were installed/configured. Fragments omit surrounding setup and are not a promise of ready-to-run code. Preserve the package/API generation and model/region/access qualifications in the source.

## Project client and model response

Objectives: A2.03, B1.05–06. Source: [S003](https://learn.microsoft.com/azure/foundry/how-to/develop/sdk-overview), snapshot lines 241–257.

Captured new Foundry2.x SDK; AI Projects reference2.8.0. The endpoint is a project endpoint and DefaultAzureCredential supplies Entra authentication. model is the deployed model name; get_openai_client follows the project generation.

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project_endpoint = (
    "https://<resource-name>.services.ai.azure.com/api/projects/<project-name>"
)

project = AIProjectClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential(),
)
openai = project.get_openai_client()
response = openai.responses.create(
    model="gpt-5-mini",
    input="What is the size of France in square miles?",
)
print(f"Response output: {response.output_text}")
```

## Function schema

Objectives: B2.01, B1.03. Source: [S007](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/function-calling), snapshot lines 77–92.

Current Responses-oriented example. Schema advertises the allowed function and arguments; it does not execute the function. Real application validation and permissions remain necessary.

```python
func_tool = FunctionTool(
    name="get_horoscope",
    parameters={
        "type": "object",
        "properties": {
            "sign": {
                "type": "string",
                "description": "An astrological sign like Taurus or Aquarius",
            },
        },
        "required": ["sign"],
        "additionalProperties": False,
    },
    description="Get today's horoscope for an astrological sign.",
    strict=True,
)
```

## Correlated function output

Objectives: B1.03, B2.02. Source: [S007](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/function-calling), snapshot lines 112–127.

Current response.output loop. call_id preserves the tool-result association. This documentation fragment demonstrates execution; production code must validate the arguments before the illustrated function call. Do not use classic run-expiration text from other panels as a Responses rule.

```python
input_list: ResponseInputParam = []
# Process function calls
for item in response.output:
    if item.type == "function_call":
        if item.name == "get_horoscope":
            # Execute the function logic for get_horoscope
            horoscope = get_horoscope(**json.loads(item.arguments))

            # Provide function call results to the model
            input_list.append(
                FunctionCallOutput(
                    type="function_call_output",
                    call_id=item.call_id,
                    output=json.dumps({"horoscope": horoscope}),
                )
            )
```

## Image generation

Objectives: C1.01, C1.05. Source: [S017](https://learn.microsoft.com/azure/foundry/openai/how-to/dall-e), snapshot lines 345–354.

Documented GPT image fragment; the model/deployment and access status are illustrative and conditional. size/quality/format are model-specific; this is generation, not the masked edit operation. No cloud image generated.

```python
result = client.images.generate(
    model="gpt-image-1", # the name of your GPT-image series deployment
    prompt="a close-up of a bear walking through the forest",
    n=1,
    size="1024x1024",
    quality="high",
    output_format="png",
    # background="transparent",  # Set to "transparent" for transparent backgrounds (GPT-image-1 only; requires PNG)
    # output_compression=100,  # 0-100 compression level (JPEG output only)
)
```

## Generated-video remix

Objectives: C1.04. Source: [S018](https://learn.microsoft.com/azure/foundry/openai/concepts/video-generation), snapshot lines 1147–1150.

Sora 2 preview/current v1 videos API. Supply a previously generated video_id; a returned job still needs completion handling. This does not establish arbitrary timeline editing.

```python
video = client.videos.remix(
    video_id="<previous_video_id>",
    prompt="Shift the color palette to teal, sand, and rust, with a warm backlight."
)
```

## Vision message content

Objectives: C2.01–03. Source: [S019](https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision), snapshot lines 157–169.

Fragment of a documented chat request. The image is part of message content alongside text, so the model receives visual evidence. This is not a standalone runnable script.

```python
            { "role": "system", "content": "You are a helpful assistant." }, 
            { "role": "user", "content": [  
                { 
                    "type": "text", 
                    "text": "Describe this picture:" 
                },
                { 
                    "type": "image_url",
                    "image_url": {
                        "url": "<image URL>"
                    }
                }
            ] } 
```

## Content Understanding analysis

Objectives: C2.05, E2.02–03. Source: [S021](https://learn.microsoft.com/python/api/overview/azure/ai-contentunderstanding-readme?view=azure-python), snapshot lines 414–423.

Python SDK 1.1.0 /API 2025-11-01. begin_analyze returns a long-running poller; poller.result waits for extracted content. This async fragment requires the surrounding client/import setup. Keep preview-only agentic properties out of this GA contract.

```python
        poller = await client.begin_analyze(
            analyzer_id="prebuilt-documentSearch", 
            inputs=[AnalysisInput(url=file_url)]
        )
        result: AnalysisResult = await poller.result()
        
        # Extract markdown content
        content: AnalysisContent = result.contents[0]
        print("Markdown Content:")
        print(content.markdown)
```

## Speech translation configuration

Objectives: D2.04. Source: [S046](https://learn.microsoft.com/azure/ai-services/speech-service/how-to-translate-speech), snapshot lines 87–95.

Speech SDK configuration fragment; sample SDK package version is not fixed. A recognition source locale and target language(s) are different values. Translation text and synthesized speech are separate outputs.

```python
def translate_speech_to_text():
    translation_config = speechsdk.translation.SpeechTranslationConfig(
            subscription=speech_key, region=service_region)

    translation_config.speech_recognition_language = "it-IT"

    # Translate to languages. See, https://aka.ms/speech/sttt-languages
    translation_config.add_target_language("fr")
    translation_config.add_target_language("de")
```

## Hybrid retrieval request

Objectives: A1.03, E1.02. Source: [S025](https://learn.microsoft.com/azure/search/hybrid-search-overview), snapshot lines 36–69.

Captured REST example uses 2026-04-01. The vector arrays are explicit placeholders, not runnable embeddings. search plus vectorQueries enables hybrid retrieval; queryType=semantic adds reranking. top is returned results, while k controls candidates for each vector query.

```http
POST https://{{searchServiceName}}.search.windows.net/indexes/hotels-vector-quickstart/docs/search?api-version=2026-04-01
content-type: application/JSON

{
    "count": true,
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelId, HotelName, Category, Description, Address/City, Address/StateProvince",
    "filter": "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300",
    "vectorFilterMode": "postFilter",
    "facets": [ "Address/StateProvince"], 
    "vectorQueries": [
        {
            "kind": "vector",
            "vector": [ <array of embeddings> ],
            "k": 50,
            "fields": "DescriptionVector",
            "exhaustive": true,
            "oversampling": 20
        },
        {
            "kind": "vector",
            "vector": [ <array of embeddings> ],
            "k": 50,
            "fields": "Description_frVector",
            "exhaustive": false,
            "oversampling": 10
        }
    ],
    "skip": 0,
    "top": 10,
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "semanticConfiguration": "my-semantic-config"
}
```

## Strict schema reading

S037: Chat Completions uses response_format; Responses uses text.format. All supported strict-schema fields are required, nullable unions can represent optional values, and additionalProperties must be false. Syntax/schema adherence does not establish factual correctness. The documented strict function path disables parallel_tool_calls. See F037A–C for exact locators.
