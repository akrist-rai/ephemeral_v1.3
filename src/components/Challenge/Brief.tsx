import React from 'react';
import type { Arc, Episode } from '../../types';

interface BriefProps {
  episode: Episode | null;
  arc: Arc | null;
  onStartResources: () => void;
}

export const Brief: React.FC<BriefProps> = ({ episode, arc, onStartResources }) => {
  if (!episode) return <div className="tpane on"><div className="empty-state">EPISODE DATA NOT FOUND</div></div>;

  const acc = arc?.accColor || '#e8000d';

  return (
    <div className="tpane on">
      <div className="mommy" style={{ position: 'relative', borderColor: acc }}>
        <div className="hc sm tl" style={{ borderColor: acc }}></div>
        <div className="hc sm br" style={{ borderColor: acc }}></div>
        <div className="mommy-k" style={{ color: acc }}>// THE EPISODE</div>
        <div className="mommy-q">{episode.title}</div>
      </div>
      <div className="bk">// DESCRIPTION</div>
      <div className="bp">{episode.description}</div>
      <div className="bk">// DETAILS</div>
      <div className="obj-list">
        <div className="obj">
          <div className="obj-box" style={{ borderColor: acc, color: acc }}>⏱</div>
          <span>Estimated time: {episode.min} minutes</span>
        </div>
        <div className="obj">
          <div className="obj-box" style={{ borderColor: acc, color: acc }}>⚡</div>
          <span>XP reward: {episode.xp} points</span>
        </div>
        <div className="obj">
          <div className="obj-box" style={{ borderColor: acc, color: acc }}>◈</div>
          <span>Type: {episode.type.toUpperCase()}</span>
        </div>
        <div className="obj">
          <div className={`obj-box ${episode.done ? 'ok' : ''}`}>{episode.done ? '✓' : '○'}</div>
          <span>Status: {episode.done ? 'COMPLETED' : episode.active ? 'ACTIVE — IN PROGRESS' : episode.locked ? 'LOCKED' : 'AVAILABLE'}</span>
        </div>
      </div>
      <div className="bk">// DOMAIN</div>
      <div className="bp">{arc?.domain || 'Unknown'} — {arc?.arcName || arc?.title || 'Unknown Arc'}</div>
      <button className="btn-r" style={{ marginTop: '.5rem', background: acc }} onClick={onStartResources}>START WITH RESOURCES</button>
    </div>
  );
};
