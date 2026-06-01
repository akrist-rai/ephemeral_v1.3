import React from 'react';
import type { DomainPageProps } from './types';
import type { Arc, Episode } from '../../types';

import { S1E1Signal, S1E1Playground, S1E1Synapse } from './ml/ML_S1E1';
import { S1E2Signal, S1E2Playground, S1E2Synapse } from './ml/ML_S1E2';
import { S1E3Signal, S1E3Playground, S1E3Synapse } from './ml/ML_S1E3';
import { S2E1Signal, S2E1Playground, S2E1Synapse } from './ml/ML_S2E1';
import { S2E2Signal, S2E2Playground, S2E2Synapse } from './ml/ML_S2E2';
import { S2E3Signal, S2E3Playground, S2E3Synapse } from './ml/ML_S2E3';

// ── Episode module registry ────────────────────────────────────────────────────
type EpModule = {
  Signal:     React.FC<{ arc: Arc | null; episode: Episode | null }>;
  Playground: React.FC;
  Synapse:    React.FC;
};

const EP_MODULES: Record<string, EpModule> = {
  S1E1: { Signal: S1E1Signal, Playground: S1E1Playground, Synapse: S1E1Synapse },
  S1E2: { Signal: S1E2Signal, Playground: S1E2Playground, Synapse: S1E2Synapse },
  S1E3: { Signal: S1E3Signal, Playground: S1E3Playground, Synapse: S1E3Synapse },
  S2E1: { Signal: S2E1Signal, Playground: S2E1Playground, Synapse: S2E1Synapse },
  S2E2: { Signal: S2E2Signal, Playground: S2E2Playground, Synapse: S2E2Synapse },
  S2E3: { Signal: S2E3Signal, Playground: S2E3Playground, Synapse: S2E3Synapse },
};

// Fallback arc overview (shown when episode ID is unrecognised)
const FallbackSignal: React.FC<{ arc: Arc | null; episode: Episode | null }> = ({ arc, episode }) => (
  <div className="ml-signal">
    <div className="ml-manifesto">
      <div className="ml-mani-eyebrow">// {arc?.arcName ?? 'MACHINE LEARNING ARC'}</div>
      <h2 className="ml-mani-h">
        You're not here to memorize equations.
        <br />
        <em className="ml-mani-em">You're here to build things that think.</em>
      </h2>
      <p className="ml-mani-p">
        {episode?.description ?? 'Select an episode to begin.'}
      </p>
    </div>
  </div>
);
const FallbackPlayground: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">◉</div>
      <div className="ep-stub-coming-label">Playground Unavailable</div>
      <p className="ep-stub-coming-sub">No playground registered for this episode.</p>
    </div>
  </div>
);
const FallbackSynapse: React.FC = () => (
  <div className="ep-stub">
    <div className="ep-stub-coming">
      <div className="ep-stub-coming-icon">◉</div>
      <div className="ep-stub-coming-label">Synapse Unavailable</div>
      <p className="ep-stub-coming-sub">No synapse registered for this episode.</p>
    </div>
  </div>
);

// ── Main export ────────────────────────────────────────────────────────────────
export const MachineLearningPage: React.FC<DomainPageProps> = ({
  arc, episode, challenges, tab, episodeBasePath, navigate,
  gctf: _gctf, setUserXp: _setUserXp, showToast: _showToast,
  dataStatus: _ds, apiError: _ae, submitFlag: _sf,
  toggleCTFHint: _tch, shake: _sk, flagInputRef: _fir,
  chalStats: _cs, currentUserId: _cui,
}) => {
  const mod = EP_MODULES[episode?.id ?? ''] ?? {
    Signal: FallbackSignal,
    Playground: FallbackPlayground,
    Synapse: FallbackSynapse,
  };

  return (
    <div className="ml-page">
      {/* Header */}
      <div className="ml-hdr">
        <button type="button" className="ml-back" onClick={() => navigate('/series')}>
          ← BACK TO SERIES
        </button>
        <div className="ml-hdr-meta">
          <span className="ml-domain-tag">{arc?.domain ?? 'MACHINE LEARNING'}</span>
          <span className="ml-ep-ref">// {arc?.arcName} · EPISODE {episode?.n}</span>
        </div>
        <h1 className="ml-title">
          {episode?.title ?? 'MACHINE LEARNING'}
          <em className="ml-title-em">_</em>
        </h1>
        <p className="ml-subtitle">{episode?.description}</p>
        <div className="ml-pills">
          <span className="ml-pill ml-pill-xp">⚡ {episode?.xp} XP</span>
          <span className="ml-pill">⏱ ~{episode?.min} MIN</span>
          {challenges.length > 0 && (
            <span className="ml-pill ml-pill-c">{challenges.length} CHALLENGES</span>
          )}
          <span className="ml-pill ml-pill-status">
            {episode?.done ? '✓ COMPLETED' : episode?.active ? '● ACTIVE' : 'AVAILABLE'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="ml-tabs">
        <button type="button"
          className={`ml-tab ${tab === 'brief' ? 'ml-tab-on' : ''}`}
          onClick={() => navigate(episodeBasePath)}
        >
          SIGNAL
        </button>
        <button type="button"
          className={`ml-tab ${tab === 'res' ? 'ml-tab-on' : ''}`}
          onClick={() => navigate(`${episodeBasePath}/resources`)}
        >
          PLAYGROUND
        </button>
        <button type="button"
          className={`ml-tab ${tab === 'ctf' ? 'ml-tab-on' : ''}`}
          onClick={() => navigate(`${episodeBasePath}/ctf`)}
        >
          SYNAPSE
        </button>
      </div>

      {/* Content — dispatched per episode */}
      <div className="ml-content">
        {tab === 'brief' && <mod.Signal arc={arc} episode={episode} />}
        {tab === 'res'   && <mod.Playground />}
        {tab === 'ctf'   && <mod.Synapse />}
      </div>
    </div>
  );
};
