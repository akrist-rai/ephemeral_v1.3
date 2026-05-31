import type React from 'react';
import type { Arc, Episode, Challenge, GctfState } from '../../types';

export interface DomainPageProps {
  // ── Core data (every domain receives these) ──────────────────────
  arc: Arc | null;
  episode: Episode | null;
  challenges: Challenge[];
  gctf: GctfState;
  navigate: (path: string) => void;
  currentUserId: string;
  episodeBasePath: string;
  setUserXp: React.Dispatch<React.SetStateAction<number>>;
  submitFlag: (
    id: string,
    flag: string,
    chs: Challenge[],
    setXp: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<void>;

  // ── DSA/problem-based pages ───────────────────────────────────────
  selectedProblemId?: string;

  // ── CTF tab-based pages ───────────────────────────────────────────
  tab: string;
  showToast: (msg: string) => void;
  dataStatus: 'loading' | 'ready' | 'error';
  apiError: string;
  toggleCTFHint: (id: string) => void;
  shake: boolean;
  flagInputRef: React.RefObject<HTMLInputElement>;
  chalStats: Record<string, { solveCount: number; firstBlood: string | null }>;
}
