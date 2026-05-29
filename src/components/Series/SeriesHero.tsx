import React from 'react';
import type { Arc, Episode } from '../../types';

interface SeriesHeroProps {
  arc: Arc | null;
  episodes: Episode[];
  onBack: () => void;
  arcCoverUrl?: string;
  onChangeCover?: () => void;
}

export const SeriesHero: React.FC<SeriesHeroProps> = ({ arc, episodes, onBack, arcCoverUrl, onChangeCover }) => {
  if (!arc) return null;
  const acc = arc.accColor || '#00c85a';
  const domain = arc.domain || '';
  const title = arc.title || '';
  const doneCount = episodes.filter(e => e.done).length;
  const pct = episodes.length > 0 ? Math.round((doneCount / episodes.length) * 100) : 0;
  const totalXp = episodes.reduce((s, e) => s + e.xp, 0);
  const difficulty = episodes.length > 0
    ? (episodes.reduce((s, e) => s + e.xp, 0) / episodes.length > 150 ? 'ADVANCED' : 'INTERMEDIATE')
    : 'BEGINNER';
  const typeSet = [...new Set(episodes.map(e => e.type.toUpperCase()))];
  const img = arcCoverUrl || '';

  return (
    <div className="sh-full">
      {/* Background art */}
      {img && (
        <img src={img} alt={title} className="sh-full-bg"
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      )}
      {/* Gradient overlays */}
      <div className="sh-full-grad-l" style={{ background: `linear-gradient(90deg, ${arc.bgColor || '#06060e'}f5 0%, ${arc.bgColor || '#06060e'}99 50%, transparent 100%)` }} />
      <div className="sh-full-grad-b" style={{ background: `linear-gradient(0deg, ${arc.bgColor || '#06060e'} 0%, transparent 60%)` }} />
      <div className="sh-full-scanlines" />

      {/* HUD corners */}
      <div className="hc tl" style={{ borderColor: acc }} />
      <div className="hc br" style={{ borderColor: acc }} />

      {/* Content */}
      <div className="sh-full-body">
        {/* Arc volume badge */}
        <div className="sh-vol-badge" style={{ background: `${acc}22`, borderColor: `${acc}55`, color: acc }}>
          VOL.{String(arc.id).padStart(2, '0')} · {domain}
        </div>

        <h1 className="sh-full-title">{title}</h1>

        {arc.arcName && (
          <div className="sh-full-subtitle" style={{ color: `${acc}cc` }}>// {arc.arcName}</div>
        )}

        {/* Badges row */}
        <div className="sh-badge-row">
          <span className="sh-badge sh-badge-g" style={{ background: `${acc}22`, borderColor: `${acc}55`, color: acc }}>
            {pct}% COMPLETE
          </span>
          <span className="sh-badge sh-badge-r">{difficulty}</span>
          <span className="sh-badge sh-badge-d">{episodes.length} EPISODES</span>
          {typeSet.map(t => <span key={t} className="sh-badge sh-badge-d">{t}</span>)}
        </div>

        {/* XP + progress */}
        <div className="sh-xp-row">
          <div className="sh-xp-item">
            <span className="sh-xp-val" style={{ color: acc }}>{totalXp.toLocaleString()}</span>
            <span className="sh-xp-label">TOTAL XP</span>
          </div>
          <div className="sh-xp-div" />
          <div className="sh-xp-item">
            <span className="sh-xp-val" style={{ color: '#00ff41' }}>{doneCount}</span>
            <span className="sh-xp-label">COMPLETED</span>
          </div>
          <div className="sh-xp-div" />
          <div className="sh-xp-item">
            <span className="sh-xp-val">{episodes.length - doneCount}</span>
            <span className="sh-xp-label">REMAINING</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="sh-prog-wrap">
          <div className="sh-prog-track">
            <div className="sh-prog-fill" style={{ width: `${pct}%`, background: acc, boxShadow: `0 0 10px ${acc}88` }} />
          </div>
          <span className="sh-prog-label" style={{ color: acc }}>{pct}%</span>
        </div>

        {/* Actions */}
        <div className="sh-actions">
          {onChangeCover && (
            <button className="sh-cover-btn" style={{ borderColor: `${acc}44`, color: acc }} onClick={onChangeCover}>
              ⬡ CHANGE COVER
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
