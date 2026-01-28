import { useState, useCallback, useMemo } from 'react';
import type { FilterState } from '../types';
import { analyzeText } from '../analyzers/slopDetector';
import { DEFAULT_FILTER_STATE } from '../constants/slopPatterns';

export function useAnalysis() {
  const [text, setText] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const analysis = useMemo(() => {
    return analyzeText(text, filters);
  }, [text, filters]);

  const updateText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  return {
    text,
    filters,
    analysis,
    updateText,
    updateFilter,
    resetFilters,
  };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
