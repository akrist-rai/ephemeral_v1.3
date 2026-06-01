import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// edges = [[1,2],[1,3],[2,3]]  → redundant = [2,3]
// Union-Find
const EDGES = [[1,2],[1,3],[2,3]];

type RcStep = VizStep & {
  parent: Record<number,number>;
  rank: Record<number,number>;
  edgeIdx: number;
  sameComponent?: boolean;
  result?: number[];
};

function find(parent: Record<number,number>, x: number): number {
  while (parent[x] !== x) x = parent[x];
  return x;
}

const STEPS: RcStep[] = [
  { edgeIdx:-1, parent:{1:1,2:2,3:3}, rank:{1:0,2:0,3:0}, eq:'parent={1:1, 2:2, 3:3}', desc:'Union-Find: each node is its own parent initially. Process edges one by one.', codeLines:[0,1,2], vars:[{n:'components',v:'3'}] },
  { edgeIdx:0,  parent:{1:1,2:1,3:3}, rank:{1:1,2:0,3:0}, sameComponent:false, eq:'[1,2]: find(1)=1 find(2)=2 ≠ → union', desc:'Edge [1,2]: roots differ (1≠2) → safe to merge. Union 2 under 1.', codeLines:[3,4,5,6], vars:[{n:'edge',v:'[1,2]'},{n:'root1',v:'1'},{n:'root2',v:'2'}] },
  { edgeIdx:1,  parent:{1:1,2:1,3:1}, rank:{1:1,2:0,3:0}, sameComponent:false, eq:'[1,3]: find(1)=1 find(3)=3 ≠ → union', desc:'Edge [1,3]: roots differ (1≠3) → safe to merge. Union 3 under 1.', codeLines:[3,4,5,6], vars:[{n:'edge',v:'[1,3]'},{n:'root1',v:'1'},{n:'root2',v:'3'}] },
  { edgeIdx:2,  parent:{1:1,2:1,3:1}, rank:{1:1,2:0,3:0}, sameComponent:true,  eq:'[2,3]: find(2)=1 find(3)=1 SAME → REDUNDANT!', desc:'Edge [2,3]: both 2 and 3 already in same component (root=1) → this edge creates a cycle!', codeLines:[7,8], vars:[{n:'edge',v:'[2,3]'},{n:'root1',v:'1'},{n:'root2',v:'1'}] },
  { edgeIdx:2,  parent:{1:1,2:1,3:1}, rank:{1:1,2:0,3:0}, sameComponent:true, result:[2,3], eq:'return [2, 3]', desc:'[2,3] is the redundant edge. Removing it leaves a valid tree.', codeLines:[8], vars:[{n:'result',v:'[2,3]'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">findRedundantConnection</span><span class="cg-op">(</span>edges<span class="cg-op">):</span>' },
  { html:'    parent <span class="cg-op">= {</span>i<span class="cg-op">:</span>i <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>n<span class="cg-op">+</span><span class="cg-num">1</span><span class="cg-op">)}</span>' },
  { html:'    <span class="cg-kw">def</span> <span class="cg-fn">find</span><span class="cg-op">(</span>x<span class="cg-op">):</span> parent<span class="cg-op">[</span>x<span class="cg-op">] = </span>find<span class="cg-op">(</span>parent<span class="cg-op">[</span>x<span class="cg-op">])</span> <span class="cg-kw">if</span> parent<span class="cg-op">[</span>x<span class="cg-op">]!=</span>x <span class="cg-kw">else</span> x' },
  { html:'    <span class="cg-kw">for</span> u<span class="cg-op">,</span>v <span class="cg-kw">in</span> edges<span class="cg-op">:</span>' },
  { html:'        ru<span class="cg-op">,</span> rv <span class="cg-op">=</span> find<span class="cg-op">(</span>u<span class="cg-op">),</span> find<span class="cg-op">(</span>v<span class="cg-op">)</span>' },
  { html:'        <span class="cg-kw">if</span> ru <span class="cg-op">==</span> rv<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-op">[</span>u<span class="cg-op">,</span>v<span class="cg-op">]</span>' },
  { html:'        parent<span class="cg-op">[</span>ru<span class="cg-op">] =</span> rv' },
  { html:'    <span class="cg-kw">return</span> <span class="cg-op">[]</span>' },
];

const NODE_POS: Record<number,{x:number;y:number}> = {1:{x:200,y:30},2:{x:90,y:130},3:{x:310,y:130}};
const EDGE_COLORS = ['#2563eb','#16a34a','#e11d48'];

interface Props { accColor: string }
export const RedundantConnection: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="redundant_connection.py" doneResult="[2,3]" accColor={accColor}>
    {(step) => {
      const s = step as RcStep;
      return (
        <>
          <span className="viz-section-lbl">GRAPH — find the edge that creates a cycle</span>
          <svg width="400" height="175" style={{overflow:'visible',display:'block'}}>
            {EDGES.map(([u,v],k) => {
              const processed = k <= s.edgeIdx;
              const isRedundant = s.sameComponent && k === s.edgeIdx;
              const c = isRedundant ? '#e11d48' : processed ? '#22c55e' : 'rgba(255,255,255,.2)';
              return (
                <line key={k} x1={NODE_POS[u].x} y1={NODE_POS[u].y} x2={NODE_POS[v].x} y2={NODE_POS[v].y}
                  stroke={c} strokeWidth={isRedundant?3:processed?2:1} strokeDasharray={isRedundant?'0':processed?'0':'5 3'} style={{transition:'all .3s'}} />
              );
            })}
            {[1,2,3].map(n => {
              const root = find(s.parent, n);
              const isRoot = root === n;
              const bg = isRoot ? 'rgba(34,197,94,.3)' : 'rgba(255,255,255,.07)';
              const stroke = isRoot ? '#22c55e' : 'rgba(255,255,255,.3)';
              return (
                <g key={n}>
                  <circle cx={NODE_POS[n].x} cy={NODE_POS[n].y} r={22} fill={bg} stroke={stroke} strokeWidth={1.5} style={{transition:'all .3s'}} />
                  <text x={NODE_POS[n].x} y={NODE_POS[n].y+7} textAnchor="middle" fill="#fff" fontFamily="var(--disp)" fontSize="18">{n}</text>
                  {!isRoot && <text x={NODE_POS[n].x} y={NODE_POS[n].y+38} textAnchor="middle" fill="rgba(34,197,94,.7)" fontFamily="var(--mono)" fontSize="9">→{root}</text>}
                </g>
              );
            })}
          </svg>

          {/* Edge processing status */}
          <div style={{display:'flex',gap:'.4rem',marginTop:'.2rem'}}>
            {EDGES.map(([u,v],k) => {
              const processed = k < s.edgeIdx;
              const current = k === s.edgeIdx;
              const isRedundant = s.sameComponent && current;
              const c = isRedundant ? '#e11d48' : processed ? '#22c55e' : current ? '#f59e0b' : 'rgba(255,255,255,.25)';
              return (
                <div key={k} style={{padding:'.25rem .5rem',background:c+'22',border:`1px solid ${c}55`,borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.72rem',color:c}}>
                  [{u},{v}]{isRedundant?' ✗ CYCLE':processed?' ✓':''}
                </div>
              );
            })}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
