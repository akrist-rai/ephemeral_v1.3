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
   * GET /api/progress/:userId
   *
   * Returns the user's XP, solve count, and full progress array in a single
   * round-trip. The solved count is derived client-side from the progress array
   * rather than making a separate COUNT(*) query.
   */
  static async getProgress(ctx: Context) {
    const { userId } = ctx.params;

    // ensureUser + progress fetch: two queries, but unavoidable without a JOIN view
    const [user, progressRows] = await Promise.all([
      UserService.ensureUser(userId),
      ProgressService.getByUser(userId),
    ]);

    // Derive solve count locally — avoids a third round-trip to the DB
    const challengesSolved = progressRows.filter(p => p.solved).length;

    ok(ctx, {
      xp: user.xp,
      challengesSolved,
      progress: progressRows,
    });
  }

  /**
   * POST /api/progress/:userId/add-xp
   *
   * Awards calibration XP. Body is validated by addXpSchema (positive int, ≤10000).
   */
  static async addXp(ctx: Context) {
    const { userId } = ctx.params;
    const { xp } = ctx.request.body as { xp: number };

    await UserService.ensureUser(userId);
    const updated = await UserService.addXp(userId, xp);
    log.info(`Calibration XP: ${userId} +${xp}xp`);
    ok(ctx, { newXp: updated?.xp ?? 0 });
  }

  /**
   * POST /api/submit
   *
   * Evaluates a flag submission. On a correct answer the progress upsert and
   * XP increment are executed inside a single DB transaction so they succeed
   * or fail atomically.
   */
  static async submitFlag(ctx: Context) {
    const { userId, challengeId, flagInput } = ctx.request.body as SubmitFlagInput;

    // Ensure the user row exists (upsert-or-read)
    await UserService.ensureUser(userId);

    const challenge = await ChallengeService.getById(challengeId);
    if (!challenge) throw new NotFoundError('Challenge');

    // Fetch or initialise the progress row in one atomic upsert
    let userProg = await ProgressService.getByUserAndChallenge(userId, challengeId);
    if (!userProg) {
      userProg = await ProgressService.upsertProgress(userId, challengeId, {
        attemptsUsed: 0,
        solved: false,
        pointsEarned: 0,
      });
    }

    // ── Already solved ──────────────────────────────────────────────────────
    if (userProg.solved) {
      ok(ctx, { status: 'ALREADY_SOLVED' } satisfies SubmitFlagResult);
      return;
    }

    // ── Out of attempts ─────────────────────────────────────────────────────
    if (userProg.attemptsUsed >= challenge.attemptsAllowed) {
      ok(ctx, {
        status: 'NO_ATTEMPTS_LEFT',
        actualFlag: challenge.flag,
      } satisfies SubmitFlagResult);
      return;
    }

    // ── Compare (case-insensitive, whitespace-normalised) ───────────────────
    const normalise = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '_');
    const isCorrect  = normalise(flagInput) === normalise(challenge.flag);
    const newAttempts = userProg.attemptsUsed + 1;

    if (isCorrect) {
      // Decay-adjusted scoring
      let pointsEarned = challenge.points;
      if (newAttempts === 2) {
        pointsEarned = Math.round(challenge.points * config.scoring.attempt2Multiplier);
      } else if (newAttempts >= 3) {
        pointsEarned = Math.round(challenge.points * config.scoring.attempt3PlusMultiplier);
      }

      // Atomic: mark solved and award XP in one transaction
      await ProgressService.solveWithXp(userId, challengeId, {
        attemptsUsed: newAttempts,
        pointsEarned,
      });

      log.info(`Correct: ${userId} solved ${challengeId} (attempt ${newAttempts}, +${pointsEarned}pts)`);

      ok(ctx, {
        status: 'CORRECT',
        pointsEarned,
        attemptsUsed: newAttempts,
      } satisfies SubmitFlagResult);
    } else {
      await ProgressService.upsertProgress(userId, challengeId, {
        attemptsUsed: newAttempts,
      });

      const attemptsRemaining = challenge.attemptsAllowed - newAttempts;
      const failed = attemptsRemaining === 0;

      log.info(`Wrong: ${userId} on ${challengeId}, ${attemptsRemaining} attempts left`);

      ok(ctx, {
        status: 'WRONG',
        attemptsRemaining,
        failed,
        actualFlag: failed ? challenge.flag : undefined,
      } satisfies SubmitFlagResult);
    }
  }

  /**
   * GET /api/leaderboard
   */
  static async getLeaderboard(ctx: Context) {
    const limit = ctx.state.validatedQuery?.limit ?? 10;
    const leaderboard = await LeaderboardService.getTopUsers(limit);
    ok(ctx, { leaderboard });
  }
}
