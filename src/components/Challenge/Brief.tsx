import React from 'react';
import type { Arc, Episode } from '../../types';
import { getEpisodeImage, getArcCover } from '../../lib/imageMapping';

interface BriefProps {
  episode: Episode | null;
  arc: Arc | null;
  onStartResources: () => void;
}

export const Brief: React.FC<BriefProps> = ({ episode, arc, onStartResources }) => {
  if (!episode) return (
    <div className="tpane on">
      <div className="bf-empty">EPISODE DATA NOT FOUND</div>
    </div>
  );

  const acc = arc?.accColor || '#e8000d';
  const img = getEpisodeImage(episode.id) || getArcCover(arc?.id || 0);

  const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
    ctf:      { label: 'CTF CHALLENGE', color: '#000', bg: '#00c85a' },
    research: { label: 'RESEARCH',      color: '#fff', bg: '#e8000d' },
    quiz:     { label: 'QUIZ',          color: '#fff', bg: '#9b5fff' },
  };
  const tm = TYPE_META[episode.type] || TYPE_META.ctf;

  return (
    <div className="tpane on bf-pane">
      {/* Episode art banner */}
      <div className="bf-banner">
        {img && (
          <img src={img} alt={episode.title} className="bf-banner-img"
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="bf-banner-grad" style={{ background: `linear-gradient(0deg, var(--void) 0%, rgba(6,6,14,.6) 60%, transparent 100%)` }} />
        <div className="bf-banner-scan" />

        <div className="bf-banner-body">
          <div className="bf-ep-pill" style={{ background: tm.bg, color: tm.color }}>{tm.label}</div>
          <div className="bf-ep-id" style={{ color: acc }}>{episode.id}</div>
          <div className="bf-ep-n">EPISODE {episode.n}</div>
        </div>

        {episode.done && (
          <div className="bf-done-badge">✓ COMPLETED</div>
        )}
        <div className="hc sm tl" style={{ borderColor: acc }} />
        <div className="hc sm br" style={{ borderColor: acc }} />
      </div>

      {/* Title block */}
      <div className="bf-title-block">
        <div className="bf-domain-tag" style={{ color: acc }}>{arc?.domain || ''}</div>
        <h2 className="bf-title">{episode.title}</h2>
        <div className="bf-arc-name" style={{ color: `${acc}99` }}>{arc?.arcName || arc?.title || ''}</div>
      </div>

      {/* Description */}
      <div className="bf-section">
        <div className="bf-section-label" style={{ color: acc }}>// MISSION BRIEF</div>
        <p className="bf-desc">{episode.description}</p>
      </div>

      {/* Stats grid */}
      <div className="bf-stats-grid">
        <div className="bf-stat-cell" style={{ borderColor: `${acc}33` }}>
          <span className="bf-stat-icon" style={{ color: acc }}>⏱</span>
          <span className="bf-stat-val">{episode.min}m</span>
          <span className="bf-stat-lbl">EST. TIME</span>
        </div>
        <div className="bf-stat-cell" style={{ borderColor: `${acc}33` }}>
          <span className="bf-stat-icon" style={{ color: '#b9ff00' }}>⚡</span>
          <span className="bf-stat-val" style={{ color: '#b9ff00' }}>{episode.xp}</span>
          <span className="bf-stat-lbl">XP REWARD</span>
        </div>
        <div className="bf-stat-cell" style={{ borderColor: `${acc}33` }}>
          <span className="bf-stat-icon" style={{ color: episode.done ? '#00ff41' : acc }}>
            {episode.done ? '✓' : episode.locked ? '🔒' : '◉'}
          </span>
          <span className="bf-stat-val" style={{ color: episode.done ? '#00ff41' : '#fff' }}>
            {episode.done ? 'DONE' : episode.locked ? 'LOCKED' : episode.active ? 'LIVE' : 'OPEN'}
          </span>
          <span className="bf-stat-lbl">STATUS</span>
        </div>
        <div className="bf-stat-cell" style={{ borderColor: `${acc}33` }}>
          <span className="bf-stat-icon" style={{ color: acc }}>◈</span>
          <span className="bf-stat-val">{episode.type.toUpperCase()}</span>
          <span className="bf-stat-lbl">FORMAT</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="bf-cta"
        style={{ background: acc, color: acc === '#f9a825' || acc === '#b9ff00' ? '#000' : '#fff', boxShadow: `0 0 28px ${acc}44` }}
        onClick={onStartResources}
      >
        ▶ START MISSION
      </button>
    </div>
  );
};
