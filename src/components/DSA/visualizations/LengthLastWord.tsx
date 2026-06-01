import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// s = "   fly me   to   the moon  "
type LlwStep = VizStep & {
  phase: 'init' | 'strip' | 'split' | 'last' | 'len' | 'done';
  stripped?: string;
  parts?: string[];
  lastWord?: string;
};

const STEPS: LlwStep[] = [
  { phase: 'init', eq: 's = "   fly me   to   the moon  "', desc: 'Input has leading/trailing spaces and multiple spaces between words.', codeLines: [0], vars: [{ n: 's.len', v: '27' }] },
  { phase: 'strip', stripped: 'fly me   to   the moon', eq: 's.strip() → "fly me   to   the moon"', desc: '.strip() removes all leading and trailing whitespace.', codeLines: [1], vars: [{ n: 'stripped', v: '22 chars' }] },
  { phase: 'split', stripped: 'fly me   to   the moon', parts: ['fly','me','to','the','moon'], eq: '.split() → ["fly","me","to","the","moon"]', desc: '.split() with no args splits on ANY whitespace and ignores extra spaces.', codeLines: [1], vars: [{ n: 'parts.len', v: '5' }] },
  { phase: 'last', stripped: 'fly me   to   the moon', parts: ['fly','me','to','the','moon'], lastWord: 'moon', eq: 'parts[-1] = "moon"', desc: 'Index -1 means the LAST element. That is our last word.', codeLines: [2], vars: [{ n: 'last', v: '"moon"' }] },
  { phase: 'len', stripped: 'fly me   to   the moon', parts: ['fly','me','to','the','moon'], lastWord: 'moon', eq: 'len("moon") = 4', desc: 'Count the characters in "moon": m-o-o-n = 4.', codeLines: [2], vars: [{ n: 'result', v: '4' }] },
  { phase: 'done', stripped: 'fly me   to   the moon', parts: ['fly','me','to','the','moon'], lastWord: 'moon', eq: 'return 4', desc: 'The last word "moon" has 4 characters.', codeLines: [2], vars: [{ n: 'result', v: '4' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">lengthOfLastWord</span><span class="cg-op">(</span>s<span class="cg-op">):</span>' },
  { html: '    parts <span class="cg-op">=</span> s<span class="cg-op">.</span><span class="cg-bi">strip</span><span class="cg-op">().</span><span class="cg-bi">split</span><span class="cg-op">()</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-bi">len</span><span class="cg-op">(</span>parts<span class="cg-op">[-</span><span class="cg-num">1</span><span class="cg-op">])</span>' },
];

const WORD_COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb', '#7c3aed'] as const;

interface Props { accColor: string }

export const LengthLastWord: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="length_last_word.py" doneResult="4" accColor={accColor}>
    {(step) => {
      const s = step as LlwStep;
      const showStripped = s.phase !== 'init';
      const showParts = s.phase === 'split' || s.phase === 'last' || s.phase === 'len' || s.phase === 'done';
      const showLast = s.phase === 'last' || s.phase === 'len' || s.phase === 'done';
      const showLen = s.phase === 'len' || s.phase === 'done';

      return (
        <>
          {/* Raw input */}
          <div>
            <span className="viz-section-lbl">INPUT</span>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', padding: '.35rem .6rem', letterSpacing: '.03em', color: 'rgba(255,255,255,.7)', borderRadius: '3px' }}>
              &quot;&nbsp;&nbsp;&nbsp;fly me&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;the moon&nbsp;&nbsp;&quot;
            </div>
          </div>

          {/* After strip */}
          {showStripped && (
            <div style={{ marginTop: '.4rem' }}>
              <span className="viz-section-lbl">.strip() — spaces removed</span>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', padding: '.35rem .6rem', letterSpacing: '.03em', color: 'rgba(255,255,255,.85)', borderRadius: '3px' }}>
                &quot;{s.stripped}&quot;
              </div>
            </div>
          )}

          {/* After split */}
          {showParts && s.parts && (
            <div style={{ marginTop: '.4rem' }}>
              <span className="viz-section-lbl">.split() — word list</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                {s.parts.map((word, k) => {
                  const isLast = k === s.parts!.length - 1;
                  const c = WORD_COLORS[k % WORD_COLORS.length];
                  return (
                    <div key={k} style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', padding: '.2rem .5rem', background: (showLast && isLast ? c : c) + (showLast && isLast ? '33' : '18'), border: `1px solid ${c}${showLast && isLast ? '77' : '33'}`, color: showLast && isLast ? c : 'rgba(255,255,255,.65)', borderRadius: '3px', transform: showLast && isLast ? 'scale(1.08)' : undefined, animation: showLast && isLast && s.phase === 'last' ? 'vizFillPop .3s ease-out' : undefined }}>
                      [{k}] &quot;{word}&quot;
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Last word + length */}
          {showLast && s.lastWord && (
            <div style={{ marginTop: '.4rem', display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <div>
                <span className="viz-section-lbl">parts[-1]</span>
                <div style={{ fontFamily: 'var(--disp)', fontSize: '1.8rem', color: WORD_COLORS[4], letterSpacing: '.06em' }}>&quot;{s.lastWord}&quot;</div>
              </div>
              {showLen && (
                <div>
                  <span className="viz-section-lbl">len()</span>
                  <div style={{ fontFamily: 'var(--disp)', fontSize: '2.4rem', color: '#22c55e', letterSpacing: '.04em' }}>4</div>
                </div>
              )}
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
