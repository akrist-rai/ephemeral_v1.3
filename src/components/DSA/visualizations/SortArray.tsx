import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [5, 2, 3, 1]  merge sort → [1, 2, 3, 5]
type SaStep = VizStep & {
  phase: 'input' | 'split1' | 'split2' | 'sortL' | 'sortR' | 'merge1' | 'merge2' | 'merge3' | 'merge4' | 'done';
  left: number[]; right: number[]; merged: number[];
};

const C = ['#e11d48','#ea580c','#16a34a','#2563eb'] as const;

const STEPS: SaStep[] = [
  { phase:'input',  left:[], right:[], merged:[],         eq:'nums = [5, 2, 3, 1]', desc:'Merge sort: recursively divide, then merge sorted halves.', codeLines:[0,1], vars:[{n:'n',v:'4'}] },
  { phase:'split1', left:[5,2], right:[3,1], merged:[],   eq:'divide → [5,2] | [3,1]', desc:'Split at midpoint. Left half = [5,2], right half = [3,1].', codeLines:[2,3], vars:[{n:'mid',v:'2'}] },
  { phase:'split2', left:[5,2], right:[3,1], merged:[],   eq:'divide again → [5]|[2]  [3]|[1]', desc:'Each half split into single elements. Single elements are trivially sorted.', codeLines:[2,3], vars:[{n:'level',v:'2'}] },
  { phase:'sortL',  left:[2,5], right:[3,1], merged:[],   eq:'merge [5],[2] → [2,5]', desc:'Merge left pair: compare 5 vs 2 → 2 first. Left half sorted: [2,5].', codeLines:[4,5], vars:[{n:'left',v:'[2,5]'}] },
  { phase:'sortR',  left:[2,5], right:[1,3], merged:[],   eq:'merge [3],[1] → [1,3]', desc:'Merge right pair: compare 3 vs 1 → 1 first. Right half sorted: [1,3].', codeLines:[4,5], vars:[{n:'right',v:'[1,3]'}] },
  { phase:'merge1', left:[2,5], right:[1,3], merged:[1],  eq:'compare 2 vs 1 → take 1', desc:'Final merge: compare fronts. 1 < 2 → take 1 from right.', codeLines:[4,5], vars:[{n:'merged',v:'[1]'}] },
  { phase:'merge2', left:[2,5], right:[1,3], merged:[1,2],eq:'compare 2 vs 3 → take 2', desc:'2 < 3 → take 2 from left.', codeLines:[4,5], vars:[{n:'merged',v:'[1,2]'}] },
  { phase:'merge3', left:[2,5], right:[1,3], merged:[1,2,3],eq:'compare 5 vs 3 → take 3', desc:'5 > 3 → take 3 from right.', codeLines:[4,5], vars:[{n:'merged',v:'[1,2,3]'}] },
  { phase:'merge4', left:[2,5], right:[1,3], merged:[1,2,3,5],eq:'take remaining 5 → done', desc:'Right exhausted. Append remaining left element 5.', codeLines:[4,5], vars:[{n:'merged',v:'[1,2,3,5]'}] },
  { phase:'done',   left:[2,5], right:[1,3], merged:[1,2,3,5],eq:'return [1,2,3,5]', desc:'Array fully sorted. O(n log n) time, O(n) space.', codeLines:[6], vars:[{n:'result',v:'[1,2,3,5]'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">sortArray</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html:'    <span class="cg-kw">if</span> <span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">) &lt;=</span> <span class="cg-num">1</span><span class="cg-op">:</span> <span class="cg-kw">return</span> nums' },
  { html:'    mid <span class="cg-op">=</span> <span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">) //</span> <span class="cg-num">2</span>' },
  { html:'    L <span class="cg-op">=</span> sortArray<span class="cg-op">(</span>nums<span class="cg-op">[:mid]);</span> R <span class="cg-op">=</span> sortArray<span class="cg-op">(</span>nums<span class="cg-op">[mid:])</span>' },
  { html:'    res<span class="cg-op">,</span> i<span class="cg-op">,</span> j <span class="cg-op">= [], </span><span class="cg-num">0</span><span class="cg-op">, </span><span class="cg-num">0</span>' },
  { html:'    <span class="cg-kw">while</span> i <span class="cg-op">&lt;</span> <span class="cg-bi">len</span><span class="cg-op">(</span>L<span class="cg-op">)</span> <span class="cg-kw">and</span> j <span class="cg-op">&lt;</span> <span class="cg-bi">len</span><span class="cg-op">(</span>R<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">return</span> res <span class="cg-op">+</span> L<span class="cg-op">[</span>i<span class="cg-op">:] +</span> R<span class="cg-op">[</span>j<span class="cg-op">:]</span>' },
];

const Cell: React.FC<{ val: number; idx: number; highlight?: boolean }> = ({ val, idx, highlight }) => (
  <div className="viz-dp-cell" style={{ background: highlight ? C[idx]+'44' : C[idx]+'22', borderColor: highlight ? C[idx] : C[idx]+'44', color: '#fff', fontSize:'1.3rem', width:'44px', height:'44px' }}>{val}</div>
);

interface Props { accColor: string }
export const SortArray: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="sort_array.py" doneResult="[1,2,3,5]" accColor={accColor}>
    {(step) => {
      const s = step as SaStep;
      const origColors: Record<number, number> = { 5:0, 2:1, 3:2, 1:3 };
      const colorOf = (v: number) => origColors[v] ?? 0;
      return (
        <>
          {/* Input */}
          <div>
            <span className="viz-section-lbl">INPUT</span>
            <div style={{display:'flex',gap:'.3rem'}}>
              {[5,2,3,1].map((v,k) => <Cell key={k} val={v} idx={colorOf(v)} />)}
            </div>
          </div>

          {/* Split visualization */}
          {s.phase !== 'input' && (
            <div style={{marginTop:'.4rem'}}>
              <span className="viz-section-lbl">DIVIDE</span>
              <div style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontFamily:'var(--mono)',fontSize:'.58rem',color:'rgba(255,255,255,.4)',marginBottom:'.2rem'}}>LEFT</div>
                  <div style={{display:'flex',gap:'.3rem'}}>
                    {s.left.map((v,k) => <Cell key={k} val={v} idx={colorOf(v)} highlight />)}
                  </div>
                </div>
                <div style={{fontFamily:'var(--disp)',fontSize:'1.2rem',color:'rgba(255,255,255,.3)',paddingTop:'10px'}}>|</div>
                <div>
                  <div style={{fontFamily:'var(--mono)',fontSize:'.58rem',color:'rgba(255,255,255,.4)',marginBottom:'.2rem'}}>RIGHT</div>
                  <div style={{display:'flex',gap:'.3rem'}}>
                    {s.right.map((v,k) => <Cell key={k} val={v} idx={colorOf(v)} highlight />)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Merged output */}
          {s.merged.length > 0 && (
            <div style={{marginTop:'.4rem'}}>
              <span className="viz-section-lbl">MERGED</span>
              <div style={{display:'flex',gap:'.3rem'}}>
                {s.merged.map((v,k) => <Cell key={k} val={v} idx={colorOf(v)} highlight />)}
                {Array.from({length: 4 - s.merged.length}).map((_,k) => (
                  <div key={k} className="viz-dp-cell viz-dp-cell--empty" style={{width:'44px',height:'44px',fontSize:'1rem'}}>?</div>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
