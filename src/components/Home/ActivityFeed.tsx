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
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CAT_COLORS: Record<string, string> = {
  GRADIENT: '#4fc3f7', ARCHITECTURE: '#f9a825', INFERENCE: '#e8000d',
  'DATA LEAK': '#ff6b35', TRAINING: '#ab47bc', NLP: '#26c6da',
  OVERFITTING: '#ef5350', SYSTEMS: '#66bb6a', CRYPTO: '#ffd54f',
  ALGORITHMS: '#80cbc4', FAIRNESS: '#ce93d8',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ challenges, currentUserId }) => {
  const [feed, setFeed] = useState<ActivityEntry[]>([]);
  const chalMap = useMemo(
    () => Object.fromEntries(challenges.map(c => [c.id, c])),
    [challenges],
  );

  const load = useCallback(() => {
    apiRequest('/api/stats/activity?limit=20')
      .then(d => setFeed(d.activity || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, [load]);

  if (feed.length === 0) return null;

  return (
    <div className="af-strip">
      <div className="af-label">
        <span className="af-pulse" />
        <span>LIVE NETWORK ACTIVITY</span>
      </div>
      <div className="af-ticker">
        <div className="af-ticker-inner">
          {[...feed, ...feed].map((entry, i) => {
            const ch = chalMap[entry.challengeId];
            const isMe = entry.userId === currentUserId;
            const catColor = ch ? (CAT_COLORS[ch.category] || '#fff') : '#e8000d';
            return (
              <div key={i} className={`af-item ${isMe ? 'af-me' : ''}`}>
                <span className="af-item-dot" style={{ background: catColor }} />
                <span className="af-item-user" style={{ color: isMe ? '#00ff41' : 'rgba(255,255,255,.7)' }}>
                  {entry.userId}
                </span>
                <span className="af-item-verb"> captured </span>
                <span className="af-item-chal" style={{ color: catColor }}>
                  {ch ? ch.title : entry.challengeId}
                </span>
                <span className="af-item-pts" style={{ color: '#b9ff00' }}>+{entry.pointsEarned}pts</span>
                <span className="af-item-time">{timeAgo(entry.solvedAt)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
