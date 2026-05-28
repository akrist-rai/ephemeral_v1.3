import React, { useState } from 'react';

interface CTFComponentProps {
  gctf: any;
  setGctf: any;
  setUserXp: any;
  showToast: (msg: string) => void;
  challenges: any[];
  navigate: (path: string) => void;
  dataStatus: string;
  apiError: string;
  submitFlag: any;
  toggleCTFHint: any;
  shake: boolean;
  flagInputRef: any;
  episodeBasePath: string;
}

export const CTFComponent: React.FC<CTFComponentProps> = ({ 
  gctf, showToast, challenges, navigate, dataStatus, apiError, submitFlag, toggleCTFHint, shake, flagInputRef, setUserXp, episodeBasePath
}) => {
  const catColors: any = { GRADIENT: '#4fc3f7', ARCHITECTURE: '#f9a825', INFERENCE: '#e8000d', DATA: '#00ff41' };
  const tierNames: any = { 1: 'ENTRY — 100 pts each', 2: 'CORE — 200 pts each', 3: 'RUHENHEIM — 400 pts each' };

  const [flagInput, setFlagInput] = useState('');

  const totalPts = Object.values(gctf.solved).reduce((a: any, s: any) => a + (s.pts_earned || 0), 0) as number;
  const solvedCount = Object.keys(gctf.solved).filter(id => !gctf.solved[id].failed).length;

  const openChallenge = (id: string) => {
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(id)}`);
    setFlagInput('');
    setTimeout(() => { if (flagInputRef.current) flagInputRef.current.focus(); }, 80);
  };

  const closeChallenge = () => {
    navigate(`${episodeBasePath}/ctf`);
  };

  if (gctf.phase === 'board') {
    if (dataStatus === 'loading') return <div className="ctfb"><div className="empty-state">SYNCING CHALLENGE GRID...</div></div>;
    if (dataStatus === 'error') return <div className="ctfb"><div className="empty-state">BACKEND ERROR // {apiError}</div></div>;

    return (
      <div className="ctfb">
        <div className="ctfb-head">
          <div>
            <div className="ctfb-title">ML INCIDENT RESPONSE</div>
            <div className="ctfb-sub">Investigate broken systems. Derive the flag from evidence. No guessing.</div>
          </div>
          <div className="ctfb-score">
            <div className="ctfb-pts">{totalPts}</div>
            <div className="ctfb-pts-lbl">POINTS</div>
            <div className="ctfb-solved">{solvedCount} / {challenges.filter(c => !gctf.solved[c.id] || !gctf.solved[c.id].failed).length} SOLVED</div>
          </div>
        </div>
        <div className="ctfb-legend">
          {Object.keys(catColors).map((cat) => (
            <span key={cat} className="ctfb-cat-pill" style={{ borderColor: catColors[cat], color: catColors[cat] }}>
              <span style={{ background: catColors[cat], width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', marginRight: '.2rem', verticalAlign: 'middle' }}></span>
              {cat}
            </span>
          ))}
        </div>
        {[1, 2, 3].map(t => {
          const tChallenges = challenges.filter(c => c.tier === t);
          return (
            <div className="ctfb-tier" key={t}>
              <div className="ctfb-tier-label">TIER {t} — {tierNames[t]}</div>
              <div className="ctfb-grid">
                {tChallenges.map(ch => {
                  const solved = gctf.solved[ch.id];
                  const failed = solved && solved.failed;
                  const ok = solved && !failed;
                  const col = catColors[ch.category] || '#fff';
                  const att = gctf.chalAttempts[ch.id];
                  const tried = att < ch.attemptsAllowed && !solved;

                  return (
                    <div key={ch.id} className={`ctfb-card ${ok ? 'ctfb-solved' : failed ? 'ctfb-failed' : tried ? 'ctfb-tried' : ''}`} onClick={() => openChallenge(ch.id)} style={{ '--cat-color': col } as any}>
                      <div className="ctfb-card-top">
                        <span className="ctfb-cat" style={{ color: col }}>{ch.category}</span>
                        {ok ? <span className="ctfb-check">✓ {solved.pts_earned}pts</span> : failed ? <span className="ctfb-fail">✗</span> : <span className="ctfb-pts-badge">{ch.points}</span>}
                      </div>
                      <div className="ctfb-card-title">{ch.title}</div>
                      <div className="ctfb-card-id">{ch.id}</div>
                      <div className="ctfb-card-diff">{'★'.repeat(ch.difficulty)}{'☆'.repeat(3-ch.difficulty)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  // Challenge View
  const id = gctf.active;
  if (dataStatus === 'loading') return <div className="ctf-challenge-panel"><div className="empty-state">SYNCING CHALLENGE...</div></div>;
  if (dataStatus === 'error') return <div className="ctf-challenge-panel"><div className="empty-state">BACKEND ERROR // {apiError}</div></div>;

  const ch = challenges.find(c => c.id === id);
  if (!ch) return <div className="ctf-challenge-panel"><div className="empty-state">CHALLENGE NOT FOUND // {id}</div></div>;
  const solved = gctf.solved[id];
  const failed = solved && solved.failed;
  const ok = solved && !failed;
  const att = gctf.chalAttempts[id];
  const col = catColors[ch.category] || '#fff';

  return (
    <div className={`ctf-challenge-panel ${shake ? 'shake' : ''}`}>
      <div className="ctf-ch-head">
        <button className="ctf-back-btn" onClick={closeChallenge}>← BOARD</button>
        <span className="ctf-ch-cat" style={{ color: col }}>{ch.category}</span>
        <span className="ctf-ch-id">{ch.id}</span>
        <span className="ctf-ch-pts" style={{ color: col }}>{ch.points} PTS</span>
        <span className="ctf-ch-diff">{'★'.repeat(ch.difficulty)}</span>
      </div>
      <div className="ctf-ch-title">{ch.title}</div>
      <div className="ctf-ch-layout">
        <div className="ctf-ch-left">
          <div className="ctf-section-label">// INCIDENT</div>
          <div className="ctf-scenario">{ch.scenario}</div>
          <div className="ctf-section-label" style={{ marginTop: '.6rem' }}>// TASK</div>
          <div className="ctf-task">{ch.task}</div>

          {ok ? (
            <div className="ctf-flag-solved">
              <span style={{ color: 'var(--crt)' }}>EPHEMERAL{'{'}{ch.flag}{'}'}</span>
              &nbsp;&nbsp;<span style={{ color: 'var(--crt)', opacity: .6 }}>ACCEPTED ✓ +{solved.pts_earned} pts</span>
            </div>
          ) : failed ? (
            <div className="ctf-flag-solved" style={{ borderColor: 'rgba(232,0,13,.3)', background: 'rgba(232,0,13,.03)' }}>
              <span style={{ color: 'var(--red)', opacity: .7 }}>OUT OF ATTEMPTS</span>
              &nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,.25)' }}>FLAG WAS: EPHEMERAL{'{'}{ch.flag}{'}'}</span>
            </div>
          ) : (
            <div className="flag-zone">
              <div className="flag-label">// SUBMIT FLAG</div>
              <div className="flag-row">
                <span className="flag-pre">EPHEMERAL{'{'}</span>
                <input ref={flagInputRef} className="flag-inp" id="ctf-flag-inp" type="text" placeholder="derive from evidence above" autoComplete="off" spellCheck="false" value={flagInput} onChange={(e) => setFlagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitFlag(id, flagInput, challenges, setUserXp)} />
                <span className="flag-suf">{'}'}</span>
                <button className="flag-sub" onClick={() => submitFlag(id, flagInput, challenges, setUserXp)}>SUBMIT</button>
              </div>
              <div className="attempts-row" id="ctf-att-row">
                {[0, 1, 2].map((j) => (
                  <span key={j} className={`att-dot ${j < att ? 'live' : 'dead'}`}></span>
                ))}
                <span className="att-label">{att} ATTEMPT{att !== 1 ? 'S' : ''} REMAINING</span>
              </div>
            </div>
          )}

          <div className="hint-section" style={{ marginTop: '.6rem' }}>
            <button className="hint-toggle" id="ctf-hint-btn" onClick={() => toggleCTFHint(id)}>⚡ HINT {gctf.hintOn[id] ? '▲' : '▼'}</button>
            <div className={`hint-body ${gctf.hintOn[id] ? 'on' : ''}`} id="ctf-hint-body">{ch.hint}</div>
          </div>

          {(ok || failed) ? (
            <div className="expl on" style={{ marginTop: '.6rem' }}>
              <strong style={{ color: 'var(--crt)', fontFamily: 'var(--mono)', fontSize: '.52rem', letterSpacing: '.1em' }}>// EXPLANATION — </strong>{ch.explanation}
            </div>
          ) : null}
        </div>

        <div className="ctf-ch-right">
          <div className="ctf-section-label">// EVIDENCE</div>
          {ch.artifacts.map((a: any, i: number) => {
            const icon: any = { table: '⊞', code: '►', config: '≡', log: '○', output: '◈' }[a.type] || '□';
            return (
              <div className="ctf-artifact" key={i}>
                <div className="ctf-art-label">{icon} {a.label}</div>
                <pre className="ctf-art-body">{a.content}</pre>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};
