import React from 'react';
import type { Arc, Episode } from '../../types';

interface HeroProps {
  onPlay: () => void;
  onMoreInfo: () => void;
  featuredEpisode: Episode | null;
  featuredArc: Arc | null;
  totalEpisodes: number;
  totalDomains: number;
  arcCoverUrl?: string;
  onChangeCover?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlay, onMoreInfo, featuredEpisode, featuredArc, totalEpisodes, totalDomains, arcCoverUrl, onChangeCover }) => {
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

  return (
    <div className="hero-fullbleed">
      {/* Full-bleed background image */}
      {bgUrl && <img src={bgUrl} alt="" className="hero-bg-img" onError={e => { e.currentTarget.style.display = 'none'; }} />}
      {/* Gradient overlays */}
      <div className="hero-overlay-l" />
      <div className="hero-overlay-b" style={{ background: `linear-gradient(0deg, #06060e 0%, rgba(6,6,14,0.7) 50%, transparent 100%)` }} />
      <div className="hero-overlay-r" style={{ background: `linear-gradient(90deg, rgba(6,6,14,0.92) 0%, rgba(6,6,14,0.5) 60%, transparent 100%)` }} />

      {/* HUD corners */}
      <div className="hc tl" style={{ borderColor: acc }} />
      <div className="hc br" style={{ borderColor: acc }} />
      <div className="hc tr" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <div className="hc bl" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* Top HUD bar */}
      <div className="hero-hud-top">
        <span style={{ color: acc }}>{domain}</span>
        <span>STATUS: <span style={{ color: '#00ff41' }}>{featuredEpisode?.active ? 'LIVE' : 'BROADCASTING'}</span></span>
        <span>NODE: <span style={{ color: acc }}>{epId}</span></span>
        <span className="hero-hud-right" style={{ marginLeft: 'auto' }}>
          {onChangeCover && <button className="cover-mod-btn" onClick={onChangeCover}>⬡ COVER</button>}
        </span>
      </div>

      {/* Main content — bottom-left */}
      <div className="hero-content">
        <div className="hero-eyebrow-row">
          {featuredEpisode?.active && <span className="pill-live" style={{ background: acc }}>◉ LIVE</span>}
          <span className="hero-breadcrumb">{arcName} · E{epN} · {epType.toUpperCase()}</span>
        </div>
        <h1 className="hero-title-full">
          <span className="hero-title-main">{title}</span>
          <span className="hero-title-ep" style={{ color: acc }}>// {epTitle}</span>
        </h1>
        <p className="hero-desc-full">{epDesc ? epDesc.slice(0, 160) + (epDesc.length > 160 ? '…' : '') : 'Loading...'}</p>
        <div className="hero-btns-full">
          <button className="btn-play" style={{ background: acc, boxShadow: `0 0 30px ${acc}66` }} onClick={onPlay}>▶ PLAY E{epN}</button>
          <button className="btn-info" onClick={onMoreInfo}>MORE INFO</button>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="hero-stats-bar" style={{ borderTopColor: `${acc}33` }}>
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{totalEpisodes}</span><span className="hstat-l">Episodes</span></div>
        <div className="hstat-div" />
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{totalDomains}</span><span className="hstat-l">Domains</span></div>
        <div className="hstat-div" />
        <div className="hstat"><span className="hstat-n" style={{ color: acc }}>{epXp}</span><span className="hstat-l">XP This EP</span></div>
        <div style={{ marginLeft: 'auto', fontSize: '.45rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>ACN_EPHEMERAL</div>
      </div>
    </div>
  );
};
