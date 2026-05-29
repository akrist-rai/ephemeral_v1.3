// ── BADGE DEFINITIONS ──────────────────────────────────────────────────────
// All badges are computed client-side from profile data — no backend changes needed.

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number; // 0–100 if trackable
}

export interface ProfileData {
  xp: number;
  totalSolved: number;
  totalChallenges: number;
  totalAttempts: number;
  accuracy: number;
  firstAttemptSolves: number;
  catStats: Record<string, { solved: number; total: number; xp: number }>;
  tierStats: Record<number, { solved: number; total: number }>;
  joinedAt: string | null;
  firstSolveAt: string | null;
  lastSolveAt: string | null;
}

const RARITY_COLOR: Record<string, string> = {
  common:    '#66bb6a',
  rare:      '#4fc3f7',
  epic:      '#ab47bc',
  legendary: '#ffd700',
};

export function computeBadges(profile: ProfileData): Badge[] {
  const s = profile.totalSolved;
  const xp = profile.xp;
  const acc = profile.accuracy;
  const tier1 = profile.tierStats?.[1] || { solved: 0, total: 0 };
  const tier2 = profile.tierStats?.[2] || { solved: 0, total: 0 };
  const tier3 = profile.tierStats?.[3] || { solved: 0, total: 0 };
  const cats = profile.catStats || {};

  const definitions: Array<Omit<Badge, 'unlocked' | 'progress'> & { check: () => boolean; getProgress?: () => number }> = [
    // ── MILESTONE BADGES ──
    {
      id: 'first_blood',
      name: 'First Blood',
      description: 'Solve your first challenge',
      icon: '🩸',
      color: '#e8000d',
      rarity: 'common',
      check: () => s >= 1,
      getProgress: () => Math.min(100, s * 100),
    },
    {
      id: 'flag_hunter',
      name: 'Flag Hunter',
      description: 'Solve 5 challenges',
      icon: '🚩',
      color: '#66bb6a',
      rarity: 'common',
      check: () => s >= 5,
      getProgress: () => Math.min(100, (s / 5) * 100),
    },
    {
      id: 'double_digits',
      name: 'Double Digits',
      description: 'Solve 10 challenges',
      icon: '🔟',
      color: '#4fc3f7',
      rarity: 'rare',
      check: () => s >= 10,
      getProgress: () => Math.min(100, (s / 10) * 100),
    },
    {
      id: 'elite_operator',
      name: 'Elite Operator',
      description: 'Solve 25 challenges',
      icon: '⚔️',
      color: '#ab47bc',
      rarity: 'epic',
      check: () => s >= 25,
      getProgress: () => Math.min(100, (s / 25) * 100),
    },
    {
      id: 'ghost_protocol',
      name: 'Ghost Protocol',
      description: 'Solve every challenge (100%)',
      icon: '👻',
      color: '#ffd700',
      rarity: 'legendary',
      check: () => profile.totalChallenges > 0 && s >= profile.totalChallenges,
      getProgress: () => profile.totalChallenges > 0 ? Math.round((s / profile.totalChallenges) * 100) : 0,
    },

    // ── XP BADGES ──
    {
      id: 'xp_500',
      name: 'Voltage',
      description: 'Earn 500 XP',
      icon: '⚡',
      color: '#ffd54f',
      rarity: 'common',
      check: () => xp >= 500,
      getProgress: () => Math.min(100, (xp / 500) * 100),
    },
    {
      id: 'xp_2000',
      name: 'Overclock',
      description: 'Earn 2000 XP',
      icon: '🔋',
      color: '#f9a825',
      rarity: 'rare',
      check: () => xp >= 2000,
      getProgress: () => Math.min(100, (xp / 2000) * 100),
    },
    {
      id: 'xp_5000',
      name: 'Neural Storm',
      description: 'Earn 5000 XP',
      icon: '🧠',
      color: '#ab47bc',
      rarity: 'epic',
      check: () => xp >= 5000,
      getProgress: () => Math.min(100, (xp / 5000) * 100),
    },

    // ── ACCURACY / SKILL BADGES ──
    {
      id: 'sharpshooter',
      name: 'Sharpshooter',
      description: 'Achieve 80%+ first-attempt accuracy (min 5 solves)',
      icon: '🎯',
      color: '#00ff41',
      rarity: 'rare',
      check: () => s >= 5 && acc >= 80,
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 100% first-attempt accuracy (min 5 solves)',
      icon: '💎',
      color: '#ffd700',
      rarity: 'legendary',
      check: () => s >= 5 && acc === 100,
    },

    // ── TIER MASTERY BADGES ──
    {
      id: 'tier1_cleared',
      name: 'Entry Cleared',
      description: 'Complete all Tier 1 challenges',
      icon: '🟢',
      color: '#66bb6a',
      rarity: 'common',
      check: () => tier1.total > 0 && tier1.solved >= tier1.total,
      getProgress: () => tier1.total > 0 ? Math.round((tier1.solved / tier1.total) * 100) : 0,
    },
    {
      id: 'tier2_cleared',
      name: 'Core Module Cleared',
      description: 'Complete all Tier 2 challenges',
      icon: '🔶',
      color: '#f9a825',
      rarity: 'rare',
      check: () => tier2.total > 0 && tier2.solved >= tier2.total,
      getProgress: () => tier2.total > 0 ? Math.round((tier2.solved / tier2.total) * 100) : 0,
    },
    {
      id: 'tier3_cleared',
      name: 'Ruhenheim Conqueror',
      description: 'Complete all Tier 3 challenges',
      icon: '🔴',
      color: '#ef5350',
      rarity: 'epic',
      check: () => tier3.total > 0 && tier3.solved >= tier3.total,
      getProgress: () => tier3.total > 0 ? Math.round((tier3.solved / tier3.total) * 100) : 0,
    },

    // ── CATEGORY SPECIALIST BADGES ──
    {
      id: 'crypto_specialist',
      name: 'Crypto Specialist',
      description: 'Solve all Cryptography challenges',
      icon: '🔐',
      color: '#ffd54f',
      rarity: 'rare',
      check: () => cats['CRYPTO'] ? cats['CRYPTO'].solved >= cats['CRYPTO'].total && cats['CRYPTO'].total > 0 : false,
      getProgress: () => cats['CRYPTO'] && cats['CRYPTO'].total > 0 ? Math.round((cats['CRYPTO'].solved / cats['CRYPTO'].total) * 100) : 0,
    },
    {
      id: 'ml_architect',
      name: 'ML Architect',
      description: 'Solve all Architecture challenges',
      icon: '⬡',
      color: '#f9a825',
      rarity: 'rare',
      check: () => cats['ARCHITECTURE'] ? cats['ARCHITECTURE'].solved >= cats['ARCHITECTURE'].total && cats['ARCHITECTURE'].total > 0 : false,
    },
    {
      id: 'systems_expert',
      name: 'Systems Expert',
      description: 'Solve all Systems challenges',
      icon: '⚙️',
      color: '#80cbc4',
      rarity: 'rare',
      check: () => cats['SYSTEMS'] ? cats['SYSTEMS'].solved >= cats['SYSTEMS'].total && cats['SYSTEMS'].total > 0 : false,
    },

    // ── SPECIAL BEHAVIOR BADGES ──
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Solve 3 challenges in a single session',
      icon: '💨',
      color: '#4fc3f7',
      rarity: 'rare',
      check: () => {
        // Approximate: if solved >= 3 and recent sessions are dense
        return s >= 3;
      },
    },
  ];

  return definitions.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    color: def.rarity === 'legendary' ? RARITY_COLOR.legendary : def.color,
    rarity: def.rarity,
    unlocked: def.check(),
    progress: def.getProgress ? Math.round(def.getProgress()) : undefined,
  }));
}

export function getXpLevel(xp: number): { level: number; title: string; nextXp: number; progress: number } {
  const thresholds = [
    { level: 1,  title: 'RECRUIT',     xp: 0    },
    { level: 2,  title: 'OPERATIVE',   xp: 200  },
    { level: 3,  title: 'AGENT',       xp: 500  },
    { level: 4,  title: 'SPECIALIST',  xp: 1000 },
    { level: 5,  title: 'COMMANDER',   xp: 2000 },
    { level: 6,  title: 'PHANTOM',     xp: 3500 },
    { level: 7,  title: 'VOID WALKER', xp: 5500 },
    { level: 8,  title: 'WRAITH',      xp: 8000 },
    { level: 9,  title: 'GHOST',       xp: 12000 },
    { level: 10, title: 'EPHEMERAL',   xp: 20000 },
  ];

  let cur = thresholds[0];
  let next = thresholds[1];
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (xp >= thresholds[i].xp) {
      cur = thresholds[i];
      next = thresholds[i + 1] || thresholds[i];
    }
  }

  const progress = next.xp > cur.xp
    ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100))
    : 100;

  return { level: cur.level, title: cur.title, nextXp: next.xp, progress };
}
