import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums=[1,1,1,2,2,3], k=2  → [1,2]
const NUMS = [1,1,1,2,2,3];
const K = 2;
const NUM_COLORS: Record<number,string> = {1:'#e11d48',2:'#2563eb',3:'#16a34a'};

type TkStep = VizStep & {
  count: Record<number,number>;
  buckets: Record<number,number[]>;
  result: number[];
  phase: 'init'|'count'|'bucket'|'collect'|'done';
};

const STEPS: TkStep[] = [
  { phase:'init',    count:{},                buckets:{},                       result:[],  eq:'count = {}', desc:'Count frequencies, then bucket by frequency for O(n) solution.', codeLines:[0,1], vars:[{n:'k',v:'2'}] },
  { phase:'count',   count:{1:3,2:2,3:1},     buckets:{},                       result:[],  eq:'count = {1:3, 2:2, 3:1}', desc:'Count every number. 1 appears 3×, 2 appears 2×, 3 appears 1×.', codeLines:[2,3], vars:[{n:'count[1]',v:'3'},{n:'count[2]',v:'2'}] },
  { phase:'bucket',  count:{1:3,2:2,3:1},     buckets:{3:[1],2:[2],1:[3]},      result:[],  eq:'bucket[freq] = [nums with that freq]', desc:'Bucket each number by its frequency. bucket[3]=[1], bucket[2]=[2], bucket[1]=[3].', codeLines:[4,5], vars:[{n:'buckets',v:'built'}] },
  { phase:'collect', count:{1:3,2:2,3:1},     buckets:{3:[1],2:[2],1:[3]},      result:[1,2],eq:'scan bucket[6]..bucket[1] → take k=2', desc:'Scan from highest freq down. Collect until we have k=2 results: [1] then [2].', codeLines:[6,7], vars:[{n:'collected',v:'2'},{n:'result',v:'[1,2]'}] },
  { phase:'done',    count:{1:3,2:2,3:1},     buckets:{3:[1],2:[2],1:[3]},      result:[1,2],eq:'return [1, 2]', desc:'Top 2 most frequent elements are 1 (3×) and 2 (2×).', codeLines:[8], vars:[{n:'result',v:'[1,2]'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">topKFrequent</span><span class="cg-op">(</span>nums<span class="cg-op">,</span> k<span class="cg-op">):</span>' },
  { html:'    count <span class="cg-op">= {}</span>' },
  { html:'    <span class="cg-kw">for</span> n <span class="cg-kw">in</span> nums<span class="cg-op">:</span>' },
  { html:'        count<span class="cg-op">[</span>n<span class="cg-op">] =</span> count<span class="cg-op">.</span><span class="cg-bi">get</span><span class="cg-op">(</span>n<span class="cg-op">,</span><span class="cg-num">0</span><span class="cg-op">)+</span><span class="cg-num">1</span>' },
  { html:'    buckets <span class="cg-op">= [[] </span><span class="cg-kw">for</span> _ <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)+</span><span class="cg-num">1</span><span class="cg-op">)]</span>' },
  { html:'    <span class="cg-kw">for</span> n<span class="cg-op">,</span>f <span class="cg-kw">in</span> count<span class="cg-op">.</span><span class="cg-bi">items</span><span class="cg-op">():</span> buckets<span class="cg-op">[</span>f<span class="cg-op">].</span><span class="cg-bi">append</span><span class="cg-op">(</span>n<span class="cg-op">)</span>' },
  { html:'    res <span class="cg-op">= []</span>' },
  { html:'    <span class="cg-kw">for</span> f <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>buckets<span class="cg-op">)-</span><span class="cg-num">1</span><span class="cg-op">,-</span><span class="cg-num">1</span><span class="cg-op">,-</span><span class="cg-num">1</span><span class="cg-op">):</span>' },
  { html:'        res <span class="cg-op">+=</span> buckets<span class="cg-op">[</span>f<span class="cg-op">];</span> <span class="cg-kw">if</span> <span class="cg-bi">len</span><span class="cg-op">(</span>res<span class="cg-op">) >=</span> k<span class="cg-op">:</span> <span class="cg-kw">return</span> res<span class="cg-op">[:k]</span>' },
  { html:'    <span class="cg-kw">return</span> res<span class="cg-op">[:k]</span>' },
];

interface Props { accColor: string }
export const TopKFrequent: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="top_k_frequent.py" doneResult="[1, 2]" accColor={accColor}>
    {(step) => {
      const s = step as TkStep;
      return (
        <>
          {/* Input */}
          <div style={{display:'flex',gap:'.3rem',marginBottom:'.2rem'}}>
            {NUMS.map((n,k) => <div key={k} className="viz-dp-cell" style={{width:'36px',height:'36px',background:NUM_COLORS[n]+'22',borderColor:NUM_COLORS[n]+'55',color:NUM_COLORS[n],fontSize:'1.1rem'}}>{n}</div>)}
          </div>

          {/* Count dict */}
          {Object.keys(s.count).length > 0 && (
            <div style={{marginTop:'.35rem'}}>
              <span className="viz-section-lbl">FREQUENCY COUNT</span>
              <div className="viz-dict">
                {Object.entries(s.count).map(([num,freq]) => (
                  <div key={num} className="viz-entry">
                    <span className="viz-entry-k" style={{color:NUM_COLORS[Number(num)]??'var(--crt)'}}>{num}</span>
                    <span className="viz-entry-sep">:</span>
                    <span className="viz-entry-v">{freq}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buckets */}
          {Object.keys(s.buckets).length > 0 && (
            <div style={{marginTop:'.35rem'}}>
              <span className="viz-section-lbl">FREQUENCY BUCKETS (scan high→low)</span>
              <div style={{display:'flex',flexDirection:'column',gap:'.25rem'}}>
                {[3,2,1].map(freq => {
                  const nums = s.buckets[freq] ?? [];
                  if (!nums.length) return null;
                  const isCollected = s.result.some(r => nums.includes(r));
                  return (
                    <div key={freq} style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                      <span style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'rgba(255,255,255,.4)',width:'52px',textAlign:'right'}}>freq={freq}</span>
                      {nums.map((n,i) => (
                        <div key={i} style={{padding:'.2rem .5rem',background:NUM_COLORS[n]+(isCollected?'44':'22'),border:`1px solid ${NUM_COLORS[n]}${isCollected?'99':'44'}`,borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.75rem',color:NUM_COLORS[n],fontWeight:isCollected?700:400}}>
                          {n}{isCollected?' ✓':''}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result */}
          {s.result.length > 0 && (
            <div style={{marginTop:'.35rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
              <span className="viz-section-lbl" style={{marginBottom:0}}>top-{K}:</span>
              {s.result.map((n,k) => <div key={k} style={{fontFamily:'var(--disp)',fontSize:'1.6rem',color:NUM_COLORS[n]??'#fff'}}>{n}</div>)}
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
