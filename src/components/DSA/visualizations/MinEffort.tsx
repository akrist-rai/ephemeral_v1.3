import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// heights=[[1,3],[2,4]]  → min effort path = 2
// Path: (0,0)→(1,0)→(1,1)  efforts: |1-2|=1, |2-4|=2  max=2
// Or: (0,0)→(0,1)→(1,1) efforts: |1-3|=2, |3-4|=1  max=2
const HEIGHTS = [[1,3],[2,4]];
const INF = 999;

type MeStep2 = VizStep & { dist: number[][]; visited: [number,number][]; popped?: [number,number] };

const STEPS: MeStep2[] = [
  { dist:[[0,INF],[INF,INF]], visited:[], eq:'dist[0][0]=0  all others=∞', desc:'Modified Dijkstra. dist[r][c] = min effort to reach (r,c). Effort = max |diff| on path.', codeLines:[0,1,2], vars:[{n:'src',v:'(0,0)'}] },
  { dist:[[0,2],[1,INF]], visited:[[0,0]], popped:[0,0], eq:'pop (0,0,0): right→dist[0][1]=|1-3|=2  down→dist[1][0]=|1-2|=1', desc:'Pop (0,0): relax right (0,1) with effort=max(0,2)=2; relax down (1,0) with effort=max(0,1)=1.', codeLines:[3,4,5,6], vars:[{n:'node',v:'(0,0)'},{n:'effort',v:'0'}] },
  { dist:[[0,2],[1,2]], visited:[[0,0],[1,0]], popped:[1,0], eq:'pop (1,1,0): right→dist[1][1]=max(1,|2-4|)=2', desc:'Pop (1,0) effort=1: relax right (1,1). New effort=max(1,|2-4|)=max(1,2)=2.', codeLines:[3,4,5,6], vars:[{n:'node',v:'(1,0)'},{n:'effort',v:'1'}] },
  { dist:[[0,2],[1,2]], visited:[[0,0],[1,0],[0,1]], popped:[0,1], eq:'pop (2,0,1): down→dist[1][1]=max(2,|3-4|)=2  (no improvement)', desc:'Pop (0,1) effort=2: try (1,1). max(2,|3-4|)=max(2,1)=2. dist[1][1] already 2, no update.', codeLines:[3,4,5], vars:[{n:'node',v:'(0,1)'}] },
  { dist:[[0,2],[1,2]], visited:[[0,0],[1,0],[0,1],[1,1]], popped:[1,1], eq:'pop (2,1,1): destination reached → return 2', desc:'Pop (1,1) effort=2. This is the destination (bottom-right). Return 2.', codeLines:[7], vars:[{n:'result',v:'2'}] },
  { dist:[[0,2],[1,2]], visited:[[0,0],[1,0],[0,1],[1,1]], eq:'return 2', desc:'Minimum effort path has max-diff = 2. Both valid paths yield effort 2.', codeLines:[7], vars:[{n:'result',v:'2'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">minimumEffortPath</span><span class="cg-op">(</span>heights<span class="cg-op">):</span>' },
  { html:'    R<span class="cg-op">,</span>C <span class="cg-op">=</span> <span class="cg-bi">len</span><span class="cg-op">(</span>heights<span class="cg-op">),</span> <span class="cg-bi">len</span><span class="cg-op">(</span>heights<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">])</span>' },
  { html:'    dist <span class="cg-op">= [[</span><span class="cg-bi">inf</span><span class="cg-op">]*</span>C <span class="cg-kw">for</span> _ <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>R<span class="cg-op">)];</span> dist<span class="cg-op">[</span><span class="cg-num">0</span><span class="cg-op">][</span><span class="cg-num">0</span><span class="cg-op">]=</span><span class="cg-num">0</span>' },
  { html:'    heap <span class="cg-op">= [(</span><span class="cg-num">0</span><span class="cg-op">,</span><span class="cg-num">0</span><span class="cg-op">,</span><span class="cg-num">0</span><span class="cg-op">)]</span>' },
  { html:'    <span class="cg-kw">while</span> heap<span class="cg-op">:</span>' },
  { html:'        eff<span class="cg-op">,</span>r<span class="cg-op">,</span>c <span class="cg-op">=</span> heapq<span class="cg-op">.</span><span class="cg-bi">heappop</span><span class="cg-op">(</span>heap<span class="cg-op">)</span>' },
  { html:'        <span class="cg-kw">for</span> nr<span class="cg-op">,</span>nc<span class="cg-op">:</span> ne<span class="cg-op">=</span><span class="cg-bi">max</span><span class="cg-op">(</span>eff<span class="cg-op">,|</span>h<span class="cg-op">[</span>r<span class="cg-op">][</span>c<span class="cg-op">]-</span>h<span class="cg-op">[</span>nr<span class="cg-op">][</span>nc<span class="cg-op">]|);</span> relax' },
  { html:'    <span class="cg-kw">return</span> dist<span class="cg-op">[-</span><span class="cg-num">1</span><span class="cg-op">][-</span><span class="cg-num">1</span><span class="cg-op">]</span>' },
];

const CELL_POS = (r: number, c: number) => ({ x: 80 + c*120, y: 30 + r*100 });
const ALL_CELLS: [number,number][] = [[0,0],[0,1],[1,0],[1,1]];

interface Props { accColor: string }
export const MinEffort: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="min_effort_path.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as MeStep2;
      const isVisited = (r: number, c: number) => s.visited.some(([vr,vc])=>vr===r&&vc===c);
      const isPopped = (r: number, c: number) => s.popped?.[0]===r && s.popped?.[1]===c;

      return (
        <>
          <span className="viz-section-lbl">GRID — effort = max |diff| on path</span>
          <svg width="300" height="200" style={{overflow:'visible',display:'block'}}>
            {/* Edges */}
            {ALL_CELLS.map(([r,c]) => {
              const neighbors: [number,number][] = [];
              if(c+1<2) neighbors.push([r,c+1]);
              if(r+1<2) neighbors.push([r+1,c]);
              return neighbors.map(([nr,nc]) => {
                const diff = Math.abs(HEIGHTS[r][c]-HEIGHTS[nr][nc]);
                const p1 = CELL_POS(r,c), p2 = CELL_POS(nr,nc);
                const mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2;
                const settled = isVisited(r,c) && isVisited(nr,nc);
                return (
                  <g key={`${r}${c}-${nr}${nc}`}>
                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={settled?'#22c55e55':'rgba(255,255,255,.2)'} strokeWidth={settled?2:1} style={{transition:'all .3s'}} />
                    <text x={mx} y={my-4} textAnchor="middle" fill="rgba(245,158,11,.8)" fontFamily="var(--mono)" fontSize="10">|Δ|={diff}</text>
                  </g>
                );
              });
            })}
            {/* Nodes */}
            {ALL_CELLS.map(([r,c]) => {
              const pos = CELL_POS(r,c);
              const vis = isVisited(r,c);
              const pop = isPopped(r,c);
              const d = s.dist[r][c];
              const isDst = r===1&&c===1;
              const fill = isDst&&vis?'rgba(34,197,94,.4)':pop?'rgba(245,158,11,.3)':vis?'rgba(37,99,235,.25)':'rgba(255,255,255,.05)';
              const stroke = isDst&&vis?'#22c55e':pop?'#f59e0b':vis?'#2563eb':'rgba(255,255,255,.2)';
              return (
                <g key={`${r}${c}`}>
                  <rect x={pos.x-28} y={pos.y-22} width={56} height={44} rx={6} fill={fill} stroke={stroke} strokeWidth={2} style={{transition:'all .3s'}} />
                  <text x={pos.x} y={pos.y-4} textAnchor="middle" fill="rgba(255,255,255,.4)" fontFamily="var(--mono)" fontSize="9">h={HEIGHTS[r][c]}</text>
                  <text x={pos.x} y={pos.y+12} textAnchor="middle" fill={d<INF?'#f59e0b':'rgba(255,255,255,.3)'} fontFamily="var(--mono)" fontSize="10">d={d===INF?'∞':d}</text>
                  {r===0&&c===0&&<text x={pos.x} y={pos.y-30} textAnchor="middle" fill="#e11d48aa" fontFamily="var(--mono)" fontSize="9">START</text>}
                  {r===1&&c===1&&<text x={pos.x} y={pos.y+38} textAnchor="middle" fill="#22c55eaa" fontFamily="var(--mono)" fontSize="9">END</text>}
                </g>
              );
            })}
          </svg>
        </>
      );
    }}
  </VisualizerShell>
);
