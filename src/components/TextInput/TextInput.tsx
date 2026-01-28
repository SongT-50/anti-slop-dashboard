import { useState } from 'react';
import type { SentenceScore } from '../../types';
import styles from './TextInput.module.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  sentenceScores: SentenceScore[];
}

type ViewMode = 'input' | 'highlight';

export function TextInput({ value, onChange, sentenceScores }: TextInputProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('input');

  const getSentenceClass = (score: number): string => {
    if (score > 0.6) return styles.sentenceHigh;
    if (score > 0.3) return styles.sentenceMedium;
    if (score > 0) return styles.sentenceLow;
    return '';
  };

  const renderHighlightedText = () => {
    if (!sentenceScores.length) {
      return <span style={{ color: '#888' }}>{value || 'Enter text to analyze...'}</span>;
    }

    return sentenceScores.map((sentence, i) => (
      <span
        key={i}
        className={`${styles.sentence} ${getSentenceClass(sentence.score)}`}
        title={sentence.matchedPatterns.length > 0
          ? `Patterns: ${sentence.matchedPatterns.join(', ')}`
          : 'No patterns detected'}
      >
        {sentence.text}
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${viewMode === 'input' ? styles.tabActive : ''}`}
          onClick={() => setViewMode('input')}
        >
          Edit
        </button>
        <button
          className={`${styles.tab} ${viewMode === 'highlight' ? styles.tabActive : ''}`}
          onClick={() => setViewMode('highlight')}
        >
          Highlight
        </button>
      </div>

      {viewMode === 'input' ? (
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter text to analyze for AI-generated content patterns... (Supports English and Korean)

Try pasting some text here to see the analysis in action. The dashboard will show:
- AI probability percentage
- Detected 'slop' patterns highlighted
- Real-time particle visualization
- Category breakdown scores"
          />
          <span className={styles.charCount}>{value.length} chars</span>
        </div>
      ) : (
        <div className={styles.highlightedText}>
          {renderHighlightedText()}
        </div>
      )}
    </div>
  );
}
