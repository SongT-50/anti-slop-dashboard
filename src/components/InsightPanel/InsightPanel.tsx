import type { AnalysisResult } from '../../types';
import styles from './InsightPanel.module.css';

interface InsightPanelProps {
  analysis: AnalysisResult;
}

export function InsightPanel({ analysis }: InsightPanelProps) {
  const { aiProbability, patternMatches, breakdown, textStats } = analysis;

  const getBadgeClass = () => {
    if (aiProbability < 30) return styles.badgeLow;
    if (aiProbability < 60) return styles.badgeMedium;
    return styles.badgeHigh;
  };

  const getBadgeText = () => {
    if (aiProbability < 30) return 'Likely Human';
    if (aiProbability < 60) return 'Uncertain';
    return 'Likely AI';
  };

  const getGaugeColor = () => {
    const hue = 120 - (aiProbability / 100) * 120;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - aiProbability / 100);

  const breakdownItems = [
    { label: 'Vocabulary', value: breakdown.vocabularyScore, color: '#ff6b6b' },
    { label: 'Structure', value: breakdown.structureScore, color: '#4ecdc4' },
    { label: 'Punctuation', value: breakdown.punctuationScore, color: '#ffe66d' },
    { label: 'Style', value: breakdown.styleScore, color: '#95e1d3' },
    { label: 'Diversity', value: breakdown.diversityScore, color: '#a8d8ea' },
  ];

  const sortedPatterns = [...patternMatches]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Analysis Insights</h2>
        <span className={`${styles.badge} ${getBadgeClass()}`}>
          {getBadgeText()}
        </span>
      </div>

      <div className={styles.gaugeSection}>
        <div className={styles.gaugeContainer}>
          <svg className={styles.gaugeSvg} width="140" height="140" viewBox="0 0 140 140">
            <circle
              className={styles.gaugeBackground}
              cx="70"
              cy="70"
              r="54"
            />
            <circle
              className={styles.gaugeProgress}
              cx="70"
              cy="70"
              r="54"
              stroke={getGaugeColor()}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.gaugeText}>
            <div className={styles.gaugeValue}>{aiProbability}%</div>
            <div className={styles.gaugeLabel}>AI Probability</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Score Breakdown</h3>
        <div className={styles.breakdownList}>
          {breakdownItems.map((item) => (
            <div key={item.label} className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>{item.label}</span>
              <div className={styles.breakdownBar}>
                <div
                  className={styles.breakdownFill}
                  style={{
                    width: `${item.value * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className={styles.breakdownValue}>
                {(item.value * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Detected Patterns</h3>
        {sortedPatterns.length > 0 ? (
          <div className={styles.patternList}>
            {sortedPatterns.map((match, i) => (
              <div key={i} className={styles.patternItem}>
                <div>
                  <div className={styles.patternText}>
                    {match.pattern.length > 30
                      ? match.pattern.slice(0, 30) + '...'
                      : match.pattern}
                  </div>
                  <div className={styles.patternCategory}>
                    {match.category} · {match.language === 'ko' ? 'Korean' : match.language === 'en' ? 'English' : 'Both'}
                  </div>
                </div>
                <span className={styles.patternCount}>×{match.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No patterns detected yet. Enter some text to analyze.
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Text Statistics</h3>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{textStats.totalWords}</div>
            <div className={styles.statLabel}>Words</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{textStats.totalSentences}</div>
            <div className={styles.statLabel}>Sentences</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {(textStats.vocabularyDiversity * 100).toFixed(0)}%
            </div>
            <div className={styles.statLabel}>Vocab Diversity</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {textStats.averageSentenceLength.toFixed(1)}
            </div>
            <div className={styles.statLabel}>Avg Sent. Length</div>
          </div>
        </div>
      </div>
    </div>
  );
}
