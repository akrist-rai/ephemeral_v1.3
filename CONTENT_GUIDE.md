# Ephemeral Academy — Content Guide

This guide explains how to add new Arcs, Episodes, CTF Challenges, and Resources to the Ephemeral platform.

To radically simplify the process, all platform content has been centralized into a single file: **`src/data/content.ts`**. You no longer need to hunt through different React components or backend seed scripts.

## 1. Where to Add Content
Open **`src/data/content.ts`**. Inside, you will find four main arrays/objects:
- `ARCS`: The main thematic categories (e.g., Algorithms, Machine Learning).
- `EPISODES`: The individual lessons/steps within an Arc.
- `CHALLENGES`: The actual CTF questions and scenarios for the Arena.
- `EPISODE_RESOURCES`: The curated links, articles, and videos for each Episode.

## 2. Adding a New CTF Challenge
To add a new challenge to the CTF Arena, scroll to the `CHALLENGES` array in `src/data/content.ts` and add a new object to the list.

```typescript
{
  id: 'NEW_CHALLENGE_001',   // Unique ID
  tier: 1,                   // Difficulty tier (1, 2, or 3)
  category: 'REVERSE ENG',   // Topic tag
  points: 150,               // XP reward
  difficulty: 2,             // Internal difficulty metric
  title: 'My New Challenge',
  scenario: 'Context or story behind the challenge...',
  task: 'What the user actually needs to find...',
  artifacts: [               // Supporting data (tables, logs, configs)
    {
      type: 'log',           // Options: 'log', 'table', or 'config'
      label: 'SERVER LOGS',
      content: 'Any text content goes here...'
    }
  ],
  flag: 'hidden_flag',       // The exact answer the user must submit
  attemptsAllowed: 3,        // Number of tries
  hint: 'Look closely at the third line...',
  explanation: 'This explains the solution after they solve it or fail.'
}
```

## 3. Adding Curated Resources
Resources are tied to specific **Episode IDs**. Scroll to `EPISODE_RESOURCES` at the bottom of the file.

If you have an Episode with `id: 'S1E1'` and want to add a resource to it, just create a new key in the object or append to an existing one:
```typescript
export const EPISODE_RESOURCES: Record<string, Resource[]> = {
  'S1E1': [
    {
      icon: '▶',                             // Emoji icon
      title: 'Intro to Algorithms',          // Title of the resource
      tag: 'VIDEO',                          // Tag label
      tagClass: 'rtag-v',                    // CSS class: rtag-v (video), rtag-p (paper), rtag-a (article)
      src: 'youtube.com · 15 min',           // Source attribution
      desc: 'A great starting point.',       // Short description
      link: 'https://youtube.com/...',       // The actual URL
      iconStyle: {                           // Styling for the icon box
        background: 'rgba(232,0,13,.08)', 
        border: '1px solid rgba(232,0,13,.15)', 
        color: 'var(--red)' 
      }
    }
  ]
};
```

## 4. Applying Your Changes
Because Challenges, Arcs, and Episodes are stored in the database, you must **sync the database** after modifying `src/data/content.ts`.

Run the following command in your terminal:
```bash
bun run db:seed
```

**Note:** Resources will update immediately upon saving the file since they are read directly by the frontend.

---

**Summary Workflow:**
1. Open `src/data/content.ts`.
2. Add your objects to the relevant arrays.
3. Save the file.
4. Run `bun run db:seed` to push the new database entities.
