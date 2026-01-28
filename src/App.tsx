import { Dashboard } from './components/Canvas/Dashboard';
import { TextInput } from './components/TextInput/TextInput';
import { InsightPanel } from './components/InsightPanel/InsightPanel';
import { FilterControls } from './components/FilterControls/FilterControls';
import { useAnalysis } from './hooks/useAnalysis';
import styles from './App.module.css';

function App() {
  const {
    text,
    filters,
    analysis,
    updateText,
    updateFilter,
    resetFilters,
  } = useAnalysis();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Anti-<span className={styles.titleHighlight}>Slop</span> Dashboard
        </h1>
        <p className={styles.subtitle}>
          Real-time AI content detection for English and Korean text
        </p>
      </header>

      <main className={styles.layout}>
        <section className={styles.canvasSection}>
          <Dashboard analysis={analysis} />
        </section>

        <section className={styles.inputSection}>
          <TextInput
            value={text}
            onChange={updateText}
            sentenceScores={analysis.sentenceScores}
          />
        </section>

        <aside className={styles.sidebar}>
          <FilterControls
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
          />
          <InsightPanel analysis={analysis} />
        </aside>
      </main>

      <footer className={styles.footer}>
        Anti-Slop Dashboard v1.0 - Detecting AI "slop" patterns since 2026
      </footer>
    </div>
  );
}

export default App;
