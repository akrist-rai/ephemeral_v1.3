import React, { useState } from 'react';
import type { Arc } from '../../types';
import { getArcCover } from '../../lib/imageMapping';
import { playSound } from '../../lib/sound';
import { TextScramble } from '../Effects/TextScramble';
import { PointerGlow } from '../Effects/PointerGlow';

interface ManifestProps {
  arcs: Arc[];
  onShowSeries: () => void;
}

export const Manifest: React.FC<ManifestProps> = ({ arcs, onShowSeries }) => {
  const [active, setActive] = useState<number | null>(null);
  if (arcs.length === 0) return null;

  const selectedArc = arcs.find(a => a.id === active) || null;

  const handleRowClick = (arcId: number) => {
    playSound.click();
    setActive(active === arcId ? null : arcId);
  };

  const handleRowHover = (arcId: number) => {
    playSound.hover();
    setActive(arcId);
  };

  const handleButtonClick = (action: () => void) => {
    playSound.click();
    action();
  };

  return (
    <div className="mf-sect">
      <div className="sect-hdr">
        <div className="sect-ttl">SERIES MANIFEST</div>
        <div className="sect-id">// DOMAIN_INDEX</div>
        <div className="sect-count">{String(arcs.length).padStart(2, '0')} ACTIVE DOMAINS</div>
        <div className="sect-more" onClick={() => handleButtonClick(onShowSeries)}>BROWSE ALL →</div>
      </div>
      <div className="sect-div" />

      <div className="mf-layout">
        {/* Left: Arc stack */}
        <div className="mf-stack">
          {arcs.map((arc) => {
            const img = getArcCover(arc.id);
            const isActive = active === arc.id;
            return (
              <div
                key={arc.id}
                className={`mf-row ${isActive ? 'mf-row-active' : ''}`}
                style={{ '--mf-acc': arc.accColor } as any}
                onClick={() => handleRowClick(arc.id)}
                onMouseEnter={() => handleRowHover(arc.id)}
              >
                {/* Thumbnail */}
                <div className="mf-row-thumb">
                  <img src={img} alt={arc.title} className="mf-thumb-img"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <div className="mf-thumb-scan" />
                </div>

                {/* Info */}
                <div className="mf-row-info">
                  <div className="mf-row-vol" style={{ color: arc.accColor }}>
                    VOL.{String(arc.id).padStart(2, '0')}
                  </div>
                  <div className="mf-row-title">{arc.title}</div>
                  <div className="mf-row-domain" style={{ color: `${arc.accColor}99` }}>{arc.domain}</div>
                </div>

                {/* Progress bar on right */}
                <div className="mf-row-prog">
                  <div className="mf-prog-track">
                    <div className="mf-prog-fill" style={{ width: arc.progressWidth || '0%', background: arc.accColor }} />
                  </div>
                  <span className="mf-prog-pct" style={{ color: arc.accColor }}>{arc.progressWidth || '0%'}</span>
                </div>

                {/* Active indicator */}
                <div className="mf-row-chevron" style={{ color: arc.accColor }}>›</div>
                {isActive && <div className="mf-row-bar" style={{ background: arc.accColor }} />}
              </div>
            );
          })}
        </div>

        {/* Right: Featured art */}
        <div className="mf-feature">
          {arcs.map((arc) => {
            const img = getArcCover(arc.id);
            const isActive = active === arc.id;
            return (
              <div key={arc.id} className={`mf-feature-panel ${isActive ? 'mf-fp-active' : ''}`}>
                <img src={img} alt={arc.title} className="mf-feature-img"
                  onError={e => { e.currentTarget.style.display = 'none'; }} />
                <div className="mf-feature-grad" style={{ background: `linear-gradient(135deg, ${arc.bgColor || '#06060e'} 0%, transparent 60%, ${arc.bgColor || '#06060e'}cc 100%)` }} />
                <div className="mf-feature-scan" />

                <div className="mf-feature-body">
                  <div className="mf-feat-vol" style={{ color: arc.accColor }}>VOL.{String(arc.id).padStart(2, '0')}</div>
                  <div className="mf-feat-title">
                    <TextScramble text={arc.title} triggerOnHover speed={30} />
                  </div>
                  <div className="mf-feat-sub" style={{ color: `${arc.accColor}bb` }}>{arc.arcName}</div>
                  <div className="mf-feat-domain">{arc.domain}</div>
                  <button
                    className="mf-feat-btn"
                    style={{ borderColor: arc.accColor, color: arc.accColor, boxShadow: `0 0 20px ${arc.accColor}33` }}
                    onClick={() => handleButtonClick(onShowSeries)}
                    onMouseEnter={() => playSound.hover()}
                  >
                    ENTER SERIES →
                  </button>
                </div>

                <div className="hc tl" style={{ borderColor: arc.accColor }} />
                <div className="hc br" style={{ borderColor: arc.accColor }} />
              </div>
            );
          })}

          {/* Default state: no selection */}
          {active === null && (
            <div className="mf-feature-default">
              <div className="mf-default-text">SELECT A VOLUME</div>
              <div className="mf-default-sub">Hover a row to preview</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
