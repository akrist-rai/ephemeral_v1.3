import React, { useState, useEffect, useRef, useMemo } from 'react';

interface SearchOverlayProps {
  challenges: any[];
  gctf: any;
  navigate: (path: string) => void;
  getChallengePath: (ch: any) => string;
  onClose: () => void;
}

const CAT_META: Record<string, { color: string; icon: string }> = {
  GRADIENT:     { color: '#4fc3f7', icon: '∇' },
  ARCHITECTURE: { color: '#f9a825', icon: '⬡' },
  INFERENCE:    { color: '#e8000d', icon: '◈' },
  'DATA LEAK':  { color: '#ff6b35', icon: '⚠' },
  TRAINING:     { color: '#ab47bc', icon: '⟳' },
  NLP:          { color: '#26c6da', icon: '⌥' },
  OVERFITTING:  { color: '#ef5350', icon: '⤴' },
  SYSTEMS:      { color: '#66bb6a', icon: '⚙' },
  CRYPTO:       { color: '#ffd54f', icon: '🔐' },
  ALGORITHMS:   { color: '#80cbc4', icon: '◇' },
  FAIRNESS:     { color: '#ce93d8', icon: '⚖' },
};

const TIER_LABEL: Record<number, string> = { 1: 'ENTRY', 2: 'CORE', 3: 'RUHENHEIM' };
const DIFF_LABEL = ['', '★', '★★', '★★★'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ challenges, gctf, navigate, getChallengePath, onClose }) => {
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [filterTier, setFilterTier] = useState(0);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const cats = useMemo(() => ['ALL', ...Array.from(new Set(challenges.map(c => c.category)))], [challenges]);

  const results = useMemo(() => {
    let list = challenges;
    if (filterCat !== 'ALL') list = list.filter(c => c.category === filterCat);
    if (filterTier > 0) list = list.filter(c => c.tier === filterTier);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.scenario.toLowerCase().includes(q)
      );
    }
    return list;
  }, [challenges, query, filterCat, filterTier]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { setSelected(s => Math.min(s + 1, results.length - 1)); e.preventDefault(); }
      if (e.key === 'ArrowUp')   { setSelected(s => Math.max(s - 1, 0)); e.preventDefault(); }
      if (e.key === 'Enter' && results[selected]) {
        navigate(getChallengePath(results[selected]));
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [results, selected, navigate, getChallengePath, onClose]);

  useEffect(() => setSelected(0), [results]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector('.srch-result-item.selected');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <div className="search-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-modal">
        {/* Header */}
        <div className="search-header">
          <div className="search-icon">⌕</div>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search challenges, categories, keywords..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="search-kbd" onClick={onClose}>ESC</div>
        </div>

        {/* Filters */}
        <div className="search-filters">
          <div className="search-filter-group">
            <span className="srch-filter-label">CATEGORY:</span>
            {cats.map(cat => (
              <button key={cat} className={`srch-filter-btn ${filterCat === cat ? 'active' : ''}`}
                style={filterCat === cat ? { borderColor: CAT_META[cat]?.color || '#fff', color: CAT_META[cat]?.color || '#fff' } : {}}
                onClick={() => setFilterCat(cat)}>
                {cat === 'ALL' ? 'ALL' : `${CAT_META[cat]?.icon || ''} ${cat}`}
              </button>
            ))}
          </div>
          <div className="search-filter-group">
            <span className="srch-filter-label">TIER:</span>
            {[0, 1, 2, 3].map(t => (
              <button key={t} className={`srch-filter-btn ${filterTier === t ? 'active' : ''}`}
                onClick={() => setFilterTier(t)}>
                {t === 0 ? 'ALL' : `T${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="search-results" ref={listRef}>
          {results.length === 0 && (
            <div className="search-empty">
              <span className="search-empty-icon">◌</span>
              <span>No challenges match your query</span>
            </div>
          )}
          {results.map((ch, i) => {
            const meta = CAT_META[ch.category] || { color: '#fff', icon: '□' };
            const solved = gctf.solved[ch.id];
            const ok = solved?.solved;
            const failed = solved?.failed || (!solved?.solved && (gctf.chalAttempts[ch.id] ?? ch.attemptsAllowed) <= 0);
            return (
              <div
                key={ch.id}
                className={`srch-result-item ${i === selected ? 'selected' : ''} ${ok ? 'srch-solved' : failed ? 'srch-failed' : ''}`}
                onClick={() => { navigate(getChallengePath(ch)); onClose(); }}
                onMouseEnter={() => setSelected(i)}
              >
                <div className="srch-result-left">
                  <span className="srch-cat-icon" style={{ color: meta.color }}>{meta.icon}</span>
                  <div className="srch-result-info">
                    <div className="srch-result-title">{ch.title}</div>
                    <div className="srch-result-meta">
                      <span className="srch-meta-cat" style={{ color: meta.color }}>{ch.category}</span>
                      <span className="srch-meta-sep">·</span>
                      <span className="srch-meta-tier">{TIER_LABEL[ch.tier] || `T${ch.tier}`}</span>
                      <span className="srch-meta-sep">·</span>
                      <span className="srch-meta-diff">{DIFF_LABEL[ch.difficulty] || ch.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="srch-result-right">
                  {ok    && <span className="srch-status srch-ok">✓ SOLVED</span>}
                  {failed && <span className="srch-status srch-fail">✗ FAILED</span>}
                  {!ok && !failed && <span className="srch-pts" style={{ color: meta.color }}>{ch.points} PTS</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
          <span className="srch-result-count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
