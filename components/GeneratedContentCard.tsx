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

      {!data && <p className={styles.muted}>Your AI-generated content will appear here.</p>}

      {data && (
        <div className={styles.outputSection}>
          <h3>3 Content Ideas</h3>
          <ul>
            {data.contentIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>

          <h3>Selected Post Caption</h3>
          <p>{data.selectedPostCaption}</p>

          <h3>Hook</h3>
          <p>{data.hook}</p>

          <h3>Call To Action</h3>
          <p>{data.callToAction}</p>

          <h3>Image Concept</h3>
          <p>{data.imageConcept}</p>

          <h3>Hashtag Suggestions</h3>
          <div className={styles.tags}>
            {data.hashtagSuggestions.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
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
