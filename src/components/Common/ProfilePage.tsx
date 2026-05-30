import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../hooks/useApi';
import { computeBadges, getXpLevel, type Badge, type ProfileData } from '../../lib/badges';
import { BG_IMAGES } from '../../lib/imageMapping';

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
  1: { label: 'ENTRY LEVEL', color: '#66bb6a' },
  2: { label: 'CORE MODULE', color: '#f9a825' },
  3: { label: 'RUHENHEIM',   color: '#ef5350' },
};

const RANK_META: Record<string, { color: string; glyph: string }> = {
  'RECRUIT':   { color: '#a0a0b0', glyph: '◌' },
  'OPERATIVE': { color: '#4fc3f7', glyph: '◈' },
  'AGENT':     { color: '#66bb6a', glyph: '◆' },
  'SPECIALIST':{ color: '#f9a825', glyph: '⬡' },
  'PHANTOM':   { color: '#ab47bc', glyph: '◉' },
  'GHOST':     { color: '#e8000d', glyph: '☠' },
};

function StatRing({ value, max, color, label, sublabel }: {
  value: number; max: number; color: string; label: string; sublabel?: string;
}) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="prf-ring-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        <text x="50" y="47" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="var(--disp)" fontWeight="700">{label}</text>
        {sublabel && <text x="50" y="59" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="6.5" fontFamily="var(--mono)" letterSpacing="0.1em">{sublabel}</text>}
      </svg>
      <div className="prf-ring-glow" style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }} />
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const rc = RARITY_COLORS[badge.rarity];
  return (
    <div className={`prf-badge-card ${badge.unlocked ? 'prf-badge-on' : 'prf-badge-off'}`}
      style={{ '--bc': rc } as any}>
      <div className="prf-badge-icon-wrap" style={{
        background: badge.unlocked ? `${rc}18` : 'rgba(255,255,255,0.02)',
        borderColor: badge.unlocked ? `${rc}55` : 'rgba(255,255,255,0.06)',
        boxShadow: badge.unlocked ? `0 0 18px ${rc}22` : 'none',
      }}>
        <span className="prf-badge-icon" style={{ filter: badge.unlocked ? 'none' : 'grayscale(1) opacity(0.2)' }}>
          {badge.icon}
        </span>
      </div>
      <div className="prf-badge-name" style={{ color: badge.unlocked ? '#fff' : 'rgba(255,255,255,0.2)' }}>
        {badge.name}
      </div>
      <div className="prf-badge-rarity" style={{ color: badge.unlocked ? rc : 'rgba(255,255,255,0.1)' }}>
        {badge.rarity.toUpperCase()}
      </div>
      {!badge.unlocked && badge.progress !== undefined && (
        <div className="prf-badge-progbar">
          <div className="prf-badge-progfill" style={{ width: `${badge.progress}%`, background: rc }} />
        </div>
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
  const [writeups] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('ephemeral_writeups') || '{}'); } catch { return {}; }
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    apiRequest(`/api/stats/profile/${encodeURIComponent(userId)}`)
      .then(data => { setProfile(data.profile); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, [userId]);

  // Radar chart
  useEffect(() => {
    if (activeTab !== 'skills' || !profile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cats = Object.entries(profile.catStats || {}).filter(([, v]) => v.total > 0).slice(0, 8);
    if (cats.length < 3) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    const n = cats.length;
    ctx.clearRect(0, 0, W, H);
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
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();
    }
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
    ctx.fillStyle = 'rgba(0,255,65,0.1)';
    ctx.fill();
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < n; i++) {
      const [cat, v] = cats[i];
      const pct = v.total > 0 ? v.solved / v.total : 0;
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const x = cx + R * pct * Math.cos(angle);
      const y = cy + R * pct * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff41';
      ctx.fill();
      const lx = cx + (R + 26) * Math.cos(angle);
      const ly = cy + (R + 26) * Math.sin(angle);
      const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
      ctx.fillStyle = meta.color;
      ctx.font = 'bold 9px var(--mono, monospace)';
      ctx.textAlign = 'center';
      ctx.fillText(`${meta.icon} ${cat}`, lx, ly);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '8px var(--mono, monospace)';
      ctx.fillText(`${v.solved}/${v.total}`, lx, ly + 11);
    }
  }, [activeTab, profile]);

  const level = getXpLevel(userXp);
  const badges = profile ? computeBadges(profile) : [];
  const unlockedBadges = badges.filter(b => b.unlocked);
  const rankMeta = RANK_META[level.title] || RANK_META['RECRUIT'];

  return (
    <div className="prf-shell">
      {/* ── CINEMATIC BANNER ── */}
      <div className="prf-banner">
        <img
          src={BG_IMAGES.profileBg}
          alt=""
          className="prf-banner-img"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="prf-banner-grad" />
        <div className="prf-banner-scan" />

        {/* HUD corners */}
        <div className="hc tl" style={{ borderColor: rankMeta.color }} />
        <div className="hc br" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Rank watermark */}
        <div className="prf-rank-watermark" style={{ color: rankMeta.color }}>
          {rankMeta.glyph}
        </div>

        {/* Banner content */}
        <div className="prf-banner-body">
          {/* Avatar */}
          <div className="prf-av-wrap" onClick={onChangeAvatar} title="Change avatar">
            {userAvatar
              ? <img src={userAvatar} alt="avatar" className="prf-av-img"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              : <div className="prf-av-fallback" style={{ borderColor: rankMeta.color }}>
                  <span>{displayName.slice(0, 2).toUpperCase()}</span>
                </div>
            }
            <div className="prf-av-ring" style={{ borderColor: rankMeta.color, boxShadow: `0 0 16px ${rankMeta.color}55` }} />
            {onChangeAvatar && <div className="prf-av-edit">✎</div>}
          </div>

          {/* Identity */}
          <div className="prf-identity">
            <div className="prf-eyebrow">// OPERATOR DOSSIER</div>
            <h1 className="prf-username">{displayName}</h1>
            <div className="prf-rank-row">
              <span className="prf-rank-glyph" style={{ color: rankMeta.color }}>{rankMeta.glyph}</span>
              <span className="prf-rank-title" style={{ color: rankMeta.color }}>{level.title}</span>
              <span className="prf-rank-lvl">LVL {level.level}</span>
              {unlockedBadges.length > 0 && (
                <span className="prf-badge-count">🏆 {unlockedBadges.length} BADGES</span>
              )}
            </div>

            {/* XP bar */}
            <div className="prf-xp-wrap">
              <div className="prf-xp-track">
                <div className="prf-xp-fill"
                  style={{ width: `${level.progress}%`, background: rankMeta.color, boxShadow: `0 0 10px ${rankMeta.color}88` }} />
              </div>
              <span className="prf-xp-label" style={{ color: rankMeta.color }}>
                {userXp.toLocaleString()} / {level.nextXp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="prf-quick-stats">
            <div className="prf-qs-card" style={{ borderColor: 'rgba(0,255,65,.2)' }}>
              <span className="prf-qs-val" style={{ color: '#00ff41' }}>{challengesSolved}</span>
              <span className="prf-qs-lbl">FLAGS</span>
            </div>
            <div className="prf-qs-card" style={{ borderColor: 'rgba(79,195,247,.2)' }}>
              <span className="prf-qs-val" style={{ color: '#4fc3f7' }}>{userXp.toLocaleString()}</span>
              <span className="prf-qs-lbl">XP</span>
            </div>
            <div className="prf-qs-card" style={{ borderColor: 'rgba(249,168,37,.2)' }}>
              <span className="prf-qs-val" style={{ color: '#f9a825' }}>{profile?.accuracy ?? '—'}%</span>
              <span className="prf-qs-lbl">ACCURACY</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="prf-tabs">
        {(['overview', 'badges', 'skills'] as const).map(tab => (
          <button
            key={tab}
            className={`prf-tab ${activeTab === tab ? 'prf-tab-on' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '◉ OVERVIEW'}
            {tab === 'badges'   && `🏆 BADGES (${unlockedBadges.length}/${badges.length})`}
            {tab === 'skills'   && '◈ SKILLS'}
          </button>
        ))}
        <div className="prf-tabs-rule" />
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="prf-content">
          {status === 'loading' && (
            <div className="prf-loader">
              <div className="prf-loader-bar" />
              <span>LOADING DOSSIER...</span>
            </div>
          )}
          {status === 'error' && (
            <div className="prf-err">⚠ FAILED TO RETRIEVE OPERATOR PROFILE</div>
          )}
          {status === 'ready' && profile && (
            <div className="prf-ov-grid">
              {/* Performance rings */}
              <div className="prf-panel prf-rings-panel">
                <div className="prf-panel-hdr">// PERFORMANCE RINGS</div>
                <div className="prf-rings-row">
                  <StatRing
                    value={profile.totalSolved}
                    max={profile.totalChallenges}
                    color="#00ff41"
                    label={`${Math.round((profile.totalSolved / Math.max(profile.totalChallenges, 1)) * 100)}%`}
                    sublabel="SOLVED"
                  />
                  <StatRing value={profile.accuracy} max={100} color="#4fc3f7"
                    label={`${profile.accuracy}%`} sublabel="ACCURACY" />
                  <StatRing value={level.progress} max={100} color={rankMeta.color}
                    label={`LVL ${level.level}`} sublabel={level.title} />
                </div>
              </div>

              {/* Tier breakdown */}
              <div className="prf-panel">
                <div className="prf-panel-hdr">// TIER BREAKDOWN</div>
                {[1, 2, 3].map(t => {
                  const ts = profile.tierStats[t] || { solved: 0, total: 0 };
                  const tm = TIER_META[t];
                  const pct = ts.total > 0 ? Math.round((ts.solved / ts.total) * 100) : 0;
                  return (
                    <div className="prf-tier-row" key={t}>
                      <div className="prf-tier-top">
                        <span style={{ color: tm.color }}>T{t} — {tm.label}</span>
                        <span style={{ color: tm.color }}>{ts.solved}/{ts.total}</span>
                      </div>
                      <div className="prf-tier-track">
                        <div className="prf-tier-fill"
                          style={{ width: `${pct}%`, background: tm.color, boxShadow: `0 0 8px ${tm.color}66` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category grid */}
              <div className="prf-panel">
                <div className="prf-panel-hdr">// CATEGORY BREAKDOWN</div>
                <div className="prf-cat-grid">
                  {Object.entries(profile.catStats).filter(([, v]) => v.total > 0).map(([cat, v]) => {
                    const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
                    const pct = Math.round((v.solved / v.total) * 100);
                    return (
                      <div className="prf-cat-item" key={cat}>
                        <div className="prf-cat-top">
                          <span style={{ color: meta.color }}>{meta.icon} {cat}</span>
                          <span style={{ color: meta.color, fontSize: '.52rem' }}>{v.solved}/{v.total}</span>
                        </div>
                        <div className="prf-cat-track">
                          <div className="prf-cat-fill" style={{ width: `${pct}%`, background: meta.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operator stats */}
              <div className="prf-panel">
                <div className="prf-panel-hdr">// OPERATOR STATS</div>
                <div className="prf-stat-list">
                  {[
                    ['Total Flags Captured', profile.totalSolved, '#00ff41'],
                    ['Total Attempts',       profile.totalAttempts, undefined],
                    ['First-Try Solves',     profile.firstAttemptSolves, '#4fc3f7'],
                    ['Accuracy Rate',        `${profile.accuracy}%`, '#f9a825'],
                    ['Total XP Earned',      userXp.toLocaleString(), '#ffd700'],
                    ['Level',                `${level.level} — ${level.title}`, rankMeta.color],
                    ['Joined',               profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : '—', undefined],
                    ['Last Active',          profile.lastSolveAt ? new Date(profile.lastSolveAt).toLocaleDateString() : '—', undefined],
                  ].map(([k, v, c]) => (
                    <div className="prf-stat-row" key={String(k)}>
                      <span className="prf-sk">{k}</span>
                      <span className="prf-sv" style={{ color: c as string | undefined }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BADGES ── */}
      {activeTab === 'badges' && (
        <div className="prf-content">
          {unlockedBadges.length > 0 && (
            <>
              <div className="prf-section-label">UNLOCKED ({unlockedBadges.length})</div>
              <div className="prf-badges-grid">
                {badges.filter(b => b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
              </div>
            </>
          )}
          {badges.filter(b => !b.unlocked).length > 0 && (
            <>
              <div className="prf-section-label" style={{ marginTop: '2rem', opacity: .5 }}>
                LOCKED ({badges.filter(b => !b.unlocked).length})
              </div>
              <div className="prf-badges-grid">
                {badges.filter(b => !b.unlocked).map(b => <BadgeCard key={b.id} badge={b} />)}
              </div>
            </>
          )}
          {badges.length === 0 && (
            <div className="prf-empty">Complete challenges to unlock badges.</div>
          )}
        </div>
      )}

      {/* ── SKILLS ── */}
      {activeTab === 'skills' && (
        <div className="prf-content">
          <div className="prf-skills-layout">
            <div className="prf-panel">
              <div className="prf-panel-hdr">// CATEGORY RADAR</div>
              <canvas ref={canvasRef} width={360} height={360} className="prf-radar-canvas" />
            </div>
            <div className="prf-panel">
              <div className="prf-panel-hdr">// SKILL BARS</div>
              {status === 'ready' && profile && Object.entries(profile.catStats)
                .filter(([, v]) => v.total > 0)
                .sort(([, a], [, b]) => (b.solved / b.total) - (a.solved / a.total))
                .map(([cat, v]) => {
                  const meta = CAT_META[cat] || { color: '#fff', icon: '□' };
                  const pct = Math.round((v.solved / v.total) * 100);
                  return (
                    <div className="prf-skill-row" key={cat}>
                      <div className="prf-skill-label">
                        <span style={{ color: meta.color }}>{meta.icon}</span>
                        <span className="prf-skill-name">{cat}</span>
                        <span style={{ color: meta.color, marginLeft: 'auto', fontSize: '.5rem' }}>{v.solved}/{v.total}</span>
                      </div>
                      <div className="prf-skill-track">
                        <div className="prf-skill-fill"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`, boxShadow: `0 0 10px ${meta.color}44` }} />
                        <span className="prf-skill-pct" style={{ color: meta.color }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              {status === 'ready' && profile && Object.values(profile.catStats).every(v => v.total === 0) && (
                <div className="prf-empty">Solve challenges to track skill progress.</div>
              )}
            </div>
          </div>

          {/* Write-ups */}
          {Object.keys(writeups).length > 0 && (
            <div className="prf-panel" style={{ marginTop: '1rem' }}>
              <div className="prf-panel-hdr">// WRITE-UPS ({Object.keys(writeups).length})</div>
              <div className="prf-writeup-list">
                {Object.entries(writeups).map(([id, text]) => (
                  <div className="prf-writeup-item" key={id}>
                    <div className="prf-writeup-id" style={{ color: '#4fc3f7' }}>{id}</div>
                    <div className="prf-writeup-text">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
