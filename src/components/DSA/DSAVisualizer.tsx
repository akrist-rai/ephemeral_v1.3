import React from 'react';
import type { DSAProblem } from '../../data/dsaContent';
import { RunningSum } from './visualizations/RunningSum';
import { FizzBuzz } from './visualizations/FizzBuzz';
import { ConcatArray } from './visualizations/ConcatArray';
import { ReverseString } from './visualizations/ReverseString';
import { ValidAnagram } from './visualizations/ValidAnagram';
import { ContainsDuplicate } from './visualizations/ContainsDuplicate';
import { TwoSum } from './visualizations/TwoSum';
import { JewelsStones } from './visualizations/JewelsStones';
import { Fibonacci } from './visualizations/Fibonacci';
import { BestTimeStock } from './visualizations/BestTimeStock';
import { JumpGame } from './visualizations/JumpGame';
import { CoinChange } from './visualizations/CoinChange';
import { MinCostStairs } from './visualizations/MinCostStairs';

interface DSAVisualizerProps {
  problem: DSAProblem;
  accColor: string;
}

const VISUALIZER_REGISTRY: Record<string, React.ComponentType<{ accColor: string }>> = {
  'BP_1480_RUNNING_SUM':    RunningSum,
  'BP_412_FIZZBUZZ':        FizzBuzz,
  'BP_1929_CONCAT_ARRAY':   ConcatArray,
  'BP_344_REVERSE_STRING':  ReverseString,
  'BP_242_VALID_ANAGRAM':   ValidAnagram,
  'BP_217_CONTAINS_DUP':    ContainsDuplicate,
  'BP_1_TWO_SUM':           TwoSum,
  'BP_771_JEWELS_STONES':   JewelsStones,
  'BP_509_FIBONACCI':       Fibonacci,
  'BP_121_BEST_TIME_STOCK': BestTimeStock,
  'DSA_55_JUMP_GAME':       JumpGame,
  'DSA_322_COIN_CHANGE':    CoinChange,
  'DSA_746_MIN_COST_STAIRS': MinCostStairs,
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
        <span className="dv-header-concept">{sg.concept}</span>
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
