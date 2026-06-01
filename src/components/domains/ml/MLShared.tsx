import React from 'react';

export interface Note { id: string; text: string; }

export const AwareStrip: React.FC<{ notes: Note[] }> = ({ notes }) => (
  <div className="ml-aware">
    <div className="ml-aware-label">// WHAT TO NOTICE</div>
    <ul className="ml-aware-list">
      {notes.map(n => <li key={n.id} className="ml-aware-item">{n.text}</li>)}
    </ul>
  </div>
);

export const Slider: React.FC<{
  label: string; sub: string; val: number;
  min?: number; max?: number; step?: number;
  onChange: (v: number) => void;
}> = ({ label, sub, val, min = -30, max = 30, step = 1, onChange }) => (
  <div className="wire-row">
    <div className="wire-row-labels">
      <span className="wire-row-lbl">{label}</span>
      <span className="wire-row-sub">{sub}</span>
    </div>
    <input
      type="range"
      className="wire-slider"
      min={min} max={max} step={step}
      aria-label={`${label} — ${sub}`}
      value={val}
      onChange={e => {
        const raw = parseFloat(e.target.value);
        onChange(Math.round(raw / step) * step);
      }}
    />
    <span className={`wire-row-val ${val > 0 ? 'wv-pos' : val < 0 ? 'wv-neg' : 'wv-zero'}`}>
      {val > 0 ? '+' : ''}{val.toFixed(step < 1 ? 1 : 0)}
    </span>
  </div>
);
