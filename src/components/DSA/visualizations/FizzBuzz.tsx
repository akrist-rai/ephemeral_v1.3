import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

const NUMS = [1, 2, 3, 4, 5];
const CELL_COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb', '#7c3aed'] as const;

type FbStep = VizStep & { activeIdx: number; output: string[] };

const chipColor = (v: string) =>
  v === 'Fizz' ? '#16a34a' : v === 'Buzz' ? '#ea580c' : v === 'FizzBuzz' ? '#7c3aed' : '#2563eb';

const STEPS: FbStep[] = [
  { activeIdx: -1, output: [], eq: 'result = []', desc: 'Initialise an empty result list. Loop will process i = 1 to 5.', codeLines: [0, 1], vars: [{ n: 'i', v: '—' }, { n: 'len', v: '0' }] },
  { activeIdx: 0, output: ['1'], eq: '1 % 3 ≠ 0  ·  1 % 5 ≠ 0', desc: 'i=1 — not divisible by 3 or 5 → append "1".', codeLines: [2, 9, 10], vars: [{ n: 'i', v: '1' }, { n: 'len', v: '1' }] },
  { activeIdx: 1, output: ['1', '2'], eq: '2 % 3 ≠ 0  ·  2 % 5 ≠ 0', desc: 'i=2 — not divisible by 3 or 5 → append "2".', codeLines: [2, 9, 10], vars: [{ n: 'i', v: '2' }, { n: 'len', v: '2' }] },
  { activeIdx: 2, output: ['1', '2', 'Fizz'], eq: '3 % 3 = 0 → Fizz', desc: 'i=3 — divisible by 3 → append "Fizz".', codeLines: [2, 3, 4], vars: [{ n: 'i', v: '3' }, { n: 'len', v: '3' }] },
  { activeIdx: 3, output: ['1', '2', 'Fizz', '4'], eq: '4 % 3 ≠ 0  ·  4 % 5 ≠ 0', desc: 'i=4 — not divisible by 3 or 5 → append "4".', codeLines: [2, 9, 10], vars: [{ n: 'i', v: '4' }, { n: 'len', v: '4' }] },
  { activeIdx: 4, output: ['1', '2', 'Fizz', '4', 'Buzz'], eq: '5 % 5 = 0 → Buzz', desc: 'i=5 — divisible by 5 → append "Buzz".', codeLines: [2, 7, 8], vars: [{ n: 'i', v: '5' }, { n: 'len', v: '5' }] },
  { activeIdx: -2, output: ['1', '2', 'Fizz', '4', 'Buzz'], eq: 'return ["1","2","Fizz","4","Buzz"]', desc: 'All 5 numbers processed. Return the result list.', codeLines: [11], vars: [{ n: 'i', v: '—' }, { n: 'len', v: '5' }], done: true },
];

const CODE: Array<{ html: string }> = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">fizzBuzz</span><span class="cg-op">(</span>n<span class="cg-op">):</span>' },
  { html: '    result <span class="cg-op">=</span> <span class="cg-op">[]</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-num">1</span><span class="cg-op">,</span> n <span class="cg-op">+</span> <span class="cg-num">1</span><span class="cg-op">):</span>' },
  { html: '        <span class="cg-kw">if</span> i <span class="cg-op">%</span> <span class="cg-num">15</span> <span class="cg-op">==</span> <span class="cg-num">0</span><span class="cg-op">:</span>' },
  { html: '            result<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span><span class="cg-str">"FizzBuzz"</span><span class="cg-op">)</span>' },
  { html: '        <span class="cg-kw">elif</span> i <span class="cg-op">%</span> <span class="cg-num">3</span> <span class="cg-op">==</span> <span class="cg-num">0</span><span class="cg-op">:</span>' },
  { html: '            result<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span><span class="cg-str">"Fizz"</span><span class="cg-op">)</span>' },
  { html: '        <span class="cg-kw">elif</span> i <span class="cg-op">%</span> <span class="cg-num">5</span> <span class="cg-op">==</span> <span class="cg-num">0</span><span class="cg-op">:</span>' },
  { html: '            result<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span><span class="cg-str">"Buzz"</span><span class="cg-op">)</span>' },
  { html: '        <span class="cg-kw">else</span><span class="cg-op">:</span>' },
  { html: '            result<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span><span class="cg-bi">str</span><span class="cg-op">(</span>i<span class="cg-op">))</span>' },
  { html: '    <span class="cg-kw">return</span> result' },
];

interface Props { accColor: string }

export const FizzBuzz: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="fizz_buzz.py" doneResult='["1","2","Fizz","4","Buzz"]' accColor={accColor}>
    {(step) => {
      const s = step as FbStep;
      const curCss = NUMS.map((_, k) =>
        `.fb-cur-${k}{color:${k === s.activeIdx ? CELL_COLORS[k] : 'transparent'};${k === s.activeIdx ? 'transform:translateY(-3px)' : ''}}`
      ).join('');
      return (
        <>
          <style>{curCss}</style>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">i</span>
            {NUMS.map((n, k) => {
              const state = s.activeIdx === -2 ? 'done' : k === s.activeIdx ? 'active' : k < s.activeIdx ? 'past' : 'idle';
              return (
                <div key={k} className={`viz-cell vc${k} viz-cell--${state}`}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              );
            })}
          </div>
          <div className="viz-cur-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className={`viz-cur-cell fb-cur-${k}`}>▼</span>)}
          </div>
          <div style={{ marginTop: '.3rem' }}>
            <span className="viz-section-lbl">OUTPUT</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', minHeight: '1.8rem' }}>
              {s.output.length === 0 && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>[ ]</span>
              )}
              {s.output.map((val, i) => {
                const c = chipColor(val);
                return (
                  <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', padding: '.18rem .5rem', background: c + '20', border: `1px solid ${c}44`, color: c, borderRadius: '3px', letterSpacing: '.04em', animation: 'vizFillPop .3s ease-out' }}>
                    &quot;{val}&quot;
                  </span>
                );
              })}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
