import { z } from 'zod';

// ── SUBMIT FLAG ──
export const submitFlagSchema = z.object({
  userId: z.string().min(1, 'userId is required').max(64, 'userId too long'),
  challengeId: z.string().min(1, 'challengeId is required').max(64, 'challengeId too long'),
  flagInput: z.string().min(1, 'Flag cannot be empty').max(512, 'Flag too long'),
});

export type SubmitFlagInput = z.infer<typeof submitFlagSchema>;

// ── USER ID PARAM ──
export const userIdParamSchema = z.object({
  userId: z.string().min(1, 'userId is required').max(64),
});

// ── ARC ID PARAM ──
export const arcIdParamSchema = z.object({
  arcId: z.string().refine((val) => !Number.isNaN(Number.parseInt(val, 10)), {
    message: 'arcId must be a numeric string',
  }),
});

// ── CHALLENGE ID PARAM ──
export const challengeIdParamSchema = z.object({
  challengeId: z.string().min(1, 'challengeId is required').max(64),
});

// ── PAGINATION QUERY ──
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ── LEADERBOARD QUERY ──
export const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// ── CHALLENGE FILTER QUERY ──
export const challengeFilterSchema = z.object({
  episodeId: z.string().optional(),
  tier: z.coerce.number().int().min(1).optional(),
  category: z.string().optional(),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
});

// ── EPISODE ID PARAM ──
export const episodeIdParamSchema = z.object({
  arcId: z.string().refine((val) => !Number.isNaN(Number.parseInt(val, 10)), {
    message: 'arcId must be a numeric string',
  }),
  episodeId: z.string().min(1, 'episodeId is required').max(64),
});
