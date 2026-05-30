import React, { useState, useEffect } from 'react';
import { WriteupModal } from '../Common/WriteupModal';
import { playSound } from '../../lib/sound';
import { GlitchText } from '../Effects/GlitchText';
import { getChaptersForChallenge } from '../../data/ctfChapters';
import { CodexPanel } from './CodexPanel';
import type { Challenge, GctfState, ChallengeStats, SolveRecord } from '../../types';

interface CTFComponentProps {
  gctf: GctfState;
  setUserXp: React.Dispatch<React.SetStateAction<number>>;
  showToast: (msg: string) => void;
  challenges: Challenge[];
  navigate: (path: string) => void;
  dataStatus: 'loading' | 'ready' | 'error';
  apiError: string;
  submitFlag: (id: string, flag: string, challenges: Challenge[], setUserXp: React.Dispatch<React.SetStateAction<number>>) => Promise<void>;
  toggleCTFHint: (id: string) => void;
  shake: boolean;
  flagInputRef: React.RefObject<HTMLInputElement>;
  episodeBasePath: string;
  chalStats?: Record<string, ChallengeStats>;
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

// ── CUSTOM OPERATOR WORKSPACE DATA ───────────────────────────────────────────
const SANDBOX_TEMPLATES: Record<string, { lang: 'python' | 'javascript' | 'sql'; code: string; runLogic: (code: string) => { success: boolean; logs: string[] } }> = {
  'ARRAY_BASICS_001': {
    lang: 'python',
    code: `# Camera manifest array query\ncameras = ["Main Entrance", "Lobby", "Breakroom", "Server Room", "Loading Dock"]\n\n# Target is "Loading Dock". Find its correct index:\nindex = 4\nprint(f"Target Camera: {cameras[index]} (Query Index: {index})")`,
    runLogic: (code) => {
      const clean = code.replace(/\s+/g, '');
      if (clean.includes('cameras[4]') || clean.includes('index=4') || clean.includes('index=4;')) {
        return {
          success: true,
          logs: [
            '[INFO] Synchronizing Serpent Interpreter environment...',
            '[EVAL] cameras = ["Main Entrance", "Lobby", "Breakroom", "Server Room", "Loading Dock"]',
            '[EXEC] Fetching cameras[4]...',
            '[OUT] Target Camera: Loading Dock (Query Index: 4)',
            '>>> RUNTIME SUCCESS: Index 4 resolves to "Loading Dock". Direct match verified.'
          ]
        };
      }
      return {
        success: false,
        logs: [
          '[INFO] Synchronizing Serpent Interpreter...',
          '[FATAL] IndexError: list index out of range. Check array bounds: items exist from index 0 to 4.'
        ]
      };
    }
  },
  'WEB_SQLI_001': {
    lang: 'sql',
    code: `-- SQL injection bypass query template\nSELECT * FROM operators \nWHERE username = 'admin' OR '1'='1' \nAND passcode = 'INPUT_SECRET';`,
    runLogic: (code) => {
      const clean = code.replace(/\s+/g, '');
      if (clean.includes("'1'='1'") || clean.includes("'1'='1'") || clean.includes("admin'OR'1'='1'")) {
        return {
          success: true,
          logs: [
            '[DB_SYS] Booting SQL Relational Core...',
            '[EXEC] Evaluating query check: username = \'admin\' OR \'1\'=\'1\'',
            '[DB_SYS] WHERE evaluated to: TRUE (Logical OR bypass triggered)',
            '[OUT] Selected Rows: 1',
            '[OUT] op_id | username | security_clearance',
            '[OUT] 1     | admin    | Level-5 (Full Bypass Active)',
            '>>> LOGICAL SUCCESS: Database authentication bypassed successfully.'
          ]
        };
      }
      return {
        success: false,
        logs: [
          '[DB_SYS] SQL Query completed.',
          '[OUT] Selected Rows: 0 (Credentials did not match. Access Denied.)'
        ]
      };
    }
  },
  'PWN_STACK_001': {
    lang: 'python',
    code: `# File descriptor conversion helper\n# Equation: fd = atoi(argv[1]) - 0x1234\n# Target: We need fd = 0 (stdin)\n\nhex_subtraction = 0x1234\n\n# Convert 0x1234 to decimal:\nsolve_dec = hex_subtraction\nprint(f"Decimal output required: {solve_dec}")`,
    runLogic: (code) => {
      const clean = code.replace(/\s+/g, '');
      if (clean.includes('4660') || clean.includes('0x1234')) {
        return {
          success: true,
          logs: [
            '[INFO] Preprocessing GCC stack architecture symbols...',
            '[EXEC] Initializing fd = input_dec - 0x1234',
            '[EXEC] Computing 4660 - 4660...',
            '[OUT] File Descriptor fd is set to: 0 (stdin)',
            '>>> COMPILE SUCCESS: fd = 0 opens standard input. Key bypass validated.'
          ]
        };
      }
      return {
        success: false,
        logs: [
          '[INFO] Compiling GCC binaries...',
          '[FATAL] fd bound to secondary descriptor != 0. Key bypass failed.'
        ]
      };
    }
  },
  'REV_XOR_001': {
    lang: 'python',
    code: `# crackme.exe XOR Key calculator\ntarget_signature = [0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14]\nxor_key = 0x5A\n\n# Calculate plaintext: signature ^ key\nlicense_key = "".join(chr(b ^ xor_key) for b in target_signature)\nprint(f"License Key: {license_key}")`,
    runLogic: (code) => {
      const clean = code.replace(/\s+/g, '');
      if (clean.includes('0x5A') && (clean.includes('^') || clean.includes('xor'))) {
        return {
          success: true,
          logs: [
            '[INFO] Loading byte-wise XOR decryption protocols...',
            '[EXEC] Resolving byte arrays: target_signature ^ xor_key',
            '[OUT] Byte 0: 0x11 ^ 0x5A = 0x4B (\'K\')',
            '[OUT] Byte 1: 0x1F ^ 0x5A = 0x45 (\'E\')',
            '[OUT] Byte 2: 0x03 ^ 0x5A = 0x59 (\'Y\')',
            '[OUT] Byte 3: 0x0A ^ 0x5A = 0x50 (\'P\')',
            '[OUT] Byte 4: 0x0D ^ 0x5A = 0x57 (\'W\')',
            '[OUT] Byte 5: 0x14 ^ 0x5A = 0x4E (\'N\')',
            '[OUT] Calculated License Key: KEYPWN',
            '>>> COMPUTE SUCCESS: License key calculated matching target signature.'
          ]
        };
      }
      return {
        success: false,
        logs: [
          '[INFO] Compiling reversing module...',
          '[FATAL] Compilation error: Key mismatch or invalid bitwise operators.'
        ]
      };
    }
  }
};

export const CTFComponent: React.FC<CTFComponentProps> = ({
  gctf, showToast, challenges, navigate, dataStatus, apiError,
  submitFlag, toggleCTFHint, shake, flagInputRef, setUserXp, episodeBasePath,
  chalStats = {}, currentUserId = '',
// eslint-disable-next-line @typescript-eslint/no-unused-vars
}) => {
  const [writeupChal, setWriteupChal] = useState<{ id: string; title: string } | null>(null);
  const [filterCat, setFilterCat] = useState('ALL');
  const [activeChapIdx, setActiveChapIdx] = useState(0);
  const [chapAnswers, setChapAnswers] = useState<Record<string, string>>({});
  const [solvedChaps, setSolvedChaps] = useState<Record<string, boolean>>({});
  const [chapShake, setChapShake] = useState(false);
  const [expandedArt, setExpandedArt] = useState<number | null>(0);

  // ── WORKSPACE PLAYGROUND / SANDBOX STATE ──
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [sandboxLang, setSandboxLang] = useState<'python' | 'javascript' | 'sql'>('javascript');
  const [sandboxCode, setSandboxCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['// Workspace Sandbox ready. Preload template or write custom code.']);
  const [sandboxRunning, setSandboxRunning] = useState(false);

  const activeChalId = gctf.active || '';

  // Synchronize challenge specific code sandbox templates
  useEffect(() => {
    setActiveChapIdx(0);
    setChapAnswers({});
    setExpandedArt(0);
    setSandboxOpen(false);
    setConsoleLogs(['// Workspace Sandbox ready. Preload template or write custom code.']);
    
    if (activeChalId) {
      try {
        const s = localStorage.getItem(`eph_chaps_${activeChalId}`);
        setSolvedChaps(s ? JSON.parse(s) : {});
      } catch { setSolvedChaps({}); }

      const t = SANDBOX_TEMPLATES[activeChalId];
      if (t) {
        setSandboxCode(t.code);
        setSandboxLang(t.lang);
      } else {
        setSandboxCode(`// Operational scratchpad. Write any JS logic to solve the challenge:\nfunction solve() {\n  let calculation = 53 * 61; // e.g. RSA helper\n  return "Telemetry result: " + calculation;\n}\nconsole.log(solve());`);
        setSandboxLang('javascript');
      }
    } else {
      setSolvedChaps({});
    }
  }, [activeChalId]);

  const totalPts = Object.values(gctf.solved).reduce((sum: number, s: SolveRecord) => sum + (s.pts_earned || 0), 0);
  const solvedCount = Object.values(gctf.solved).filter((s: SolveRecord) => s.solved).length;
  const pct = challenges.length > 0 ? Math.round((solvedCount / challenges.length) * 100) : 0;
  const cats = ['ALL', ...Array.from(new Set(challenges.map((c: Challenge) => c.category)))];

  const openChallenge = (id: string) => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(id)}`);
  };
  const closeChallenge = () => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf`);
  };

  // Preload code template helper
  const handlePreloadTemplate = () => {
    playSound.success();
    const t = SANDBOX_TEMPLATES[activeChalId];
    if (t) {
      setSandboxCode(t.code);
      setSandboxLang(t.lang);
      setConsoleLogs([`[SYS] Loaded official operational code template for challenge #${activeChalId}.`]);
    } else {
      setSandboxCode(`// Custom JavaScript Playground\nlet hex_target = [0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14];\nlet key = 0x5A;\nlet result = hex_target.map(byte => String.fromCharCode(byte ^ key)).join('');\nconsole.log("Calculated output:", result);`);
      setSandboxLang('javascript');
      setConsoleLogs(['[SYS] Preloaded custom JavaScript decoding algorithm.']);
    }
  };

  // Copy from Codex snippet straight into compiler
  const handleInjectCodexSnippet = (snippet: string) => {
    setSandboxCode(prev => prev + '\n' + snippet);
    setConsoleLogs(prev => [...prev, `[SYS] Injected Codex directive into buffer: "${snippet}"`]);
    showToast('DIRECTIVE INJECTED INTO WORKSPACE');
  };

  // Safe JavaScript Execution Engine
  const runJsSandbox = (code: string): { success: boolean; logs: string[] } => {
    const logs: string[] = ['[SYS] Initializing JS V8 local worker scope...'];
    const mockConsole = {
      log: (...args: any[]) => {
        logs.push('[OUT] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      }
    };
    try {
      const runnable = new Function('console', code);
      runnable(mockConsole);
      logs.push('>>> SCRIPT EXECUTION FINISHED SUCCESSFULLY.');
      return { success: true, logs };
    } catch (err: any) {
      logs.push(`[FATAL] ReferenceError / SyntaxError: ${err.message}`);
      return { success: false, logs };
    }
  };

  // Execute workspace sandbox compiler
  const handleExecuteSandbox = () => {
    playSound.click();
    setSandboxRunning(true);
    setConsoleLogs(prev => [...prev, '[SYS] Compiling workspace source buffer...', '[SYS] Loading virtual machine thread...']);

    setTimeout(() => {
      let result;
      // If challenge has preloaded logical simulations, run them
      if (sandboxLang !== 'javascript' && SANDBOX_TEMPLATES[activeChalId] && sandboxLang === SANDBOX_TEMPLATES[activeChalId].lang) {
        result = SANDBOX_TEMPLATES[activeChalId].runLogic(sandboxCode);
      } else {
        // Run as functional Javascript sandbox in user browser
        result = runJsSandbox(sandboxCode);
      }

      setConsoleLogs(prev => [...prev, ...result.logs]);
      setSandboxRunning(false);
      if (result.success) {
        playSound.success();
      } else {
        playSound.error();
      }
    }, 850);
  };

  // Submissions — must be defined after ch is resolved in the detail view,
  // so we hoist it here but guard against the board phase (ch will be null there).
  const handleSubmit = async (ch: Challenge, chapters: ReturnType<typeof getChaptersForChallenge>, chapIdx: number) => {
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
          {filtered.map((ch) => {
            const sv = gctf.solved[ch.id];
            const isOk = !!sv?.solved;
            const att = gctf.chalAttempts[ch.id];
            const isFail = !!(sv?.failed || (!sv?.solved && att <= 0));
            const meta = CAT_META[ch.category] || { color: 'var(--paper)', icon: '□' };
            const stats = chalStats[ch.id];
            const isFirstBlood = stats?.firstBlood === currentUserId && isOk;
            const borderCol = isOk ? 'var(--crt)' : isFail ? 'var(--red)' : 'rgba(255,255,255,.06)';
            const diffLabel = (['EASY', 'MED', 'HARD', 'ELITE', 'LEGEND'] as const)[ch.difficulty - 1] ?? '';

            return (
              <div
                key={ch.id}
                className={`ctf-card ${isOk ? 'ctf-card--ok' : isFail ? 'ctf-card--fail' : ''}`}
                style={{ borderColor: borderCol, '--ch-col': meta.color } as React.CSSProperties}
                onClick={() => openChallenge(ch.id)}
              >
                <div className="ctf-card-accent" style={{ background: meta.color }} />

                <div className="ctf-card-top">
                  <span className="ctf-card-cat" style={{ color: meta.color }}>{meta.icon} {ch.category}</span>
                  <span className="ctf-card-pts" style={{ color: isOk ? 'var(--crt)' : isFail ? 'var(--red)' : meta.color }}>
                    {isOk ? `+${sv!.pts_earned} ✓` : isFail ? '✗ LOCKED' : `${ch.points} PTS`}
                  </span>
                </div>

                <div className="ctf-card-title">
                  <GlitchText text={ch.title} triggerOnHover color={meta.color} />
                </div>
                <div className="ctf-card-id">#{ch.id}</div>

                <div className="ctf-card-foot">
                  <div className="ctf-diff-pips">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="ctf-diff-pip"
                        style={{ background: i <= ch.difficulty ? meta.color : 'rgba(255,255,255,.08)' }}
                      />
                    ))}
                    <span className="ctf-diff-lbl" style={{ color: meta.color }}>{diffLabel}</span>
                  </div>
                  <div className="ctf-card-badges">
                    {isFirstBlood && <span className="ctf-fb">🩸 1ST</span>}
                    {stats?.solveCount ? <span className="ctf-solves">👤 {stats.solveCount}</span> : null}
                    {isOk && <span className="ctf-owned">PWNED</span>}
                    {isFail && <span className="ctf-locked-lbl">LOCKED</span>}
                  </div>
                </div>
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

  const ch = challenges.find(c => c.id === id);
  if (!ch) return <div className="ctf-wrap"><div className="ctf-boot ctf-boot--err">CHALLENGE NOT FOUND // {id}</div></div>;

  const sv   = gctf.solved[id!];
  const isOk = !!sv?.solved;
  const att  = gctf.chalAttempts[id!] ?? ch.attemptsAllowed;
  const isFail = !!(sv?.failed || (!sv?.solved && att <= 0));
  const meta    = CAT_META[ch.category] || { color: 'var(--red)', icon: '□' };
  const chapters = getChaptersForChallenge(ch.id, ch.flag);

  const isChapOk = (_chap: unknown, idx: number) =>
    isOk ? true : idx === chapters.length - 1 ? isOk : !!solvedChaps[chapters[idx].id];
  const isChapOn = (_chap: unknown, idx: number) =>
    isOk ? true : idx === 0 ? true : !!solvedChaps[chapters[idx - 1].id];

  const curChap = chapters[activeChapIdx];
  const curOk   = isChapOk(curChap, activeChapIdx);
  const curOn   = isChapOn(curChap, activeChapIdx);
  const isLast  = activeChapIdx === chapters.length - 1;

  return (
    <div className={`ctf-wrap ctf-detail ${shake || chapShake ? 'ctf-shake' : ''}`}>

      {/* Top Chrome Path Navigation */}
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

      {/* ── HIGH FIDELITY INTEGRATED 2-COLUMN OPERATOR WORKSTATION ── */}
      <div className="ctf-dashboard" style={{ '--accent-col': meta.color } as React.CSSProperties}>
        
        {/* ── LEFT PANE: SYSTEM BRIEFING & OPERATIONS ── */}
        <div className="ctf-dash-left">
          
          {/* Incident Info Header */}
          <div className="ctf-dash-hdr-card" style={{ borderLeftColor: meta.color }}>
            <div className="ctf-dash-eyebrow" style={{ color: meta.color }}>// INCIDENT REPORT // SECURITY CLASSIFIED</div>
            <h2 className="ctf-dash-title">
              <GlitchText text={ch.title} triggerOnHover color={meta.color} />
            </h2>
            <div className="ctf-dash-meta">
              <span className="ctf-dash-badge" style={{ borderColor: `${meta.color}33`, color: meta.color }}>
                {ch.category}
              </span>
              <span className="ctf-dash-difficulty" style={{ color: meta.color }}>
                {['EASY', 'MEDIUM', 'HARD', 'ELITE', 'LEGEND'][ch.difficulty - 1] || 'CORE'}
              </span>
            </div>
          </div>

          {/* Scenario Description */}
          <div className="ctf-dash-section">
            <div className="ctf-section-label">SYSTEM SCENARIO BRIEFING</div>
            <div className="ctf-scenario-card">
              <p className="ctf-scenario-desc">{ch.scenario}</p>
            </div>
          </div>

          {/* Stages Progression Deck */}
          <div className="ctf-dash-section">
            <div className="ctf-section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>STAGE PROTOCOLS</span>
              <span className="ctf-stages-badge">
                {chapters.filter((_: any, i: number) => isChapOk(chapters[i], i)).length}/{chapters.length} CLEARED
              </span>
            </div>
            
            <div className="ctf-stages-list">
              {chapters.map((chap, idx) => {
                const ok  = isChapOk(chap, idx);
                const on  = isChapOn(chap, idx);
                const act = idx === activeChapIdx;
                return (
                  <button
                    key={chap.id}
                    className={`ctf-stage-node ${act ? 'active' : ''} ${ok ? 'cleared' : !on ? 'locked' : ''}`}
                    onClick={() => {
                      if (on) { playSound.click(); setActiveChapIdx(idx); }
                      else { playSound.error(); showToast('COMPLETE PRECEDING STAGES FIRST'); }
                    }}
                  >
                    <div className="ctf-stage-status-indicator">
                      {ok ? '✓' : !on ? '🔒' : String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="ctf-stage-details">
                      <div className="ctf-stage-name">{chap.title}</div>
                      <div className="ctf-stage-status-text">
                        {ok ? 'PROTOCOL CLEARED' : !on ? 'DECRYPT TOKEN REQUIRED' : 'ACTIVE UPLINK'}
                      </div>
                    </div>
                    {act && <div className="ctf-stage-active-pulse" style={{ background: meta.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intel & Codex Section */}
          <div className="ctf-dash-section">
            <div className="ctf-section-label">CODEX DIRECTIVES</div>
            <CodexPanel category={ch.category} onCopySnippet={handleInjectCodexSnippet} />
          </div>

        </div>

        {/* ── RIGHT PANE: THE COMPILER & EVIDENCE LAB ── */}
        <div className="ctf-dash-right">

          {/* 1. VIRTUAL FILE EXPLORER (TABBED EVIDENCE) */}
          <div className="ctf-workspace-card ctf-file-explorer">
            <div className="ctf-card-chrome">
              <span className="ctf-chrome-tag">// EVIDENCE ARCHIVES</span>
              <span className="ctf-chrome-metric">{ch.artifacts.length} DETECTED FILE{ch.artifacts.length !== 1 ? 'S' : ''}</span>
            </div>

            {/* File Explorer Tabs */}
            <div className="ctf-file-tabs">
              {ch.artifacts.map((art, idx) => {
                const isSelected = expandedArt === idx;
                const fileColors: Record<string, string> = {
                  table: '#80cbc4',
                  config: 'var(--lime)',
                  log: '#4fc3f7',
                  code: '#ce93d8',
                  output: 'var(--crt)',
                };
                const color = fileColors[art.type] || meta.color;
                return (
                  <button
                    key={idx}
                    className={`ctf-file-tab ${isSelected ? 'active' : ''}`}
                    style={isSelected ? { borderBottomColor: color } : {}}
                    onClick={() => { playSound.click(); setExpandedArt(idx); }}
                  >
                    <span className="ctf-tab-icon" style={{ color }}>
                      {art.type === 'code' ? '⚡' : art.type === 'log' ? '☰' : art.type === 'table' ? '田' : '⚙'}
                    </span>
                    <span className="ctf-tab-name">{art.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active File Viewport */}
            {expandedArt !== null && ch.artifacts[expandedArt] && (
              <div className="ctf-file-viewport">
                <div className="ctf-file-meta-bar">
                  <span className="ctf-file-path">sys/evidence/{ch.artifacts[expandedArt].label.toLowerCase()}</span>
                  <div className="ctf-file-actions">
                    <button
                      className="ctf-file-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(ch.artifacts[expandedArt].content);
                        showToast('COPIED TO CLIPBOARD');
                        playSound.success();
                      }}
                    >
                      📋 COPY
                    </button>
                    {(ch.artifacts[expandedArt].type === 'code' || ch.artifacts[expandedArt].type === 'config') && (
                      <button
                        className="ctf-file-btn ctf-file-btn--send"
                        onClick={() => {
                          handleInjectCodexSnippet(ch.artifacts[expandedArt].content);
                        }}
                      >
                        ⚡ SEND TO SCRATCHPAD
                      </button>
                    )}
                  </div>
                </div>
                <pre className="ctf-file-body">
                  <code>{ch.artifacts[expandedArt].content}</code>
                </pre>
              </div>
            )}
          </div>

          {/* 2. THE CURRENT CHALLENGE OBJECTIVE */}
          <div className="ctf-workspace-card ctf-objective-card" style={{ borderColor: `${meta.color}33` }}>
            <div className="ctf-card-chrome" style={{ borderBottomColor: `${meta.color}22` }}>
              <span className="ctf-chrome-tag" style={{ color: meta.color }}>▶ CURRENT TASK DIRECTIVE</span>
            </div>
            <div className="ctf-objective-body">
              <p className="ctf-objective-text">{ch.task}</p>
            </div>
          </div>

          {/* 3. COGNITIVE ACTIVE WORKSPACE & INSTRUCTIONS */}
          <div className="ctf-workspace-card ctf-stages-question-card" style={{ borderColor: `${meta.color}44` }}>
            <div className="ctf-card-chrome" style={{ borderBottomColor: `${meta.color}22` }}>
              <span className="ctf-chrome-tag" style={{ color: meta.color }}>▶ STAGE {activeChapIdx + 1} QUESTION</span>
            </div>
            <div className="ctf-question-body">
              <div className="ctf-stage-title-inline">{curChap.title}</div>
              <p className="ctf-stage-desc">{curChap.description}</p>
              
              <div className="ctf-question-prompt" style={{ borderLeftColor: meta.color }}>
                <span className="ctf-prompt-prefix" style={{ color: meta.color }}>QUERY //</span>
                <span className="ctf-prompt-text">{curChap.question}</span>
              </div>
            </div>
          </div>

          {/* 4. OPERATOR WORKSPACE (THE SANDBOX PLATFORM) */}
          {!curOk && !isFail && (
            <div className="ctf-workspace-card ctf-sandbox-workspace">
              <div className="ctf-card-chrome">
                <span className="ctf-chrome-tag">// OPERATOR WORKSPACE v1.3 [ONLINE]</span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className="ctf-status-ring pulse" />
                  <span style={{ fontSize: '0.45rem', opacity: 0.6 }}>READY</span>
                </div>
              </div>

              <div className="ctf-sandbox-controls">
                <div className="ctf-sandbox-left">
                  <span className="ctf-control-label">INTERPRET ENGINE:</span>
                  <select 
                    value={sandboxLang} 
                    onChange={(e) => setSandboxLang(e.target.value as any)}
                    className="ctf-control-select"
                  >
                    <option value="javascript">JavaScript (Safe Sandbox)</option>
                    <option value="python">Python (Logical Simulation)</option>
                    <option value="sql">SQL Query Solver</option>
                  </select>
                </div>
                <button 
                  onClick={handlePreloadTemplate}
                  className="ctf-sandbox-btn ctf-sandbox-btn--preload"
                >
                  📋 RESTORE CASE TEMPLATE
                </button>
              </div>

              {/* IDE Editor view */}
              <div className="ctf-ide-container">
                <div className="ctf-ide-lines">
                  {Array.from({ length: sandboxCode.split('\n').length || 4 }).map((_, i) => (
                    <div key={i} className="ctf-ide-line-num">{String(i + 1).padStart(2, '0')}</div>
                  ))}
                </div>
                <textarea
                  value={sandboxCode}
                  onChange={e => setSandboxCode(e.target.value)}
                  spellCheck={false}
                  className="ctf-ide-textarea"
                />
              </div>

              {/* Execute Buffer action */}
              <button
                onClick={handleExecuteSandbox}
                disabled={sandboxRunning}
                className="ctf-sandbox-run-btn"
                style={{
                  background: meta.color,
                  color: meta.color === 'var(--lime)' || meta.color === '#ccff00' ? '#000' : '#fff'
                }}
              >
                {sandboxRunning ? (
                  <span className="ctf-loading-dots">COMPILING OPERATIONS BUFFER...</span>
                ) : (
                  <span>⚡ EXECUTE OPERATIONS BUFFER</span>
                )}
              </button>

              {/* Live Terminal outputs */}
              <div className="ctf-terminal-box">
                <div className="ctf-terminal-hdr">// TERMINAL STREAMS:</div>
                <div className="ctf-terminal-logs">
                  {consoleLogs.map((log, i) => {
                    let color = '#00ff41';
                    if (log.startsWith('[FATAL]') || log.startsWith('[ERROR]')) color = 'var(--red)';
                    if (log.startsWith('[SYS]') || log.startsWith('//')) color = 'rgba(255,255,255,0.3)';
                    if (log.startsWith('[EVAL]')) color = '#4fc3f7';
                    if (log.startsWith('[OUT]')) color = '#fff';
                    return (
                      <div key={i} className="ctf-terminal-line" style={{ color }}>{log}</div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. THE UNIFIED DECRYPTION PROMPT (SUBMISSION TERMINAL) */}
          {curOk ? (
            <div className="ctf-workspace-card ctf-submit-card ctf-submit-card--ok" style={{ borderLeftColor: 'var(--crt)' }}>
              <div className="ctf-submit-ok-header">
                <span className="ctf-success-check">✓</span>
                <span className="ctf-success-label">{isLast ? 'CASE ENVELOPE DECRYPTED' : 'PROTOCOL CLEARED'}</span>
              </div>
              <div className="ctf-decrypted-value">
                {isLast ? `EPHEMERAL{${ch.flag}}` : curChap.answer}
              </div>
              {isLast && sv?.pts_earned && (
                <div className="ctf-pts-badge">+{sv.pts_earned} XP COMMITTED TO PROFILE</div>
              )}
            </div>
          ) : isFail && isLast ? (
            <div className="ctf-workspace-card ctf-submit-card ctf-submit-card--fail" style={{ borderLeftColor: 'var(--red)' }}>
              <div className="ctf-fail-label">✗ SECURE MAINFRAME SEALED</div>
              <div className="ctf-fail-desc">Maximum credentials violation. Secure payload is now locked.</div>
              <div className="ctf-decrypted-value" style={{ opacity: 0.3 }}>
                EPHEMERAL{`{${ch.flag}}`}
              </div>
            </div>
          ) : (
            <div className="ctf-workspace-card ctf-submit-card" style={{ borderColor: `${meta.color}55` }}>
              <div className="ctf-card-chrome" style={{ borderBottomColor: 'transparent', paddingBottom: 0 }}>
                <span className="ctf-chrome-tag" style={{ color: meta.color }}>
                  {isLast ? '// INJECT FINAL DECRYPTION FLAG' : '// SUBMIT PROTOCOL ANSWER'}
                </span>
              </div>

              <div className="ctf-submit-input-row">
                <span className="ctf-submit-prefix">{isLast ? 'EPHEMERAL{' : 'ANSWER{'}</span>
                <input
                  ref={flagInputRef}
                  type="text"
                  placeholder={curChap.placeholder || (isLast ? 'flag...' : 'answer...')}
                  value={chapAnswers[curChap.id] || ''}
                  onChange={e => setChapAnswers({ ...chapAnswers, [curChap.id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(ch, chapters, activeChapIdx)}
                  className="ctf-submit-input"
                  style={{ caretColor: meta.color }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="ctf-submit-prefix">{'}'}</span>
                <button
                  className="ctf-submit-action-btn"
                  style={{
                    background: meta.color,
                    color: meta.color === 'var(--lime)' || meta.color === '#ccff00' ? '#000' : '#fff'
                  }}
                  onClick={() => handleSubmit(ch, chapters, activeChapIdx)}
                >
                  DECRYPT
                </button>
              </div>

              {isLast && (
                <div className="ctf-attempts-indicator">
                  <div className="ctf-attempt-nodes">
                    {Array.from({ length: ch.attemptsAllowed }).map((_, i) => (
                      <div
                        key={i}
                        className={`ctf-attempt-node ${i < att ? 'active' : 'spent'}`}
                        style={i < att ? { background: meta.color } : {}}
                      />
                    ))}
                  </div>
                  <span className="ctf-attempts-text">{att} COMPROMISE ATTEMPTS REMAINING</span>
                </div>
              )}
            </div>
          )}

          {/* 6. HINTS & INTEL ACTION */}
          {!curOk && !isFail && (
            <div className="ctf-workspace-card ctf-intel-card">
              <button 
                onClick={() => toggleCTFHint(ch.id)}
                className="ctf-intel-trigger"
                style={{ color: 'var(--lime)', borderColor: 'rgba(204,255,0,0.2)' }}
              >
                ⚡ REQUEST TACTICAL DIRECTIVE INTEL {gctf.hintOn[ch.id] ? '▲' : '▼'}
              </button>
              {gctf.hintOn[ch.id] && (
                <div className="ctf-intel-body" style={{ borderLeftColor: 'var(--lime)', background: 'rgba(204,255,0,0.02)' }}>
                  <span style={{ color: 'var(--lime)', marginRight: '0.4rem', fontFamily: 'var(--mono)', fontSize: '0.45rem' }}>[INTEL DIRECTIVE]</span>
                  {curChap.hint}
                </div>
              )}
            </div>
          )}

          {/* 7. POST-MORTEM & SOLUTION WRITEUPS */}
          {(isOk || isFail) && isLast && ch.explanation && (
            <div className="ctf-workspace-card ctf-postmortem-card" style={{ borderTopColor: isOk ? 'var(--crt)' : 'var(--red)' }}>
              <div className="ctf-postmortem-title" style={{ color: isOk ? 'var(--crt)' : 'var(--red)' }}>
                // CASE DECLASSIFICATION ANALYSIS
              </div>
              <p className="ctf-postmortem-desc">{ch.explanation}</p>
              {isOk && (
                <button
                  className="ctf-writeup-trigger-btn"
                  onClick={() => { playSound.click(); setWriteupChal({ id: ch.id, title: ch.title }); }}
                >
                  ✎ FILE OPERATOR WRITE-UP AND RECTIFICATION REPORT
                </button>
              )}
            </div>
          )}

        </div>

      </div>
      {writeupChal && (
        <WriteupModal challengeId={writeupChal.id} challengeTitle={writeupChal.title} onClose={() => setWriteupChal(null)} />
      )}
    </div>
  );
};
