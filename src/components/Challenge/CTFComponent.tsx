import React, { useState, useEffect, useRef } from 'react';

interface CTFComponentProps {
  gctf: any;
  setGctf: any;
  setUserXp: any;
  showToast: (msg: string) => void;
  challenges: any[];
  navigate: (path: string) => void;
  dataStatus: string;
  apiError: string;
  submitFlag: any;
  toggleCTFHint: any;
  shake: boolean;
  flagInputRef: any;
  episodeBasePath: string;
}

const CAT_META: Record<string, { color: string; icon: string; label: string }> = {
  GRADIENT:     { color: '#4fc3f7', icon: '∇', label: 'Gradient Flow' },
  ARCHITECTURE: { color: '#f9a825', icon: '⬡', label: 'Architecture' },
  INFERENCE:    { color: '#e8000d', icon: '◈', label: 'Inference' },
  'DATA LEAK':  { color: '#ff6b35', icon: '⚠', label: 'Data Leak' },
  TRAINING:     { color: '#ab47bc', icon: '⟳', label: 'Training' },
  NLP:          { color: '#26c6da', icon: '⌥', label: 'NLP' },
  OVERFITTING:  { color: '#ef5350', icon: '⤴', label: 'Overfitting' },
  SYSTEMS:      { color: '#66bb6a', icon: '⚙', label: 'Systems' },
  CRYPTO:       { color: '#ffd54f', icon: '🔐', label: 'Cryptography' },
  ALGORITHMS:   { color: '#80cbc4', icon: '◇', label: 'Algorithms' },
  FAIRNESS:     { color: '#ce93d8', icon: '⚖', label: 'Fairness' },
};

const TIER_META: Record<number, { label: string; color: string; glow: string }> = {
  1: { label: 'ENTRY LEVEL',   color: '#66bb6a', glow: 'rgba(102,187,106,0.2)' },
  2: { label: 'CORE MODULE',   color: '#f9a825', glow: 'rgba(249,168,37,0.2)' },
  3: { label: 'RUHENHEIM',     color: '#ef5350', glow: 'rgba(239,83,80,0.2)'  },
};

/* Animated typing cursor */
function TypedText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const iv = setInterval(() => {
      if (i >= text.length) { clearInterval(iv); return; }
      setDisplayed(t => t + text[i++]);
    }, 12);
    return () => clearInterval(iv);
  }, [text]);
  return <>{displayed}<span className="ctf-cursor">▌</span></>;
}

/* Scanline overlay */
const Scanlines = () => <div className="ctf-scanlines" />;

export const CTFComponent: React.FC<CTFComponentProps> = ({
  gctf, showToast, challenges, navigate, dataStatus, apiError,
  submitFlag, toggleCTFHint, shake, flagInputRef, setUserXp, episodeBasePath,
}) => {
  const [flagInput, setFlagInput] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [typed, setTyped] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const totalPts = Object.values(gctf.solved).reduce((a: any, s: any) => a + (s.pts_earned || 0), 0) as number;
  const solvedCount = Object.values(gctf.solved).filter((s: any) => s.solved).length;
  const totalChallenges = challenges.length;
  const pct = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  const cats = ['ALL', ...Array.from(new Set(challenges.map(c => c.category)))];

  const openChallenge = (id: string) => {
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(id)}`);
    setFlagInput('');
    setTimeout(() => { if (flagInputRef.current) flagInputRef.current.focus(); }, 80);
  };

  const closeChallenge = () => navigate(`${episodeBasePath}/ctf`);

  // ── BOARD VIEW ──────────────────────────────────────────────────────────────
  if (gctf.phase === 'board') {
    if (dataStatus === 'loading') return (
      <div className="ctf-shell">
        <Scanlines />
        <div className="ctf-boot-msg">SYNCHRONIZING CHALLENGE MATRIX<span className="ctf-dots" /></div>
      </div>
    );
    if (dataStatus === 'error') return (
      <div className="ctf-shell">
        <Scanlines />
        <div className="ctf-boot-msg ctf-boot-err">BACKEND ERROR // {apiError}</div>
      </div>
    );

    const filteredChallenges = filterCat === 'ALL'
      ? challenges
      : challenges.filter(c => c.category === filterCat);

    return (
      <div className="ctf-shell" ref={boardRef}>
        <Scanlines />

        {/* ── HEADER ── */}
        <div className="ctf-board-header">
          <div className="ctf-board-header-left">
            <div className="ctf-board-eyebrow">// ACN_EPHEMERAL · INCIDENT_RESPONSE</div>
            <h2 className="ctf-board-title">ML INCIDENT RESPONSE</h2>
            <div className="ctf-board-subtitle">Investigate broken systems. Derive the flag from evidence alone.</div>
          </div>

          {/* Score ring */}
          <div className="ctf-score-panel">
            <svg className="ctf-score-ring" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#00ff41" strokeWidth="5"
                strokeDasharray={`${213.63 * pct / 100} 213.63`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
              <text x="40" y="37" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="var(--disp)" letterSpacing="1">{pct}%</text>
              <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="5.5" fontFamily="var(--mono)" letterSpacing="1">SOLVED</text>
            </svg>
            <div className="ctf-score-pts">
              <span className="ctf-score-val">{totalPts}</span>
              <span className="ctf-score-lbl">POINTS</span>
            </div>
            <div className="ctf-score-count">{solvedCount} / {totalChallenges} ACTIVE</div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="ctf-stats-bar">
          {[1, 2, 3].map(t => {
            const tc = challenges.filter(c => c.tier === t);
            const ts = tc.filter(c => gctf.solved[c.id]?.solved);
            const tm = TIER_META[t];
            return (
              <div className="ctf-stat-item" key={t}>
                <div className="ctf-stat-tier" style={{ color: tm.color }}>{tm.label}</div>
                <div className="ctf-stat-progress">
                  <div className="ctf-stat-bar">
                    <div className="ctf-stat-fill" style={{ width: `${tc.length ? (ts.length / tc.length) * 100 : 0}%`, background: tm.color, boxShadow: `0 0 8px ${tm.color}` }} />
                  </div>
                  <span className="ctf-stat-frac" style={{ color: tm.color }}>{ts.length}/{tc.length}</span>
                </div>
              </div>
            );
          })}
          <div className="ctf-stat-item">
            <div className="ctf-stat-tier" style={{ color: 'rgba(255,255,255,.4)' }}>TOTAL EARNED</div>
            <div className="ctf-stat-pts">{totalPts} <span style={{ fontSize: '.45rem', color: 'rgba(255,255,255,.3)' }}>XP</span></div>
          </div>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div className="ctf-cat-filter">
          {cats.map(cat => {
            const meta = CAT_META[cat];
            return (
              <button
                key={cat}
                className={`ctf-cat-btn ${filterCat === cat ? 'active' : ''}`}
                onClick={() => setFilterCat(cat)}
                style={filterCat === cat ? { borderColor: meta?.color || '#fff', color: meta?.color || '#fff', boxShadow: `0 0 10px ${meta?.color || '#fff'}33` } : {}}
              >
                {meta ? <span className="ctf-cat-icon">{meta.icon}</span> : null}
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── CHALLENGE TIERS ── */}
        {[1, 2, 3].map(tier => {
          const tChallenges = filteredChallenges.filter(c => c.tier === tier);
          if (tChallenges.length === 0) return null;
          const tm = TIER_META[tier];
          return (
            <div className="ctf-tier-section" key={tier}>
              <div className="ctf-tier-header">
                <div className="ctf-tier-accent" style={{ background: tm.color }} />
                <span className="ctf-tier-label" style={{ color: tm.color }}>TIER {tier}</span>
                <span className="ctf-tier-name">{tm.label}</span>
                <div className="ctf-tier-line" />
                <span className="ctf-tier-pts" style={{ color: tm.color }}>{tChallenges[0]?.points} PTS</span>
              </div>

              <div className="ctf-challenge-grid">
                {tChallenges.map(ch => {
                  const solvedData = gctf.solved[ch.id];
                  const ok = !!(solvedData?.solved);
                  const att = gctf.chalAttempts[ch.id];
                  const failed = !!(solvedData?.failed || (!solvedData?.solved && att <= 0));
                  const tried = att < ch.attemptsAllowed && !ok && !failed;
                  const meta = CAT_META[ch.category] || { color: '#fff', icon: '□', label: ch.category };
                  const isHov = hoveredCard === ch.id;

                  return (
                    <div
                      key={ch.id}
                      className={`ctf-ch-card ${ok ? 'ch-solved' : failed ? 'ch-failed' : tried ? 'ch-tried' : ''} ${isHov ? 'ch-hov' : ''}`}
                      onClick={() => openChallenge(ch.id)}
                      onMouseEnter={() => setHoveredCard(ch.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ '--ch-color': meta.color } as any}
                    >
                      {/* Left accent bar */}
                      <div className="ch-card-accent" style={{ background: ok ? '#00ff41' : failed ? '#e8000d' : meta.color }} />

                      {/* Status glow on solved */}
                      {ok && <div className="ch-solved-glow" />}

                      {/* Top row */}
                      <div className="ch-card-top">
                        <span className="ch-cat-badge" style={{ color: meta.color, borderColor: `${meta.color}44`, background: `${meta.color}11` }}>
                          {meta.icon} {ch.category}
                        </span>
                        <span className="ch-pts-badge">
                          {ok
                            ? <span style={{ color: '#00ff41' }}>✓ +{solvedData.pts_earned}</span>
                            : failed
                            ? <span style={{ color: '#e8000d' }}>✗ LOCKED</span>
                            : <span style={{ color: meta.color }}>{ch.points} PTS</span>
                          }
                        </span>
                      </div>

                      {/* Title */}
                      <div className="ch-card-title">{ch.title}</div>
                      <div className="ch-card-id">{ch.id}</div>

                      {/* Bottom row */}
                      <div className="ch-card-bottom">
                        <span className="ch-difficulty">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} style={{ color: i < ch.difficulty ? meta.color : 'rgba(255,255,255,0.12)', marginRight: '2px' }}>★</span>
                          ))}
                        </span>
                        {tried && att > 0 && (
                          <span className="ch-attempts-left" style={{ color: '#f9a825' }}>
                            {att} ATTEMPT{att !== 1 ? 'S' : ''} LEFT
                          </span>
                        )}
                        {!ok && !failed && !tried && (
                          <span className="ch-enter-label" style={{ color: meta.color }}>INVESTIGATE →</span>
                        )}
                        {ok && <span className="ch-solved-label">FLAG CAPTURED</span>}
                        {failed && <span className="ch-failed-label">CASE CLOSED</span>}
                      </div>

                      {/* Hover scan effect */}
                      {isHov && <div className="ch-hover-scan" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── CHALLENGE DETAIL VIEW ────────────────────────────────────────────────────
  const id = gctf.active;
  if (dataStatus === 'loading') return (
    <div className="ctf-shell">
      <Scanlines />
      <div className="ctf-boot-msg">LOADING INCIDENT REPORT...</div>
    </div>
  );
  if (dataStatus === 'error') return (
    <div className="ctf-shell">
      <Scanlines />
      <div className="ctf-boot-msg ctf-boot-err">BACKEND ERROR // {apiError}</div>
    </div>
  );

  const ch = challenges.find(c => c.id === id);
  if (!ch) return (
    <div className="ctf-shell">
      <Scanlines />
      <div className="ctf-boot-msg ctf-boot-err">CHALLENGE NOT FOUND // {id}</div>
    </div>
  );

  const solved = gctf.solved[id];
  const ok = !!(solved?.solved);
  const att = gctf.chalAttempts[id];
  const failed = !!(solved?.failed || (!solved?.solved && att <= 0));
  const meta = CAT_META[ch.category] || { color: '#fff', icon: '□', label: ch.category };

  const artIcons: Record<string, string> = { table: '⊞', code: '▶', config: '≡', log: '◌', output: '◈' };

  return (
    <div className={`ctf-shell ctf-detail ${shake ? 'shake' : ''}`}>
      <Scanlines />

      {/* ── TOP CHROME ── */}
      <div className="ctf-detail-chrome" style={{ borderBottomColor: `${meta.color}33` }}>
        <button className="ctf-back-pill" onClick={closeChallenge}>
          ← BOARD
        </button>
        <div className="ctf-detail-breadcrumb">
          <span style={{ color: meta.color }}>{meta.icon} {ch.category}</span>
          <span className="ctf-bc-sep">/</span>
          <span>{ch.id}</span>
        </div>
        <div className="ctf-detail-pts" style={{ color: meta.color, textShadow: `0 0 15px ${meta.color}66` }}>
          {ch.points} <span className="ctf-pts-lbl">PTS</span>
        </div>
        <span className="ctf-diff-stars">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ color: i < ch.difficulty ? meta.color : 'rgba(255,255,255,0.12)' }}>★</span>
          ))}
        </span>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="ctf-detail-layout">

        {/* LEFT COLUMN — scenario + flag */}
        <div className="ctf-detail-left">

          {/* Title block */}
          <div className="ctf-incident-block" style={{ borderLeftColor: meta.color }}>
            <div className="ctf-incident-label" style={{ color: meta.color }}>// INCIDENT REPORT</div>
            <h2 className="ctf-incident-title">{ch.title}</h2>
          </div>

          {/* Scenario */}
          <div className="ctf-section-block">
            <div className="ctf-section-hdr">
              <span className="ctf-section-icon" style={{ color: meta.color }}>◉</span>
              INCIDENT SCENARIO
            </div>
            <div className="ctf-scenario-text">{ch.scenario}</div>
          </div>

          {/* Task */}
          <div className="ctf-section-block ctf-task-block" style={{ borderColor: `${meta.color}33` }}>
            <div className="ctf-section-hdr">
              <span className="ctf-section-icon" style={{ color: meta.color }}>▶</span>
              INVESTIGATION TASK
            </div>
            <div className="ctf-task-text">{ch.task}</div>
          </div>

          {/* FLAG ZONE */}
          {ok ? (
            <div className="ctf-flag-zone ctf-flag-solved" style={{ borderColor: '#00ff4166' }}>
              <div className="ctf-flag-zone-label" style={{ color: '#00ff41' }}>◉ FLAG CAPTURED — CASE CLOSED</div>
              <div className="ctf-flag-display">
                <span className="ctf-flag-prefix">EPHEMERAL{'{'}</span>
                <span className="ctf-flag-value" style={{ color: '#00ff41' }}>{ch.flag}</span>
                <span className="ctf-flag-prefix">{'}'}</span>
              </div>
              <div className="ctf-flag-reward">+{solved.pts_earned} XP EARNED</div>
            </div>
          ) : failed ? (
            <div className="ctf-flag-zone ctf-flag-failed" style={{ borderColor: 'rgba(232,0,13,0.35)' }}>
              <div className="ctf-flag-zone-label" style={{ color: '#e8000d' }}>✗ OUT OF ATTEMPTS</div>
              <div className="ctf-flag-display" style={{ opacity: .55 }}>
                <span className="ctf-flag-prefix">EPHEMERAL{'{'}</span>
                <span className="ctf-flag-value">{ch.flag}</span>
                <span className="ctf-flag-prefix">{'}'}</span>
              </div>
            </div>
          ) : (
            <div className="ctf-flag-zone" style={{ borderColor: `${meta.color}44` }}>
              <div className="ctf-flag-zone-label" style={{ color: meta.color }}>// SUBMIT FLAG</div>
              <div className="ctf-flag-input-row">
                <span className="ctf-flag-prefix">EPHEMERAL{'{'}</span>
                <input
                  ref={flagInputRef}
                  className="ctf-flag-input"
                  id="ctf-flag-inp"
                  type="text"
                  placeholder="derive from evidence…"
                  autoComplete="off"
                  spellCheck={false}
                  value={flagInput}
                  onChange={e => setFlagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitFlag(id, flagInput, challenges, setUserXp)}
                  style={{ caretColor: meta.color }}
                />
                <span className="ctf-flag-prefix">{'}'}</span>
                <button
                  className="ctf-submit-btn"
                  style={{ background: meta.color, color: meta.color === '#f9a825' || meta.color === '#ffd54f' || meta.color === '#80cbc4' || meta.color === '#66bb6a' ? '#000' : '#fff' }}
                  onClick={() => submitFlag(id, flagInput, challenges, setUserXp)}
                >
                  SUBMIT
                </button>
              </div>
              {/* Attempt indicators */}
              <div className="ctf-attempts-row" id="ctf-att-row">
                <div className="ctf-att-pips">
                  {Array.from({ length: ch.attemptsAllowed }).map((_, i) => (
                    <div
                      key={i}
                      className="ctf-att-pip"
                      style={{ background: i < att ? meta.color : 'rgba(255,255,255,0.1)', boxShadow: i < att ? `0 0 6px ${meta.color}88` : 'none' }}
                    />
                  ))}
                </div>
                <span className="ctf-att-label">{att} ATTEMPT{att !== 1 ? 'S' : ''} REMAINING</span>
              </div>
            </div>
          )}

          {/* Hint */}
          <div className="ctf-hint-section">
            <button
              className={`ctf-hint-toggle ${gctf.hintOn[id] ? 'hint-open' : ''}`}
              id="ctf-hint-btn"
              onClick={() => toggleCTFHint(id)}
            >
              <span className="ctf-hint-icon">⚡</span>
              REQUEST INTEL {gctf.hintOn[id] ? '▲' : '▼'}
            </button>
            {gctf.hintOn[id] && (
              <div className="ctf-hint-body">
                <span className="ctf-hint-prefix">// INTEL: </span>
                {ch.hint}
              </div>
            )}
          </div>

          {/* Explanation (after solve) */}
          {(ok || failed) && (
            <div className="ctf-explanation">
              <div className="ctf-explanation-label" style={{ color: '#00ff41' }}>// CASE ANALYSIS</div>
              <div className="ctf-explanation-text">{ch.explanation}</div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — evidence */}
        <div className="ctf-detail-right">
          <div className="ctf-evidence-header">
            <span className="ctf-section-icon" style={{ color: meta.color }}>⊞</span>
            EVIDENCE ARTIFACTS
            <span className="ctf-evidence-count">{ch.artifacts.length} FILE{ch.artifacts.length !== 1 ? 'S' : ''}</span>
          </div>
          <div className="ctf-evidence-list">
            {ch.artifacts.map((a: any, i: number) => {
              const icon = artIcons[a.type] || '□';
              const typeColors: Record<string, string> = { table: '#80cbc4', config: '#f9a825', log: '#4fc3f7', code: '#ce93d8', output: '#66bb6a' };
              const tc = typeColors[a.type] || meta.color;
              return (
                <div className="ctf-artifact-card" key={i}>
                  <div className="ctf-art-header" style={{ borderBottomColor: `${tc}33` }}>
                    <span className="ctf-art-type-icon" style={{ color: tc }}>{icon}</span>
                    <span className="ctf-art-label">{a.label}</span>
                    <span className="ctf-art-type-pill" style={{ color: tc, borderColor: `${tc}44`, background: `${tc}11` }}>{a.type.toUpperCase()}</span>
                  </div>
                  <pre className="ctf-art-body">{a.content}</pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
