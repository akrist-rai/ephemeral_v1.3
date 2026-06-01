import React, { useState } from 'react';
import type { DomainPageProps } from './types';

// ── Static content ─────────────────────────────────────────────────────────────

const ML_APPS = [
  { name: 'ChatGPT / GPT-4',    tag: 'NLP',      icon: '⟨/⟩', col: '#10b981', stat: '100M users in 60 days',      desc: 'Transformer models passed the bar exam, the medical licensing exam, and write production code — from language alone.' },
  { name: 'Stable Diffusion',   tag: 'VISION',   icon: '◈',   col: '#8b5cf6', stat: '2B+ images generated',        desc: 'Diffusion models reverse controlled noise to generate photorealistic images from a text description.' },
  { name: 'AlphaFold 3',        tag: 'BIOLOGY',  icon: '⊕',   col: '#06b6d4', stat: '200M proteins solved',        desc: 'Deep learning cracked protein folding — a 50-year grand challenge that earned a Nobel Prize in 2024.' },
  { name: 'Tesla FSD',          tag: 'ROBOTICS', icon: '◉',   col: '#f59e0b', stat: '1B autonomous miles',          desc: 'Vision transformers process 8 cameras in real-time to navigate unpredictable traffic from raw pixels alone.' },
  { name: 'AlphaGo / MuZero',   tag: 'STRATEGY', icon: '⬡',   col: '#ef4444', stat: '4-1 vs. Lee Sedol',           desc: 'Reinforcement learning mastered Go — more positions than atoms in the observable universe. Self-taught.' },
  { name: 'GitHub Copilot',     tag: 'CODE',     icon: '{ }', col: '#00c85a', stat: '55% of new code is AI-assisted', desc: 'Code generation models understand programmer intent and complete entire algorithms from comments.' },
];

const EPISODE_PATH = [
  { id: 'S1E1', short: 'The First Neuron',            concept: 'McCulloch-Pitts Perceptron',         phase: 'GENESIS'      },
  { id: 'S1E2', short: 'Why Layers Exist',             concept: 'MLP + XOR Problem',                  phase: 'DEPTH'        },
  { id: 'S1E3', short: 'Learning by Error',            concept: 'Backpropagation + Gradient Descent', phase: 'ENGINE'       },
  { id: 'S2E1', short: 'Attention Changes Everything', concept: 'Scaled Dot-Product Attention',        phase: 'REVOLUTION'   },
  { id: 'S2E2', short: 'The Transformer',              concept: 'Multi-Head Attention + Encoding',    phase: 'ARCHITECTURE' },
  { id: 'S2E3', short: 'Ruhenheim',                    concept: 'Vision Transformers (ViT)',           phase: 'FRONTIER'     },
];

const ABILITIES = [
  'Build image classifiers from scratch',
  'Implement backpropagation by hand',
  'Understand how attention works in Transformers',
  'Read ML research papers with confidence',
  'Train models on real datasets',
  'Explain how ChatGPT works at a technical level',
];

// Notes shown below the playground visualization — things you can't see just by watching
const PG_NOTES = [
  { id: 'a', text: 'H1 acts as OR, H2 as AND — neither was programmed. Backpropagation discovered these roles automatically from 4 examples.' },
  { id: 'b', text: 'The edge from H2 (AND) to output carries weight −20. Negative weights suppress: the output is silenced when both inputs fire.' },
  { id: 'c', text: "H2's large negative bias (−30) makes it reluctant to fire — it needs both inputs at 1 simultaneously. Try [0,1]: H2 barely activates." },
  { id: 'd', text: 'Output rounds to 0 or 1 at threshold 0.5. A raw value of 0.003 and 0.997 are both correct — confidence is a bonus, not the goal.' },
];

// Notes shown below the WIRE (build-from-scratch) section
const WIRE_NOTES = [
  { id: 'a', text: 'You need one detector that fires when ≥ 1 input is 1 (OR), and one that fires only when both are 1 (AND).' },
  { id: 'b', text: "The output weight for your AND-detector must be negative — without it, you can't suppress the case where both inputs are 1." },
  { id: 'c', text: 'Scale matters: weights of ±5 give soft, uncertain outputs. Weights of ±20 give sharp, confident boundaries.' },
  { id: 'd', text: 'XOR is solvable with exactly 2 hidden neurons — the minimum. Adding more will not help.' },
];

// ── 2→2→1 pre-trained XOR network (playground) ────────────────────────────────
const PG_W = [[20, 20], [20, 20]];   // [hidden][input]
const PG_B = [-10, -30];
const PG_V = [20, -20];              // output weights
const PG_C = -10;                    // output bias

function sig(x: number) { return 1 / (1 + Math.exp(-x)); }

interface NNResult { h: [number, number]; out: number }

function fwd(
  w: number[][], b: number[],
  v: number[], c: number,
  x1: number, x2: number,
): NNResult {
  const h: [number, number] = [
    sig(w[0][0] * x1 + w[0][1] * x2 + b[0]),
    sig(w[1][0] * x1 + w[1][1] * x2 + b[1]),
  ];
  return { h, out: sig(v[0] * h[0] + v[1] * h[1] + c) };
}

// ── SVG node positions (shared between playground and wire) ────────────────────
const NP = {
  inp: [{ x: 90, y: 157 }, { x: 90, y: 237 }],
  hid: [{ x: 375, y: 137 }, { x: 375, y: 257 }],
  out: [{ x: 650, y: 197 }],
};

const XOR_INPUTS: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const XOR_EXPECTED = [0, 1, 1, 0];

// ── PLAYGROUND SVG ─────────────────────────────────────────────────────────────
const PlaygroundSVG: React.FC<{ result: NNResult | null; inp: [number, number]; k: number }> = ({ result, inp, k }) => {
  const hidLabels = ['H1', 'H2'];

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
            {result ? result.h[i].toFixed(2) : hidLabels[i]}
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

// ── WIRE SVG (shows weight magnitudes as edge thickness/color, no activations) ─
const WireSVG: React.FC<{ w: number[][]; v: number[] }> = ({ w, v }) => {
  function eCls(weight: number) {
    const abs = Math.abs(weight);
    const thick = abs >= 12 ? 'wire-tk' : abs >= 4 ? 'wire-md' : 'wire-th';
    const col   = weight > 1 ? 'nn-e-p' : weight < -1 ? 'nn-e-n' : 'nn-e-z';
    return `nn-e ${col} ${thick}`;
  }

  return (
    <svg viewBox="0 0 740 345" className="nn-svg">
      <text x={90}  y={44} className="nn-lbl" textAnchor="middle">INPUT</text>
      <text x={375} y={44} className="nn-lbl" textAnchor="middle">HIDDEN</text>
      <text x={650} y={44} className="nn-lbl" textAnchor="middle">OUTPUT</text>

      {NP.inp.map((ip, ii) =>
        NP.hid.map((hp, hi) => (
          <line key={`ih-${ii}-${hi}`}
            x1={ip.x + 24} y1={ip.y} x2={hp.x - 24} y2={hp.y}
            className={eCls(w[hi][ii])}
          />
        ))
      )}

      {NP.hid.map((hp, hi) =>
        NP.out.map((op) => (
          <line key={`ho-${hi}`}
            x1={hp.x + 24} y1={hp.y} x2={op.x - 28} y2={op.y}
            className={eCls(v[hi])}
          />
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

// ── Awareness strip (shared between tabs) ─────────────────────────────────────
const AwareStrip: React.FC<{ notes: typeof PG_NOTES }> = ({ notes }) => (
  <div className="ml-aware">
    <div className="ml-aware-label">// WHAT TO NOTICE</div>
    <ul className="ml-aware-list">
      {notes.map(n => <li key={n.id} className="ml-aware-item">{n.text}</li>)}
    </ul>
  </div>
);

// ── SIGNAL tab ─────────────────────────────────────────────────────────────────
const MLSignal: React.FC<{ arc: DomainPageProps['arc'] }> = ({ arc }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">
        // JOHANS LAB · {arc?.arcName ?? 'MACHINE LEARNING ARC'}
      </div>
      <h2 className="ml-mani-h">
        You're not here to memorize equations.
        <br />
        <em className="ml-mani-em">You're here to build things that think.</em>
      </h2>
      <p className="ml-mani-p">
        We won't start with the sigmoid function. We'll start with what a neural network can actually do —
        and once you've seen it work first-hand, we'll open it up and show you exactly why every piece
        is there. The calculus you already know will appear naturally, not as abstract theory.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">WHAT YOU'RE ABOUT TO BUILD</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ml-apps-grid">
      {ML_APPS.map(app => (
        <div key={app.name} className="ml-app-card">
          <div className="ml-app-top">
            <span className="ml-app-icon">{app.icon}</span>
            <span className="ml-app-tag">{app.tag}</span>
          </div>
          <div className="ml-app-name">{app.name}</div>
          <div className="ml-app-stat">{app.stat}</div>
          <p className="ml-app-desc">{app.desc}</p>
        </div>
      ))}
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">02</span>
      <span className="ml-sec-ttl">THE LEARNING PATH</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ml-ep-path">
      {EPISODE_PATH.map((ep, i) => (
        <React.Fragment key={ep.id}>
          <div className="ml-ep-node">
            <div className="ml-ep-phase">{ep.phase}</div>
            <div className="ml-ep-id">{ep.id}</div>
            <div className="ml-ep-short">{ep.short}</div>
            <div className="ml-ep-concept">{ep.concept}</div>
          </div>
          {i < EPISODE_PATH.length - 1 && <div className="ml-ep-arrow">→</div>}
        </React.Fragment>
      ))}
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">BY THE END OF THIS ARC, YOU WILL:</div>
      <div className="ml-callout-items">
        {ABILITIES.map(s => <span key={s}>{s}</span>)}
      </div>
    </div>
  </div>
);

// ── PLAYGROUND tab ─────────────────────────────────────────────────────────────
const MLPlayground: React.FC = () => {
  const [selectedInp, setSelectedInp] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<NNResult | null>(null);
  const [svgKey, setSvgKey] = useState(0);
  const [history, setHistory] = useState<{ inp: [number, number]; out: number }[]>([]);

  const run = () => {
    if (!selectedInp) return;
    const res = fwd(PG_W, PG_B, PG_V, PG_C, selectedInp[0], selectedInp[1]);
    setResult(res);
    setSvgKey(k => k + 1);
    setHistory(prev =>
      prev.some(x => x.inp[0] === selectedInp[0] && x.inp[1] === selectedInp[1])
        ? prev
        : [...prev, { inp: selectedInp, out: res.out }]
    );
  };

  const selectInp = (inp: [number, number]) => { setSelectedInp(inp); setResult(null); };

  const expIdx = selectedInp
    ? XOR_INPUTS.findIndex(x => x[0] === selectedInp[0] && x[1] === selectedInp[1])
    : -1;

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Don't read about it. Use it first.</div>
        <p className="pg-intro-body">
          A pre-trained XOR network. Select any input pair, fire the forward pass, and watch the signal
          travel through the network. Then check what to notice below — things the animation alone won't tell you.
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
            A single neuron draws one straight line to separate outputs. No straight line can separate XOR.
            Hidden layers let the network draw curved, non-linear decision boundaries.
          </p>
        </div>
      </div>

      <div className="pg-inp-row">
        <span className="pg-inp-label">SELECT INPUT:</span>
        {XOR_INPUTS.map((inp, i) => (
          <button type="button"
            key={i}
            className={`pg-inp-btn ${selectedInp?.[0] === inp[0] && selectedInp?.[1] === inp[1] ? 'pg-inp-btn-on' : ''}`}
            onClick={() => selectInp(inp)}
          >
            [{inp[0]}, {inp[1]}]
            <span className="pg-inp-hint">expect {XOR_EXPECTED[i]}</span>
          </button>
        ))}
        <button type="button"
          className={`pg-run-btn ${!selectedInp ? 'pg-run-btn-dim' : ''}`}
          onClick={run}
          disabled={!selectedInp}
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
              {expIdx >= 0 ? `  (expected ${XOR_EXPECTED[expIdx]})` : ''}
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
                  <div className="nn-hist-exp">expect {XOR_EXPECTED[i]}</div>
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

// ── SYNAPSE tab (build from scratch) ──────────────────────────────────────────
interface WState {
  w: [[number, number], [number, number]];
  b: [number, number];
  v: [number, number];
  c: number;
}

const W_INIT: WState = { w: [[0, 0], [0, 0]], b: [0, 0], v: [0, 0], c: 0 };

function clamp(x: number) { return Math.round(x * 10) / 10; }

const Slider: React.FC<{
  label: string; sub: string; val: number;
  onChange: (v: number) => void;
}> = ({ label, sub, val, onChange }) => (
  <div className="wire-row">
    <div className="wire-row-labels">
      <span className="wire-row-lbl">{label}</span>
      <span className="wire-row-sub">{sub}</span>
    </div>
    <input
      type="range" className="wire-slider" min={-30} max={30} step={1}
      aria-label={`${label} — ${sub}`}
      value={val}
      onChange={e => onChange(clamp(parseFloat(e.target.value)))}
    />
    <span className={`wire-row-val ${val > 0 ? 'wv-pos' : val < 0 ? 'wv-neg' : 'wv-zero'}`}>
      {val > 0 ? '+' : ''}{val}
    </span>
  </div>
);

type TestResult = { inp: [number, number]; out: number; pass: boolean };

const MLSynapse: React.FC = () => {
  const [ws, setWs] = useState<WState>(W_INIT);
  const [tested, setTested] = useState<TestResult[] | null>(null);

  const set = (updater: (s: WState) => WState) => {
    setWs(updater);
    setTested(null);
  };

  const test = () => {
    const results: TestResult[] = XOR_INPUTS.map((inp, i) => {
      const res = fwd(ws.w, ws.b, ws.v, ws.c, inp[0], inp[1]);
      const predicted = res.out > 0.5 ? 1 : 0;
      return { inp, out: res.out, pass: predicted === XOR_EXPECTED[i] };
    });
    setTested(results);
  };

  const reset = () => { setWs(W_INIT); setTested(null); };

  const score = tested ? tested.filter(r => r.pass).length : null;
  const solved = score === 4;

  return (
    <div className="ml-synapse">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse</div>
        <p className="syn-intro-body">
          You've seen a working XOR network. Now build one yourself. Set the weights and biases below —
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
            <Slider label="H1 → ŷ"  sub="output weight" val={ws.v[0]} onChange={v => set(s => ({ ...s, v: [v, s.v[1]] }))} />
            <Slider label="H2 → ŷ"  sub="output weight" val={ws.v[1]} onChange={v => set(s => ({ ...s, v: [s.v[0], v] }))} />
            <Slider label="Bias ŷ"   sub="output bias"   val={ws.c}    onChange={v => set(s => ({ ...s, c: v }))} />
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
                <div className="syn-rc-exp">{r.pass ? '✓' : `✗ expect ${XOR_EXPECTED[i]}`}</div>
              </div>
            ))}
          </div>
          {solved && (
            <div className="syn-solved-note">
              You just hand-crafted a neural network that solves XOR. Backpropagation does this
              automatically — across millions of examples and billions of weights.
            </div>
          )}
        </div>
      )}

      <AwareStrip notes={WIRE_NOTES} />
    </div>
  );
};

// ── Main export ────────────────────────────────────────────────────────────────
export const MachineLearningPage: React.FC<DomainPageProps> = ({
  arc, episode, challenges, tab, episodeBasePath, navigate,
  // CTF props no longer used — FORGE replaced by SYNAPSE
  gctf: _gctf, setUserXp: _setUserXp, showToast: _showToast,
  dataStatus: _ds, apiError: _ae, submitFlag: _sf,
  toggleCTFHint: _tch, shake: _sk, flagInputRef: _fir,
  chalStats: _cs, currentUserId: _cui,
}) => (
  <div className="ml-page">
    <div className="ml-hdr">
      <button type="button" className="ml-back" onClick={() => navigate('/series')}>
        ← BACK TO SERIES
      </button>
      <div className="ml-hdr-meta">
        <span className="ml-domain-tag">{arc?.domain ?? 'MACHINE LEARNING'}</span>
        <span className="ml-ep-ref">// {arc?.arcName} · EPISODE {episode?.n}</span>
      </div>
      <h1 className="ml-title">
        {episode?.title ?? 'MACHINE LEARNING'}
        <em className="ml-title-em">_</em>
      </h1>
      <p className="ml-subtitle">{episode?.description}</p>
      <div className="ml-pills">
        <span className="ml-pill ml-pill-xp">⚡ {episode?.xp} XP</span>
        <span className="ml-pill">⏱ ~{episode?.min} MIN</span>
        {challenges.length > 0 && <span className="ml-pill ml-pill-c">{challenges.length} CHALLENGES</span>}
        <span className="ml-pill ml-pill-status">
          {episode?.done ? '✓ COMPLETED' : episode?.active ? '● ACTIVE' : 'AVAILABLE'}
        </span>
      </div>
    </div>

    <div className="ml-tabs">
      <button type="button"
        className={`ml-tab ${tab === 'brief' ? 'ml-tab-on' : ''}`}
        onClick={() => navigate(episodeBasePath)}
      >
        SIGNAL
      </button>
      <button type="button"
        className={`ml-tab ${tab === 'res' ? 'ml-tab-on' : ''}`}
        onClick={() => navigate(`${episodeBasePath}/resources`)}
      >
        PLAYGROUND
      </button>
      <button type="button"
        className={`ml-tab ${tab === 'ctf' ? 'ml-tab-on' : ''}`}
        onClick={() => navigate(`${episodeBasePath}/ctf`)}
      >
        SYNAPSE
      </button>
    </div>

    <div className="ml-content">
      {tab === 'brief' && <MLSignal arc={arc} />}
      {tab === 'res'   && <MLPlayground />}
      {tab === 'ctf'   && <MLSynapse />}
    </div>
  </div>
);
