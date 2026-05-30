import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  speed?: number;
  delay?: number;
  triggerOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*_+?/';

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  speed = 30,
  delay = 0,
  triggerOnHover = false,
  className = '',
  style = {}
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Initial run
    if (!triggerOnHover) {
      const timer = setTimeout(() => {
        scramble();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [text, delay, triggerOnHover]);

  useEffect(() => {
    if (triggerOnHover && isHovered) {
      scramble();
    } else if (triggerOnHover && !isHovered) {
      setDisplayText(text);
    }
  }, [isHovered, triggerOnHover, text]);

  const scramble = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    
    let frame = 0;
    const maxFrames = text.length * 3;
    
    const tick = () => {
      if (frame >= maxFrames) {
        setDisplayText(text);
        return;
      }
      
      const scrambled = text.split('').map((char, index) => {
        if (char === ' ') return ' ';
        // Probability of showing correct character increases over time
        const progress = frame / maxFrames;
        if (index / text.length < progress) {
          return text[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      
      setDisplayText(scrambled);
      frame += 1;
      frameRef.current = requestAnimationFrame(tick);
    };
    
    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <span 
      className={className} 
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
};
