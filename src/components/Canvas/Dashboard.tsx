import { useRef, useEffect, useCallback } from 'react';
import type { AnalysisResult } from '../../types';
import { Visualizer } from './Visualizer';
import styles from './Dashboard.module.css';

interface DashboardProps {
  analysis: AnalysisResult;
}

export function Dashboard({ analysis }: DashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<Visualizer | null>(null);
  const animationRef = useRef<number | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    if (visualizerRef.current) {
      visualizerRef.current.resize(rect.width, rect.height);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    visualizerRef.current = new Visualizer(rect.width, rect.height);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const visualizer = visualizerRef.current;
    if (!visualizer) return;

    let lastTime = 0;
    const frameInterval = 1000 / 60;

    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= frameInterval) {
        if (containerRef.current) {
          visualizer.update(analysis);
          visualizer.draw(ctx, analysis);
        }
        lastTime = timestamp;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analysis]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.statsOverlay}>
        <span>Words: <strong>{analysis.textStats.totalWords}</strong></span>
        <span>Sentences: <strong>{analysis.textStats.totalSentences}</strong></span>
        <span>Diversity: <strong>{(analysis.textStats.vocabularyDiversity * 100).toFixed(0)}%</strong></span>
      </div>
    </div>
  );
}
