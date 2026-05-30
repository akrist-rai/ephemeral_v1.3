import React, { useState } from 'react';
import { CODEX_DATA } from '../../data/codex';
import { playSound } from '../../lib/sound';

interface CodexPanelProps {
  category: string;
  onCopySnippet: (snippet: string) => void;
}

export const CodexPanel: React.FC<CodexPanelProps> = ({ category, onCopySnippet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reference' | 'converter' | 'xor'>('reference');

  // Interactive Tools state
  const [asciiInput, setAsciiInput] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [xorHexArray, setXorHexArray] = useState('0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14');
  const [xorKey, setXorKey] = useState('0x5A');
  const [xorResult, setXorResult] = useState('');

  const helpers = CODEX_DATA[category] || CODEX_DATA['SCRIPTING'];

  const toggleOpen = () => {
    playSound.click();
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: 'reference' | 'converter' | 'xor') => {
    playSound.click();
    setActiveTab(tab);
  };

  // Convert ASCII text to hex and decimal
  const handleAsciiChange = (val: string) => {
    setAsciiInput(val);
    if (!val) {
      setHexInput('');
      return;
    }
    const hex = Array.from(val)
      .map(char => '0x' + char.charCodeAt(0).toString(16).toUpperCase())
      .join(', ');
    setHexInput(hex);
  };

  // Convert Hex list back to ASCII text
  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (!val) {
      setAsciiInput('');
      return;
    }
    try {
      const cleanHex = val
        .replace(/[^0-9a-fA-FxX,\s]/g, '') // remove weird chars
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0);
      
      const text = cleanHex
        .map(h => {
          const num = parseInt(h, 16);
          return isNaN(num) ? '' : String.fromCharCode(num);
        })
        .join('');
      setAsciiInput(text);
    } catch {
      setAsciiInput('[PARSE ERROR]');
    }
  };

  // Calculate bitwise XOR logic
  const calculateXor = () => {
    playSound.success();
    try {
      const cleanArray = xorHexArray
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0)
        .map(h => parseInt(h, 16));

      const parsedKey = xorKey.startsWith('0x') ? parseInt(xorKey, 16) : parseInt(xorKey, 10);

      if (cleanArray.some(isNaN) || isNaN(parsedKey)) {
        setXorResult('Error: Invalid integer input values.');
        return;
      }

      const xorBytes = cleanArray.map(b => b ^ parsedKey);
      const textResult = xorBytes.map(b => String.fromCharCode(b)).join('');
      const hexResult = xorBytes.map(b => '0x' + b.toString(16).toUpperCase()).join(', ');

      setXorResult(`TEXT : "${textResult}"\nHEX  : [${hexResult}]`);
    } catch (e: any) {
      setXorResult(`XOR calculation crash: ${e.message}`);
    }
  };

  return (
    <div className={`codex-drawer-wrap ${isOpen ? 'on' : ''}`} style={{ marginTop: '1rem' }}>
      
      {/* Trigger Button */}
      <button 
        className="ctf-hint-btn codex-trigger-btn" 
        onClick={toggleOpen}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `3px solid ${isOpen ? 'var(--lime)' : 'var(--muted)'}`,
          padding: '0.6rem 0.8rem',
          fontSize: '0.65rem',
          fontFamily: 'var(--mono)',
          color: isOpen ? 'var(--lime)' : 'var(--paper)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s',
          letterSpacing: '0.08em'
        }}
      >
        <span>🧬 CODEX REFERENCE OPERATOR WIDGET {category ? `[${category}]` : ''}</span>
        <span>{isOpen ? '▲ CLOSE' : '▼ OPEN WIDGET'}</span>
      </button>

      {isOpen && (
        <div 
          className="codex-inner-panel"
          style={{
            background: 'rgba(0,4,8,0.92)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderTop: 'none',
            padding: '1rem',
            fontFamily: 'var(--mono)',
            fontSize: '0.62rem'
          }}
        >
          {/* Drawer Tabs */}
          <div 
            className="codex-tab-header"
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '0.8rem',
              gap: '0.5rem'
            }}
          >
            <button 
              className={`codex-tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
              onClick={() => handleTabChange('reference')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'reference' ? 'var(--lime)' : 'rgba(255,255,255,0.4)',
                padding: '0.3rem 0.6rem',
                borderBottom: activeTab === 'reference' ? '2px solid var(--lime)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.55rem',
                fontFamily: 'var(--mono)'
              }}
            >
              📚 SYNTAX DIRECTIVES
            </button>
            <button 
              className={`codex-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
              onClick={() => handleTabChange('converter')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'converter' ? 'var(--lime)' : 'rgba(255,255,255,0.4)',
                padding: '0.3rem 0.6rem',
                borderBottom: activeTab === 'converter' ? '2px solid var(--lime)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.55rem',
                fontFamily: 'var(--mono)'
              }}
            >
              🔢 HEX/ASCII TRANSLATOR
            </button>
            <button 
              className={`codex-tab-btn ${activeTab === 'xor' ? 'active' : ''}`}
              onClick={() => handleTabChange('xor')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'xor' ? 'var(--lime)' : 'rgba(255,255,255,0.4)',
                padding: '0.3rem 0.6rem',
                borderBottom: activeTab === 'xor' ? '2px solid var(--lime)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.55rem',
                fontFamily: 'var(--mono)'
              }}
            >
              ⛓ BITWISE XOR DECODER
            </button>
          </div>

          {/* TAB 1: Syntax references */}
          {activeTab === 'reference' && (
            <div className="codex-tab-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>
                // INTEL MATRIX PRE-FILTERED FOR {category} INVESTIGATION:
              </div>
              {helpers.map((card, idx) => (
                <div 
                  key={idx} 
                  className="codex-help-card"
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '0.6rem',
                    borderRadius: '2px'
                  }}
                >
                  <div style={{ color: 'var(--lime)', fontWeight: 'bold', fontSize: '0.62rem' }}>▶ {card.title}</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.3rem 0', lineHeight: '1.4' }}>{card.explanation}</p>
                  
                  <div 
                    style={{
                      background: '#000',
                      padding: '0.4rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(255,255,255,0.05)',
                      marginTop: '0.4rem'
                    }}
                  >
                    <code style={{ color: '#fff', fontSize: '0.55rem' }}>{card.syntax}</code>
                    <button 
                      onClick={() => { playSound.click(); onCopySnippet(card.syntax); }}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--lime)',
                        fontFamily: 'var(--mono)',
                        fontSize: '0.48rem',
                        cursor: 'pointer',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '2px'
                      }}
                    >
                      COPY TO WORKSPACE
                    </button>
                  </div>
                  {card.example && (
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
                      Example Usage: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{card.example}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ASCII/Hex Converter */}
          {activeTab === 'converter' && (
            <div className="codex-tab-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem' }}>
                // TRANSLATE TEXT AND BYTES IN REAL-TIME:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>PLAIN TEXT STRING</label>
                  <textarea
                    value={asciiInput}
                    onChange={e => handleAsciiChange(e.target.value)}
                    placeholder="Type plain text (e.g., KEYPWN)..."
                    spellCheck={false}
                    style={{
                      width: '100%',
                      height: '60px',
                      background: '#000',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.58rem',
                      padding: '0.3rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>HEXADECIMAL BYTE ARRAY</label>
                  <textarea
                    value={hexInput}
                    onChange={e => handleHexChange(e.target.value)}
                    placeholder="Type hex array (e.g., 0x4B, 0x45, 0x59)..."
                    spellCheck={false}
                    style={{
                      width: '100%',
                      height: '60px',
                      background: '#000',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.58rem',
                      padding: '0.3rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>
                Tip: Changing one text area will automatically translate into the other. Decimal representation is derived from hex parsing.
              </div>
            </div>
          )}

          {/* TAB 3: Bitwise XOR Decoder */}
          {activeTab === 'xor' && (
            <div className="codex-tab-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem' }}>
                // REVERSE XOR CRYPTO MATRIX:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>TARGET HEX ARRAY</label>
                  <input
                    type="text"
                    value={xorHexArray}
                    onChange={e => setXorHexArray(e.target.value)}
                    placeholder="0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14"
                    style={{
                      width: '100%',
                      background: '#000',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.58rem',
                      padding: '0.3rem 0.4rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>XOR KEY (HEX OR DEC)</label>
                  <input
                    type="text"
                    value={xorKey}
                    onChange={e => setXorKey(e.target.value)}
                    placeholder="0x5A or 90"
                    style={{
                      width: '100%',
                      background: '#000',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.58rem',
                      padding: '0.3rem 0.4rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem' }}>
                <button
                  onClick={calculateXor}
                  style={{
                    flex: 1,
                    background: 'var(--lime)',
                    color: '#000',
                    border: 'none',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.55rem',
                    fontWeight: 'bold',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em'
                  }}
                >
                  ⚡ DECRYPT BITWISE XOR
                </button>
              </div>

              {xorResult && (
                <div style={{ marginTop: '0.4rem' }}>
                  <label style={{ display: 'block', color: 'var(--lime)', fontSize: '0.5rem', marginBottom: '0.2rem' }}>// DECRYPTED OUTPUT DECK</label>
                  <pre
                    style={{
                      background: '#000',
                      border: '1px solid rgba(0,255,65,0.15)',
                      color: '#00ff41',
                      padding: '0.5rem',
                      margin: 0,
                      fontFamily: 'var(--mono)',
                      fontSize: '0.55rem',
                      lineHeight: '1.4',
                      overflowX: 'auto'
                    }}
                  >
                    {xorResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
