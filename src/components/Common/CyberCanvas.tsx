import React, { useEffect, useRef } from 'react';

export const CyberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid coordinates
    let gridOffset = 0;
    const gridSpacing = 45;

    // Particles/Nodes
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      char: string;
      color: string;
      opacity: number;
    }> = [];

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ☠⚡🔓🔒'.split('');

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 6,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        char: characters[Math.floor(Math.random() * characters.length)],
        color: Math.random() > 0.6 ? '#b9ff00' : '#e8000d',
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing Cyber Grid
      ctx.strokeStyle = 'rgba(232, 0, 13, 0.02)';
      ctx.lineWidth = 1;

      gridOffset = (gridOffset + 0.15) % gridSpacing;

      // Vertical lines
      for (let x = gridOffset; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = gridOffset; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Mouse Glow Aura
      if (mouseX > 0 && mouseY > 0) {
        const radGrd = ctx.createRadialGradient(
          mouseX,
          mouseY,
          10,
          mouseX,
          mouseY,
          220
        );
        radGrd.addColorStop(0, 'rgba(232, 0, 13, 0.04)');
        radGrd.addColorStop(0.5, 'rgba(185, 255, 0, 0.015)');
        radGrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrd;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Falling binary rain / manga characters
      ctx.font = "8px 'Share Tech Mono', monospace";
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.char, p.x, p.y);

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset off-screen particles
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
          p.char = characters[Math.floor(Math.random() * characters.length)];
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="cyber-canvas" />;
};
