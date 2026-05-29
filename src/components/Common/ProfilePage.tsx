import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../hooks/useApi';
import { computeBadges, getXpLevel, type Badge, type ProfileData } from '../../lib/badges';

interface ProfilePageProps {
  userId: string;
  displayName: string;
  userAvatar?: string;
  navigate: (path: string) => void;
  challengesSolved: number;
  userXp: number;
  onChangeAvatar?: () => void;
}

const CAT_META: Record<string, { color: string; icon: string }> = {
  GRADIENT:     { color: '#4fc3f7', icon: '∇' },
  ARCHITECTURE: { color: '#f9a825', icon: '⬡' },
  INFERENCE:    { color: '#e8000d', icon: '◈' },
  'DATA LEAK':  { color: '#ff6b35', icon: '⚠' },
  TRAINING:     { color: '#ab47bc', icon: '⟳' },
  NLP:          { color: '#26c6da', icon: '⌥' },
  OVERFITTING:  { color: '#ef5350', icon: '⤴' },
  SYSTEMS:      { color: '#66bb6a', icon: '⚙' },
  CRYPTO:       { color: '#ffd54f', icon: '🔐' },
  ALGORITHMS:   { color: '#80cbc4', icon: '◇' },
  FAIRNESS:     { color: '#ce93d8', icon: '⚖' },
};

const RARITY_COLORS: Record<string, string> = {
  common:    '#66bb6a',
  rare:      '#4fc3f7',
  epic:      '#ab47bc',
  legendary: '#ffd700',
};

const TIER_META: Record<number, { label: string; color: string }> = {
  1: { label: 'ENTRY LEVEL',  color: '#66bb6a' },
  2: { label: 'CORE MODULE',  color: '#f9a825' },
  3: { label: 'RUHENHEIM',    color: '#ef5350' },
};

function StatRing({ value, max, color, label, sublabel }: { value: number; max: number; color: string; label: string; sublabel?: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="prf-ring-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x="45" y="42" textAnchor="middle" fill="#fff" fontSize="13" fontFamily="var(--disp)" fontWeight="700">{label}</text>
        {sublabel && <text x="45" y="54" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="var(--mono)" letterSpacing="0.08em">{sublabel}</text>}
      </svg>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const rc = RARITY_COLORS[badge.rarity];
  return (
    <div className={`badge-card ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}`} style={{ '--badge-color': rc } as any}>
      <div className="badge-icon-wrap" style={{ background: badge.unlocked ? `${rc}22` : 'rgba(255,255,255,0.03)', borderColor: badge.unlocked ? `${rc}55` : 'rgba(255,255,255,0.08)' }}>
        <span className="badge-icon" style={{ filter: badge.unlocked ? 'none' : 'grayscale(1) opacity(0.3)' }}>
          {badge.icon}
        </span>
        {badge.unlocked && <div className="badge-glow" style={{ background: rc }} />}
      </div>
      <div className="badge-name" style={{ color: badge.unlocked ? '#fff' : 'rgba(255,255,255,0.3)' }}>
        {badge.name}
      </div>
      <div className="badge-rarity" style={{ color: badge.unlocked ? rc : 'rgba(255,255,255,0.15)' }}>
        {badge.rarity.toUpperCase()}
      </div>
      {!badge.unlocked && badge.progress !== undefined && (
        <div className="badge-progress-bar">
          <div className="badge-prog-fill" style={{ width: `${badge.progress}%`, background: rc }} />
        </div>
      )}
      {!badge.unlocked && (
        <div className="badge-desc-locked">{badge.description}</div>
      )}
    </div>
  );
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId, displayName, userAvatar, navigate, challengesSolved, userXp, onChangeAvatar,
}) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'skills'>('overview');
  const [writeups, setWriteups] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('ephemeral_writeups') || '{}'); } catch { return {}; }
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    apiRequest(`/api/stats/profile/${encodeURIComponent(userId)}`)
      .then(data => { setProfile(data.profile); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, [userId]);

  // Radar chart on skills tab
  useEffect(() => {
    if (activeTab !== 'skills' || !profile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cats = Object.entries(profile.catStats || {}).filter(([, v]) => v.total > 0).slice(0, 8);
    if (cats.length < 3) return;

    const W = canvas.width; const H = canvas.height;
    const cx = W / 2; const cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    const n = cats.length;

    ctx.clearRect(0, 0, W, H);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = cx + (R * ring / 4) * Math.cos(angle);
        const y = cy + (R * ring / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const [, v] = cats[i];
      const pct = v.total > 0 ? v.solved / v.total : 0;
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const x = cx + R * pct * Math.cos(angle);
      const y = cy + R * pct * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,255,65,0.12)';
    ctx.fill();
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (let i = 0; i < n; i++) {
      const [, v] = cats[i];
      const pct = v.total > 0 ? v.solved / v.total : 0;
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const x = cx + R * pct * Math.cos(angle);
      const y = cy + R * pct * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff41';
      ctx.fill();
    }

    // Labels
    for (let i = 0; i < n; i++) {
      const [cat, v] = cats[i];
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const lx = cx + (R + 22) * Math.cos(angle);
      const ly = cy + (R + 22) * Math.sin(angle);
      const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
      ctx.fillStyle = meta.color;
      ctx.font = `bold 9px var(--mono, monospace)`;
      ctx.textAlign = 'center';
      ctx.fillText(`${meta.icon} ${cat}`, lx, ly);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `8px var(--mono, monospace)`;
      ctx.fillText(`${v.solved}/${v.total}`, lx, ly + 11);
    }
  }, [activeTab, profile]);

  const level = getXpLevel(userXp);
  const badges = profile ? computeBadges(profile) : [];
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="profile-shell">
      <img
        src="/one_piece/1997_ The start of an adventure ☠️🏝.jpeg"
        alt=""
        className="profile-bg-img"
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
      {/* ── HEADER ── */}
      <div className="profile-header">
        <div className="profile-header-bg" />
        <div className="profile-header-content">
          <div className="profile-avatar-wrap" onClick={onChangeAvatar} title="Change avatar">
            {userAvatar
              ? <img src={userAvatar} alt="avatar" className="profile-avatar-img" onError={e => { e.currentTarget.style.display='none'; }} />
              : <div className="profile-avatar-fallback">{displayName.slice(0, 2)}</div>
            }
            <div className="profile-avatar-ring" />
            {onChangeAvatar && <div className="profile-avatar-edit">✎</div>}
          </div>

          <div className="profile-header-info">
            <div className="profile-eyebrow">// OPERATOR DOSSIER</div>
            <h1 className="profile-username">{displayName}</h1>
            <div className="profile-level-row">
              <span className="profile-level-badge">LVL {level.level}</span>
              <span className="profile-level-title" style={{ color: '#00ff41' }}>{level.title}</span>
              <span className="profile-badge-count">{unlockedBadges.length} BADGES</span>
            </div>

            {/* XP progress bar */}
            <div className="profile-xp-bar-wrap">
              <div className="profile-xp-bar">
                <div className="profile-xp-fill" style={{ width: `${level.progress}%` }} />
              </div>
              <span className="profile-xp-label">{userXp.toLocaleString()} / {level.nextXp.toLocaleString()} XP</span>
            </div>
          </div>

          <div className="profile-quick-stats">
            <div className="pqs-item">
              <span className="pqs-val" style={{ color: '#00ff41' }}>{challengesSolved}</span>
              <span className="pqs-label">FLAGS</span>
            </div>
            <div className="pqs-div" />
            <div className="pqs-item">
              <span className="pqs-val" style={{ color: '#4fc3f7' }}>{userXp.toLocaleString()}</span>
              <span className="pqs-label">XP</span>
            </div>
            <div className="pqs-div" />
            <div className="pqs-item">
              <span className="pqs-val" style={{ color: '#f9a825' }}>{profile?.accuracy ?? '—'}%</span>
              <span className="pqs-label">ACCURACY</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="profile-tabs">
        {(['overview', 'badges', 'skills'] as const).map(tab => (
          <button key={tab} className={`profile-tab ${activeTab === tab ? 'on' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' && '◉ OVERVIEW'}
            {tab === 'badges'   && `🏆 BADGES (${unlockedBadges.length}/${badges.length})`}
            {tab === 'skills'   && '◈ SKILLS'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="profile-tab-content">
          {status === 'loading' && <div className="prf-loading">LOADING DOSSIER...</div>}
          {status === 'error'   && <div className="prf-error">FAILED TO LOAD PROFILE</div>}
          {status === 'ready' && profile && (
            <div className="prf-overview-grid">
              {/* Rings */}
              <div className="prf-rings-panel">
                <div className="prf-panel-label">// PERFORMANCE RINGS</div>
                <div className="prf-rings-row">
                  <StatRing value={profile.totalSolved} max={profile.totalChallenges} color="#00ff41" label={`${Math.round((profile.totalSolved / Math.max(profile.totalChallenges,1)) * 100)}%`} sublabel="SOLVED" />
                  <StatRing value={profile.accuracy} max={100} color="#4fc3f7" label={`${profile.accuracy}%`} sublabel="ACCURACY" />
                  <StatRing value={level.progress} max={100} color="#f9a825" label={`LVL ${level.level}`} sublabel={level.title} />
                </div>
              </div>

              {/* Tier breakdown */}
              <div className="prf-tier-panel prf-panel">
                <div className="prf-panel-label">// TIER BREAKDOWN</div>
                {[1, 2, 3].map(t => {
                  const ts = profile.tierStats[t] || { solved: 0, total: 0 };
                  const tm = TIER_META[t];
                  const pct = ts.total > 0 ? Math.round((ts.solved / ts.total) * 100) : 0;
                  return (
                    <div className="prf-tier-row" key={t}>
                      <span className="prf-tier-label" style={{ color: tm.color }}>TIER {t} — {tm.label}</span>
                      <div className="prf-tier-bar">
                        <div className="prf-tier-fill" style={{ width: `${pct}%`, background: tm.color, boxShadow: `0 0 8px ${tm.color}66` }} />
                      </div>
                      <span className="prf-tier-frac" style={{ color: tm.color }}>{ts.solved}/{ts.total}</span>
                    </div>
                  );
                })}
              </div>

              {/* Category grid */}
              <div className="prf-cat-panel prf-panel">
                <div className="prf-panel-label">// CATEGORY BREAKDOWN</div>
                <div className="prf-cat-grid">
                  {Object.entries(profile.catStats).filter(([,v]) => v.total > 0).map(([cat, v]) => {
                    const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
                    const pct = Math.round((v.solved / v.total) * 100);
                    return (
                      <div className="prf-cat-item" key={cat}>
                        <div className="prf-cat-top">
                          <span style={{ color: meta.color }}>{meta.icon} {cat}</span>
                          <span style={{ color: meta.color, fontSize: '.6rem' }}>{v.solved}/{v.total}</span>
                        </div>
                        <div className="prf-cat-bar">
                          <div className="prf-cat-fill" style={{ width: `${pct}%`, background: meta.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats list */}
              <div className="prf-stats-panel prf-panel">
                <div className="prf-panel-label">// OPERATOR STATS</div>
                <div className="prf-stat-list">
                  <div className="prf-stat-row"><span className="prf-sk">Total Flags Captured</span><span className="prf-sv" style={{ color: '#00ff41' }}>{profile.totalSolved}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Total Attempts</span><span className="prf-sv">{profile.totalAttempts}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">First-Try Solves</span><span className="prf-sv" style={{ color: '#4fc3f7' }}>{profile.firstAttemptSolves}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Accuracy Rate</span><span className="prf-sv" style={{ color: '#f9a825' }}>{profile.accuracy}%</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Total XP Earned</span><span className="prf-sv" style={{ color: '#ffd700' }}>{userXp.toLocaleString()}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Level</span><span className="prf-sv">{level.level} — {level.title}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Joined</span><span className="prf-sv">{profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : '—'}</span></div>
                  <div className="prf-stat-row"><span className="prf-sk">Last Active</span><span className="prf-sv">{profile.lastSolveAt ? new Date(profile.lastSolveAt).toLocaleDateString() : '—'}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BADGES TAB ── */}
      {activeTab === 'badges' && (
        <div className="profile-tab-content">
          <div className="badges-section-label">UNLOCKED ({unlockedBadges.length})</div>
          <div className="badges-grid">
            {badges.filter(b => b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
          </div>
          {badges.filter(b => !b.unlocked).length > 0 && (
            <>
              <div className="badges-section-label" style={{ marginTop: '2rem' }}>LOCKED ({badges.filter(b => !b.unlocked).length})</div>
              <div className="badges-grid badges-locked-grid">
                {badges.filter(b => !b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === 'skills' && (
        <div className="profile-tab-content">
          <div className="skills-layout">
            <div className="skills-radar-wrap">
              <div className="prf-panel-label" style={{ marginBottom: '1rem' }}>// CATEGORY RADAR</div>
              <canvas ref={canvasRef} width={360} height={360} className="skills-canvas" />
            </div>
            <div className="skills-bars-wrap">
              <div className="prf-panel-label" style={{ marginBottom: '1rem' }}>// SKILL BARS</div>
              {status === 'ready' && profile && Object.entries(profile.catStats)
                .filter(([,v]) => v.total > 0)
                .sort(([,a], [,b]) => (b.solved/b.total) - (a.solved/a.total))
                .map(([cat, v]) => {
                  const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
                  const pct = Math.round((v.solved / v.total) * 100);
                  return (
                    <div className="skill-bar-row" key={cat}>
                      <div className="skill-bar-label">
                        <span style={{ color: meta.color }}>{meta.icon}</span>
                        <span className="skill-bar-name">{cat}</span>
                        <span className="skill-bar-frac" style={{ color: meta.color }}>{v.solved}/{v.total}</span>
                      </div>
                      <div className="skill-bar-track">
                        <div className="skill-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`, boxShadow: `0 0 10px ${meta.color}44` }} />
                        <span className="skill-bar-pct" style={{ color: meta.color }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Write-up section */}
          <div className="writeup-section">
            <div className="prf-panel-label" style={{ marginBottom: '1rem' }}>// PERSONAL WRITE-UPS ({Object.keys(writeups).length})</div>
            {Object.keys(writeups).length === 0
              ? <div className="writeup-empty">No write-ups yet. After solving a challenge, click "WRITE-UP" to add notes.</div>
              : <div className="writeup-list">
                  {Object.entries(writeups).map(([chalId, text]) => (
                    <div key={chalId} className="writeup-item">
                      <div className="writeup-id" style={{ color: '#4fc3f7' }}>{chalId}</div>
                      <div className="writeup-text">{text}</div>
                      <button className="writeup-delete" onClick={() => {
                        const next = { ...writeups };
                        delete next[chalId];
                        setWriteups(next);
                        localStorage.setItem('ephemeral_writeups', JSON.stringify(next));
                      }}>✕ DELETE</button>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
};
