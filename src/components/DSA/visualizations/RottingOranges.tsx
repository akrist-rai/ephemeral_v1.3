import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// grid = [[2,1,1],[1,1,0],[0,1,1]]  → 4 minutes
// 0=empty 1=fresh 2=rotten

const GRID_INIT = [[2,1,1],[1,1,0],[0,1,1]];

type RoStep = VizStep & {
  rotten: [number,number][];   // all rotten cells so far
  fresh: number;               // fresh remaining
  minute: number;
};

const STEPS: RoStep[] = [
  { rotten:[[0,0]],                              fresh:6, minute:0, eq:'t=0: rotten={(0,0)}', desc:'Start: 1 rotten orange. 6 fresh. Add all rotten to BFS queue simultaneously.', codeLines:[0,1,2], vars:[{n:'minute',v:'0'},{n:'fresh',v:'6'}] },
  { rotten:[[0,0],[0,1],[1,0]],                   fresh:4, minute:1, eq:'t=1: (0,0) rots (0,1) and (1,0)', desc:'Minute 1: BFS spreads from (0,0) to neighbours (0,1) and (1,0).', codeLines:[3,4,5], vars:[{n:'minute',v:'1'},{n:'fresh',v:'4'}] },
  { rotten:[[0,0],[0,1],[1,0],[0,2],[1,1]],        fresh:2, minute:2, eq:'t=2: rots (0,2) and (1,1)', desc:'Minute 2: (0,1) rots (0,2); (1,0) and (0,1) both rot (1,1).', codeLines:[3,4,5], vars:[{n:'minute',v:'2'},{n:'fresh',v:'2'}] },
  { rotten:[[0,0],[0,1],[1,0],[0,2],[1,1],[2,1]],   fresh:1, minute:3, eq:'t=3: (1,1) rots (2,1)', desc:'Minute 3: (1,1) rots its southern neighbour (2,1).', codeLines:[3,4,5], vars:[{n:'minute',v:'3'},{n:'fresh',v:'1'}] },
  { rotten:[[0,0],[0,1],[1,0],[0,2],[1,1],[2,1],[2,2]],fresh:0,minute:4,eq:'t=4: (2,1) rots (2,2)  fresh=0', desc:'Minute 4: (2,1) rots (2,2). No fresh left!', codeLines:[3,4,5], vars:[{n:'minute',v:'4'},{n:'fresh',v:'0'}] },
  { rotten:[[0,0],[0,1],[1,0],[0,2],[1,1],[2,1],[2,2]],fresh:0,minute:4,eq:'return 4', desc:'All 7 non-empty cells rotted. BFS took 4 minutes.', codeLines:[6], vars:[{n:'result',v:'4'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">orangesRotting</span><span class="cg-op">(</span>grid<span class="cg-op">):</span>' },
  { html:'    q <span class="cg-op">=</span> all initially rotten cells' },
  { html:'    fresh <span class="cg-op">=</span> count of fresh cells' },
  { html:'    <span class="cg-kw">while</span> q <span class="cg-kw">and</span> fresh<span class="cg-op">:</span>' },
  { html:'        <span class="cg-kw">for</span> _ <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>q<span class="cg-op">)):</span>' },
  { html:'            spread to 4 neighbours<span class="cg-op">;</span> minute <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html:'    <span class="cg-kw">return</span> minute <span class="cg-kw">if not</span> fresh <span class="cg-kw">else</span> <span class="cg-op">-</span><span class="cg-num">1</span>' },
];

interface Props { accColor: string }
export const RottingOranges: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="rotting_oranges.py" doneResult="4" accColor={accColor}>
    {(step) => {
      const s = step as RoStep;
      const isRotten = (r: number, c: number) => s.rotten.some(([rr,cc]) => rr===r && cc===c);
      const isNew = (r: number, c: number) => {
        if (!isRotten(r,c)) return false;
        const prevStep = STEPS[Math.max(0, STEPS.findIndex(st => st.minute===s.minute)-1)];
        return !prevStep?.rotten.some(([rr,cc])=>rr===r&&cc===c);
      };

      return (
        <>
          <span className="viz-section-lbl">GRID  0=empty  1=fresh  2=rotten</span>
          <div style={{display:'inline-flex',flexDirection:'column',gap:'4px'}}>
            {GRID_INIT.map((row,r) => (
              <div key={r} style={{display:'flex',gap:'4px'}}>
                {row.map((cell,c) => {
                  const empty = cell === 0;
                  const rotten = isRotten(r,c);
                  const fresh = !empty && !rotten;
                  const bg = empty ? 'rgba(255,255,255,.02)' : rotten ? 'rgba(225,29,72,.35)' : 'rgba(245,158,11,.3)';
                  const border = empty ? 'rgba(255,255,255,.05)' : rotten ? '#e11d48' : '#f59e0b';
                  const emoji = empty ? '' : rotten ? '🟥' : '🟡';
                  return (
                    <div key={c} style={{width:'52px',height:'52px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'6px',background:bg,border:`2px solid ${border}`,fontSize:'1.4rem',transition:'all .35s',boxShadow:rotten&&!empty?'0 0 10px rgba(225,29,72,.4)':undefined}}>
                      {empty ? '' : rotten ? '✕' : '●'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{marginTop:'.5rem',display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
            <div style={{padding:'.35rem .6rem',background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.3)',borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.72rem'}}>
              <span style={{color:'rgba(255,255,255,.4)'}}>fresh left: </span><span style={{color:'#f59e0b',fontWeight:700,fontFamily:'var(--disp)',fontSize:'1.1rem'}}>{s.fresh}</span>
            </div>
            <div style={{padding:'.35rem .6rem',background:'rgba(225,29,72,.1)',border:'1px solid rgba(225,29,72,.3)',borderRadius:'3px',fontFamily:'var(--mono)',fontSize:'.72rem'}}>
              <span style={{color:'rgba(255,255,255,.4)'}}>minute: </span><span style={{color:'#e11d48',fontWeight:700,fontFamily:'var(--disp)',fontSize:'1.1rem'}}>{s.minute}</span>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
