import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { Challenge, GctfState } from '../../types';
import type { DSAProblem, DSATestCase } from '../../data/dsaContent';
import { usePyodide } from '../../hooks/usePyodide';
import { playSound } from '../../lib/sound';
import { DSAVisualizer } from './DSAVisualizer';

interface TestResult {
  label: string;
  passed: boolean;
  got: string;
  expected: string;
}

interface DSAProblemDetailProps {
  problem: DSAProblem;
  challenge: Challenge;
  gctf: GctfState;
  submitFlag: (id: string, flag: string, chs: Challenge[], setXp: React.Dispatch<React.SetStateAction<number>>) => Promise<void>;
  allChallenges: Challenge[];
  setUserXp: React.Dispatch<React.SetStateAction<number>>;
  onMarkSolved: () => void;
  accColor: string;
  episodeTitle?: string;
  onBack?: () => void;
}

function deepEqual(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
void deepEqual;

function runJsTestCase(userCode: string, testCase: DSATestCase): { result: unknown; error?: string } {
  try {
    const runner = new Function(
      'args',
      `${userCode}\n\nconst _fn = typeof Solution !== 'undefined'
        ? (() => { const s = new Solution(); const m = Object.getOwnPropertyNames(Solution.prototype).find(n => n !== 'constructor'); return s[m].bind(s); })()
        : (typeof canJump !== 'undefined' ? canJump : typeof coinChange !== 'undefined' ? coinChange : typeof minCostClimbingStairs !== 'undefined' ? minCostClimbingStairs : null);
      if (!_fn) throw new Error('No solution function found');
      return _fn(...args);`
    );
    return { result: runner(testCase.args) };
  } catch (err) {
    return { result: undefined, error: err instanceof Error ? err.message : String(err) };
  }
}
void runJsTestCase;

const TAG_TO_TOPIC: Record<string, string> = {
  'Array': 'Arrays', 'Dynamic Programming': 'Dynamic Programming', 'Greedy': 'Greedy',
  'String': 'Strings', 'Hash Table': 'Hash Maps', 'Two Pointers': 'Two Pointers',
  'Math': 'Mathematics', 'Recursion': 'Recursion', 'Backtracking': 'Backtracking',
  'Binary Search': 'Binary Search', 'Linked List': 'Linked Lists', 'Tree': 'Trees',
  'Graph': 'Graphs', 'Stack': 'Stacks', 'Sorting': 'Sorting', 'Prefix Sum': 'Prefix Sums',
  'Sliding Window': 'Sliding Window', 'Simulation': 'Simulation',
};

function topicFromTags(tags: string[]): string {
  for (const tag of tags) { if (TAG_TO_TOPIC[tag]) return TAG_TO_TOPIC[tag]; }
  return tags[0] ?? 'Algorithms';
}

const DIFF_COLORS: Record<string, string> = {
  easy: 'var(--crt)', medium: 'var(--gold)', hard: 'var(--red)',
};

export const DSAProblemDetail: React.FC<DSAProblemDetailProps> = ({
  problem, challenge, gctf, submitFlag, allChallenges, setUserXp,
  onMarkSolved, accColor, episodeTitle, onBack,
}) => {
  const [lang, setLang] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'study' | 'viz'>('problem');
  const { loading: pyLoading, run: runPy } = usePyodide();

  const solved = !!gctf.solved[challenge.id]?.solved;
  const diffKey = problem.difficulty.toLowerCase();
  const diffColor = DIFF_COLORS[diffKey] ?? 'var(--paper)';
  const topic = topicFromTags(problem.tags);
  const passedCount = testResults ? testResults.filter(r => r.passed).length : 0;
  const allPass = testResults !== null && passedCount === testResults.length;

  useEffect(() => {
    setTestResults(null);
    setConsoleLogs([]);
    setCode(problem.starterCode.python);
    setLang('python');
    setActiveTab('problem');
  }, [problem.id]);

  const handleLangChange = (newLang: 'python' | 'javascript') => {
    setLang(newLang);
    setCode(newLang === 'python' ? problem.starterCode.python : problem.starterCode.javascript);
    setTestResults(null);
    playSound.click();
  };

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setTestResults(null);
    setConsoleLogs(['[SYS] Compiling source buffer...', '[SYS] Loading execution environment...']);
    playSound.click();

    try {
      if (lang === 'python') {
        const fullCode = `${code}\n${problem.runnerPy}`;
        const res = await runPy(fullCode);

        if (res.error) {
          setConsoleLogs(prev => [...prev, `[FATAL] ${res.error}`]);
          setTestResults([{ label: 'Runtime Error', passed: false, got: res.error, expected: '' }]);
          playSound.error();
          return;
        }

        let parsed: boolean[];
        try {
          parsed = JSON.parse(res.output.replace(/True/g, 'true').replace(/False/g, 'false'));
        } catch {
          setConsoleLogs(prev => [...prev, `[ERR] Parse error: ${res.output}`]);
          setTestResults([{ label: 'Parse Error', passed: false, got: res.output, expected: 'boolean[]' }]);
          playSound.error();
          return;
        }

        const results: TestResult[] = problem.testCases.map((tc, i) => ({
          label: tc.label,
          passed: parsed[i] ?? false,
          got: parsed[i] ? String(tc.expected) : '(wrong)',
          expected: String(tc.expected),
        }));
        const pass = results.filter(r => r.passed).length;
        setConsoleLogs(prev => [...prev, `[OUT] Tests complete: ${pass}/${results.length} passed.`]);
        setTestResults(results);
        if (results.every(r => r.passed)) playSound.success(); else playSound.error();
      } else {
        try {
          const runner = new Function(
            `${code}\n${problem.runnerJs}\nreturn (function(){${problem.runnerJs}})();`
          );
          const raw: unknown[] = runner();
          const results: TestResult[] = problem.testCases.map((tc, i) => ({
            label: tc.label,
            passed: !!raw[i],
            got: raw[i] ? String(tc.expected) : '(wrong)',
            expected: String(tc.expected),
          }));
          const pass = results.filter(r => r.passed).length;
          setConsoleLogs(prev => [...prev, `[OUT] Tests complete: ${pass}/${results.length} passed.`]);
          setTestResults(results);
          if (results.every(r => r.passed)) playSound.success(); else playSound.error();
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setConsoleLogs(prev => [...prev, `[FATAL] ${msg}`]);
          setTestResults([{ label: 'Runtime Error', passed: false, got: msg, expected: '' }]);
          playSound.error();
        }
      }
    } finally {
      setRunning(false);
    }
  }, [lang, code, problem, runPy, running]);

  const handleMarkSolved = async () => {
    if (solved || submitting) return;
    setSubmitting(true);
    playSound.click();
    try {
      await submitFlag(challenge.id, 'DSA_HONOR_SOLVED', allChallenges, setUserXp);
      onMarkSolved();
    } finally {
      setSubmitting(false);
    }
  };

  const scopeCss = `
    .dsa-detail-page { --dsa-acc: ${accColor}; --dsa-diff-col: ${diffColor} }
    .dsa-detail-back:hover { color: ${accColor} }
    .dsa-detail-cat { color: ${accColor} }
    .dsa-detail-mark-btn { background: ${accColor} }
  `;

  return (
    <>
      <style>{scopeCss}</style>
      <div className="dsa-detail-page">

        {/* ── TOP NAV / BANNER ── */}
        <div className={`dsa-detail-banner dsa-detail-banner--${diffKey}`}>
          <div className="dsa-detail-nav">
            {onBack && (
              <button type="button" className="dsa-detail-back" onClick={onBack}>
                ← BOARD
              </button>
            )}
            <div className="dsa-detail-breadcrumb">
              <span className="dsa-detail-cat">{topic}</span>
              <span className="dsa-detail-sep">/</span>
              <span className="dsa-detail-crumb-id">#{problem.leetcodeNum}</span>
            </div>
          </div>
          <div className="dsa-detail-banner-meta">
            <h1 className="dsa-detail-title">{challenge.title}</h1>
            <div className="dsa-detail-badges">
              <span className={`dsa-detail-diff dsa-detail-diff--${diffKey}`}>{problem.difficulty}</span>
              {problem.tags.slice(0, 3).map(t => (
                <span key={t} className="dsa-detail-tag">{t}</span>
              ))}
              <span className="dsa-detail-pts">{challenge.points} XP</span>
              {solved && <span className="dsa-detail-solved-badge">✓ SOLVED</span>}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="dsa-detail-body">

          {/* LEFT: content */}
          <div className="dsa-detail-left">

            {/* Content tabs */}
            <div className="dsa-content-tabs">
              {(['problem', 'study', 'viz'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`dsa-content-tab${activeTab === tab ? ' on' : ''}`}
                  onClick={() => { setActiveTab(tab); playSound.click(); }}
                >
                  {tab === 'problem' ? '◈ PROBLEM' : tab === 'study' ? '◉ STUDY GUIDE' : '◆ VISUALIZER'}
                </button>
              ))}
            </div>

            <div className="dsa-content-body">

              {/* PROBLEM TAB */}
              {activeTab === 'problem' && (
                <div className="dsa-tab-panel">
                  <div className="dsa-content-section">
                    <div className="dsa-section-label">DESCRIPTION</div>
                    <p className="dsa-problem-statement">{problem.statement}</p>
                  </div>

                  <div className="dsa-content-section">
                    <div className="dsa-section-label">EXAMPLES</div>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="dsa-example">
                        <div className="dsa-example-num">Example {i + 1}</div>
                        <div className="dsa-example-row">
                          <span className="dsa-example-key">Input:</span>
                          <span className="dsa-example-val">{ex.input}</span>
                        </div>
                        <div className="dsa-example-row">
                          <span className="dsa-example-key">Output:</span>
                          <span className="dsa-example-val">{ex.output}</span>
                        </div>
                        {ex.explanation && <div className="dsa-example-expl">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="dsa-content-section">
                    <div className="dsa-section-label">CONSTRAINTS</div>
                    <div className="dsa-constraints">
                      {problem.constraints.map((c, i) => (
                        <span key={i} className="dsa-constraint">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="dsa-content-section">
                    <div className="dsa-section-label">HINT</div>
                    <div className="dsa-hint-text">{problem.hint}</div>
                  </div>
                </div>
              )}

              {/* STUDY TAB */}
              {activeTab === 'study' && (
                <div className="dsa-tab-panel">
                  <div className="dsa-content-section">
                    <div className="dsa-section-label">CONCEPT</div>
                    <div className="dsa-sg-concept">{problem.studyGuide.concept}</div>
                    <div className="dsa-sg-tldr">{problem.studyGuide.tldr}</div>
                  </div>

                  <div className="dsa-content-section">
                    <div className="dsa-section-label">APPROACHES</div>
                    {problem.studyGuide.approaches.map((ap, i) => (
                      <div key={i} className={`dsa-approach${ap.works ? ' dsa-approach--optimal' : ''}`}>
                        <div className="dsa-approach-head">
                          <span className="dsa-approach-name">{ap.name}</span>
                          <span className={`dsa-approach-badge${ap.works ? ' dsa-approach-badge--yes' : ''}`}>
                            {ap.works ? 'OPTIMAL' : 'SUBOPTIMAL'}
                          </span>
                        </div>
                        <div className="dsa-approach-complexity">
                          <span className="dsa-cx-badge">T: {ap.time}</span>
                          <span className="dsa-cx-badge">S: {ap.space}</span>
                        </div>
                        <p className="dsa-approach-desc">{ap.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="dsa-insight">
                    <div className="dsa-insight-label">▶ KEY INSIGHT</div>
                    <p className="dsa-insight-text">{problem.studyGuide.keyInsight}</p>
                  </div>

                  {problem.studyGuide.pitfalls.length > 0 && (
                    <div className="dsa-content-section">
                      <div className="dsa-section-label">PITFALLS</div>
                      {problem.studyGuide.pitfalls.map((p, i) => (
                        <div key={i} className="dsa-pitfall">
                          <span className="dsa-pitfall-icon">!</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="dsa-content-section">
                    <div className="dsa-section-label">PATTERN HINT</div>
                    <div className="dsa-pattern-hint">{problem.studyGuide.patternHint}</div>
                  </div>
                </div>
              )}

              {/* VISUALIZER TAB */}
              {activeTab === 'viz' && (
                <div className="dsa-tab-panel">
                  <div className="dsa-content-section">
                    <div className="dsa-section-label">
                      VISUALIZATION — {challenge.title.toUpperCase()}
                    </div>
                    <DSAVisualizer problem={problem} accColor={accColor} />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: workspace */}
          <div className="dsa-detail-right">

            {/* Terminal header */}
            <div className="dsa-terminal-hdr">
              <span className="dsa-terminal-icon">_</span>
              <span className="dsa-terminal-label">
                {lang === 'python' ? 'solution.py' : 'solution.js'}
              </span>
              <div className="dsa-lang-switcher">
                {(['python', 'javascript'] as const).map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`dsa-lang-btn${lang === l ? ' on' : ''}`}
                    onClick={() => handleLangChange(l)}
                  >
                    {l === 'python' ? 'PY' : 'JS'}
                  </button>
                ))}
              </div>
              {pyLoading && lang === 'python' && (
                <div className="dsa-py-loading">
                  <div className="dsa-py-spinner" />
                  <span>INIT</span>
                </div>
              )}
            </div>

            {/* Monaco editor */}
            <div className="dsa-monaco-wrap">
              <Editor
                height="100%"
                language={lang === 'python' ? 'python' : 'javascript'}
                value={code}
                onChange={v => setCode(v ?? '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 4,
                  renderLineHighlight: 'line',
                  padding: { top: 10, bottom: 10 },
                  fontFamily: '"Share Tech Mono", "Fira Code", monospace',
                  scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                }}
              />
            </div>

            {/* Execute bar */}
            <div className="dsa-exec-bar">
              <button
                type="button"
                className="dsa-exec-btn"
                onClick={handleRun}
                disabled={running || (lang === 'python' && pyLoading)}
              >
                {running ? '⟳ RUNNING' : '▶ EXECUTE'}
              </button>
              {testResults && !running && (
                <span className={`dsa-exec-status${allPass ? ' dsa-exec-status--pass' : ' dsa-exec-status--fail'}`}>
                  {passedCount}/{testResults.length} PASSED
                </span>
              )}
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dsa-lc-link"
              >
                ↗ LEETCODE
              </a>
            </div>

            {/* Console output */}
            <div className="dsa-console">
              <div className="dsa-console-hdr">
                <span className="dsa-console-label">// CONSOLE OUTPUT</span>
              </div>
              <div className="dsa-console-body">
                {consoleLogs.length === 0 && (
                  <span className="dsa-console-empty">&gt; Run your code to see output</span>
                )}
                {consoleLogs.map((log, i) => (
                  <div key={i} className={`dsa-console-line${log.startsWith('[FATAL]') || log.startsWith('[ERR]') ? ' dsa-console-line--err' : log.startsWith('[OUT]') ? ' dsa-console-line--out' : ''}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Test cases */}
            <div className="dsa-tests-panel">
              <div className="dsa-tests-hdr">
                <span className="dsa-tests-label">TEST CASES</span>
                <div className="dsa-tests-counter">
                  <span className={`dsa-tests-fraction${allPass ? ' all-pass' : testResults !== null ? ' has-fail' : ''}`}>
                    {testResults ? passedCount : 0}/{problem.testCases.length}
                  </span>
                  <span className="dsa-tests-sub">PASSED</span>
                </div>
              </div>
              {testResults && (
                <div className="dsa-test-rows">
                  {testResults.map((r, i) => (
                    <div key={i} className={`dsa-test-row dsa-test-row--${r.passed ? 'pass' : 'fail'}`}>
                      <span className={`dsa-test-icon dsa-test-icon--${r.passed ? 'pass' : 'fail'}`}>
                        {r.passed ? '✓' : '✗'}
                      </span>
                      <span className="dsa-test-name">{r.label}</span>
                      {!r.passed && r.expected && (
                        <span className="dsa-test-detail">expected: {r.expected}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit action */}
            <div className="dsa-submit-area">
              {solved ? (
                <div className="dsa-solved-banner">
                  <span className="dsa-solved-icon">✓</span>
                  <div>
                    <div className="dsa-solved-label">SOLVED</div>
                    <div className="dsa-solved-xp">+{gctf.solved[challenge.id]?.pts_earned ?? challenge.points} XP EARNED</div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="dsa-detail-mark-btn"
                  onClick={handleMarkSolved}
                  disabled={submitting}
                >
                  {submitting ? '⟳ SAVING…' : `✓ MARK SOLVED  +${challenge.points} XP`}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
