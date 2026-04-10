'use client';

import { useState } from 'react';
import { ContentInput, GeneratedContent } from '@/lib/types';
import styles from './content-studio.module.css';

type Props = {
  onGenerated: (content: GeneratedContent, input: ContentInput) => void;
  onImageGenerated: (imageUrl: string) => void;
  onSaved: () => void;
  generatedContent: GeneratedContent | null;
  currentImageUrl: string | null;
  currentInput: ContentInput | null;
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

export default function ContentForm({
  onGenerated,
  onImageGenerated,
  onSaved,
  generatedContent,
  currentImageUrl,
  currentInput
}: Props) {
  const [formData, setFormData] = useState<ContentInput>(initialInput);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function update<K extends keyof ContentInput>(key: K, value: ContentInput[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function generateContent() {
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
      alert((error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateImage() {
    if (!generatedContent) {
      alert('Generate content first so we can use the image concept.');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageConcept: generatedContent.imageConcept,
          brandName: formData.brandName,
          platform: formData.platform
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Image generation failed');
      onImageGenerated(data.imageUrl as string);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  async function saveToLibrary() {
    if (!generatedContent || !currentInput) {
      alert('Generate content before saving.');
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
          favorite: false
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Save failed');
      }
      onSaved();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.panel}>
      <h2>Content Inputs</h2>
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
