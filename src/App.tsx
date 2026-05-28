import React, { useState, useEffect, useRef } from 'react';

// --- EXACT DATA MODELS FROM SOURCE ---
const ARCS = {
  1: [
    { n: 1, t: "Mommy, what is a neuron?", d: "The biological metaphor that sparked a revolution. Build the perceptron.", type: "quiz", min: 20, xp: 80, done: true, art: `┌────────┐\n│ ○   ○ │\n│   ─   │\n│NEURON │\n└────────┘`, bg: "#000d05" },
    { n: 2, t: "Mommy, why do we need layers?", d: "From XOR to deep nets. Why depth beats width and what a hidden layer learns.", type: "research", min: 30, xp: 120, done: true, art: `╔══════╗\n║LAYER1║\n║  │   ║\n║LAYER2║\n╚══════╝`, bg: "#050010" },
    { n: 3, t: "Mommy, what is backpropagation?", d: "The chain rule that trains the internet. Derive it by hand. Watch it fail.", type: "ctf", min: 40, xp: 180, done: true, art: `⛓ ⛓ ⛓\nCHAIN\nRULE\n⛓ ⛓ ⛓`, bg: "#0a0005" },
    { n: 4, t: "Mommy, why do we normalise data?", d: "Vanishing gradients, batch norm, layer norm — the unsung heroes.", type: "quiz", min: 25, xp: 100, done: false, art: `░░░░░░\n NORM \n░░░░░░`, bg: "#050010" },
    { n: 5, t: "Mommy, what is overfitting?", d: "Your model memorised the exam. Dropout, regularisation, early stopping.", type: "research", min: 35, xp: 140, done: false, art: `╲ ╱ ╲ ╱\n OVER ╲\n  FIT  \n╱ ╲ ╱ ╲`, bg: "#0d0003" },
  ],
  2: [
    { n: 1, t: "Mommy, what is attention?", d: "Query, Key, Value — explained through a library with no catalogues.", type: "research", min: 35, xp: 150, done: true, art: `Q·K·V\n ─── \n ATTN\n ─── `, bg: "#000d05" },
    { n: 2, t: "Mommy, what is a Transformer?", d: "Multi-head attention, positional encoding, feed-forward blocks assembled.", type: "quiz", min: 40, xp: 180, done: true, art: `⚡⚡⚡\nTRANS\nFORMER\n⚡⚡⚡`, bg: "#050010" },
    { n: 3, t: "Ruhenheim — Why Transformers dominate vision", d: "Like Johan in Ruhenheim, the ViT arrived and made everything else irrelevant.", type: "ctf", min: 45, xp: 250, done: false, active: true, art: `┌──────┐\n│RUHEN │\n│ HEIM │\n└──────┘`, bg: "#000d05" },
    { n: 4, t: "The Name Without a Monster — DALL·E", d: "How does a model that was never told what an eye looks like draw your face?", type: "research", min: 50, xp: 200, done: false, locked: true, art: `🎨 DIFF\nUSION\n MODEL`, bg: "#050010" },
    { n: 5, t: "The Final Patient — Fine-tuning", d: "LoRA, adapters, prompt tuning. You have a giant model. Now what?", type: "ctf", min: 45, xp: 220, done: false, locked: true, art: `TUNE\n────\nFINAL\nPATIENT`, bg: "#0a0005" },
  ]
};

const CHALLENGES = [
  { id: 'GRAD_001', tier: 1, cat: 'GRADIENT', pts: 100, diff: 1, title: 'The Silent Network', scenario: 'A 6-layer MLP stopped learning at epoch 1. The engineer logged gradient norms across all layers immediately after the first backward pass.', task: 'Find the index of the last layer where the gradient has vanished (norm < 0.0001). Layers are 1-indexed.', artifacts: [ { type: 'table', label: 'GRADIENT NORMS — EPOCH 1, STEP 1', content: 'Layer  │ Gradient Norm\n───────┼──────────────\n  1    │ 0.00000012\n  2    │ 0.00000089\n  3    │ 0.00000341\n  4    │ 0.00000008  ← \n  5    │ 0.48271000\n  6    │ 1.20443000\n' }, { type: 'config', label: 'MODEL CONFIG', content: 'activation : sigmoid\nweight_init: xavier_uniform\noptimizer  : adam\nlr         : 0.001' } ], flag: '4', attempts: 3, hint: 'Check which activation is configured and what its gradient saturation behaviour is.', ex: 'Sigmoid saturates — gradients near 0 or 1 output become ~0. Layer 4 shows the last vanished norm (0.00000008). Switch to ReLU.' },
  { id: 'VIT_001', tier: 1, cat: 'ARCHITECTURE', pts: 100, diff: 1, title: 'The Indivisible Head', scenario: 'A ViT training run crashes immediately at the first forward pass with a shape error. No code change was made — only the config was updated.', task: 'Find the value of the parameter that makes the head dimension non-integer. Submit the exact value from the config.', artifacts: [ { type: 'config', label: 'VIT CONFIG — CURRENT (BROKEN)', content: 'model_type   : vit-base\nimage_size   : 224\npatch_size   : 16\nembed_dim    : 768\nnum_heads    : 10\nnum_layers   : 12\nmlp_ratio    : 4\ndropout      : 0.1' }, { type: 'log', label: 'CRASH LOG', content: 'RuntimeError: embed_dim (768) must be\ndivisible by num_heads.\n768 / 10 = 76.8  ← not an integer\n\nTrace: MultiHeadAttention.forward() line 47' } ], flag: '10', attempts: 3, hint: 'Head dimension = embed_dim / num_heads. It must be a whole number.', ex: '768 / 10 = 76.8 — invalid. num_heads must divide 768 evenly. Valid values: 1,2,3,4,6,8,12,16,24,32,48,64,96,192,256,384,768.' },
  { id: 'DEPLOY_001', tier: 1, cat: 'INFERENCE', pts: 100, diff: 1, title: 'The Unstable Oracle', scenario: 'A deployed classifier returns different predictions for the same input on every call. The model was working fine in training. No randomness in the data pipeline.', task: 'Identify the exact configuration key that is set incorrectly for deployment. Submit its current value.', artifacts: [ { type: 'config', label: 'TRAINING CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train' }, { type: 'config', label: 'INFERENCE CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train   ← deployed as-is' }, { type: 'log', label: 'INFERENCE CALLS — SAME INPUT', content: 'call_1: [0.71, 0.18, 0.11]\ncall_2: [0.43, 0.39, 0.18]\ncall_3: [0.68, 0.22, 0.10]\n# predictions change every call\n# source: stochastic operation still active' } ], flag: 'train', attempts: 3, hint: 'What PyTorch operation produces different outputs each forward pass?', ex: 'model.train() keeps dropout active — random neurons zeroed each call. Deployment requires model.eval() which disables dropout and uses running BN stats.' },
  { id: 'ATTN_001', tier: 2, cat: 'GRADIENT', pts: 200, diff: 2, title: 'The Quadratic Wall', scenario: 'A ViT fine-tuning job OOMed (out of memory) on a 40GB A100. The engineer increased batch size from 32 to 64 and the job crashed. Config unchanged.', task: 'Calculate the number of elements in the attention matrix for ONE head in ONE layer. This is what gets stored in memory per head per layer. Submit the integer.', artifacts: [ { type: 'config', label: 'MODEL CONFIG', content: 'model        : vit-large-patch16\nimage_size   : 224\npatch_size   : 16\nembed_dim    : 1024\nnum_heads    : 16\nnum_layers   : 24\nseq_len      : 197   # 196 patches + 1 CLS' }, { type: 'log', label: 'MEMORY BREAKDOWN', content: 'Activations (fwd pass) : 18.4 GB\nGradients              :  9.2 GB\nAttention matrices     : 12.1 GB  ← spike\nOptimizer states       :  8.8 GB\n\nTotal: 48.5 GB > 40 GB limit\n# attention scales with batch × heads × layers × N²' } ], flag: '38809', attempts: 3, hint: 'seq_len=197. Attention matrix per head = seq_len × seq_len.', ex: '197 × 197 = 38,809 elements per attention matrix per head. With 16 heads × 24 layers × 64 batch = 16 heads × 24 × 64 × 38809 = huge. Flash Attention avoids storing this.' },
  { id: 'CONV_001', tier: 2, cat: 'ARCHITECTURE', pts: 200, diff: 2, title: 'The Shrinking Feature Map', scenario: 'A CNN encoder produces the wrong output shape for the decoder, causing a dimension mismatch error during skip connection concatenation.', task: 'Given the configuration, calculate the actual spatial dimension (H or W) of the feature map after the convolution stack. Submit the integer.', artifacts: [ { type: 'config', label: 'ENCODER BLOCK CONFIG', content: 'input_shape  : (batch, 64, 128, 128)\nconv1: kernel=3, stride=1, padding=0\nconv2: kernel=3, stride=1, padding=0\nconv3: kernel=3, stride=2, padding=0\n# formula: out = floor((in + 2p - k) / s) + 1' }, { type: 'log', label: 'DECODER EXPECTED SHAPE', content: 'skip_connection expects: (batch, 64, 64, 64)\nencoder produced:        (batch, 64, ???, ???)\n\nRuntimeError: Sizes of tensors must match\nexcept in dimension 1.' } ], flag: '61', attempts: 3, hint: 'Apply the formula three times. After conv1: (128+0-3)/1+1=126. After conv2: 124. After conv3 with stride=2: floor((124-3)/2)+1.', ex: 'Conv1: (128-3)/1+1=126. Conv2: (126-3)/1+1=124. Conv3: floor((124-3)/2)+1=61. Decoder expects 64 — padding=1 on each conv would fix it.' },
  { id: 'LEAK_001', tier: 2, cat: 'DATA', pts: 200, diff: 2, title: 'The Contaminated Pipeline', scenario: 'A classification model shows 97% validation accuracy but only 61% on the holdout test set. No architecture changes. Suspicion: data leakage.', task: 'Identify the exact function in the data pipeline where the leakage occurs. Submit the function name.', artifacts: [ { type: 'code', label: 'DATA PIPELINE — train_loader', content: 'def get_train_loader(data):\n    dataset = ImageDataset(data)\n    dataset = normalize(dataset)       # global stats\n    dataset = random_crop(dataset)     # augmentation\n    dataset = random_flip(dataset)     # augmentation\n    return DataLoader(dataset, shuffle=True)' }, { type: 'code', label: 'DATA PIPELINE — val_loader', content: 'def get_val_loader(data):\n    dataset = ImageDataset(data)\n    dataset = normalize(dataset)       # same stats\n    dataset = random_crop(dataset)     # ← still here\n    dataset = random_flip(dataset)     # ← still here\n    return DataLoader(dataset, shuffle=False)' }, { type: 'log', label: 'ACCURACY LOG', content: 'train_acc : 97.2%\nval_acc   : 97.1%  ← suspiciously close\ntest_acc  : 61.3%  ← real performance\n# val_acc should be lower than train_acc' } ], flag: 'normalize', attempts: 3, hint: 'The augmentation functions are wrong for val, but the leak is elsewhere. What statistics does normalize() use — and where were they computed?', ex: 'normalize() computes mean/std over the entire dataset including test. This leaks test distribution into training via the normalisation statistics. Fix: compute stats on train split only.' },
  { id: 'SILENT_001', tier: 3, cat: 'INFERENCE', pts: 400, diff: 3, title: 'The Confident Fool', scenario: 'A 3-class classifier always outputs near-uniform probabilities regardless of input. The model trained fine. Loss converged. No error is thrown.', task: 'Find the dimension argument passed to softmax that is causing the bug. Submit the integer.', artifacts: [ { type: 'code', label: 'MODEL FORWARD PASS', content: 'class Classifier(nn.Module):\n    def forward(self, x):\n        # x shape: (batch=4, classes=3)\n        x = self.fc(x)      # linear layer\n        x = F.softmax(x, dim=0)  # ← dim?\n        return x' }, { type: 'log', label: 'ACTUAL OUTPUT — 4 SAMPLES', content: '# softmax applied, all values sum correctly\nsample_1: [0.31, 0.36, 0.33]  # uniform?\nsample_2: [0.28, 0.38, 0.34]  # uniform?\nsample_3: [0.25, 0.39, 0.36]  # uniform?\nsample_4: [0.29, 0.37, 0.34]  # uniform?\n\n# column sums: [1.13, 1.50, 1.37] ← wrong axis\n# row sums:    [1.0,  1.0,  1.0,  1.0]' }, { type: 'log', label: 'CORRECT OUTPUT (expected)', content: 'sample_1: [0.81, 0.12, 0.07]  # confident\nsample_2: [0.03, 0.95, 0.02]  # confident\nsample_3: [0.11, 0.08, 0.81]  # confident\nsample_4: [0.67, 0.23, 0.10]  # confident\n\n# softmax should operate over CLASSES (dim=1)\n# not over BATCH (dim=0)' } ], flag: '0', attempts: 3, hint: 'For a (batch, classes) tensor, which dimension contains the class scores for a single sample?', ex: 'dim=0 applies softmax across the batch dimension — normalising across samples, not classes. This forces near-uniform outputs. dim=1 normalises across classes per sample, giving confident predictions.' },
  { id: 'FLASH_001', tier: 3, cat: 'ARCHITECTURE', pts: 400, diff: 3, title: 'The Exact Algorithm', scenario: 'An engineer claims Flash Attention is an approximation — that it trades accuracy for speed. You have output from both implementations on the same input.', task: 'Compare the two outputs. Are they mathematically equivalent? Submit YES or NO, then the maximum absolute difference between the outputs (rounded to 6 decimal places).', artifacts: [ { type: 'table', label: 'STANDARD ATTENTION OUTPUT — first 4 values', content: 'position │ value\n─────────┼─────────────────\n  [0,0]  │  0.34821947\n  [0,1]  │ -0.12043881\n  [0,2]  │  0.87234102\n  [0,3]  │ -0.44103928' }, { type: 'table', label: 'FLASH ATTENTION OUTPUT — first 4 values', content: 'position │ value\n─────────┼─────────────────\n  [0,0]  │  0.34821947\n  [0,1]  │ -0.12043881\n  [0,2]  │  0.87234102\n  [0,3]  │ -0.44103928' }, { type: 'log', label: 'IMPLEMENTATION NOTE', content: '# Flash Attention v2 — Dao et al. 2023\n# Tiled computation in SRAM\n# Never materialises N×N matrix in HBM\n# Result: identical to O(N²) standard attention\n# Speed gain comes from IO-awareness\n#   not from numerical approximation' } ], flag: 'YES_0.000000', attempts: 3, hint: 'Subtract each value pair. The claim about approximation is the key misconception to resolve.', ex: 'Flash Attention is mathematically exact — the outputs are identical to floating-point precision. Speed and memory gains come from IO-awareness (tiled SRAM computation), not approximation. Max diff = 0.000000.' },
  { id: 'RESNET_001', tier: 3, cat: 'ARCHITECTURE', pts: 400, diff: 3, title: 'The Parameter Myth', scenario: 'A team is choosing between ResNet-50 and VGG-16 for a memory-constrained deployment (max 30M parameters). Their notes say "VGG is lighter than ResNet". The decision will be made on this assumption.', task: 'Calculate the approximate parameter count for each architecture from the configs. Which model fits the 30M constraint? Submit its name exactly as shown.', artifacts: [ { type: 'config', label: 'RESNET-50 ARCHITECTURE SUMMARY', content: 'conv1     :   64 filters, 7×7      →    9,408 params\nres_block1:  256 channels, ×3     →    215,808\nres_block2:  512 channels, ×4     →  1,218,048\nres_block3: 1024 channels, ×6     →  7,098,368\nres_block4: 2048 channels, ×3     →  14,966,784\nfc_layer  : 2048→1000             →  2,049,000\n─────────────────────────────────────────────\nTOTAL      :                         ~25,557,032' }, { type: 'config', label: 'VGG-16 ARCHITECTURE SUMMARY', content: 'conv_block1:   64 channels, 2 layers →      38,720\nconv_block2:  128 channels, 2 layers →     221,440\nconv_block3:  256 channels, 3 layers →   1,475,328\nconv_block4:  512 channels, 3 layers →   5,899,776\nconv_block5:  512 channels, 3 layers →   7,079,424\nfc1        : 25088 → 4096           → 102,764,544\nfc2        :  4096 → 4096           →  16,781,312\nfc3        :  4096 → 1000           →   4,097,000\n─────────────────────────────────────────────────\nTOTAL      :                           ~138,357,544' }, { type: 'log', label: 'DEPLOYMENT CONSTRAINT', content: 'max_params : 30,000,000\n# Team assumption: VGG-16 < ResNet-50\n# This assumption is ???' } ], flag: 'RESNET-50', attempts: 3, hint: 'Read the totals. The assumption in the deployment note is the bug.', ex: 'ResNet-50: ~25.6M params. VGG-16: ~138.4M params. VGG-16 has 5× MORE parameters — mostly from the three fully-connected layers (fc1 alone has 102M). ResNet-50 is the only option within the 30M constraint.' },
];

// --- EXACT SOURCE CSS (With aggressive overriding for Preview sandboxes) ---
const EXACT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Space+Grotesk:wght@300;400;700&display=swap');

/* Strict reset to override React Canvas Defaults */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root, .ephemeral-app {
  --void:#06060e;--void2:#0d0d1a;--red:#e8000d;--lime:#b9ff00;--crt:#00ff41;
  --paper:#f0ede6;--muted:#42425a;--dim:#1a1a2e;
  --mono:'Share Tech Mono',monospace;--disp:'Bebas Neue',sans-serif;--body:'Space Grotesk',sans-serif;
}

html, body, #root { 
  background-color: var(--void) !important; 
  color: var(--paper) !important; 
  margin: 0 !important; 
  padding: 0 !important; 
  min-height: 100vh !important; 
  width: 100% !important;
}

.ephemeral-app {
  background: var(--void);
  color: var(--paper);
  font-family: var(--mono);
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

.scr{display:none;min-height:100vh;flex-direction:column}
.scr.on{display:flex}

/* BINARY WALLPAPER */
.bin-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.bin-bg span{display:block;font-family:var(--mono);font-size:.42rem;color:rgba(0,255,65,.05);line-height:1.5;letter-spacing:.04em;word-break:break-all;padding:.5rem}

/* HUD CORNERS */
.hc{position:absolute;width:14px;height:14px;border-color:var(--red);border-style:solid}
.hc.tl{top:6px;left:6px;border-width:1.5px 0 0 1.5px}
.hc.tr{top:6px;right:6px;border-width:1.5px 1.5px 0 0}
.hc.bl{bottom:6px;left:6px;border-width:0 0 1.5px 1.5px}
.hc.br{bottom:6px;right:6px;border-width:0 1.5px 1.5px 0}
.hc.lime{border-color:var(--lime)}
.hc.crt{border-color:var(--crt)}
.hc.sm{width:9px;height:9px}
.hc.sm.tl{top:4px;left:4px}.hc.sm.tr{top:4px;right:4px}
.hc.sm.bl{bottom:4px;left:4px}.hc.sm.br{bottom:4px;right:4px}

/* DITHER */
.dith{position:absolute;inset:0;pointer-events:none;z-index:1;background-image:radial-gradient(circle,rgba(0,0,0,.55) 1px,transparent 1px);background-size:3.5px 3.5px;transition:opacity .3s}

/* SCANLINES */
.scan{position:absolute;inset:0;pointer-events:none;z-index:2;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px)}

/* ── NAV ── */
nav{display:flex;align-items:center;padding:0 1.4rem;height:46px;position:sticky;top:0;z-index:100;background:rgba(6,6,14,.96);border-bottom:1px solid rgba(232,0,13,.3);flex-shrink:0}
.logo{font-family:var(--disp);font-size:1.4rem;letter-spacing:.2em;cursor:pointer;color:var(--paper)}
.logo em{color:var(--red);font-style:normal}
.logo::after{content:'_';color:var(--red);animation:blink 1s infinite}
@keyframes blink{50%{opacity:0}}
.nav-mid{display:flex;gap:1.2rem;margin-left:1.8rem}
.nav-mid a{font-size:.58rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:color .2s;text-decoration:none}
.nav-mid a:hover,.nav-mid a.on{color:var(--paper)}
.nav-mid a.on{color:var(--red)}
.nav-r{margin-left:auto;display:flex;gap:.8rem;align-items:center}
.nav-status{font-size:.48rem;color:var(--muted);letter-spacing:.1em}
.nav-dot{display:inline-block;width:5px;height:5px;background:var(--crt);border-radius:50%;margin-right:.3rem;animation:pulse 2s infinite}
@keyframes pulse{50%{opacity:.25}}
.nav-uid{color:var(--crt);font-size:.5rem}
.nav-btn{background:none;border:1px solid rgba(232,0,13,.35);color:var(--red);padding:.22rem .6rem;font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;cursor:pointer;transition:all .2s}
.nav-btn:hover{background:rgba(232,0,13,.08)}

/* ── HERO ── */
.hero{display:grid;grid-template-columns:340px 1fr;grid-template-rows:auto auto;min-height:460px;position:relative;border-bottom:1px solid rgba(232,0,13,.2)}
.hero-left{background:var(--red);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;grid-row:1/3}
.hero-left-inner{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:1.5rem 1rem}
.hero-left .scan{opacity:.5}
.hero-ascii{font-family:var(--mono);font-size:.52rem;line-height:1.35;color:#fff;white-space:pre;text-align:center;text-shadow:1px 1px 0 rgba(0,0,0,.6);letter-spacing:.02em}
.hero-ascii-label{font-size:.45rem;letter-spacing:.18em;color:rgba(255,255,255,.5);text-transform:uppercase;border-top:1px solid rgba(255,255,255,.2);padding-top:.4rem;width:100%;text-align:center}
.hero-vol-tag{font-family:var(--disp);font-size:.95rem;letter-spacing:.15em;color:rgba(255,255,255,.12);position:absolute;bottom:1.2rem;right:.8rem;line-height:1}

/* hero-right top */
.hero-right{background:var(--void);position:relative;padding:1.5rem 1.8rem 1rem;display:flex;flex-direction:column;justify-content:center;overflow:hidden;border-left:2px solid rgba(255,255,255,.06)}
.hero-hud-data{display:flex;justify-content:space-between;font-size:.46rem;color:var(--muted);letter-spacing:.1em;margin-bottom:1.2rem}
.hero-hud-data span{color:var(--red)}
.hero-eyebrow{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem}
.pill-live{background:var(--red);color:#fff;font-size:.52rem;padding:.18rem .55rem;letter-spacing:.1em;font-weight:700}
.pill-ep{font-size:.5rem;color:var(--muted);letter-spacing:.1em}
.pill-ep::before{content:'// ';color:var(--red)}
.hero-title{font-family:var(--disp);font-size:clamp(2.5rem,5vw,4rem);line-height:.92;letter-spacing:.05em;margin-bottom:.5rem}
.hero-title .hl{color:var(--red);display:block}
.hero-title .sub{font-family:var(--mono);font-size:.32em;letter-spacing:.18em;color:var(--muted);display:block;margin-top:.4rem}
.hero-desc{font-size:.7rem;color:var(--muted);line-height:1.75;max-width:400px;margin:1rem 0 1.2rem;font-family:var(--mono)}
.hero-btns{display:flex;gap:.6rem}
.btn-r{background:var(--red);color:#fff;border:none;padding:.5rem 1.4rem;font-family:var(--mono);font-size:.6rem;letter-spacing:.12em;cursor:pointer;text-transform:uppercase;transition:background .2s}
.btn-r::after{content:' ▶'}
.btn-r:hover{background:#c8000b}
.btn-o{background:none;color:var(--paper);border:1px solid rgba(240,237,230,.18);padding:.5rem 1.1rem;font-family:var(--mono);font-size:.6rem;letter-spacing:.12em;cursor:pointer;text-transform:uppercase;transition:border-color .2s}
.btn-o:hover{border-color:rgba(240,237,230,.45)}

/* hero bottom bar */
.hero-bottom{grid-column:1/-1;background:rgba(232,0,13,.04);border-top:1px solid rgba(232,0,13,.18);padding:.4rem 1.8rem;display:flex;gap:2rem;align-items:center;font-size:.45rem;color:var(--muted);letter-spacing:.1em}
.hb-stat{display:flex;flex-direction:column;gap:.1rem}
.hb-n{font-family:var(--disp);font-size:1.6rem;letter-spacing:.08em;color:var(--red);line-height:1}
.hb-l{font-size:.45rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase}
.hb-div{width:1px;height:30px;background:rgba(255,255,255,.06)}
.hb-right{margin-left:auto;display:flex;gap:2rem;align-items:center}
.hb-tag{font-size:.46rem;color:var(--muted);letter-spacing:.1em}
.hb-tag span{color:var(--crt)}

/* ── SECTION ── */
.sect{padding:1.2rem 1.4rem .6rem}
.sect-hdr{display:flex;align-items:center;gap:.7rem;margin-bottom:.9rem}
.sect-ttl{font-family:var(--disp);font-size:1.3rem;letter-spacing:.14em}
.sect-id{font-size:.46rem;color:var(--red);letter-spacing:.15em}
.sect-count{font-size:.46rem;color:var(--muted);letter-spacing:.1em;margin-left:auto}
.sect-more{font-size:.52rem;color:var(--lime);letter-spacing:.1em;cursor:pointer;margin-left:.8rem}
.sect-div{height:1px;background:linear-gradient(90deg,rgba(232,0,13,.3),rgba(232,0,13,.05) 60%,transparent);margin-bottom:1rem}

/* ── VOLUME CARDS (manga covers) ── */
.vol-row{display:grid;grid-template-columns:repeat(8,1fr);gap:.5rem;padding:0 0 .5rem}
.vc{position:relative;cursor:pointer;transition:transform .25s;overflow:hidden}
.vc:hover{transform:translateY(-7px) rotate(-.6deg);z-index:5}
.vc:hover .dith{opacity:0}
.vc-spine{width:100%;aspect-ratio:9/14;display:flex;flex-direction:column;border:1.5px solid rgba(255,255,255,.06)}
.vc-top{padding:.22rem .45rem;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;font-size:.42rem;letter-spacing:.1em}
.vc-top-name{color:rgba(0,0,0,.85);text-transform:uppercase;font-weight:700}
.vc-top-num{color:rgba(0,0,0,.6)}
.vc-art{flex:1;display:flex;align-items:center;justify-content:center;padding:.5rem .3rem;position:relative;overflow:hidden}
.vc-ascii{font-family:var(--mono);font-size:.34rem;line-height:1.3;color:rgba(240,237,230,.82);white-space:pre;text-align:center;position:relative;z-index:2}
.vc-bottom{border-top:2px solid var(--acc,var(--red));padding:.35rem .45rem;flex-shrink:0;background:var(--void)}
.vc-domain{font-family:var(--disp);font-size:.85rem;letter-spacing:.1em;color:var(--acc,var(--red));line-height:1}
.vc-arc{font-size:.38rem;color:var(--muted);letter-spacing:.08em;margin-top:.15rem;text-transform:uppercase}
.vc-prog{height:1px;background:rgba(255,255,255,.07);margin-top:.3rem;overflow:hidden}
.vc-pf{height:100%;background:var(--acc,var(--red))}

/* ── EPISODE CARDS (CP-Description style) ── */
.ep-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem}
.ec{background:var(--void);border:1px solid rgba(232,0,13,.2);position:relative;cursor:pointer;overflow:hidden;transition:border-color .2s}
.ec:hover{border-color:rgba(232,0,13,.6)}
.ec-type-bar{padding:.22rem .7rem;font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;display:flex;justify-content:space-between;align-items:center}
.ec-type-bar .hz{display:flex}
.hz-s{width:7px;height:16px;background:repeating-linear-gradient(45deg,rgba(0,0,0,.35) 0px,rgba(0,0,0,.35) 2.5px,transparent 2.5px,transparent 5px)}
.ec-body{padding:.6rem .75rem}
.ec-ref{font-size:.44rem;color:var(--muted);letter-spacing:.12em;margin-bottom:.25rem}
.ec-ref span{color:var(--ep-acc,var(--red))}
.ec-title{font-family:var(--disp);font-size:.95rem;letter-spacing:.06em;line-height:1.1;margin-bottom:.28rem}
.ec-desc{font-size:.56rem;color:var(--muted);line-height:1.6;margin-bottom:.45rem}
.ec-foot{display:flex;justify-content:space-between;font-size:.44rem;color:var(--muted);border-top:1px solid rgba(255,255,255,.04);padding-top:.35rem}
.ec-xp{color:var(--lime);font-weight:700}
.ec-arc{color:var(--ep-acc,var(--red))}

/* COORDINATE DECORATIONS */
.coord{position:absolute;font-size:.38rem;font-family:var(--mono);color:rgba(232,0,13,.35);letter-spacing:.08em;pointer-events:none}
.coord.tl{top:4px;left:16px}
.coord.tr{top:4px;right:16px}
.coord.bl{bottom:4px;left:16px}
.coord.br{bottom:4px;right:16px}

/* ANALYZE stripe */
.analyze{font-size:.42rem;letter-spacing:.25em;color:rgba(232,0,13,.3);text-align:center;padding:.35rem 0;border-top:1px solid rgba(232,0,13,.08)}
.analyze::before,.analyze::after{content:' ◆ ';color:rgba(232,0,13,.2)}

/* ── SERIES PAGE ── */
.series-hero{min-height:280px;position:relative;display:flex;align-items:flex-end;overflow:hidden}
.sh-left{width:220px;min-width:220px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
.sh-ascii{font-family:var(--mono);font-size:.5rem;line-height:1.35;color:#fff;white-space:pre;text-align:center;position:relative;z-index:2}
.sh-content{flex:1;padding:1.5rem 2rem;position:relative;z-index:2}
.sh-domain{font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.5rem}
.sh-title{font-family:var(--disp);font-size:3rem;letter-spacing:.06em;line-height:.92;margin-bottom:.6rem}
.sh-badges{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.7rem}
.badge{font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;padding:.18rem .5rem;font-weight:700}
.badge-g{background:rgba(0,255,65,.15);color:var(--crt)}
.badge-r{background:rgba(232,0,13,.18);color:var(--red)}
.badge-d{border:1px solid rgba(255,255,255,.12);color:var(--muted)}
.sh-desc{font-size:.72rem;color:var(--muted);max-width:500px;line-height:1.65;font-weight:300;font-family:var(--body)}

.arc-strip{display:flex;gap:.4rem;padding:.8rem 1.4rem;border-bottom:1px solid rgba(255,255,255,.05);align-items:center;flex-wrap:wrap}
.arc-label{font-size:.52rem;color:var(--muted);letter-spacing:.1em;margin-right:.3rem}
.arc-btn{background:none;border:1px solid rgba(255,255,255,.1);color:var(--muted);padding:.28rem .7rem;font-family:var(--mono);font-size:.55rem;letter-spacing:.08em;cursor:pointer;transition:all .2s;text-transform:uppercase}
.arc-btn.on,.arc-btn:hover{border-color:var(--red);color:var(--red);background:rgba(232,0,13,.05)}

.ep-list{padding:.8rem 1.4rem 2.5rem;display:flex;flex-direction:column;gap:.45rem}
.epr{display:flex;gap:.8rem;align-items:stretch;background:var(--void);border:1px solid rgba(255,255,255,.06);position:relative;cursor:pointer;transition:border-color .2s;overflow:hidden}
.epr::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0;background:var(--red);transition:width .2s}
.epr:hover{border-color:rgba(255,255,255,.15)}
.epr:hover::before{width:2px}
.epr.done{border-left:2px solid var(--crt)}
.epr.locked{opacity:.38;cursor:not-allowed}
.ep-n2{font-family:var(--disp);font-size:2.5rem;color:rgba(255,255,255,.06);min-width:52px;display:flex;align-items:center;justify-content:center;letter-spacing:.05em;padding:.5rem}
.ep-thumb2{width:110px;min-width:110px;height:68px;display:flex;align-items:center;justify-content:center;font-size:.4rem;align-self:center;position:relative;font-family:var(--mono);white-space:pre;line-height:1.3;color:rgba(240,237,230,.7);margin:.5rem 0;border:1px solid rgba(255,255,255,.06)}
.ep-info2{flex:1;padding:.75rem .7rem;min-width:0}
.ep-title2{font-size:.84rem;font-weight:700;letter-spacing:-.01em;margin-bottom:.25rem;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;font-family:var(--body)}
.ep-desc2{font-size:.68rem;color:var(--muted);line-height:1.55;font-family:var(--body);font-weight:300}
.ep-meta2{display:flex;gap:.7rem;margin-top:.4rem;font-size:.52rem;font-family:var(--mono);color:var(--muted);flex-wrap:wrap}
.xp2{color:var(--lime);font-weight:700}
.done-tag{color:var(--crt);font-weight:700}
.tp{font-size:.5rem;font-weight:700;padding:.12rem .42rem;letter-spacing:.08em;text-transform:uppercase}
.tp-ctf{background:rgba(232,0,13,.2);color:var(--red)}
.tp-res{background:rgba(185,255,0,.15);color:var(--lime)}
.tp-quiz{background:rgba(0,255,65,.12);color:var(--crt)}
.new-tag{background:var(--red);color:#fff;font-size:.48rem;font-weight:700;padding:.12rem .4rem;letter-spacing:.08em;text-transform:uppercase}

/* ── CHALLENGE PAGE ── */
.ch-wrap{max-width:800px;margin:0 auto;padding:1.2rem 1.8rem 3rem;width:100%}
.ch-back{background:none;border:none;color:var(--muted);font-family:var(--mono);font-size:.62rem;cursor:pointer;padding:0;display:flex;align-items:center;gap:.4rem;margin-bottom:1.2rem;letter-spacing:.08em;text-transform:uppercase;transition:color .2s}
.ch-back:hover{color:var(--paper)}
.ch-domain-tag{font-size:.52rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;padding:.2rem .55rem;margin-bottom:.6rem;display:inline-block}
.ch-ep-ref{font-size:.52rem;color:var(--muted);letter-spacing:.1em;margin-left:.8rem}
.ch-title{font-family:var(--disp);font-size:clamp(1.8rem,4vw,3rem);letter-spacing:.04em;line-height:.95;margin-bottom:.3rem}
.ch-title em{color:var(--red);font-style:normal}
.ch-sub{font-size:.68rem;color:var(--muted);font-style:italic;margin-bottom:1rem;font-family:var(--body);font-weight:300}
.ch-pills{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.2rem}
.ch-pill{font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .55rem;border:1px solid rgba(255,255,255,.1);color:var(--muted)}
.ch-pill.hl{border-color:rgba(232,0,13,.4);color:var(--red)}
.ch-pill.lm{border-color:rgba(185,255,0,.3);color:var(--lime)}

.tabs-l{display:flex;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:1.3rem}
.tl{background:none;border:none;color:var(--muted);font-family:var(--mono);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:.55rem 1.1rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .18s}
.tl.on{color:var(--red);border-bottom-color:var(--red)}
.tl:hover:not(.on){color:var(--paper)}
.tpane{display:none}
.tpane.on{display:block}

.mommy{background:rgba(232,0,13,.04);border-left:3px solid var(--red);padding:1rem 1.2rem;margin-bottom:1.3rem;position:relative}
.mommy-k{font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:var(--red);margin-bottom:.5rem;font-weight:700}
.mommy-q{font-family:var(--disp);font-size:1.3rem;letter-spacing:.03em;line-height:1.2}
.mommy .coord{color:rgba(232,0,13,.25)}

.bk{font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:.55rem;font-weight:700;font-family:var(--mono)}
.bp{font-size:.78rem;color:rgba(240,237,230,.65);line-height:1.75;font-family:var(--body);font-weight:300;margin-bottom:1.1rem}
.obj-list{display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.2rem}
.obj{display:flex;gap:.6rem;align-items:flex-start;font-size:.76rem;color:rgba(240,237,230,.65);font-family:var(--body);font-weight:300}
.obj-box{width:17px;height:17px;border:1px solid rgba(255,255,255,.15);flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:.6rem}
.obj-box.ok{background:var(--crt);border-color:var(--crt);color:#000;font-weight:700}

.res-list{display:flex;flex-direction:column;gap:.6rem}
.ri{display:flex;gap:.8rem;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);padding:.8rem .9rem;cursor:pointer;transition:border-color .2s;align-items:flex-start;position:relative}
.ri:hover{border-color:rgba(255,255,255,.15)}
.ri-icon{width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;font-family:var(--mono)}
.ri-body{flex:1;min-width:0}
.ri-title{font-size:.8rem;font-weight:700;margin-bottom:.2rem;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;font-family:var(--body)}
.ri-src{font-size:.58rem;font-family:var(--mono);color:var(--muted);letter-spacing:.04em}
.ri-desc{font-size:.7rem;color:var(--muted);margin-top:.2rem;line-height:1.5;font-family:var(--body);font-weight:300}
.rtag{font-size:.48rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:.14rem .42rem}
.rtag-p{background:rgba(185,255,0,.12);color:var(--lime)}
.rtag-v{background:rgba(232,0,13,.18);color:var(--red)}
.rtag-a{background:rgba(0,255,65,.1);color:var(--crt)}
.rtag-l{background:rgba(255,255,255,.07);color:var(--paper)}

/* ── CTF CHALLENGE CARD ── */
.chal-card{background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.08);padding:1.2rem 1.3rem;margin-bottom:.8rem;position:relative;transition:border-color .2s}
.chal-card.solved{border-color:rgba(0,255,65,.35)}
.chal-card.failed{border-color:rgba(232,0,13,.35)}
.chal-hdr{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;flex-wrap:wrap}
.chal-id{font-size:.52rem;color:var(--red);letter-spacing:.16em;font-family:var(--mono)}
.chal-cat{font-size:.48rem;background:rgba(255,255,255,.06);color:var(--muted);padding:.14rem .45rem;letter-spacing:.1em;text-transform:uppercase}
.chal-pts{margin-left:auto;font-family:var(--disp);font-size:1.05rem;color:var(--lime);letter-spacing:.08em;line-height:1}
.chal-title{font-family:var(--disp);font-size:1.35rem;letter-spacing:.05em;margin-bottom:.4rem;line-height:1.1}
.chal-body{font-size:.72rem;color:var(--muted);line-height:1.7;font-family:var(--body);font-weight:300;margin-bottom:.9rem;max-width:560px}

/* ARTIFACT */
.artifact{background:#020208;border:1px solid rgba(185,255,0,.12);padding:.8rem 1rem;margin-bottom:1rem;overflow-x:auto}
.artifact pre{font-family:var(--mono);font-size:.6rem;line-height:1.65;color:rgba(185,255,0,.75);white-space:pre;tab-size:2}

/* FLAG ZONE */
.flag-zone{border:1px solid rgba(255,255,255,.09);padding:.75rem 1rem;background:rgba(255,255,255,.015);transition:border-color .3s}
.flag-zone.solved-zone{border-color:rgba(0,255,65,.3);background:rgba(0,255,65,.03)}
.flag-zone.failed-zone{border-color:rgba(232,0,13,.3);background:rgba(232,0,13,.03)}
.flag-label{font-size:.48rem;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;margin-bottom:.5rem}
.flag-row{display:flex;align-items:center;gap:.3rem}
.flag-pre{font-family:var(--mono);font-size:.72rem;color:var(--red);flex-shrink:0;letter-spacing:.02em}
.flag-inp{flex:1;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.12);color:var(--crt);font-family:var(--mono);font-size:.72rem;padding:.18rem .3rem;outline:none;min-width:0;transition:border-color .2s;letter-spacing:.04em}
.flag-inp:focus{border-bottom-color:rgba(0,255,65,.5)}
.flag-inp::placeholder{color:rgba(255,255,255,.15)}
.flag-suf{font-family:var(--mono);font-size:.72rem;color:var(--red);flex-shrink:0}
.flag-sub{background:var(--red);color:#fff;border:none;padding:.3rem .85rem;font-family:var(--mono);font-size:.58rem;letter-spacing:.12em;cursor:pointer;text-transform:uppercase;flex-shrink:0;margin-left:.4rem;transition:background .18s}
.flag-sub:hover{background:#c8000b}
.flag-solved-row{font-family:var(--mono);font-size:.75rem;padding:.2rem 0}
.attempts-row{display:flex;align-items:center;gap:.4rem;margin-top:.5rem}
.att-dot{width:8px;height:8px;border-radius:50%}
.att-dot.live{background:var(--lime)}
.att-dot.dead{background:var(--red);opacity:.4}
.att-label{font-size:.48rem;color:var(--muted);letter-spacing:.1em;margin-left:.2rem}

/* HINT */
.hint-section{margin-top:.7rem}
.hint-toggle{background:none;border:none;color:var(--muted);font-family:var(--mono);font-size:.54rem;letter-spacing:.1em;cursor:pointer;padding:0;text-transform:uppercase;transition:color .18s}
.hint-toggle:hover{color:var(--paper)}
.hint-body{display:none;font-size:.7rem;color:#f9a825;background:rgba(249,168,37,.05);border-left:2px solid #f9a825;padding:.55rem .8rem;margin-top:.4rem;line-height:1.65;font-family:var(--body);font-weight:300}
.hint-body.on{display:block}
.expl{background:rgba(0,255,65,.04);border:1px solid rgba(0,255,65,.18);padding:.8rem .9rem;font-size:.72rem;color:rgba(200,255,230,.8);line-height:1.7;margin-top:.7rem;display:none;font-family:var(--body);font-weight:300}
.expl.on{display:block}

/* SHAKE ANIMATION */
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
.shake{animation:shake .35s ease-in-out}

/* ═══ ML INCIDENT RESPONSE — CTF STYLES ═══ */
.ctfb{background:#020608;padding:.85rem;min-height:460px}
.ctfb-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.6rem;gap:.5rem}
.ctfb-title{font-family:var(--disp);font-size:1.3rem;letter-spacing:.1em;color:var(--crt)}
.ctfb-sub{font-size:.55rem;color:var(--muted);font-family:var(--body);margin-top:.15rem}
.ctfb-score{text-align:right;flex-shrink:0}
.ctfb-pts{font-family:var(--disp);font-size:2.2rem;letter-spacing:.06em;color:var(--lime);line-height:1}
.ctfb-pts-lbl{font-size:.38rem;font-family:var(--mono);color:var(--muted);letter-spacing:.14em}
.ctfb-solved{font-size:.44rem;font-family:var(--mono);color:rgba(255,255,255,.2);margin-top:.1rem}
.ctfb-legend{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.7rem}
.ctfb-cat-pill{font-size:.38rem;font-family:var(--mono);letter-spacing:.1em;padding:.1rem .45rem;border:1px solid;text-transform:uppercase}
.ctfb-tier{margin-bottom:.9rem}
.ctfb-tier-label{font-size:.42rem;font-family:var(--mono);color:rgba(255,255,255,.2);letter-spacing:.14em;text-transform:uppercase;margin-bottom:.4rem;border-bottom:1px solid rgba(255,255,255,.05);padding-bottom:.25rem}
.ctfb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:.4rem}
.ctfb-card{border:1px solid rgba(255,255,255,.07);padding:.5rem .55rem;cursor:pointer;background:rgba(255,255,255,.01);transition:all .18s;position:relative;overflow:hidden}
.ctfb-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cat-color);opacity:.4}
.ctfb-card:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.035);transform:translateY(-2px)}
.ctfb-card:hover::before{opacity:1}
.ctfb-solved{border-color:rgba(0,255,65,.2)!important;background:rgba(0,255,65,.02)!important}
.ctfb-solved::before{background:var(--crt)!important;opacity:1!important}
.ctfb-failed{border-color:rgba(232,0,13,.15)!important;opacity:.5}
.ctfb-tried{border-color:rgba(249,168,37,.2)!important}
.ctfb-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem}
.ctfb-cat{font-size:.36rem;font-family:var(--mono);letter-spacing:.1em;text-transform:uppercase}
.ctfb-pts-badge{font-size:.38rem;font-family:var(--mono);color:var(--muted)}
.ctfb-check{font-size:.38rem;font-family:var(--mono);color:var(--crt)}
.ctfb-fail{font-size:.38rem;font-family:var(--mono);color:var(--red)}
.ctfb-card-title{font-size:.6rem;font-family:var(--body);font-weight:600;color:var(--paper);margin-bottom:.18rem;line-height:1.3}
.ctfb-card-id{font-size:.35rem;font-family:var(--mono);color:rgba(255,255,255,.18);letter-spacing:.06em;margin-bottom:.18rem}
.ctfb-card-diff{font-size:.45rem;color:rgba(255,255,255,.25);letter-spacing:.05em}

/* CHALLENGE PAGE */
.ctf-challenge-panel{background:#020608;padding:.85rem;min-height:460px}
.ctf-ch-head{display:flex;align-items:center;gap:.55rem;margin-bottom:.5rem;flex-wrap:wrap}
.ctf-back-btn{background:none;border:1px solid rgba(255,255,255,.1);color:var(--muted);font-family:var(--mono);font-size:.48rem;letter-spacing:.1em;padding:.2rem .6rem;cursor:pointer;text-transform:uppercase;transition:all .18s}
.ctf-back-btn:hover{color:var(--paper);border-color:rgba(255,255,255,.25)}
.ctf-ch-cat{font-size:.44rem;font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase}
.ctf-ch-id{font-size:.4rem;font-family:var(--mono);color:rgba(255,255,255,.2);letter-spacing:.08em}
.ctf-ch-pts{font-family:var(--disp);font-size:1rem;letter-spacing:.06em;margin-left:auto}
.ctf-ch-diff{font-size:.5rem;color:rgba(255,255,255,.3);letter-spacing:.04em}
.ctf-ch-title{font-family:var(--disp);font-size:1.4rem;letter-spacing:.08em;margin-bottom:.65rem;line-height:1.1}
.ctf-ch-layout{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;align-items:start}
.ctf-section-label{font-size:.38rem;font-family:var(--mono);color:rgba(255,255,255,.18);letter-spacing:.18em;text-transform:uppercase;margin-bottom:.25rem}
.ctf-scenario{font-size:.68rem;color:var(--muted);font-family:var(--body);line-height:1.65;margin-bottom:.5rem}
.ctf-task{font-size:.7rem;color:rgba(240,237,230,.8);font-family:var(--body);line-height:1.65;margin-bottom:.6rem;border-left:2px solid rgba(249,168,37,.4);padding-left:.6rem}
.ctf-artifact{margin-bottom:.5rem;border:1px solid rgba(255,255,255,.06);overflow:hidden}
.ctf-art-label{font-size:.36rem;font-family:var(--mono);color:rgba(255,255,255,.2);letter-spacing:.12em;text-transform:uppercase;padding:.25rem .5rem;background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.04)}
.ctf-art-body{font-family:var(--mono);font-size:.58rem;line-height:1.6;color:rgba(185,255,0,.7);padding:.5rem .6rem;white-space:pre;overflow-x:auto;background:#010605;margin:0}
.ctf-flag-solved{border:1px solid rgba(0,255,65,.25);padding:.5rem .7rem;background:rgba(0,255,65,.03);font-family:var(--mono);font-size:.68rem;margin-top:.5rem}

/* RESPONSIVE */
@media(max-width:1100px){ .vol-row{grid-template-columns:repeat(4,1fr)} }
@media(max-width:760px){ .ctf-ch-layout{grid-template-columns:1fr} .ctfb-grid{grid-template-columns:1fr 1fr} }
@media(max-width:720px){ .hero{grid-template-columns:1fr} .hero-left{grid-row:auto;min-height:180px} .vol-row{grid-template-columns:repeat(2,1fr)} .ep-row{grid-template-columns:repeat(2,1fr)} }

/* STATUS BAR */
.sbar{position:fixed;bottom:0;left:0;right:0;height:20px;background:rgba(6,6,14,.98);border-top:1px solid rgba(232,0,13,.18);display:flex;align-items:center;padding:0 1.4rem;gap:1.8rem;font-size:.42rem;color:var(--muted);letter-spacing:.1em;z-index:99;pointer-events:none}
.sbar-v{color:var(--crt)}
.sbar-sep{color:rgba(232,0,13,.3)}
.sbar-r{margin-left:auto;display:flex;gap:1.8rem}

/* TOAST */
.toast{position:fixed;bottom:36px;left:50%;transform:translateX(-50%) translateY(12px);background:rgba(13,13,26,.97);border:1px solid rgba(232,0,13,.4);color:var(--paper);font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;padding:.5rem 1.2rem;z-index:200;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
`;

const USER_ID = 'AK_0xD4';

export default function App() {
  const [screen, setScreen] = useState('s-home');
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);
  const [userXp, setUserXp] = useState(0);
  
  // CTF Global State
  const [gctf, setGctf] = useState(() => {
    const st = { solved: {}, active: null, chalAttempts: {}, hintOn: {}, phase: 'board' };
    CHALLENGES.forEach(c => st.chalAttempts[c.id] = c.attempts);
    return st;
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${USER_ID}`);
        const data = await res.json();
        if (data.success) {
          setUserXp(data.xp);
          const solved = {};
          const chalAttempts = {};
          CHALLENGES.forEach(c => chalAttempts[c.id] = c.attempts);
          
          data.progress.forEach(p => {
            solved[p.challengeId] = { 
              attempts_used: p.attemptsUsed, 
              pts_earned: p.pointsEarned,
              solved: p.solved 
            };
            chalAttempts[p.challengeId] = CHALLENGES.find(c => c.id === p.challengeId).attempts - p.attemptsUsed;
          });
          
          setGctf(prev => ({
            ...prev,
            solved: { ...prev.solved, ...solved },
            chalAttempts: { ...prev.chalAttempts, ...chalAttempts }
          }));
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      }
    };
    fetchProgress();
  }, []);

  // Series Global State
  const [curArc, setCurArc] = useState(1);
  const [chTab, setChTab] = useState('brief');

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToastShow(false); }, 2600);
  };

  const goHome = () => { setScreen('s-home'); window.scrollTo(0,0); };
  const showSeries = () => { setScreen('s-series'); window.scrollTo(0,0); };
  const showChallenge = () => { setScreen('s-ep'); setChTab('brief'); setGctf(prev => ({...prev, phase: 'board', active: null})); window.scrollTo(0,0); };
  const openLink = (u) => window.open(u, '_blank');

  // Binary background seed precisely reproduced
  const seed = '01001010 01001111 01001000 01000001 01001110 00100000 01001011 01001001 01001110 01000100 01000101 01010010 01001000 01000101 01001001 01001101 00100000 00110101 00110001 00110001 ';
  const binBgHtml = Array(48).fill(`<span>${seed.repeat(4)}</span>`).join('');

  return (
    <div className="ephemeral-app">
      <style dangerouslySetInnerHTML={{ __html: EXACT_CSS }} />
      
      {/* ════════════════ HOME ════════════════ */}
      <div className={`scr ${screen === 's-home' ? 'on' : ''}`} id="s-home">
        <nav>
          <div className="logo" onClick={goHome}><em>E</em>PHEMERAL</div>
          <div className="nav-mid">
            <a className="on">HOME</a>
            <a onClick={showSeries}>SERIES</a>
            <a onClick={() => showToast('RANKINGS // NODE COMING SOON')}>RANKINGS</a>
            <a onClick={() => showToast('THE FRIEND LIST // INVITE SYSTEM PENDING')}>THE FRIEND LIST</a>
          </div>
          <div className="nav-r">
            <span className="nav-status"><span className="nav-dot"></span>LIVE</span>
            <span className="nav-uid" style={{ color: 'var(--lime)', marginRight: '1rem' }}>XP// {userXp}</span>
            <span className="nav-uid">UID// {USER_ID}</span>
            <button className="nav-btn" onClick={() => showToast('SCAN INITIATED — NO THREATS DETECTED')}>⌘ SCAN</button>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-left">
            <div className="scan" style={{ opacity: .5 }}></div>
            <div className="hc tl"></div><div className="hc tr"></div><div className="hc bl"></div><div className="hc br"></div>
            <div className="coord tl">66.34 · 45.22</div>
            <div className="coord br">S2·E3·ML</div>
            <div className="hero-left-inner">
              <pre className="hero-ascii">
{`┌──────────────────┐
│ ░░░░░░░░░░░░░░░ │
│ ░  ─── ─── ░ │
│ ░░░░ ᵕ ░░░░ │
│ ░  ─────── ░ │
│ ░░░░░░░░░░░░░░░ │
│                  │
│  K · I · N · D  │
│  E · R · H · E  │
│  I · M  5 1 1   │
└──────────────────┘
J·O·H·A·N
──────────────────
SUBJECT_ALPHA
RUHENHEIM_NODE`}
              </pre>
              <div className="hero-ascii-label">MONSTER // ML SERIES</div>
            </div>
            <div className="hero-vol-tag">VOL.03</div>
          </div>

          <div className="hero-right">
            <div className="bin-bg" dangerouslySetInnerHTML={{ __html: binBgHtml }}></div>
            <div className="hc tl"></div><div className="hc br"></div>
            <div className="hero-hud-data">
              <span>CURR_DOMAIN: <span>ML_FUNDAMENTALS</span></span>
              <span>STATUS: <span>BROADCASTING</span></span>
              <span>NODE: <span>RUHENHEIM_511</span></span>
            </div>
            <div className="hero-eyebrow">
              <span className="pill-live">NEW EP</span>
              <span className="pill-ep">ML · S2 E3 · CTF_TYPE</span>
            </div>
            <div className="hero-title">
              JOHANS<span className="hl">LABYRINTH</span><span className="sub">// the monster without a name · domain series</span>
            </div>
            <div className="hero-desc">Each episode drops a child's question. You research. You enter the arena. The old doctor asks — you answer. Earn XP. Unlock the next node. There is no painless lesson.</div>
            <div className="hero-btns">
              <button className="btn-r" onClick={showChallenge}>PLAY S2 E3</button>
              <button className="btn-o" onClick={showSeries}>MORE INFO</button>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hb-stat"><div className="hb-n">48</div><div className="hb-l">Episodes</div></div>
            <div className="hb-div"></div>
            <div className="hb-stat"><div className="hb-n">8</div><div className="hb-l">Domains</div></div>
            <div className="hb-div"></div>
            <div className="hb-stat"><div className="hb-n">24K</div><div className="hb-l">Learners</div></div>
            <div className="hb-div"></div>
            <div className="hb-stat"><div className="hb-n">9.4★</div><div className="hb-l">Rating</div></div>
            <div className="hb-right">
              <span className="hb-tag">ARASAKA_OS: <span>V4.2.1 ACTIVE</span></span>
              <span className="hb-tag">PORT_STATUS: <span>OPEN</span></span>
              <span className="hb-tag">NETWORK: <span>ACN_EPHEMERAL</span></span>
            </div>
          </div>
        </div>

        <div className="sect">
          <div className="sect-hdr">
            <div className="sect-ttl">SERIES MANIFEST</div>
            <div className="sect-id">// DOMAIN_INDEX</div>
            <div className="sect-count">08 ACTIVE SERIES</div>
            <div className="sect-more" onClick={() => showToast('FULL MANIFEST // ALL SERIES COMING SOON')}>BROWSE ALL →</div>
          </div>
          <div className="sect-div"></div>
          <div className="vol-row">
            {[
              { t: 'The Eclipse', v: 'VOL1', acc: '#e8000d', bg: '#0d0003', a: `╲╲╲  ████  ╱╱╱\n   ████████\n    ██  ██\n  ◆ ██──██ ◆\n ══╬═══════╬══\n    ╙══╜\n ─ G U T S ─\n DRAGONSLAYER`, d: 'ALGORITHMS', arc: 'GOLDEN AGE ARC', w: '70%' },
              { t: 'Grand Line', v: 'VOL2', acc: '#1a7fd4', bg: '#00101a', a: `  .──────.\n / ◎    ◎\\\n│    ▽    │\n│ ─────── │\n \\       /\n  \`──┬──'\n ⚓──│──⚓\n GOMU_GOMU\n ENIES_LOBBY`, d: 'CYBERSECURITY', arc: 'MARINEFORD ARC', w: '25%' },
              { t: 'JOHANS LAB', v: 'VOL3', acc: '#00c85a', bg: '#000d05', a: `┌────────────┐\n│  ─── ─── │\n│     ᵕ     │\n│  ─────    │\n│           │\n│KINDERHEIM │\n│  511 511  │\n└────────────┘\n M O N S T E R\n  DR.TENMA`, d: 'MACHINE LEARNING', arc: 'MONSTER W/O NAME ARC', w: '40%' },
              { t: 'The Knot', v: 'VOL4', acc: '#d4810a', bg: '#0d0800', a: `1953 ──► 1986\n  ▲    ◇    │\n  │         ▼\n2052 ◄── 2019\n─── WINDEN ───\n T·H·E·K·N·O·T\n  ADAM / EVA\n TIME_KNOTEN`, d: 'NETWORKS', arc: '1953 CYCLE ARC', w: '55%' },
              { t: 'Prophecy', v: 'VOL5', acc: '#9b5fff', bg: '#080010', a: `╔═════════╗\n║ ★     ★ ║\n║         ║\n║  ─────  ║\n║ ╱     ╲ ║\n╚═════════╝\nともだち\nF·R·I·E·N·D\nEXPO_ARC`, d: 'DATA STRUCTURES', arc: 'THE FRIEND ARC', w: '15%' },
              { t: 'ONE PUNCH', v: 'VOL6', acc: '#f9a825', bg: '#0d0d00', a: `┌──────────┐\n│ ○      ○ │\n│    ─     │\n│          │\n└──────────┘\n┌──────────┐\n│   O K    │\n└──────────┘\n S·A·I·T·A·M·A\nGAROU_ARC`, d: 'COMP. PROG', arc: 'MONSTER ASSOC ARC', w: '0%' },
              { t: 'UNIT-01', v: 'VOL7', acc: '#4fc3f7', bg: '#00060d', a: `  ╱▲╲\n ╱ △ ╲\n╱─────╲\n│ Σ Π │\n│ ∫ λ │\n│MATRIX│\n╲─────╱\nEVA·UNIT\n NERV_HQ`, d: 'MATHEMATICS', arc: 'INSTRUMENTALITY ARC', w: '0%' },
              { t: 'LAB·MEM', v: 'VOL8', acc: '#ff7043', bg: '#0d0400', a: `┌─────────┐\n│ 0.337%  │\n│DIVERGE  │\n├─────────┤\n│ OKABE   │\n│ KURISU  │\n│ MAYURI  │\n└─────────┘\nEL_PSY_CON\n GROO_ARC`, d: 'PROBABILITY', arc: 'DIVERGENCE ARC', w: '0%' }
            ].map((v, i) => (
              <div className="vc" onClick={showSeries} key={i}>
                <div className="vc-spine" style={{ '--acc': v.acc }}>
                  <div className="vc-top" style={{ background: v.acc }}><span className="vc-top-name">{v.t}</span><span className="vc-top-num">{v.v}</span></div>
                  <div className="vc-art" style={{ background: v.bg }}>
                    <div className="dith"></div>
                    <pre className="vc-ascii">{v.a}</pre>
                  </div>
                  <div className="vc-bottom" style={{ '--acc': v.acc }}>
                    <div className="vc-domain" style={{ color: v.acc }}>{v.d}</div><div className="vc-arc">{v.arc}</div>
                    <div className="vc-prog"><div className="vc-pf" style={{ background: v.acc, width: v.w }}></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sect" style={{ paddingBottom: '2.5rem' }}>
          <div className="sect-hdr">
            <div className="sect-ttl">NEW TRANSMISSIONS</div>
            <div className="sect-id">// LIVE_EPISODES</div>
            <div className="sect-count">DROPPING THIS WEEK</div>
            <div className="sect-more" onClick={() => showToast('ALL EPISODES // COMING SOON')}>ALL EPISODES →</div>
          </div>
          <div className="sect-div"></div>
          <div className="ep-row">
            <div className="ec" style={{ '--ep-acc': '#00c85a' }} onClick={showChallenge}>
              <div className="hc sm tl"></div><div className="hc sm tr" style={{ borderColor: '#00c85a' }}></div><div className="hc sm bl" style={{ borderColor: '#00c85a' }}></div><div className="hc sm br"></div>
              <div className="coord tl">66.34</div><div className="coord tr">45.22</div><div className="coord br">65.45</div>
              <div className="ec-type-bar" style={{ background: '#00c85a', color: '#000' }}>CTF_ARENA<div className="hz"><div className="hz-s"></div><div className="hz-s"></div><div className="hz-s"></div></div></div>
              <div className="ec-body">
                <div className="ec-ref">EP_ID: <span>ML·S2·E3</span></div>
                <div className="ec-title">RUHENHEIM</div>
                <div className="ec-desc">Why does the Transformer see what the CNN never could? Enter and find out before Johan does.</div>
                <div className="ec-foot"><span className="ec-xp">⚡ 250 XP</span><span className="ec-arc">MONSTER W/O NAME</span></div>
              </div>
              <div className="analyze">ANALYZE</div>
            </div>
            
            <div className="ec" style={{ '--ep-acc': '#e8000d' }} onClick={showSeries}>
              <div className="hc sm tl"></div><div className="hc sm tr"></div><div className="hc sm bl"></div><div className="hc sm br"></div>
              <div className="coord tl">33.11</div><div className="coord br">47.89</div>
              <div className="ec-type-bar" style={{ background: '#e8000d', color: '#fff' }}>RESEARCH<div className="hz"><div className="hz-s"></div><div className="hz-s"></div><div className="hz-s"></div></div></div>
              <div className="ec-body">
                <div className="ec-ref">EP_ID: <span>ALGO·S1·E6</span></div>
                <div className="ec-title">THE ECLIPSE</div>
                <div className="ec-desc">On the night of the Eclipse everything Guts built was torn apart. Why does Dijkstra fail on negative weights?</div>
                <div className="ec-foot"><span className="ec-xp">⚡ 180 XP</span><span className="ec-arc">GOLDEN AGE ARC</span></div>
              </div>
              <div className="analyze">ANALYZE</div>
            </div>

            <div className="ec" style={{ '--ep-acc': '#1a7fd4' }} onClick={showSeries}>
              <div className="hc sm tl" style={{ borderColor: '#1a7fd4' }}></div><div className="hc sm tr"></div><div className="hc sm bl"></div><div className="hc sm br" style={{ borderColor: '#1a7fd4' }}></div>
              <div className="coord tl">22.07</div><div className="coord br">60.13</div>
              <div className="ec-type-bar" style={{ background: '#1a7fd4', color: '#fff' }}>CTF_ARENA<div className="hz"><div className="hz-s"></div><div className="hz-s"></div><div className="hz-s"></div></div></div>
              <div className="ec-body">
                <div className="ec-ref">EP_ID: <span>SEC·S2·E1</span></div>
                <div className="ec-title">MARINEFORD WAR</div>
                <div className="ec-desc">The Marines held the fortress. How does TLS stop a Man-in-the-Middle from becoming a Blackbeard?</div>
                <div className="ec-foot"><span className="ec-xp">⚡ 220 XP</span><span className="ec-arc">NEW WORLD ARC</span></div>
              </div>
              <div className="analyze">ANALYZE</div>
            </div>

            <div className="ec" style={{ '--ep-acc': '#9b5fff' }} onClick={showSeries}>
              <div className="hc sm tl" style={{ borderColor: '#9b5fff' }}></div><div className="hc sm tr" style={{ borderColor: '#9b5fff' }}></div><div className="hc sm bl"></div><div className="hc sm br"></div>
              <div className="coord tl">88.42</div><div className="coord br">11.67</div>
              <div className="ec-type-bar" style={{ background: '#9b5fff', color: '#fff' }}>QUIZ<div className="hz"><div className="hz-s"></div><div className="hz-s"></div><div className="hz-s"></div></div></div>
              <div className="ec-body">
                <div className="ec-ref">EP_ID: <span>DATA·S1·E3</span></div>
                <div className="ec-title">THE PROMISED WORLD</div>
                <div className="ec-desc">The Friend said it was all in the prophecy. Heap vs priority queue — which structure was it all along?</div>
                <div className="ec-foot"><span className="ec-xp">⚡ 130 XP</span><span className="ec-arc">THE FRIEND ARC</span></div>
              </div>
              <div className="analyze">ANALYZE</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ SERIES PAGE ════════════════ */}
      <div className={`scr ${screen === 's-series' ? 'on' : ''}`} id="s-series">
        <nav>
          <div className="logo" onClick={goHome}><em>E</em>PHEMERAL</div>
          <div className="nav-mid"><a onClick={goHome}>← HOME</a><a onClick={() => showToast('MY LIST // SAVE SYSTEM COMING SOON')}>MY LIST</a></div>
          <div className="nav-r">
            <span className="nav-uid" style={{ color: 'var(--lime)', marginRight: '1rem' }}>XP// {userXp}</span>
            <span className="nav-uid">UID// {USER_ID}</span>
            <div className="nav-dot"></div>
          </div>
        </nav>
        <div className="series-hero" style={{ background: 'linear-gradient(135deg,#000d05 0%,#001808 60%,#050005 100%)' }}>
          <div className="hc tl" style={{ borderColor: '#00c85a', width: '20px', height: '20px' }}></div>
          <div className="hc br" style={{ borderColor: '#00c85a', width: '20px', height: '20px' }}></div>
          <div className="coord tl" style={{ color: 'rgba(0,200,90,.3)' }}>SERIES_ID: JOHANS_LAB_v3.1</div>
          <div className="sh-left" style={{ background: '#00c85a', minHeight: '280px' }}>
            <div className="scan" style={{ opacity: .4 }}></div>
            <div className="hc tl" style={{ borderColor: '#fff', opacity: .3 }}></div><div className="hc br" style={{ borderColor: '#fff', opacity: .3 }}></div>
            <pre className="sh-ascii" style={{ color: '#000', fontSize: '.48rem' }}>
{`┌──────────────────┐
│  ░░░░░░░░░░░░░  │
│  ░  ─── ─── ░  │
│  ░░░░  ᵕ  ░░░  │
│  ░  ─────── ░  │
│  ░░░░░░░░░░░░░  │
│                  │
│ K·I·N·D·E·R·H·E│
│ I·M   5·1·1     │
│                  │
│ SUBJECT_ALPHA   │
│ STATUS: ACTIVE  │
└──────────────────┘`}
            </pre>
          </div>
          <div className="sh-content">
            <div className="sh-domain" style={{ color: '#00c85a' }}>MACHINE LEARNING · DOMAIN SERIES</div>
            <div className="sh-title">JOHANS<br/>LABYRINTH</div>
            <div className="sh-badges">
              <span className="badge badge-g">97% MATCH</span>
              <span className="badge badge-r">ADVANCED</span>
              <span className="badge badge-d">2 SEASONS</span>
              <span className="badge badge-d">10 EPISODES</span>
              <span className="badge badge-d">CTF · RESEARCH · QUIZ</span>
            </div>
            <div className="sh-desc">Start with the dumbest-sounding question. End understanding more than you thought possible. Like Johan — always one step ahead. Each episode: a child's curiosity, graduate-level depth.</div>
          </div>
        </div>
        <div className="arc-strip">
          <span className="arc-label">ARC:</span>
          <button className={`arc-btn ${curArc === 1 ? 'on' : ''}`} onClick={() => setCurArc(1)}>S1 — KINDERHEIM 511 ARC</button>
          <button className={`arc-btn ${curArc === 2 ? 'on' : ''}`} onClick={() => setCurArc(2)}>S2 — THE MONSTER WITHOUT A NAME ARC</button>
        </div>
        <div className="ep-list">
          {ARCS[curArc].map((ep, i) => (
            <div className={`epr ${ep.done ? 'done' : ''} ${ep.locked ? 'locked' : ''}`} onClick={ep.locked ? undefined : showChallenge} key={i}>
              <div className="ep-n2">{String(ep.n).padStart(2, '0')}</div>
              <div className="ep-thumb2" style={{ background: ep.bg }}>
                {ep.art}{ep.locked ? '\n\n🔒 LOCKED' : ''}
              </div>
              <div className="ep-info2">
                <div className="ep-title2">
                  {ep.t}
                  {ep.type === 'ctf' ? <span className="tp tp-ctf">CTF</span> : ep.type === 'research' ? <span className="tp tp-res">RESEARCH</span> : <span className="tp tp-quiz">QUIZ</span>}
                  {ep.active ? <span className="new-tag">NEW</span> : null}
                  {ep.done ? <span style={{ color: 'var(--crt)', fontSize: '.7rem' }}>✓</span> : null}
                </div>
                <div className="ep-desc2">{ep.d}</div>
                <div className="ep-meta2">
                  <span>⏱ {ep.min} MIN</span><span className="xp2">⚡ {ep.xp} XP</span>
                  {ep.done ? <span className="done-tag">COMPLETED</span> : null}
                  {ep.locked ? <span>🔒 COMPLETE PREV EPISODE</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════ CHALLENGE ════════════════ */}
      <div className={`scr ${screen === 's-ep' ? 'on' : ''}`} id="s-ep">
        <nav>
          <div className="logo" onClick={goHome}><em>E</em>PHEMERAL</div>
          <div className="nav-mid"><a onClick={goHome}>← HOME</a><a onClick={showSeries}>← JOHANS LABYRINTH</a></div>
          <div className="nav-r"><div className="nav-dot"></div><span className="nav-uid">RUHENHEIM_NODE</span></div>
        </nav>
        <div className="ch-wrap">
          <button className="ch-back" onClick={showSeries}>← BACK TO SERIES</button>
          <div>
            <span className="ch-domain-tag" style={{ background: 'rgba(0,200,90,.15)', color: '#00c85a' }}>MACHINE LEARNING</span>
            <span className="ch-ep-ref">// SEASON 2 · EPISODE 3 · CTF_TYPE</span>
          </div>
          <div className="ch-title" style={{ marginTop: '.5rem' }}>WHAT MADE THE<br/><em>TRANSFORMER</em><br/>THE LAST ONE STANDING?</div>
          <div className="ch-sub">Ruhenheim — The Fall of the Convolutional Empire</div>
          <div className="ch-pills">
            <span className="ch-pill hl">⚡ 250 XP</span>
            <span className="ch-pill">⏱ ~45 MIN</span>
            <span className="ch-pill lm">5 CTF CHALLENGES</span>
            <span className="ch-pill">6 RESOURCES</span>
            <span className="ch-pill" style={{ borderColor: 'rgba(0,255,65,.25)', color: 'var(--crt)' }}>94% COMPLETION</span>
          </div>
          <div className="tabs-l">
            <button className={`tl ${chTab === 'brief' ? 'on' : ''}`} onClick={() => setChTab('brief')}>BRIEF</button>
            <button className={`tl ${chTab === 'res' ? 'on' : ''}`} onClick={() => setChTab('res')}>RESOURCES</button>
            <button className={`tl ${chTab === 'ctf' ? 'on' : ''}`} onClick={() => setChTab('ctf')}>CTF ARENA</button>
          </div>

          <div className={`tpane ${chTab === 'brief' ? 'on' : ''}`} id="tp-brief">
            <div className="mommy" style={{ position: 'relative' }}>
              <div className="hc sm tl" style={{ borderColor: 'var(--red)' }}></div>
              <div className="hc sm br" style={{ borderColor: 'var(--red)' }}></div>
              <div className="mommy-k">// THE QUESTION</div>
              <div className="mommy-q">"Dr. Tenma, the old painter asked — if a Transformer can see the whole canvas at once, why did we ever need CNNs at all?"</div>
            </div>
            <div className="bk">// THE SETUP</div>
            <div className="bp">For years, CNNs were undisputed — ResNet, VGG, EfficientNet. Then in 2020, "An Image is Worth 16x16 Words" dropped Vision Transformers and quietly made Ruhenheim out of the old paradigm. Your job: understand why. Then prove it under pressure in the CTF Arena.</div>
            <div className="bk">// LEARNING OBJECTIVES</div>
            <div className="obj-list">
              <div className="obj"><div className="obj-box ok">✓</div><span>Understand convolution as a spatial feature extractor</span></div>
              <div className="obj"><div className="obj-box ok">✓</div><span>Explain CNN inductive biases — locality, translation equivariance</span></div>
              <div className="obj"><div className="obj-box"></div><span>Describe self-attention and how ViT applies it to image patches</span></div>
              <div className="obj"><div className="obj-box"></div><span>Compare data efficiency and scaling between CNNs and ViTs</span></div>
              <div className="obj"><div className="obj-box"></div><span>Articulate when you'd still choose a CNN over a Transformer</span></div>
            </div>
            <div className="bk">// YOUR MISSION</div>
            <div className="bp">Read the resources in order. Take notes. Enter the CTF Arena — 5 challenges, 20 minutes on the clock, no multiple choice. You'll be handed code blocks, model configs, and architectural traces to analyse. Derive the answer. Submit the exact flag. Three attempts per challenge before the answer is revealed. Like Johan — there are no second chances in Ruhenheim.</div>
            <button className="btn-r" style={{ marginTop: '.5rem' }} onClick={() => setChTab('res')}>START WITH RESOURCES</button>
          </div>

          <div className={`tpane ${chTab === 'res' ? 'on' : ''}`} id="tp-res">
            <div style={{ fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.1em', marginBottom: '.9rem', textTransform: 'uppercase' }}>6 CURATED RESOURCES // READ IN ORDER</div>
            <div className="res-list">
              <div className="ri" onClick={() => openLink('https://arxiv.org/abs/2010.11929')}>
                <div className="ri-icon" style={{ background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' }}>📄</div>
                <div className="ri-body">
                  <div className="ri-title">An Image is Worth 16x16 Words: ViT <span className="rtag rtag-p">PAPER</span></div>
                  <div className="ri-src">arxiv.org · Dosovitskiy et al. 2020 · ~20 min</div>
                  <div className="ri-desc">The Ruhenheim paper — the document that changed everything. Skim intro and Figures 1–3. Understand patch-embedding before the math.</div>
                </div>
              </div>
              <div className="ri" onClick={() => openLink('https://www.youtube.com/watch?v=TrdevFK_am4')}>
                <div className="ri-icon" style={{ background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' }}>▶</div>
                <div className="ri-body">
                  <div className="ri-title">But what is a convolution? — 3Blue1Brown <span className="rtag rtag-v">VIDEO</span></div>
                  <div className="ri-src">youtube.com · 3Blue1Brown · 23 min</div>
                  <div className="ri-desc">Even Guts studied his enemy before the fight. Build intuition for CNNs before learning what ViTs replace.</div>
                </div>
              </div>
              <div className="ri" onClick={() => openLink('https://theaisummer.com/vision-transformer/')}>
                <div className="ri-icon" style={{ background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' }}>◈</div>
                <div className="ri-body">
                  <div className="ri-title">ViT Explained with Code — AI Summer <span className="rtag rtag-a">ARTICLE</span></div>
                  <div className="ri-src">theaisummer.com · ~12 min read</div>
                  <div className="ri-desc">Patch tokens, positional encoding, the CLS token. Pay attention — the CTF will ask about positional encoding specifically.</div>
                </div>
              </div>
              <div className="ri" onClick={() => openLink('https://arxiv.org/abs/2201.03545')}>
                <div className="ri-icon" style={{ background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' }}>📄</div>
                <div className="ri-body">
                  <div className="ri-title">A ConvNet for the 2020s — ConvNeXt <span className="rtag rtag-p">PAPER</span></div>
                  <div className="ri-src">arxiv.org · Liu et al. 2022 · abstract + intro only</div>
                  <div className="ri-desc">The CNN strikes back. Like Askeladd surviving when no one expected it — modernised CNNs can match ViTs. Critical for nuance.</div>
                </div>
              </div>
              <div className="ri" onClick={() => openLink('https://cs231n.github.io/convolutional-networks/')}>
                <div className="ri-icon" style={{ background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' }}>◈</div>
                <div className="ri-body">
                  <div className="ri-title">Convolutional Networks — Stanford CS231n <span className="rtag rtag-a">ARTICLE</span></div>
                  <div className="ri-src">cs231n.stanford.edu · Stanford · ~15 min read</div>
                  <div className="ri-desc">The definitive breakdown of CNN inductive biases — locality, weight sharing, translation equivariance. Understand exactly what ViTs had to learn from scratch that CNNs get for free.</div>
                </div>
              </div>
              <div className="ri" onClick={() => openLink('https://paperswithcode.com/methods/category/vision-transformer')}>
                <div className="ri-icon" style={{ background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' }}>📊</div>
                <div className="ri-body">
                  <div className="ri-title">ViT Benchmarks — Papers With Code <span className="rtag rtag-a">LIVE DATA</span></div>
                  <div className="ri-src">paperswithcode.com · live leaderboard</div>
                  <div className="ri-desc">Real numbers. Note where ViTs dominate (large-scale pretraining) vs where CNNs hold (small datasets). There is no painless lesson.</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.3rem' }}><button className="btn-r" onClick={() => setChTab('ctf')}>ENTER CTF ARENA →</button></div>
          </div>

          <div className={`tpane ${chTab === 'ctf' ? 'on' : ''}`} id="tp-ctf">
            <CTFComponent gctf={gctf} setGctf={setGctf} showToast={showToast} />
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="sbar">
        <span>EPHEMERAL_OS</span><span className="sbar-sep">|</span>
        <span>NETWORK: <span className="sbar-v">ACN_EPHEMERAL_ACTIVE</span></span><span className="sbar-sep">|</span>
        <span>PORT: <span className="sbar-v">OPEN</span></span><span className="sbar-sep">|</span>
        <span>CURR_USER: <span className="sbar-v">AK_0xD4</span></span>
        <div className="sbar-r">
          <span>THERE'S NO PLACE LIKE <span className="sbar-v">127.0.0.1</span></span><span className="sbar-sep">|</span>
          <span>WAKE UP TO REALITY. <span className="sbar-v">NOTHING GOES AS PLANNED.</span></span>
        </div>
      </div>

      <div className={`toast ${toastShow ? 'show' : ''}`} id="ephemeral-toast">{toastMsg}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// EXACT CTF LOGIC
// -----------------------------------------------------------------------------

function CTFComponent({ gctf, setGctf, showToast }) {
  const catColors = { GRADIENT: '#4fc3f7', ARCHITECTURE: '#f9a825', INFERENCE: '#e8000d', DATA: '#00ff41' };
  const tierNames = { 1: 'ENTRY — 100 pts each', 2: 'CORE — 200 pts each', 3: 'RUHENHEIM — 400 pts each' };

  const [flagInput, setFlagInput] = useState('');
  const [shake, setShake] = useState(false);
  const flagInputRef = useRef(null);

  const totalPts = Object.values(gctf.solved).reduce((a, s) => a + (s.pts_earned || 0), 0);
  const solvedCount = Object.keys(gctf.solved).filter(id => !gctf.solved[id].failed).length;

  const openChallenge = (id) => {
    setGctf(prev => ({ ...prev, active: id, phase: 'challenge' }));
    setFlagInput('');
    setTimeout(() => { if (flagInputRef.current) flagInputRef.current.focus(); }, 80);
  };

  const closeChallenge = () => {
    setGctf(prev => ({ ...prev, active: null, phase: 'board' }));
  };

  const submitFlag = async () => {
    const id = gctf.active;
    if (!id) return;
    const ch = CHALLENGES.find(c => c.id === id);
    if (!ch) return;
    if (gctf.solved[id]?.solved) return;

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, challengeId: id, flagInput })
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'CORRECT') {
          setGctf(prev => ({
            ...prev,
            solved: { ...prev.solved, [id]: { solved: true, attempts_used: data.attemptsUsed, pts_earned: data.pointsEarned } }
          }));
          setUserXp(prev => prev + data.pointsEarned);
          showToast('✓ FLAG ACCEPTED — +' + data.pointsEarned + ' pts');
        } else if (data.status === 'WRONG') {
          setShake(true);
          setTimeout(() => setShake(false), 380);
          
          if (data.failed) {
            showToast('OUT OF ATTEMPTS — FLAG: EPHEMERAL{' + data.actualFlag + '}');
            setGctf(prev => ({
              ...prev,
              chalAttempts: { ...prev.chalAttempts, [id]: 0 },
              solved: { ...prev.solved, [id]: { attempts_used: ch.attempts, pts_earned: 0, failed: true } }
            }));
          } else {
            setGctf(prev => ({ ...prev, chalAttempts: { ...prev.chalAttempts, [id]: data.attemptsRemaining } }));
            showToast('WRONG — ' + data.attemptsRemaining + ' ATTEMPT' + (data.attemptsRemaining !== 1 ? 'S' : '') + ' REMAINING');
          }
        } else if (data.status === 'ALREADY_SOLVED') {
          showToast('CHALLENGE ALREADY SOLVED');
        } else if (data.status === 'NO_ATTEMPTS_LEFT') {
          showToast('NO ATTEMPTS LEFT — FLAG: EPHEMERAL{' + data.actualFlag + '}');
        }
        
        if (flagInputRef.current) {
          flagInputRef.current.focus();
          if (data.status === 'WRONG') flagInputRef.current.select();
        }
      } else {
        showToast('ERROR: ' + data.error);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      showToast('CONNECTION ERROR');
    }
  };

  const toggleCTFHint = (id) => {
    setGctf(prev => ({ ...prev, hintOn: { ...prev.hintOn, [id]: !prev.hintOn[id] } }));
  };

  if (gctf.phase === 'board') {
    return (
      <div className="ctfb">
        <div className="ctfb-head">
          <div>
            <div className="ctfb-title">ML INCIDENT RESPONSE</div>
            <div className="ctfb-sub">Investigate broken systems. Derive the flag from evidence. No guessing.</div>
          </div>
          <div className="ctfb-score">
            <div className="ctfb-pts">{totalPts}</div>
            <div className="ctfb-pts-lbl">POINTS</div>
            <div className="ctfb-solved">{solvedCount} / {CHALLENGES.filter(c => !gctf.solved[c.id] || !gctf.solved[c.id].failed).length} SOLVED</div>
          </div>
        </div>
        <div className="ctfb-legend">
          {Object.keys(catColors).map((cat) => (
            <span key={cat} className="ctfb-cat-pill" style={{ borderColor: catColors[cat], color: catColors[cat] }}>
              <span style={{ background: catColors[cat], width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', marginRight: '.2rem', verticalAlign: 'middle' }}></span>
              {cat}
            </span>
          ))}
        </div>
        {[1, 2, 3].map(t => {
          const tChallenges = CHALLENGES.filter(c => c.tier === t);
          return (
            <div className="ctfb-tier" key={t}>
              <div className="ctfb-tier-label">TIER {t} — {tierNames[t]}</div>
              <div className="ctfb-grid">
                {tChallenges.map(ch => {
                  const solved = gctf.solved[ch.id];
                  const failed = solved && solved.failed;
                  const ok = solved && !failed;
                  const col = catColors[ch.cat] || '#fff';
                  const att = gctf.chalAttempts[ch.id];
                  const tried = att < ch.attempts && !solved;
                  
                  return (
                    <div key={ch.id} className={`ctfb-card ${ok ? 'ctfb-solved' : failed ? 'ctfb-failed' : tried ? 'ctfb-tried' : ''}`} onClick={() => openChallenge(ch.id)} style={{ '--cat-color': col }}>
                      <div className="ctfb-card-top">
                        <span className="ctfb-cat" style={{ color: col }}>{ch.cat}</span>
                        {ok ? <span className="ctfb-check">✓ {solved.pts_earned}pts</span> : failed ? <span className="ctfb-fail">✗</span> : <span className="ctfb-pts-badge">{ch.pts}</span>}
                      </div>
                      <div className="ctfb-card-title">{ch.title}</div>
                      <div className="ctfb-card-id">{ch.id}</div>
                      <div className="ctfb-card-diff">{'★'.repeat(ch.diff)}{'☆'.repeat(3-ch.diff)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  // Challenge View
  const id = gctf.active;
  const ch = CHALLENGES.find(c => c.id === id);
  if (!ch) return null;
  const solved = gctf.solved[id];
  const failed = solved && solved.failed;
  const ok = solved && !failed;
  const att = gctf.chalAttempts[id];
  const col = catColors[ch.cat] || '#fff';

  return (
    <div className={`ctf-challenge-panel ${shake ? 'shake' : ''}`}>
      <div className="ctf-ch-head">
        <button className="ctf-back-btn" onClick={closeChallenge}>← BOARD</button>
        <span className="ctf-ch-cat" style={{ color: col }}>{ch.cat}</span>
        <span className="ctf-ch-id">{ch.id}</span>
        <span className="ctf-ch-pts" style={{ color: col }}>{ch.pts} PTS</span>
        <span className="ctf-ch-diff">{'★'.repeat(ch.diff)}</span>
      </div>
      <div className="ctf-ch-title">{ch.title}</div>
      <div className="ctf-ch-layout">
        <div className="ctf-ch-left">
          <div className="ctf-section-label">// INCIDENT</div>
          <div className="ctf-scenario">{ch.scenario}</div>
          <div className="ctf-section-label" style={{ marginTop: '.6rem' }}>// TASK</div>
          <div className="ctf-task">{ch.task}</div>
          
          {ok ? (
            <div className="ctf-flag-solved">
              <span style={{ color: 'var(--crt)' }}>EPHEMERAL{'{'}{ch.flag}{'}'}</span>
              &nbsp;&nbsp;<span style={{ color: 'var(--crt)', opacity: .6 }}>ACCEPTED ✓ +{solved.pts_earned} pts</span>
            </div>
          ) : failed ? (
            <div className="ctf-flag-solved" style={{ borderColor: 'rgba(232,0,13,.3)', background: 'rgba(232,0,13,.03)' }}>
              <span style={{ color: 'var(--red)', opacity: .7 }}>OUT OF ATTEMPTS</span>
              &nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,.25)' }}>FLAG WAS: EPHEMERAL{'{'}{ch.flag}{'}'}</span>
            </div>
          ) : (
            <div className="flag-zone">
              <div className="flag-label">// SUBMIT FLAG</div>
              <div className="flag-row">
                <span className="flag-pre">EPHEMERAL{'{'}</span>
                <input ref={flagInputRef} className="flag-inp" id="ctf-flag-inp" type="text" placeholder="derive from evidence above" autoComplete="off" spellCheck="false" value={flagInput} onChange={(e) => setFlagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitFlag()} />
                <span className="flag-suf">{'}'}</span>
                <button className="flag-sub" onClick={submitFlag}>SUBMIT</button>
              </div>
              <div className="attempts-row" id="ctf-att-row">
                {[0, 1, 2].map((j) => (
                  <span key={j} className={`att-dot ${j < att ? 'live' : 'dead'}`}></span>
                ))}
                <span className="att-label">{att} ATTEMPT{att !== 1 ? 'S' : ''} REMAINING</span>
              </div>
            </div>
          )}

          <div className="hint-section" style={{ marginTop: '.6rem' }}>
            <button className="hint-toggle" id="ctf-hint-btn" onClick={() => toggleCTFHint(id)}>⚡ HINT {gctf.hintOn[id] ? '▲' : '▼'}</button>
            <div className={`hint-body ${gctf.hintOn[id] ? 'on' : ''}`} id="ctf-hint-body">{ch.hint}</div>
          </div>
          
          {(ok || failed) ? (
            <div className="expl on" style={{ marginTop: '.6rem' }}>
              <strong style={{ color: 'var(--crt)', fontFamily: 'var(--mono)', fontSize: '.52rem', letterSpacing: '.1em' }}>// EXPLANATION — </strong>{ch.ex}
            </div>
          ) : null}
        </div>
        
        <div className="ctf-ch-right">
          <div className="ctf-section-label">// EVIDENCE</div>
          {ch.artifacts.map((a, i) => {
            const icon = { table: '⊞', code: '►', config: '≡', log: '○', output: '◈' }[a.type] || '□';
            return (
              <div className="ctf-artifact" key={i}>
                <div className="ctf-art-label">{icon} {a.label}</div>
                <pre className="ctf-art-body">{a.content}</pre>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}