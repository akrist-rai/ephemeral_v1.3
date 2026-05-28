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
    <div className="sect">
      <div className="sect-hdr">
        <div className="sect-ttl">SERIES MANIFEST</div>
        <div className="sect-id">// DOMAIN_INDEX</div>
        <div className="sect-count">{String(arcs.length).padStart(2, '0')} ACTIVE SERIES</div>
        <div className="sect-more" onClick={onShowSeries}>BROWSE ALL →</div>
      </div>
      <div className="sect-div"></div>
      <div className="vol-row">
        {arcs.map((arc) => {
          const coverImg = getArcCover(arc.id);
          return (
            <div className="vc" onClick={onShowSeries} key={arc.id}>
              <div className="vc-spine" style={{ '--acc': arc.accColor } as any}>
                <div className="vc-top" style={{ background: arc.accColor || '#e8000d' }}>
                  <span className="vc-top-name">{arc.title}</span>
                  <span className="vc-top-num">VOL{arc.id}</span>
                </div>
                <div className="vc-art" style={{ background: arc.bgColor || '#0a0a1a', padding: coverImg ? 0 : '.5rem .3rem' }}>
                  <div className="dith"></div>
                  {coverImg ? (
                    <>
                      <img src={coverImg} alt={arc.title} className="vc-art-img" />
                      <div className="vc-art-scanlines"></div>
                    </>
                  ) : (
                    <pre className="vc-ascii">{arc.asciiArt}</pre>
                  )}
                </div>
                <div className="vc-bottom" style={{ '--acc': arc.accColor } as any}>
                  <div className="vc-domain" style={{ color: arc.accColor || '#e8000d' }}>{arc.domain}</div>
                  <div className="vc-arc">{arc.arcName}</div>
                  <div className="vc-prog">
                    <div className="vc-pf" style={{ background: arc.accColor || '#e8000d', width: arc.progressWidth || '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
