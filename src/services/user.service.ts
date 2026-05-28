import { db } from '../db';
import { users } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors';
import { createLogger } from '../lib/logger';

const log = createLogger('USER_SVC');

export class UserService {
  /**
   * Find a user by ID. Returns null if not found.
   */
  static async getById(userId: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, userId),
    }) || null;
  }

  /**
   * Find or create a user. Always returns the user record.
   */
  static async ensureUser(userId: string) {
    const existing = await this.getById(userId);
    if (existing) return existing;

    // Insert-or-ignore pattern: handles race conditions
    const [created] = await db.insert(users)
      .values({ id: userId, xp: 0 })
      .onConflictDoNothing({ target: users.id })
      .returning();

    // In case of conflict (another request created it), fetch it
    if (!created) {
      const user = await this.getById(userId);
      if (!user) throw new Error(`Failed to create or find user ${userId}`);
      return user;
    }

    log.info(`New user created: ${userId}`);
    return created;
  }

  /**
   * Atomically add XP to a user. Uses SQL increment to prevent race conditions.
   */
  static async addXp(userId: string, xpAmount: number) {
    if (xpAmount <= 0) return;

    const [updated] = await db.update(users)
      .set({ xp: sql`${users.xp} + ${xpAmount}` })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundError('User');
    }

    log.info(`XP awarded: ${userId} +${xpAmount}xp (total: ${updated.xp})`);
    return updated;
  }

  /**
   * Get total user count — useful for leaderboard pagination info.
   */
  static async getCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result[0]?.count || 0);
  }
}
