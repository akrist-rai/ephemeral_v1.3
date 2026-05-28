import React, { useMemo } from 'react';
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
  const bg = arc.bgColor || '#000d05';
  const ascii = arc.asciiArt || '';
  const domain = arc.domain || '';
  const title = arc.title || '';

  const doneCount = episodes.filter(e => e.done).length;
  const totalCount = episodes.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const typeSet = [...new Set(episodes.map(e => e.type.toUpperCase()))];
  const seasonSet = [...new Set(episodes.map(e => `S${e.arcId}`))];
  const difficulty = episodes.length > 0 ? (episodes.reduce((s, e) => s + e.xp, 0) / episodes.length > 150 ? 'ADVANCED' : 'INTERMEDIATE') : 'BEGINNER';

  return (
    <div className="series-hero" style={{ background: `linear-gradient(135deg,${bg} 0%,${bg}dd 60%,#050005 100%)`, position: 'relative', overflow: 'hidden' }}>
      {arcCoverUrl && (
        <img src={arcCoverUrl} alt="Background cover" className="series-hero-img-bg" />
      )}
      <div className="hc tl" style={{ borderColor: acc, width: '20px', height: '20px' }}></div>
      <div className="hc br" style={{ borderColor: acc, width: '20px', height: '20px' }}></div>
      <div className="coord tl" style={{ color: `${acc}55` }}>SERIES_ID: {arc.title.toUpperCase().replace(/\s+/g, '_')}_v{arc.id}</div>
      
      <div className="series-hero-left-art">
        {arcCoverUrl ? (
          <div className="series-hero-art-cover">
            <img src={arcCoverUrl} alt="Volume Cover Art" />
            <button className="change-cover-hud-btn" onClick={onChangeCover} title="Select custom cover art">
              🖼 CHANGE COVER
            </button>
          </div>
        ) : (
          <div className="sh-left" style={{ background: acc, minHeight: '280px' }}>
            <div className="scan" style={{ opacity: .4 }}></div>
            <div className="hc tl" style={{ borderColor: '#fff', opacity: .3 }}></div>
            <div className="hc br" style={{ borderColor: '#fff', opacity: .3 }}></div>
            <pre className="sh-ascii" style={{ color: bg, fontSize: '.48rem' }}>{ascii}</pre>
          </div>
        )}
      </div>

      <div className="sh-content" style={{ zIndex: 5 }}>
        <div className="sh-domain" style={{ color: acc }}>{domain} · DOMAIN SERIES</div>
        <div className="sh-title">{title.split(' ').map((w, i) => <React.Fragment key={i}>{w}{i < title.split(' ').length - 1 ? <br/> : null}</React.Fragment>)}</div>
        <div className="sh-badges">
          <span className="badge badge-g">{pct}% COMPLETE</span>
          <span className="badge badge-r">{difficulty}</span>
          {seasonSet.length > 0 && <span className="badge badge-d">{seasonSet.length} SEASON{seasonSet.length !== 1 ? 'S' : ''}</span>}
          <span className="badge badge-d">{totalCount} EPISODE{totalCount !== 1 ? 'S' : ''}</span>
          {typeSet.length > 0 && <span className="badge badge-d">{typeSet.join(' · ')}</span>}
        </div>
        <div className="sh-desc">{arc.description || `Explore the ${domain} domain through ${totalCount} episodes.`}</div>
      </div>
    </div>
  );
};
