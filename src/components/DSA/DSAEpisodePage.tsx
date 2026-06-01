import React, { useCallback } from 'react';
import type { Arc, Episode, Challenge, GctfState } from '../../types';
import { DSA_PROBLEMS, getDsaProblemsForEpisode } from '../../data/dsaContent';
import { DSAProblemList } from './DSAProblemList';
import { DSAProblemDetail } from './DSAProblemDetail';
import { playSound } from '../../lib/sound';

interface DSAEpisodePageProps {
  arc: Arc | null;
  episode: Episode | null;
  challenges: Challenge[];
  gctf: GctfState;
  submitFlag: (
    id: string,
    flag: string,
    chs: Challenge[],
    setXp: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<void>;
  setUserXp: React.Dispatch<React.SetStateAction<number>>;
  navigate: (path: string) => void;
  currentUserId: string;
  episodeBasePath: string;
  selectedProblemId?: string;
}

export const DSAEpisodePage: React.FC<DSAEpisodePageProps> = ({
  arc, episode, challenges, gctf, submitFlag, setUserXp,
  navigate, episodeBasePath, selectedProblemId,
}) => {
  const accColor = arc?.accColor ?? '#e8000d';
  const challengeIds = challenges.map(c => c.id);
  const problems = getDsaProblemsForEpisode(episode?.id ?? '', challengeIds);
  const selectedProblem = selectedProblemId ? DSA_PROBLEMS[selectedProblemId] : null;
  const selectedChallenge = selectedProblemId
    ? challenges.find(c => c.id === selectedProblemId) ?? null
    : null;

  const handleSelect = useCallback((problemId: string) => {
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(problemId)}`);
  }, [navigate, episodeBasePath]);

  const handleBack = useCallback(() => {
    navigate(`${episodeBasePath}/ctf`);
  }, [navigate, episodeBasePath]);

  const handleMarkSolved = useCallback(() => { playSound.success(); }, []);

  if (!episode || !arc) return (
    <div className="ds-page">
      <div className="ds-center-state"><div className="ds-welcome-title">LOADING…</div></div>
    </div>
  );

  if (problems.length === 0) return (
    <div className="ds-page">
      <div className="ds-center-state">
        <div className="ds-welcome-icon">◌</div>
        <div className="ds-welcome-title">CONTENT COMING SOON</div>
        <div className="ds-welcome-sub">DSA PROBLEMS FOR THIS EPISODE ARE BEING PREPARED</div>
      </div>
    </div>
  );

  return (
    <div className="ds-page">
      {selectedProblem && selectedChallenge ? (
        <DSAProblemDetail
          problem={selectedProblem}
          challenge={selectedChallenge}
          gctf={gctf}
          submitFlag={submitFlag}
          allChallenges={challenges}
          setUserXp={setUserXp}
          onMarkSolved={handleMarkSolved}
          accColor={accColor}
          episodeTitle={episode.title}
          onBack={handleBack}
        />
      ) : (
        <DSAProblemList
          problems={problems}
          challenges={challenges}
          gctf={gctf}
          selectedId={selectedProblemId ?? null}
          onSelect={handleSelect}
          episodeTitle={episode.title}
          episodeXp={episode.xp}
          accColor={accColor}
        />
      )}
    </div>
  );
};
