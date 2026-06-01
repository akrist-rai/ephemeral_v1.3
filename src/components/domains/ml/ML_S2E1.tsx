import React from 'react';
import type { Arc, Episode } from '../../../types';

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
        Inspector Lunge mentally filed every piece of evidence — attending to specific details
        while filtering out noise. When Tenma spoke, Lunge didn't process each word equally:
        "killed" and "Ruhenheim" lit up his internal map. The attention mechanism formalizes
        this exactly. Every token asks: which other tokens are relevant to understanding me?
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">SCALED DOT-PRODUCT ATTENTION</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ep-stub-concepts">
      {[
        { tag: 'THE FORMULA', text: 'Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V. Q is "what am I looking for", K is "what do I offer", V is "what I actually contain". The dot product scores relevance.' },
        { tag: 'Q / K / V', text: 'Every token is projected into three spaces: Query (Q), Key (K), and Value (V). These are learned linear projections — the model decides what "looking for" and "offering" means.' },
        { tag: 'SCALING BY √d_k', text: 'Without scaling, dot products in high-dimensional space grow large, pushing softmax into near-zero gradient regions. Dividing by √d_k keeps the distribution spread out and gradients healthy.' },
        { tag: 'SOFTMAX → WEIGHTS', text: 'softmax(scores) converts raw attention scores into a probability distribution over all tokens. Each token receives a share of attention that sums to 1 across the sequence.' },
        { tag: 'THE OUTPUT', text: 'Multiply softmax weights by V matrix. High-attention tokens contribute more to the output. The result is a weighted combination of all values, filtered by relevance.' },
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
        <span>Playground: Type a sentence — see the attention heatmap between every pair of tokens</span>
        <span>Watch how "it" in "The animal didn't cross the street because it was tired" attends to "animal"</span>
        <span>Synapse: Implement scaled dot-product attention in full — Q, K, V projections to output</span>
      </div>
    </div>
  </div>
);

export const S2E1Playground: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">Q·K·V</div>
      <div className="ep-stub-coming-label">Attention Heatmap — Batch 3</div>
      <p className="ep-stub-coming-sub">
        Enter any sentence. The visualizer tokenizes it and displays a live attention weight
        matrix — each cell showing how much token i attends to token j. Watch pronouns resolve
        to their referents, verbs attend to their subjects, adjectives attend to the nouns they modify.
      </p>
    </div>
  </div>
);

export const S2E1Synapse: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">⊛</div>
      <div className="ep-stub-coming-label">Attention Builder — Batch 3</div>
      <p className="ep-stub-coming-sub">
        Given a small sequence, project it into Q, K, V spaces using sliders to control
        the projection weights. Compute the attention scores, apply scaling and softmax,
        and produce the final output. Every step exposed.
      </p>
    </div>
  </div>
);
