import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { apiRequest } from '../../hooks/useApi';

interface ActivityEntry {
  userId: string;
  challengeId: string;
  pointsEarned: number;
  solvedAt: string;
}

interface ActivityFeedProps {
  challenges: any[];
  currentUserId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

// Derive a stable short hex address from a string (visual only)
function toHexAddr(s: string): string {
  let h = 0x5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return '0x' + (h >>> 0).toString(16).toUpperCase().padStart(4, '0');
}

const VERBS = ['captured', 'pwned', 'exfiltrated', 'cracked', 'breached'];
function verbFor(userId: string, challengeId: string): string {
  const idx = (userId.charCodeAt(0) + challengeId.charCodeAt(0)) % VERBS.length;
  return VERBS[idx];
}

const CAT_COLORS: Record<string, string> = {
  GRADIENT: '#4fc3f7', ARCHITECTURE: '#f9a825', INFERENCE: '#e8000d',
  'DATA LEAK': '#ff6b35', TRAINING: '#ab47bc', NLP: '#26c6da',
  OVERFITTING: '#ef5350', SYSTEMS: '#66bb6a', CRYPTO: '#ffd54f',
  ALGORITHMS: '#80cbc4', FAIRNESS: '#ce93d8', WEB: '#e8000d',
  PWN: '#ff4466', REVERSE: '#d500f9', SCRIPTING: '#ab47bc',
};

const CAT_ICONS: Record<string, string> = {
  GRADIENT: '∇', ARCHITECTURE: '⬡', INFERENCE: '◈', 'DATA LEAK': '⚠',
  TRAINING: '⟳', NLP: '⌥', OVERFITTING: '⤴', SYSTEMS: '⚙',
  CRYPTO: '🔐', ALGORITHMS: '◇', FAIRNESS: '⚖', WEB: '🌐',
  PWN: '☠', REVERSE: '⇄', SCRIPTING: '📜',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ challenges, currentUserId }) => {
  const [feed, setFeed] = useState<ActivityEntry[]>([]);
  const [newestId, setNewestId] = useState<string | null>(null);
  const prevCountRef = useRef(0);

  const chalMap = useMemo(
    () => Object.fromEntries(challenges.map(c => [c.id, c])),
    [challenges],
  );

  const load = useCallback(() => {
    apiRequest('/api/stats/activity?limit=20')
      .then(d => {
        const incoming: ActivityEntry[] = d.activity || [];
        setFeed(prev => {
          if (incoming.length > prevCountRef.current) {
            const newest = incoming[0];
            setNewestId(newest ? `${newest.userId}-${newest.solvedAt}` : null);
          }
          prevCountRef.current = incoming.length;
          return incoming;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, [load]);

  if (feed.length === 0) return null;

  const doubled = [...feed, ...feed];

  return (
    <div className="af-strip">
      <div className="af-label">
        <span className="af-pulse" />
        <span className="af-label-text">LIVE NET</span>
      </div>
      <div className="af-ticker">
        <div className="af-ticker-inner">
          {doubled.map((entry, i) => {
            const ch = chalMap[entry.challengeId];
            const isMe = entry.userId === currentUserId;
            const catColor = ch ? (CAT_COLORS[ch.category] || 'var(--red)') : 'var(--red)';
            const catIcon = ch ? (CAT_ICONS[ch.category] || '□') : '□';
            const verb = verbFor(entry.userId, entry.challengeId);
            const hexAddr = toHexAddr(entry.userId);
            const isNew = `${entry.userId}-${entry.solvedAt}` === newestId && i < feed.length;

            return (
              <div key={i} className={`af-item ${isMe ? 'af-me' : ''} ${isNew ? 'af-item-new' : ''}`}>
                <span className="af-item-dot" style={{ background: catColor }} />
                <span className="af-hex-addr">{hexAddr}</span>
                <span className="af-item-user" style={{ color: isMe ? '#00ff41' : 'rgba(255,255,255,.75)' }}>
                  {entry.userId}
                </span>
                <span className={`af-item-verb ${verb !== 'captured' ? 'af-item-verb-hot' : ''}`}>{verb}</span>
                <span className="af-item-cat-icon" style={{ color: catColor }}>{catIcon}</span>
                <span className="af-item-chal" style={{ color: catColor }}>
                  {ch ? ch.title : entry.challengeId}
                </span>
                <span className="af-item-pts">+{entry.pointsEarned}</span>
                <span className="af-item-sep">·</span>
                <span className="af-item-time">{timeAgo(entry.solvedAt)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
