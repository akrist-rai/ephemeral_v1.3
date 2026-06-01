import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// Same BST: 4,2,7,1,3   in-order: 1,2,3,4,7   k=2 → 2
const K = 2;
type KsStep = VizStep & { visited: number[]; count: number; found?: number };

const STEPS: KsStep[] = [
  { visited:[],      count:0, eq:'in-order traversal counts nodes  k=2', desc:'In-order (left→root→right) visits BST nodes in ascending order. The kth visited = kth smallest.', codeLines:[0,1,2], vars:[{n:'k',v:'2'},{n:'count',v:'0'}] },
  { visited:[1],     count:1, eq:'visit 1 → count=1 ≠ 2', desc:'In-order reaches leftmost leaf: 1. count=1 ≠ k=2. Continue.', codeLines:[3,4,5], vars:[{n:'visit',v:'1'},{n:'count',v:'1'}] },
  { visited:[1,2],   count:2, found:2, eq:'visit 2 → count=2 == k → FOUND', desc:'In-order reaches 2. count=2 == k=2. Return 2!', codeLines:[3,4,6,7], vars:[{n:'visit',v:'2'},{n:'count',v:'2'}] },
  { visited:[1,2],   count:2, found:2, eq:'return 2', desc:'2nd smallest element in the BST is 2. (Sequence: 1, 2, 3, 4, 7.)', codeLines:[7], vars:[{n:'result',v:'2'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">kthSmallest</span><span class="cg-op">(</span>root<span class="cg-op">,</span> k<span class="cg-op">):</span>' },
  { html:'    stack<span class="cg-op">,</span> count<span class="cg-op">,</span> cur <span class="cg-op">= [], </span><span class="cg-num">0</span><span class="cg-op">,</span> root' },
  { html:'    <span class="cg-kw">while</span> stack <span class="cg-kw">or</span> cur<span class="cg-op">:</span>' },
  { html:'        <span class="cg-kw">while</span> cur<span class="cg-op">:</span> stack<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>cur<span class="cg-op">);</span> cur <span class="cg-op">=</span> cur<span class="cg-op">.</span>left' },
  { html:'        cur <span class="cg-op">=</span> stack<span class="cg-op">.</span><span class="cg-bi">pop</span><span class="cg-op">()</span>' },
  { html:'        count <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html:'        <span class="cg-kw">if</span> count <span class="cg-op">==</span> k<span class="cg-op">:</span>' },
  { html:'            <span class="cg-kw">return</span> cur<span class="cg-op">.</span>val' },
];

const NODE_POS: Record<number,{x:number;y:number}> = {4:{x:200,y:28},2:{x:110,y:90},7:{x:290,y:90},1:{x:60,y:155},3:{x:160,y:155}};
const TREE_EDGES = [[4,2],[4,7],[2,1],[2,3]];
const IN_ORDER = [1,2,3,4,7];

interface Props { accColor: string }
export const KthSmallestBST: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="kth_smallest_bst.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as KsStep;
      return (
        <>
          <div style={{display:'flex',gap:'1.2rem',alignItems:'flex-start'}}>
            <div>
              <span className="viz-section-lbl">BST (k={K})</span>
              <svg width="250" height="185" style={{overflow:'visible',display:'block'}}>
                {TREE_EDGES.map(([p,c],k) => <line key={k} x1={NODE_POS[p].x} y1={NODE_POS[p].y} x2={NODE_POS[c].x} y2={NODE_POS[c].y} stroke="rgba(255,255,255,.15)" strokeWidth={1.5} />)}
                {Object.entries(NODE_POS).map(([vStr,pos]) => {
                  const v = Number(vStr);
                  const isFound = s.found === v;
                  const isVisited = s.visited.includes(v);
                  const fill = isFound ? 'rgba(34,197,94,.4)' : isVisited ? 'rgba(37,99,235,.3)' : 'rgba(255,255,255,.05)';
                  const stroke = isFound ? '#22c55e' : isVisited ? '#2563eb' : 'rgba(255,255,255,.2)';
                  return (
                    <g key={v}>
                      <circle cx={pos.x} cy={pos.y} r={22} fill={fill} stroke={stroke} strokeWidth={isFound?2.5:1.5} style={{transition:'all .3s'}} />
                      <text x={pos.x} y={pos.y+7} textAnchor="middle" fill={isFound?'#22c55e':isVisited?'#7dd3fc':'rgba(255,255,255,.5)'} fontFamily="var(--disp)" fontSize="17">{v}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{flex:1}}>
              <span className="viz-section-lbl">IN-ORDER SEQUENCE</span>
              <div style={{display:'flex',gap:'.3rem',flexWrap:'wrap'}}>
                {IN_ORDER.map((v,i) => {
                  const isVisited = s.visited.includes(v);
                  const isFound = s.found === v;
                  const c = isFound ? '#22c55e' : isVisited ? '#2563eb' : 'rgba(255,255,255,.2)';
                  return (
                    <div key={i} style={{width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${c}`,borderRadius:'50%',fontFamily:'var(--disp)',fontSize:'1.2rem',color:c,background:isFound?'rgba(34,197,94,.15)':isVisited?'rgba(37,99,235,.12)':'transparent',transition:'all .3s'}}>
                      {v}
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:'.5rem',fontFamily:'var(--mono)',fontSize:'.68rem',color:'rgba(255,255,255,.4)'}}>
                count: <span style={{color:'#f59e0b',fontWeight:700,fontFamily:'var(--disp)',fontSize:'1.1rem'}}>{s.count}</span> / k={K}
              </div>
              {s.found && <div style={{marginTop:'.4rem',fontFamily:'var(--mono)',fontSize:'.75rem',color:'#22c55e',fontWeight:700}}>✓ {K}nd smallest = {s.found}</div>}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
