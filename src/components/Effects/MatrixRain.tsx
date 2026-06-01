import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  color?: string;
  opacity?: number;
  fontSize?: number;
  speed?: number;
}

const GLYPHS = '0123456789ABCDEF:.|\\!?░▒▓';

export const MatrixRain: React.FC<MatrixRainProps> = ({
  className = '',
  color = '#00ff55',
  opacity = 0.07,
  fontSize = 11,
  speed = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let intervalId: ReturnType<typeof setInterval>;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    resize();

    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -(canvas.height / fontSize))
    );

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i];
        if (y < 0) { drops[i]++; continue; }

        // Brighter head char
        ctx.globalAlpha = opacity * 2.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * fontSize, y * fontSize);

        // Tail char
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        if (y > 1) {
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * fontSize, (y - 1) * fontSize);
        }

        ctx.globalAlpha = 1;

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    intervalId = setInterval(() => {
      animId = requestAnimationFrame(draw);
    }, speed);

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [color, opacity, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`matrix-rain-canvas ${className}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%' }}
    />
  );
};
