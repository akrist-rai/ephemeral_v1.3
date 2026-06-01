import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// cost = [10, 15, 20]
const COST = [10, 15, 20];
const COLORS = ['#e11d48', '#2563eb', '#16a34a'] as const;

type McStep = VizStep & { dp: (number | null)[]; activeI: number; answer?: number };

const STEPS: McStep[] = [
  { activeI: -1, dp: [null, null, null], eq: 'cost = [10, 15, 20]', desc: 'dp[i] = minimum cost to reach step i. Two base cases first.', codeLines: [0, 1, 2], vars: [{ n: 'n', v: '3' }] },
  { activeI: 0, dp: [10, null, null], eq: 'dp[0] = cost[0] = 10', desc: 'Base case: standing at step 0 costs cost[0] = 10.', codeLines: [3], vars: [{ n: 'dp[0]', v: '10' }, { n: 'dp[1]', v: '?' }] },
  { activeI: 1, dp: [10, 15, null], eq: 'dp[1] = cost[1] = 15', desc: 'Base case: standing at step 1 costs cost[1] = 15.', codeLines: [3], vars: [{ n: 'dp[0]', v: '10' }, { n: 'dp[1]', v: '15' }] },
  { activeI: 2, dp: [10, 15, 30], eq: 'dp[2] = cost[2] + min(dp[1], dp[0]) = 20 + 10 = 30', desc: 'i=2: cost[2]=20, cheaper to come from step 0 (10) than step 1 (15). dp[2]=30.', codeLines: [4, 5], vars: [{ n: 'i', v: '2' }, { n: 'dp[2]', v: '30' }] },
  { activeI: -2, dp: [10, 15, 30], answer: 15, eq: 'return min(dp[1], dp[2]) = min(15, 30) = 15', desc: 'Top is reached from step 1 (15) or step 2 (30). Min = 15.', codeLines: [6], vars: [{ n: 'result', v: '15' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">minCostClimbingStairs</span><span class="cg-op">(</span>cost<span class="cg-op">):</span>' },
  { html: '    n <span class="cg-op">=</span> <span class="cg-bi">len</span><span class="cg-op">(</span>cost<span class="cg-op">)</span>' },
  { html: '    dp <span class="cg-op">=</span> <span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">] *</span> n' },
  { html: '    dp<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">],</span> dp<span class="cg-op">[</span><span class="cg-num">1</span><span class="cg-op">] =</span> cost<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">],</span> cost<span class="cg-op">[</span><span class="cg-num">1</span><span class="cg-op">]</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-num">2</span><span class="cg-op">,</span> n<span class="cg-op">):</span>' },
  { html: '        dp<span class="cg-op">[</span>i<span class="cg-op">] =</span> cost<span class="cg-op">[</span>i<span class="cg-op">] +</span> <span class="cg-bi">min</span><span class="cg-op">(</span>dp<span class="cg-op">[</span>i<span class="cg-op">-</span><span class="cg-num">1</span><span class="cg-op">],</span> dp<span class="cg-op">[</span>i<span class="cg-op">-</span><span class="cg-num">2</span><span class="cg-op">])</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-bi">min</span><span class="cg-op">(</span>dp<span class="cg-op">[-</span><span class="cg-num">1</span><span class="cg-op">],</span> dp<span class="cg-op">[-</span><span class="cg-num">2</span><span class="cg-op">])</span>' },
];

interface Props { accColor: string }

export const MinCostStairs: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="min_cost_stairs.py" doneResult="15" accColor={accColor}>
    {(step) => {
      const s = step as McStep;
      return (
        <>
          {/* Cost array */}
          <div>
            <span className="viz-section-lbl">COST ARRAY (pay to stand here)</span>
            <div className="viz-index-row">
              <span className="viz-row-label-space" />
              {COST.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
            </div>
            <div className="viz-array-row">
              <span className="viz-row-label">cost</span>
              {COST.map((c, k) => {
                const isActive = k === s.activeI;
                return (
                  <div key={k} className={`viz-cell vc${k}${isActive ? ' viz-cell--active' : ''}`} style={{ opacity: isActive ? 1 : 0.7 }}>
                    <span className="viz-cell-val">{c}</span>
                  </div>
                );
              })}
              {/* "top" marker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', paddingLeft: '.5rem', fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'rgba(255,255,255,.45)' }}>
                →<span style={{ color: 'rgba(255,255,255,.6)' }}>TOP</span>
              </div>
            </div>
          </div>

          {/* DP array */}
          <div style={{ marginTop: '.5rem' }}>
            <span className="viz-section-lbl">DP ARRAY (min cost to reach step i)</span>
            <div className="viz-index-row">
              <span className="viz-row-label-space" />
              {COST.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
            </div>
            <div className="viz-dp-row">
              <span className="viz-row-label">dp</span>
              {s.dp.map((val, k) => {
                const isActive = k === s.activeI;
                const isEmpty = val === null;
                const isAnswer = s.answer !== undefined && k >= 1;
                return (
                  <div key={k}
                    className={`viz-dp-cell${isActive ? ' viz-dp-cell--active' : ''}${!isEmpty && !isActive ? ' viz-dp-cell--filled' : ''}${isEmpty ? ' viz-dp-cell--empty' : ''}`}
                    style={!isEmpty && !isActive ? { background: COLORS[k] + '22', borderColor: COLORS[k] + '55', color: isAnswer ? COLORS[k] : COLORS[k] } : undefined}>
                    {isEmpty ? '?' : val}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answer display */}
          {s.answer !== undefined && (
            <div style={{ marginTop: '.5rem', padding: '.45rem .75rem', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.25)', fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.6)' }}>
              min(dp[1], dp[2]) = min(<span style={{ color: COLORS[1] }}>15</span>, <span style={{ color: COLORS[2] }}>30</span>) = <span style={{ color: '#22c55e', fontWeight: 700 }}>15</span>
              <span style={{ color: 'rgba(255,255,255,.35)', marginLeft: '.6rem' }}>← start at step 1, jump 2 to top</span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
