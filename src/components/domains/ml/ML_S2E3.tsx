import React, { useState } from 'react';
import type { Arc, Episode } from '../../../types';
import { AwareStrip } from './MLShared';

// ── Pre-loaded: 8×8 image, 4-color quadrant pattern, 2×2 patches ──────────────
//
//   R R R R G G G G     Patch grid (4×4 = 16 patches):
//   R R R R G G G G       0  1  2  3
//   R R R R G G G G       4  5  6  7
//   R R R R G G G G       8  9 10 11
//   B B B B Y Y Y Y      12 13 14 15
//   B B B B Y Y Y Y
//   B B B B Y Y Y Y     Colors: R=red, G=green, B=blue, Y=yellow
//   B B B B Y Y Y Y

type PC = 'r' | 'g' | 'b' | 'y';

const PATCH_COLOR: PC[] = [
  'r','r','g','g',
  'r','r','g','g',
  'b','b','y','y',
  'b','b','y','y',
];

const COLOR_HEX: Record<PC, string> = {
  r: '#e74c3c', g: '#27ae60', b: '#2980b9', y: '#e67e22',
};

const COLOR_NAME: Record<PC, string> = {
  r: 'Red', g: 'Green', b: 'Blue', y: 'Yellow',
};

// 4-dim projections per color (W_proj maps 12-dim flat → 4-dim embed)
// Row k sums channel k across all 4 pixels, then normalizes by 4
const EMBED: Record<PC, number[]> = {
  r: [1.00, 0.00, 0.00, 0.25],  // strong red, low brightness
  g: [0.00, 1.00, 0.00, 0.25],  // strong green
  b: [0.00, 0.00, 1.00, 0.00],  // strong blue, zero brightness (no R/G)
  y: [1.00, 1.00, 0.00, 0.50],  // red+green=yellow, medium brightness
};

// 4-dim sinusoidal PE for positions 0-15
// PE(pos, 0)=sin(pos)  PE(pos, 1)=cos(pos)
// PE(pos, 2)=sin(pos/10)  PE(pos, 3)=cos(pos/10)
const PE: number[][] = [
  [ 0.000,  1.000,  0.000,  1.000],
  [ 0.841,  0.540,  0.100,  0.995],
  [ 0.909, -0.416,  0.199,  0.980],
  [ 0.141, -0.990,  0.296,  0.955],
  [-0.757, -0.654,  0.389,  0.921],
  [-0.959,  0.284,  0.479,  0.878],
  [-0.279,  0.960,  0.565,  0.825],
  [ 0.657,  0.754,  0.644,  0.765],
  [ 0.989, -0.146,  0.717,  0.697],
  [ 0.412, -0.911,  0.783,  0.622],
  [-0.544, -0.839,  0.841,  0.542],
  [-1.000, -0.004,  0.892,  0.453],
  [-0.537,  0.843,  0.932,  0.362],
  [ 0.420,  0.908,  0.964,  0.266],
  [ 0.991,  0.131,  0.985,  0.172],
  [ 0.650, -0.760,  0.997,  0.076],
];

// For a given patch index, find the same-color patch farthest away
function comparePatch(pi: number): number {
  const c = PATCH_COLOR[pi];
  return PATCH_COLOR
    .map((col, i) => ({ i, col }))
    .filter(({ i, col }) => col === c && i !== pi)
    .reduce((best, cur) => Math.abs(cur.i - pi) > Math.abs(best.i - pi) ? cur : best).i;
}

// Final token = embedding + PE
function finalToken(pi: number): number[] {
  const e = EMBED[PATCH_COLOR[pi]];
  const p = PE[pi];
  return e.map((v, i) => parseFloat((v + p[i]).toFixed(3)));
}

// Flat pixel values for a uniform-color 2×2 patch (12 values: 4 pixels × RGB)
const FLAT_RGB: Record<PC, number[]> = {
  r: [1,0,0, 1,0,0, 1,0,0, 1,0,0],
  g: [0,1,0, 0,1,0, 0,1,0, 0,1,0],
  b: [0,0,1, 0,0,1, 0,0,1, 0,0,1],
  y: [1,1,0, 1,1,0, 1,1,0, 1,1,0],
};

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S2E3Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// FRONTIER · S2E3 · {episode?.title ?? 'RUHENHEIM — VISION TRANSFORMERS'}</div>
      <h2 className="ml-mani-h">
        In Ruhenheim, Johan ended an era.
        <br />
        <em className="ml-mani-em">ViT did the same to CNNs.</em>
      </h2>
      <p className="ml-mani-p">
        For thirty years, convolutional neural networks owned computer vision.
        Locality, translation invariance, hierarchical features — their inductive biases felt
        fundamental. Then in 2020, "An Image Is Worth 16×16 Words" appeared. A pure transformer —
        no convolutions whatsoever — trained on enough data, it surpassed every CNN benchmark.
        The old order collapsed. Not because CNNs were wrong, but because scale rewrote the rules.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">HOW ViT WORKS</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-steps">
      {[
        {
          n: '01', title: 'SPLIT INTO PATCHES',
          body: 'Divide the image into N non-overlapping P×P patches. For 224×224 images with P=16: N = (224/16)² = 196 patches. Each patch contains 16×16×3 = 768 pixel values.',
        },
        {
          n: '02', title: 'PROJECT TO d_model',
          body: 'Flatten each patch to a 768-dim vector, then multiply by a learned W_proj (768 × d_model) matrix. This is exactly word embedding for images — each patch becomes a token of size d_model.',
        },
        {
          n: '03', title: 'ADD [CLS] AND POSITIONAL ENCODING',
          body: 'Prepend one learnable [CLS] token (not from any patch). Add sinusoidal positional encodings to all 197 tokens. Without PE, the transformer cannot tell patch 0 from patch 100 — they look identical to pure attention.',
        },
        {
          n: '04', title: 'TRANSFORMER ENCODER',
          body: 'Pass the 197-token sequence through L transformer encoder layers. Each layer: multi-head self-attention over all patches (including [CLS]) → add & norm → feed-forward → add & norm. Patches from opposite corners can directly attend to each other from layer 1.',
        },
        {
          n: '05', title: 'CLASSIFY FROM [CLS]',
          body: 'Take the final [CLS] representation — it has attended to all 196 patches and aggregated global image context. Pass to a linear classification head → output probabilities. No pooling needed, no sliding window.',
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
      <span className="ml-sec-ttl">ViT vs CNN — THE TRADE-OFF</span>
      <div className="ml-sec-line" />
    </div>
    <div className="s1e1-formula-block">
      <div className="s1e1-worked">
        <div className="s1e1-worked-title">INDUCTIVE BIAS:</div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">CNN</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">locality + translation invariance built in</span>
          <span className="s1e1-wr-res s1e1-wr-1">✓ few parameters, few data</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">ViT</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">no inductive bias — learns everything from data</span>
          <span className="s1e1-wr-res s1e1-wr-0">✗ needs massive dataset</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">ViT at scale</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">JFT-300M training → 90.45% ImageNet top-1</span>
          <span className="s1e1-wr-res s1e1-wr-1">✓ surpasses all CNNs</span>
        </div>
        <div className="s1e1-worked-row">
          <span className="s1e1-wr-inp">Attention range</span>
          <span className="s1e1-wr-arr">→</span>
          <span className="s1e1-wr-calc">CNN layer k sees k×kernel_size radius of context</span>
          <span className="s1e1-wr-res s1e1-wr-1">ViT: global from layer 1</span>
        </div>
      </div>
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">YOUR MISSION THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Click patches in Playground — see how the same red at pos 0 vs pos 5 gets a different final token</span>
        <span>Step through the Synapse pipeline — image to [CLS] classification</span>
        <span>Understand why identical patches at different positions must be distinguishable</span>
        <span>See why ViT beat CNNs: global attention from layer 1, not local convolutions</span>
      </div>
    </div>
  </div>
);

// ── PLAYGROUND — Patch Embedding Visualizer ────────────────────────────────────

// SVG constants: 28px per pixel, 56px per patch
const CELL = 28, PATCH = 56, N = 8;

const ImageGrid: React.FC<{
  selected: number | null;
  onSelect: (i: number) => void;
}> = ({ selected, onSelect }) => (
  <svg viewBox={`0 0 ${N * CELL} ${N * CELL}`} className="vit-svg">
    {/* Pixel cells */}
    {Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c) => {
        const col: PC = r < 4 ? (c < 4 ? 'r' : 'g') : (c < 4 ? 'b' : 'y');
        const pi = Math.floor(r / 2) * 4 + Math.floor(c / 2);
        return (
          <rect
            key={`px-${r}-${c}`}
            x={c * CELL} y={r * CELL}
            width={CELL} height={CELL}
            className={`vit-px-${col}`}
            onClick={() => onSelect(pi)}
          />
        );
      })
    )}

    {/* Patch border overlay */}
    {Array.from({ length: 16 }, (_, pi) => {
      const pr = Math.floor(pi / 4), pc = pi % 4;
      return (
        <g key={`p-${pi}`} onClick={() => onSelect(pi)}>
          <rect
            x={pc * PATCH} y={pr * PATCH}
            width={PATCH} height={PATCH}
            className={`vit-patch-border ${selected === pi ? 'vit-patch-border-active' : ''}`}
          />
          <text
            x={pc * PATCH + PATCH / 2}
            y={pr * PATCH + PATCH / 2}
            className="vit-patch-num"
          >
            {pi}
          </text>
        </g>
      );
    })}
  </svg>
);

const PatchDetail: React.FC<{ pi: number }> = ({ pi }) => {
  const col = PATCH_COLOR[pi];
  const flat = FLAT_RGB[col];
  const emb = EMBED[col];
  const pe  = PE[pi];
  const tok = finalToken(pi);
  const cmpIdx = comparePatch(pi);
  const cmpTok = finalToken(cmpIdx);

  return (
    <div className="vit-detail">
      <div className="vit-detail-hdr">
        <span className={`vit-detail-badge vit-badge-${col}`} />
        PATCH {pi} — {COLOR_NAME[col]} — POSITION {pi}
      </div>

      {/* 1. Flatten */}
      <div className="vit-detail-section">
        <span className="vit-section-lbl">① FLATTEN (12 values: 4 pixels × RGB)</span>
        <div className="vit-flat-grid">
          {flat.map((v, i) => (
            <div key={i} className={`vit-flat-cell ${v > 0.5 ? 'vit-flat-hi' : 'vit-flat-lo'}`}>
              {v.toFixed(0)}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Embed */}
      <div className="vit-detail-section">
        <span className="vit-section-lbl">② EMBED — W_proj × flat (4-dim)</span>
        <div className="vit-row-lbl">d₀ &nbsp; d₁ &nbsp; d₂ &nbsp; d₃</div>
        <div className="vit-embed-row">
          {emb.map((v, i) => (
            <div key={i} className={`vit-embed-cell ${v > 0.3 ? 'vit-embed-hi' : 'vit-embed-lo'}`}>
              {v.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {/* 3. PE */}
      <div className="vit-detail-section">
        <span className="vit-section-lbl">③ POSITIONAL ENCODING (pos={pi})</span>
        <div className="vit-row-lbl">d₀ &nbsp; d₁ &nbsp; d₂ &nbsp; d₃</div>
        <div className="vit-embed-row">
          {pe.map((v, i) => (
            <div key={i} className={`vit-embed-cell ${Math.abs(v) > 0.5 ? 'vit-embed-hi' : 'vit-embed-lo'}`}>
              {v.toFixed(3)}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Token = Emb + PE */}
      <div className="vit-detail-section">
        <span className="vit-section-lbl">④ FINAL TOKEN = Embed + PE</span>
        <div className="vit-row-lbl">d₀ &nbsp; d₁ &nbsp; d₂ &nbsp; d₃</div>
        <div className="vit-embed-row">
          {tok.map((v, i) => (
            <div key={i} className={`vit-embed-cell vit-embed-hi`}>{v.toFixed(3)}</div>
          ))}
        </div>
      </div>

      {/* Cross-position comparison */}
      <div className="vit-compare">
        <div className="vit-cmp-title">
          COMPARE: Patch {cmpIdx} is also {COLOR_NAME[col]} — same embedding, different token
        </div>
        <div className="vit-row-lbl">Patch {cmpIdx} final token:</div>
        <div className="vit-embed-row">
          {cmpTok.map((v, i) => (
            <div
              key={i}
              className={`vit-embed-cell ${tok[i] !== v ? 'vit-embed-hi' : 'vit-embed-lo'}`}
            >
              {v.toFixed(3)}
            </div>
          ))}
        </div>
        <p className="vit-cmp-body">
          Same {COLOR_NAME[col]} pixels. Identical embedding. But pos={pi} vs pos={cmpIdx}
          produces a different PE, so the transformer sees them as distinct tokens — even
          though they contain the same visual content.
        </p>
      </div>
    </div>
  );
};

const PG_NOTES = [
  { id: 'a', text: 'Red patches at positions 0 and 5 have identical pixel content and identical embeddings — but different final tokens after PE is added. Without PE, the model cannot distinguish them.' },
  { id: 'b', text: 'The embedding at dim 3 (the "brightness" dimension) is 0 for Blue patches. Blue has no red or green channel, so the projection returns 0 there. The model learns what each embedding dimension means.' },
  { id: 'c', text: 'In real ViT (224×224, patch=16), there are 196 patches, each a 768-dim vector. The linear projection W_proj is 768×768 — that\'s 589,824 parameters just for the patch embedding layer.' },
  { id: 'd', text: 'Patches attend globally from layer 1. In a CNN, the first layer can only see a 3×3 or 5×5 neighborhood. ViT patches in opposite corners can directly "communicate" from the very first attention operation.' },
];

export const S2E3Playground: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const toggle = (pi: number) => setSelected(s => s === pi ? null : pi);

  return (
    <div className="ml-playground">
      <div className="pg-intro">
        <div className="pg-intro-lead">Patch Embedding</div>
        <p className="pg-intro-body">
          Pre-loaded: 8×8 image with 4 color quadrants, split into 16 patches (2×2 each).
          Click any numbered patch to trace it through the full embedding pipeline:
          flatten → project → add PE → final token.
          Notice: same-color patches at different positions produce different final tokens.
        </p>
      </div>

      <div className="vit-layout">
        <div className="vit-image-wrap">
          <div className="vit-img-title">8 × 8 IMAGE — 16 PATCHES (2×2 EACH)</div>
          <ImageGrid selected={selected} onSelect={toggle} />
        </div>

        {selected === null ? (
          <div className="vit-detail">
            <span className="vit-detail-hint">← Click any numbered patch to explore its embedding pipeline</span>
          </div>
        ) : (
          <PatchDetail pi={selected} />
        )}
      </div>

      <AwareStrip notes={PG_NOTES} />
    </div>
  );
};

// ── SYNAPSE — ViT Pipeline Stepper ─────────────────────────────────────────────
const SEQ_COLORS: PC[] = [
  'r','r','g','g','r','r','g','g',
  'b','b','y','y','b','b','y','y',
];

const SYN_STEPS = [
  {
    badge: 'STEP 1 / 6', title: 'SPLIT INTO PATCHES',
    desc: 'The 8×8 image is divided into 16 non-overlapping 2×2 patches. In real ViT (224×224, P=16), this produces 196 patches. Each patch is a self-contained image fragment treated as one token.',
    visual: 'grid' as const,
  },
  {
    badge: 'STEP 2 / 6', title: 'FLATTEN EACH PATCH',
    desc: 'Each 2×2×3 patch is rearranged into a 1D vector: 4 pixels × 3 channels = 12 values. For real ViT: 16×16×3 = 768 values. All spatial structure inside the patch is discarded — the transformer will learn to ignore spatial order.',
    visual: 'flatten' as const,
  },
  {
    badge: 'STEP 3 / 6', title: 'LINEAR PROJECTION → EMBEDDINGS',
    desc: 'A learned weight matrix W_proj (12 × 4 here, 768 × 768 in real ViT) maps each flattened patch to a d_model-dimensional embedding. The model learns what features matter. Each color maps to a distinct 4-dim representation.',
    visual: 'embed' as const,
  },
  {
    badge: 'STEP 4 / 6', title: 'ADD POSITIONAL ENCODING',
    desc: 'Sinusoidal PE is added to each embedding. Without it, the transformer is position-blind: patches 0 and 15 look identical. With PE, every position has a unique fingerprint. Same-color patches at different positions become distinguishable.',
    visual: 'pe' as const,
  },
  {
    badge: 'STEP 5 / 6', title: 'PREPEND [CLS] TOKEN',
    desc: 'A learnable [CLS] token is inserted at position 0. It doesn\'t correspond to any image patch. After encoding, its representation aggregates global context from all 16 patches via attention — this is what gets classified.',
    visual: 'seq' as const,
  },
  {
    badge: 'STEP 6 / 6', title: 'TRANSFORMER + CLASSIFY',
    desc: 'The 17-token sequence passes through transformer encoder layers. [CLS] attends to all 16 patches (and patches attend to each other). The final [CLS] vector is passed to a linear head → class probabilities.',
    visual: 'classify' as const,
  },
] as const;

type Visual = (typeof SYN_STEPS)[number]['visual'];

const SynapseVisual: React.FC<{ v: Visual }> = ({ v }) => {
  if (v === 'grid') return (
    <div className="vit-patch-grid">
      {PATCH_COLOR.map((c, i) => (
        <div key={i} className={`vit-patch-sq vit-patch-sq-${c}`}>
          <span className="vit-patch-idx">{i}</span>
        </div>
      ))}
    </div>
  );

  if (v === 'flatten') return (
    <div>
      <div className="vit-row-lbl">Patch 0 (Red) — flattened 12 values:</div>
      <div className="vit-flat-grid">
        {FLAT_RGB.r.map((val, i) => (
          <div key={i} className={`vit-flat-cell ${val > 0.5 ? 'vit-flat-hi' : 'vit-flat-lo'}`}>
            {val}
          </div>
        ))}
      </div>
      <div className="vit-row-lbl">
        Pixel 1: [R,G,B] &nbsp;·&nbsp; Pixel 2: [R,G,B] &nbsp;·&nbsp; Pixel 3: [R,G,B] &nbsp;·&nbsp; Pixel 4: [R,G,B]
      </div>
    </div>
  );

  if (v === 'embed') return (
    <div>
      {(['r','g','b','y'] as PC[]).map(c => (
        <div key={c} className="vit-detail-section">
          <div className="vit-row-lbl">
            <span className={`vit-color-${c}`}>{COLOR_NAME[c]} patch</span> → d₀ d₁ d₂ d₃
          </div>
          <div className="vit-embed-row">
            {EMBED[c].map((v, i) => (
              <div key={i} className={`vit-embed-cell ${v > 0.3 ? 'vit-embed-hi' : 'vit-embed-lo'}`}>
                {v.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (v === 'pe') return (
    <div>
      <div className="vit-row-lbl">Patch 0 (Red, pos=0) vs Patch 5 (Red, pos=5):</div>
      {([0, 5] as const).map(pi => {
        const tok = finalToken(pi);
        return (
          <div key={pi} className="vit-detail-section">
            <div className="vit-row-lbl">
              Patch {pi} final token (embed + PE[{pi}]):
            </div>
            <div className="vit-embed-row">
              {tok.map((val, i) => (
                <div key={i} className="vit-embed-cell vit-embed-hi">{val.toFixed(3)}</div>
              ))}
            </div>
          </div>
        );
      })}
      <p className="vit-cmp-body">
        Same red color → same embedding → but PE[0] ≠ PE[5] → different final tokens. ✓
      </p>
    </div>
  );

  if (v === 'seq') return (
    <div>
      <div className="vit-row-lbl">17-token sequence: [CLS] + 16 patch tokens</div>
      <div className="vit-seq">
        <div className="vit-cls-tok">[CLS]</div>
        {SEQ_COLORS.map((c, i) => (
          <div key={i} className={`vit-tok vit-tok-${c}`} title={`P${i} (${COLOR_NAME[c]})`} />
        ))}
      </div>
      <div className="vit-row-lbl">
        Position:  &nbsp;0 (CLS) &nbsp;·&nbsp; 1–16 (patches 0–15)
      </div>
    </div>
  );

  // classify
  return (
    <div>
      <div className="vit-row-lbl">After transformer encoding — final [CLS] representation:</div>
      <div className="vit-seq">
        <div className="vit-cls-tok">[CLS] → W_cls → logits</div>
      </div>
      <div className="vit-detail-section">
        <div className="vit-embed-row">
          {['quad_r_g_b_y', 'all_red', 'all_blue', 'stripes'].map((lbl, i) => (
            <div key={lbl} className={`vit-embed-cell ${i === 0 ? 'vit-embed-hi' : 'vit-embed-lo'}`}>
              {i === 0 ? '0.94' : ['0.02', '0.03', '0.01'][i - 1]}
            </div>
          ))}
        </div>
        <div className="vit-row-lbl">
          quad_pattern(0.94) &nbsp;·&nbsp; all_red(0.02) &nbsp;·&nbsp; all_blue(0.03) &nbsp;·&nbsp; stripes(0.01)
        </div>
      </div>
      <p className="vit-cmp-body">
        [CLS] attended to all 16 patches and recognised the 4-quadrant pattern with 94% confidence.
        In a real ViT, this output would be over ImageNet's 1,000 classes.
      </p>
    </div>
  );
};

const SYN_NOTES = [
  { id: 'a', text: 'The [CLS] token has no inherent meaning — it starts as a learnable parameter (random at init). After training, it learns to aggregate the most task-relevant information from all patches via attention.' },
  { id: 'b', text: 'ViT-B/16 (the "base" model) has 12 transformer layers, 12 attention heads, d_model=768. Total: ~86M parameters. ViT-G/14 (giant) has 1.8B parameters and 90.45% ImageNet top-1.' },
  { id: 'c', text: 'CNNs failed to scale beyond certain depths before residual connections. ViTs scale predictably with data and parameters — doubling the training data reliably improves accuracy. No saturation observed at current scales.' },
  { id: 'd', text: 'Modern variants like DeiT (Data-efficient image Transformers) achieve ViT accuracy with 10× less training data, using knowledge distillation from a CNN teacher. The inductive bias gap can be recovered via training techniques.' },
];

export const S2E3Synapse: React.FC = () => {
  const [step, setStep] = useState(0);
  const s = SYN_STEPS[step];

  return (
    <div className="ml-synapse">
      <div className="syn-intro">
        <div className="syn-intro-lead">Synapse · ViT Pipeline</div>
        <p className="syn-intro-body">
          Pre-loaded: the same 8×8 four-color image. Step through every stage of the
          Vision Transformer forward pass — from raw pixels to a classification decision.
          Every transformation uses the exact values from the Playground.
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

      {/* Step card */}
      <div className="bp-step-card">
        <div className="bp-step-header">
          <span className="bp-step-badge">{s.badge}</span>
          <span className="bp-step-title">{s.title}</span>
        </div>
        <p className="bp-step-desc">{s.desc}</p>
        <SynapseVisual v={s.visual} />
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
