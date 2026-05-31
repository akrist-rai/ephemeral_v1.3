import React, { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Challenge, GctfState } from '../../types';
import type { DSAProblem, DSATestCase } from '../../data/dsaContent';
import { usePyodide } from '../../hooks/usePyodide';
import { playSound } from '../../lib/sound';

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
}

/** Safe JS sandbox — runs user code against a single test case. */
function runJsTestCase(userCode: string, testCase: DSATestCase): { result: unknown; error?: string } {
  try {
    // Build a runner that injects user-defined functions and calls with args
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

export const DSAProblemDetail: React.FC<DSAProblemDetailProps> = ({
  problem, challenge, gctf, submitFlag, allChallenges, setUserXp, onMarkSolved,
}) => {
  const [lang, setLang] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [studyOpen, setStudyOpen] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { ready: pyReady, loading: pyLoading, run: runPy } = usePyodide();

  const solved = !!gctf.solved[challenge.id]?.solved;
  const acc = '#e8000d'; // Arc 1 accent colour (ALGORITHMS)

  // Reset code when language changes
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
        // Inject user code + runner, capture output
        const fullCode = `${code}\n${problem.runnerPy}`;
        const res = await runPy(fullCode);

        if (res.error) {
          setTestResults([{
            label: 'Runtime Error',
            passed: false,
            got: res.error,
            expected: '',
          }]);
          playSound.error();
          return;
        }

        // Parse "[ True, False, True ]" output
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
        // JavaScript execution
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

      {/* ── Study Guide ── */}
      <div className="ds-study-card">
        <button
          type="button"
          className="ds-study-toggle"
          onClick={() => { setStudyOpen(o => !o); playSound.click(); }}
        >
          <span className="ds-study-toggle-dots">
            <span className="ds-panel-dot ds-panel-dot--r" />
            <span className="ds-panel-dot ds-panel-dot--y" />
            <span className="ds-panel-dot ds-panel-dot--g" />
          </span>
          <span className="ds-study-toggle-label">// STUDY GUIDE</span>
          <span className="ds-study-concept">{problem.studyGuide.concept}</span>
          <span className={`ds-study-chevron ${studyOpen ? 'open' : ''}`}>▾</span>
        </button>

        {studyOpen && (
          <div className="ds-study-body">
            {/* TL;DR */}
            <div className="ds-study-section">
              <div className="ds-section-label" data-n="01">SUMMARY</div>
              <div className="ds-tldr">
                <span className="ds-tldr-label">TL;DR</span>
                {problem.studyGuide.tldr}
              </div>
            </div>

            {/* Explanation */}
            <div className="ds-study-section">
              <div className="ds-section-label" data-n="02">EXPLANATION</div>
              <div className="ds-explanation">{problem.studyGuide.explanation}</div>
            </div>

            {/* Approaches table */}
            <div className="ds-study-section">
              <div className="ds-section-label" data-n="03">APPROACHES</div>
              <div className="ds-approaches">
                <div className="ds-approach-row">
                  <span>APPROACH</span><span>TIME</span><span>SPACE</span><span>NOTES</span><span>WORKS?</span>
                </div>
                {problem.studyGuide.approaches.map((ap, i) => (
                  <div key={i} className="ds-approach-row">
                    <span className="ds-approach-name">{ap.name}</span>
                    <span className="ds-approach-complexity">{ap.time}</span>
                    <span className="ds-approach-complexity">{ap.space}</span>
                    <span className="ds-approach-desc">{ap.description}</span>
                    <span className={`ds-approach-works ${ap.works ? 'ds-approach-works--yes' : 'ds-approach-works--no'}`}>
                      {ap.works ? '✓ YES' : '✗ NO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ASCII visual */}
            <div className="ds-study-section">
              <div className="ds-section-label" data-n="04">TRACE</div>
              <div className="ds-visual-wrap">
                <div className="ds-visual-chrome">
                  <span className="ds-visual-chrome-dot" />
                  <span className="ds-visual-chrome-title">execution trace</span>
                </div>
                <pre className="ds-visual">{problem.studyGuide.visualExample}</pre>
              </div>
            </div>

            {/* Key insight + pattern */}
            <div className="ds-study-section">
              <div className="ds-section-label" data-n="05">KEY INSIGHT</div>
              <div className="ds-insight">
                <span className="ds-insight-label">CORE PATTERN</span>
                <p className="ds-insight-text">{problem.studyGuide.keyInsight}</p>
              </div>
              <p className="ds-pattern ds-pattern--gap">
                <em>Pattern recognition: </em>{problem.studyGuide.patternHint}
              </p>
            </div>

            {/* Pitfalls */}
            <div className="ds-study-section">
              <div className="ds-pitfalls-label">COMMON PITFALLS</div>
              <div className="ds-pitfalls">
                {problem.studyGuide.pitfalls.map((p, i) => (
                  <div key={i} className="ds-pitfall">{p}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Problem Statement ── */}
      <div className="ds-problem-card">
        <div className="ds-problem-header">
          <span className="ds-problem-num">#{problem.leetcodeNum}</span>
          <span className="ds-problem-title">{problem.title}</span>
          <span className={`ds-diff ${diffClass}`}>{problem.difficulty}</span>
          {problem.tags.map(t => (
            <span key={t} className="ds-constraint">{t}</span>
          ))}
        </div>

        <div className="ds-problem-body">
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
      </div>

      {/* ── Code Editor ── */}
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

      {/* ── Actions ── */}
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
