import type { Context } from 'koa';
import { ArcService } from '../services/arc.service';
import { EpisodeService } from '../services/episode.service';
import { ChallengeService } from '../services/challenge.service';
import { ok } from '../lib/response';

export class ContentController {
  /**
   * GET /api/arcs — Fetch all story arcs
   */
  static async getArcs(ctx: Context) {
    const arcs = await ArcService.getAll();
    ok(ctx, { arcs });
  }

  /**
   * GET /api/arcs/:arcId — Fetch a single arc by ID
   */
  static async getArcById(ctx: Context) {
    const arcId = Number.parseInt(ctx.params.arcId, 10);
    const arc = await ArcService.getById(arcId);
    ok(ctx, { arc });
  }

  /**
   * GET /api/episodes/:arcId — Fetch episodes for an arc
   */
  static async getEpisodes(ctx: Context) {
    const arcId = Number.parseInt(ctx.params.arcId, 10);
    const episodes = await EpisodeService.getByArcId(arcId);
    ok(ctx, { episodes });
  }

  /**
   * GET /api/challenges — Fetch all challenges (flags excluded)
   */
  static async getChallenges(ctx: Context) {
    const filters = ctx.state.validatedQuery || {};
    const challenges = filters.tier || filters.category || filters.difficulty
      ? await ChallengeService.getFiltered(filters)
      : await ChallengeService.getAll();
    ok(ctx, { challenges, count: challenges.length });
  }

  /**
   * GET /api/challenges/:challengeId — Fetch a single challenge
   */
  static async getChallengeById(ctx: Context) {
    const challenge = await ChallengeService.getPublicById(ctx.params.challengeId);
    ok(ctx, { challenge });
  }

  /**
   * GET /api/avatars — Fetch all available custom player and cover avatars from public directory
   */
  static async getAvatars(ctx: Context) {
    const fs = require('fs');
    const path = require('path');
    try {
      // Serve all images from the top-level one_piece/ directory (no avatar/ subfolder)
      const imageDir = path.join(process.cwd(), 'public', 'one_piece');
      const files = await fs.promises.readdir(imageDir);
      const imageFiles = files.filter((f: string) => /\.(jpe?g|png|webp|gif)$/i.test(f));
      ok(ctx, { avatars: imageFiles.map((f: string) => `/one_piece/${f}`) });
    } catch (err: any) {
      ctx.throw(500, `Failed to load avatars: ${err.message}`);
    }
  }
}
