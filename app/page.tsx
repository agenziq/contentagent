'use client';

import Link from 'next/link';
import { useState } from 'react';
import ContentForm from '@/components/ContentForm';
import GeneratedContentCard from '@/components/GeneratedContentCard';
import styles from '@/components/content-studio.module.css';
import { ContentInput, GeneratedContent } from '@/lib/types';

export default function HomePage() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentInput, setCurrentInput] = useState<ContentInput | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>AgenzIQ Content Studio</h1>
            <p className={styles.subtitle}>
              Build scroll-stopping social content with AI ideas, captions, and static visuals.
            </p>
          </div>
          <Link href="/library" className={styles.nav}>
            Content Library
          </Link>
        </header>

        <section className={styles.layout}>
          <ContentForm
            onGenerated={(content, input) => {
              setGeneratedContent(content);
              setCurrentInput(input);
              setImageUrl(null);
            }}
            onImageGenerated={setImageUrl}
            onSaved={() => alert('Saved to content library.')}
            generatedContent={generatedContent}
            currentImageUrl={imageUrl}
            currentInput={currentInput}
          />

          <GeneratedContentCard data={generatedContent} imageUrl={imageUrl} />
        </section>
      </div>
    </main>
  );
}
