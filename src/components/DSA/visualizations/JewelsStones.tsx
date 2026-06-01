import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// jewels = "aA", stones = "aAAb"
const JEWELS = ['a', 'A'];
const STONES = ['a', 'A', 'A', 'b'];

type JsStep = VizStep & { activeStoneIdx: number; count: number; isJewel?: boolean };

const STEPS: JsStep[] = [
  { activeStoneIdx: -1, count: 0, eq: 'jewel_set = {"a", "A"}', desc: 'Convert jewels string to a set for O(1) lookup. count = 0.', codeLines: [0, 1, 2], vars: [{ n: 'count', v: '0' }] },
  { activeStoneIdx: 0, count: 1, isJewel: true, eq: '"a" in jewel_set → YES', desc: 'stone="a" is in the jewel set → count += 1.', codeLines: [3, 4, 5], vars: [{ n: 'stone', v: '"a"' }, { n: 'count', v: '1' }] },
  { activeStoneIdx: 1, count: 2, isJewel: true, eq: '"A" in jewel_set → YES', desc: 'stone="A" is in the jewel set → count += 1.', codeLines: [3, 4, 5], vars: [{ n: 'stone', v: '"A"' }, { n: 'count', v: '2' }] },
  { activeStoneIdx: 2, count: 3, isJewel: true, eq: '"A" in jewel_set → YES', desc: 'stone="A" is in the jewel set → count += 1.', codeLines: [3, 4, 5], vars: [{ n: 'stone', v: '"A"' }, { n: 'count', v: '3' }] },
  { activeStoneIdx: 3, count: 3, isJewel: false, eq: '"b" in jewel_set → NO', desc: 'stone="b" is NOT a jewel → skip.', codeLines: [3, 4], vars: [{ n: 'stone', v: '"b"' }, { n: 'count', v: '3' }] },
  { activeStoneIdx: -2, count: 3, eq: 'return 3', desc: '3 of the 4 stones are jewels.', codeLines: [6], vars: [{ n: 'count', v: '3' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">numJewelsInStones</span><span class="cg-op">(</span>jewels<span class="cg-op">,</span> stones<span class="cg-op">):</span>' },
  { html: '    jewel_set <span class="cg-op">=</span> <span class="cg-bi">set</span><span class="cg-op">(</span>jewels<span class="cg-op">)</span>' },
  { html: '    count <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> stone <span class="cg-kw">in</span> stones<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if</span> stone <span class="cg-kw">in</span> jewel_set<span class="cg-op">:</span>' },
  { html: '            count <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">return</span> count' },
];

const STONE_COLOR = (ch: string, active: boolean, isJewel?: boolean) => {
  if (active && isJewel) return '#22c55e';
  if (active && !isJewel) return '#e11d48';
  if (!active && ['a', 'A'].includes(ch)) return '#2563eb';
  return 'rgba(255,255,255,.08)';
};

interface Props { accColor: string }

export const JewelsStones: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="jewels_and_stones.py" doneResult="3" accColor={accColor}>
    {(step) => {
      const s = step as JsStep;
      return (
        <>
          {/* Jewel set */}
          <div>
            <span className="viz-section-lbl">JEWEL SET {"{"}"a", "A"{"}"}</span>
            <div style={{ display: 'flex', gap: '.3rem' }}>
              {JEWELS.map((j, k) => (
                <div key={k} className="viz-char-cell" style={{ background: '#2563eb44', border: '1px solid #2563eb88', color: '#7dd3fc', fontSize: '1.4rem' }}>
                  {j}
                </div>
              ))}
            </div>
          </div>

          {/* Stones row */}
          <div style={{ marginTop: '.4rem' }}>
            <span className="viz-section-lbl">STONES</span>
            <div style={{ display: 'flex', gap: '.3rem', alignItems: 'center' }}>
              {STONES.map((st, k) => {
                const isActive = k === s.activeStoneIdx;
                const isPast = k < s.activeStoneIdx || s.activeStoneIdx === -2;
                const isJewelStone = ['a', 'A'].includes(st);
                const bg = STONE_COLOR(st, isActive, s.isJewel);
                const border = isActive ? (s.isJewel ? '#22c55e' : '#e11d48') : isPast && isJewelStone ? '#2563eb55' : 'rgba(255,255,255,.12)';
                return (
                  <div key={k} className="viz-char-cell" style={{ background: bg, border: `1px solid ${border}`, transform: isActive ? 'scale(1.14)' : undefined, boxShadow: isActive ? `0 0 14px ${s.isJewel ? '#22c55e' : '#e11d48'}55` : undefined }}>
                    {st}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Count tracker */}
          <div style={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span className="viz-section-lbl" style={{ marginBottom: 0 }}>count</span>
            <span style={{ fontFamily: 'var(--disp)', fontSize: '2.2rem', color: '#22c55e', lineHeight: 1 }}>{s.count}</span>
            {s.isJewel === true && s.activeStoneIdx >= 0 && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#22c55e', letterSpacing: '.06em', animation: 'vizFillPop .3s ease-out' }}>+1</span>
            )}
            {s.isJewel === false && s.activeStoneIdx >= 0 && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#e11d48', letterSpacing: '.06em' }}>skip</span>
            )}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
