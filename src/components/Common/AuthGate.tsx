import React, { useState, useEffect, useRef } from 'react';
import { CyberCanvas } from './CyberCanvas';

interface AuthGateProps {
  onAuth: (userId: string, displayName: string) => void;
}

const ADJECTIVES = ['SILENT', 'VOID', 'QUANTUM', 'CYBER', 'SPECTRAL', 'IRON', 'BINARY', 'PHANTOM', 'NEURAL', 'DARK', 'ROGUE', 'NEON'];
const NOUNS = ['KNIGHT', 'GHOST', 'CIPHER', 'WOLF', 'ORACLE', 'REAPER', 'VECTOR', 'WRAITH', 'NEXUS', 'PROTOCOL'];

function randHandle() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}_${noun}_${num}`;
}

const FEATURES = [
  { icon: '⚡', title: 'CTF CHALLENGES', desc: 'Real-world exploit scenarios across cryptography, web security, OSINT, and reverse engineering.' },
  { icon: '◈', title: 'XP PROGRESSION', desc: 'Earn experience points, unlock ranks, and climb the global leaderboard with each flag captured.' },
  { icon: '▶', title: 'EPISODE ARCS', desc: 'Story-driven learning modules structured like anime arcs — each episode a deeper layer of the rabbit hole.' },
  { icon: '⊕', title: 'BOUNTY BOARD', desc: 'Compete against operators worldwide. First blood bonuses. Time-locked ranked sieges.' },
];

const STATS = [
  { val: '32+', label: 'EPISODES' },
  { val: '8', label: 'DOMAINS' },
  { val: '120+', label: 'CTF FLAGS' },
  { val: '∞', label: 'OPERATORS' },
];

const TERMINAL_LINES = [
  '> EPHEMERAL_OS v1.3 BOOT SEQUENCE INITIATED...',
  '> LOADING NEURAL NETWORK MODULES......... [OK]',
  '> CRYPTOGRAPHY ENGINE..................... [OK]',
  '> CTF CHALLENGE DATABASE SYNCED.......... [OK]',
  '> GLOBAL LEADERBOARD CONNECTED........... [OK]',
  '> AWAITING OPERATOR IDENTITY...',
];

export const AuthGate: React.FC<AuthGateProps> = ({ onAuth }) => {
  const [handle, setHandle] = useState(randHandle());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'landing' | 'auth'>('landing');
  const [glitchActive, setGlitchActive] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Terminal boot sequence
  useEffect(() => {
    let lineIdx = 0;
    const addLine = () => {
      if (lineIdx >= TERMINAL_LINES.length) return;
      setTermLines(prev => [...prev, TERMINAL_LINES[lineIdx++]]);
      if (lineIdx < TERMINAL_LINES.length) setTimeout(addLine, 320 + Math.random() * 200);
    };
    const t = setTimeout(addLine, 600);
    return () => clearTimeout(t);
  }, []);

  // Random glitch intervals
  useEffect(() => {
    const glitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
      setTimeout(glitch, 4000 + Math.random() * 6000);
    };
    const t = setTimeout(glitch, 3000);
    return () => clearTimeout(t);
  }, []);

  const VALID = /^[A-Za-z0-9_-]{3,24}$/;

  const commit = async () => {
    const h = handle.trim().toUpperCase().replace(/\s+/g, '_');
    if (!VALID.test(h)) {
      setError('3–24 chars. Letters, numbers, _ and - only.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/progress/${encodeURIComponent(h)}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      localStorage.setItem('ephemeral_user_id', h);
      localStorage.setItem('ephemeral_display_name', h);
      onAuth(h, h);
    } catch (e: any) {
      setError(`Connection failed: ${e.message}`);
      setLoading(false);
    }
  };

  const triggerScramble = (targetHandle: string) => {
    if (isScrambling) return;
    setIsScrambling(true);
    let count = 0;
    const maxScrambles = 10;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    
    const interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < targetHandle.length; i++) {
        if (i < (count / maxScrambles) * targetHandle.length) {
          scrambled += targetHandle[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setHandle(scrambled);
      count++;
      
      if (count > maxScrambles) {
        clearInterval(interval);
        setHandle(targetHandle);
        setIsScrambling(false);
      }
    }, 30);
  };

  const enterAuth = () => {
    setPhase('auth');
    setTimeout(() => {
      inputRef.current?.focus();
      triggerScramble(randHandle());
    }, 100);
  };

  const handleRandomize = () => {
    triggerScramble(randHandle());
  };

  return (
    <div className="lander-root">
      {/* Interactive Background Matrix */}
      <CyberCanvas />
      {/* Scanlines */}
      <div className="lander-scanlines" />

      {/* ── NAVBAR ── */}
      <nav className="lander-nav">
        <div className="lander-nav-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lander-compass">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span className="lander-logo-text"><em>E</em>PHEMERAL</span>
        </div>
        <div className="lander-nav-links">
          <span className="lander-nav-tag">// NETWORK ACTIVE</span>
          <span className="lander-nav-dot" />
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="lander-hero">
        <div className="lander-hero-left">
          {/* Eyebrow */}
          <div className="lander-eyebrow">
            <span className="lander-eyebrow-pill">◉ LIVE</span>
            <span className="lander-eyebrow-text">ACN_EPHEMERAL // v1.3 // NETWORK ONLINE</span>
          </div>

          {/* Main headline */}
          <h1 className={`lander-h1 ${glitchActive ? 'glitch-active' : ''}`} data-text="BREAK THE SYSTEM">
            BREAK<br />THE<br /><span className="lander-h1-accent">SYSTEM</span>
          </h1>

          <p className="lander-tagline">
            A cyberpunk CTF academy where you learn hacking through story-driven episodes,
            real exploit challenges, and global competition. No prior experience required.
            Just the will to go deeper.
          </p>

          {/* Stats row */}
          <div className="lander-stats-row">
            {STATS.map(s => (
              <div key={s.label} className="lander-stat">
                <span className="lander-stat-val">{s.val}</span>
                <span className="lander-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="lander-ctas">
            <button className="lander-btn-primary" onClick={enterAuth}>
              <span className="lander-btn-icon">▶</span>
              ENTER THE NETWORK
            </button>
            <button className="lander-btn-secondary" onClick={enterAuth}>
              VIEW EPISODES
            </button>
          </div>

          {/* Auth panel — slides in when phase==='auth' */}
          {phase === 'auth' && (
            <div className="lander-auth-inline">
              {/* Immersive Corner Brackets */}
              <div className="lc-bracket-tl" />
              <div className="lc-bracket-tr" />
              <div className="lc-bracket-bl" />
              <div className="lc-bracket-br" />
              <div className="lc-scanline" />

              <div className="lander-auth-label">// ESTABLISH OPERATOR IDENTITY</div>
              <div className="lander-auth-input-row">
                <span className="lander-auth-pre">ID://</span>
                <input
                  ref={inputRef}
                  className="lander-auth-input"
                  type="text"
                  value={handle}
                  onChange={e => { setHandle(e.target.value.toUpperCase()); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && commit()}
                  maxLength={24}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="OPERATOR_HANDLE"
                />
                <button 
                  className={`lander-auth-rand ${isScrambling ? 'scrambling' : ''}`} 
                  onClick={handleRandomize} 
                  title="Randomize"
                  disabled={isScrambling}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
              {error && <div className="lander-auth-error">✗ {error}</div>}
              <div className="lander-auth-hint">
                Returning? Enter your previous handle to restore progress.
              </div>
              <button className="lander-btn-primary lander-auth-submit" onClick={commit} disabled={loading}>
                {loading ? (
                  <><span className="lander-spinner" /> CONNECTING...</>
                ) : (
                  <><span className="lander-btn-icon">▶</span> ESTABLISH CONNECTION</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: terminal boot screen */}
        <div className="lander-hero-right">
          <div className="lander-terminal">
            <div className="lander-terminal-bar">
              <span className="lt-dot red" /><span className="lt-dot yellow" /><span className="lt-dot green" />
              <span className="lt-title">EPHEMERAL_OS // BOOT_TERMINAL</span>
            </div>
            <div className="lander-terminal-body">
              {termLines.map((line, i) => (
                <div key={i} className={`lt-line ${i === termLines.length - 1 ? 'lt-line-active' : ''}`}>
                  {line}
                  {i === termLines.length - 1 && <span className="lt-cursor">▌</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="lander-float-cards">
            <div className="lander-float-card lander-fc-1">
              <div className="lfc-icon">⚡</div>
              <div className="lfc-body">
                <div className="lfc-title">XP EARNED TODAY</div>
                <div className="lfc-val">+2,480 XP</div>
              </div>
            </div>
            <div className="lander-float-card lander-fc-2">
              <div className="lfc-icon" style={{ color: '#00ff41' }}>⊛</div>
              <div className="lfc-body">
                <div className="lfc-title">FLAGS CAPTURED</div>
                <div className="lfc-val" style={{ color: '#00ff41' }}>◉ LIVE HUNT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="lander-features">
        <div className="lander-sect-label">// PLATFORM CAPABILITIES</div>
        <h2 className="lander-sect-title">WHAT AWAITS YOU</h2>
        <div className="lander-features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="lander-feature-card" style={{ '--fi': i } as any}>
              <div className="lfc-bracket-tl" />
              <div className="lfc-bracket-tr" />
              <div className="lfc-bracket-bl" />
              <div className="lfc-bracket-br" />
              <div className="lfc-scanline" />
              <div className="lfc-icon-lg">{f.icon}</div>
              <div className="lander-feat-title">{f.title}</div>
              <div className="lander-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="lander-bottom-cta">
        <div className="lander-bca-inner">
          <div className="lander-bca-tag">◆ NO ACCOUNT REQUIRED · YOUR HANDLE IS YOUR IDENTITY · FREE FOREVER ◆</div>
          <h2 className="lander-bca-title">READY TO JACK IN?</h2>
          <button className="lander-btn-primary lander-btn-xl" onClick={enterAuth}>
            <span className="lander-btn-icon">▶</span>
            ENTER THE NETWORK
          </button>
        </div>
        <div className="lander-bca-glow" />
      </section>

      {/* ── FOOTER ── */}
      <footer className="lander-footer">
        <span>EPHEMERAL_OS // ACN NETWORK</span>
        <span className="lander-footer-sep">|</span>
        <span>v1.3.0</span>
        <span className="lander-footer-sep">|</span>
        <span style={{ color: '#00ff41' }}>◉ NETWORK ACTIVE</span>
      </footer>
    </div>
  );
};
