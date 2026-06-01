import React from 'react';
import type { Arc, Episode } from '../../../types';

// ── SIGNAL ─────────────────────────────────────────────────────────────────────
export const S2E2Signal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// ARCHITECTURE · S2E2 · {episode?.title ?? 'THE TRANSFORMER'}</div>
      <h2 className="ml-mani-h">
        Parallel. Scalable. No memory of order.
        <br />
        <em className="ml-mani-em">That's why it needed positional encoding.</em>
      </h2>
      <p className="ml-mani-p">
        Johan Liebert was the perfect architecture — self-contained, parallelizable,
        infinitely scalable in his influence. He processed the entire room simultaneously,
        not one person at a time. The Transformer does the same. Unlike RNNs, it sees
        the entire sequence at once. But that means it has no inherent sense of order —
        so we inject position directly into the representation.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">THE TRANSFORMER ENCODER</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ep-stub-concepts">
      {[
        { tag: 'POSITIONAL ENCODING', text: 'PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(...). Added to embeddings before the first layer. Gives the model a unique fingerprint for every position in the sequence.' },
        { tag: 'MULTI-HEAD ATTENTION', text: 'Split Q, K, V into h heads. Each head projects to d_k = d_model/h dimensions and runs independent attention. Concatenate all heads, project back. Each head can specialize in a different type of relationship.' },
        { tag: 'RESIDUAL + LAYER NORM', text: 'Output = LayerNorm(x + Sublayer(x)). The residual connection lets gradients flow around the sublayer, preventing vanishing. Layer normalization stabilizes training across the batch.' },
        { tag: 'FEED-FORWARD', text: 'A 2-layer MLP applied independently to each position: FFN(x) = max(0, xW₁ + b₁)W₂ + b₂. Typically d_ff = 4 × d_model. This is where "factual" knowledge is often stored in large models.' },
        { tag: 'WHY LEARNED > SINUSOIDAL', text: 'Learned positional embeddings sometimes outperform sinusoidal at fine-grained position awareness within the training distribution. Sinusoidal generalizes better to longer sequences never seen during training.' },
      ].map(c => (
        <div key={c.tag} className="ep-stub-concept">
          <span className="ep-stub-c-tag">{c.tag}</span>
          <span className="ep-stub-c-text">{c.text}</span>
        </div>
      ))}
    </div>

    <div className="ml-callout">
      <div className="ml-callout-label">COMING IN THIS EPISODE:</div>
      <div className="ml-callout-items">
        <span>Playground: Full transformer encoder — step through each component on a real sentence</span>
        <span>Visualize how positional encoding adds unique patterns to each token's embedding</span>
        <span>Synapse: Assemble a working transformer encoder block from its four components</span>
      </div>
    </div>
  </div>
);

export const S2E2Playground: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">⚡</div>
      <div className="ep-stub-coming-label">Transformer Walkthrough — Batch 4</div>
      <p className="ep-stub-coming-sub">
        Enter a sentence and step through the encoder layer by layer: positional encoding
        injection → multi-head attention → residual + norm → feed-forward → residual + norm.
        Every tensor shape shown at each stage.
      </p>
    </div>
  </div>
);

export const S2E2Synapse: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">◈</div>
      <div className="ep-stub-coming-label">Encoder Block Builder — Batch 4</div>
      <p className="ep-stub-coming-sub">
        Assemble the encoder block by connecting its components in the right order.
        Configure the number of heads, d_model, and d_ff. Run a forward pass and verify
        that residual connections keep gradients healthy.
      </p>
    </div>
  </div>
);
