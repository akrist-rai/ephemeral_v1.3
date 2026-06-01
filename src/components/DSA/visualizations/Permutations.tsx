import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums=[1,2,3] → 6 permutations via swap-based backtracking
const COLORS = ['#e11d48','#2563eb','#16a34a'] as const;
type PmStep = VizStep & { arr: number[]; result: number[][]; fixedUntil: number };

const STEPS: PmStep[] = [
  { arr:[1,2,3], result:[],                                              fixedUntil:0, eq:'start: [1,2,3]  fix pos 0', desc:'Backtracking: fix each choice at position 0, recurse for rest.', codeLines:[0,1,2], vars:[{n:'idx',v:'0'}] },
  { arr:[1,2,3], result:[[1,2,3]],                                       fixedUntil:1, eq:'fix 1 at [0] → permute [2,3] → [1,2,3],[1,3,2]', desc:'1 fixed at pos 0. Permuting [2,3] yields [1,2,3] and [1,3,2].', codeLines:[3,4,5], vars:[{n:'fixed',v:'1'},{n:'found',v:'2'}] },
  { arr:[1,2,3], result:[[1,2,3],[1,3,2]],                               fixedUntil:1, eq:'swap 1↔2 → fix 2 at [0] → [2,1,3],[2,3,1]', desc:'Swap pos0↔pos1: 2 now at front. Permuting [1,3] yields [2,1,3] and [2,3,1].', codeLines:[3,4,5], vars:[{n:'fixed',v:'2'},{n:'found',v:'4'}] },
  { arr:[1,2,3], result:[[1,2,3],[1,3,2],[2,1,3],[2,3,1]],               fixedUntil:1, eq:'swap 1↔3 → fix 3 at [0] → [3,2,1],[3,1,2]', desc:'Swap pos0↔pos2: 3 now at front. Last two permutations.', codeLines:[3,4,5], vars:[{n:'fixed',v:'3'},{n:'found',v:'6'}] },
  { arr:[1,2,3], result:[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]],fixedUntil:0, eq:'return all 6 permutations (3! = 6)', desc:'Every ordering of [1,2,3] collected. n! total permutations.', codeLines:[6], vars:[{n:'total',v:'6'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">permute</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html:'    res <span class="cg-op">= []</span>' },
  { html:'    <span class="cg-kw">def</span> <span class="cg-fn">bt</span><span class="cg-op">(</span>idx<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">if</span> idx <span class="cg-op">==</span> <span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">):</span> res<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>nums<span class="cg-op">[:])</span>' },
  { html:'        <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>idx<span class="cg-op">,</span> <span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)):</span>' },
  { html:'            nums<span class="cg-op">[</span>idx<span class="cg-op">],</span> nums<span class="cg-op">[</span>i<span class="cg-op">] =</span> nums<span class="cg-op">[</span>i<span class="cg-op">],</span> nums<span class="cg-op">[</span>idx<span class="cg-op">]</span>' },
  { html:'            bt<span class="cg-op">(</span>idx<span class="cg-op">+</span><span class="cg-num">1</span><span class="cg-op">);</span> nums<span class="cg-op">[</span>idx<span class="cg-op">],</span> nums<span class="cg-op">[</span>i<span class="cg-op">] =</span> nums<span class="cg-op">[</span>i<span class="cg-op">],</span> nums<span class="cg-op">[</span>idx<span class="cg-op">]</span>' },
  { html:'    bt<span class="cg-op">(</span><span class="cg-num">0</span><span class="cg-op">);</span> <span class="cg-kw">return</span> res' },
];

interface Props { accColor: string }
export const Permutations: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="permutations.py" doneResult="6 permutations" accColor={accColor}>
    {(step) => {
      const s = step as PmStep;
      return (
        <>
          <div>
            <span className="viz-section-lbl">CURRENT ARRAY</span>
            <div style={{display:'flex',gap:'.3rem'}}>
              {s.arr.map((n,k) => (
                <div key={k} className="viz-dp-cell" style={{background:COLORS[(n-1)%3]+'33',borderColor:COLORS[(n-1)%3]+'66',color:COLORS[(n-1)%3],fontSize:'1.3rem',width:'44px',height:'44px'}}>{n}</div>
              ))}
            </div>
          </div>
          <div style={{marginTop:'.4rem'}}>
            <span className="viz-section-lbl">RESULTS ({s.result.length} / 6)</span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.3rem'}}>
              {s.result.map((perm,k) => {
                const c = COLORS[(perm[0]-1)%3];
                return <div key={k} style={{fontFamily:'var(--mono)',fontSize:'.7rem',padding:'.2rem .45rem',background:c+'22',border:`1px solid ${c}44`,borderRadius:'3px',color:c,animation:'vizFillPop .3s ease-out'}}>[{perm.join(',')}]</div>;
              })}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
