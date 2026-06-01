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
import { PalindromeNumber } from './visualizations/PalindromeNumber';
import { LengthLastWord } from './visualizations/LengthLastWord';
import { MajorityElement } from './visualizations/MajorityElement';
import { MaxSubarray } from './visualizations/MaxSubarray';
import { PivotIndex } from './visualizations/PivotIndex';
import { RansomNote } from './visualizations/RansomNote';
import { ProductExceptSelf } from './visualizations/ProductExceptSelf';
import { GroupAnagrams } from './visualizations/GroupAnagrams';
import { IsomorphicStrings } from './visualizations/IsomorphicStrings';
import { RangeSumQuery } from './visualizations/RangeSumQuery';
import { SortArray } from './visualizations/SortArray';
import { SearchBST } from './visualizations/SearchBST';
import { NumIslands } from './visualizations/NumIslands';
import { FindPath } from './visualizations/FindPath';

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
  'BP_9_PALINDROME':         PalindromeNumber,
  'BP_58_LENGTH_LAST_WORD':  LengthLastWord,
  'DSA_169_MAJORITY':        MajorityElement,
  'DSA_53_MAX_SUBARRAY':     MaxSubarray,
  'DSA_724_PIVOT_INDEX':     PivotIndex,
  'DSA_383_RANSOM_NOTE':     RansomNote,
  'DSA_238_PRODUCT_EXCEPT':  ProductExceptSelf,
  'DSA_49_GROUP_ANAGRAMS':   GroupAnagrams,
  'DSA_205_ISOMORPHIC':      IsomorphicStrings,
  'DSA_303_RANGE_SUM':       RangeSumQuery,
  'DSA_912_SORT_ARRAY':      SortArray,
  'DSA_700_SEARCH_BST':      SearchBST,
  'DSA_200_NUM_ISLANDS':     NumIslands,
  'DSA_1971_FIND_PATH':      FindPath,
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
