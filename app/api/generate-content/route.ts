import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ContentInput, GeneratedContent } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as ContentInput;

    const prompt = `You are a senior social media strategist.
Return only valid JSON with this exact shape:
{
  "contentIdeas": ["idea 1", "idea 2", "idea 3"],
  "selectedPostCaption": "...",
  "hook": "...",
  "callToAction": "...",
  "imageConcept": "...",
  "hashtagSuggestions": ["#one", "#two", "#three", "#four", "#five"]
}

Business details:
- Brand name: ${input.brandName}
- Niche: ${input.niche}
- Target audience: ${input.targetAudience}
- Platform: ${input.platform}
- Content goal: ${input.contentGoal}
- Tone: ${input.tone}
- Post type: ${input.postType}
- Topic or offer: ${input.topicOrOffer}

Constraints:
- Practical, platform-specific output
- Hook must be punchy
- CTA must be clear and action-oriented
- Caption should be ready to post`;

    // JSON-mode response keeps parsing simple and beginner friendly.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from OpenAI.' }, { status: 500 });
    }

    const parsed = JSON.parse(content) as GeneratedContent;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}
