import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CipherTextProps {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  triggerOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const CIPHER_CHARS = '0123456789ABCDEF:.|/\\!@#$%^&*<>?░▒▓█';
const HEX_CHARS = '0123456789ABCDEF';

function randomChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export const CipherText: React.FC<CipherTextProps> = ({
  text,
  speed = 28,
  delay = 0,
  loop = false,
  triggerOnHover = false,
  className = '',
  style = {},
  onComplete,
}) => {
  const [chars, setChars] = useState<string[]>(() =>
    text.split('').map(c => (c === ' ' ? ' ' : randomChar(CIPHER_CHARS)))
  );
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const run = useCallback((target: string) => {
    cancel();
    startedRef.current = true;
    setDone(false);

    const locked = target.split('').map(c => c === ' ');
    let frame = 0;
    // Each char gets a random "lock frame" — staggered left-to-right with jitter
    const lockAt = target.split('').map((c, i) =>
      c === ' ' ? 0 : Math.floor(i * 1.8 + Math.random() * 6 + 2)
    );
    const totalFrames = Math.max(...lockAt) + 4;

    const tick = () => {
      frame++;
      setChars(prev =>
        target.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (locked[i] || frame >= lockAt[i]) {
            locked[i] = true;
            return ch;
          }
          // Alternate between full cipher pool and hex-only for "resolving" feel
          return frame % 3 === 0
            ? randomChar(HEX_CHARS)
            : randomChar(CIPHER_CHARS);
        })
      );

      if (frame >= totalFrames) {
        setChars(target.split(''));
        setDone(true);
        onComplete?.();
        if (loop) {
          timerRef.current = setTimeout(() => run(target), 3000 + Math.random() * 2000);
        }
        return;
      }

      timerRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(tick);
      }, speed);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [speed, loop, onComplete]);

  // Auto-run on mount if not hover-triggered
  useEffect(() => {
    if (triggerOnHover) return;
    timerRef.current = setTimeout(() => run(text), delay);
    return cancel;
  }, [text, delay, triggerOnHover]);

  // Hover-trigger mode
  useEffect(() => {
    if (!triggerOnHover) return;
    if (hovered) {
      run(text);
    } else if (!hovered && startedRef.current) {
      cancel();
      setChars(text.split(''));
      setDone(true);
    }
  }, [hovered, triggerOnHover, text]);

  return (
    <span
      className={`cipher-text ${done ? 'cipher-done' : 'cipher-running'} ${className}`}
      style={style}
      onMouseEnter={() => { if (triggerOnHover) setHovered(true); }}
      onMouseLeave={() => { if (triggerOnHover) setHovered(false); }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          className={ch === text[i] ? 'cipher-char-locked' : 'cipher-char-live'}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};
