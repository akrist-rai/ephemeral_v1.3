// ── SHARED FRONTEND TYPES ──────────────────────────────────────────────────

export interface Arc {
  id: number;
  title: string;
  description: string | null;
  accColor: string | null;
  bgColor: string | null;
  asciiArt: string | null;
  domain: string | null;
  arcName: string | null;
  progressWidth: string | null;
}

export interface Episode {
  id: string;
  arcId: number;
  n: number;
  title: string;
  description: string;
  type: 'quiz' | 'ctf' | 'research';
  min: number;
  xp: number;
  art: string | null;
  bg: string | null;
  active: boolean;
  locked: boolean;
  done: boolean;
}

export interface Artifact {
  type: 'table' | 'config' | 'log' | 'code' | 'output';
  label: string;
  content: string;
}

export interface Challenge {
  id: string;
  tier: number;
  category: string;
  points: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  title: string;
  scenario: string;
  task: string;
  artifacts: Artifact[];
  flag: string;
  hint: string | null;
  explanation: string | null;
  attemptsAllowed: number;
}

export interface SolveRecord {
  solved: boolean;
  attempts_used: number;
  pts_earned: number;
  failed?: boolean;
}

export interface GctfState {
  solved: Record<string, SolveRecord>;
  active: string | null;
  chalAttempts: Record<string, number>;
  hintOn: Record<string, boolean>;
  phase: 'board' | 'challenge';
}

export interface ChallengeStats {
  solveCount: number;
  firstBlood: string | null;
}

export interface LeaderboardEntry {
  userId: string;
  xp: number;
  challengesSolved: number;
  rank: number;
}
