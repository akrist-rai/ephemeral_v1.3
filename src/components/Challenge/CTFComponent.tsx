import React, { useState, useEffect, useRef } from 'react';
import { WriteupModal } from '../Common/WriteupModal';
import { playSound } from '../../lib/sound';
import { GlitchText } from '../Effects/GlitchText';
import { getChaptersForChallenge } from '../../data/ctfChapters';
import { CodexPanel } from './CodexPanel';

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

  // Submissions
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

              {/* Codex Panel Drawer (Beginner Assistant) */}
              <CodexPanel category={ch.category} onCopySnippet={handleInjectCodexSnippet} />

              {/* Question block — matches .mommy style */}
              <div className="mommy" style={{ borderLeftColor: meta.color, marginTop: '1rem' }}>
                <div className="mommy-k" style={{ color: meta.color }}>▶ INPUT TARGET QUERY</div>
                <div className="mommy-q" style={{ fontSize: '.82rem' }}>{curChap.question}</div>
              </div>

              {/* Workspace sandbox activator */}
              {!curOk && !isFail && (
                <div 
                  className="sandbox-widget" 
                  style={{ 
                    marginTop: '1.2rem', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(0,4,8,0.4)',
                    padding: '0.8rem',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.58rem', fontFamily: 'var(--mono)', color: meta.color }}>
                      ⚡ OPERATOR WORKSPACE SCRATCHPAD {sandboxOpen ? '[ACTIVE]' : '[COLLAPSED]'}
                    </span>
                    <button 
                      onClick={() => { playSound.click(); setSandboxOpen(!sandboxOpen); }}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${meta.color}33`,
                        color: meta.color,
                        fontSize: '0.45rem',
                        fontFamily: 'var(--mono)',
                        padding: '0.15rem 0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      {sandboxOpen ? 'HIDE SCRATCHPAD' : 'EXPAND SCRATCHPAD'}
                    </button>
                  </div>

                  {sandboxOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {/* Sandbox configuration header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>ENV:</span>
                          <select 
                            value={sandboxLang} 
                            onChange={(e) => setSandboxLang(e.target.value as any)}
                            style={{
                              background: '#000',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'var(--paper)',
                              fontSize: '0.5rem',
                              fontFamily: 'var(--mono)',
                              padding: '0.1rem 0.3rem',
                              outline: 'none'
                            }}
                          >
                            <option value="javascript">JAVASCRIPT (Safe Sandbox)</option>
                            <option value="python">PYTHON (Mock Env)</option>
                            <option value="sql">SQL (Mock DB)</option>
                          </select>
                        </div>
                        <button 
                          onClick={handlePreloadTemplate}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--lime)',
                            fontSize: '0.5rem',
                            fontFamily: 'var(--mono)',
                            cursor: 'pointer',
                            padding: '0.1rem 0.4rem'
                          }}
                        >
                          📋 PRELOAD CASE TEMPLATE
                        </button>
                      </div>

                      {/* Code Area */}
                      <div style={{ display: 'flex', background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {/* Mock Line Numbers */}
                        <div 
                          style={{ 
                            padding: '0.5rem 0.3rem', 
                            color: 'rgba(255,255,255,0.15)', 
                            textAlign: 'right', 
                            background: 'rgba(255,255,255,0.01)',
                            borderRight: '1px solid rgba(255,255,255,0.04)',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.5rem',
                            lineHeight: '1.4',
                            userSelect: 'none'
                          }}
                        >
                          {Array.from({ length: sandboxCode.split('\n').length || 4 }).map((_, i) => (
                            <div key={i}>{String(i + 1).padStart(2, '0')}</div>
                          ))}
                        </div>
                        <textarea
                          value={sandboxCode}
                          onChange={e => setSandboxCode(e.target.value)}
                          spellCheck={false}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#e2e8f0',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.52rem',
                            padding: '0.5rem',
                            outline: 'none',
                            minHeight: '100px',
                            lineHeight: '1.4',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      {/* Sandbox Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={handleExecuteSandbox}
                          disabled={sandboxRunning}
                          style={{
                            flex: 1,
                            background: meta.color,
                            color: meta.color === 'var(--lime)' || meta.color === '#ccff00' ? '#000' : '#fff',
                            border: 'none',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.55rem',
                            fontWeight: 'bold',
                            padding: '0.4rem 0.8rem',
                            cursor: sandboxRunning ? 'not-allowed' : 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {sandboxRunning ? 'COMPILING BUFFER...' : '⚡ EXECUTE SOURCE BUFFER'}
                        </button>
                      </div>

                      {/* Sandbox Console */}
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.45rem', marginBottom: '0.2rem' }}>// TELEMETRY TERMINAL OUTPUT:</div>
                        <div 
                          style={{
                            background: '#000',
                            border: '1px solid rgba(0,255,65,0.15)',
                            padding: '0.5rem',
                            maxHeight: '100px',
                            overflowY: 'auto',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem'
                          }}
                        >
                          {consoleLogs.map((log, i) => {
                            let color = '#00ff41';
                            if (log.startsWith('[FATAL]') || log.startsWith('[ERROR]')) color = '#ff4466';
                            if (log.startsWith('[SYS]') || log.startsWith('//')) color = 'rgba(255,255,255,0.35)';
                            if (log.startsWith('[EVAL]')) color = '#4fc3f7';
                            if (log.startsWith('[OUT]')) color = '#fff';
                            return (
                              <div key={i} style={{ color, wordBreak: 'break-all' }}>{log}</div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Answer zone */}
              {curOk ? (
                <div className="ctf-answer-ok" style={{ marginTop: '1.2rem' }}>
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
                <div className="ctf-answer-fail" style={{ marginTop: '1.2rem' }}>
                  <div className="ctf-fail-msg">✗ OUT OF ATTEMPTS — CASE SEALED</div>
                  <div className="ctf-flag-reveal" style={{ opacity: .4 }}>EPHEMERAL{`{${ch.flag}}`}</div>
                </div>
              ) : (
                <div className="ctf-flag-zone" style={{ borderColor: `${meta.color}44`, marginTop: '1.2rem' }}>
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
                <div className="ctf-postmortem" style={{ borderTopColor: isOk ? 'var(--crt)' : 'var(--red)', marginTop: '1.2rem' }}>
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
