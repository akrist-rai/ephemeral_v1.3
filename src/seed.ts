import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
import { ARCS, EPISODES, CHALLENGES } from './data/content';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('[SEED] Purging content records from ACN_NETWORK (progress preserved)...');
  try {
    await db.delete(schema.challenges);
    await db.delete(schema.episodes);
    await db.delete(schema.arcs);
    console.log('[SEED] Content purge complete.');
  } catch (err) {
    console.warn('[SEED] Warning during purge (might be due to empty tables):', err);
  }

  console.log('[SEED] Injecting Architecture & Arcs into ACN_NETWORK...');
  
  // 1. Arcs
  for (const arc of ARCS) {
    await db.insert(schema.arcs).values(arc).onConflictDoUpdate({ target: schema.arcs.id, set: arc });
  }

  // 2. Episodes
  for (const ep of EPISODES) {
    await db.insert(schema.episodes).values(ep).onConflictDoUpdate({ target: schema.episodes.id, set: ep });
  }

  // 3. Challenges
  for (const ch of CHALLENGES) {
    await db.insert(schema.challenges).values(ch).onConflictDoUpdate({ target: schema.challenges.id, set: ch });
  }
  
  console.log('[SEED] Architecture populated. Ready for Subjects.');
  process.exit(0);
}

seed().catch(err => {
  console.error('[SEED] ERROR:', err);
  process.exit(1);
});
