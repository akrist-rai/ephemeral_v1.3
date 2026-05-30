import { db } from '../db';
import { challenges } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors';

// Columns exposed to the client — flag is NEVER included in list/filter endpoints.
const PUBLIC_COLUMNS = {
  id: true,
  episodeId: true,
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
   * Get all challenges belonging to a specific episode.
   */
  static async getByEpisodeId(episodeId: string) {
    return await db.query.challenges.findMany({
      columns: PUBLIC_COLUMNS,
      where: eq(challenges.episodeId, episodeId),
    });
  }

  /**
   * Get a single challenge by ID (includes flag — internal/submission use only).
   */
  static async getById(id: string) {
    return await db.query.challenges.findFirst({
      where: eq(challenges.id, id),
    }) ?? null;
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
   * Get challenges filtered by category / tier / difficulty.
   * Optionally scope to a specific episode.
   */
  static async getFiltered(filters: {
    episodeId?: string;
    tier?: number;
    category?: string;
    difficulty?: number;
  }) {
    return await db.query.challenges.findMany({
      columns: PUBLIC_COLUMNS,
      where: (ch, { eq, and }) => {
        const conditions = [];
        if (filters.episodeId) conditions.push(eq(ch.episodeId, filters.episodeId));
        if (filters.tier)      conditions.push(eq(ch.tier, filters.tier));
        if (filters.category)  conditions.push(eq(ch.category, filters.category));
        if (filters.difficulty) conditions.push(eq(ch.difficulty, filters.difficulty));
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });
  }
}
