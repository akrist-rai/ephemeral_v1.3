import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// n=4, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1 (at most 1 stop)
// Bellman-Ford: k+1=2 rounds of relaxation
// Answer: 200 (0→1→2, 1 stop)
const INF = 999;
const FLIGHTS: [number,number,number][] = [[0,1,100],[1,2,100],[0,2,500]];

type CfStep = VizStep & { prices: number[]; round: number };

const STEPS: CfStep[] = [
  { prices:[0,INF,INF,INF], round:0, eq:'prices=[0,∞,∞,∞]  src=0  k=1', desc:'Bellman-Ford with k+1=2 rounds. Each round represents one more hop.', codeLines:[0,1,2], vars:[{n:'src',v:'0'},{n:'k',v:'1'}] },
  { prices:[0,100,500,INF], round:1, eq:'round 1: 0→1=100  0→2=500', desc:'Round 1 (up to 1 stop): relax all edges from current prices. dist[1]=100, dist[2]=500.', codeLines:[3,4,5], vars:[{n:'round',v:'1'},{n:'prices[1]',v:'100'},{n:'prices[2]',v:'500'}] },
  { prices:[0,100,200,INF], round:2, eq:'round 2: 1→2  100+100=200 < 500', desc:'Round 2 (up to 2 hops = 1 stop used): relax 1→2. 100+100=200 < 500 → update.', codeLines:[3,4,5], vars:[{n:'round',v:'2'},{n:'prices[2]',v:'200'}] },
  { prices:[0,100,200,INF], round:2, eq:'return prices[2] = 200', desc:'Cheapest flight 0→2 with ≤1 stop costs 200 (route: 0→1→2).', codeLines:[6], vars:[{n:'result',v:'200'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">findCheapestPrice</span><span class="cg-op">(</span>n<span class="cg-op">,</span>flights<span class="cg-op">,</span>src<span class="cg-op">,</span>dst<span class="cg-op">,</span>k<span class="cg-op">):</span>' },
  { html:'    prices <span class="cg-op">= [</span><span class="cg-bi">inf</span><span class="cg-op">] *</span> n<span class="cg-op">;</span> prices<span class="cg-op">[</span>src<span class="cg-op">] =</span> <span class="cg-num">0</span>' },
  { html:'' },
  { html:'    <span class="cg-kw">for</span> _ <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span>k<span class="cg-op">+</span><span class="cg-num">1</span><span class="cg-op">):</span>' },
  { html:'        tmp <span class="cg-op">=</span> prices<span class="cg-op">[:]</span>' },
  { html:'        <span class="cg-kw">for</span> u<span class="cg-op">,</span>v<span class="cg-op">,</span>w <span class="cg-kw">in</span> flights<span class="cg-op">:</span>' },
  { html:'            tmp<span class="cg-op">[</span>v<span class="cg-op">] =</span> <span class="cg-bi">min</span><span class="cg-op">(</span>tmp<span class="cg-op">[</span>v<span class="cg-op">],</span> prices<span class="cg-op">[</span>u<span class="cg-op">]+</span>w<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">return</span> prices<span class="cg-op">[</span>dst<span class="cg-op">]</span> <span class="cg-kw">if</span> prices<span class="cg-op">[</span>dst<span class="cg-op">]!=</span><span class="cg-bi">inf</span> <span class="cg-kw">else</span> <span class="cg-op">-</span><span class="cg-num">1</span>' },
];

const NODE_POS = [{x:60,y:90},{x:200,y:30},{x:340,y:90},{x:200,y:160}];
const COLORS = ['#e11d48','#2563eb','#16a34a','#7c3aed'];

interface Props { accColor: string }
export const CheapestFlights: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="cheapest_flights.py" doneResult="200" accColor={accColor}>
    {(step) => {
      const s = step as CfStep;
      const pathEdge = s.round === 2 ? [1,2] : s.round === 1 ? [0,1] : null;
      return (
        <>
          <span className="viz-section-lbl">FLIGHTS GRAPH  src=0  dst=2  k=1 stop</span>
          <svg width="400" height="200" style={{overflow:'visible',display:'block'}}>
            <defs><marker id="cf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.4)" /></marker></defs>
            {FLIGHTS.map(([u,v,w],k) => {
              const settled = s.prices[v] < INF && s.prices[v] <= s.prices[u]+w;
              const isPath = (s.prices[2]===200) && ((u===0&&v===1)||(u===1&&v===2));
              const c = isPath ? '#22c55e' : settled ? '#2563ebaa' : 'rgba(255,255,255,.25)';
              const mx = (NODE_POS[u].x+NODE_POS[v].x)/2;
              const my = (NODE_POS[u].y+NODE_POS[v].y)/2;
              return (
                <g key={k}>
                  <line x1={NODE_POS[u].x} y1={NODE_POS[u].y} x2={NODE_POS[v].x} y2={NODE_POS[v].y} stroke={c} strokeWidth={isPath?2.5:1.5} markerEnd="url(#cf-arr)" style={{transition:'all .3s'}} />
                  <text x={mx} y={my-6} textAnchor="middle" fill="rgba(245,158,11,.9)" fontFamily="var(--mono)" fontSize="10">${w}</text>
                </g>
              );
            })}
            {[0,1,2].map(n => {
              const d = s.prices[n];
              const isFinalized = d < INF;
              const isDst = n===2;
              const isSrc = n===0;
              const fill = isDst&&isFinalized?'rgba(34,197,94,.3)':isFinalized?'rgba(37,99,235,.25)':'rgba(255,255,255,.05)';
              const stroke = isDst&&isFinalized?'#22c55e':isSrc?'#e11d48':isFinalized?'#2563eb':'rgba(255,255,255,.2)';
              return (
                <g key={n}>
                  <circle cx={NODE_POS[n].x} cy={NODE_POS[n].y} r={26} fill={fill} stroke={stroke} strokeWidth={2} style={{transition:'all .3s'}} />
                  <text x={NODE_POS[n].x} y={NODE_POS[n].y+6} textAnchor="middle" fill="rgba(255,255,255,.7)" fontFamily="var(--disp)" fontSize="17">{n}</text>
                  <text x={NODE_POS[n].x} y={NODE_POS[n].y+44} textAnchor="middle" fill={d<INF?'#f59e0b':'rgba(255,255,255,.25)'} fontFamily="var(--mono)" fontSize="10">${d===INF?'∞':d}</text>
                  {isSrc&&<text x={NODE_POS[n].x} y={NODE_POS[n].y-38} textAnchor="middle" fill="#e11d48aa" fontFamily="var(--mono)" fontSize="9">src</text>}
                  {isDst&&<text x={NODE_POS[n].x} y={NODE_POS[n].y-38} textAnchor="middle" fill="#22c55eaa" fontFamily="var(--mono)" fontSize="9">dst</text>}
                </g>
              );
            })}
          </svg>

          <div style={{fontFamily:'var(--mono)',fontSize:'.68rem',color:'rgba(255,255,255,.45)',marginTop:'.2rem'}}>
            round {s.round}/2 — prices: {[0,1,2].map(n => (
              <span key={n} style={{color:s.prices[n]<INF?'#f59e0b':'rgba(255,255,255,.25)',marginLeft:'.5rem'}}>[{n}]${s.prices[n]===INF?'∞':s.prices[n]}</span>
            ))}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
