import React, { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../../hooks/useApi';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar: string;
  title: string;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentAvatar,
  title,
}) => {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAvatars = async () => {
      setLoading(true);
      try {
        const res = await apiRequest('/api/avatars');
        if (res.success && res.avatars) {
          setAvatars(res.avatars);
        }
      } catch (err) {
        console.error('Failed to load avatars:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatars();
  }, [isOpen]);

  // Fuzzy search and categorization
  const filteredAvatars = useMemo(() => {
    return avatars.filter((url) => {
      const filename = decodeURIComponent(url.split('/').pop() || '').toLowerCase();
      
      // Category filter
      if (activeCategory === 'STRAW HATS') {
        const strawHats = ['luffy', 'zoro', 'sanji', 'nami', 'robin', 'brook', 'franky', 'usopp', 'sabo', 'ace', 'one piece', 'crocodile', 'mihawk', 'buggy', 'doflamingo'];
        if (!strawHats.some(sh => filename.includes(sh))) return false;
      } else if (activeCategory === 'DANDADAN') {
        if (!filename.includes('dandadan') && !filename.includes('okarun') && !filename.includes('ayase') && !filename.includes('seiko')) return false;
      } else if (activeCategory === 'BLEACH / NARUTO') {
        const anime = ['itachi', 'nagato', 'tobi', 'ichigo', 'kurosaki', 'yuta', 'okkotsu'];
        if (!anime.some(a => filename.includes(a))) return false;
      } else if (activeCategory === 'OPM / SAITAMA') {
        if (!filename.includes('saitama') && !filename.includes('fubuki') && !filename.includes('garou') && !filename.includes('punch')) return false;
      }

      // Search query filter
      return filename.includes(search.toLowerCase());
    });
  }, [avatars, search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="av-overlay" onClick={onClose}>
      <div className="av-modal" onClick={(e) => e.stopPropagation()}>
        <div className="av-header">
          <div className="av-title">
            <span className="av-glitch">// {title.toUpperCase()}</span>
            <span className="av-count">{filteredAvatars.length} FOUND</span>
          </div>
          <button className="av-close" onClick={onClose}>✕</button>
        </div>

        <div className="av-controls">
          <input
            type="text"
            className="av-search"
            placeholder="FILTER AVATARS BY NAME (e.g. Luffy, Zoro, Itachi)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <div className="av-cats">
            {['ALL', 'STRAW HATS', 'DANDADAN', 'BLEACH / NARUTO', 'OPM / SAITAMA'].map((cat) => (
              <button
                key={cat}
                className={`av-cat-btn ${activeCategory === cat ? 'on' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="av-loader">DECRYPTING IMAGE FILES...</div>
        ) : (
          <div className="av-grid">
            {filteredAvatars.map((url) => {
              const displayName = decodeURIComponent(url.split('/').pop() || '')
                .replace(/\.[^/.]+$/, '')
                .replace(/_/g, ' ')
                .trim();
              const isSelected = currentAvatar === url;

              return (
                <div
                  key={url}
                  className={`av-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(url);
                    onClose();
                  }}
                >
                  <div className="av-img-wrap">
                    <img src={url} alt={displayName} className="av-img" />
                    {isSelected && <div className="av-selected-badge">ACTIVE</div>}
                  </div>
                  <div className="av-name">{displayName}</div>
                </div>
              );
            })}
            {filteredAvatars.length === 0 && (
              <div className="av-empty">NO MATCHING INTERFACE AVATARS FOUND</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
