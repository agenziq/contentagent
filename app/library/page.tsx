'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/components/content-studio.module.css';
import { LibraryItem } from '@/lib/types';

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLibrary() {
    setLoading(true);
    const response = await fetch('/api/content-library');
    const data = (await response.json()) as LibraryItem[];
    setItems(data);
    setLoading(false);
  }

  async function toggleFavorite(id: string) {
    await fetch('/api/content-library', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    await loadLibrary();
  }

  useEffect(() => {
    void loadLibrary();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Content Library</h1>
            <p className={styles.subtitle}>Saved posts and generated images in one place.</p>
          </div>
          <Link href="/" className={styles.nav}>
            Back to Studio
          </Link>
        </header>

        <section className={styles.panel}>
          {loading && <p className={styles.muted}>Loading saved content...</p>}
          {!loading && items.length === 0 && <p className={styles.muted}>No saved content yet.</p>}

          <div className={styles.list}>
            {items.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3>{item.input.brandName}</h3>
                    <p className={styles.meta}>
                      {item.input.platform} • {item.input.contentGoal} • {item.input.tone} •{' '}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => toggleFavorite(item.id)}>
                    {item.favorite ? '★ Favorited' : '☆ Favorite'}
                  </button>
                </div>

                <p>
                  <strong>Topic:</strong> {item.input.topicOrOffer}
                </p>
                <p>
                  <strong>Hook:</strong> {item.content.hook}
                </p>
                <p>
                  <strong>CTA:</strong> {item.content.callToAction}
                </p>
                <p>
                  <strong>Caption:</strong> {item.content.selectedPostCaption}
                </p>

                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={`Saved generated visual for ${item.input.brandName}`}
                    width={550}
                    height={550}
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
