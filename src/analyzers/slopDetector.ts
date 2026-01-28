import type {
  AnalysisResult,
  FilterState,
  SentenceScore,
  ScoreBreakdown,
  PatternMatch,
} from '../types';
import { analyzeTextStats, calculateDiversityPenalty } from './textStats';
import {
  matchPatterns,
  calculatePatternScore,
  groupMatchesByCategory,
} from './patternMatcher';
import { CATEGORY_WEIGHTS, ALL_PATTERNS } from '../constants/slopPatterns';

export function analyzeText(text: string, filters: FilterState): AnalysisResult {
  if (!text.trim()) {
    return createEmptyResult();
  }

  // Get text statistics
  const textStats = analyzeTextStats(text);

  // Find all pattern matches
  const patternMatches = matchPatterns(text, filters);

  // Calculate scores by category
  const groupedMatches = groupMatchesByCategory(patternMatches);

  const breakdown: ScoreBreakdown = {
    vocabularyScore: calculateCategoryScore(groupedMatches.vocabulary, text.length),
    structureScore: calculateCategoryScore(groupedMatches.structure, text.length),
    punctuationScore: calculateCategoryScore(groupedMatches.punctuation, text.length),
    styleScore: calculateCategoryScore(groupedMatches.style, text.length),
    diversityScore: calculateDiversityPenalty(textStats),
  };

  // Calculate sentence-level scores
  const sentenceScores = analyzeSentences(text, filters);

  // Calculate overall score with sensitivity adjustment
  const sensitivityMultiplier = filters.sensitivity / 50; // 0-2 range
  const baseScore = calculateOverallScore(breakdown, textStats);
  const overallScore = Math.min(baseScore * sensitivityMultiplier, 1);

  // Convert to AI probability percentage
  const aiProbability = Math.round(overallScore * 100);

  return {
    aiProbability,
    patternMatches,
    textStats,
    sentenceScores,
    overallScore,
    breakdown,
  };
}

function createEmptyResult(): AnalysisResult {
  return {
    aiProbability: 0,
    patternMatches: [],
    textStats: {
      totalWords: 0,
      totalSentences: 0,
      averageSentenceLength: 0,
      sentenceLengthVariance: 0,
      uniqueWords: 0,
      vocabularyDiversity: 0,
      exclamationCount: 0,
      colonCount: 0,
      repetitionScore: 0,
    },
    sentenceScores: [],
    overallScore: 0,
    breakdown: {
      vocabularyScore: 0,
      structureScore: 0,
      punctuationScore: 0,
      styleScore: 0,
      diversityScore: 0,
    },
  };
}

function calculateCategoryScore(matches: PatternMatch[], textLength: number): number {
  return calculatePatternScore(matches, textLength);
}

function calculateOverallScore(breakdown: ScoreBreakdown, textStats: import('../types').TextStats): number {
  // Weighted combination of category scores
  const weightedScore =
    breakdown.vocabularyScore * CATEGORY_WEIGHTS.vocabulary +
    breakdown.structureScore * CATEGORY_WEIGHTS.structure +
    breakdown.punctuationScore * CATEGORY_WEIGHTS.punctuation +
    breakdown.styleScore * CATEGORY_WEIGHTS.style;

  // Add diversity penalty
  const totalScore = weightedScore + breakdown.diversityScore;

  // Apply text length factor - very short texts are less reliable
  const lengthFactor = textStats.totalWords < 20 ? textStats.totalWords / 20 : 1;

  return Math.min(totalScore * lengthFactor, 1);
}

function analyzeSentences(text: string, filters: FilterState): SentenceScore[] {
  const sentenceRegex = /[^.!?。！？]+[.!?。！？]*/g;
  const sentences: SentenceScore[] = [];
  let match;

  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentenceText = match[0].trim();
    if (!sentenceText) continue;

    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    // Find patterns in this sentence
    const matchedPatterns: string[] = [];
    let sentenceScore = 0;

    for (const pattern of ALL_PATTERNS) {
      // Apply filters
      if (!filters[pattern.category as keyof FilterState]) continue;
      if (pattern.language === 'en' && !filters.englishPatterns) continue;
      if (pattern.language === 'ko' && !filters.koreanPatterns) continue;

      const regex = pattern.pattern instanceof RegExp
        ? new RegExp(pattern.pattern.source, pattern.pattern.flags)
        : new RegExp(pattern.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

      if (regex.test(sentenceText)) {
        matchedPatterns.push(
          pattern.pattern instanceof RegExp
            ? pattern.pattern.source
            : pattern.pattern
        );
        sentenceScore += pattern.weight;
      }
    }

    // Normalize sentence score
    const normalizedScore = Math.min(sentenceScore / 3, 1);

    sentences.push({
      text: sentenceText,
      startIndex,
      endIndex,
      score: normalizedScore,
      matchedPatterns,
    });
  }

  return sentences;
}

export function getHighlightedText(
  text: string,
  sentenceScores: SentenceScore[]
): Array<{ text: string; score: number; isHighlighted: boolean }> {
  if (!sentenceScores.length) {
    return [{ text, score: 0, isHighlighted: false }];
  }

  const result: Array<{ text: string; score: number; isHighlighted: boolean }> = [];
  let lastIndex = 0;

  for (const sentence of sentenceScores) {
    // Add any text before this sentence
    if (sentence.startIndex > lastIndex) {
      result.push({
        text: text.slice(lastIndex, sentence.startIndex),
        score: 0,
        isHighlighted: false,
      });
    }

    // Add the sentence
    result.push({
      text: sentence.text,
      score: sentence.score,
      isHighlighted: sentence.score > 0.3,
    });

    lastIndex = sentence.endIndex;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      score: 0,
      isHighlighted: false,
    });
  }

  return result;
}
