import React from 'react';
import { ChallengeHeader } from '../Challenge/ChallengeHeader';
import { Brief } from '../Challenge/Brief';
import { Resources } from '../Challenge/Resources';
import { CTFComponent } from '../Challenge/CTFComponent';
import type { DomainPageProps } from './types';

export const CybersecurityPage: React.FC<DomainPageProps> = ({
  arc, episode, challenges, tab, episodeBasePath, navigate,
  gctf, setUserXp, showToast, dataStatus, apiError,
  submitFlag, toggleCTFHint, shake, flagInputRef, chalStats, currentUserId,
}) => (
  <div className="ch-wrap">
    <ChallengeHeader
      episode={episode}
      arc={arc}
      challenges={challenges}
      onBack={() => navigate('/series')}
    />
    <div className="tabs-l">
      <button type="button" className={`tl ${tab === 'brief' ? 'on' : ''}`} onClick={() => navigate(episodeBasePath)}>BRIEF</button>
      <button type="button" className={`tl ${tab === 'res'   ? 'on' : ''}`} onClick={() => navigate(`${episodeBasePath}/resources`)}>RESOURCES</button>
      <button type="button" className={`tl ${tab === 'ctf'   ? 'on' : ''}`} onClick={() => navigate(`${episodeBasePath}/ctf`)}>CTF ARENA</button>
    </div>
    {tab === 'brief' && <Brief episode={episode} arc={arc} onStartResources={() => navigate(`${episodeBasePath}/resources`)} />}
    {tab === 'res'   && <Resources episode={episode} onEnterArena={() => navigate(`${episodeBasePath}/ctf`)} />}
    {tab === 'ctf'   && (
      <CTFComponent
        gctf={gctf}
        setUserXp={setUserXp}
        showToast={showToast}
        challenges={challenges}
        navigate={navigate}
        dataStatus={dataStatus}
        apiError={apiError}
        submitFlag={submitFlag}
        toggleCTFHint={toggleCTFHint}
        shake={shake}
        flagInputRef={flagInputRef}
        episodeBasePath={episodeBasePath}
        chalStats={chalStats}
        currentUserId={currentUserId}
      />
    )}
  </div>
);
