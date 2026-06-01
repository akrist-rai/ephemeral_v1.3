import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// n=4, edges=[[0,1],[1,2],[2,3]], source=0, destination=3
// BFS: 0→1→2→3 found

const EDGES = [[0,1],[1,2],[2,3]];
const ADJ: Record<number, number[]> = { 0:[1], 1:[0,2], 2:[1,3], 3:[2] };
const N = 4;

type FpStep = VizStep & {
  visited: number[];
  queue: number[];
  current?: number;
  found?: boolean;
};

const STEPS: FpStep[] = [
  { visited:[], queue:[], eq:'queue=[0]   visited={0}', desc:'BFS from source=0. Push source onto queue. Mark as visited.', codeLines:[0,1,2], vars:[{n:'queue',v:'[0]'},{n:'visited',v:'{0}'}] },
  { visited:[0], queue:[1], current:0, eq:'pop 0 → neighbours: [1]', desc:'Dequeue 0. Not destination. Enqueue unvisited neighbours: 1.', codeLines:[3,4,5,6], vars:[{n:'node',v:'0'},{n:'queue',v:'[1]'}] },
  { visited:[0,1], queue:[2], current:1, eq:'pop 1 → neighbours: [0,2] → enqueue 2', desc:'Dequeue 1. Not destination. 0 already visited. Enqueue 2.', codeLines:[3,4,5,6], vars:[{n:'node',v:'1'},{n:'queue',v:'[2]'}] },
  { visited:[0,1,2], queue:[3], current:2, eq:'pop 2 → neighbours: [1,3] → enqueue 3', desc:'Dequeue 2. Not destination. 1 already visited. Enqueue 3.', codeLines:[3,4,5,6], vars:[{n:'node',v:'2'},{n:'queue',v:'[3]'}] },
  { visited:[0,1,2,3], queue:[], current:3, found:true, eq:'pop 3 → 3 == destination → return True', desc:'Dequeue 3. 3 == destination! Path found.', codeLines:[7,8], vars:[{n:'node',v:'3'},{n:'result',v:'True'}] },
  { visited:[0,1,2,3], queue:[], found:true, eq:'return True', desc:'Valid path 0→1→2→3 exists.', codeLines:[8], vars:[{n:'result',v:'True'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">validPath</span><span class="cg-op">(</span>n<span class="cg-op">,</span> edges<span class="cg-op">,</span> src<span class="cg-op">,</span> dst<span class="cg-op">):</span>' },
  { html:'    adj<span class="cg-op">,</span> vis <span class="cg-op">=</span> build_adj<span class="cg-op">(</span>edges<span class="cg-op">),</span> <span class="cg-op">{</span>src<span class="cg-op">}</span>' },
  { html:'    stack <span class="cg-op">= [</span>src<span class="cg-op">]</span>' },
  { html:'    <span class="cg-kw">while</span> stack<span class="cg-op">:</span>' },
  { html:'        node <span class="cg-op">=</span> stack<span class="cg-op">.</span><span class="cg-bi">pop</span><span class="cg-op">()</span>' },
  { html:'        <span class="cg-kw">if</span> node <span class="cg-op">==</span> dst<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
  { html:'        <span class="cg-kw">for</span> nb <span class="cg-kw">in</span> adj<span class="cg-op">[</span>node<span class="cg-op">]:</span>' },
  { html:'            <span class="cg-kw">if</span> nb <span class="cg-kw">not in</span> vis<span class="cg-op">:</span> vis<span class="cg-op">.</span><span class="cg-bi">add</span><span class="cg-op">(</span>nb<span class="cg-op">);</span> stack<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>nb<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">return</span> dst <span class="cg-kw">in</span> vis' },
];

const NODE_X = [60, 160, 260, 360];
const NODE_Y = 50;

interface Props { accColor: string }
export const FindPath: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="find_path.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as FpStep;
      const isVisited = (n: number) => s.visited.includes(n);
      const isCurrent = (n: number) => n === s.current;
      const isFound   = (n: number) => !!s.found && n === 3;

      return (
        <>
          <span className="viz-section-lbl">GRAPH (n=4, source=0, destination=3)</span>
          <svg width="420" height="110" style={{ overflow:'visible' }}>
            {/* Edges */}
            {EDGES.map(([u,v],k) => {
              const bothVisited = isVisited(u) && isVisited(v);
              return <line key={k} x1={NODE_X[u]} y1={NODE_Y} x2={NODE_X[v]} y2={NODE_Y} stroke={bothVisited ? '#22c55e' : 'rgba(255,255,255,.2)'} strokeWidth={bothVisited ? 2 : 1} strokeDasharray={bothVisited ? '0' : '4 3'} style={{transition:'all .3s'}} />;
            })}
            {/* Nodes */}
            {Array.from({length:N},(_,i) => {
              const visited = isVisited(i);
              const current = isCurrent(i);
              const found = isFound(i);
              const isSource = i === 0, isDest = i === 3;
              const fill = found ? '#22c55e33' : current ? '#f59e0b33' : visited ? '#2563eb33' : 'rgba(255,255,255,.06)';
              const stroke = found ? '#22c55e' : current ? '#f59e0b' : visited ? '#2563eb' : isSource ? '#e11d48' : isDest ? '#7c3aed' : 'rgba(255,255,255,.2)';
              const textC = found ? '#22c55e' : current ? '#f59e0b' : visited ? '#7dd3fc' : 'rgba(255,255,255,.6)';
              return (
                <g key={i}>
                  <circle cx={NODE_X[i]} cy={NODE_Y} r={22} fill={fill} stroke={stroke} strokeWidth={2} style={{transition:'all .3s'}} />
                  <text x={NODE_X[i]} y={NODE_Y+6} textAnchor="middle" fill={textC} fontFamily="var(--disp)" fontSize="20" style={{transition:'all .3s'}}>{i}</text>
                  {(isSource || isDest) && <text x={NODE_X[i]} y={NODE_Y+42} textAnchor="middle" fill={isSource ? '#e11d48aa' : '#7c3aedaa'} fontFamily="var(--mono)" fontSize="9" letterSpacing="1">{isSource ? 'src' : 'dst'}</text>}
                </g>
              );
            })}
          </svg>

          {/* Queue / visited status */}
          <div style={{ display:'flex', gap:'.6rem', marginTop:'.2rem' }}>
            <div style={{ padding:'.3rem .6rem', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>queue: </span>
              <span style={{color:'#f59e0b'}}>[{s.queue.join(',')}]</span>
            </div>
            <div style={{ padding:'.3rem .6rem', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>visited: </span>
              <span style={{color:'#7dd3fc'}}>&#123;{s.visited.join(',')}&#125;</span>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
