import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Exact flags and points from your frontend design
const initialChallenges = [
  { id: 'GRAD_001', flag: '4', points: 100, attemptsAllowed: 3 },
  { id: 'VIT_001', flag: '10', points: 100, attemptsAllowed: 3 },
  { id: 'DEPLOY_001', flag: 'train', points: 100, attemptsAllowed: 3 },
  { id: 'ATTN_001', flag: '38809', points: 200, attemptsAllowed: 3 },
  { id: 'CONV_001', flag: '61', points: 200, attemptsAllowed: 3 },
  { id: 'LEAK_001', flag: 'normalize', points: 200, attemptsAllowed: 3 },
  { id: 'SILENT_001', flag: '0', points: 400, attemptsAllowed: 3 },
  { id: 'FLASH_001', flag: 'YES_0.000000', points: 400, attemptsAllowed: 3 },
  { id: 'RESNET_001', flag: 'RESNET-50', points: 400, attemptsAllowed: 3 },
];

async function seed() {
  console.log('[SEED] Injecting base challenges into ACN_NETWORK...');
  
  for (const challenge of initialChallenges) {
    await db.insert(schema.challenges)
      .values(challenge)
      .onConflictDoUpdate({
        target: schema.challenges.id,
        set: challenge
      });
  }
  
  console.log('[SEED] Architecture populated. Ready for Subjects.');
  process.exit(0);
}

seed().catch(err => {
  console.error('[SEED] ERROR:', err);
  process.exit(1);
});