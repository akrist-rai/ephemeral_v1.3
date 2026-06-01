import React from 'react';
import type { Arc, Episode } from '../../../types';

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
        Dr. Tenma's guilt moved backwards through every decision he ever made — each choice's
        consequence flowing back to reshape how he understood the ones before it. Backpropagation
        works identically. The loss signal at the output ripples backward through every weight,
        each one adjusted by exactly its share of the blame.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">THE CHAIN RULE</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ep-stub-concepts">
      {[
        { tag: 'CORE IDEA', text: 'The gradient of the loss with respect to any weight equals the product of all partial derivatives along the path from that weight to the output. This is the multivariate chain rule.' },
        { tag: 'THE MATH', text: '∂L/∂w = (∂L/∂ŷ) · (∂ŷ/∂z) · (∂z/∂w). Each term is a local derivative computed at that layer. Chain them together and you have the full gradient.' },
        { tag: 'GRADIENT DESCENT', text: 'Once you have ∂L/∂w for every weight, update: w ← w − η·(∂L/∂w), where η is the learning rate. Repeat on every training example until the loss converges.' },
        { tag: 'VANISHING GRADIENT', text: 'Sigmoid\'s derivative σ(z)·(1−σ(z)) peaks at 0.25 and approaches 0 at both extremes. In deep networks, chaining many of these multiplied gradients produces numbers vanishingly close to zero. Early layers stop learning.' },
        { tag: 'THE FIX', text: 'ReLU: max(0, z). Its derivative is exactly 1 for all z > 0. The gradient passes through unchanged. Deep networks became trainable.' },
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
        <span>Playground: Backprop visualizer — watch gradients flow backward</span>
        <span>Synapse: Implement one full gradient descent step by hand</span>
        <span>See vanishing gradients happen in real-time with sigmoid vs ReLU</span>
      </div>
    </div>
  </div>
);

export const S1E3Playground: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">⛓</div>
      <div className="ep-stub-coming-label">Backprop Visualizer — Batch 2</div>
      <p className="ep-stub-coming-sub">
        An interactive 3-layer network where you'll watch the loss gradient ripple
        backward through each weight in real-time. Includes sigmoid vs ReLU comparison
        showing exactly where gradients vanish.
      </p>
    </div>
  </div>
);

export const S1E3Synapse: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">∂</div>
      <div className="ep-stub-coming-label">Gradient Descent Challenge — Batch 2</div>
      <p className="ep-stub-coming-sub">
        Given a 2-layer network's current weights and one training example, compute
        every gradient manually using the chain rule. Apply the update. Verify convergence.
        Pure math, no shortcuts.
      </p>
    </div>
  </div>
);
