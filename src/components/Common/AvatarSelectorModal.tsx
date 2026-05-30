import React, { useState, useMemo } from 'react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar: string;
  title: string;
}

// ── Static avatar manifest pulled from public/avatar/ ─────────────────────
const AVATAR_FILES = [
  'Monkey D Luffy (1).jpeg','Monkey D Luffy.jpeg','Roronoa Zoro.jpeg','Zoro (1).jpeg','Zoro.jpeg',
  'Sanji (1).jpeg','Sanji (2).jpeg','Sanji.jpeg','Nami_.jpeg','Usopp.jpeg','Brook.jpeg','Franky.jpeg',
  'Doflamingo.jpeg','Sabo.jpeg','One Piece ☠️.jpeg','One Piece.jpeg',
  'Best swordsman.jpeg','one piece_ borsalino kizaru.jpeg',
  'Dandadan.jpeg','Dandadan (1).jpeg','Dan Da Dan.jpeg','Dandadan_ Okarun.jpeg','Dandadan_ Okarun (1).jpeg',
  'Dandadan Color Palette _ Seiko Ayase.jpeg',
  '˙⊹ ੈ✰┆𝑶𝒌𝒂𝒓𝒖𝒏.jpeg','˙⊹ ੈ✰┆𝑶𝒌𝒂𝒓𝒖𝒏 (1).jpeg',
  '˙⊹ ੈ✰┆𝒚𝒖𝒕𝒂 𝒐𝒌𝒌𝒐𝒕𝒔𝒖.jpeg','˙⊹ ੈ✰┆𝒚𝒖𝒕𝒂 𝒐𝒌𝒌𝒐𝒕𝒔𝒖 (1).jpeg',
  'Ichigo Kurosaki.jpeg','Itachi.jpeg','Nagato.jpeg','Tobi.jpeg','sakuraharuno.jpeg',
  'saitama.jpeg','Fubuki full hd.jpeg','Garou _ Icon _ Mangá.jpeg',
  'Nico Robin - One piece.jpeg','Ayako.jpeg','Aleksander.jpeg',
  'Artist_ Zzyzzyy_Sourced from_ Danbooru.jpeg','zzyzzyy (@zzyzzyy) on X.jpeg','zzyzzyy (@zzyzzyy) on X (1).jpeg',
  'Start living before you start dying!, text, quote, Portgas D_ Ace; One Piece.jpeg',
  'OMOCAT.jpeg','honesty COMMISSIONS OPEN (@b0_nesaw) on X.jpeg',
  'Anime t-shirt design for sale & custom order.jpeg',
  'World of Our Fantasy _ One punch man manga, One punch man anime, One punch man.jpeg',
  '_ Photo.jpeg','__•.jpeg','_•° one piece.jpeg','∆.jpeg',
  '1.jpeg','4.jpeg','5.jpeg','7.jpeg','8.jpeg','9.jpeg','10.jpeg','11.jpeg','12.jpeg','13.jpeg','16.jpeg',
  '_ (69).jpeg','_ (70).jpeg','_ (71).jpeg','_ (72).jpeg','_ (73).jpeg','_ (74).jpeg','_ (75).jpeg',
  '_ (76).jpeg','_ (77).jpeg','_ (78).jpeg','_ (79).jpeg','_ (80).jpeg','_ (81).jpeg','_ (82).jpeg',
  '_ (83).jpeg','_ (84).jpeg','_ (85).jpeg','_ (86).jpeg','_ (87).jpeg','_ (88).jpeg','_ (89).jpeg',
  '_ (90).jpeg','_ (91).jpeg','_ (92).jpeg','_ (93).jpeg','_ (94).jpeg','_ (95).jpeg','_ (96).jpeg',
  '_ (97).jpeg','_ (98).jpeg','_ (99).jpeg','_ (100).jpeg',
  '_ - 2026-05-28T200240.414.jpeg','_ - 2026-05-28T200304.051.jpeg','_ - 2026-05-28T200328.710.jpeg',
  '_ - 2026-05-28T200333.250.jpeg','_ - 2026-05-28T200341.462.jpeg','_ - 2026-05-28T200354.258.jpeg',
  '_ - 2026-05-28T200358.475.jpeg','_ - 2026-05-28T200409.803.jpeg','_ - 2026-05-28T200429.034.jpeg',
  '_ - 2026-05-28T200434.606.jpeg','_ - 2026-05-28T200459.270.jpeg','_ - 2026-05-28T200525.247.jpeg',
  '_ - 2026-05-28T200536.308.jpeg','_ - 2026-05-28T200541.263.jpeg','_ - 2026-05-28T200553.250.jpeg',
  '_ - 2026-05-28T200841.081.jpeg','_ - 2026-05-28T200847.256.jpeg','_ - 2026-05-28T200944.360.jpeg',
  'Rank 15.jpeg',
];

// One Piece gallery also selectable as covers
const ONE_PIECE_COVER_FILES = Array.from({ length: 85 }, (_, i) => `${i + 1}.jpeg`);

const CATEGORIES = ['ALL', 'STRAW HATS', 'DANDADAN', 'BLEACH / NARUTO', 'OPM / SAITAMA', 'GALLERY'];

function matchCat(filename: string, cat: string, isOnepiece: boolean): boolean {
  if (cat === 'ALL') return true;
  if (cat === 'GALLERY') return isOnepiece;
  const f = filename.toLowerCase();
  if (cat === 'STRAW HATS') {
    return ['luffy','zoro','sanji','nami','robin','brook','franky','usopp','sabo','ace','one piece',
      'crocodile','mihawk','buggy','doflamingo','corazon'].some(k => f.includes(k));
  }
  if (cat === 'DANDADAN') return ['dandadan','okarun','ayase','seiko','yuta','okkotsu'].some(k => f.includes(k));
  if (cat === 'BLEACH / NARUTO') return ['itachi','nagato','tobi','ichigo','kurosaki','yuta','sakura','haruno'].some(k => f.includes(k));
  if (cat === 'OPM / SAITAMA') return ['saitama','fubuki','garou','punch'].some(k => f.includes(k));
  return true;
}

function prettyName(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim();
  if (/^\d+$/.test(base)) {
    return `Cover #${base}`;
  }
  return base.slice(0, 30);
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen, onClose, onSelect, currentAvatar, title,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Build unified list: avatar/ first, then one_piece/ for gallery
  const allAvatars = useMemo(() => {
    const list: { url: string; filename: string; isOnepiece: boolean }[] = [];
    AVATAR_FILES.forEach(f => list.push({ url: `/avatar/${f}`, filename: f, isOnepiece: false }));
    ONE_PIECE_COVER_FILES.forEach(f => list.push({ url: `/one_piece/${f}`, filename: f, isOnepiece: true }));
    return list;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allAvatars.filter(({ filename, isOnepiece }) => {
      if (!matchCat(filename, activeCategory, isOnepiece)) return false;
      if (q && !filename.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allAvatars, search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="av-overlay" onClick={onClose}>
      <div className="av-modal" onClick={e => e.stopPropagation()}>
        <div className="av-header">
          <div className="av-title">
            <span className="av-glitch">// {title.toUpperCase()}</span>
            <span className="av-count">{filtered.length} FOUND</span>
          </div>
          <button className="av-close" onClick={onClose}>✕</button>
        </div>

        <div className="av-controls">
          <input
            type="text"
            className="av-search"
            placeholder="FILTER BY NAME (e.g. Luffy, Zoro, Dandadan)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="av-cats">
            {CATEGORIES.map(cat => (
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

        <div className="av-grid">
          {filtered.map(({ url, filename, isOnepiece }) => {
            const isSelected = currentAvatar === url;
            return (
              <div
                key={url}
                className={`av-card ${isSelected ? 'selected' : ''} ${isOnepiece ? 'av-card-gallery' : ''}`}
                onClick={() => { onSelect(url); onClose(); }}
              >
                <div className="av-img-wrap">
                  <img
                    src={url}
                    alt={prettyName(filename)}
                    className="av-img"
                    loading="lazy"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
                  />
                  {isSelected && <div className="av-selected-badge">ACTIVE</div>}
                  {isOnepiece && <div className="av-gallery-tag">COVER</div>}
                </div>
                <div className="av-name">{prettyName(filename)}</div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="av-empty">NO MATCHING AVATARS FOUND</div>
          )}
        </div>
      </div>
    </div>
  );
};
