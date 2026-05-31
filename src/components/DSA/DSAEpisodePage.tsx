import React, { useCallback } from 'react';
import type { Arc, Episode, Challenge, GctfState } from '../../types';
import { DSA_PROBLEMS, getDsaProblemsForEpisode } from '../../data/dsaContent';
import { DSAProblemList } from './DSAProblemList';
import { DSAProblemDetail } from './DSAProblemDetail';
import { playSound } from '../../lib/sound';

const DSA_DOMAINS = new Set(['ALGORITHMS', 'DATA STRUCTURES', 'COMP. PROG']);

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

  // Pull the DSA problem data for the challenges in this episode
  const challengeIds = challenges.map(c => c.id);
  const problems = getDsaProblemsForEpisode(episode?.id ?? '', challengeIds);

  const selectedProblem = selectedProblemId ? DSA_PROBLEMS[selectedProblemId] : null;
  const selectedChallenge = selectedProblemId
    ? challenges.find(c => c.id === selectedProblemId) ?? null
    : null;

  const handleSelect = useCallback((problemId: string) => {
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(problemId)}`);
  }, [navigate, episodeBasePath]);

  const handleMarkSolved = useCallback(() => {
    playSound.success();
  }, []);

  if (!episode || !arc) {
    return (
      <div className="ds-page">
        <div className="ds-welcome">
          <div className="ds-welcome-icon">⟳</div>
          <div className="ds-welcome-title">LOADING...</div>
        </div>
      </div>
    );
  }

  // Fallback for arcs without DSA content yet
  if (problems.length === 0) {
    return (
      <div className="ds-page">
        <div className="ds-header">
          <span className="ds-header-domain" style={{ borderColor: `${accColor}55`, color: accColor }}>
            {arc.domain}
          </span>
          <h1 className="ds-header-title">{episode.title}</h1>
        </div>
        <div className="ds-welcome">
          <div className="ds-welcome-icon">◌</div>
          <div className="ds-welcome-title">CONTENT COMING SOON</div>
          <div className="ds-welcome-sub">DSA PROBLEMS FOR THIS EPISODE ARE BEING PREPARED</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-page">
      {/* Header */}
      <div className="ds-header">
        <span
          className="ds-header-domain"
          style={{ borderColor: `${accColor}55`, color: accColor }}
        >
          {arc.domain}
        </span>
        <h1 className="ds-header-title">{episode.title}</h1>
        <div className="ds-header-badges">
          <span className="ds-header-badge">⚡ {episode.xp} XP</span>
          <span className="ds-header-badge">~{episode.min} MIN</span>
          <span className="ds-header-badge">{problems.length} PROBLEMS</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="ds-layout">
        <DSAProblemList
          problems={problems}
          challenges={challenges}
          gctf={gctf}
          selectedId={selectedProblemId ?? null}
          onSelect={handleSelect}
          episodeDesc={episode.description}
          accColor={accColor}
        />

        {selectedProblem && selectedChallenge ? (
          <DSAProblemDetail
            problem={selectedProblem}
            challenge={selectedChallenge}
            gctf={gctf}
            submitFlag={submitFlag}
            allChallenges={challenges}
            setUserXp={setUserXp}
            onMarkSolved={handleMarkSolved}
          />
        ) : (
          <div className="ds-main">
            <div className="ds-welcome">
              <div className="ds-welcome-icon">◈</div>
              <div className="ds-welcome-title">SELECT A PROBLEM</div>
              <div className="ds-welcome-sub">
                {problems.length} PROBLEM{problems.length !== 1 ? 'S' : ''} · READ THE STUDY GUIDE · CODE THE SOLUTION · MARK AS SOLVED
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
