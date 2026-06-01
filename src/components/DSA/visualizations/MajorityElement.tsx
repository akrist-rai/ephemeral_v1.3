import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// nums = [2, 2, 1, 1, 1, 2, 2]  → majority = 2
const NUMS = [2, 2, 1, 1, 1, 2, 2];
const COLORS = ['#2563eb', '#2563eb', '#e11d48', '#e11d48', '#e11d48', '#2563eb', '#2563eb'] as const;

type MeStep = VizStep & { idx: number; candidate: number | null; count: number };

const STEPS: MeStep[] = [
  { idx: -1, candidate: null, count: 0, eq: 'candidate = null   count = 0', desc: 'Boyer-Moore Voting: scan once. The majority element survives all cancellations.', codeLines: [0, 1, 2], vars: [{ n: 'candidate', v: '?' }, { n: 'count', v: '0' }] },
  { idx: 0,  candidate: 2,    count: 1, eq: 'count=0 → candidate = 2   count = 1', desc: 'count is 0 so take nums[0]=2 as new candidate.', codeLines: [3, 4, 5], vars: [{ n: 'candidate', v: '2' }, { n: 'count', v: '1' }] },
  { idx: 1,  candidate: 2,    count: 2, eq: 'nums[1]==candidate → count = 2', desc: 'nums[1]=2 matches candidate 2 → increment count.', codeLines: [3, 6, 7], vars: [{ n: 'candidate', v: '2' }, { n: 'count', v: '2' }] },
  { idx: 2,  candidate: 2,    count: 1, eq: 'nums[2]≠candidate → count = 1', desc: 'nums[2]=1 differs → cancel one vote, count--.', codeLines: [3, 6, 8], vars: [{ n: 'candidate', v: '2' }, { n: 'count', v: '1' }] },
  { idx: 3,  candidate: 2,    count: 0, eq: 'nums[3]≠candidate → count = 0', desc: 'nums[3]=1 differs → count reaches 0. Candidate still set.', codeLines: [3, 6, 8], vars: [{ n: 'candidate', v: '2' }, { n: 'count', v: '0' }] },
  { idx: 4,  candidate: 1,    count: 1, eq: 'count=0 → candidate = 1   count = 1', desc: 'count is 0 → take nums[4]=1 as new candidate.', codeLines: [3, 4, 5], vars: [{ n: 'candidate', v: '1' }, { n: 'count', v: '1' }] },
  { idx: 5,  candidate: 1,    count: 0, eq: 'nums[5]≠candidate → count = 0', desc: 'nums[5]=2 differs → count back to 0.', codeLines: [3, 6, 8], vars: [{ n: 'candidate', v: '1' }, { n: 'count', v: '0' }] },
  { idx: 6,  candidate: 2,    count: 1, eq: 'count=0 → candidate = 2   count = 1', desc: 'count is 0 → take nums[6]=2 as new candidate.', codeLines: [3, 4, 5], vars: [{ n: 'candidate', v: '2' }, { n: 'count', v: '1' }] },
  { idx: -2, candidate: 2,    count: 1, eq: 'return candidate = 2', desc: 'candidate=2 is the majority element (appears 4 of 7 times > n/2).', codeLines: [9], vars: [{ n: 'result', v: '2' }], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">majorityElement</span><span class="cg-op">(</span>nums<span class="cg-op">):</span>' },
  { html: '    candidate <span class="cg-op">=</span> <span class="cg-num">None</span>' },
  { html: '    count <span class="cg-op">=</span> <span class="cg-num">0</span>' },
  { html: '    <span class="cg-kw">for</span> num <span class="cg-kw">in</span> nums<span class="cg-op">:</span>' },
  { html: '        <span class="cg-kw">if</span> count <span class="cg-op">==</span> <span class="cg-num">0</span><span class="cg-op">:</span>' },
  { html: '            candidate <span class="cg-op">=</span> num' },
  { html: '        <span class="cg-kw">if</span> num <span class="cg-op">==</span> candidate<span class="cg-op">:</span>' },
  { html: '            count <span class="cg-op">+=</span> <span class="cg-num">1</span>' },
  { html: '        <span class="cg-kw">else</span><span class="cg-op">:</span> count <span class="cg-op">-=</span> <span class="cg-num">1</span>' },
  { html: '    <span class="cg-kw">return</span> candidate' },
];

interface Props { accColor: string }

export const MajorityElement: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="majority_element.py" doneResult="2" accColor={accColor}>
    {(step) => {
      const s = step as MeStep;
      return (
        <>
          <div className="viz-index-row">
            <span className="viz-row-label-space" />
            {NUMS.map((_, k) => <span key={k} className="viz-index-num" style={{ width: '44px' }}>[{k}]</span>)}
          </div>
          <div className="viz-array-row">
            <span className="viz-row-label">nums</span>
            {NUMS.map((n, k) => {
              const isActive = k === s.idx;
              const isPast = k < s.idx || s.idx === -2;
              const bg = COLORS[k];
              return (
                <div key={k} className={`viz-cell${isActive ? ' viz-cell--active' : isPast ? ' viz-cell--past' : ' viz-cell--idle'}`} style={{ background: bg, boxShadow: `0 4px 20px ${bg}44`, width: '44px', height: '44px' }}>
                  <span className="viz-cell-val" style={{ fontSize: '1.4rem' }}>{n}</span>
                </div>
              );
            })}
          </div>

          {/* Vote trackers */}
          <div style={{ marginTop: '.5rem', display: 'flex', gap: '.8rem' }}>
            <div style={{ padding: '.4rem .65rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '4px', minWidth: '80px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', marginBottom: '.2rem' }}>CANDIDATE</div>
              <div style={{ fontFamily: 'var(--disp)', fontSize: '2rem', color: s.candidate === 2 ? '#2563eb' : s.candidate === 1 ? '#e11d48' : 'rgba(255,255,255,.3)' }}>
                {s.candidate ?? '?'}
              </div>
            </div>
            <div style={{ padding: '.4rem .65rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '4px', minWidth: '60px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', marginBottom: '.2rem' }}>COUNT</div>
              <div style={{ fontFamily: 'var(--disp)', fontSize: '2rem', color: s.count === 0 ? '#f59e0b' : '#22c55e' }}>
                {s.count}
              </div>
            </div>
            {/* Vote tally */}
            <div style={{ padding: '.4rem .65rem', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', marginBottom: '.3rem' }}>VOTES SO FAR</div>
              <div style={{ display: 'flex', gap: '.2rem', flexWrap: 'wrap' }}>
                {NUMS.slice(0, Math.max(0, s.idx + (s.idx >= 0 ? 1 : 0))).map((n, i) => (
                  <div key={i} style={{ width: '20px', height: '20px', background: (n === 2 ? '#2563eb' : '#e11d48') + '55', border: `1px solid ${n === 2 ? '#2563eb' : '#e11d48'}88`, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '.62rem', color: n === 2 ? '#7dd3fc' : '#fca5a5' }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
