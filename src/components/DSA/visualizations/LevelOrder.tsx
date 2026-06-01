import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// Tree:      3
//          /   \
//         9    20
//             /  \
//            15   7
// → [[3],[9,20],[15,7]]

type LoStep = VizStep & {
  queueVals: number[];
  result: number[][];
  activeLevel: number[];
};

const STEPS: LoStep[] = [
  { queueVals:[3],     result:[],               activeLevel:[],    eq:'queue = [3]', desc:'Push root. BFS processes one full level per iteration.', codeLines:[0,1,2], vars:[{n:'queue',v:'[3]'}] },
  { queueVals:[9,20],  result:[[3]],             activeLevel:[3],   eq:'level 0 → [3]  enqueue children: 9, 20', desc:'Dequeue all of level 0: just node 3. Append [3] to result. Enqueue children 9, 20.', codeLines:[3,4,5,6], vars:[{n:'lvl',v:'0'},{n:'result',v:'[[3]]'}] },
  { queueVals:[15,7],  result:[[3],[9,20]],       activeLevel:[9,20],eq:'level 1 → [9,20]  enqueue children: 15, 7', desc:'Dequeue level 1: 9 (leaf, no children), 20 (children 15,7). Append [9,20].', codeLines:[3,4,5,6], vars:[{n:'lvl',v:'1'},{n:'result',v:'[[3],[9,20]]'}] },
  { queueVals:[],      result:[[3],[9,20],[15,7]],activeLevel:[15,7],eq:'level 2 → [15,7]  queue empty → done', desc:'Dequeue level 2: 15 and 7 (both leaves). Append [15,7]. Queue empty.', codeLines:[3,4,5,6], vars:[{n:'lvl',v:'2'},{n:'result',v:'[[3],[9,20],[15,7]]'}] },
  { queueVals:[],      result:[[3],[9,20],[15,7]],activeLevel:[],    eq:'return [[3],[9,20],[15,7]]', desc:'Three levels collected. Each inner list is one level of the tree.', codeLines:[7], vars:[{n:'levels',v:'3'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">levelOrder</span><span class="cg-op">(</span>root<span class="cg-op">):</span>' },
  { html:'    <span class="cg-kw">if not</span> root<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-op">[]</span>' },
  { html:'    res<span class="cg-op">,</span> q <span class="cg-op">= [], </span>deque<span class="cg-op">([</span>root<span class="cg-op">])</span>' },
  { html:'    <span class="cg-kw">while</span> q<span class="cg-op">:</span>' },
  { html:'        level <span class="cg-op">= []</span>' },
  { html:'        <span class="cg-kw">for</span> _ <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>q<span class="cg-op">)):</span>' },
  { html:'            n<span class="cg-op">=</span>q<span class="cg-op">.</span><span class="cg-bi">popleft</span><span class="cg-op">();</span> level<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>n<span class="cg-op">.</span>val<span class="cg-op">);</span> enqueue children' },
  { html:'    <span class="cg-kw">return</span> res' },
];

const LEVEL_COLORS = ['#e11d48','#2563eb','#16a34a'] as const;

const NODE_POS: Record<number, {x:number;y:number;level:number}> = {
  3:  {x:200,y:30,  level:0},
  9:  {x:110,y:95,  level:1},
  20: {x:290,y:95,  level:1},
  15: {x:230,y:160, level:2},
  7:  {x:350,y:160, level:2},
};
const TREE_EDGES = [[3,9],[3,20],[20,15],[20,7]];

interface Props { accColor: string }
export const LevelOrder: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="level_order.py" doneResult="[[3],[9,20],[15,7]]" accColor={accColor}>
    {(step) => {
      const s = step as LoStep;
      const isActive = (v: number) => s.activeLevel.includes(v);
      const isDone   = (v: number) => s.result.flat().includes(v) && !isActive(v);

      return (
        <>
          <span className="viz-section-lbl">BINARY TREE</span>
          <svg width="420" height="200" style={{overflow:'visible',display:'block'}}>
            {TREE_EDGES.map(([p,c],k) => {
              const pp = NODE_POS[p], cp = NODE_POS[c];
              return <line key={k} x1={pp.x} y1={pp.y} x2={cp.x} y2={cp.y} stroke="rgba(255,255,255,.15)" strokeWidth={1.5} />;
            })}
            {Object.entries(NODE_POS).map(([vStr,pos]) => {
              const v = Number(vStr);
              const active = isActive(v);
              const done = isDone(v);
              const lc = LEVEL_COLORS[pos.level];
              const fill = active ? lc+'44' : done ? lc+'22' : 'rgba(255,255,255,.05)';
              const stroke = active ? lc : done ? lc+'77' : 'rgba(255,255,255,.2)';
              const textC = active ? '#fff' : done ? lc : 'rgba(255,255,255,.45)';
              return (
                <g key={v}>
                  <circle cx={pos.x} cy={pos.y} r={22} fill={fill} stroke={stroke} strokeWidth={active?2.5:1.5} style={{transition:'all .3s'}} />
                  <text x={pos.x} y={pos.y+7} textAnchor="middle" fill={textC} fontFamily="var(--disp)" fontSize="18" style={{transition:'all .3s'}}>{v}</text>
                </g>
              );
            })}
          </svg>

          {/* Result so far */}
          <div style={{marginTop:'.3rem'}}>
            <span className="viz-section-lbl">RESULT</span>
            <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
              {s.result.map((lvl,k) => (
                <div key={k} style={{padding:'.25rem .55rem',background:LEVEL_COLORS[k]+'22',border:`1px solid ${LEVEL_COLORS[k]}55`,borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.72rem',color:LEVEL_COLORS[k]}}>
                  [{lvl.join(',')}]
                </div>
              ))}
              {s.result.length === 0 && <span style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'rgba(255,255,255,.2)'}}>[ ]</span>}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
