import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// ransomNote = "aa", magazine = "aab"
const NOTE = ['a', 'a'];
const MAG  = ['a', 'a', 'b'];
const CHAR_COLORS: Record<string, string> = { a: '#2563eb', b: '#16a34a' };

type RnStep = VizStep & { magCount: Record<string, number>; noteIdx: number; ok?: boolean; failChar?: string };

const STEPS: RnStep[] = [
  { noteIdx: -1, magCount: {}, eq: 'count = {}', desc: 'Count every character in the magazine — our "budget".', codeLines: [0, 1, 2], vars: [{ n: 'phase', v: 'count mag' }] },
  { noteIdx: -1, magCount: { a: 1 }, eq: 'count["a"] = 1', desc: 'c="a": count["a"]++', codeLines: [2], vars: [{ n: 'c', v: '"a"' }, { n: 'count', v: '{a:1}' }] },
  { noteIdx: -1, magCount: { a: 2 }, eq: 'count["a"] = 2', desc: 'c="a": count["a"]++', codeLines: [2], vars: [{ n: 'c', v: '"a"' }, { n: 'count', v: '{a:2}' }] },
  { noteIdx: -1, magCount: { a: 2, b: 1 }, eq: 'count["b"] = 1', desc: 'c="b": count["b"]++. Magazine counted.', codeLines: [2], vars: [{ n: 'c', v: '"b"' }, { n: 'count', v: '{a:2,b:1}' }] },
  { noteIdx: 0,  magCount: { a: 1, b: 1 }, ok: undefined, eq: 'note[0]="a" — count["a"]=2>0 → decrement to 1', desc: 'Spend one "a" from magazine budget.', codeLines: [3, 4, 5], vars: [{ n: 'c', v: '"a"' }, { n: 'count[a]', v: '1' }] },
  { noteIdx: 1,  magCount: { a: 0, b: 1 }, ok: undefined, eq: 'note[1]="a" — count["a"]=1>0 → decrement to 0', desc: 'Spend another "a". Budget now 0.', codeLines: [3, 4, 5], vars: [{ n: 'c', v: '"a"' }, { n: 'count[a]', v: '0' }] },
  { noteIdx: -2, magCount: { a: 0, b: 1 }, ok: true, eq: 'return True', desc: 'All ransom note characters satisfied from magazine. Return True.', codeLines: [6], vars: [{ n: 'result', v: 'True' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">canConstruct</span><span class="cg-op">(</span>ransomNote<span class="cg-op">,</span> magazine<span class="cg-op">):</span>' },
  { html: '    count <span class="cg-op">=</span> <span class="cg-op">{}</span>' },
  { html: '    <span class="cg-kw">for</span> c <span class="cg-kw">in</span> magazine<span class="cg-op">:</span> count<span class="cg-op">[</span>c<span class="cg-op">] =</span> count<span class="cg-op">.</span><span class="cg-bi">get</span><span class="cg-op">(</span>c<span class="cg-op">,</span><span class="cg-num">0</span><span class="cg-op">)+</span><span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">for</span> c <span class="cg-kw">in</span> ransomNote<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if</span> count<span class="cg-op">.</span><span class="cg-bi">get</span><span class="cg-op">(</span>c<span class="cg-op">,</span><span class="cg-num">0</span><span class="cg-op">) ==</span> <span class="cg-num">0</span><span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html: '        count<span class="cg-op">[</span>c<span class="cg-op">] -=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
];

interface Props { accColor: string }

export const RansomNote: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="ransom_note.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as RnStep;
      const inNotePhase = s.noteIdx >= 0 || s.noteIdx === -2;
      return (
        <>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <div>
              <span className="viz-section-lbl">RANSOM NOTE</span>
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {NOTE.map((ch, k) => {
                  const isActive = k === s.noteIdx;
                  const isPast = k < s.noteIdx || s.noteIdx === -2;
                  const c = CHAR_COLORS[ch] ?? '#aaa';
                  return <div key={k} className="viz-char-cell" style={{ background: isActive ? c + '55' : isPast ? c + '22' : 'rgba(255,255,255,.06)', border: `1px solid ${isActive ? c : isPast ? c + '44' : 'rgba(255,255,255,.12)'}`, transform: isActive ? 'scale(1.12)' : undefined }}>{ch}</div>;
                })}
              </div>
            </div>
            <div>
              <span className="viz-section-lbl">MAGAZINE</span>
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {MAG.map((ch, k) => {
                  const c = CHAR_COLORS[ch] ?? '#aaa';
                  const budget = s.magCount[ch] ?? 0;
                  const spent = MAG.slice(0, k + 1).filter(x => x === ch).length > budget + (s.magCount[ch] ?? 0);
                  return <div key={k} className="viz-char-cell" style={{ background: c + '22', border: `1px solid ${c}44` }}>{ch}</div>;
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '.5rem' }}>
            <span className="viz-section-lbl">MAGAZINE BUDGET (count)</span>
            <div className="viz-dict">
              {Object.keys(s.magCount).length === 0 && <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>&#123; &#125;</span>}
              {Object.entries(s.magCount).map(([ch, v]) => {
                const c = CHAR_COLORS[ch] ?? '#aaa';
                const isZero = v === 0;
                return (
                  <div key={ch} className={`viz-entry${isZero ? ' viz-entry--zero' : ''}`}>
                    <span className="viz-entry-k" style={{ color: c }}>&quot;{ch}&quot;</span>
                    <span className="viz-entry-sep">:</span>
                    <span className="viz-entry-v" style={{ color: isZero ? 'rgba(255,255,255,.3)' : c }}>{v}</span>
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
