import type { Context } from 'koa';
import { StatsService } from '../services/stats.service';
import { ok } from '../lib/response';

export class StatsController {
  /**
   * GET /api/stats/challenges — Solve counts + first blood for all challenges
   */
  static async getChallengeStats(ctx: Context) {
    const stats = await StatsService.getChallengeStats();
    ok(ctx, { stats });
  }

  /**
   * GET /api/stats/activity — Recent global solves feed
   */
  static async getActivity(ctx: Context) {
    const limit = Math.min(Number(ctx.query.limit) || 20, 50);
    const activity = await StatsService.getRecentActivity(limit);
    ok(ctx, { activity });
  }

  /**
   * GET /api/stats/profile/:userId — Full user profile stats
   */
  static async getUserProfile(ctx: Context) {
    const { userId } = ctx.params;
    const profile = await StatsService.getUserProfile(userId);
    ok(ctx, { profile });
  }
}
