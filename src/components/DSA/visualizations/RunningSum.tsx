import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RunningSumProps {
  accColor: string;
}

const NUMS = [1, 2, 3, 4];

const CODE_LINES = [
  'def running_sum(nums):',
  '    result, total = [], 0',
  '    for i in range(len(nums)):',
  '        total += nums[i]',
  '        result.append(total)',
  '    return result',
];

interface Step {
  i: number;
  result: number[];
  eq: string;
  desc: string;
  total: number;
  codeLines: number[];
}

const STEPS: Step[] = [
  { i: -1, total: 0,  result: [],            eq: 'result = [],  total = 0',  desc: 'Initialise variables',               codeLines: [1] },
  { i: 0,  total: 1,  result: [1],           eq: 'total = 0 + 1 = 1',        desc: 'i=0  ·  total += nums[0]  ·  append 1',   codeLines: [3, 4] },
  { i: 1,  total: 3,  result: [1, 3],        eq: 'total = 1 + 2 = 3',        desc: 'i=1  ·  total += nums[1]  ·  append 3',   codeLines: [3, 4] },
  { i: 2,  total: 6,  result: [1, 3, 6],     eq: 'total = 3 + 3 = 6',        desc: 'i=2  ·  total += nums[2]  ·  append 6',   codeLines: [3, 4] },
  { i: 3,  total: 10, result: [1, 3, 6, 10], eq: 'total = 6 + 4 = 10',       desc: 'i=3  ·  total += nums[3]  ·  append 10',  codeLines: [3, 4] },
  { i: -2, total: 10, result: [1, 3, 6, 10], eq: 'return [1, 3, 6, 10]',     desc: 'Algorithm complete  ·  result ready',     codeLines: [5] },
];

function getInputBoxState(k: number, stepI: number): 'idle' | 'active' | 'complete' {
  if (stepI === -2) return 'complete';
  if (k === stepI) return 'active';
  if (k < stepI) return 'complete';
  return 'idle';
}

export const RunningSum: React.FC<RunningSumProps> = ({ accColor }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [animBoxIdx, setAnimBoxIdx] = useState(-1);
  const prevStepIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const isComplete = step.i === -2;

  const advance = useCallback(() => {
    setStepIdx(prev => {
      if (prev >= STEPS.length - 1) { setPlaying(false); return prev; }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(advance, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, advance]);

  // Pop-in animation when an output box gets a new value
  useEffect(() => {
    const prev = prevStepIdxRef.current;
    if (stepIdx > prev && step.i >= 0) {
      setAnimBoxIdx(step.i);
      const t = setTimeout(() => setAnimBoxIdx(-1), 420);
      return () => clearTimeout(t);
    }
    prevStepIdxRef.current = stepIdx;
  }, [stepIdx, step.i]);

  // Keyboard controls: ← → to step, Space to play/pause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault(); setPlaying(false);
        setStepIdx(s => Math.min(STEPS.length - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); setPlaying(false);
        setStepIdx(s => Math.max(0, s - 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isLast) { setStepIdx(0); setPlaying(true); return; }
        setPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLast]);

  const handlePlay = () => {
    if (isLast) { setStepIdx(0); setPlaying(true); return; }
    setPlaying(p => !p);
  };

  const handleReset = () => { setPlaying(false); setStepIdx(0); };

  // Inject dynamic accent colour as CSS — avoids inline style props entirely
  const accentCss = `
    .dv-box--active { border-color: ${accColor} !important; background: ${accColor}20 !important; box-shadow: 0 0 22px ${accColor}55, 0 0 8px ${accColor}33 !important; }
    .dv-arrow-cell--visible { color: ${accColor} !important; }
  `;

  return (
    <>
      <style>{accentCss}</style>
      <div className={`dv-stage${isComplete ? ' dv-stage--complete' : ''}`}>
        <div className="dv-grid">

          {/* ── LEFT: array visualisation ── */}
          <div className="dv-arrays-panel">
            <div className="dv-row-group">
              <span className="dv-row-label">INPUT</span>
              <div className="dv-array-row">
                {NUMS.map((n, k) => (
                  <div key={k} className={`dv-box dv-box--${getInputBoxState(k, step.i)}`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>

            <div className="dv-ptr-row">
              {NUMS.map((_, k) => (
                <div key={k} className={`dv-arrow-cell${k === step.i ? ' dv-arrow-cell--visible' : ''}`}>
                  ▼
                </div>
              ))}
            </div>

            <div className="dv-row-group">
              <span className="dv-row-label">OUTPUT</span>
              <div className="dv-array-row">
                {NUMS.map((_, k) => {
                  const val = step.result[k];
                  const hasVal = val !== undefined;
                  return (
                    <div
                      key={hasVal ? `v${k}` : `e${k}`}
                      className={`dv-box ${hasVal ? 'dv-box--complete' : 'dv-box--empty'}${hasVal && k === animBoxIdx ? ' dv-box--pop' : ''}`}
                    >
                      {hasVal ? val : '·'}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dv-total-display">
              <span className="dv-total-label">total</span>
              <span className="dv-total-eq">=</span>
              <span className="dv-total-val" key={step.total}>{step.total}</span>
            </div>
          </div>

          {/* ── RIGHT: code trace ── */}
          <div className="dv-code-panel">
            <div className="dv-code-header">// CODE TRACE</div>
            <div className="dv-code-body">
              {CODE_LINES.map((line, i) => {
                const isActiveLine = step.codeLines.includes(i);
                return (
                  <div key={i} className={`dv-code-line${isActiveLine ? ' dv-code-line--active' : ''}`}>
                    <span className="dv-code-gutter">{isActiveLine ? '▶' : ' '}</span>
                    <span className="dv-code-text">{line}</span>
                  </div>
                );
              })}
            </div>
            <div className="dv-code-vars">
              <span className="dv-var-chip">
                <span className="dv-var-name">i</span>
                <span className="dv-var-val">{step.i >= 0 ? step.i : '—'}</span>
              </span>
              <span className="dv-var-chip">
                <span className="dv-var-name">total</span>
                <span className="dv-var-val" key={`cv${step.total}`}>{step.total}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Info bar ── */}
        <div className="dv-info-bar">
          <span className="dv-eq-text">{step.eq}</span>
          <span className="dv-info-sep">·</span>
          <span className="dv-desc-text">{step.desc}</span>
        </div>

        {/* ── Completion banner ── */}
        {isComplete && (
          <div className="dv-complete-bar">
            <span className="dv-complete-icon">✓</span>
            <span className="dv-complete-text">ALGORITHM COMPLETE</span>
            <span className="dv-complete-result">[1, 3, 6, 10]</span>
            <button type="button" className="dv-replay-btn" onClick={handleReset}>↺ REPLAY</button>
          </div>
        )}

        {/* ── Controls ── */}
        <div className="dv-controls">
          <button type="button" className="dv-ctrl-btn" onClick={handleReset} disabled={stepIdx === 0} title="Reset">|◀</button>
          <button type="button" className="dv-ctrl-btn" onClick={() => { setPlaying(false); setStepIdx(s => Math.max(0, s - 1)); }} disabled={stepIdx === 0} title="Previous">◀</button>
          <button type="button" className="dv-ctrl-btn dv-ctrl-btn--play" onClick={handlePlay} title={playing ? 'Pause' : 'Play'}>
            {playing ? '⏸' : '▶'}
          </button>
          <button type="button" className="dv-ctrl-btn" onClick={() => { setPlaying(false); setStepIdx(STEPS.length - 1); }} disabled={isLast} title="End">▶|</button>

          <div className="dv-speed-wrap">
            <span className="dv-speed-label">SPEED</span>
            <input
              type="range"
              aria-label="Playback speed"
              className="dv-speed-slider"
              min={300} max={1800} step={150}
              value={1800 - speed + 300}
              onChange={e => setSpeed(1800 - Number(e.target.value) + 300)}
            />
          </div>

          <span className="dv-step-counter">
            {stepIdx === 0 ? 'START' : isLast ? 'DONE' : `STEP ${stepIdx} / ${STEPS.length - 2}`}
          </span>
          <span className="dv-kbd-hint">← → SPACE</span>
        </div>
      </div>
    </>
  );
};
