import React from 'react';
import type { Arc, Episode } from '../../types';
import { getEpisodeImage } from '../../lib/imageMapping';

interface EpisodeListProps {
  episodes: Episode[];
  arc: Arc | null;
  onShowChallenge: (ep: Episode) => void;
  loading: boolean;
  error: string | null;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, arc, onShowChallenge, loading, error }) => {
  if (loading) return <div className="empty-state">SYNCING BACKEND DATA...</div>;
  if (error) return <div className="empty-state">BACKEND ERROR // {error}</div>;
  if (episodes.length === 0) return <div className="empty-state">NO EPISODES FOUND FOR THIS ARC</div>;

  const acc = arc?.accColor || '#e8000d';

  return (
    <div className="ep-img-list">
      {episodes.map((ep) => {
        const img = getEpisodeImage(ep.id);
        const typeColors: Record<string, string> = { ctf: '#e8000d', research: '#b9ff00', quiz: '#9b5fff' };
        const tColor = typeColors[ep.type] || '#e8000d';
        return (
          <div
            className={`ep-img-row ${ep.done ? 'ep-done' : ''} ${ep.locked ? 'ep-locked' : ''}`}
            key={ep.id}
            onClick={ep.locked ? undefined : () => onShowChallenge(ep)}
          >
            {/* Image fills entire left panel */}
            <div className="ep-img-panel">
              {img
                ? <img src={img} alt={ep.title} className="ep-img-fill" onError={e => { e.currentTarget.style.display='none'; }} />
                : <div className="ep-img-fill" style={{ background: ep.bg || arc?.bgColor || '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <pre style={{ color: acc, fontSize: '.38rem', fontFamily: 'var(--mono)', textAlign: 'center' }}>{ep.art || ''}</pre>
                  </div>
              }
              <div className="ep-img-panel-overlay" />
              <div className="ep-num-badge">{String(ep.n).padStart(2, '0')}</div>
              {ep.locked && <div className="ep-locked-cover">🔒 LOCKED</div>}
            </div>

            {/* Info panel */}
            <div className="ep-img-info">
              <div className="ep-img-tags">
                <span className="ep-type-tag" style={{ background: tColor + '22', color: tColor, border: `1px solid ${tColor}44` }}>{ep.type.toUpperCase()}</span>
                {ep.active && <span className="ep-live-tag">◉ NEW</span>}
                {ep.done && <span className="ep-done-tag">✓ DONE</span>}
              </div>
              <div className="ep-img-title">{ep.title}</div>
              <div className="ep-img-desc">{ep.description}</div>
              <div className="ep-img-meta">
                <span>⏱ {ep.min} MIN</span>
                <span style={{ color: '#b9ff00' }}>⚡ {ep.xp} XP</span>
              </div>
            </div>

            {/* Accent bar */}
            <div className="ep-acc-line" style={{ background: ep.done ? '#00ff41' : acc }} />
          </div>
        );
      })}
    </div>
  );
};
