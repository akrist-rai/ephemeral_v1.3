import type { Context } from 'koa';
import type { ApiResponse, PaginationMeta } from '../types';

/**
 * Send a success response with consistent envelope.
 */
export function ok<T>(ctx: Context, data: T, statusCode: number = 200): void {
  ctx.status = statusCode;
  ctx.body = {
    success: true,
    data,
    meta: {
      requestId: ctx.state.requestId,
      timestamp: new Date().toISOString(),
    },
  } satisfies ApiResponse<T>;
}

/**
 * Send a created response (201).
 */
export function created<T>(ctx: Context, data: T): void {
  ok(ctx, data, 201);
}

/**
 * Send a paginated response.
 */
export function paginated<T>(ctx: Context, data: T[], pagination: PaginationMeta): void {
  ctx.status = 200;
  ctx.body = {
    success: true,
    data,
    meta: {
      requestId: ctx.state.requestId,
      timestamp: new Date().toISOString(),
      pagination,
    },
  } satisfies ApiResponse<T[]>;
}

/**
 * Send a 204 No Content response.
 */
export function noContent(ctx: Context): void {
  ctx.status = 204;
  ctx.body = null;
}

/**
 * Send an error response.
 */
export function error(ctx: Context, statusCode: number, message: string, code?: string, details?: unknown): void {
  ctx.status = statusCode;
  ctx.body = {
    success: false,
    error: message,
    ...(code ? { code } : {}),
    ...(details ? { details } : {}),
    meta: {
      requestId: ctx.state.requestId,
      timestamp: new Date().toISOString(),
    },
  };
}
