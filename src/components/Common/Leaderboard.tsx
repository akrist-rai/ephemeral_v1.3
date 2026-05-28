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

const TIER_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];
const RANK_LABELS: Record<number, string> = { 1: 'COMMANDER', 2: 'LIEUTENANT', 3: 'SERGEANT' };

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId, navigate }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [limit, setLimit] = useState(20);

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

  // Auto-refresh every 30s
  useEffect(() => {
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, [load]);

  const maxXp = entries[0]?.xp || 1;

  return (
    <div className="lb-shell">
      {/* Header */}
      <div className="lb-header">
        <div>
          <div className="lb-eyebrow">// ACN_EPHEMERAL · GLOBAL RANKING</div>
          <h2 className="lb-title">LEADERBOARD</h2>
          <div className="lb-subtitle">Live rankings — refreshes every 30 seconds</div>
        </div>
        <div className="lb-header-actions">
          <button className="lb-refresh-btn" onClick={load} disabled={status === 'loading'}>
            {status === 'loading' ? '◌ SYNCING' : '⟳ REFRESH'}
          </button>
          <select
            className="lb-limit-sel"
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
          >
            <option value={10}>TOP 10</option>
            <option value={20}>TOP 20</option>
            <option value={50}>TOP 50</option>
          </select>
        </div>
      </div>

      {/* Podium (top 3) */}
      {status === 'ready' && entries.length >= 3 && (
        <div className="lb-podium">
          {/* 2nd */}
          <div className="lb-podium-slot lb-podium-2">
            <div className="lb-podium-rank" style={{ color: TIER_COLORS[1] }}>2</div>
            <div className="lb-podium-avatar" style={{ borderColor: TIER_COLORS[1], boxShadow: `0 0 20px ${TIER_COLORS[1]}44` }}>
              {entries[1]?.userId.slice(0, 2)}
            </div>
            <div className="lb-podium-name" style={{ color: TIER_COLORS[1] }}>{entries[1]?.userId}</div>
            <div className="lb-podium-xp">{entries[1]?.xp.toLocaleString()} XP</div>
            <div className="lb-podium-base" style={{ background: TIER_COLORS[1], height: '60px' }} />
          </div>
          {/* 1st */}
          <div className="lb-podium-slot lb-podium-1">
            <div className="lb-podium-crown">♛</div>
            <div className="lb-podium-rank" style={{ color: TIER_COLORS[0] }}>1</div>
            <div className="lb-podium-avatar" style={{ borderColor: TIER_COLORS[0], boxShadow: `0 0 30px ${TIER_COLORS[0]}66`, width: '64px', height: '64px', fontSize: '1.3rem' }}>
              {entries[0]?.userId.slice(0, 2)}
            </div>
            <div className="lb-podium-name" style={{ color: TIER_COLORS[0] }}>{entries[0]?.userId}</div>
            <div className="lb-podium-xp">{entries[0]?.xp.toLocaleString()} XP</div>
            <div className="lb-podium-base" style={{ background: TIER_COLORS[0], height: '90px' }} />
          </div>
          {/* 3rd */}
          <div className="lb-podium-slot lb-podium-3">
            <div className="lb-podium-rank" style={{ color: TIER_COLORS[2] }}>3</div>
            <div className="lb-podium-avatar" style={{ borderColor: TIER_COLORS[2], boxShadow: `0 0 20px ${TIER_COLORS[2]}44` }}>
              {entries[2]?.userId.slice(0, 2)}
            </div>
            <div className="lb-podium-name" style={{ color: TIER_COLORS[2] }}>{entries[2]?.userId}</div>
            <div className="lb-podium-xp">{entries[2]?.xp.toLocaleString()} XP</div>
            <div className="lb-podium-base" style={{ background: TIER_COLORS[2], height: '45px' }} />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="lb-table-wrap">
        {status === 'loading' && (
          <div className="lb-loading">SYNCING RANKINGS...</div>
        )}
        {status === 'error' && (
          <div className="lb-error">FAILED TO LOAD RANKINGS — check API connection</div>
        )}
        {status === 'ready' && entries.length === 0 && (
          <div className="lb-empty">No operators on the board yet. Be the first.</div>
        )}
        {status === 'ready' && entries.length > 0 && (
          <table className="lb-table">
            <thead>
              <tr>
                <th className="lb-th lb-th-rank">RANK</th>
                <th className="lb-th lb-th-user">OPERATOR</th>
                <th className="lb-th lb-th-bar">PROGRESS</th>
                <th className="lb-th lb-th-solved">SOLVED</th>
                <th className="lb-th lb-th-xp">XP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const isMe = e.userId === currentUserId;
                const rankColor = i < 3 ? TIER_COLORS[i] : 'rgba(255,255,255,0.4)';
                const barPct = Math.round((e.xp / maxXp) * 100);
                return (
                  <tr key={e.userId} className={`lb-row ${isMe ? 'lb-me' : ''} ${i < 3 ? 'lb-top3' : ''}`}>
                    <td className="lb-td lb-td-rank">
                      {i < 3
                        ? <span className="lb-medal" style={{ color: rankColor, textShadow: `0 0 12px ${rankColor}88` }}>{['♛', '♜', '♟'][i]}</span>
                        : <span className="lb-rank-num" style={{ color: rankColor }}>#{e.rank}</span>
                      }
                    </td>
                    <td className="lb-td lb-td-user">
                      <div className="lb-user-cell">
                        <div className="lb-user-avatar" style={{
                          borderColor: isMe ? '#00ff41' : rankColor,
                          color: isMe ? '#00ff41' : rankColor,
                        }}>
                          {e.userId.slice(0, 2)}
                        </div>
                        <div>
                          <div className="lb-user-id" style={{ color: isMe ? '#00ff41' : '#fff' }}>
                            {e.userId}
                            {isMe && <span className="lb-you-badge">YOU</span>}
                          </div>
                          {i < 3 && <div className="lb-rank-title" style={{ color: rankColor }}>{RANK_LABELS[i + 1]}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="lb-td lb-td-bar">
                      <div className="lb-xp-bar">
                        <div
                          className="lb-xp-fill"
                          style={{
                            width: `${barPct}%`,
                            background: isMe ? '#00ff41' : i < 3 ? rankColor : 'rgba(255,255,255,0.25)',
                            boxShadow: isMe ? '0 0 8px #00ff4188' : i < 3 ? `0 0 8px ${rankColor}66` : 'none',
                          }}
                        />
                      </div>
                    </td>
                    <td className="lb-td lb-td-solved">
                      <span className="lb-solved-count">{e.challengesSolved}</span>
                      <span className="lb-solved-lbl"> flags</span>
                    </td>
                    <td className="lb-td lb-td-xp">
                      <span className="lb-xp-val" style={{ color: isMe ? '#00ff41' : i < 3 ? rankColor : '#fff' }}>
                        {e.xp.toLocaleString()}
                      </span>
                      <span className="lb-xp-unit"> xp</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* My position (if not in current view) */}
      {status === 'ready' && currentUserId && !myRank && (
        <div className="lb-my-pos">
          <span style={{ color: 'rgba(255,255,255,.4)' }}>You are not yet ranked. Submit your first flag to appear on the board.</span>
        </div>
      )}
    </div>
  );
};
