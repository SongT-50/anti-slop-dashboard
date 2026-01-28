import type { SlopPattern } from '../types';

export const ENGLISH_SLOP_PATTERNS: SlopPattern[] = [
  // Vocabulary patterns - commonly overused AI words
  { pattern: /\bdelve\b/gi, weight: 0.8, category: 'vocabulary', language: 'en' },
  { pattern: /\btapestry\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bvibrant\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\belevate\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bnuanced\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bintricacies\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bdive deep\b/gi, weight: 0.8, category: 'vocabulary', language: 'en' },
  { pattern: /\bgroundbreaking\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bunleash\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bfoster\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },
  { pattern: /\blandscape\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },
  { pattern: /\brealm\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bparadigm\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bsynergy\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bholistic\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bleverage\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bseamless(ly)?\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\brobust\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },
  { pattern: /\bpivotal\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bmeticulous(ly)?\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bcommendable\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bnavigat(e|ing)\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },
  { pattern: /\bunderscore\b/gi, weight: 0.6, category: 'vocabulary', language: 'en' },
  { pattern: /\bembark\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bjourney\b/gi, weight: 0.4, category: 'vocabulary', language: 'en' },
  { pattern: /\btransformative\b/gi, weight: 0.7, category: 'vocabulary', language: 'en' },
  { pattern: /\bcomprehensive\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },
  { pattern: /\bfascinating\b/gi, weight: 0.5, category: 'vocabulary', language: 'en' },

  // Structure patterns
  { pattern: /\bIn conclusion,?\b/gi, weight: 0.6, category: 'structure', language: 'en' },
  { pattern: /\bIt'?s worth noting\b/gi, weight: 0.7, category: 'structure', language: 'en' },
  { pattern: /\bIt'?s important to\b/gi, weight: 0.5, category: 'structure', language: 'en' },
  { pattern: /\bLet me explain\b/gi, weight: 0.6, category: 'structure', language: 'en' },
  { pattern: /\bI hope this helps\b/gi, weight: 0.8, category: 'structure', language: 'en' },
  { pattern: /\bFeel free to\b/gi, weight: 0.6, category: 'structure', language: 'en' },
  { pattern: /\bIn today'?s\b/gi, weight: 0.5, category: 'structure', language: 'en' },
  { pattern: /\bIn this article\b/gi, weight: 0.5, category: 'structure', language: 'en' },

  // Style patterns
  { pattern: /\bAbsolutely!\b/gi, weight: 0.7, category: 'style', language: 'en' },
  { pattern: /\bGreat question!\b/gi, weight: 0.8, category: 'style', language: 'en' },
  { pattern: /\bCertainly!\b/gi, weight: 0.6, category: 'style', language: 'en' },
  { pattern: /\bOf course!\b/gi, weight: 0.5, category: 'style', language: 'en' },
];

export const KOREAN_SLOP_PATTERNS: SlopPattern[] = [
  // Vocabulary patterns
  { pattern: /살펴보겠습니다/g, weight: 0.7, category: 'vocabulary', language: 'ko' },
  { pattern: /알아보도록 하겠습니다/g, weight: 0.8, category: 'vocabulary', language: 'ko' },
  { pattern: /라고 할 수 있습니다/g, weight: 0.6, category: 'vocabulary', language: 'ko' },
  { pattern: /심층적으로/g, weight: 0.7, category: 'vocabulary', language: 'ko' },
  { pattern: /다양한 측면에서/g, weight: 0.7, category: 'vocabulary', language: 'ko' },
  { pattern: /본질적으로/g, weight: 0.6, category: 'vocabulary', language: 'ko' },
  { pattern: /혁신적인/g, weight: 0.5, category: 'vocabulary', language: 'ko' },
  { pattern: /핵심적인/g, weight: 0.4, category: 'vocabulary', language: 'ko' },
  { pattern: /중요한 점은/g, weight: 0.5, category: 'vocabulary', language: 'ko' },
  { pattern: /주목할 만한/g, weight: 0.6, category: 'vocabulary', language: 'ko' },
  { pattern: /특히 주목해야 할/g, weight: 0.7, category: 'vocabulary', language: 'ko' },
  { pattern: /말씀드리자면/g, weight: 0.6, category: 'vocabulary', language: 'ko' },
  { pattern: /결론적으로/g, weight: 0.5, category: 'vocabulary', language: 'ko' },
  { pattern: /궁극적으로/g, weight: 0.6, category: 'vocabulary', language: 'ko' },

  // Structure patterns - excessive honorifics
  { pattern: /드리겠습니다/g, weight: 0.4, category: 'structure', language: 'ko' },
  { pattern: /말씀드리겠습니다/g, weight: 0.5, category: 'structure', language: 'ko' },
  { pattern: /되겠습니다/g, weight: 0.3, category: 'structure', language: 'ko' },
  { pattern: /있으시다면/g, weight: 0.4, category: 'structure', language: 'ko' },

  // Passive voice patterns
  { pattern: /되어집니다/g, weight: 0.7, category: 'style', language: 'ko' },
  { pattern: /여겨집니다/g, weight: 0.6, category: 'style', language: 'ko' },
  { pattern: /생각됩니다/g, weight: 0.5, category: 'style', language: 'ko' },
  { pattern: /보여집니다/g, weight: 0.7, category: 'style', language: 'ko' },

  // AI-typical phrases
  { pattern: /도움이 되셨으면/g, weight: 0.7, category: 'style', language: 'ko' },
  { pattern: /도움이 되었으면/g, weight: 0.6, category: 'style', language: 'ko' },
  { pattern: /궁금한 점이 있으시면/g, weight: 0.6, category: 'style', language: 'ko' },
  { pattern: /추가적인 질문/g, weight: 0.5, category: 'style', language: 'ko' },
];

export const PUNCTUATION_PATTERNS: SlopPattern[] = [
  { pattern: /!{2,}/g, weight: 0.8, category: 'punctuation', language: 'both' },
  { pattern: /:{2,}/g, weight: 0.6, category: 'punctuation', language: 'both' },
  { pattern: /\.{4,}/g, weight: 0.5, category: 'punctuation', language: 'both' },
];

export const ALL_PATTERNS: SlopPattern[] = [
  ...ENGLISH_SLOP_PATTERNS,
  ...KOREAN_SLOP_PATTERNS,
  ...PUNCTUATION_PATTERNS,
];

export const CATEGORY_WEIGHTS = {
  vocabulary: 0.35,
  structure: 0.25,
  punctuation: 0.15,
  style: 0.25,
};

export const DEFAULT_FILTER_STATE = {
  vocabulary: true,
  structure: true,
  punctuation: true,
  style: true,
  englishPatterns: true,
  koreanPatterns: true,
  sensitivity: 50,
};
