import React, { useState } from 'react';
import type { Arc } from '../../types';
import { getArcCover } from '../../lib/imageMapping';

interface ManifestProps {
  arcs: Arc[];
  onShowSeries: () => void;
}

export const Manifest: React.FC<ManifestProps> = ({ arcs, onShowSeries }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  if (arcs.length === 0) return null;

  return (
    <div className="manifest-sect">
      <div className="sect-hdr">
        <div className="sect-ttl">SERIES MANIFEST</div>
        <div className="sect-id">// DOMAIN_INDEX</div>
        <div className="sect-count">{String(arcs.length).padStart(2, '0')} ACTIVE DOMAINS</div>
        <div className="sect-more" onClick={onShowSeries}>BROWSE ALL →</div>
      </div>
      <div className="sect-div" />

      <div className="arc-img-grid">
        {arcs.map((arc) => {
          const img = getArcCover(arc.id);
          const isHov = hovered === arc.id;
          return (
            <div
              className={`arc-img-card ${isHov ? 'arc-hov' : ''}`}
              key={arc.id}
              onClick={onShowSeries}
              onMouseEnter={() => setHovered(arc.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--acc': arc.accColor } as any}
            >
              {img
                ? <img src={img} alt={arc.title} className="arc-img-card-bg"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                : <div className="arc-img-card-bg" style={{ background: arc.bgColor || '#111' }} />
              }
              {/* scan overlay */}
              <div className="arc-card-scan" />
              {/* gradient */}
              <div className="arc-img-card-overlay"
                style={{ background: `linear-gradient(0deg, ${arc.bgColor || '#06060e'}f0 0%, ${arc.bgColor || '#06060e'}44 55%, transparent 100%)` }} />

              {/* hover info panel */}
              <div className={`arc-hover-panel ${isHov ? 'on' : ''}`}>
                <div className="arc-hp-domain" style={{ color: arc.accColor }}>{arc.domain}</div>
                <div className="arc-hp-arc">{arc.arcName}</div>
                <div className="arc-hp-prog-wrap">
                  <div className="arc-hp-prog-bar">
                    <div className="arc-hp-prog-fill" style={{ background: arc.accColor, width: arc.progressWidth || '0%' }} />
                  </div>
                  <span className="arc-hp-prog-label">{arc.progressWidth || '0%'}</span>
                </div>
                <div className="arc-hp-enter" style={{ color: arc.accColor }}>ENTER →</div>
              </div>

              {/* always-visible bottom strip */}
              <div className="arc-img-card-content">
                <div className="arc-img-vol" style={{ color: arc.accColor }}>VOL.{String(arc.id).padStart(2, '0')}</div>
                <div className="arc-img-domain" style={{ color: arc.accColor }}>{arc.domain}</div>
                <div className="arc-img-title">{arc.title}</div>
              </div>

              {/* top badge */}
              <div className="arc-card-top-badge" style={{ background: arc.accColor, color: arc.accColor === '#f9a825' || arc.accColor === '#b9ff00' ? '#000' : '#fff' }}>
                V{arc.id}
              </div>

              <div className="hc sm tl" style={{ borderColor: arc.accColor }} />
              <div className="hc sm br" style={{ borderColor: arc.accColor }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
