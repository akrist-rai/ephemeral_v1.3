import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip } from './MLShared';

// ── Pre-loaded network + training example ──────────────────────────────────────
// Architecture: x1, x2 → [w1,w2,bh] → h → [v,bo] → ŷ  (all sigmoid)
// Initial weights: w1=0.50, w2=−0.30, bh=0.10, v=0.80, bo=−0.40
// Training example: x1=1, x2=0 → y=1
//
// Forward pass (pre-computed):
//   zh   = 0.50·1 + (−0.30)·0 + 0.10 = 0.600
//   h    = σ(0.600) = 0.646
//   zo   = 0.80·0.646 + (−0.40) = 0.117
//   ŷ    = σ(0.117) = 0.529
//   L    = ½·(1−0.529)² = 0.111
//
// Backward pass (pre-computed):
//   ∂L/∂zo  = (0.529−1)·0.529·0.471 = −0.117
//   ∂L/∂v   = −0.117·0.646 = −0.076
//   ∂L/∂bo  = −0.117
//   ∂L/∂h   = −0.117·0.80 = −0.094
//   ∂L/∂zh  = −0.094·0.646·0.354 = −0.022
//   ∂L/∂w1  = −0.022·1 = −0.022
//   ∂L/∂w2  = −0.022·0 = 0.000  ← x2=0 → no gradient
//   ∂L/∂bh  = −0.022
//
// After one step (η=1):
//   w1=0.522, w2=−0.300, bh=0.122, v=0.876, bo=−0.283 → L=0.091

const STEPS = [
  {
    id: 'fwd',
    badge: 'STEP 1 / 5',
    title: 'FORWARD PASS',
    desc: 'Compute activations from input to output. Each neuron: weighted sum → bias → sigmoid. Nothing is learned yet — this is pure prediction.',
    math: [
      ['z_h', '= w₁·x₁ + w₂·x₂ + b_h', '= 0.50·1 + (−0.30)·0 + 0.10 = 0.600'],
      ['h',   '= σ(z_h)',               '= σ(0.600) = 0.646'],
      ['z_o', '= v·h + b_o',            '= 0.80·0.646 + (−0.40) = 0.117'],
      ['ŷ',   '= σ(z_o)',               '= σ(0.117) = 0.529'],
    ],
    svgPhase: 'fwd' as const,
  },
  {
    id: 'loss',
    badge: 'STEP 2 / 5',
    title: 'COMPUTE LOSS',
    desc: 'Mean squared error: how wrong is our prediction? Its derivative tells us the direction to correct — negative means we need to push ŷ higher.',
    math: [
      ['L',        '= ½·(y − ŷ)²', '= ½·(1 − 0.529)² = 0.111'],
      ['∂L/∂ŷ',   '= ŷ − y',      '= 0.529 − 1.000 = −0.471  ← push output UP'],
    ],
    svgPhase: 'loss' as const,
  },
  {
    id: 'back_o',
    badge: 'STEP 3 / 5',
    title: 'OUTPUT LAYER GRADIENTS',
    desc: 'Chain rule: multiply the output error by σ′(z_o) = ŷ·(1−ŷ). This gives ∂L/∂z_o, which then splits into the output weight and bias gradients.',
    math: [
      ['∂L/∂z_o', '= (ŷ−y)·ŷ·(1−ŷ)', '= −0.471 · 0.529 · 0.471 = −0.117'],
      ['∂L/∂v',   '= ∂L/∂z_o · h',    '= −0.117 · 0.646 = −0.076'],
      ['∂L/∂b_o', '= ∂L/∂z_o',        '= −0.117'],
    ],
    svgPhase: 'back_o' as const,
  },
  {
    id: 'back_h',
    badge: 'STEP 4 / 5',
    title: 'HIDDEN LAYER GRADIENTS',
    desc: 'The gradient passes through v and σ′(z_h) to reach the input weights. Note: ∂L/∂w₂ = 0 because x₂ = 0 — a silent input contributes no gradient.',
    math: [
      ['∂L/∂h',   '= ∂L/∂z_o · v',        '= −0.117 · 0.800 = −0.094'],
      ['∂L/∂z_h', '= ∂L/∂h · h·(1−h)',    '= −0.094 · 0.646 · 0.354 = −0.022'],
      ['∂L/∂w₁',  '= ∂L/∂z_h · x₁',      '= −0.022 · 1 = −0.022'],
      ['∂L/∂w₂',  '= ∂L/∂z_h · x₂',      '= −0.022 · 0 = 0.000   ← x₂=0, no update'],
      ['∂L/∂b_h', '= ∂L/∂z_h',            '= −0.022'],
    ],
    svgPhase: 'back_h' as const,
  },
  {
    id: 'update',
    badge: 'STEP 5 / 5',
    title: 'WEIGHT UPDATE (η = 1)',
    desc: 'Subtract gradient × learning rate from each weight. Negative gradients increase the weight — the network becomes slightly more correct. Loss drops 18%.',
    math: [
      ['w₁',  '= 0.500 − (−0.022)', '= 0.522  ↑'],
      ['w₂',  '= −0.300 − 0.000',   '= −0.300  (no change — x₂=0)'],
      ['b_h', '= 0.100 − (−0.022)', '= 0.122  ↑'],
      ['v',   '= 0.800 − (−0.076)', '= 0.876  ↑'],
      ['b_o', '= −0.400 − (−0.117)','= −0.283  ↑'],
      ['L',   '(new)',               '= 0.091  ↓ from 0.111  (−18%)'],
    ],
    svgPhase: 'update' as const,
  },
] as const;

type Phase = (typeof STEPS)[number]['svgPhase'];

// ── Backprop SVG ───────────────────────────────────────────────────────────────
// Network: 2 inputs → 1 hidden (r=36) → 1 output (r=28)
// Positions: In1(80,130), In2(80,220), H(370,175), Out(640,175)
const BackpropSVG: React.FC<{ phase: Phase }> = ({ phase }) => {
  const showFwd    = phase === 'fwd' || phase === 'loss' || phase === 'update';
  const showBackO  = phase === 'back_o' || phase === 'update';
  const showBackH  = phase === 'back_h' || phase === 'update';

  // Edge classes
  function fwdCls(lit: boolean) {
    return `nn-e nn-e-p wire-md ${lit ? 'nn-e-fire' : ''}`;
  }
  function bwdCls(nonZero: boolean) {
    return `nn-e wire-md ${nonZero ? 'nn-e-bwd' : 'nn-e-bwd-zero'}`;
  }

  // Node highlight
  function hCls(lit: boolean) { return `nn-nd nn-nd-h ${lit ? 'nn-hi' : ''}`; }
  function oCls(lit: boolean) { return `nn-nd nn-nd-o ${lit ? 'nn-hi' : ''}`; }

  return (
    <svg viewBox="0 0 740 310" className="nn-svg">
      {/* Layer labels */}
      <text x={80}  y={34} className="nn-lbl" textAnchor="middle">INPUTS</text>
      <text x={370} y={34} className="nn-lbl" textAnchor="middle">HIDDEN</text>
      <text x={640} y={34} className="nn-lbl" textAnchor="middle">OUTPUT</text>

      {/* Forward edges In→H */}
      <line x1={104} y1={130} x2={334} y2={168} className={fwdCls(showFwd)} />
      <line x1={104} y1={220} x2={334} y2={182} className={fwdCls(showFwd)} />

      {/* Forward edge H→Out */}
      <line x1={406} y1={175} x2={612} y2={175} className={fwdCls(showFwd)} />

      {/* Backward edges (overlay, dashed feel via class) */}
      {showBackO && (
        <line x1={612} y1={172} x2={406} y2={172} className={bwdCls(true)} />
      )}
      {showBackH && (
        <>
          <line x1={334} y1={165} x2={104} y2={127} className={bwdCls(true)} />
          <line x1={334} y1={179} x2={104} y2={217} className={bwdCls(false)} />
        </>
      )}

      {/* Weight labels (forward) */}
      <text x={210} y={137} className="nn-wlbl" textAnchor="middle">
        {phase === 'update' ? 'w₁=0.522' : 'w₁=0.500'}
      </text>
      <text x={210} y={230} className="nn-wlbl" textAnchor="middle">
        {phase === 'update' ? 'w₂=−0.300' : 'w₂=−0.300'}
      </text>
      <text x={509} y={163} className="nn-wlbl" textAnchor="middle">
        {phase === 'update' ? 'v=0.876' : 'v=0.800'}
      </text>

      {/* Gradient labels (backward) */}
      {showBackO && (
        <text x={509} y={185} className="nn-grad-lbl" textAnchor="middle">∂L/∂z_o=−0.117</text>
      )}
      {showBackH && (
        <>
          <text x={210} y={147} className="nn-grad-lbl" textAnchor="middle">∂L/∂w₁=−0.022</text>
          <text x={210} y={216} className="nn-grad-lbl nn-grad-lbl-zero" textAnchor="middle">∂L/∂w₂=0.000</text>
        </>
      )}

      {/* Input nodes */}
      {[{y: 130, label: 'x₁=1'}, {y: 220, label: 'x₂=0'}].map((nd, i) => (
        <g key={i}>
          <circle cx={80} cy={nd.y} r={24}
            className={`nn-nd nn-nd-i ${showFwd && i === 0 ? 'nn-hi' : ''}`} />
          <text x={80} y={nd.y + 1} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
            {nd.label}
          </text>
          <text x={80} y={nd.y + 37} textAnchor="middle" className="nn-ns">x{i + 1}</text>
        </g>
      ))}

      {/* Hidden node */}
      <circle cx={370} cy={175} r={36} className={hCls(showFwd)} />
      <text x={370} y={170} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
        {phase === 'fwd' || phase === 'loss' ? '0.646' : phase === 'back_h' || phase === 'back_o' ? '∂=−0.094' : 'h'}
      </text>
      <text x={370} y={188} textAnchor="middle" dominantBaseline="middle" className="nn-ns">
        {phase === 'fwd' || phase === 'loss' ? 'z_h=0.600' : phase === 'update' ? 'bh=0.122' : ''}
      </text>

      {/* Output node */}
      <circle cx={640} cy={175} r={28} className={oCls(phase === 'fwd' || phase === 'loss' || phase === 'update')} />
      <text x={640} y={170} textAnchor="middle" dominantBaseline="middle" className="nn-nv">
        {phase === 'loss' || phase === 'back_o' ? '−0.471' : phase === 'update' ? '0.572' : '0.529'}
      </text>
      <text x={640} y={187} textAnchor="middle" dominantBaseline="middle" className="nn-ns">
        {phase === 'loss' ? 'L=0.111' : phase === 'back_o' ? '∂L/∂z_o' : phase === 'update' ? 'L=0.091' : 'ŷ'}
      </text>
      <text x={640} y={218} textAnchor="middle" className="nn-ns">OUTPUT</text>

      {/* Target label */}
      <text x={680} y={130} className="nn-lbl" textAnchor="middle">TARGET</text>
      <text x={680} y={152} className="nn-target-val" textAnchor="middle">y=1</text>
    </svg>
  );
};

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S1E3Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// ENGINE · S1E3 · {episode?.title ?? 'BACKPROPAGATION'}</div>
      <h2 className="ml-mani-h">
        Error propagates backward.
        <br />
        <em className="ml-mani-em">Every weight adjusts by how much it was wrong.</em>
      </h2>
      <p className="ml-mani-p">
        Dr. Tenma's guilt moved backward through every decision he ever made — each choice's
        consequence flowing back to reshape how he understood the ones before it.
        Backpropagation works identically: the loss at the output ripples backward through every
        weight, each one adjusted by exactly its share of the blame. This is the chain rule
        applied mechanically, millions of times per second.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">THE CHAIN RULE</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ep-stub-concepts">
      {[
        {
          tag: 'CORE IDEA',
          text: '∂L/∂w = (∂L/∂ŷ)·(∂ŷ/∂z)·(∂z/∂w). Each term is a local derivative computed at that layer. Multiply them together and you have the full gradient flowing from the loss all the way back to the weight.',
        },
        {
          tag: 'THE DELTA',
          text: 'Define δ = ∂L/∂z (the "pre-activation gradient"). For the output: δ_o = (ŷ−y)·ŷ·(1−ŷ). For each hidden layer: δ_h = (δ_o · W_out) · h·(1−h). Chain them backward, layer by layer.',
        },
        {
          tag: 'WEIGHT GRADIENT',
          text: '∂L/∂w_ij = δ_j · x_i. The gradient of any weight equals the delta at the downstream neuron times the input activation. If the input was zero, the gradient is zero — silent inputs get no update.',
        },
        {
          tag: 'GRADIENT DESCENT',
          text: 'w ← w − η·(∂L/∂w). Learning rate η controls step size. Too large: oscillates past the minimum. Too small: never converges. Most real training uses adaptive rates (Adam, RMSProp) instead.',
        },
      ].map(c => (
        <div key={c.tag} className="ep-stub-concept">
          <span className="ep-stub-c-tag">{c.tag}</span>
          <span className="ep-stub-c-text">{c.text}</span>
        </div>
      ))}
    </div>

    <div className="ml-sec-hdr ml-sec-hdr-spaced">
      <span className="ml-sec-id">02</span>
      <span className="ml-sec-ttl">THE VANISHING GRADIENT PROBLEM</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-formula-block">
      <div className="s1e1-formula-line">
        <span className="s1e1-fo">σ′(z)&nbsp;=&nbsp;</span>
        <span className="s1e1-fv">σ(z)·(1−σ(z))</span>
        <span className="s1e1-fo">&nbsp;≤&nbsp;</span>
        <span className="s1e1-fv">0.25</span>
        <span className="s1e1-fo">&nbsp;always</span>
      </div>
      <div className="s1e1-worked">
        <div className="s1e1-worked-title">GRADIENT AFTER EACH SIGMOID LAYER (starting from 1.0):</div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Layer 5</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">1.000 × 0.25</span>
          <span className="s1e1-wr-res s1e1-wr-1">= 0.250</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Layer 4</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">0.250 × 0.25</span>
          <span className="s1e1-wr-res s1e1-wr-1">= 0.063</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Layer 3</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">0.063 × 0.25</span>
          <span className="s1e1-wr-res s1e1-wr-0">= 0.016</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Layer 2</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">0.016 × 0.25</span>
          <span className="s1e1-wr-res s1e1-wr-0">= 0.004</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Layer 1</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">0.004 × 0.25</span>
          <span className="s1e1-wr-res s1e1-wr-0">= 0.001  ← effectively zero</span>
        </div>
      </div>
    </div>
    <div className="s1e1-limit-box s1e1-limit-box-mt">
      <div className="s1e1-limit-title">ReLU: max(0, z) — the fix</div>
      <p className="s1e1-limit-body">
        ReLU's derivative is exactly 1 for all z {'>'} 0, and 0 otherwise. The gradient passes
        through unchanged — no multiplication by a fraction less than 1. Deep networks became
        trainable. It was that simple.
      </p>
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Step through the full backprop calculation in Playground — one computation at a time</span>
        <span>Notice: ∂L/∂w₂ = 0 because x₂ = 0. Silent inputs get no gradient</span>
        <span>Switch sigmoid → ReLU in Synapse — see the gradient bars stay full</span>
        <span>Understand why deep networks needed ReLU to train at all</span>
      </div>
    </div>
  </div>
);

// ── PLAYGROUND ─────────────────────────────────────────────────────────────────
const PG_NOTES = [
  { id: 'a', text: 'Step 4 shows ∂L/∂w₂ = 0. x₂ = 0 in our training example, so the weight receives no gradient — it cannot learn from inputs it never sees.' },
  { id: 'b', text: 'The gradient at the hidden layer is much smaller than at the output. Multiply by v=0.8 then by σ′(h)≈0.229. This is chain-rule shrinkage in action.' },
  { id: 'c', text: 'Learning rate η=1 is extremely large. In practice, η=0.001–0.01. Here it is 1 to make the weight changes large enough to see clearly.' },
  { id: 'd', text: 'One gradient step moves us from L=0.111 to L=0.091 — an 18% drop. Real training repeats this over thousands of examples and thousands of steps.' },
];

export const S1E3Playground: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Backpropagation — Step by Step</div>
        <p className="pg-intro-body">
          Pre-loaded: a 2→1→1 sigmoid network, training example x₁=1, x₂=0, target y=1.
          Step through all 5 phases of one backprop iteration — every number pre-computed,
          every formula shown. Click NEXT to advance.
        </p>
      </div>

      {/* Step progress dots */}
      <div className="bp-step-nav">
        {STEPS.map((s, i) => (
          <div key={s.id} className="bp-step-pip">
            <div
              className={`bp-pip-dot ${i < stepIdx ? 'bp-pip-done' : i === stepIdx ? 'bp-pip-active' : ''}`}
              onClick={() => setStepIdx(i)}
              title={s.title}
            />
            {i < STEPS.length - 1 && (
              <div className={`bp-pip-connector ${i < stepIdx ? 'bp-pip-connector-done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* SVG network */}
      <div className="nn-stage nn-stage-mb">
        <BackpropSVG phase={step.svgPhase} />
      </div>

      {/* Current step content */}
      <div className="bp-step-card">
        <div className="bp-step-header">
          <span className="bp-step-badge">{step.badge}</span>
          <span className="bp-step-title">{step.title}</span>
        </div>
        <p className="bp-step-desc">{step.desc}</p>
        <div className="bp-math-block">
          {step.math.map(([lbl, eq, val]) => (
            <div key={lbl} className="bp-math-row">
              <span className="bp-math-lbl">{lbl}</span>
              <span className="bp-math-eq">{eq}</span>
              <span className="bp-math-val">
                {val.includes('←') || val.includes('↑') || val.includes('↓') || val.includes('no') ? (
                  <em>{val}</em>
                ) : val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="bp-nav-row">
        <button
          type="button" className="bp-nav-btn"
          onClick={() => setStepIdx(i => i - 1)}
          disabled={stepIdx === 0}
        >
          ← PREV
        </button>
        <span className="bp-step-counter">{stepIdx + 1} / {STEPS.length}</span>
        <button
          type="button" className={`bp-nav-btn ${stepIdx < STEPS.length - 1 ? 'bp-nav-next' : ''}`}
          onClick={() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1))}
          disabled={stepIdx === STEPS.length - 1}
        >
          NEXT →
        </button>
      </div>

      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE — Vanishing Gradient Visualizer ────────────────────────────────────
const LAYERS = ['Layer 1 (input)', 'Layer 2', 'Layer 3', 'Layer 4', 'Layer 5 (output)'];

const SIGMOID_GRADS = [0.004, 0.016, 0.063, 0.250, 1.000];
const RELU_GRADS    = [1.000, 1.000, 1.000, 1.000, 1.000];

const SYN_NOTES = [
  { id: 'a', text: 'With sigmoid, each layer multiplies the gradient by at most 0.25. Five layers: 0.25⁵ ≈ 0.001. The first layer receives one-thousandth of the original signal.' },
  { id: 'b', text: 'With ReLU, the derivative is 1 everywhere the neuron is active. The gradient passes through unchanged — no shrinkage, no vanishing.' },
  { id: 'c', text: '"Dead ReLU" is the opposite problem: if a ReLU neuron never activates, its gradient is always 0 and it never updates. Leaky ReLU (slope 0.01 for z<0) partially addresses this.' },
  { id: 'd', text: 'Vanishing gradients are why deep learning stagnated until ~2012. ReLU, along with better weight initialization and GPUs, unlocked the deep learning era.' },
];

export const S1E3Synapse: React.FC = () => {
  const [useReLU, setUseReLU] = useState(false);
  const grads = useReLU ? RELU_GRADS : SIGMOID_GRADS;

  return (
    <div className="ml-synapse">
      <div className="syn-intro vg-intro">
        <div className="syn-intro-lead">Synapse · Vanishing Gradients</div>
        <p className="syn-intro-body">
          Pre-loaded: a 5-layer sigmoid network. The bar chart shows how the gradient magnitude
          shrinks with each backward step through a sigmoid activation. Toggle to ReLU and watch
          the gradient bars stay full — this is why deep learning is possible at all.
        </p>
      </div>

      {/* Activation toggle */}
      <div className="vg-toggle-row">
        <span className="vg-toggle-label">ACTIVATION:</span>
        <button
          type="button"
          className={`vg-toggle-btn vg-sigmoid ${!useReLU ? 'vg-toggle-btn-on' : ''}`}
          onClick={() => setUseReLU(false)}
        >
          SIGMOID
        </button>
        <button
          type="button"
          className={`vg-toggle-btn vg-relu ${useReLU ? 'vg-toggle-btn-on' : ''}`}
          onClick={() => setUseReLU(true)}
        >
          ReLU
        </button>
      </div>

      {/* Gradient bar chart */}
      <div className="vg-chart">
        <div className="vg-chart-title">
          GRADIENT MAGNITUDE AT EACH LAYER — BACKPROPAGATING FROM OUTPUT
        </div>
        {[...LAYERS].reverse().map((lbl, revIdx) => {
          const idx = LAYERS.length - 1 - revIdx;
          const g = grads[idx];
          const pct = g * 100;
          return (
            <div key={lbl} className="vg-row">
              <span className="vg-row-label">{lbl}</span>
              <div className="vg-bar-track">
                <div
                  className={`vg-bar-fill ${useReLU ? 'vg-bar-fill-relu' : 'vg-bar-fill-sig'}`}
                  style={{ '--bar-w': `${pct}%` } as React.CSSProperties}
                />
              </div>
              <span className={`vg-bar-value ${useReLU ? 'vg-bar-value-relu' : 'vg-bar-value-sig'}`}>
                {g.toFixed(3)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Key insight */}
      <div className="vg-insight">
        <div className="vg-insight-title">
          {useReLU ? 'WHY ReLU WORKS' : 'THE VANISHING GRADIENT CRISIS'}
        </div>
        <p className="vg-insight-body">
          {useReLU
            ? "ReLU's derivative is 1 for every active neuron. The gradient travels through each layer unchanged. Layer 1 receives the same signal as Layer 5. Deep networks can learn all the way through."
            : "σ′(z) = σ(z)·(1−σ(z)) ≤ 0.25 always. After 5 layers, the gradient shrinks to 0.004. Early layers receive a signal 250× weaker than the output. They barely update. They barely learn. This is why networks deeper than 3-4 layers couldn't be trained before 2012."}
        </p>
      </div>

      <AwareStrip notes={SYN_NOTES} />
    </div>
  );
};
