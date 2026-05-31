import React, { useState } from 'react';
import type { Arc, Episode } from '../../types';
import { getEpisodeImage } from '../../lib/imageMapping';

interface EpisodeListProps {
  episodes: Episode[];
  arc: Arc | null;
  onShowChallenge: (ep: Episode) => void;
  loading: boolean;
  error: string | null;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  ctf:      { label: 'CTF',      color: '#000', bg: '#00c85a' },
  research: { label: 'RESEARCH', color: '#fff', bg: '#e8000d' },
  quiz:     { label: 'QUIZ',     color: '#fff', bg: '#9b5fff' },
};

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, arc, onShowChallenge, loading, error }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  if (loading) return (
    <div className="el-loading">
      <div className="el-loading-bar" />
      <span>SYNCING EPISODE DATA...</span>
    </div>
  );
  if (error)  return <div className="el-error">⚠ {error}</div>;
  if (episodes.length === 0) return <div className="el-empty">NO EPISODES IN THIS ARC</div>;

  const acc = arc?.accColor || '#e8000d';

  return (
    <div className="el-grid">
      {episodes.map((ep) => {
        const img = getEpisodeImage(ep.id);
        const tm = TYPE_META[ep.type] || TYPE_META.ctf;
        const isHov = hovered === ep.id;

        return (
          <div
            key={ep.id}
            className={`el-card ${ep.done ? 'el-done' : ''} ${ep.locked ? 'el-locked' : ''} ${isHov ? 'el-hov' : ''}`}
            style={{ '--el-acc': ep.done ? '#00ff41' : acc } as any}
            onClick={ep.locked ? undefined : () => onShowChallenge(ep)}
            onMouseEnter={() => !ep.locked && setHovered(ep.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Cover image */}
            <div className="el-cover">
              {img
                ? <img src={img} alt={ep.title} className="el-cover-img"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                : <div className="el-cover-placeholder" style={{ background: arc?.bgColor || '#0a0a14' }} />
              }
              <div className="el-cover-overlay" />
              <div className="el-cover-scan" />

              {/* Top badges */}
              <div className="el-cover-top">
                <span className="el-ep-num">EP {String(ep.n).padStart(2, '0')}</span>
                {ep.active && <span className="el-live-tag">◉ NEW</span>}
              </div>

              {/* Type pill */}
              <div className="el-type-pill" style={{ background: tm.bg, color: tm.color }}>
                {tm.label}
              </div>

              {/* Done overlay */}
              {ep.done && (
                <div className="el-done-overlay">
                  <span className="el-done-check">✓</span>
                  <span className="el-done-label">COMPLETED</span>
                </div>
              )}

              {/* Locked overlay */}
              {ep.locked && (
                <div className="el-locked-overlay">
                  <span>🔒</span>
                  <span>LOCKED</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="el-info">
              <div className="el-id-row">
                <span className="el-id" style={{ color: ep.done ? '#00ff41' : acc }}>{ep.id}</span>
                {arc?.domain && (
                  <span className="el-domain">{arc.domain}</span>
                )}
              </div>
              <div className="el-title">{ep.title}</div>
              <div className="el-desc">{ep.description?.slice(0, 100)}{ep.description?.length > 100 ? '…' : ''}</div>
              <div className="el-meta">
                <span className="el-xp" style={{ color: '#b9ff00' }}>⚡ {ep.xp} XP</span>
                <span className="el-time">⏱ {ep.min}m</span>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="el-accent-line" style={{ background: ep.done ? '#00ff41' : acc, boxShadow: `0 0 8px ${ep.done ? '#00ff41' : acc}66` }} />

            {/* HUD corners */}
            <div className="hc sm tl" style={{ borderColor: ep.done ? '#00ff41' : acc }} />
            <div className="hc sm br" style={{ borderColor: ep.done ? '#00ff41' : acc }} />
          </div>
        );
      })}
    </div>
  );
};
