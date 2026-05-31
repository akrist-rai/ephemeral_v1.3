import React from 'react';
import type { DSAProblem } from '../../data/dsaContent';
import { RunningSum } from './visualizations/RunningSum';

interface DSAVisualizerProps {
  problem: DSAProblem;
  accColor: string;
}

const VISUALIZER_REGISTRY: Record<string, React.ComponentType<{ accColor: string }>> = {
  'BP_1480_RUNNING_SUM': RunningSum,
};

export const DSAVisualizer: React.FC<DSAVisualizerProps> = ({ problem, accColor }) => {
  const VisualizerComponent = VISUALIZER_REGISTRY[problem.id] ?? null;

  if (VisualizerComponent) {
    return (
      <div className="dv-wrap">
        <div className="dv-header">
          <span className="dv-header-label">// INTERACTIVE VISUALIZER</span>
          <span className="dv-header-tag">STEP-BY-STEP</span>
        </div>
        <VisualizerComponent accColor={accColor} />
      </div>
    );
  }

  // Concept Overview fallback for non-visualized problems
  const sg = problem.studyGuide;
  return (
    <div className="dv-wrap dv-wrap--concept">
      <div className="dv-header">
        <span className="dv-header-label">// CONCEPT OVERVIEW</span>
        <span className="dv-header-label" style={{ marginLeft: 'auto', fontSize: '.62rem' }}>{sg.concept}</span>
      </div>
      <div className="dv-concept-body">
        <div className="dv-concept-tldr">
          <span className="dv-concept-tldr-label">TL;DR</span>
          {sg.tldr}
        </div>
        <div className="dv-concept-insight">
          <span className="dv-concept-insight-label">CORE PATTERN</span>
          <p>{sg.keyInsight}</p>
        </div>
        <div className="dv-concept-approaches">
          {sg.approaches.slice(0, 3).map((ap, i) => (
            <div key={i} className={`dv-approach-pill dv-approach-pill--${ap.works ? 'yes' : 'no'}`}>
              <span className="dv-approach-pill-name">{ap.name}</span>
              <span className="dv-approach-pill-time">{ap.time}</span>
              <span className="dv-approach-pill-works">{ap.works ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
