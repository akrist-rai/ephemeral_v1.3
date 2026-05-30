import React, { useRef, useState } from 'react';

interface PointerGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const PointerGlow: React.FC<PointerGlowProps> = ({
  color = '#e8000d',
  size = 300,
  opacity = 0.08,
  className = '',
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={containerRef}
      className={`pointer-glow-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {isActive && (
        <div
          className="pointer-glow-bubble"
          style={{
            position: 'absolute',
            left: coords.x - size / 2,
            top: coords.y - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: opacity,
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'opacity 0.2s ease, transform 0.1s ease'
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};
