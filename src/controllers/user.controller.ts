import type { Context } from 'koa';
import { UserService } from '../services/user.service';
import { ProgressService } from '../services/progress.service';
import { ChallengeService } from '../services/challenge.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { NotFoundError } from '../lib/errors';
import { ok } from '../lib/response';
import { config } from '../config';
import { createLogger } from '../lib/logger';
import type { SubmitFlagInput, SubmitFlagResult } from '../types';

const log = createLogger('USER_CTRL');

export class UserController {
  /**
   * GET /api/progress/:userId — User profile + challenge progress
   */
  static async getProgress(ctx: Context) {
    const { userId } = ctx.params;
    const user = await UserService.ensureUser(userId);
    const progress = await ProgressService.getByUser(userId);
    const solvedCount = await ProgressService.getSolvedCount(userId);

    ok(ctx, {
      xp: user.xp,
      challengesSolved: solvedCount,
      progress,
    });
  }

  /**
   * POST /api/submit — Submit a flag attempt
   */
  static async submitFlag(ctx: Context) {
    const { userId, challengeId, flagInput } = ctx.request.body as SubmitFlagInput;

    await UserService.ensureUser(userId);

    const challenge = await ChallengeService.getById(challengeId);
    if (!challenge) {
      throw new NotFoundError('Challenge');
    }

    // ── CHECK EXISTING PROGRESS ──
    let userProg = await ProgressService.getByUserAndChallenge(userId, challengeId);

    if (!userProg) {
      userProg = await ProgressService.upsertProgress(userId, challengeId, {
        attemptsUsed: 0,
        solved: false,
        pointsEarned: 0,
      });
    }

    // ── ALREADY SOLVED ──
    if (userProg.solved) {
      ok(ctx, { status: 'ALREADY_SOLVED' } satisfies SubmitFlagResult);
      return;
    }

    // ── OUT OF ATTEMPTS ──
    if (userProg.attemptsUsed >= challenge.attemptsAllowed) {
      ok(ctx, {
        status: 'NO_ATTEMPTS_LEFT',
        actualFlag: challenge.flag,
      } satisfies SubmitFlagResult);
      return;
    }

    // ── COMPARE FLAGS ──
    const sanitize = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '_');
    const isCorrect = sanitize(flagInput) === sanitize(challenge.flag);
    const newAttemptsUsed = userProg.attemptsUsed + 1;

    if (isCorrect) {
      // ── CORRECT — Calculate decay-adjusted points ──
      let pointsEarned = challenge.points;
      if (newAttemptsUsed === 2) {
        pointsEarned = Math.round(challenge.points * config.scoring.attempt2Multiplier);
      } else if (newAttemptsUsed >= 3) {
        pointsEarned = Math.round(challenge.points * config.scoring.attempt3PlusMultiplier);
      }

      await ProgressService.upsertProgress(userId, challengeId, {
        solved: true,
        attemptsUsed: newAttemptsUsed,
        pointsEarned,
      });

      await UserService.addXp(userId, pointsEarned);

      log.info(`Flag correct: ${userId} solved ${challengeId} on attempt ${newAttemptsUsed} for ${pointsEarned}pts`);

      ok(ctx, {
        status: 'CORRECT',
        pointsEarned,
        attemptsUsed: newAttemptsUsed,
      } satisfies SubmitFlagResult);
    } else {
      // ── WRONG ──
      await ProgressService.upsertProgress(userId, challengeId, {
        attemptsUsed: newAttemptsUsed,
      });

      const attemptsRemaining = challenge.attemptsAllowed - newAttemptsUsed;
      const failed = attemptsRemaining === 0;

      log.info(`Flag wrong: ${userId} on ${challengeId}, ${attemptsRemaining} attempts left`);

      ok(ctx, {
        status: 'WRONG',
        attemptsRemaining,
        failed,
        actualFlag: failed ? challenge.flag : undefined,
      } satisfies SubmitFlagResult);
    }
  }

  /**
   * GET /api/leaderboard — Top users by XP
   */
  static async getLeaderboard(ctx: Context) {
    const limit = ctx.state.validatedQuery?.limit || 10;
    const leaderboard = await LeaderboardService.getTopUsers(limit);
    ok(ctx, { leaderboard });
  }
}
