import { db } from '../db';
import { challenges } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors';

// Columns exposed to the client — flag is NEVER included
const PUBLIC_COLUMNS = {
  id: true,
  tier: true,
  category: true,
  points: true,
  difficulty: true,
  title: true,
  scenario: true,
  task: true,
  artifacts: true,
  hint: true,
  explanation: true,
  attemptsAllowed: true,
} as const;

export class ChallengeService {
  /**
   * Get all challenges with only public-safe columns (no flags).
   */
  static async getAll() {
    return await db.query.challenges.findMany({
      columns: PUBLIC_COLUMNS,
    });
  }

  /**
   * Get a single challenge by ID (includes flag — internal use only).
   */
  static async getById(id: string) {
    return await db.query.challenges.findFirst({
      where: eq(challenges.id, id),
    }) || null;
  }

  /**
   * Get a single challenge by ID with only public columns.
   */
  static async getPublicById(id: string) {
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, id),
      columns: PUBLIC_COLUMNS,
    });

    if (!challenge) throw new NotFoundError('Challenge');
    return challenge;
  }

  /**
   * Get challenges filtered by category/tier/difficulty.
   */
  static async getFiltered(filters: { tier?: number; category?: string; difficulty?: number }) {
    return await db.query.challenges.findMany({
      columns: PUBLIC_COLUMNS,
      where: (challenges, { eq, and }) => {
        const conditions = [];
        if (filters.tier) conditions.push(eq(challenges.tier, filters.tier));
        if (filters.category) conditions.push(eq(challenges.category, filters.category));
        if (filters.difficulty) conditions.push(eq(challenges.difficulty, filters.difficulty));
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });
  }
}
