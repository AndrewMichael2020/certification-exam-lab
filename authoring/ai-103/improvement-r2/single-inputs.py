"""One 100-item revision. Editorial repairs live here; the checkpoint stays frozen."""
import json
from content import *
from standalone import standalone, artifacts, matches, b_multi


def sequences():
    designs = [
      ('D1.01', ['S037'],
       'A Python OpenAI 2.x application extracts events with Responses structured output. The client is configured and the supported model is deployed. On the successful non-refusal path, arrange these operations; business validation needs the parsed field values.',
       ['Define the Pydantic event model.', 'Call responses.parse with the event model as text_format.', 'Read the successful response.output_parsed object.', 'Validate the parsed date and participants against application rules.'],
       'The type defines the request schema; the response supplies the parsed object. Schema conformance does not validate the event against business rules.',
       ['The event type must exist before it can configure the request.', 'The request consumes that type and returns the response.', 'The successful response supplies the parsed values.', 'Business checks consume those values rather than the request schema.']),
      ('D1.01', ['S030', 'S037'],
       'A Language NER pipeline must send organization and location records to a JSON-consuming application. The host constructs the records from returned entity categories and verifies the resulting JSON against the consumer’s schema. Arrange the data dependencies.',
       ['Read the source text into the extraction worker.', 'Run named entity recognition on that text.', 'Construct JSON records from the returned organization and location entities.', 'Validate the constructed JSON against the consumer schema before sending it.'],
       'NER consumes source text and returns categorized entities. The host builds its records from that result, then validates the actual serialized payload for the consumer.',
       ['The text supplies the NER input.', 'NER supplies the categorized entities.', 'The records are constructed from those entities.', 'Validation requires the actual constructed payload.']),
      ('D1.02', ['S030'],
       'A transcript may be held temporarily in a restricted worker. The searchable store may receive only a version redacted using the entities returned by PII detection. The worker has no existing detection result. Arrange the data dependencies.',
       ['Read the transcript into the restricted worker.', 'Analyze that text with PII detection.', 'Build the redacted representation using the returned detected entities.', 'Write that redacted representation to the searchable store.'],
       'PII detection identifies entities in the original text. The host uses those results to create the representation required by the stated storage policy before indexing.',
       ['The worker supplies the analysis input.', 'Detection must process the input before its output exists.', 'The detected entities supply the host’s redaction targets.', 'Indexing the original text first would breach the specified boundary.']),
      ('D1.03', ['S055', 'S032'],
       'A mixed-language notice must be translated into French. Its language spans are known, and quality review compares the complete reconstructed notice with the original, including references across segments. Arrange this application workflow.',
       ['Prepare single-language segments with their intended source-language labels.', 'Translate each prepared segment to French with its source language specified.', 'Reconstruct the notice from the successful segment translations.', 'Review the complete translated notice against the original before delivery.'],
       'Single-language preparation addresses the documented mixture limitation. Reconstruction consumes translations; this review explicitly requires the complete notice.',
       ['Prepared segments and labels are inputs to the translation calls.', 'Translation produces the target-language segments.', 'Reconstruction combines those outputs.', 'The specified cross-segment review needs the reconstructed notice.']),
      ('D1.04', ['S057', 'S037'],
       'A compliance extractor may forward a result for approval only after its cited fields are verified against the supplied policy. Its model, client and policy are ready, but its domain instructions and strict output schema have not been defined. Arrange these operations.',
       ['Define the domain boundary, missing-evidence fallback and supported field schema.', 'Request extraction using those instructions, schema and policy text.', 'Check the successful extracted fields and citations against the supplied policy.', 'Forward the verified result to the authorized approval queue.'],
       'Instructions and schema configure extraction. The host verifies evidence before forwarding; neither instructions nor valid JSON replace that gate.',
       ['The request needs the domain and output contracts.', 'Inference produces the candidate extraction.', 'Evidence checks require that candidate and its source.', 'The stated queue gate requires successful verification.']),
      ('D2.01', ['S033', 'S057'],
       'A voice assistant uses a text-only response model and a separate speech synthesizer. The application requires its response-text policy check to pass before any answer audio is emitted. Arrange the successful path for one recorded utterance.',
       ['Recognize the utterance into finalized text.', 'Generate a text response from that transcript.', 'Apply the required response-text policy check.', 'Synthesize and emit the approved response text.'],
       'The text-only model needs recognition output. The policy gate consumes its answer and must precede synthesis under this application contract.',
       ['Recognition supplies text to the response model.', 'Generation supplies the candidate answer.', 'The policy check requires the candidate answer.', 'The specified policy allows audio only from approved text.']),
      ('D2.02', ['S034'],
       'A Custom Speech project and training data are ready. A new model must meet a held-out WER threshold before deployment, and the application will use it for real-time recognition, not batch transcription. Arrange the remaining operations.',
       ['Train the custom model with the prepared domain data.', 'Evaluate that model on the held-out set and confirm the WER gate passes.', 'Deploy the approved model to a custom endpoint.', 'Send real-time recognition requests to that custom endpoint.'],
       'The model must exist before evaluation. The stated release gate precedes deployment, and real-time use requires a deployed custom endpoint; batch usage has a different requirement.',
       ['Training produces the model being evaluated.', 'Evaluation verifies the specified deployment gate.', 'Deployment creates the endpoint for this model.', 'Real-time requests use that deployed endpoint.']),
      ('D2.03', ['S036'],
       'A Realtime assistant must interpret a recorded inspection question in the context of a written maintenance note for the same equipment. Its supported audio model and transport are ready. Host policy requires checking the returned interpretation against that note before offering a repair action. Arrange the application’s operations.',
       ['Collect the utterance and its associated maintenance note.', 'Prepare the supported audio input and text context for that equipment’s conversation.', 'Submit the prepared input and obtain the successful interpretation.', 'Check that interpretation against the maintenance note before offering the repair action.'],
       'The audio and written context supply the model inputs. The interpretation exists after inference, and the stated host gate consumes it before an action is offered.',
       ['The associated inputs must exist before they can be prepared.', 'Input and conversation context must be prepared before submission.', 'Successful inference supplies the interpretation.', 'The host check consumes that interpretation and its associated note.']),
      ('D2.04', ['S046'],
       'An event-based Speech SDK translator must retain the first completed translated utterance. Credentials and AudioConfig are ready. It uses a TranslationRecognizer whose recognized callback stores successful translations. Arrange initialization so the handler is ready when recognition begins.',
       ['Configure SpeechTranslationConfig with the source and target languages.', 'Create the TranslationRecognizer from that translation configuration and AudioConfig.', 'Connect the storage callback to the recognizer’s recognized event.', 'Start continuous recognition on the configured recognizer.'],
       'The configuration is consumed by the constructor. The event belongs to the created recognizer, and this application must subscribe before starting to avoid losing its first result.',
       ['The constructor needs the completed translation configuration.', 'The recognizer must exist before its event can be subscribed.', 'The application requires the callback to be ready before recognition starts.', 'Recognition now delivers completed results to the installed handler.']),
      ('D2.04', ['S046', 'S033'],
       'A store-and-forward speech translator uses manual synthesis for two target languages. It will deliver an audio file only after synthesis succeeds. Arrange the successful path for the selected target language; no translation result is available initially.',
       ['Recognize and translate the source utterance.', 'Select the requested language’s text from the successful result’s translations.', 'Synthesize that text with a voice supporting the selected target language.', 'Deliver the successfully synthesized audio file.'],
       'The translation result supplies per-language text. Manual synthesis consumes the selected text; this file-delivery contract requires completed audio rather than a streamed partial response.',
       ['Translation produces the per-language results.', 'Selection supplies the requested target text.', 'Synthesis consumes that text and produces audio.', 'The application delivers a file only after successful synthesis.']),
    ]
    return [sequence(o, refs, stem, steps, why, notes) for o, refs, stem, steps, why, notes in designs]


def single_package():
    choices = standalone('A')
    children = case_children('A')
    cases = copy.deepcopy(CASES['A'])
    exhibits = [
      'Request exhibit: {"calls":[{"name":"get_stock","call_id":"rotor-east"},{"name":"get_stock","call_id":"rotor-west"}],"completionOrder":["rotor-west","rotor-east"]}. The reservation tests are separate requests, not effects of this lookup.',
      'Evaluation exhibit: {"contentEmbedding":"harbor-embed-x","queryEmbedding":"harbor-embed-y","dimensionsMatch":true,"passageWarrantyMonths":12,"answerWarrantyMonths":24}. The authorized department is derived from the employee session, not either deployment name.',
      'Runtime exhibit: {"tokenAcquired":true,"inferenceRole":"Reader","searchRole":"Search Index Data Reader","searchDns":"public address","publicSearchAccess":false}. These observations belong to the runtime identity and subnet; the developer’s successful call uses a different network.',
      'Backend exhibit: {"caller":"shared backend principal","memoryToolScope":"{{$userId}}","memoryUserHeader":null,"directSearchScope":null}. The Responses request builder also copied the Chat Completions response_format field; these are distinct defects against the stated per-subscriber and output contracts.',
    ]
    for parent, exhibit in zip(cases, exhibits):
        parent['sections'].append(dict(heading='Diagnostic exhibit', body=exhibit))
    # A strict Responses request shape assesses prompt/output configuration, not fine tuning.
    children[3][2]['objectiveTags'] = ['AI103-B3.01']
    choices['B_single'][4]['objectiveTags'] = ['AI103-B3.01']
    choices['A_single'][15] = single('A', 'A1.02', ['S021'],
      'A team wants one supported Python client library for extracting document layout, transcribing audio and analyzing recorded video into structured outputs. Which service’s documented client covers all three input modalities?',
      ['Azure AI Content Understanding.', 'Azure Document Intelligence Layout alone.', 'Azure Language text summarization alone.', 'Azure AI Search OCR skill alone.'], 'A',
      'The Content Understanding client documents extraction across documents, audio, video and images. The other named capabilities each omit required input modalities.',
      ['Document layout alone does not supply audio transcription and video analysis.', 'Text summarization alone does not perform all three native input analyses.', 'OCR enrichment does not provide the required audio and video analysis.'])
    choices['E_multi'][2]['sourceIds'].append('S059')
    # Replace conspicuous key-length cues with competing controls at the same boundary.
    repairs = [
      (children[0][2], 'A', 'Validate the argument types and permit any schema-valid account.', 'Valid types do not establish caller ownership.'),
      (children[0][2], 'B', 'Check that the selected function is registered and has a description.', 'Registration does not establish customer authorization.'),
      (children[0][2], 'D', 'Apply the warehouse’s rate limit and accept the supplied customer ID.', 'Rate limiting does not establish ownership of the supplied account.'),
      (children[1][1], 'B', 'Increase vector candidate count and retain the unrelated query model.', 'Candidate count does not align the two embedding spaces.'),
      (children[1][1], 'C', 'Normalize vector magnitudes and retain both current embedding models.', 'Magnitude normalization does not align learned semantic spaces.'),
      (children[1][3], 'A', 'Use the employee’s department in a system instruction after retrieval.', 'The policy requires filtering before passages enter context.'),
      (children[1][3], 'B', 'Remove other departments from citations after the answer is generated.', 'Post-generation citation filtering is too late for this boundary.'),
      (children[1][3], 'C', 'Rerank the unfiltered results and retain only the highest-scoring passage.', 'Relevance is not the employee authorization rule.'),
    ]
    for q, key, text, note in repairs: patch_option(q, key, text, note)
    correct_texts = [
      (children[0][2], 'Validate caller ownership and reservation business constraints.'),
      (children[0][3], 'Reapprove the changed argument tuple before execution.'),
      (children[1][1], 'Use a validated compatible embedding configuration for content and queries.'),
      (children[1][3], 'Apply the authenticated employee’s department as a retrieval filter.'),
      (children[2][2], 'Private DNS resolution and subnet links.'),
      (children[2][3], 'Scope the workflow’s deployment role to the intended project.'),
      (children[3][0], 'Send the authenticated subscriber key in x-memory-user-id.'),
      (children[3][1], 'Supply the authorized subscriber scope on the direct API call.'),
      (children[3][3], 'Define role/fallback, evaluate behavior and enforce host permissions.'),
      (choices['B_single'][4], 'An API-provided reasoning summary.'),
      (choices['B_single'][5], 'A system-defined domain and missing-evidence fallback.'),
      (choices['B_single'][6], 'Explicit specialist handoff and completion conditions.'),
      (choices['B_single'][8], 'The configured index name and project connection.'),
      (choices['B_single'][9], 'Response Completeness (preview).'),
      (choices['C_single'][6], 'Visual harm severity; instruction trust is a separate check.'),
      (choices['D_single'][0], 'Segment by source language and translate each segment explicitly.'),
      (choices['D_single'][1], 'Domain instructions with a missing-evidence fallback.'),
      (choices['A_single'][19], 'The host’s caller authorization and action approval gate.'),
    ]
    for q, text in correct_texts:
        next(o for o in q['options'] if o['id'] == q['correctAnswer'])['text'] = text
    tool_metric = choices['B_single'][7]
    for option in tool_metric['options']:
        option['text'] = {'A': 'Tool Call Success.', 'B': 'Tool Input Accuracy.', 'C': 'Tool Output Utilization.', 'D': 'Tool Selection.'}[option['id']]
    patch_option(choices['B_single'][9], 'A', 'Response safety screening.', 'Safety screening does not measure coverage of the missing reference-answer parts.')
    patch_option(choices['B_single'][9], 'D', 'Response relevance.', 'The stem already establishes topical relevance; missing required parts need completeness assessment.')
    patch_option(children[0][3], 'C', 'Accept the agent’s claim that the old approval covers the new quantity.', 'Model acknowledgement does not amend the exact-tuple approval contract.')
    attack = choices['A_single'][13]
    patch_option(attack, 'A', 'A direct user prompt attack originating in the authenticated user message.', 'The attack is embedded in retrieved context rather than the user message.')
    patch_option(attack, 'B', 'A factual data-poisoning error that changes a measurement without issuing instructions.', 'The payload explicitly attempts to override instructions and exfiltrate credentials.')
    patch_option(attack, 'C', 'A harmful final-answer classification unrelated to the retrieved instruction boundary.', 'The described threat is an instruction attack entering through external context.')
    choices['C_single'][0] = single('C', 'C1.01', ['S017'],
      'A catalog app must create a new product-scene image from a text brief, with no source image supplied. Its supported GPT image deployment is available. Which operation matches this input contract?',
      ['Call images.generate with the deployment and text prompt.', 'Call images.edit with the brief as its source image file.', 'Send the brief to a vision chat request and treat the text response as image bytes.', 'Call images.edit with a mask but no source image.'], 'A',
      'Image generation accepts the text prompt to create an image. Editing requires source image input; vision chat interprets supplied images rather than returning generated image bytes.',
      ['A text brief is not the source image input for editing.', 'Vision chat text is not a generated image file.', 'A mask does not supply the missing source image.'])
    # Standalone distractors target actual API/input mistakes rather than unrelated controls.
    patch_option(choices['D_single'][0], 'A', 'Provide a glossary while keeping the mixed-language sentence intact.', 'Terminology customization does not remove the source-language mixture.')
    patch_option(choices['D_single'][0], 'D', 'Submit the same mixture to document translation with autodetection.', 'Document translation also has documented mixed-language limitations.')
    patch_option(choices['C_single'][7], 'B', 'Attach only the first image and describe the second image’s filename.', 'The second filename does not supply the second image.')
    patch_option(choices['C_single'][7], 'C', 'Send a text-only comparison request containing both image URLs as prose.', 'Plain prose URLs do not provide supported image content inputs.')
    patch_option(choices['C_single'][7], 'D', 'Attach both images but ask only for an independent caption of the first.', 'That instruction does not request the required visual comparison.')
    a_match, b_match, c_match = matches('A')
    for q in a_match[:2] + b_match[:2] + c_match:
        q['explanation']['whyDistractorsWrong'] = {o['id']: f"{o['text']}: {q['correctAnswer']['pairs'][o['id']]}." for o in q['options']}
    # The unused choice in an investigation task should still be an operational evidence source.
    a_match[1]['matchChoices'] = ['Search service operational metrics', 'Indexer item errors and warnings', 'Correlated trace and nested spans', 'Aggregate billing report']
    a_match[1]['explanation']['whyCorrect'] += ' An aggregate billing report cannot localize these request, ingestion or serving failures.'
    e_artifacts, c_artifacts, d_artifacts = artifacts('A')
    c_artifacts[0]['type'] = 'code_or_config_artifact'
    c_artifacts[0]['artifact'] = dict(title='Image harm policy', kind='json', content='{"apiVersion":"2024-09-01","outputType":"FourSeverityLevels","rejectWhen":"any category is Medium or High"}')
    # A concrete pinned SDK method/result diagnosis replaces an unnamed preview feature.
    c_artifacts[1] = single('C', 'C2.05', ['S021'],
      'This audio-analysis worker passes an operation handle to its transcript consumer and the consumer rejects it. Which change obtains the completed analysis output in the pinned SDK?',
      ['Wait for poller.result() and consume the returned analysis result.', 'Read the operation ID as the transcript and retry the consumer.', 'Cast the poller to a dictionary before sending it to the consumer.', 'Change the audio filename extension and reuse the operation handle.'], 'A',
      'begin_analyze returns a long-running operation poller. The SDK example waits with result() before using completed content; the operation handle is not a transcript.',
      ['The operation ID identifies work, not the analyzed content.', 'Casting a control object does not obtain successful analysis output.', 'Renaming the input does not complete or retrieve the existing operation.'], kind='code_or_config_artifact',
      artifact=dict(title='Python SDK 1.1.0 / API 2025-11-01', kind='markdown', content='poller = client.begin_analyze(analyzer_id="prebuilt-audioSearch", inputs=inputs)\ntranscript_consumer(poller)'))
    patch_option(d_artifacts[0], 'B', 'Source autodetection must be forced to German for the whole sentence.', 'Choosing one language for the whole mixture does not separate its English span.')
    patch_option(d_artifacts[0], 'C', 'A text request should become an autodetected document translation job.', 'Changing endpoints while retaining the mixture does not resolve the documented condition.')
    patch_option(d_artifacts[0], 'D', 'A detected language and HTTP success establish complete translation.', 'Detection and transport success do not verify every span was translated.')
    next(o for o in d_artifacts[0]['options'] if o['id'] == 'A')['text'] = 'Mixed source languages; segment and translate with intended source labels.'
    next(o for o in e_artifacts[2]['options'] if o['id'] == 'B')['text'] = 'Verify grounded field evidence and business rules.'
    multis = b_multi('A')
    multis[1]['objectiveTags'] = ['AI103-B3.01']
    multis[2]['objectiveTags'] = ['AI103-B1.02']
    multis[4]['objectiveTags'] = ['AI103-B2.02']
    patch_option(choices['E_multi'][0], 'E', 'Enable original-image extraction but keep the OCR text mapping in fieldMappings.', 'Image extraction alone does not repair the mapping for the skill-produced enriched node.')
    patch_option(choices['E_multi'][-1], 'C', 'Tune the query semantic configuration without changing the extraction field definition.', 'Query ranking cannot define the missing renewal-date extraction target.')
    pools = {('B', 'case_study'): children[0] + children[1] + children[3], ('A', 'case_study'): children[2],
      ('A', 'single_choice'): choices['A_single'], ('B', 'single_choice'): choices['B_single'],
      ('C', 'single_choice'): choices['C_single'], ('D', 'single_choice'): choices['D_single'],
      ('E', 'multi_select'): choices['E_multi'], ('B', 'multi_select'): multis,
      ('D', 'sequence_order'): sequences(), ('A', 'matching_magnet'): a_match,
      ('B', 'matching_magnet'): b_match, ('C', 'matching_magnet'): c_match,
      ('E', 'code_or_config_artifact'): e_artifacts, ('C', 'code_or_config_artifact'): c_artifacts,
      ('D', 'code_or_config_artifact'): d_artifacts}
    # Assess reasoning instead of copying quota-driven hard labels from the old booklet.
    for (_, group), items in pools.items():
        for q in items:
            q['difficulty'] = 'easy' if group == 'matching_magnet' or (group == 'single_choice' and q['type'] != 'dropdown_completion' and len(q['sourceIds']) == 1) else 'medium'
    return dict(id='ai103-improvement-r2-set-a-100', setId='a', total=100, authoredAt='2026-10-11T20:45:53Z', cases=cases,
      pools=[dict(domain=d, group=g, items=items) for (d, g), items in pools.items()])


if __name__ == '__main__':
    print(json.dumps(single_package(), ensure_ascii=False))
