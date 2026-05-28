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
    <div className="sect" style={{ paddingBottom: '2.5rem' }}>
      <div className="sect-hdr">
        <div className="sect-ttl">TRANSMISSIONS</div>
        <div className="sect-id">// EPISODES</div>
        <div className="sect-count">{episodes.filter(e => e.active).length > 0 ? 'ACTIVE NOW' : `${episodes.length} AVAILABLE`}</div>
        <div className="sect-more" onClick={() => onNavigate('/series')}>ALL EPISODES →</div>
      </div>
      <div className="sect-div"></div>
      <div className="ep-row">
        {episodes.map((ep) => {
          const arc = ep.arc || arcs.find(a => a.id === ep.arcId);
          const acc = arc?.accColor || '#e8000d';
          const typeStyle = TYPE_COLORS[ep.type] || TYPE_COLORS.ctf;
          const coverImg = getEpisodeImage(ep.id) || getArcCover(ep.arcId);

          return (
            <div
              className="ec"
              style={{ '--ep-acc': acc } as any}
              onClick={() => onNavigate(`/episode/${ep.arcId}/${ep.id}`)}
              key={ep.id}
            >
              <div className="hc sm tl"></div><div className="hc sm tr" style={{ borderColor: acc }}></div>
              <div className="hc sm bl" style={{ borderColor: acc }}></div><div className="hc sm br"></div>
              <div className="coord tl">{ep.id}</div>
              {/* Cover art header */}
              <div className="ec-cover-wrap">
                <img src={coverImg} alt={ep.title} className="ec-cover-img" />
                <div className="ec-cover-gradient" style={{ background: `linear-gradient(180deg, transparent 20%, ${arc?.bgColor || '#06060e'} 100%)` }}></div>
                <div className="ec-type-pill" style={{ background: typeStyle.bg, color: typeStyle.text }}>
                  {ep.type.toUpperCase()}
                  {ep.active && <span className="ec-live-dot">● LIVE</span>}
                </div>
                <div className="ec-cover-scanlines"></div>
              </div>
              <div className="ec-body">
                <div className="ec-ref">EP_ID: <span>{ep.id}</span></div>
                <div className="ec-title">{ep.title}</div>
                <div className="ec-desc">{ep.description}</div>
                <div className="ec-foot">
                  <span className="ec-xp">⚡ {ep.xp} XP</span>
                  <span className="ec-arc">{arc?.arcName || arc?.title || ''}</span>
                </div>
              </div>
              <div className="analyze">{ep.done ? 'COMPLETED' : ep.active ? 'ENTER' : 'ANALYZE'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
