import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip, Slider } from './MLShared';

// ── Pre-configured AND neuron constants ────────────────────────────────────────
const W1 = 1.0, W2 = 1.0, THETA = 1.5;
const INPUTS: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const AND_EXP = [0, 0, 0, 1];
const OR_EXP  = [0, 1, 1, 1];

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S1E1Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// GENESIS · S1E1 · {episode?.title ?? 'THE FIRST NEURON'}</div>
      <h2 className="ml-mani-h">
        Every artificial mind begins with one question:
        <br />
        <em className="ml-mani-em">Is the signal strong enough?</em>
      </h2>
      <p className="ml-mani-p">
        In Kinderheim 511, children were reshaped into weapons — each impulse weighted,
        each threshold calibrated, each response trained until only the desired output remained.
        Warren McCulloch and Walter Pitts formalized this in 1943. Not a philosophy. A formula.
        The artificial neuron: the most important mathematical object in modern computing.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">THE McCULLOCH-PITTS MODEL</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-steps">
      {[
        {
          n: '01', title: 'RECEIVE BINARY INPUTS',
          body: 'Each input xᵢ is 0 (silent) or 1 (firing). The neuron cannot distinguish intensity — only presence or absence. Firing is binary. The signal either reaches you or it does not.',
        },
        {
          n: '02', title: 'MULTIPLY BY WEIGHTS',
          body: 'Each input is multiplied by its weight wᵢ. Large positive weights amplify importance. Zero weights ignore the input entirely. Negative weights actively suppress firing — a veto from an inhibitory connection.',
        },
        {
          n: '03', title: 'COMPARE TO THRESHOLD',
          body: 'Sum all weighted inputs into z. If z ≥ θ (theta), the neuron fires — output 1. If z < θ, silence — output 0. One comparison. One bit. The entire computation of a single neuron.',
        },
      ].map(s => (
        <div key={s.n} className="s1e1-step">
          <div className="s1e1-step-num">{s.n}</div>
          <div className="s1e1-step-content">
            <div className="s1e1-step-title">{s.title}</div>
            <p className="s1e1-step-body">{s.body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">02</span>
      <span className="ml-sec-ttl">THE FORMULA</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-formula-block">
      <div className="s1e1-formula-line">
        <span className="s1e1-fv">z</span>
        <span className="s1e1-fo">&nbsp;=&nbsp;</span>
        <span className="s1e1-fv">w₁</span><span className="s1e1-fo">·</span><span className="s1e1-fv">x₁</span>
        <span className="s1e1-fo">&nbsp;+&nbsp;</span>
        <span className="s1e1-fv">w₂</span><span className="s1e1-fo">·</span><span className="s1e1-fv">x₂</span>
        <span className="s1e1-fo">&nbsp;+&nbsp;···&nbsp;+&nbsp;</span>
        <span className="s1e1-fv">wₙ</span><span className="s1e1-fo">·</span><span className="s1e1-fv">xₙ</span>
      </div>
      <div className="s1e1-formula-line s1e1-formula-out">
        <span className="s1e1-fv">y</span>
        <span className="s1e1-fo">&nbsp;=&nbsp;</span>
        <span className="s1e1-fv">1</span>
        <span className="s1e1-fo">&nbsp;if&nbsp;z&nbsp;≥&nbsp;θ,&nbsp;&nbsp;&nbsp;</span>
        <span className="s1e1-fv">0</span>
        <span className="s1e1-fo">&nbsp;if&nbsp;z&nbsp;&lt;&nbsp;θ</span>
      </div>
      <div className="s1e1-worked">
        <div className="s1e1-worked-title">WORKED EXAMPLE — AND gate (w₁=w₂=1, θ=1.5):</div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">[1,&nbsp;0]</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">z = 1×1 + 1×0 = 1.0</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-cmp">1.0 &lt; 1.5</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-res s1e1-wr-0">y = 0</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">[1,&nbsp;1]</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">z = 1×1 + 1×1 = 2.0</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-cmp">2.0 ≥ 1.5</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-res s1e1-wr-1">y = 1</span>
        </div>
      </div>
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">03</span>
      <span className="ml-sec-ttl">THE FUNDAMENTAL LIMIT</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-limit-box">
      <div className="s1e1-limit-title">A single neuron draws exactly one straight line.</div>
      <p className="s1e1-limit-body">
        The decision boundary w₁x₁ + w₂x₂ = θ is a line in 2D input space. Everything above fires.
        Everything below stays silent. Any problem whose outputs can be separated by a straight line
        is solvable. Any problem that cannot be linearly separated is impossible for one neuron — no
        matter what weights or threshold you choose.
      </p>
      <p className="s1e1-limit-body">
        AND is solvable. OR is solvable. XOR is not — its four input points cannot be divided by any
        single line. That is the crisis that drove AI research underground for a decade. Episode 2
        shows you how hidden layers break through it.
      </p>
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Fire the AND neuron in Playground — see the threshold in action</span>
        <span>Build an OR neuron in Synapse — same architecture, different threshold</span>
        <span>Discover: AND and OR share the same weights, only θ changes</span>
        <span>Confirm: moving θ from 1.5 to ~0.5 flips AND into OR</span>
      </div>
    </div>
  </div>
);

// ── Shared neuron SVG ─────────────────────────────────────────────────────────
interface NSVGProps {
  x1: number; x2: number;
  z: number | null; output: number | null;
  w1: number; w2: number; theta: number;
  animKey?: number;
  showValues?: boolean;
}

const NeuronSVG: React.FC<NSVGProps> = ({ x1, x2, z, output, w1, w2, theta, animKey = 0, showValues = false }) => {
  const fired = output !== null;
  const x1on = fired && x1 === 1;
  const x2on = fired && x2 === 1;
  const active = output === 1;

  function edgeCls(w: number, lit: boolean) {
    const c = Math.abs(w) < 0.4 ? 'nn-e-z' : w > 0 ? 'nn-e-p' : 'nn-e-n';
    const t = Math.abs(w) >= 3 ? 'wire-tk' : Math.abs(w) >= 1.5 ? 'wire-md' : 'wire-th';
    return `nn-e ${c} ${t} ${lit ? 'nn-e-fire' : ''}`;
  }

  return (
    <svg key={animKey} viewBox="0 0 740 300" className="nn-svg">
      <text x={80}  y={34} className="nn-lbl" textAnchor="middle">INPUTS</text>
      <text x={375} y={34} className="nn-lbl" textAnchor="middle">NEURON</text>
      <text x={660} y={34} className="nn-lbl" textAnchor="middle">OUTPUT</text>

      {/* Edges */}
      <line x1={104} y1={122} x2={333} y2={168} className={edgeCls(w1, x1on)} />
      <line x1={104} y1={212} x2={333} y2={182} className={edgeCls(w2, x2on)} />
      <line x1={417} y1={175} x2={630} y2={175}
        className={`nn-e wire-md ${active ? 'nn-e-p nn-e-fire nn-e-fire2' : 'nn-e-z'}`} />

      {/* Weight labels */}
      <text x={210} y={130} className="nn-wlbl" textAnchor="middle">
        {w1 >= 0 ? '+' : ''}{w1.toFixed(w1 % 1 === 0 ? 0 : 1)}
      </text>
      <text x={210} y={222} className="nn-wlbl" textAnchor="middle">
        {w2 >= 0 ? '+' : ''}{w2.toFixed(w2 % 1 === 0 ? 0 : 1)}
      </text>

      {/* Input nodes */}
      <circle cx={80} cy={122} r={24} className={`nn-nd nn-nd-i ${x1on ? 'nn-hi' : fired ? 'nn-lo' : ''}`} />
      <text x={80} y={123} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
        {(fired || showValues) ? x1 : 'x₁'}
      </text>
      <text x={80} y={156} textAnchor="middle" className="nn-ns">x₁</text>

      <circle cx={80} cy={212} r={24} className={`nn-nd nn-nd-i ${x2on ? 'nn-hi' : fired ? 'nn-lo' : ''}`} />
      <text x={80} y={213} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
        {(fired || showValues) ? x2 : 'x₂'}
      </text>
      <text x={80} y={246} textAnchor="middle" className="nn-ns">x₂</text>

      {/* Neuron body */}
      <circle cx={375} cy={175} r={42} className={`nn-nd nn-nd-h ${fired ? (active ? 'nn-hi' : 'nn-lo') : ''}`} />
      <text x={375} y={168} textAnchor="middle" dominantBaseline="middle" className="nn-nv">Σ</text>
      <text x={375} y={186} textAnchor="middle" dominantBaseline="middle" className="nn-ns">
        {z !== null ? `z=${z.toFixed(1)}` : 'Σwᵢxᵢ'}
      </text>
      {fired && (
        <text x={375} y={228} textAnchor="middle" className="nn-ns"
          style={{ fill: active ? '#00c85a' : 'rgba(240,237,230,.4)', fontSize: '8.5px' }}>
          {z!.toFixed(1)}{active ? ' ≥ ' : ' < '}θ={theta} → {active ? 'FIRE' : 'SILENT'}
        </text>
      )}

      {/* Output node */}
      <circle cx={660} cy={175} r={28}
        className={`nn-nd nn-nd-o ${output !== null ? (active ? 'nn-hi' : 'nn-lo') : ''}`} />
      <text x={660} y={176} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
        {output !== null ? output : 'y'}
      </text>
      <text x={660} y={218} textAnchor="middle" className="nn-ns">OUTPUT</text>
      {fired && (
        <text x={660} y={140} textAnchor="middle"
          className={`nn-verdict ${active ? 'nn-verdict-1' : 'nn-verdict-0'}`}>
          {active ? '→ 1' : '→ 0'}
        </text>
      )}
    </svg>
  );
};

// ── PLAYGROUND ─────────────────────────────────────────────────────────────────
const PG_NOTES = [
  { id: 'a', text: 'Only [1,1] fires. Threshold 1.5 sits between 1 (one input) and 2 (both inputs). Neither alone clears it.' },
  { id: 'b', text: 'The weights don\'t need to be 1. w₁=3, w₂=3, θ=4.5 gives identical AND behavior — only the ratio w/θ matters.' },
  { id: 'c', text: 'A negative weight would suppress firing when that input is 1. You\'ll use negative weights in Episode 2 to solve XOR.' },
  { id: 'd', text: 'Every neuron draws one straight line: w₁x₁ + w₂x₂ = θ. Everything above fires, everything below stays silent.' },
];

export const S1E1Playground: React.FC = () => {
  const [inp, setInp] = useState<[number, number] | null>(null);
  const [z, setZ] = useState<number | null>(null);
  const [out, setOut] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [history, setHistory] = useState<{ inp: [number, number]; out: number }[]>([]);

  const fire = () => {
    if (!inp) return;
    const zv = W1 * inp[0] + W2 * inp[1];
    const ov = zv >= THETA ? 1 : 0;
    setZ(zv); setOut(ov);
    setAnimKey(k => k + 1);
    setHistory(prev =>
      prev.some(h => h.inp[0] === inp[0] && h.inp[1] === inp[1]) ? prev
        : [...prev, { inp, out: ov }]
    );
  };

  const pick = (i: [number, number]) => { setInp(i); setZ(null); setOut(null); };

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">The AND Neuron</div>
        <p className="pg-intro-body">
          A pre-configured McCulloch-Pitts neuron: w₁=1, w₂=1, threshold θ=1.5.
          It implements AND. Select any input pair and fire it — watch the weighted sum
          race through the threshold comparison. The notes below reveal what the animation alone won't tell you.
        </p>
      </div>

      <div className="pg-inp-row">
        <span className="pg-inp-label">SELECT INPUT:</span>
        {INPUTS.map((i, idx) => (
          <button type="button" key={idx}
            className={`pg-inp-btn ${inp?.[0] === i[0] && inp?.[1] === i[1] ? 'pg-inp-btn-on' : ''}`}
            onClick={() => pick(i)}
          >
            [{i[0]}, {i[1]}]
            <span className="pg-inp-hint">expect {AND_EXP[idx]}</span>
          </button>
        ))}
        <button type="button"
          className={`pg-run-btn ${!inp ? 'pg-run-btn-dim' : ''}`}
          onClick={fire} disabled={!inp}
        >
          FIRE NEURON →
        </button>
      </div>

      <div className="nn-stage">
        <NeuronSVG
          x1={inp?.[0] ?? 0} x2={inp?.[1] ?? 0}
          z={z} output={out}
          w1={W1} w2={W2} theta={THETA}
          animKey={animKey}
        />
        {out !== null && (
          <div className="nn-result-bar">
            <span className="nn-rb-label">
              z = {W1}×{inp![0]} + {W2}×{inp![1]} = {z!.toFixed(1)} &nbsp;·&nbsp; θ = {THETA}
            </span>
            <span className={`nn-rb-verdict ${out ? 'nn-rb-1' : 'nn-rb-0'}`}>
              {z!.toFixed(1)} {out ? '≥' : '<'} {THETA} → y = {out}
            </span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="nn-history">
          <div className="nn-history-title">AND TRUTH TABLE — YOUR RESULTS:</div>
          <div className="nn-history-row">
            {INPUTS.map((i, idx) => {
              const f = history.find(h => h.inp[0] === i[0] && h.inp[1] === i[1]);
              return (
                <div key={idx} className={`nn-hist-cell ${f ? 'nn-hist-ok' : 'nn-hist-empty'}`}>
                  <div className="nn-hist-in">[{i[0]},{i[1]}]</div>
                  <div className="nn-hist-out">{f ? f.out : '—'}</div>
                  <div className="nn-hist-exp">expect {AND_EXP[idx]}</div>
                </div>
              );
            })}
          </div>
          {history.length === 4 && (
            <div className="nn-history-done">
              ✓ AND mapped. Go to SYNAPSE — same architecture, your task: build OR.
            </div>
          )}
        </div>
      )}

      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE ─────────────────────────────────────────────────────────────────────
const SYN_NOTES = [
  { id: 'a', text: 'OR fires when AT LEAST one input is 1. Sum is 1 for [0,1] and [1,0]. Your threshold must accept 1 but reject 0.' },
  { id: 'b', text: 'One working solution: w₁=1, w₂=1, θ=0.5. The threshold sits between 0 (no inputs) and 1 (at least one input).' },
  { id: 'c', text: 'AND used θ=1.5. OR uses θ≈0.5. The weights stay the same. The threshold defines the gate — not the weights.' },
  { id: 'd', text: 'Try θ=0. Everything fires — even [0,0]. Too low. Try θ=1.5. Same as AND — too high. The answer is between them.' },
];

interface SynState { w1: number; w2: number; theta: number; }
type TResult = { inp: [number, number]; z: number; out: number; pass: boolean };

export const S1E1Synapse: React.FC = () => {
  const [ws, setWs] = useState<SynState>({ w1: 0, w2: 0, theta: 0 });
  const [tested, setTested] = useState<TResult[] | null>(null);

  const upd = (p: Partial<SynState>) => { setWs(s => ({ ...s, ...p })); setTested(null); };

  const test = () => {
    setTested(INPUTS.map((inp, i) => {
      const z = ws.w1 * inp[0] + ws.w2 * inp[1];
      const out = z >= ws.theta ? 1 : 0;
      return { inp, z, out, pass: out === OR_EXP[i] };
    }));
  };

  const reset = () => { setWs({ w1: 0, w2: 0, theta: 0 }); setTested(null); };
  const score = tested ? tested.filter(r => r.pass).length : null;
  const solved = score === 4;

  return (
    <div className="ml-synapse">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse · Build OR</div>
        <p className="syn-intro-body">
          You watched AND. Now configure the exact same neuron architecture to compute OR.
          Adjust w₁, w₂, and θ until all four input pairs produce the correct output.
          Hint: you may not need to touch the weights at all.
        </p>
      </div>

      {/* Target truth table */}
      <div className="s1e1-target">
        <span className="s1e1-target-label">TARGET: OR GATE</span>
        <div className="s1e1-target-row">
          {INPUTS.map((inp, i) => (
            <div key={i} className={`s1e1-tc ${OR_EXP[i] ? 's1e1-tc-1' : 's1e1-tc-0'}`}>
              <div className="s1e1-tc-inp">[{inp[0]},{inp[1]}]</div>
              <div className="s1e1-tc-exp">{OR_EXP[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="syn-layout">
        <div className="syn-visual">
          <NeuronSVG
            x1={0} x2={0} z={null} output={null}
            w1={ws.w1} w2={ws.w2} theta={ws.theta}
          />
          <div className="syn-legend">
            <span className="syn-leg syn-leg-p">positive weight</span>
            <span className="syn-leg syn-leg-n">negative weight</span>
            <span className="syn-leg syn-leg-z">near zero</span>
            <span className="syn-leg syn-leg-tk">high magnitude</span>
          </div>
        </div>
        <div className="syn-controls">
          <div className="wire-group">
            <div className="wire-group-title">INPUT WEIGHTS</div>
            <Slider label="w₁" sub="weight for x₁" val={ws.w1} min={-5} max={5} step={0.5} onChange={v => upd({ w1: v })} />
            <Slider label="w₂" sub="weight for x₂" val={ws.w2} min={-5} max={5} step={0.5} onChange={v => upd({ w2: v })} />
          </div>
          <div className="wire-group">
            <div className="wire-group-title">THRESHOLD θ</div>
            <Slider label="θ" sub="firing threshold" val={ws.theta} min={-2} max={4} step={0.5} onChange={v => upd({ theta: v })} />
          </div>
          <div className="syn-actions">
            <button type="button" className="syn-test-btn" onClick={test}>TEST NEURON ▶</button>
            <button type="button" className="syn-reset-btn" onClick={reset}>RESET</button>
          </div>
        </div>
      </div>

      {tested && (
        <div className={`syn-results ${solved ? 'syn-results-ok' : ''}`}>
          <div className="syn-results-header">
            {solved
              ? <span className="syn-score-ok">✓ SOLVED — {score}/4 correct</span>
              : <span className="syn-score-ng">{score}/4 correct — keep adjusting</span>
            }
          </div>
          <div className="syn-results-row">
            {tested.map((r, i) => (
              <div key={i} className={`syn-rc ${r.pass ? 'syn-rc-ok' : 'syn-rc-ng'}`}>
                <div className="syn-rc-in">[{r.inp[0]},{r.inp[1]}]</div>
                <div className="syn-rc-out">z={r.z.toFixed(1)}</div>
                <div className="syn-rc-exp">{r.pass ? `✓ y=${r.out}` : `✗ y=${r.out}, exp ${OR_EXP[i]}`}</div>
              </div>
            ))}
          </div>
          {solved && (
            <div className="syn-solved-note">
              AND and OR are identical architectures — same two inputs, same two weights,
              one neuron. Only θ changed: 1.5 for AND, ~0.5 for OR. The threshold defines the gate,
              not the weights. In Episode 2 you will hit the wall: no single θ can solve XOR.
              Its four points cannot be separated by any straight line. That is why layers exist.
            </div>
          )}
        </div>
      )}

      <AwareStrip notes={SYN_NOTES} />
    </div>
  );
};
