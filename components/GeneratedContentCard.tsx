import Image from 'next/image';
import { GeneratedContent } from '@/lib/types';
import styles from './content-studio.module.css';

type Props = {
  data: GeneratedContent | null;
  imageUrl: string | null;
};

export default function GeneratedContentCard({ data, imageUrl }: Props) {
  return (
    <div className={styles.panel}>
      <h2>Generated Output</h2>

      {!data && <p className={styles.muted}>Your AI-generated strategist output will appear here.</p>}

      {data && (
        <div className={styles.outputSection}>
          <h3>Title</h3>
          <p>{data.title}</p>

          <h3>Hook</h3>
          <p>{data.hook}</p>

          <h3>Main Caption</h3>
          <p>{data.mainCaption}</p>

          <h3>Call To Action</h3>
          <p>{data.cta}</p>

          <h3>Image Concept</h3>
          <p>{data.imageConcept}</p>

          <h3>Image Prompt</h3>
          <p className={styles.codeText}>{data.imagePrompt}</p>

          <h3>Strategist Thinking</h3>
          <div className={styles.strategyGrid}>
            <article className={styles.strategyCard}>
              <h4>Audience</h4>
              <p>{data.strategyThinking.audience}</p>
            </article>
            <article className={styles.strategyCard}>
              <h4>Platform Style</h4>
              <p>{data.strategyThinking.platformStyle}</p>
            </article>
            <article className={styles.strategyCard}>
              <h4>Marketing Goal</h4>
              <p>{data.strategyThinking.marketingGoal}</p>
            </article>
            <article className={styles.strategyCard}>
              <h4>Post Angle</h4>
              <p>{data.strategyThinking.postAngle}</p>
            </article>
          </div>
        </div>
      )}

      {imageUrl && (
        <div className={styles.imageWrap}>
          <h3>Generated Static Image</h3>
          <Image src={imageUrl} alt="Generated post visual" width={600} height={600} />
        </div>
      )}
    </div>
  );
}
