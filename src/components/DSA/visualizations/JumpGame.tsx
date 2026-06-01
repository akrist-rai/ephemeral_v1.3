import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [2, 3, 1, 1, 4]
const NUMS = [2, 3, 1, 1, 4];
const COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb', '#7c3aed'] as const;

type JgStep = VizStep & { activeIdx: number; maxReach: number };

const STEPS: JgStep[] = [
  { activeIdx: -1, maxReach: 0, eq: 'maxReach = 0', desc: 'Initialise maxReach = 0. Scan each index left to right.', codeLines: [0, 1], vars: [{ n: 'i', v: '—' }, { n: 'maxReach', v: '0' }] },
  { activeIdx: 0, maxReach: 2, eq: 'i=0 ≤ 2  ·  maxReach = max(0, 0+2) = 2', desc: 'i=0: reachable (0≤0). From here we can jump to index 2.', codeLines: [2, 3, 5], vars: [{ n: 'i', v: '0' }, { n: 'maxReach', v: '2' }] },
  { activeIdx: 1, maxReach: 4, eq: 'i=1 ≤ 2  ·  maxReach = max(2, 1+3) = 4', desc: 'i=1: reachable (1≤2). From here we can reach index 4!', codeLines: [2, 3, 5], vars: [{ n: 'i', v: '1' }, { n: 'maxReach', v: '4' }] },
  { activeIdx: 2, maxReach: 4, eq: 'i=2 ≤ 4  ·  maxReach = max(4, 2+1) = 4', desc: 'i=2: reachable. 2+1=3 < current maxReach, no update.', codeLines: [2, 3, 5], vars: [{ n: 'i', v: '2' }, { n: 'maxReach', v: '4' }] },
  { activeIdx: 3, maxReach: 4, eq: 'i=3 ≤ 4  ·  maxReach = max(4, 3+1) = 4', desc: 'i=3: reachable. 3+1=4 = maxReach, no change.', codeLines: [2, 3, 5], vars: [{ n: 'i', v: '3' }, { n: 'maxReach', v: '4' }] },
  { activeIdx: 4, maxReach: 8, eq: 'i=4 ≤ 4  ·  maxReach = max(4, 4+4) = 8', desc: 'i=4: reachable (4≤4). Reached the last index → TRUE.', codeLines: [2, 3, 5], vars: [{ n: 'i', v: '4' }, { n: 'maxReach', v: '8' }] },
  { activeIdx: -2, maxReach: 8, eq: 'return True', desc: 'Loop finished without being blocked. Last index is reachable.', codeLines: [6], vars: [{ n: 'result', v: 'True' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">canJump</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    maxReach <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)):</span>' },
  { html: '        <span class="cg-kw">if</span> i <span class="cg-op">&gt;</span> maxReach<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html: '' },
  { html: '        maxReach <span class="cg-op">=</span> <span class="cg-bi">max</span><span class="cg-op">(</span>maxReach<span class="cg-op">,</span> i <span class="cg-op">+</span> nums<span class="cg-op">[</span>i<span class="cg-op">])</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
];

interface Props { accColor: string }

export const JumpGame: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="jump_game.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as JgStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n, k) => {
              const isActive = k === s.activeIdx;
              const isReachable = k <= s.maxReach || s.activeIdx === -2;
              const state = s.activeIdx === -2 ? 'done' : isActive ? 'active' : isReachable ? 'past' : 'idle';
              return (
                <div key={k} className={`viz-cell vc${k} viz-cell--${state}`}>
                  <span className="viz-cell-val">{n}</span>
                </div>
              );
            })}
          </div>

          {/* maxReach indicator */}
          <div style={{ paddingLeft: '60px', display: 'flex', gap: '.45rem', height: '20px', alignItems: 'center' }}>
            {NUMS.map((_, k) => (
              <div key={k} style={{ width: '56px', display: 'flex', justifyContent: 'center' }}>
                {k === Math.min(s.maxReach, NUMS.length - 1) && s.activeIdx >= 0 && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: '#22c55e', letterSpacing: '.06em' }}>←max</span>
                )}
              </div>
            ))}
          </div>

          {/* Reach tracker */}
          <div style={{ marginTop: '.4rem' }}>
            <span className="viz-section-lbl">REACH COVERAGE</span>
            <div style={{ height: '16px', background: 'rgba(255,255,255,.04)', borderRadius: '3px', overflow: 'hidden', display: 'flex', gap: '2px', padding: '2px' }}>
              {NUMS.map((_, k) => {
                const covered = k <= s.maxReach;
                return (
                  <div key={k} style={{ flex: 1, background: covered ? COLORS[Math.min(k, COLORS.length - 1)] + 'aa' : 'rgba(255,255,255,.06)', borderRadius: '2px', transition: 'background .4s' }} />
                );
              })}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.45)', marginTop: '.25rem', letterSpacing: '.06em' }}>
              maxReach = <span style={{ color: '#22c55e', fontWeight: 700 }}>{s.maxReach}</span>
              {s.maxReach >= NUMS.length - 1 && (
                <span style={{ color: '#22c55e', marginLeft: '.5rem' }}>≥ last index ({NUMS.length - 1}) ✓</span>
              )}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
