import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { Context } from 'koa';
import { ArcService } from '../services/arc.service';
import { EpisodeService } from '../services/episode.service';
import { ChallengeService } from '../services/challenge.service';
import { AppError } from '../lib/errors';
import { ok } from '../lib/response';

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

export class ContentController {
  /** GET /api/arcs — all story arcs */
  static async getArcs(ctx: Context) {
    const arcs = await ArcService.getAll();
    ok(ctx, { arcs });
  }

  /** GET /api/arcs/:arcId — single arc */
  static async getArcById(ctx: Context) {
    const arcId = Number.parseInt(ctx.params.arcId, 10);
    const arc = await ArcService.getById(arcId);
    ok(ctx, { arc });
  }

  /** GET /api/episodes/:arcId — all episodes for an arc */
  static async getEpisodes(ctx: Context) {
    const arcId = Number.parseInt(ctx.params.arcId, 10);
    const episodes = await EpisodeService.getByArcId(arcId);
    ok(ctx, { episodes });
  }

  /**
   * GET /api/challenges — all challenges, with optional filters.
   * Query params: episodeId, tier, category, difficulty
   */
  static async getChallenges(ctx: Context) {
    const filters = ctx.state.validatedQuery ?? {};
    const hasFilters = filters.episodeId || filters.tier || filters.category || filters.difficulty;
    const challenges = hasFilters
      ? await ChallengeService.getFiltered(filters)
      : await ChallengeService.getAll();
    ok(ctx, { challenges, count: challenges.length });
  }

  /**
   * GET /api/episodes/:arcId/:episodeId/challenges
   * Canonical loader for the CTF arena — scoped to a single episode.
   */
  static async getChallengesByEpisode(ctx: Context) {
    const { episodeId } = ctx.params;
    const challenges = await ChallengeService.getByEpisodeId(episodeId);
    ok(ctx, { challenges, count: challenges.length });
  }

  /** GET /api/challenges/:challengeId — single public-safe challenge */
  static async getChallengeById(ctx: Context) {
    const challenge = await ChallengeService.getPublicById(ctx.params.challengeId);
    ok(ctx, { challenge });
  }

  /**
   * GET /api/avatars — list all player avatar images from public/avatar/.
   * Returns paths relative to the public root so the client can use them directly.
   */
  static async getAvatars(ctx: Context) {
    const avatarDir = join(process.cwd(), 'public', 'avatar');
    let files: string[];
    try {
      files = await fs.readdir(avatarDir);
    } catch {
      throw new AppError('Avatar directory is unavailable', 503, 'ASSETS_UNAVAILABLE');
    }
    const avatars = files
      .filter(f => IMAGE_RE.test(f))
      .map(f => `/avatar/${f}`);
    ok(ctx, { avatars, count: avatars.length });
  }
}
