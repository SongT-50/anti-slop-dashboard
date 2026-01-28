import type { FilterState } from '../../types';
import styles from './FilterControls.module.css';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
}

export function FilterControls({ filters, onFilterChange, onReset }: FilterControlsProps) {
  const categoryFilters = [
    { key: 'vocabulary' as const, label: 'Vocabulary', color: '#ff6b6b' },
    { key: 'structure' as const, label: 'Structure', color: '#4ecdc4' },
    { key: 'punctuation' as const, label: 'Punctuation', color: '#ffe66d' },
    { key: 'style' as const, label: 'Style', color: '#95e1d3' },
  ];

  const languageFilters = [
    { key: 'englishPatterns' as const, label: 'English', color: '#6c8' },
    { key: 'koreanPatterns' as const, label: 'Korean', color: '#c86' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter Controls</h3>
        <button className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Pattern Categories</div>
        <div className={styles.toggleGroup}>
          {categoryFilters.map(({ key, label, color }) => (
            <label
              key={key}
              className={`${styles.toggle} ${filters[key] ? styles.toggleActive : ''}`}
            >
              <input
                type="checkbox"
                className={styles.toggleCheckbox}
                checked={filters[key]}
                onChange={(e) => onFilterChange(key, e.target.checked)}
              />
              <span
                className={styles.colorIndicator}
                style={{ backgroundColor: color }}
              />
              <span className={styles.toggleLabel}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Languages</div>
        <div className={styles.toggleGroup}>
          {languageFilters.map(({ key, label, color }) => (
            <label
              key={key}
              className={`${styles.toggle} ${filters[key] ? styles.toggleActive : ''}`}
            >
              <input
                type="checkbox"
                className={styles.toggleCheckbox}
                checked={filters[key]}
                onChange={(e) => onFilterChange(key, e.target.checked)}
              />
              <span
                className={styles.colorIndicator}
                style={{ backgroundColor: color }}
              />
              <span className={styles.toggleLabel}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>Detection Sensitivity</span>
          <span className={styles.sliderValue}>{filters.sensitivity}%</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min="0"
          max="100"
          value={filters.sensitivity}
          onChange={(e) => onFilterChange('sensitivity', Number(e.target.value))}
        />
      </div>
    </div>
  );
}
