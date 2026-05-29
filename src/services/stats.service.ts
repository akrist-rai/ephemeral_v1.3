import { db } from '../db';
import { progress, users, challenges } from '../db/schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';

export class StatsService {
  /**
   * Get solve count + first-blood for every challenge.
   * Returns: { [challengeId]: { solveCount, firstBlood: userId | null } }
   */
  static async getChallengeStats(): Promise<Record<string, { solveCount: number; firstBlood: string | null }>> {
    // Solve counts
    const counts = await db
      .select({
        challengeId: progress.challengeId,
        solveCount: count(),
      })
      .from(progress)
      .where(eq(progress.solved, true))
      .groupBy(progress.challengeId);

    // First blood — earliest updatedAt per challenge among solved records
    const firstBloods = await db
      .select({
        challengeId: progress.challengeId,
        userId: progress.userId,
        ts: progress.updatedAt,
      })
      .from(progress)
      .where(eq(progress.solved, true))
      .orderBy(progress.updatedAt);

    const fb: Record<string, string> = {};
    for (const row of firstBloods) {
      if (!fb[row.challengeId]) fb[row.challengeId] = row.userId;
    }

    const result: Record<string, { solveCount: number; firstBlood: string | null }> = {};
    for (const row of counts) {
      result[row.challengeId] = {
        solveCount: Number(row.solveCount),
        firstBlood: fb[row.challengeId] || null,
      };
    }
    return result;
  }

  /**
   * Get recent global solves (activity feed).
   */
  static async getRecentActivity(limit = 20) {
    const rows = await db
      .select({
        userId: progress.userId,
        challengeId: progress.challengeId,
        pointsEarned: progress.pointsEarned,
        solvedAt: progress.updatedAt,
      })
      .from(progress)
      .where(eq(progress.solved, true))
      .orderBy(desc(progress.updatedAt))
      .limit(limit);

    return rows;
  }

  /**
   * Get full profile stats for a specific user.
   * Returns breakdown by category, tier, accuracy, etc.
   */
  static async getUserProfile(userId: string) {
    // All progress rows for this user
    const userProgress = await db.query.progress.findMany({
      where: eq(progress.userId, userId),
    });

    // Join with challenges to get categories
    const allChallenges = await db.query.challenges.findMany();

    const chalMap: Record<string, typeof allChallenges[0]> = {};
    for (const ch of allChallenges) chalMap[ch.id] = ch;

    const solved = userProgress.filter(p => p.solved);
    const totalAttempts = userProgress.reduce((s, p) => s + p.attemptsUsed, 0);
    const totalSolved = solved.length;
    const totalXp = solved.reduce((s, p) => s + p.pointsEarned, 0);

    // Category breakdown
    const catStats: Record<string, { solved: number; total: number; xp: number }> = {};
    for (const ch of allChallenges) {
      if (!catStats[ch.category]) catStats[ch.category] = { solved: 0, total: 0, xp: 0 };
      catStats[ch.category].total++;
    }
    for (const p of solved) {
      const ch = chalMap[p.challengeId];
      if (ch) {
        catStats[ch.category].solved++;
        catStats[ch.category].xp += p.pointsEarned;
      }
    }

    // Tier breakdown
    const tierStats: Record<number, { solved: number; total: number }> = { 1: { solved: 0, total: 0 }, 2: { solved: 0, total: 0 }, 3: { solved: 0, total: 0 } };
    for (const ch of allChallenges) {
      if (tierStats[ch.tier]) tierStats[ch.tier].total++;
    }
    for (const p of solved) {
      const ch = chalMap[p.challengeId];
      if (ch && tierStats[ch.tier]) tierStats[ch.tier].solved++;
    }

    // First solve (earliest)
    const sortedSolves = [...solved].sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
    const firstSolve = sortedSolves[0] || null;
    const lastSolve = sortedSolves[sortedSolves.length - 1] || null;

    // Accuracy: challenges where solved on first attempt
    const firstAttemptSolves = solved.filter(p => p.attemptsUsed === 1).length;
    const accuracy = totalSolved > 0 ? Math.round((firstAttemptSolves / totalSolved) * 100) : 0;

    // User rank
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const rankResult = await db.select({
      rank: sql<number>`(SELECT count(*) + 1 FROM users u2 WHERE u2.xp > ${users.xp})`,
    }).from(users).where(eq(users.id, userId));

    return {
      userId,
      xp: user?.xp || 0,
      rank: rankResult[0]?.rank || 0,
      totalSolved,
      totalChallenges: allChallenges.length,
      totalAttempts,
      accuracy,
      firstAttemptSolves,
      catStats,
      tierStats,
      firstSolveAt: firstSolve?.updatedAt || null,
      lastSolveAt: lastSolve?.updatedAt || null,
      joinedAt: user?.createdAt || null,
    };
  }
}
