'use client';

import { useMemo, useState } from 'react';
import { ContentInput, GeneratedContent, ImageAspectRatio } from '@/lib/types';
import styles from './content-studio.module.css';

type Props = {
  onGenerated: (content: GeneratedContent, input: ContentInput) => void;
  onImageGenerated: (imageUrl: string, aspectRatio: ImageAspectRatio) => void;
  onSaved: () => void;
  generatedContent: GeneratedContent | null;
  currentImageUrl: string | null;
  currentInput: ContentInput | null;
  currentAspectRatio: ImageAspectRatio;
};

const initialInput: ContentInput = {
  brandName: '',
  niche: '',
  targetAudience: '',
  platform: 'Instagram',
  contentGoal: 'engagement',
  tone: 'professional',
  postType: 'single post',
  topicOrOffer: ''
};

const requiredTextFields: Array<keyof Pick<ContentInput, 'brandName' | 'niche' | 'targetAudience' | 'topicOrOffer'>> = [
  'brandName',
  'niche',
  'targetAudience',
  'topicOrOffer'
];

export default function ContentForm({
  onGenerated,
  onImageGenerated,
  onSaved,
  generatedContent,
  currentImageUrl,
  currentInput,
  currentAspectRatio
}: Props) {
  const [formData, setFormData] = useState<ContentInput>(initialInput);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof ContentInput>(key: K, value: ContentInput[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  const missingFields = useMemo(
    () => requiredTextFields.filter((field) => formData[field].trim().length === 0),
    [formData]
  );

  async function generateContent() {
    setFormError(null);
    if (missingFields.length > 0) {
      setFormError(`Please complete these fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Generation failed');
      onGenerated(data as GeneratedContent, formData);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateImage() {
    setFormError(null);
    if (!generatedContent) {
      setFormError('Generate content first so we can use the image prompt.');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageConcept: generatedContent.imageConcept,
          imagePrompt: generatedContent.imagePrompt,
          mainCaption: generatedContent.mainCaption,
          tone: formData.tone,
          brandName: formData.brandName,
          platform: formData.platform,
          aspectRatio
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Image generation failed');
      onImageGenerated(data.imageUrl as string, (data.aspectRatio as ImageAspectRatio) ?? aspectRatio);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  async function saveToLibrary() {
    setFormError(null);
    if (!generatedContent || !currentInput) {
      setFormError('Generate content before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/content-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: currentInput,
          content: generatedContent,
          imageUrl: currentImageUrl ?? undefined,
          imageAspectRatio: currentAspectRatio,
          favorite: false
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Save failed');
      }
      onSaved();
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.panel}>
      <h2>Content Inputs</h2>
      {missingFields.length > 0 && (
        <p className={styles.validationText}>Missing: {missingFields.join(', ')}</p>
      )}
      {formError && <p className={styles.errorText}>{formError}</p>}
      <div className={styles.grid}>
        <label>
          Brand name
          <input value={formData.brandName} onChange={(e) => update('brandName', e.target.value)} required />
        </label>
        <label>
          Niche
          <input value={formData.niche} onChange={(e) => update('niche', e.target.value)} required />
        </label>
        <label>
          Target audience
          <input value={formData.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} required />
        </label>
        <label>
          Platform
          <select value={formData.platform} onChange={(e) => update('platform', e.target.value as ContentInput['platform'])}>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>LinkedIn</option>
            <option>X</option>
          </select>
        </label>
        <label>
          Content goal
          <select value={formData.contentGoal} onChange={(e) => update('contentGoal', e.target.value as ContentInput['contentGoal'])}>
            <option value="engagement">engagement</option>
            <option value="leads">leads</option>
            <option value="awareness">awareness</option>
            <option value="promotion">promotion</option>
          </select>
        </label>
        <label>
          Tone
          <select value={formData.tone} onChange={(e) => update('tone', e.target.value as ContentInput['tone'])}>
            <option value="professional">professional</option>
            <option value="bold">bold</option>
            <option value="premium">premium</option>
            <option value="funny">funny</option>
            <option value="cinematic">cinematic</option>
          </select>
        </label>
        <label>
          Post type
          <select value={formData.postType} onChange={(e) => update('postType', e.target.value as ContentInput['postType'])}>
            <option value="single post">single post</option>
            <option value="carousel">carousel</option>
            <option value="ad copy">ad copy</option>
          </select>
        </label>
        <label>
          Image ratio
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}>
            <option value="square">Square (default)</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
        <label className={styles.full}>
          Topic or offer
          <textarea
            value={formData.topicOrOffer}
            onChange={(e) => update('topicOrOffer', e.target.value)}
            rows={4}
            required
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button onClick={generateContent} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
        <button onClick={generateImage} disabled={isGeneratingImage || !generatedContent}>
          {isGeneratingImage ? 'Generating image...' : 'Generate Static Image'}
        </button>
        <button onClick={saveToLibrary} disabled={isSaving || !generatedContent}>
          {isSaving ? 'Saving...' : 'Save to Library'}
        </button>
      </div>
    </div>
  );
}
