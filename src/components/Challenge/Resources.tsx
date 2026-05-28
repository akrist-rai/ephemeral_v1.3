import React from 'react';
import type { Episode } from '../../types';

interface Resource {
  icon: string;
  title: string;
  tag: string;
  tagClass: string;
  src: string;
  desc: string;
  link: string;
  iconStyle: React.CSSProperties;
}

// Resources are curated per-episode content — in a full implementation
// these would be stored in the DB. For now, this mapping is the source of truth.
const EPISODE_RESOURCES: Record<string, Resource[]> = {
  'S2E3': [
    { icon: '📄', title: 'An Image is Worth 16x16 Words: ViT', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Dosovitskiy et al. 2020', desc: 'The foundational ViT paper. Understand patch-embedding before the math.', link: 'https://arxiv.org/abs/2010.11929', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'But what is a convolution?', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 23 min', desc: 'Build intuition for CNNs before learning what ViTs replace.', link: 'https://www.youtube.com/watch?v=TrdevFK_am4', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'ViT Explained with Code', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'theaisummer.com', desc: 'Patch tokens, positional encoding, the CLS token.', link: 'https://theaisummer.com/vision-transformer/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📄', title: 'A ConvNet for the 2020s — ConvNeXt', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Liu et al. 2022', desc: 'Modernised CNNs matching ViTs. Critical for nuance.', link: 'https://arxiv.org/abs/2201.03545', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '◈', title: 'Convolutional Networks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs231n.stanford.edu', desc: 'CNN inductive biases — locality, weight sharing, translation equivariance.', link: 'https://cs231n.github.io/convolutional-networks/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📊', title: 'ViT Benchmarks', tag: 'LIVE DATA', tagClass: 'rtag-a', src: 'paperswithcode.com', desc: 'Where ViTs dominate vs where CNNs hold.', link: 'https://paperswithcode.com/methods/category/vision-transformer', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
  ],
};

interface ResourcesProps {
  episode: Episode | null;
  onEnterArena: () => void;
}

export const Resources: React.FC<ResourcesProps> = ({ episode, onEnterArena }) => {
  const resources = episode ? EPISODE_RESOURCES[episode.id] : null;
  const openLink = (u: string) => window.open(u, '_blank');

  if (!resources || resources.length === 0) {
    return (
      <div className="tpane on">
        <div className="empty-state">NO CURATED RESOURCES FOR THIS EPISODE YET</div>
        <div style={{ marginTop: '1.3rem' }}>
          <button className="btn-r" onClick={onEnterArena}>ENTER CTF ARENA →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tpane on">
      <div style={{ fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.1em', marginBottom: '.9rem', textTransform: 'uppercase' }}>
        {resources.length} CURATED RESOURCE{resources.length !== 1 ? 'S' : ''}
      </div>
      <div className="res-list">
        {resources.map((res, i) => (
          <div className="ri" onClick={() => openLink(res.link)} key={i}>
            <div className="ri-icon" style={res.iconStyle}>{res.icon}</div>
            <div className="ri-body">
              <div className="ri-title">{res.title} <span className={`rtag ${res.tagClass}`}>{res.tag}</span></div>
              <div className="ri-src">{res.src}</div>
              <div className="ri-desc">{res.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.3rem' }}>
        <button className="btn-r" onClick={onEnterArena}>ENTER CTF ARENA →</button>
      </div>
    </div>
  );
};
