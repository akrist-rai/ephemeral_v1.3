import { pgTable, text, integer, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// ── USERS TABLE ──
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Using text to support IDs like 'AK_0xD4'
  xp: integer('xp').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── CHALLENGES TABLE ──
// Stores the source of truth for flags and total points
export const challenges = pgTable('challenges', {
  id: text('id').primaryKey(), // e.g., 'GRAD_001'
  flag: text('flag').notNull(),
  points: integer('points').notNull(),
  attemptsAllowed: integer('attempts_allowed').notNull(),
});

// ── USER PROGRESS TABLE ──
// Tracks attempts, success state, and earned points for a specific user & challenge
export const progress = pgTable('progress', {
  userId: text('user_id').notNull().references(() => users.id),
  challengeId: text('challenge_id').notNull().references(() => challenges.id),
  attemptsUsed: integer('attempts_used').default(0).notNull(),
  solved: boolean('solved').default(false).notNull(),
  pointsEarned: integer('points_earned').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Composite primary key ensures one record per user per challenge
  pk: primaryKey({ columns: [table.userId, table.challengeId] }),
}));