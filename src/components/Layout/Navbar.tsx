import React from 'react';

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

export const Navbar: React.FC<NavbarProps> = ({
  onHome, onSeries, onBack, userXp, userId, displayName, showToast,
  activeTab, nodeId, navigate, challengesSolved, userAvatar, onChangeAvatar,
  onOpenSearch,
}) => {
  const go = (href: string, action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  const name = displayName || userId;

  return (
    <nav>
      {/* Logo */}
      <div className="logo" onClick={onHome}>
        <svg className="compass-logo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <em>E</em>PHEMERAL
      </div>

      {/* Navigation links */}
      <div className="nav-mid">
        <a href="/" onClick={go('/', onHome)} className={activeTab === 'home' ? 'on' : ''}>HOME</a>
        {onSeries && <a href="/series" onClick={go('/series', onSeries)} className={activeTab === 'series' ? 'on' : ''}>SERIES</a>}
        <a href="/leaderboard" onClick={go('/leaderboard', () => navigate('/leaderboard'))} className={activeTab === 'leaderboard' ? 'on' : ''}>BOUNTY BOARD</a>
        <a href="/profile" onClick={go('/profile', () => navigate('/profile'))} className={activeTab === 'profile' ? 'on' : ''}>PROFILE</a>
      </div>

      {/* Right side */}
      <div className="nav-r">
        {onBack && <button className="nav-btn" onClick={onBack}>← BACK</button>}
        {!nodeId && <span className="nav-status"><span className="nav-dot" />LIVE</span>}

        {/* Search button */}
        <button
          className="nav-search-btn"
          onClick={onOpenSearch}
          title="Search challenges [/]"
        >
          ⌕
        </button>

        {/* XP counter */}
        <span className="nav-xp-pill">
          ⚡ <span className="nav-xp-val">{userXp}</span> XP
        </span>

        {/* Challenges */}
        <span className="nav-chal-pill">
          ◈ <span className="nav-xp-val">{challengesSolved}</span> FLAGS
        </span>

        {/* User avatar + name — navigates to profile */}
        <div className="nav-profile-wrap" onClick={() => navigate('/profile')} title="View Profile">
          {userAvatar
            ? <img src={userAvatar} alt="avatar" className="nav-avatar-img" onError={e => { e.currentTarget.style.display = 'none'; }} />
            : <div className="nav-avatar-fallback">{name.slice(0, 2)}</div>
          }
          <span className="nav-uid">{nodeId || name}</span>
        </div>
      </div>
    </nav>
  );
};
