import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip, Slider } from './MLShared';

// ── Pre-trained 2→2→1 XOR network ─────────────────────────────────────────────
const PG_W = [[20, 20], [20, 20]] as number[][];   // [hidden][input]
const PG_B = [-10, -30] as number[];
const PG_V = [20, -20] as number[];
const PG_C = -10;

function sig(x: number) { return 1 / (1 + Math.exp(-x)); }
interface NNResult { h: [number, number]; out: number }

function fwd(w: number[][], b: number[], v: number[], c: number, x1: number, x2: number): NNResult {
  const h: [number, number] = [
    sig(w[0][0] * x1 + w[0][1] * x2 + b[0]),
    sig(w[1][0] * x1 + w[1][1] * x2 + b[1]),
  ];
  return { h, out: sig(v[0] * h[0] + v[1] * h[1] + c) };
}

const NP = {
  inp: [{ x: 90, y: 157 }, { x: 90, y: 237 }],
  hid: [{ x: 375, y: 137 }, { x: 375, y: 257 }],
  out: [{ x: 650, y: 197 }],
};

const XOR_INPUTS: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const XOR_EXP = [0, 1, 1, 0];

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S1E2Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// DEPTH · S1E2 · {episode?.title ?? 'WHY LAYERS EXIST'}</div>
      <h2 className="ml-mani-h">
        One neuron draws one line.
        <br />
        <em className="ml-mani-em">Some problems need curves.</em>
      </h2>
      <p className="ml-mani-p">
        Johan Liebert could manipulate anyone — but one person was never enough.
        True power required networks of influence: layers of manipulation, each node depending
        on another's output. A single connection could be cut. A web could not.
        The same principle broke open the XOR crisis of 1969 and resurrected neural networks.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">THE XOR PROBLEM</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e2-xor-visual">
      <div className="s1e2-xv-title">XOR TRUTH TABLE — FOUR POINTS IN 2D SPACE</div>
      <div className="s1e2-points">
        {([[[0,0],0],[[0,1],1],[[1,0],1],[[1,1],0]] as [[number,number],number][]).map(([inp, exp]) => (
          <div key={`${inp[0]}${inp[1]}`} className={`s1e2-pt ${exp ? 's1e2-pt-1' : 's1e2-pt-0'}`}>
            <div className="s1e2-pt-inp">[{inp[0]}, {inp[1]}]</div>
            <div className="s1e2-pt-out">{exp}</div>
          </div>
        ))}
      </div>
      <p className="s1e2-xv-body">
        Plot the four XOR inputs in 2D space. The "1" outputs are at opposite corners — (0,1) and (1,0).
        The "0" outputs are at the other two corners — (0,0) and (1,1). Try drawing a single straight
        line that separates the 1s from the 0s. You cannot. This is the formal definition of linear
        non-separability. Minsky and Papert proved in 1969 that no single-layer perceptron can solve it.
        AI research stagnated for 15 years.
      </p>
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">02</span>
      <span className="ml-sec-ttl">THE HIDDEN LAYER SOLUTION</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e2-roles">
      <div className="s1e2-role">
        <div className="s1e2-role-tag">H1 · ROLE DISCOVERED</div>
        <div className="s1e2-role-name">The OR Detector</div>
        <p className="s1e2-role-body">
          With weights ≈+20, +20 and bias ≈−10, H1 fires when at least one input is 1.
          It computes OR. No one programmed this — backpropagation discovered it automatically
          as the specialization that minimizes the loss over all four training examples.
        </p>
      </div>
      <div className="s1e2-role">
        <div className="s1e2-role-tag">H2 · ROLE DISCOVERED</div>
        <div className="s1e2-role-name">The AND Detector</div>
        <p className="s1e2-role-body">
          With weights ≈+20, +20 and bias ≈−30, H2 fires only when both inputs are 1.
          It computes AND. The large negative bias makes it reluctant — it needs a much
          stronger combined signal. The output neuron then suppresses H2 with a −20 weight.
        </p>
      </div>
    </div>
    <div className="ml-manifesto" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
      <div className="ml-mani-eyebrow">// THE KEY INSIGHT</div>
      <p className="ml-mani-p">
        XOR = OR AND NOT(AND). The hidden layer transforms (x₁, x₂) into a new 2D space
        (h₁, h₂) where the outputs become linearly separable. The output neuron draws a
        straight line through this transformed space and gets XOR right. Depth manufactures
        separability from scratch.
      </p>
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">03</span>
      <span className="ml-sec-ttl">THE SIGMOID ACTIVATION</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-formula-block">
      <div className="s1e1-formula-line">
        <span className="s1e1-fv">σ(z)</span>
        <span className="s1e1-fo">&nbsp;=&nbsp;</span>
        <span className="s1e1-fo">1 / (1 + e</span>
        <span className="s1e1-fv">⁻ᶻ</span>
        <span className="s1e1-fo">)</span>
      </div>
      <div className="s1e1-worked">
        <div className="s1e1-worked-title">WHY SIGMOID INSTEAD OF THE STEP FUNCTION?</div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">The McCulloch-Pitts step function is not differentiable.</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">Backpropagation (Episode 3) requires gradients everywhere.</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">Sigmoid is a smooth S-curve: output squashed into (0, 1).</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">Large magnitude weights push it close to 0 or 1 anyway.</span>
        </div>
      </div>
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Run all 4 XOR inputs in Playground — see H1 and H2 specialize</span>
        <span>Observe: H2 barely activates on [0,1] — the bias suppresses it</span>
        <span>Build your own XOR network in Synapse — find the weights yourself</span>
        <span>Notice: you need a negative output weight to suppress H2's AND signal</span>
      </div>
    </div>
  </div>
);

// ── PLAYGROUND SVG ─────────────────────────────────────────────────────────────
const PlaygroundSVG: React.FC<{ result: NNResult | null; inp: [number, number]; k: number }> = ({ result, inp, k }) => {
  function nCls(a: number, base: string) {
    if (a < 0) return base;
    return `${base} ${a > 0.5 ? 'nn-hi' : 'nn-lo'}`;
  }

  return (
    <svg key={k} viewBox="0 0 740 345" className="nn-svg">
      <text x={90}  y={44} className="nn-lbl" textAnchor="middle">INPUT</text>
      <text x={375} y={44} className="nn-lbl" textAnchor="middle">HIDDEN</text>
      <text x={650} y={44} className="nn-lbl" textAnchor="middle">OUTPUT</text>

      {NP.inp.map((ip, ii) =>
        NP.hid.map((hp, hi) => {
          const w = PG_W[hi][ii];
          return (
            <line key={`ih-${ii}-${hi}`}
              x1={ip.x + 24} y1={ip.y} x2={hp.x - 24} y2={hp.y}
              className={`nn-e ${w > 0 ? 'nn-e-p' : 'nn-e-n'} ${result ? 'nn-e-fire' : ''}`}
            />
          );
        })
      )}
      {NP.hid.map((hp, hi) =>
        NP.out.map((op) => {
          const w = PG_V[hi];
          return (
            <line key={`ho-${hi}`}
              x1={hp.x + 24} y1={hp.y} x2={op.x - 28} y2={op.y}
              className={`nn-e ${w > 0 ? 'nn-e-p' : 'nn-e-n'} ${result ? 'nn-e-fire nn-e-fire2' : ''}`}
            />
          );
        })
      )}

      {NP.inp.map((p, i) => (
        <g key={`ni-${i}`}>
          <circle cx={p.x} cy={p.y} r={24} className={nCls(result ? inp[i] : -1, 'nn-nd nn-nd-i')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? inp[i] : `x${i + 1}`}
          </text>
          <text x={p.x} y={p.y + 38} textAnchor="middle" className="nn-ns">IN{i + 1}</text>
        </g>
      ))}
      {NP.hid.map((p, i) => (
        <g key={`nh-${i}`}>
          <circle cx={p.x} cy={p.y} r={24} className={nCls(result?.h[i] ?? -1, 'nn-nd nn-nd-h')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? result.h[i].toFixed(2) : ['H1', 'H2'][i]}
          </text>
          <text x={p.x} y={p.y + 38} textAnchor="middle" className="nn-ns">H{i + 1}</text>
        </g>
      ))}
      {NP.out.map((p) => (
        <g key="no">
          <circle cx={p.x} cy={p.y} r={28} className={nCls(result?.out ?? -1, 'nn-nd nn-nd-o')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? result.out.toFixed(3) : 'ŷ'}
          </text>
          <text x={p.x} y={p.y + 43} textAnchor="middle" className="nn-ns">OUTPUT</text>
          {result && (
            <text x={p.x} y={p.y - 46} textAnchor="middle"
              className={`nn-verdict ${result.out > 0.5 ? 'nn-verdict-1' : 'nn-verdict-0'}`}>
              {result.out > 0.5 ? '→ 1' : '→ 0'}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const PG_NOTES = [
  { id: 'a', text: 'H1 acts as OR, H2 as AND — neither was programmed. Backpropagation discovered these roles automatically from 4 examples.' },
  { id: 'b', text: 'The edge from H2 (AND) to output carries weight −20. Negative weights suppress: the output is silenced when both inputs fire.' },
  { id: 'c', text: "H2's large negative bias (−30) makes it reluctant to fire — it needs both inputs at 1 simultaneously. Try [0,1]: H2 barely activates." },
  { id: 'd', text: 'Output rounds to 0 or 1 at threshold 0.5. A raw value of 0.003 and 0.997 are both correct — confidence is a bonus, not the goal.' },
];

export const S1E2Playground: React.FC = () => {
  const [selectedInp, setSelectedInp] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<NNResult | null>(null);
  const [svgKey, setSvgKey] = useState(0);
  const [history, setHistory] = useState<{ inp: [number, number]; out: number }[]>([]);

  const run = () => {
    if (!selectedInp) return;
    const res = fwd(PG_W, PG_B, PG_V, PG_C, selectedInp[0], selectedInp[1]);
    setResult(res); setSvgKey(k => k + 1);
    setHistory(prev =>
      prev.some(x => x.inp[0] === selectedInp[0] && x.inp[1] === selectedInp[1]) ? prev
        : [...prev, { inp: selectedInp, out: res.out }]
    );
  };

  const selectInp = (inp: [number, number]) => { setSelectedInp(inp); setResult(null); };
  const expIdx = selectedInp ? XOR_INPUTS.findIndex(x => x[0] === selectedInp[0] && x[1] === selectedInp[1]) : -1;

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">The XOR Network</div>
        <p className="pg-intro-body">
          A pre-trained 2→2→1 network that solves XOR. Watch H1 and H2 specialize into
          different detectors as the signal flows through. After you've mapped all 4 inputs,
          go to SYNAPSE and build it yourself from scratch.
        </p>
      </div>

      <div className="xor-box">
        <div className="xor-box-left">
          <div className="xor-box-title">THE XOR PROBLEM</div>
          <div className="xor-grid">
            <div className="xor-cell xor-f">0 XOR 0 = <strong>0</strong></div>
            <div className="xor-cell xor-t">0 XOR 1 = <strong>1</strong></div>
            <div className="xor-cell xor-t">1 XOR 0 = <strong>1</strong></div>
            <div className="xor-cell xor-f">1 XOR 1 = <strong>0</strong></div>
          </div>
        </div>
        <div className="xor-box-right">
          <div className="xor-note-title">Why it needs layers</div>
          <p className="xor-note-body">
            A single neuron draws one straight line to separate outputs. No straight line can
            separate XOR. Hidden layers let the network draw curved, non-linear decision boundaries.
          </p>
        </div>
      </div>

      <div className="pg-inp-row">
        <span className="pg-inp-label">SELECT INPUT:</span>
        {XOR_INPUTS.map((inp, i) => (
          <button type="button" key={i}
            className={`pg-inp-btn ${selectedInp?.[0] === inp[0] && selectedInp?.[1] === inp[1] ? 'pg-inp-btn-on' : ''}`}
            onClick={() => selectInp(inp)}
          >
            [{inp[0]}, {inp[1]}]
            <span className="pg-inp-hint">expect {XOR_EXP[i]}</span>
          </button>
        ))}
        <button type="button"
          className={`pg-run-btn ${!selectedInp ? 'pg-run-btn-dim' : ''}`}
          onClick={run} disabled={!selectedInp}
        >
          RUN FORWARD PASS →
        </button>
      </div>

      <div className="nn-stage">
        <PlaygroundSVG result={result} inp={selectedInp ?? [0, 0]} k={svgKey} />
        {result && (
          <div className="nn-result-bar">
            <span className="nn-rb-label">raw: {result.out.toFixed(5)}</span>
            <span className={`nn-rb-verdict ${result.out > 0.5 ? 'nn-rb-1' : 'nn-rb-0'}`}>
              → rounds to {result.out > 0.5 ? 1 : 0}
              {expIdx >= 0 ? `  (expected ${XOR_EXP[expIdx]})` : ''}
            </span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="nn-history">
          <div className="nn-history-title">RESULTS SO FAR:</div>
          <div className="nn-history-row">
            {XOR_INPUTS.map((inp, i) => {
              const found = history.find(x => x.inp[0] === inp[0] && x.inp[1] === inp[1]);
              return (
                <div key={i} className={`nn-hist-cell ${found ? 'nn-hist-ok' : 'nn-hist-empty'}`}>
                  <div className="nn-hist-in">[{inp[0]},{inp[1]}]</div>
                  <div className="nn-hist-out">{found ? found.out.toFixed(3) : '—'}</div>
                  <div className="nn-hist-exp">expect {XOR_EXP[i]}</div>
                </div>
              );
            })}
          </div>
          {history.length === 4 && (
            <div className="nn-history-done">✓ All 4 inputs verified. Now — go to SYNAPSE and build it yourself.</div>
          )}
        </div>
      )}
      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE (build from scratch) ──────────────────────────────────────────────
interface WState {
  w: [[number, number], [number, number]];
  b: [number, number];
  v: [number, number];
  c: number;
}
const W_INIT: WState = { w: [[0, 0], [0, 0]], b: [0, 0], v: [0, 0], c: 0 };

const WireSVG: React.FC<{ w: number[][]; v: number[] }> = ({ w, v }) => {
  function eCls(weight: number) {
    const abs = Math.abs(weight);
    const thick = abs >= 12 ? 'wire-tk' : abs >= 4 ? 'wire-md' : 'wire-th';
    const col = weight > 1 ? 'nn-e-p' : weight < -1 ? 'nn-e-n' : 'nn-e-z';
    return `nn-e ${col} ${thick}`;
  }
  return (
    <svg viewBox="0 0 740 345" className="nn-svg">
      <text x={90}  y={44} className="nn-lbl" textAnchor="middle">INPUT</text>
      <text x={375} y={44} className="nn-lbl" textAnchor="middle">HIDDEN</text>
      <text x={650} y={44} className="nn-lbl" textAnchor="middle">OUTPUT</text>
      {NP.inp.map((ip, ii) =>
        NP.hid.map((hp, hi) => (
          <line key={`ih-${ii}-${hi}`} x1={ip.x + 24} y1={ip.y} x2={hp.x - 24} y2={hp.y} className={eCls(w[hi][ii])} />
        ))
      )}
      {NP.hid.map((hp, hi) =>
        NP.out.map((op) => (
          <line key={`ho-${hi}`} x1={hp.x + 24} y1={hp.y} x2={op.x - 28} y2={op.y} className={eCls(v[hi])} />
        ))
      )}
      {NP.inp.map((p, i) => (
        <g key={`ni-${i}`}>
          <circle cx={p.x} cy={p.y} r={24} className="nn-nd nn-nd-i" />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">x{i + 1}</text>
          <text x={p.x} y={p.y + 38} textAnchor="middle" className="nn-ns">IN{i + 1}</text>
        </g>
      ))}
      {NP.hid.map((p, i) => (
        <g key={`nh-${i}`}>
          <circle cx={p.x} cy={p.y} r={24} className="nn-nd nn-nd-h" />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">H{i + 1}</text>
        </g>
      ))}
      {NP.out.map((p) => (
        <g key="no">
          <circle cx={p.x} cy={p.y} r={28} className="nn-nd nn-nd-o" />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">ŷ</text>
          <text x={p.x} y={p.y + 43} textAnchor="middle" className="nn-ns">OUTPUT</text>
        </g>
      ))}
    </svg>
  );
};

const WIRE_NOTES = [
  { id: 'a', text: 'You need one detector that fires when ≥1 input is 1 (OR), and one that fires only when both are 1 (AND).' },
  { id: 'b', text: "The output weight for your AND-detector must be negative — without it, you can't suppress the case where both inputs are 1." },
  { id: 'c', text: 'Scale matters: weights of ±5 give soft, uncertain outputs. Weights of ±20 give sharp, confident boundaries.' },
  { id: 'd', text: 'XOR is solvable with exactly 2 hidden neurons — the minimum. Adding more will not help.' },
];

export const S1E2Synapse: React.FC = () => {
  const [ws, setWs] = useState<WState>(W_INIT);
  const [tested, setTested] = useState<{ inp: [number, number]; out: number; pass: boolean }[] | null>(null);

  const set = (updater: (s: WState) => WState) => { setWs(updater); setTested(null); };

  const test = () => {
    setTested(XOR_INPUTS.map((inp, i) => {
      const res = fwd(ws.w, ws.b, ws.v, ws.c, inp[0], inp[1]);
      return { inp, out: res.out, pass: (res.out > 0.5 ? 1 : 0) === XOR_EXP[i] };
    }));
  };

  const reset = () => { setWs(W_INIT); setTested(null); };
  const score = tested ? tested.filter(r => r.pass).length : null;
  const solved = score === 4;

  return (
    <div className="ml-synapse">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse</div>
        <p className="syn-intro-body">
          You've seen a working XOR network. Now build one yourself. Set the weights and biases —
          the visualization updates live. When you think it's ready, hit TEST.
        </p>
      </div>

      <div className="syn-layout">
        <div className="syn-visual">
          <WireSVG w={ws.w} v={ws.v} />
          <div className="syn-legend">
            <span className="syn-leg syn-leg-p">positive weight</span>
            <span className="syn-leg syn-leg-n">negative weight</span>
            <span className="syn-leg syn-leg-z">near zero</span>
            <span className="syn-leg syn-leg-tk">high magnitude</span>
          </div>
        </div>
        <div className="syn-controls">
          <div className="wire-group">
            <div className="wire-group-title">HIDDEN 1 (H1)</div>
            <Slider label="x₁ → H1" sub="input connection" val={ws.w[0][0]} onChange={v => set(s => ({ ...s, w: [[v, s.w[0][1]], s.w[1]] }))} />
            <Slider label="x₂ → H1" sub="input connection" val={ws.w[0][1]} onChange={v => set(s => ({ ...s, w: [[s.w[0][0], v], s.w[1]] }))} />
            <Slider label="Bias H1"  sub="threshold shift"  val={ws.b[0]}    onChange={v => set(s => ({ ...s, b: [v, s.b[1]] }))} />
          </div>
          <div className="wire-group">
            <div className="wire-group-title">HIDDEN 2 (H2)</div>
            <Slider label="x₁ → H2" sub="input connection" val={ws.w[1][0]} onChange={v => set(s => ({ ...s, w: [s.w[0], [v, s.w[1][1]]] }))} />
            <Slider label="x₂ → H2" sub="input connection" val={ws.w[1][1]} onChange={v => set(s => ({ ...s, w: [s.w[0], [s.w[1][0], v]] }))} />
            <Slider label="Bias H2"  sub="threshold shift"  val={ws.b[1]}    onChange={v => set(s => ({ ...s, b: [s.b[0], v] }))} />
          </div>
          <div className="wire-group">
            <div className="wire-group-title">OUTPUT GATE</div>
            <Slider label="H1 → ŷ" sub="output weight" val={ws.v[0]} onChange={v => set(s => ({ ...s, v: [v, s.v[1]] }))} />
            <Slider label="H2 → ŷ" sub="output weight" val={ws.v[1]} onChange={v => set(s => ({ ...s, v: [s.v[0], v] }))} />
            <Slider label="Bias ŷ"  sub="output bias"   val={ws.c}    onChange={v => set(s => ({ ...s, c: v }))} />
          </div>
          <div className="syn-actions">
            <button type="button" className="syn-test-btn" onClick={test}>TEST NETWORK ▶</button>
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
                <div className="syn-rc-out">{r.out.toFixed(3)}</div>
                <div className="syn-rc-exp">{r.pass ? '✓' : `✗ expect ${XOR_EXP[i]}`}</div>
              </div>
            ))}
          </div>
          {solved && (
            <div className="syn-solved-note">
              You just hand-crafted a neural network that solves XOR. Backpropagation does this
              automatically — across millions of examples and billions of weights.
              In Episode 3, you'll implement it yourself from the chain rule up.
            </div>
          )}
        </div>
      )}
      <AwareStrip notes={WIRE_NOTES} />
    </div>
  );
};
