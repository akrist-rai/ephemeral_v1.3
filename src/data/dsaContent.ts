/**
 * DSA problem data — lives statically alongside components, NOT in the DB.
 *
 * Each entry is keyed by the challenge ID (which DOES exist in the DB/content.ts,
 * but only stores XP/flag/metadata). The rich problem content, study guides,
 * starter code, and test cases live here.
 *
 * Episodes → Problems mapping:
 *   S1E3_A1  →  DSA_55_JUMP_GAME, DSA_322_COIN_CHANGE, DSA_746_MIN_COST_STAIRS
 */

export interface DSAApproach {
  name: string;
  time: string;
  space: string;
  description: string;
  works: boolean;
}

export interface DSAStudyGuide {
  concept: string;
  tldr: string;
  explanation: string;
  approaches: DSAApproach[];
  visualExample: string;
  keyInsight: string;
  patternHint: string;
  pitfalls: string[];
}

export interface DSAExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DSATestCase {
  label: string;
  args: unknown[];
  expected: unknown;
}

export interface DSAProblem {
  id: string;
  leetcodeNum: number;
  leetcodeSlug: string;
  leetcodeUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  statement: string;
  examples: DSAExample[];
  constraints: string[];
  starterCode: { python: string; javascript: string };
  testCases: DSATestCase[];
  /** Python code that calls the solution function and returns a comparable result. */
  runnerPy: string;
  /** JS code (as a string) that calls solution with args and returns result. */
  runnerJs: string;
  studyGuide: DSAStudyGuide;
  hint: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  LeetCode #55 — Jump Game
// ─────────────────────────────────────────────────────────────────────────────

const JUMP_GAME: DSAProblem = {
  id: 'DSA_55_JUMP_GAME',
  leetcodeNum: 55,
  leetcodeSlug: 'jump-game',
  leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
  difficulty: 'Medium',
  tags: ['Array', 'Greedy'],

  statement:
    'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.',

  examples: [
    {
      input: 'nums = [2,3,1,1,4]',
      output: 'true',
      explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
    },
    {
      input: 'nums = [3,2,1,0,4]',
      output: 'false',
      explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.',
    },
  ],

  constraints: [
    '1 <= nums.length <= 10⁴',
    '0 <= nums[i] <= 10⁵',
  ],

  starterCode: {
    python: `from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        # Your greedy solution here
        pass
`,
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    // Your greedy solution here
};`,
  },

  testCases: [
    { label: '[2,3,1,1,4]', args: [[2, 3, 1, 1, 4]], expected: true },
    { label: '[3,2,1,0,4]', args: [[3, 2, 1, 0, 4]], expected: false },
    { label: '[0]',         args: [[0]],             expected: true },
    { label: '[1,0,0]',     args: [[1, 0, 0]],       expected: false },
    { label: '[2,0,0]',     args: [[2, 0, 0]],       expected: true },
  ],

  runnerPy: `
sol = Solution()
results = []
test_cases = [([2,3,1,1,4], True), ([3,2,1,0,4], False), ([0], True), ([1,0,0], False), ([2,0,0], True)]
for nums, expected in test_cases:
    got = sol.canJump(nums)
    results.append(got == expected)
print(results)
`,

  runnerJs: `
const sol = canJump;
const cases = [[[2,3,1,1,4], true], [[3,2,1,0,4], false], [[0], true], [[1,0,0], false], [[2,0,0], true]];
return cases.map(([nums, expected]) => sol(nums) === expected);
`,

  hint: 'Walk forward. At each index i, ask: can I extend my "maximum reachable index"? If at any point i > maxReach, you are stuck.',

  studyGuide: {
    concept: 'Greedy — Forward Reach Tracking',

    tldr: 'Maintain the furthest index you can reach so far. If you ever step past it, return false.',

    explanation:
      'Greedy shines here because the decision at each step is locally complete: you always want to maximise how far you can reach. You do not need to remember the path — only the frontier.\n\nWalk through the array left-to-right. At each index i, update maxReach = max(maxReach, i + nums[i]). If i > maxReach at any point, you cannot proceed further. If maxReach >= last index before the loop ends, return true.',

    approaches: [
      {
        name: 'Brute Force (DFS/BFS)',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        description: 'Try every possible jump path recursively. Revisits the same positions exponentially.',
        works: true,
      },
      {
        name: 'DP (Right to Left)',
        time: 'O(n²)',
        space: 'O(n)',
        description: 'Mark each position as GOOD or BAD starting from the last index. O(n²) due to inner loop.',
        works: true,
      },
      {
        name: 'Greedy (Max Reach)',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Single pass. Track the maximum reachable index. If current index > maxReach, return false.',
        works: true,
      },
    ],

    visualExample:
`nums    =  [2, 3, 1, 1, 4]
index       0  1  2  3  4

i=0: maxReach = max(0, 0+2) = 2   ✓ (0 <= 2)
i=1: maxReach = max(2, 1+3) = 4   ✓ (1 <= 4)
i=2: maxReach = max(4, 2+1) = 4   ✓ (2 <= 4)
i=3: maxReach = max(4, 3+1) = 4   ✓ (3 <= 4)
i=4: 4 >= last index (4) → TRUE ✓

─────────────────────────────────
nums    =  [3, 2, 1, 0, 4]
index       0  1  2  3  4

i=0: maxReach = 3
i=1: maxReach = 3
i=2: maxReach = 3
i=3: maxReach = 3   (3+0=3, no improvement)
i=4: 4 > maxReach(3) → BLOCKED → FALSE ✗`,

    keyInsight:
      'You do not need to track the actual path. The maximum reachable index is a sufficient summary of all possible paths up to this point.',

    patternHint:
      'Use greedy when the local optimum at each step always leads to a global optimum — and when you can prove that choosing the maximum available value at each step never closes off a better future choice.',

    pitfalls: [
      'Forgetting the edge case nums = [0]: length 1, already at the last index → true.',
      'Checking i <= maxReach instead of i > maxReach (inverted condition).',
      'Updating maxReach with i + nums[i] even when i > maxReach (you cannot be at i if it was unreachable).',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  LeetCode #322 — Coin Change
// ─────────────────────────────────────────────────────────────────────────────

const COIN_CHANGE: DSAProblem = {
  id: 'DSA_322_COIN_CHANGE',
  leetcodeNum: 322,
  leetcodeSlug: 'coin-change',
  leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
  difficulty: 'Medium',
  tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],

  statement:
    'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',

  examples: [
    {
      input: 'coins = [1,2,5], amount = 11',
      output: '3',
      explanation: '11 = 5 + 5 + 1',
    },
    {
      input: 'coins = [2], amount = 3',
      output: '-1',
    },
    {
      input: 'coins = [1], amount = 0',
      output: '0',
    },
  ],

  constraints: [
    '1 <= coins.length <= 12',
    '1 <= coins[i] <= 2³¹ - 1',
    '0 <= amount <= 10⁴',
  ],

  starterCode: {
    python: `from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        # Build your DP table here
        pass
`,
    javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    // Build your DP table here
};`,
  },

  testCases: [
    { label: 'coins=[1,2,5] amount=11', args: [[1, 2, 5], 11], expected: 3 },
    { label: 'coins=[2] amount=3',      args: [[2], 3],         expected: -1 },
    { label: 'coins=[1] amount=0',      args: [[1], 0],         expected: 0 },
    { label: 'coins=[1,3,4] amount=6',  args: [[1, 3, 4], 6],   expected: 2 },
    { label: 'coins=[186,419,83,408] amount=6249', args: [[186, 419, 83, 408], 6249], expected: 20 },
  ],

  runnerPy: `
sol = Solution()
cases = [([1,2,5],11,3), ([2],3,-1), ([1],0,0), ([1,3,4],6,2), ([186,419,83,408],6249,20)]
results = []
for coins, amount, expected in cases:
    got = sol.coinChange(coins, amount)
    results.append(got == expected)
print(results)
`,

  runnerJs: `
const sol = coinChange;
const cases = [[[1,2,5],11,3], [[2],3,-1], [[1],0,0], [[1,3,4],6,2], [[186,419,83,408],6249,20]];
return cases.map(([coins, amount, expected]) => sol(coins, amount) === expected);
`,

  hint: 'Build a dp[] array of length amount+1 where dp[i] = min coins to make amount i. Initialize all to Infinity (impossible), set dp[0] = 0, then fill left to right.',

  studyGuide: {
    concept: 'Dynamic Programming — Bottom-Up Table',

    tldr: 'Greedy always picking the largest coin is WRONG. DP builds the optimal answer from smaller subproblems.',

    explanation:
      'This problem is the canonical example of where greedy fails. For coins [1, 3, 4] and amount 6:\n\n• Greedy (pick largest): 4 → 4+1 → 4+1+1 = 3 coins\n• Optimal (DP): 3+3 = 2 coins\n\nGreedy fails because choosing the largest coin now can block better combinations later.\n\nDP works by building a table dp[0..amount] where dp[i] means "the minimum coins needed to make exactly i". The recurrence is:\n\n  dp[i] = min over all coins c where c <= i: dp[i - c] + 1\n\nThis reads: "to make amount i, try subtracting each coin c and take the best (minimum) result".',

    approaches: [
      {
        name: 'Greedy (Largest Coin First)',
        time: 'O(amount / min_coin)',
        space: 'O(1)',
        description: 'Always pick the largest coin that fits. INCORRECT for general coin sets.',
        works: false,
      },
      {
        name: 'Recursion + Memoization (Top-Down DP)',
        time: 'O(amount × coins.length)',
        space: 'O(amount)',
        description: 'Recursively try all coins, memoize results. Correct but has recursion overhead.',
        works: true,
      },
      {
        name: 'Bottom-Up DP Table',
        time: 'O(amount × coins.length)',
        space: 'O(amount)',
        description: 'Build dp[0..amount] iteratively. The canonical optimal solution.',
        works: true,
      },
    ],

    visualExample:
`coins = [1, 3, 4],  amount = 6

dp table (min coins to make each amount):
         0   1   2   3   4   5   6
dp    =  0   1   2   1   1   2   2  ← ANSWER

Building it step by step:
  dp[0] = 0           (base case: 0 coins for $0)
  dp[1]: try coin 1 → dp[1-1]+1 = 1        → dp[1] = 1
  dp[2]: try coin 1 → dp[2-1]+1 = 2        → dp[2] = 2
  dp[3]: try coin 1 → dp[2]+1 = 3
         try coin 3 → dp[0]+1 = 1 ✓        → dp[3] = 1
  dp[4]: try coin 1 → dp[3]+1 = 2
         try coin 3 → dp[1]+1 = 2
         try coin 4 → dp[0]+1 = 1 ✓        → dp[4] = 1
  dp[5]: try coin 1 → dp[4]+1 = 2 ✓        → dp[5] = 2
  dp[6]: try coin 1 → dp[5]+1 = 3
         try coin 3 → dp[3]+1 = 2 ✓
         try coin 4 → dp[2]+1 = 3           → dp[6] = 2

Greedy would have given: 4+1+1 = 3 coins. DP found: 3+3 = 2 coins.`,

    keyInsight:
      'Every amount i is reachable by appending one coin to a previously-computed optimal sub-amount. "Optimal substructure" makes DP correct here.',

    patternHint:
      'Use DP (instead of greedy) when a locally optimal choice at one step can prevent reaching the globally optimal solution. Red flag: if counterexamples exist for greedy, switch to DP.',

    pitfalls: [
      'Initializing dp with 0 instead of Infinity — makes unreachable amounts look like 0 coins.',
      'Returning dp[amount] without checking if it is still Infinity (unreachable) → should return -1.',
      'Iterating coins in the outer loop and amounts in the inner loop — both orders work for min-coins but the conventional form is amounts outer, coins inner.',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  LeetCode #746 — Min Cost Climbing Stairs
// ─────────────────────────────────────────────────────────────────────────────

const MIN_COST_STAIRS: DSAProblem = {
  id: 'DSA_746_MIN_COST_STAIRS',
  leetcodeNum: 746,
  leetcodeSlug: 'min-cost-climbing-stairs',
  leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
  difficulty: 'Easy',
  tags: ['Array', 'Dynamic Programming'],

  statement:
    'You are given an integer array cost where cost[i] is the cost of i-th step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index 0, or the step with index 1.\n\nReturn the minimum cost to reach the top of the floor.',

  examples: [
    {
      input: 'cost = [10,15,20]',
      output: '15',
      explanation: 'Start at index 1. Pay 15, climb two steps to reach the top.',
    },
    {
      input: 'cost = [1,100,1,1,1,100,1,1,100,1]',
      output: '6',
      explanation: 'Start at index 0. Pay 1, jump to 2. Pay 1, jump to 4. Pay 1, jump to 6. Pay 1, jump to 8. Pay 1, jump to 9. Pay 1, jump to top.',
    },
  ],

  constraints: [
    '2 <= cost.length <= 1000',
    '0 <= cost[i] <= 999',
  ],

  starterCode: {
    python: `from typing import List

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        # Define your recurrence and fill your DP array
        pass
`,
    javascript: `/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {
    // Define your recurrence and fill your DP array
};`,
  },

  testCases: [
    { label: '[10,15,20]',                          args: [[10, 15, 20]],                          expected: 15 },
    { label: '[1,100,1,1,1,100,1,1,100,1]',         args: [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], expected: 6 },
    { label: '[0,0]',                               args: [[0, 0]],                               expected: 0 },
    { label: '[1,100]',                             args: [[1, 100]],                             expected: 1 },
    { label: '[10,15,20,15,10]',                    args: [[10, 15, 20, 15, 10]],                 expected: 30 },
  ],

  runnerPy: `
sol = Solution()
cases = [([10,15,20],15), ([1,100,1,1,1,100,1,1,100,1],6), ([0,0],0), ([1,100],1), ([10,15,20,15,10],30)]
results = []
for cost, expected in cases:
    got = sol.minCostClimbingStairs(cost)
    results.append(got == expected)
print(results)
`,

  runnerJs: `
const sol = minCostClimbingStairs;
const cases = [[[10,15,20],15],[[1,100,1,1,1,100,1,1,100,1],6],[[0,0],0],[[1,100],1],[[10,15,20,15,10],30]];
return cases.map(([cost, expected]) => sol(cost) === expected);
`,

  hint: 'Define dp[i] as the minimum cost to reach step i (paying at step i). dp[i] = cost[i] + min(dp[i-1], dp[i-2]). The answer is min(dp[n-1], dp[n-2]).',

  studyGuide: {
    concept: 'Dynamic Programming — 1D State with Recurrence',

    tldr: 'Reaching any step is optimal only if the steps you came from were also optimal. Define, then fill, then read.',

    explanation:
      'This is the ideal first DP problem because the recurrence is crystal clear:\n\n  "The minimum cost to reach step i = cost[i] + the minimum cost of the cheaper of the two steps before it."\n\nIn code: dp[i] = cost[i] + min(dp[i-1], dp[i-2])\n\nBase cases: dp[0] = cost[0], dp[1] = cost[1].\n\nThe final answer is min(dp[n-1], dp[n-2]) because you can reach "the top" from either of the last two steps.\n\nThis problem has "optimal substructure" (the optimal solution uses optimal sub-solutions) and "overlapping subproblems" (the same sub-step is reused many times). Those two properties are the hallmark of DP.',

    approaches: [
      {
        name: 'Greedy',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Always step to the cheaper adjacent stair. INCORRECT for most inputs.',
        works: false,
      },
      {
        name: 'Recursion (no memo)',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        description: 'Recursively try both paths. Exponential due to repeated sub-problems.',
        works: true,
      },
      {
        name: 'DP with Array',
        time: 'O(n)',
        space: 'O(n)',
        description: 'Fill dp[0..n-1] iteratively. Clean and easy to understand.',
        works: true,
      },
      {
        name: 'DP with Two Variables',
        time: 'O(n)',
        space: 'O(1)',
        description: 'Only keep the last two dp values (prev2, prev1). Space-optimised.',
        works: true,
      },
    ],

    visualExample:
`cost = [10, 15, 20]
         0    1    2   ← step index

dp[0] = 10            (pay cost[0] to be at step 0)
dp[1] = 15            (pay cost[1] to be at step 1)
dp[2] = cost[2] + min(dp[0], dp[1])
      = 20    + min(10,   15)
      = 20    + 10 = 30

Answer = min(dp[1], dp[2]) = min(15, 30) = 15
  → Start at step 1, pay 15, jump 2 steps to top. ✓

─────────────────────────────────────────────────
cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
idx     0    1  2  3  4    5  6  7    8  9

dp  = [1, 100, 2, 3, 3,  103, 4, 5, 104, 6]
       ↑                                  ↑
    base                             answer min(dp[8], dp[9])
                                         = min(104, 6) = 6 ✓`,

    keyInsight:
      'Every position\'s optimal cost depends only on the two positions before it. You never need to look further back. This "k-step lookback" pattern appears constantly in DP.',

    patternHint:
      'When the cost to reach position i depends on a small fixed number of preceding positions, DP with rolling variables (space O(1)) is the gold standard.',

    pitfalls: [
      'Off-by-one: the "top" is PAST the last step, not the last step itself. Answer = min(dp[n-1], dp[n-2]).',
      'Starting the loop at i=2 but not initialising dp[0] and dp[1] first.',
      'Using min(cost[n-1], cost[n-2]) instead of min(dp[n-1], dp[n-2]) — confusing raw cost with accumulated DP cost.',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  Registry: all DSA problems keyed by challenge ID
// ─────────────────────────────────────────────────────────────────────────────

export const DSA_PROBLEMS: Record<string, DSAProblem> = {
  [JUMP_GAME.id]:       JUMP_GAME,
  [COIN_CHANGE.id]:     COIN_CHANGE,
  [MIN_COST_STAIRS.id]: MIN_COST_STAIRS,
};

/** Return all DSA problems assigned to a given episode. */
export function getDsaProblemsForEpisode(
  episodeId: string,
  challengeIds: string[],
): DSAProblem[] {
  return challengeIds
    .map(id => DSA_PROBLEMS[id])
    .filter((p): p is DSAProblem => p !== undefined);
}
