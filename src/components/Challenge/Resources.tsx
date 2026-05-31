import React from 'react';
import type { Episode } from '../../types';
import { EPISODE_RESOURCES } from '../../data/content';
import { playSound } from '../../lib/sound';

interface ResourcesProps {
  episode: Episode | null;
  onEnterArena: () => void;
}

const TAG_CLASS: Record<string, string> = {
  VIDEO: 'rib-tag--video',
  PAPER: 'rib-tag--paper',
  ARTICLE: 'rib-tag--article',
};

const PRIMER_TEXT: Record<string, string> = {
  ctf: 'Study the materials below before entering the CTF arena. They cover the theoretical foundations and practical techniques you\'ll need to extract the flag.',
  research: 'Review these references to build the conceptual grounding for this episode\'s research tasks.',
  quiz: 'These resources will prepare you for the knowledge questions in this episode.',
};

export const Resources: React.FC<ResourcesProps> = ({ episode, onEnterArena }) => {
  const resources = episode ? EPISODE_RESOURCES[episode.id] : null;

  const openLink = (u: string) => {
    playSound.click();
    window.open(u, '_blank');
  };

  const handleEnter = () => {
    playSound.click();
    onEnterArena();
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="rib-wrap">
        <div className="rib-header">
          <div className="rib-eyebrow">INTEL BRIEFING</div>
          <div className="rib-ep-title">{episode?.title || 'Episode Resources'}</div>
          {episode && <div className="rib-ep-ref">{episode.id} · EP {episode.n}</div>}
        </div>
        <div className="rib-empty">NO CURATED RESOURCES FOR THIS EPISODE YET</div>
        <div className="rib-cta-wrap">
          <div className="rib-cta-divider">══ PROCEED TO CHALLENGE ARENA ══</div>
          <button type="button" className="rib-cta-btn" onClick={handleEnter}>
            ▶ ENTER CTF ARENA
          </button>
        </div>
      </div>
    );
  }

  const videos = resources.filter(r => r.tag === 'VIDEO');
  const others = resources.filter(r => r.tag !== 'VIDEO');
  const primerText = PRIMER_TEXT[episode?.type ?? 'ctf'];

  return (
    <div className="rib-wrap">
      {/* Header */}
      <div className="rib-header">
        <div className="rib-eyebrow">INTEL BRIEFING</div>
        <div className="rib-ep-title">{episode?.title || 'Episode Resources'}</div>
        {episode && <div className="rib-ep-ref">{episode.id} · EP {episode.n} · {episode.type.toUpperCase()}</div>}
      </div>

      {/* Mission primer */}
      <p className="rib-primer">{primerText}</p>

      <div className="rib-section-label">{resources.length} INTEL SOURCE{resources.length !== 1 ? 'S' : ''}</div>

      {/* Video cards — full width */}
      {videos.length > 0 && (
        <div className="rib-grid" style={{ marginBottom: others.length > 0 ? '.75rem' : undefined }}>
          {videos.map((res, i) => (
            <div
              key={`v-${i}`}
              className="rib-card rib-card--video"
              onClick={() => openLink(res.link)}
              onMouseEnter={() => playSound.hover()}
              role="link"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && openLink(res.link)}
            >
              <div className="rib-icon" style={res.iconStyle as React.CSSProperties}>{res.icon}</div>
              <div className="rib-body">
                <div className="rib-meta-row">
                  <span className={`rib-tag ${TAG_CLASS['VIDEO'] ?? ''}`}>VIDEO</span>
                </div>
                <div className="rib-title">{res.title}</div>
                <div className="rib-src">{res.src}</div>
                <div className="rib-desc">{res.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles / papers — 2-col grid */}
      {others.length > 0 && (
        <div className="rib-grid">
          {others.map((res, i) => {
            const tagKey = res.tag?.toUpperCase() ?? 'ARTICLE';
            const cardMod = tagKey === 'PAPER' ? 'rib-card--paper' : 'rib-card--article';
            return (
              <div
                key={`o-${i}`}
                className={`rib-card ${cardMod}`}
                onClick={() => openLink(res.link)}
                onMouseEnter={() => playSound.hover()}
                role="link"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openLink(res.link)}
              >
                <div className="rib-meta-row">
                  <div className="rib-icon" style={res.iconStyle as React.CSSProperties}>{res.icon}</div>
                  <span className={`rib-tag ${TAG_CLASS[tagKey] ?? 'rib-tag--article'}`}>{res.tag}</span>
                </div>
                <div className="rib-title">{res.title}</div>
                <div className="rib-src">{res.src}</div>
                <div className="rib-desc">{res.desc}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="rib-cta-wrap">
        <div className="rib-cta-divider">══ BRIEFING COMPLETE ══</div>
        <button type="button" className="rib-cta-btn" onClick={handleEnter}>
          ▶ ENTER CTF ARENA
        </button>
      </div>
    </div>
  );
};
