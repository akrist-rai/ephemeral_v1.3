import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// n = 6  → fib(6) = 8
// dp = [0, 1, 1, 2, 3, 5, 8]
const N = 6;
const DP_FINAL = [0, 1, 1, 2, 3, 5, 8];
const DP_COLORS = ['#7c3aed', '#e11d48', '#ea580c', '#f59e0b', '#16a34a', '#0891b2', '#2563eb'] as const;

type FibStep = VizStep & { dp: (number | null)[]; activeI: number };

const STEPS: FibStep[] = [
  { activeI: -1, dp: [0, 1, null, null, null, null, null], eq: 'dp[0]=0   dp[1]=1', desc: 'Base cases: fib(0)=0, fib(1)=1. Fill the rest of the DP array.', codeLines: [0, 1, 2, 3], vars: [{ n: 'i', v: '—' }, { n: 'dp[0]', v: '0' }, { n: 'dp[1]', v: '1' }] },
  { activeI: 2, dp: [0, 1, 1, null, null, null, null], eq: 'dp[2] = dp[1] + dp[0] = 1+0 = 1', desc: 'i=2: each fib is the sum of the two before it.', codeLines: [4, 5], vars: [{ n: 'i', v: '2' }, { n: 'dp[2]', v: '1' }] },
  { activeI: 3, dp: [0, 1, 1, 2, null, null, null], eq: 'dp[3] = dp[2] + dp[1] = 1+1 = 2', desc: 'i=3: sum of previous two results.', codeLines: [4, 5], vars: [{ n: 'i', v: '3' }, { n: 'dp[3]', v: '2' }] },
  { activeI: 4, dp: [0, 1, 1, 2, 3, null, null], eq: 'dp[4] = dp[3] + dp[2] = 2+1 = 3', desc: 'i=4: sum of previous two results.', codeLines: [4, 5], vars: [{ n: 'i', v: '4' }, { n: 'dp[4]', v: '3' }] },
  { activeI: 5, dp: [0, 1, 1, 2, 3, 5, null], eq: 'dp[5] = dp[4] + dp[3] = 3+2 = 5', desc: 'i=5: sum of previous two results.', codeLines: [4, 5], vars: [{ n: 'i', v: '5' }, { n: 'dp[5]', v: '5' }] },
  { activeI: 6, dp: [0, 1, 1, 2, 3, 5, 8], eq: 'dp[6] = dp[5] + dp[4] = 5+3 = 8', desc: 'i=6: final value computed.', codeLines: [4, 5], vars: [{ n: 'i', v: '6' }, { n: 'dp[6]', v: '8' }] },
  { activeI: -2, dp: [0, 1, 1, 2, 3, 5, 8], eq: 'return dp[6] = 8', desc: 'fib(6) = 8. The sequence is: 0, 1, 1, 2, 3, 5, 8.', codeLines: [6], vars: [{ n: 'result', v: '8' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">fib</span><span class="cg-op">(</span>n<span class="cg-op">):</span>' },
  { html: '    <span class="cg-kw">if</span> n <span class="cg-op">&lt;=</span> <span class="cg-num">1</span><span class="cg-op">:</span> <span class="cg-kw">return</span> n' },
  { html: '    dp <span class="cg-op">=</span> <span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">] *</span> <span class="cg-op">(</span>n <span class="cg-op">+</span> <span class="cg-num">1</span><span class="cg-op">)</span>' },
  { html: '    dp<span class="cg-op">[</span><span class="cg-num">1</span><span class="cg-op">] =</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-num">2</span><span class="cg-op">,</span> n <span class="cg-op">+</span> <span class="cg-num">1</span><span class="cg-op">):</span>' },
  { html: '        dp<span class="cg-op">[</span>i<span class="cg-op">] =</span> dp<span class="cg-op">[</span>i<span class="cg-op">-</span><span class="cg-num">1</span><span class="cg-op">] +</span> dp<span class="cg-op">[</span>i<span class="cg-op">-</span><span class="cg-num">2</span><span class="cg-op">]</span>' },
  { html: '    <span class="cg-kw">return</span> dp<span class="cg-op">[</span>n<span class="cg-op">]</span>' },
];

interface Props { accColor: string }

export const Fibonacci: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="fibonacci.py" doneResult="8" accColor={accColor}>
    {(step) => {
      const s = step as FibStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" style={{ width: '52px' }} />
            {Array.from({ length: N + 1 }, (_, k) => (
              <span key={k} className="viz-dp-idx">[{k}]</span>
            ))}
          </div>
          <div className="viz-dp-row" style={{ marginTop: '.2rem' }}>
            <span className="viz-row-label" style={{ fontSize: '.65rem' }}>dp</span>
            {s.dp.map((val, k) => {
              const isActive = k === s.activeI;
              const isEmpty = val === null;
              const isNew = isActive && !isEmpty;
              return (
                <div key={k}
                  className={`viz-dp-cell${isActive ? ' viz-dp-cell--active' : ''}${isNew ? ' viz-dp-cell--filled' : ''}${isEmpty ? ' viz-dp-cell--empty' : ''}`}
                  style={!isEmpty && !isActive ? { background: DP_COLORS[k] + '22', borderColor: DP_COLORS[k] + '44', color: DP_COLORS[k] } : undefined}>
                  <span>{isEmpty ? '?' : val}</span>
                </div>
              );
            })}
          </div>

          {/* Arrow showing recurrence */}
          {s.activeI >= 2 && s.activeI <= N && (
            <div style={{ marginTop: '.5rem', fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.5)', letterSpacing: '.06em' }}>
              dp[<span style={{ color: DP_COLORS[s.activeI] }}>{s.activeI}</span>] = dp[<span style={{ color: DP_COLORS[s.activeI - 1] }}>{s.activeI - 1}</span>]
              {' '}<span style={{ color: 'rgba(255,255,255,.3)' }}>+</span>{' '}
              dp[<span style={{ color: DP_COLORS[s.activeI - 2] }}>{s.activeI - 2}</span>] = {' '}
              <span style={{ color: DP_COLORS[s.activeI - 1] }}>{DP_FINAL[s.activeI - 1]}</span>{' '}
              <span style={{ color: 'rgba(255,255,255,.3)' }}>+</span>{' '}
              <span style={{ color: DP_COLORS[s.activeI - 2] }}>{DP_FINAL[s.activeI - 2]}</span>{' = '}
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{DP_FINAL[s.activeI]}</span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
