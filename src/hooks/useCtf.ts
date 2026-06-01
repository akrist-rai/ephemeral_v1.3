import { useState, useCallback, useRef } from 'react';
import type React from 'react';
import { apiRequest } from './useApi';
import { playSound } from '../lib/sound';
import type { Challenge, GctfState } from '../types';

export function useCtf(
  userId: string,
  showToast: (msg: string) => void,
  onSolve?: () => void,
) {
  const [gctf, setGctf] = useState<GctfState>({
    solved: {},
    active: null,
    chalAttempts: {},
    hintOn: {},
    phase: 'board',
  });
  const [shake, setShake] = useState(false);
  const flagInputRef = useRef<HTMLInputElement>(null);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 380);
  }, []);

  const submitFlag = useCallback(
    async (
      challengeId: string,
      flagInput: string,
      challenges: Challenge[],
      setUserXp: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      if (!challengeId) return;
      const ch = challenges.find(c => c.id === challengeId);
      if (!ch) return;
      if (gctf.solved[challengeId]?.solved) return;

      try {
        playSound.click();
        const data = await apiRequest('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, challengeId, flagInput }),
        });

        if (!data.success && !data.status) {
          playSound.error();
          showToast('ERROR: ' + data.error);
          return;
        }

        if (data.status === 'CORRECT') {
          playSound.success();
          setGctf(prev => ({
            ...prev,
            solved: {
              ...prev.solved,
              [challengeId]: {
                solved: true,
                attempts_used: data.attemptsUsed,
                pts_earned: data.pointsEarned,
              },
            },
          }));
          setUserXp(prev => prev + data.pointsEarned);
          onSolve?.();
          showToast(`✓ FLAG ACCEPTED — +${data.pointsEarned} pts`);

        } else if (data.status === 'WRONG') {
          playSound.error();
          triggerShake();

          if (data.failed) {
            showToast(`OUT OF ATTEMPTS — FLAG: EPHEMERAL{${data.actualFlag}}`);
            setGctf(prev => ({
              ...prev,
              chalAttempts: { ...prev.chalAttempts, [challengeId]: 0 },
              solved: {
                ...prev.solved,
                [challengeId]: {
                  attempts_used: ch.attemptsAllowed,
                  pts_earned: 0,
                  solved: false,
                  failed: true,
                },
              },
            }));
          } else {
            setGctf(prev => ({
              ...prev,
              chalAttempts: { ...prev.chalAttempts, [challengeId]: data.attemptsRemaining },
            }));
            const s = data.attemptsRemaining !== 1 ? 'S' : '';
            showToast(`WRONG — ${data.attemptsRemaining} ATTEMPT${s} REMAINING`);
          }

        } else if (data.status === 'ALREADY_SOLVED') {
          showToast('CHALLENGE ALREADY SOLVED');

        } else if (data.status === 'NO_ATTEMPTS_LEFT') {
          playSound.error();
          showToast(`NO ATTEMPTS LEFT — FLAG: EPHEMERAL{${data.actualFlag}}`);
        }

        if (flagInputRef.current) {
          flagInputRef.current.focus();
          if (data.status === 'WRONG') flagInputRef.current.select();
        }

      } catch (err) {
        playSound.error();
        console.error('Flag submission failed:', err);
        showToast('CONNECTION ERROR');
      }
    },
    [userId, gctf.solved, showToast, onSolve],
  );

  const toggleCTFHint = useCallback((id: string) => {
    playSound.click();
    setGctf(prev => ({ ...prev, hintOn: { ...prev.hintOn, [id]: !prev.hintOn[id] } }));
  }, []);

  return { gctf, setGctf, submitFlag, toggleCTFHint, shake, flagInputRef };
}
