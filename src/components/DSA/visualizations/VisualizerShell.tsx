import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface VizStep {
  eq: string;
  desc: string;
  codeLines: number[];
  vars: Array<{ n: string; v: string }>;
  done?: boolean;
}

export interface VizCodeLine {
  html: string;
}

interface Props {
  steps: VizStep[];
  codeLines: VizCodeLine[];
  filename: string;
  doneResult: string;
  accColor: string;
  children: (step: VizStep, stepIdx: number) => React.ReactNode;
}

export const VisualizerShell: React.FC<Props> = ({
  steps, codeLines, filename, doneResult, accColor, children,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const isDone = !!step.done;
  const progress = Math.round((stepIdx / (steps.length - 1)) * 100);

  const advance = useCallback(() => {
    setStepIdx(p => { if (p >= steps.length - 1) { setPlaying(false); return p; } return p + 1; });
  }, [steps.length]);

  useEffect(() => {
    if (playing) intervalRef.current = setInterval(advance, speed);
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setPlaying(false); setStepIdx(s => Math.min(steps.length - 1, s + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setPlaying(false); setStepIdx(s => Math.max(0, s - 1)); }
      else if (e.key === ' ') { e.preventDefault(); if (isLast) { setStepIdx(0); setPlaying(true); } else setPlaying(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast, steps.length]);

  const handlePlay = useCallback(() => {
    if (isLast) { setStepIdx(0); setPlaying(true); } else setPlaying(p => !p);
  }, [isLast]);

  // Static CSS that only changes when accColor or playing changes (not on every step)
  const staticCss = useMemo(() => `
    .viz-progress-fill{background:${accColor}}
    .viz-play-btn{border-color:${accColor}66;color:${accColor}}
    .viz-play-btn:hover{border-color:${accColor};background:${accColor}22}
    ${playing ? `.viz-play-ring{animation:vizRing 1.2s ease-out infinite}@keyframes vizRing{0%{box-shadow:0 0 0 0 ${accColor}66}70%{box-shadow:0 0 0 12px ${accColor}00}100%{box-shadow:0 0 0 0 ${accColor}00}}` : ''}
  `, [accColor, playing]);

  const eqColor = isDone ? '#22c55e' : accColor;
  const infoBarColor = isDone ? '#22c55e66' : accColor + '55';

  return (
    <>
      <style>{staticCss}</style>
      <style>{`.viz-progress-fill{width:${progress}%}.viz-eq-text{color:${eqColor}}.viz-info-bar{border-left-color:${infoBarColor}}`}</style>
      <div className="viz-progress-track"><div className="viz-progress-fill" /></div>
      <div className="viz-stage">
        <div className="viz-grid">

          {/* Left: algorithm-specific visualization */}
          <div className="viz-panel">
            {children(step, stepIdx)}
          </div>

          {/* Right: code panel */}
          <div className="viz-code-panel">
            <div className="viz-code-chrome">
              <span className="viz-dot viz-dot-r" />
              <span className="viz-dot viz-dot-y" />
              <span className="viz-dot viz-dot-g" />
              <span className="viz-chrome-file">{filename}</span>
            </div>
            <div className="viz-code-body">
              {codeLines.map(({ html }, i) => {
                const active = step.codeLines.includes(i);
                return (
                  <div key={i} className={`viz-code-line${active ? ' viz-code-line--active' : ''}`}>
                    <span className="viz-ln">{i + 1}</span>
                    <span className="viz-gutter">{active ? '▶' : ''}</span>
                    {/* eslint-disable-next-line react/no-danger */}
                    <span className="viz-code-text" dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                );
              })}
            </div>
            <div className="viz-vars">
              {step.vars.map(({ n, v }) => (
                <div key={n} className="viz-var">
                  <span className="viz-var-n">{n}</span>
                  <span className="viz-var-v" key={`${n}:${v}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="viz-info-bar">
          <div className="viz-info-body">
            <span className="viz-eq-text">{step.eq}</span>
            <span className="viz-desc-text">{step.desc}</span>
          </div>
        </div>

        {/* Completion banner */}
        {isDone && (
          <div className="viz-done-bar">
            <span className="viz-done-check">✓</span>
            <span className="viz-done-text">COMPLETE</span>
            <span className="viz-done-result">{doneResult}</span>
            <button type="button" className="viz-replay" onClick={() => { setPlaying(false); setStepIdx(0); }}>↺ REPLAY</button>
          </div>
        )}

        {/* Controls */}
        <div className="viz-controls">
          <button type="button" className="viz-btn" onClick={() => { setPlaying(false); setStepIdx(0); }} disabled={stepIdx === 0} title="Reset">|◀</button>
          <button type="button" className="viz-btn" onClick={() => { setPlaying(false); setStepIdx(s => Math.max(0, s - 1)); }} disabled={stepIdx === 0} title="Prev">◀</button>
          <div className="viz-play-ring">
            <button type="button" className="viz-btn viz-play-btn" onClick={handlePlay} title={playing ? 'Pause' : 'Play'}>
              {playing ? '⏸' : '▶'}
            </button>
          </div>
          <button type="button" className="viz-btn" onClick={() => { setPlaying(false); setStepIdx(steps.length - 1); }} disabled={isLast} title="End">▶|</button>
          <div className="viz-speed-wrap">
            <span className="viz-speed-lbl">SPD</span>
            <input type="range" aria-label="Playback speed" className="viz-speed-slider" min={300} max={2000} step={200}
              value={2000 - speed + 300} onChange={e => setSpeed(2000 - Number(e.target.value) + 300)} />
          </div>
          <span className="viz-step-lbl">{stepIdx === 0 ? 'START' : isLast ? '✓ DONE' : `STEP ${stepIdx} / ${steps.length - 2}`}</span>
          <span className="viz-kbd">← → SPACE</span>
        </div>
      </div>
    </>
  );
};
