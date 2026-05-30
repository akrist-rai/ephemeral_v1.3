import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sound';
import { GlitchText } from './GlitchText';

interface BootTourProps {
  onClose: () => void;
  onAwardXp: (xp: number) => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  highlightSelector?: string;
  actionLabel: string;
}

export const BootTour: React.FC<BootTourProps> = ({ onClose, onAwardXp }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const steps: TourStep[] = [
    {
      title: 'SYSTEM BOOT SEQUENCE',
      subtitle: '// INITIALIZING OPERATOR HANDSHAKE',
      description: 'Welcome, Operator. You have successfully bypassed the secure gates of the Ephemeral Cyber Academy. Before you deploy into active operations, we must calibrate your Cognitive HUD.',
      actionLabel: 'BEGIN HUD CALIBRATION'
    },
    {
      title: 'THE CORE HELM [NAVIGATION HUD]',
      subtitle: '// SECTOR-01 CALIBRATION',
      description: 'The navigation deck allows you to switch operational sectors. HOME features active training simulators and bounty tasks. SERIES locks down core computer science curricula. BOUNTY BOARD shows rival operations, and PROFILE tracks your badges.',
      highlightSelector: '.nb-links',
      actionLabel: 'NEXT: CALIBRATE MISSIONS'
    },
    {
      title: 'TACTICAL PATHS [ARCS & SERIES]',
      subtitle: '// SECTOR-02 CURRICULUM SCANS',
      description: 'Content is grouped into "Arcs" (long campaigns) and "Episodes" (modular subjects). Each Arc targets specific domains: Cryptography, SQL Databases, Reversing, or Machine Learning Security.',
      highlightSelector: '.nb-link[href="/series"]',
      actionLabel: 'NEXT: CALIBRATE WORKSPACES'
    },
    {
      title: 'THE TRIPLE-PHASE INVESTIGATION',
      subtitle: '// SECTOR-03 DECKS',
      description: 'Each mission contains three phases: BRIEF (educational theory and tactical writeups), RESOURCES (external videos, documentations, and manuals), and CTF ARENA (hands-on cyber lab and flag extractions).',
      actionLabel: 'NEXT: THE CODING WORKBENCH'
    },
    {
      title: 'THE CODING WORKBENCH & THE CODEX',
      subtitle: '// SECTOR-04 ACTIVE COMPILERS',
      description: 'Never leave the cockpit to code! When viewing a challenge, expand the "⚡ OPERATOR WORKSPACE SCRATCHPAD" to write real sandboxed scripts (JS, Python, SQL) and run them in the CRT terminal. Use the "🧬 CODEX REFERENCE" for one-click converters and automatic syntax copying.',
      actionLabel: 'COMPLETE CALIBRATION'
    }
  ];

  const currentStep = steps[stepIdx];

  // Dynamically calculate the highlights bounding rectangle
  useEffect(() => {
    if (currentStep.highlightSelector) {
      const el = document.querySelector(currentStep.highlightSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setActiveHighlight({
          top: rect.top + window.scrollY - 4,
          left: rect.left + window.scrollX - 4,
          width: rect.width + 8,
          height: rect.height + 8
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('tour-highlighted-element');
        return () => {
          el.classList.remove('tour-highlighted-element');
        };
      }
    }
    setActiveHighlight(null);
  }, [stepIdx, currentStep.highlightSelector]);

  const handleNext = () => {
    playSound.success();
    if (stepIdx < steps.length - 1) {
      setStepIdx(prev => prev + 1);
    } else {
      // Finished calibration! Award XP!
      const hasCompletedBefore = localStorage.getItem('ephemeral_calibrated');
      if (!hasCompletedBefore) {
        localStorage.setItem('ephemeral_calibrated', 'true');
        onAwardXp(50);
      }
      localStorage.setItem('ephemeral_tour_completed', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    playSound.click();
    localStorage.setItem('ephemeral_tour_completed', 'true');
    onClose();
  };

  return (
    <div 
      className="tour-overlay-wrap"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,2,4,0.85)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'var(--mono)',
        color: '#fff',
        backdropFilter: 'blur(3px)'
      }}
    >
      {/* Target spotlight overlay */}
      {activeHighlight && (
        <div 
          style={{
            position: 'absolute',
            top: activeHighlight.top,
            left: activeHighlight.left,
            width: activeHighlight.width,
            height: activeHighlight.height,
            boxShadow: '0 0 0 9999px rgba(0, 2, 4, 0.72), 0 0 15px var(--lime)',
            border: '2px solid var(--lime)',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 9998,
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        />
      )}

      {/* Main holographic modal block */}
      <div 
        className="tour-modal-card"
        style={{
          width: '450px',
          background: 'rgba(0, 4, 8, 0.95)',
          border: '1px solid rgba(0, 255, 65, 0.25)',
          boxShadow: '0 0 25px rgba(0,255,65,0.1)',
          padding: '1.8rem',
          borderRadius: '4px',
          zIndex: 10000,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.52rem', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.1em' }}>
            COGNITIVE HUD CALIBRATION // MODULE_{stepIdx + 1}_OF_{steps.length}
          </span>
          <button 
            onClick={handleSkip} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'rgba(255,255,255,0.4)', 
              fontSize: '0.55rem', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--mono)'
            }}
          >
            SKIP SCAN
          </button>
        </div>

        {/* Glitch Title */}
        <div style={{ marginTop: '0.4rem' }}>
          <div style={{ color: 'var(--lime)', fontSize: '0.55rem', marginBottom: '0.15rem', letterSpacing: '0.05em' }}>
            {currentStep.subtitle}
          </div>
          <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 'bold', letterSpacing: '0.04em' }}>
            <GlitchText text={currentStep.title} triggerOnHover={false} color="var(--lime)" />
          </h2>
        </div>

        {/* Status indicator bar */}
        <div style={{ display: 'flex', height: '2px', background: 'rgba(255,255,255,0.06)', margin: '0.3rem 0' }}>
          <div 
            style={{ 
              width: `${((stepIdx + 1) / steps.length) * 100}%`, 
              background: 'var(--lime)', 
              boxShadow: '0 0 6px var(--lime)', 
              transition: 'width 0.3s' 
            }} 
          />
        </div>

        {/* Description body */}
        <p 
          style={{ 
            color: 'rgba(255,255,255,0.85)', 
            fontSize: '0.68rem', 
            lineHeight: '1.5', 
            margin: '0.5rem 0',
            textAlign: 'justify' 
          }}
        >
          {currentStep.description}
        </p>

        {/* Bottom Calibration Metrics */}
        <div 
          style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.04)', 
            padding: '0.5rem 0.7rem', 
            fontSize: '0.5rem', 
            color: 'rgba(255,255,255,0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>CORE SYSTEM STATUS: CALIBRATING...</span>
          <span style={{ color: 'var(--lime)', fontWeight: 'bold' }}>
            {stepIdx === steps.length - 1 ? 'AWARD: +50 XP' : 'SIGNAL STABLE'}
          </span>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.4rem' }}>
          {stepIdx > 0 && (
            <button
              onClick={() => { playSound.click(); setStepIdx(p => p - 1); }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.6rem',
                fontFamily: 'var(--mono)',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                flex: 1
              }}
            >
              PREVIOUS STAGE
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              background: 'var(--lime)',
              color: '#000',
              border: 'none',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              fontFamily: 'var(--mono)',
              padding: '0.5rem 1.2rem',
              cursor: 'pointer',
              flex: 2,
              letterSpacing: '0.05em',
              boxShadow: '0 0 10px rgba(0,255,65,0.2)'
            }}
          >
            {currentStep.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
