import React from 'react';
import type { Arc, Episode } from '../../../types';

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
        For thirty years, convolutional neural networks owned computer vision. Then in 2020,
        "An Image Is Worth 16×16 Words" appeared. A pure transformer — no convolutions, no
        inductive locality bias — trained on enough data, it matched and then surpassed ResNets.
        The old order collapsed. Ruhenheim orchestrated exactly this: everyone turned on each other,
        and the thing that had always seemed invincible simply stopped being necessary.
      </p>
    </div>

    <div className="ml-sec-hdr">
      <span className="ml-sec-id">01</span>
      <span className="ml-sec-ttl">VISION TRANSFORMERS (ViT)</span>
      <div className="ml-sec-line" />
    </div>
    <div className="ep-stub-concepts">
      {[
        { tag: 'PATCH EMBEDDING', text: 'Split the 224×224 image into 16×16 patches (196 patches total). Flatten each patch into a 768-dim vector. Project linearly. Now you have a sequence of 196 "tokens" — just like words in a sentence.' },
        { tag: '[CLS] TOKEN', text: 'Prepend a learnable [CLS] token to the sequence. After all transformer layers, the [CLS] representation is used for classification. It has attended to all 196 patches and aggregated their information.' },
        { tag: 'POSITIONAL ENCODING', text: 'Patches lose their spatial arrangement when flattened. Learned 2D positional embeddings are added, letting the model recover which patch was at which position.' },
        { tag: 'WHY ViTs SCALE', text: 'CNNs have built-in inductive bias: locality and translation invariance. ViTs have none. They need more data to learn these properties from scratch — but once trained on enough data, their global attention outperforms local convolutions on every benchmark.' },
        { tag: 'vs. ResNet-50', text: 'On ImageNet-21k, ViT-B/16 achieves 84.5% top-1 accuracy vs ResNet-50\'s 79.0%. The gap widens with scale. ViT-G achieves 90.45% — state of the art at its release.' },
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
        <span>Playground: Upload any image — watch it split into 16×16 patches and embed into token space</span>
        <span>Visualize attention: which patches does [CLS] attend to most when classifying?</span>
        <span>Synapse: Implement patch embedding + positional encoding + the ViT forward pass</span>
      </div>
    </div>
  </div>
);

export const S2E3Playground: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">◫</div>
      <div className="ep-stub-coming-label">Patch Embedding Visualizer — Batch 5</div>
      <p className="ep-stub-coming-sub">
        Upload any image and watch it transform: divided into 16×16 patches, each flattened
        and projected into embedding space. Attention maps show which patches the [CLS] token
        focuses on for the final classification.
      </p>
    </div>
  </div>
);

export const S2E3Synapse: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">⊠</div>
      <div className="ep-stub-coming-label">ViT Forward Pass — Batch 5</div>
      <p className="ep-stub-coming-sub">
        Build the full ViT pipeline: patch splitting → linear projection → add [CLS] token
        → add positional embeddings → transformer encoder → classification head.
        Verify that your patch sequence encodes all spatial information.
      </p>
    </div>
  </div>
);
