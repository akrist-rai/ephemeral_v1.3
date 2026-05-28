import { db } from '../db';
import { users, progress } from '../db/schema';
import { desc, sql, eq } from 'drizzle-orm';
import type { LeaderboardEntry } from '../types';

export class LeaderboardService {
  /**
   * Get the top N users by XP, with solved challenge count.
   */
  static async getTopUsers(limit: number = 10): Promise<LeaderboardEntry[]> {
    const results = await db.select({
      userId: users.id,
      xp: users.xp,
      challengesSolved: sql<number>`
        COALESCE((
          SELECT count(*)::int FROM ${progress}
          WHERE ${progress.userId} = ${users.id} AND ${progress.solved} = true
        ), 0)
      `,
    })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit);

    return results.map((row, index) => ({
      userId: row.userId,
      xp: row.xp,
      challengesSolved: row.challengesSolved,
      rank: index + 1,
    }));
  }

  /**
   * Get a specific user's rank.
   */
  static async getUserRank(userId: string): Promise<number> {
    const result = await db.select({
      rank: sql<number>`
        (SELECT count(*) + 1 FROM ${users} u2 WHERE u2.${users.xp} > ${users.xp})
      `,
    })
      .from(users)
      .where(eq(users.id, userId));

    return result[0]?.rank ?? 0;
  }
}
