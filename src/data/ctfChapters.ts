export interface CTFChapter {
  id: string;
  title: string;
  description: string;
  question: string;
  placeholder?: string;
  answer: string;
  hint: string;
}

export const EXPLICIT_CHAPTERS: Record<string, CTFChapter[]> = {
  'WEB_SQLI_001': [
    {
      id: 'sqli_ch1',
      title: 'Chapter 1: Target Profiling',
      description: 'Analyze the intercepted authentication schema dump and server query logs. Find the exact column identifier in the database operators table that stores clearance permissions.',
      question: 'What is the exact column name storing security clearances?',
      placeholder: 'column_name…',
      answer: 'security_clearance',
      hint: 'Inspect the columns listed in the SYSTEM DUMP table headers.'
    },
    {
      id: 'sqli_ch2',
      title: 'Chapter 2: Syntactic Injection Analysis',
      description: 'The authentication gateway interpolates user input directly into single quotes. To inject our payload successfully, we must terminate the username string. Identify the SQL string delimiter character.',
      question: 'Submit the single character that terminates string inputs in SQL.',
      placeholder: 'character…',
      answer: "'",
      hint: 'It is a single quote.'
    },
    {
      id: 'sqli_ch3',
      title: 'Chapter 3: Database Privilege Bypass',
      description: 'Now, construct the full injection payload. Use the string delimiter to exit the username field, then append a logic condition that forces the query to return TRUE regardless of the password field, allowing admin login.',
      question: 'Submit the SQL injection payload to bypass the login portal (Flag).',
      placeholder: "admin' OR…",
      answer: "admin' OR '1'='1",
      hint: "Remember to use single quotes to balance the query structure."
    }
  ],
  'PWN_STACK_001': [
    {
      id: 'pwn_ch1',
      title: 'Chapter 1: POSIX Descriptors',
      description: 'The setuid binary utilizes integer indexes for standard descriptors. In Unix-like systems, standard input, standard output, and standard error are assigned indices 0, 1, and 2. What integer index represents standard input (stdin)?',
      question: 'What is the file descriptor integer for stdin?',
      placeholder: '0, 1, or 2…',
      answer: '0',
      hint: 'It is the floor of descriptor allocations.'
    },
    {
      id: 'pwn_ch2',
      title: 'Chapter 2: Hexadecimal Offset Conversion',
      description: 'The binary subtracts 0x1234 from your numeric argument to assign the file descriptor. Convert 0x1234 to decimal so we can calculate the argument required to open standard input.',
      question: 'What is 0x1234 in decimal?',
      placeholder: 'decimal value…',
      answer: '4660',
      hint: 'Convert 1234 hex to base 10 (1*16^3 + 2*16^2 + 3*16^1 + 4).'
    },
    {
      id: 'pwn_ch3',
      title: 'Chapter 3: Memory Hijacking',
      description: 'Now, pass the decimal offset as an argument to set the file descriptor to 0. The binary will then read standard input. Provide the specific 9-character buffer string required to print the flag.',
      question: 'Submit the buffer string that triggers flag output (Flag).',
      placeholder: 'buffer string…',
      answer: 'LETMEWIN',
      hint: 'Inspect the strcmp check in FD.C source code.'
    }
  ],
  'REV_XOR_001': [
    {
      id: 'rev_ch1',
      title: 'Chapter 1: Symmetric XOR Logic',
      description: 'XOR logic is symmetric: if A ^ B = C, then A ^ C = B. Calculate the hexadecimal value of the first character by XORing the target signature byte (0x11) with the mask (0x5A).',
      question: 'What is 0x11 XOR 0x5A? (Submit as hex prefix like 0x4B)',
      placeholder: '0xXX…',
      answer: '0x4B',
      hint: 'Do a bitwise XOR: 00010001 ^ 01011010.'
    },
    {
      id: 'rev_ch2',
      title: 'Chapter 2: Character Translation',
      description: 'Translate the computed hexadecimal byte (0x4B) to its ASCII character representation. This corresponds to the first letter of the license key.',
      question: 'What ASCII character corresponds to 0x4B?',
      placeholder: 'uppercase char…',
      answer: 'K',
      hint: '0x4B in decimal is 75. Look up ASCII character 75.'
    },
    {
      id: 'rev_ch3',
      title: 'Chapter 3: Complete Decryption',
      description: 'Decipher the remaining bytes by XORing the target array [0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14] against the key mask (0x5A). Combine them to obtain the full 6-character license key.',
      question: 'Submit the full decrypted 6-character license key (Flag).',
      placeholder: 'KEY…',
      answer: 'KEYPWN',
      hint: 'Perform the XOR decryption for all 6 indexes.'
    }
  ],
  'CRY_PADDING_001': [
    {
      id: 'cry_ch1',
      title: 'Chapter 1: PKCS#1 Structure',
      description: 'PKCS#1 v1.5 padding structures decrypted blocks by starting with two specific bytes indicating an encryption block. Identify the first two bytes in hexadecimal.',
      question: 'Submit the first two bytes of a valid block (e.g. 0x00 0x02).',
      placeholder: '0xXX 0xXX…',
      answer: '0x00 0x02',
      hint: 'Check standard PKCS#1 block layouts; it begins with zero and a block type byte.'
    },
    {
      id: 'cry_ch2',
      title: 'Chapter 2: Cryptanalyst Identification',
      description: 'Identify the Swiss cryptographer who published this padding oracle attack in 1998, demonstrating that attackers could decrypt RSA streams by querying padding state.',
      question: 'Submit the last name of the cryptographer (Flag).',
      placeholder: 'name…',
      answer: 'Bleichenbacher',
      hint: 'The attack is also known as the Million Message Attack.'
    }
  ],
  'ML_ADVERSARIAL_001': [
    {
      id: 'ml_ch1',
      title: 'Chapter 1: Gradient Descent vs Ascent',
      description: 'Adversarial attacks seek to maximize the classification loss of the model. To maximize the loss of a neural network with respect to input pixels, we must follow the direction of the gradient.',
      question: 'Do we move the input pixels in the "direction" or "opposite" to the gradient?',
      placeholder: 'direction or opposite…',
      answer: 'direction',
      hint: 'Gradient descent minimizes loss, while gradient ascent maximizes it.'
    },
    {
      id: 'ml_ch2',
      title: 'Chapter 2: Adversarial Taxonomy',
      description: 'Identify the specific acronym for the Fast Gradient Sign Method shown in the formula, which computes the sign of gradients to perturb inputs in a single step.',
      question: 'Submit the 4-letter acronym for this algorithm (Flag).',
      placeholder: 'acronym…',
      answer: 'FGSM',
      hint: 'It stands for Fast Gradient Sign Method.'
    }
  ],

  'ARRAY_BASICS_001': [
    {
      id: 'arr_ch1',
      title: 'Chapter 1: Zero-Based Counting',
      description: 'In most programming languages, arrays are zero-indexed: the first element lives at index 0, the second at index 1, and so on. A 5-element array has valid indices 0 through 4.',
      question: 'How many valid indices does an array of 5 elements have?',
      placeholder: 'number…',
      answer: '5',
      hint: 'Indices run from 0 to length-1, inclusive.'
    },
    {
      id: 'arr_ch2',
      title: 'Chapter 2: Off-by-One Diagnosis',
      description: 'The broken script queries index 5 on an array with 5 items. That index does not exist. The last valid index is always length − 1.',
      question: 'What is the last valid index of a 5-element array?',
      placeholder: 'index…',
      answer: '4',
      hint: 'Subtract 1 from the array length.'
    },
    {
      id: 'arr_ch3',
      title: 'Chapter 3: Locate the Loading Dock',
      description: 'The camera list is: ["Main Entrance", "Lobby", "Breakroom", "Server Room", "Loading Dock"]. Apply zero-based indexing to find the correct index for "Loading Dock".',
      question: 'What zero-based index holds "Loading Dock"? (Flag)',
      placeholder: 'index…',
      answer: '4',
      hint: 'Count from 0: 0=Main Entrance, 1=Lobby, 2=Breakroom, 3=Server Room, 4=Loading Dock.'
    }
  ],

  'GRAD_001': [
    {
      id: 'grad_ch1',
      title: 'Chapter 1: Vanishing Gradient Cause',
      description: 'The sigmoid activation function outputs values between 0 and 1. Its derivative peaks at 0.25 and approaches 0 at saturation extremes. When many sigmoid layers are stacked, gradients shrink exponentially during backpropagation.',
      question: 'What is the maximum derivative value of the sigmoid function?',
      placeholder: 'decimal…',
      answer: '0.25',
      hint: 'The sigmoid derivative is σ(x)·(1−σ(x)), maximised when σ(x)=0.5.'
    },
    {
      id: 'grad_ch2',
      title: 'Chapter 2: Identifying the Dead Zone',
      description: 'Scan the GRADIENT NORMS table. A vanished gradient has norm < 0.0001. Identify the highest-numbered layer (1-indexed) where the norm is still below that threshold.',
      question: 'What is the index of the last vanished layer? (Flag)',
      placeholder: 'layer index…',
      answer: '4',
      hint: 'Layer 4 norm is 0.00000008 — below the 0.0001 threshold. Layer 5 norm is 0.48 — healthy.'
    }
  ],

  'VIT_001': [
    {
      id: 'vit_ch1',
      title: 'Chapter 1: Multi-Head Attention Math',
      description: 'In multi-head attention each head processes a slice of the embedding. The head dimension is embed_dim / num_heads. This must be a whole integer — fractions are invalid.',
      question: 'What is 768 divided by 12?',
      placeholder: 'integer…',
      answer: '64',
      hint: '768 / 12 = 64, which is a valid head dimension.'
    },
    {
      id: 'vit_ch2',
      title: 'Chapter 2: Spot the Invalid Config',
      description: 'The broken config sets num_heads = 10. Check whether 768 divides evenly by 10.',
      question: 'What value of num_heads causes the crash? (Flag)',
      placeholder: 'num_heads value…',
      answer: '10',
      hint: '768 / 10 = 76.8, not an integer — invalid.'
    }
  ],

  'DEPLOY_001': [
    {
      id: 'dep_ch1',
      title: 'Chapter 1: Train vs Eval Mode',
      description: 'PyTorch models have two modes: train() and eval(). In train mode, Dropout randomly zeroes neurons and BatchNorm uses mini-batch statistics — both introduce randomness. In eval mode, Dropout is disabled and BatchNorm uses fixed running statistics.',
      question: 'Which mode should a deployed inference server use?',
      placeholder: 'train or eval…',
      answer: 'eval',
      hint: 'Inference must be deterministic — eval() disables stochastic operations.'
    },
    {
      id: 'dep_ch2',
      title: 'Chapter 2: Find the Bad Config Key',
      description: 'The inference config was copied directly from training without changing the mode field. Identify the exact string value of the "mode" key in the broken INFERENCE CONFIG.',
      question: 'What is the incorrect mode value in the deployed config? (Flag)',
      placeholder: 'value…',
      answer: 'train',
      hint: 'Look at the INFERENCE CONFIG — mode is still set to the training value.'
    }
  ],

  'LEAK_001': [
    {
      id: 'leak_ch1',
      title: 'Chapter 1: Temporal Leakage',
      description: 'Data leakage occurs when a feature in the training set contains information that would not be available at prediction time. A feature derived from the future event you are trying to predict is called a "temporal leak".',
      question: 'What term describes using future information to predict a past event?',
      placeholder: 'term…',
      answer: 'data leakage',
      hint: 'The model sees information it could never have at inference time.'
    },
    {
      id: 'leak_ch2',
      title: 'Chapter 2: Identify the Leaking Column',
      description: 'Review the FEATURE LIST. A fraud transaction is the event being predicted. One column is only populated after a fraud report is filed — meaning it encodes the label itself.',
      question: 'Which column name is the temporal leak? (Flag)',
      placeholder: 'column_name…',
      answer: 'fraud_report_date',
      hint: 'A report date can only exist after the fraud was already detected and filed.'
    }
  ],

  'LR_001': [
    {
      id: 'lr_ch1',
      title: 'Chapter 1: Learning Rate Schedulers',
      description: 'StepLR multiplies the learning rate by gamma every step_size epochs. When gamma > 1, the learning rate increases over time — the opposite of decay. Normal gamma values are between 0 and 1.',
      question: 'What should be the valid range for a StepLR gamma decay factor?',
      placeholder: 'range…',
      answer: '0 to 1',
      hint: 'Gamma < 1 decays LR. Gamma > 1 grows it, causing instability.'
    },
    {
      id: 'lr_ch2',
      title: 'Chapter 2: Spot the Culprit',
      description: 'Look at the BROKEN RUN CONFIG. The gamma parameter is set to a value that multiplies — not divides — the learning rate every 30 epochs, causing it to explode to NaN.',
      question: 'What exact gamma value caused the divergence? (Flag)',
      placeholder: 'number…',
      answer: '10.0',
      hint: 'The log shows LR jumped from 0.1 to 1.0 at epoch 3 — multiplied by 10.'
    }
  ],

  'TOK_001': [
    {
      id: 'tok_ch1',
      title: 'Chapter 1: Tokenization Basics',
      description: 'BPE tokenizers split text into subword tokens. Characters or sequences not in the vocabulary map to [UNK]. Emojis, accented characters, and many URL fragments fall outside small vocabularies.',
      question: 'What token does a BPE tokenizer emit for an out-of-vocabulary character?',
      placeholder: 'token…',
      answer: '[UNK]',
      hint: 'UNK stands for unknown — a catch-all for unseen tokens.'
    },
    {
      id: 'tok_ch2',
      title: 'Chapter 2: Count the Tokens',
      description: 'From the TOKENIZATION DEBUG log, count every token produced including all [UNK] placeholders.',
      question: 'How many tokens total does the tokenizer produce for the test input? (Flag)',
      placeholder: 'count…',
      answer: '10',
      hint: 'Count each entry in the token list: "great", "product", "!", "[UNK]", "visit", "[UNK]", ".", "[UNK]", "/", "[UNK]".'
    }
  ],

  'OVER_001': [
    {
      id: 'over_ch1',
      title: 'Chapter 1: Shortcut Learning',
      description: 'Neural networks can exploit spurious correlations in training data — learning a "shortcut" feature that predicts labels without understanding the true signal. This leads to perfect test accuracy but catastrophic failure on out-of-distribution data.',
      question: 'What is the term for a model exploiting spurious correlations instead of true signal?',
      placeholder: 'term…',
      answer: 'shortcut learning',
      hint: 'The model learned a trivial feature that happened to correlate with labels in training.'
    },
    {
      id: 'over_ch2',
      title: 'Chapter 2: The Grad-CAM Reveal',
      description: 'The GRAD-CAM HEATMAP shows where the model focuses. The attention hotspot is in the bottom-right corner — not on the medical imaging content. Cross-reference with the SCANNER METADATA to find what artifact lives in that region.',
      question: 'Submit the exact two-word artifact label that reveals the shortcut. (Flag)',
      placeholder: 'TWO WORDS…',
      answer: 'SCANNER METADATA',
      hint: 'Grad-CAM highlights the manufacturer text overlay region — look at which artifact describes it.'
    }
  ],

  'MEM_001': [
    {
      id: 'mem_ch1',
      title: 'Chapter 1: IEEE 754 Bit Corruption',
      description: 'Floating-point numbers are stored in IEEE 754 format. A single bit flip in the exponent field can change a small weight like 0.047 into a value of 10^18, completely overwhelming the network output.',
      question: 'Which field of an IEEE 754 float controls the magnitude of the number?',
      placeholder: 'field name…',
      answer: 'exponent',
      hint: 'The 32-bit float has three fields: sign (1 bit), exponent (8 bits), mantissa (23 bits).'
    },
    {
      id: 'mem_ch2',
      title: 'Chapter 2: Count the Corrupted Bytes',
      description: 'Review the FILE COMPARISON binary diff. Count every distinct byte offset listed as changed.',
      question: 'How many bytes differ between original and migrated model? (Flag)',
      placeholder: 'count…',
      answer: '3',
      hint: 'Three offsets are listed: 0x1A00FF30, 0x1A00FF31, 0x1A00FF32.'
    }
  ],

  'CRYPTO_001': [
    {
      id: 'crypt_ch1',
      title: 'Chapter 1: Caesar Cipher Mechanics',
      description: 'A Caesar cipher shifts each letter by a fixed amount in the alphabet. If G (position 6) maps to T (position 19), the shift is 19 − 6 = 13. This variant is known as ROT-13.',
      question: 'What is 19 minus 6?',
      placeholder: 'number…',
      answer: '13',
      hint: 'Subtract the plaintext letter position from the ciphertext letter position.'
    },
    {
      id: 'crypt_ch2',
      title: 'Chapter 2: Determine the Shift',
      description: 'Verify the shift by checking all four letter pairs: G→T, O→B, M→Z, U→H. All should produce the same shift value.',
      question: 'What shift value was used in the Caesar cipher? (Flag)',
      placeholder: 'shift…',
      answer: '13',
      hint: 'O is position 14, B is position 1. (14 + 13) mod 26 = 1. Consistent with ROT-13.'
    }
  ],

  'GRAPH_001': [
    {
      id: 'graph_ch1',
      title: 'Chapter 1: Minimum Spanning Tree Concept',
      description: 'A Minimum Spanning Tree (MST) connects all nodes in a weighted graph using the minimum total edge weight with no cycles. Kruskal\'s algorithm greedily adds the cheapest edge that does not create a cycle.',
      question: 'What algorithm adds edges in sorted order, skipping those that create cycles?',
      placeholder: 'algorithm name…',
      answer: "Kruskal's",
      hint: 'Named after Joseph Kruskal, it uses a union-find data structure to detect cycles.'
    },
    {
      id: 'graph_ch2',
      title: 'Chapter 2: Compute the MST Cost',
      description: 'Sort all edges by weight and apply Kruskal\'s: 1 (Chopper-Sanji) + 2 (Luffy-Nami) + 2 (Franky-Brook) + 3 (Nami-Usopp) + 3 (Brook-Jinbe) + 4 (Luffy-Zoro) + 4 (Robin-Franky) + 5 (Nami-Robin) = total. Skip Zoro-Sanji (5) as it creates a cycle.',
      question: 'What is the total MST cost? (Flag)',
      placeholder: 'integer…',
      answer: '24',
      hint: 'Add: 1+2+2+3+3+4+4+5 = 24.'
    }
  ],

  'BIAS_001': [
    {
      id: 'bias_ch1',
      title: 'Chapter 1: Demographic Parity',
      description: 'Demographic parity requires equal positive prediction rates across groups. The disparity gap is the absolute difference between the positive rates of two groups.',
      question: 'What is the positive prediction rate for Blue Sea defendants?',
      placeholder: 'percentage…',
      answer: '30',
      hint: '360 convictions from 1200 defendants = 30%.'
    },
    {
      id: 'bias_ch2',
      title: 'Chapter 2: Calculate the Gap',
      description: 'Grand Line defendants have a 70% conviction rate. Blue Sea defendants have a 30% conviction rate. Compute the absolute demographic parity gap.',
      question: 'What is the demographic parity gap as an integer percentage? (Flag)',
      placeholder: 'gap…',
      answer: '40',
      hint: '|70 − 30| = 40 percentage points.'
    }
  ],

  'NET_PORT_001': [
    {
      id: 'nport_ch1',
      title: 'Chapter 1: TCP Three-Way Handshake',
      description: 'A normal TCP connection completes three steps: SYN → SYN-ACK → ACK. This establishes a full-duplex session and is logged by most servers. A stealth scan avoids completing this handshake.',
      question: 'What is the third packet in a normal TCP handshake?',
      placeholder: 'packet type…',
      answer: 'ACK',
      hint: 'SYN, SYN-ACK, then the client confirms with an acknowledgement.'
    },
    {
      id: 'nport_ch2',
      title: 'Chapter 2: Identify the Stealth Scan',
      description: 'The PACKET INTERCEPT shows SYN sent, SYN-ACK received, then RST sent — killing the connection before ACK. This is a half-open scan that avoids logging. Its name is a 3-letter acronym matching the first packet type.',
      question: 'What is the 3-letter acronym of this stealth scan technique? (Flag)',
      placeholder: 'acronym…',
      answer: 'SYN',
      hint: 'Named after the first packet it sends — a SYN packet to probe the port.'
    }
  ],

  'NET_DNS_001': [
    {
      id: 'ndns_ch1',
      title: 'Chapter 1: DNS Resolution Flow',
      description: 'DNS maps domain names to IP addresses using UDP. Because UDP is connectionless and stateless, the first valid response a client receives wins — making it vulnerable to injection attacks.',
      question: 'What transport protocol does standard DNS use?',
      placeholder: 'protocol…',
      answer: 'UDP',
      hint: 'DNS uses UDP port 53 for standard queries.'
    },
    {
      id: 'ndns_ch2',
      title: 'Chapter 2: Name the Attack',
      description: 'The RESOLVER CAPTURE shows a forged reply arriving 12ms before the legitimate one. The attacker sniffed the query and responded first with a fake IP, poisoning the client\'s cache.',
      question: 'What two-word term describes this attack? (Flag)',
      placeholder: 'attack name…',
      answer: 'DNS Spoofing',
      hint: 'The attacker forges (spoofs) a DNS reply faster than the real resolver.'
    }
  ],

  'DS_HASH_001': [
    {
      id: 'hash_ch1',
      title: 'Chapter 1: Hash Function Properties',
      description: 'A hash function maps arbitrary-length input to a fixed-length output. Ideal hash functions are deterministic, fast to compute, and collision-resistant. A 16-bit hash has only 65,536 possible output values — a finite bucket for an infinite input space.',
      question: 'How many possible output values does a 16-bit hash function have?',
      placeholder: 'number…',
      answer: '65536',
      hint: '2^16 = 65,536.'
    },
    {
      id: 'hash_ch2',
      title: 'Chapter 2: Name the Condition',
      description: 'The HASH FUNCTION LOG shows two different inputs producing the same 0xF8B2 hash output. This property breaks both cryptographic integrity and index uniqueness constraints.',
      question: 'What is the one-word term for two inputs producing the same hash? (Flag)',
      placeholder: 'term…',
      answer: 'collision',
      hint: 'When two distinct inputs map to the same hash value, the hash has suffered a _____.'
    }
  ],

  'DS_BLOOM_001': [
    {
      id: 'bloom_ch1',
      title: 'Chapter 1: Probabilistic Membership',
      description: 'Some data structures trade exactness for speed and space. A probabilistic data structure can answer membership queries (is X in the set?) in O(1) time using a compact bit array and k hash functions.',
      question: 'What type of answer can a Bloom filter give about membership?',
      placeholder: 'type…',
      answer: 'probabilistic',
      hint: 'It gives a definite NO or a probable YES — false positives are possible, false negatives are not.'
    },
    {
      id: 'bloom_ch2',
      title: 'Chapter 2: Identify the Structure',
      description: 'The FILTER_METRICS.JSON shows a bit_array_length of 65536, four hash functions, 1.2% false positive rate, and 0% false negative rate. Name the data structure invented by Burton Howard Bloom in 1970.',
      question: 'What is the name of this probabilistic data structure? (Flag)',
      placeholder: 'name…',
      answer: 'Bloom Filter',
      hint: 'Named after its inventor — two words, first word is a surname.'
    }
  ],

  'CP_KNAP_001': [
    {
      id: 'knap_ch1',
      title: 'Chapter 1: 0/1 Knapsack Setup',
      description: 'The 0/1 Knapsack problem: given items with weights and values and a capacity W, choose items to maximise total value without exceeding W. Each item is either taken (1) or left (0).',
      question: 'What is the weight capacity of the salvage drone?',
      placeholder: 'kg…',
      answer: '15',
      hint: 'Read the scenario: "strict weight capacity limit of 15 kg".'
    },
    {
      id: 'knap_ch2',
      title: 'Chapter 2: Optimal Selection',
      description: 'Apply dynamic programming. The optimal subset is: Hyper-Drive (8kg, 210c) + Quantum Coil (3kg, 90c) + Neural Mesh (4kg, 100c) = 15kg total. Compute the combined credit value.',
      question: 'What is the maximum credit value the drone can secure? (Flag)',
      placeholder: 'credits…',
      answer: '400',
      hint: '210 + 90 + 100 = 400 credits at exactly 15 kg.'
    }
  ],

  'CP_DIJK_001': [
    {
      id: 'dijk_ch1',
      title: 'Chapter 1: Dijkstra\'s Algorithm',
      description: 'Dijkstra\'s algorithm finds shortest paths from a source node by greedily relaxing the cheapest unvisited node. It maintains a priority queue of tentative distances, updating them when a shorter path is found.',
      question: 'What data structure does Dijkstra\'s algorithm use to track the next node to visit?',
      placeholder: 'data structure…',
      answer: 'priority queue',
      hint: 'Dijkstra always processes the node with the smallest current distance first.'
    },
    {
      id: 'dijk_ch2',
      title: 'Chapter 2: Trace the Shortest Path',
      description: 'Trace A→B (2) → C (+1=3) → D (+3=6) → E (+1=7) → F (+2=9). Verify no shorter route exists via A→C (4) or any other path.',
      question: 'What is the minimum total latency from A to F? (Flag)',
      placeholder: 'ms…',
      answer: '9',
      hint: 'A→B→C→D→E→F: 2+1+3+1+2 = 9ms.'
    }
  ],

  'MATH_RSA_001': [
    {
      id: 'rsa_ch1',
      title: 'Chapter 1: RSA Factoring',
      description: 'RSA security relies on the difficulty of factoring the product n = p × q of two large primes. For small n, trial division works: test all primes up to √n.',
      question: 'What is the approximate square root of 3233?',
      placeholder: 'decimal…',
      answer: '56.8',
      hint: '56^2 = 3136, 57^2 = 3249. So √3233 ≈ 56.8.'
    },
    {
      id: 'rsa_ch2',
      title: 'Chapter 2: Find the Prime Factor',
      description: 'Test prime divisors below 57. Check if 3233 is divisible by 53.',
      question: 'What is the smaller prime factor p of 3233? (Flag)',
      placeholder: 'prime…',
      answer: '53',
      hint: '3233 / 53 = 61. Both 53 and 61 are prime.'
    }
  ],

  'MATH_ECC_001': [
    {
      id: 'ecc_ch1',
      title: 'Chapter 1: Elliptic Curve Point Multiplication',
      description: 'In ECC, multiplying a base point G by scalar d gives public key Q = dG. Point addition is efficient, but reversing it — finding d given G and Q — is computationally infeasible for large primes.',
      question: 'What operation on a point G produces the public key Q in ECC?',
      placeholder: 'operation…',
      answer: 'scalar multiplication',
      hint: 'Q = d × G — repeated point addition d times.'
    },
    {
      id: 'ecc_ch2',
      title: 'Chapter 2: Name the Hard Problem',
      description: 'Given G and Q = dG on an elliptic curve over a prime field, recovering d is called the Elliptic Curve Discrete Logarithm Problem. Submit its standard 5-letter acronym.',
      question: 'What is the 5-letter acronym for the hard problem underlying ECC? (Flag)',
      placeholder: 'acronym…',
      answer: 'ECDLP',
      hint: 'Elliptic Curve Discrete Logarithm Problem.'
    }
  ],

  'PY_001': [
    {
      id: 'py_ch1',
      title: 'Chapter 1: Python Type System',
      description: 'Python is dynamically typed but does not implicitly coerce types in arithmetic. Adding an integer to a string raises a TypeError. You must use built-in casting functions to convert types explicitly.',
      question: 'What Python built-in converts a string to an integer?',
      placeholder: 'function…',
      answer: 'int()',
      hint: 'Use int("10") to convert the string "10" to the integer 10.'
    },
    {
      id: 'py_ch2',
      title: 'Chapter 2: Fix the Type Mismatch',
      description: 'Given a = "10" and b = 20, write the single expression that correctly casts a and adds it to b.',
      question: 'Submit the Python expression to cast and add a and b. (Flag)',
      placeholder: 'expression…',
      answer: 'int(a) + b',
      hint: 'Wrap the string variable in int() before adding.'
    }
  ],

  'C_001': [
    {
      id: 'c_ch1',
      title: 'Chapter 1: Pointers in C',
      description: 'A pointer stores the memory address of another variable. The address-of operator & returns the address. The dereference operator * accesses the value at that address.',
      question: 'Which operator in C reads or writes the value at a pointer\'s address?',
      placeholder: 'operator…',
      answer: '*',
      hint: 'The asterisk (*) dereferences a pointer to access the underlying variable.'
    },
    {
      id: 'c_ch2',
      title: 'Chapter 2: Write the Dereference Statement',
      description: 'Given pointer p pointing to integer x, write the C statement that sets the value at p to 1337. Include the semicolon.',
      question: 'Submit the C dereference assignment statement. (Flag)',
      placeholder: 'statement…',
      answer: '*p = 1337;',
      hint: 'Dereference p with * and assign 1337 with the = operator.'
    }
  ],

  'GO_001': [
    {
      id: 'go_ch1',
      title: 'Chapter 1: Go Concurrency Model',
      description: 'Go uses goroutines — lightweight threads managed by the Go scheduler. Unlike OS threads, thousands of goroutines can run concurrently. They are launched with the go keyword before a function call.',
      question: 'What keyword launches a goroutine in Go?',
      placeholder: 'keyword…',
      answer: 'go',
      hint: 'Prefix any function call with "go " to run it concurrently.'
    },
    {
      id: 'go_ch2',
      title: 'Chapter 2: Dispatch the Goroutine',
      description: 'The dispatcher currently calls calculate() synchronously, blocking the main thread. Modify the call to run concurrently.',
      question: 'Submit the Go statement that launches calculate() as a goroutine. (Flag)',
      placeholder: 'statement…',
      answer: 'go calculate()',
      hint: 'Add the "go" keyword before the function call.'
    }
  ],

  'JS_001': [
    {
      id: 'js_ch1',
      title: 'Chapter 1: Loose vs Strict Equality',
      description: 'JavaScript\'s == operator performs type coercion before comparing, so 5 == "5" evaluates to true. This is a security risk in validation logic. The === operator checks both value and type — no coercion.',
      question: 'What does 5 == "5" evaluate to in JavaScript?',
      placeholder: 'true or false…',
      answer: 'true',
      hint: 'Double-equals coerces "5" to number 5 before comparing.'
    },
    {
      id: 'js_ch2',
      title: 'Chapter 2: Apply Strict Comparison',
      description: 'Write the strict equality expression for variables num and str that prevents type coercion and returns false when their types differ.',
      question: 'Submit the strict comparison expression. (Flag)',
      placeholder: 'expression…',
      answer: 'num === str',
      hint: 'Use triple-equals (===) for type-safe comparison.'
    }
  ]
};

export function getChaptersForChallenge(challengeId: string, finalFlag: string): CTFChapter[] {
  if (EXPLICIT_CHAPTERS[challengeId]) {
    return EXPLICIT_CHAPTERS[challengeId];
  }

  // Generate generic 2-chapter structure dynamically for any other challenge
  return [
    {
      id: `${challengeId}_ch1`,
      title: 'Chapter 1: Technical Analysis',
      description: 'Analyze the system parameters, logs, and trace artifacts. Identify the primary parameter value or indicator of vulnerability described in the scenario.',
      question: 'Perform the core analysis. Submit the target indicator or primary configuration value.',
      placeholder: 'value…',
      answer: finalFlag,
      hint: 'Look closely at the logs and configurations to locate the target flag.'
    }
  ];
}
