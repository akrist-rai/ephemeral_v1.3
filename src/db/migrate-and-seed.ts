import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('[MIGRATE] DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

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

async function main() {
  console.log('[MIGRATE] Starting database migration...');

  // Read SQL file
  const sqlPath = path.join(__dirname, '../../drizzle/0000_watery_hiroim.sql');
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL file not found at ${sqlPath}`);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
  // Split by statement-breakpoint
  const statements = sqlContent.split('--> statement-breakpoint');

  for (let statement of statements) {
    statement = statement.trim();
    if (!statement) continue;

    console.log(`[MIGRATE] Executing statement:\n${statement}\n`);
    await sql(statement);
  }

  console.log('[MIGRATE] Migration complete. Seeding database...');

  for (const challenge of initialChallenges) {
    console.log(`[SEED] Seeding challenge: ${challenge.id}`);
    await db.insert(schema.challenges)
      .values(challenge)
      .onConflictDoUpdate({
        target: schema.challenges.id,
        set: challenge
      });
  }

  console.log('[SEED] Architecture populated and ready.');
  process.exit(0);
}

main().catch(err => {
  console.error('[ERROR] Migration or Seed failed:', err);
  process.exit(1);
});
