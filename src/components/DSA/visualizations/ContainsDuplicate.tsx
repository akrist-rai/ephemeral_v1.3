import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [1, 2, 3, 1]
const NUMS = [1, 2, 3, 1];
const COLORS = ['#e11d48', '#2563eb', '#7c3aed', '#e11d48'] as const;

type CdStep = VizStep & { activeIdx: number; seen: number[]; hitIdx?: number };

const STEPS: CdStep[] = [
  { activeIdx: -1, seen: [], eq: 'seen = set()', desc: 'Initialise an empty set to track numbers we have visited.', codeLines: [0, 1], vars: [{ n: 'i', v: '—' }, { n: 'seen', v: '{}' }] },
  { activeIdx: 0, seen: [1], eq: '1 not in seen → seen.add(1)', desc: 'num=1 — not in seen yet → safe, add to set.', codeLines: [2, 3, 5], vars: [{ n: 'num', v: '1' }, { n: 'seen', v: '{1}' }] },
  { activeIdx: 1, seen: [1, 2], eq: '2 not in seen → seen.add(2)', desc: 'num=2 — not in seen yet → safe, add to set.', codeLines: [2, 3, 5], vars: [{ n: 'num', v: '2' }, { n: 'seen', v: '{1,2}' }] },
  { activeIdx: 2, seen: [1, 2, 3], eq: '3 not in seen → seen.add(3)', desc: 'num=3 — not in seen yet → safe, add to set.', codeLines: [2, 3, 5], vars: [{ n: 'num', v: '3' }, { n: 'seen', v: '{1,2,3}' }] },
  { activeIdx: 3, seen: [1, 2, 3], hitIdx: 3, eq: '1 IN seen → return True', desc: 'num=1 — already in seen! Duplicate found → return True.', codeLines: [2, 3, 4], vars: [{ n: 'num', v: '1' }, { n: 'seen', v: '{1,2,3}' }] },
  { activeIdx: -2, seen: [1, 2, 3], hitIdx: 3, eq: 'return True', desc: 'Duplicate detected: 1 appears at index 0 and index 3.', codeLines: [4], vars: [{ n: 'result', v: 'True' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">containsDuplicate</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    seen <span class="cg-op">=</span> <span class="cg-bi">set</span><span class="cg-op">()</span>' },
  { html: '    <span class="cg-kw">for</span> num <span class="cg-kw">in</span> nums<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if</span> num <span class="cg-kw">in</span> seen<span class="cg-op">:</span>' },
  { html: '            <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
  { html: '        seen<span class="cg-op">.</span><span class="cg-bi">add</span><span class="cg-op">(</span>num<span class="cg-op">)</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
];

interface Props { accColor: string }

export const ContainsDuplicate: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="contains_duplicate.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as CdStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n, k) => {
              const isHit = s.hitIdx === k;
              const state = isHit ? 'active' : s.activeIdx === -2 ? 'done' : k === s.activeIdx ? 'active' : k < s.activeIdx ? 'past' : 'idle';
              const bg = isHit ? '#e11d48' : COLORS[k];
              const shadow = isHit ? '0 0 0 3px rgba(225,29,72,.4), 0 4px 20px rgba(225,29,72,.5)' : undefined;
              return (
                <div key={k} className={`viz-cell vc${k === 3 ? 0 : k} viz-cell--${state}`} style={{ boxShadow: shadow }}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '.5rem' }}>
            <span className="viz-section-lbl">SEEN set</span>
            <div className="viz-dict">
              {s.seen.length === 0 && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>&#123; &#125;</span>
              )}
              {s.seen.map((v, i) => {
                const isDup = s.hitIdx !== undefined && v === NUMS[s.hitIdx!];
                return (
                  <div key={`${v}-${i}`} className={`viz-entry${isDup ? ' viz-entry--hit' : ''}`}>
                    <span className="viz-entry-k" style={{ color: isDup ? '#e11d48' : 'var(--crt)' }}>{v}</span>
                  </div>
                );
              })}
            </div>
            {s.hitIdx !== undefined && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: '#e11d48', marginTop: '.35rem', letterSpacing: '.06em' }}>
                ✗ {NUMS[s.hitIdx]} already in set!
              </div>
            )}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
