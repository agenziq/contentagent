import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ImageAspectRatio, Tone } from '@/lib/types';

const sizeByAspect: Record<ImageAspectRatio, '1024x1024' | '1024x1536' | '1536x1024'> = {
  square: '1024x1024',
  portrait: '1024x1536',
  landscape: '1536x1024'
};

function buildVisualPrompt(params: {
  imageConcept: string;
  imagePrompt?: string;
  mainCaption: string;
  tone: Tone;
  brandName: string;
  platform: string;
}) {
  const { imageConcept, imagePrompt, mainCaption, tone, brandName, platform } = params;

  return `Design a premium static social post image for ${brandName} on ${platform}.
Brand tone: ${tone}.
Core caption message: ${mainCaption}.
Image concept: ${imageConcept}.
Additional image direction: ${imagePrompt ?? 'N/A'}.

Art direction rules:
- high-end modern composition
- strong focal subject and depth
- dramatic but clean lighting
- cohesive brand color mood based on tone
- no text, no logos, no watermarks, no clutter
- optimized for social media post performance`;
}

export async function POST(request: Request) {
  try {
    const {
      imageConcept,
      imagePrompt,
      mainCaption,
      tone,
      brandName,
      platform,
      aspectRatio = 'square'
    } = (await request.json()) as {
      imageConcept: string;
      imagePrompt?: string;
      mainCaption: string;
      tone: Tone;
      brandName: string;
      platform: string;
      aspectRatio?: ImageAspectRatio;
    };

    if (!imageConcept?.trim() || !mainCaption?.trim() || !tone?.trim()) {
      return NextResponse.json(
        { error: 'Missing image concept, main caption, or tone for image generation.' },
        { status: 400 }
      );
    }

    const safeAspectRatio: ImageAspectRatio =
      aspectRatio === 'portrait' || aspectRatio === 'landscape' ? aspectRatio : 'square';

    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: buildVisualPrompt({
        imageConcept,
        imagePrompt,
        mainCaption,
        tone,
        brandName,
        platform
      }),
      size: sizeByAspect[safeAspectRatio]
    });

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image returned.' }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageBase64}`,
      aspectRatio: safeAspectRatio
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
