import type { TextStats } from '../types';

export function analyzeTextStats(text: string): TextStats {
  if (!text.trim()) {
    return {
      totalWords: 0,
      totalSentences: 0,
      averageSentenceLength: 0,
      sentenceLengthVariance: 0,
      uniqueWords: 0,
      vocabularyDiversity: 0,
      exclamationCount: 0,
      colonCount: 0,
      repetitionScore: 0,
    };
  }

  // Split into words (handles both English and Korean)
  const words = text.match(/[\w가-힣]+/g) || [];
  const totalWords = words.length;

  // Split into sentences
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const totalSentences = Math.max(sentences.length, 1);

  // Calculate sentence lengths
  const sentenceLengths = sentences.map(s => {
    const sentenceWords = s.match(/[\w가-힣]+/g) || [];
    return sentenceWords.length;
  });

  const averageSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / totalSentences;

  // Calculate variance in sentence length
  const sentenceLengthVariance = calculateVariance(sentenceLengths, averageSentenceLength);

  // Vocabulary diversity
  const lowercaseWords = words.map(w => w.toLowerCase());
  const uniqueWords = new Set(lowercaseWords).size;
  const vocabularyDiversity = totalWords > 0 ? uniqueWords / totalWords : 0;

  // Punctuation counts
  const exclamationCount = (text.match(/!/g) || []).length;
  const colonCount = (text.match(/:/g) || []).length;

  // Repetition score - check for repeated phrases
  const repetitionScore = calculateRepetitionScore(text);

  return {
    totalWords,
    totalSentences,
    averageSentenceLength,
    sentenceLengthVariance,
    uniqueWords,
    vocabularyDiversity,
    exclamationCount,
    colonCount,
    repetitionScore,
  };
}

function calculateVariance(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function calculateRepetitionScore(text: string): number {
  // Extract n-grams and check for repetition
  const words = text.toLowerCase().match(/[\w가-힣]+/g) || [];
  if (words.length < 6) return 0;

  const trigrams: Map<string, number> = new Map();

  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
  }

  // Count repeated trigrams
  let repeatedCount = 0;
  trigrams.forEach(count => {
    if (count > 1) repeatedCount += count - 1;
  });

  // Normalize by total possible trigrams
  const totalTrigrams = words.length - 2;
  return totalTrigrams > 0 ? Math.min(repeatedCount / totalTrigrams, 1) : 0;
}

export function calculateDiversityPenalty(stats: TextStats): number {
  // Low vocabulary diversity is suspicious
  const diversityPenalty = stats.vocabularyDiversity < 0.4 ? (0.4 - stats.vocabularyDiversity) * 0.5 : 0;

  // Very uniform sentence length is suspicious
  const variancePenalty = stats.sentenceLengthVariance < 5 && stats.totalSentences > 3
    ? (5 - stats.sentenceLengthVariance) * 0.02
    : 0;

  // Excessive exclamations
  const exclamationRatio = stats.totalSentences > 0
    ? stats.exclamationCount / stats.totalSentences
    : 0;
  const exclamationPenalty = exclamationRatio > 0.3 ? (exclamationRatio - 0.3) * 0.3 : 0;

  // Excessive colons
  const colonRatio = stats.totalSentences > 0
    ? stats.colonCount / stats.totalSentences
    : 0;
  const colonPenalty = colonRatio > 0.5 ? (colonRatio - 0.5) * 0.2 : 0;

  // Repetition penalty
  const repetitionPenalty = stats.repetitionScore * 0.3;

  return Math.min(
    diversityPenalty + variancePenalty + exclamationPenalty + colonPenalty + repetitionPenalty,
    0.3
  );
}
