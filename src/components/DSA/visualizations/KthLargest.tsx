import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums=[3,2,1,5,6,4], k=2 → 5
// Min-heap of size k: keep the k largest seen so far; heap[0] = kth largest
const NUMS = [3,2,1,5,6,4];
const K = 2;
const COLORS = ['#e11d48','#2563eb','#7c3aed','#16a34a','#0891b2','#ea580c'] as const;

type KlStep = VizStep & { idx: number; heap: number[] };

const STEPS: KlStep[] = [
  { idx:-1, heap:[],      eq:'heap = []   k = 2', desc:'Maintain a min-heap of size k. heap[0] is always the kth largest.', codeLines:[0,1], vars:[{n:'k',v:'2'}] },
  { idx:0,  heap:[3],     eq:'push 3 → heap=[3]', desc:'nums[0]=3: heap size < k, push.', codeLines:[2,3], vars:[{n:'n',v:'3'},{n:'heap[0]',v:'3'}] },
  { idx:1,  heap:[2,3],   eq:'push 2 → heap=[2,3]  size=k', desc:'nums[1]=2: push, heap=[2,3]. Size now equals k.', codeLines:[2,3], vars:[{n:'n',v:'2'},{n:'heap[0]',v:'2'}] },
  { idx:2,  heap:[2,3],   eq:'push 1 → size>k → pop 1 → heap=[2,3]', desc:'nums[2]=1: push, size>k, pop min(1). heap=[2,3]. kth largest still 2.', codeLines:[2,3,4], vars:[{n:'n',v:'1'},{n:'heap[0]',v:'2'}] },
  { idx:3,  heap:[3,5],   eq:'push 5 → size>k → pop 2 → heap=[3,5]', desc:'nums[3]=5: push, size>k, pop min(2). Larger number 5 entered top-k.', codeLines:[2,3,4], vars:[{n:'n',v:'5'},{n:'heap[0]',v:'3'}] },
  { idx:4,  heap:[5,6],   eq:'push 6 → size>k → pop 3 → heap=[5,6]', desc:'nums[4]=6: push, pop min(3). New top-2 is [5,6].', codeLines:[2,3,4], vars:[{n:'n',v:'6'},{n:'heap[0]',v:'5'}] },
  { idx:5,  heap:[5,6],   eq:'push 4 → size>k → pop 4 → heap=[5,6]', desc:'nums[5]=4: push, pop min(4). Top-2 unchanged: [5,6].', codeLines:[2,3,4], vars:[{n:'n',v:'4'},{n:'heap[0]',v:'5'}] },
  { idx:-2, heap:[5,6],   eq:'return heap[0] = 5', desc:'Min of top-k = 2nd largest overall. heap[0]=5.', codeLines:[5], vars:[{n:'result',v:'5'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">findKthLargest</span><span class="cg-op">(</span>nums<span class="cg-op">,</span> k<span class="cg-op">):</span>' },
  { html:'    heap <span class="cg-op">= []</span>' },
  { html:'    <span class="cg-kw">for</span> n <span class="cg-kw">in</span> nums<span class="cg-op">:</span>' },
  { html:'        heapq<span class="cg-op">.</span><span class="cg-bi">heappush</span><span class="cg-op">(</span>heap<span class="cg-op">,</span> n<span class="cg-op">)</span>' },
  { html:'        <span class="cg-kw">if</span> <span class="cg-bi">len</span><span class="cg-op">(</span>heap<span class="cg-op">) &gt;</span> k<span class="cg-op">:</span> heapq<span class="cg-op">.</span><span class="cg-bi">heappop</span><span class="cg-op">(</span>heap<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">return</span> heap<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">]</span>' },
];

interface Props { accColor: string }
export const KthLargest: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="kth_largest.py" doneResult="5" accColor={accColor}>
    {(step) => {
      const s = step as KlStep;
      return (
        <>
          <div className="viz-index-row"><span className="viz-row-label-space" />{NUMS.map((_,k)=><span key={k} className="viz-index-num" style={{width:'44px'}}>[{k}]</span>)}</div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n,k) => {
              const isActive = k === s.idx;
              const isPast = k < s.idx || s.idx === -2;
              const inHeap = s.heap.includes(n) && isPast;
              return <div key={k} className={`viz-cell vc${k} viz-cell--${s.idx===-2?'done':isActive?'active':isPast?'past':'idle'}`} style={{ width:'44px', height:'44px', boxShadow: inHeap ? `0 0 0 3px rgba(34,197,94,.4)` : undefined }}>
                <span className="viz-cell-val" style={{fontSize:'1.4rem'}}>{n}</span>
              </div>;
            })}
          </div>

          <div style={{marginTop:'.5rem',display:'flex',gap:'.7rem',alignItems:'flex-end'}}>
            <div>
              <span className="viz-section-lbl">MIN-HEAP (top-{K})</span>
              <div style={{display:'flex',gap:'.3rem',alignItems:'flex-end'}}>
                {s.heap.slice().sort((a,b)=>a-b).map((v,k)=>{
                  const isMin = k === 0;
                  return <div key={k} style={{width:'44px',height:isMin?'52px':'44px',display:'flex',alignItems:'center',justifyContent:'center',background:isMin?'rgba(34,197,94,.2)':'rgba(255,255,255,.07)',border:`2px solid ${isMin?'#22c55e':'rgba(255,255,255,.2)'}`,borderRadius:'5px',fontFamily:'var(--disp)',fontSize:'1.4rem',color:isMin?'#22c55e':'rgba(255,255,255,.8)',transition:'all .3s',flexDirection:'column',gap:'2px'}}>
                    {v}
                    {isMin && <span style={{fontFamily:'var(--mono)',fontSize:'.48rem',color:'#22c55eaa',letterSpacing:'.06em'}}>min</span>}
                  </div>;
                })}
                {s.heap.length === 0 && <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'rgba(255,255,255,.2)'}}>[ ]</span>}
              </div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'rgba(255,255,255,.4)',marginBottom:'.3rem'}}>
              heap[0] = kth largest = <span style={{color:'#22c55e',fontWeight:700,fontFamily:'var(--disp)',fontSize:'1.1rem'}}>{s.heap.length>0?Math.min(...s.heap):'?'}</span>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
