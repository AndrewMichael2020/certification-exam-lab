"""20-item design checkpoint; actual planner batches are applied by assemble.ts."""
import json
from content import *
from standalone import standalone, artifacts

def checkpoint():
    choices=standalone('A'); children=case_children('A')
    # Use independent case facts; the 20-plan assigns B two children and A one.
    cases=[copy.deepcopy(CASES['A'][0]),copy.deepcopy(CASES['A'][2])]
    cases[0]['_children']=children[0][:2];cases[1]['_children']=[children[2][1]]
    singles=choices['A_single']
    out={('B','case_study'):cases[0]['_children'],('A','case_study'):cases[1]['_children'],
      ('A','single_choice'):[singles[16],singles[17],singles[18],singles[3]],
      ('B','single_choice'):choices['B_single'][:4],
      ('C','multi_select'):[base('A',75,'C3.01'),base('A',76,'C1.03'),base('A',77,'C2.06')],
      ('D','multi_select'):[multi('D','D1.03',['S055'],'Mixed-language segments were submitted together for translation. Which TWO changes directly target the documented input problem?',
        ['Separate single-language segments.','Use the intended source language for each segment.','Increase the translated response length limit.','Detect one source language and submit the whole mixture unchanged.','Move the unchanged mixture to the document endpoint.'],['A','B'],
        'Language segmentation and explicit intended source handling target the documented condition. The host should inspect translation quality rather than infer success from detection.',
        ['Output length does not separate source-language spans.','A detected language does not establish that every span was translated.','Document translation also has documented mixed-language limitations.'])],
      ('E','sequence_order'):[],
      ('D','matching_magnet'):[matching('D','D2.01',['S033','S034','S046'],
        'Match each speech requirement to the relevant capability.',
        ['Adapt recognition to specialist terminology using domain data','Recognize source speech and obtain target-language text','Render supplied text as spoken audio'],
        ['Custom Speech','Speech translation','Text-to-speech synthesis'],'Image analysis',
        'Custom Speech adapts recognition, Speech translation produces target-language text, and synthesis renders text as audio.'),
        matching('D','D1.01',['S030'],
        'Match each text task to the most targeted Language capability.',
        ['Locate personal identifiers for redaction','Identify a message language for routing','Label organizations and locations using predefined categories'],
        ['PII detection','Language detection','Named entity recognition'],'Sentiment analysis',
        'The requested output determines the capability. Sentiment measures emotional tone and is unused here.')],
      ('E','code_or_config_artifact'):artifacts('A')[0][:1]}
    for q in [
      item('E','E1.01',['S026','S058'],'A source document exceeds the embedding input limit. Arrange the dependency chain that produces searchable chunk vectors.',
        ['Read the document text.','Create chunks within the input limit.','Embed each prepared chunk.','Index the chunk text and its compatible vectors.'],
        dict(order=list('ABCD')),'Each output is the next operation’s input: document text, bounded chunks, embeddings, then index records.',
        zip('ABCD',['The source text supplies the chunking input.','Chunking requires source text and produces embedding inputs.','Vectors are produced from prepared chunks.','Indexing consumes text and completed vectors.']),'sequence_order'),
      item('E','E2.02',['S021'],'A configured document analyzer returns a long-running operation. Arrange the dependency chain for sending completed extraction to a RAG pipeline.',
        ['Submit document analysis.','Wait for successful operation completion.','Read the completed structured/Markdown result.','Pass that result to downstream ingestion.'],
        dict(order=list('ABCD')),'A returned operation is not extracted content. Completion is required before results can supply downstream ingestion.',
        zip('ABCD',['Submission creates the tracked operation.','The operation must finish successfully before consumption.','Only the successful result supplies the representation.','Downstream work requires the extracted representation.']),'sequence_order')]:
      q['_edges']=[dict(before=chr(65+i),after=chr(66+i),reason=q['explanation']['whyDistractorsWrong'][chr(66+i)]) for i in range(3)]
      out[('E','sequence_order')].append(q)
    out[('D','matching_magnet')][0]['objectiveTags'] += ['AI103-D2.02','AI103-D2.04']
    out[('D','matching_magnet')][1]['objectiveTags'] += ['AI103-D1.02']
    image=out[('C','multi_select')][1]
    next(o for o in image['options'] if o['id']=='B')['text']='A same-size PNG mask marking edit areas with transparent pixels.'
    patch_option(image,'C','A same-size mask whose opaque pixels mark the replacement area.','The documented mask uses fully transparent pixels to designate the editable region.')
    patch_option(image,'D','A mask resized to the requested output dimensions instead of the source dimensions.','The mask dimensions must match the input image, not an independently selected output size.')
    patch_option(image,'E','A JPEG mask with the source dimensions but no transparency.','The documented mask is PNG and uses transparent pixels; a JPEG has no alpha channel.')
    video=out[('C','multi_select')][2]
    video['stem']='A team evaluates the video-analysis 2026-06-01-preview contract for fast events and tiny labels. Which TWO limitations belong in its evaluation plan? Select TWO answers.'
    patch_option(video,'A','OCR retains original source resolution for every sampled frame.','The captured contract resizes sampled frames; it does not promise original-resolution OCR.')
    patch_option(video,'D','Every source frame is analyzed, but only key frames are returned.','The documented limit concerns inspected frames, not just the number of returned thumbnails.')
    patch_option(video,'E','Scene segmentation removes the temporal frame-sampling limit.','Segmentation provides scene organization; it does not remove the documented sampling limitation.')
    return dict(id='ai103-improvement-r2-checkpoint-20',setId='checkpoint',total=20,cases=cases,
      pools=[dict(domain=d,group=g,items=v) for (d,g),v in out.items()])

if __name__=='__main__':
    print(json.dumps(checkpoint(),ensure_ascii=False))
