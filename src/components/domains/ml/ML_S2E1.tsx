import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip } from './MLShared';

// ── Pre-loaded: "The cat sat because it was tired" ─────────────────────────────
// Designed attention weights — each row sums to 1.
// Key pattern: "it" (row 4) has heavy attention to "cat" (col 1): pronoun resolution.

const TOKENS = ['The', 'cat', 'sat', 'because', 'it', 'was', 'tired'];

const ATTN: number[][] = [
  [0.55, 0.23, 0.08, 0.04, 0.05, 0.03, 0.02], // The
  [0.10, 0.62, 0.12, 0.04, 0.06, 0.03, 0.03], // cat
  [0.05, 0.38, 0.38, 0.06, 0.07, 0.03, 0.03], // sat
  [0.03, 0.09, 0.24, 0.31, 0.09, 0.08, 0.16], // because
  [0.04, 0.55, 0.08, 0.06, 0.17, 0.05, 0.05], // it  ← pronoun resolution
  [0.03, 0.12, 0.06, 0.05, 0.42, 0.24, 0.08], // was
  [0.03, 0.19, 0.06, 0.08, 0.28, 0.14, 0.22], // tired
];

const ANNOTATIONS = [
  '"The" mostly attends to itself. Determiners carry little independent meaning — there\'s not much extra context the rest of the sentence can add.',
  '"cat" has strong self-attention (0.62). The noun establishes itself. Small secondary signals from "sat" and "it" confirm its role as the subject.',
  '"sat" splits evenly between "cat" (0.38) and itself (0.38). Subject→verb attention: the network figured out who is sitting, purely from data.',
  '"because" spreads across "sat" (0.24) and "tired" (0.16). As a conjunction, it bridges two clauses — it must attend to both sides of the causal link it creates.',
  '"it" attends heavily to "cat" (0.55). This is pronoun resolution: the model determines that "it" refers to "cat", not "street" or anything else. One of attention\'s most celebrated capabilities.',
  '"was" attends strongly to "it" (0.42). The auxiliary verb reaches back for its grammatical subject — it needs to know what entity was tired.',
  '"tired" attends to "it" (0.28) and itself (0.22). As a predicate adjective, it traces back to the entity it describes — following the chain tired → it → cat.',
];

// ── Pre-loaded attention math (3-token toy example) ───────────────────────────
// Tokens: ["q", "k", "v"] — meta-naming to match the Q/K/V concept being taught
// Embeddings X (3 × 2):  q=[1,0]  k=[0,1]  v=[1,1]
// W_Q = W_K = identity, W_V swaps dims → Q=K=X, V=[[0,1],[1,0],[1,1]]
// Scores = Q·Kᵀ = X·Xᵀ (raw dot products)
// Scaled  = Scores / √2
// Softmax rows (pre-computed)
// Output  = Softmax · V

const SYN_TOKENS = ['"q"', '"k"', '"v"'];
const SYN_DIMS2  = ['d₀', 'd₁'];
const SYN_DIMS3  = ['"q"', '"k"', '"v"'];

const MAT_X        = [[1,0],[0,1],[1,1]];
const MAT_Q        = [[1,0],[0,1],[1,1]];
const MAT_K        = [[1,0],[0,1],[1,1]];
const MAT_V        = [[0,1],[1,0],[1,1]];
const MAT_SCORES   = [[1,0,1],[0,1,1],[1,1,2]];
const MAT_SCALED   = [[0.71,0.00,0.71],[0.00,0.71,0.71],[0.71,0.71,1.41]];
const MAT_SOFTMAX  = [[0.40,0.20,0.40],[0.20,0.40,0.40],[0.25,0.25,0.50]];
const MAT_OUTPUT   = [[0.60,0.80],[0.80,0.60],[0.75,0.75]];

const SYN_STEPS = [
  {
    badge: 'STEP 1 / 6', title: 'INPUT EMBEDDINGS  X',
    desc: 'Each token has a 2-dimensional embedding. In a real transformer d_model = 512–1024. We use 2 dimensions so the matrix arithmetic fits on screen — the math is identical.',
    mats: [{ lbl: 'X', data: MAT_X, rows: SYN_TOKENS, cols: SYN_DIMS2 }],
  },
  {
    badge: 'STEP 2 / 6', title: 'Q, K, V PROJECTIONS',
    desc: 'Multiply X by three learned weight matrices (W_Q, W_K, W_V). Here W_Q = W_K = I (identity) and W_V swaps the two dimensions. In practice these are trained jointly with the rest of the network.',
    mats: [
      { lbl: 'Q = X·W_Q', data: MAT_Q, rows: SYN_TOKENS, cols: SYN_DIMS2 },
      { lbl: 'K = X·W_K', data: MAT_K, rows: SYN_TOKENS, cols: SYN_DIMS2 },
      { lbl: 'V = X·W_V', data: MAT_V, rows: SYN_TOKENS, cols: SYN_DIMS2 },
    ],
  },
  {
    badge: 'STEP 3 / 6', title: 'RAW SCORES  Q · Kᵀ',
    desc: 'Each query token dot-products with every key token. A high score means "this query is compatible with what that key offers". Cell [i][j] = how much token i wants to attend to token j.',
    mats: [{ lbl: 'Scores', data: MAT_SCORES, rows: SYN_TOKENS, cols: SYN_DIMS3 }],
  },
  {
    badge: 'STEP 4 / 6', title: 'SCALE BY  1 / √d_k',
    desc: 'Divide every score by √2 ≈ 1.41. Without this, large dot products push softmax into regions where gradients approach zero — the same vanishing gradient problem as sigmoid. Scaling keeps the distribution healthy.',
    mats: [{ lbl: '÷ √2', data: MAT_SCALED, rows: SYN_TOKENS, cols: SYN_DIMS3 }],
  },
  {
    badge: 'STEP 5 / 6', title: 'SOFTMAX → ATTENTION WEIGHTS',
    desc: 'Apply softmax row-by-row. Each row becomes a probability distribution over all tokens — values are positive and sum to 1. High values mean "attend strongly to this token".',
    mats: [{ lbl: 'Softmax', data: MAT_SOFTMAX, rows: SYN_TOKENS, cols: SYN_DIMS3 }],
  },
  {
    badge: 'STEP 6 / 6', title: 'OUTPUT  Softmax · V',
    desc: 'Multiply the attention weights by the Value matrix. Each output row is a weighted combination of all values — tokens that scored high contribute more. The result is a context-aware representation of each token.',
    mats: [{ lbl: 'Output', data: MAT_OUTPUT, rows: SYN_TOKENS, cols: SYN_DIMS2 }],
  },
] as const;

// Maps a 0–1 attention weight to one of 10 discrete band CSS classes (no inline styles)
function attnBand(w: number): string {
  return `attn-b${Math.min(9, Math.floor(w * 10))}`;
}

// ── Matrix display component ───────────────────────────────────────────────────
const Matrix: React.FC<{
  lbl: string;
  data: readonly (readonly number[])[] | number[][];
  rows: string[];
  cols: string[];
}> = ({ lbl, data, rows, cols }) => {
  const gCls = `syn-mat-grid syn-mat-g${cols.length}`;
  return (
    <div className="syn-mat">
      <div className="syn-mat-lbl">{lbl}</div>
      <div className={gCls}>
        <div className="syn-mat-corner" />
        {cols.map(c => <div key={c} className="syn-mat-chdr">{c}</div>)}
        {(data as number[][]).map((row, ri) => (
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
export const S2E1Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// REVOLUTION · S2E1 · {episode?.title ?? 'ATTENTION'}</div>
      <h2 className="ml-mani-h">
        Not every word in a sentence matters equally.
        <br />
        <em className="ml-mani-em">Attention decides which ones do.</em>
      </h2>
      <p className="ml-mani-p">
        Inspector Lunge mentally filed every piece of evidence, attending to specific details
        while discarding noise. When Tenma spoke, Lunge didn't process each word with equal weight —
        "killed" and "Ruhenheim" lit up his internal map. The attention mechanism formalizes exactly
        this: every token asks every other token, "how relevant are you to understanding me?"
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">SCALED DOT-PRODUCT ATTENTION</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-steps">
      {[
        {
          n: '01', title: 'THREE PROJECTIONS: Q, K, V',
          body: 'Every token is projected into three vectors via learned weight matrices. Q (Query) = "what am I looking for?", K (Key) = "what do I offer?", V (Value) = "what information do I carry?" These are separate projections — the model decides what each role means.',
        },
        {
          n: '02', title: 'DOT PRODUCT SCORES',
          body: 'Compute Q·Kᵀ — every query dot-products with every key. A high dot product means the query and key are geometrically aligned: "this is exactly what I was looking for." The result is an n×n matrix of raw attention scores.',
        },
        {
          n: '03', title: 'SCALING BY √d_k',
          body: 'Divide all scores by √d_k (the key dimension). In high-dimensional space, dot products grow large by chance, pushing softmax into near-zero gradient regions. Scaling keeps the distribution spread out and learning stable.',
        },
        {
          n: '04', title: 'SOFTMAX → WEIGHTED SUM',
          body: 'Apply softmax row-by-row: scores become probabilities. Each row sums to 1. Multiply by V: the output for each token is a weighted combination of all values, filtered by how much attention each key earned.',
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
        <span className="s1e1-fv">Attention(Q, K, V)</span>
        <span className="s1e1-fo">&nbsp;=&nbsp;</span>
        <span className="s1e1-fv">softmax</span>
        <span className="s1e1-fo">( </span>
        <span className="s1e1-fv">Q · Kᵀ</span>
        <span className="s1e1-fo">&nbsp;/&nbsp;</span>
        <span className="s1e1-fv">√d_k</span>
        <span className="s1e1-fo"> ) · </span>
        <span className="s1e1-fv">V</span>
      </div>
      <div className="s1e1-worked">
        <div className="s1e1-worked-title">WHY SELF-ATTENTION (Q=K=V from the same sequence)?</div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">In self-attention, Q, K, V all come from the same input sequence.</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">Each token decides how much to "pay attention" to every other token in the same sequence.</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">This lets "it" resolve to "cat" — without any explicit grammar rules.</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-calc">Cross-attention (Q from one sequence, K/V from another) powers encoder–decoder models.</span>
        </div>
      </div>
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Click "it" in Playground — see it attend to "cat" with weight 0.55</span>
        <span>Click "sat" — watch it split between "cat" and itself</span>
        <span>Step through the math in Synapse — Q·Kᵀ → scale → softmax → output</span>
        <span>Understand why √d_k scaling prevents gradient saturation</span>
      </div>
    </div>
  </div>
);

// ── PLAYGROUND — Attention Heatmap ─────────────────────────────────────────────
const PG_NOTES = [
  { id: 'a', text: '"it" → "cat" (0.55): the model resolved the pronoun without being told any grammar rules. It learned this relationship purely from statistical patterns in training data.' },
  { id: 'b', text: '"sat" → "cat" (0.38): subject-verb attention. The verb reaches back to find its subject. This is syntactic structure, learned implicitly from text.' },
  { id: 'c', text: 'Every row sums to exactly 1.00 — that\'s what softmax does. Attention is always a probability distribution over all tokens in the sequence.' },
  { id: 'd', text: 'These weights come from ONE attention head. Real transformers use 8–16 heads in parallel, each learning different relationship types simultaneously.' },
];

export const S2E1Playground: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Attention Heatmap</div>
        <p className="pg-intro-body">
          Pre-loaded: <strong>"The cat sat because it was tired."</strong>
          &nbsp;Each cell shows how much the row token (query) attends to the column token (key).
          Darker green = more attention. Click any token label on the left to focus its row.
        </p>
      </div>

      {/* Heatmap */}
      <div className="attn-hm">
        <div className="attn-hm-title">ATTENTION WEIGHTS — ONE HEAD, LAYER 1</div>
        <div className="attn-grid">
          {/* Header row */}
          <div className="attn-corner" />
          {TOKENS.map(t => <div key={t} className="attn-col-lbl">{t}</div>)}

          {/* Data rows */}
          {TOKENS.map((queryTok, ri) => (
            <React.Fragment key={ri}>
              <button
                type="button"
                className={`attn-row-lbl ${selected === ri ? 'attn-row-lbl-active' : ''}`}
                onClick={() => setSelected(selected === ri ? null : ri)}
              >
                {queryTok}
              </button>
              {ATTN[ri].map((w, ci) => (
                <div
                  key={ci}
                  className={`attn-cell ${attnBand(w)} ${selected === ri ? 'attn-active-row' : ''}`}
                >
                  <span className="attn-cell-val">{w.toFixed(2)}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Annotation */}
      <div className="attn-ann">
        {selected === null ? (
          <span className="attn-ann-hint">← Click any token name to see its attention pattern explained</span>
        ) : (
          <>
            <div className="attn-ann-token">
              "{TOKENS[selected]}" attends to: {
                [...ATTN[selected].map((w, i) => ({ w, i }))].sort((a, b) => b.w - a.w)
                  .slice(0, 3).map(({ w, i }) => `"${TOKENS[i]}" (${w.toFixed(2)})`).join(', ')
              }
            </div>
            <p className="attn-ann-text">{ANNOTATIONS[selected]}</p>
          </>
        )}
      </div>

      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE — Attention Math Stepper ──────────────────────────────────────────
const SYN_NOTES = [
  { id: 'a', text: 'Q=K=X here (identity projections) — so scores = X·Xᵀ, pure dot products between token embeddings. Real networks learn W_Q and W_K to extract specific relationship types.' },
  { id: 'b', text: 'After softmax, "v" has weight 0.50 in row 2 — the ["v","v"] token attends most to itself. This makes sense: [1,1] · [1,1] = 2, the highest raw score in that row.' },
  { id: 'c', text: 'The output rows are no longer the original embeddings — each token\'s representation has been enriched by weighted contributions from all other tokens.' },
  { id: 'd', text: 'This is ONE layer of ONE head. Real transformers stack 12–96 encoder layers, each refining the representations further.' },
];

export const S2E1Synapse: React.FC = () => {
  const [step, setStep] = useState(0);
  const s = SYN_STEPS[step];

  return (
    <div className="ml-synapse syn-mat-stepper">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse · Attention Math</div>
        <p className="syn-intro-body">
          Pre-loaded: 3 tokens ["q", "k", "v"] with 2-dimensional embeddings.
          Step through all 6 phases of scaled dot-product attention — every matrix pre-computed,
          every transformation shown. This is the exact computation inside every transformer.
        </p>
      </div>

      {/* Progress dots */}
      <div className="bp-step-nav">
        {SYN_STEPS.map((st, i) => (
          <div key={st.badge} className="bp-step-pip">
            <div
              className={`bp-pip-dot ${i < step ? 'bp-pip-done' : i === step ? 'bp-pip-active' : ''}`}
              onClick={() => setStep(i)}
            />
            {i < SYN_STEPS.length - 1 && (
              <div className={`bp-pip-connector ${i < step ? 'bp-pip-connector-done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bp-step-card">
        <div className="bp-step-header">
          <span className="bp-step-badge">{s.badge}</span>
          <span className="bp-step-title">{s.title}</span>
        </div>
        <p className="bp-step-desc">{s.desc}</p>
        <div className="syn-mat-mats">
          {s.mats.map(m => (
            <Matrix key={m.lbl} lbl={m.lbl} data={m.data as number[][]} rows={[...m.rows]} cols={[...m.cols]} />
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="bp-nav-row">
        <button type="button" className="bp-nav-btn" onClick={() => setStep(i => i - 1)} disabled={step === 0}>← PREV</button>
        <span className="bp-step-counter">{step + 1} / {SYN_STEPS.length}</span>
        <button
          type="button"
          className={`bp-nav-btn ${step < SYN_STEPS.length - 1 ? 'bp-nav-next' : ''}`}
          onClick={() => setStep(i => Math.min(i + 1, SYN_STEPS.length - 1))}
          disabled={step === SYN_STEPS.length - 1}
        >
          NEXT →
        </button>
      </div>

      <AwareStrip notes={SYN_NOTES} />
    </div>
  );
};
