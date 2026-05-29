import React, { useState } from 'react';

interface NavbarProps {
  onHome: () => void;
  onSeries?: () => void;
  onBack?: () => void;
  userXp: number;
  userId: string;
  displayName?: string;
  showToast: (msg: string) => void;
  activeTab?: string;
  nodeId?: string;
  navigate: (path: string) => void;
  challengesSolved: number;
  userAvatar?: string;
  onChangeAvatar?: () => void;
  onOpenSearch?: () => void;
}

function getRankLabel(xp: number): { label: string; color: string } {
  if (xp < 500)    return { label: 'RECRUIT',    color: '#8888aa' };
  if (xp < 1500)   return { label: 'OPERATIVE',  color: '#00e5ff' };
  if (xp < 4000)   return { label: 'AGENT',      color: '#ccff00' };
  if (xp < 8000)   return { label: 'SPECIALIST', color: '#ffb830' };
  if (xp < 15000)  return { label: 'PHANTOM',    color: '#ff6b35' };
  return               { label: 'GHOST',      color: '#ff2a38' };
}

export const Navbar: React.FC<NavbarProps> = ({
  onHome, onSeries, onBack, userXp, userId, displayName, showToast,
  activeTab, nodeId, navigate, challengesSolved, userAvatar, onChangeAvatar,
  onOpenSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = displayName || userId;
  const rank = getRankLabel(userXp);

  const go = (href: string, action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    action();
  };

  return (
    <nav className="navbar">
      {/* ── Logo ── */}
      <div className="nb-logo" onClick={onHome}>
        <svg className="nb-compass" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <span className="nb-logo-text"><em>E</em>PHEMERAL</span>
      </div>

      {/* ── Center Nav ── */}
      <div className="nb-links">
        <a href="/" onClick={go('/', onHome)} className={`nb-link ${activeTab === 'home' ? 'on' : ''}`}>HOME</a>
        {onSeries && (
          <a href="/series" onClick={go('/series', onSeries)} className={`nb-link ${activeTab === 'series' ? 'on' : ''}`}>SERIES</a>
        )}
        <a href="/leaderboard" onClick={go('/leaderboard', () => navigate('/leaderboard'))} className={`nb-link ${activeTab === 'leaderboard' ? 'on' : ''}`}>BOUNTY BOARD</a>
        <a href="/profile" onClick={go('/profile', () => navigate('/profile'))} className={`nb-link ${activeTab === 'profile' ? 'on' : ''}`}>PROFILE</a>
      </div>

      {/* ── Right Side ── */}
      <div className="nb-right">
        {/* Search */}
        <button className="nb-icon-btn" onClick={onOpenSearch} title="Search [/]" aria-label="Search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Back button if on sub-page */}
        {onBack && (
          <button className="nb-back-btn" onClick={onBack}>← BACK</button>
        )}

        {/* Live indicator */}
        {!nodeId && (
          <div className="nb-live">
            <span className="nb-live-dot" />
            <span className="nb-live-label">LIVE</span>
          </div>
        )}

        {/* XP pill */}
        <div className="nb-xp-chip" title="Experience Points">
          <span className="nb-xp-icon">⚡</span>
          <span className="nb-xp-val">{userXp.toLocaleString()}</span>
          <span className="nb-xp-label">XP</span>
        </div>

        {/* Flags */}
        <div className="nb-flags-chip" title="CTF Flags Captured">
          <span className="nb-flags-icon">◈</span>
          <span className="nb-xp-val">{challengesSolved}</span>
        </div>

        {/* Profile widget */}
        <div className="nb-profile" onClick={() => navigate('/profile')} title="View Profile">
          <div className="nb-avatar-wrap">
            {userAvatar
              ? <img src={userAvatar} alt="avatar" className="nb-avatar-img" onError={e => { e.currentTarget.style.display = 'none'; }} />
              : <div className="nb-avatar-fallback">{name.slice(0, 2)}</div>
            }
            <div className="nb-avatar-ring" />
          </div>
          <div className="nb-profile-info">
            <div className="nb-profile-name">{nodeId || name}</div>
            <div className="nb-rank-badge" style={{ color: rank.color }}>
              <span className="nb-rank-dot" style={{ background: rank.color }} />
              {rank.label}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
