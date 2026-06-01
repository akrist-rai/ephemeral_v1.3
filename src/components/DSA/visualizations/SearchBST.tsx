import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// BST:       4
//          /   \
//         2     7
//        / \
//       1   3
// Search for val = 2  → found at node 2

type SbStep = VizStep & {
  current: number | null;   // node value being visited
  path: number[];           // nodes visited so far
  found: boolean;
  direction?: 'left' | 'right' | 'hit';
};

const STEPS: SbStep[] = [
  { current:4, path:[],    found:false, eq:'root = 4   val = 2', desc:'Start at root. Compare val=2 with root.val=4.', codeLines:[0,1], vars:[{n:'node',v:'4'},{n:'val',v:'2'}] },
  { current:4, path:[4],   found:false, direction:'left', eq:'2 < 4 → go left', desc:'2 < 4 → descend to left child.', codeLines:[2,3], vars:[{n:'node',v:'4'},{n:'go',v:'left'}] },
  { current:2, path:[4],   found:false, eq:'node = 2   val = 2', desc:'Now at node 2. Compare val=2 with node.val=2.', codeLines:[0,1], vars:[{n:'node',v:'2'},{n:'val',v:'2'}] },
  { current:2, path:[4,2], found:true,  direction:'hit', eq:'2 == 2 → FOUND', desc:'Match! Return this node (the subtree rooted here).', codeLines:[4,5], vars:[{n:'result',v:'node(2)'}] },
  { current:2, path:[4,2], found:true,  eq:'return node(2)', desc:'BST search: O(log n) average, O(h) worst case.', codeLines:[5], vars:[{n:'result',v:'node(2)'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">searchBST</span><span class="cg-op">(</span>root<span class="cg-op">,</span> val<span class="cg-op">):</span>' },
  { html:'    <span class="cg-kw">if not</span> root<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">None</span>' },
  { html:'    <span class="cg-kw">if</span> val <span class="cg-op">&lt;</span> root<span class="cg-op">.</span>val<span class="cg-op">:</span>' },
  { html:'        <span class="cg-kw">return</span> searchBST<span class="cg-op">(</span>root<span class="cg-op">.</span>left<span class="cg-op">,</span> val<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">if</span> val <span class="cg-op">&gt;</span> root<span class="cg-op">.</span>val<span class="cg-op">:</span>' },
  { html:'        <span class="cg-kw">return</span> searchBST<span class="cg-op">(</span>root<span class="cg-op">.</span>right<span class="cg-op">,</span> val<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">return</span> root' },
];

const nodeStyle = (val: number, current: number | null, path: number[], found: boolean) => {
  const isActive = val === current;
  const isVisited = path.includes(val);
  const isFound = found && isActive;
  const bg = isFound ? 'rgba(34,197,94,.3)' : isActive ? 'rgba(245,158,11,.2)' : isVisited ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.04)';
  const border = isFound ? '#22c55e' : isActive ? '#f59e0b' : isVisited ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.1)';
  const color = isFound ? '#22c55e' : isActive ? '#f59e0b' : isVisited ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.35)';
  return { width:'44px', height:'44px', borderRadius:'50%', border:`2px solid ${border}`, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--disp)', fontSize:'1.3rem', color, transition:'all .3s', flexShrink:0 as const };
};

const Line: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ display:'flex', flexDirection:'column' as const, alignItems:'center', color:'rgba(255,255,255,.2)', fontFamily:'var(--mono)', fontSize:'.58rem' }}>
    <div style={{ width:'1px', height:'16px', background:'rgba(255,255,255,.2)' }} />
    {label && <span style={{ color:'rgba(255,255,255,.35)', marginBottom:'-2px' }}>{label}</span>}
  </div>
);

interface Props { accColor: string }
export const SearchBST: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="search_bst.py" doneResult="node(2)" accColor={accColor}>
    {(step) => {
      const s = step as SbStep;
      return (
        <>
          <span className="viz-section-lbl">BST — searching for val = 2</span>
          {/* Tree layout */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0' }}>
            {/* Root */}
            <div style={nodeStyle(4, s.current, s.path, s.found)}>4</div>
            {/* Lines */}
            <div style={{ display:'flex', gap:'52px' }}>
              <Line label="&lt;" /><Line label="&gt;" />
            </div>
            {/* Level 2 */}
            <div style={{ display:'flex', gap:'24px' }}>
              <div style={nodeStyle(2, s.current, s.path, s.found)}>2</div>
              <div style={{ width:'44px', height:'44px' }} />
              <div style={nodeStyle(7, s.current, s.path, s.found)}>7</div>
            </div>
            <div style={{ display:'flex', gap:'64px' }}>
              <Line label="&lt;" /><Line label="&gt;" />
            </div>
            {/* Level 3 */}
            <div style={{ display:'flex', gap:'4px' }}>
              <div style={nodeStyle(1, s.current, s.path, s.found)}>1</div>
              <div style={{ width:'16px' }} />
              <div style={nodeStyle(3, s.current, s.path, s.found)}>3</div>
            </div>
          </div>

          {/* Status */}
          {s.direction && (
            <div style={{ marginTop:'.4rem', fontFamily:'var(--mono)', fontSize:'.7rem', padding:'.3rem .6rem', background: s.direction==='hit' ? 'rgba(34,197,94,.08)' : 'rgba(245,158,11,.07)', border:`1px solid ${s.direction==='hit' ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.25)'}`, borderRadius:'3px', color: s.direction==='hit' ? '#22c55e' : '#f59e0b' }}>
              {s.direction==='hit' ? '✓ val == node.val → return this node' : s.direction==='left' ? '← val < node.val → recurse left' : '→ val > node.val → recurse right'}
            </div>
          )}
        </>
      );
    }}
  </VisualizerShell>
);
