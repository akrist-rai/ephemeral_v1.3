import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { config } from '../config';
import { createLogger } from '../lib/logger';

const log = createLogger('DATABASE');

if (!config.databaseUrl) {
  log.fatal('DATABASE_URL is not set. Cannot connect to database.');
  process.exit(1);
}

let sql: NeonQueryFunction<false, false>;
let db: NeonHttpDatabase<typeof schema>;

try {
  sql = neon(config.databaseUrl);
  db = drizzle(sql, { schema });
  log.info('Database connection initialized');
} catch (err) {
  log.fatal('Failed to initialize database connection', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
}

/**
 * Lightweight health check — runs a simple SELECT 1 to verify connectivity.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (err) {
    log.error('Database health check failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

export { db, schema };