import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// n=4, times=[[2,1,1],[2,3,1],[3,4,1]], k=2 (source)
// Dijkstra from node 2: dist[1]=1, dist[3]=1, dist[4]=2 → max=2
const INF = 999;
const N_NODES = 4;
const EDGES: [number,number,number][] = [[2,1,1],[2,3,1],[3,4,1]]; // [from,to,w]
const SOURCE = 2;

type NdStep = VizStep & { dist: Record<number,number>; visited: number[]; popped?: number };

const STEPS: NdStep[] = [
  { dist:{1:INF,2:0,3:INF,4:INF}, visited:[], eq:'dist={1:∞,2:0,3:∞,4:∞}  src=2', desc:'Dijkstra from source 2. Start with dist[src]=0, all others ∞.', codeLines:[0,1,2], vars:[{n:'src',v:'2'}] },
  { dist:{1:1,2:0,3:1,4:INF}, visited:[2], popped:2, eq:'pop (0,2): relax 2→1 (w=1), 2→3 (w=1)', desc:'Pop node 2 (dist=0). Relax: dist[1]=0+1=1, dist[3]=0+1=1.', codeLines:[3,4,5,6], vars:[{n:'node',v:'2'},{n:'dist[1]',v:'1'},{n:'dist[3]',v:'1'}] },
  { dist:{1:1,2:0,3:1,4:INF}, visited:[2,1], popped:1, eq:'pop (1,1): no outgoing edges', desc:'Pop node 1 (dist=1). No outgoing edges from 1.', codeLines:[3,4,5], vars:[{n:'node',v:'1'}] },
  { dist:{1:1,2:0,3:1,4:2}, visited:[2,1,3], popped:3, eq:'pop (1,3): relax 3→4 (w=1)  dist[4]=2', desc:'Pop node 3 (dist=1). Relax: dist[4]=1+1=2.', codeLines:[3,4,5,6], vars:[{n:'node',v:'3'},{n:'dist[4]',v:'2'}] },
  { dist:{1:1,2:0,3:1,4:2}, visited:[2,1,3,4], popped:4, eq:'pop (2,4): all nodes visited', desc:'Pop node 4 (dist=2). All nodes reached.', codeLines:[3,4,5], vars:[{n:'node',v:'4'}] },
  { dist:{1:1,2:0,3:1,4:2}, visited:[2,1,3,4], eq:'return max(dist.values()) = 2', desc:'Max distance = 2 (to reach node 4 from 2). That is the answer.', codeLines:[7], vars:[{n:'result',v:'2'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">networkDelayTime</span><span class="cg-op">(</span>times<span class="cg-op">,</span> n<span class="cg-op">,</span> k<span class="cg-op">):</span>' },
  { html:'    adj <span class="cg-op">=</span> build_adj<span class="cg-op">(</span>times<span class="cg-op">)</span>' },
  { html:'    dist <span class="cg-op">= {</span>i<span class="cg-op">:</span><span class="cg-bi">inf</span> <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-num">1</span><span class="cg-op">,n+</span><span class="cg-num">1</span><span class="cg-op">)};</span> dist<span class="cg-op">[</span>k<span class="cg-op">]=</span><span class="cg-num">0</span>' },
  { html:'    heap <span class="cg-op">= [(</span><span class="cg-num">0</span><span class="cg-op">,</span>k<span class="cg-op">)]</span>' },
  { html:'    <span class="cg-kw">while</span> heap<span class="cg-op">:</span>' },
  { html:'        d<span class="cg-op">,</span>u <span class="cg-op">=</span> heapq<span class="cg-op">.</span><span class="cg-bi">heappop</span><span class="cg-op">(</span>heap<span class="cg-op">)</span>' },
  { html:'        <span class="cg-kw">for</span> v<span class="cg-op">,</span>w <span class="cg-kw">in</span> adj<span class="cg-op">[</span>u<span class="cg-op">]:</span> <span class="cg-kw">if</span> d<span class="cg-op">+</span>w<span class="cg-op">&lt;</span>dist<span class="cg-op">[</span>v<span class="cg-op">]:</span> dist<span class="cg-op">[</span>v<span class="cg-op">]=</span>d<span class="cg-op">+</span>w<span class="cg-op">;</span>push' },
  { html:'    <span class="cg-kw">return</span> <span class="cg-bi">max</span><span class="cg-op">(</span>dist<span class="cg-op">.</span><span class="cg-bi">values</span><span class="cg-op">())</span>' },
];

const NODE_POS: Record<number,{x:number;y:number}> = {1:{x:80,y:80},2:{x:200,y:30},3:{x:320,y:80},4:{x:320,y:160}};

interface Props { accColor: string }
export const NetworkDelay: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="network_delay.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as NdStep;
      return (
        <>
          <span className="viz-section-lbl">WEIGHTED DIRECTED GRAPH  src={SOURCE}</span>
          <svg width="400" height="200" style={{overflow:'visible',display:'block'}}>
            <defs><marker id="nd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.4)" /></marker></defs>
            {EDGES.map(([u,v,w],k) => {
              const settled = s.visited.includes(u) && s.dist[v] < INF;
              const c = settled ? '#22c55e' : 'rgba(255,255,255,.3)';
              const mx = (NODE_POS[u].x + NODE_POS[v].x) / 2;
              const my = (NODE_POS[u].y + NODE_POS[v].y) / 2;
              return (
                <g key={k}>
                  <line x1={NODE_POS[u].x} y1={NODE_POS[u].y} x2={NODE_POS[v].x} y2={NODE_POS[v].y} stroke={c} strokeWidth={settled?2:1.5} markerEnd="url(#nd-arr)" style={{transition:'all .3s'}} />
                  <text x={mx} y={my-5} textAnchor="middle" fill="rgba(245,158,11,.9)" fontFamily="var(--mono)" fontSize="11">{w}</text>
                </g>
              );
            })}
            {Array.from({length:N_NODES},(_,i) => {
              const n = i+1;
              const d = s.dist[n];
              const vis = s.visited.includes(n);
              const isSource = n === SOURCE;
              const fill = vis ? 'rgba(34,197,94,.3)' : d < INF ? 'rgba(245,158,11,.2)' : 'rgba(255,255,255,.05)';
              const stroke = vis ? '#22c55e' : isSource ? '#f59e0b' : d < INF ? '#f59e0b88' : 'rgba(255,255,255,.2)';
              return (
                <g key={n}>
                  <circle cx={NODE_POS[n].x} cy={NODE_POS[n].y} r={24} fill={fill} stroke={stroke} strokeWidth={2} style={{transition:'all .3s'}} />
                  <text x={NODE_POS[n].x} y={NODE_POS[n].y+6} textAnchor="middle" fill={vis?'#22c55e':'rgba(255,255,255,.8)'} fontFamily="var(--disp)" fontSize="17">{n}</text>
                  <text x={NODE_POS[n].x} y={NODE_POS[n].y+42} textAnchor="middle" fill={d<INF?'#f59e0b':'rgba(255,255,255,.25)'} fontFamily="var(--mono)" fontSize="10">d={d===INF?'∞':d}</text>
                </g>
              );
            })}
          </svg>
        </>
      );
    }}
  </VisualizerShell>
);
