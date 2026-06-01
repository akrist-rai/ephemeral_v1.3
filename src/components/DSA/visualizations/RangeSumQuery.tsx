import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [-2, 0, 3, -5, 2, -1]
// prefix[i] = sum(nums[0..i-1])  so prefix[0]=0
const NUMS = [-2, 0, 3, -5, 2, -1];
const PREFIX = [0, -2, -2, 1, -4, -2, -3]; // len 7
const COLORS = ['#7c3aed','#e11d48','#ea580c','#16a34a','#2563eb','#0891b2'] as const;

type RsStep = VizStep & {
  phase: 'build' | 'query1' | 'query2' | 'done';
  builtUpTo: number;     // how many prefix cells filled
  queryL?: number; queryR?: number; queryResult?: number;
};

const STEPS: RsStep[] = [
  { phase:'build', builtUpTo:0, eq:'prefix = [0, ?, ?, ?, ?, ?, ?]', desc:'prefix[0]=0 (base). prefix[i] = prefix[i-1] + nums[i-1].', codeLines:[0,1,2], vars:[{n:'n',v:'6'}] },
  { phase:'build', builtUpTo:1, eq:'prefix[1] = 0 + (-2) = -2', desc:'prefix[1] = prefix[0] + nums[0] = 0 + (-2) = -2.', codeLines:[2], vars:[{n:'i',v:'1'},{n:'prefix[1]',v:'-2'}] },
  { phase:'build', builtUpTo:2, eq:'prefix[2] = -2 + 0 = -2', desc:'prefix[2] = prefix[1] + nums[1] = -2 + 0 = -2.', codeLines:[2], vars:[{n:'i',v:'2'},{n:'prefix[2]',v:'-2'}] },
  { phase:'build', builtUpTo:3, eq:'prefix[3] = -2 + 3 = 1', desc:'prefix[3] = prefix[2] + nums[2] = -2 + 3 = 1.', codeLines:[2], vars:[{n:'i',v:'3'},{n:'prefix[3]',v:'1'}] },
  { phase:'build', builtUpTo:4, eq:'prefix[4] = 1 + (-5) = -4', desc:'prefix[4] = 1 + (-5) = -4.', codeLines:[2], vars:[{n:'i',v:'4'},{n:'prefix[4]',v:'-4'}] },
  { phase:'build', builtUpTo:5, eq:'prefix[5] = -4 + 2 = -2', desc:'prefix[5] = -4 + 2 = -2.', codeLines:[2], vars:[{n:'i',v:'5'},{n:'prefix[5]',v:'-2'}] },
  { phase:'build', builtUpTo:6, eq:'prefix[6] = -2 + (-1) = -3', desc:'prefix array built. Now O(1) range queries.', codeLines:[2], vars:[{n:'i',v:'6'},{n:'prefix[6]',v:'-3'}] },
  { phase:'query1', builtUpTo:7, queryL:0, queryR:2, queryResult:1, eq:'sumRange(0,2) = prefix[3] - prefix[0] = 1 - 0 = 1', desc:'Query [0..2]: nums[0]+nums[1]+nums[2] = -2+0+3 = 1. Confirmed.', codeLines:[3], vars:[{n:'l',v:'0'},{n:'r',v:'2'},{n:'result',v:'1'}] },
  { phase:'query2', builtUpTo:7, queryL:2, queryR:5, queryResult:-1, eq:'sumRange(2,5) = prefix[6] - prefix[2] = -3-(-2) = -1', desc:'Query [2..5]: nums[2]+nums[3]+nums[4]+nums[5] = 3-5+2-1 = -1. O(1) lookup!', codeLines:[3], vars:[{n:'l',v:'2'},{n:'r',v:'5'},{n:'result',v:'-1'}] },
  { phase:'done', builtUpTo:7, eq:'O(n) build, O(1) per query', desc:'Precompute once, answer any range query in constant time.', codeLines:[3], vars:[{n:'queries',v:'O(1)'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">__init__</span><span class="cg-op">(</span>self<span class="cg-op">,</span> nums<span class="cg-op">):</span>' },
  { html:'    self.pre <span class="cg-op">= [</span><span class="cg-num">0</span><span class="cg-op">]</span>' },
  { html:'    <span class="cg-kw">for</span> n <span class="cg-kw">in</span> nums<span class="cg-op">:</span> self.pre<span class="cg-op">.</span><span class="cg-bi">append</span><span class="cg-op">(</span>self.pre<span class="cg-op">[-</span><span class="cg-num">1</span><span class="cg-op">] +</span> n<span class="cg-op">)</span>' },
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">sumRange</span><span class="cg-op">(</span>self<span class="cg-op">,</span>l<span class="cg-op">,</span>r<span class="cg-op">): </span><span class="cg-kw">return</span> self.pre<span class="cg-op">[</span>r<span class="cg-op">+</span><span class="cg-num">1</span><span class="cg-op">] -</span> self.pre<span class="cg-op">[</span>l<span class="cg-op">]</span>' },
];

interface Props { accColor: string }
export const RangeSumQuery: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="range_sum_query.py" doneResult="O(1) query" accColor={accColor}>
    {(step) => {
      const s = step as RsStep;
      return (
        <>
          {/* nums */}
          <div>
            <span className="viz-section-lbl">INPUT ARRAY</span>
            <div className="viz-index-row"><span className="viz-row-label-space" style={{width:'52px'}} />{NUMS.map((_,k)=><span key={k} className="viz-index-num" style={{width:'44px'}}>[{k}]</span>)}</div>
            <div className="viz-array-row">
              <span className="viz-row-label" style={{width:'52px'}}>nums</span>
              {NUMS.map((n,k) => {
                const inQuery = s.queryL !== undefined && k >= s.queryL! && k <= s.queryR!;
                return (
                  <div key={k} className="viz-dp-cell" style={{ width:'44px', height:'44px', background: inQuery ? COLORS[k]+'33' : 'rgba(255,255,255,.06)', borderColor: inQuery ? COLORS[k]+'77' : 'rgba(255,255,255,.1)', color: n < 0 ? '#f87171' : '#86efac', fontSize:'1.1rem' }}>
                    {n}
                  </div>
                );
              })}
            </div>
          </div>

          {/* prefix array */}
          <div style={{marginTop:'.4rem'}}>
            <span className="viz-section-lbl">PREFIX ARRAY (prefix[i] = sum of nums[0..i-1])</span>
            <div className="viz-index-row"><span className="viz-row-label-space" style={{width:'52px'}} />{PREFIX.map((_,k)=><span key={k} className="viz-index-num" style={{width:'44px'}}>[{k}]</span>)}</div>
            <div className="viz-dp-row">
              <span className="viz-row-label" style={{width:'52px',fontSize:'.62rem'}}>pre</span>
              {PREFIX.map((v,k) => {
                const filled = k < s.builtUpTo;
                const isActive = k === s.builtUpTo - 1 && s.phase === 'build';
                const isQueryMark = (s.queryL !== undefined && k === s.queryL!) || (s.queryR !== undefined && k === s.queryR! + 1);
                return (
                  <div key={k} className={`viz-dp-cell${isActive?' viz-dp-cell--active':''}${!filled?' viz-dp-cell--empty':''}`}
                    style={{ width:'44px', height:'44px', background: isQueryMark ? 'rgba(34,197,94,.15)' : filled && !isActive ? 'rgba(255,255,255,.06)' : undefined, borderColor: isQueryMark ? 'rgba(34,197,94,.5)' : undefined, color: v < 0 ? '#f87171' : '#86efac', fontSize:'1.1rem' }}>
                    {filled ? v : '?'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* query result */}
          {s.queryResult !== undefined && (
            <div style={{ marginTop:'.4rem', padding:'.4rem .7rem', background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.25)', fontFamily:'var(--mono)', fontSize:'.72rem', borderRadius:'3px' }}>
              <span style={{color:'rgba(255,255,255,.5)'}}>sumRange({s.queryL},{s.queryR}) = prefix[{s.queryR!+1}] - prefix[{s.queryL}] = </span>
              <span style={{color:'#22c55e', fontWeight:700}}>{s.queryResult}</span>
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
