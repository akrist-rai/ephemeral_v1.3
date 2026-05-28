import React, { useMemo } from 'react';
import type { Arc, Episode } from '../../types';

interface HeroProps {
  onPlay: () => void;
  onMoreInfo: () => void;
  featuredEpisode: Episode | null;
  featuredArc: Arc | null;
  totalEpisodes: number;
  totalDomains: number;
}

export const Hero: React.FC<HeroProps> = ({ onPlay, onMoreInfo, featuredEpisode, featuredArc, totalEpisodes, totalDomains }) => {
  const acc = featuredArc?.accColor || '#e8000d';
  const bg = featuredArc?.bgColor || '#0d0003';
  const ascii = featuredArc?.asciiArt || '';
  const domain = featuredArc?.domain || 'LOADING';
  const arcName = featuredArc?.arcName || '';
  const title = featuredArc?.title || 'LOADING';
  const epTitle = featuredEpisode?.title || '';
  const epDesc = featuredEpisode?.description || '';
  const epType = featuredEpisode?.type || 'ctf';
  const epXp = featuredEpisode?.xp || 0;
  const epN = featuredEpisode?.n || 0;
  const epId = featuredEpisode?.id || '';

  // Binary background text from the arc's ascii art
  const binSeed = useMemo(() => {
    const raw = (ascii || 'EPHEMERAL').replace(/[^A-Z0-9]/gi, '');
    return raw.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') + ' ';
  }, [ascii]);
  const binBgHtml = useMemo(() => Array(32).fill(`<span>${binSeed.repeat(6)}</span>`).join(''), [binSeed]);

  return (
    <div className="hero">
      <div className="hero-left" style={{ background: acc }}>
        <div className="scan" style={{ opacity: .5 }}></div>
        <div className="hc tl"></div><div className="hc tr"></div><div className="hc bl"></div><div className="hc br"></div>
        <div className="coord tl" style={{ color: 'rgba(0,0,0,.3)' }}>{domain}</div>
        <div className="coord br" style={{ color: 'rgba(0,0,0,.3)' }}>S{featuredEpisode?.arcId || '?'}·E{epN}</div>
        <div className="hero-left-inner">
          <pre className="hero-ascii" style={{ color: bg }}>{ascii}</pre>
          <div className="hero-ascii-label" style={{ color: 'rgba(0,0,0,.5)', borderColor: 'rgba(0,0,0,.2)' }}>{arcName} // {domain}</div>
        </div>
        <div className="hero-vol-tag" style={{ color: 'rgba(0,0,0,.12)' }}>VOL.{String(featuredArc?.id || '?').padStart(2, '0')}</div>
      </div>

      <div className="hero-right">
        <div className="bin-bg" dangerouslySetInnerHTML={{ __html: binBgHtml }}></div>
        <div className="hc tl"></div><div className="hc br"></div>
        <div className="hero-hud-data">
          <span>DOMAIN: <span>{domain}</span></span>
          <span>STATUS: <span>{featuredEpisode?.active ? 'LIVE' : 'BROADCASTING'}</span></span>
          <span>NODE: <span>{epId}</span></span>
        </div>
        <div className="hero-eyebrow">
          {featuredEpisode?.active && <span className="pill-live" style={{ background: acc }}>NEW EP</span>}
          <span className="pill-ep">{domain} · E{epN} · {epType.toUpperCase()}</span>
        </div>
        <div className="hero-title">
          {title.split(' ').slice(0, -1).join(' ')}
          <span className="hl" style={{ color: acc }}>{title.split(' ').slice(-1)[0]}</span>
          <span className="sub">// {epTitle}</span>
        </div>
        <div className="hero-desc">{epDesc || 'Loading episode data...'}</div>
        <div className="hero-btns">
          <button className="btn-r" style={{ background: acc }} onClick={onPlay}>PLAY E{epN}</button>
          <button className="btn-o" onClick={onMoreInfo}>MORE INFO</button>
        </div>
      </div>

      <div className="hero-bottom" style={{ borderColor: `${acc}30` }}>
        <div className="hb-stat"><div className="hb-n" style={{ color: acc }}>{totalEpisodes}</div><div className="hb-l">Episodes</div></div>
        <div className="hb-div"></div>
        <div className="hb-stat"><div className="hb-n" style={{ color: acc }}>{totalDomains}</div><div className="hb-l">Domains</div></div>
        <div className="hb-div"></div>
        <div className="hb-stat"><div className="hb-n" style={{ color: acc }}>{epXp}</div><div className="hb-l">XP This EP</div></div>
        <div className="hb-right">
          <span className="hb-tag">NETWORK: <span>ACN_EPHEMERAL</span></span>
        </div>
      </div>
    </div>
  );
};
