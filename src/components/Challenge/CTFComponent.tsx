import React, { useState, useEffect } from 'react';
import { WriteupModal } from '../Common/WriteupModal';
import { playSound } from '../../lib/sound';
import { GlitchText } from '../Effects/GlitchText';
import { getChaptersForChallenge } from '../../data/ctfChapters';

interface CTFComponentProps {
  gctf: any; setGctf: any; setUserXp: any;
  showToast: (msg: string) => void;
  challenges: any[];
  navigate: (path: string) => void;
  dataStatus: string; apiError: string;
  submitFlag: any; toggleCTFHint: any;
  shake: boolean; flagInputRef: any;
  episodeBasePath: string;
  chalStats?: Record<string, { solveCount: number; firstBlood: string | null }>;
  currentUserId?: string;
}

const CAT_META: Record<string, { color: string; icon: string }> = {
  WEB:          { color: 'var(--red)',  icon: '🌐' },
  PWN:          { color: '#ff4466',     icon: '☠' },
  REVERSE:      { color: '#d500f9',     icon: '⇄' },
  CRYPTO:       { color: 'var(--lime)', icon: '🔐' },
  ML_SECURITY:  { color: 'var(--crt)',  icon: '🧠' },
  SCRIPTING:    { color: '#ab47bc',     icon: '📜' },
  GRADIENT:     { color: '#4fc3f7',     icon: '∇'  },
  ARCHITECTURE: { color: 'var(--lime)', icon: '⬡'  },
  INFERENCE:    { color: 'var(--red)',  icon: '◈'  },
  TRAINING:     { color: '#ab47bc',     icon: '⟳'  },
  NLP:          { color: '#26c6da',     icon: '⌥'  },
  SYSTEMS:      { color: 'var(--crt)',  icon: '⚙'  },
  ALGORITHMS:   { color: '#80cbc4',     icon: '◇'  },
  FAIRNESS:     { color: '#ce93d8',     icon: '⚖'  },
  'DATA LEAK':  { color: '#ff6b35',     icon: '⚠'  },
  OVERFITTING:  { color: 'var(--red)',  icon: '⤴'  },
};

export const CTFComponent: React.FC<CTFComponentProps> = ({
  gctf, showToast, challenges, navigate, dataStatus, apiError,
  submitFlag, toggleCTFHint, shake, flagInputRef, setUserXp, episodeBasePath,
  chalStats = {}, currentUserId = '',
}) => {
  const [writeupChal, setWriteupChal] = useState<{ id: string; title: string } | null>(null);
  const [filterCat, setFilterCat] = useState('ALL');
  const [activeChapIdx, setActiveChapIdx] = useState(0);
  const [chapAnswers, setChapAnswers] = useState<Record<string, string>>({});
  const [solvedChaps, setSolvedChaps] = useState<Record<string, boolean>>({});
  const [chapShake, setChapShake] = useState(false);
  const [expandedArt, setExpandedArt] = useState<number | null>(0);
  const activeChalId = gctf.active || '';

  useEffect(() => {
    setActiveChapIdx(0);
    setChapAnswers({});
    setExpandedArt(0);
    if (activeChalId) {
      try {
        const s = localStorage.getItem(`eph_chaps_${activeChalId}`);
        setSolvedChaps(s ? JSON.parse(s) : {});
      } catch { setSolvedChaps({}); }
    } else { setSolvedChaps({}); }
  }, [activeChalId]);

  const totalPts = Object.values(gctf.solved).reduce((a: any, s: any) => a + (s.pts_earned || 0), 0) as number;
  const solvedCount = Object.values(gctf.solved).filter((s: any) => s.solved).length;
  const pct = challenges.length > 0 ? Math.round((solvedCount / challenges.length) * 100) : 0;
  const cats = ['ALL', ...Array.from(new Set(challenges.map((c: any) => c.category)))];

  const openChallenge = (id: string) => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(id)}`);
  };
  const closeChallenge = () => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf`);
  };

  // ── BOARD ──────────────────────────────────────────────────────────────────
  if (gctf.phase === 'board') {
    if (dataStatus === 'loading') return (
      <div className="ctf-wrap">
        <div className="ctf-boot">
          <span className="ctf-boot-dot" />SYNCHRONIZING CHALLENGE MATRIX<span className="ctf-boot-dot" />
        </div>
      </div>
    );
    if (dataStatus === 'error') return (
      <div className="ctf-wrap">
        <div className="ctf-boot ctf-boot--err">BACKEND ERROR // {apiError}</div>
      </div>
    );

    const filtered = filterCat === 'ALL' ? challenges : challenges.filter((c: any) => c.category === filterCat);

    return (
      <div className="ctf-wrap">
        {/* Header */}
        <div className="ctf-board-hdr">
          <div className="ctf-board-hdr-left">
            <div className="ctf-board-eyebrow">// CTF_ARENA · INCIDENT_RESPONSE</div>
            <h2 className="ctf-board-title">
              <GlitchText text="CHALLENGE LAB" triggerOnHover color="var(--red)" />
            </h2>
            <p className="ctf-board-sub">Extract the flag from forensic evidence alone.</p>
          </div>
          <div className="ctf-board-stats">
            <div className="ctf-stat-block">
              <span className="ctf-stat-val" style={{ color: 'var(--red)' }}>{solvedCount}/{challenges.length}</span>
              <span className="ctf-stat-lbl">SOLVED</span>
            </div>
            <div className="ctf-stat-sep" />
            <div className="ctf-stat-block">
              <span className="ctf-stat-val" style={{ color: 'var(--lime)' }}>{totalPts}</span>
              <span className="ctf-stat-lbl">XP EARNED</span>
            </div>
            <div className="ctf-stat-sep" />
            <div className="ctf-stat-block">
              <span className="ctf-stat-val" style={{ color: 'var(--crt)' }}>{pct}%</span>
              <span className="ctf-stat-lbl">COMPLETE</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="ctf-progress-rail">
          <div className="ctf-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Category filter */}
        <div className="ctf-cat-strip">
          {cats.map(cat => {
            const m = CAT_META[cat];
            const active = filterCat === cat;
            return (
              <button key={cat}
                className={`ctf-cat-btn ${active ? 'on' : ''}`}
                onClick={() => { playSound.click(); setFilterCat(cat); }}
                style={active ? { borderColor: m?.color || 'var(--red)', color: m?.color || 'var(--red)' } : {}}>
                {m && <span className="ctf-cat-icon">{m.icon}</span>}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Challenge grid */}
        <div className="ctf-grid">
          {filtered.map((ch: any) => {
            const sv = gctf.solved[ch.id];
            const isOk = !!(sv?.solved);
            const att = gctf.chalAttempts[ch.id];
            const isFail = !!(sv?.failed || (!sv?.solved && att <= 0));
            const meta = CAT_META[ch.category] || { color: 'var(--paper)', icon: '□' };
            const stats = chalStats[ch.id];
            const isFirstBlood = stats?.firstBlood === currentUserId && isOk;
            const borderCol = isOk ? 'var(--crt)' : isFail ? 'var(--red)' : 'rgba(255,255,255,.06)';

            return (
              <div key={ch.id}
                className={`ctf-card ${isOk ? 'ctf-card--ok' : isFail ? 'ctf-card--fail' : ''}`}
                style={{ borderColor: borderCol, '--ch-col': meta.color } as any}
                onClick={() => openChallenge(ch.id)}>

                {/* Top accent line */}
                <div className="ctf-card-accent" style={{ background: meta.color }} />

                {/* Header row */}
                <div className="ctf-card-top">
                  <span className="ctf-card-cat" style={{ color: meta.color }}>{meta.icon} {ch.category}</span>
                  <span className="ctf-card-pts" style={{ color: isOk ? 'var(--crt)' : isFail ? 'var(--red)' : meta.color }}>
                    {isOk ? `+${sv.pts_earned} ✓` : isFail ? '✗ LOCKED' : `${ch.points} PTS`}
                  </span>
                </div>

                {/* Title */}
                <div className="ctf-card-title">
                  <GlitchText text={ch.title} triggerOnHover color={meta.color} />
                </div>
                <div className="ctf-card-id">#{ch.id}</div>

                {/* Footer */}
                <div className="ctf-card-foot">
                  <div className="ctf-diff-pips">
                    {[1,2,3].map(i => (
                      <div key={i} className="ctf-diff-pip"
                        style={{ background: i <= ch.difficulty ? meta.color : 'rgba(255,255,255,.08)' }} />
                    ))}
                    <span className="ctf-diff-lbl" style={{ color: meta.color }}>
                      {['', 'EASY', 'MED', 'HARD'][ch.difficulty] || ''}
                    </span>
                  </div>
                  <div className="ctf-card-badges">
                    {isFirstBlood && <span className="ctf-fb">🩸 1ST</span>}
                    {stats?.solveCount ? <span className="ctf-solves">👤 {stats.solveCount}</span> : null}
                    {isOk && <span className="ctf-owned">PWNED</span>}
                    {isFail && <span className="ctf-locked-lbl">LOCKED</span>}
                    {!isOk && !isFail && <span className="ctf-enter" style={{ color: meta.color }}>INVESTIGATE →</span>}
                  </div>
                </div>

                {/* Hover scan line */}
                <div className="ctf-card-scan" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ─────────────────────────────────────────────────────────────
  const id = gctf.active;
  if (dataStatus === 'loading') return <div className="ctf-wrap"><div className="ctf-boot">LOADING INCIDENT DATA...</div></div>;
  if (dataStatus === 'error')   return <div className="ctf-wrap"><div className="ctf-boot ctf-boot--err">BACKEND ERROR // {apiError}</div></div>;

  const ch = challenges.find((c: any) => c.id === id);
  if (!ch) return <div className="ctf-wrap"><div className="ctf-boot ctf-boot--err">CHALLENGE NOT FOUND // {id}</div></div>;

  const sv = gctf.solved[id];
  const isOk = !!(sv?.solved);
  const att = gctf.chalAttempts[id] ?? ch.attemptsAllowed;
  const isFail = !!(sv?.failed || (!sv?.solved && att <= 0));
  const meta = CAT_META[ch.category] || { color: 'var(--red)', icon: '□' };
  const chapters = getChaptersForChallenge(ch.id, ch.flag);

  const isChapOk  = (chap: any, idx: number) => isOk ? true : idx === chapters.length - 1 ? isOk : !!solvedChaps[chap.id];
  const isChapOn  = (_: any, idx: number)     => isOk ? true : idx === 0 ? true : !!solvedChaps[chapters[idx - 1].id];

  const handleSubmit = async (chapIdx: number) => {
    const chap = chapters[chapIdx];
    const isLast = chapIdx === chapters.length - 1;
    const ans = (chapAnswers[chap.id] || '').trim();
    if (!ans) return;
    if (isLast) {
      await submitFlag(ch.id, ans, challenges, setUserXp);
    } else {
      const norm = (s: string) => s.trim().toLowerCase();
      if (norm(ans) === norm(chap.answer)) {
        playSound.success();
        const next = { ...solvedChaps, [chap.id]: true };
        setSolvedChaps(next);
        localStorage.setItem(`eph_chaps_${ch.id}`, JSON.stringify(next));
        showToast('✓ STAGE CLEARED — NEXT UNLOCKED');
        setTimeout(() => setActiveChapIdx(chapIdx + 1), 350);
      } else {
        playSound.error();
        setChapShake(true);
        setTimeout(() => setChapShake(false), 380);
        showToast('✗ WRONG ANSWER');
      }
    }
  };

  const curChap = chapters[activeChapIdx];
  const curOk   = isChapOk(curChap, activeChapIdx);
  const curOn   = isChapOn(curChap, activeChapIdx);
  const isLast  = activeChapIdx === chapters.length - 1;

  return (
    <div className={`ctf-wrap ctf-detail ${shake || chapShake ? 'ctf-shake' : ''}`}>

      {/* Top chrome — matches site's challenge header style */}
      <div className="ctf-chrome" style={{ borderBottomColor: `${meta.color}33` }}>
        <button className="ch-back ctf-back" onClick={closeChallenge}>← BOARD</button>
        <div className="ctf-chrome-path">
          <span style={{ color: meta.color }}>{meta.icon} {ch.category}</span>
          <span className="ctf-sep">/</span>
          <span>{ch.id}</span>
        </div>
        <div className="ctf-chrome-right">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ color: i < ch.difficulty ? meta.color : 'rgba(255,255,255,.12)', marginRight: 2 }}>★</span>
          ))}
          <span className="ctf-chrome-pts" style={{ color: meta.color }}>{ch.points} PTS</span>
          {isOk && <span className="ctf-chrome-owned">PWNED ✓</span>}
        </div>
      </div>

      {/* Title block — matches .mommy style */}
      <div className="ctf-incident-title-block" style={{ borderLeftColor: meta.color }}>
        <div className="ctf-incident-eyebrow" style={{ color: meta.color }}>// INCIDENT REPORT // STAGED INVESTIGATION</div>
        <h2 className="ctf-incident-name">
          <GlitchText text={ch.title} triggerOnHover color={meta.color} />
        </h2>
      </div>

      {/* 2-col body: task sidebar + workspace */}
      <div className="ctf-body">

        {/* LEFT — task list */}
        <div className="ctf-task-col">
          <div className="ctf-task-col-hdr">
            <span className="ctf-task-col-title">STAGES</span>
            <span className="ctf-task-col-count">
              {chapters.filter((_: any, i: number) => isChapOk(chapters[i], i)).length}/{chapters.length}
            </span>
          </div>

          {chapters.map((chap: any, idx: number) => {
            const ok  = isChapOk(chap, idx);
            const on  = isChapOn(chap, idx);
            const act = idx === activeChapIdx;
            return (
              <button key={chap.id}
                className={`ctf-task-btn ${act ? 'on' : ''} ${ok ? 'done' : !on ? 'locked' : ''}`}
                style={act ? { borderLeftColor: meta.color, color: 'var(--paper)' } : {}}
                onClick={() => {
                  if (on) { playSound.click(); setActiveChapIdx(idx); }
                  else { playSound.error(); showToast('COMPLETE PRECEDING STAGES FIRST'); }
                }}>
                <span className="ctf-task-num"
                  style={{ color: ok ? 'var(--crt)' : !on ? 'rgba(255,255,255,.15)' : meta.color }}>
                  {ok ? '✓' : !on ? '🔒' : String(idx + 1).padStart(2, '0')}
                </span>
                <span className="ctf-task-info">
                  <span className="ctf-task-name">{chap.title}</span>
                  <span className="ctf-task-status"
                    style={{ color: ok ? 'var(--crt)' : !on ? 'rgba(255,255,255,.15)' : 'var(--muted)' }}>
                    {ok ? 'CLEARED' : !on ? 'ENCRYPTED' : 'ACTIVE'}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Scenario brief */}
          <div className="ctf-scenario-block">
            <div className="bk">SCENARIO</div>
            <p className="ctf-scenario-text">{ch.scenario}</p>
          </div>
        </div>

        {/* CENTER — active workspace */}
        <div className="ctf-workspace">
          {!curOn ? (
            <div className="ctf-locked-screen">
              <div className="ctf-lock-icon">🔒</div>
              <div className="ctf-lock-title">STAGE ENCRYPTED</div>
              <div className="ctf-lock-body">Complete preceding stages to obtain the decryption token.</div>
            </div>
          ) : (
            <>
              <div className="ctf-ws-hdr" style={{ borderBottomColor: `${meta.color}30` }}>
                <span className="ctf-ws-phase" style={{ color: meta.color }}>
                  // PHASE {activeChapIdx + 1} · {curChap.title.toUpperCase()}
                </span>
              </div>

              <p className="bp ctf-desc">{curChap.description}</p>

              {/* Question block — matches .mommy style */}
              <div className="mommy" style={{ borderLeftColor: meta.color }}>
                <div className="mommy-k" style={{ color: meta.color }}>▶ INPUT TARGET QUERY</div>
                <div className="mommy-q" style={{ fontSize: '.82rem' }}>{curChap.question}</div>
              </div>

              {/* Answer zone */}
              {curOk ? (
                <div className="ctf-answer-ok">
                  <div className="ctf-answer-ok-top">
                    <span className="ctf-ok-check">✓</span>
                    <span className="ctf-ok-label">{isLast ? 'FLAG ACCEPTED' : 'STAGE CLEARED'}</span>
                  </div>
                  <div className="ctf-flag-reveal" style={{ color: isLast ? 'var(--crt)' : meta.color }}>
                    {isLast ? `EPHEMERAL{${ch.flag}}` : curChap.answer}
                  </div>
                  {isLast && sv?.pts_earned && (
                    <div className="ctf-xp-earned">+{sv.pts_earned} XP EARNED</div>
                  )}
                </div>
              ) : isFail && isLast ? (
                <div className="ctf-answer-fail">
                  <div className="ctf-fail-msg">✗ OUT OF ATTEMPTS — CASE SEALED</div>
                  <div className="ctf-flag-reveal" style={{ opacity: .4 }}>EPHEMERAL{`{${ch.flag}}`}</div>
                </div>
              ) : (
                <div className="ctf-flag-zone" style={{ borderColor: `${meta.color}44` }}>
                  <div className="ctf-flag-zone-lbl" style={{ color: meta.color }}>
                    {isLast ? '// DEPLOY FINAL FLAG' : '// SUBMIT STAGE ANSWER'}
                  </div>
                  <div className="ctf-flag-row">
                    <span className="ctf-flag-pfx">{isLast ? 'EPHEMERAL{' : 'ANSWER{'}</span>
                    <input className="ctf-flag-inp"
                      type="text"
                      placeholder={curChap.placeholder || (isLast ? 'flag…' : 'answer…')}
                      value={chapAnswers[curChap.id] || ''}
                      onChange={e => setChapAnswers({ ...chapAnswers, [curChap.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit(activeChapIdx)}
                      autoComplete="off" spellCheck={false}
                      style={{ caretColor: meta.color }} />
                    <span className="ctf-flag-pfx">{'}'}</span>
                    <button className="btn-r ctf-submit-btn"
                      style={{ background: meta.color === 'var(--red)' || meta.color === '#ff2a38' ? 'var(--red)' : meta.color,
                               color: meta.color === 'var(--lime)' || meta.color === '#ccff00' ? '#000' : '#fff' }}
                      onClick={() => handleSubmit(activeChapIdx)}>
                      SUBMIT
                    </button>
                  </div>
                  {isLast && (
                    <div className="ctf-att-row">
                      <div className="ctf-att-pips">
                        {Array.from({ length: ch.attemptsAllowed }).map((_: any, i: number) => (
                          <div key={i} className="ctf-att-pip"
                            style={{ background: i < att ? meta.color : 'rgba(255,255,255,.08)' }} />
                        ))}
                      </div>
                      <span className="ctf-att-lbl">{att} ATTEMPT{att !== 1 ? 'S' : ''} REMAINING</span>
                    </div>
                  )}
                </div>
              )}

              {/* Hint */}
              {!curOk && !isFail && (
                <div className="ctf-hint-wrap">
                  <button className="ctf-hint-btn" onClick={() => toggleCTFHint(ch.id)}>
                    ⚡ REQUEST FIELD INTEL {gctf.hintOn[ch.id] ? '▲' : '▼'}
                  </button>
                  {gctf.hintOn[ch.id] && (
                    <div className="ctf-hint-body">
                      <span className="ctf-hint-tag">// FIELD DIRECTIVE:</span> {curChap.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Post-mortem */}
              {(isOk || isFail) && isLast && ch.explanation && (
                <div className="ctf-postmortem" style={{ borderTopColor: isOk ? 'var(--crt)' : 'var(--red)' }}>
                  <div className="bk" style={{ color: isOk ? 'var(--crt)' : 'var(--red)' }}>// CASE ANALYSIS</div>
                  <p className="bp" style={{ marginBottom: '.8rem' }}>{ch.explanation}</p>
                  {isOk && (
                    <button className="btn-o ctf-writeup-btn"
                      onClick={() => { playSound.click(); setWriteupChal({ id: ch.id, title: ch.title }); }}>
                      ✎ FILE OPERATOR WRITE-UP
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT — evidence artifacts */}
        <div className="ctf-evidence-col">
          <div className="ctf-evidence-hdr">
            <span style={{ color: meta.color }}>⊞</span> EVIDENCE
            <span className="ctf-evidence-count">{ch.artifacts.length} FILE{ch.artifacts.length !== 1 ? 'S' : ''}</span>
          </div>
          {ch.artifacts.map((a: any, i: number) => {
            const typeColor: Record<string, string> = { table: '#80cbc4', config: 'var(--lime)', log: '#4fc3f7', code: '#ce93d8', output: 'var(--crt)' };
            const tc = typeColor[a.type] || meta.color;
            const open = expandedArt === i;
            return (
              <div key={i} className="ctf-artifact" style={{ borderLeftColor: open ? tc : 'rgba(255,255,255,.04)' }}>
                <button className="ctf-artifact-hdr" onClick={() => setExpandedArt(open ? null : i)}>
                  <span className="ctf-artifact-type" style={{ color: tc }}>{a.type.toUpperCase()}</span>
                  <span className="ctf-artifact-name">{a.label}</span>
                  <span className="ctf-artifact-arr">{open ? '▲' : '▼'}</span>
                </button>
                {open && <pre className="ctf-artifact-body">{a.content}</pre>}
              </div>
            );
          })}

          <div className="ctf-objective" style={{ borderColor: `${meta.color}33` }}>
            <div className="bk" style={{ color: meta.color }}>// OBJECTIVE</div>
            <p className="ctf-objective-text">{ch.task}</p>
          </div>
        </div>
      </div>

      {writeupChal && (
        <WriteupModal challengeId={writeupChal.id} challengeTitle={writeupChal.title} onClose={() => setWriteupChal(null)} />
      )}
    </div>
  );
};
