import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './styles/App.css';
import { ARCS as STATIC_ARCS, EPISODES as STATIC_EPISODES, CHALLENGES as STATIC_CHALLENGES } from './data/content';
import { Navbar } from './components/Layout/Navbar';
import { Hero } from './components/Home/Hero';
import { Manifest } from './components/Home/Manifest';
import { Transmissions } from './components/Home/Transmissions';
import { ActivityFeed } from './components/Home/ActivityFeed';
import { SeriesHero } from './components/Series/SeriesHero';
import { EpisodeList } from './components/Series/EpisodeList';
import { Toast } from './components/Common/Toast';
import { AuthGate } from './components/Common/AuthGate';
import { Leaderboard } from './components/Common/Leaderboard';
import { AvatarSelectorModal } from './components/Common/AvatarSelectorModal';
import { ProfilePage } from './components/Common/ProfilePage';
import { SearchOverlay } from './components/Common/SearchOverlay';
import { AlgorithmsPage }      from './components/domains/AlgorithmsPage';
import { DataStructuresPage }  from './components/domains/DataStructuresPage';
import { CompProgPage }        from './components/domains/CompProgPage';
import { ProgrammingBasicsPage } from './components/domains/ProgrammingBasicsPage';
import { CybersecurityPage }   from './components/domains/CybersecurityPage';
import { MachineLearningPage } from './components/domains/MachineLearningPage';
import { NetworksPage }        from './components/domains/NetworksPage';
import { MathematicsPage }     from './components/domains/MathematicsPage';
import { ProbabilityPage }     from './components/domains/ProbabilityPage';
import type { DomainPageProps } from './components/domains/types';
import { apiRequest } from './hooks/useApi';
import { useCtf } from './hooks/useCtf';
import { BootTour } from './components/Effects/BootTour';

import type { Arc, Episode, Challenge } from './types';
import { getArcCover } from './lib/imageMapping';

// ── Domain registry — one entry per domain, maps to its own page component ──
const DOMAIN_REGISTRY: Record<string, React.ComponentType<DomainPageProps>> = {
  'ALGORITHMS':         AlgorithmsPage,
  'DATA STRUCTURES':    DataStructuresPage,
  'COMP. PROG':         CompProgPage,
  'PROGRAMMING BASICS': ProgrammingBasicsPage,
  'CYBERSECURITY':      CybersecurityPage,
  'MACHINE LEARNING':   MachineLearningPage,
  'NETWORKS':           NetworksPage,
  'MATHEMATICS':        MathematicsPage,
  'PROBABILITY':        ProbabilityPage,
};

// ── Route parsing ──────────────────────────────────────────────────────────
function parseRoute() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  const ctfChalMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/ctf\/([^/]+)$/);
  if (ctfChalMatch) return { screen: 's-ep' as const, tab: 'ctf' as const, arcId: ctfChalMatch[1], episodeId: ctfChalMatch[2], challengeId: decodeURIComponent(ctfChalMatch[3]) };

  const ctfMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/ctf$/);
  if (ctfMatch) return { screen: 's-ep' as const, tab: 'ctf' as const, arcId: ctfMatch[1], episodeId: ctfMatch[2], challengeId: null };

  const resMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)\/resources$/);
  if (resMatch) return { screen: 's-ep' as const, tab: 'res' as const, arcId: resMatch[1], episodeId: resMatch[2], challengeId: null };

  const epMatch = path.match(/^\/episode\/([^/]+)\/([^/]+)$/);
  if (epMatch) return { screen: 's-ep' as const, tab: 'brief' as const, arcId: epMatch[1], episodeId: epMatch[2], challengeId: null };

  if (path === '/series')      return { screen: 's-series' as const,      tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
  if (path === '/leaderboard') return { screen: 's-leaderboard' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
  if (path === '/profile')     return { screen: 's-profile' as const,     tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };

  return { screen: 's-home' as const, tab: 'brief' as const, arcId: null, episodeId: null, challengeId: null };
}

type Route = ReturnType<typeof parseRoute>;

// ── Auth helpers ───────────────────────────────────────────────────────────
function getSavedUser(): { id: string; name: string } | null {
  const id = localStorage.getItem('ephemeral_user_id');
  const name = localStorage.getItem('ephemeral_display_name');
  if (id && name) return { id, name };
  return null;
}

export default function App() {
  // ── Auth ──
  const [user, setUser] = useState<{ id: string; name: string } | null>(getSavedUser);

  const handleAuth = useCallback((userId: string, displayName: string) => {
    setUser({ id: userId, name: displayName });
  }, []);

  // ── Routing ──
  const [route, setRoute] = useState<Route>(parseRoute);

  // ── Toast ──
  const [toast, setToast] = useState({ msg: '', show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ msg: '', show: false }), 2600);
  }, []);

  // ── Data ──
  const [userXp, setUserXp] = useState(0);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [arcEpisodes, setArcEpisodes] = useState<Record<number, Episode[]>>({});
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [apiError, setApiError] = useState('');
  const [curArc, setCurArc] = useState<number | null>(null);

  // ── Challenge stats (first blood + solve counts) ──
  const [chalStats, setChalStats] = useState<Record<string, { solveCount: number; firstBlood: string | null }>>({});

  // ── Search overlay ──
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Immersive Tour Onboarding State ──
  const [showTour, setShowTour] = useState(false);

  // Auto trigger tour if they have not completed it yet
  useEffect(() => {
    if (user) {
      const tourCompleted = localStorage.getItem('ephemeral_tour_completed');
      if (!tourCompleted) {
        // Auto trigger onboarding tour after a brief delay so page is fully rendered
        const timer = setTimeout(() => setShowTour(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // Award XP — optimistic update, syncs to server in background
  const awardCalibrationXp = useCallback(async (xp: number) => {
    if (!user) return;
    setUserXp(prev => prev + xp);
    showToast(`CALIBRATION COMPLETE: +${xp} XP INTEGRATED`);
    try {
      await apiRequest(`/api/progress/${encodeURIComponent(user.id)}/add-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp }),
      });
    } catch (err) {
      // Silently revert is not ideal but avoids blocking the UI for a bonus award
      console.warn('Calibration XP sync failed:', err instanceof Error ? err.message : err);
    }
  }, [user, showToast]);

  // ── Avatar / cover customization ──
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('user_avatar') || '/one_piece/1.jpeg');
  const [arcCovers, setArcCovers] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem('arc_covers') || '{}'); } catch { return {}; }
  });
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarModalMode, setAvatarModalMode] = useState<'player' | { arcId: number }>('player');

  const openPlayerAvatarSelector = useCallback(() => { setAvatarModalMode('player'); setAvatarModalOpen(true); }, []);
  const openArcCoverSelector = useCallback((arcId: number) => { setAvatarModalMode({ arcId }); setAvatarModalOpen(true); }, []);

  const handleAvatarSelect = useCallback((url: string) => {
    if (avatarModalMode === 'player') {
      setUserAvatar(url);
      localStorage.setItem('user_avatar', url);
      showToast('OPERATOR AVATAR UPDATED');
    } else {
      const arcId = (avatarModalMode as { arcId: number }).arcId;
      setArcCovers(prev => {
        const next = { ...prev, [arcId]: url };
        localStorage.setItem('arc_covers', JSON.stringify(next));
        return next;
      });
      showToast(`VOLUME V${arcId} COVER UPDATED`);
    }
  }, [avatarModalMode, showToast]);

  // ── CTF hook ──
  const { gctf, setGctf, submitFlag, toggleCTFHint, shake, flagInputRef } = useCtf(
    user?.id || 'ANONYMOUS',
    showToast,
    useCallback(() => setChallengesSolved(p => p + 1), []),
  );

  const applyRoute = useCallback((nextRoute: Route) => {
    setRoute(nextRoute);
    setGctf((prev: any) => ({
      ...prev,
      phase: nextRoute.challengeId ? 'challenge' : 'board',
      active: nextRoute.challengeId || null,
    }));
  }, [setGctf]);

  // ── Fetch all data (after auth) ──
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setDataStatus('loading');
        const [arcsData, chalData, progData] = await Promise.all([
          apiRequest('/api/arcs'),
          apiRequest('/api/challenges'),
          apiRequest(`/api/progress/${encodeURIComponent(user.id)}`),
        ]);

        const fetchedArcs: Arc[] = arcsData.arcs;
        setArcs(fetchedArcs);
        setChallenges(chalData.challenges);
        setUserXp(progData.xp);
        setChallengesSolved(progData.challengesSolved || 0);

        if (fetchedArcs.length > 0 && curArc === null) setCurArc(fetchedArcs[0].id);

        const allEps: Record<number, Episode[]> = {};
        await Promise.all(fetchedArcs.map(async arc => {
          const ep = await apiRequest(`/api/episodes/${arc.id}`);
          allEps[arc.id] = ep.episodes;
        }));
        setArcEpisodes(allEps);

        const solved: Record<string, any> = {};
        const chalAttempts: Record<string, number> = {};
        chalData.challenges.forEach((c: Challenge) => { chalAttempts[c.id] = c.attemptsAllowed; });
        progData.progress.forEach((p: any) => {
          const orig = chalData.challenges.find((c: Challenge) => c.id === p.challengeId)?.attemptsAllowed || 3;
          const rem = orig - p.attemptsUsed;
          solved[p.challengeId] = { attempts_used: p.attemptsUsed, pts_earned: p.pointsEarned, solved: p.solved, failed: !p.solved && rem <= 0 };
          chalAttempts[p.challengeId] = Math.max(0, rem);
        });
        setGctf((prev: any) => ({ ...prev, solved, chalAttempts }));
        setDataStatus('ready');
      } catch {
        // API unavailable — fall back to static content so the UI stays functional.
        // Don't surface an error; the app works normally with static data.
        const staticArcs = STATIC_ARCS as Arc[];
        setArcs(staticArcs);
        setChallenges(STATIC_CHALLENGES as Challenge[]);
        if (curArc === null && staticArcs.length > 0) setCurArc(staticArcs[0].id);
        const staticEps: Record<number, Episode[]> = {};
        staticArcs.forEach(arc => {
          staticEps[arc.id] = STATIC_EPISODES
            .filter(e => e.arcId === arc.id)
            .map(e => ({ locked: false, active: false, done: false, ...e } as Episode));
        });
        setArcEpisodes(staticEps);
        setDataStatus('ready');
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setGctf]);

  // ── Fetch challenge stats (solve counts, first blood) ──
  useEffect(() => {
    if (!user) return;
    const fetchStats = () => {
      apiRequest('/api/stats/challenges')
        .then(d => setChalStats(d.stats || {}))
        .catch(() => {});
    };
    fetchStats();
    const iv = setInterval(fetchStats, 60_000);
    return () => clearInterval(iv);
  }, [user]);

  // ── Browser back/forward ──
  useEffect(() => {
    const handle = () => applyRoute(parseRoute());
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, [applyRoute]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    applyRoute(parseRoute());
    window.scrollTo(0, 0);
  }, [applyRoute]);


  const totalEpisodes = useMemo(() => Object.values(arcEpisodes).reduce((s, eps) => s + eps.length, 0), [arcEpisodes]);
  const totalDomains = arcs.length;

  const featuredEpisode = useMemo(() => {
    for (const eps of Object.values(arcEpisodes)) {
      const active = eps.find(e => e.active);
      if (active) return active;
    }
    return null;
  }, [arcEpisodes]);

  const featuredArc = useMemo(() =>
    featuredEpisode ? (arcs.find(a => a.id === featuredEpisode.arcId) || arcs[0] || null) : (arcs[0] || null),
    [featuredEpisode, arcs]);

  const currentEpisode = useMemo(() => {
    if (!route.episodeId) return featuredEpisode;
    for (const eps of Object.values(arcEpisodes)) {
      const ep = eps.find(e => e.id === route.episodeId);
      if (ep) return ep;
    }
    return null;
  }, [route.episodeId, arcEpisodes, featuredEpisode]);

  const currentArc = useMemo(() =>
    currentEpisode ? (arcs.find(a => a.id === currentEpisode.arcId) || featuredArc) : featuredArc,
    [currentEpisode, arcs, featuredArc]);

  const recentEpisodes = useMemo(() => {
    const all: (Episode & { arc?: Arc })[] = [];
    for (const arc of arcs) {
      (arcEpisodes[arc.id] || []).forEach(ep => all.push({ ...ep, arc }));
    }
    return all.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || b.xp - a.xp).slice(0, 4);
  }, [arcs, arcEpisodes]);

  const selectedArc = useMemo(() => arcs.find(a => a.id === curArc) || arcs[0] || null, [arcs, curArc]);

  const ctfChallenges = useMemo(() => {
    const episodeId = currentEpisode?.id;
    if (!episodeId) return [];
    return challenges.filter(c => c.episodeId === episodeId);
  }, [currentEpisode, challenges]);

  const episodeBasePath = (currentEpisode && currentArc)
    ? `/episode/${currentArc.id}/${currentEpisode.id}`
    : (featuredEpisode && featuredArc)
    ? `/episode/${featuredArc.id}/${featuredEpisode.id}`
    : '/episode/1/S1E1_A1';

  const getChallengePath = useCallback((ch: Challenge) => {
    for (const [arcId, eps] of Object.entries(arcEpisodes)) {
      const ep = eps.find(e => e.id === ch.episodeId);
      if (ep) return `/episode/${arcId}/${ep.id}/ctf/${encodeURIComponent(ch.id)}`;
    }
    // Fallback: use the featured episode path so the challenge still resolves
    const fallbackBase = featuredArc && featuredEpisode
      ? `/episode/${featuredArc.id}/${featuredEpisode.id}`
      : '/episode/1/S1E1_A1';
    return `${fallbackBase}/ctf/${encodeURIComponent(ch.id)}`;
  }, [arcEpisodes, featuredArc, featuredEpisode]);

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!user) return <AuthGate onAuth={handleAuth} />;

  // ── Shared Navbar props ──
  const navProps = {
    onHome: () => navigate('/'),
    onSeries: () => navigate('/series'),
    userXp,
    userId: user.id,
    displayName: user.name,
    showToast,
    navigate,
    challengesSolved,
    userAvatar,
    onChangeAvatar: openPlayerAvatarSelector,
    onOpenSearch: () => setSearchOpen(true),
    onOpenGuide: () => setShowTour(true),
  };

  return (
    <div className="ephemeral-app">

      {route.screen === 's-home' && (
        <div className="scr on">
          <Navbar {...navProps} activeTab="home" />
          <Hero
            onPlay={() => navigate(episodeBasePath)}
            onMoreInfo={() => navigate('/series')}
            featuredEpisode={featuredEpisode}
            featuredArc={featuredArc}
            totalEpisodes={totalEpisodes}
            totalDomains={totalDomains}
            arcCoverUrl={featuredArc ? (arcCovers[featuredArc.id] || getArcCover(featuredArc.id)) : undefined}
            onChangeCover={openArcCoverSelector}
            arcs={arcs}
            onArcSelect={(arcId) => { setCurArc(arcId); navigate('/series'); }}
            arcEpisodes={arcEpisodes}
            arcCovers={arcCovers}
            navigate={navigate}
          />
          <ActivityFeed challenges={challenges} currentUserId={user.id} />
          <Manifest arcs={arcs} onShowSeries={() => navigate('/series')} />
          <Transmissions episodes={recentEpisodes} arcs={arcs} onNavigate={navigate} />
        </div>
      )}

      {route.screen === 's-series' && (
        <div className="scr on">
          <Navbar {...navProps} activeTab="series" onBack={() => navigate('/')} />
          <SeriesHero
            arc={selectedArc}
            episodes={selectedArc ? (arcEpisodes[selectedArc.id] ?? []) : []}
            onBack={() => navigate('/')}
            arcCoverUrl={selectedArc ? (arcCovers[selectedArc.id] || getArcCover(selectedArc.id)) : undefined}
            onChangeCover={selectedArc ? () => openArcCoverSelector(selectedArc.id) : undefined}
          />
          <div className="arc-strip">
            <span className="arc-label">ARC:</span>
            {arcs.map(arc => (
              <button
                type="button"
                key={arc.id}
                className={`arc-btn ${curArc === arc.id ? 'on' : ''}`}
                onClick={() => setCurArc(arc.id)}
                style={{ '--arc-acc': arc.accColor } as React.CSSProperties}
              >
                <span className="arc-btn-name">V{arc.id} — {arc.arcName || arc.title}</span>
                <span className="arc-btn-domain">{arc.domain}</span>
              </button>
            ))}
          </div>
          <EpisodeList
            episodes={curArc != null ? (arcEpisodes[curArc] ?? []) : []}
            arc={selectedArc}
            onShowChallenge={(ep) => selectedArc && navigate(`/episode/${selectedArc.id}/${ep.id}`)}
            loading={dataStatus === 'loading'}
            error={apiError || null}
          />
        </div>
      )}

      {route.screen === 's-leaderboard' && (
        <div className="scr on">
          <Navbar {...navProps} activeTab="leaderboard" onBack={() => navigate('/')} />
          <Leaderboard currentUserId={user.id} navigate={navigate} />
        </div>
      )}

      {route.screen === 's-profile' && (
        <div className="scr on">
          <Navbar {...navProps} activeTab="profile" onBack={() => navigate('/')} />
          <ProfilePage
            userId={user.id}
            displayName={user.name}
            userAvatar={userAvatar}
            navigate={navigate}
            challengesSolved={challengesSolved}
            userXp={userXp}
            onChangeAvatar={openPlayerAvatarSelector}
          />
        </div>
      )}

      {route.screen === 's-ep' && (() => {
        const DomainPage = currentArc?.domain
          ? DOMAIN_REGISTRY[currentArc.domain] ?? null
          : null;
        return (
          <div className="scr on">
            <Navbar {...navProps} onBack={() => navigate('/series')} nodeId={currentEpisode?.id || 'EPISODE'} />
            {DomainPage && (
              <DomainPage
                arc={currentArc}
                episode={currentEpisode}
                challenges={ctfChallenges}
                gctf={gctf}
                submitFlag={submitFlag}
                setUserXp={setUserXp}
                navigate={navigate}
                currentUserId={user.id}
                episodeBasePath={episodeBasePath}
                selectedProblemId={route.challengeId ?? undefined}
                tab={route.tab}
                showToast={showToast}
                dataStatus={dataStatus}
                apiError={apiError}
                toggleCTFHint={toggleCTFHint}
                shake={shake}
                flagInputRef={flagInputRef}
                chalStats={chalStats}
              />
            )}
          </div>
        );
      })()}

      {/* Status bar */}
      <div className="sbar">
        <span>EPHEMERAL_OS</span><span className="sbar-sep">|</span>
        <span>STATUS: <span className="sbar-v">{dataStatus === 'ready' ? 'CONNECTED' : dataStatus === 'loading' ? 'SYNCING...' : 'ERROR'}</span></span>
        <span className="sbar-sep">|</span>
        <span>ARCS: <span className="sbar-v">{totalDomains}</span></span>
        <span className="sbar-sep">|</span>
        <span>EPISODES: <span className="sbar-v">{totalEpisodes}</span></span>
        <span className="sbar-sep">|</span>
        <span>XP: <span className="sbar-v">{userXp}</span></span>
        <span className="sbar-sep">|</span>
        <span className="sbar-search-hint">Press <kbd>/</kbd> to search</span>
        <div className="sbar-r">
          <span>OPERATOR: <span className="sbar-v sbar-v--op">{user.name}</span></span>
          <button type="button" className="sbar-logout" onClick={() => {
            localStorage.removeItem('ephemeral_user_id');
            localStorage.removeItem('ephemeral_display_name');
            setUser(null);
          }}>⏏ LOGOUT</button>
        </div>
      </div>

      <Toast message={toast.msg} show={toast.show} />

      <AvatarSelectorModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={avatarModalMode === 'player' ? userAvatar : (selectedArc ? (arcCovers[selectedArc.id] || getArcCover(selectedArc.id)) : '')}
        title={avatarModalMode === 'player' ? 'Choose Operator Avatar' : `Set Volume V${(avatarModalMode as any).arcId} Cover Art`}
      />

      {/* Global Search Overlay */}
      {searchOpen && (
        <SearchOverlay
          challenges={challenges}
          gctf={gctf}
          navigate={navigate}
          getChallengePath={getChallengePath}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {/* Immersive Onboarding HUD Calibration Tour */}
      {showTour && (
        <BootTour 
          onClose={() => setShowTour(false)} 
          onAwardXp={awardCalibrationXp} 
        />
      )}
    </div>
  );
}
