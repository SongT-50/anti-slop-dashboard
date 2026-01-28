export interface SlopPattern {
  pattern: string | RegExp;
  weight: number;
  category: 'vocabulary' | 'structure' | 'punctuation' | 'style';
  language: 'en' | 'ko' | 'both';
}

export interface PatternMatch {
  pattern: string;
  matches: string[];
  count: number;
  positions: number[];
  category: string;
  language: string;
}

export interface TextStats {
  totalWords: number;
  totalSentences: number;
  averageSentenceLength: number;
  sentenceLengthVariance: number;
  uniqueWords: number;
  vocabularyDiversity: number;
  exclamationCount: number;
  colonCount: number;
  repetitionScore: number;
}

export interface AnalysisResult {
  aiProbability: number;
  patternMatches: PatternMatch[];
  textStats: TextStats;
  sentenceScores: SentenceScore[];
  overallScore: number;
  breakdown: ScoreBreakdown;
}

export interface SentenceScore {
  text: string;
  startIndex: number;
  endIndex: number;
  score: number;
  matchedPatterns: string[];
}

export interface ScoreBreakdown {
  vocabularyScore: number;
  structureScore: number;
  punctuationScore: number;
  styleScore: number;
  diversityScore: number;
}

export interface FilterState {
  vocabulary: boolean;
  structure: boolean;
  punctuation: boolean;
  style: boolean;
  englishPatterns: boolean;
  koreanPatterns: boolean;
  sensitivity: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface VisualizerState {
  particles: Particle[];
  heatmapData: number[];
  gaugeValue: number;
  waveOffset: number;
}
