import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WriteupModal } from '../Common/WriteupModal';
import { playSound } from '../../lib/sound';
import { GlitchText } from '../Effects/GlitchText';
import { getChaptersForChallenge } from '../../data/ctfChapters';
import { getArcCover } from '../../lib/imageMapping';
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

const FILE_COLORS: Record<string, string> = {
  table: '#80cbc4', config: 'var(--lime)', log: '#4fc3f7', code: '#ce93d8', output: 'var(--crt)',
};
const FILE_ICONS: Record<string, string> = {
  table: '田', config: '⚙', log: '☰', code: '⚡', output: '▶',
};

function runJsSandbox(code: string): { success: boolean; logs: string[] } {
  const logs: string[] = ['[SYS] Initializing JS V8 local worker scope...'];
  const mockConsole = {
    log: (...args: any[]) => {
      logs.push('[OUT] ' + args.map((a: any) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    },
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
}

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

  const totalPts = useMemo(
    () => Object.values(gctf.solved).reduce((sum: number, s: SolveRecord) => sum + (s.pts_earned || 0), 0),
    [gctf.solved],
  );
  const solvedCount = useMemo(
    () => Object.values(gctf.solved).filter((s: SolveRecord) => s.solved).length,
    [gctf.solved],
  );
  const pct = useMemo(
    () => challenges.length > 0 ? Math.round((solvedCount / challenges.length) * 100) : 0,
    [solvedCount, challenges.length],
  );
  const cats = useMemo(
    () => ['ALL', ...Array.from(new Set(challenges.map((c: Challenge) => c.category)))],
    [challenges],
  );

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


  const openChallenge = useCallback((id: string) => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf/${encodeURIComponent(id)}`);
  }, [navigate, episodeBasePath]);

  const closeChallenge = useCallback(() => {
    playSound.click();
    navigate(`${episodeBasePath}/ctf`);
  }, [navigate, episodeBasePath]);

  const handlePreloadTemplate = useCallback(() => {
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
  }, [activeChalId]);

  const handleInjectCodexSnippet = useCallback((snippet: string) => {
    setSandboxCode(prev => prev + '\n' + snippet);
    setConsoleLogs(prev => [...prev, `[SYS] Injected Codex directive into buffer: "${snippet}"`]);
    showToast('DIRECTIVE INJECTED INTO WORKSPACE');
  }, [showToast]);

  const handleExecuteSandbox = useCallback(() => {
    playSound.click();
    setSandboxRunning(true);
    setConsoleLogs(prev => [...prev, '[SYS] Compiling workspace source buffer...', '[SYS] Loading virtual machine thread...']);

    setTimeout(() => {
      let result;
      const tmpl = SANDBOX_TEMPLATES[activeChalId];
      if (sandboxLang !== 'javascript' && tmpl && sandboxLang === tmpl.lang) {
        result = tmpl.runLogic(sandboxCode);
      } else {
        result = runJsSandbox(sandboxCode);
      }

      setConsoleLogs(prev => [...prev, ...result.logs]);
      setSandboxRunning(false);
      if (result.success) playSound.success();
      else playSound.error();
    }, 850);
  }, [activeChalId, sandboxLang, sandboxCode]);

  const handleSubmit = useCallback(async (
    ch: Challenge,
    chapters: ReturnType<typeof getChaptersForChallenge>,
    chapIdx: number,
  ) => {
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
  }, [chapAnswers, solvedChaps, challenges, submitFlag, setUserXp, showToast]);

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

  const sv      = gctf.solved[id!];
  const isOk    = !!sv?.solved;
  const att     = gctf.chalAttempts[id!] ?? ch.attemptsAllowed;
  const isFail  = !!(sv?.failed || (!sv?.solved && att <= 0));
  const meta    = CAT_META[ch.category] || { color: 'var(--red)', icon: '□' };
  // Use last chapter for direct flag submission (single-step flow)
  const chapters = getChaptersForChallenge(ch.id, ch.flag);
  const lastChap = chapters[chapters.length - 1];
  const flagValue = chapAnswers[lastChap?.id ?? ''] ?? '';
  const diffLabel = (['EASY', 'MED', 'HARD', 'ELITE', 'LEGEND'] as const)[ch.difficulty - 1] ?? '';

  // ── IMMERSIVE DETAIL VIEW ────────────────────────────────────────────────────

  const submitDirect = () => {
    if (lastChap) handleSubmit(ch, chapters, chapters.length - 1);
  };

  // Derive arc image from episodeBasePath (/episode/1/...)
  const arcId = parseInt(episodeBasePath.split('/')[2] ?? '1', 10);
  const bannerImg = getArcCover(isNaN(arcId) ? 1 : arcId);

  return (
    <div className={`cw2-page ${shake || chapShake ? 'ctf-shake' : ''}`}>

      {/* ── BANNER ── */}
      <div className="cw2-banner">
        <img src={bannerImg} alt="" className="cw2-banner-img" onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div className="cw2-banner-overlay" />
        <div className="cw2-banner-overlay-b" />
        <div className="cw2-banner-content">
          <div className="cw2-banner-nav">
            <button type="button" className="cw2-back-btn" onClick={closeChallenge}>← BOARD</button>
            <div className="cw2-breadcrumb">
              <span style={{ color: meta.color }}>{meta.icon}</span>
              <span className="cw2-breadcrumb-sep">/</span>
              <span>{ch.category}</span>
              <span className="cw2-breadcrumb-sep">/</span>
              <span style={{ opacity: .5 }}>{ch.id}</span>
            </div>
          </div>
          <div className="cw2-banner-meta">
            <h1 className="cw2-banner-title">
              <GlitchText text={ch.title} triggerOnHover color={meta.color} />
            </h1>
            <div className="cw2-banner-badges">
              <span
                className="cw2-banner-cat-badge"
                style={{ borderColor: `${meta.color}44`, color: meta.color, background: `${meta.color}18` }}
              >
                {meta.icon} {ch.category}
              </span>
              <div className="cw2-banner-diff">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className="cw2-banner-star"
                    style={{ color: i < ch.difficulty ? meta.color : 'rgba(255,255,255,.15)' }}
                  >★</span>
                ))}
              </div>
              <span className="cw2-banner-pts" style={{ color: meta.color }}>{ch.points}</span>
              {isOk && <span className="cw2-banner-pwned">PWNED ✓</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY: 2 COLUMNS ── */}
      <div className="cw2-body">

        {/* LEFT: context */}
        <div className="cw2-left">

          {/* Category + difficulty */}
          <div className="cw2-section">
            <div className="cw2-section-label">CLASSIFICATION</div>
            <div className="cw2-cat-area">
              <span className="cw2-cat-icon" style={{ color: meta.color }}>{meta.icon}</span>
              <div className="cw2-cat-info">
                <span className="cw2-cat-name" style={{ color: meta.color }}>{ch.category}</span>
                <div className="cw2-diff-pips">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="cw2-diff-pip"
                      style={{ background: i < ch.difficulty ? meta.color : 'rgba(255,255,255,.1)' }}
                    />
                  ))}
                  <span className="cw2-diff-label" style={{ color: meta.color }}>{diffLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario */}
          <div className="cw2-section">
            <div className="cw2-section-label">SCENARIO</div>
            <div className="cw2-scenario">{ch.scenario}</div>
          </div>

          {/* Hint */}
          {ch.hint && (
            <div className="cw2-section">
              <button
                type="button"
                className="cw2-hint-toggle"
                onClick={() => toggleCTFHint(ch.id)}
              >
                <span>⚡ TACTICAL HINT</span>
                <span>{gctf.hintOn[ch.id] ? '▲' : '▼'}</span>
              </button>
              {gctf.hintOn[ch.id] && (
                <div className="cw2-hint-body">{ch.hint}</div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT: workspace */}
        <div className="cw2-right">

          {/* Task directive */}
          <div className="cw2-section">
            <div className="cw2-task">
              <div className="cw2-task-label">▶ OBJECTIVE</div>
              <p className="cw2-task-text">{ch.task}</p>
            </div>
          </div>

          {/* Evidence files */}
          {ch.artifacts.length > 0 && (
            <div className="cw2-section" style={{ padding: 0 }}>
              <div style={{ padding: '1.1rem 1.3rem .6rem' }}>
                <div className="cw2-section-label">EVIDENCE</div>
              </div>
              <div className="cw2-evidence">
                <div className="cw2-evidence-tabs">
                  {ch.artifacts.map((art, idx) => {
                    const col = FILE_COLORS[art.type] || meta.color;
                    return (
                      <button
                        type="button"
                        key={idx}
                        className={`cw2-ev-tab ${expandedArt === idx ? 'active' : ''}`}
                        style={expandedArt === idx ? { color: col, borderBottomColor: col } : {}}
                        onClick={() => { playSound.click(); setExpandedArt(idx); }}
                      >
                        <span className="cw2-ev-icon">{FILE_ICONS[art.type] ?? '⊞'}</span>
                        {art.label}
                      </button>
                    );
                  })}
                </div>
                {expandedArt !== null && ch.artifacts[expandedArt] && (() => {
                  const art = ch.artifacts[expandedArt];
                  const col = FILE_COLORS[art.type] || meta.color;
                  return (
                    <div className="cw2-ev-viewport">
                      <div className="cw2-ev-topbar">
                        <span className="cw2-ev-path" style={{ color: col }}>
                          {FILE_ICONS[art.type] ?? '⊞'} evidence/{art.label.toLowerCase()}
                        </span>
                        <button
                          type="button"
                          className="cw2-ev-copy"
                          onClick={() => { navigator.clipboard.writeText(art.content); showToast('COPIED'); playSound.success(); }}
                        >
                          COPY
                        </button>
                      </div>
                      <pre className="cw2-ev-pre" style={{ color: col }}>
                        <code>{art.content}</code>
                      </pre>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Flag zone */}
          {isOk ? (
            <div className="cw2-section">
              <div className="cw2-solved-banner">
                <span className="cw2-solved-icon">✓</span>
                <div className="cw2-solved-info">
                  <span className="cw2-solved-label">FLAG ACCEPTED</span>
                  <span className="cw2-solved-flag">EPHEMERAL{`{${ch.flag}}`}</span>
                  {sv?.pts_earned && <span className="cw2-solved-xp">+{sv.pts_earned} XP EARNED</span>}
                </div>
              </div>
            </div>
          ) : isFail ? (
            <div className="cw2-section">
              <div className="cw2-failed-banner">
                <div className="cw2-failed-label">✗ OPERATION FAILED</div>
                <div className="cw2-failed-flag">EPHEMERAL{`{${ch.flag}}`}</div>
              </div>
            </div>
          ) : (
            <div className="cw2-submit">
              <div className="cw2-submit-label">DECRYPT FLAG</div>
              <div className="cw2-flag-zone">
                <span className="cw2-flag-pre">EPHEMERAL{'{'}</span>
                <input
                  ref={flagInputRef}
                  type="text"
                  className="cw2-flag-input"
                  placeholder="flag..."
                  value={flagValue}
                  onChange={e => lastChap && setChapAnswers({ ...chapAnswers, [lastChap.id]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && submitDirect()}
                  autoComplete="off"
                  spellCheck={false}
                  style={{ caretColor: meta.color }}
                />
                <span className="cw2-flag-suf">{'}'}</span>
                <button
                  type="button"
                  className="cw2-flag-submit"
                  style={{ background: meta.color, color: ['var(--lime)', '#ccff00', '#f9a825'].includes(meta.color) ? '#000' : '#fff' }}
                  onClick={submitDirect}
                >
                  SUBMIT
                </button>
              </div>
              <div className="cw2-attempts">
                <div className="cw2-att-pips">
                  {Array.from({ length: ch.attemptsAllowed }).map((_, i) => (
                    <div
                      key={i}
                      className="cw2-att-pip"
                      style={{ background: i < att ? meta.color : 'rgba(255,255,255,.12)' }}
                    />
                  ))}
                </div>
                <span className="cw2-att-text">{att} ATTEMPT{att !== 1 ? 'S' : ''} REMAINING</span>
              </div>
            </div>
          )}

          {/* Post-solve explanation */}
          {(isOk || isFail) && ch.explanation && (
            <div className="cw2-postsolve" style={{ borderTopColor: isOk ? 'var(--crt)' : 'var(--red)' }}>
              <div className="cw2-postsolve-label" style={{ color: isOk ? 'var(--crt)' : 'var(--red)' }}>
                // SOLUTION ANALYSIS
              </div>
              <p className="cw2-postsolve-text">{ch.explanation}</p>
              {isOk && (
                <button
                  type="button"
                  className="cw2-writeup-btn"
                  onClick={() => { playSound.click(); setWriteupChal({ id: ch.id, title: ch.title }); }}
                >
                  ✎ FILE WRITE-UP
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
