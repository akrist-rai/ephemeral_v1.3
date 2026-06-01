import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// prices = [7, 1, 5, 3, 6, 4]
const PRICES = [7, 1, 5, 3, 6, 4];
const MAX_PRICE = 7;

type BtStep = VizStep & {
  activeIdx: number;
  minPrice: number | null;
  maxProfit: number;
  updateType?: 'min' | 'profit' | 'none';
};

const INF = 999;

const STEPS: BtStep[] = [
  { activeIdx: -1, minPrice: null, maxProfit: 0, eq: 'min_price = ∞   max_profit = 0', desc: 'Initialise. Scan once from left to right.', codeLines: [0, 1, 2], vars: [{ n: 'min_price', v: '∞' }, { n: 'max_profit', v: '0' }] },
  { activeIdx: 0, minPrice: 7, maxProfit: 0, updateType: 'min', eq: 'price=7 < ∞ → min_price = 7', desc: 'New minimum price found: 7.', codeLines: [3, 4, 5], vars: [{ n: 'price', v: '7' }, { n: 'min_price', v: '7' }, { n: 'max_profit', v: '0' }] },
  { activeIdx: 1, minPrice: 1, maxProfit: 0, updateType: 'min', eq: 'price=1 < 7 → min_price = 1', desc: 'New minimum price found: 1. Better buy point!', codeLines: [3, 4, 5], vars: [{ n: 'price', v: '1' }, { n: 'min_price', v: '1' }, { n: 'max_profit', v: '0' }] },
  { activeIdx: 2, minPrice: 1, maxProfit: 4, updateType: 'profit', eq: 'profit = 5 - 1 = 4 > 0 → max_profit = 4', desc: 'price=5, profit=5-1=4. New max profit!', codeLines: [3, 6, 7], vars: [{ n: 'price', v: '5' }, { n: 'min_price', v: '1' }, { n: 'max_profit', v: '4' }] },
  { activeIdx: 3, minPrice: 1, maxProfit: 4, updateType: 'none', eq: 'profit = 3 - 1 = 2 < 4 → no change', desc: 'price=3, profit=2 is less than max_profit=4. Skip.', codeLines: [3, 6], vars: [{ n: 'price', v: '3' }, { n: 'min_price', v: '1' }, { n: 'max_profit', v: '4' }] },
  { activeIdx: 4, minPrice: 1, maxProfit: 5, updateType: 'profit', eq: 'profit = 6 - 1 = 5 > 4 → max_profit = 5', desc: 'price=6, profit=5. New max profit!', codeLines: [3, 6, 7], vars: [{ n: 'price', v: '6' }, { n: 'min_price', v: '1' }, { n: 'max_profit', v: '5' }] },
  { activeIdx: 5, minPrice: 1, maxProfit: 5, updateType: 'none', eq: 'profit = 4 - 1 = 3 < 5 → no change', desc: 'price=4, profit=3. Still below our max. No update.', codeLines: [3, 6], vars: [{ n: 'price', v: '4' }, { n: 'min_price', v: '1' }, { n: 'max_profit', v: '5' }] },
  { activeIdx: -2, minPrice: 1, maxProfit: 5, eq: 'return max_profit = 5', desc: 'Best trade: buy at 1, sell at 6 → profit = 5.', codeLines: [8], vars: [{ n: 'result', v: '5' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">maxProfit</span><span class="cg-op">(</span>prices<span class="cg-op">):</span>' },
  { html: '    min_price <span class="cg-op">=</span> <span class="cg-bi">float</span><span class="cg-op">(</span><span class="cg-str">\'inf\'</span><span class="cg-op">)</span>' },
  { html: '    max_profit <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> price <span class="cg-kw">in</span> prices<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if</span> price <span class="cg-op">&lt;</span> min_price<span class="cg-op">:</span>' },
  { html: '            min_price <span class="cg-op">=</span> price' },
  { html: '        <span class="cg-kw">elif</span> price <span class="cg-op">-</span> min_price <span class="cg-op">&gt;</span> max_profit<span class="cg-op">:</span>' },
  { html: '            max_profit <span class="cg-op">=</span> price <span class="cg-op">-</span> min_price' },
  { html: '    <span class="cg-kw">return</span> max_profit' },
];

interface Props { accColor: string }

export const BestTimeStock: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="best_time_stock.py" doneResult="5" accColor={accColor}>
    {(step) => {
      const s = step as BtStep;
      const minIdx = s.minPrice === 1 ? 1 : s.minPrice === 7 ? 0 : -1;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {PRICES.map((_, k) => <span key={k} className="viz-index-num" style={{ width: '40px' }}>[{k}]</span>)}
          </div>

          {/* Price bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.45rem', height: '90px', paddingLeft: '60px' }}>
            {PRICES.map((p, k) => {
              const isActive = k === s.activeIdx;
              const isMin = k === minIdx;
              const isPast = k < s.activeIdx || s.activeIdx === -2;
              const barColor = isMin && isPast ? '#22c55e' : isActive ? '#f59e0b' : isPast ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.1)';
              return (
                <div key={k} style={{ width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--disp)', fontSize: '.95rem', color: isActive ? '#f59e0b' : isMin && isPast ? '#22c55e' : 'rgba(255,255,255,.5)' }}>{p}</span>
                  <div style={{ width: '32px', background: barColor, borderRadius: '3px 3px 0 0', height: `${(p / MAX_PRICE) * 60}px`, transition: 'all .3s', boxShadow: isActive ? `0 0 10px ${barColor}77` : isMin && isPast ? '0 0 10px rgba(34,197,94,.4)' : 'none' }} />
                </div>
              );
            })}
          </div>

          {/* Trackers */}
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.4rem' }}>
            <div style={{ flex: 1, padding: '.4rem .6rem', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.2)', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(34,197,94,.7)', letterSpacing: '.12em', marginBottom: '.2rem' }}>MIN PRICE</div>
              <div style={{ fontFamily: 'var(--disp)', fontSize: '1.4rem', color: '#22c55e' }}>{s.minPrice ?? '∞'}</div>
              {s.updateType === 'min' && <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#22c55e', animation: 'vizFillPop .3s ease-out' }}>↓ new low</div>}
            </div>
            <div style={{ flex: 1, padding: '.4rem .6rem', background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(245,158,11,.7)', letterSpacing: '.12em', marginBottom: '.2rem' }}>MAX PROFIT</div>
              <div style={{ fontFamily: 'var(--disp)', fontSize: '1.4rem', color: '#f59e0b' }}>{s.maxProfit}</div>
              {s.updateType === 'profit' && <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#f59e0b', animation: 'vizFillPop .3s ease-out' }}>↑ new max</div>}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
