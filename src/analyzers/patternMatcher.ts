import type { SlopPattern, PatternMatch, FilterState } from '../types';
import { ALL_PATTERNS } from '../constants/slopPatterns';

export function matchPatterns(text: string, filters: FilterState): PatternMatch[] {
  const matches: PatternMatch[] = [];

  const filteredPatterns = ALL_PATTERNS.filter(pattern => {
    // Filter by category
    if (!filters[pattern.category as keyof FilterState]) return false;

    // Filter by language
    if (pattern.language === 'en' && !filters.englishPatterns) return false;
    if (pattern.language === 'ko' && !filters.koreanPatterns) return false;

    return true;
  });

  for (const slopPattern of filteredPatterns) {
    const patternMatches = findMatches(text, slopPattern);
    if (patternMatches.count > 0) {
      matches.push(patternMatches);
    }
  }

  return matches;
}

function findMatches(text: string, slopPattern: SlopPattern): PatternMatch {
  const matches: string[] = [];
  const positions: number[] = [];

  const regex = slopPattern.pattern instanceof RegExp
    ? new RegExp(slopPattern.pattern.source, slopPattern.pattern.flags)
    : new RegExp(escapeRegex(slopPattern.pattern), 'gi');

  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);
    positions.push(match.index);

    // Prevent infinite loop for zero-length matches
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }

  return {
    pattern: slopPattern.pattern instanceof RegExp
      ? slopPattern.pattern.source
      : slopPattern.pattern,
    matches,
    count: matches.length,
    positions,
    category: slopPattern.category,
    language: slopPattern.language,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getPatternWeight(pattern: string): number {
  const found = ALL_PATTERNS.find(p => {
    if (p.pattern instanceof RegExp) {
      return p.pattern.source === pattern;
    }
    return p.pattern === pattern;
  });
  return found?.weight || 0.5;
}

export function calculatePatternScore(matches: PatternMatch[], textLength: number): number {
  if (textLength === 0) return 0;

  let totalScore = 0;

  for (const match of matches) {
    const weight = getPatternWeight(match.pattern);
    // More matches of same pattern have diminishing returns
    const countScore = Math.log2(match.count + 1);
    totalScore += weight * countScore;
  }

  // Normalize by text length (per 100 words approximately)
  const normalizedScore = (totalScore / Math.max(textLength / 500, 1)) * 0.5;

  return Math.min(normalizedScore, 1);
}

export function groupMatchesByCategory(matches: PatternMatch[]): Record<string, PatternMatch[]> {
  const grouped: Record<string, PatternMatch[]> = {
    vocabulary: [],
    structure: [],
    punctuation: [],
    style: [],
  };

  for (const match of matches) {
    if (grouped[match.category]) {
      grouped[match.category].push(match);
    }
  }

  return grouped;
}
