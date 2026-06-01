import React, { useState } from 'react';
import type { Challenge, GctfState } from '../../types';
import type { DSAProblem } from '../../data/dsaContent';
import { playSound } from '../../lib/sound';

type DiffFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';

interface DSAProblemListProps {
  problems: DSAProblem[];
  challenges: Challenge[];
  gctf: GctfState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  episodeTitle: string;
  episodeXp: number;
  accColor: string;
}

export const DSAProblemList: React.FC<DSAProblemListProps> = ({
  problems, challenges, gctf, onSelect, episodeTitle, episodeXp, accColor,
}) => {
  void episodeXp;
  const [query, setQuery] = useState('');
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('ALL');

  const solvedCount = problems.filter(p => gctf.solved[p.id]?.solved).length;
  const totalXp = problems.reduce((sum, p) => sum + (gctf.solved[p.id]?.pts_earned ?? 0), 0);
  const pct = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  const getTitle = (prob: DSAProblem) => {
    const ch = challenges.find(c => c.id === prob.id);
    return ch?.title ?? prob.leetcodeSlug.replace(/-/g, ' ');
  };

  const filtered = problems.filter(prob => {
    const diff = prob.difficulty.toUpperCase();
    if (diffFilter !== 'ALL' && diff !== diffFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      const title = getTitle(prob).toLowerCase();
      return title.includes(q) || String(prob.leetcodeNum).includes(q) || prob.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const scopeCss = `
    .dsa-wrap{--dsa-acc:${accColor};--dsa-pct:${pct}%}
    .dsa-progress-fill{width:var(--dsa-pct);background:var(--dsa-acc)}
    .dsa-board-title{color:var(--dsa-acc)}
    .dsa-stat-block:first-child .dsa-stat-val{color:var(--dsa-acc)}
  `;

  return (
    <>
      <style>{scopeCss}</style>
      <div className="dsa-wrap">

        {/* Board header */}
        <div className="dsa-board-hdr">
          <div className="dsa-board-hdr-left">
            <div className="dsa-board-eyebrow">// DSA_LAB · {episodeTitle}</div>
            <h2 className="dsa-board-title">ALGORITHM LAB</h2>
            <p className="dsa-board-sub">Study algorithms. Code the solution. Mark as solved.</p>
          </div>
          <div className="dsa-board-stats">
            <div className="dsa-stat-block">
              <span className="dsa-stat-val">{solvedCount}/{problems.length}</span>
              <span className="dsa-stat-lbl">SOLVED</span>
            </div>
            <div className="dsa-stat-sep" />
            <div className="dsa-stat-block">
              <span className="dsa-stat-val dsa-stat-val--xp">{totalXp}</span>
              <span className="dsa-stat-lbl">XP EARNED</span>
            </div>
            <div className="dsa-stat-sep" />
            <div className="dsa-stat-block">
              <span className="dsa-stat-val dsa-stat-val--pct">{pct}%</span>
              <span className="dsa-stat-lbl">COMPLETE</span>
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="dsa-progress-rail">
          <div className="dsa-progress-fill" />
        </div>

        {/* Filter + search strip */}
        <div className="dsa-filter-strip">
          {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as DiffFilter[]).map(d => (
            <button
              key={d}
              type="button"
              className={`dsa-filter-btn dsa-filter-btn--${d.toLowerCase()}${diffFilter === d ? ' on' : ''}`}
              onClick={() => { setDiffFilter(d); playSound.click(); }}
            >
              {d}
            </button>
          ))}
          <div className="dsa-filter-search">
            <input
              type="text"
              className="dsa-search-input"
              placeholder="Search problems…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              spellCheck={false}
            />
          </div>
          <span className="dsa-filter-count">{filtered.length} PROBLEMS</span>
        </div>

        {/* Problem grid */}
        <div className="dsa-grid">
          {filtered.length === 0 && (
            <div className="dsa-no-match">NO PROBLEMS MATCH YOUR FILTER</div>
          )}
          {filtered.map(prob => {
            const ch = challenges.find(c => c.id === prob.id);
            const title = getTitle(prob);
            const isSolved = !!gctf.solved[prob.id]?.solved;
            const diffKey = prob.difficulty.toLowerCase();
            const diffLabel = ({ easy: 'EASY', medium: 'MED', hard: 'HARD' } as Record<string, string>)[diffKey] ?? prob.difficulty;

            return (
              <div
                key={prob.id}
                className={`dsa-card dsa-card--${diffKey}${isSolved ? ' dsa-card--solved' : ''}`}
                onClick={() => { onSelect(prob.id); playSound.click(); }}
              >
                <div className="dsa-card-accent" />

                <div className="dsa-card-top">
                  <span className="dsa-card-diff">{isSolved ? '✓' : '◇'} {diffLabel}</span>
                  <span className="dsa-card-pts">
                    {isSolved ? `+${gctf.solved[prob.id]?.pts_earned ?? ch?.points ?? 100} ✓` : `${ch?.points ?? 100} XP`}
                  </span>
                </div>

                <div className="dsa-card-title">{title}</div>
                <div className="dsa-card-num">#{prob.leetcodeNum}</div>

                <div className="dsa-card-foot">
                  <div className="dsa-card-tags">
                    {prob.tags.slice(0, 2).map(t => (
                      <span key={t} className="dsa-card-tag">{t}</span>
                    ))}
                  </div>
                  {isSolved && <span className="dsa-card-solved-badge">SOLVED</span>}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
};
