import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// words = ["eat","tea","tan","ate","nat","bat"]
const WORDS = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];
const SORTED = WORDS.map(w => w.split('').sort().join('')); // aet,aet,ant,aet,ant,abt
const GROUP_COLORS: Record<string, string> = { aet: '#2563eb', ant: '#16a34a', abt: '#e11d48' };

type GaStep = VizStep & { idx: number; groups: Record<string, string[]> };

const STEPS: GaStep[] = [
  { idx: -1, groups: {},                                                                    eq: 'groups = {}',               desc: 'Anagram groups keyed by sorted word. "eat"→sort→"aet" is the key.', codeLines: [0,1], vars: [{n:'i',v:'—'}] },
  { idx: 0,  groups: { aet: ['eat'] },                                                     eq: 'sorted("eat")="aet" → group', desc: 'sort("eat")="aet". New group. groups["aet"]=["eat"].', codeLines: [2,3], vars: [{n:'word',v:'"eat"'},{n:'key',v:'"aet"'}] },
  { idx: 1,  groups: { aet: ['eat','tea'] },                                               eq: 'sorted("tea")="aet" → same group', desc: '"tea" sorts to "aet" — same key as "eat". Append.', codeLines: [2,3], vars: [{n:'word',v:'"tea"'},{n:'key',v:'"aet"'}] },
  { idx: 2,  groups: { aet: ['eat','tea'], ant: ['tan'] },                                 eq: 'sorted("tan")="ant" → new group', desc: '"tan" sorts to "ant". New group.', codeLines: [2,3], vars: [{n:'word',v:'"tan"'},{n:'key',v:'"ant"'}] },
  { idx: 3,  groups: { aet: ['eat','tea','ate'], ant: ['tan'] },                           eq: 'sorted("ate")="aet" → same group', desc: '"ate" sorts to "aet". Appended to first group.', codeLines: [2,3], vars: [{n:'word',v:'"ate"'},{n:'key',v:'"aet"'}] },
  { idx: 4,  groups: { aet: ['eat','tea','ate'], ant: ['tan','nat'] },                     eq: 'sorted("nat")="ant" → same group', desc: '"nat" sorts to "ant". Joined second group.', codeLines: [2,3], vars: [{n:'word',v:'"nat"'},{n:'key',v:'"ant"'}] },
  { idx: 5,  groups: { aet: ['eat','tea','ate'], ant: ['tan','nat'], abt: ['bat'] },       eq: 'sorted("bat")="abt" → new group', desc: '"bat" sorts to "abt". Third group.', codeLines: [2,3], vars: [{n:'word',v:'"bat"'},{n:'key',v:'"abt"'}] },
  { idx: -2, groups: { aet: ['eat','tea','ate'], ant: ['tan','nat'], abt: ['bat'] },       eq: 'return list(groups.values())', desc: '3 anagram groups found from 6 words.', codeLines: [4], vars: [{n:'groups',v:'3'}], done: true },
];

const CODE = [
  { html: '<span class="cg-kw">def</span> <span class="cg-fn">groupAnagrams</span><span class="cg-op">(</span>strs<span class="cg-op">):</span>' },
  { html: '    groups <span class="cg-op">=</span> <span class="cg-op">{}</span>' },
  { html: '    <span class="cg-kw">for</span> w <span class="cg-kw">in</span> strs<span class="cg-op">:</span>' },
  { html: '        key <span class="cg-op">=</span> <span class="cg-bi">tuple</span><span class="cg-op">(</span><span class="cg-bi">sorted</span><span class="cg-op">(</span>w<span class="cg-op">))</span>; groups<span class="cg-op">.</span><span class="cg-bi">setdefault</span><span class="cg-op">(</span>key<span class="cg-op">,[]).</span><span class="cg-bi">append</span><span class="cg-op">(</span>w<span class="cg-op">)</span>' },
  { html: '    <span class="cg-kw">return</span> <span class="cg-bi">list</span><span class="cg-op">(</span>groups<span class="cg-op">.</span><span class="cg-bi">values</span><span class="cg-op">())</span>' },
];

interface Props { accColor: string }

export const GroupAnagrams: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="group_anagrams.py" doneResult="3 groups" accColor={accColor}>
    {(step) => {
      const s = step as GaStep;
      return (
        <>
          {/* Input word chips */}
          <div>
            <span className="viz-section-lbl">INPUT WORDS</span>
            <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
              {WORDS.map((w, k) => {
                const key = SORTED[k];
                const c = GROUP_COLORS[key] ?? '#aaa';
                const isActive = k === s.idx;
                const isPast = k < s.idx || s.idx === -2;
                return (
                  <div key={k} style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', padding: '.25rem .55rem', background: isPast ? c + '28' : isActive ? c + '44' : 'rgba(255,255,255,.04)', border: `1px solid ${isActive ? c : isPast ? c + '55' : 'rgba(255,255,255,.12)'}`, color: isActive ? c : isPast ? c + 'dd' : 'rgba(255,255,255,.6)', borderRadius: '3px', transform: isActive ? 'scale(1.1)' : undefined, transition: 'all .2s', letterSpacing: '.04em' }}>
                    {w}
                    {isPast && <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.65rem', marginLeft: '.3rem' }}>→{key}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Groups */}
          <div style={{ marginTop: '.5rem' }}>
            <span className="viz-section-lbl">GROUPS (keyed by sorted word)</span>
            {Object.entries(s.groups).map(([key, words]) => {
              const c = GROUP_COLORS[key] ?? '#aaa';
              return (
                <div key={key} style={{ marginBottom: '.3rem', padding: '.35rem .6rem', background: c + '11', border: `1px solid ${c}33`, borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: c, fontWeight: 700, letterSpacing: '.06em', minWidth: '32px' }}>{key}</span>
                  <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>→</span>
                  <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap' }}>
                    {words.map((w, i) => (
                      <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', padding: '.15rem .42rem', background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: '2px' }}>{w}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.keys(s.groups).length === 0 && <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.2)' }}>&#123; &#125;</span>}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
