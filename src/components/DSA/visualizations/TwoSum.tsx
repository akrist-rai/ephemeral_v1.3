import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [2, 7, 11, 15], target = 9
const NUMS = [2, 7, 11, 15];
const COLORS = ['#e11d48', '#2563eb', '#7c3aed', '#16a34a'] as const;
const TARGET = 9;

type TsStep = VizStep & {
  activeIdx: number;
  table: Array<{ val: number; idx: number }>;
  foundPair?: [number, number]; // indices [i, j]
};

const STEPS: TsStep[] = [
  { activeIdx: -1, table: [], eq: `table = {}   target = ${TARGET}`, desc: 'Initialise hash table. For each element, check if its complement is already stored.', codeLines: [0, 1], vars: [{ n: 'target', v: '9' }] },
  { activeIdx: 0, table: [{ val: 2, idx: 0 }], eq: 'need = 9 - 2 = 7   7 not in table', desc: 'val=2, complement=7. 7 not found → store 2:0 in table.', codeLines: [2, 3, 4, 6], vars: [{ n: 'i', v: '0' }, { n: 'val', v: '2' }, { n: 'need', v: '7' }] },
  { activeIdx: 1, table: [{ val: 2, idx: 0 }], foundPair: [0, 1], eq: 'need = 9 - 7 = 2   2 IN table → [0, 1]', desc: 'val=7, complement=2. Found 2 at index 0 → return [table[2], 1] = [0, 1].', codeLines: [2, 3, 4, 5], vars: [{ n: 'i', v: '1' }, { n: 'val', v: '7' }, { n: 'need', v: '2' }] },
  { activeIdx: -2, table: [{ val: 2, idx: 0 }], foundPair: [0, 1], eq: 'return [0, 1]', desc: 'nums[0] + nums[1] = 2 + 7 = 9 = target ✓', codeLines: [5], vars: [{ n: 'result', v: '[0,1]' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">twoSum</span><span class="cg-op">(</span>nums<span class="cg-op">,</span> target<span class="cg-op">):</span>' },
  { html: '    table <span class="cg-op">=</span> <span class="cg-op">{}</span>' },
  { html: '    <span class="cg-kw">for</span> i<span class="cg-op">,</span> val <span class="cg-kw">in</span> <span class="cg-bi">enumerate</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '        need <span class="cg-op">=</span> target <span class="cg-op">-</span> val' },
  { html: '        <span class="cg-kw">if</span> need <span class="cg-kw">in</span> table<span class="cg-op">:</span>' },
  { html: '            <span class="cg-kw">return</span> <span class="cg-op">[</span>table<span class="cg-op">[</span>need<span class="cg-op">],</span> i<span class="cg-op">]</span>' },
  { html: '        table<span class="cg-op">[</span>val<span class="cg-op">] =</span> i' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-op">[]</span>' },
];

interface Props { accColor: string }

export const TwoSum: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="two_sum.py" doneResult="[0, 1]" accColor={accColor}>
    {(step) => {
      const s = step as TsStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n, k) => {
              const inPair = s.foundPair?.includes(k);
              const state = s.activeIdx === -2 ? 'done' : k === s.activeIdx ? 'active' : k < s.activeIdx ? 'past' : 'idle';
              return (
                <div key={k} className={`viz-cell vc${k} viz-cell--${state}`} style={inPair ? { boxShadow: '0 0 0 3px rgba(34,197,94,.4), 0 4px 20px rgba(34,197,94,.3)' } : undefined}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              );
            })}
          </div>

          {/* target indicator */}
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.45)', letterSpacing: '.08em', marginTop: '.1rem', paddingLeft: '60px' }}>
            target = <span style={{ color: '#f59e0b', fontWeight: 700 }}>{TARGET}</span>
          </div>

          {/* Hash table */}
          <div style={{ marginTop: '.4rem' }}>
            <span className="viz-section-lbl">HASH TABLE (val → index)</span>
            <div className="viz-dict">
              {s.table.length === 0 && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>&#123; &#125;</span>
              )}
              {s.table.map(({ val, idx }) => {
                const isMatch = s.foundPair && s.foundPair[0] === idx;
                return (
                  <div key={val} className={`viz-entry${isMatch ? ' viz-entry--match' : ''}`}>
                    <span className="viz-entry-k">{val}</span>
                    <span className="viz-entry-sep">→</span>
                    <span className="viz-entry-v">idx {idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result */}
          {s.foundPair && (
            <div style={{ marginTop: '.4rem', padding: '.5rem .75rem', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.25)', fontFamily: 'var(--mono)', fontSize: '.72rem' }}>
              <span style={{ color: '#22c55e' }}>✓</span>{' '}
              <span style={{ color: 'rgba(255,255,255,.5)' }}>nums[</span><span style={{ color: '#e11d48' }}>0</span><span style={{ color: 'rgba(255,255,255,.5)' }}>] + nums[</span><span style={{ color: '#2563eb' }}>1</span><span style={{ color: 'rgba(255,255,255,.5)' }}>] = </span>
              <span style={{ color: '#e11d48' }}>2</span> <span style={{ color: 'rgba(255,255,255,.3)' }}>+</span> <span style={{ color: '#2563eb' }}>7</span> <span style={{ color: 'rgba(255,255,255,.3)' }}>=</span> <span style={{ color: '#22c55e', fontWeight: 700 }}>9</span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
