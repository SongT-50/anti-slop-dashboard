import type { AnalysisResult, ScoreBreakdown } from '../../types';
import { ParticleSystem } from './ParticleSystem';

export class Visualizer {
  private particleSystem: ParticleSystem;
  private waveOffset: number = 0;
  private gaugeValue: number = 0;
  private targetGaugeValue: number = 0;
  private width: number;
  private height: number;

  constructor(width: number = 800, height: number = 400) {
    this.width = width;
    this.height = height;
    this.particleSystem = new ParticleSystem(150, width, height);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.particleSystem.resize(width, height);
  }

  update(analysis: AnalysisResult) {
    this.targetGaugeValue = analysis.aiProbability;
    this.gaugeValue += (this.targetGaugeValue - this.gaugeValue) * 0.1;
    this.waveOffset += 0.05;
    this.particleSystem.update(analysis.aiProbability);
  }

  draw(ctx: CanvasRenderingContext2D, analysis: AnalysisResult) {
    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw background gradient
    this.drawBackground(ctx);

    // Draw wave effect
    this.drawWaves(ctx, analysis.aiProbability);

    // Draw particles
    this.particleSystem.draw(ctx);

    // Draw category bars
    this.drawCategoryBars(ctx, analysis.breakdown);

    // Draw central gauge
    this.drawGauge(ctx);

    // Draw heatmap overlay
    this.drawHeatmapOverlay(ctx, analysis);
  }

  private drawBackground(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, this.width / 2
    );
    gradient.addColorStop(0, 'rgba(20, 20, 40, 0.8)');
    gradient.addColorStop(1, 'rgba(10, 10, 15, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawWaves(ctx: CanvasRenderingContext2D, probability: number) {
    const intensity = probability / 100;
    const waveCount = 3;

    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath();
      ctx.moveTo(0, this.height / 2);

      for (let x = 0; x <= this.width; x += 5) {
        const y = this.height / 2 +
          Math.sin(x * 0.02 + this.waveOffset + w) * 20 * intensity +
          Math.sin(x * 0.01 + this.waveOffset * 0.5 + w * 2) * 15 * intensity;
        ctx.lineTo(x, y);
      }

      const hue = 120 - intensity * 120;
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${0.2 - w * 0.05})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  private drawCategoryBars(ctx: CanvasRenderingContext2D, breakdown: ScoreBreakdown) {
    const categories = [
      { name: 'Vocabulary', value: breakdown.vocabularyScore, color: '#ff6b6b' },
      { name: 'Structure', value: breakdown.structureScore, color: '#4ecdc4' },
      { name: 'Punctuation', value: breakdown.punctuationScore, color: '#ffe66d' },
      { name: 'Style', value: breakdown.styleScore, color: '#95e1d3' },
      { name: 'Diversity', value: breakdown.diversityScore, color: '#a8d8ea' },
    ];

    const barWidth = 15;
    const barMaxHeight = 80;
    const startX = 20;
    const startY = this.height - 20;
    const gap = 50;

    categories.forEach((cat, i) => {
      const x = startX + i * gap;
      const barHeight = cat.value * barMaxHeight;

      // Bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x, startY - barMaxHeight, barWidth, barMaxHeight);

      // Bar fill with gradient
      const gradient = ctx.createLinearGradient(x, startY, x, startY - barHeight);
      gradient.addColorStop(0, cat.color);
      gradient.addColorStop(1, `${cat.color}88`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, startY - barHeight, barWidth, barHeight);

      // Label
      ctx.save();
      ctx.fillStyle = '#888';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(cat.name.slice(0, 4), x + barWidth / 2, startY + 15);
      ctx.restore();
    });
  }

  private drawGauge(ctx: CanvasRenderingContext2D) {
    const centerX = this.width - 80;
    const centerY = 80;
    const radius = 50;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress arc
    const progress = this.gaugeValue / 100;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + progress * Math.PI * 2;

    const hue = 120 - progress * 120;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(this.gaugeValue)}%`, centerX, centerY - 5);

    ctx.fillStyle = '#888';
    ctx.font = '10px system-ui';
    ctx.fillText('AI Prob', centerX, centerY + 15);
  }

  private drawHeatmapOverlay(ctx: CanvasRenderingContext2D, analysis: AnalysisResult) {
    if (!analysis.sentenceScores.length) return;

    const heatmapHeight = 30;
    const heatmapY = 10;
    const heatmapWidth = this.width - 200;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(10, heatmapY, heatmapWidth, heatmapHeight);

    // Draw heatmap cells
    const cellWidth = heatmapWidth / Math.max(analysis.sentenceScores.length, 1);

    analysis.sentenceScores.forEach((sentence, i) => {
      const hue = 120 - sentence.score * 120;
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
      ctx.fillRect(10 + i * cellWidth, heatmapY, cellWidth - 1, heatmapHeight);
    });

    // Label
    ctx.fillStyle = '#666';
    ctx.font = '10px system-ui';
    ctx.fillText('Sentence Heatmap', 10, heatmapY + heatmapHeight + 12);
  }

  clear() {
    this.particleSystem.clear();
    this.gaugeValue = 0;
    this.targetGaugeValue = 0;
  }
}
