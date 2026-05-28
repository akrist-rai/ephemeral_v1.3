import type Koa from 'koa';
import { randomUUID } from 'node:crypto';
import { createLogger } from '../lib/logger';
import { AppError, RateLimitError } from '../lib/errors';
import { config } from '../config';

const log = createLogger('MIDDLEWARE');

// ═══════════════════════════════════════════════
//  REQUEST ID — Trace every request end-to-end
// ═══════════════════════════════════════════════
export const requestId: Koa.Middleware = async (ctx, next) => {
  const incomingId = ctx.get('X-Request-Id');
  ctx.state.requestId = incomingId || randomUUID();
  ctx.set('X-Request-Id', ctx.state.requestId);
  await next();
};

// ═══════════════════════════════════════════════
//  RESPONSE TIME — Precise request timing
// ═══════════════════════════════════════════════
export const responseTime: Koa.Middleware = async (ctx, next) => {
  const start = performance.now();
  await next();
  const duration = (performance.now() - start).toFixed(2);
  ctx.set('X-Response-Time', `${duration}ms`);
};

// ═══════════════════════════════════════════════
//  REQUEST LOGGER — Structured request/response log
// ═══════════════════════════════════════════════
export const requestLogger: Koa.Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  const status = ctx.status;
  const method = ctx.method;
  const url = ctx.url;
  const size = ctx.response.length || 0;

  const logLine = `${method} ${url} → ${status} (${duration}ms, ${size}b)`;

  if (status >= 500) {
    log.error(logLine, { requestId: ctx.state.requestId });
  } else if (status >= 400) {
    log.warn(logLine, { requestId: ctx.state.requestId });
  } else {
    log.info(logLine);
  }
};

// ═══════════════════════════════════════════════
//  ERROR HANDLER — Centralized error processing
// ═══════════════════════════════════════════════
export const errorHandler: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err: unknown) {
    if (err instanceof AppError) {
      ctx.status = err.statusCode;
      ctx.body = {
        success: false,
        error: err.message,
        code: err.code,
        ...(err instanceof RateLimitError ? { retryAfter: err.retryAfter } : {}),
        ...('details' in err && (err as any).details ? { details: (err as any).details } : {}),
        meta: {
          requestId: ctx.state.requestId,
          timestamp: new Date().toISOString(),
        },
      };

      // Only log 5xx app errors as true errors
      if (err.statusCode >= 500) {
        log.error(`[${err.code}] ${err.message}`, { stack: err.stack });
        ctx.app.emit('error', err, ctx);
      }
    } else if (err instanceof Error) {
      // Unexpected errors — never leak internals in production
      const status = (err as any).status || (err as any).statusCode || 500;
      ctx.status = status;
      ctx.body = {
        success: false,
        error: config.isDev ? err.message : 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        ...(config.isDev ? { stack: err.stack } : {}),
        meta: {
          requestId: ctx.state.requestId,
          timestamp: new Date().toISOString(),
        },
      };

      log.error(`Unhandled: ${err.message}`, { stack: err.stack });
      ctx.app.emit('error', err, ctx);
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: 'Internal Server Error',
        code: 'UNKNOWN_ERROR',
        meta: {
          requestId: ctx.state.requestId,
          timestamp: new Date().toISOString(),
        },
      };
      log.fatal('Non-Error thrown', { value: String(err) });
    }
  }
};

// ═══════════════════════════════════════════════
//  404 HANDLER — Catch unmatched routes
// ═══════════════════════════════════════════════
export const notFound: Koa.Middleware = async (ctx) => {
  if (ctx.status === 404 && !ctx.body) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: `Route ${ctx.method} ${ctx.path} not found`,
      code: 'NOT_FOUND',
      meta: {
        requestId: ctx.state.requestId,
        timestamp: new Date().toISOString(),
      },
    };
  }
};

// ═══════════════════════════════════════════════
//  RATE LIMITER — Token-bucket per IP
// ═══════════════════════════════════════════════
interface RateBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, RateBucket>();

// Periodic cleanup to prevent memory leaks from stale buckets
const BUCKET_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > config.rateLimit.windowMs * 3) {
      buckets.delete(key);
    }
  }
}, BUCKET_CLEANUP_INTERVAL);

export function rateLimit(maxRequests?: number): Koa.Middleware {
  const limit = maxRequests || config.rateLimit.maxRequests;
  const windowMs = config.rateLimit.windowMs;

  return async (ctx, next) => {
    const key = ctx.ip || ctx.request.ip || 'unknown';
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket) {
      bucket = { tokens: limit, lastRefill: now };
      buckets.set(key, bucket);
    }

    // Refill tokens proportionally to elapsed time
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = (elapsed / windowMs) * limit;
    bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
      const retryAfter = Math.ceil(windowMs / 1000);
      ctx.set('Retry-After', String(retryAfter));
      ctx.set('X-RateLimit-Limit', String(limit));
      ctx.set('X-RateLimit-Remaining', '0');
      ctx.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
      throw new RateLimitError(retryAfter);
    }

    bucket.tokens -= 1;

    // Set rate-limit headers
    ctx.set('X-RateLimit-Limit', String(limit));
    ctx.set('X-RateLimit-Remaining', String(Math.floor(bucket.tokens)));
    ctx.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

    await next();
  };
}

// ═══════════════════════════════════════════════
//  SECURITY HEADERS — Additional hardening
// ═══════════════════════════════════════════════
export const securityHeaders: Koa.Middleware = async (ctx, next) => {
  await next();
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '0'); // Modern browsers use CSP instead
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  ctx.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  ctx.remove('X-Powered-By');
};

// ═══════════════════════════════════════════════
//  BODY SIZE GUARD — Reject oversized payloads early
// ═══════════════════════════════════════════════
export const bodySizeGuard = (maxBytes: number = 262144): Koa.Middleware => {
  return async (ctx, next) => {
    const contentLength = parseInt(ctx.get('content-length') || '0', 10);
    if (contentLength > maxBytes) {
      ctx.status = 413;
      ctx.body = {
        success: false,
        error: `Payload too large. Max ${maxBytes} bytes.`,
        code: 'PAYLOAD_TOO_LARGE',
        meta: {
          requestId: ctx.state.requestId,
          timestamp: new Date().toISOString(),
        },
      };
      return;
    }
    await next();
  };
};

// ═══════════════════════════════════════════════
//  CACHE CONTROL — API responses should not be cached
// ═══════════════════════════════════════════════
export const noCacheApi: Koa.Middleware = async (ctx, next) => {
  await next();
  if (ctx.path.startsWith('/api')) {
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    ctx.set('Pragma', 'no-cache');
  }
};
