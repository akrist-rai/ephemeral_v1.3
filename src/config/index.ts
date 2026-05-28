import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  // ── SERVER ──
  port: parseInt(process.env.PORT || '3000', 10),
  env: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // ── DATABASE ──
  databaseUrl: process.env.DATABASE_URL || '',

  // ── RATE LIMITING ──
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    submitMaxRequests: parseInt(process.env.RATE_LIMIT_SUBMIT_MAX || '10', 10),
  },

  // ── CORS ──
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  // ── BODY PARSER ──
  bodyParser: {
    jsonLimit: process.env.BODY_LIMIT || '256kb',
    formLimit: process.env.BODY_LIMIT || '256kb',
  },

  // ── XP DECAY ──
  scoring: {
    attempt2Multiplier: 0.7,
    attempt3PlusMultiplier: 0.4,
  },

  // ── SHUTDOWN ──
  shutdownTimeout: parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10),
} as const;

export type AppConfig = typeof config;
