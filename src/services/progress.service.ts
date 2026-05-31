import { db } from '../db';
import { progress, users } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { ProgressUpsertData } from '../types';
import { createLogger } from '../lib/logger';

const log = createLogger('PROGRESS_SVC');

export class ProgressService {
  /** Get all progress records for a user. */
  static async getByUser(userId: string) {
    return await db.query.progress.findMany({
      where: eq(progress.userId, userId),
    });
  }

  /** Get a single progress record for a user + challenge pair. */
  static async getByUserAndChallenge(userId: string, challengeId: string) {
    return await db.query.progress.findFirst({
      where: and(
        eq(progress.userId, userId),
        eq(progress.challengeId, challengeId),
      ),
    }) ?? null;
  }

  /**
   * Upsert progress via Postgres ON CONFLICT — single atomic statement.
   * Partial `data` means only supplied fields are updated on conflict.
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
          ...(data.attemptsUsed !== undefined && { attemptsUsed: data.attemptsUsed }),
          ...(data.solved !== undefined       && { solved: data.solved }),
          ...(data.pointsEarned !== undefined && { pointsEarned: data.pointsEarned }),
          updatedAt: now,
        },
      })
      .returning();

    return result;
  }

  /**
   * Mark a challenge as solved and atomically increment the user's XP
   * inside a single DB transaction.
   *
   * This ensures the progress row and the user's XP counter are always
   * consistent — neither change is committed if the other fails.
   */
  static async solveWithXp(
    userId: string,
    challengeId: string,
    { attemptsUsed, pointsEarned }: { attemptsUsed: number; pointsEarned: number },
  ) {
    const now = new Date();

    await db.transaction(async (tx) => {
      // 1. Mark the challenge solved in the progress table
      await tx.insert(progress)
        .values({
          userId,
          challengeId,
          attemptsUsed,
          solved: true,
          pointsEarned,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [progress.userId, progress.challengeId],
          set: { attemptsUsed, solved: true, pointsEarned, updatedAt: now },
        });

      // 2. Atomically increment user XP (SQL-level to avoid read-modify-write races)
      await tx.update(users)
        .set({ xp: sql`${users.xp} + ${pointsEarned}` })
        .where(eq(users.id, userId));
    });

    log.info(`Solved: ${userId} completed ${challengeId} (+${pointsEarned}xp)`);
  }
}
