import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './styles/App.css';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Home/Hero';
import { Manifest } from './components/Home/Manifest';
import { Transmissions } from './components/Home/Transmissions';
import { SeriesHero } from './components/Series/SeriesHero';
import { EpisodeList } from './components/Series/EpisodeList';
import { ChallengeHeader } from './components/Challenge/ChallengeHeader';
import { Brief } from './components/Challenge/Brief';
import { Resources } from './components/Challenge/Resources';
import { CTFComponent } from './components/Challenge/CTFComponent';
import { Toast } from './components/Common/Toast';
import { apiRequest } from './hooks/useApi';
import { useCtf } from './hooks/useCtf';
import { BountyDeck, CrewMember } from './components/Home/BountyDeck';
import { AllianceBuilder } from './components/Home/AllianceBuilder';

import type { Arc, Episode, Challenge } from './types';
import { AvatarSelectorModal } from './components/Common/AvatarSelectorModal';
import { getArcCover } from './lib/imageMapping';
import { CyberCanvas } from './components/Common/CyberCanvas';

const USER_ID = 'AK_0xD4';

function parseRoute() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  // Match /episode/:arcId/:episodeId/ctf/:challengeId
  const ctfChalMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/ctf\/([^/]+)$/);
  if (ctfChalMatch) return { screen: 's-ep' as const, tab: 'ctf' as const, arcId: ctfChalMatch[1], episodeId: ctfChalMatch[2], challengeId: decodeURIComponent(ctfChalMatch[3]) };

  // Match /episode/:arcId/:episodeId/ctf
  const ctfMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/ctf$/);
  if (ctfMatch) return { screen: 's-ep' as const, tab: 'ctf' as const, arcId: ctfMatch[1], episodeId: ctfMatch[2], challengeId: null };

  // Match /episode/:arcId/:episodeId/resources
  const resMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/resources$/);
  if (resMatch) return { screen: 's-ep' as const, tab: 'res' as const, arcId: resMatch[1], episodeId: resMatch[2], challengeId: null };

  // Match /episode/:arcId/:episodeId
  const epMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)$/);
  if (epMatch) return { screen: 's-ep' as const, tab: 'brief' as const, arcId: epMatch[1], episodeId: epMatch[2], challengeId: null };

  if (path === '/series') return { screen: 's-series' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
  if (path === '/bounty') return { screen: 's-bounty' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
  if (path === '/alliance') return { screen: 's-alliance' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };

  return { screen: 's-home' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
}

type Route = ReturnType<typeof parseRoute>;

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [toast, setToast] = useState({ msg: '', show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── DATA STATE ──
  const [userXp, setUserXp] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [arcEpisodes, setArcEpisodes] = useState<Record<number, Episode[]>>({});
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [apiError, setApiError] = useState('');
  const [curArc, setCurArc] = useState<number | null>(null);

  // ── ALLIANCE STATE ──
  const [alliance, setAlliance] = useState<CrewMember[]>([]);

  const recruitMember = useCallback((member: CrewMember) => {
    setAlliance(prev => {
      if (prev.some(m => m.name === member.name)) return prev;
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, member];
    });
  }, []);

  const removeMember = useCallback((member: CrewMember) => {
    setAlliance(prev => {
      return prev.filter(m => m.name !== member.name);
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ msg: '', show: false }), 2600);
  }, []);

  // ── CUSTOM AVATAR & VOLUME COVER CUSTOMIZER ──
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('user_avatar') || '/one_piece/avatar/Monkey D Luffy.jpeg';
  });
  const [arcCovers, setArcCovers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('arc_covers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return {};
  });
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarModalMode, setAvatarModalMode] = useState<'player' | { arcId: number }>('player');

  const openPlayerAvatarSelector = useCallback(() => {
    setAvatarModalMode('player');
    setAvatarModalOpen(true);
  }, []);

  const openArcCoverSelector = useCallback((arcId: number) => {
    setAvatarModalMode({ arcId });
    setAvatarModalOpen(true);
  }, []);

  const handleAvatarSelect = useCallback((avatarUrl: string) => {
    if (avatarModalMode === 'player') {
      setUserAvatar(avatarUrl);
      localStorage.setItem('user_avatar', avatarUrl);
      showToast('PLAYER PROFILE AVATAR UPDATED');
    } else {
      const arcId = avatarModalMode.arcId;
      setArcCovers(prev => {
        const updated = { ...prev, [arcId]: avatarUrl };
        localStorage.setItem('arc_covers', JSON.stringify(updated));
        return updated;
      });
      showToast(`VOLUME V${arcId} COVER ART CUSTOMIZED`);
    }
  }, [avatarModalMode, showToast]);

  const { gctf, setGctf, submitFlag, toggleCTFHint, shake, flagInputRef } = useCtf(
    USER_ID,
    showToast,
    useCallback(() => {
      setChallengesSolved(prev => prev + 1);
    }, [])
  );

  const applyRoute = useCallback((nextRoute: Route) => {
    setRoute(nextRoute);
    setGctf((prev: any) => ({
      ...prev,
      phase: nextRoute.challengeId ? 'challenge' : 'board',
      active: nextRoute.challengeId || null,
    }));
  }, [setGctf]);

  // ── FETCH ALL DATA ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataStatus('loading');
        const [arcsData, chalData, progData] = await Promise.all([
          apiRequest('/api/arcs'),
          apiRequest('/api/challenges'),
          apiRequest(`/api/progress/${USER_ID}`),
        ]);

        const fetchedArcs: Arc[] = arcsData.arcs;
        setArcs(fetchedArcs);
        setChallenges(chalData.challenges);
        setUserXp(progData.xp);
        setChallengesSolved(progData.challengesSolved || 0);

        // Default to the first arc with episodes, or the first arc
        if (fetchedArcs.length > 0 && curArc === null) {
          setCurArc(fetchedArcs[0].id);
        }

        // Fetch episodes for all arcs
        const fullArcEpisodes: Record<number, Episode[]> = {};
        for (const arc of fetchedArcs) {
          const epData = await apiRequest(`/api/episodes/${arc.id}`);
          fullArcEpisodes[arc.id] = epData.episodes;
        }
        setArcEpisodes(fullArcEpisodes);

        // Map progress
        const solved: Record<string, any> = {};
        const chalAttempts: Record<string, number> = {};
        chalData.challenges.forEach((c: Challenge) => { chalAttempts[c.id] = c.attemptsAllowed; });
        progData.progress.forEach((p: any) => {
          const originalAttempts = chalData.challenges.find((c: Challenge) => c.id === p.challengeId)?.attemptsAllowed || 3;
          const attemptsRemaining = originalAttempts - p.attemptsUsed;
          const isFailed = !p.solved && attemptsRemaining <= 0;

          solved[p.challengeId] = { 
            attempts_used: p.attemptsUsed, 
            pts_earned: p.pointsEarned, 
            solved: p.solved,
            failed: isFailed
          };
          chalAttempts[p.challengeId] = Math.max(0, attemptsRemaining);
        });

        setGctf((prev: any) => ({ ...prev, solved, chalAttempts }));
        setDataStatus('ready');
      } catch (err: any) {
        console.error('Fetch error:', err);
        setApiError(err.message);
        setDataStatus('error');
      }
    };
    fetchData();
  }, [setGctf]);

  // ── POPSTATE ──
  useEffect(() => {
    const handlePopState = () => applyRoute(parseRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyRoute]);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    applyRoute(parseRoute());
    window.scrollTo(0, 0);
  }, [applyRoute]);

  // ── DERIVED DATA ──
  const totalEpisodes = useMemo(() => Object.values(arcEpisodes).reduce((sum, eps) => sum + eps.length, 0), [arcEpisodes]);
  const totalDomains = arcs.length;

  // Get the featured episode (active episode, or the last one from the first arc with episodes)
  const featuredEpisode = useMemo(() => {
    for (const eps of Object.values(arcEpisodes)) {
      const active = eps.find(e => e.active);
      if (active) return active;
    }
    return null;
  }, [arcEpisodes]);

  const featuredArc = useMemo(() => {
    if (!featuredEpisode) return arcs[0] || null;
    return arcs.find(a => a.id === featuredEpisode.arcId) || arcs[0] || null;
  }, [featuredEpisode, arcs]);

  // The current episode for the episode page
  const currentEpisode = useMemo(() => {
    if (!route.episodeId) return featuredEpisode;
    for (const eps of Object.values(arcEpisodes)) {
      const ep = eps.find(e => e.id === route.episodeId);
      if (ep) return ep;
    }
    return null;
  }, [route.episodeId, arcEpisodes, featuredEpisode]);

  const currentArc = useMemo(() => {
    if (!currentEpisode) return featuredArc;
    return arcs.find(a => a.id === currentEpisode.arcId) || featuredArc;
  }, [currentEpisode, arcs, featuredArc]);

  // Get recent/active episodes for the transmissions section
  const recentEpisodes = useMemo(() => {
    const all: (Episode & { arc?: Arc })[] = [];
    for (const arc of arcs) {
      const eps = arcEpisodes[arc.id] || [];
      eps.forEach(ep => all.push({ ...ep, arc }));
    }
    // Active episodes first, then by xp descending
    return all
      .sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || b.xp - a.xp)
      .slice(0, 4);
  }, [arcs, arcEpisodes]);

  // Selected arc for the series page
  const selectedArc = useMemo(() => arcs.find(a => a.id === curArc) || arcs[0] || null, [arcs, curArc]);

  // Episode base path for the current episode
  const episodeBasePath = currentEpisode && currentArc
    ? `/episode/${currentArc.id}/${currentEpisode.id}`
    : featuredEpisode && featuredArc
      ? `/episode/${featuredArc.id}/${featuredEpisode.id}`
      : '/episode/3/S2E3';

  return (
    <div className="ephemeral-app">
      <CyberCanvas />
      {route.screen === 's-home' && (
        <div className="scr on">
          <Navbar onHome={() => navigate('/')} onSeries={() => navigate('/series')} userXp={userXp} userId={USER_ID} showToast={showToast} activeTab="home" navigate={navigate} challengesSolved={challengesSolved} userAvatar={userAvatar} onChangeAvatar={openPlayerAvatarSelector} />
          <Hero
            onPlay={() => navigate(episodeBasePath)}
            onMoreInfo={() => navigate('/series')}
            featuredEpisode={featuredEpisode}
            featuredArc={featuredArc}
            totalEpisodes={totalEpisodes}
            totalDomains={totalDomains}
            arcCoverUrl={featuredArc ? (arcCovers[featuredArc.id] || getArcCover(featuredArc.id)) : undefined}
            onChangeCover={featuredArc ? () => openArcCoverSelector(featuredArc.id) : undefined}
          />
          <Manifest arcs={arcs} onShowSeries={() => navigate('/series')} />
          <Transmissions
            episodes={recentEpisodes}
            arcs={arcs}
            onNavigate={navigate}
          />
        </div>
      )}

      {route.screen === 's-series' && (
        <div className="scr on">
          <Navbar onHome={() => navigate('/')} onSeries={() => navigate('/series')} onBack={() => navigate('/')} userXp={userXp} userId={USER_ID} showToast={showToast} activeTab="series" navigate={navigate} challengesSolved={challengesSolved} userAvatar={userAvatar} onChangeAvatar={openPlayerAvatarSelector} />
          <SeriesHero
            arc={selectedArc}
            episodes={arcEpisodes[selectedArc?.id ?? 0] || []}
            onBack={() => navigate('/')}
            arcCoverUrl={selectedArc ? (arcCovers[selectedArc.id] || getArcCover(selectedArc.id)) : undefined}
            onChangeCover={selectedArc ? () => openArcCoverSelector(selectedArc.id) : undefined}
          />
          <div className="arc-strip">
            <span className="arc-label">ARC:</span>
            {arcs.map(arc => (
              <button
                key={arc.id}
                className={`arc-btn ${curArc === arc.id ? 'on' : ''}`}
                onClick={() => setCurArc(arc.id)}
                style={{ '--arc-acc': arc.accColor } as any}
              >
                V{arc.id} — {arc.arcName || arc.title}
              </button>
            ))}
          </div>
          <EpisodeList
            episodes={arcEpisodes[curArc ?? 0] || []}
            arc={selectedArc}
            onShowChallenge={(ep) => navigate(`/episode/${selectedArc?.id}/${ep.id}`)}
            loading={dataStatus === 'loading'}
            error={apiError || null}
          />
        </div>
      )}

      {route.screen === 's-bounty' && (
        <div className="scr on">
          <Navbar onHome={() => navigate('/')} onSeries={() => navigate('/series')} userXp={userXp} userId={USER_ID} showToast={showToast} activeTab="bounty" navigate={navigate} challengesSolved={challengesSolved} userAvatar={userAvatar} onChangeAvatar={openPlayerAvatarSelector} />
          <BountyDeck onRecruit={recruitMember} recruitedIds={alliance.map(m => m.name)} showToast={showToast} />
        </div>
      )}

      {route.screen === 's-alliance' && (
        <div className="scr on">
          <Navbar onHome={() => navigate('/')} onSeries={() => navigate('/series')} userXp={userXp} userId={USER_ID} showToast={showToast} activeTab="alliance" navigate={navigate} challengesSolved={challengesSolved} userAvatar={userAvatar} onChangeAvatar={openPlayerAvatarSelector} />
          <AllianceBuilder alliance={alliance} onRemove={removeMember} onAdd={recruitMember} showToast={showToast} />
        </div>
      )}

      {route.screen === 's-ep' && (
        <div className="scr on">
          <Navbar onHome={() => navigate('/')} onSeries={() => navigate('/series')} onBack={() => navigate('/series')} userXp={userXp} userId={USER_ID} showToast={showToast} nodeId={currentEpisode?.id || 'EPISODE'} navigate={navigate} challengesSolved={challengesSolved} userAvatar={userAvatar} onChangeAvatar={openPlayerAvatarSelector} />
          <div className="ch-wrap">
            <ChallengeHeader
              episode={currentEpisode}
              arc={currentArc}
              challenges={challenges}
              onBack={() => navigate('/series')}
            />
            <div className="tabs-l">
              <button className={`tl ${route.tab === 'brief' ? 'on' : ''}`} onClick={() => navigate(episodeBasePath)}>BRIEF</button>
              <button className={`tl ${route.tab === 'res' ? 'on' : ''}`} onClick={() => navigate(`${episodeBasePath}/resources`)}>RESOURCES</button>
              <button className={`tl ${route.tab === 'ctf' ? 'on' : ''}`} onClick={() => navigate(`${episodeBasePath}/ctf`)}>CTF ARENA</button>
            </div>
            {route.tab === 'brief' && <Brief episode={currentEpisode} arc={currentArc} onStartResources={() => navigate(`${episodeBasePath}/resources`)} />}
            {route.tab === 'res' && <Resources episode={currentEpisode} onEnterArena={() => navigate(`${episodeBasePath}/ctf`)} />}
            {route.tab === 'ctf' && (
              <CTFComponent gctf={gctf} setGctf={setGctf} setUserXp={setUserXp} showToast={showToast} challenges={challenges} navigate={navigate} dataStatus={dataStatus} apiError={apiError} submitFlag={submitFlag} toggleCTFHint={toggleCTFHint} shake={shake} flagInputRef={flagInputRef} episodeBasePath={episodeBasePath} />
            )}
          </div>
        </div>
      )}

      <div className="sbar">
        <span>EPHEMERAL_OS</span><span className="sbar-sep">|</span>
        <span>STATUS: <span className="sbar-v">{dataStatus === 'ready' ? 'CONNECTED' : dataStatus === 'loading' ? 'SYNCING...' : 'ERROR'}</span></span><span className="sbar-sep">|</span>
        <span>ARCS: <span className="sbar-v">{totalDomains}</span></span><span className="sbar-sep">|</span>
        <span>EPISODES: <span className="sbar-v">{totalEpisodes}</span></span><span className="sbar-sep">|</span>
        <span>XP: <span className="sbar-v">{userXp}</span></span>
        <div className="sbar-r">
          <span>USER: <span className="sbar-v">{USER_ID}</span></span>
        </div>
      </div>
      <Toast message={toast.msg} show={toast.show} />
      <AvatarSelectorModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={avatarModalMode === 'player' ? userAvatar : (selectedArc ? (arcCovers[selectedArc.id] || getArcCover(selectedArc.id)) : '')}
        title={avatarModalMode === 'player' ? 'Choose Commander Avatar' : `Set Volume V${(avatarModalMode as any).arcId} Cover Art`}
      />
    </div>
  );
}
