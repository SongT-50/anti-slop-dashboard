import type { Particle } from '../../types';

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number;
  private width: number;
  private height: number;

  constructor(maxParticles: number = 150, width: number = 800, height: number = 400) {
    this.maxParticles = maxParticles;
    this.width = width;
    this.height = height;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update(aiProbability: number) {
    // Target particle count based on AI probability
    const targetCount = Math.floor(this.maxParticles * (aiProbability / 100));

    // Add particles if needed
    while (this.particles.length < targetCount) {
      this.addParticle(aiProbability);
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Update life
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);

      // Bounce off walls
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Remove excess particles gradually
    while (this.particles.length > targetCount + 10) {
      // Find oldest particle
      let oldestIdx = 0;
      let minLife = Infinity;
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i].life < minLife) {
          minLife = this.particles[i].life;
          oldestIdx = i;
        }
      }
      this.particles.splice(oldestIdx, 1);
    }
  }

  private addParticle(aiProbability: number) {
    const hue = this.getHue(aiProbability);
    const saturation = 70 + Math.random() * 30;
    const lightness = 50 + Math.random() * 20;

    const particle: Particle = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 4,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      alpha: 1,
      life: 100 + Math.random() * 100,
      maxLife: 200,
    };

    this.particles.push(particle);
  }

  private getHue(aiProbability: number): number {
    // Green (120) for low probability, Red (0) for high probability
    return 120 - (aiProbability / 100) * 120;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Draw connections between nearby particles
    this.drawConnections(ctx);
  }

  private drawConnections(ctx: CanvasRenderingContext2D) {
    const maxDistance = 80;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.3 * Math.min(p1.alpha, p2.alpha);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = p1.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  clear() {
    this.particles = [];
  }
}
