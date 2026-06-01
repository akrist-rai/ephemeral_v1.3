import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RunningSumProps {
  accColor: string;
}

// Each array index has a permanent vibrant colour — full cell backgrounds
const CELL_COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb'] as const;
const NUMS = [1, 2, 3, 4];
const MAX_SUM = 10; // max running sum value (used for bar heights)

interface Step {
  activeIdx: number;   // which input index is being processed (-1 = none, -2 = done)
  result: number[];    // current result array
  bars: number[];      // running sum values for bar chart (same as result)
  eq: string;
  desc: string;
  codeLines: number[];
}

const STEPS: Step[] = [
  {
    activeIdx: -1, result: [], bars: [],
    eq: 'result = []   total = 0',
    desc: 'Initialise an empty result list and set total to zero.',
    codeLines: [1],
  },
  {
    activeIdx: 0, result: [1], bars: [1],
    eq: 'total = 0 + 1 = 1',
    desc: 'i = 0 — add nums[0] to total, append 1 to result.',
    codeLines: [2, 3],
  },
  {
    activeIdx: 1, result: [1, 3], bars: [1, 3],
    eq: 'total = 1 + 2 = 3',
    desc: 'i = 1 — add nums[1] to total, append 3 to result.',
    codeLines: [2, 3],
  },
  {
    activeIdx: 2, result: [1, 3, 6], bars: [1, 3, 6],
    eq: 'total = 3 + 3 = 6',
    desc: 'i = 2 — add nums[2] to total, append 6 to result.',
    codeLines: [2, 3],
  },
  {
    activeIdx: 3, result: [1, 3, 6, 10], bars: [1, 3, 6, 10],
    eq: 'total = 6 + 4 = 10',
    desc: 'i = 3 — add nums[3] to total, append 10 to result.',
    codeLines: [2, 3],
  },
  {
    activeIdx: -2, result: [1, 3, 6, 10], bars: [1, 3, 6, 10],
    eq: 'return [1, 3, 6, 10]',
    desc: 'All elements processed. Return the completed result array.',
    codeLines: [4],
  },
];

// Syntax-highlighted Python — hardcoded, not user input
const CODE_LINES: Array<{ raw: string; html: string }> = [
  { raw: 'def running_sum(nums):', html: '<span class="cg-kw">def</span> <span class="cg-fn">running_sum</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { raw: '    result, total = [], 0', html: '    result, total <span class="cg-op">=</span> <span class="cg-op">[], </span><span class="cg-num">0</span>' },
  { raw: '    for i in range(len(nums)):', html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)):</span>' },
  { raw: '        total += nums[i]', html: '        total <span class="cg-op">+=</span> nums<span class="cg-op">[</span>i<span class="cg-op">]</span>' },
  { raw: '        result.append(total)', html: '        result<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>total<span class="cg-op">)</span>' },
  { raw: '    return result', html: '    <span class="cg-kw">return</span> result' },
];

export const RunningSum: React.FC<RunningSumProps> = ({ accColor }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const isComplete = step.activeIdx === -2;
  const progress = Math.round((stepIdx / (STEPS.length - 1)) * 100);

  const advance = useCallback(() => {
    setStepIdx(p => { if (p >= STEPS.length - 1) { setPlaying(false); return p; } return p + 1; });
  }, []);

  useEffect(() => {
    if (playing) intervalRef.current = setInterval(advance, speed);
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setPlaying(false); setStepIdx(s => Math.min(STEPS.length - 1, s + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setPlaying(false); setStepIdx(s => Math.max(0, s - 1)); }
      else if (e.key === ' ') { e.preventDefault(); if (isLast) { setStepIdx(0); setPlaying(true); } else setPlaying(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast]);

  const handlePlay = () => { if (isLast) { setStepIdx(0); setPlaying(true); } else setPlaying(p => !p); };

  // All dynamic CSS injected as <style> — no inline style props
  const css = `
    .rs-progress-fill { width: ${progress}%; }
    .rs-bar-0 { height: ${Math.round((step.bars[0] ?? 0) / MAX_SUM * 100)}%; }
    .rs-bar-1 { height: ${Math.round((step.bars[1] ?? 0) / MAX_SUM * 100)}%; }
    .rs-bar-2 { height: ${Math.round((step.bars[2] ?? 0) / MAX_SUM * 100)}%; }
    .rs-bar-3 { height: ${Math.round((step.bars[3] ?? 0) / MAX_SUM * 100)}%; }
    .rs-bar-val-0 { opacity: ${step.bars[0] !== undefined ? 1 : 0}; }
    .rs-bar-val-1 { opacity: ${step.bars[1] !== undefined ? 1 : 0}; }
    .rs-bar-val-2 { opacity: ${step.bars[2] !== undefined ? 1 : 0}; }
    .rs-bar-val-3 { opacity: ${step.bars[3] !== undefined ? 1 : 0}; }
    .rs-eq-text { color: ${step.activeIdx >= 0 ? CELL_COLORS[step.activeIdx] : step.activeIdx === -2 ? '#22c55e' : 'rgba(255,255,255,.65)'}; }
    .rs-info-bar { border-left: 3px solid ${step.activeIdx >= 0 ? CELL_COLORS[step.activeIdx] : step.activeIdx === -2 ? '#22c55e' : 'rgba(255,255,255,.15)'}; }
    .rs-active-line { background: ${step.activeIdx >= 0 ? CELL_COLORS[step.activeIdx] + '22' : 'rgba(34,197,94,.08)'}; border-left-color: ${step.activeIdx >= 0 ? CELL_COLORS[step.activeIdx] : '#22c55e'}; }
    .rs-play-btn { border-color: ${accColor}66; color: ${accColor}; }
    .rs-play-btn:hover { border-color: ${accColor}; background: ${accColor}22; }
    ${playing ? `.rs-play-ring { animation: rsRingPulse 1.2s ease-out infinite; }
    @keyframes rsRingPulse{0%{box-shadow:0 0 0 0 ${accColor}66}70%{box-shadow:0 0 0 12px ${accColor}00}100%{box-shadow:0 0 0 0 ${accColor}00}}` : ''}
  `;

  return (
    <>
      <style>{css}</style>

      {/* Step progress bar */}
      <div className="rs-progress-track">
        <div className="rs-progress-fill" />
      </div>

      <div className={`rs-stage${isComplete ? ' rs-stage--done' : ''}`}>
        <div className="rs-grid">

          {/* ═══ LEFT: ARRAY VISUALIZATION ═══ */}
          <div className="rs-vis-panel">

            {/* Index labels */}
            <div className="rs-index-row">
              <span className="rs-row-label-space" />
              {NUMS.map((_, k) => (
                <span key={k} className="rs-index-num">{k}</span>
              ))}
            </div>

            {/* Input array */}
            <div className="rs-array-row">
              <span className="rs-row-label">nums</span>
              {NUMS.map((n, k) => {
                const state = step.activeIdx === -2 ? 'done' : k === step.activeIdx ? 'active' : k < step.activeIdx ? 'past' : 'idle';
                return (
                  <div
                    key={k}
                    className={`rs-cell rs-cell--in rs-cell--${state} rs-c${k}`}
                  >
                    <span className="rs-cell-val">{n}</span>
                  </div>
                );
              })}
            </div>

            {/* Cursor row — one cell per index, only the active one is visible */}
            <div className="rs-cur-row">
              <span className="rs-row-label-space" />
              {NUMS.map((_, k) => (
                <span key={k} className={`rs-cur-cell rs-c${k}-cur${k === step.activeIdx ? ' rs-cur-cell--active' : ''}`}>▼</span>
              ))}
            </div>

            {/* Output array */}
            <div className="rs-array-row">
              <span className="rs-row-label">result</span>
              {NUMS.map((_, k) => {
                const val = step.result[k];
                const hasVal = val !== undefined;
                return (
                  <div
                    key={hasVal ? `v${k}` : `e${k}`}
                    className={`rs-cell rs-cell--out ${hasVal ? `rs-cell--filled rs-c${k}` : 'rs-cell--empty'}`}
                  >
                    <span className="rs-cell-val">{hasVal ? val : ''}</span>
                  </div>
                );
              })}
            </div>

            {/* Bar chart */}
            <div className="rs-chart-section">
              <span className="rs-chart-label">RUNNING TOTAL</span>
              <div className="rs-chart">
                {NUMS.map((_, k) => (
                  <div key={k} className="rs-bar-col">
                    <div className="rs-bar-track">
                      <div className={`rs-bar rs-bar-${k} rs-c${k}-bar`} />
                    </div>
                    <span className={`rs-bar-val rs-bar-val-${k}`}>
                      {STEPS[Math.min(stepIdx, STEPS.length - 1)].bars[k] ?? ''}
                    </span>
                    <span className="rs-bar-idx">[{k}]</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ═══ RIGHT: CODE PANEL ═══ */}
          <div className="rs-code-panel">
            <div className="rs-code-chrome">
              <span className="rs-chrome-dot rs-dot-r" />
              <span className="rs-chrome-dot rs-dot-y" />
              <span className="rs-chrome-dot rs-dot-g" />
              <span className="rs-chrome-file">running_sum.py</span>
            </div>
            <div className="rs-code-body">
              {CODE_LINES.map(({ html }, i) => {
                const isActive = step.codeLines.includes(i);
                return (
                  <div key={i} className={`rs-code-line${isActive ? ' rs-code-line--active rs-active-line' : ''}`}>
                    <span className="rs-ln">{i + 1}</span>
                    <span className="rs-gutter">{isActive ? '▶' : ''}</span>
                    {/* eslint-disable-next-line react/no-danger */}
                    <span className="rs-code-text" dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                );
              })}
            </div>
            <div className="rs-vars">
              <div className="rs-var"><span className="rs-var-n">i</span><span className="rs-var-v">{step.activeIdx >= 0 ? step.activeIdx : '—'}</span></div>
              <div className="rs-var"><span className="rs-var-n">total</span><span className="rs-var-v" key={step.bars.length}>{step.bars[step.bars.length - 1] ?? 0}</span></div>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="rs-info-bar">
          <div className="rs-info-body">
            <span className="rs-eq-text">{step.eq}</span>
            <span className="rs-desc-text">{step.desc}</span>
          </div>
        </div>

        {/* Completion */}
        {isComplete && (
          <div className="rs-done-bar">
            <span className="rs-done-check">✓</span>
            <span className="rs-done-text">COMPLETE</span>
            <span className="rs-done-result">[1, 3, 6, 10]</span>
            <button type="button" className="rs-replay" onClick={() => { setPlaying(false); setStepIdx(0); }}>↺ REPLAY</button>
          </div>
        )}

        {/* Controls */}
        <div className="rs-controls">
          <button type="button" className="rs-btn" onClick={() => { setPlaying(false); setStepIdx(0); }} disabled={stepIdx === 0} title="Reset">|◀</button>
          <button type="button" className="rs-btn" onClick={() => { setPlaying(false); setStepIdx(s => Math.max(0, s - 1)); }} disabled={stepIdx === 0} title="Prev">◀</button>
          <div className="rs-play-ring">
            <button type="button" className="rs-btn rs-play-btn" onClick={handlePlay} title={playing ? 'Pause' : 'Play'}>
              {playing ? '⏸' : '▶'}
            </button>
          </div>
          <button type="button" className="rs-btn" onClick={() => { setPlaying(false); setStepIdx(STEPS.length - 1); }} disabled={isLast} title="End">▶|</button>
          <div className="rs-speed-wrap">
            <span className="rs-speed-lbl">SPD</span>
            <input type="range" aria-label="Playback speed" className="rs-speed-slider" min={300} max={2000} step={200} value={2000 - speed + 300} onChange={e => setSpeed(2000 - Number(e.target.value) + 300)} />
          </div>
          <span className="rs-step-lbl">{stepIdx === 0 ? 'START' : isLast ? '✓ DONE' : `STEP ${stepIdx} / ${STEPS.length - 2}`}</span>
          <span className="rs-kbd">← → SPACE</span>
        </div>
      </div>
    </>
  );
};
