import type Koa from 'koa';

// ── EXTENDED KOA STATE ──
export interface AppState extends Koa.DefaultState {
  requestId: string;
  startTime: number;
}

export interface AppContext extends Koa.DefaultContext {
  state: AppState;
}

// ── API RESPONSE ENVELOPE ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  requestId?: string;
  responseTime?: string;
  timestamp?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── SUBMIT FLAG TYPES ──
export interface SubmitFlagInput {
  userId: string;
  challengeId: string;
  flagInput: string;
}

export type SubmitFlagStatus =
  | 'CORRECT'
  | 'WRONG'
  | 'ALREADY_SOLVED'
  | 'NO_ATTEMPTS_LEFT';

export interface SubmitFlagResult {
  status: SubmitFlagStatus;
  pointsEarned?: number;
  attemptsUsed?: number;
  attemptsRemaining?: number;
  failed?: boolean;
  actualFlag?: string;
}

// ── PROGRESS UPSERT ──
export interface ProgressUpsertData {
  attemptsUsed?: number;
  solved?: boolean;
  pointsEarned?: number;
}

// ── LEADERBOARD ──
export interface LeaderboardEntry {
  userId: string;
  xp: number;
  challengesSolved: number;
  rank: number;
}

// ── HEALTH CHECK ──
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  checks: {
    database: 'ok' | 'error';
  };
}
