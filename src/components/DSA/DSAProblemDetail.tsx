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
}

/** Safe JS sandbox — runs user code against a single test case. */
function runJsTestCase(userCode: string, testCase: DSATestCase): { result: unknown; error?: string } {
  try {
    const runner = new Function(
      'args',
      `${userCode}\n\nconst _fn = typeof Solution !== 'undefined'
        ? (() => { const s = new Solution(); const m = Object.getOwnPropertyNames(Solution.prototype).find(n => n !== 'constructor'); return s[m].bind(s); })()
        : (typeof canJump !== 'undefined' ? canJump
          : typeof coinChange !== 'undefined' ? coinChange
          : typeof minCostClimbingStairs !== 'undefined' ? minCostClimbingStairs
          : null);
      if (!_fn) throw new Error('No solution function found');
      return _fn(...args);`
    );
    return { result: runner(testCase.args) };
  } catch (err) {
    return { result: undefined, error: err instanceof Error ? err.message : String(err) };
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Suppress unused warning — deepEqual may be used by future JS runner expansions
void deepEqual;
void runJsTestCase;

export const DSAProblemDetail: React.FC<DSAProblemDetailProps> = ({
  problem, challenge, gctf, submitFlag, allChallenges, setUserXp, onMarkSolved, accColor,
}) => {
  const [lang, setLang] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [activeTab, setActiveTab] = useState<'problem' | 'code'>('problem');
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { ready: pyReady, loading: pyLoading, run: runPy } = usePyodide();

  // Suppress unused warning
  void pyReady;

  const solved = !!gctf.solved[challenge.id]?.solved;

  // Reset state when problem changes
  useEffect(() => {
    setActiveTab('problem');
    setTestResults(null);
    setCode(problem.starterCode.python);
    setLang('python');
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
    playSound.click();

    try {
      if (lang === 'python') {
        const fullCode = `${code}\n${problem.runnerPy}`;
        const res = await runPy(fullCode);

        if (res.error) {
          setTestResults([{ label: 'Runtime Error', passed: false, got: res.error, expected: '' }]);
          playSound.error();
          return;
        }

        let parsed: boolean[];
        try {
          parsed = JSON.parse(res.output.replace(/True/g, 'true').replace(/False/g, 'false'));
        } catch {
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
          setTestResults(results);
          if (results.every(r => r.passed)) playSound.success(); else playSound.error();
        } catch (err) {
          setTestResults([{
            label: 'Runtime Error',
            passed: false,
            got: err instanceof Error ? err.message : String(err),
            expected: '',
          }]);
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

  const diffClass = {
    Easy: 'ds-diff--easy',
    Medium: 'ds-diff--medium',
    Hard: 'ds-diff--hard',
  }[problem.difficulty];

  return (
    <div className="ds-main">

      {/* ── 1. Problem Header Bar ── */}
      <div className="ds-prob-header-bar">
        <span className="ds-prob-ghost-num">#{problem.leetcodeNum}</span>
        <div className="ds-prob-header-inner">
          <span className="ds-prob-display-title">{challenge.title}</span>
          <div className="ds-prob-meta">
            <span className="ds-prob-num">#{problem.leetcodeNum}</span>
            <span className={`ds-diff ${diffClass}`}>{problem.difficulty}</span>
            {problem.tags.map(t => (
              <span key={t} className="ds-constraint">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Visualization Stage ── */}
      <div className="ds-viz-section">
        <DSAVisualizer problem={problem} accColor={accColor} />
      </div>

      {/* ── 3. Content Tabs ── */}
      <div className="ds-tabs-bar">
        <button
          type="button"
          className={`ds-tab ${activeTab === 'problem' ? 'active' : ''}`}
          onClick={() => { setActiveTab('problem'); playSound.click(); }}
        >
          PROBLEM
        </button>
        <button
          type="button"
          className={`ds-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => { setActiveTab('code'); playSound.click(); }}
        >
          CODE
        </button>
      </div>

      {/* ── 4a. Problem Tab ── */}
      {activeTab === 'problem' && (
        <div className="ds-problem-body-v2">
          <div>
            <div className="ds-problem-label">PROBLEM</div>
            <p className="ds-statement">{problem.statement}</p>
          </div>

          <div>
            <div className="ds-problem-label">EXAMPLES</div>
            <div className="ds-examples">
              {problem.examples.map((ex, i) => (
                <div key={i} className="ds-example">
                  <div className="ds-example-title">Example {i + 1}</div>
                  <div className="ds-example-lines">
                    <div className="ds-example-line">
                      <span className="ds-example-key">Input:</span>
                      <span className="ds-example-val">{ex.input}</span>
                    </div>
                    <div className="ds-example-line">
                      <span className="ds-example-key">Output:</span>
                      <span className="ds-example-val">{ex.output}</span>
                    </div>
                  </div>
                  {ex.explanation && (
                    <div className="ds-example-expl">{ex.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="ds-problem-label">CONSTRAINTS</div>
            <div className="ds-constraints">
              {problem.constraints.map((c, i) => (
                <span key={i} className="ds-constraint">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4b. Code Tab ── */}
      {activeTab === 'code' && (
        <div className="ds-editor-card">
          <div className="ds-editor-header">
            <div className="ds-editor-tabs">
              <span className="ds-editor-label">// EDITOR</span>
              {(['python', 'javascript'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  className={`ds-editor-tab ${lang === l ? 'active' : ''}`}
                  onClick={() => handleLangChange(l)}
                >
                  <span className="ds-editor-tab-dot" />
                  {l === 'python' ? 'solution.py' : 'solution.js'}
                </button>
              ))}
            </div>
            <div className="ds-lang-toggle">
              {(['python', 'javascript'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  className={`ds-lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => handleLangChange(l)}
                >
                  {l === 'python' ? 'Python' : 'JS'}
                </button>
              ))}
            </div>
          </div>

          <div className="ds-monaco-wrap">
            <Editor
              height="320px"
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
                renderLineHighlight: 'all',
                padding: { top: 10, bottom: 10 },
                fontFamily: '"Share Tech Mono", "Fira Code", monospace',
              }}
            />
          </div>

          <div className="ds-run-bar">
            {pyLoading && lang === 'python' && (
              <div className="ds-py-loading">
                <div className="ds-py-spinner" />
                INITIALIZING PYTHON RUNTIME...
              </div>
            )}
            <button
              type="button"
              className="ds-run-btn"
              onClick={handleRun}
              disabled={running || (lang === 'python' && pyLoading)}
            >
              {running ? '⟳ RUNNING...' : '▶ RUN TESTS'}
            </button>
            {testResults && !running && (
              <span className="ds-run-status">
                {testResults.filter(r => r.passed).length}/{testResults.length} passed
              </span>
            )}
          </div>

          {testResults && (
            <div className="ds-test-results">
              {testResults.map((r, i) => (
                <div key={i} className="ds-test-row">
                  <span className={`ds-test-icon ${r.passed ? 'ds-test-icon--pass' : 'ds-test-icon--fail'}`}>
                    {r.passed ? '✓' : '✗'}
                  </span>
                  <span className="ds-test-label">{r.label}</span>
                  {!r.passed && r.expected && (
                    <span className="ds-test-got">got: {r.got}  expected: {r.expected}</span>
                  )}
                  {r.passed && (
                    <span className="ds-test-got ds-test-got--pass">PASSED</span>
                  )}
                  {!r.passed && !r.expected && (
                    <span className="ds-test-got">{r.got}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 5. Actions ── */}
      <div className="ds-action-card">
        {solved ? (
          <div className="ds-solved-banner">
            <span className="ds-solved-check">✓</span>
            <div className="ds-solved-info">
              <span className="ds-solved-label">SOLVED</span>
              <span className="ds-solved-xp">+{gctf.solved[challenge.id]?.pts_earned ?? challenge.points} XP EARNED</span>
            </div>
          </div>
        ) : (
          <div className="ds-action-row">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-lc-link-btn"
            >
              <span className="ds-lc-icon">↗</span>
              OPEN ON LEETCODE
            </a>
            <button
              type="button"
              className="ds-mark-btn"
              onClick={handleMarkSolved}
              disabled={submitting}
            >
              {submitting ? '⟳ SAVING...' : `✓ MARK AS SOLVED  +${challenge.points} XP`}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
