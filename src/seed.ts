import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const ARCS = [
  { 
    id: 1, 
    title: 'The Eclipse', 
    description: 'GOLDEN AGE ARC',
    accColor: '#e8000d', 
    bgColor: '#0d0003', 
    asciiArt: `╲╲╲  ████  ╱╱╱\n   ████████\n    ██  ██\n  ◆ ██──██ ◆\n ══╬═══════╬══\n    ╙══╜\n ─ G U T S ─\n DRAGONSLAYER`, 
    domain: 'ALGORITHMS', 
    arcName: 'GOLDEN AGE ARC', 
    progressWidth: '70%' 
  },
  { 
    id: 2, 
    title: 'Grand Line', 
    description: 'MARINEFORD ARC',
    accColor: '#1a7fd4', 
    bgColor: '#00101a', 
    asciiArt: `  .──────.\n / ◎    ◎\\\n│    ▽    │\n│ ─────── │\n \\       /\n  \`──┬──'\n ⚓──│──⚓\n GOMU_GOMU\n ENIES_LOBBY`, 
    domain: 'CYBERSECURITY', 
    arcName: 'MARINEFORD ARC', 
    progressWidth: '25%' 
  },
  { 
    id: 3, 
    title: 'JOHANS LAB', 
    description: 'MONSTER W/O NAME ARC',
    accColor: '#00c85a', 
    bgColor: '#000d05', 
    asciiArt: `┌────────────┐\n│  ─── ─── │\n│     ᵕ     │\n│  ─────    │\n│           │\n│KINDERHEIM │\n│  511 511  │\n└────────────┘\n M O N S T E R\n  DR.TENMA`, 
    domain: 'MACHINE LEARNING', 
    arcName: 'MONSTER W/O NAME ARC', 
    progressWidth: '40%' 
  },
  { 
    id: 4, 
    title: 'The Knot', 
    description: '1953 CYCLE ARC',
    accColor: '#d4810a', 
    bgColor: '#0d0800', 
    asciiArt: `1953 ──► 1986\n  ▲    ◇    │\n  │         ▼\n2052 ◄── 2019\n─── WINDEN ───\n T·H·E·K·N·O·T\n  ADAM / EVA\n TIME_KNOTEN`, 
    domain: 'NETWORKS', 
    arcName: '1953 CYCLE ARC', 
    progressWidth: '55%' 
  },
  { 
    id: 5, 
    title: 'Prophecy', 
    description: 'THE FRIEND ARC',
    accColor: '#9b5fff', 
    bgColor: '#080010', 
    asciiArt: `╔═════════╗\n║ ★     ★ ║\n║         ║\n║  ─────  ║\n║ ╱     ╲ ║\n╚═════════╝\nともだち\nF·R·I·E·N·D\nEXPO_ARC`, 
    domain: 'DATA STRUCTURES', 
    arcName: 'THE FRIEND ARC', 
    progressWidth: '15%' 
  },
  { 
    id: 6, 
    title: 'ONE PUNCH', 
    description: 'MONSTER ASSOC ARC',
    accColor: '#f9a825', 
    bgColor: '#0d0d00', 
    asciiArt: `┌──────────┐\n│ ○      ○ │\n│    ─     │\n│          │\n└──────────┘\n┌──────────┐\n│   O K    │\n└──────────┘\n S·A·I·T·A·M·A\nGAROU_ARC`, 
    domain: 'COMP. PROG', 
    arcName: 'MONSTER ASSOC ARC', 
    progressWidth: '0%' 
  },
  { 
    id: 7, 
    title: 'UNIT-01', 
    description: 'INSTRUMENTALITY ARC',
    accColor: '#4fc3f7', 
    bgColor: '#00060d', 
    asciiArt: `  ╱▲╲\n ╱ △ ╲\n╱─────╲\n│ Σ Π │\n│ ∫ λ │\n│MATRIX│\n╲─────╱\nEVA·UNIT\n NERV_HQ`, 
    domain: 'MATHEMATICS', 
    arcName: 'INSTRUMENTALITY ARC', 
    progressWidth: '0%' 
  },
  { 
    id: 8, 
    title: 'LAB·MEM', 
    description: 'DIVERGENCE ARC',
    accColor: '#ff7043', 
    bgColor: '#0d0400', 
    asciiArt: `┌─────────┐\n│ 0.337%  │\n│DIVERGE  │\n├─────────┤\n│ OKABE   │\n│ KURISU  │\n│ MAYURI  │\n└─────────┘\nEL_PSY_CON\n GROO_ARC`, 
    domain: 'PROBABILITY', 
    arcName: 'DIVERGENCE ARC', 
    progressWidth: '0%' 
  }
];

const EPISODES = [
  // Arc 3 (ML - JOHANS LAB)
  { id: 'S1E1', arcId: 3, n: 1, title: "Mommy, what is a neuron?", description: "The biological metaphor that sparked a revolution. Build the perceptron.", type: "quiz", min: 20, xp: 80, done: true, art: "┌────────┐\n│ ○   ○ │\n│   ─   │\n│NEURON │\n└────────┘", bg: "#000d05" },
  { id: 'S1E2', arcId: 3, n: 2, title: "Mommy, why do we need layers?", description: "From XOR to deep nets. Why depth beats width and what a hidden layer learns.", type: "research", min: 30, xp: 120, done: true, art: "╔══════╗\n║LAYER1║\n║  │   ║\n║LAYER2║\n╚══════╝", bg: "#050010" },
  { id: 'S1E3', arcId: 3, n: 3, title: "Mommy, what is backpropagation?", description: "The chain rule that trains the internet. Derive it by hand. Watch it fail.", type: "ctf", min: 40, xp: 180, done: true, art: "⛓ ⛓ ⛓\nCHAIN\nRULE\n⛓ ⛓ ⛓", bg: "#0a0005" },
  { id: 'S2E1', arcId: 3, n: 1, title: "Mommy, what is attention?", description: "Query, Key, Value — explained through a library with no catalogues.", type: "research", min: 35, xp: 150, done: true, art: "Q·K·V\n ─── \n ATTN\n ─── ", bg: "#000d05" },
  { id: 'S2E2', arcId: 3, n: 2, title: "Mommy, what is a Transformer?", description: "Multi-head attention, positional encoding, feed-forward blocks assembled.", type: "quiz", min: 40, xp: 180, done: true, art: "⚡⚡⚡\nTRANS\nFORMER\n⚡⚡⚡", bg: "#050010" },
  { id: 'S2E3', arcId: 3, n: 3, title: "Ruhenheim — Why Transformers dominate vision", description: "Like Johan in Ruhenheim, the ViT arrived and made everything else irrelevant.", type: "ctf", min: 45, xp: 250, done: false, active: true, art: "┌──────┐\n│RUHEN │\n│ HEIM │\n└──────┘", bg: "#000d05" },
];

const CHALLENGES = [
  { id: 'GRAD_001', tier: 1, category: 'GRADIENT', points: 100, difficulty: 1, title: 'The Silent Network', scenario: 'A 6-layer MLP stopped learning at epoch 1. The engineer logged gradient norms across all layers immediately after the first backward pass.', task: 'Find the index of the last layer where the gradient has vanished (norm < 0.0001). Layers are 1-indexed.', artifacts: [ { type: 'table', label: 'GRADIENT NORMS — EPOCH 1, STEP 1', content: 'Layer  │ Gradient Norm\n───────┼──────────────\n  1    │ 0.00000012\n  2    │ 0.00000089\n  3    │ 0.00000341\n  4    │ 0.00000008  ← \n  5    │ 0.48271000\n  6    │ 1.20443000\n' }, { type: 'config', label: 'MODEL CONFIG', content: 'activation : sigmoid\nweight_init: xavier_uniform\noptimizer  : adam\nlr         : 0.001' } ], flag: '4', attemptsAllowed: 3, hint: 'Check which activation is configured and what its gradient saturation behaviour is.', explanation: 'Sigmoid saturates — gradients near 0 or 1 output become ~0. Layer 4 shows the last vanished norm (0.00000008). Switch to ReLU.' },
  { id: 'VIT_001', tier: 1, category: 'ARCHITECTURE', points: 100, difficulty: 1, title: 'The Indivisible Head', scenario: 'A ViT training run crashes immediately at the first forward pass with a shape error. No code change was made — only the config was updated.', task: 'Find the value of the parameter that makes the head dimension non-integer. Submit the exact value from the config.', artifacts: [ { type: 'config', label: 'VIT CONFIG — CURRENT (BROKEN)', content: 'model_type   : vit-base\nimage_size   : 224\npatch_size   : 16\nembed_dim    : 768\nnum_heads    : 10\nnum_layers   : 12\nmlp_ratio    : 4\ndropout      : 0.1' }, { type: 'log', label: 'CRASH LOG', content: 'RuntimeError: embed_dim (768) must be\ndivisible by num_heads.\n768 / 10 = 76.8  ← not an integer\n\nTrace: MultiHeadAttention.forward() line 47' } ], flag: '10', attemptsAllowed: 3, hint: 'Head dimension = embed_dim / num_heads. It must be a whole number.', explanation: '768 / 10 = 76.8 — invalid. num_heads must divide 768 evenly. Valid values: 1,2,3,4,6,8,12,16,24,32,48,64,96,192,256,384,768.' },
  { id: 'DEPLOY_001', tier: 1, category: 'INFERENCE', points: 100, difficulty: 1, title: 'The Unstable Oracle', scenario: 'A deployed classifier returns different predictions for the same input on every call. The model was working fine in training. No randomness in the data pipeline.', task: 'Identify the exact configuration key that is set incorrectly for deployment. Submit its current value.', artifacts: [ { type: 'config', label: 'TRAINING CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train' }, { type: 'config', label: 'INFERENCE CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train   ← deployed as-is' }, { type: 'log', label: 'INFERENCE CALLS — SAME INPUT', content: 'call_1: [0.71, 0.18, 0.11]\ncall_2: [0.43, 0.39, 0.18]\ncall_3: [0.68, 0.22, 0.10]\n# predictions change every call\n# source: stochastic operation still active' } ], flag: 'train', attemptsAllowed: 3, hint: 'What PyTorch operation produces different outputs each forward pass?', explanation: 'model.train() keeps dropout active — random neurons zeroed each call. Deployment requires model.eval() which disables dropout and uses running BN stats.' },
];

async function seed() {
  console.log('[SEED] Injecting Architecture & Arcs into ACN_NETWORK...');
  
  // 1. Arcs
  for (const arc of ARCS) {
    await db.insert(schema.arcs).values(arc).onConflictDoUpdate({ target: schema.arcs.id, set: arc });
  }

  // 2. Episodes
  for (const ep of EPISODES) {
    await db.insert(schema.episodes).values(ep).onConflictDoUpdate({ target: schema.episodes.id, set: ep });
  }

  // 3. Challenges
  for (const ch of CHALLENGES) {
    await db.insert(schema.challenges).values(ch).onConflictDoUpdate({ target: schema.challenges.id, set: ch });
=======
// Exact flags and points from your frontend design
const initialChallenges = [
  { id: 'GRAD_001', flag: '4', points: 100, attemptsAllowed: 3 },
  { id: 'VIT_001', flag: '10', points: 100, attemptsAllowed: 3 },
  { id: 'DEPLOY_001', flag: 'train', points: 100, attemptsAllowed: 3 },
  { id: 'ATTN_001', flag: '38809', points: 200, attemptsAllowed: 3 },
  { id: 'CONV_001', flag: '61', points: 200, attemptsAllowed: 3 },
  { id: 'LEAK_001', flag: 'normalize', points: 200, attemptsAllowed: 3 },
  { id: 'SILENT_001', flag: '0', points: 400, attemptsAllowed: 3 },
  { id: 'FLASH_001', flag: 'YES_0.000000', points: 400, attemptsAllowed: 3 },
  { id: 'RESNET_001', flag: 'RESNET-50', points: 400, attemptsAllowed: 3 },
];

async function seed() {
  console.log('[SEED] Injecting base challenges into ACN_NETWORK...');
  
  for (const challenge of initialChallenges) {
    await db.insert(schema.challenges)
      .values(challenge)
      .onConflictDoUpdate({
        target: schema.challenges.id,
        set: challenge
      });
>>>>>>> 6f9336f (initial commit: ephemeral ctf engine v1.0)
  }
  
  console.log('[SEED] Architecture populated. Ready for Subjects.');
  process.exit(0);
}

seed().catch(err => {
  console.error('[SEED] ERROR:', err);
  process.exit(1);
<<<<<<< HEAD
});
=======
});
>>>>>>> 6f9336f (initial commit: ephemeral ctf engine v1.0)
