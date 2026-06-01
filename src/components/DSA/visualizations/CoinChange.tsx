import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// coins = [1, 3, 4], amount = 6
const AMOUNT = 6;
const COINS = [1, 3, 4];
const DP_FINAL = [0, 1, 2, 1, 1, 2, 2];
const INF_LABEL = '∞';

type CcStep = VizStep & { dp: (number | null)[]; activeI: number; bestCoin?: number };

const mkDP = (filled: (number | null)[]): (number | null)[] =>
  [...filled, ...Array(AMOUNT + 1 - filled.length).fill(null)];

const STEPS: CcStep[] = [
  { activeI: -1, dp: mkDP([0]), bestCoin: -1, eq: 'dp = [0, ∞, ∞, ∞, ∞, ∞, ∞]', desc: 'dp[0]=0 (zero coins for amount 0). All others = ∞ (unreachable yet).', codeLines: [0, 1, 2], vars: [{ n: 'coins', v: '[1,3,4]' }, { n: 'amount', v: '6' }] },
  { activeI: 1, dp: mkDP([0, 1]), bestCoin: 1, eq: 'dp[1]: coin=1 → dp[0]+1 = 1', desc: 'Amount 1: try coin=1, dp[1-1]+1 = dp[0]+1 = 1. Best = 1.', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '1' }, { n: 'dp[1]', v: '1' }] },
  { activeI: 2, dp: mkDP([0, 1, 2]), bestCoin: 1, eq: 'dp[2]: coin=1 → dp[1]+1 = 2', desc: 'Amount 2: only coin=1 works. dp[1]+1 = 2.', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '2' }, { n: 'dp[2]', v: '2' }] },
  { activeI: 3, dp: mkDP([0, 1, 2, 1]), bestCoin: 3, eq: 'dp[3]: coin=1→3, coin=3→dp[0]+1=1  ✓', desc: 'Amount 3: coin=3 gives dp[0]+1=1. Better than coin=1 (→3). Best = 1.', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '3' }, { n: 'dp[3]', v: '1' }] },
  { activeI: 4, dp: mkDP([0, 1, 2, 1, 1]), bestCoin: 4, eq: 'dp[4]: coin=4→dp[0]+1=1  ✓', desc: 'Amount 4: coin=4 gives dp[0]+1=1. Best = 1.', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '4' }, { n: 'dp[4]', v: '1' }] },
  { activeI: 5, dp: mkDP([0, 1, 2, 1, 1, 2]), bestCoin: 1, eq: 'dp[5]: coin=1→dp[4]+1=2  ✓', desc: 'Amount 5: coin=1 → dp[4]+1 = 2. Best = 2.', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '5' }, { n: 'dp[5]', v: '2' }] },
  { activeI: 6, dp: mkDP([0, 1, 2, 1, 1, 2, 2]), bestCoin: 3, eq: 'dp[6]: coin=3→dp[3]+1=2  ✓', desc: 'Amount 6: coin=3 → dp[3]+1 = 2. Best = 2 (using 3+3).', codeLines: [3, 4, 5, 6], vars: [{ n: 'i', v: '6' }, { n: 'dp[6]', v: '2' }] },
  { activeI: -2, dp: mkDP([0, 1, 2, 1, 1, 2, 2]), eq: 'return dp[6] = 2', desc: 'Minimum coins to make 6 = 2 (use coin 3 twice: 3+3=6).', codeLines: [7], vars: [{ n: 'result', v: '2' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">coinChange</span><span class="cg-op">(</span>coins<span class="cg-op">,</span> amount<span class="cg-op">):</span>' },
  { html: '    dp <span class="cg-op">=</span> <span class="cg-op">[</span><span class="cg-bi">float</span><span class="cg-op">(</span><span class="cg-str">\'inf\'</span><span class="cg-op">)] *</span> <span class="cg-op">(</span>amount <span class="cg-op">+</span> <span class="cg-num">1</span><span class="cg-op">)</span>' },
  { html: '    dp<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">] =</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-num">1</span><span class="cg-op">,</span> amount <span class="cg-op">+</span> <span class="cg-num">1</span><span class="cg-op">):</span>' },
  { html: '        <span class="cg-kw">for</span> c <span class="cg-kw">in</span> coins<span class="cg-op">:</span>' },
  { html: '            <span class="cg-kw">if</span> c <span class="cg-op">&lt;=</span> i<span class="cg-op">:</span>' },
  { html: '                dp<span class="cg-op">[</span>i<span class="cg-op">] =</span> <span class="cg-bi">min</span><span class="cg-op">(</span>dp<span class="cg-op">[</span>i<span class="cg-op">],</span> dp<span class="cg-op">[</span>i<span class="cg-op">-</span>c<span class="cg-op">] +</span> <span class="cg-num">1</span><span class="cg-op">)</span>' },
  { html: '    <span class="cg-kw">return</span> dp<span class="cg-op">[</span>amount<span class="cg-op">]</span>' },
];

const DP_COLORS = ['#7c3aed', '#e11d48', '#ea580c', '#16a34a', '#0891b2', '#2563eb', '#db2777'] as const;

interface Props { accColor: string }

export const CoinChange: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="coin_change.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as CcStep;
      return (
        <>
          {/* Coins display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}>
            <span className="viz-section-lbl" style={{ marginBottom: 0 }}>coins</span>
            {COINS.map((c, k) => (
              <div key={k} className="viz-dp-cell" style={{ width: '40px', height: '40px', background: DP_COLORS[k + 1] + '22', borderColor: DP_COLORS[k + 1] + '55', color: DP_COLORS[k + 1], fontSize: '1.2rem' }}>
                {c}
              </div>
            ))}
            <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginLeft: '.4rem' }}>
              amount = <span style={{ color: '#f59e0b' }}>6</span>
            </span>
          </div>

          {/* DP table */}
          <div>
            <span className="viz-section-lbl">DP TABLE (min coins for each amount)</span>
            <div className="viz-index-row" style={{ marginBottom: '.2rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'rgba(255,255,255,.3)', width: '52px' }}>amt</span>
              {Array.from({ length: AMOUNT + 1 }, (_, k) => (
                <span key={k} className="viz-dp-idx">{k}</span>
              ))}
            </div>
            <div className="viz-dp-row">
              <span className="viz-row-label" style={{ fontSize: '.62rem', width: '52px' }}>dp</span>
              {s.dp.map((val, k) => {
                const isActive = k === s.activeI;
                const isEmpty = val === null;
                const isZero = val === 0;
                const color = DP_COLORS[k] ?? '#aaa';
                return (
                  <div key={k}
                    className={`viz-dp-cell${isActive ? ' viz-dp-cell--active' : ''}${!isEmpty && !isActive && !isZero ? ' viz-dp-cell--filled' : ''}${isEmpty ? ' viz-dp-cell--empty' : ''}`}
                    style={!isEmpty && !isActive && !isZero ? { background: color + '22', borderColor: color + '44', color } : isZero ? { color: 'rgba(255,255,255,.9)' } : undefined}>
                    {isEmpty ? '∞' : val}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best coin used */}
          {s.bestCoin !== undefined && s.bestCoin > 0 && s.activeI > 0 && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.45)', marginTop: '.35rem', letterSpacing: '.06em' }}>
              Best coin for amount {s.activeI}:{' '}
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>coin={s.bestCoin}</span>
              {' → '}dp[{s.activeI - s.bestCoin}]+1 = <span style={{ color: '#22c55e', fontWeight: 700 }}>{DP_FINAL[s.activeI]}</span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
