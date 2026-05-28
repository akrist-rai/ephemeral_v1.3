import type { Context, Next } from 'koa';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Koa middleware that validates request data against a Zod schema.
 *
 * On success: validated (coerced/defaulted) data replaces the original.
 * On failure: throws a ValidationError with structured field-level details.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return async (ctx: Context, next: Next) => {
    const source = target === 'body'
      ? ctx.request.body
      : target === 'params'
        ? ctx.params
        : ctx.query;

    const result = schema.safeParse(source);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));
      throw new ValidationError('Validation failed', details);
    }

    // Replace with validated & coerced data
    if (target === 'body') {
      ctx.request.body = result.data;
    } else if (target === 'params') {
      ctx.params = result.data;
    } else {
      // Query is read-only on most setups, stash on state
      ctx.state.validatedQuery = result.data;
    }

    await next();
  };
}

/**
 * Validate multiple targets at once.
 */
export function validateAll(
  schemas: Partial<Record<ValidationTarget, ZodSchema>>
) {
  return async (ctx: Context, next: Next) => {
    const errors: Array<{ target: string; path: string; message: string; code: string }> = [];

    for (const [target, schema] of Object.entries(schemas) as [ValidationTarget, ZodSchema][]) {
      const source = target === 'body'
        ? ctx.request.body
        : target === 'params'
          ? ctx.params
          : ctx.query;

      const result = schema.safeParse(source);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errors.push({
            target,
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          });
        });
      } else {
        if (target === 'body') ctx.request.body = result.data;
        else if (target === 'params') ctx.params = result.data;
        else ctx.state.validatedQuery = result.data;
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    await next();
  };
}
