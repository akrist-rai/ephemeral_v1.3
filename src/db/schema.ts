import { pgTable, text, integer, boolean, timestamp, primaryKey, jsonb } from 'drizzle-orm/pg-core';

// ── USERS TABLE ──
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  xp: integer('xp').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── ARCS TABLE ──
export const arcs = pgTable('arcs', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  accColor: text('acc_color'),
  bgColor: text('bg_color'),
  asciiArt: text('ascii_art'),
  domain: text('domain'),
  arcName: text('arc_name'),
  progressWidth: text('progress_width'),
});

// ── EPISODES TABLE ──
export const episodes = pgTable('episodes', {
  id: text('id').primaryKey(),
  arcId: integer('arc_id').notNull().references(() => arcs.id),
  n: integer('n').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'quiz', 'ctf', 'research'
  min: integer('min').notNull(),
  xp: integer('xp').notNull(),
  art: text('art'),
  bg: text('bg'),
  active: boolean('active').default(false).notNull(),
  locked: boolean('locked').default(false).notNull(),
  done: boolean('done').default(false).notNull(),
});

// ── CHALLENGES TABLE ──
export const challenges = pgTable('challenges', {
  id: text('id').primaryKey(),
  episodeId: text('episode_id').notNull().references(() => episodes.id),
  tier: integer('tier').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull(),
  difficulty: integer('diff').notNull(),
  title: text('title').notNull(),
  scenario: text('scenario').notNull(),
  task: text('task').notNull(),
  artifacts: jsonb('artifacts').notNull(),
  flag: text('flag').notNull(),
  attemptsAllowed: integer('attempts_allowed').notNull(),
  hint: text('hint'),
  explanation: text('explanation'),
});

// ── USER PROGRESS TABLE ──
export const progress = pgTable('progress', {
  userId: text('user_id').notNull().references(() => users.id),
  challengeId: text('challenge_id').notNull().references(() => challenges.id),
  attemptsUsed: integer('attempts_used').default(0).notNull(),
  solved: boolean('solved').default(false).notNull(),
  pointsEarned: integer('points_earned').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.challengeId] }),
}));
