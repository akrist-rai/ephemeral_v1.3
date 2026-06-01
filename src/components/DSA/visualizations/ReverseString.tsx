import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// s = ["h","e","l","l","o"]
type RvStep = VizStep & { chars: string[]; left: number; right: number; done: boolean };

const STEPS: RvStep[] = [
  { chars: ['h','e','l','l','o'], left: 0, right: 4, eq: 'left = 0   right = 4', desc: 'Initialise two pointers at opposite ends of the array.', codeLines: [0, 1], vars: [{ n: 'left', v: '0' }, { n: 'right', v: '4' }], done: false },
  { chars: ['o','e','l','l','h'], left: 1, right: 3, eq: 'swap s[0] ↔ s[4]   h ↔ o', desc: 'Swap the first and last characters. Move both pointers inward.', codeLines: [2, 3, 4, 5], vars: [{ n: 'left', v: '1' }, { n: 'right', v: '3' }], done: false },
  { chars: ['o','l','l','e','h'], left: 2, right: 2, eq: 'swap s[1] ↔ s[3]   e ↔ l', desc: 'Swap the second and fourth characters. Pointers now meet.', codeLines: [2, 3, 4, 5], vars: [{ n: 'left', v: '2' }, { n: 'right', v: '2' }], done: false },
  { chars: ['o','l','l','e','h'], left: 2, right: 2, eq: 'left == right → STOP', desc: 'Pointers met at the middle. No more swaps needed.', codeLines: [2], vars: [{ n: 'left', v: '2' }, { n: 'right', v: '2' }], done: false },
  { chars: ['o','l','l','e','h'], left: -1, right: -1, eq: 'return ["o","l","l","e","h"]', desc: 'Array is reversed in-place. All swaps complete.', codeLines: [0], vars: [{ n: 'left', v: '—' }, { n: 'right', v: '—' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">reverseString</span><span class="cg-op">(</span>s<span class="cg-op">):</span>' },
  { html: '    left<span class="cg-op">,</span> right <span class="cg-op">=</span> <span class="cg-num">0</span><span class="cg-op">,</span> <span class="cg-bi">len</span><span class="cg-op">(</span>s<span class="cg-op">) -</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">while</span> left <span class="cg-op">&lt;</span> right<span class="cg-op">:</span>' },
  { html: '        s<span class="cg-op">[</span>left<span class="cg-op">],</span> s<span class="cg-op">[</span>right<span class="cg-op">] =</span> s<span class="cg-op">[</span>right<span class="cg-op">],</span> s<span class="cg-op">[</span>left<span class="cg-op">]</span>' },
  { html: '        left <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html: '        right <span class="cg-op">-=</span> <span class="cg-num">1</span>' },
];

interface Props { accColor: string }

export const ReverseString: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="reverse_string.py" doneResult='["o","l","l","e","h"]' accColor={accColor}>
    {(step) => {
      const s = step as RvStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {s.chars.map((_, k) => <span key={k} className="viz-index-num">[{k}]</span>)}
          </div>

          <div className="viz-array-row">
            <span className="viz-row-label">s</span>
            {s.chars.map((ch, k) => {
              const isLeft = k === s.left;
              const isRight = k === s.right && s.right !== s.left;
              const isDone = s.done;
              const bg = isLeft ? '#e11d48' : isRight ? '#2563eb' : isDone ? '#16a34a' : 'rgba(255,255,255,.08)';
              const shadow = isLeft ? '0 4px 20px rgba(225,29,72,.35)' : isRight ? '0 4px 20px rgba(37,99,235,.35)' : isDone ? '0 4px 20px rgba(22,163,74,.2)' : 'none';
              return (
                <div key={k} className={`viz-char-cell${(isLeft || isRight) ? ' viz-char-cell--active' : isDone ? ' viz-char-cell--done' : ''}`}
                  style={{ background: bg, boxShadow: shadow }}>
                  {ch}
                </div>
              );
            })}
          </div>

          {/* Pointer labels */}
          <div style={{ display: 'flex', gap: '.45rem', paddingLeft: '60px', height: '22px', alignItems: 'flex-start' }}>
            {s.chars.map((_, k) => (
              <div key={k} style={{ width: '44px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '.58rem', letterSpacing: '.08em' }}>
                {k === s.left && s.left !== -1 && <span style={{ color: '#e11d48' }}>L</span>}
                {k === s.right && s.right !== s.left && s.right !== -1 && <span style={{ color: '#2563eb' }}>R</span>}
                {k === s.left && k === s.right && s.left !== -1 && <span style={{ color: '#f59e0b' }}>L=R</span>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '.4rem', padding: '.5rem .7rem', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '4px' }}>
            <span className="viz-section-lbl" style={{ marginBottom: '.2rem' }}>POINTER LEGEND</span>
            <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--mono)', fontSize: '.68rem' }}>
              <span><span style={{ color: '#e11d48', fontWeight: 700 }}>L</span> = left pointer</span>
              <span><span style={{ color: '#2563eb', fontWeight: 700 }}>R</span> = right pointer</span>
              <span><span style={{ color: '#f59e0b', fontWeight: 700 }}>L=R</span> = met, stop</span>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
