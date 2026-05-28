import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import json from 'koa-json';
import router from './routes';
import {
  errorHandler,
  requestId,
  responseTime,
  requestLogger,
  notFound,
  rateLimit,
  securityHeaders,
  bodySizeGuard,
  noCacheApi,
} from './middleware';
import { config } from './config';
import { createLogger } from './lib/logger';

const log = createLogger('SERVER');

const app = new Koa();

// ── Trust proxy headers (Vercel, Cloudflare, etc.) ──
app.proxy = true;

// ═══════════════════════════════════════════════
//  MIDDLEWARE PIPELINE — Order matters!
// ═══════════════════════════════════════════════
// 1. Error handling (outermost — catches everything downstream)
app.use(errorHandler);

// 2. Request context
app.use(requestId);
app.use(responseTime);

// 3. Structured logging
app.use(requestLogger);

// 4. Security
app.use(helmet({
  contentSecurityPolicy: config.isProd ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(securityHeaders);
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposeHeaders: ['X-Request-Id', 'X-Response-Time', 'X-RateLimit-Remaining'],
}));

// 5. Global rate limiter
app.use(rateLimit());

// 6. Body parsing & payload guard
app.use(bodySizeGuard());
app.use(json({ pretty: config.isDev }));
app.use(compress({
  threshold: 1024,
  gzip: { flush: require('zlib').constants.Z_SYNC_FLUSH },
}));
app.use(bodyParser({
  jsonLimit: config.bodyParser.jsonLimit,
  formLimit: config.bodyParser.formLimit,
  enableTypes: ['json'],
  onerror: (err, ctx) => {
    ctx.throw(422, 'Invalid request body — expected JSON');
  },
}));

// 7. Cache control
app.use(noCacheApi);

// ═══════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════
app.use(router.routes());
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => {
    const err: any = new Error('Method not implemented');
    err.status = 501;
    return err;
  },
  methodNotAllowed: () => {
    const err: any = new Error('Method not allowed');
    err.status = 405;
    return err;
  },
}));

// ═══════════════════════════════════════════════
//  404 CATCHALL
// ═══════════════════════════════════════════════
app.use(notFound);

// ═══════════════════════════════════════════════
//  APPLICATION-LEVEL ERROR LISTENER
// ═══════════════════════════════════════════════
app.on('error', (err, ctx) => {
  // Already logged by middleware — this is for external monitoring hooks
  if (config.isProd) {
    // Future: send to Sentry, Datadog, etc.
  }
});

export default app;

// ═══════════════════════════════════════════════
//  LOCAL DEV SERVER — with graceful shutdown
// ═══════════════════════════════════════════════
if (!config.isProd) {
  const PORT = config.port;

  const server = app.listen(PORT, () => {
    log.info(`═══════════════════════════════════════════════`);
    log.info(`  EPHEMERAL_OS  ▸  ACN_NETWORK ACTIVE`);
    log.info(`  PORT          ▸  ${PORT}`);
    log.info(`  ENV           ▸  ${config.env}`);
    log.info(`  RATE LIMIT    ▸  ${config.rateLimit.maxRequests} req/${config.rateLimit.windowMs / 1000}s`);
    log.info(`═══════════════════════════════════════════════`);
    log.info(`Waiting for signals...`);
  });

  // ── GRACEFUL SHUTDOWN ──
  const shutdown = (signal: string) => {
    log.warn(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      log.info('All connections drained. Process exiting.');
      process.exit(0);
    });

    // Force kill after timeout
    setTimeout(() => {
      log.error('Graceful shutdown timed out. Force exiting.');
      process.exit(1);
    }, config.shutdownTimeout);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ── UNHANDLED PROMISE REJECTIONS ──
  process.on('unhandledRejection', (reason) => {
    log.fatal('Unhandled promise rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  // ── UNCAUGHT EXCEPTIONS ──
  process.on('uncaughtException', (err) => {
    log.fatal('Uncaught exception — shutting down', {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
}
