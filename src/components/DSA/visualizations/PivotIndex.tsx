import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [1, 7, 3, 6, 5, 6]  → pivot = 3
const NUMS = [1, 7, 3, 6, 5, 6];
const TOTAL = NUMS.reduce((a, b) => a + b, 0); // 28
const COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb', '#7c3aed', '#0891b2'] as const;

type PiStep = VizStep & { idx: number; leftSum: number; pivot?: number };

const STEPS: PiStep[] = [
  { idx: -1, leftSum: 0, eq: `total = ${TOTAL}   left = 0`, desc: `Precompute total = ${TOTAL}. Pivot: left_sum == total - left_sum - nums[i].`, codeLines: [0, 1, 2], vars: [{ n: 'total', v: String(TOTAL) }, { n: 'left', v: '0' }] },
  { idx: 0,  leftSum: 0, eq: `i=0: 0 == ${TOTAL}-0-1 = ${TOTAL-1}? No`, desc: `left(0) ≠ right(${TOTAL-1}). Not pivot. left += nums[0]=1.`, codeLines: [3, 4], vars: [{ n: 'i', v: '0' }, { n: 'left', v: '0' }] },
  { idx: 1,  leftSum: 1, eq: `i=1: 1 == ${TOTAL}-1-7 = ${TOTAL-8}? No`, desc: `left(1) ≠ right(${TOTAL-8}). Not pivot. left += nums[1]=7.`, codeLines: [3, 4], vars: [{ n: 'i', v: '1' }, { n: 'left', v: '1' }] },
  { idx: 2,  leftSum: 8, eq: `i=2: 8 == ${TOTAL}-8-3 = ${TOTAL-11}? No`, desc: `left(8) ≠ right(${TOTAL-11}). Not pivot. left += nums[2]=3.`, codeLines: [3, 4], vars: [{ n: 'i', v: '2' }, { n: 'left', v: '8' }] },
  { idx: 3,  leftSum: 11, pivot: 3, eq: `i=3: 11 == ${TOTAL}-11-6 = 11? YES ✓`, desc: `left(11) == right(11) → index 3 is the PIVOT INDEX!`, codeLines: [3, 5], vars: [{ n: 'i', v: '3' }, { n: 'left', v: '11' }] },
  { idx: -2, leftSum: 11, pivot: 3, eq: 'return 3', desc: 'nums[0..2] sum = 11. nums[4..5] sum = 11. Balanced!', codeLines: [5], vars: [{ n: 'result', v: '3' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">pivotIndex</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    total <span class="cg-op">=</span> <span class="cg-bi">sum</span><span class="cg-op">(</span>nums<span class="cg-op">)</span>' },
  { html: '    left <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> i<span class="cg-op">,</span> n <span class="cg-kw">in</span> <span class="cg-bi">enumerate</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '        left <span class="cg-op">+=</span> n <span class="cg-kw">if</span> left <span class="cg-op">!=</span> total<span class="cg-op">-</span>left<span class="cg-op">-</span>n <span class="cg-kw">else</span> <span class="cg-kw">return</span> i' },
  { html: '        <span class="cg-kw">if</span> left <span class="cg-op">==</span> total <span class="cg-op">-</span> left <span class="cg-op">-</span> n<span class="cg-op">:</span> <span class="cg-kw">return</span> i' },
];

// simpler code representation
const CODE2 = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">pivotIndex</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    total <span class="cg-op">=</span> <span class="cg-bi">sum</span><span class="cg-op">(</span>nums<span class="cg-op">)</span>' },
  { html: '    left <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> i<span class="cg-op">,</span> n <span class="cg-kw">in</span> <span class="cg-bi">enumerate</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '        right <span class="cg-op">=</span> total <span class="cg-op">-</span> left <span class="cg-op">-</span> n' },
  { html: '        <span class="cg-kw">if</span> left <span class="cg-op">==</span> right<span class="cg-op">:</span> <span class="cg-kw">return</span> i' },
  { html: '        left <span class="cg-op">+=</span> n' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-op">-</span><span class="cg-num">1</span>' },
];

interface Props { accColor: string }

export const PivotIndex: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE2} filename="pivot_index.py" doneResult="3" accColor={accColor}>
    {(step) => {
      const s = step as PiStep;
      const isPivot = s.pivot !== undefined;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n, k) => {
              const isActive = k === s.idx;
              const isP = isPivot && k === s.pivot;
              const bg = isP ? '#22c55e' : COLORS[k];
              const state = s.idx === -2 ? 'done' : isActive ? 'active' : k < s.idx ? 'past' : 'idle';
              return (
                <div key={k} className={`viz-cell vc${k} viz-cell--${state}`} style={{ background: bg, boxShadow: `0 4px 20px ${bg}44` }}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              );
            })}
          </div>

          {/* Left / Pivot / Right breakdown */}
          {s.idx >= 0 && (
            <div style={{ marginTop: '.4rem', fontFamily: 'var(--mono)', fontSize: '.68rem', display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '.3rem .6rem', background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.3)', borderRadius: '3px' }}>
                <span style={{ color: 'rgba(255,255,255,.45)' }}>left </span>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>{s.leftSum}</span>
              </div>
              <div style={{ padding: '.3rem .6rem', background: isPivot ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${isPivot ? 'rgba(34,197,94,.4)' : 'rgba(255,255,255,.1)'}`, borderRadius: '3px' }}>
                <span style={{ color: 'rgba(255,255,255,.45)' }}>nums[{s.idx}] </span>
                <span style={{ color: isPivot ? '#22c55e' : '#f59e0b', fontWeight: 700 }}>{NUMS[s.idx]}</span>
              </div>
              <div style={{ padding: '.3rem .6rem', background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.3)', borderRadius: '3px' }}>
                <span style={{ color: 'rgba(255,255,255,.45)' }}>right </span>
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>{TOTAL - s.leftSum - NUMS[s.idx]}</span>
              </div>
              {isPivot && <div style={{ padding: '.3rem .6rem', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.4)', borderRadius: '3px', color: '#22c55e', fontWeight: 700 }}>11 == 11 ✓ PIVOT</div>}
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
