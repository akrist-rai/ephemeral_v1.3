import React, { useState, useEffect } from 'react';

interface AuthGateProps {
  onAuth: (userId: string, displayName: string) => void;
}

const ADJECTIVES = ['SILENT', 'VOID', 'QUANTUM', 'CYBER', 'SPECTRAL', 'IRON', 'BINARY', 'PHANTOM', 'NEURAL', 'DARK', 'ROGUE', 'NEON'];
const NOUNS = ['KNIGHT', 'GHOST', 'CIPHER', 'WOLF', 'ORACLE', 'REAPER', 'VECTOR', 'WRAITH', 'NEXUS', 'PROTOCOL'];

function randHandle() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}_${noun}_${num}`;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuth }) => {
  const [handle, setHandle] = useState(randHandle());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState('');

  // Typewriter greeting
  const greeting = 'ACN_EPHEMERAL // NETWORK ACCESS REQUESTED';
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= greeting.length) { clearInterval(iv); return; }
      setTyped(t => t + greeting[i++]);
    }, 28);
    return () => clearInterval(iv);
  }, []);

  const VALID = /^[A-Za-z0-9_-]{3,24}$/;

  const commit = async () => {
    const h = handle.trim().toUpperCase().replace(/\s+/g, '_');
    if (!VALID.test(h)) {
      setError('3-24 characters. Letters, numbers, _ and - only.');
      return;
    }
    setError('');
    setLoading(true);
    // ensureUser — the backend creates or fetches on /api/progress/:userId
    try {
      const res = await fetch(`/api/progress/${encodeURIComponent(h)}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      localStorage.setItem('ephemeral_user_id', h);
      localStorage.setItem('ephemeral_display_name', h);
      onAuth(h, h);
    } catch (e: any) {
      setError(`Connection failed: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="auth-gate">
      {/* Scanlines */}
      <div className="auth-scan" />
      {/* Grid bg */}
      <div className="auth-grid" />

      <div className="auth-panel">
        {/* Corner HUD marks */}
        <div className="hc tl" style={{ borderColor: '#e8000d', width: '14px', height: '14px' }} />
        <div className="hc br" style={{ borderColor: '#e8000d', width: '14px', height: '14px' }} />
        <div className="hc tr" style={{ borderColor: 'rgba(255,255,255,0.1)', width: '10px', height: '10px' }} />
        <div className="hc bl" style={{ borderColor: 'rgba(255,255,255,0.1)', width: '10px', height: '10px' }} />

        {/* Header */}
        <div className="auth-eyebrow">// EPHEMERAL NETWORK v1.3</div>
        <h1 className="auth-title">ESTABLISH<br />IDENTITY</h1>
        <div className="auth-typed">{typed}<span className="auth-cursor">▌</span></div>

        {/* Divider */}
        <div className="auth-div" />

        {/* Handle input */}
        <div className="auth-field-label">// OPERATOR HANDLE</div>
        <div className="auth-input-wrap">
          <span className="auth-input-pre">ID://</span>
          <input
            className="auth-input"
            type="text"
            value={handle}
            onChange={e => { setHandle(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && commit()}
            maxLength={24}
            spellCheck={false}
            autoFocus
            autoComplete="off"
          />
        </div>

        {error && <div className="auth-error">✗ {error}</div>}

        <div className="auth-hint">
          Choose a unique handle. It will identify you on the leaderboard.<br />
          Returning? Enter your previous handle to restore your progress.
        </div>

        {/* Actions */}
        <div className="auth-actions">
          <button className="auth-btn-primary" onClick={commit} disabled={loading}>
            {loading ? 'CONNECTING...' : '▶ ENTER NETWORK'}
          </button>
          <button className="auth-btn-secondary" onClick={() => setHandle(randHandle())}>
            ⟳ RANDOMIZE
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          No account required. Your handle is your identity.
        </div>
      </div>
    </div>
  );
};
