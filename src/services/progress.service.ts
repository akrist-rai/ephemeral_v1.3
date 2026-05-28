import { db } from '../db';
import { progress } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { ProgressUpsertData } from '../types';
import { createLogger } from '../lib/logger';

const log = createLogger('PROGRESS_SVC');

export class ProgressService {
  /**
   * Get all progress records for a user.
   */
  static async getByUser(userId: string) {
    return await db.query.progress.findMany({
      where: eq(progress.userId, userId),
    });
  }

  /**
   * Get a single progress record for a user + challenge.
   */
  static async getByUserAndChallenge(userId: string, challengeId: string) {
    return await db.query.progress.findFirst({
      where: and(
        eq(progress.userId, userId),
        eq(progress.challengeId, challengeId),
      ),
    }) || null;
  }

  /**
   * Upsert progress using Postgres ON CONFLICT — single atomic query.
   */
  static async upsertProgress(userId: string, challengeId: string, data: ProgressUpsertData) {
    const now = new Date();

    const [result] = await db.insert(progress)
      .values({
        userId,
        challengeId,
        attemptsUsed: data.attemptsUsed ?? 0,
        solved: data.solved ?? false,
        pointsEarned: data.pointsEarned ?? 0,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [progress.userId, progress.challengeId],
        set: {
          ...(data.attemptsUsed !== undefined ? { attemptsUsed: data.attemptsUsed } : {}),
          ...(data.solved !== undefined ? { solved: data.solved } : {}),
          ...(data.pointsEarned !== undefined ? { pointsEarned: data.pointsEarned } : {}),
          updatedAt: now,
        },
      })
      .returning();

    return result;
  }

  /**
   * Get number of challenges solved by a user.
   */
  static async getSolvedCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.solved, true)));
    return Number(result[0]?.count || 0);
  }
}
