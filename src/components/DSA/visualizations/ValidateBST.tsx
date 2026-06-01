import React from 'react';
import { VisualizerShell, VizStep } from './VisualizerShell';

// Tree: 4(root), 2(left), 7(right), 1(2's left), 3(2's right)  → valid BST
type VbStep = VizStep & { visiting: number; bounds: Record<number,[string,string]>; valid: Record<number,boolean|null> };

const STEPS: VbStep[] = [
  { visiting:4,  bounds:{4:['−∞','+∞']},                                   valid:{4:null,2:null,7:null,1:null,3:null}, eq:'validate(4, −∞, +∞)', desc:'Root 4: must be in (−∞, +∞). 4 is valid. Recurse with tightened bounds.', codeLines:[0,1,2,3], vars:[{n:'node',v:'4'},{n:'range',v:'(−∞,+∞)'}] },
  { visiting:2,  bounds:{4:['−∞','+∞'],2:['−∞','4']},                      valid:{4:null,2:null,7:null,1:null,3:null}, eq:'validate(2, −∞, 4)', desc:'Left of 4: must be in (−∞, 4). 2 < 4 ✓. Recurse further.', codeLines:[4,5], vars:[{n:'node',v:'2'},{n:'range',v:'(−∞,4)'}] },
  { visiting:1,  bounds:{4:['−∞','+∞'],2:['−∞','4'],1:['−∞','2']},         valid:{4:null,2:null,7:null,1:null,3:null}, eq:'validate(1, −∞, 2)', desc:'Left of 2: must be in (−∞, 2). 1 < 2 ✓. Leaf node.', codeLines:[4,5], vars:[{n:'node',v:'1'},{n:'range',v:'(−∞,2)'}] },
  { visiting:1,  bounds:{4:['−∞','+∞'],2:['−∞','4'],1:['−∞','2']},         valid:{4:null,2:null,7:null,1:true,3:null}, eq:'node 1 OK → return True', desc:'Node 1 is valid. No children.', codeLines:[2,3], vars:[{n:'node',v:'1'},{n:'valid',v:'True'}] },
  { visiting:3,  bounds:{4:['−∞','+∞'],2:['−∞','4'],3:['2','+∞']},         valid:{4:null,2:null,7:null,1:true,3:null}, eq:'validate(3, 2, 4)', desc:'Right of 2: must be in (2, 4). 3 is in range ✓.', codeLines:[4,5], vars:[{n:'node',v:'3'},{n:'range',v:'(2,4)'}] },
  { visiting:3,  bounds:{4:['−∞','+∞'],2:['−∞','4'],3:['2','4']},          valid:{4:null,2:null,7:null,1:true,3:true},  eq:'node 3 OK → return True', desc:'Node 3 is valid. No children.', codeLines:[2,3], vars:[{n:'node',v:'3'},{n:'valid',v:'True'}] },
  { visiting:2,  bounds:{4:['−∞','+∞'],2:['−∞','4']},                      valid:{4:null,2:true,7:null,1:true,3:true},  eq:'subtree(2) all valid → return True', desc:'Both children of 2 valid. Node 2 subtree is a valid BST.', codeLines:[2,3], vars:[{n:'node',v:'2'},{n:'valid',v:'True'}] },
  { visiting:7,  bounds:{4:['−∞','+∞'],7:['4','+∞']},                      valid:{4:null,2:true,7:null,1:true,3:true},  eq:'validate(7, 4, +∞)', desc:'Right of 4: must be in (4, +∞). 7 > 4 ✓. Leaf.', codeLines:[4,5], vars:[{n:'node',v:'7'},{n:'range',v:'(4,+∞)'}] },
  { visiting:7,  bounds:{4:['−∞','+∞'],7:['4','+∞']},                      valid:{4:null,2:true,7:true,1:true,3:true},  eq:'node 7 OK → return True', desc:'Node 7 is valid.', codeLines:[2,3], vars:[{n:'node',v:'7'},{n:'valid',v:'True'}] },
  { visiting:4,  bounds:{4:['−∞','+∞']},                                   valid:{4:true,2:true,7:true,1:true,3:true},  eq:'all nodes valid → return True', desc:'Every node satisfied its (min, max) constraint. Valid BST!', codeLines:[6], vars:[{n:'result',v:'True'}], done:true },
];

const CODE = [
  { html:'<span class="cg-kw">def</span> <span class="cg-fn">isValidBST</span><span class="cg-op">(</span>root<span class="cg-op">):</span>' },
  { html:'    <span class="cg-kw">def</span> <span class="cg-fn">ok</span><span class="cg-op">(</span>node<span class="cg-op">,</span> lo<span class="cg-op">,</span> hi<span class="cg-op">):</span>' },
  { html:'        <span class="cg-kw">if not</span> node<span class="cg-op">:</span> <span class="cg-kw">return</span> <span class="cg-num">True</span>' },
  { html:'        <span class="cg-kw">if not</span> <span class="cg-op">(</span>lo <span class="cg-op">&lt;</span> node<span class="cg-op">.</span>val <span class="cg-op">&lt;</span> hi<span class="cg-op">):</span> <span class="cg-kw">return</span> <span class="cg-num">False</span>' },
  { html:'        <span class="cg-kw">return</span> ok<span class="cg-op">(</span>node<span class="cg-op">.</span>left<span class="cg-op">,</span> lo<span class="cg-op">,</span> node<span class="cg-op">.</span>val<span class="cg-op">)</span>' },
  { html:'           <span class="cg-kw">and</span> ok<span class="cg-op">(</span>node<span class="cg-op">.</span>right<span class="cg-op">,</span> node<span class="cg-op">.</span>val<span class="cg-op">,</span> hi<span class="cg-op">)</span>' },
  { html:'    <span class="cg-kw">return</span> ok<span class="cg-op">(</span>root<span class="cg-op">, -</span><span class="cg-bi">inf</span><span class="cg-op">, </span><span class="cg-bi">inf</span><span class="cg-op">)</span>' },
];

const NODE_POS: Record<number,{x:number;y:number}> = {4:{x:200,y:28},2:{x:110,y:90},7:{x:290,y:90},1:{x:60,y:155},3:{x:160,y:155}};
const TREE_EDGES = [[4,2],[4,7],[2,1],[2,3]];

interface Props { accColor: string }
export const ValidateBST: React.FC<Props> = ({ accColor }) => (
  <VisualizerShell steps={STEPS} codeLines={CODE} filename="validate_bst.py" doneResult="True" accColor={accColor}>
    {(step) => {
      const s = step as VbStep;
      return (
        <>
          <span className="viz-section-lbl">BST — validating with (min, max) bounds</span>
          <svg width="380" height="190" style={{overflow:'visible',display:'block'}}>
            {TREE_EDGES.map(([p,c],k) => <line key={k} x1={NODE_POS[p].x} y1={NODE_POS[p].y} x2={NODE_POS[c].x} y2={NODE_POS[c].y} stroke="rgba(255,255,255,.15)" strokeWidth={1.5} />)}
            {Object.entries(NODE_POS).map(([vStr,pos]) => {
              const v = Number(vStr);
              const isVisiting = v === s.visiting;
              const isValid = s.valid[v] === true;
              const fill = isValid ? 'rgba(34,197,94,.3)' : isVisiting ? 'rgba(245,158,11,.3)' : 'rgba(255,255,255,.05)';
              const stroke = isValid ? '#22c55e' : isVisiting ? '#f59e0b' : 'rgba(255,255,255,.2)';
              const bounds = s.bounds[v];
              return (
                <g key={v}>
                  <circle cx={pos.x} cy={pos.y} r={22} fill={fill} stroke={stroke} strokeWidth={isVisiting?2.5:1.5} style={{transition:'all .3s'}} />
                  <text x={pos.x} y={pos.y+7} textAnchor="middle" fill={isValid?'#22c55e':isVisiting?'#f59e0b':'rgba(255,255,255,.5)'} fontFamily="var(--disp)" fontSize="17">{v}</text>
                  {bounds && <text x={pos.x} y={pos.y+40} textAnchor="middle" fill="rgba(245,158,11,.8)" fontFamily="var(--mono)" fontSize="8">({bounds[0]},{bounds[1]})</text>}
                </g>
              );
            })}
          </svg>
        </>
      );
    }}
  </VisualizerShell>
);
