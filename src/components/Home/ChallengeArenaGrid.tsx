import React, { useState } from 'react';

interface ArenaCategory {
  id: string;
  name: string;
  domain: string;
  icon: string;
  description: string;
  challengeCount: number;
  difficulty: { easy: number; medium: number; hard: number };
  accColor: string;
  arcId: number;
  tags: string[];
  featuredChallenge: string;
}

const ARENA_CATEGORIES: ArenaCategory[] = [
  {
    id: 'algorithms',
    name: 'ALGORITHMS',
    domain: 'COMPETITIVE PROGRAMMING',
    icon: '⚡',
    description: 'Graph theory, dynamic programming, sorting, and computational complexity. The bedrock of competitive programming mastery.',
    challengeCount: 6,
    difficulty: { easy: 2, medium: 3, hard: 1 },
    accColor: '#e8000d',
    arcId: 1,
    tags: ['GRAPHS', 'DP', 'GREEDY', 'SORTING'],
    featuredChallenge: 'The Straw Hat Network'
  },
  {
    id: 'cybersecurity',
    name: 'CYBERSECURITY',
    domain: 'OFFENSIVE SECURITY',
    icon: '🔐',
    description: 'Buffer overflows, network exploitation, packet analysis, incident response, and cryptographic attacks. Real-world penetration testing skills.',
    challengeCount: 5,
    difficulty: { easy: 1, medium: 2, hard: 2 },
    accColor: '#00e5ff',
    arcId: 2,
    tags: ['EXPLOITATION', 'CRYPTO', 'OSINT', 'NETWORK'],
    featuredChallenge: 'Poneglyph Cipher'
  },
  {
    id: 'ml-ai',
    name: 'ML / AI',
    domain: 'MACHINE LEARNING',
    icon: '🧠',
    description: 'Neural architectures, backpropagation, transformer attention, gradient descent, and production ML debugging. Deep learning from scratch.',
    challengeCount: 7,
    difficulty: { easy: 2, medium: 3, hard: 2 },
    accColor: '#ab47bc',
    arcId: 3,
    tags: ['DEEP LEARNING', 'NLP', 'VISION', 'DEBUGGING'],
    featuredChallenge: 'The Perfect Student'
  },
  {
    id: 'mathematics',
    name: 'MATHEMATICS',
    domain: 'APPLIED MATHEMATICS',
    icon: 'λ',
    description: 'Linear algebra, eigendecomposition, probability theory, Monte Carlo simulation, and convex optimization for computer science.',
    challengeCount: 4,
    difficulty: { easy: 1, medium: 2, hard: 1 },
    accColor: '#ffb830',
    arcId: 7,
    tags: ['LINEAR ALGEBRA', 'STATS', 'PROBABILITY', 'OPTIMIZATION'],
    featuredChallenge: 'The AT-Field'
  },
  {
    id: 'beginners',
    name: 'BEGINNERS',
    domain: 'PROGRAMMING BASICS',
    icon: '🚀',
    description: 'Your first steps into coding. Python, C, Go, and JavaScript fundamentals with interactive sandbox exercises and beginner-friendly CTF challenges.',
    challengeCount: 4,
    difficulty: { easy: 4, medium: 0, hard: 0 },
    accColor: '#4fc3f7',
    arcId: 9,
    tags: ['PYTHON', 'C', 'GO', 'JAVASCRIPT'],
    featuredChallenge: 'The Serpent\'s Coil'
  },
  {
    id: 'data-structures',
    name: 'DATA STRUCTURES',
    domain: 'CS FOUNDATIONS',
    icon: '◈',
    description: 'Hash maps, tries, AVL trees, segment trees, heaps, and priority queues. The fundamental toolbox every software engineer must master.',
    challengeCount: 3,
    difficulty: { easy: 1, medium: 1, hard: 1 },
    accColor: '#ce93d8',
    arcId: 5,
    tags: ['TREES', 'HEAPS', 'HASH MAPS', 'TRIES'],
    featuredChallenge: 'The Friend\'s Identity'
  },
];

interface ChallengeArenaGridProps {
  navigate: (path: string) => void;
}

export const ChallengeArenaGrid: React.FC<ChallengeArenaGridProps> = ({ navigate }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="arena-grid-wrap">
      <div className="arena-grid-header">
        <div className="arena-grid-eyebrow">// MISSION SELECTION</div>
        <h2 className="arena-grid-title">CHOOSE YOUR DOMAIN</h2>
        <p className="arena-grid-subtitle">
          Select a combat domain to begin training. Each arc contains research modules, quiz challenges, and live CTF flag captures.
        </p>
      </div>

      <div className="arena-cards-grid">
        {ARENA_CATEGORIES.map(cat => {
          const isHovered = hoveredId === cat.id;
          const totalChallenges = cat.difficulty.easy + cat.difficulty.medium + cat.difficulty.hard;
          const easyPct = (cat.difficulty.easy / totalChallenges) * 100;
          const medPct = (cat.difficulty.medium / totalChallenges) * 100;

          return (
            <div
              key={cat.id}
              className={`arena-card ${isHovered ? 'hovered' : ''}`}
              style={{ '--arc-acc': cat.accColor } as React.CSSProperties}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate('/series')}
            >
              {/* Top accent bar */}
              <div className="arena-card-accent" style={{ background: cat.accColor }} />

              {/* Card header */}
              <div className="arena-card-head">
                <div className="arena-card-icon" style={{ color: cat.accColor }}>{cat.icon}</div>
                <div className="arena-card-count" style={{ color: cat.accColor }}>
                  {cat.challengeCount} <span>CHALLENGES</span>
                </div>
              </div>

              {/* Card title */}
              <div className="arena-card-name" style={{ color: cat.accColor }}>{cat.name}</div>
              <div className="arena-card-domain">{cat.domain}</div>

              {/* Description */}
              <p className="arena-card-desc">{cat.description}</p>

              {/* Tags */}
              <div className="arena-card-tags">
                {cat.tags.map(tag => (
                  <span key={tag} className="arena-card-tag" style={{ borderColor: `${cat.accColor}40`, color: cat.accColor }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Difficulty spectrum */}
              <div className="arena-diff-wrap">
                <span className="arena-diff-label">DIFFICULTY SPECTRUM</span>
                <div className="arena-diff-bar">
                  <div className="arena-diff-seg easy" style={{ width: `${easyPct}%` }} />
                  <div className="arena-diff-seg medium" style={{ width: `${medPct}%` }} />
                  <div className="arena-diff-seg hard" style={{ width: `${100 - easyPct - medPct}%` }} />
                </div>
                <div className="arena-diff-legend">
                  <span><span className="diff-dot easy" />{cat.difficulty.easy} EASY</span>
                  <span><span className="diff-dot medium" />{cat.difficulty.medium} MED</span>
                  <span><span className="diff-dot hard" />{cat.difficulty.hard} HARD</span>
                </div>
              </div>

              {/* Featured */}
              <div className="arena-card-featured">
                <span className="arena-featured-label">FEATURED:</span>
                <span className="arena-featured-name">{cat.featuredChallenge}</span>
              </div>

              {/* CTA */}
              <button
                className="arena-card-cta"
                style={{ background: isHovered ? cat.accColor : 'transparent', color: isHovered ? '#000' : cat.accColor, borderColor: cat.accColor }}
                onClick={(e) => { e.stopPropagation(); navigate('/series'); }}
              >
                ENTER DOMAIN →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
