# Simple Workflow to Add Content ⟁

Follow this simple, 4-step workflow to add new content (volumes, chapters, or interactive challenges) to the **Ephemeral** platform.

---

### Step 1: Open the Seed File
All application content resides in the local file:
`src/seed.ts`

---

### Step 2: Add Your Content to the Arrays

#### A. Create a Series Volume (Arc)
Scroll to the `ARCS` array in `src/seed.ts` and append a new object:
```typescript
{ 
  id: 9, // Increment from previous ID
  title: 'Quantum Realm',
  description: 'THE DIVERGENCE LIMIT',
  accColor: '#00e5ff', // Hex highlight color
  bgColor: '#000f14',  // Background glow
  asciiArt: `  .⟁.\n / ◉ \\\n QUANTUM\n NODE_09`, // Custom ASCII art
  domain: 'QUANTUM COMP',
  arcName: 'DIVERGENCE LIMIT',
  progressWidth: '0%'
}
```

#### B. Create Chapters (Episodes)
Scroll to the `EPISODES` array and add episodes linked by `arcId`:
```typescript
{ 
  id: 'S9E1', // Unique string ID
  arcId: 9,   // Matches your Arc ID from above
  n: 1,       // Episode sequential number
  title: "Mommy, what is a Qubit?",
  description: "Superposition and state vectors explained simply.",
  type: "quiz", // 'quiz' | 'research' | 'ctf'
  min: 25,    // Estimated duration in minutes
  xp: 100,    // XP rewarded on completion
  done: false,
  active: true // Set to true to feature this episode on the Home screen Hero
}
```

#### C. Create Interactive CTF Puzzles (Challenges)
If your episode uses the `ctf` type, scroll to the `CHALLENGES` array and add interactive challenges:
```typescript
{
  id: 'QUBIT_001', // Unique challenge ID
  tier: 1,
  category: 'SUPERPOSITION',
  points: 120, // XP rewarded on correct answer
  difficulty: 1,
  title: 'The Collapsed Vector',
  scenario: 'A quantum register was measured before final gate operations were complete.',
  task: 'Find the state with the highest probability. States are 0-indexed.',
  artifacts: [
    { type: 'table', label: 'MATRIX', content: 'State │ Amplitude\n──────┼──────────\n|00⟩  │ 0.500\n|10⟩  │ 0.866  ← peak' }
  ],
  flag: '1', // The correct answer (case-insensitive, spaces auto-converted to '_')
  attemptsAllowed: 3,
  hint: 'Probability is the squared amplitude magnitude.',
  explanation: 'Amplitude 0.866 squared is 0.75, which is the highest.'
}
```

---

### Step 3: Run the Seed Script
Apply the changes to your database instance:
```bash
bun run db:seed
```

---

### Step 4: Verify Live in Your Browser
Ensure your development environment is running:
```bash
bun run dev:full
```
Open `http://localhost:5173/` in your browser. Your new content will instantly render with computed stats, responsive layouts, and matching visual accent themes!
