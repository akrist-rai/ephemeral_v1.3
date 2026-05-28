import React, { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../../types';
import { apiRequest } from '../../hooks/useApi';

interface NavbarProps {
  onHome: () => void;
  onSeries?: () => void;
  onBack?: () => void;
  userXp: number;
  userId: string;
  showToast: (msg: string) => void;
  activeTab?: string;
  nodeId?: string;
  navigate: (path: string) => void;
  challengesSolved: number;
  userAvatar?: string;
  onChangeAvatar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onHome, onSeries, onBack, userXp, userId, showToast, activeTab, nodeId, navigate, challengesSolved, userAvatar, onChangeAvatar,
}) => {
  const [showRankings, setShowRankings] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);

  const navClick = (action: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    action();
  };

  const openRankings = async () => {
    setShowRankings(true);
    if (leaderboard.length === 0) {
      setLbLoading(true);
      try {
        const data = await apiRequest('/api/leaderboard?limit=10');
        setLeaderboard(data.leaderboard);
      } catch { showToast('FAILED TO LOAD RANKINGS'); }
      setLbLoading(false);
    }
  };

  return (
    <>
      <nav>
        <div className="logo" onClick={onHome}>
          <svg className="compass-logo" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', transition: 'transform 0.8s ease-out' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
          <em>E</em>PHEMERAL
        </div>
        <div className="nav-mid">
          <a href="/" onClick={navClick(onHome)} className={activeTab === 'home' ? 'on' : ''}>HOME</a>
          {onSeries && <a href="/series" onClick={navClick(onSeries)} className={activeTab === 'series' ? 'on' : ''}>SERIES</a>}
          <a href="/bounty" onClick={(e) => { e.preventDefault(); navigate('/bounty'); }} className={activeTab === 'bounty' ? 'on' : ''}>BOUNTY DECK</a>
          <a href="/alliance" onClick={(e) => { e.preventDefault(); navigate('/alliance'); }} className={activeTab === 'alliance' ? 'on' : ''}>ALLIANCE</a>
          <a href="#rankings" onClick={(e) => { e.preventDefault(); openRankings(); }}>RANKINGS</a>
        </div>
        <div className="nav-r">
          {onBack && <button className="nav-btn" onClick={onBack}>BACK</button>}
          {!nodeId && <span className="nav-status"><span className="nav-dot"></span>LIVE</span>}
          <span className="nav-uid" style={{ color: 'var(--lime)', marginRight: '1rem' }}>XP// {userXp}</span>
          {userAvatar ? (
            <div className="nav-profile-wrap" onClick={onChangeAvatar} title="Change Profile Avatar">
              <img src={userAvatar} alt="Profile" className="nav-avatar-img" />
              <span className="nav-uid">{nodeId ? nodeId : `UID// ${userId}`}</span>
            </div>
          ) : (
            <span className="nav-uid">{nodeId ? nodeId : `UID// ${userId}`}</span>
          )}
        </div>
      </nav>

      {showRankings && (
        <div className="rankings-overlay" onClick={() => setShowRankings(false)}>
          <div className="rankings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rankings-header">
              <span className="rankings-title">LEADERBOARD</span>
              <button className="rankings-close" onClick={() => setShowRankings(false)}>✕</button>
            </div>
            {lbLoading ? (
              <div className="rankings-loading">SYNCING...</div>
            ) : leaderboard.length === 0 ? (
              <div className="rankings-empty">NO RANKINGS YET — BE THE FIRST</div>
            ) : (
              <div className="rankings-list">
                {leaderboard.map((entry) => (
                  <div key={entry.userId} className={`rankings-row ${entry.userId === userId ? 'rankings-self' : ''}`}>
                    <span className="rankings-rank">#{entry.rank}</span>
                    <span className="rankings-user">{entry.userId}</span>
                    <span className="rankings-solved">{entry.challengesSolved} solved</span>
                    <span className="rankings-xp">{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
