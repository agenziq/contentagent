import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ContentInput, GeneratedContent } from '@/lib/types';

function getMissingFields(input: Partial<ContentInput>) {
  const requiredFields: Array<keyof ContentInput> = [
    'brandName',
    'niche',
    'targetAudience',
    'platform',
    'contentGoal',
    'tone',
    'postType',
    'topicOrOffer'
  ];

  return requiredFields.filter((field) => !input[field] || String(input[field]).trim().length === 0);
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as ContentInput;
    const missingFields = getMissingFields(input);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are a senior social content strategist. First reason through audience, platform style, marketing goal, and post angle. Then provide only strict JSON.'
        },
        {
          role: 'user',
          content: `Create one high-quality post plan for:
Brand name: ${input.brandName}
Niche: ${input.niche}
Target audience: ${input.targetAudience}
Platform: ${input.platform}
Content goal: ${input.contentGoal}
Tone: ${input.tone}
Post type: ${input.postType}
Topic or offer: ${input.topicOrOffer}`
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'content_strategist_output',
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['strategyThinking', 'title', 'hook', 'mainCaption', 'cta', 'imageConcept', 'imagePrompt'],
            properties: {
              strategyThinking: {
                type: 'object',
                additionalProperties: false,
                required: ['audience', 'platformStyle', 'marketingGoal', 'postAngle'],
                properties: {
                  audience: { type: 'string' },
                  platformStyle: { type: 'string' },
                  marketingGoal: { type: 'string' },
                  postAngle: { type: 'string' }
                }
              },
              title: { type: 'string' },
              hook: { type: 'string' },
              mainCaption: { type: 'string' },
              cta: { type: 'string' },
              imageConcept: { type: 'string' },
              imagePrompt: { type: 'string' }
            }
          }
        }
      }
    } as any);

    const outputText = response.output_text;
    if (!outputText) {
      return NextResponse.json({ error: 'No response from OpenAI.' }, { status: 500 });
    }

    const parsed = JSON.parse(outputText) as GeneratedContent;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}
