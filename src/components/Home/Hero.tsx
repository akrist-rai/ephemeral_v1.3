import React, { useMemo } from 'react';
import type { Arc, Episode } from '../../types';
import { getArcCover } from '../../lib/imageMapping';

interface HeroProps {
  onPlay: () => void;
  onMoreInfo: () => void;
  featuredEpisode: Episode | null;
  featuredArc: Arc | null;
  totalEpisodes: number;
  totalDomains: number;
  arcCoverUrl?: string;
  onChangeCover?: () => void;
  arcs?: Arc[];
  onArcSelect?: (arcId: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlay, onMoreInfo, featuredEpisode, featuredArc,
  totalEpisodes, totalDomains, arcCoverUrl, onChangeCover,
  arcs = [], onArcSelect,
}) => {
  const acc = featuredArc?.accColor || '#e8000d';
  const domain = featuredArc?.domain || 'LOADING';
  const arcName = featuredArc?.arcName || '';
  const title = featuredArc?.title || 'LOADING';
  const epTitle = featuredEpisode?.title || '';
  const epDesc = featuredEpisode?.description || '';
  const epType = featuredEpisode?.type || 'ctf';
  const epXp = featuredEpisode?.xp || 0;
  const epN = featuredEpisode?.n || 0;
  const epId = featuredEpisode?.id || '';
  const bgUrl = arcCoverUrl || '';

  const typeLabel: Record<string, string> = { ctf: '⚡ CTF CHALLENGE', research: '📖 RESEARCH', quiz: '◈ QUIZ' };

  return (
    <div className="hero-fullbleed">
      {bgUrl && (
        <img src={bgUrl} alt="" className="hero-bg-img"
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      )}

      {/* Layered overlays */}
      <div className="hfb-grad-left" style={{ background: `linear-gradient(90deg, rgba(6,6,14,0.97) 0%, rgba(6,6,14,0.75) 45%, transparent 100%)` }} />
      <div className="hfb-grad-bot" style={{ background: `linear-gradient(0deg, rgba(6,6,14,1) 0%, rgba(6,6,14,0.5) 40%, transparent 100%)` }} />
      <div className="hfb-grad-top" style={{ background: `linear-gradient(180deg, rgba(6,6,14,0.6) 0%, transparent 30%)` }} />
      {/* Scanlines */}
      <div className="hfb-scan" />
      {/* Vignette */}
      <div className="hfb-vignette" />

      {/* HUD corners */}
      <div className="hc tl" style={{ borderColor: acc, width: '18px', height: '18px' }} />
      <div className="hc br" style={{ borderColor: acc, width: '18px', height: '18px' }} />
      <div className="hc tr" style={{ borderColor: 'rgba(255,255,255,0.12)', width: '14px', height: '14px' }} />
      <div className="hc bl" style={{ borderColor: 'rgba(255,255,255,0.12)', width: '14px', height: '14px' }} />

      {/* Top HUD strip */}
      <div className="hfb-top-hud">
        <div className="hfb-hud-item"><span className="hfb-hud-key">DOMAIN</span><span className="hfb-hud-val" style={{ color: acc }}>{domain}</span></div>
        <div className="hfb-hud-sep" />
        <div className="hfb-hud-item"><span className="hfb-hud-key">STATUS</span><span className="hfb-hud-val" style={{ color: featuredEpisode?.active ? '#00ff41' : '#fff' }}>{featuredEpisode?.active ? '◉ LIVE' : 'BROADCASTING'}</span></div>
        <div className="hfb-hud-sep" />
        <div className="hfb-hud-item"><span className="hfb-hud-key">NODE</span><span className="hfb-hud-val">{epId || '—'}</span></div>
        <div className="hfb-hud-sep" />
        <div className="hfb-hud-item"><span className="hfb-hud-key">TYPE</span><span className="hfb-hud-val" style={{ color: acc }}>{typeLabel[epType] || epType}</span></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          {onChangeCover && <button className="cover-mod-btn" onClick={onChangeCover}>⬡ COVER ART</button>}
        </div>
      </div>

      {/* Main content */}
      <div className="hfb-content">
        {/* Eyebrow */}
        <div className="hfb-eyebrow">
          {featuredEpisode?.active && <span className="pill-live" style={{ background: acc, color: acc === '#e8000d' ? '#fff' : '#000' }}>◉ NEW EP</span>}
          <span className="hfb-breadcrumb">{arcName} · EPISODE {epN}</span>
        </div>

        {/* Giant title */}
        <h1 className="hfb-title">
          {title}
        </h1>
        <div className="hfb-ep-subtitle" style={{ color: acc }}>
          // {epTitle}
        </div>

        {/* Description */}
        <p className="hfb-desc">{epDesc ? epDesc.slice(0, 180) + (epDesc.length > 180 ? '…' : '') : 'Loading transmission...'}</p>

        {/* XP badge */}
        <div className="hfb-xp-badge" style={{ borderColor: `${acc}66`, color: acc }}>
          ⚡ {epXp} XP REWARD
        </div>

        {/* CTA buttons */}
        <div className="hfb-btns">
          <button className="hfb-btn-primary" style={{ background: acc, color: acc === '#f9a825' || acc === '#b9ff00' ? '#000' : '#fff', boxShadow: `0 0 28px ${acc}55` }} onClick={onPlay}>
            ▶ PLAY EPISODE {epN}
          </button>
          <button className="hfb-btn-secondary" onClick={onMoreInfo}>BROWSE SERIES</button>
        </div>
      </div>

      {/* Arc filmstrip ribbon */}
      {arcs.length > 0 && (
        <div className="hfb-arc-ribbon">
          {arcs.map(arc => {
            const img = getArcCover(arc.id);
            const isActive = arc.id === featuredArc?.id;
            return (
              <div
                key={arc.id}
                className={`hfb-arc-chip ${isActive ? 'active' : ''}`}
                style={{ '--chip-acc': arc.accColor } as any}
                onClick={() => onArcSelect?.(arc.id)}
              >
                {img && <img src={img} alt={arc.title} className="hfb-arc-chip-img" onError={e => { e.currentTarget.style.display = 'none'; }} />}
                <div className="hfb-arc-chip-overlay" />
                <div className="hfb-arc-chip-label">
                  <span className="hfb-arc-chip-vol" style={{ color: arc.accColor }}>V{arc.id}</span>
                  <span className="hfb-arc-chip-name">{arc.title}</span>
                </div>
                {isActive && <div className="hfb-arc-chip-active-bar" style={{ background: arc.accColor }} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom stats bar */}
      <div className="hfb-stats">
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{totalEpisodes}</span><span className="hstat-l">EPISODES</span></div>
        <div className="hstat-div" />
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{totalDomains}</span><span className="hstat-l">DOMAINS</span></div>
        <div className="hstat-div" />
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{epXp}</span><span className="hstat-l">XP THIS EP</span></div>
        <div style={{ marginLeft: 'auto', fontSize: '.42rem', color: 'rgba(255,255,255,.25)', letterSpacing: '.14em', fontFamily: 'var(--mono)' }}>
          ACN_EPHEMERAL · NETWORK ACTIVE
        </div>
      </div>
    </div>
  );
};
