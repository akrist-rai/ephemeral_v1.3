import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums=[1,2,3]  → 8 subsets
const NUMS = [1,2,3];
const COLORS = ['#e11d48','#2563eb','#16a34a'] as const;

type SsStep = VizStep & { current: number[]; all: number[][] };

const STEPS: SsStep[] = [
  { current:[],    all:[[]],                       eq:'result = [[]]   start with empty set', desc:'Start with the empty subset. For each number we can include it or skip it.', codeLines:[0,1,2], vars:[{n:'result',v:'1 subset'}] },
  { current:[1],   all:[[],[1]],                   eq:'include 1 → [1]', desc:'Add 1 to []. Now result has [[],[1]].', codeLines:[3,4,5], vars:[{n:'num',v:'1'},{n:'result',v:'2 subsets'}] },
  { current:[2],   all:[[],[1],[2],[1,2]],          eq:'include 2 → [2],[1,2]', desc:'For num=2: copy all existing subsets, append 2 to each copy. Result doubles.', codeLines:[3,4,5], vars:[{n:'num',v:'2'},{n:'result',v:'4 subsets'}] },
  { current:[3],   all:[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]], eq:'include 3 → [3],[1,3],[2,3],[1,2,3]', desc:'For num=3: copy all 4 subsets, append 3. Result doubles again to 8.', codeLines:[3,4,5], vars:[{n:'num',v:'3'},{n:'result',v:'8 subsets'}] },
  { current:[],    all:[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]], eq:'return 8 subsets (2³ = 8)', desc:'Each of n elements is either included or not → 2ⁿ subsets total.', codeLines:[6], vars:[{n:'total',v:'8'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">subsets</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html:'    result <span class="cg-op">= [[]]</span>' },
  { html:'' },
  { html:'    <span class="cg-kw">for</span> num <span class="cg-kw">in</span> nums<span class="cg-op">:</span>' },
  { html:'        new <span class="cg-op">= [</span>s <span class="cg-op">+</span> <span class="cg-op">[</span>num<span class="cg-op">]</span> <span class="cg-kw">for</span> s <span class="cg-kw">in</span> result<span class="cg-op">]</span>' },
  { html:'        result <span class="cg-op">+=</span> new' },
  { html:'    <span class="cg-kw">return</span> result' },
];

const subsetColor = (s: number[]) => {
  if (s.length === 0) return 'rgba(255,255,255,.15)';
  const last = s[s.length - 1];
  return COLORS[(last - 1) % 3];
};

interface Props { accColor: string }
export const Subsets: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="subsets.py" doneResult="8 subsets" accColor={accColor}>
    {(step) => {
      const s = step as SsStep;
      return (
        <>
          <div style={{display:'flex',gap:'.3rem',marginBottom:'.4rem'}}>
            {NUMS.map((n,k) => <div key={k} className="viz-dp-cell" style={{width:'40px',height:'40px',background:COLORS[k]+'33',borderColor:COLORS[k]+'66',color:COLORS[k],fontSize:'1.3rem'}}>{n}</div>)}
            {s.current.length > 0 && <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'rgba(255,255,255,.4)',alignSelf:'center',marginLeft:'.4rem'}}>processing: <span style={{color:COLORS[(s.current[0]-1)%3],fontWeight:700}}>{s.current[0]}</span></span>}
          </div>

          <span className="viz-section-lbl">ALL SUBSETS ({s.all.length})</span>
          <div style={{display:'flex',flexWrap:'wrap',gap:'.3rem'}}>
            {s.all.map((sub,k) => {
              const c = subsetColor(sub);
              return (
                <div key={k} style={{fontFamily:'var(--mono)',fontSize:'.7rem',padding:'.2rem .45rem',background:c+'22',border:`1px solid ${c}44`,borderRadius:'3px',color:c,letterSpacing:'.04em',animation:k>=s.all.length-4&&s.all.length>1?'vizFillPop .3s ease-out':undefined}}>
                  [{sub.join(',')}]
                </div>
              );
            })}
          </div>

          <div style={{marginTop:'.4rem',fontFamily:'var(--mono)',fontSize:'.68rem',color:'rgba(255,255,255,.4)'}}>
            each new number doubles the result: {NUMS.map((_,k)=><span key={k} style={{color:COLORS[k],marginLeft:k>0?'.3rem':0}}>{2**(k+1)}</span>)}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
