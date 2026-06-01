import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]  → 6  ([4,-1,2,1])
const NUMS = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

type MsStep = VizStep & { idx: number; curr: number; best: number; bestStart: number; bestEnd: number };

const STEPS: MsStep[] = [
  { idx: 0,  curr: -2, best: -2, bestStart: 0, bestEnd: 0,  eq: 'curr = -2   best = -2', desc: 'Start at nums[0]. curr = best = -2.', codeLines: [0, 1], vars: [{ n: 'curr', v: '-2' }, { n: 'best', v: '-2' }] },
  { idx: 1,  curr: 1,  best: 1,  bestStart: 1, bestEnd: 1,  eq: 'curr = max(1, -2+1) = 1   best = 1', desc: '1 alone beats -2+1=-1 → fresh start at index 1.', codeLines: [2, 3], vars: [{ n: 'curr', v: '1' }, { n: 'best', v: '1' }] },
  { idx: 2,  curr: -2, best: 1,  bestStart: 1, bestEnd: 1,  eq: 'curr = max(-3, 1-3) = -2   best = 1', desc: 'curr drops but stays positive continuation; best unchanged.', codeLines: [2, 3], vars: [{ n: 'curr', v: '-2' }, { n: 'best', v: '1' }] },
  { idx: 3,  curr: 4,  best: 4,  bestStart: 3, bestEnd: 3,  eq: 'curr = max(4, -2+4) = 4   best = 4', desc: '4 alone beats -2+4=2 → fresh start at index 3. New best!', codeLines: [2, 3], vars: [{ n: 'curr', v: '4' }, { n: 'best', v: '4' }] },
  { idx: 4,  curr: 3,  best: 4,  bestStart: 3, bestEnd: 3,  eq: 'curr = max(-1, 4-1) = 3   best = 4', desc: 'Extending subarray: 4+(-1)=3. Best still 4.', codeLines: [2, 3], vars: [{ n: 'curr', v: '3' }, { n: 'best', v: '4' }] },
  { idx: 5,  curr: 5,  best: 5,  bestStart: 3, bestEnd: 5,  eq: 'curr = max(2, 3+2) = 5   best = 5', desc: 'Extending: 3+2=5 > 2. New best! Subarray [4,-1,2].', codeLines: [2, 3], vars: [{ n: 'curr', v: '5' }, { n: 'best', v: '5' }] },
  { idx: 6,  curr: 6,  best: 6,  bestStart: 3, bestEnd: 6,  eq: 'curr = max(1, 5+1) = 6   best = 6', desc: 'Extending: 5+1=6 > 1. New best! Subarray [4,-1,2,1].', codeLines: [2, 3], vars: [{ n: 'curr', v: '6' }, { n: 'best', v: '6' }] },
  { idx: 7,  curr: 1,  best: 6,  bestStart: 3, bestEnd: 6,  eq: 'curr = max(-5, 6-5) = 1   best = 6', desc: '6+(-5)=1 > -5 → keep extending but best unchanged.', codeLines: [2, 3], vars: [{ n: 'curr', v: '1' }, { n: 'best', v: '6' }] },
  { idx: 8,  curr: 5,  best: 6,  bestStart: 3, bestEnd: 6,  eq: 'curr = max(4, 1+4) = 5   best = 6', desc: '1+4=5 > 4 → extend. But 5 < best=6. Best unchanged.', codeLines: [2, 3], vars: [{ n: 'curr', v: '5' }, { n: 'best', v: '6' }] },
  { idx: -2, curr: 5,  best: 6,  bestStart: 3, bestEnd: 6,  eq: 'return best = 6', desc: 'Best subarray is nums[3..6] = [4,-1,2,1], sum = 6.', codeLines: [4], vars: [{ n: 'result', v: '6' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">maxSubArray</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    curr <span class="cg-op">=</span> best <span class="cg-op">=</span> nums<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">]</span>' },
  { html: '    <span class="cg-kw">for</span> x <span class="cg-kw">in</span> nums<span class="cg-op">[</span><span class="cg-num">1</span><span class="cg-op">:]:</span>' },
  { html: '        curr <span class="cg-op">=</span> <span class="cg-bi">max</span><span class="cg-op">(</span>x<span class="cg-op">,</span> curr <span class="cg-op">+</span> x<span class="cg-op">)</span>; best <span class="cg-op">=</span> <span class="cg-bi">max</span><span class="cg-op">(</span>best<span class="cg-op">,</span> curr<span class="cg-op">)</span>' },
  { html: '    <span class="cg-kw">return</span> best' },
];

interface Props { accColor: string }

export const MaxSubarray: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="max_subarray.py" doneResult="6" accColor={accColor}>
    {(step) => {
      const s = step as MsStep;
      const MAX_BAR = 8;
      return (
        <>
          <div className="viz-index-row" style={{ gap: '.3rem' }}>
            <span className="viz-row-label-space" style={{ width: '52px' }} />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num" style={{ width: '38px', fontSize: '.6rem' }}>[{k}]</span>)}
          </div>
          <div className="viz-array-row" style={{ gap: '.3rem' }}>
            <span className="viz-row-label" style={{ width: '52px' }}>nums</span>
            {NUMS.map((n, k) => {
              const isActive = k === s.idx;
              const inBest = k >= s.bestStart && k <= s.bestEnd && (s.idx === -2 || s.idx >= s.bestEnd);
              const isPast = k < s.idx || s.idx === -2;
              const bg = inBest ? '#22c55e' : n > 0 ? '#2563eb' : '#e11d48';
              return (
                <div key={k} className={`viz-cell${isActive ? ' viz-cell--active' : isPast ? ' viz-cell--past' : ' viz-cell--idle'}`} style={{ background: bg, boxShadow: `0 4px 16px ${bg}44`, width: '38px', height: '38px' }}>
                  <span className="viz-cell-val" style={{ fontSize: '1.1rem' }}>{n}</span>
                </div>
              );
            })}
          </div>

          {/* curr / best bars */}
          <div style={{ marginTop: '.5rem', display: 'flex', gap: '.7rem' }}>
            {[{ label: 'curr', val: s.curr, color: '#2563eb' }, { label: 'best', val: s.best, color: '#22c55e' }].map(({ label, val, color }) => (
              <div key={label} style={{ padding: '.4rem .65rem', background: 'rgba(255,255,255,.04)', border: `1px solid ${color}33`, borderRadius: '4px', minWidth: '72px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: color + 'aa', letterSpacing: '.12em', marginBottom: '.2rem' }}>{label.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--disp)', fontSize: '1.8rem', color }}>{val}</div>
              </div>
            ))}
            <div style={{ padding: '.4rem .65rem', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.2)', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(34,197,94,.7)', letterSpacing: '.1em', marginBottom: '.3rem' }}>BEST WINDOW</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#22c55e' }}>
                [{s.bestStart}..{s.bestEnd}] = [{NUMS.slice(s.bestStart, s.bestEnd + 1).join(',')}]
              </div>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
