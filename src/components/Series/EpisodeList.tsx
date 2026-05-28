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

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes, arc, onShowChallenge, loading, error,
}) => {
  if (loading) return <div className="empty-state">SYNCING BACKEND DATA...</div>;
  if (error) return <div className="empty-state">BACKEND ERROR // {error}</div>;
  if (episodes.length === 0) return <div className="empty-state">NO EPISODES FOUND FOR THIS ARC</div>;

  return (
    <div className="ep-list">
      {episodes.map((ep) => {
        const epImg = getEpisodeImage(ep.id);
        return (
          <div
            className={`epr ${ep.done ? 'done' : ''} ${ep.locked ? 'locked' : ''}`}
            onClick={ep.locked ? undefined : () => onShowChallenge(ep)}
            key={ep.id}
          >
            <div className="ep-n2">{String(ep.n).padStart(2, '0')}</div>
            <div className="ep-thumb2" style={{ background: ep.bg || arc?.bgColor || '#0a0a1a', position: 'relative', overflow: 'hidden' }}>
              {epImg ? (
                <>
                  <img src={epImg} alt={ep.title} className="ep-thumb-img" />
                  <div className="ep-thumb-glitch-lines"></div>
                </>
              ) : (
                <pre style={{ margin: 0, font: 'inherit', color: 'inherit' }}>{ep.art || ''}</pre>
              )}
              {ep.locked ? <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '0.55rem', zIndex: 3 }}>🔒 LOCKED</div> : ''}
            </div>
            <div className="ep-info2">
              <div className="ep-title2">
                {ep.title}
                {ep.type === 'ctf' ? <span className="tp tp-ctf">CTF</span>
                  : ep.type === 'research' ? <span className="tp tp-res">RESEARCH</span>
                  : <span className="tp tp-quiz">QUIZ</span>}
                {ep.active && <span className="new-tag">NEW</span>}
                {ep.done && <span style={{ color: 'var(--crt)', fontSize: '.7rem', marginLeft: '6px' }}>✓</span>}
              </div>
              <div className="ep-desc2">{ep.description}</div>
              <div className="ep-meta2">
                <span>⏱ {ep.min} MIN</span>
                <span className="xp2">⚡ {ep.xp} XP</span>
                {ep.done && <span className="done-tag">COMPLETED</span>}
                {ep.locked && <span>🔒 COMPLETE PREV EPISODE</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
