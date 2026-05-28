import React from 'react';
import type { Arc, Episode } from '../../types';
import { getEpisodeImage, getArcCover } from '../../lib/imageMapping';

interface TransmissionsProps {
  episodes: (Episode & { arc?: Arc })[];
  arcs: Arc[];
  onNavigate: (path: string) => void;
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  ctf: { bg: '#00c85a', text: '#000' },
  research: { bg: '#e8000d', text: '#fff' },
  quiz: { bg: '#9b5fff', text: '#fff' },
};

export const Transmissions: React.FC<TransmissionsProps> = ({ episodes, arcs, onNavigate }) => {
  if (episodes.length === 0) return null;
  return (
    <div className="transmissions-sect">
      <div className="sect-hdr">
        <div className="sect-ttl">TRANSMISSIONS</div>
        <div className="sect-id">// EPISODES</div>
        <div className="sect-count">{episodes.filter(e => e.active).length > 0 ? 'ACTIVE NOW' : `${episodes.length} AVAILABLE`}</div>
        <div className="sect-more" onClick={() => onNavigate('/series')}>ALL EPISODES →</div>
      </div>
      <div className="sect-div" />
      <div className="tx-grid">
        {episodes.map((ep) => {
          const arc = ep.arc || arcs.find(a => a.id === ep.arcId);
          const acc = arc?.accColor || '#e8000d';
          const typeStyle = TYPE_COLORS[ep.type] || TYPE_COLORS.ctf;
          const img = getEpisodeImage(ep.id) || getArcCover(ep.arcId);
          return (
            <div className="tx-card" key={ep.id} onClick={() => onNavigate(`/episode/${ep.arcId}/${ep.id}`)}>
              {img && <img src={img} alt={ep.title} className="tx-card-img" onError={e => { e.currentTarget.style.display = 'none'; }} />}
              <div className="tx-card-overlay" style={{ background: `linear-gradient(0deg, ${arc?.bgColor || '#06060e'} 0%, rgba(6,6,14,0.2) 100%)` }} />
              <div className="tx-type-tag" style={{ background: typeStyle.bg, color: typeStyle.text }}>
                {ep.type.toUpperCase()}{ep.active && ' ◉ LIVE'}
              </div>
              <div className="tx-card-body">
                <div className="tx-card-id" style={{ color: acc }}>{ep.id}</div>
                <div className="tx-card-title">{ep.title}</div>
                <div className="tx-card-meta">
                  <span style={{ color: '#b9ff00' }}>⚡ {ep.xp} XP</span>
                  <span style={{ color: acc }}>{arc?.arcName || ''}</span>
                </div>
              </div>
              <div className="hc sm tl" style={{ borderColor: acc }} />
              <div className="hc sm br" style={{ borderColor: acc }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
