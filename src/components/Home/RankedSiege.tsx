import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sound';
import { TextScramble } from '../Effects/TextScramble';
import { PointerGlow } from '../Effects/PointerGlow';
import { GlitchText } from '../Effects/GlitchText';

interface RankedSiegeProps {
  navigate: (path: string) => void;
}

// Compute time remaining until next midnight UTC
function getTimeLeft(): { h: number; m: number; s: number; pct: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const totalMs = 24 * 60 * 60 * 1000;
  const leftMs = midnight.getTime() - now.getTime();
  const h = Math.floor(leftMs / 3600000);
  const m = Math.floor((leftMs % 3600000) / 60000);
  const s = Math.floor((leftMs % 60000) / 1000);
  const pct = ((totalMs - leftMs) / totalMs) * 100;
  return { h, m, s, pct };
}

const SIEGE_CHALLENGE = {
  id: 'SIEGE_001',
  title: 'THE PHANTOM NODE',
  description: 'A rogue AI fragment has embedded itself inside a distributed ledger. Trace the transaction graph, find the corrupted block hash, and extract the flag before the window closes.',
  category: 'NETWORKS',
  tier: 3,
  points: 500,
  bonusPoints: { first: 200, second: 100, third: 50 },
  solvers: 3,
  arcId: 2,
  episodeId: 'S1E1_A2',
  totalAttempts: 47,
  tags: ['BLOCKCHAIN', 'GRAPHS', 'FORENSICS', 'TIMED'],
};

const LEADERBOARD_PREVIEW = [
  { rank: 1, handle: 'VOID_KNIGHT_9441', time: '02:14:33', pts: 700, blood: true },
  { rank: 2, handle: 'NEON_ORACLE_2281', time: '04:01:17', pts: 600, blood: false },
  { rank: 3, handle: 'QUANTUM_WRAITH_7', time: '06:55:02', pts: 550, blood: false },
];

export const RankedSiege: React.FC<RankedSiegeProps> = ({ navigate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleButtonClick = (action: () => void) => {
    playSound.click();
    action();
  };

  const handleMouseEnter = () => {
    playSound.hover();
  };

  return (
    <PointerGlow color="#e8000d" size={400} opacity={0.06} className="siege-wrap">
      {/* Header bar */}
      <div className="siege-header">
        <div className="siege-header-left">
          <div className="siege-live-dot" style={{ animationPlayState: pulse ? 'running' : 'paused' }} />
          <span className="siege-eyebrow">// RANKED SIEGE — LIVE</span>
          <span className="siege-badge">24H TIMED CHALLENGE</span>
        </div>
        <div className="siege-header-right">
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.45rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>
            TIME REMAINING
          </span>
          <div className="siege-countdown">
            <span className="siege-time-seg">{pad(timeLeft.h)}</span>
            <span className="siege-time-sep" style={{ opacity: pulse ? 1 : 0.3 }}>:</span>
            <span className="siege-time-seg">{pad(timeLeft.m)}</span>
            <span className="siege-time-sep" style={{ opacity: pulse ? 1 : 0.3 }}>:</span>
            <span className="siege-time-seg">{pad(timeLeft.s)}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="siege-progress-wrap">
        <div className="siege-progress-track">
          <div className="siege-progress-fill" style={{ width: `${timeLeft.pct}%` }} />
        </div>
      </div>

      <div className="siege-body">
        {/* Left: challenge info */}
        <div className="siege-challenge-panel">
          <div className="siege-chall-eyebrow">// ACTIVE INCIDENT</div>
          <h3 className="siege-chall-title">
            <GlitchText text={SIEGE_CHALLENGE.title} triggerOnHover={true} color="var(--red)" />
          </h3>
          <div className="siege-chall-tags">
            {SIEGE_CHALLENGE.tags.map(t => (
              <span key={t} className="siege-tag" style={{ borderColor: 'rgba(232,0,13,0.4)', color: '#e8000d' }}>{t}</span>
            ))}
          </div>
          <p className="siege-chall-desc">{SIEGE_CHALLENGE.description}</p>

          {/* Point structure */}
          <div className="siege-point-grid">
            <div className="siege-point-row">
              <span className="siege-point-icon" style={{ color: '#ffb830' }}>⚡</span>
              <span className="siege-point-label">BASE REWARD</span>
              <span className="siege-point-val" style={{ color: '#ffb830' }}>{SIEGE_CHALLENGE.points} XP</span>
            </div>
            <div className="siege-point-row">
              <span className="siege-point-icon" style={{ color: '#e8000d' }}>🩸</span>
              <span className="siege-point-label">FIRST BLOOD BONUS</span>
              <span className="siege-point-val" style={{ color: '#e8000d' }}>+{SIEGE_CHALLENGE.bonusPoints.first} XP</span>
            </div>
            <div className="siege-point-row">
              <span className="siege-point-icon" style={{ color: '#9e9e9e' }}>◈</span>
              <span className="siege-point-label">2ND PLACE BONUS</span>
              <span className="siege-point-val" style={{ color: '#9e9e9e' }}>+{SIEGE_CHALLENGE.bonusPoints.second} XP</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem' }}>
            <button
              className="siege-enter-btn"
              onClick={() => handleButtonClick(() => navigate(`/episode/${SIEGE_CHALLENGE.arcId}/${SIEGE_CHALLENGE.episodeId}/ctf/${SIEGE_CHALLENGE.id}`))}
              onMouseEnter={handleMouseEnter}
            >
              ⚔ ENTER SIEGE →
            </button>
            <div className="siege-solver-count">
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.4rem', letterSpacing: '0.12em', fontFamily: 'var(--mono)' }}>SOLVED BY</span>
              <span style={{ color: '#00ff41', fontFamily: 'var(--disp)', fontSize: '1.2rem' }}>{SIEGE_CHALLENGE.solvers}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.4rem', letterSpacing: '0.12em', fontFamily: 'var(--mono)' }}>OPERATORS</span>
            </div>
          </div>
        </div>

        {/* Right: leaderboard */}
        <div className="siege-lb-panel">
          <div className="siege-lb-header">
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.45rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>// SIEGE LEADERBOARD</span>
          </div>
          <div className="siege-lb-rows">
            {LEADERBOARD_PREVIEW.map(entry => (
              <div 
                key={entry.rank} 
                className={`siege-lb-row ${entry.rank === 1 ? 'siege-lb-row-gold' : ''}`}
                onMouseEnter={handleMouseEnter}
              >
                <div className="siege-lb-rank" style={{ color: entry.rank === 1 ? '#ffb830' : entry.rank === 2 ? '#9e9e9e' : '#795548' }}>
                  #{entry.rank}
                </div>
                <div className="siege-lb-operator">
                  {entry.blood && <span style={{ marginRight: '0.3rem' }}>🩸</span>}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', color: '#fff', letterSpacing: '0.06em' }}>
                    <TextScramble text={entry.handle} triggerOnHover speed={40} />
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{entry.time}</span>
                  <span style={{ fontFamily: 'var(--disp)', fontSize: '0.7rem', color: entry.rank === 1 ? '#ffb830' : 'rgba(255,255,255,0.6)' }}>{entry.pts} XP</span>
                </div>
              </div>
            ))}
            <div className="siege-lb-join">
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.45rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
                {SIEGE_CHALLENGE.totalAttempts} TOTAL ATTEMPTS · {SIEGE_CHALLENGE.solvers} SOLVED
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.45rem', color: '#e8000d', letterSpacing: '0.1em' }}>
                YOUR RANK: —
              </span>
            </div>
          </div>
        </div>
      </div>
    </PointerGlow>
  );
};
