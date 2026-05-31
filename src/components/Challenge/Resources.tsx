import React from 'react';
import type { Episode } from '../../types';
import { EPISODE_RESOURCES } from '../../data/content';
import { getEpisodeImage } from '../../lib/imageMapping';
import { playSound } from '../../lib/sound';

interface ResourcesProps {
  episode: Episode | null;
  onEnterArena: () => void;
}

const PRIMER: Record<string, string> = {
  ctf:      'Read the materials below before entering the arena. They cover the theory and techniques behind this episode\'s challenges.',
  research: 'These references build the conceptual grounding for this episode\'s research tasks.',
  quiz:     'Study these resources — the quiz questions draw directly from them.',
};

function parseDuration(src: string): string | null {
  const m = src.match(/\d+\s*min/i);
  return m ? m[0] : null;
}

export const Resources: React.FC<ResourcesProps> = ({ episode, onEnterArena }) => {
  const resources  = episode ? (EPISODE_RESOURCES[episode.id] ?? []) : [];
  const headerImg  = episode ? getEpisodeImage(episode.id) : '';
  const primerText = PRIMER[episode?.type ?? 'ctf'];
  const epType     = (episode?.type ?? 'ctf').toUpperCase();

  const open = (url: string) => {
    playSound.click();
    window.open(url, '_blank', 'noopener');
  };
  const handleEnter = () => { playSound.click(); onEnterArena(); };

  const videos = resources.filter(r => r.tag === 'VIDEO');
  const others = resources.filter(r => r.tag !== 'VIDEO');

  // ── Empty state ────────────────────────────────────────────────────────────
  if (resources.length === 0) {
    return (
      <div className="rv2-wrap">
        {/* Header */}
        <div className="rv2-header">
          {headerImg && <img src={headerImg} alt="" className="rv2-header-bg" onError={e => { e.currentTarget.style.display = 'none'; }} />}
          <div className="rv2-header-overlay" />
          <div className="rv2-header-content">
            <div className="rv2-header-eyebrow">// INTEL BRIEFING</div>
            <h2 className="rv2-header-title">{episode?.title ?? 'Resources'}</h2>
            <div className="rv2-header-meta">
              {episode && <span className="rv2-header-ref">{episode.id}</span>}
              {episode && <span className="rv2-header-sep">·</span>}
              {episode && <span className="rv2-header-badge">EP {episode.n}</span>}
              <span className="rv2-header-badge">{epType}</span>
            </div>
          </div>
        </div>

        <div className="rv2-body">
          <div className="rv2-empty">
            <span className="rv2-empty-icon">◌</span>
            <span className="rv2-empty-text">NO CURATED RESOURCES FOR THIS EPISODE YET</span>
          </div>
          <div className="rv2-cta">
            <div className="rv2-cta-overlay" />
            <div className="rv2-cta-body">
              <div className="rv2-cta-div">══ PROCEED TO CHALLENGE ARENA ══</div>
              <button type="button" className="rv2-cta-btn" onClick={handleEnter}>▶ ENTER CTF ARENA</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Full layout ────────────────────────────────────────────────────────────
  return (
    <div className="rv2-wrap">
      {/* Header with episode image */}
      <div className="rv2-header">
        {headerImg && (
          <img src={headerImg} alt="" className="rv2-header-bg" onError={e => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="rv2-header-overlay" />
        <div className="rv2-header-content">
          <div className="rv2-header-eyebrow">// INTEL BRIEFING</div>
          <h2 className="rv2-header-title">{episode?.title ?? 'Resources'}</h2>
          <div className="rv2-header-meta">
            {episode && <span className="rv2-header-ref">{episode.id}</span>}
            {episode && <span className="rv2-header-sep">·</span>}
            {episode && <span className="rv2-header-badge">EP {episode.n}</span>}
            <span className="rv2-header-badge">{epType}</span>
            <span className="rv2-header-sep">·</span>
            <span className="rv2-header-count">{resources.length} SOURCE{resources.length !== 1 ? 'S' : ''}</span>
          </div>
        </div>
      </div>

      <div className="rv2-body">
        {/* Primer */}
        <p className="rv2-primer">{primerText}</p>

        {/* VIDEO cards */}
        {videos.length > 0 && (
          <>
            <div className="rv2-section-label">VIDEO</div>
            {videos.map((res, i) => {
              const dur = parseDuration(res.src);
              return (
                <div
                  key={`v${i}`}
                  className="rv2-video-card"
                  onClick={() => open(res.link)}
                  onMouseEnter={() => playSound.hover()}
                  role="link"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && open(res.link)}
                >
                  <div className="rv2-video-thumb">
                    <div className="rv2-video-thumb-bg" />
                    <div className="rv2-video-play">
                      <span className="rv2-video-play-icon">▶</span>
                    </div>
                    {dur && <span className="rv2-video-dur">{dur}</span>}
                  </div>
                  <div className="rv2-video-body">
                    <span className="rv2-video-tag">VIDEO</span>
                    <div className="rv2-video-title">{res.title}</div>
                    <div className="rv2-video-src">{res.src}</div>
                    <div className="rv2-video-desc">{res.desc}</div>
                    <div className="rv2-video-cta">▶ WATCH NOW →</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* PAPER / ARTICLE cards */}
        {others.length > 0 && (
          <>
            <div className="rv2-section-label">
              {others.some(r => r.tag === 'PAPER') ? 'PAPERS & ARTICLES' : 'ARTICLES'}
            </div>
            <div className="rv2-cards-grid">
              {others.map((res, i) => {
                const tag   = (res.tag ?? 'ARTICLE').toUpperCase();
                const isPaper   = tag === 'PAPER';
                const tagClass  = isPaper ? 'rv2-card-tag--paper' : 'rv2-card-tag--article';

                return (
                  <div
                    key={`o${i}`}
                    className="rv2-card"
                    onClick={() => open(res.link)}
                    onMouseEnter={() => playSound.hover()}
                    role="link"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && open(res.link)}
                    style={{
                      borderLeftColor: isPaper ? 'rgba(185,255,0,.3)' : 'rgba(0,255,65,.25)',
                      borderLeftWidth: 3,
                    } as React.CSSProperties}
                  >
                    <div className="rv2-card-header">
                      <div className="rv2-card-icon" style={res.iconStyle as React.CSSProperties}>{res.icon}</div>
                      <span className={`rv2-card-tag ${tagClass}`}>{res.tag}</span>
                    </div>
                    <div className="rv2-card-body">
                      <div className="rv2-card-title">{res.title}</div>
                      <div className="rv2-card-src">{res.src}</div>
                      <div className="rv2-card-desc">{res.desc}</div>
                    </div>
                    <div className="rv2-card-footer">
                      <span>→ READ</span>
                      <span style={{ marginLeft: 'auto', opacity: .5 }}>↗</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="rv2-cta">
          <img src="/one_piece/83.jpeg" alt="" className="rv2-cta-bg" onError={e => { e.currentTarget.style.display = 'none'; }} />
          <div className="rv2-cta-overlay" />
          <div className="rv2-cta-body">
            <div className="rv2-cta-div">══ BRIEFING COMPLETE ══</div>
            <button type="button" className="rv2-cta-btn" onClick={handleEnter}>▶ ENTER CTF ARENA</button>
          </div>
        </div>
      </div>
    </div>
  );
};
