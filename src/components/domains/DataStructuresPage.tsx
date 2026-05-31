import React, { useCallback } from 'react';
import { DSA_PROBLEMS, getDsaProblemsForEpisode } from '../../data/dsaContent';
import { DSAProblemList } from '../DSA/DSAProblemList';
import { DSAProblemDetail } from '../DSA/DSAProblemDetail';
import { playSound } from '../../lib/sound';
import type { DomainPageProps } from './types';

export const DataStructuresPage: React.FC<DomainPageProps> = ({
  arc, episode, challenges, gctf, submitFlag, setUserXp,
  navigate, episodeBasePath, selectedProblemId,
}) => {
  const accColor = arc?.accColor ?? '#9b5fff';

  const challengeIds = challenges.map(c => c.id);
  const problems = getDsaProblemsForEpisode(episode?.id ?? '', challengeIds);

  const selectedProblem = selectedProblemId ? DSA_PROBLEMS[selectedProblemId] : null;
  const selectedChallenge = selectedProblemId
    ? challenges.find(c => c.id === selectedProblemId) ?? null
    : null;

  const handleSelect = useCallback((problemId: string) => {
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(problemId)}`);
  }, [navigate, episodeBasePath]);

  const handleMarkSolved = useCallback(() => { playSound.success(); }, []);

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
          <div className="ds-welcome-sub">PROBLEMS FOR THIS EPISODE ARE BEING PREPARED</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-page">
      <div className="ds-header">
        <span className="ds-header-domain" style={{ borderColor: `${accColor}55`, color: accColor }}>
          {arc.domain}
        </span>
        <h1 className="ds-header-title">{episode.title}</h1>
        <div className="ds-header-badges">
          <span className="ds-header-badge">⚡ {episode.xp} XP</span>
          <span className="ds-header-badge">~{episode.min} MIN</span>
          <span className="ds-header-badge">{problems.length} PROBLEMS</span>
        </div>
      </div>

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
            accColor={accColor}
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
