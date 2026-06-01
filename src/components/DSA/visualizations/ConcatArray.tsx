import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

const NUMS = [1, 2, 1];
const COLORS = ['#e11d48', '#2563eb', '#e11d48'] as const; // same color for same value

type CaStep = VizStep & { phase: 0 | 1 | 2 | 3 };

const STEPS: CaStep[] = [
  { phase: 0, eq: 'nums = [1, 2, 1]', desc: 'Input array ready. We will return nums + nums.', codeLines: [0], vars: [{ n: 'nums', v: '[1,2,1]' }, { n: 'ans.len', v: '0' }] },
  { phase: 1, eq: 'ans ← first copy', desc: 'Append every element from nums once: [1, 2, 1].', codeLines: [1], vars: [{ n: 'nums', v: '[1,2,1]' }, { n: 'ans.len', v: '3' }] },
  { phase: 2, eq: 'ans ← second copy', desc: 'Append every element from nums again: [1, 2, 1, 1, 2, 1].', codeLines: [1], vars: [{ n: 'nums', v: '[1,2,1]' }, { n: 'ans.len', v: '6' }] },
  { phase: 3, eq: 'return [1, 2, 1, 1, 2, 1]', desc: 'Concatenation complete. Output has 2 × n = 6 elements.', codeLines: [1], vars: [{ n: 'nums', v: '[1,2,1]' }, { n: 'ans.len', v: '6' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">getConcatenation</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    <span class="cg-kw">return</span> nums <span class="cg-op">+</span> nums' },
];

interface Props { accColor: string }

export const ConcatArray: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="concat_array.py" doneResult="[1,2,1,1,2,1]" accColor={accColor}>
    {(step) => {
      const s = step as CaStep;
      const firstVisible = s.phase >= 1;
      const secondVisible = s.phase >= 2;
      const cellClass = (k: number) => {
        const colors = ['#e11d48', '#2563eb', '#e11d48'];
        return colors[k];
      };
      return (
        <>
          {/* nums row (always shown) */}
          <div>
            <span className="viz-section-lbl">INPUT</span>
            <div className="viz-index-row">
              <span className="viz-row-label-space" />
              {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
            </div>
            <div className="viz-array-row">
              <span className="viz-row-label">nums</span>
              {NUMS.map((n, k) => (
                <div key={k} className="viz-cell" style={{ background: cellClass(k), boxShadow: `0 4px 20px ${cellClass(k)}44` }}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ans row */}
          <div style={{ marginTop: '.4rem' }}>
            <span className="viz-section-lbl">OUTPUT (ans = nums + nums)</span>
            <div className="viz-index-row">
              <span className="viz-row-label-space" />
              {[0, 1, 2, 3, 4, 5].map(k => <span key={k} className="viz-index-num">[{k}]</span>)}
            </div>
            <div className="viz-array-row">
              <span className="viz-row-label">ans</span>
              {[0, 1, 2, 3, 4, 5].map(k => {
                const origK = k % 3;
                const inFirst = firstVisible && k < 3;
                const inSecond = secondVisible && k >= 3;
                const show = inFirst || inSecond;
                const color = [COLORS[0], COLORS[1], COLORS[2]][origK];
                const isNew = (s.phase === 1 && k < 3) || (s.phase === 2 && k >= 3);
                return show ? (
                  <div key={k} className={`viz-cell${isNew ? ' viz-cell--filled' : ''}`} style={{ background: color, boxShadow: `0 4px 20px ${color}44`, opacity: s.phase === 3 ? 0.85 : 1 }}>
                    <span className="viz-cell-val">{NUMS[origK]}</span>
                  </div>
                ) : (
                  <div key={k} className="viz-cell viz-cell--empty">
                    <span className="viz-cell-val">?</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
