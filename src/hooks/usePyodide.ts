/**
 * Lazy Pyodide loader.
 *
 * Pyodide (~10 MB WASM) is loaded from CDN the first time the user clicks
 * "Run Tests". Subsequent calls return the cached instance immediately.
 * We avoid bundling it as an npm dep to keep the main JS chunk small.
 */
import { useState, useCallback, useRef } from 'react';

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    _ephPyodide?: PyodideInterface;
  }
}

interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/';

let loadPromise: Promise<PyodideInterface> | null = null;

async function getPyodide(): Promise<PyodideInterface> {
  if (window._ephPyodide) return window._ephPyodide;

  if (!loadPromise) {
    loadPromise = new Promise<PyodideInterface>((resolve, reject) => {
      if (document.getElementById('pyodide-script')) {
        // Script tag already injected by a previous call — wait for window.loadPyodide
        const poll = setInterval(() => {
          if (window.loadPyodide) {
            clearInterval(poll);
            window.loadPyodide({ indexURL: PYODIDE_CDN })
              .then(py => { window._ephPyodide = py; resolve(py); })
              .catch(reject);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = 'pyodide-script';
      script.src = `${PYODIDE_CDN}pyodide.js`;
      script.onload = () => {
        window.loadPyodide!({ indexURL: PYODIDE_CDN })
          .then(py => { window._ephPyodide = py; resolve(py); })
          .catch(reject);
      };
      script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

export interface RunResult {
  output: string;
  error?: string;
  passed?: boolean[];
}

/** Run arbitrary Python code and capture stdout. */
async function runPython(code: string): Promise<RunResult> {
  const py = await getPyodide();

  const wrapper = `
import sys, io
_stdout = io.StringIO()
sys.stdout = _stdout
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as _e:
    sys.stdout = sys.__stdout__
    raise _e
sys.stdout = sys.__stdout__
_stdout.getvalue()
`;

  try {
    const result = await py.runPythonAsync(wrapper);
    return { output: String(result ?? '').trim() };
  } catch (err) {
    return { output: '', error: err instanceof Error ? err.message : String(err) };
  }
}

export function usePyodide() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(!!window._ephPyodide);
  const pyodideRef = useRef<PyodideInterface | null>(window._ephPyodide ?? null);

  const ensureLoaded = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    try {
      const py = await getPyodide();
      pyodideRef.current = py;
      setReady(true);
      return py;
    } finally {
      setLoading(false);
    }
  }, []);

  const run = useCallback(async (code: string): Promise<RunResult> => {
    await ensureLoaded();
    return runPython(code);
  }, [ensureLoaded]);

  return { ready, loading, run, ensureLoaded };
}
