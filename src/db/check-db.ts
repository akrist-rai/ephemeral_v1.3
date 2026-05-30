import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { config } from '../config';

async function main() {
  const sql = neon(config.databaseUrl);
  const db = drizzle(sql, { schema });

  try {
    console.log('--- EPISODES ---');
    const eps = await db.select().from(schema.episodes);
    for (const ep of eps) {
      console.log(`ID: ${ep.id} | Arc: ${ep.arcId} | n: ${ep.n} | Title: ${ep.title}`);
    }

    console.log('\n--- CHALLENGES ---');
    const chs = await db.select().from(schema.challenges);
    for (const ch of chs) {
      console.log(`ID: ${ch.id} | Episode: ${ch.episodeId} | Title: ${ch.title}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
