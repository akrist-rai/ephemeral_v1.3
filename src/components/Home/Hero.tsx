import React, { useMemo, useState, useEffect } from 'react';
import type { Arc, Episode } from '../../types';
import { getArcCover } from '../../lib/imageMapping';
import { playSound } from '../../lib/sound';
import { TextScramble } from '../Effects/TextScramble';
import { PointerGlow } from '../Effects/PointerGlow';

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
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

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
  const isLive = featuredEpisode?.active ?? false;

  const typeLabel: Record<string, string> = {
    ctf: '⚡ CTF',
    research: '📖 RESEARCH',
    quiz: '◈ QUIZ',
  };

  const typeColor: Record<string, string> = {
    ctf: '#00c85a',
    research: '#e8000d',
    quiz: '#9b5fff',
  };

  // Ambient aurora particles
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 37 + 11) % 97,
      y: (i * 53 + 7) % 88,
      size: 1 + (i % 3),
      delay: (i * 0.4) % 5,
    })), []);

  const handleButtonClick = (action: () => void) => {
    playSound.click();
    action();
  };

  const handleMouseEnter = () => {
    playSound.hover();
  };

  return (
    <div className="pg-hero">
      {/* Full-bleed background image */}
      {bgUrl && (
        <img
          src={bgUrl}
          alt=""
          className="pg-hero-bg"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      {/* Aurora ambient glow */}
      <div className="pg-hero-aurora" style={{ '--aurora-acc': acc } as any} />

      {/* Layered overlays */}
      <div className="pg-hero-grad-l" style={{ background: `linear-gradient(90deg, ${featuredArc?.bgColor || '#06060e'}f8 0%, ${featuredArc?.bgColor || '#06060e'}bb 55%, transparent 100%)` }} />
      <div className="pg-hero-grad-b" />
      <div className="pg-hero-grad-t" />
      <div className="pg-hero-scanlines" />
      <div className="pg-hero-vignette" />

      {/* Ambient floating particles */}
      <div className="pg-hero-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="pg-hero-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: acc,
              animationDelay: `${p.delay}s`,
            } as any}
          />
        ))}
      </div>

      {/* HUD corners */}
      <div className="hc tl" style={{ borderColor: acc }} />
      <div className="hc br" style={{ borderColor: acc }} />
      <div className="hc tr" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <div className="hc bl" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Top meta strip */}
      <div className="pg-hero-meta">
        <div className="pg-hm-item">
          <span className="pg-hm-key">DOMAIN</span>
          <span className="pg-hm-val" style={{ color: acc }}>{domain}</span>
        </div>
        <div className="pg-hm-sep" />
        <div className="pg-hm-item">
          <span className="pg-hm-key">STATUS</span>
          <span className="pg-hm-val" style={{ color: isLive ? '#00ff41' : 'rgba(255,255,255,.5)' }}>
            {isLive ? '◉ LIVE' : 'STANDBY'}
          </span>
        </div>
        <div className="pg-hm-sep" />
        <div className="pg-hm-item">
          <span className="pg-hm-key">NODE</span>
          <span className="pg-hm-val">{epId || '—'}</span>
        </div>
        <div className="pg-hm-sep" />
        <div className="pg-hm-item">
          <span className="pg-hm-key">TYPE</span>
          <span className="pg-hm-val" style={{ color: typeColor[epType] || acc }}>{typeLabel[epType] || epType}</span>
        </div>
        <div className="pg-hm-sep" />
        <div className="pg-hm-item">
          <span className="pg-hm-key">REWARD</span>
          <span className="pg-hm-val" style={{ color: '#ffb830' }}>⚡ {epXp} XP</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          {onChangeCover && (
            <button 
              className="pg-cover-btn" 
              onClick={() => handleButtonClick(onChangeCover)}
              onMouseEnter={handleMouseEnter}
            >
              ⬡ COVER ART
            </button>
          )}
        </div>
      </div>

      {/* Main layout: content + arc preview panel */}
      <div className="pg-hero-layout">
        {/* Left: Main content */}
        <div className="pg-hero-body">
          <div className="pg-hero-eyebrow">
            {isLive && (
              <span className="pg-live-pill" style={{ background: acc }}>◉ NEW EP</span>
            )}
            <span className="pg-breadcrumb" style={{ color: `${acc}cc` }}>
              {arcName} · EPISODE {epN}
            </span>
          </div>

          <h1 className="pg-hero-title">
            <TextScramble text={title} speed={25} />
          </h1>

          <div className="pg-hero-ep-name" style={{ color: acc }}>
            // <TextScramble text={epTitle} triggerOnHover speed={35} />
          </div>

          <p className="pg-hero-desc">
            {epDesc ? epDesc.slice(0, 200) + (epDesc.length > 200 ? '…' : '') : 'Awaiting transmission...'}
          </p>

          {/* Type badge + XP row */}
          <div className="pg-hero-badge-row">
            <div className="pg-type-badge" style={{ background: `${typeColor[epType] || acc}22`, borderColor: `${typeColor[epType] || acc}55`, color: typeColor[epType] || acc }}>
              {typeLabel[epType] || epType}
            </div>
            <div className="pg-hero-xp" style={{ borderColor: `${acc}55`, color: acc }}>
              ⚡ {epXp} XP REWARD
            </div>
          </div>

          <div className="pg-hero-ctas">
            <button
              className="pg-btn-play"
              style={{ background: acc, color: acc === '#f9a825' || acc === '#b9ff00' ? '#000' : '#fff', boxShadow: `0 0 32px ${acc}55` }}
              onClick={() => handleButtonClick(onPlay)}
              onMouseEnter={handleMouseEnter}
            >
              ▶ PLAY EPISODE {epN}
            </button>
            <button 
              className="pg-btn-browse" 
              onClick={() => handleButtonClick(onMoreInfo)}
              onMouseEnter={handleMouseEnter}
            >
              BROWSE SERIES
            </button>
          </div>

          {/* Mission status mini-widget */}
          <div className="pg-mission-widget">
            <div className="pg-mw-dot" style={{ background: isLive ? '#00ff41' : acc }} />
            <div className="pg-mw-content">
              <span className="pg-mw-label">CURRENT MISSION</span>
              <span className="pg-mw-title" style={{ color: acc }}>{arcName || 'EPHEMERAL ACADEMY'}</span>
            </div>
            <div className="pg-mw-arcs">
              <span className="pg-mw-stat">{totalEpisodes}</span>
              <span className="pg-mw-stat-l">EP</span>
              <span className="pg-mw-div" />
              <span className="pg-mw-stat">{totalDomains}</span>
              <span className="pg-mw-stat-l">ARCS</span>
            </div>
          </div>
        </div>

        {/* Right: Arc filmstrip (desktop only) */}
        {arcs.length > 0 && (
          <div className="pg-hero-arc-panel">
            <div className="pg-arc-panel-label">// SERIES INDEX</div>
            <div className="pg-arc-panel-list">
              {arcs.map(arc => {
                const img = getArcCover(arc.id);
                const isActive = arc.id === featuredArc?.id;
                const isHov = hoveredArc === arc.id;
                return (
                  <div
                    key={arc.id}
                    className={`pg-arc-panel-row ${isActive ? 'active' : ''} ${isHov ? 'hov' : ''}`}
                    style={{ '--row-acc': arc.accColor } as any}
                    onClick={() => {
                      if (onArcSelect) {
                        handleButtonClick(() => onArcSelect(arc.id));
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveredArc(arc.id);
                      handleMouseEnter();
                    }}
                    onMouseLeave={() => setHoveredArc(null)}
                  >
                    <img
                      src={img}
                      alt={arc.title}
                      className="pg-arc-panel-thumb"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="pg-arc-panel-info">
                      <span className="pg-arc-panel-vol" style={{ color: arc.accColor }}>V{arc.id}</span>
                      <span className="pg-arc-panel-name">{arc.title}</span>
                      <span className="pg-arc-panel-dom">{arc.domain}</span>
                    </div>
                    {isActive && <div className="pg-arc-panel-active-bar" style={{ background: arc.accColor }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Arc filmstrip (mobile / bottom) */}
      {arcs.length > 0 && (
        <div className="pg-arc-strip">
          {arcs.map(arc => {
            const img = getArcCover(arc.id);
            const isActive = arc.id === featuredArc?.id;
            const isHov = hoveredArc === arc.id;
            return (
              <div
                key={arc.id}
                className={`pg-arc-chip ${isActive ? 'active' : ''} ${isHov ? 'hov' : ''}`}
                style={{ '--chip-acc': arc.accColor } as any}
                onClick={() => {
                  if (onArcSelect) {
                    handleButtonClick(() => onArcSelect(arc.id));
                  }
                }}
                onMouseEnter={() => {
                  setHoveredArc(arc.id);
                  handleMouseEnter();
                }}
                onMouseLeave={() => setHoveredArc(null)}
              >
                <img
                  src={img}
                  alt={arc.title}
                  className="pg-arc-chip-img"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="pg-arc-chip-overlay" />
                <div className="pg-arc-chip-label">
                  <span className="pg-arc-chip-vol" style={{ color: arc.accColor }}>V{arc.id}</span>
                  <span className="pg-arc-chip-name">{arc.title}</span>
                </div>
                {isActive && <div className="pg-arc-chip-bar" style={{ background: arc.accColor }} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom stats bar */}
      <div className="pg-hero-stats">
        <div className="pg-stat">
          <span className="pg-stat-n" style={{ color: acc }}>{totalEpisodes}</span>
          <span className="pg-stat-l">EPISODES</span>
        </div>
        <div className="pg-stat-div" />
        <div className="pg-stat">
          <span className="pg-stat-n" style={{ color: acc }}>{totalDomains}</span>
          <span className="pg-stat-l">DOMAINS</span>
        </div>
        <div className="pg-stat-div" />
        <div className="pg-stat">
          <span className="pg-stat-n" style={{ color: acc }}>{epXp}</span>
          <span className="pg-stat-l">XP THIS EP</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '.42rem', color: 'rgba(255,255,255,.2)', letterSpacing: '.14em', fontFamily: 'var(--mono)' }}>
          ACN_EPHEMERAL · NETWORK ACTIVE
        </div>
      </div>
    </div>
  );
};
