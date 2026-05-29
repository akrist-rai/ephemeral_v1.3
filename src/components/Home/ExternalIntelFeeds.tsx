import React, { useState } from 'react';

interface ExternalChallenge {
  id: string;
  name: string;
  platform: 'picoctf' | 'tryhackme' | 'hackthebox' | 'pwnable';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points?: number;
  description: string;
  url: string;
  tags: string[];
  completed?: boolean;
}

interface Platform {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  bgColor: string;
  logoChar: string;
  challenges: ExternalChallenge[];
  url: string;
  difficulty: 'beginner-friendly' | 'intermediate' | 'advanced';
  description: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'picoctf',
    name: 'picoCTF',
    shortName: 'picoCTF',
    tagline: 'Beginner-Friendly CTF Archive',
    color: '#4fc3f7',
    bgColor: 'rgba(79,195,247,0.04)',
    logoChar: '⚑',
    difficulty: 'beginner-friendly',
    description: 'Carnegie Mellon\'s free cybersecurity education platform. Hundreds of archived CTF challenges across all categories — perfect for freshmen operators.',
    url: 'https://play.picoctf.org',
    challenges: [
      {
        id: 'pico-01',
        name: 'Cookies',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Web Exploitation',
        points: 40,
        description: 'Who doesn\'t love cookies? Try to figure out the best one.',
        url: 'https://play.picoctf.org/practice/challenge/173',
        tags: ['WEB', 'COOKIES', 'HTTP']
      },
      {
        id: 'pico-02',
        name: 'SQL Direct',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Web Exploitation',
        points: 200,
        description: 'Connect to this PostgreSQL server and find the flag!',
        url: 'https://play.picoctf.org/practice/challenge/204',
        tags: ['WEB', 'SQL', 'DATABASE']
      },
      {
        id: 'pico-03',
        name: 'Caesar',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Cryptography',
        points: 100,
        description: 'Decrypt the message encrypted with a Caesar cipher.',
        url: 'https://play.picoctf.org/practice/challenge/58',
        tags: ['CRYPTO', 'CAESAR', 'CLASSICAL']
      },
      {
        id: 'pico-04',
        name: 'Sleuthkit Intro',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Forensics',
        points: 100,
        description: 'Download the disk image and use Sleuthkit to find the flag.',
        url: 'https://play.picoctf.org/practice/challenge/301',
        tags: ['FORENSICS', 'DISK', 'TOOLS']
      },
      {
        id: 'pico-05',
        name: 'Buffer Overflow 0',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Binary Exploitation',
        points: 100,
        description: 'Let\'s start our journey into binary exploitation with a simple stack overflow.',
        url: 'https://play.picoctf.org/practice/challenge/258',
        tags: ['BINARY', 'OVERFLOW', 'STACK']
      },
      {
        id: 'pico-06',
        name: 'Vigenere',
        platform: 'picoctf',
        difficulty: 'easy',
        category: 'Cryptography',
        points: 100,
        description: 'Decrypt the Vigenere cipher with the given key.',
        url: 'https://play.picoctf.org/practice/challenge/316',
        tags: ['CRYPTO', 'VIGENERE', 'CLASSICAL']
      }
    ]
  },
  {
    id: 'tryhackme',
    name: 'TryHackMe',
    shortName: 'THM',
    tagline: 'Guided Learning Paths & Rooms',
    color: '#1abc9c',
    bgColor: 'rgba(26,188,156,0.04)',
    logoChar: '◉',
    difficulty: 'beginner-friendly',
    description: 'Browser-based cybersecurity training with guided learning paths. No VM setup required — complete rooms directly in your browser.',
    url: 'https://tryhackme.com',
    challenges: [
      {
        id: 'thm-01',
        name: 'Linux Fundamentals Part 1',
        platform: 'tryhackme',
        difficulty: 'easy',
        category: 'Networking',
        description: 'Learn the fundamentals of Linux, and get hands-on with some common Linux commands!',
        url: 'https://tryhackme.com/room/linuxfundamentalspart1',
        tags: ['LINUX', 'FUNDAMENTALS', 'TERMINAL']
      },
      {
        id: 'thm-02',
        name: 'Intro to Networking',
        platform: 'tryhackme',
        difficulty: 'easy',
        category: 'Networks',
        description: 'An introduction to networking theory and basic networking tools.',
        url: 'https://tryhackme.com/room/introtonetworking',
        tags: ['NETWORK', 'TCP/IP', 'DNS']
      },
      {
        id: 'thm-03',
        name: 'Burp Suite: The Basics',
        platform: 'tryhackme',
        difficulty: 'medium',
        category: 'Web Exploitation',
        description: 'An introduction to using Burp Suite for web application pentesting.',
        url: 'https://tryhackme.com/room/burpsuitebasics',
        tags: ['WEB', 'BURPSUITE', 'PROXY']
      },
      {
        id: 'thm-04',
        name: 'Cryptography for Beginners',
        platform: 'tryhackme',
        difficulty: 'easy',
        category: 'Cryptography',
        description: 'An introduction to cryptography with some basic challenges.',
        url: 'https://tryhackme.com/room/cryptographyforbeginners',
        tags: ['CRYPTO', 'CIPHERS', 'KEYS']
      },
      {
        id: 'thm-05',
        name: 'OWASP Top 10',
        platform: 'tryhackme',
        difficulty: 'medium',
        category: 'Web Exploitation',
        description: 'Learn about and exploit each of the OWASP Top 10 vulnerabilities.',
        url: 'https://tryhackme.com/room/owasptop10',
        tags: ['OWASP', 'WEB', 'SQLI', 'XSS']
      },
      {
        id: 'thm-06',
        name: 'Nmap',
        platform: 'tryhackme',
        difficulty: 'easy',
        category: 'Networks',
        description: 'An introduction to port scanning with Nmap.',
        url: 'https://tryhackme.com/room/furthernmap',
        tags: ['NMAP', 'SCANNING', 'RECON']
      }
    ]
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    shortName: 'HTB',
    tagline: 'Advanced Machines & Challenges',
    color: '#9fef00',
    bgColor: 'rgba(159,239,0,0.04)',
    logoChar: '◈',
    difficulty: 'intermediate',
    description: 'Elite hacking platform with real vulnerable machines, reverse engineering challenges, and crypto puzzles. For operators who have leveled up beyond the basics.',
    url: 'https://app.hackthebox.com',
    challenges: [
      {
        id: 'htb-01',
        name: 'Meow (Starting Point)',
        platform: 'hackthebox',
        difficulty: 'easy',
        category: 'Networks',
        description: 'Connect via Telnet to find the flag. The very first machine in HTB Starting Point.',
        url: 'https://app.hackthebox.com/starting-point',
        tags: ['TELNET', 'RECONNAISANCE', 'BEGINNER']
      },
      {
        id: 'htb-02',
        name: 'Fawn (Starting Point)',
        platform: 'hackthebox',
        difficulty: 'easy',
        category: 'Networks',
        description: 'Enumerate and exploit an FTP server that allows anonymous login.',
        url: 'https://app.hackthebox.com/starting-point',
        tags: ['FTP', 'ANONYMOUS', 'ENUMERATION']
      },
      {
        id: 'htb-03',
        name: 'Dancing (Starting Point)',
        platform: 'hackthebox',
        difficulty: 'easy',
        category: 'Networks',
        description: 'Access an SMB share without credentials and capture the flag.',
        url: 'https://app.hackthebox.com/starting-point',
        tags: ['SMB', 'SHARES', 'WINDOWS']
      },
      {
        id: 'htb-04',
        name: 'Lame',
        platform: 'hackthebox',
        difficulty: 'easy',
        category: 'Cybersecurity',
        description: 'A vulnerable Samba server with a public exploit (MS-08-067). Great intro to Metasploit.',
        url: 'https://app.hackthebox.com/machines/1',
        tags: ['SAMBA', 'EXPLOIT', 'METASPLOIT']
      },
      {
        id: 'htb-05',
        name: 'Netmon',
        platform: 'hackthebox',
        difficulty: 'easy',
        category: 'Networks',
        description: 'Network monitoring application with an exploitable CVE allowing unauthenticated RCE.',
        url: 'https://app.hackthebox.com/machines/177',
        tags: ['SNMP', 'PRTG', 'RCE']
      },
      {
        id: 'htb-06',
        name: 'Templated (Crypto)',
        platform: 'hackthebox',
        difficulty: 'medium',
        category: 'Cryptography',
        description: 'A web app vulnerable to SSTI. Identify the template engine and achieve RCE.',
        url: 'https://app.hackthebox.com/challenges/Templated',
        tags: ['SSTI', 'JINJA2', 'RCE']
      }
    ]
  },
  {
    id: 'pwnable',
    name: 'pwnable.kr',
    shortName: 'PWNABLE',
    tagline: 'Wargame for Binary Exploitation',
    color: '#ef5350',
    bgColor: 'rgba(239,83,80,0.04)',
    logoChar: '⚔',
    difficulty: 'advanced',
    description: 'Hardcore wargame site for low-level binary exploitation. SSH into real Linux machines and exploit memory corruption bugs — assembly, C, and pwn tools required.',
    url: 'https://pwnable.kr',
    challenges: [
      {
        id: 'pwn-01',
        name: 'fd',
        platform: 'pwnable',
        difficulty: 'easy',
        category: 'Binary Exploitation',
        description: 'Understand Linux file descriptors and use them to read a flag file you don\'t have direct access to.',
        url: 'https://pwnable.kr/play.php',
        tags: ['LINUX', 'FD', 'C']
      },
      {
        id: 'pwn-02',
        name: 'collision',
        platform: 'pwnable',
        difficulty: 'easy',
        category: 'Cryptography',
        description: 'Find a hash collision to pass an MD5-based password check.',
        url: 'https://pwnable.kr/play.php',
        tags: ['MD5', 'HASH', 'COLLISION']
      },
      {
        id: 'pwn-03',
        name: 'bof',
        platform: 'pwnable',
        difficulty: 'medium',
        category: 'Binary Exploitation',
        description: 'Classic stack buffer overflow. Overwrite a local variable to change program flow.',
        url: 'https://pwnable.kr/play.php',
        tags: ['BOF', 'STACK', 'OVERFLOW']
      },
      {
        id: 'pwn-04',
        name: 'flag',
        platform: 'pwnable',
        difficulty: 'medium',
        category: 'Reverse Engineering',
        description: 'An ELF binary has the flag packed inside it. Unpack and extract it.',
        url: 'https://pwnable.kr/play.php',
        tags: ['REVERSING', 'PACKING', 'ELF']
      }
    ]
  }
];

const DIFFICULTY_BADGE: Record<string, { label: string; color: string }> = {
  easy: { label: 'EASY', color: '#43a047' },
  medium: { label: 'MEDIUM', color: '#ffb830' },
  hard: { label: 'HARD', color: '#ef5350' }
};

interface ExternalIntelFeedsProps {
  userBuild?: string;
}

export const ExternalIntelFeeds: React.FC<ExternalIntelFeedsProps> = ({ userBuild }) => {
  const [activePlatform, setActivePlatform] = useState<string>('picoctf');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const platform = PLATFORMS.find(p => p?.id === activePlatform) || PLATFORMS?.[0];
  if (!platform) return <div>No platforms available</div>; // Defensive fallback
  
  const allCategories = ['ALL', ...Array.from(new Set((platform?.challenges ?? []).filter(c => c?.category).map(c => c.category)))];
  const filtered = categoryFilter === 'ALL' ? platform.challenges : (platform.challenges ?? []).filter(c => c?.category === categoryFilter);

  const toggleCompleted = (id: string) => {
    if (!id) return; // Defensive check
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="elden-widget-wrap intel-feeds-wrap">
      {/* Header */}
      <div className="elden-widget-header">
        <div className="ew-hdr-left">
          <div className="ew-hdr-gold-dot" style={{ background: '#e8000d', boxShadow: '0 0 8px #e8000d' }} />
          <span className="ew-hdr-title">INTELLIGENCE FEEDS // EXTERNAL CHALLENGE NETWORK</span>
        </div>
        <div className="ew-hdr-badge" style={{ borderColor: 'rgba(232,0,13,0.2)', color: 'rgba(255,255,255,0.5)' }}>
          {PLATFORMS.reduce((a, p) => a + p.challenges.length, 0)} CURATED CHALLENGES
        </div>
      </div>

      {/* Platform tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {PLATFORMS.map(p => {
          const isActive = p.id === activePlatform;
          return (
            <button
              key={p.id}
              onClick={() => { setActivePlatform(p.id); setCategoryFilter('ALL'); }}
              style={{
                flex: 1,
                background: isActive ? p.bgColor : 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${p.color}` : '2px solid transparent',
                padding: '0.6rem 0.4rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                transition: 'all 0.18s'
              }}
            >
              <span style={{ fontSize: '0.9rem', color: isActive ? p.color : 'rgba(255,255,255,0.3)' }}>{p.logoChar}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.45rem', color: isActive ? p.color : 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontWeight: isActive ? 'bold' : 'normal' }}>{p.shortName}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0 }}>
        {/* Left: platform info */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', marginBottom: '0.3rem' }}>// PLATFORM BRIEF</div>
          <div style={{ fontFamily: 'var(--disp)', fontSize: '1.1rem', color: platform.color, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>{platform.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>{platform.tagline}</div>
          <p style={{ fontFamily: 'var(--body)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {platform.description}
          </p>

          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>ACCESS LEVEL</div>
          <div style={{ display: 'inline-block', fontFamily: 'var(--mono)', fontSize: '0.42rem', color: platform.color, border: `1px solid ${platform.color}44`, padding: '0.2rem 0.5rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            {platform.difficulty === 'beginner-friendly' ? '◉ BEGINNER FRIENDLY' : platform.difficulty === 'intermediate' ? '◈ INTERMEDIATE' : '⚔ ADVANCED'}
          </div>

          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.4rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>FILTER CATEGORY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? `${platform.color}15` : 'transparent',
                  border: `1px solid ${categoryFilter === cat ? platform.color + '44' : 'rgba(255,255,255,0.06)'}`,
                  color: categoryFilter === cat ? platform.color : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.42rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              marginTop: '1.2rem',
              background: platform.color,
              color: '#000',
              fontFamily: 'var(--mono)',
              fontSize: '0.48rem',
              fontWeight: 'bold',
              letterSpacing: '0.12em',
              padding: '0.55rem',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'opacity 0.2s'
            }}
          >
            ⬡ VISIT {platform.shortName} →
          </a>
        </div>

        {/* Right: challenge list */}
        <div style={{ padding: '0.8rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', marginBottom: '0.2rem' }}>
            // {filtered.length} CHALLENGE{filtered.length !== 1 ? 'S' : ''} — {categoryFilter}
          </div>
          {filtered.map(ch => {
            if (!ch?.id) return null; // Skip challenges without valid IDs
            const diff = DIFFICULTY_BADGE[ch.difficulty] || { label: 'UNKNOWN', color: '#999' };
            const isDone = completed.has(ch.id);
            return (
              <div
                key={ch.id}
                style={{
                  background: isDone ? 'rgba(67,160,71,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isDone ? 'rgba(67,160,71,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  padding: '0.7rem 0.8rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.5rem',
                  alignItems: 'start',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: isDone ? '#43a047' : '#fff', letterSpacing: '0.04em', fontWeight: isDone ? 'normal' : 'bold', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {isDone ? '✓ ' : ''}{ch.name || 'UNNAMED'}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.36rem', color: diff.color, border: `1px solid ${diff.color}44`, padding: '0.1rem 0.35rem', letterSpacing: '0.1em', flexShrink: 0 }}>{diff.label}</span>
                    {ch.points && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.36rem', color: platform.color, flexShrink: 0 }}>{ch.points} PTS</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.38rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                    {ch.category || 'UNCATEGORIZED'}
                  </div>
                  <p style={{ fontFamily: 'var(--body)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>{ch.description || 'No description'}</p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                    {(ch.tags || []).map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '0.34rem', color: platform.color, border: `1px solid ${platform.color}30`, padding: '0.1rem 0.35rem', letterSpacing: '0.08em' }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <a
                    href={ch.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: platform.color,
                      color: '#000',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.4rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em',
                      padding: '0.3rem 0.6rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    OPEN ↗
                  </a>
                  <button
                    onClick={() => toggleCompleted(ch.id)}
                    style={{
                      background: isDone ? 'rgba(67,160,71,0.1)' : 'transparent',
                      border: `1px solid ${isDone ? '#43a047' : 'rgba(255,255,255,0.1)'}`,
                      color: isDone ? '#43a047' : 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.38rem',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isDone ? '✓ DONE' : 'MARK DONE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
