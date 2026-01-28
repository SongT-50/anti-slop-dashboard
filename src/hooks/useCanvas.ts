import { useRef, useEffect, useCallback } from 'react';

interface UseCanvasOptions {
  width?: number;
  height?: number;
  onDraw?: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  fps?: number;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const { onDraw, fps = 60 } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    const frameInterval = 1000 / fps;

    if (now - lastFrameTimeRef.current >= frameInterval) {
      frameCountRef.current++;
      lastFrameTimeRef.current = now;

      if (onDraw) {
        onDraw(ctx, frameCountRef.current);
      }
    }

    animationIdRef.current = requestAnimationFrame(draw);
  }, [onDraw, fps]);

  useEffect(() => {
    draw();

    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [draw]);

  const getCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: 0 };
    return { width: canvas.width, height: canvas.height };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  return {
    canvasRef,
    getCanvasSize,
    resizeCanvas,
  };
}

export function useMousePosition(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef]);

  return mousePos;
}
