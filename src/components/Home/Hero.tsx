import React, { useMemo, useState } from 'react';
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
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);
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

  const typeLabel: Record<string, string> = {
    ctf: '⚡ CTF',
    research: '📖 RESEARCH',
    quiz: '◈ QUIZ',
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

      {/* Layered overlays */}
      <div className="pg-hero-grad-l" style={{ background: `linear-gradient(90deg, ${featuredArc?.bgColor || '#06060e'}f8 0%, ${featuredArc?.bgColor || '#06060e'}bb 55%, transparent 100%)` }} />
      <div className="pg-hero-grad-b" />
      <div className="pg-hero-grad-t" />
      <div className="pg-hero-scanlines" />
      <div className="pg-hero-vignette" />

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
          <span className="pg-hm-val" style={{ color: featuredEpisode?.active ? '#00ff41' : 'rgba(255,255,255,.5)' }}>
            {featuredEpisode?.active ? '◉ LIVE' : 'STANDBY'}
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
          <span className="pg-hm-val" style={{ color: acc }}>{typeLabel[epType] || epType}</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {onChangeCover && (
            <button className="pg-cover-btn" onClick={onChangeCover}>⬡ COVER ART</button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="pg-hero-body">
        <div className="pg-hero-eyebrow">
          {featuredEpisode?.active && (
            <span className="pg-live-pill" style={{ background: acc }}>◉ NEW EP</span>
          )}
          <span className="pg-breadcrumb" style={{ color: `${acc}cc` }}>
            {arcName} · EPISODE {epN}
          </span>
        </div>

        <h1 className="pg-hero-title">{title}</h1>

        <div className="pg-hero-ep-name" style={{ color: acc }}>// {epTitle}</div>

        <p className="pg-hero-desc">
          {epDesc ? epDesc.slice(0, 200) + (epDesc.length > 200 ? '…' : '') : 'Awaiting transmission...'}
        </p>

        <div className="pg-hero-xp" style={{ borderColor: `${acc}55`, color: acc }}>
          ⚡ {epXp} XP REWARD
        </div>

        <div className="pg-hero-ctas">
          <button
            className="pg-btn-play"
            style={{ background: acc, color: acc === '#f9a825' || acc === '#b9ff00' ? '#000' : '#fff', boxShadow: `0 0 32px ${acc}55` }}
            onClick={onPlay}
          >
            ▶ PLAY EPISODE {epN}
          </button>
          <button className="pg-btn-browse" onClick={onMoreInfo}>
            BROWSE SERIES
          </button>
        </div>
      </div>

      {/* Arc filmstrip */}
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
                onClick={() => onArcSelect?.(arc.id)}
                onMouseEnter={() => setHoveredArc(arc.id)}
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
