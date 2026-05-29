import React, { useEffect, useState, useRef } from 'react';
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
  const [visible, setVisible] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const chalMap = Object.fromEntries(challenges.map(c => [c.id, c]));

  const load = () => {
    apiRequest('/api/stats/activity?limit=30')
      .then(d => setFeed(d.activity || []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, []);

  if (feed.length === 0) return null;

  return (
    <div className="activity-feed-wrap">
      <div className="activity-feed-hdr" onClick={() => setVisible(v => !v)}>
        <div className="activity-pulse" />
        <span className="activity-title">LIVE ACTIVITY FEED</span>
        <span className="activity-count">{feed.length} RECENT SOLVES</span>
        <span className="activity-toggle">{visible ? '▲' : '▼'}</span>
      </div>
      {visible && (
        <div className="activity-feed-list" ref={feedRef}>
          {feed.map((entry, i) => {
            const ch = chalMap[entry.challengeId];
            const isMe = entry.userId === currentUserId;
            const catColor = ch ? (CAT_COLORS[ch.category] || '#fff') : '#fff';
            return (
              <div key={i} className={`activity-item ${isMe ? 'activity-me' : ''}`}>
                <div className="activity-avatar" style={{ borderColor: isMe ? '#00ff41' : `${catColor}55`, color: isMe ? '#00ff41' : catColor }}>
                  {entry.userId.slice(0, 2)}
                </div>
                <div className="activity-body">
                  <span className="activity-user" style={{ color: isMe ? '#00ff41' : '#fff' }}>{entry.userId}</span>
                  <span className="activity-verb"> captured </span>
                  <span className="activity-chal" style={{ color: catColor }}>
                    {ch ? ch.title : entry.challengeId}
                  </span>
                  {ch && <span className="activity-pts" style={{ color: catColor }}>+{entry.pointsEarned} pts</span>}
                </div>
                <div className="activity-time">{timeAgo(entry.solvedAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
