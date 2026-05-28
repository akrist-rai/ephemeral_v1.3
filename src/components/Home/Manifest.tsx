import React from 'react';
import type { Arc } from '../../types';
import { getArcCover } from '../../lib/imageMapping';

interface ManifestProps {
  arcs: Arc[];
  onShowSeries: () => void;
}

export const Manifest: React.FC<ManifestProps> = ({ arcs, onShowSeries }) => {
  if (arcs.length === 0) return null;
  return (
    <div className="manifest-sect">
      <div className="sect-hdr">
        <div className="sect-ttl">SERIES MANIFEST</div>
        <div className="sect-id">// DOMAIN_INDEX</div>
        <div className="sect-count">{String(arcs.length).padStart(2, '0')} ACTIVE SERIES</div>
        <div className="sect-more" onClick={onShowSeries}>BROWSE ALL →</div>
      </div>
      <div className="sect-div" />
      <div className="arc-img-grid">
        {arcs.map((arc) => {
          const img = getArcCover(arc.id);
          return (
            <div className="arc-img-card" key={arc.id} onClick={onShowSeries}
              style={{ '--acc': arc.accColor } as any}>
              {img
                ? <img src={img} alt={arc.title} className="arc-img-card-bg" onError={e => { e.currentTarget.style.display = 'none'; }} />
                : <div className="arc-img-card-bg" style={{ background: arc.bgColor || '#111' }} />
              }
              <div className="arc-img-card-overlay" style={{ background: `linear-gradient(0deg, ${arc.bgColor || '#06060e'} 0%, rgba(0,0,0,0.15) 100%)` }} />
              <div className="arc-img-card-content">
                <div className="arc-img-vol" style={{ color: arc.accColor }}>V{arc.id}</div>
                <div className="arc-img-domain" style={{ color: arc.accColor }}>{arc.domain}</div>
                <div className="arc-img-title">{arc.title}</div>
                <div className="arc-img-arc">{arc.arcName}</div>
                <div className="arc-img-prog">
                  <div className="arc-img-prog-fill" style={{ background: arc.accColor, width: arc.progressWidth || '0%' }} />
                </div>
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
