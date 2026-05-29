import React, { useState, useEffect } from 'react';

interface WriteupModalProps {
  challengeId: string;
  challengeTitle: string;
  onClose: () => void;
}

export const WriteupModal: React.FC<WriteupModalProps> = ({ challengeId, challengeTitle, onClose }) => {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('ephemeral_writeups') || '{}');
      if (all[challengeId]) setText(all[challengeId]);
    } catch {}
  }, [challengeId]);

  const save = () => {
    try {
      const all = JSON.parse(localStorage.getItem('ephemeral_writeups') || '{}');
      all[challengeId] = text;
      localStorage.setItem('ephemeral_writeups', JSON.stringify(all));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {}
  };

  const del = () => {
    try {
      const all = JSON.parse(localStorage.getItem('ephemeral_writeups') || '{}');
      delete all[challengeId];
      localStorage.setItem('ephemeral_writeups', JSON.stringify(all));
      setText('');
    } catch {}
  };

  return (
    <div className="writeup-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="writeup-modal">
        <div className="writeup-modal-header">
          <div className="writeup-modal-eyebrow">// PERSONAL WRITE-UP</div>
          <div className="writeup-modal-title">{challengeTitle}</div>
          <div className="writeup-modal-id">{challengeId}</div>
          <button className="writeup-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="writeup-modal-body">
          <textarea
            className="writeup-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={"Document your approach, tools used, key insights...\n\n## Method\n\n## Key Observations\n\n## What I Learned"}
            spellCheck={false}
          />
        </div>
        <div className="writeup-modal-footer">
          <button className="writeup-btn-delete" onClick={del}>✕ CLEAR</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            {saved && <span className="writeup-saved-badge">✓ SAVED</span>}
            <button className="writeup-btn-save" onClick={save}>SAVE WRITE-UP</button>
          </div>
        </div>
      </div>
    </div>
  );
};
