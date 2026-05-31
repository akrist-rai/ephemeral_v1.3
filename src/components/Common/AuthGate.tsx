import React, { useState, useEffect, useRef } from 'react';

interface AuthGateProps {
  onAuth: (userId: string, displayName: string) => void;
}

// ── Handle generation ──────────────────────────────────────────────────────
const ADJECTIVES = ['SILENT', 'VOID', 'QUANTUM', 'CYBER', 'SPECTRAL', 'IRON', 'BINARY', 'PHANTOM', 'NEURAL', 'DARK', 'ROGUE', 'NEON'];
const NOUNS      = ['KNIGHT', 'GHOST', 'CIPHER', 'WOLF', 'ORACLE', 'REAPER', 'VECTOR', 'WRAITH', 'NEXUS', 'PROTOCOL'];

function randHandle() {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}_${noun}_${Math.floor(Math.random() * 9000) + 1000}`;
}

// ── Static data ────────────────────────────────────────────────────────────
const HERO_IMGS = [
  '/avatar/Monkey D Luffy (1).jpeg',
  '/avatar/Itachi.jpeg',
  '/avatar/Roronoa Zoro.jpeg',
  '/avatar/Ichigo Kurosaki.jpeg',
  '/avatar/Dandadan.jpeg',
  '/avatar/Doflamingo.jpeg',
];

const CHAR_STRIP = [
  { img: '/avatar/Monkey D Luffy (1).jpeg',  name: 'LUFFY'      },
  { img: '/avatar/Roronoa Zoro.jpeg',          name: 'ZORO'       },
  { img: '/avatar/Sanji (1).jpeg',             name: 'SANJI'      },
  { img: '/avatar/Itachi.jpeg',                name: 'ITACHI'     },
  { img: '/avatar/Ichigo Kurosaki.jpeg',       name: 'ICHIGO'     },
  { img: '/avatar/Doflamingo.jpeg',            name: 'DOFLAMINGO' },
  { img: '/avatar/saitama.jpeg',               name: 'SAITAMA'    },
  { img: '/avatar/Dandadan.jpeg',              name: 'OKARUN'     },
  { img: '/avatar/Brook.jpeg',                 name: 'BROOK'      },
  { img: '/avatar/Nami_.jpeg',                 name: 'NAMI'       },
  { img: '/avatar/Franky.jpeg',                name: 'FRANKY'     },
  { img: '/avatar/Usopp.jpeg',                 name: 'USOPP'      },
];

const ARC_GRID = [
  { n: 1, domain: 'ALGORITHMS',      name: 'THE ECLIPSE',   format: 'LeetCode-style', color: '#e8000d' },
  { n: 2, domain: 'CYBERSECURITY',   name: 'GRAND LINE',    format: 'CTF Flags',       color: '#1a7fd4' },
  { n: 3, domain: 'MACHINE LEARNING',name: 'JOHANS LAB',    format: 'Visual Explainers',color: '#00c85a' },
  { n: 4, domain: 'NETWORKS',        name: 'THE KNOT',      format: 'Protocol Analysis',color: '#d4810a' },
  { n: 5, domain: 'DATA STRUCTURES', name: 'PROPHECY',      format: 'Problem Solving', color: '#9b5fff' },
  { n: 6, domain: 'COMP. PROG',      name: 'ONE PUNCH',     format: 'Competitive Prog',color: '#f9a825' },
  { n: 7, domain: 'MATHEMATICS',     name: 'UNIT-01',       format: 'Proof-based Q&A', color: '#4fc3f7' },
  { n: 8, domain: 'PROBABILITY',     name: 'RUHENHEIM',     format: 'Statistical',     color: '#ce93d8' },
];

const STATS = [
  { val: '32+', label: 'EPISODES' },
  { val: '8',   label: 'DOMAINS'  },
  { val: '50+', label: 'CHALLENGES' },
  { val: '∞',   label: 'OPERATORS' },
];

const DOMAIN_PILLS = [
  { label: 'ALGORITHMS', color: '#e8000d' },
  { label: 'CYBERSECURITY', color: '#1a7fd4' },
  { label: 'ML / AI', color: '#00c85a' },
  { label: 'NETWORKS', color: '#d4810a' },
  { label: 'DATA STRUCTURES', color: '#9b5fff' },
  { label: 'MATHEMATICS', color: '#4fc3f7' },
];

const VALID = /^[A-Za-z0-9_-]{3,24}$/;

export const AuthGate: React.FC<AuthGateProps> = ({ onAuth }) => {
  const [handle, setHandle]         = useState(randHandle());
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [phase, setPhase]           = useState<'landing' | 'auth'>('landing');
  const [glitchActive, setGlitchActive] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Glitch intervals
  useEffect(() => {
    const tick = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
      setTimeout(tick, 4000 + Math.random() * 7000);
    };
    const t = setTimeout(tick, 2500);
    return () => clearTimeout(t);
  }, []);

  const triggerScramble = (target: string) => {
    if (isScrambling) return;
    setIsScrambling(true);
    let count = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    const iv = setInterval(() => {
      let s = '';
      for (let i = 0; i < target.length; i++) {
        s += i < (count / 12) * target.length ? target[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      setHandle(s);
      if (++count > 12) { clearInterval(iv); setHandle(target); setIsScrambling(false); }
    }, 30);
  };

  const enterAuth = () => {
    setPhase('auth');
    setTimeout(() => {
      inputRef.current?.focus();
      triggerScramble(randHandle());
    }, 80);
  };

  const commit = async () => {
    const h = handle.trim().toUpperCase().replace(/\s+/g, '_');
    if (!VALID.test(h)) { setError('3–24 chars. Letters, numbers, _ and - only.'); return; }
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

  return (
    <div className="lg2-root">
      {/* Global scanlines */}
      <div className="lg2-scan" />

      {/* ── NAVBAR ── */}
      <nav className="lg2-nav">
        <div className="lg2-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span><em>E</em>PHEMERAL</span>
          <span className="lg2-logo-tag">v1.3</span>
        </div>
        <div className="lg2-nav-right">
          <span className="lg2-nav-live">
            <span className="lg2-nav-live-dot" />
            NETWORK ACTIVE · 8 DOMAINS
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lg2-hero">
        {/* Left: text + auth */}
        <div className="lg2-hero-left">
          <div className="lg2-eyebrow">
            <span className="lg2-eyebrow-dot" />
            <span className="lg2-eyebrow-text">◉ LIVE · ACN_EPHEMERAL · INTELLIGENCE NETWORK</span>
          </div>

          <h1 className={`lg2-headline ${glitchActive ? 'glitch-active' : ''}`}>
            <span>BREAK</span>
            <span>THE</span>
            <span>SYSTEM</span>
          </h1>

          <p className="lg2-tagline">
            A multi-domain intelligence academy. Algorithm challenges. Cybersecurity CTFs.
            Machine learning visual explainers. Competitive programming. All in one terminal.
          </p>

          <div className="lg2-domain-pills">
            {DOMAIN_PILLS.map(p => (
              <span
                key={p.label}
                className="lg2-pill"
                style={{ borderColor: `${p.color}50`, color: p.color, background: `${p.color}12` }}
              >
                {p.label}
              </span>
            ))}
          </div>

          <div className="lg2-stats">
            {STATS.map(s => (
              <div key={s.label} className="lg2-stat">
                <span className="lg2-stat-n">{s.val}</span>
                <span className="lg2-stat-l">{s.label}</span>
              </div>
            ))}
          </div>

          {phase === 'landing' ? (
            <div className="lg2-hero-ctas">
              <button type="button" className="lg2-btn-primary" onClick={enterAuth}>
                ▶ ENTER THE NETWORK
              </button>
              <button type="button" className="lg2-btn-secondary" onClick={enterAuth}>
                BROWSE SERIES
              </button>
            </div>
          ) : (
            <div className="lg2-auth">
              <div className="lg2-auth-label">// ESTABLISH OPERATOR IDENTITY</div>
              <div className="lg2-auth-row">
                <span className="lg2-auth-pre">ID://</span>
                <input
                  ref={inputRef}
                  className="lg2-auth-input"
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
                  className={`lg2-auth-rand ${isScrambling ? 'scrambling' : ''}`}
                  onClick={() => triggerScramble(randHandle())}
                  disabled={isScrambling}
                  title="Randomize"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
              {error && <div className="lg2-auth-error">✗ {error}</div>}
              <div className="lg2-auth-hint">Returning operator? Enter your previous handle to restore progress.</div>
              <button type="button" className="lg2-btn-primary lg2-auth-submit" onClick={commit} disabled={loading}>
                {loading ? <><span className="lg2-spinner" /> CONNECTING...</> : <>▶ ESTABLISH CONNECTION</>}
              </button>
            </div>
          )}
        </div>

        {/* Right: image mosaic */}
        <div className="lg2-hero-right">
          <div className="lg2-hero-imgs">
            {HERO_IMGS.map((src, i) => (
              <div key={i} className="lg2-hero-img-wrap">
                <img
                  src={src}
                  alt=""
                  className="lg2-hero-img"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="lg2-hero-img-overlay" />
              </div>
            ))}
          </div>
          <div className="lg2-hero-right-grad" />
          <div className="lg2-hero-right-edge" />
        </div>
      </section>

      {/* ── CHARACTER STRIP ── */}
      <section className="lg2-chars-section">
        <div className="lg2-chars-label">// OPERATORS WORLDWIDE</div>
        {/* Duplicate the strip for seamless loop */}
        <div className="lg2-chars-track">
          {[...CHAR_STRIP, ...CHAR_STRIP].map((c, i) => (
            <div key={i} className="lg2-char-card">
              <img
                src={c.img}
                alt={c.name}
                className="lg2-char-img"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="lg2-char-grad" />
              <span className="lg2-char-name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARC DOMAINS GRID ── */}
      <section className="lg2-arcs-section">
        <div className="lg2-arcs-header">
          <div>
            <div className="lg2-arcs-eyebrow">// CHOOSE YOUR BATTLEFIELD</div>
            <h2 className="lg2-arcs-title">8 DOMAINS. 8 ARCS.</h2>
          </div>
          <span className="lg2-arcs-sub">Each domain has a unique teaching + testing format.</span>
        </div>

        <div className="lg2-arcs-grid">
          {ARC_GRID.map(arc => (
            <div key={arc.n} className="lg2-arc-card" onClick={phase === 'landing' ? enterAuth : undefined} style={{ cursor: 'pointer' }}>
              <img
                src={`/one_piece/${arc.n}.jpeg`}
                alt={arc.domain}
                className="lg2-arc-card-img"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="lg2-arc-card-overlay" />

              <div className="lg2-arc-card-top">
                <span className="lg2-arc-vol">V{arc.n}</span>
                <span
                  className="lg2-arc-format-badge"
                  style={{ borderColor: `${arc.color}50`, color: arc.color, background: `${arc.color}18` }}
                >
                  {arc.format}
                </span>
              </div>

              <div className="lg2-arc-card-bottom">
                <div className="lg2-arc-domain" style={{ color: arc.color }}>{arc.domain}</div>
                <div className="lg2-arc-name">{arc.name}</div>
              </div>

              <div className="lg2-arc-card-bar" style={{ background: arc.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="lg2-cta-section">
        <img
          src="/one_piece/79.jpeg"
          alt=""
          className="lg2-cta-bg-img"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="lg2-cta-overlay" />
        <div className="lg2-cta-content">
          <div className="lg2-cta-tag">◆ NO ACCOUNT REQUIRED · YOUR HANDLE IS YOUR IDENTITY · FREE FOREVER ◆</div>
          <h2 className="lg2-cta-title">READY TO JACK IN?</h2>
          <button type="button" className="lg2-btn-primary" style={{ fontSize: '.75rem', padding: '.85rem 2.2rem' }} onClick={enterAuth}>
            ▶ ENTER THE NETWORK
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lg2-footer">
        <span>EPHEMERAL_OS</span>
        <span className="lg2-footer-sep">|</span>
        <span>ACN NETWORK</span>
        <span className="lg2-footer-sep">|</span>
        <span>v1.3</span>
        <span className="lg2-footer-sep">|</span>
        <span style={{ color: '#00ff55' }}>◉ ACTIVE</span>
      </footer>
    </div>
  );
};
