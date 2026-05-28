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
}

export const Navbar: React.FC<NavbarProps> = ({
  onHome, onSeries, onBack, userXp, userId, showToast, activeTab, nodeId, navigate, challengesSolved,
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
        <div className="logo" onClick={onHome}><em>E</em>PHEMERAL</div>
        <div className="nav-mid">
          <a href="/" onClick={navClick(onHome)} className={activeTab === 'home' ? 'on' : ''}>HOME</a>
          {onSeries && <a href="/series" onClick={navClick(onSeries)} className={activeTab === 'series' ? 'on' : ''}>SERIES</a>}
          <a href="#rankings" onClick={(e) => { e.preventDefault(); openRankings(); }}>RANKINGS</a>
        </div>
        <div className="nav-r">
          {onBack && <button className="nav-btn" onClick={onBack}>BACK</button>}
          {!nodeId && <span className="nav-status"><span className="nav-dot"></span>LIVE</span>}
          <span className="nav-uid" style={{ color: 'var(--lime)', marginRight: '1rem' }}>XP// {userXp}</span>
          <span className="nav-uid">{nodeId ? nodeId : `UID// ${userId}`}</span>
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
