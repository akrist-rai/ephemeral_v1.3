import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip } from './MLShared';

// ── Pre-computed positional encodings ─────────────────────────────────────────
// Sentence: "Attention is all you need" (5 tokens, positions 0-4)
// d_model = 8 (8 encoding dimensions)
// PE(pos, 2i)   = sin(pos / 10000^(2i/8))
// PE(pos, 2i+1) = cos(pos / 10000^(2i/8))
//
// Wavelengths (one per dim pair):
//   dim 0,1: λ = 10000^(0/8) = 1.000   → sin/cos(pos × 1)
//   dim 2,3: λ = 10000^(2/8) = 3.162   → sin/cos(pos / 3.162)
//   dim 4,5: λ = 10000^(4/8) = 10.000  → sin/cos(pos / 10)
//   dim 6,7: λ = 10000^(6/8) = 31.623  → sin/cos(pos / 31.623)

const PE_TOKENS = ['Attention', 'is', 'all', 'you', 'need'];
const PE_DIMS   = ['sin₀', 'cos₀', 'sin₁', 'cos₁', 'sin₂', 'cos₂', 'sin₃', 'cos₃'];

const PE_VALS: number[][] = [
  // pos=0
  [ 0.000,  1.000,  0.000,  1.000,  0.000,  1.000,  0.000,  1.000],
  // pos=1
  [ 0.841,  0.540,  0.311,  0.950,  0.100,  0.995,  0.032,  0.999],
  // pos=2
  [ 0.909, -0.416,  0.589,  0.808,  0.199,  0.980,  0.063,  0.998],
  // pos=3
  [ 0.141, -0.990,  0.813,  0.582,  0.296,  0.955,  0.095,  0.995],
  // pos=4
  [-0.757, -0.654,  0.952,  0.307,  0.389,  0.921,  0.127,  0.992],
];

// Maps a PE value (-1 to +1) to a CSS band class
function peBand(v: number): string {
  const band = Math.min(9, Math.floor(Math.abs(v) * 10));
  return v >= 0 ? `pe-p${band}` : `pe-n${band}`;
}

// ── Pre-computed multi-head attention (2 heads, 3 tokens) ──────────────────────
// Tokens: ["the", "cat", "sat"], 4-dim embeddings, 2 heads (each 2-dim)
// Head 1 uses dims [0,1], Head 2 uses dims [2,3]
// All W projections = identity for clarity

const MHA_TOKENS = ['"the"', '"cat"', '"sat"'];

// Head 1: dims [0,1], X_h1 = [[1,0],[0,1],[0,0]]
const MHA_H1_SOFTMAX = [
  [0.54, 0.23, 0.23],
  [0.23, 0.54, 0.23],
  [0.33, 0.33, 0.33],
];
const MHA_H1_OUT = [[0.23, 0.54],[0.54, 0.23],[0.39, 0.39]];

// Head 2: dims [2,3], X_h2 = [[0,1],[1,1],[1,0]]
const MHA_H2_SOFTMAX = [
  [0.21, 0.58, 0.21],
  [0.20, 0.47, 0.33],
  [0.33, 0.47, 0.20],
];
const MHA_H2_OUT = [[0.79, 0.42],[0.60, 0.53],[0.47, 0.61]];

// Concatenated output [H1 || H2] (before final projection)
const MHA_CONCAT = [
  [0.23, 0.54, 0.79, 0.42],
  [0.54, 0.23, 0.60, 0.53],
  [0.39, 0.39, 0.47, 0.61],
];

const MHA_DIMS2 = ['d₀', 'd₁'];
const MHA_DIMS4 = ['d₀', 'd₁', 'd₂', 'd₃'];
const MHA_H_COLS = ['"the"', '"cat"', '"sat"'];

// ── Shared matrix component ────────────────────────────────────────────────────
const Matrix: React.FC<{
  lbl: string;
  data: number[][];
  rows: string[];
  cols: string[];
  accent?: 'green' | 'purple';
}> = ({ lbl, data, rows, cols, accent = 'green' }) => {
  const gCls = `syn-mat-grid syn-mat-g${cols.length}`;
  return (
    <div className="syn-mat">
      <div className={`syn-mat-lbl ${accent === 'purple' ? 'syn-mat-lbl-purple' : ''}`}>{lbl}</div>
      <div className={gCls}>
        <div className="syn-mat-corner" />
        {cols.map(c => <div key={c} className="syn-mat-chdr">{c}</div>)}
        {data.map((row, ri) => (
          <React.Fragment key={ri}>
            <div className="syn-mat-rhdr">{rows[ri]}</div>
            {row.map((v, ci) => {
              const cls = v >= 0.4 ? 'syn-mat-hi' : v >= 0.1 ? 'syn-mat-mid' : 'syn-mat-lo';
              return <div key={ci} className={`syn-mat-cell ${cls}`}>{v.toFixed(2)}</div>;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S2E2Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// ARCHITECTURE · S2E2 · {episode?.title ?? 'THE TRANSFORMER'}</div>
      <h2 className="ml-mani-h">
        The same word at position 1 and position 5
        <br />
        <em className="ml-mani-em">must be represented differently.</em>
      </h2>
      <p className="ml-mani-p">
        Attention is permutation-invariant — feed it the same words in a different order and it
        produces the same output. "The cat sat" and "sat cat The" look identical to raw attention.
        Transformers solve this by injecting a unique positional fingerprint into every token's
        embedding before any attention is computed. No position is anonymous.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">SINUSOIDAL POSITIONAL ENCODING</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-steps">
      {[
        {
          n: '01', title: 'THE FORMULA',
          body: 'PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d)). Even dimensions use sine, odd dimensions use cosine. Each dimension pair oscillates at a different frequency.',
        },
        {
          n: '02', title: 'WHY SINUSOIDAL?',
          body: 'Each position gets a unique pattern of sine/cosine waves across the encoding dimensions. Higher dimensions oscillate very slowly — they encode coarse position. Lower dimensions oscillate fast — they encode fine position. Together they give every position a unique fingerprint.',
        },
        {
          n: '03', title: 'ADDED, NOT CONCATENATED',
          body: 'PE is added to the token embedding, not concatenated. This keeps the model dimension constant (no extra parameters). The attention layers then learn to disentangle positional information from semantic content during training.',
        },
        {
          n: '04', title: 'LEARNED VS SINUSOIDAL',
          body: 'Learned positional embeddings (like BERT uses) can sometimes outperform sinusoidal within the training distribution. Sinusoidal generalizes better to sequences longer than seen during training — the math extrapolates cleanly. Modern architectures often use RoPE (Rotary Position Embedding) instead.',
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
      <span className="ml-sec-ttl">MULTI-HEAD ATTENTION</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-steps">
      {[
        {
          n: '01', title: 'THE IDEA',
          body: 'Run h independent attention operations in parallel, each with its own W_Q, W_K, W_V projection (d_model/h dimensions each). Concatenate all h outputs and project back to d_model. Each head can specialize in a different type of linguistic relationship.',
        },
        {
          n: '02', title: 'WHY MULTIPLE HEADS?',
          body: '"it" → "cat" is one type of relationship (coreference). "sat" → "cat" is another (subject-verb). A single head must choose one — multiple heads let the model track both simultaneously, and many more. GPT-3 uses 96 heads per layer.',
        },
        {
          n: '03', title: 'THE FULL ENCODER',
          body: 'After multi-head attention: residual connection + layer norm → feed-forward (2-layer MLP, d_ff = 4×d_model) → residual + layer norm. This entire block repeats N times (N=12 for BERT-base, N=96 for GPT-3).',
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

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Read the PE heatmap in Playground — every token column is unique</span>
        <span>Notice that position 0 has all-zero sines and all-one cosines</span>
        <span>In Synapse: watch Head 1 and Head 2 learn different attention patterns from the same tokens</span>
        <span>Understand why concatenation then projection = more expressive than one large head</span>
      </div>
    </div>
  </div>
);

// ── PLAYGROUND — Positional Encoding Heatmap ───────────────────────────────────
const PG_NOTES = [
  { id: 'a', text: 'Position 0 has all-zero sines and all-one cosines — sin(0)=0, cos(0)=1 for every frequency. Every other position has at least one non-zero sine, making it unique.' },
  { id: 'b', text: 'Dimensions 0-1 oscillate fastest (full sine wave from pos 0→5). Dimensions 6-7 oscillate extremely slowly — positions 0-4 barely move from [0, 1]. This is the multi-scale position encoding.' },
  { id: 'c', text: 'For any two positions p and p+k, the PE offset PE[p+k] - PE[p] depends only on k (not on p). This lets the model learn relative positions — "3 tokens apart" looks the same regardless of where you are.' },
  { id: 'd', text: 'The PE is added to the token embedding. The total vector encodes both WHAT the token means (embedding) and WHERE it appears (PE). Attention then learns to use both.' },
];

export const S2E2Playground: React.FC = () => {
  const [selectedDimPair, setSelectedDimPair] = useState<number | null>(null);

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Positional Encoding</div>
        <p className="pg-intro-body">
          Pre-loaded: <strong>"Attention is all you need"</strong> (5 tokens, d_model=8).
          Each row is one token's positional encoding — 8 sinusoidal values that uniquely
          fingerprint its position. Green = positive, red = negative. Brighter = larger magnitude.
          Click a dimension pair label to see its wave pattern highlighted.
        </p>
      </div>

      {/* PE Heatmap */}
      <div className="pe-hm">
        <div className="attn-hm-title">SINUSOIDAL POSITIONAL ENCODINGS — 5 POSITIONS × 8 DIMENSIONS</div>
        <div className="pe-grid">
          {/* Header */}
          <div className="pe-corner" />
          {PE_DIMS.map((d, i) => (
            <button
              key={d}
              type="button"
              className={`pe-col-lbl ${selectedDimPair !== null && Math.floor(i / 2) === selectedDimPair ? 'attn-row-lbl-active' : ''}`}
              onClick={() => setSelectedDimPair(selectedDimPair === Math.floor(i / 2) ? null : Math.floor(i / 2))}
            >
              {d}
            </button>
          ))}

          {/* Rows */}
          {PE_TOKENS.map((tok, ri) => (
            <React.Fragment key={ri}>
              <div className="pe-row-lbl">
                {tok}
                <span className="pe-row-pos">pos={ri}</span>
              </div>
              {PE_VALS[ri].map((v, ci) => {
                const dimPair = Math.floor(ci / 2);
                const isHighlighted = selectedDimPair !== null && dimPair === selectedDimPair;
                return (
                  <div
                    key={ci}
                    className={`pe-cell ${peBand(v)} ${isHighlighted ? 'attn-active-row' : ''}`}
                  >
                    <span className="pe-cell-val">{v.toFixed(2)}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="pe-legend">
          <span className="pe-leg"><span className="pe-leg-swatch pe-leg-pos" />positive (sin/cos &gt; 0)</span>
          <span className="pe-leg"><span className="pe-leg-swatch pe-leg-neg" />negative (sin/cos &lt; 0)</span>
          <span className="pe-leg"><span className="pe-leg-swatch pe-leg-zero" />near zero</span>
        </div>
      </div>

      {/* Dim pair annotation */}
      {selectedDimPair !== null && (
        <div className="attn-ann">
          <div className="attn-ann-token">
            DIMENSION PAIR {selectedDimPair} — wavelength λ = 10000^({selectedDimPair * 2}/8) ={' '}
            {[1.00, 3.16, 10.0, 31.6][selectedDimPair].toFixed(2)} positions
          </div>
          <p className="attn-ann-text">
            {[
              'Fast oscillation — completes a full cycle in about 6 positions. This pair encodes fine-grained position: adjacent positions differ significantly.',
              'Medium oscillation — a full cycle takes ~20 positions. Encodes mid-range distances. Positions 0-4 span about a quarter-wavelength.',
              'Slow oscillation — a full cycle takes ~63 positions. Encodes coarse position. Across our 5 tokens the values barely change.',
              'Very slow oscillation — a full cycle takes ~199 positions. For our 5-token sentence these values are nearly constant. Useful for very long sequences.',
            ][selectedDimPair]}
          </p>
        </div>
      )}

      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE — Multi-Head Attention ─────────────────────────────────────────────
const SYN_NOTES = [
  { id: 'a', text: 'Head 1 and Head 2 produce different attention patterns from the same tokens — they operate on different embedding dimensions and therefore see different aspects of the input.' },
  { id: 'b', text: 'Concatenating the two 2-dim outputs gives a 4-dim vector per token. A final linear projection W_O (identity here) maps this back to d_model. The projection lets heads interact.' },
  { id: 'c', text: '"the" attends more to "cat" in Head 2 (0.58) than Head 1 (0.23). Head 2 happened to specialize in subject-determiner agreement. Neither specialization was programmed — it emerged from training.' },
  { id: 'd', text: 'With h=2 heads and d_model=4, each head uses d_k = 2 dimensions. With h=8 and d_model=512, each head gets 64 dimensions — enough to represent complex relationship types.' },
];

export const S2E2Synapse: React.FC = () => {
  const [showConcat, setShowConcat] = useState(false);

  return (
    <div className="ml-synapse">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse · Multi-Head Attention</div>
        <p className="syn-intro-body">
          Pre-loaded: 3 tokens with 4-dimensional embeddings, split into 2 independent heads
          (Head 1: dims 0-1, Head 2: dims 2-3). Each head computes its own scaled dot-product
          attention. The outputs are concatenated and projected back to 4 dimensions.
        </p>
      </div>

      {/* Two heads side by side */}
      <div className="mha-layout">
        {/* Head 1 */}
        <div className="mha-head mha-head-1">
          <div className="mha-head-title">HEAD 1 — dims [0, 1]</div>
          <Matrix
            lbl="Attention weights"
            data={MHA_H1_SOFTMAX}
            rows={MHA_TOKENS}
            cols={MHA_H_COLS}
          />
          <div className="mha-arrow-row">↓ × V₁</div>
          <Matrix
            lbl="Output"
            data={MHA_H1_OUT}
            rows={MHA_TOKENS}
            cols={MHA_DIMS2}
          />
        </div>

        {/* Head 2 */}
        <div className="mha-head mha-head-2">
          <div className="mha-head-title">HEAD 2 — dims [2, 3]</div>
          <Matrix
            lbl="Attention weights"
            data={MHA_H2_SOFTMAX}
            rows={MHA_TOKENS}
            cols={MHA_H_COLS}
            accent="purple"
          />
          <div className="mha-arrow-row">↓ × V₂</div>
          <Matrix
            lbl="Output"
            data={MHA_H2_OUT}
            rows={MHA_TOKENS}
            cols={MHA_DIMS2}
            accent="purple"
          />
        </div>
      </div>

      {/* Concat toggle */}
      <div className="bp-nav-row">
        <span className="bp-step-counter">
          Two independent 2-dim outputs → concatenate to 4-dim
        </span>
        <button
          type="button"
          className={`bp-nav-btn ${!showConcat ? 'bp-nav-next' : ''}`}
          onClick={() => setShowConcat(s => !s)}
        >
          {showConcat ? 'HIDE CONCAT' : 'SHOW CONCAT →'}
        </button>
      </div>

      {/* Concatenated output */}
      {showConcat && (
        <div className="mha-concat">
          <div className="mha-concat-title">CONCATENATED OUTPUT  [Head 1 ‖ Head 2]</div>
          <Matrix
            lbl="concat(Out₁, Out₂)"
            data={MHA_CONCAT}
            rows={MHA_TOKENS}
            cols={MHA_DIMS4}
          />
          <p className="syn-solved-note">
            Each token now carries contributions from both heads — Head 1's d₀,d₁ perspective
            and Head 2's d₂,d₃ perspective. A final W_O projection (identity here) mixes
            these back into a unified 4-dim representation. The model learns W_O to optimally
            combine what each head discovered.
          </p>
        </div>
      )}

      <AwareStrip notes={SYN_NOTES} />
    </div>
  );
};
