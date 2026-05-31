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
  },
  { 
    id: 9, 
    title: 'Initiation', 
    description: 'ACADEMY BOOTCAMP',
    accColor: 'var(--lime)', 
    bgColor: '#000502', 
    asciiArt: `┌──────────┐\n│ I N I T  │\n│  0 1 0 1 │\n│ ──────── │\n│  B O O T │\n└──────────┘\n SYSTEM_NEW\n FRESHMAN_OP`, 
    domain: 'PROGRAMMING BASICS', 
    arcName: 'ACADEMY BOOTCAMP', 
    progressWidth: '100%' 
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
  { id: 'S1E4_A8', arcId: 8, n: 4, title: 'Divergence Meter - Hypothesis Testing', description: 'The divergence meter reads 1.048596%. Is this statistically significant? Implement t-tests, chi-square, ANOVA, and bootstrap resampling. Apply Bonferroni correction for multiple comparisons across 100+ worldlines.', type: 'research', min: 35, xp: 150, done: false, art: 'p<0.05', bg: '#0d0400' },
  
  // ═══ Arc 9: The Initiation — PROGRAMMING BASICS ═══
  // Designed for absolute beginners — zero prior programming knowledge assumed.
  { id: 'S1E1_A9', arcId: 9, n: 1, title: "First Steps — Variables, Loops & Output", description: "Every program is a list of instructions for a computer. In this episode you will write your first real programs. You will learn what a variable is (a named storage box for a value), how a loop repeats instructions automatically, and how a conditional makes decisions. By the end you will solve three classic beginner problems using nothing but these three tools.", type: "ctf", min: 20, xp: 80, done: false, active: true, art: "◉ VARS\n══════\nLOOPS", bg: "#000a02" },
  { id: 'S1E2_A9', arcId: 9, n: 2, title: "Text & Characters — Working with Strings", description: "Text is everywhere in programming. A string is simply a sequence of characters — letters, digits, spaces — stored one after another. This episode teaches you how to read individual characters by their position (index), how to loop over every character in a word, and how to count, compare, and rearrange text. Every language feature you need is built-in.", type: "ctf", min: 20, xp: 80, done: false, art: "◉ STR\n══════\nINDEX", bg: "#000a02" },
  { id: 'S1E3_A9', arcId: 9, n: 3, title: "Functions & Logic — Building Reusable Tools", description: "A function is a named block of code you can call whenever you need it — like saving a recipe so you can cook the same dish any time. This episode teaches you how to write functions that take inputs and return outputs, how to use conditionals to choose between different paths, and how a function can even call itself (recursion) to solve problems defined in terms of smaller versions of themselves.", type: "ctf", min: 25, xp: 100, done: false, art: "◉ FUNC\n══════\nRETURN", bg: "#000a02" },
  { id: 'S1E4_A9', arcId: 9, n: 4, title: "Lists & Searching — Working with Collections", description: "A list (also called an array) stores many values in a single variable, each with its own position number. This episode teaches you how to create lists, access items by index, loop over every element, and search for things inside a collection. These skills underpin almost every real-world program ever written.", type: "ctf", min: 25, xp: 100, done: false, art: "◉ LIST\n══════\nSEARCH", bg: "#000a02" }
];

export const CHALLENGES = [
  // ── Arc 1, Episode 3: Greedy vs Dynamic Programming (DSA mode) ──────────────
  // These challenges are rendered by DSAEpisodePage, not CTFComponent.
  // flag: 'DSA_HONOR_SOLVED' is the honor-system sentinel — users mark problems
  // solved via a button; the backend verifies this value just like any other flag.
  {
    id: 'DSA_55_JUMP_GAME',
    episodeId: 'S1E3_A1',
    tier: 1,
    category: 'ALGORITHMS',
    points: 100,
    difficulty: 2,
    title: 'Jump Game',
    scenario: 'You are positioned at index 0 of an array. Each element tells you the maximum number of steps you can jump from that position. Determine if you can reach the last index.',
    task: 'Return true if you can reach the last index, false otherwise.',
    artifacts: [],
    flag: 'DSA_HONOR_SOLVED',
    attemptsAllowed: 1,
    hint: 'At each position, track the furthest index reachable so far.',
    explanation: 'Greedy: maintain maxReach = max(maxReach, i + nums[i]). If i exceeds maxReach at any point, return false. O(n) time, O(1) space.',
  },
  {
    id: 'DSA_322_COIN_CHANGE',
    episodeId: 'S1E3_A1',
    tier: 2,
    category: 'ALGORITHMS',
    points: 150,
    difficulty: 3,
    title: 'Coin Change',
    scenario: 'Given a set of coin denominations and a target amount, find the minimum number of coins needed to make that amount. You have an unlimited supply of each denomination.',
    task: 'Return the minimum coin count, or -1 if the amount cannot be formed.',
    artifacts: [],
    flag: 'DSA_HONOR_SOLVED',
    attemptsAllowed: 1,
    hint: 'Build a dp[] table where dp[i] = min coins to make amount i. Recurrence: dp[i] = min(dp[i - c] + 1) for each coin c.',
    explanation: 'Bottom-up DP: initialise dp[0..amount] to Infinity, set dp[0] = 0. For each amount i from 1 to amount, try each coin c and update dp[i] = min(dp[i], dp[i-c]+1). Return dp[amount] or -1.',
  },
  {
    id: 'DSA_746_MIN_COST_STAIRS',
    episodeId: 'S1E3_A1',
    tier: 1,
    category: 'ALGORITHMS',
    points: 100,
    difficulty: 1,
    title: 'Min Cost Climbing Stairs',
    scenario: 'Each step on a staircase has a cost. Once you pay the cost you can jump 1 or 2 steps. You can start from step 0 or step 1. Find the minimum total cost to reach the top (past the last step).',
    task: 'Return the minimum cost to reach the top of the floor.',
    artifacts: [],
    flag: 'DSA_HONOR_SOLVED',
    attemptsAllowed: 1,
    hint: 'Define dp[i] as the minimum cost to stand on step i. Recurrence: dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
    explanation: 'dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Answer = min(dp[n-1], dp[n-2]) since either of the last two steps can reach the top.',
  },
  {
    id: 'WEB_SQLI_001',
    episodeId: 'S1E2_A2',
    tier: 1,
    category: 'WEB',
    points: 200,
    difficulty: 2,
    title: 'Syndicate Access Bypass',
    scenario: 'An external portal for Sector-7 allows authentication, but the database query is poorly sanitized. The endpoint uses standard string concatenation to verify operator credentials, making it highly vulnerable to structured query injection.',
    task: 'Determine the standard SQL injection snippet that bypasses the credential check by forcing the WHERE clause to evaluate to TRUE. The application checks if any row is returned.',
    artifacts: [
      {
        type: 'config',
        label: 'AUTH_GATEWAY.SQL',
        content: 'SELECT * FROM operators WHERE username = \'INPUT_USER\' AND passcode = \'INPUT_PASS\';'
      },
      {
        type: 'table',
        label: 'SYSTEM DUMP',
        content: 'Table: operators\nColumns: op_id, username, passcode, security_clearance\n───────┼──────────────┼──────────┼───────────────────\n 1     │ admin        │ ******** │ Level-5'
      }
    ],
    flag: 'admin\' OR \'1\'=\'1',
    attemptsAllowed: 5,
    hint: 'Use a single quote to close the username string parameter and introduce an OR condition that is always true.',
    explanation: 'By entering "admin\' OR \'1\'=\'1", the query becomes: SELECT * FROM operators WHERE username = \'admin\' OR \'1\'=\'1\' AND passcode = \'...\'. Since \'1\'=\'1\' is always true, the database returns the first record, bypassing the login check.'
  },
  {
    id: 'PWN_STACK_001',
    episodeId: 'S1E2_A2',
    tier: 2,
    category: 'PWN',
    points: 300,
    difficulty: 3,
    title: 'pwnable.kr: fd (File Descriptor)',
    scenario: 'A setuid binary in the operators\' sandbox segment reads a number from argv[1], subtracts 0x1234 (4660 in decimal), and uses it as a file descriptor. It then reads 32 bytes from this file descriptor into a local stack buffer.',
    task: 'Determine what decimal argument you need to pass to the binary so that the resulting file descriptor points to standard input (stdin, which has a descriptor value of 0), allowing you to inject "LETMEWIN" and print the flag.',
    artifacts: [
      {
        type: 'config',
        label: 'FD.C (SOURCE)',
        content: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(int argc, char* argv[]) {\n    if (argc < 2) return 0;\n    int fd = atoi(argv[1]) - 0x1234;\n    char buf[32];\n    int len = read(fd, buf, 32);\n    if (!strcmp("LETMEWIN\\n", buf)) {\n        printf("Flag: PWN_FD_SOLVED\\n");\n        return 0;\n    }\n    return 0;\n}'
      }
    ],
    flag: '4660',
    attemptsAllowed: 5,
    hint: '0x1234 is hexadecimal. Convert 0x1234 to its decimal representation.',
    explanation: 'The binary subtracts 0x1234 from your input to get the file descriptor. Standard input is 0. To make fd = 0, input must equal 0x1234. In decimal, 0x1234 is 4660.'
  },
  {
    id: 'REV_XOR_001',
    episodeId: 'S1E2_A2',
    tier: 2,
    category: 'REVERSE',
    points: 250,
    difficulty: 2,
    title: 'crackme.exe: Hidden Key',
    scenario: 'A suspicious malware sample has been decompiled. It reads a license key and performs a byte-wise XOR against a fixed array of length 6. The output is then compared to a static signature.',
    task: 'Analyze the decompiler artifacts, extract the hex signature and the XOR key, and compute the original 6-character license key string.',
    artifacts: [
      {
        type: 'table',
        label: 'DECOMPILER DUMP',
        content: 'XOR Key Array   : [0x5A, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A]\nTarget Signature: [0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14]'
      }
    ],
    flag: 'KEYPWN',
    attemptsAllowed: 4,
    hint: 'The XOR operation is reversible: Key = Signature ^ XOR_Key. Convert hex values to ASCII characters.',
    explanation: 'Performing XOR: 0x11 ^ 0x5A = 0x4B (\'K\'), 0x1F ^ 0x5A = 0x45 (\'E\'), 0x03 ^ 0x5A = 0x59 (\'Y\'), 0x0A ^ 0x5A = 0x50 (\'P\'), 0x0D ^ 0x5A = 0x57 (\'W\'), 0x14 ^ 0x5A = 0x4E (\'N\'). Combined: KEYPWN.'
  },
  {
    id: 'CRY_PADDING_001',
    episodeId: 'S1E4_A2',
    tier: 3,
    category: 'CRYPTO',
    points: 350,
    difficulty: 4,
    title: 'Oracle of Bleichenbacher',
    scenario: 'An operator captured a ciphertext encrypted with RSA-1024. The target system returns a specific padding error ("Decryption Error 0x82") when the decrypted block does not begin with 0x00 0x02, leaking validity information.',
    task: 'Identify the family name of the cryptanalyst who first discovered this padding oracle attack on PKCS#1 v1.5 padding.',
    artifacts: [
      {
        type: 'config',
        label: 'INTERCEPTED ENVELOPE',
        content: 'Algorithm   : RSA-1024\nPadding Mode: PKCS#1 v1.5\nError Code  : Decryption Error 0x82 (Invalid Padding)'
      }
    ],
    flag: 'Bleichenbacher',
    attemptsAllowed: 3,
    hint: 'The attack was published in 1998 by a Swiss cryptographer and is also known as the Million Message Attack.',
    explanation: 'Daniel Bleichenbacher described the padding oracle attack against PKCS#1 v1.5, showing that an attacker could decrypt RSA ciphertexts by sending chosen-ciphertext queries and analyzing padding verification error responses.'
  },
  {
    id: 'ML_ADVERSARIAL_001',
    episodeId: 'S1E3_A2',
    tier: 3,
    category: 'ML_SECURITY',
    points: 300,
    difficulty: 3,
    title: 'Adversarial Attack: Breaking ResNet',
    scenario: 'An automated security drone uses ResNet-50 to classify weapons. We have white-box access to the model weights. The input image is classified as "weapon" with 98.7% confidence, but we must construct a minimal pixel perturbation to bypass classification.',
    task: 'Identify the common one-shot adversarial algorithm shown in the formula. Submit its 4-letter acronym.',
    artifacts: [
      {
        type: 'config',
        label: 'DELTA_OPTIMIZER.PY',
        content: 'x_adv = x + epsilon * sign(grad(loss(x, y), x))\n# generates minimal adversarial perturbation using the sign of the gradients'
      }
    ],
    flag: 'FGSM',
    attemptsAllowed: 3,
    hint: 'It stands for Fast Gradient Sign Method, introduced by Ian Goodfellow et al.',
    explanation: 'FGSM computes the gradient of the loss function with respect to the input image, then takes the sign of that gradient and scales it by epsilon. This shifts the image in the direction that maximizes loss, causing a misclassification with imperceptible changes.'
  },
  { id: 'GRAD_001', episodeId: 'S1E3', tier: 1, category: 'GRADIENT', points: 100, difficulty: 1, title: 'The Silent Network', scenario: 'A 6-layer MLP stopped learning at epoch 1. The engineer logged gradient norms across all layers immediately after the first backward pass.', task: 'Find the index of the last layer where the gradient has vanished (norm < 0.0001). Layers are 1-indexed.', artifacts: [ { type: 'table', label: 'GRADIENT NORMS — EPOCH 1, STEP 1', content: 'Layer  │ Gradient Norm\n───────┼──────────────\n  1    │ 0.00000012\n  2    │ 0.00000089\n  3    │ 0.00000341\n  4    │ 0.00000008  ← \n  5    │ 0.48271000\n  6    │ 1.20443000\n' }, { type: 'config', label: 'MODEL CONFIG', content: 'activation : sigmoid\nweight_init: xavier_uniform\noptimizer  : adam\nlr         : 0.001' } ], flag: '4', attemptsAllowed: 3, hint: 'Check which activation is configured and what its gradient saturation behaviour is.', explanation: 'Sigmoid saturates — gradients near 0 or 1 output become ~0. Layer 4 shows the last vanished norm (0.00000008). Switch to ReLU.' },
  { id: 'VIT_001', episodeId: 'S2E3', tier: 1, category: 'ARCHITECTURE', points: 100, difficulty: 1, title: 'The Indivisible Head', scenario: 'A ViT training run crashes immediately at the first forward pass with a shape error. No code change was made — only the config was updated.', task: 'Find the value of the parameter that makes the head dimension non-integer. Submit the exact value from the config.', artifacts: [ { type: 'config', label: 'VIT CONFIG — CURRENT (BROKEN)', content: 'model_type   : vit-base\nimage_size   : 224\npatch_size   : 16\nembed_dim    : 768\nnum_heads    : 10\nnum_layers   : 12\nmlp_ratio    : 4\ndropout      : 0.1' }, { type: 'log', label: 'CRASH LOG', content: 'RuntimeError: embed_dim (768) must be\ndivisible by num_heads.\n768 / 10 = 76.8  ← not an integer\n\nTrace: MultiHeadAttention.forward() line 47' } ], flag: '10', attemptsAllowed: 3, hint: 'Head dimension = embed_dim / num_heads. It must be a whole number.', explanation: '768 / 10 = 76.8 — invalid. num_heads must divide 768 evenly. Valid values: 1,2,3,4,6,8,12,16,24,32,48,64,96,192,256,384,768.' },
  { id: 'DEPLOY_001', episodeId: 'S2E3', tier: 1, category: 'INFERENCE', points: 100, difficulty: 1, title: 'The Unstable Oracle', scenario: 'A deployed classifier returns different predictions for the same input on every call. The model was working fine in training. No randomness in the data pipeline.', task: 'Identify the exact configuration key that is set incorrectly for deployment. Submit its current value.', artifacts: [ { type: 'config', label: 'TRAINING CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train' }, { type: 'config', label: 'INFERENCE CONFIG', content: 'dropout_rate : 0.5\nbn_momentum  : 0.1\nmode         : train   ← deployed as-is' }, { type: 'log', label: 'INFERENCE CALLS — SAME INPUT', content: 'call_1: [0.71, 0.18, 0.11]\ncall_2: [0.43, 0.39, 0.18]\ncall_3: [0.68, 0.22, 0.10]\n# predictions change every call\n# source: stochastic operation still active' } ], flag: 'train', attemptsAllowed: 3, hint: 'What PyTorch operation produces different outputs each forward pass?', explanation: 'model.train() keeps dropout active — random neurons zeroed each call. Deployment requires model.eval() which disables dropout and uses running BN stats.' },
  { id: 'LEAK_001', episodeId: 'S2E1', tier: 2, category: 'DATA LEAK', points: 200, difficulty: 2, title: 'The Time Traveler', scenario: 'A fraud detection model achieves 99.97% accuracy on test data but fails catastrophically in production. The data scientist insists the train/test split was random and stratified. An auditor discovered that one feature column contains information that should be impossible to know at prediction time.', task: 'Identify the column name causing data leakage. Submit the exact column name from the feature list.', artifacts: [ { type: 'table', label: 'FEATURE LIST', content: 'Column Name        │ Description\n───────────────────┼────────────────────────────────────\ntx_amount          │ Transaction amount in USD\ntx_timestamp       │ Unix epoch of transaction\nmerchant_category  │ MCC code of the merchant\ncard_country       │ Country of card issuance\ndevice_fingerprint │ Browser/device hash\nfraud_report_date  │ Date fraud was reported to bank\naccount_age_days   │ Days since account creation\ntx_velocity_1h     │ Transactions in last 1 hour\n' }, { type: 'log', label: 'PRODUCTION METRICS', content: 'Week 1: precision=0.02, recall=0.89\nWeek 2: precision=0.01, recall=0.91\n# Model flags nearly everything as fraud\n# False positive rate: 98.3%' } ], flag: 'fraud_report_date', attemptsAllowed: 3, hint: 'Which feature could only exist AFTER the event you are trying to predict?', explanation: 'fraud_report_date is generated AFTER a transaction is flagged as fraud — it leaks the label directly. At prediction time this field would be null for legitimate transactions, causing the model to use its absence as the primary fraud signal.' },
  { id: 'LR_001', episodeId: 'S1E3', tier: 2, category: 'TRAINING', points: 200, difficulty: 2, title: 'The Exploding Cosmos', scenario: 'A ResNet-50 training run diverges at epoch 3 with loss going to NaN. The training was fine for 2 epochs with steadily decreasing loss. The only change between the stable run and the divergent run was in the optimizer configuration.', task: 'Find the learning rate value that caused the divergence. Submit the exact number from the broken config.', artifacts: [ { type: 'config', label: 'STABLE RUN CONFIG', content: 'optimizer    : SGD\nlearning_rate: 0.01\nmomentum     : 0.9\nweight_decay : 1e-4\nscheduler    : cosine_annealing\nT_max        : 100' }, { type: 'config', label: 'BROKEN RUN CONFIG', content: 'optimizer    : SGD\nlearning_rate: 0.1\nmomentum     : 0.9\nweight_decay : 1e-4\nscheduler    : step_lr\nstep_size    : 30\ngamma        : 10.0  ← NOTE: should be < 1' }, { type: 'log', label: 'TRAINING LOG — BROKEN RUN', content: 'Epoch 1: loss=2.45, lr=0.100\nEpoch 2: loss=1.83, lr=0.100\nEpoch 3: loss=NaN,  lr=1.000  ← lr INCREASED\nEpoch 4: loss=NaN,  lr=10.00\n# scheduler multiplied LR by 10 instead of decaying' } ], flag: '10.0', attemptsAllowed: 3, hint: 'Look at the scheduler gamma parameter. What should its normal range be?', explanation: 'gamma=10.0 causes StepLR to MULTIPLY the learning rate by 10 every 30 epochs. Normal gamma is 0.1 (divide by 10). At epoch 3, LR jumped from 0.1 to 1.0 — 10x too high — causing gradient explosion and NaN loss.' },
  { id: 'TOK_001', episodeId: 'S2E2', tier: 2, category: 'NLP', points: 250, difficulty: 3, title: 'The Fragmented Lexicon', scenario: 'A sentiment analysis model performs well on English text but returns random predictions on customer reviews containing emojis, URLs, and mixed-language content. The model architecture is fine — the problem is in preprocessing.', task: 'How many tokens does the tokenizer produce for the test input? Submit the exact count.', artifacts: [ { type: 'config', label: 'TOKENIZER CONFIG', content: 'type          : BPE (byte-pair encoding)\nvocab_size    : 30522\nmax_length    : 128\npad_token     : [PAD]\nunk_token     : [UNK]\ndo_lower_case : true\nstrip_accents : true' }, { type: 'log', label: 'TOKENIZATION DEBUG', content: 'Input: "Great product! 👍 Visit müller.de/réviews"\n\nTokens: ["great", "product", "!", "[UNK]",\n         "visit", "[UNK]", ".", "[UNK]",\n         "/", "[UNK]"]\n\nToken count: 10\n[UNK] ratio: 4/10 = 40%\n\n# 40% of input is unknown to the model\n# Emojis, accented chars, and URLs all map to [UNK]' } ], flag: '10', attemptsAllowed: 3, hint: 'Count every token in the debug output, including [UNK] tokens.', explanation: 'The BPE tokenizer with strip_accents=true and limited vocab maps emojis (👍), accented characters (ü, é), and URL fragments to [UNK]. 4 out of 10 tokens carry zero semantic information, making the model blind to 40% of the input.' },
  { id: 'OVER_001', episodeId: 'S2E3', tier: 3, category: 'OVERFITTING', points: 300, difficulty: 3, title: 'The Perfect Student', scenario: 'A medical imaging classifier achieves 99.8% accuracy on the test set but only 54% on external hospital data. The training and test sets were properly split with no data leakage. The model genuinely learned — but it learned the wrong thing entirely.', task: 'Identify the shortcut feature the model memorized. Submit the exact two-word artifact label that reveals the answer.', artifacts: [ { type: 'table', label: 'DATASET STATISTICS', content: 'Split     │ Hospital A │ Hospital B │ Positive %\n──────────┼────────────┼────────────┼───────────\nTrain     │    8,200   │      0     │   12.3%\nTest      │    2,050   │      0     │   12.1%\nExternal  │      0     │    3,000   │   11.8%' }, { type: 'log', label: 'SCANNER METADATA', content: 'Hospital A: Siemens MAGNETOM Vida 3T\n  - Metal tag overlay: "SIEMENS" in corner\n  - Positive cases: tag position shifted 2px down\n  - Negative cases: tag position at default\n\nHospital B: GE SIGNA Premier 3T\n  - No text overlay on images\n  - Clean DICOM without manufacturer watermark' }, { type: 'config', label: 'GRAD-CAM HEATMAP', content: 'Attention hotspot: bottom-right corner\nRegion of interest: 8x12 pixel area\nContains: manufacturer text overlay\nCorrelation with label: r=0.994' } ], flag: 'SCANNER METADATA', attemptsAllowed: 3, hint: 'The model is not looking at the medical image content. Check where Grad-CAM says it is looking.', explanation: 'The model memorized the Siemens text overlay position — positive cases had the tag shifted 2px down. It achieved 99.8% by reading the watermark position, not the pathology. External data from GE scanners has no overlay, making the learned feature absent. This is a textbook example of shortcut learning.' },
  { id: 'MEM_001', episodeId: 'S2E3', tier: 3, category: 'SYSTEMS', points: 300, difficulty: 3, title: 'The Corrupted Weights', scenario: 'A production model suddenly starts producing garbage outputs after a routine server migration. The model file (model.pt) was copied successfully — file sizes match, no errors in transfer. But inference results are completely wrong. The ops team suspects bit corruption during transfer.', task: 'Calculate the SHA-256 checksum difference. How many bytes differ between the original and corrupted file? Submit the exact count.', artifacts: [ { type: 'log', label: 'FILE COMPARISON', content: 'Original:  model_v2.3_prod.pt  (487,291,904 bytes)\nMigrated:  model_v2.3_new.pt   (487,291,904 bytes)\n\nSHA-256 original:  a3f8c2...9d41e7\nSHA-256 migrated:  a3f8c2...9d41e8  ← last byte differs\n\nbinary diff:\nOffset 0x1A00FF30: 0x42 → 0x43  (1 byte)\nOffset 0x1A00FF31: 0x3E → 0x3F  (1 byte)\nOffset 0x1A00FF32: 0x00 → 0x01  (1 byte)\n\nAffected tensor: classifier.weight[0][127]\nOriginal value:  0.04687500 (float32)\nCorrupted value: 2.45812e+18 (float32)' }, { type: 'config', label: 'IMPACT ANALYSIS', content: 'Layer affected: final classifier FC layer\nNeuron affected: output neuron 0 (class "benign")\nResult: all inputs classified as class 1+ (never benign)\nCause: 3 bit flips in IEEE 754 exponent field\nProbability of random 3-byte flip: 1 in 10^26' } ], flag: '3', attemptsAllowed: 3, hint: 'Count the exact number of byte offsets shown in the binary diff.', explanation: '3 bytes were corrupted at consecutive offsets. In IEEE 754 float32 representation, these 3 bytes span the exponent and mantissa fields, turning a small weight (0.047) into an astronomically large value (2.46e18). This single corrupted neuron overwhelms the softmax output, making the model never predict class 0. The probability of exactly 3 consecutive bit flips suggests hardware failure (ECC memory error) rather than random corruption.' },
  { id: 'CRYPTO_001', episodeId: 'S1E4_A2', tier: 1, category: 'CRYPTO', points: 150, difficulty: 2, title: 'The Caesar Cipher', scenario: 'Marine intelligence intercepts a pirate crew using a Caesar cipher. A known plaintext fragment maps GOMU to TBZH.', task: 'What shift value was used? Submit the integer 0-25.', artifacts: [{ type: 'log', label: 'INTERCEPT', content: 'CIPHERTEXT: JBHF EBBF\nG->T, O->B, M->Z, U->H\ndiff = 13 for all chars' }], flag: '13', attemptsAllowed: 3, hint: 'ROT-13 is its own inverse.', explanation: 'ROT-13 shifts each character 13 positions. G(6)+13=T(19). All four chars confirm shift=13.' },
  { id: 'GRAPH_001', episodeId: 'S1E1_A1', tier: 2, category: 'ALGORITHMS', points: 200, difficulty: 2, title: 'The Straw Hat Network', scenario: 'The Straw Hat crew spans 9 islands. Find the minimum cost Den Den Mushi network connecting all islands.', task: 'What is the total MST cost? Submit the exact integer.', artifacts: [{ type: 'table', label: 'EDGE COSTS', content: 'Luffy-Nami:2 Chopper-Sanji:1 Franky-Brook:2 Nami-Usopp:3 Brook-Jinbe:3 Luffy-Zoro:4 Robin-Franky:4 Nami-Robin:5 Zoro-Sanji:5' }], flag: '24', attemptsAllowed: 3, hint: 'Apply Kruskal: sort edges by weight, add if no cycle.', explanation: 'MST edges: 1+2+2+3+3+4+4+5 = 24. Sorted selection avoids all cycles.' },
  { id: 'BIAS_001', episodeId: 'S2E1', tier: 2, category: 'FAIRNESS', points: 250, difficulty: 3, title: 'The Unequal Tribunal', scenario: 'The World Government sentencing model shows 30% conviction rate for Blue Sea vs 70% for Grand Line defendants.', task: 'Calculate the demographic parity gap as an integer percentage.', artifacts: [{ type: 'table', label: 'OUTCOMES', content: 'Blue Sea: 360/1200 = 30%\nGrand Line: 560/800 = 70%\nGap = |70-30| = ???' }], flag: '40', attemptsAllowed: 3, hint: 'Demographic parity gap = |P(y=1|GroupA) - P(y=1|GroupB)|.', explanation: 'Gap = |70% - 30%| = 40pp. The model is 2.33x more likely to convict Grand Line pirates. Classic demographic disparity.' }
,
  {
    id: 'NET_PORT_001',
    episodeId: 'S1E1_A4',
    tier: 1,
    category: 'NETWORKS',
    points: 150,
    difficulty: 1,
    title: 'Silent Whisper: TCP Port Scan',
    scenario: 'A rogue operator in the sub-network has launched a port scan to discover active services on our secondary gate. They are using a stealth scan technique that does not complete the 3-way handshake to avoid detection by standard logging.',
    task: 'Identify the 3-letter acronym of the stealth TCP port scanning technique that sends a SYN packet and listens for a SYN-ACK, but immediately closes the connection with a RST packet.',
    artifacts: [
      {
        type: 'config',
        label: 'GATEWAY_SECURITY.RULE',
        content: 'PORT_SCANNING_POLICY: REJECT_HANDSHAKE\nSTEALTH_SCAN_CHECK: ENABLED\nFLAG_COMBO_SUSPICIOUS: SYN,RST'
      },
      {
        type: 'log',
        label: 'PACKET INTERCEPT',
        content: '10.0.1.42:38291 -> 10.0.1.1:80 [SYN]\n10.0.1.1:80 -> 10.0.1.42:38291 [SYN, ACK]\n10.0.1.42:38291 -> 10.0.1.1:80 [RST]'
      }
    ],
    flag: 'SYN',
    attemptsAllowed: 3,
    hint: 'It is often called a half-open scan because the full three-way handshake is never completed.',
    explanation: 'A SYN scan (stealth or half-open scan) sends a SYN packet to probe ports. If a SYN-ACK is received, the port is open; the scanner immediately sends a RST packet to tear down the connection instead of completing the handshake with an ACK, leaving it unlogged by many legacy servers.'
  },
  {
    id: 'NET_DNS_001',
    episodeId: 'S1E1_A4',
    tier: 2,
    category: 'NETWORKS',
    points: 250,
    difficulty: 3,
    title: 'The Phantom Resolver',
    scenario: 'The DNS queries for the domain "ephemeral.sh" are returning a malicious IP address "10.42.99.1" instead of our actual load balancer IP. The packet capture shows an attacker responding to DNS queries faster than the official upstream DNS server.',
    task: 'Identify the name of the network attack where an attacker sniffs DNS requests and sends forged DNS responses before the legitimate DNS server can reply. Submit the two-word term.',
    artifacts: [
      {
        type: 'log',
        label: 'RESOLVER CAPTURE',
        content: '09:21:04.128 [QUERY] ephemeral.sh (Type A)\n09:21:04.130 [REPLY] ephemeral.sh -> 10.42.99.1 (FORGED)\n09:21:04.142 [REPLY] ephemeral.sh -> 192.168.1.100 (LEGITIMATE, LATE)'
      }
    ],
    flag: 'DNS Spoofing',
    attemptsAllowed: 5,
    hint: 'This attack targets the UDP-based nature of standard DNS queries where first response wins.',
    explanation: 'DNS spoofing occurs when an attacker intercepting queries sends a fake DNS reply before the real DNS resolver can respond, tricking the client into connecting to the malicious server.'
  },
  {
    id: 'DS_HASH_001',
    episodeId: 'S1E1_A5',
    tier: 2,
    category: 'DATA_STRUCT',
    points: 200,
    difficulty: 2,
    title: 'The Echo Chamber: Hash Collision',
    scenario: 'Our security database stores API tokens using a fast hash function to check authorization. However, two distinct token strings "op_clear_7" and "token_sys_9" produce the exact same 16-bit hash, allowing them to bypass check constraints.',
    task: 'Find the name of the condition in which two different inputs to a hash function produce the same hash value output.',
    artifacts: [
      {
        type: 'table',
        label: 'HASH FUNCTION LOG',
        content: 'Input: "op_clear_7"  -> Hash: 0xF8B2\nInput: "token_sys_9" -> Hash: 0xF8B2\nSTATUS: MATCHING OUTPUT FOR UNMATCHING INPUT'
      }
    ],
    flag: 'collision',
    attemptsAllowed: 4,
    hint: 'This occurs due to mapping an infinite input space to a finite output space.',
    explanation: 'A hash collision happens when two distinct inputs yield the same hash value, compromising cryptographic and index integrity.'
  },
  {
    id: 'DS_BLOOM_001',
    episodeId: 'S1E2_A5',
    tier: 3,
    category: 'DATA_STRUCT',
    points: 300,
    difficulty: 3,
    title: 'The Whispering Filter',
    scenario: 'To avoid expensive disk reads, a high-performance firewall checks if an IP address has been blacklisted using a space-efficient probabilistic data structure. The firewall reports 0% false negatives, but allows occasional false positives.',
    task: 'What is the name of this probabilistic data structure that supports membership queries and is constructed using an array of m bits initialized to 0 and k independent hash functions?',
    artifacts: [
      {
        type: 'config',
        label: 'FILTER_METRICS.JSON',
        content: '{\n  "bit_array_length": 65536,\n  "hash_functions_count": 4,\n  "false_positive_rate": 0.012,\n  "false_negative_rate": 0.000\n}'
      }
    ],
    flag: 'Bloom Filter',
    attemptsAllowed: 3,
    hint: 'Named after Burton Howard Bloom, who proposed the idea in 1970.',
    explanation: 'A Bloom filter uses a bit array and multiple hash functions. Adding an element hashes it to set multiple bits. Querying checks if all those bits are set. False positives can occur, but false negatives are impossible.'
  },
  {
    id: 'CP_KNAP_001',
    episodeId: 'S1E3_A6',
    tier: 2,
    category: 'ALGORITHMS',
    points: 250,
    difficulty: 3,
    title: 'The Overloaded Payload',
    scenario: 'A salvage drone must retrieve valuable hardware elements from a destroyed vessel. The drone has a strict weight capacity limit of 15 kg. It must select the optimal subset of elements to maximize total credit value.',
    task: 'Determine the maximum possible credit value the drone can secure under the weight limit. Submit the integer value.',
    artifacts: [
      {
        type: 'table',
        label: 'HARDWARE MANIFEST',
        content: 'Item Name      │ Weight (kg) │ Value (credits)\n───────────────┼─────────────┼────────────────\nQuantum Coil   │      3      │       90\nNeural Mesh    │      4      │      100\nHyper-Drive    │      8      │      210\nPlutonium Fuel │      5      │      120\nPlasma Shield  │      6      │      140'
      }
    ],
    flag: '400',
    attemptsAllowed: 4,
    hint: 'Use 0/1 Knapsack Dynamic Programming. The optimal subset contains Hyper-Drive, Quantum Coil, and Neural Mesh.',
    explanation: 'Choosing the Hyper-Drive (8kg, 210c), Quantum Coil (3kg, 90c), and Neural Mesh (4kg, 100c) yields exactly 15kg weight and a max value of 400 credits. All other subsets are either overweight or yield less value.'
  },
  {
    id: 'CP_DIJK_001',
    episodeId: 'S1E1_A6',
    tier: 2,
    category: 'ALGORITHMS',
    points: 200,
    difficulty: 2,
    title: 'Sector-9 Shortest Path',
    scenario: 'An automated courier must route telemetry packets through a grid of nodes in Sector-9. Each link has a specific delay latency (in milliseconds). We need to find the absolute shortest total latency route from Node A to Node F.',
    task: 'Calculate the minimum delay cost from Node A to Node F. Submit the integer.',
    artifacts: [
      {
        type: 'table',
        label: 'NETWORK DELAY MATRIX',
        content: 'A -> B (2ms)\nA -> C (4ms)\nB -> C (1ms)\nB -> D (7ms)\nC -> D (3ms)\nC -> E (5ms)\nD -> E (1ms)\nD -> F (5ms)\nE -> F (2ms)'
      }
    ],
    flag: '9',
    attemptsAllowed: 3,
    hint: 'Apply Dijkstra\'s algorithm to find the shortest path from A. The shortest route is A -> B -> C -> D -> E -> F.',
    explanation: 'Shortest path: A->B (2), B->C (+1 = 3), C->D (+3 = 6), D->E (+1 = 7), E->F (+2 = 9). Total latency: 9ms.'
  },
  {
    id: 'MATH_RSA_001',
    episodeId: 'S1E2_A7',
    tier: 3,
    category: 'MATH',
    points: 350,
    difficulty: 4,
    title: 'UNIT-01: Primality',
    scenario: 'An ancient cryptosystem operates on small RSA keys. We intercepted the public key n = p * q = 3233 and the exponent e = 17. To derive the decryption key d, we must factor n into its two prime components.',
    task: 'Find the value of the smaller prime factor p of 3233. Submit the integer.',
    artifacts: [
      {
        type: 'config',
        label: 'PUBLIC KEY ENVELOPE',
        content: 'MODULUS (N): 3233\nEXPONENT (E): 17'
      }
    ],
    flag: '53',
    attemptsAllowed: 3,
    hint: 'p and q are primes close to each other. Calculate the square root of 3233 (approx 56.8) and check primes below it.',
    explanation: 'We factor 3233. Checking primes: 3233 / 53 = 61. Both 53 and 61 are prime. The smaller prime factor is 53.'
  },
  {
    id: 'MATH_ECC_001',
    episodeId: 'S1E3_A7',
    tier: 3,
    category: 'MATH',
    points: 400,
    difficulty: 5,
    title: 'Elliptic Curve: Trapdoor',
    scenario: 'A secure communications hub uses Elliptic Curve Cryptography over a prime field. The curve is defined as y^2 = x^3 + ax + b (mod p). We know the base point G and public key Q, but finding the secret key d such that Q = dG is mathematically infeasible.',
    task: 'What is the fundamental mathematical problem on which Elliptic Curve Cryptography relies for its security? Submit its 5-letter acronym.',
    artifacts: [
      {
        type: 'config',
        label: 'CURVE CONFIG',
        content: 'Prime Field: p = 2^256 - 2^32 - 977 (secp256k1)\nGenerator G: (x, y)\nKey Relation: Q = d * G'
      }
    ],
    flag: 'ECDLP',
    attemptsAllowed: 4,
    hint: 'It stands for Elliptic Curve Discrete Logarithm Problem.',
    explanation: 'ECC security relies on the hardness of the Elliptic Curve Discrete Logarithm Problem (ECDLP), which states that given points G and dG, it is computationally intractable to find d.'
  },
  // ── Arc 9: Basic Programming — rendered by DSAEpisodePage, NOT CTFComponent ──
  // flag: 'DSA_HONOR_SOLVED' — students mark problems solved via the code runner button.
  // Episode 1 — Variables, Loops & Output
  { id: 'BP_412_FIZZBUZZ',        episodeId: 'S1E1_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'FizzBuzz',                   scenario: 'Print numbers 1 to n. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".', task: 'Return a list of strings for every number from 1 to n.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Check divisible by 15 first, then 3, then 5, then just the number as a string.', explanation: 'A for loop counts 1..n. The modulo operator % gives the remainder: 15 % 3 == 0. Check 15 before 3/5 to avoid false positives.' },
  { id: 'BP_1480_RUNNING_SUM',    episodeId: 'S1E1_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'Running Sum of 1D Array',    scenario: 'Each element of the running sum is the total of all elements up to that index.', task: 'Return the running sum of nums — where runningSum[i] = sum(nums[0..i]).', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Loop through the array. Keep a total variable and add each element to it.', explanation: 'One pass: keep a running total and overwrite (or append) each position with total so far.' },
  { id: 'BP_1929_CONCAT_ARRAY',   episodeId: 'S1E1_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'Concatenation of Array',    scenario: 'Build ans of length 2n where ans[i] == nums[i] and ans[i+n] == nums[i].', task: 'Return ans — nums followed by itself.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'In Python: nums + nums. Or build a new list with a loop.', explanation: 'Just concatenate the list with itself: return nums + nums.' },
  // Episode 2 — Text & Characters
  { id: 'BP_344_REVERSE_STRING',  episodeId: 'S1E2_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'Reverse String',             scenario: 'Reverse a character array in-place — you must not allocate extra space.', task: 'Modify the array s so its characters are in reverse order.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Use two pointers: one at the start, one at the end. Swap and move them toward the centre.', explanation: 'Two-pointer swap: left=0, right=len-1. While left<right: swap s[left] and s[right], then left++, right--.' },
  { id: 'BP_242_VALID_ANAGRAM',   episodeId: 'S1E2_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'Valid Anagram',              scenario: 'Two strings are anagrams if one is a rearrangement of the other.', task: 'Return true if t is an anagram of s, false otherwise.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Count each character in s. Then subtract counts for t. If anything is non-zero, not an anagram.', explanation: 'Use a dictionary/Counter to count letters in s, then check t has the same counts.' },
  { id: 'BP_771_JEWELS_STONES',   episodeId: 'S1E2_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 50,  difficulty: 1, title: 'Jewels and Stones',          scenario: 'jewels is a string of unique characters that are types of jewels. stones is a string of the stones you have. Each character in stones is a type of stone you have.', task: 'Return how many of your stones are also jewels.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'For each character in stones, check if it is also in jewels.', explanation: 'Convert jewels to a set for O(1) lookup, then count how many stones[i] are in that set.' },
  // Episode 3 — Functions & Logic
  { id: 'BP_9_PALINDROME',        episodeId: 'S1E3_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 75,  difficulty: 1, title: 'Palindrome Number',          scenario: 'A palindrome reads the same forwards and backwards. 121 is a palindrome; -121 is not.', task: 'Return true if x is a palindrome integer, false otherwise.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Convert x to a string and compare it with its reverse: str(x) == str(x)[::-1].', explanation: 'Negative numbers are not palindromes. Convert to string, compare with reverse slice. O(log n) math solution also exists.' },
  { id: 'BP_58_LENGTH_LAST_WORD', episodeId: 'S1E3_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 75,  difficulty: 1, title: 'Length of Last Word',        scenario: 'Given a string of words separated by spaces, find the length of the last word (words consist of only uppercase and lowercase English letters).', task: 'Return the length of the last word in s.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Strip trailing spaces first, then split and take the last element.', explanation: 's.strip().split() removes extra whitespace and splits on any whitespace. Return len(parts[-1]).' },
  { id: 'BP_509_FIBONACCI',       episodeId: 'S1E3_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 75,  difficulty: 1, title: 'Fibonacci Number',           scenario: 'F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). The Fibonacci sequence is 0, 1, 1, 2, 3, 5, 8, 13...', task: 'Return F(n).', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'For a loop solution: keep two variables (prev, curr) and update them n times.', explanation: 'Iterative: a, b = 0, 1; for _ in range(n): a, b = b, a+b; return a. Avoids stack overflow of naive recursion.' },
  // Episode 4 — Lists & Searching
  { id: 'BP_217_CONTAINS_DUP',    episodeId: 'S1E4_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 75,  difficulty: 1, title: 'Contains Duplicate',         scenario: 'Given an integer array, return true if any value appears at least twice.', task: 'Return true if any element appears more than once, false if all are distinct.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Add each number to a set. If it is already there, you found a duplicate.', explanation: 'A set stores only unique values. Loop through nums: if num in seen, return True; else add to seen.' },
  { id: 'BP_1_TWO_SUM',           episodeId: 'S1E4_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 100, difficulty: 2, title: 'Two Sum',                     scenario: 'Given an array of integers and a target, return the indices of the two numbers that add up to target. Exactly one solution exists.', task: 'Return [i, j] where nums[i] + nums[j] == target.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'For each number x, you need target - x. Store numbers you have already seen in a dictionary.', explanation: 'Hash map: seen = {}. For each (i, num): complement = target - num. If complement in seen, return [seen[complement], i]. Else seen[num] = i.' },
  { id: 'BP_121_BEST_TIME_STOCK', episodeId: 'S1E4_A9', tier: 1, category: 'PROGRAMMING BASICS', points: 100, difficulty: 2, title: 'Best Time to Buy and Sell Stock', scenario: 'prices[i] is the price on day i. You can buy on one day and sell on a later day.', task: 'Return the maximum profit. If no profit is possible, return 0.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Track the minimum price seen so far. At each day, compute profit = price - min_price. Track the max profit.', explanation: 'One pass: min_price = prices[0], max_profit = 0. For each price: min_price = min(min_price, price); max_profit = max(max_profit, price - min_price).' },

  // ── Arc 1 remaining — ALGORITHMS (DSA framework) ──────────────────────────
  // Episode S1E1_A1: Graph Theory
  { id: 'DSA_1971_FIND_PATH',   episodeId: 'S1E1_A1', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Find if Path Exists in Graph',      scenario: 'A bidirectional graph of n nodes. edges[i] = [u, v] means there is an edge between u and v.', task: 'Return true if there is a valid path from source to destination.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'BFS or DFS from source. If you reach destination, return True.', explanation: 'BFS/DFS from source node. Mark visited. If destination is reached during traversal, path exists.' },
  { id: 'DSA_207_COURSE_SCHED',  episodeId: 'S1E1_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Course Schedule',                    scenario: 'To take course a you must first take course b — represented as [a, b]. Detect if finishing all courses is possible.', task: 'Return true if you can finish all numCourses given the prerequisites.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Model as a directed graph. If the graph has a cycle, it is impossible.', explanation: 'Topological sort / DFS cycle detection. If a back-edge is found during DFS, a cycle exists → impossible.' },
  { id: 'DSA_684_REDUNDANT_CONN',episodeId: 'S1E1_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Redundant Connection',              scenario: 'A tree is an undirected connected acyclic graph with n nodes. One extra edge was added. Find it.', task: 'Return the edge that, if removed, makes the graph a tree. If multiple, return the last one in the input.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Use Union-Find. The edge that tries to union two nodes already in the same set is the redundant one.', explanation: 'Union-Find: process edges in order. The first edge [u, v] where find(u) == find(v) creates a cycle.' },
  // Episode S1E2_A1: Backtracking
  { id: 'DSA_78_SUBSETS',        episodeId: 'S1E2_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Subsets',                            scenario: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.', task: 'Return all subsets of nums in any order.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Backtrack: at each index, decide to include or exclude the element. Base case: index == len(nums).', explanation: 'DFS backtracking. For each element you have two choices: include it or skip it. Total 2^n subsets.' },
  { id: 'DSA_46_PERMUTATIONS',   episodeId: 'S1E2_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Permutations',                       scenario: 'Given an array of distinct integers, return all possible permutations in any order.', task: 'Return all permutations of nums.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Backtrack: swap nums[start] with each nums[i], recurse, then swap back.', explanation: 'Swap-based DFS: fix position start, try every remaining element at that position, recurse for start+1, then undo swap.' },
  { id: 'DSA_39_COMBINATION_SUM',episodeId: 'S1E2_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Combination Sum',                   scenario: 'Find all unique combinations of candidates that sum to target. Numbers may be reused.', task: 'Return all unique combinations of candidates where the chosen numbers sum to target.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Backtrack: try each candidate starting from index i (allow reuse). If remaining == 0, found a solution.', explanation: 'DFS: subtract candidate from remaining target and recurse. Allow same index to reuse numbers. Prune when remaining < 0.' },
  // Episode S1E4_A1: Dijkstra
  { id: 'DSA_743_NETWORK_DELAY', episodeId: 'S1E4_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Network Delay Time',                 scenario: 'n network nodes labeled 1..n. times[i] = [u, v, w] is a directed edge from u to v with travel time w. Send a signal from node k.', task: 'Return the time it takes for all n nodes to receive the signal, or -1 if impossible.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: "Dijkstra from node k. Answer = max of all shortest distances. If any node is unreachable (dist = ∞), return -1.", explanation: "Dijkstra's: build adjacency list, min-heap (dist, node), relax edges. Result is max(dist.values()) if all reachable." },
  { id: 'DSA_1631_MIN_EFFORT',   episodeId: 'S1E4_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Path with Minimum Effort',          scenario: 'A 2D grid of heights. The effort of a path is the maximum absolute difference between adjacent cells. Find the path from top-left to bottom-right with minimum effort.', task: 'Return the minimum effort required to travel from top-left to bottom-right.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Modified Dijkstra: instead of sum of weights, minimize the maximum edge weight along the path.', explanation: 'Dijkstra with dist[r][c] = min effort to reach (r,c). Heap entry: (effort, r, c). Relax: effort = max(current, |h1-h2|).' },
  { id: 'DSA_787_CHEAP_FLIGHTS', episodeId: 'S1E4_A1', tier: 3, category: 'ALGORITHMS', points: 200, difficulty: 4, title: 'Cheapest Flights Within K Stops',  scenario: 'n cities, flights with costs. Find the cheapest flight from src to dst with at most k stops.', task: 'Return the cheapest price, or -1 if no such route exists.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Bellman-Ford with k+1 iterations (k stops = k+1 edges). Or modified Dijkstra tracking stops.', explanation: 'Bellman-Ford: relax all edges at most k+1 times. Keep previous-round costs to avoid chaining updates within one round.' },
  // Episode S1E5_A1: BFS/DFS
  { id: 'DSA_200_NUM_ISLANDS',   episodeId: 'S1E5_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Number of Islands',                 scenario: "A 2D grid of '1' (land) and '0' (water). An island is surrounded by water and formed by connecting adjacent land cells horizontally/vertically.", task: 'Return the number of islands.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'BFS/DFS from each unvisited land cell. Mark the whole connected component as visited.', explanation: "DFS: for each '1' not yet visited, increment count and flood-fill all connected '1's by marking them '0' (visited)." },
  { id: 'DSA_994_ROTTING_ORANGES',episodeId: 'S1E5_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Rotting Oranges',                  scenario: 'A 2D grid: 0=empty, 1=fresh, 2=rotten. Every minute, fresh oranges adjacent (4-dirs) to rotten ones become rotten.', task: 'Return the minimum minutes until no fresh orange remains, or -1 if impossible.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Multi-source BFS from all initially rotten oranges simultaneously.', explanation: 'Add all rotten oranges to BFS queue at step 0. Each BFS level = 1 minute. Count fresh remaining after BFS.' },
  { id: 'DSA_102_LEVEL_ORDER',   episodeId: 'S1E5_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Binary Tree Level Order Traversal', scenario: 'Given the root of a binary tree, return the node values level by level (left to right, level by level).', task: 'Return a list of lists — each inner list is one level of the tree.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'BFS with a queue. At each level, process all nodes currently in the queue (track queue size before adding children).', explanation: 'BFS: queue starts with root. For each level, snapshot queue size n, process n nodes (add their values), enqueue children.' },
  // Episode S2E1_A1: Divide & Conquer
  { id: 'DSA_169_MAJORITY',      episodeId: 'S2E1_A1', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Majority Element',                  scenario: 'The majority element appears more than n/2 times. Such an element always exists.', task: 'Return the majority element.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: "Boyer-Moore Voting: candidate starts at nums[0], count=1. If next equals candidate, count++, else count--. When count=0, update candidate.", explanation: 'Boyer-Moore: the majority element survives the cancellation process. O(n) time, O(1) space.' },
  { id: 'DSA_53_MAX_SUBARRAY',   episodeId: 'S2E1_A1', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 2, title: 'Maximum Subarray',                  scenario: 'Find the contiguous subarray with the largest sum.', task: 'Return the sum of the subarray with the largest sum.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: "Kadane's algorithm: keep a running sum. If adding the next element makes it worse than starting fresh, start fresh.", explanation: "Kadane's: curr = nums[0], best = nums[0]. For each x in nums[1:]: curr = max(x, curr+x); best = max(best, curr)." },
  { id: 'DSA_912_SORT_ARRAY',    episodeId: 'S2E1_A1', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Sort an Array',                     scenario: 'Sort an array of integers in ascending order. You must implement it yourself — do not use a built-in sort function.', task: 'Return the sorted array.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Implement merge sort: split array in half, sort each half recursively, merge the two sorted halves.', explanation: 'Merge sort is classic divide & conquer. O(n log n). Divide until single elements, then merge pairs maintaining sorted order.' },

  // ── Arc 5 — DATA STRUCTURES (DSA framework) ───────────────────────────────
  // Episode S1E1_A5: Hash Maps & Tries
  { id: 'DSA_49_GROUP_ANAGRAMS',    episodeId: 'S1E1_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Group Anagrams',                    scenario: 'Group strings that are anagrams of each other. An anagram uses all the original letters exactly once.', task: 'Return a list of groups. Each group contains all strings that are anagrams of each other.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Sort each string alphabetically — anagrams produce the same sorted key. Use a dictionary keyed by sorted string.', explanation: 'defaultdict(list): for each word, key = tuple(sorted(word)), append word to dict[key]. Return dict.values().' },
  { id: 'DSA_383_RANSOM_NOTE',       episodeId: 'S1E1_A5', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Ransom Note',                       scenario: 'Given two strings, return true if you can construct ransomNote using only letters from magazine. Each letter in magazine may only be used once.', task: 'Return true if ransomNote can be constructed from magazine.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Count the frequency of each letter in magazine. Then check if ransomNote needs more of any letter than available.', explanation: 'Counter(magazine): for each char in ransomNote, decrement its count. If count goes below 0, return False.' },
  { id: 'DSA_205_ISOMORPHIC',        episodeId: 'S1E1_A5', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Isomorphic Strings',               scenario: 'Two strings are isomorphic if characters in s can be replaced to get t. Replacements must preserve character order and be consistent (one character maps to exactly one other).', task: 'Return true if s and t are isomorphic.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Maintain two maps: s_to_t and t_to_s. If a mapping conflicts, return False.', explanation: 'Two dictionaries: s_to_t[s[i]] = t[i] and t_to_s[t[i]] = s[i]. Conflict = existing mapping ≠ current char.' },
  // Episode S1E2_A5: Priority Queues & Heaps
  { id: 'DSA_703_KTH_LARGEST_STREAM',episodeId: 'S1E2_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Kth Largest Element in a Stream', scenario: 'Design a class that finds the kth largest element in a stream of numbers.', task: 'Implement KthLargest(k, nums) and add(val) which returns the kth largest each time.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Maintain a min-heap of size k. The smallest element in the heap is always the kth largest.', explanation: 'heapq of size k. If heap size < k or val > heap[0], push val. If heap > k, pop smallest. heap[0] is kth largest.' },
  { id: 'DSA_347_TOP_K_FREQUENT',    episodeId: 'S1E2_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Top K Frequent Elements',         scenario: 'Given an integer array and k, return the k most frequent elements. You may return the answer in any order.', task: 'Return the k most frequent elements.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Count frequencies with a Counter, then use heapq.nlargest(k, counter.keys(), key=counter.get).', explanation: 'Bucket sort O(n): count frequencies, create buckets[freq] = [numbers]. Scan from high freq to low, collect k elements.' },
  { id: 'DSA_215_KTH_LARGEST',       episodeId: 'S1E2_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Kth Largest Element in an Array', scenario: 'Find the kth largest element in an unsorted array. It is the kth largest in sorted order (not the kth distinct element).', task: 'Return the kth largest element.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Quickselect partitions around a pivot — O(n) average. Or maintain a min-heap of size k.', explanation: 'Min-heap of size k: push each element, pop if size > k. Heap root = kth largest. O(n log k).' },
  // Episode S1E3_A5: Binary Search Trees
  { id: 'DSA_700_SEARCH_BST',        episodeId: 'S1E3_A5', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Search in a Binary Search Tree',  scenario: 'Given the root of a BST and a value val, return the subtree rooted at the node with that value, or null if it does not exist.', task: 'Return the node where node.val == val, or null.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'BST property: if val < node.val go left, if val > node.val go right.', explanation: 'Recursive or iterative: if node is None return None; if val == node.val return node; recurse left or right.' },
  { id: 'DSA_98_VALIDATE_BST',        episodeId: 'S1E3_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Validate Binary Search Tree',    scenario: 'Given a binary tree, determine if it is a valid BST — all left subtree values < node, all right > node.', task: 'Return true if the tree is a valid BST.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Pass allowed range [min, max] to each recursive call. The root must be in (-∞, +∞).', explanation: 'Recursive validate(node, min_val, max_val): check min_val < node.val < max_val; recurse left with max=node.val, right with min=node.val.' },
  { id: 'DSA_230_KTH_SMALLEST_BST',   episodeId: 'S1E3_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 2, title: 'Kth Smallest Element in a BST', scenario: 'Given the root of a BST and an integer k, return the kth smallest value.', task: 'Return the kth smallest value in the BST.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'In-order traversal of a BST visits nodes in ascending order. The kth node visited is your answer.', explanation: 'Iterative in-order with a stack. Count nodes visited; when count reaches k, return current node value.' },
  // Episode S1E4_A5: Arrays & Prefix Sums
  { id: 'DSA_238_PRODUCT_EXCEPT',    episodeId: 'S1E4_A5', tier: 2, category: 'ALGORITHMS', points: 150, difficulty: 3, title: 'Product of Array Except Self',   scenario: 'Return an array answer where answer[i] is the product of all elements except nums[i]. No division allowed, O(n) time.', task: 'Return the product array.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Two passes: left pass builds prefix products, right pass accumulates suffix products.', explanation: 'answer[i] = prefix[i] * suffix[i]. Left pass: answer[i] = product of nums[0..i-1]. Right pass: multiply by product of nums[i+1..n-1].' },
  { id: 'DSA_303_RANGE_SUM',         episodeId: 'S1E4_A5', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Range Sum Query - Immutable',    scenario: 'Given an integer array, handle multiple sumRange(i, j) queries efficiently.', task: 'Implement NumArray(nums) and sumRange(left, right) that returns sum of nums[left..right] in O(1).', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Precompute prefix sums. sumRange(l, r) = prefix[r+1] - prefix[l].', explanation: 'prefix[i] = sum(nums[0..i-1]). sumRange(l, r) = prefix[r+1] - prefix[l]. O(n) build, O(1) query.' },
  { id: 'DSA_724_PIVOT_INDEX',       episodeId: 'S1E4_A5', tier: 1, category: 'ALGORITHMS', points: 100, difficulty: 1, title: 'Find Pivot Index',                scenario: 'The pivot index is where the sum of all numbers to the left equals the sum to the right.', task: 'Return the leftmost pivot index, or -1 if none exists.', artifacts: [], flag: 'DSA_HONOR_SOLVED', attemptsAllowed: 1, hint: 'Precompute total sum. For index i: left_sum == total - left_sum - nums[i] means it is the pivot.', explanation: 'total = sum(nums). Walk left to right tracking left_sum. Pivot when left_sum == total - left_sum - nums[i].' }
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
  // ── Arc 1 ──────────────────────────────────────────────────────
  'S1E1_A1': [
    { icon: '📄', title: 'Introduction to Graph Theory', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs.cornell.edu', desc: 'Covers directed/undirected graphs, weighted edges, adjacency matrices and lists.', link: 'https://www.cs.cornell.edu/courses/cs2800/2015fa/handouts/graph_theory.pdf', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '▶', title: "Kruskal's and Prim's MST Algorithms", tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Abdul Bari · 18 min', desc: 'Clear walkthrough of both MST algorithms with animated examples.', link: 'https://www.youtube.com/watch?v=4ZlRH0eK-qQ', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E2_A1': [
    { icon: '📄', title: 'Cook-Levin Theorem — P vs NP', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org', desc: 'The foundational paper establishing NP-completeness and SAT reductions.', link: 'https://arxiv.org/abs/0910.4698', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'P vs NP — Explained Visually', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Computerphile · 10 min', desc: 'Intuitive introduction to the hardest open problem in computer science.', link: 'https://www.youtube.com/watch?v=YX40hbAHx3s', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E3_A1': [
    { icon: '◈', title: 'Greedy vs Dynamic Programming', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'When greedy fails and why DP finds the global optimum — with Knapsack examples.', link: 'https://www.geeksforgeeks.org/greedy-approach-vs-dynamic-programming/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '▶', title: '0/1 Knapsack Dynamic Programming', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Abdul Bari · 22 min', desc: 'Full derivation of the DP table for 0/1 Knapsack with complexity analysis.', link: 'https://www.youtube.com/watch?v=8LusJS5-AGo', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E4_A1': [
    { icon: '◈', title: "Dijkstra's Algorithm — Step by Step", tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'Implementation and complexity analysis of Dijkstra with min-heap priority queue.', link: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '◈', title: 'Bellman-Ford vs Dijkstra', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cp-algorithms.com', desc: 'When negative weights require Bellman-Ford and why Dijkstra breaks on them.', link: 'https://cp-algorithms.com/graph/bellman_ford.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  // ── Arc 2 ──────────────────────────────────────────────────────
  'S1E1_A2': [
    { icon: '◈', title: 'iptables Firewall Rules Guide', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'digitalocean.com', desc: 'Practical guide to configuring stateful packet filtering with iptables on Linux.', link: 'https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '◈', title: 'Network Address Translation (NAT) Explained', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cloudflare.com', desc: 'How NAT maps private IPs to public IPs and why it matters for security architecture.', link: 'https://www.cloudflare.com/learning/network-layer/what-is-nat/', iconStyle: { background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.15)', color: '#4fc3f7' } },
  ],
  'S1E2_A2': [
    { icon: '▶', title: 'Buffer Overflow Attack — Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · LiveOverflow · 14 min', desc: 'Stack smashing, return address overwriting, and NOP sleds demonstrated live.', link: 'https://www.youtube.com/watch?v=T03idxny9jE', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Smashing the Stack for Fun and Profit', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'phrack.org', desc: 'The classic 1996 paper by Aleph One — the definitive stack overflow reference.', link: 'http://phrack.org/issues/49/14.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A2': [
    { icon: '◈', title: 'DDoS Attack Types and Mitigation', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cloudflare.com', desc: 'SYN floods, amplification attacks, and traffic scrubbing techniques.', link: 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/', iconStyle: { background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.15)', color: '#4fc3f7' } },
    { icon: '◈', title: 'Snort IDS Rule Writing Guide', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'snort.org', desc: 'Writing custom detection rules for network intrusion detection systems.', link: 'https://www.snort.org/documents', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E4_A2': [
    { icon: '📄', title: 'RSA Cryptosystem — Original Paper', tag: 'PAPER', tagClass: 'rtag-p', src: 'cacm.acm.org · Rivest, Shamir, Adleman 1978', desc: 'The original 1978 paper introducing RSA public-key cryptography.', link: 'https://dl.acm.org/doi/10.1145/359340.359342', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'RSA Encryption — How it Works', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Computerphile · 12 min', desc: 'Modular exponentiation, key generation, and why factoring is hard.', link: 'https://www.youtube.com/watch?v=wXB-V_Keiu8', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  // ── Arc 3 ──────────────────────────────────────────────────────
  'S1E1': [
    { icon: '▶', title: 'Neural Networks from Scratch', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 19 min', desc: 'Build intuition for neurons, weighted sums, and activation functions visually.', link: 'https://www.youtube.com/watch?v=aircAruvnKk', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'McCulloch-Pitts Neuron — Original Model', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'towardsdatascience.com', desc: 'History and math behind the first computational model of a neuron.', link: 'https://towardsdatascience.com/mcculloch-pitts-model-5fdf65ac5dd1', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E2': [
    { icon: '▶', title: 'Why Hidden Layers Matter — XOR Problem', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 21 min', desc: 'Visual proof of why single-layer perceptrons cannot solve XOR.', link: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Universal Approximation Theorem', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'neuralnetworksanddeeplearning.com', desc: 'Why two-layer networks can approximate any continuous function.', link: 'http://neuralnetworksanddeeplearning.com/chap4.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3': [
    { icon: '▶', title: 'Backpropagation Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 14 min', desc: 'Chain rule derivation of backprop with animated gradient flow through layers.', link: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '📄', title: 'Vanishing Gradients & ReLU', tag: 'PAPER', tagClass: 'rtag-p', src: 'proceedings.mlr.press · Glorot & Bengio 2010', desc: 'The paper demonstrating vanishing gradients and proposing ReLU as a fix.', link: 'http://proceedings.mlr.press/v9/glorot10a/glorot10a.pdf', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
  ],
  'S2E1': [
    { icon: '📄', title: 'Attention Is All You Need', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Vaswani et al. 2017', desc: 'The original Transformer paper introducing scaled dot-product attention.', link: 'https://arxiv.org/abs/1706.03762', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '◈', title: 'Illustrated Transformer', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'jalammar.github.io', desc: 'Step-by-step visual breakdown of the attention mechanism and Transformer architecture.', link: 'https://jalammar.github.io/illustrated-transformer/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S2E2': [
    { icon: '◈', title: 'The Annotated Transformer', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'nlp.seas.harvard.edu', desc: 'Line-by-line PyTorch implementation of the full Transformer encoder-decoder.', link: 'https://nlp.seas.harvard.edu/annotated-transformer/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '▶', title: 'Multi-Head Attention — Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Yannic Kilcher · 25 min', desc: 'Deep dive into multi-head attention splitting, residual connections, and layer norm.', link: 'https://www.youtube.com/watch?v=iDulhoQ2pro', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S2E3': [
    { icon: '📄', title: 'An Image is Worth 16x16 Words: ViT', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Dosovitskiy et al. 2020', desc: 'The foundational ViT paper. Understand patch-embedding before the math.', link: 'https://arxiv.org/abs/2010.11929', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'But what is a convolution?', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 23 min', desc: 'Build intuition for CNNs before learning what ViTs replace.', link: 'https://www.youtube.com/watch?v=TrdevFK_am4', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'ViT Explained with Code', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'theaisummer.com', desc: 'Patch tokens, positional encoding, the CLS token.', link: 'https://theaisummer.com/vision-transformer/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📄', title: 'A ConvNet for the 2020s — ConvNeXt', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Liu et al. 2022', desc: 'Modernised CNNs matching ViTs. Critical for nuance.', link: 'https://arxiv.org/abs/2201.03545', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '◈', title: 'Convolutional Networks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs231n.stanford.edu', desc: 'CNN inductive biases — locality, weight sharing, translation equivariance.', link: 'https://cs231n.github.io/convolutional-networks/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '📊', title: 'ViT Benchmarks', tag: 'LIVE DATA', tagClass: 'rtag-a', src: 'paperswithcode.com', desc: 'Where ViTs dominate vs where CNNs hold.', link: 'https://paperswithcode.com/methods/category/vision-transformer', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
  ],
  'S1E1_A9': [
    { icon: '▶', title: 'Variables, Loops & Conditionals — CS50 Shorts', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · CS50 · 10 min', desc: 'Harvard CS50 introduction to variables, loops (for/while), and if/else — the three building blocks of every program.', link: 'https://www.youtube.com/watch?v=wEdXExljuGA', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Python Tutorial: First Steps', tag: 'DOCS', tagClass: 'rtag-a', src: 'python.org · 10 min', desc: 'Covers numbers, strings, variables, and the range() function for loops — written for absolute beginners.', link: 'https://docs.python.org/3/tutorial/introduction.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E2_A9': [
    { icon: '▶', title: 'Strings in Python — CS Dojo', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · CS Dojo · 12 min', desc: 'String indexing, slicing, built-in methods (len, split, strip), and character-by-character iteration.', link: 'https://www.youtube.com/watch?v=k9TUPpGqYTo', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Python Docs: Common String Methods', tag: 'DOCS', tagClass: 'rtag-a', src: 'python.org · 8 min', desc: 'Official reference for str.upper(), str.split(), str.strip(), str.replace() and other essential methods.', link: 'https://docs.python.org/3/library/stdtypes.html#string-methods', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A9': [
    { icon: '▶', title: 'Functions & Return Values — CS50 Shorts', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · CS50 · 9 min', desc: 'Defining functions, passing arguments, returning values, and scope — with beginner-friendly examples.', link: 'https://www.youtube.com/watch?v=n1glFqt3g38', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '▶', title: 'Recursion Explained — Visual Introduction', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Reducible · 14 min', desc: 'How a function calling itself works, the base case, and how to trace recursive calls step by step.', link: 'https://www.youtube.com/watch?v=IJDJ0kBx2LM', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E4_A9': [
    { icon: '▶', title: 'Lists & Arrays — CS50 Shorts', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · CS50 · 8 min', desc: 'Creating lists, indexing, appending, iterating, and why arrays are the most fundamental data structure.', link: 'https://www.youtube.com/watch?v=K1-3Cm30R2s', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Python Lists — Official Tutorial', tag: 'DOCS', tagClass: 'rtag-a', src: 'python.org · 10 min', desc: 'Covers list creation, slicing, mutation, list methods (append, pop, sort), and nested lists.', link: 'https://docs.python.org/3/tutorial/datastructures.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  // ── Arc 4 ──────────────────────────────────────────────────────
  'S1E1_A4': [
    { icon: '◈', title: 'Network Topology Types', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cloudflare.com', desc: 'Star, ring, mesh, and tree topologies — tradeoffs in redundancy and cost.', link: 'https://www.cloudflare.com/learning/network-layer/what-is-a-network-topology/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '▶', title: 'BFS and DFS Graph Traversal', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Abdul Bari · 16 min', desc: 'Breadth-first and depth-first search with adjacency list implementation.', link: 'https://www.youtube.com/watch?v=pcKY4hjDrxk', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E2_A4': [
    { icon: '◈', title: 'TCP Three-Way Handshake', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cloudflare.com', desc: 'SYN, SYN-ACK, ACK — how TCP establishes a reliable connection.', link: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/', iconStyle: { background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.15)', color: '#4fc3f7' } },
    { icon: '◈', title: 'Sequence Number Prediction Attacks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs.columbia.edu', desc: 'How predictable TCP ISNs enable session hijacking — historical analysis.', link: 'https://www.cs.columbia.edu/~smb/papers/ipext.pdf', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A4': [
    { icon: '📄', title: 'In Search of an Understandable Consensus Algorithm (Raft)', tag: 'PAPER', tagClass: 'rtag-p', src: 'raft.github.io · Ongaro & Ousterhout 2014', desc: 'The original Raft paper — leader election, log replication, and safety proofs.', link: 'https://raft.github.io/raft.pdf', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '◈', title: 'CAP Theorem Explained', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'ibm.com', desc: 'Consistency, Availability, Partition tolerance — and why you can only guarantee two.', link: 'https://www.ibm.com/topics/cap-theorem', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E4_A4': [
    { icon: '◈', title: 'BGP Explained — How the Internet Routes', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cloudflare.com', desc: 'AS paths, LOCAL_PREF, MED, and how BGP selects the best route.', link: 'https://www.cloudflare.com/learning/security/glossary/what-is-bgp/', iconStyle: { background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.15)', color: '#4fc3f7' } },
    { icon: '◈', title: 'BGP Hijacking Incidents', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'bgpmon.net', desc: 'Real-world BGP hijack case studies and how RPKI prevents them.', link: 'https://www.bgpmon.net/bgp-hijacking/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  // ── Arc 5 ──────────────────────────────────────────────────────
  'S1E1_A5': [
    { icon: '▶', title: 'Hash Tables — How They Work', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · CS Dojo · 14 min', desc: 'Chaining, open addressing, load factor, and amortised O(1) lookup.', link: 'https://www.youtube.com/watch?v=KyUTuwz_b7Q', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Trie Data Structure', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'Prefix trie implementation for autocomplete and word search in O(m) time.', link: 'https://www.geeksforgeeks.org/trie-insert-and-search/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E2_A5': [
    { icon: '▶', title: 'Binary Heap and Priority Queue', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · WilliamFiset · 12 min', desc: 'Min-heap, heapify, extract-min, and insert with O(log n) guarantee.', link: 'https://www.youtube.com/watch?v=t0Cq6tVNRBA', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Fibonacci Heap vs Binary Heap', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs.princeton.edu', desc: 'Amortised complexity comparison — when Fibonacci heaps outperform binary heaps.', link: 'https://www.cs.princeton.edu/~wayne/cs423/fibonacci/FibonacciHeapAlgorithm.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A5': [
    { icon: '▶', title: 'AVL Trees — Rotations Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Abdul Bari · 26 min', desc: 'LL, RR, LR, RL rotations with step-by-step visualisation and height proofs.', link: 'https://www.youtube.com/watch?v=jDM6_TnYIqE', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Self-Balancing BSTs Comparison', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'AVL vs Red-Black trees — when to use each and their complexity guarantees.', link: 'https://www.geeksforgeeks.org/avl-tree-vs-red-black-tree/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E4_A5': [
    { icon: '▶', title: 'Segment Trees — Range Queries', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · WilliamFiset · 19 min', desc: 'Build, query, and update a segment tree in O(log n) with lazy propagation.', link: 'https://www.youtube.com/watch?v=ZBHKZF5w4YU', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Persistent Segment Trees', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cp-algorithms.com', desc: 'Preserve historical versions of segment trees for offline range queries.', link: 'https://cp-algorithms.com/data_structures/segment_tree.html', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  // ── Arc 6 ──────────────────────────────────────────────────────
  'S1E1_A6': [
    { icon: '◈', title: 'Bit Manipulation Tricks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'Popcount, lowest set bit, XOR duplicate detection, and power-of-two checks.', link: 'https://www.geeksforgeeks.org/bits-manipulation-important-tactics/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '◈', title: 'Sean Anderson Bit Tricks', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'graphics.stanford.edu', desc: 'The famous Stanford bit-twiddling hacks reference used in competitive programming.', link: 'https://graphics.stanford.edu/~seander/bithacks.html', iconStyle: { background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.15)', color: '#4fc3f7' } },
  ],
  'S1E2_A6': [
    { icon: '▶', title: 'Quicksort vs Introsort', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Back To Back SWE · 17 min', desc: 'Partition schemes, worst-case pivots, and why introsort is used in production.', link: 'https://www.youtube.com/watch?v=MZaf_9IZCrc', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Introsort Algorithm', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'How introsort combines quicksort, heapsort, and insertion sort for O(n log n) worst-case.', link: 'https://www.geeksforgeeks.org/introsort-or-introspective-sort/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A6': [
    { icon: '◈', title: "Kadane's Algorithm — Maximum Subarray", tag: 'ARTICLE', tagClass: 'rtag-a', src: 'geeksforgeeks.org', desc: 'O(n) dynamic programming solution to the maximum subarray sum problem.', link: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
    { icon: '▶', title: 'Sliding Window Technique', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · NeetCode · 13 min', desc: 'Fixed and variable-length sliding window patterns for O(n) substring problems.', link: 'https://www.youtube.com/watch?v=jM2dhDPYMQM', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  'S1E4_A6': [
    { icon: '▶', title: 'Minimax with Alpha-Beta Pruning', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Sebastian Lague · 20 min', desc: 'Game tree search, pruning redundant branches, and applying it to chess.', link: 'https://www.youtube.com/watch?v=l-hh51ncgDI', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Alpha-Beta Pruning Explained', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'cs.cornell.edu', desc: 'Formal correctness proof and complexity analysis of alpha-beta pruning.', link: 'https://www.cs.cornell.edu/courses/cs312/2002sp/lectures/rec21.htm', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  // ── Arc 7 ──────────────────────────────────────────────────────
  'S1E1_A7': [
    { icon: '▶', title: 'Essence of Linear Algebra', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · Series', desc: 'Visual intuition for vectors, matrices, determinants, and eigenvectors.', link: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'MIT 18.06 Linear Algebra — Gilbert Strang', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'ocw.mit.edu', desc: 'The classic linear algebra course — lecture notes, assignments, and exams.', link: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E2_A7': [
    { icon: '▶', title: 'Singular Value Decomposition (SVD) Visually', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 11 min', desc: 'Geometric intuition for SVD and its connection to eigendecomposition.', link: 'https://www.youtube.com/watch?v=vSczTbgc8Rc', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'PCA via SVD — Step by Step', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'towardsdatascience.com', desc: 'How truncated SVD enables dimensionality reduction and image compression.', link: 'https://towardsdatascience.com/pca-using-python-scikit-learn-e653f8989e60', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A7': [
    { icon: '▶', title: 'Gradient Descent — How Neural Networks Learn', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 21 min', desc: 'Loss landscapes, saddle points, and learning rate intuition visualised.', link: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '📄', title: 'Adam: A Method for Stochastic Optimization', tag: 'PAPER', tagClass: 'rtag-p', src: 'arxiv.org · Kingma & Ba 2015', desc: 'The foundational Adam optimizer paper combining momentum and RMSProp.', link: 'https://arxiv.org/abs/1412.6980', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
  ],
  'S1E4_A7': [
    { icon: '📄', title: 'A Tutorial on Support Vector Machines', tag: 'PAPER', tagClass: 'rtag-p', src: 'cs.cornell.edu · Burges 1998', desc: 'Lagrangian duality and KKT conditions applied to the SVM derivation.', link: 'https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote09.html', iconStyle: { background: 'rgba(185,255,0,.08)', border: '1px solid rgba(185,255,0,.15)', color: 'var(--lime)' } },
    { icon: '▶', title: 'Lagrange Multipliers — Explained Visually', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · Khan Academy · 9 min', desc: 'Constrained optimisation and KKT conditions with geometric intuition.', link: 'https://www.youtube.com/watch?v=yuqB-d5MjZA', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
  ],
  // ── Arc 8 ──────────────────────────────────────────────────────
  'S1E1_A8': [
    { icon: '▶', title: "Bayes' Theorem — Explained Simply", tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · 3Blue1Brown · 15 min', desc: 'Prior, likelihood, and posterior distributions with visual examples.', link: 'https://www.youtube.com/watch?v=HZGCoVF3YvM', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Naive Bayes Classifier', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'towardsdatascience.com', desc: 'Implementation and probability theory behind the Naive Bayes text classifier.', link: 'https://towardsdatascience.com/naive-bayes-classifier-81d512f50a7c', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E2_A8': [
    { icon: '▶', title: 'Markov Chains — Clearly Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · StatQuest · 18 min', desc: 'Transition matrices, stationary distributions, and convergence analysis.', link: 'https://www.youtube.com/watch?v=i3AkTO9HLXo', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Absorbing Markov Chains', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'dartmouth.edu', desc: 'Absorbing states, fundamental matrix, and first-passage time computation.', link: 'https://www.dartmouth.edu/~chance/teaching_aids/books_articles/probability_book/Chapter11.pdf', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E3_A8': [
    { icon: '▶', title: 'Monte Carlo Simulation Explained', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · ritvikmath · 12 min', desc: 'Estimating π, importance sampling, and convergence by the Law of Large Numbers.', link: 'https://www.youtube.com/watch?v=7ESK5SaP-bc', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Metropolis-Hastings MCMC Algorithm', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'towardsdatascience.com', desc: 'Step-by-step derivation and Python implementation of the MCMC sampler.', link: 'https://towardsdatascience.com/metropolis-hastings-algorithm-52cd76d20af0', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
  'S1E4_A8': [
    { icon: '▶', title: 'Hypothesis Testing — t-test and p-values', tag: 'VIDEO', tagClass: 'rtag-v', src: 'youtube.com · StatQuest · 16 min', desc: 'Null hypotheses, p-values, Type I/II errors, and statistical power.', link: 'https://www.youtube.com/watch?v=5Z9OIYA8He8', iconStyle: { background: 'rgba(232,0,13,.08)', border: '1px solid rgba(232,0,13,.15)', color: 'var(--red)' } },
    { icon: '◈', title: 'Bonferroni Correction — Multiple Comparisons', tag: 'ARTICLE', tagClass: 'rtag-a', src: 'statisticshowto.com', desc: 'Why testing 100 hypotheses inflates false positives and how Bonferroni fixes it.', link: 'https://www.statisticshowto.com/bonferroni-correction/', iconStyle: { background: 'rgba(0,255,65,.06)', border: '1px solid rgba(0,255,65,.12)', color: 'var(--crt)' } },
  ],
};
