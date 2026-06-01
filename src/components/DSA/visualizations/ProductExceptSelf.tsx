import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [1, 2, 3, 4]  → [24, 12, 8, 6]
const NUMS = [1, 2, 3, 4];
const COLORS = ['#e11d48', '#ea580c', '#16a34a', '#2563eb'] as const;

type PesStep = VizStep & {
  phase: 'init' | 'prefix' | 'suffix' | 'done';
  prefix: (number | null)[];
  answer: (number | null)[];
  activeIdx: number;
};

const STEPS: PesStep[] = [
  { phase: 'init',   activeIdx: -1, prefix: [null,null,null,null], answer: [null,null,null,null],   eq: 'answer = [1,1,1,1]', desc: 'answer[i] starts as 1. Left pass will multiply in prefix products.', codeLines: [0,1], vars: [{n:'phase',v:'init'}] },
  { phase: 'prefix', activeIdx: 0,  prefix: [1,null,null,null],    answer: [1,null,null,null],      eq: 'answer[0] = 1  (nothing to left)', desc: 'Left pass i=0: product of all elements to the LEFT of 0 is 1.', codeLines: [2,3], vars: [{n:'i',v:'0'},{n:'prefix',v:'1'}] },
  { phase: 'prefix', activeIdx: 1,  prefix: [1,1,null,null],       answer: [1,1,null,null],         eq: 'answer[1] = 1 × nums[0] = 1', desc: 'Left pass i=1: product of nums[0..0] = 1.', codeLines: [2,3], vars: [{n:'i',v:'1'},{n:'prefix',v:'1'}] },
  { phase: 'prefix', activeIdx: 2,  prefix: [1,1,2,null],          answer: [1,1,2,null],            eq: 'answer[2] = 1 × nums[1] = 2', desc: 'Left pass i=2: product of nums[0..1] = 1×2 = 2.', codeLines: [2,3], vars: [{n:'i',v:'2'},{n:'prefix',v:'2'}] },
  { phase: 'prefix', activeIdx: 3,  prefix: [1,1,2,6],             answer: [1,1,2,6],               eq: 'answer[3] = 2 × nums[2] = 6', desc: 'Left pass i=3: product of nums[0..2] = 1×2×3 = 6. Prefix pass done.', codeLines: [2,3], vars: [{n:'i',v:'3'},{n:'prefix',v:'6'}] },
  { phase: 'suffix', activeIdx: 3,  prefix: [1,1,2,6],             answer: [1,1,2,6],               eq: 'suffix=1  answer[3] *= 1 → 6', desc: 'Right pass i=3: product to RIGHT of 3 is 1 (nothing). answer[3]=6.', codeLines: [4,5], vars: [{n:'i',v:'3'},{n:'suffix',v:'1'}] },
  { phase: 'suffix', activeIdx: 2,  prefix: [1,1,2,6],             answer: [1,1,8,6],               eq: 'suffix=4  answer[2] *= 4 → 8', desc: 'Right pass i=2: suffix *= nums[3]=4. answer[2] = 2×4 = 8.', codeLines: [4,5], vars: [{n:'i',v:'2'},{n:'suffix',v:'4'}] },
  { phase: 'suffix', activeIdx: 1,  prefix: [1,1,2,6],             answer: [1,12,8,6],              eq: 'suffix=12  answer[1] *= 12 → 12', desc: 'Right pass i=1: suffix *= nums[2]=3 → 12. answer[1]=1×12=12.', codeLines: [4,5], vars: [{n:'i',v:'1'},{n:'suffix',v:'12'}] },
  { phase: 'suffix', activeIdx: 0,  prefix: [1,1,2,6],             answer: [24,12,8,6],             eq: 'suffix=24  answer[0] *= 24 → 24', desc: 'Right pass i=0: suffix *= nums[1]=2 → 24. answer[0]=1×24=24.', codeLines: [4,5], vars: [{n:'i',v:'0'},{n:'suffix',v:'24'}] },
  { phase: 'done',   activeIdx: -2, prefix: [1,1,2,6],             answer: [24,12,8,6],             eq: 'return [24,12,8,6]', desc: 'No division used. Two passes, O(n) time, O(1) extra space.', codeLines: [6], vars: [{n:'result',v:'[24,12,8,6]'}], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">productExceptSelf</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    ans <span class="cg-op">= [</span><span class="cg-num">1</span><span class="cg-op">] *</span> <span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)</span>' },
  { html: '    pre <span class="cg-op">=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">for</span> i<span class="cg-op">,</span>n <span class="cg-kw">in</span> <span class="cg-bi">enumerate</span><span class="cg-op">(</span>nums<span class="cg-op">):</span> ans<span class="cg-op">[</span>i<span class="cg-op">] *=</span> pre<span class="cg-op">;</span> pre <span class="cg-op">*=</span> n' },
  { html: '    suf <span class="cg-op">=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">for</span> i <span class="cg-kw">in</span> <span class="cg-bi">range</span><span class="cg-op">(</span><span class="cg-bi">len</span><span class="cg-op">(</span>nums<span class="cg-op">)-</span><span class="cg-num">1</span><span class="cg-op">,-</span><span class="cg-num">1</span><span class="cg-op">,-</span><span class="cg-num">1</span><span class="cg-op">):</span> ans<span class="cg-op">[</span>i<span class="cg-op">] *=</span> suf<span class="cg-op">;</span> suf <span class="cg-op">*=</span> nums<span class="cg-op">[</span>i<span class="cg-op">]</span>' },
  { html: '    <span class="cg-kw">return</span> ans' },
];

interface Props { accColor: string }

export const ProductExceptSelf: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="product_except_self.py" doneResult="[24,12,8,6]" accColor={accColor}>
    {(step) => {
      const s = step as PesStep;
      const isPrefix = s.phase === 'prefix';
      const isSuffix = s.phase === 'suffix';
      return (
        <>
          {/* nums row */}
          <div className="viz-index-row"><span className="viz-row-label-space" />{NUMS.map((_,k)=><span key={k} className="viz-index-num">[{k}]</span>)}</div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n,k)=>(
              <div key={k} className={`viz-cell vc${k}${k===s.activeIdx?' viz-cell--active':' viz-cell--past'}`}>
                <span className="viz-cell-val">{n}</span>
              </div>
            ))}
          </div>

          {/* answer row */}
          <div style={{ marginTop: '.4rem' }}>
            <div style={{ display: 'flex', gap: '.3rem', marginBottom: '.25rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: isPrefix ? '#f59e0b' : isSuffix ? '#0891b2' : 'rgba(255,255,255,.35)', letterSpacing: '.14em', width: '60px', textAlign: 'right' }}>
                {isPrefix ? '← L PASS' : isSuffix ? 'R PASS →' : 'answer'}
              </span>
            </div>
            <div className="viz-array-row">
              <span className="viz-row-label">ans</span>
              {s.answer.map((v,k)=>{
                const isEmpty = v === null;
                const isActive = k === s.activeIdx;
                const c = COLORS[k];
                return (
                  <div key={k} className={`viz-cell${isActive?' viz-cell--active':isEmpty?' viz-cell--empty':' viz-cell--past'}`} style={!isEmpty&&!isActive?{background:c+'33',borderColor:c+'55',border:`2px solid ${c}55`}:undefined}>
                    <span className="viz-cell-val" style={{fontSize:'1.4rem',color:isEmpty?'rgba(255,255,255,.2)':isActive?'#fff':c}}>{isEmpty?'?':v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
