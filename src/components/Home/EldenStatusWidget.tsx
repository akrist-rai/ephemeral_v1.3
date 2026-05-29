import React from 'react';

interface EldenStatusWidgetProps {
  build: string;
  userAvatar: string;
  navigate: (path: string) => void;
}

interface EldenClassData {
  name: string;
  rank: string;
  avatar: string;
  perk: string;
  description: string;
  questTitle: string;
  questDesc: string;
  questPath: string;
  stats: Record<string, number>;
}

const CLASS_DATA_MAP: Record<string, EldenClassData> = {
  SAMURAI: {
    name: 'CODING SAMURAI',
    rank: 'APPRENTICE WARRIOR',
    avatar: '/avatar/Roronoa Zoro.jpeg',
    perk: 'Katana Grace: +2 Hints allowed on algorithmic modules without XP decay.',
    description: 'Disciplined and sharp algorithm swordsman. Armed with Python blades.',
    questTitle: 'QUEST: SOLVE ARC V1 - COMPLEXITY BARRIER',
    questDesc: 'Defeat the O-Notation algorithms to establish basic system mastery.',
    questPath: '/episode/1/S1E1_A1',
    stats: { VIGOR: 75, MIND: 50, ENDURANCE: 80, DEXTERITY: 95, INTELLIGENCE: 55, FAITH: 40 }
  },
  ASTROLOGER: {
    name: 'NEURAL ASTROLOGER',
    rank: 'GRADIENT SAGE',
    avatar: '/avatar/Nami_.jpeg',
    perk: 'Tensor Flow: Earn +15% XP points for all Machine Learning & NLP modules.',
    description: 'Reads data patterns in multi-dimensional vector space. Master of tensor spells.',
    questTitle: 'QUEST: CONQUER ARC V3 - MACHINE CORE',
    questDesc: 'Predict weights and train advanced linear nodes in the digital GTA sands.',
    questPath: '/episode/3/S1E1',
    stats: { VIGOR: 40, MIND: 95, ENDURANCE: 55, DEXTERITY: 65, INTELLIGENCE: 90, FAITH: 75 }
  },
  VAGABOND: {
    name: 'CYBER VAGABOND',
    rank: 'ROUTING VETERAN',
    avatar: '/avatar/Monkey D Luffy (1).jpeg',
    perk: 'Root Shield: Absolute immunity to point decay on the very first wrong flag.',
    description: 'Rugged standard protocol and local network wanderer. Firewall specialist.',
    questTitle: 'QUEST: PENETRATE ARC V2 - SECURITY CORES',
    questDesc: 'Breach local routers and override binary gates in the main combat server.',
    questPath: '/episode/2/S1E1_A2',
    stats: { VIGOR: 85, MIND: 55, ENDURANCE: 90, DEXTERITY: 70, INTELLIGENCE: 60, FAITH: 45 }
  },
  PRISONER: {
    name: 'QUANTUM PRISONER',
    rank: 'FORBIDDEN DECRYPTOR',
    avatar: '/avatar/Itachi.jpeg',
    perk: 'Zero-Knowledge: Reveals hint blocks at 50% lower XP cost.',
    description: 'Imprisoned for decyphering government ciphers. Entropy specialist.',
    questTitle: 'QUEST: ENCRYPT ARC V8 - QUANTUM VOID',
    questDesc: 'Utilize entropy matrices and probabilities to decode active ciphers.',
    questPath: '/episode/8/S1E1_A8',
    stats: { VIGOR: 50, MIND: 85, ENDURANCE: 60, DEXTERITY: 75, INTELLIGENCE: 80, FAITH: 95 }
  },
  WRETCH: {
    name: 'THE CODE WRETCH',
    rank: 'TETHERED NOOB',
    avatar: '/avatar/Brook.jpeg',
    perk: 'Blank Slate: Enormous +25% XP bounty on your first three challenge solves.',
    description: 'Naked rookie equipped with only an unconfigured terminal. Infinite raw potential.',
    questTitle: 'QUEST: AWAKEN ARC V7 - MATH FOUNDATIONS',
    questDesc: 'Solve entry level algebra and boolean logic to establish raw brain nodes.',
    questPath: '/episode/7/S1E1_A7',
    stats: { VIGOR: 10, MIND: 10, ENDURANCE: 10, DEXTERITY: 10, INTELLIGENCE: 10, FAITH: 10 }
  }
};

export const EldenStatusWidget: React.FC<EldenStatusWidgetProps> = ({ build, userAvatar, navigate }) => {
  const activeClass = CLASS_DATA_MAP[build.toUpperCase()] || CLASS_DATA_MAP.WRETCH;

  return (
    <div className="elden-widget-wrap">
      <div className="elden-widget-header">
        <div className="ew-hdr-left">
          <div className="ew-hdr-gold-dot" />
          <span className="ew-hdr-title">TACTICAL SYSTEM OVERVIEW // OPERATOR STATUS</span>
        </div>
        <div className="ew-hdr-badge">ACTIVE CLASS: {activeClass.name}</div>
      </div>

      <div className="elden-widget-body">
        {/* Left: Avatar Portrait */}
        <div className="ew-portrait-wrap">
          <div className="ew-portrait-box">
            <img src={userAvatar || activeClass.avatar} alt="Operator Portrait" className="ew-portrait-img" />
            <div className="ew-portrait-glow" />
          </div>
        </div>

        {/* Middle: Attributes Progress Bars */}
        <div className="ew-stats-box">
          <div className="panel-list-hdr" style={{ margin: 0, paddingBottom: '0.2rem' }}>ATTRIBUTES & CS PROFILE</div>
          <div className="ew-stat-grid">
            {Object.entries(activeClass.stats).map(([statName, val]) => (
              <div className="elden-stat-bar-row" key={statName}>
                <div className="es-bar-top" style={{ fontSize: '0.42rem' }}>
                  <span className="es-bar-name">{statName}</span>
                  <span className="es-bar-val">{val}</span>
                </div>
                <div className="es-bar-track" style={{ height: '4px' }}>
                  <div
                    className="es-bar-fill"
                    style={{
                      width: `${val}%`,
                      background: val > 60 ? '#ffb830' : val > 30 ? '#4fc3f7' : '#ef5350'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="elden-perk-box" style={{ padding: '0.4rem 0.6rem', marginTop: '0.3rem' }}>
            <div className="ep-box-title" style={{ fontSize: '0.38rem', margin: 0 }}>ACTIVE INHERENT PERK</div>
            <div className="ep-box-desc" style={{ fontSize: '0.45rem' }}>{activeClass.perk}</div>
          </div>
        </div>

        {/* Right: Quest Recommend & Jump CTA */}
        <div className="ew-quest-box">
          <div className="ew-quest-top">
            <span className="ew-quest-lbl">// SYSTEM QUEST RECOMMENDATION</span>
            <span className="ew-quest-title">{activeClass.questTitle}</span>
            <span className="ew-quest-desc">{activeClass.questDesc}</span>
          </div>

          <button className="ew-quest-btn" onClick={() => navigate(activeClass.questPath)}>
            ⚔ INITIATE MODULE ▶
          </button>
        </div>
      </div>
    </div>
  );
};
