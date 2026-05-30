import React, { useState } from 'react';
import type { Arc, Episode } from '../../types';
import { getEpisodeImage, getArcCover } from '../../lib/imageMapping';

interface TransmissionsProps {
  episodes: (Episode & { arc?: Arc })[];
  arcs: Arc[];
  onNavigate: (path: string) => void;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  ctf:      { label: 'CTF',      color: '#000', bg: '#00c85a' },
  research: { label: 'RESEARCH', color: '#fff', bg: '#e8000d' },
  quiz:     { label: 'QUIZ',     color: '#fff', bg: '#9b5fff' },
};

export const Transmissions: React.FC<TransmissionsProps> = ({ episodes, arcs, onNavigate }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  if (episodes.length === 0) return null;

  const activeCount = episodes.filter(e => e.active).length;

  return (
    <div className="tx-sect">
      <div className="sect-hdr">
        <div className="sect-ttl">TRANSMISSIONS</div>
        <div className="sect-id">// EPISODES</div>
        <div className="tx-active-badge">
          {activeCount > 0
            ? <><span className="tx-ab-dot" />ACTIVE NOW</>
            : `${episodes.length} AVAILABLE`
          }
        </div>
        <div className="sect-more" onClick={() => onNavigate('/series')}>ALL EPISODES →</div>
      </div>
      <div className="sect-div" />

      <div className="tx-grid">
        {episodes.map((ep, idx) => {
          const arc = ep.arc || arcs.find(a => a.id === ep.arcId);
          const acc = arc?.accColor || '#e8000d';
          const tm = TYPE_META[ep.type] || TYPE_META.ctf;
          const img = getEpisodeImage(ep.id) || getArcCover(ep.arcId);
          const isHov = hovered === ep.id;

          return (
            <div
              key={ep.id}
              className={`tx-card ${isHov ? 'tx-hov' : ''}`}
              onClick={() => onNavigate(`/episode/${ep.arcId}/${ep.id}`)}
              onMouseEnter={() => setHovered(ep.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--tx-acc': acc } as any}
            >
              {/* Image */}
              <div className="tx-img-wrap">
                {img
                  ? <img src={img} alt={ep.title} className="tx-img"
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  : <div className="tx-img-placeholder" style={{ background: arc?.bgColor || '#111' }} />
                }
                <div className="tx-img-overlay" style={{ background: `linear-gradient(0deg, ${arc?.bgColor || '#06060e'}ee 0%, rgba(6,6,14,.1) 100%)` }} />
                <div className="tx-img-scan" />

                {/* Card index */}
                <div className="tx-card-idx">{String(idx + 1).padStart(2, '0')}</div>

                {/* Type tag */}
                <div className="tx-type-tag" style={{ background: tm.bg, color: tm.color }}>
                  {tm.label}{ep.active && <span className="tx-live-dot"> ◉</span>}
                </div>

                {/* XP badge */}
                <div className="tx-xp-badge">⚡ {ep.xp} XP</div>
              </div>

              {/* Card body */}
              <div className="tx-body">
                <div className="tx-arc-id" style={{ color: acc }}>{ep.id}</div>
                <div className="tx-title">{ep.title}</div>
                <div className="tx-meta">
                  <span className="tx-arc-name" style={{ color: `${acc}aa` }}>{arc?.arcName || ''}</span>
                  <span className="tx-ep-num">EP {ep.n}</span>
                </div>
              </div>

              {/* HUD corners */}
              <div className="hc sm tl" style={{ borderColor: acc }} />
              <div className="hc sm br" style={{ borderColor: acc }} />

              {/* Active indicator bar */}
              {ep.active && <div className="tx-active-bar" style={{ background: acc }} />}

              {/* Bottom accent line */}
              <div className="tx-bottom-bar" style={{ background: `linear-gradient(90deg, ${acc}44, transparent)` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
