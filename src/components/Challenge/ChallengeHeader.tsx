import React from 'react';
import type { Arc, Episode, Challenge } from '../../types';
import { playSound } from '../../lib/sound';
import { TextScramble } from '../Effects/TextScramble';

interface ChallengeHeaderProps {
  episode: Episode | null;
  arc: Arc | null;
  challenges: Challenge[];
  onBack: () => void;
}

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({ episode, arc, challenges, onBack }) => {
  if (!episode || !arc) return null;

  const acc = arc.accColor || '#00c85a';
  const domain = arc.domain || '';
  const totalXp = episode.xp;
  const challengeCount = challenges.length;

  return (
    <>
      <button 
        className="ch-back" 
        onClick={() => {
          playSound.click();
          onBack();
        }}
        onMouseEnter={() => playSound.hover()}
      >
        ← BACK TO SERIES
      </button>
      <div>
        <span className="ch-domain-tag" style={{ background: `${acc}20`, color: acc }}>{domain}</span>
        <span className="ch-ep-ref">// EPISODE {episode.n} · {episode.type.toUpperCase()}</span>
      </div>
      <div className="ch-title" style={{ marginTop: '.5rem' }}>
        <TextScramble text={episode.title.split(' ').slice(0, -1).join(' ')} speed={25} /><br/>
        <em style={{ color: acc }}>
          <TextScramble text={episode.title.split(' ').slice(-1)[0]} speed={35} />
        </em>
      </div>
      <div className="ch-sub">{episode.description}</div>
      <div className="ch-pills">
        <span className="ch-pill hl" style={{ borderColor: `${acc}66`, color: acc }}>⚡ {totalXp} XP</span>
        <span className="ch-pill">⏱ ~{episode.min} MIN</span>
        {challengeCount > 0 && <span className="ch-pill lm">{challengeCount} CTF CHALLENGES</span>}
        <span className="ch-pill" style={{ borderColor: `${acc}40`, color: acc }}>{episode.done ? '✓ COMPLETED' : episode.active ? '● ACTIVE' : 'AVAILABLE'}</span>
      </div>
    </>
  );
};
