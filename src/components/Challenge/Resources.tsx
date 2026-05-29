import React from 'react';
import type { Episode } from '../../types';
import { EPISODE_RESOURCES } from '../../data/content';

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
            <div className="ri-icon" style={res.iconStyle as React.CSSProperties}>{res.icon}</div>
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
