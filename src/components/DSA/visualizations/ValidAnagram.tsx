import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// s = "rat", t = "tar"
type VaStep = VizStep & {
  sIdx: number;   // which char of s is being processed (-1 = done with s phase)
  tIdx: number;   // which char of t is being processed (-1 = not started)
  count: Record<string, number>;
  matchKey?: string;  // key that just matched in t
};

const S = ['r', 'a', 't'];
const T = ['t', 'a', 'r'];

const STEPS: VaStep[] = [
  { sIdx: -1, tIdx: -1, count: {}, eq: 'count = {}', desc: 'len(s) == len(t) == 3 ✓. Initialise frequency map.', codeLines: [0, 1, 3], vars: [{ n: 'phase', v: 'count s' }] },
  { sIdx: 0, tIdx: -1, count: { r: 1 }, eq: 'count["r"] = 0 + 1 = 1', desc: 'c = "r" from s → increment count["r"].', codeLines: [4, 5], vars: [{ n: 'c', v: '"r"' }, { n: 'phase', v: 'count s' }] },
  { sIdx: 1, tIdx: -1, count: { r: 1, a: 1 }, eq: 'count["a"] = 0 + 1 = 1', desc: 'c = "a" from s → increment count["a"].', codeLines: [4, 5], vars: [{ n: 'c', v: '"a"' }, { n: 'phase', v: 'count s' }] },
  { sIdx: 2, tIdx: -1, count: { r: 1, a: 1, t: 1 }, eq: 'count["t"] = 0 + 1 = 1', desc: 'c = "t" from s → increment count["t"]. All of s counted.', codeLines: [4, 5], vars: [{ n: 'c', v: '"t"' }, { n: 'phase', v: 'count s' }] },
  { sIdx: -1, tIdx: 0, count: { r: 1, a: 1, t: 0 }, matchKey: 't', eq: 'count["t"] = 1 - 1 = 0', desc: 'c = "t" from t → count["t"] exists, decrement.', codeLines: [6, 7, 9], vars: [{ n: 'c', v: '"t"' }, { n: 'phase', v: 'verify t' }] },
  { sIdx: -1, tIdx: 1, count: { r: 1, a: 0, t: 0 }, matchKey: 'a', eq: 'count["a"] = 1 - 1 = 0', desc: 'c = "a" from t → count["a"] exists, decrement.', codeLines: [6, 7, 9], vars: [{ n: 'c', v: '"a"' }, { n: 'phase', v: 'verify t' }] },
  { sIdx: -1, tIdx: 2, count: { r: 0, a: 0, t: 0 }, matchKey: 'r', eq: 'count["r"] = 1 - 1 = 0', desc: 'c = "r" from t → count["r"] exists, decrement. All zero!', codeLines: [6, 7, 9], vars: [{ n: 'c', v: '"r"' }, { n: 'phase', v: 'verify t' }] },
  { sIdx: -1, tIdx: -1, count: { r: 0, a: 0, t: 0 }, eq: 'return True', desc: 'Every count is 0. Both strings use the same letters → True.', codeLines: [10], vars: [{ n: 'result', v: 'True' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">isAnagram</span><span class="cg-op">(</span>s<span class="cg-op">,</span> t<span class="cg-op">):</span>' },
  { html: '    <span class="cg-kw">if</span> <span class="cg-bi">len</span><span class="cg-op">(</span>s<span class="cg-op">) !=</span> <span class="cg-bi">len</span><span class="cg-op">(</span>t<span class="cg-op">):</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html: '    count <span class="cg-op">=</span> <span class="cg-op">{}</span>' },
  { html: '' },
  { html: '    <span class="cg-kw">for</span> c <span class="cg-kw">in</span> s<span class="cg-op">:</span>' },
  { html: '        count<span class="cg-op">[</span>c<span class="cg-op">] =</span> count<span class="cg-op">.</span><span class="cg-bi">get</span><span class="cg-op">(</span>c<span class="cg-op">,</span> <span class="cg-num">0</span><span class="cg-op">) +</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">for</span> c <span class="cg-kw">in</span> t<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if not</span> count<span class="cg-op">.</span><span class="cg-bi">get</span><span class="cg-op">(</span>c<span class="cg-op">):</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html: '' },
  { html: '        count<span class="cg-op">[</span>c<span class="cg-op">] -=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
];

const CHAR_COLORS: Record<string, string> = { r: '#e11d48', a: '#2563eb', t: '#16a34a' };

interface Props { accColor: string }

export const ValidAnagram: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="valid_anagram.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as VaStep;
      const inSPhase = s.tIdx === -1 && !step.done;
      const inTPhase = s.tIdx >= 0;

      return (
        <>
          {/* s string */}
          <div>
            <div style={{ display: 'flex', gap: '.8rem', marginBottom: '.3rem' }}>
              <div>
                <span className="viz-section-lbl">s = "rat"</span>
                <div style={{ display: 'flex', gap: '.3rem' }}>
                  {S.map((ch, k) => {
                    const isActive = inSPhase && k === s.sIdx;
                    const isPast = s.sIdx > k || s.tIdx >= 0 || step.done;
                    const c = CHAR_COLORS[ch];
                    return (
                      <div key={k} className="viz-char-cell" style={{ background: isActive ? c : isPast ? c + '44' : 'rgba(255,255,255,.06)', border: `1px solid ${isActive ? c : isPast ? c + '55' : 'rgba(255,255,255,.12)'}`, transform: isActive ? 'scale(1.12)' : undefined, boxShadow: isActive ? `0 0 14px ${c}55` : undefined }}>
                        {ch}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="viz-section-lbl">t = "tar"</span>
                <div style={{ display: 'flex', gap: '.3rem' }}>
                  {T.map((ch, k) => {
                    const isActive = inTPhase && k === s.tIdx;
                    const isPast = inTPhase && k < s.tIdx;
                    const c = CHAR_COLORS[ch];
                    return (
                      <div key={k} className="viz-char-cell" style={{ background: isActive ? c : isPast ? c + '44' : 'rgba(255,255,255,.06)', border: `1px solid ${isActive ? c : isPast ? c + '55' : 'rgba(255,255,255,.12)'}`, transform: isActive ? 'scale(1.12)' : undefined, boxShadow: isActive ? `0 0 14px ${c}55` : undefined }}>
                        {ch}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Frequency map */}
          <div>
            <span className="viz-section-lbl">count dict</span>
            <div className="viz-dict">
              {Object.entries(s.count).length === 0 && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>&#123; &#125;</span>
              )}
              {Object.entries(s.count).map(([k, v]) => {
                const c = CHAR_COLORS[k] ?? '#aaa';
                const isMatch = s.matchKey === k;
                const isZero = v === 0;
                return (
                  <div key={k} className={`viz-entry${isMatch ? ' viz-entry--match' : ''}${isZero && !isMatch ? ' viz-entry--zero' : ''}`}>
                    <span className="viz-entry-k" style={{ color: c }}>&quot;{k}&quot;</span>
                    <span className="viz-entry-sep">:</span>
                    <span className="viz-entry-v" style={{ color: isZero ? 'rgba(255,255,255,.3)' : undefined }}>{v}</span>
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
