import Router from '@koa/router';
import { ContentController } from '../controllers/content.controller';
import { UserController } from '../controllers/user.controller';
import { SystemController } from '../controllers/system.controller';
import { StatsController } from '../controllers/stats.controller';
import { validate } from '../middleware/validate';
import { rateLimit } from '../middleware';
import { config } from '../config';
import {
  submitFlagSchema,
  addXpSchema,
  userIdParamSchema,
  arcIdParamSchema,
  episodeIdParamSchema,
  challengeIdParamSchema,
  leaderboardQuerySchema,
  challengeFilterSchema,
} from '../validators';

const router = new Router({ prefix: '/api' });

// ═══════════════════════════════════════════════
//  SYSTEM — Health & diagnostics
// ═══════════════════════════════════════════════
router.get('/health', SystemController.healthCheck);
router.get('/ping', SystemController.ping);

// ═══════════════════════════════════════════════
//  CONTENT — Arcs, Episodes, Challenges (read-only)
// ═══════════════════════════════════════════════
router.get('/arcs', ContentController.getArcs);
router.get('/arcs/:arcId', validate(arcIdParamSchema, 'params'), ContentController.getArcById);
router.get('/episodes/:arcId', validate(arcIdParamSchema, 'params'), ContentController.getEpisodes);
// Episode-scoped challenge fetch — the canonical CTF arena loader
router.get('/episodes/:arcId/:episodeId/challenges', validate(episodeIdParamSchema, 'params'), ContentController.getChallengesByEpisode);
router.get('/challenges', validate(challengeFilterSchema, 'query'), ContentController.getChallenges);
router.get('/challenges/:challengeId', validate(challengeIdParamSchema, 'params'), ContentController.getChallengeById);
router.get('/avatars', ContentController.getAvatars);

// ═══════════════════════════════════════════════
//  USER — Progress & flag submission
// ═══════════════════════════════════════════════
router.get('/progress/:userId', validate(userIdParamSchema, 'params'), UserController.getProgress);
router.post('/progress/:userId/add-xp', validate(userIdParamSchema, 'params'), validate(addXpSchema), UserController.addXp);

router.post(
  '/submit',
  rateLimit(config.rateLimit.submitMaxRequests),
  validate(submitFlagSchema),
  UserController.submitFlag,
);

// ═══════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════
router.get('/leaderboard', validate(leaderboardQuerySchema, 'query'), UserController.getLeaderboard);

// ═══════════════════════════════════════════════
//  STATS — Challenge solve counts, activity, profiles
// ═══════════════════════════════════════════════
router.get('/stats/challenges', StatsController.getChallengeStats);
router.get('/stats/activity', StatsController.getActivity);
router.get('/stats/profile/:userId', validate(userIdParamSchema, 'params'), StatsController.getUserProfile);

export default router;
