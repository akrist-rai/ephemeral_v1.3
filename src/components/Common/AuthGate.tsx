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

const DOMAIN_PILLS = [
  { label: 'ALGORITHMS', color: '#e8000d' },
  { label: 'CYBERSECURITY', color: '#1a7fd4' },
  { label: 'MACHINE LEARNING', color: '#00c85a' },
  { label: 'NETWORKS', color: '#d4810a' },
  { label: 'DATA STRUCTURES', color: '#9b5fff' },
  { label: 'COMP. PROG', color: '#f9a825' },
  { label: 'MATHEMATICS', color: '#4fc3f7' },
  { label: 'SYSTEMS', color: '#ce93d8' },
];

const DOMAIN_SHOWCASE = [
  {
    eyebrow: 'V1 · THE ECLIPSE',
    domain: 'ALGORITHMS',
    tags: ['Graph Theory', 'Dynamic Programming', 'Greedy'],
    format: 'LeetCode-style',
    color: '#e8000d',
    wide: false,
  },
  {
    eyebrow: 'V2 · GRAND LINE',
    domain: 'CYBERSECURITY',
    tags: ['CTF Exploits', 'SQLi', 'Reverse Eng'],
    format: 'CTF Flags',
    color: '#1a7fd4',
    wide: false,
  },
  {
    eyebrow: 'V3 · JOHANS LAB',
    domain: 'MACHINE LEARNING',
    tags: ['Neural Nets', 'Adversarial Attacks', 'Backprop', 'Transformers'],
    format: 'Visual Explainers',
    color: '#00c85a',
    wide: true,
  },
];

const CAPABILITIES = [
  {
    icon: '◇',
    title: 'ALGORITHMIC MASTERY',
    desc: 'Solve graph problems, dynamic programming, sorting, and data structures through LeetCode-style challenges with story-driven context.',
    format: 'Problem Solving',
    color: '#e8000d',
  },
  {
    icon: '☠',
    title: 'SECURITY OPERATIONS',
    desc: 'Real-world exploit scenarios: SQL injection, buffer overflows, XSS, cryptography, and reverse engineering. Submit the flag to advance.',
    format: 'CTF Flags',
    color: '#1a7fd4',
  },
  {
    icon: '🧠',
    title: 'MACHINE INTELLIGENCE',
    desc: 'Understand neural networks, backpropagation, adversarial attacks, and transformer architectures through visual explainers and conceptual Q&A.',
    format: 'Visual + Q&A',
    color: '#00c85a',
  },
  {
    icon: '⬡',
    title: 'NETWORK ENGINEERING',
    desc: 'Protocol analysis, firewall rules, packet inspection, and NAT traversal. Trace the path through interconnected systems.',
    format: 'Protocol Analysis',
    color: '#d4810a',
  },
  {
    icon: 'Σ',
    title: 'MATHEMATICS',
    desc: 'RSA factoring, elliptic curves, modular arithmetic, and cryptographic proofs. Derive from first principles.',
    format: 'Derivation Q&A',
    color: '#4fc3f7',
  },
  {
    icon: '⚙',
    title: 'SYSTEMS DESIGN',
    desc: 'Bloom filters, Dijkstra\'s algorithm, knapsack optimization, and competitive programming under time constraints.',
    format: 'Competitive Prog',
    color: '#9b5fff',
  },
];

const STATS = [
  { val: '32+', label: 'EPISODES' },
  { val: '8', label: 'DOMAINS' },
  { val: '50+', label: 'CHALLENGES' },
  { val: '∞', label: 'OPERATORS' },
];

const TERMINAL_LINES = [
  '> EPHEMERAL_OS v1.3 BOOT SEQUENCE INITIATED...',
  '> LOADING MULTI-DOMAIN INTELLIGENCE MODULES... [OK]',
  '> ALGORITHM ENGINE......................... [OK]',
  '> ML / NEURAL NETWORK CORE................ [OK]',
  '> CTF CHALLENGE DATABASE SYNCED........... [OK]',
  '> GLOBAL LEADERBOARD CONNECTED............ [OK]',
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
      <CyberCanvas />
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
          <span className="lander-nav-tag">// ACN · 8 DOMAINS · NETWORK ACTIVE</span>
          <span className="lander-nav-dot" />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lander-hero">
        <div className="lander-hero-left">
          {/* Eyebrow */}
          <div className="lander-eyebrow">
            <span className="lander-eyebrow-pill">◉ LIVE</span>
            <span className="lander-eyebrow-text">8 DOMAINS · EPHEMERAL v1.3 · NETWORK ONLINE</span>
          </div>

          {/* Main headline */}
          <h1 className={`lander-h1 ${glitchActive ? 'glitch-active' : ''}`} data-text="BREAK THE SYSTEM">
            BREAK<br />THE<br /><span className="lander-h1-accent">SYSTEM</span>
          </h1>

          <p className="lander-tagline">
            A multi-domain intelligence academy. Learn algorithms through story-driven episodes,
            crack real exploits in cybersecurity CTFs, visualize machine learning from scratch,
            and compete with operators worldwide — all in one platform.
          </p>

          {/* Domain pills */}
          <div className="lndr2-domain-pills">
            {DOMAIN_PILLS.map(p => (
              <span
                key={p.label}
                className="lndr2-pill"
                style={{ borderColor: `${p.color}55`, color: p.color, background: `${p.color}0f` }}
              >
                {p.label}
              </span>
            ))}
          </div>

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
          {phase === 'landing' && (
            <div className="lander-ctas">
              <button type="button" className="lander-btn-primary" onClick={enterAuth}>
                <span className="lander-btn-icon">▶</span>
                ENTER THE NETWORK
              </button>
              <button type="button" className="lander-btn-secondary" onClick={enterAuth}>
                BROWSE SERIES
              </button>
            </div>
          )}

          {/* Auth panel */}
          {phase === 'auth' && (
            <div className="lander-auth-inline">
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
                  type="button"
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
                Returning operator? Enter your previous handle to restore progress.
              </div>
              <button type="button" className="lander-btn-primary lander-auth-submit" onClick={commit} disabled={loading}>
                {loading ? (
                  <><span className="lander-spinner" /> CONNECTING...</>
                ) : (
                  <><span className="lander-btn-icon">▶</span> ESTABLISH CONNECTION</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: domain showcase + terminal */}
        <div className="lander-hero-right">
          {/* Domain showcase cards */}
          <div className="lndr2-showcase">
            <div className="lndr2-show-grid">
              {DOMAIN_SHOWCASE.map((d, i) => (
                <div
                  key={i}
                  className={`lndr2-show-card${d.wide ? ' wide' : ''}`}
                >
                  <div className="lndr2-show-card-accent" style={{ background: d.color }} />
                  <div className="lndr2-show-scan" />
                  <div className="lndr2-show-eyebrow" style={{ color: d.color }}>{d.eyebrow}</div>
                  <div className="lndr2-show-domain" style={{ color: '#fff' }}>{d.domain}</div>
                  <div className="lndr2-show-tags">
                    {d.tags.map(t => (
                      <span key={t} className="lndr2-show-tag">{t}</span>
                    ))}
                  </div>
                  <span
                    className="lndr2-show-format"
                    style={{ borderColor: `${d.color}55`, color: d.color }}
                  >
                    {d.format}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal (compact, below showcase) */}
            <div className="lander-terminal" style={{ flex: 'none' }}>
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
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL MASTER ── */}
      <section className="lander-features">
        <div className="lander-sect-label">// PLATFORM CAPABILITIES</div>
        <h2 className="lander-sect-title">WHAT YOU'LL MASTER</h2>
        <div className="lndr2-domain-grid">
          {CAPABILITIES.map((c, i) => (
            <div key={i} className="lndr2-domain-card">
              <div className="lc-bracket-tl" style={{ borderColor: `${c.color}55` }} />
              <div className="lc-bracket-br" style={{ borderColor: `${c.color}55` }} />
              <div className="lndr2-dc-icon" style={{ color: c.color }}>{c.icon}</div>
              <div className="lndr2-dc-title">{c.title}</div>
              <div className="lndr2-dc-desc">{c.desc}</div>
              <span
                className="lndr2-dc-format"
                style={{ borderColor: `${c.color}44`, color: c.color }}
              >
                {c.format}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="lander-bottom-cta">
        <div className="lander-bca-inner">
          <div className="lander-bca-tag">◆ NO ACCOUNT REQUIRED · YOUR HANDLE IS YOUR IDENTITY · FREE FOREVER ◆</div>
          <h2 className="lander-bca-title">READY TO JACK IN?</h2>
          <button type="button" className="lander-btn-primary lander-btn-xl" onClick={enterAuth}>
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
