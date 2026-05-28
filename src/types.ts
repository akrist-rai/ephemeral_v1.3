// ── SHARED FRONTEND TYPES ──

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

export interface Challenge {
  id: string;
  tier: number;
  category: string;
  points: number;
  difficulty: number;
  title: string;
  scenario: string;
  task: string;
  artifacts: Artifact[];
  hint: string | null;
  explanation: string | null;
  attemptsAllowed: number;
}

export interface Artifact {
  type: string;
  label: string;
  content: string;
}

export interface LeaderboardEntry {
  userId: string;
  xp: number;
  challengesSolved: number;
  rank: number;
}
