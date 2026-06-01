import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// s = "egg", t = "add"  → True
const S = ['e', 'g', 'g'];
const T = ['a', 'd', 'd'];
const CHAR_C: Record<string, string> = { e:'#e11d48', g:'#2563eb', a:'#ea580c', d:'#7c3aed' };

type IsStep = VizStep & { idx: number; st: Record<string,string>; ts: Record<string,string>; conflict?: boolean };

const STEPS: IsStep[] = [
  { idx:-1, st:{}, ts:{}, eq:'s_to_t = {}   t_to_s = {}', desc:'Two maps: s_to_t maps each s-char to its t-char; t_to_s is the reverse.', codeLines:[0,1,2], vars:[{n:'i',v:'—'}] },
  { idx:0,  st:{e:'a'}, ts:{a:'e'}, eq:'s[0]="e" → t[0]="a"  both new → ok', desc:'Neither "e" nor "a" mapped yet. Add both directions.', codeLines:[3,4,5,6,7], vars:[{n:'i',v:'0'},{n:'s[i]',v:'"e"'},{n:'t[i]',v:'"a"'}] },
  { idx:1,  st:{e:'a',g:'d'}, ts:{a:'e',d:'g'}, eq:'s[1]="g" → t[1]="d"  both new → ok', desc:'Neither "g" nor "d" mapped. Add both.', codeLines:[3,4,5,6,7], vars:[{n:'i',v:'1'},{n:'s[i]',v:'"g"'},{n:'t[i]',v:'"d"'}] },
  { idx:2,  st:{e:'a',g:'d'}, ts:{a:'e',d:'g'}, eq:'s[2]="g"→"d" ✓  t[2]="d"→"g" ✓', desc:'s_to_t["g"]="d" matches t[2]="d". t_to_s["d"]="g" matches s[2]="g". Consistent!', codeLines:[3,4,6], vars:[{n:'i',v:'2'},{n:'s[i]',v:'"g"'},{n:'t[i]',v:'"d"'}] },
  { idx:-2, st:{e:'a',g:'d'}, ts:{a:'e',d:'g'}, eq:'return True', desc:'All 3 positions consistent. "egg" and "add" have identical structure.', codeLines:[8], vars:[{n:'result',v:'True'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">isIsomorphic</span><span class="cg-op">(</span>s<span class="cg-op">,</span> t<span class="cg-op">):</span>' },
  { html:'    s_to_t<span class="cg-op">, </span>t_to_s <span class="cg-op">= {}, {}</span>' },
  { html:'' },
  { html:'    <span class="cg-kw">for</span> sc<span class="cg-op">,</span> tc <span class="cg-kw">in</span> <span class="cg-bi">zip</span><span class="cg-op">(</span>s<span class="cg-op">,</span> t<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">if</span> sc <span class="cg-kw">in</span> s_to_t <span class="cg-kw">and</span> s_to_t<span class="cg-op">[</span>sc<span class="cg-op">] !=</span> tc<span class="cg-op">:</span>' },
  { html:'            <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html:'        <span class="cg-kw">if</span> tc <span class="cg-kw">in</span> t_to_s <span class="cg-kw">and</span> t_to_s<span class="cg-op">[</span>tc<span class="cg-op">] !=</span> sc<span class="cg-op">:</span>' },
  { html:'            <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html:'        s_to_t<span class="cg-op">[</span>sc<span class="cg-op">] =</span> tc<span class="cg-op">;</span> t_to_s<span class="cg-op">[</span>tc<span class="cg-op">] =</span> sc' },
  { html:'    <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
];

interface Props { accColor: string }
export const IsomorphicStrings: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="isomorphic_strings.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as IsStep;
      return (
        <>
          <div style={{ display:'flex', gap:'1.4rem' }}>
            {[{ label:'s = "egg"', chars:S }, { label:'t = "add"', chars:T }].map(({ label, chars }) => (
              <div key={label}>
                <span className="viz-section-lbl">{label}</span>
                <div style={{ display:'flex', gap:'.3rem' }}>
                  {chars.map((ch, k) => {
                    const isActive = k === s.idx;
                    const isPast = k < s.idx || s.idx === -2;
                    const c = CHAR_C[ch] ?? '#aaa';
                    return <div key={k} className="viz-char-cell" style={{ background: isActive ? c+'55' : isPast ? c+'25' : 'rgba(255,255,255,.06)', border:`1px solid ${isActive ? c : isPast ? c+'55' : 'rgba(255,255,255,.12)'}`, transform: isActive ? 'scale(1.12)' : undefined }}>{ch}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:'.5rem', display:'flex', gap:'.6rem' }}>
            {[{ label:'s → t', map: s.st }, { label:'t → s', map: s.ts }].map(({ label, map }) => (
              <div key={label} style={{ flex:1 }}>
                <span className="viz-section-lbl">{label}</span>
                <div className="viz-dict">
                  {Object.keys(map).length === 0 && <span style={{ fontFamily:'var(--mono)', fontSize:'.7rem', color:'rgba(255,255,255,.2)' }}>&#123; &#125;</span>}
                  {Object.entries(map).map(([k,v]) => (
                    <div key={k} className="viz-entry">
                      <span className="viz-entry-k" style={{ color: CHAR_C[k] ?? 'var(--crt)' }}>&quot;{k}&quot;</span>
                      <span className="viz-entry-sep">→</span>
                      <span className="viz-entry-v" style={{ color: CHAR_C[v] ?? 'var(--gold)' }}>&quot;{v}&quot;</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }}
  </VisualizerShell>
);
