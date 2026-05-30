import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  color?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  triggerOnHover = true,
  color = 'var(--red)',
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (triggerOnHover) return;

    // Trigger glitch randomly every few seconds
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
    }, 2500 + Math.random() * 3500);

    return () => clearInterval(interval);
  }, [triggerOnHover]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 400);
    }
  };

  return (
    <span 
      className={`glitch-wrapper ${isGlitching ? 'glitching' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      data-text={text}
      style={{ '--glitch-color': color } as any}
    >
      <style>{`
        .glitch-wrapper {
          position: relative;
          display: inline-block;
        }
        .glitch-wrapper.glitching::before,
        .glitch-wrapper.glitching::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .glitch-wrapper.glitching::before {
          text-shadow: -2px 0 #ff0055;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim-1 0.25s infinite linear alternate-reverse;
        }
        .glitch-wrapper.glitching::after {
          text-shadow: -2px 0 #00ffff;
          clip: rect(85px, 450px, 140px, 0);
          animation: glitch-anim-2 0.25s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% {
            clip: rect(20px, 9999px, 66px, 0);
            transform: skew(0.3deg);
          }
          10% {
            clip: rect(80px, 9999px, 5px, 0);
            transform: skew(-0.5deg);
          }
          20% {
            clip: rect(50px, 9999px, 115px, 0);
            transform: skew(0.8deg);
          }
          30% {
            clip: rect(12px, 9999px, 55px, 0);
            transform: skew(-0.3deg);
          }
          40% {
            clip: rect(76px, 9999px, 92px, 0);
            transform: skew(0.5deg);
          }
          50% {
            clip: rect(33px, 9999px, 10px, 0);
            transform: skew(-0.8deg);
          }
          60% {
            clip: rect(95px, 9999px, 78px, 0);
            transform: skew(0.3deg);
          }
          70% {
            clip: rect(5px, 9999px, 110px, 0);
            transform: skew(-0.5deg);
          }
          80% {
            clip: rect(45px, 9999px, 30px, 0);
            transform: skew(0.8deg);
          }
          90% {
            clip: rect(82px, 9999px, 85px, 0);
            transform: skew(-0.3deg);
          }
          100% {
            clip: rect(18px, 9999px, 50px, 0);
            transform: skew(0.5deg);
          }
        }
        @keyframes glitch-anim-2 {
          0% {
            clip: rect(70px, 9999px, 105px, 0);
            transform: skew(-0.5deg);
          }
          10% {
            clip: rect(22px, 9999px, 50px, 0);
            transform: skew(0.3deg);
          }
          20% {
            clip: rect(85px, 9999px, 12px, 0);
            transform: skew(-0.8deg);
          }
          30% {
            clip: rect(40px, 9999px, 95px, 0);
            transform: skew(0.5deg);
          }
          40% {
            clip: rect(10px, 9999px, 60px, 0);
            transform: skew(-0.3deg);
          }
          50% {
            clip: rect(62px, 9999px, 118px, 0);
            transform: skew(0.8deg);
          }
          60% {
            clip: rect(30px, 9999px, 5px, 0);
            transform: skew(-0.5deg);
          }
          70% {
            clip: rect(92px, 9999px, 80px, 0);
            transform: skew(0.3deg);
          }
          80% {
            clip: rect(15px, 9999px, 45px, 0);
            transform: skew(-0.8deg);
          }
          90% {
            clip: rect(78px, 9999px, 110px, 0);
            transform: skew(0.5deg);
          }
          100% {
            clip: rect(53px, 9999px, 20px, 0);
            transform: skew(-0.3deg);
          }
        }
      `}</style>
      {text}
    </span>
  );
};
