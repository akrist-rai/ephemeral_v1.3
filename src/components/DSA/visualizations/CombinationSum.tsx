import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// candidates=[2,3,6,7], target=7  → [[2,2,3],[7]]
const CANDIDATES = [2,3,6,7];
const TARGET = 7;
const CC = ['#2563eb','#16a34a','#7c3aed','#e11d48'] as const;

type CbStep = VizStep & { path: number[]; result: number[][]; remain: number; action: 'explore'|'add'|'prune'|'done' };

const STEPS: CbStep[] = [
  { path:[], result:[], remain:7, action:'explore', eq:'path=[]  target=7  start DFS', desc:'Try each candidate from index 0 onward. Numbers can repeat.', codeLines:[0,1,2], vars:[{n:'target',v:'7'}] },
  { path:[2], result:[], remain:5, action:'explore', eq:'try 2 → path=[2]  remain=5', desc:'Include 2. remain=5. Recurse (can reuse 2).', codeLines:[3,4,5], vars:[{n:'path',v:'[2]'},{n:'rem',v:'5'}] },
  { path:[2,2], result:[], remain:3, action:'explore', eq:'try 2 again → [2,2]  remain=3', desc:'Include 2 again. remain=3.', codeLines:[3,4,5], vars:[{n:'path',v:'[2,2]'},{n:'rem',v:'3'}] },
  { path:[2,2,3], result:[[2,2,3]], remain:0, action:'add', eq:'try 3 → [2,2,3]  remain=0 ✓ ADD', desc:'remain==0 → found a solution! Add [2,2,3] to results.', codeLines:[6,7], vars:[{n:'path',v:'[2,2,3]'},{n:'found',v:'1'}] },
  { path:[2], result:[[2,2,3]], remain:5, action:'explore', eq:'backtrack → try 3 with [2]  remain=2', desc:'Backtrack to [2]. Skip 2 (move forward). Try 3: remain=2. No candidate ≤ 2 except 2, but 2+2=4 > 2. Prune.', codeLines:[3,4,5], vars:[{n:'path',v:'[2,3]'},{n:'rem',v:'2'}] },
  { path:[], result:[[2,2,3]], remain:7, action:'explore', eq:'backtrack to [] → try 7  remain=0 ✓ ADD', desc:'Skip to candidate 7: path=[7], remain=0 → found!', codeLines:[3,6,7], vars:[{n:'path',v:'[7]'},{n:'found',v:'2'}] },
  { path:[], result:[[2,2,3],[7]], remain:7, action:'done', eq:'return [[2,2,3],[7]]', desc:'All candidates exhausted. Two valid combinations found.', codeLines:[8], vars:[{n:'result',v:'2 combos'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">combinationSum</span><span class="cg-op">(</span>cands<span class="cg-op">,</span> target<span class="cg-op">):</span>' },
  { html:'    res <span class="cg-op">= []</span>' },
  { html:'    <span class="cg-kw">def</span> <span class="cg-fn">bt</span><span class="cg-op">(</span>i<span class="cg-op">,</span> path<span class="cg-op">,</span> rem<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">if</span> rem <span class="cg-op">&lt;</span> <span class="cg-num">0</span><span class="cg-op">:</span> <span class="cg-kw">return</span>  <span class="cg-cm"># pruned</span>' },
  { html:'        <span class="cg-kw">for</span> j <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>i<span class="cg-op">,</span><span class="cg-bi">len</span><span class="cg-op">(</span>cands<span class="cg-op">)):</span>' },
  { html:'            bt<span class="cg-op">(</span>j<span class="cg-op">,</span> path<span class="cg-op">+[</span>cands<span class="cg-op">[</span>j<span class="cg-op">]],</span> rem<span class="cg-op">-</span>cands<span class="cg-op">[</span>j<span class="cg-op">])</span>' },
  { html:'        <span class="cg-kw">if</span> rem <span class="cg-op">==</span> <span class="cg-num">0</span><span class="cg-op">:</span>' },
  { html:'            res<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>path<span class="cg-op">[:])</span>' },
  { html:'    bt<span class="cg-op">(</span><span class="cg-num">0</span><span class="cg-op">,[],</span>target<span class="cg-op">);</span> <span class="cg-kw">return</span> res' },
];

interface Props { accColor: string }
export const CombinationSum: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="combination_sum.py" doneResult="[[2,2,3],[7]]" accColor={accColor}>
    {(step) => {
      const s = step as CbStep;
      const targetBarWidth = Math.max(0, (TARGET - s.remain) / TARGET * 100);
      return (
        <>
          {/* Candidates */}
          <div>
            <span className="viz-section-lbl">CANDIDATES  target={TARGET}</span>
            <div style={{display:'flex',gap:'.3rem'}}>
              {CANDIDATES.map((c,k) => (
                <div key={k} className="viz-dp-cell" style={{background:CC[k]+'28',borderColor:CC[k]+'55',color:CC[k],fontSize:'1.2rem',width:'40px',height:'40px'}}>{c}</div>
              ))}
            </div>
          </div>

          {/* Current path */}
          <div style={{marginTop:'.4rem'}}>
            <span className="viz-section-lbl">CURRENT PATH  (remain = {s.remain})</span>
            <div style={{display:'flex',gap:'.3rem',minHeight:'44px',alignItems:'center'}}>
              {s.path.map((v,k) => {
                const ci = CANDIDATES.indexOf(v);
                const c = CC[ci>=0?ci:0];
                return <div key={k} className="viz-dp-cell" style={{background:c+'33',borderColor:c+'77',color:c,fontSize:'1.2rem',width:'40px',height:'40px'}}>{v}</div>;
              })}
              {s.path.length===0 && <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'rgba(255,255,255,.2)'}}>[ ]</span>}
              <div style={{marginLeft:'auto',fontFamily:'var(--mono)',fontSize:'.68rem'}}>
                <span style={{color:'rgba(255,255,255,.35)'}}>sum: </span>
                <span style={{color:s.remain===0?'#22c55e':'#f59e0b',fontWeight:700}}>{TARGET-s.remain}</span>
                <span style={{color:'rgba(255,255,255,.25)'}}> / {TARGET}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{height:'4px',background:'rgba(255,255,255,.07)',borderRadius:'2px',overflow:'hidden',marginTop:'.25rem'}}>
              <div style={{height:'100%',width:`${targetBarWidth}%`,background:s.remain===0?'#22c55e':'#f59e0b',transition:'width .4s'}} />
            </div>
          </div>

          {/* Results */}
          <div style={{marginTop:'.4rem'}}>
            <span className="viz-section-lbl">SOLUTIONS ({s.result.length})</span>
            <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap'}}>
              {s.result.map((combo,k) => (
                <div key={k} style={{fontFamily:'var(--mono)',fontSize:'.72rem',padding:'.2rem .5rem',background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.35)',borderRadius:'3px',color:'#22c55e',animation:'vizFillPop .3s ease-out'}}>
                  [{combo.join('+')}]={TARGET}
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
