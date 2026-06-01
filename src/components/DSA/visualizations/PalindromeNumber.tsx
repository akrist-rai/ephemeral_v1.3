import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// x = 121
type PnStep = VizStep & { phase: 'init' | 'str' | 'rev' | 'cmp' | 'done'; s?: string; rev?: string; result?: boolean };

const STEPS: PnStep[] = [
  { phase: 'init', eq: 'x = 121   x ≥ 0 ✓', desc: 'x is not negative — negative numbers can never be palindromes.', codeLines: [0, 1], vars: [{ n: 'x', v: '121' }] },
  { phase: 'str',  s: '121', eq: 's = str(121) = "121"', desc: 'Convert the integer to a string so we can compare characters.', codeLines: [2], vars: [{ n: 'x', v: '121' }, { n: 's', v: '"121"' }] },
  { phase: 'rev',  s: '121', rev: '121', eq: 's[::-1] = "121"', desc: 'Reverse the string. Python slice [::-1] reads it backwards.', codeLines: [3], vars: [{ n: 's', v: '"121"' }, { n: 'rev', v: '"121"' }] },
  { phase: 'cmp',  s: '121', rev: '121', result: true, eq: '"121" == "121" → True', desc: 'Forward equals reversed — it IS a palindrome.', codeLines: [3], vars: [{ n: 'result', v: 'True' }] },
  { phase: 'done', s: '121', rev: '121', result: true, eq: 'return True', desc: '121 reads the same forwards and backwards.', codeLines: [3], vars: [{ n: 'result', v: 'True' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">isPalindrome</span><span class="cg-op">(</span>x<span class="cg-op">):</span>' },
  { html: '    <span class="cg-kw">if</span> x <span class="cg-op">&lt;</span> <span class="cg-num">0</span><span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html: '    s <span class="cg-op">=</span> <span class="cg-bi">str</span><span class="cg-op">(</span>x<span class="cg-op">)</span>' },
  { html: '    <span class="cg-kw">return</span> s <span class="cg-op">==</span> s<span class="cg-op">[</span><span class="cg-op">::-</span><span class="cg-num">1</span><span class="cg-op">]</span>' },
];

const CHAR_COLOR = '#2563eb';
const MATCH_COLOR = '#22c55e';
const DIFF_COLOR  = '#e11d48';

interface Props { accColor: string }

export const PalindromeNumber: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="palindrome_number.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as PnStep;
      const chars = (s.s ?? '').split('');
      const revChars = (s.rev ?? '').split('');
      const matched = s.result === true;
      const showRev = s.phase === 'rev' || s.phase === 'cmp' || s.phase === 'done';
      const showCmp = s.phase === 'cmp' || s.phase === 'done';

      return (
        <>
          {/* Input number */}
          <div>
            <span className="viz-section-lbl">INPUT NUMBER</span>
            <div style={{ fontFamily: 'var(--disp)', fontSize: '3rem', letterSpacing: '.08em', color: '#f59e0b', lineHeight: 1 }}>
              121
            </div>
            {s.phase === 'init' && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: '#22c55e', marginTop: '.3rem', letterSpacing: '.06em' }}>
                121 ≥ 0 ✓ not negative
              </div>
            )}
          </div>

          {/* String representation */}
          {s.s && (
            <div style={{ marginTop: '.4rem' }}>
              <span className="viz-section-lbl">AS STRING s</span>
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {chars.map((ch, k) => (
                  <div key={k} className="viz-char-cell" style={{ background: (showCmp && matched ? MATCH_COLOR : CHAR_COLOR) + '33', border: `1px solid ${showCmp && matched ? MATCH_COLOR : CHAR_COLOR}66` }}>
                    {ch}
                  </div>
                ))}
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', alignSelf: 'center', marginLeft: '.4rem' }}>← forward</span>
              </div>
            </div>
          )}

          {/* Reversed */}
          {showRev && (
            <div style={{ marginTop: '.4rem' }}>
              <span className="viz-section-lbl">REVERSED s[::-1]</span>
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {revChars.map((ch, k) => (
                  <div key={k} className="viz-char-cell" style={{ background: (showCmp && matched ? MATCH_COLOR : '#7c3aed') + '33', border: `1px solid ${showCmp && matched ? MATCH_COLOR : '#7c3aed'}66` }}>
                    {ch}
                  </div>
                ))}
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.4)', alignSelf: 'center', marginLeft: '.4rem' }}>← backward</span>
              </div>
            </div>
          )}

          {/* Comparison result */}
          {showCmp && (
            <div style={{ marginTop: '.5rem', padding: '.45rem .75rem', background: matched ? 'rgba(34,197,94,.06)' : 'rgba(225,29,72,.06)', border: `1px solid ${matched ? 'rgba(34,197,94,.3)' : 'rgba(225,29,72,.3)'}`, fontFamily: 'var(--mono)', fontSize: '.75rem', letterSpacing: '.06em' }}>
              <span style={{ color: matched ? '#22c55e' : '#e11d48', fontWeight: 700 }}>
                {matched ? '✓ "121" == "121" — PALINDROME' : '✗ not equal — NOT a palindrome'}
              </span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
