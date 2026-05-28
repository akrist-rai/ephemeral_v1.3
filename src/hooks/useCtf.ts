import { useState, useCallback, useRef } from 'react';
import { apiRequest } from './useApi';

export function useCtf(USER_ID: string, showToast: (msg: string) => void, onCorrect?: (pointsEarned: number) => void) {
  const [gctf, setGctf] = useState<any>({ solved: {}, active: null, chalAttempts: {}, hintOn: {}, phase: 'board' });
  const [shake, setShake] = useState(false);
  const flagInputRef = useRef<HTMLInputElement>(null);

  const submitFlag = useCallback(async (challengeId: string, flagInput: string, challenges: any[], setUserXp: any) => {
    if (!challengeId) return;
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return;
    if (gctf.solved[challengeId]?.solved) return;

    try {
      const data = await apiRequest('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, challengeId, flagInput })
      });

      if (data.success || data.status) {
        if (data.status === 'CORRECT') {
          setGctf((prev: any) => ({
            ...prev,
            solved: { ...prev.solved, [challengeId]: { solved: true, attempts_used: data.attemptsUsed, pts_earned: data.pointsEarned } }
          }));
          setUserXp((prev: number) => prev + data.pointsEarned);
          if (onCorrect) onCorrect(data.pointsEarned);
          showToast(`✓ FLAG ACCEPTED — +${data.pointsEarned} pts`);
        } else if (data.status === 'WRONG') {
          setShake(true);
          setTimeout(() => setShake(false), 380);

          if (data.failed) {
            showToast(`OUT OF ATTEMPTS — FLAG: EPHEMERAL{${data.actualFlag}}`);
            setGctf((prev: any) => ({
              ...prev,
              chalAttempts: { ...prev.chalAttempts, [challengeId]: 0 },
              solved: { ...prev.solved, [challengeId]: { attempts_used: ch.attemptsAllowed, pts_earned: 0, failed: true } }
            }));
          } else {
            setGctf((prev: any) => ({ ...prev, chalAttempts: { ...prev.chalAttempts, [challengeId]: data.attemptsRemaining } }));
            showToast(`WRONG — ${data.attemptsRemaining} ATTEMPT${data.attemptsRemaining !== 1 ? 'S' : ''} REMAINING`);
          }
        } else if (data.status === 'ALREADY_SOLVED') {
          showToast('CHALLENGE ALREADY SOLVED');
        } else if (data.status === 'NO_ATTEMPTS_LEFT') {
          showToast(`NO ATTEMPTS LEFT — FLAG: EPHEMERAL{${data.actualFlag}}`);
        }

        if (flagInputRef.current) {
          flagInputRef.current.focus();
          if (data.status === 'WRONG') flagInputRef.current.select();
        }
      } else {
        showToast('ERROR: ' + data.error);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      showToast('CONNECTION ERROR');
    }
  }, [USER_ID, gctf.solved, showToast]);

  const toggleCTFHint = (id: string) => {
    setGctf((prev: any) => ({ ...prev, hintOn: { ...prev.hintOn, [id]: !prev.hintOn[id] } }));
  };

  return { gctf, setGctf, submitFlag, toggleCTFHint, shake, flagInputRef };
}
