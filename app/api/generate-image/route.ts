import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { imageConcept, imagePrompt, brandName, platform } = (await request.json()) as {
      imageConcept: string;
      imagePrompt?: string;
      brandName: string;
      platform: string;
    };

    if (!imageConcept?.trim()) {
      return NextResponse.json({ error: 'Missing image concept.' }, { status: 400 });
    }

    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt:
        imagePrompt?.trim() ||
        `Create a premium static social media post image for ${brandName} on ${platform}. Concept: ${imageConcept}. No text overlay. High contrast, modern composition.`,
      size: '1024x1024'
    });

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image returned.' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
