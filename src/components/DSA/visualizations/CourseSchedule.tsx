import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// numCourses=4, prerequisites=[[1,0],[2,1],[3,2]]  → no cycle → True
// Graph: 0→1→2→3
// DFS: visit 0→1→2→3, all finish without back-edge → no cycle

type CsStep = VizStep & {
  state: Record<number,0|1|2>;  // 0=unvisited 1=visiting 2=done
  current?: number;
  result?: boolean;
};

const N = 4;
const ADJ: Record<number,number[]> = {0:[1],1:[2],2:[3],3:[]};
// reverse: prereq[1]=0 means "1 requires 0" → directed edge 1←0 or 0→1
// we build adj as: to take course 1, must first do 0

const STEPS: CsStep[] = [
  { state:{0:0,1:0,2:0,3:0}, eq:'adj = {0→[1], 1→[2], 2→[3], 3→[]}', desc:'Build adjacency list. DFS each unvisited node; detect back-edges (visiting→visiting).', codeLines:[0,1,2], vars:[{n:'visited',v:'{}'}] },
  { state:{0:1,1:0,2:0,3:0}, current:0, eq:'DFS(0): mark VISITING', desc:'Start DFS from node 0. Mark as VISITING (in-progress).', codeLines:[3,4], vars:[{n:'node',v:'0'},{n:'state[0]',v:'visiting'}] },
  { state:{0:1,1:1,2:0,3:0}, current:1, eq:'DFS(1): mark VISITING', desc:'0 → 1: recurse into neighbour 1. Mark as VISITING.', codeLines:[3,4], vars:[{n:'node',v:'1'},{n:'state[1]',v:'visiting'}] },
  { state:{0:1,1:1,2:1,3:0}, current:2, eq:'DFS(2): mark VISITING', desc:'1 → 2: recurse into 2. Mark as VISITING.', codeLines:[3,4], vars:[{n:'node',v:'2'},{n:'state[2]',v:'visiting'}] },
  { state:{0:1,1:1,2:1,3:1}, current:3, eq:'DFS(3): mark VISITING', desc:'2 → 3: recurse into 3. Mark as VISITING.', codeLines:[3,4], vars:[{n:'node',v:'3'},{n:'state[3]',v:'visiting'}] },
  { state:{0:1,1:1,2:1,3:2}, current:3, eq:'DFS(3): no neighbours → mark DONE', desc:'Node 3 has no outgoing edges. No cycle here. Mark as DONE.', codeLines:[5,6], vars:[{n:'state[3]',v:'done'}] },
  { state:{0:1,1:1,2:2,3:2}, current:2, eq:'DFS(2): all neighbours done → mark DONE', desc:'All of 2\'s neighbours finished. Mark 2 as DONE.', codeLines:[5,6], vars:[{n:'state[2]',v:'done'}] },
  { state:{0:1,1:2,2:2,3:2}, current:1, eq:'DFS(1): all neighbours done → mark DONE', desc:'All of 1\'s neighbours finished. Mark 1 as DONE.', codeLines:[5,6], vars:[{n:'state[1]',v:'done'}] },
  { state:{0:2,1:2,2:2,3:2}, current:0, eq:'DFS(0): all done → no cycle found!', desc:'All nodes DONE. No back-edge encountered anywhere → no cycle.', codeLines:[5,6,7], vars:[{n:'state[0]',v:'done'}] },
  { state:{0:2,1:2,2:2,3:2}, result:true, eq:'return True', desc:'No cycle = all courses can be finished.', codeLines:[7], vars:[{n:'result',v:'True'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">canFinish</span><span class="cg-op">(</span>n<span class="cg-op">,</span> prereqs<span class="cg-op">):</span>' },
  { html:'    adj <span class="cg-op">=</span> build_adj<span class="cg-op">(</span>prereqs<span class="cg-op">)</span>' },
  { html:'    state <span class="cg-op">= {</span>i<span class="cg-op">:</span><span class="cg-num">0</span> <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>n<span class="cg-op">)}</span>' },
  { html:'    <span class="cg-kw">def</span> <span class="cg-fn">dfs</span><span class="cg-op">(</span>u<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">if</span> state<span class="cg-op">[</span>u<span class="cg-op">]==</span><span class="cg-num">1</span><span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>  <span class="cg-cm"># cycle!</span>' },
  { html:'        <span class="cg-kw">if</span> state<span class="cg-op">[</span>u<span class="cg-op">]==</span><span class="cg-num">2</span><span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">True</span>   <span class="cg-cm"># already done</span>' },
  { html:'        state<span class="cg-op">[</span>u<span class="cg-op">]=</span><span class="cg-num">1</span><span class="cg-op">;</span> <span class="cg-kw">return</span> <span class="cg-bi">all</span><span class="cg-op">(</span>dfs<span class="cg-op">(</span>v<span class="cg-op">)</span> <span class="cg-kw">for</span> v <span class="cg-kw">in</span> adj<span class="cg-op">[</span>u<span class="cg-op">]);</span> state<span class="cg-op">[</span>u<span class="cg-op">]=</span><span class="cg-num">2</span>' },
  { html:'    <span class="cg-kw">return</span> <span class="cg-bi">all</span><span class="cg-op">(</span>dfs<span class="cg-op">(</span>i<span class="cg-op">)</span> <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>n<span class="cg-op">))</span>' },
];

const NODE_X = [60,170,280,390];
const STATE_COLOR = {0:'rgba(255,255,255,.15)', 1:'#f59e0b', 2:'#22c55e'};
const STATE_LABEL = {0:'unvisited', 1:'VISITING', 2:'DONE'};

interface Props { accColor: string }
export const CourseSchedule: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="course_schedule.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as CsStep;
      return (
        <>
          <span className="viz-section-lbl">DIRECTED GRAPH (0→1→2→3)</span>
          <svg width="420" height="80" style={{overflow:'visible',display:'block'}}>
            {/* Edges */}
            {Object.entries(ADJ).map(([u,nbrs]) => nbrs.map(v => {
              const ux = NODE_X[Number(u)], vx = NODE_X[v];
              const bothDone = s.state[Number(u)]===2 && s.state[v]===2;
              return <line key={`${u}-${v}`} x1={ux+22} y1={40} x2={vx-22} y2={40} stroke={bothDone?'#22c55e55':'rgba(255,255,255,.2)'} strokeWidth={1.5} markerEnd="url(#arrow)" />;
            }))}
            <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.3)" /></marker></defs>
            {/* Nodes */}
            {Array.from({length:N},(_,i) => {
              const st = s.state[i];
              const c = STATE_COLOR[st];
              const isActive = i === s.current;
              return (
                <g key={i}>
                  <circle cx={NODE_X[i]} cy={40} r={22} fill={st===2?'rgba(34,197,94,.25)':isActive?'rgba(245,158,11,.3)':'rgba(255,255,255,.05)'} stroke={c} strokeWidth={isActive?2.5:1.5} style={{transition:'all .3s'}} />
                  <text x={NODE_X[i]} y={47} textAnchor="middle" fill={st===2?'#22c55e':st===1?'#f59e0b':'rgba(255,255,255,.5)'} fontFamily="var(--disp)" fontSize="18">{i}</text>
                </g>
              );
            })}
          </svg>

          {/* State legend */}
          <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginTop:'.3rem'}}>
            {([0,1,2] as const).map(st => (
              <div key={st} style={{padding:'.25rem .55rem',background:STATE_COLOR[st]+'22',border:`1px solid ${STATE_COLOR[st]}55`,borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.66rem',color:STATE_COLOR[st]}}>
                {STATE_LABEL[st]}: {Object.entries(s.state).filter(([,v])=>v===st).map(([k])=>k).join(',')||'—'}
              </div>
            ))}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
