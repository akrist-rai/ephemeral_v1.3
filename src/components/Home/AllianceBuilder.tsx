import React, { useState, useEffect } from 'react';
import { CrewMember, WANTED_CREW } from './BountyDeck';

interface AllianceBuilderProps {
  alliance: CrewMember[];
  onRemove: (member: CrewMember) => void;
  onAdd: (member: CrewMember) => void;
  showToast: (msg: string) => void;
}

export const AllianceBuilder: React.FC<AllianceBuilderProps> = ({
  alliance,
  onRemove,
  onAdd,
  showToast
}) => {
  const [logs, setLogs] = useState<string[]>([
    '[INIT] ALLIANCE TELEMETRY LINK ESTABLISHED',
    '[POSE] LOG POSE ORIENTATION: GRAND LINE SECTOR 4',
    '[FLEET] STANDBY FOR CREW ENLISTMENT'
  ]);
  const [isSailing, setIsSailing] = useState(false);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
  };

  // Log additions or removals in real-time
  useEffect(() => {
    if (alliance.length > 0) {
      const names = alliance.map(c => c.name.split(' ').pop()).join(', ');
      addLog(`FLEET COMMS: [${names}] ACTIVE ON BRIDGE`);
    } else {
      addLog('FLEET COMMS: ALL SLOTS STANDBY');
    }
  }, [alliance]);

  // Compute total alliance bounty
  const totalBounty = alliance.reduce((sum, member) => sum + member.bounty, 0);

  // Compute average synergy metrics
  const averages = alliance.length > 0 ? {
    haki: Math.round(alliance.reduce((sum, m) => sum + m.stats.haki, 0) / alliance.length),
    combat: Math.round(alliance.reduce((sum, m) => sum + m.stats.combat, 0) / alliance.length),
    intellect: Math.round(alliance.reduce((sum, m) => sum + m.stats.intellect, 0) / alliance.length),
    navigation: Math.round(alliance.reduce((sum, m) => sum + m.stats.navigation, 0) / alliance.length),
    engineering: Math.round(alliance.reduce((sum, m) => sum + m.stats.engineering, 0) / alliance.length)
  } : { haki: 0, combat: 0, intellect: 0, navigation: 0, engineering: 0 };

  const handleLaunch = () => {
    if (alliance.length === 0) {
      showToast('ENLIST AT LEAST ONE CREW MEMBER BEFORE SAILING');
      return;
    }
    setIsSailing(true);
    addLog('⛵ SETTING SAIL! ALL CREW MANNING STATIONS...');
    addLog('⚓ ANCHOR WEIGHED! COURSE PLOTTED BY WEATHER CLIMATOLOGY');
    setTimeout(() => {
      setIsSailing(false);
      addLog('🌊 ARRIVED AT ROUGH WATERS OF THE NEW WORLD!');
      showToast('ALLIANCE ARRIVED IN THE GRAND LINE!');
    }, 4000);
  };

  // Find remaining crew not yet recruited
  const recruitedNames = alliance.map(m => m.name);
  const remainingPool = WANTED_CREW.filter(m => !recruitedNames.includes(m.name));

  return (
    <div className="alliance-builder-container">
      {/* SAILING SCREEN OVERLAY */}
      {isSailing && (
        <div className="sailing-overlay">
          <div className="sailing-skull">☠️</div>
          <div className="sailing-logo">SETTING SAIL...</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.12em', marginTop: '0.5rem' }}>
            SAILING THE NEW WORLD SECTOR
          </div>
          <div className="sailing-waves">
            <div className="wave-path"></div>
          </div>
        </div>
      )}

      <div className="alliance-slots-section">
        <div className="sect-hdr" style={{ marginBottom: '0.5rem' }}>
          <div className="sect-ttl">PIRATE ALLIANCE COMMAND BRIDGE</div>
          <div className="sect-id">// FLEET_SLOTS</div>
          <div className="sect-count">{alliance.length} OF 5 SLOTS ACTIVE</div>
        </div>
        <div className="sect-div" style={{ marginBottom: '1.5rem' }}></div>

        {/* 5 Slot Alliance Rows */}
        <div className="alliance-slots-row">
          {Array.from({ length: 5 }).map((_, idx) => {
            const member = alliance[idx];
            if (member) {
              return (
                <div key={member.name} className="alliance-slot-card filled">
                  <div className="slot-idx">SLOT_0{idx + 1}</div>
                  <button
                    className="slot-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(member);
                      addLog(`${member.name.toUpperCase()} HAS DISEMBARKED`);
                    }}
                  >
                    ✕
                  </button>
                  <img src={member.image} alt={member.name} className="slot-img" />
                  <div className="slot-name">{member.name.split(' ').pop()}</div>
                  <div className="slot-role">{member.role.split('/')[0]}</div>
                </div>
              );
            }
            return (
              <div key={`empty-${idx}`} className="alliance-slot-card">
                <div className="slot-idx">SLOT_0{idx + 1}</div>
                <div className="slot-empty-label">
                  <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.3rem', color: 'var(--gold)' }}>+</span>
                  STANDBY
                </div>
              </div>
            );
          })}
        </div>

        {/* Remaining Recruitment Pool */}
        <div className="alliance-pool-section">
          <div className="alliance-pool-header">REMAINING FLEET CANDIDATES</div>
          {remainingPool.length === 0 ? (
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
              ALL COMMANDERS ENLISTED IN STRAW HAT ALLIANCE
            </div>
          ) : (
            <div className="alliance-pool-grid">
              {remainingPool.map((candidate) => (
                <div
                  key={candidate.name}
                  className="pool-card"
                  onClick={() => {
                    if (alliance.length >= 5) {
                      showToast('FLEET COMMAND LIMIT REACHED (MAX 5 MEMBERS)');
                      return;
                    }
                    onAdd(candidate);
                    addLog(`${candidate.name.toUpperCase()} JOINED THE FLEET COMMAND`);
                  }}
                >
                  <img src={candidate.image} alt={candidate.name} className="pool-img" onerror="this.src='/one_piece/Straw Hat Pirates.jpeg'" />
                  <div className="pool-name">{candidate.name.split(' ').pop()}</div>
                  <div className="pool-role">{candidate.role.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TELEMETRY & SYNERGY SIDEBAR */}
      <div className="alliance-telemetry-side">
        <div className="console-title">ALLIANCE TELEMETRY</div>

        {/* Radar Compass Display */}
        <div className="radar-compass-wrap">
          <div className="radar-ring"></div>
          <div className="radar-line"></div>
          <div className="alliance-bounty-dial">
            <div className="alliance-bounty-val">
              <span className="bounty-symbol">฿</span>
              {(totalBounty / 1000000000).toFixed(2)}B
            </div>
            <div className="alliance-bounty-label">ALLIANCE BOUNTY</div>
          </div>
        </div>

        {/* Dynamic Alliance Synergy Averages */}
        <div className="side-specs">
          <div className="console-title" style={{ fontSize: '1.1rem', paddingBottom: '0.25rem', marginTop: '0.5rem' }}>
            SYNERGY SPECS
          </div>

          {[
            { key: 'haki', label: 'Average Fleet Haki', color: 'var(--red)' },
            { key: 'combat', label: 'Average Combat Velocity', color: '#ff3b47' },
            { key: 'intellect', label: 'Fleet Tactical Deciphering', color: 'var(--cyber-blue)' },
            { key: 'navigation', label: 'Fleet Navigation Competence', color: 'var(--lime)' },
            { key: 'engineering', label: 'Fleet Shipwright Armor', color: 'var(--gold)' }
          ].map(stat => (
            <div className="spec-bar-row" key={stat.key}>
              <div className="spec-label">
                <span>{stat.label}</span>
                <span style={{ color: stat.color }}>{averages[stat.key as keyof typeof averages]}%</span>
              </div>
              <div className="spec-bar-outer">
                <div
                  className="spec-bar-inner"
                  style={{
                    width: `${averages[stat.key as keyof typeof averages]}%`,
                    backgroundColor: stat.color,
                    color: stat.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Terminal Log */}
        <div className="alliance-terminal-log">
          <div className="terminal-title">OS_FLEET_CONSOLE</div>
          {logs.map((log, idx) => (
            <div key={idx} className={idx === 0 ? 'terminal-msg' : ''}>{log}</div>
          ))}
        </div>

        <button
          className="alliance-action-btn"
          style={{ marginTop: '0.5rem' }}
          onClick={handleLaunch}
        >
          SET SAIL FOR LAUGH TALE ▶
        </button>
      </div>
    </div>
  );
};
