import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import json from 'koa-json';
import { db } from './db';
import { users, challenges, progress } from './db/schema';
import { eq, and } from 'drizzle-orm';

const app = new Koa();
const router = new Router({ prefix: '/api' });

// ── ERROR HANDLING MIDDLEWARE ──
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
    ctx.app.emit('error', err, ctx);
  }
});

// ── RESPONSE TIMER MIDDLEWARE ──
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// ── STANDARD MIDDLEWARE ──
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(logger()); // Request logging
app.use(json()); // Pretty JSON responses
app.use(compress()); // Gzip compression
app.use(bodyParser()); // Body parsing

// ── 1. GET USER PROGRESS ──
// Fetch all solved challenges and attempts for a user on mount
router.get('/progress/:userId', async (ctx) => {
  const { userId } = ctx.params;
  
  try {
    const userProgress = await db.query.progress.findMany({
      where: eq(progress.userId, userId),
    });
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    ctx.body = { 
      success: true, 
      xp: user?.xp || 0,
      progress: userProgress 
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to fetch progress' };
  }
});

// ── 2. SUBMIT FLAG ──
// Evaluates the flag, deducts attempts, and calculates degrading points
router.post('/submit', async (ctx) => {
  const { userId, challengeId, flagInput } = ctx.request.body as any;

  if (!userId || !challengeId || !flagInput) {
    ctx.status = 400;
    ctx.body = { success: false, error: 'Missing required fields' };
    return;
  }

  try {
    // Ensure user exists (Auto-create for this prototype)
    const existingUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!existingUser) {
      await db.insert(users).values({ id: userId });
    }

    // Fetch the challenge from DB to get the correct flag
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
      ctx.status = 404;
      ctx.body = { success: false, error: 'Challenge not found' };
      return;
    }

    // Get current progress
    let userProg = await db.query.progress.findFirst({
      where: and(eq(progress.userId, userId), eq(progress.challengeId, challengeId)),
    });

    if (!userProg) {
      const [newProg] = await db.insert(progress).values({
        userId, challengeId, attemptsUsed: 0, solved: false, pointsEarned: 0
      }).returning();
      userProg = newProg;
    }

    if (userProg.solved) {
      ctx.body = { success: false, status: 'ALREADY_SOLVED' };
      return;
    }

    if (userProg.attemptsUsed >= challenge.attemptsAllowed) {
      ctx.body = { success: false, status: 'NO_ATTEMPTS_LEFT', actualFlag: challenge.flag };
      return;
    }

    // Sanitize and compare flags
    const sanitizedInput = flagInput.trim().toUpperCase().replace(/\s+/g, '_');
    const sanitizedCorrect = challenge.flag.toUpperCase().replace(/\s+/g, '_');
    const isCorrect = sanitizedInput === sanitizedCorrect;

    const newAttemptsUsed = userProg.attemptsUsed + 1;

    if (isCorrect) {
      // Calculate points based on attempts used (1st try: 100%, 2nd: 70%, 3rd: 40%)
      const attemptNumber = newAttemptsUsed;
      let pointsEarned = challenge.points;
      if (attemptNumber === 2) pointsEarned = Math.round(challenge.points * 0.7);
      if (attemptNumber === 3) pointsEarned = Math.round(challenge.points * 0.4);

      // Update progress
      await db.update(progress)
        .set({ solved: true, attemptsUsed: newAttemptsUsed, pointsEarned, updatedAt: new Date() })
        .where(and(eq(progress.userId, userId), eq(progress.challengeId, challengeId)));

      // Add XP to user
      const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
      await db.update(users)
        .set({ xp: (currentUser?.xp || 0) + pointsEarned })
        .where(eq(users.id, userId));

      ctx.body = { success: true, status: 'CORRECT', pointsEarned, attemptsUsed: newAttemptsUsed };
    } else {
      // Wrong flag submitted
      await db.update(progress)
        .set({ attemptsUsed: newAttemptsUsed, updatedAt: new Date() })
        .where(and(eq(progress.userId, userId), eq(progress.challengeId, challengeId)));

      const attemptsRemaining = challenge.attemptsAllowed - newAttemptsUsed;

      ctx.body = { 
        success: true, 
        status: 'WRONG', 
        attemptsRemaining,
        failed: attemptsRemaining === 0,
        actualFlag: attemptsRemaining === 0 ? challenge.flag : undefined
      };
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { success: false, error: 'Internal server error' };
  }
});

app.use(router.routes()).use(router.allowedMethods());

// ── ERROR LISTENER ──
app.on('error', (err, ctx) => {
  console.error('[SERVER_ERROR]', err);
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[EPHEMERAL_OS] ACN_NETWORK ACTIVE ON PORT ${PORT}`);
    console.log(`[EPHEMERAL_OS] WAITING FOR SIGNALS...`);
  });
}