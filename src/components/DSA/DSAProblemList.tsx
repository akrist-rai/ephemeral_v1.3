import React from 'react';
import type { Challenge, GctfState } from '../../types';
import type { DSAProblem } from '../../data/dsaContent';
import { playSound } from '../../lib/sound';

interface DSAProblemListProps {
  problems: DSAProblem[];
  challenges: Challenge[];
  gctf: GctfState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  episodeDesc: string;
  accColor: string;
}

const DIFF_CLASS: Record<string, string> = {
  Easy: 'ds-diff--easy',
  Medium: 'ds-diff--medium',
  Hard: 'ds-diff--hard',
};

export const DSAProblemList: React.FC<DSAProblemListProps> = ({
  problems, challenges, gctf, selectedId, onSelect, episodeDesc, accColor,
}) => {
  const solvedCount = problems.filter(p => gctf.solved[p.id]?.solved).length;
  const pct = problems.length > 0 ? (solvedCount / problems.length) * 100 : 0;

  const activeProblem = problems.find(p => p.id === selectedId);

  return (
    <div className="ds-sidebar">
      {/* Episode summary */}
      <div className="ds-sidebar-ep">
        <div className="ds-sidebar-ep-label">// EPISODE BRIEF</div>
        <p className="ds-sidebar-ep-desc">
          {episodeDesc.slice(0, 200)}{episodeDesc.length > 200 ? '…' : ''}
        </p>
      </div>

      {/* Progress */}
      <div className="ds-progress-wrap">
        <div className="ds-progress-label">
          <span>PROGRESS</span>
          <span>{solvedCount}/{problems.length} SOLVED</span>
        </div>
        <div className="ds-progress-track">
          <div
            className="ds-progress-fill"
            style={{ width: `${pct}%`, background: accColor }}
          />
        </div>
      </div>

      {/* Problem list */}
      <div className="ds-prob-list">
        {problems.map(prob => {
          const ch = challenges.find(c => c.id === prob.id);
          const isSolved = !!gctf.solved[prob.id]?.solved;
          const isActive = prob.id === selectedId;

          return (
            <div
              key={prob.id}
              className={`ds-prob-item ${isActive ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
              style={{ '--ds-acc': accColor } as React.CSSProperties}
              onClick={() => { onSelect(prob.id); playSound.click(); }}
            >
              <div className={`ds-prob-dot ${isSolved ? 'ds-prob-dot--solved' : 'ds-prob-dot--unsolved'}`} />
              <div className="ds-prob-info">
                <div className="ds-prob-title">{prob.title}</div>
                <div className="ds-prob-meta">
                  <span className={`ds-diff ${DIFF_CLASS[prob.difficulty] ?? ''}`}>{prob.difficulty}</span>
                  <span className="ds-prob-lc">#{prob.leetcodeNum}</span>
                </div>
              </div>
              <span className="ds-prob-xp">+{ch?.points ?? 100}</span>
            </div>
          );
        })}
      </div>

      {/* LeetCode link for selected problem */}
      <div className="ds-sidebar-lc">
        {activeProblem ? (
          <a
            href={activeProblem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-lc-btn"
            onClick={() => playSound.click()}
          >
            <span className="ds-lc-icon">⛭</span>
            #{activeProblem.leetcodeNum} on LeetCode ↗
          </a>
        ) : (
          <div className="ds-lc-btn" style={{ cursor: 'default' }}>
            <span className="ds-lc-icon">⛭</span>
            Select a problem to open on LeetCode
          </div>
        )}
      </div>
    </div>
  );
};
