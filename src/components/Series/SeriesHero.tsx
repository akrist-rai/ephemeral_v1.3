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
  const difficulty = episodes.length > 0 ? (episodes.reduce((s, e) => s + e.xp, 0) / episodes.length > 150 ? 'ADVANCED' : 'INTERMEDIATE') : 'BEGINNER';
  const typeSet = [...new Set(episodes.map(e => e.type.toUpperCase()))];
  const img = arcCoverUrl || '';

  return (
    <div className="series-hero-full">
      {img && <img src={img} alt={title} className="series-hero-bg" onError={e => { e.currentTarget.style.display = 'none'; }} />}
      <div className="series-hero-overlay" style={{ background: `linear-gradient(90deg, ${arc.bgColor || '#000'}ee 0%, ${arc.bgColor || '#000'}99 50%, transparent 100%)` }} />
      <div className="series-hero-overlay-b" style={{ background: `linear-gradient(0deg, ${arc.bgColor || '#000'} 0%, transparent 60%)` }} />

      <div className="hc tl" style={{ borderColor: acc }} />
      <div className="hc br" style={{ borderColor: acc }} />
      <div className="coord tl" style={{ color: `${acc}66` }}>SERIES_ID: {title.toUpperCase().replace(/\s+/g, '_')}_v{arc.id}</div>

      <div className="sh-content-full">
        <div className="sh-domain" style={{ color: acc }}>{domain} · DOMAIN SERIES</div>
        <div className="sh-title-full">{title}</div>
        <div className="sh-badges">
          <span className="badge badge-g">{pct}% COMPLETE</span>
          <span className="badge badge-r">{difficulty}</span>
          <span className="badge badge-d">{episodes.length} EPISODES</span>
          {typeSet.map(t => <span key={t} className="badge badge-d">{t}</span>)}
        </div>
        <div style={{ display: 'flex', gap: '.7rem', marginTop: '.8rem', alignItems: 'center' }}>
          {onChangeCover && <button className="cover-mod-btn" onClick={onChangeCover}>⬡ CHANGE COVER</button>}
        </div>
      </div>
    </div>
  );
};
