import { CSSProperties } from 'react';

export const ARCS = [
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

export const EPISODES = [
  // ═══ Arc 1: The Eclipse — ALGORITHMS ═══
  { id: 'S1E1_A1', arcId: 1, n: 1, title: "Band of the Hawk — Graph Theory", description: "Guts commanded a mercenary unit that conquered fortresses through optimal troop routing. Model their battlefield logistics as a weighted directed graph. Implement Kruskal's and Prim's algorithms to find the minimum spanning tree that connects every stronghold in Midland with the least resource cost. Analyze edge cases where Griffith's ambition creates negative-weight cycles.", type: "research", min: 20, xp: 80, done: true, art: " ╱▲╲\n▲   ▲\n  ▲  ", bg: "#0d0003" },
  { id: 'S1E2_A1', arcId: 1, n: 2, title: "The Eclipse — NP-Completeness", description: "During the Eclipse, the God Hand forced Griffith into the ultimate decision problem — sacrifice everything or remain broken. Explore the computational theory behind NP-complete problems: reduction proofs, the Cook-Levin theorem, and why P ≠ NP remains the holy grail of computer science. Prove that the 'Optimal Sacrifice Selection' is reducible from 3-SAT.", type: "quiz", min: 35, xp: 140, done: false, art: "██████\n██  ██\n██████", bg: "#0a0005" },
  { id: 'S1E3_A1', arcId: 1, n: 3, title: "Berserker Armor — Greedy vs Dynamic", description: "The Berserker Armor amplifies Guts' power but at a devastating cost — it greedily optimizes for immediate combat output while ignoring long-term health. Compare greedy algorithms (locally optimal choices) against dynamic programming (globally optimal substructure). Implement both approaches for the Knapsack Problem and prove when greedy fails catastrophically.", type: "ctf", min: 40, xp: 200, done: false, active: true, art: "⚔ BRSRK\n══════\nGREEDY", bg: "#1a0008" },
  { id: 'S1E4_A1', arcId: 1, n: 4, title: "Falcon of Light — Dijkstra's Shortest Path", description: "Griffith's rebirth as Femto gave him omniscient awareness of every path through the astral plane. Implement Dijkstra's shortest path algorithm to navigate Griffith's astral network. Handle the edge case of Bellman-Ford when encountering negative-weight edges created by apostle transformations. Benchmark both algorithms on sparse vs dense graphs.", type: "quiz", min: 30, xp: 160, done: false, art: "FALCON\n  ╲╱\n LIGHT", bg: "#0d0003" },

  // ═══ Arc 2: Grand Line — CYBERSECURITY ═══
  { id: 'S1E1_A2', arcId: 2, n: 1, title: "Entering the Grand Line — Firewalls & NAT", description: "The Red Line is the ultimate firewall separating the four Blues. Study network address translation (NAT), packet filtering rules, and stateful inspection firewalls. Configure iptables rules that would protect a marine base from pirate reconnaissance scans. Understand the difference between DMZ architecture and reverse proxy isolation as used by Vegapunk's lab network.", type: "research", min: 25, xp: 90, done: true, art: "⚓ ⚓ ⚓\n RED  \n LINE ", bg: "#00101a" },
  { id: 'S1E2_A2', arcId: 2, n: 2, title: "Enies Lobby — Buffer Overflow Exploitation", description: "The Straw Hats broke into the World Government's most secure judicial fortress. Analyze how buffer overflow vulnerabilities work at the assembly level: stack smashing, return address overwriting, NOP sleds, and shellcode injection. Recreate the classic ret2libc attack against a vulnerable C binary. Understand ASLR and stack canaries as modern defenses Cipher Pol failed to deploy.", type: "ctf", min: 45, xp: 220, done: false, art: "BUFFER\nOVERFL\n  OW  ", bg: "#002030" },
  { id: 'S1E3_A2', arcId: 2, n: 3, title: "Marineford — DDoS & Incident Response", description: "The Battle of Marineford was history's largest coordinated assault — a DDoS attack from every pirate crew simultaneously. Build an incident response playbook: detect SYN floods using netflow analysis, implement rate limiting with token bucket algorithms, deploy Anycast DNS for traffic distribution, and write Snort/Suricata rules to identify Whitebeard's seismic packet signatures.", type: "quiz", min: 35, xp: 160, done: false, art: "  ◎  \n  ▼  \nPORT3010", bg: "#002030" },
  { id: 'S1E4_A2', arcId: 2, n: 4, title: "Poneglyph Cipher — RSA & Public Key Crypto", description: "The Poneglyphs contain the world's most dangerous encrypted history, readable only by those who possess the ancient key. Implement RSA encryption from scratch: generate large primes with Miller-Rabin, compute modular exponentiation with square-and-multiply, and understand why factoring the semiprime n = p × q is computationally intractable. Decrypt Robin's intercepted Poneglyph transmission.", type: "ctf", min: 50, xp: 280, done: false, art: "╔═RSA═╗\n║P × Q║\n╚═════╝", bg: "#001525" },

  // ═══ Arc 3: Johan's Lab — MACHINE LEARNING ═══
  { id: 'S1E1', arcId: 3, n: 1, title: "Mommy, what is a neuron?", description: "In Kinderheim 511, children were shaped into weapons through conditioning — a dark mirror of how artificial neurons are trained through weighted inputs. Build the McCulloch-Pitts neuron from scratch: implement the step activation function, compute the weighted sum, and understand the geometric interpretation of a single perceptron as a hyperplane decision boundary in n-dimensional space.", type: "quiz", min: 25, xp: 100, done: true, art: "┌────────┐\n│ ○   ○ │\n│   ─   │\n│NEURON │\n└────────┘", bg: "#000d05" },
  { id: 'S1E2', arcId: 3, n: 2, title: "Mommy, why do we need layers?", description: "Johan could manipulate anyone — but one person was never enough. True power required networks of influence, layers of manipulation. Prove mathematically why a single-layer perceptron cannot learn XOR. Then build a 2-layer MLP that can, using sigmoid activations and manual weight initialization. Visualize the decision boundary transformation at each hidden layer to understand how depth creates non-linear feature maps.", type: "research", min: 35, xp: 140, done: true, art: "╔══════╗\n║LAYER1║\n║  │   ║\n║LAYER2║\n╚══════╝", bg: "#050010" },
  { id: 'S1E3', arcId: 3, n: 3, title: "Mommy, what is backpropagation?", description: "Dr. Tenma's guilt propagated backward through every decision he ever made — each choice's consequence flowing back to reshape his understanding. Derive the backpropagation algorithm from first principles using the multivariate chain rule. Implement it in pure NumPy for a 3-layer network. Diagnose vanishing gradients in sigmoid networks and prove why ReLU's constant gradient solves the problem.", type: "ctf", min: 45, xp: 200, done: true, art: "⛓ ⛓ ⛓\nCHAIN\nRULE\n⛓ ⛓ ⛓", bg: "#0a0005" },
  { id: 'S2E1', arcId: 3, n: 1, title: "Mommy, what is attention?", description: "Inspector Lunge maintained mental filing cabinets — attending to specific memories while ignoring noise. This is exactly how attention mechanisms work. Implement scaled dot-product attention: Q×K^T/√d_k → softmax → ×V. Build intuition for why scaling prevents gradient saturation, and demonstrate how attention weights create interpretable alignment maps between sequence elements.", type: "research", min: 40, xp: 170, done: true, art: "Q·K·V\n ─── \n ATTN\n ─── ", bg: "#000d05" },
  { id: 'S2E2', arcId: 3, n: 2, title: "Mommy, what is a Transformer?", description: "Johan Liebert was the perfect architecture — self-contained, parallelizable, infinitely scalable in his influence. Assemble the complete Transformer encoder: multi-head self-attention (splitting Q,K,V across h heads), layer normalization, residual connections, and position-wise feed-forward networks. Implement sinusoidal positional encoding and explain why learned embeddings sometimes outperform it.", type: "quiz", min: 45, xp: 200, done: true, art: "⚡⚡⚡\nTRANS\nFORMER\n⚡⚡⚡", bg: "#050010" },
  { id: 'S2E3', arcId: 3, n: 3, title: "Ruhenheim — Vision Transformers & the Death of CNNs", description: "In Ruhenheim, Johan orchestrated the end of an era — everyone turned on each other, and the old order collapsed. The Vision Transformer (ViT) did the same to computer vision. Implement patch embedding (splitting 224×224 images into 16×16 patches), prepend the [CLS] token, apply Transformer encoding, and benchmark against ResNet-50. Prove that ViTs need more data but scale better.", type: "ctf", min: 50, xp: 280, done: false, active: true, art: "┌──────┐\n│RUHEN │\n│ HEIM │\n└──────┘", bg: "#000d05" },

  // ═══ Arc 4: The Knot — NETWORKS ═══
  { id: 'S1E1_A4', arcId: 4, n: 1, title: "Everything is Connected — Network Topologies", description: "In Winden, every person is connected across three timelines — a mesh network of causal relationships. Study network topologies (star, ring, mesh, tree) and implement graph traversal algorithms (BFS/DFS) to map the Winden family connections. Calculate clustering coefficients and identify bridge nodes whose removal would collapse the temporal graph.", type: "research", min: 25, xp: 90, done: false, art: " ◯ ── ◯ \n │ ╲  │ \n ◯ ── ◯ ", bg: "#0d0800" },
  { id: 'S1E2_A4', arcId: 4, n: 2, title: "The Bootstrap Paradox — TCP/IP Handshake", description: "The bootstrap paradox in Dark mirrors the TCP three-way handshake: SYN → SYN-ACK → ACK, a circular dependency where no message can be the 'first'. Implement a TCP state machine, analyze sequence number prediction attacks, and understand why Lamport timestamps fail in relativistic networks where time itself is unreliable.", type: "quiz", min: 30, xp: 120, done: false, art: "SYN ──►\n◄── ACK\n──► FIN", bg: "#1a1000" },
  { id: 'S1E3_A4', arcId: 4, n: 3, title: "Adam & Eva — Consensus in Distributed Systems", description: "Adam and Eva each maintained their own version of reality — a distributed system with no single source of truth. Implement the Raft consensus algorithm: leader election, log replication, and safety guarantees. Explore the CAP theorem and prove that in the presence of network partitions (like the Winden caves), you must choose between consistency and availability.", type: "ctf", min: 45, xp: 220, done: false, art: "RAFT\n◇ ◇ ◇\nVOTE!", bg: "#0d0800" },

  // ═══ Arc 5: Prophecy — DATA STRUCTURES ═══
  { id: 'S1E1_A5', arcId: 5, n: 1, title: "The Book of Prophecy — Hash Maps & Tries", description: "The Friend's Book of Prophecy predicted events by their symbolic fingerprints — a perfect hash function mapping future events to memory addresses. Implement a hash table from scratch with chaining collision resolution. Then build a prefix trie to autocomplete the Friend's prophecy keywords. Analyze amortized O(1) lookup vs O(n) worst-case when hash functions degenerate.", type: "research", min: 25, xp: 100, done: false, art: " ⚡ ★ ⚡ \n  ───  ", bg: "#080010" },
  { id: 'S1E2_A5', arcId: 5, n: 2, title: "Expo 1970 — Priority Queues & Heaps", description: "The 1970 Osaka Expo was the nexus where the Friend's plan crystallized — events were prioritized by their prophetic importance. Build a binary min-heap from scratch, implement heapify, extract-min, and decrease-key. Use it to build a priority queue that schedules Kenji's resistance missions by urgency. Prove the O(log n) guarantee and compare against Fibonacci heaps.", type: "quiz", min: 30, xp: 120, done: false, art: "HEAP\n╱  ╲\n◯    ◯", bg: "#0a0018" },
  { id: 'S1E3_A5', arcId: 5, n: 3, title: "The Friend's Identity — Binary Search Trees", description: "Kenji spent decades narrowing down the Friend's true identity from thousands of suspects — a binary search through possibility space. Implement a self-balancing AVL tree with rotations (LL, RR, LR, RL). Insert all suspects, then perform range queries to find candidates matching specific criteria. Prove the O(log n) height guarantee and demonstrate how unbalanced BSTs degrade to O(n).", type: "ctf", min: 40, xp: 200, done: false, art: "  ◯  \n ╱ ╲ \n◯   ◯", bg: "#100020" },

  // ═══ Arc 6: ONE PUNCH — COMPETITIVE PROGRAMMING ═══
  { id: 'S1E1_A6', arcId: 6, n: 1, title: "O(1) — Saitama's Constant Time", description: "Saitama solves every fight in O(1) — one punch. But real competitive programming demands you understand why constant time is the theoretical floor. Implement bit manipulation tricks: counting set bits (popcount), finding the lowest set bit, XOR-based duplicate detection, and power-of-two checks. Master the art of replacing O(n) loops with O(1) bit operations that would make even Saitama proud.", type: "research", min: 18, xp: 70, done: false, art: "┌───┐\n│O(1)│\n└───┘", bg: "#0d0d00" },
  { id: 'S1E2_A6', arcId: 6, n: 2, title: "Garou's Martial Evolution — Adaptive Algorithms", description: "Garou evolves mid-fight, adapting his martial arts style to counter every opponent. Design algorithms that adapt at runtime: implement both quicksort (average O(n log n) but O(n²) worst case) and introsort (which detects bad partitions and switches to heapsort). Build a benchmark harness that generates adversarial inputs targeting quicksort's worst case, then prove introsort remains O(n log n) guaranteed.", type: "quiz", min: 30, xp: 130, done: false, art: " ◢◣ \n◥◤", bg: "#1a1a00" },
  { id: 'S1E3_A6', arcId: 6, n: 3, title: "Serious Series — Sliding Window & Two Pointers", description: "When Saitama gets serious, every punch carries maximum efficiency — zero wasted motion. Master the sliding window technique: implement maximum subarray sum (Kadane's), longest substring without repeating characters, and minimum window substring. Then solve the classic two-pointer problem of container with most water. Each solution must run in O(n) time — anything slower is unworthy of the Serious Series.", type: "ctf", min: 40, xp: 220, done: false, art: "SERIOUS\nSERIES\n─────", bg: "#0d0d00" },

  // ═══ Arc 7: UNIT-01 — MATHEMATICS ═══
  { id: 'S1E1_A7', arcId: 7, n: 1, title: "The AT-Field — Linear Algebra Foundations", description: "The AT-Field is the barrier of the soul — a matrix transformation that separates one consciousness from another. Master the foundations: vector spaces, linear independence, span, basis, and dimension. Implement matrix multiplication from scratch, compute determinants via cofactor expansion, and prove that a matrix is invertible iff its determinant is non-zero. The AT-Field cannot be breached by singular transformations.", type: "research", min: 35, xp: 150, done: false, art: " [x, y]\n + [z, w]", bg: "#00060d" },
  { id: 'S1E2_A7', arcId: 7, n: 2, title: "Instrumentality — Eigendecomposition & SVD", description: "The Human Instrumentality Project merges all souls into a single primordial soup — the ultimate dimensionality reduction. Compute eigenvalues and eigenvectors of the NERV correlation matrix. Implement Singular Value Decomposition (SVD) to decompose the pilot synchronization data. Use the truncated SVD to compress the Eva-pilot neural interface signal while preserving 95% variance.", type: "quiz", min: 45, xp: 220, done: false, art: "λ₁ λ₂ λ₃\nEIGEN\nVALUES", bg: "#001020" },
  { id: 'S1E3_A7', arcId: 7, n: 3, title: "Third Impact — Gradient Descent on Non-Convex Surfaces", description: "Third Impact represents the catastrophic convergence to a global minimum that destroys all local structure. Implement gradient descent with momentum, RMSProp, and Adam optimizer. Visualize the loss landscape of a non-convex function (Rastrigin, Rosenbrock) and demonstrate how learning rate schedules and warm restarts help escape saddle points that would trap vanilla SGD in local minima forever.", type: "ctf", min: 50, xp: 280, done: false, art: " ⟁ ⟁ ⟁ \n  IMPACT ", bg: "#001020" },

  // ═══ Arc 8: LAB·MEM — PROBABILITY & STATISTICS ═══
  { id: 'S1E1_A8', arcId: 8, n: 1, title: "Phone Wave Divergence — Bayesian Probability", description: "Okabe's Phone Microwave sends messages across worldlines, but each D-mail shifts the divergence meter — a posterior probability update. Implement Bayes' theorem from scratch: compute prior, likelihood, and posterior distributions for worldline selection. Build a naive Bayes classifier that predicts which worldline a given set of observations belongs to. Understand why the 1% divergence barrier is a decision boundary.", type: "research", min: 30, xp: 110, done: false, art: "0.337187\n %%% ", bg: "#0d0400" },
  { id: 'S1E2_A8', arcId: 8, n: 2, title: "Reading Steiner — Markov Chains & Stochastic Processes", description: "Okabe's Reading Steiner ability lets him retain memories across worldline shifts — he is the only stationary distribution in a Markov chain of realities. Build a Markov chain transition matrix from Okabe's worldline jump logs. Compute the stationary distribution, prove ergodicity conditions, and simulate the chain to predict convergence time. Model Mayuri's death as an absorbing state and calculate first-passage time.", type: "quiz", min: 40, xp: 180, done: false, art: "MARKOV\nCHAINS\n━━━━━", bg: "#1a0800" },
  { id: 'S1E3_A8', arcId: 8, n: 3, title: "El Psy Kongroo — Monte Carlo & Convergence", description: "To reach Steins;Gate — the one worldline where everyone survives — Okabe must search through 10^24 possibilities. Implement Monte Carlo estimation: approximate π using random sampling, estimate integrals with importance sampling, and build a Metropolis-Hastings MCMC sampler. Prove the law of large numbers guarantees convergence, and compute confidence intervals for the divergence meter reading.", type: "ctf", min: 50, xp: 260, done: false, art: "STEINS\n GATE\n 1.048596", bg: "#0d0400" },
  { id: 'S1E5_A1', arcId: 1, n: 5, title: 'Skull Knight Path - A* Search', description: 'Skull Knight traverses the astral realm. Implement A* search with an admissible heuristic. Prove A* is optimally efficient using f-value monotonicity. Compare Dijkstra and BFS on benchmark maps.', type: 'ctf', min: 38, xp: 190, done: false, art: 'A* GOAL', bg: '#0d0003' },
  { id: 'S2E1_A1', arcId: 1, n: 6, title: 'Conviction Arc - Divide and Conquer', description: 'The Inquisition divided the resistance systematically. Master divide-and-conquer: implement merge sort, FFT, Karatsuba multiplication. Derive recurrences and solve with the Master Theorem.', type: 'research', min: 32, xp: 145, done: false, art: 'DIV&CNQ', bg: '#0d0003' },
  { id: 'S1E5_A2', arcId: 2, n: 5, title: 'Void Century - Steganography and OSINT', description: 'The World Government erased 800 years of history. Extract EXIF metadata, perform LSB steganography from PNGs, chain findings. Recover the hidden Poneglyph message from intercepted Marine transmissions.', type: 'ctf', min: 55, xp: 320, done: false, art: 'STEG', bg: '#002030' },
  { id: 'S1E4_A4', arcId: 4, n: 4, title: 'Triquetra - BGP and Internet Routing', description: 'The three Winden time periods mirror BGP routing. Study BGP path selection: AS path length, LOCAL_PREF, MED attributes. Simulate a BGP hijacking attack that captures all traffic destined for another era.', type: 'quiz', min: 38, xp: 170, done: false, art: 'BGP AS', bg: '#0d0800' },
  { id: 'S1E4_A5', arcId: 5, n: 4, title: '20th Century Boys - Segment Trees', description: 'Kenji needed to query records across arbitrary time ranges. Build a segment tree for range-sum and range-min in O(log n). Add lazy propagation and persistent versions preserving all historical states.', type: 'ctf', min: 45, xp: 240, done: false, art: 'SGTREE', bg: '#080010' },
  { id: 'S1E4_A6', arcId: 6, n: 4, title: 'King vs Garou - Minimax', description: 'When King faced Garou, the illusion of power was itself a strategy. Implement minimax with alpha-beta pruning for two-player zero-sum games. Apply to combat scenarios where Saitama finds the guaranteed winning strategy.', type: 'research', min: 36, xp: 165, done: false, art: 'MINMAX', bg: '#0d0d00' },
  { id: 'S1E4_A7', arcId: 7, n: 4, title: 'Rei and Asuka - Lagrangian Duality', description: 'Rei represents the primal, constrained by form. Asuka represents the dual, seeing the problem from another angle. Study Lagrangian duality in convex optimization and apply KKT conditions to SVM derivation.', type: 'quiz', min: 50, xp: 240, done: false, art: 'PRIMAL', bg: '#00060d' },
  { id: 'S1E4_A8', arcId: 8, n: 4, title: 'Divergence Meter - Hypothesis Testing', description: 'The divergence meter reads 1.048596%. Is this statistically significant? Implement t-tests, chi-square, ANOVA, and bootstrap resampling. Apply Bonferroni correction for multiple comparisons across 100+ worldlines.', type: 'research', min: 35, xp: 150, done: false, art: 'p<0.05', bg: '#0d0400' }
];

export const CHALLENGES = [
  {
    id: 'ARRAY_BASICS_001',
    tier: 1,
    category: 'SCRIPTING',
    points: 100,
    difficulty: 1,
    title: 'Off-by-One',
    scenario: 'A junior developer pushed a script that manages our security camera feeds. The camera names are stored in a simple array, but the application keeps crashing with an "Index Out of Bounds" error when trying to access the final camera in the sequence.',
    task: 'Review the provided configuration array. Identify the correct zero-based index for the "Loading Dock" camera to fix the script.',
    artifacts: [
      {
        type: 'config',
        label: 'CAM_ARRAY.JSON',
        content: '{\n  "cameras": [\n    "Main Entrance",\n    "Lobby",\n    "Breakroom",\n    "Server Room",\n    "Loading Dock"\n  ],\n  "target_camera_query": 5\n}'
      }
    ],
    flag: '4',
    attemptsAllowed: 3,
    hint: 'In most programming languages, arrays start counting at 0, not 1. Try counting the list items starting from 0.',
    explanation: 'Because arrays are zero-indexed, an array with 5 items has valid indices of 0, 1, 2, 3, and 4. The "Loading Dock" is at index 4. Querying index 5 (which would be a 6th item) causes the script to fail.'
  },
  { id: 'GRAD_001', tier: 1, category: 'GRADIENT', points: 100, difficulty: 1, title: 'The Silent Network', scenario: 'A 6-layer MLP stopped learning at epoch 1. The engineer logged gradient norms across all layers immediately after the first backward pass.', task: 'Find the index of the last layer where the gradient has vanished (norm < 0.0001). Layers are 1-indexed.', artifacts: [ { type: 'table', label: 'GRADIENT NORMS — EPOCH 1, STEP 1', content: 'Layer  │ Gradient Norm\n───────┼──────────────\n  1    │ 0.00000012\n  2    │ 0.00000089\n  3    │ 0.00000341\n  4    │ 0.00000008  ← \n  5    │ 0.48271000\n  6    │ 1.20443000\n' }, { type: 'config', label: 'MODEL CONFIG', content: 'activation : sigmoid\nweight_init: xavier_uniform\noptimizer  : adam\nlr         : 0.001' } ], flag: '4', attemptsAllowed: 3, hint: 'Check which activation is configured and what its gradient saturation behaviour is.', explanation: 'Sigmoid saturates — gradients near 0 or 1 output become ~0. Layer 4 shows the last vanished norm (0.00000008). Switch to ReLU.' },
  { id: 'VIT_001', tier: 1, category: 'ARCHITECTURE', points: 100, difficulty: 1, title: 'The Indivisible Head', scenario: 'A ViT training run crashes immediately at the first forward pass with a shape error. No code change was made — only the config was updated.', task: 'Find the value of the parameter that makes the head dimension non-integer. Submit the exact value from the config.', artifacts: [ { type: 'config', label: 'VIT CONFIG — CURRENT (BROKEN)', content: 'model_type   : vit-base\nimage_size   : 224\npatch_size   : 16\nembed_dim    : 768\nnum_heads    : 10\nnum_layers   : 12\nmlp_ratio    : 4\ndropout      : 0.1' }, { type: 'log', label: 'CRASH LOG', content: 'RuntimeError: embed_dim (768) must be\ndivisible by num_heads.\n768 / 10 = 76.8  ← not an integer\n\nTrace: MultiHeadAttention.forward() line 47' } ], flag: '10', attemptsAllowed: 3, hint: 'Head dimension = embed_dim / num_heads. It must be a whole number.', explanation: '768 / 10 = 76.8 — invalid. num_heads must divide 768 evenly. Valid values: 1,2,3,4,6,8,12,16,24,32,48,64,96,192,256,384,768.' },
  { id: 'DEPLOY_001', tier: 1, category: 'INFERENCE', points: 100, difficulty: 1, title: 'The Unstable Oracle', scenario: 'A deployed classifier returns different predictions for the same input on every call. The model was working fine in training. No randomness in the data pipeline.', task: 'Identify the exact configuration key that is set incorrectly for deployment. Submit its current value.', artifacts: [ { type: 'config', label: 'TRAINING CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train' }, { type: 'config', label: 'INFERENCE CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train   ← deployed as-is' }, { type: 'log', label: 'INFERENCE CALLS — SAME INPUT', content: 'call_1: [0.71, 0.18, 0.11]\ncall_2: [0.43, 0.39, 0.18]\ncall_3: [0.68, 0.22, 0.10]\n# predictions change every call\n# source: stochastic operation still active' } ], flag: 'train', attemptsAllowed: 3, hint: 'What PyTorch operation produces different outputs each forward pass?', explanation: 'model.train() keeps dropout active — random neurons zeroed each call. Deployment requires model.eval() which disables dropout and uses running BN stats.' },
  { id: 'LEAK_001', tier: 2, category: 'DATA LEAK', points: 200, difficulty: 2, title: 'The Time Traveler', scenario: 'A fraud detection model achieves 99.97% accuracy on test data but fails catastrophically in production. The data scientist insists the train/test split was random and stratified. An auditor discovered that one feature column contains information that should be impossible to know at prediction time.', task: 'Identify the column name causing data leakage. Submit the exact column name from the feature list.', artifacts: [ { type: 'table', label: 'FEATURE LIST', content: 'Column Name        │ Description\n───────────────────┼────────────────────────────────────\ntx_amount          │ Transaction amount in USD\ntx_timestamp       │ Unix epoch of transaction\nmerchant_category  │ MCC code of the merchant\ncard_country       │ Country of card issuance\ndevice_fingerprint │ Browser/device hash\nfraud_report_date  │ Date fraud was reported to bank\naccount_age_days   │ Days since account creation\ntx_velocity_1h     │ Transactions in last 1 hour\n' }, { type: 'log', label: 'PRODUCTION METRICS', content: 'Week 1: precision=0.02, recall=0.89\nWeek 2: precision=0.01, recall=0.91\n# Model flags nearly everything as fraud\n# False positive rate: 98.3%' } ], flag: 'fraud_report_date', attemptsAllowed: 3, hint: 'Which feature could only exist AFTER the event you are trying to predict?', explanation: 'fraud_report_date is generated AFTER a transaction is flagged as fraud — it leaks the label directly. At prediction time this field would be null for legitimate transactions, causing the model to use its absence as the primary fraud signal.' },
  { id: 'LR_001', tier: 2, category: 'TRAINING', points: 200, difficulty: 2, title: 'The Exploding Cosmos', scenario: 'A ResNet-50 training run diverges at epoch 3 with loss going to NaN. The training was fine for 2 epochs with steadily decreasing loss. The only change between the stable run and the divergent run was in the optimizer configuration.', task: 'Find the learning rate value that caused the divergence. Submit the exact number from the broken config.', artifacts: [ { type: 'config', label: 'STABLE RUN CONFIG', content: 'optimizer    : SGD\nlearning_rate: 0.01\nmomentum     : 0.9\nweight_decay : 1e-4\nscheduler    : cosine_annealing\nT_max        : 100' }, { type: 'config', label: 'BROKEN RUN CONFIG', content: 'optimizer    : SGD\nlearning_rate: 0.1\nmomentum     : 0.9\nweight_decay : 1e-4\nscheduler    : step_lr\nstep_size    : 30\ngamma        : 10.0  ← NOTE: should be < 1' }, { type: 'log', label: 'TRAINING LOG — BROKEN RUN', content: 'Epoch 1: loss=2.45, lr=0.100\nEpoch 2: loss=1.83, lr=0.100\nEpoch 3: loss=NaN,  lr=1.000  ← lr INCREASED\nEpoch 4: loss=NaN,  lr=10.00\n# scheduler multiplied LR by 10 instead of decaying' } ], flag: '10.0', attemptsAllowed: 3, hint: 'Look at the scheduler gamma parameter. What should its normal range be?', explanation: 'gamma=10.0 causes StepLR to MULTIPLY the learning rate by 10 every 30 epochs. Normal gamma is 0.1 (divide by 10). At epoch 3, LR jumped from 0.1 to 1.0 — 10x too high — causing gradient explosion and NaN loss.' },
  { id: 'TOK_001', tier: 2, category: 'NLP', points: 250, difficulty: 3, title: 'The Fragmented Lexicon', scenario: 'A sentiment analysis model performs well on English text but returns random predictions on customer reviews containing emojis, URLs, and mixed-language content. The model architecture is fine — the problem is in preprocessing.', task: 'How many tokens does the tokenizer produce for the test input? Submit the exact count.', artifacts: [ { type: 'config', label: 'TOKENIZER CONFIG', content: 'type          : BPE (byte-pair encoding)\nvocab_size    : 30522\nmax_length    : 128\npad_token     : [PAD]\nunk_token     : [UNK]\ndo_lower_case : true\nstrip_accents : true' }, { type: 'log', label: 'TOKENIZATION DEBUG', content: 'Input: "Great product! 👍 Visit müller.de/réviews"\n\nTokens: ["great", "product", "!", "[UNK]",\n         "visit", "[UNK]", ".", "[UNK]",\n         "/", "[UNK]"]\n\nToken count: 10\n[UNK] ratio: 4/10 = 40%\n\n# 40% of input is unknown to the model\n# Emojis, accented chars, and URLs all map to [UNK]' } ], flag: '10', attemptsAllowed: 3, hint: 'Count every token in the debug output, including [UNK] tokens.', explanation: 'The BPE tokenizer with strip_accents=true and limited vocab maps emojis (👍), accented characters (ü, é), and URL fragments to [UNK]. 4 out of 10 tokens carry zero semantic information, making the model blind to 40% of the input.' },
  { id: 'OVER_001', tier: 3, category: 'OVERFITTING', points: 300, difficulty: 3, title: 'The Perfect Student', scenario: 'A medical imaging classifier achieves 99.8% accuracy on the test set but only 54% on external hospital data. The training and test sets were properly split with no data leakage. The model genuinely learned — but it learned the wrong thing entirely.', task: 'Identify the shortcut feature the model memorized. Submit the exact two-word artifact label that reveals the answer.', artifacts: [ { type: 'table', label: 'DATASET STATISTICS', content: 'Split     │ Hospital A │ Hospital B │ Positive %\n──────────┼────────────┼────────────┼───────────\nTrain     │    8,200   │      0     │   12.3%\nTest      │    2,050   │      0     │   12.1%\nExternal  │      0     │    3,000   │   11.8%' }, { type: 'log', label: 'SCANNER METADATA', content: 'Hospital A: Siemens MAGNETOM Vida 3T\n  - Metal tag overlay: "SIEMENS" in corner\n  - Positive cases: tag position shifted 2px down\n  - Negative cases: tag position at default\n\nHospital B: GE SIGNA Premier 3T\n  - No text overlay on images\n  - Clean DICOM without manufacturer watermark' }, { type: 'config', label: 'GRAD-CAM HEATMAP', content: 'Attention hotspot: bottom-right corner\nRegion of interest: 8x12 pixel area\nContains: manufacturer text overlay\nCorrelation with label: r=0.994' } ], flag: 'SCANNER METADATA', attemptsAllowed: 3, hint: 'The model is not looking at the medical image content. Check where Grad-CAM says it is looking.', explanation: 'The model memorized the Siemens text overlay position — positive cases had the tag shifted 2px down. It achieved 99.8% by reading the watermark position, not the pathology. External data from GE scanners has no overlay, making the learned feature absent. This is a textbook example of shortcut learning.' },
  { id: 'MEM_001', tier: 3, category: 'SYSTEMS', points: 300, difficulty: 3, title: 'The Corrupted Weights', scenario: 'A production model suddenly starts producing garbage outputs after a routine server migration. The model file (model.pt) was copied successfully — file sizes match, no errors in transfer. But inference results are completely wrong. The ops team suspects bit corruption during transfer.', task: 'Calculate the SHA-256 checksum difference. How many bytes differ between the original and corrupted file? Submit the exact count.', artifacts: [ { type: 'log', label: 'FILE COMPARISON', content: 'Original:  model_v2.3_prod.pt  (487,291,904 bytes)\nMigrated:  model_v2.3_new.pt   (487,291,904 bytes)\n\nSHA-256 original:  a3f8c2...9d41e7\nSHA-256 migrated:  a3f8c2...9d41e8  ← last byte differs\n\nbinary diff:\nOffset 0x1A00FF30: 0x42 → 0x43  (1 byte)\nOffset 0x1A00FF31: 0x3E → 0x3F  (1 byte)\nOffset 0x1A00FF32: 0x00 → 0x01  (1 byte)\n\nAffected tensor: classifier.weight[0][127]\nOriginal value:  0.04687500 (float32)\nCorrupted value: 2.45812e+18 (float32)' }, { type: 'config', label: 'IMPACT ANALYSIS', content: 'Layer affected: final classifier FC layer\nNeuron affected: output neuron 0 (class "benign")\nResult: all inputs classified as class 1+ (never benign)\nCause: 3 bit flips in IEEE 754 exponent field\nProbability of random 3-byte flip: 1 in 10^26' } ], flag: '3', attemptsAllowed: 3, hint: 'Count the exact number of byte offsets shown in the binary diff.', explanation: '3 bytes were corrupted at consecutive offsets. In IEEE 754 float32 representation, these 3 bytes span the exponent and mantissa fields, turning a small weight (0.047) into an astronomically large value (2.46e18). This single corrupted neuron overwhelms the softmax output, making the model never predict class 0. The probability of exactly 3 consecutive bit flips suggests hardware failure (ECC memory error) rather than random corruption.' },

  { id: 'CRYPTO_001', tier: 1, category: 'CRYPTO', points: 150, difficulty: 2, title: 'The Caesar Cipher', scenario: 'Marine intelligence intercepts a pirate crew using a Caesar cipher. A known plaintext fragment maps GOMU to TBZH.', task: 'What shift value was used? Submit the integer 0-25.', artifacts: [{ type: 'log', label: 'INTERCEPT', content: 'CIPHERTEXT: JBHF EBBF\nG->T, O->B, M->Z, U->H\ndiff = 13 for all chars' }], flag: '13', attemptsAllowed: 3, hint: 'ROT-13 is its own inverse.', explanation: 'ROT-13 shifts each character 13 positions. G(6)+13=T(19). All four chars confirm shift=13.' },
  { id: 'GRAPH_001', tier: 2, category: 'ALGORITHMS', points: 200, difficulty: 2, title: 'The Straw Hat Network', scenario: 'The Straw Hat crew spans 9 islands. Find the minimum cost Den Den Mushi network connecting all islands.', task: 'What is the total MST cost? Submit the exact integer.', artifacts: [{ type: 'table', label: 'EDGE COSTS', content: 'Luffy-Nami:2 Chopper-Sanji:1 Franky-Brook:2 Nami-Usopp:3 Brook-Jinbe:3 Luffy-Zoro:4 Robin-Franky:4 Nami-Robin:5 Zoro-Sanji:5' }], flag: '24', attemptsAllowed: 3, hint: 'Apply Kruskal: sort edges by weight, add if no cycle.', explanation: 'MST edges: 1+2+2+3+3+4+4+5 = 24. Sorted selection avoids all cycles.' },
  { id: 'BIAS_001', tier: 2, category: 'FAIRNESS', points: 250, difficulty: 3, title: 'The Unequal Tribunal', scenario: 'The World Government sentencing model shows 30% conviction rate for Blue Sea vs 70% for Grand Line defendants.', task: 'Calculate the demographic parity gap as an integer percentage.', artifacts: [{ type: 'table', label: 'OUTCOMES', content: 'Blue Sea: 360/1200 = 30%\nGrand Line: 560/800 = 70%\nGap = |70-30| = ???' }], flag: '40', attemptsAllowed: 3, hint: 'Demographic parity gap = |P(y=1|GroupA) - P(y=1|GroupB)|.', explanation: 'Gap = |70% - 30%| = 40pp. The model is 2.33x more likely to convict Grand Line pirates. Classic demographic disparity.' }
];

export interface Resource {
  icon: string;
  title: string;
  tag: string;
  tagClass: string;
  src: string;
  desc: string;
  link: string;
  iconStyle: CSSProperties;
}

export const EPISODE_RESOURCES: Record<string, Resource[]> = {
  'S2E3': [
    { icon: '📄', title: 'An Image is Worth 16x16 Words: ViT', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Dosovitskiy et al. 2020', desc: 'The foundational ViT paper. Understand patch-embedding before the math.', link: 'https://arxiv.org/abs/2010.11929', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'But what is a convolution?', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 23 min', desc: 'Build intuition for CNNs before learning what ViTs replace.', link: 'https://www.youtube.com/watch?v=TrdevFK_am4', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'ViT Explained with Code', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'theaisummer.com', desc: 'Patch tokens, positional encoding, the CLS token.', link: 'https://theaisummer.com/vision-transformer/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📄', title: 'A ConvNet for the 2020s — ConvNeXt', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Liu et al. 2022', desc: 'Modernised CNNs matching ViTs. Critical for nuance.', link: 'https://arxiv.org/abs/2201.03545', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '◈', title: 'Convolutional Networks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs231n.stanford.edu', desc: 'CNN inductive biases — locality, weight sharing, translation equivariance.', link: 'https://cs231n.github.io/convolutional-networks/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📊', title: 'ViT Benchmarks', tag: 'LIVE DATA', tagClass: 'rtag-a', src: 'paperswithcode.com', desc: 'Where ViTs dominate vs where CNNs hold.', link: 'https://paperswithcode.com/methods/category/vision-transformer', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
  ],
  'S1E3': [
    {
      icon: '🔢',
      title: 'Understanding Zero-Based Indexing',
      tag: 'ARTICLE',
      tagClass: 'rtag-a',
      src: 'developer.mozilla.org · 5 min',
      desc: 'Learn how arrays are structured in memory and how to avoid common off-by-one boundary errors.',
      link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
      iconStyle: {
        background: 'rgba(255,193,7,.08)',
        border: '1px solid rgba(255,193,7,.15)',
        color: 'var(--yellow)'
      }
    }
  ]
};
