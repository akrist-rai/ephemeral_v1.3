import React, { useState, useEffect } from 'react';

const TICKER_ITEMS = [
  { icon: '◉', label: 'OPERATORS ONLINE', value: '14', color: '#00ff41' },
  { icon: '⚡', label: 'FLAGS CAPTURED', value: '2,841', color: '#ffb830' },
  { icon: '▲', label: 'TOP OPERATOR', value: 'VOID_KNIGHT_9441', color: '#4fc3f7' },
  { icon: '◈', label: 'NEW CHALLENGES', value: '3 ADDED TODAY', color: '#e8000d' },
  { icon: '⚔', label: 'ACTIVE ARCS', value: '9 DOMAINS', color: '#ce93d8' },
  { icon: '◉', label: 'TOTAL XP EARNED', value: '184,240 XP', color: '#00ff41' },
  { icon: '▶', label: 'RANKED SIEGE', value: 'LIVE — 18H 32M LEFT', color: '#ffb830' },
  { icon: '⬡', label: 'COMMUNITY', value: '847 OPERATORS REGISTERED', color: '#4fc3f7' },
];

export const LiveStatsTicker: React.FC = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // Duplicate for seamless loop

  return (
    <div className="live-ticker-wrap">
      <div className="live-ticker-badge">
        <span className="live-ticker-dot" />
        LIVE FEED
      </div>
      <div className="live-ticker-track-wrap">
        <div className="live-ticker-track">
          {items.map((item, i) => (
            <div key={i} className="live-ticker-item">
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="live-ticker-label">{item.label}:</span>
              <span className="live-ticker-val" style={{ color: item.color }}>{item.value}</span>
              <span className="live-ticker-sep">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
