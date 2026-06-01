import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// grid = [["1","1","0"],
//         ["0","1","0"],
//         ["0","0","1"]]
// → 2 islands

const GRID_INIT = [['1','1','0'],['0','1','0'],['0','0','1']];

type NiStep = VizStep & {
  visited: [number,number][];   // cells marked visited (flooded)
  queue: [number,number][];     // BFS queue snapshot
  count: number;
  activeCell?: [number,number]; // currently scanning
};

const STEPS: NiStep[] = [
  { visited:[], queue:[], count:0, activeCell:undefined, eq:'count = 0   scan grid', desc:'Scan each cell. When we find unvisited "1", BFS-flood the entire island.', codeLines:[0,1], vars:[{n:'count',v:'0'}] },
  { visited:[], queue:[], count:0, activeCell:[0,0], eq:'grid[0][0]="1" unvisited → count=1, start BFS', desc:'Found first land cell. Increment count to 1. Queue up (0,0) to flood.', codeLines:[2,3,4], vars:[{n:'count',v:'1'},{n:'queue',v:'[(0,0)]'}] },
  { visited:[[0,0],[0,1],[1,1]], queue:[], count:1, activeCell:undefined, eq:'BFS floods (0,0)→(0,1)→(1,1) — island 1', desc:'BFS from (0,0): neighbours (0,1) and (1,1) are also "1". All marked visited.', codeLines:[5,6,7], vars:[{n:'count',v:'1'},{n:'flooded',v:'3 cells'}] },
  { visited:[[0,0],[0,1],[1,1]], queue:[], count:1, activeCell:[2,2], eq:'grid[2][2]="1" unvisited → count=2, start BFS', desc:'Continue scanning. Find (2,2) — a new unvisited "1". Increment count to 2.', codeLines:[2,3,4], vars:[{n:'count',v:'2'},{n:'queue',v:'[(2,2)]'}] },
  { visited:[[0,0],[0,1],[1,1],[2,2]], queue:[], count:2, activeCell:undefined, eq:'BFS floods (2,2) — island 2 (1 cell)', desc:'(2,2) has no "1" neighbours. Island 2 is just one cell.', codeLines:[5,6,7], vars:[{n:'count',v:'2'},{n:'flooded',v:'1 cell'}] },
  { visited:[[0,0],[0,1],[1,1],[2,2]], queue:[], count:2, eq:'return 2', desc:'Grid fully scanned. 2 islands found.', codeLines:[8], vars:[{n:'result',v:'2'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">numIslands</span><span class="cg-op">(</span>grid<span class="cg-op">):</span>' },
  { html:'    count <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html:'    <span class="cg-kw">for</span> r<span class="cg-op">,</span>c <span class="cg-kw">in</span> all_cells<span class="cg-op">:</span>' },
  { html:'        <span class="cg-kw">if</span> grid<span class="cg-op">[</span>r<span class="cg-op">][</span>c<span class="cg-op">] ==</span> <span class="cg-str">"1"</span><span class="cg-op">:</span>' },
  { html:'            count <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html:'            queue <span class="cg-op">= [(</span>r<span class="cg-op">,</span>c<span class="cg-op">)]</span>' },
  { html:'            <span class="cg-kw">while</span> queue<span class="cg-op">:</span>' },
  { html:'                flood neighbours<span class="cg-op">,</span> mark visited' },
  { html:'    <span class="cg-kw">return</span> count' },
];

interface Props { accColor: string }
export const NumIslands: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="num_islands.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as NiStep;
      const isVisited = (r: number, c: number) => s.visited.some(([vr,vc]) => vr===r && vc===c);
      const isActive  = (r: number, c: number) => s.activeCell?.[0]===r && s.activeCell?.[1]===c;

      return (
        <>
          <span className="viz-section-lbl">GRID (1=land, 0=water)</span>
          <div style={{ display:'inline-flex', flexDirection:'column', gap:'4px' }}>
            {GRID_INIT.map((row, r) => (
              <div key={r} style={{ display:'flex', gap:'4px' }}>
                {row.map((cell, c) => {
                  const land = cell === '1';
                  const visited = isVisited(r, c);
                  const active = isActive(r, c);
                  const bg = active ? 'rgba(245,158,11,.5)' : visited && land ? 'rgba(34,197,94,.35)' : land ? 'rgba(37,99,235,.3)' : 'rgba(255,255,255,.04)';
                  const border = active ? '#f59e0b' : visited && land ? '#22c55e' : land ? '#2563eb55' : 'rgba(255,255,255,.08)';
                  return (
                    <div key={c} style={{ width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', background:bg, border:`2px solid ${border}`, fontFamily:'var(--disp)', fontSize:'1.6rem', color: active ? '#f59e0b' : visited && land ? '#22c55e' : land ? '#7dd3fc' : 'rgba(255,255,255,.2)', transition:'all .35s' }}>
                      {cell}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop:'.5rem', display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
            <div style={{ padding:'.35rem .6rem', background:'rgba(37,99,235,.1)', border:'1px solid rgba(37,99,235,.3)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>unvisited land </span><span style={{color:'#7dd3fc'}}>■</span>
            </div>
            <div style={{ padding:'.35rem .6rem', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.3)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>current scan </span><span style={{color:'#f59e0b'}}>■</span>
            </div>
            <div style={{ padding:'.35rem .6rem', background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.3)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>flooded </span><span style={{color:'#22c55e'}}>■</span>
            </div>
            <div style={{ padding:'.35rem .6rem', background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.25)', borderRadius:'3px', fontFamily:'var(--mono)', fontSize:'.7rem' }}>
              <span style={{color:'rgba(255,255,255,.4)'}}>islands found: </span><span style={{color:'#22c55e', fontWeight:700, fontFamily:'var(--disp)', fontSize:'1rem'}}>{s.count}</span>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
