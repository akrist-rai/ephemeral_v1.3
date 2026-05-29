import React, { useEffect, useState, useCallback } from 'react';
import { apiRequest } from '../../hooks/useApi';

interface LeaderboardEntry {
  userId: string;
  xp: number;
  challengesSolved: number;
  rank: number;
}

interface LeaderboardProps {
  currentUserId: string;
  navigate: (path: string) => void;
}

// One Piece themed bounty amounts based on XP
function xpToBounty(xp: number): string {
  if (xp === 0) return '0';
  // Scale XP -> Berry (×100,000)
  const berries = xp * 100_000;
  if (berries >= 1_000_000_000) return `${(berries / 1_000_000_000).toFixed(2)}B`;
  if (berries >= 1_000_000) return `${(berries / 1_000_000).toFixed(0)}M`;
  return `${(berries / 1_000).toFixed(0)}K`;
}

// Assign pirate title based on rank
function pirateTitle(rank: number, xp: number): string {
  if (rank === 1) return 'PIRATE KING';
  if (rank === 2) return 'EMPEROR';
  if (rank === 3) return 'WARLORD';
  if (rank <= 5)  return 'REAR ADMIRAL';
  if (rank <= 10) return 'CAPTAIN';
  if (rank <= 20) return 'LIEUTENANT';
  if (xp === 0)   return 'ROOKIE';
  return 'PIRATE';
}

// Poster art for top-3 banners — using actual avatar folder images
const TOP3_POSTERS = [
  '/avatar/Monkey D Luffy (1).jpeg',
  '/avatar/Roronoa Zoro.jpeg',
  '/avatar/Sanji (1).jpeg',
];

const WANTED_FRAMES = ['#ffd700', '#c0c0c0', '#cd7f32'];

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId, navigate }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [limit, setLimit] = useState(20);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await apiRequest(`/api/leaderboard?limit=${limit}`);
      setEntries(data.leaderboard || []);
      const mine = data.leaderboard?.find((e: LeaderboardEntry) => e.userId === currentUserId);
      setMyRank(mine || null);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [limit, currentUserId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, [load]);

  const maxXp = entries[0]?.xp || 1;

  return (
    <div className="bb-shell">
      {/* ── PAGE HEADER ── */}
      <div className="bb-header">
        <div className="bb-header-left">
          <div className="bb-eyebrow">// WORLD GOVERNMENT · CRIMINAL BOUNTY REGISTRY</div>
          <h1 className="bb-title">
            <span className="bb-title-skull">☠</span>
            WANTED PIRATES
          </h1>
          <div className="bb-subtitle">THESE INDIVIDUALS HAVE BREACHED THE SACRED WALLS OF THE ACN NETWORK</div>
        </div>
        <div className="bb-header-right">
          <div className="bb-live-badge">
            <span className="bb-live-dot" />LIVE REGISTRY
          </div>
          <div className="bb-controls">
            <select className="bb-limit-sel" value={limit} onChange={e => setLimit(Number(e.target.value))}>
              <option value={10}>TOP 10</option>
              <option value={20}>TOP 20</option>
              <option value={50}>TOP 50</option>
            </select>
            <button className="bb-refresh-btn" onClick={load} disabled={status === 'loading'}>
              {status === 'loading' ? '◌ SYNCING' : '⟳ REFRESH'}
            </button>
          </div>
        </div>
      </div>

      {/* ── TOP 3 WANTED POSTERS ── */}
      {status === 'ready' && entries.length >= 1 && (
        <div className="bb-top3-row">
          {/* Rearranged: 2nd | 1st | 3rd */}
          {[1, 0, 2].map((idx) => {
            const entry = entries[idx];
            if (!entry) return null;
            const isFirst = idx === 0;
            const frameColor = WANTED_FRAMES[idx];
            const isMe = entry.userId === currentUserId;
            return (
              <div key={entry.userId} className={`bb-wanted-card ${isFirst ? 'bb-wanted-first' : ''} ${isMe ? 'bb-wanted-me' : ''}`}
                style={{ '--frame-color': frameColor } as any}>
                {/* Aged paper texture overlay */}
                <div className="bb-poster-noise" />

                {/* Rank badge */}
                <div className="bb-poster-rank" style={{ color: frameColor, borderColor: frameColor }}>
                  #{idx + 1}
                </div>

                {/* WANTED header */}
                <div className="bb-poster-wanted" style={{ color: frameColor }}>WANTED</div>
                <div className="bb-poster-dead-alive">DEAD OR ALIVE</div>

                {/* Mugshot */}
                <div className="bb-poster-mugshot" style={{ borderColor: frameColor, boxShadow: `0 0 20px ${frameColor}44` }}>
                  <img
                    src={TOP3_POSTERS[idx] || ''}
                    alt={entry.userId}
                    className="bb-mugshot-img"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const parent = (e.currentTarget as HTMLImageElement).parentElement;
                      if (parent) parent.classList.add('bb-mugshot-fallback');
                    }}
                  />
                  <div className="bb-mugshot-initials">{entry.userId.slice(0, 2).toUpperCase()}</div>
                </div>

                {/* Name plate */}
                <div className="bb-poster-name">{entry.userId}</div>
                <div className="bb-poster-title" style={{ color: frameColor }}>{pirateTitle(idx + 1, entry.xp)}</div>

                {/* Bounty */}
                <div className="bb-poster-bounty-label">BOUNTY:</div>
                <div className="bb-poster-bounty" style={{ color: frameColor }}>
                  <span className="bb-berry">฿</span>{xpToBounty(entry.xp)}
                </div>

                {/* Stats strip */}
                <div className="bb-poster-stats">
                  <div className="bb-poster-stat">
                    <span className="bb-pstat-v" style={{ color: frameColor }}>{entry.challengesSolved}</span>
                    <span className="bb-pstat-l">FLAGS</span>
                  </div>
                  <div className="bb-poster-stat-div" />
                  <div className="bb-poster-stat">
                    <span className="bb-pstat-v" style={{ color: frameColor }}>{entry.xp.toLocaleString()}</span>
                    <span className="bb-pstat-l">XP</span>
                  </div>
                </div>

                {isMe && <div className="bb-poster-you-badge">YOU</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── REST OF THE LIST ── */}
      <div className="bb-list-wrap">
        <div className="bb-list-header">
          <span className="bb-list-col bb-lc-rank">RANK</span>
          <span className="bb-list-col bb-lc-name">PIRATE NAME</span>
          <span className="bb-list-col bb-lc-title">DESIGNATION</span>
          <span className="bb-list-col bb-lc-prog">WANTED PROGRESS</span>
          <span className="bb-list-col bb-lc-flags">FLAGS</span>
          <span className="bb-list-col bb-lc-bounty">BOUNTY</span>
        </div>

        {status === 'loading' && (
          <div className="bb-list-loading">
            <span className="bb-scan-line" />SCANNING REGISTRY...
          </div>
        )}
        {status === 'error' && (
          <div className="bb-list-error">⚠ REGISTRY OFFLINE — CONNECTION TO MARINES LOST</div>
        )}
        {status === 'ready' && entries.length === 0 && (
          <div className="bb-list-empty">No pirates registered yet. Be the first to raise a flag.</div>
        )}

        {status === 'ready' && entries.slice(3).map((entry, i) => {
          const rank = i + 4;
          const isMe = entry.userId === currentUserId;
          const barPct = Math.round((entry.xp / maxXp) * 100);
          const isHov = hoveredId === entry.userId;
          return (
            <div
              key={entry.userId}
              className={`bb-list-row ${isMe ? 'bb-list-me' : ''} ${isHov ? 'bb-list-hov' : ''}`}
              onMouseEnter={() => setHoveredId(entry.userId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="bb-list-col bb-lc-rank">
                <span className="bb-rank-num">#{rank}</span>
              </span>
              <span className="bb-list-col bb-lc-name">
                <div className="bb-row-avatar" style={{ color: isMe ? '#00ff41' : 'rgba(255,255,255,.5)', borderColor: isMe ? '#00ff41' : 'rgba(255,255,255,.15)' }}>
                  {entry.userId.slice(0, 2).toUpperCase()}
                </div>
                <span className="bb-row-name" style={{ color: isMe ? '#00ff41' : '#fff' }}>
                  {entry.userId}
                  {isMe && <span className="bb-you-tag">YOU</span>}
                </span>
              </span>
              <span className="bb-list-col bb-lc-title">
                <span className="bb-row-title">{pirateTitle(rank, entry.xp)}</span>
              </span>
              <span className="bb-list-col bb-lc-prog">
                <div className="bb-prog-track">
                  <div className="bb-prog-fill" style={{
                    width: `${barPct}%`,
                    background: isMe ? '#00ff41' : 'rgba(255,184,48,0.6)',
                    boxShadow: isMe ? '0 0 6px #00ff4188' : 'none',
                  }} />
                </div>
                <span className="bb-prog-pct">{barPct}%</span>
              </span>
              <span className="bb-list-col bb-lc-flags">
                <span className="bb-flags-val">{entry.challengesSolved}</span>
                <span className="bb-flags-lbl"> flags</span>
              </span>
              <span className="bb-list-col bb-lc-bounty">
                <span className="bb-bounty-val">
                  <span className="bb-berry-sm">฿</span>{xpToBounty(entry.xp)}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* ── MY POSITION (if not in view) ── */}
      {status === 'ready' && currentUserId && !myRank && (
        <div className="bb-unranked">
          <span className="bb-unranked-skull">☠</span>
          <span>You have no bounty yet. Capture your first flag to enter the registry.</span>
        </div>
      )}
    </div>
  );
};
