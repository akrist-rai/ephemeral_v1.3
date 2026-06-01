import React, { useState } from 'react';
import { CTFComponent } from '../Challenge/CTFComponent';
import type { DomainPageProps } from './types';

// ── Static content ─────────────────────────────────────────────────────────────

const ML_APPS = [
  {
    name: 'ChatGPT / GPT-4',
    tag: 'NLP',
    icon: '⟨/⟩',
    col: '#10b981',
    stat: '100M users in 60 days',
    desc: 'Transformer models that understand, translate and generate human language — they passed the bar exam, the medical licensing exam, and write code that ships to production.',
  },
  {
    name: 'Stable Diffusion',
    tag: 'VISION',
    icon: '◈',
    col: '#8b5cf6',
    stat: '2B+ images generated',
    desc: 'Diffusion models learn to reverse controlled noise and generate photorealistic images from text. They can paint "a samurai in the style of Hiroshige, cinematic lighting."',
  },
  {
    name: 'AlphaFold 3',
    tag: 'BIOLOGY',
    icon: '⊕',
    col: '#06b6d4',
    stat: '200M proteins solved',
    desc: 'Deep learning cracked protein folding — a 50-year biology grand challenge that stumped entire research fields. It earned a Nobel Prize in Chemistry in 2024.',
  },
  {
    name: 'Tesla FSD',
    tag: 'ROBOTICS',
    icon: '◉',
    col: '#f59e0b',
    stat: '1B autonomous miles driven',
    desc: 'Vision transformers process 8 camera feeds in real-time, navigating traffic, rain, construction zones, and erratic pedestrians — all inferred from raw pixels.',
  },
  {
    name: 'AlphaGo / MuZero',
    tag: 'STRATEGY',
    icon: '⬡',
    col: '#ef4444',
    stat: '4-1 vs. Lee Sedol',
    desc: 'Reinforcement learning mastered Go — a game with more board positions than atoms in the observable universe. No human beats it. It taught itself by playing itself.',
  },
  {
    name: 'GitHub Copilot',
    tag: 'CODE',
    icon: '{ }',
    col: '#00c85a',
    stat: '55% of new code is AI-assisted',
    desc: 'Large language models trained on billions of lines of code understand programmer intent and complete entire algorithms, tests, and systems from comments alone.',
  },
];

const EPISODE_PATH = [
  { id: 'S1E1', short: 'The First Neuron',            concept: 'McCulloch-Pitts Perceptron',         phase: 'GENESIS'      },
  { id: 'S1E2', short: 'Why Layers Exist',             concept: 'MLP + XOR Problem',                  phase: 'DEPTH'        },
  { id: 'S1E3', short: 'Learning by Error',            concept: 'Backpropagation + Gradient Descent', phase: 'ENGINE'       },
  { id: 'S2E1', short: 'Attention Changes Everything', concept: 'Scaled Dot-Product Attention',        phase: 'REVOLUTION'   },
  { id: 'S2E2', short: 'The Transformer',              concept: 'Multi-Head Attention + Encoding',    phase: 'ARCHITECTURE' },
  { id: 'S2E3', short: 'Ruhenheim',                    concept: 'Vision Transformers (ViT)',           phase: 'FRONTIER'     },
];

const ABILITY_CARDS = [
  'Build image classifiers from scratch',
  'Implement backpropagation by hand',
  'Understand how attention works in Transformers',
  'Read ML research papers with confidence',
  'Train models on real datasets',
  'Explain how ChatGPT works at a technical level',
];

const CONCEPTS = [
  {
    id: 'neuron',
    label: '01 // WHAT IS A NEURON?',
    short: 'The fundamental unit. Takes inputs, multiplies by learned weights, applies a threshold.',
    full: `A neuron computes exactly one thing:

  output = σ( w₁·x₁ + w₂·x₂ + ... + wₙ·xₙ + b )

  • xᵢ  = inputs from the previous layer (or raw input data)
  • wᵢ  = weights — numbers the network learns during training
  • b   = bias — shifts the neuron's activation threshold
  • σ   = activation function (sigmoid, ReLU, tanh...)

When the weighted sum exceeds the threshold, the neuron "fires" and passes a strong signal to the next layer. This mirrors biological neurons, but simplified to pure mathematics.

Every ChatGPT response comes from ~100 billion of these units. Each does this one computation, in parallel, in milliseconds.`,
  },
  {
    id: 'weights',
    label: '02 // WHAT ARE WEIGHTS (THE LINES)?',
    short: 'Each connection carries a learned number. Bigger = stronger influence between neurons.',
    full: `The lines between neurons are weights. Each line carries exactly one number, learned during training.

  Bright green line    → strong positive influence (A amplifies B)
  Dim purple line      → negative influence (A suppresses B)
  Nearly invisible     → irrelevant connection (weight ≈ 0)

In our XOR network, the AND neuron (H2) connects to the output with weight = −20.
The network learned: "if BOTH inputs are 1, actively REDUCE the prediction." That's how it solves XOR.

A GPT-4-scale model has ~1.8 trillion weights. Every response is the result of
1.8 trillion multiplications happening simultaneously, in under a second.`,
  },
  {
    id: 'activation',
    label: '03 // WHY ACTIVATION FUNCTIONS?',
    short: 'Without them, stacking 100 layers is mathematically identical to stacking 1.',
    full: `Without non-linear activation functions, a 100-layer network collapses into a single matrix
multiplication. You can prove this mathematically — stacking linear transforms gives one linear transform.
Layers become meaningless.

Activation functions break this by introducing non-linearity:

  Sigmoid: σ(x) = 1 / (1 + e⁻ˣ)     output ∈ [0, 1]
  → Smooth probability output. Problem: causes "vanishing gradients" in deep networks (S1E3)

  ReLU:    f(x) = max(0, x)           output ≥ 0
  → Fast, simple — solved vanishing gradients, scaled deep learning to hundreds of layers

  Tanh:    tanh(x)                    output ∈ [−1, 1]
  → Like sigmoid but centered at zero, better for hidden layers in some architectures

The XOR problem requires curved decision boundaries. No linear function can separate XOR —
which is exactly why we need hidden layers with non-linear activation functions.`,
  },
  {
    id: 'forward',
    label: '04 // WHAT IS A FORWARD PASS?',
    short: 'One trip through the network from input to output — one prediction.',
    full: `A forward pass is what you just ran in the playground:

  1. Input values enter the network (x₁, x₂)
  2. Each hidden neuron computes: activation = σ(Σ wᵢxᵢ + b)
  3. Hidden activations become inputs to the output layer
  4. Output layer produces the final prediction ŷ

One forward pass = one prediction.

Training repeats this millions of times:
  1. Forward pass → prediction ŷ
  2. Compare ŷ to ground truth y → compute loss (how wrong are we?)
  3. Backpropagation → trace which weights contributed to the error
  4. Gradient descent → nudge each weight a tiny step in the right direction
  5. Repeat until loss approaches zero

When you use ChatGPT, it only runs forward passes — inference.
The learning happened before deployment, across thousands of GPUs, over weeks.`,
  },
];

// ── Pre-trained XOR network (2 → 3 → 1, sigmoid) ──────────────────────────────
// h0 ≈ OR gate, h1 ≈ AND gate, h2 ≈ auxiliary
const W1 = [[20, 20], [20, 20], [-5, 5]];
const B1 = [-10, -30, 0];
const W2 = [[20], [-20], [0]];
const B2 = [-10];

function sig(x: number) { return 1 / (1 + Math.exp(-x)); }

interface NNResult { h: number[]; out: number }

function xorForward(a: number, b: number): NNResult {
  const h = W1.map((row, i) => sig(row[0] * a + row[1] * b + B1[i]));
  const out = sig(W2.reduce((s, w, i) => s + w[0] * h[i], 0) + B2[0]);
  return { h, out };
}

// ── SVG node positions ─────────────────────────────────────────────────────────
const NP = {
  inp: [{ x: 88,  y: 150 }, { x: 88,  y: 240 }],
  hid: [{ x: 380, y: 110 }, { x: 380, y: 195 }, { x: 380, y: 280 }],
  out: [{ x: 665, y: 195 }],
};

// ── Neural network SVG ─────────────────────────────────────────────────────────
const NNViz: React.FC<{ result: NNResult | null; inp: [number, number]; svgKey: number }> = ({ result, inp, svgKey }) => {
  const hn  = result?.h   ?? [];
  const out = result?.out ?? -1;
  const hidLabels = ['OR', 'AND', 'MIX'];

  function nCls(a: number, base: string) {
    if (a < 0) return base;
    return `${base} ${a > 0.5 ? 'nn-hi' : 'nn-lo'}`;
  }

  return (
    <svg key={svgKey} viewBox="0 0 750 385" className="nn-svg">
      <text x={88}  y={46} className="nn-lbl" textAnchor="middle">INPUT</text>
      <text x={380} y={46} className="nn-lbl" textAnchor="middle">HIDDEN LAYER</text>
      <text x={665} y={46} className="nn-lbl" textAnchor="middle">OUTPUT</text>

      {NP.inp.map((ip, ii) =>
        NP.hid.map((hp, hi) => {
          const w = W1[hi][ii];
          return (
            <line key={`ih-${ii}-${hi}`}
              x1={ip.x + 25} y1={ip.y} x2={hp.x - 25} y2={hp.y}
              className={`nn-e ${w > 0 ? 'nn-e-p' : 'nn-e-n'} ${result ? 'nn-e-fire' : ''}`}
            />
          );
        })
      )}

      {NP.hid.map((hp, hi) =>
        NP.out.map((op) => {
          const w = W2[hi][0];
          return (
            <line key={`ho-${hi}`}
              x1={hp.x + 25} y1={hp.y} x2={op.x - 30} y2={op.y}
              className={`nn-e ${w > 0 ? 'nn-e-p' : w < 0 ? 'nn-e-n' : 'nn-e-z'} ${result ? 'nn-e-fire nn-e-fire2' : ''}`}
            />
          );
        })
      )}

      {NP.inp.map((p, i) => (
        <g key={`ni-${i}`}>
          <circle cx={p.x} cy={p.y} r={25} className={nCls(result ? inp[i] : -1, 'nn-nd nn-nd-i')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? inp[i] : `x${i + 1}`}
          </text>
          <text x={p.x} y={p.y + 40} textAnchor="middle" className="nn-ns">IN{i + 1}</text>
        </g>
      ))}

      {NP.hid.map((p, i) => (
        <g key={`nh-${i}`}>
          <circle cx={p.x} cy={p.y} r={25} className={nCls(hn[i] ?? -1, 'nn-nd nn-nd-h')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? hn[i].toFixed(2) : hidLabels[i]}
          </text>
          <text x={p.x} y={p.y + 40} textAnchor="middle" className="nn-ns">H{i + 1}</text>
        </g>
      ))}

      {NP.out.map((p) => (
        <g key="no">
          <circle cx={p.x} cy={p.y} r={29} className={nCls(out, 'nn-nd nn-nd-o')} />
          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {result ? out.toFixed(3) : 'ŷ'}
          </text>
          <text x={p.x} y={p.y + 44} textAnchor="middle" className="nn-ns">OUTPUT</text>
          {result && (
            <text x={p.x} y={p.y - 48} textAnchor="middle"
              className={`nn-verdict ${out > 0.5 ? 'nn-verdict-1' : 'nn-verdict-0'}`}>
              PREDICTS {out > 0.5 ? '1 — TRUE' : '0 — FALSE'}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

// ── Concept accordion ──────────────────────────────────────────────────────────
const ConceptPanel: React.FC<{ c: typeof CONCEPTS[0] }> = ({ c }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ml-concept ${open ? 'ml-concept-open' : ''}`}>
      <button type="button" className="ml-concept-hd" onClick={() => setOpen(!open)}>
        <span className="ml-concept-lbl">{c.label}</span>
        <span className="ml-concept-short">{c.short}</span>
        <span className="ml-concept-arr">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="ml-concept-body">
          <pre className="ml-concept-pre">{c.full}</pre>
        </div>
      )}
    </div>
  );
};

// ── SIGNAL tab ─────────────────────────────────────────────────────────────────
const MLSignal: React.FC<{ episode: DomainPageProps['episode']; arc: DomainPageProps['arc'] }> = ({ arc }) => (
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
        is there. The calculus you already know will appear naturally, not as abstract theory, but as
        the mechanism that makes learning possible.
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
        {ABILITY_CARDS.map(s => <span key={s}>{s}</span>)}
      </div>
    </div>
  </div>
);

// ── PLAYGROUND tab ─────────────────────────────────────────────────────────────
const XOR_INPUTS: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const XOR_EXPECTED = [0, 1, 1, 0];

const MLPlayground: React.FC = () => {
  const [selectedInp, setSelectedInp] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<NNResult | null>(null);
  const [svgKey, setSvgKey] = useState(0);
  const [history, setHistory] = useState<{ inp: [number, number]; out: number }[]>([]);

  const run = () => {
    if (!selectedInp) return;
    const res = xorForward(selectedInp[0], selectedInp[1]);
    setResult(res);
    setSvgKey(k => k + 1);
    setHistory(prev => {
      const already = prev.some(x => x.inp[0] === selectedInp[0] && x.inp[1] === selectedInp[1]);
      return already ? prev : [...prev, { inp: selectedInp, out: res.out }];
    });
  };

  const selectInp = (inp: [number, number]) => {
    setSelectedInp(inp);
    setResult(null);
  };

  const expectedIdx = selectedInp
    ? XOR_INPUTS.findIndex(x => x[0] === selectedInp[0] && x[1] === selectedInp[1])
    : -1;

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Don't read about it. Use it first.</div>
        <p className="pg-intro-body">
          Below is a neural network that has already learned to solve the XOR problem — a task that
          stumped early AI researchers because no single-layer model could crack it. Select an input pair,
          fire the forward pass, and watch signals flow through the network. Then we'll explain every part.
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
          <div className="xor-note-title">Why it matters</div>
          <p className="xor-note-body">
            A single neuron can only separate data with a straight line. XOR outputs 1 when exactly
            one input is 1 — no straight line can do that. This is why hidden layers exist: networks
            need depth to draw curved, non-linear decision boundaries.
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
        <NNViz result={result} inp={selectedInp ?? [0, 0]} svgKey={svgKey} />
        {result && (
          <div className="nn-result-bar">
            <span className="nn-rb-label">raw output: {result.out.toFixed(5)}</span>
            <span className={`nn-rb-verdict ${result.out > 0.5 ? 'nn-rb-1' : 'nn-rb-0'}`}>
              {result.out > 0.5
                ? `→ rounds to 1 ✓  (expected ${expectedIdx >= 0 ? XOR_EXPECTED[expectedIdx] : '?'})`
                : `→ rounds to 0 ✓  (expected ${expectedIdx >= 0 ? XOR_EXPECTED[expectedIdx] : '?'})`
              }
            </span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="nn-history">
          <div className="nn-history-title">RESULTS SO FAR — RUN ALL 4 TO VERIFY:</div>
          <div className="nn-history-row">
            {XOR_INPUTS.map((inp, i) => {
              const found = history.find(x => x.inp[0] === inp[0] && x.inp[1] === inp[1]);
              return (
                <div key={i} className={`nn-hist-cell ${found ? 'nn-hist-ok' : 'nn-hist-empty'}`}>
                  <div className="nn-hist-in">[{inp[0]},{inp[1]}]</div>
                  <div className="nn-hist-out">{found ? found.out.toFixed(3) : '—'}</div>
                  <div className="nn-hist-exp">expected: {XOR_EXPECTED[i]}</div>
                </div>
              );
            })}
          </div>
          {history.length === 4 && (
            <div className="nn-history-done">
              ✓ Network correctly predicts all 4 XOR inputs. Now — open the panels below to understand why.
            </div>
          )}
        </div>
      )}

      <div className="ml-sec-hdr ml-sec-hdr-spaced">
        <span className="ml-sec-id">DISSECT</span>
        <span className="ml-sec-ttl">NOW LET'S UNDERSTAND EACH PART</span>
        <div className="ml-sec-line" />
      </div>
      <div className="ml-concepts">
        {CONCEPTS.map(c => <ConceptPanel key={c.id} c={c} />)}
      </div>
    </div>
  );
};

// ── Main export ────────────────────────────────────────────────────────────────
export const MachineLearningPage: React.FC<DomainPageProps> = ({
  arc, episode, challenges, tab, episodeBasePath, navigate,
  gctf, setUserXp, showToast, dataStatus, apiError,
  submitFlag, toggleCTFHint, shake, flagInputRef, chalStats, currentUserId,
}) => {
  return (
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
          {challenges.length > 0 && (
            <span className="ml-pill ml-pill-c">{challenges.length} CTF CHALLENGES</span>
          )}
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
          FORGE
        </button>
      </div>

      <div className="ml-content">
        {tab === 'brief' && <MLSignal episode={episode} arc={arc} />}
        {tab === 'res'   && <MLPlayground />}
        {tab === 'ctf'   && (
          <div className="ml-forge">
            <div className="ml-forge-hdr">
              <span className="ml-forge-label">// FORGE · PROVE YOUR UNDERSTANDING</span>
              <p className="ml-forge-desc">
                Apply what you've learned. These challenges test whether you can reason about neural
                networks under pressure — not just follow explanations.
              </p>
            </div>
            <CTFComponent
              gctf={gctf}
              setUserXp={setUserXp}
              showToast={showToast}
              challenges={challenges}
              navigate={navigate}
              dataStatus={dataStatus}
              apiError={apiError}
              submitFlag={submitFlag}
              toggleCTFHint={toggleCTFHint}
              shake={shake}
              flagInputRef={flagInputRef}
              episodeBasePath={episodeBasePath}
              chalStats={chalStats}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
