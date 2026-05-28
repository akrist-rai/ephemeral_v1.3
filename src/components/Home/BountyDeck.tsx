import React, { useState, useMemo } from 'react';

export interface CrewMember {
  name: string;
  alias: string;
  role: string;
  bounty: number;
  image: string;
  category: 'straw_hat' | 'worst_generation' | 'emperor' | 'warlord';
  specialty: string;
  stats: {
    haki: number;
    combat: number;
    intellect: number;
    navigation: number;
    engineering: number;
  };
}

export const WANTED_CREW: CrewMember[] = [
  {
    name: 'Monkey D. Luffy',
    alias: 'Straw Hat Luffy',
    role: 'Captain',
    bounty: 3000000000,
    image: '/one_piece/_ (69).jpeg',
    category: 'straw_hat',
    specialty: 'Gear 5 Joyboy awakening, Conqueror Haki, infinite combat adaptibility.',
    stats: { haki: 98, combat: 99, intellect: 40, navigation: 30, engineering: 20 }
  },
  {
    name: 'Roronoa Zoro',
    alias: 'Pirate Hunter',
    role: 'Swordsman / Vice Captain',
    bounty: 1111000000,
    image: '/one_piece/_ (70).jpeg',
    category: 'straw_hat',
    specialty: 'Three-sword style mastery, King of Hell state, extreme durability.',
    stats: { haki: 92, combat: 96, intellect: 50, navigation: 5, engineering: 20 }
  },
  {
    name: 'Nami',
    alias: 'Cat Burglar',
    role: 'Navigator',
    bounty: 366000000,
    image: '/one_piece/_ (71).jpeg',
    category: 'straw_hat',
    specialty: 'Clima-Tact weather manipulation, Zeus companion, perfect navigation telemetry.',
    stats: { haki: 30, combat: 60, intellect: 95, navigation: 99, engineering: 65 }
  },
  {
    name: 'Usopp',
    alias: 'God Usopp',
    role: 'Sniper',
    bounty: 500000000,
    image: '/one_piece/_ (72).jpeg',
    category: 'straw_hat',
    specialty: 'Observation Haki, pop green projectile arsenal, legendary tactical deception.',
    stats: { haki: 75, combat: 68, intellect: 88, navigation: 45, engineering: 85 }
  },
  {
    name: 'Vinsmoke Sanji',
    alias: 'Black Leg',
    role: 'Chef / Combatant',
    bounty: 1032000000,
    image: '/one_piece/_ (73).jpeg',
    category: 'straw_hat',
    specialty: 'Ifrit Jambe blue-flame kicks, exoskeleton genetic enhancements, extreme speed.',
    stats: { haki: 85, combat: 94, intellect: 85, navigation: 50, engineering: 40 }
  },
  {
    name: 'Tony Tony Chopper',
    alias: 'Cotton Candy Lover',
    role: 'Doctor',
    bounty: 1000,
    image: '/one_piece/_ (74).jpeg',
    category: 'straw_hat',
    specialty: 'Monster Point giant transformation, Rumble Ball bio-hacking, panacea medical wisdom.',
    stats: { haki: 15, combat: 78, intellect: 98, navigation: 40, engineering: 50 }
  },
  {
    name: 'Nico Robin',
    alias: 'Devil Child',
    role: 'Archaeologist',
    bounty: 930000000,
    image: '/one_piece/_ (75).jpeg',
    category: 'straw_hat',
    specialty: 'Demonic giant flower-bloom clones, Poneglyph deciphering, high intel gathering.',
    stats: { haki: 60, combat: 85, intellect: 99, navigation: 55, engineering: 30 }
  },
  {
    name: 'Franky',
    alias: 'Iron Man Franky',
    role: 'Shipwright / Cyborg',
    bounty: 394000000,
    image: '/one_piece/_ (76).jpeg',
    category: 'straw_hat',
    specialty: 'Pluton blueprint memory, radical beam lasers, General Franky mech armor.',
    stats: { haki: 20, combat: 82, intellect: 80, navigation: 35, engineering: 98 }
  },
  {
    name: 'Brook',
    alias: 'Soul King',
    role: 'Musician / Swordsman',
    bounty: 383000000,
    image: '/one_piece/_ (77).jpeg',
    category: 'straw_hat',
    specialty: 'Cold soul-blade swordplay, astral projection, morale-boosting pirate symphonies.',
    stats: { haki: 50, combat: 80, intellect: 75, navigation: 40, engineering: 30 }
  },
  {
    name: 'Jinbe',
    alias: 'First Knight of the Sea',
    role: 'Helmsman',
    bounty: 1100000000,
    image: '/one_piece/_ (78).jpeg',
    category: 'straw_hat',
    specialty: 'Fish-Man Jujutsu ocean-current manipulation, supreme helmsman telemetry, armored defense.',
    stats: { haki: 88, combat: 92, intellect: 90, navigation: 85, engineering: 45 }
  },
  {
    name: 'Trafalgar Law',
    alias: 'Surgeon of Death',
    role: 'Alliance Captain',
    bounty: 3000000000,
    image: '/one_piece/_ (79).jpeg',
    category: 'worst_generation',
    specialty: 'Ope Ope no Mi spatial room fabrication, cellular injection, gamma-knife lasers.',
    stats: { haki: 90, combat: 95, intellect: 96, navigation: 75, engineering: 60 }
  },
  {
    name: 'Eustass Kid',
    alias: 'Captain Kid',
    role: 'Alliance Captain',
    bounty: 3000000000,
    image: '/one_piece/_ (80).jpeg',
    category: 'worst_generation',
    specialty: 'Punk Rotten magnetic mech creation, electromagnetism railguns, Conqueror Haki.',
    stats: { haki: 85, combat: 93, intellect: 78, navigation: 60, engineering: 88 }
  },
  {
    name: 'Red-Haired Shanks',
    alias: 'The Chief',
    role: 'Four Emperors (Yonko)',
    bounty: 4048900000,
    image: '/one_piece/_ (81).jpeg',
    category: 'emperor',
    specialty: 'Divine Departure strike, Haki-killer aura, future-sight Observation Haki.',
    stats: { haki: 100, combat: 100, intellect: 95, navigation: 85, engineering: 30 }
  },
  {
    name: 'Dracule Mihawk',
    alias: 'Hawkeye',
    role: 'World\'s Strongest Swordsman',
    bounty: 3590000000,
    image: '/one_piece/_ (82).jpeg',
    category: 'warlord',
    specialty: 'Black Blade Yoru slash waves, perfect visual observation, absolute swordplay defense.',
    stats: { haki: 95, combat: 99, intellect: 88, navigation: 50, engineering: 20 }
  }
];

interface BountyDeckProps {
  onRecruit?: (member: CrewMember) => void;
  recruitedIds?: string[];
  showToast: (msg: string) => void;
}

export const BountyDeck: React.FC<BountyDeckProps> = ({ onRecruit, recruitedIds = [], showToast }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CrewMember>(WANTED_CREW[0]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (name: string) => {
    setFlippedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredCrew = useMemo(() => {
    return WANTED_CREW.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                            member.alias.toLowerCase().includes(search.toLowerCase()) ||
                            member.role.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || member.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleRecruitClick = (member: CrewMember, e: React.MouseEvent) => {
    e.stopPropagation();
    if (recruitedIds.includes(member.name)) {
      showToast(`${member.name.toUpperCase()} IS ALREADY IN YOUR ALLIANCE`);
      return;
    }
    if (onRecruit) {
      onRecruit(member);
    }
  };

  const formatBounty = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="bounty-deck-container">
      <div className="bounty-deck-main">
        <div className="sect-hdr" style={{ marginBottom: '0.5rem' }}>
          <div className="sect-ttl">GRAND LINE BOUNTY DECK</div>
          <div className="sect-id">// WANTED_POSTERS</div>
          <div className="sect-count">{filteredCrew.length} TARGETS FOUND</div>
        </div>
        <div className="sect-div" style={{ marginBottom: '1.5rem' }}></div>

        <div className="bounty-filters-bar">
          <input
            type="text"
            className="bounty-search"
            placeholder="SEARCH BY CODENAME, ALIAS, OR SPEC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="bounty-filters">
            {['all', 'straw_hat', 'worst_generation', 'emperor', 'warlord'].map((cat) => (
              <button
                key={cat}
                className={`bounty-filter-btn ${activeCategory === cat ? 'on' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bounty-grid">
          {filteredCrew.map((member) => {
            const isFlipped = flippedCards[member.name] || false;
            const isRecruited = recruitedIds.includes(member.name);
            return (
              <div
                key={member.name}
                className={`wanted-crew-card ${isFlipped ? 'active-selection' : ''}`}
                onClick={() => {
                  setSelectedMember(member);
                  toggleFlip(member.name);
                }}
              >
                <div className="wanted-crew-card-inner">
                  {/* FRONT SIDE (Wanted Poster) */}
                  <div className="wanted-front">
                    <div className="wanted-header">WANTED</div>
                    <div className="wanted-img-container">
                      <img src={member.image} alt={member.name} className="wanted-img" onError={(e) => { e.currentTarget.src = '/one_piece/Straw Hat Pirates.jpeg'; }} />
                      {isRecruited && (
                        <div className="wanted-status-overlay" style={{ background: 'var(--lime)' }}>
                          ALLIED
                        </div>
                      )}
                    </div>
                    <div className="wanted-detail">
                      <div className="wanted-alias">{member.alias.toUpperCase()}</div>
                      <div className="wanted-name">{member.name.split(' ').pop()}</div>
                      <div className="wanted-role">{member.role}</div>
                      <div className="wanted-bounty">
                        <span className="bounty-symbol">฿</span>
                        {formatBounty(member.bounty)}-
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE (Cyber Details) */}
                  <div className="wanted-back">
                    <div>
                      <div className="wanted-header" style={{ borderBottomColor: 'var(--cyber-blue)', color: 'var(--cyber-blue)' }}>
                        TELEMETRY
                      </div>
                      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.55rem' }}>
                        <div><span style={{ color: 'var(--cyber-blue)' }}>FULL NAME:</span> {member.name}</div>
                        <div><span style={{ color: 'var(--cyber-blue)' }}>ALIAS:</span> {member.alias}</div>
                        <div><span style={{ color: 'var(--cyber-blue)' }}>ROLE:</span> {member.role}</div>
                        <div><span style={{ color: 'var(--cyber-blue)' }}>CATEGORY:</span> {member.category.replace('_', ' ').toUpperCase()}</div>
                      </div>
                      <div className="wanted-specialty" style={{ marginTop: '0.8rem', whiteSpace: 'normal', height: 'auto', fontSize: '0.52rem' }}>
                        {member.specialty}
                      </div>
                    </div>
                    <button
                      className="alliance-action-btn"
                      style={{ padding: '0.5rem', background: isRecruited ? 'var(--muted)' : 'var(--cyber-blue)', color: '#000', boxShadow: 'none' }}
                      onClick={(e) => handleRecruitClick(member, e)}
                    >
                      {isRecruited ? 'IN ALLIANCE' : 'ADD TO FLEET'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED TELEMETRY SIDEBAR */}
      <div className="bounty-deck-side">
        <div className="console-title">TARGET DETAILS</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src={selectedMember.image}
            alt={selectedMember.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid var(--gold)', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontFamily: 'var(--disp)', fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase' }}>
              {selectedMember.name}
            </div>
            <div style={{ fontSize: '0.52rem', color: 'var(--gold)', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              {selectedMember.role.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="sect-div" style={{ margin: '0.5rem 0' }}></div>

        <div style={{ fontSize: '0.58rem', lineHeight: '1.6', color: 'var(--paper)', minHeight: '80px' }}>
          <span style={{ color: 'var(--gold)' }}>SPECIALTY:</span> {selectedMember.specialty}
        </div>

        <div className="side-specs">
          <div className="console-title" style={{ fontSize: '1.1rem', paddingBottom: '0.25rem', marginTop: '0.5rem' }}>
            COMBAT STATS
          </div>

          {[
            { key: 'haki', label: 'Conqueror/Observation Haki', color: 'var(--red)' },
            { key: 'combat', label: 'Tactical Combat Speed', color: '#ff3b47' },
            { key: 'intellect', label: 'Deciphering & Logic', color: 'var(--cyber-blue)' },
            { key: 'navigation', label: 'Nautical Navigation', color: 'var(--lime)' },
            { key: 'engineering', label: 'Shipwright Systems', color: 'var(--gold)' }
          ].map(stat => (
            <div className="spec-bar-row" key={stat.key}>
              <div className="spec-label">
                <span>{stat.label}</span>
                <span style={{ color: stat.color }}>{selectedMember.stats[stat.key as keyof CrewMember['stats']]}%</span>
              </div>
              <div className="spec-bar-outer">
                <div
                  className="spec-bar-inner"
                  style={{
                    width: `${selectedMember.stats[stat.key as keyof CrewMember['stats']]}%`,
                    backgroundColor: stat.color,
                    color: stat.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="alliance-action-btn"
          onClick={(e) => handleRecruitClick(selectedMember, e)}
        >
          {recruitedIds.includes(selectedMember.name) ? 'ACTIVE ALLIANCE MEMBER' : 'RECRUIT TO ALLIANCE'}
        </button>
      </div>
    </div>
  );
};
