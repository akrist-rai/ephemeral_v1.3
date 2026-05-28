import type { Context } from 'koa';
import { checkDatabaseHealth } from '../db';
import { ok } from '../lib/response';
import type { HealthCheckResult } from '../types';

const startTime = Date.now();

export class SystemController {
  /**
   * GET /api/health — Application health check
   */
  static async healthCheck(ctx: Context) {
    const dbOk = await checkDatabaseHealth();
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    const result: HealthCheckResult = {
      status: dbOk ? 'healthy' : 'degraded',
      uptime,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbOk ? 'ok' : 'error',
      },
    };

    ctx.status = dbOk ? 200 : 503;
    ctx.body = {
      success: dbOk,
      data: result,
      meta: {
        requestId: ctx.state.requestId,
        timestamp: result.timestamp,
      },
    };
  }

  /**
   * GET /api/ping — Lightweight liveness probe
   */
  static async ping(ctx: Context) {
    ok(ctx, { pong: true, timestamp: Date.now() });
  }
}
