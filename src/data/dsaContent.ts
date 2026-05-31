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

// ─────────────────────────────────────────────────────────────────────────────
//  ARC 9 — PROGRAMMING BASICS  (absolute beginner, zero prior knowledge assumed)
// ─────────────────────────────────────────────────────────────────────────────

// S1E1_A9 ── Variables, Loops & Output ────────────────────────────────────────

const FIZZBUZZ: DSAProblem = {
  id: 'BP_412_FIZZBUZZ',
  leetcodeNum: 412,
  leetcodeSlug: 'fizz-buzz',
  leetcodeUrl: 'https://leetcode.com/problems/fizz-buzz/',
  difficulty: 'Easy',
  tags: ['Math', 'String', 'Simulation'],
  statement:
    'Given an integer n, return a string array answer (1-indexed) where:\n\n' +
    '• answer[i] == "FizzBuzz" if i is divisible by 3 and 5.\n' +
    '• answer[i] == "Fizz" if i is only divisible by 3.\n' +
    '• answer[i] == "Buzz" if i is only divisible by 5.\n' +
    '• answer[i] == i (as a string) if none of the above conditions are true.',
  examples: [
    { input: 'n = 3',  output: '["1","2","Fizz"]' },
    { input: 'n = 5',  output: '["1","2","Fizz","4","Buzz"]' },
    { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
  ],
  constraints: ['1 <= n <= 10⁴'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def fizzBuzz(self, n: int) -> List[str]:
        result = []
        # Loop from 1 to n (inclusive)
        for i in range(1, n + 1):
            # Check divisible by both 3 and 5 FIRST
            if i % 15 == 0:
                result.append("FizzBuzz")
            elif i % 3 == 0:
                result.append("Fizz")
            elif i % 5 == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
        return result
`,
    javascript:
`/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) result.push("FizzBuzz");
        else if (i % 3 === 0) result.push("Fizz");
        else if (i % 5 === 0) result.push("Buzz");
        else result.push(String(i));
    }
    return result;
};`,
  },
  testCases: [
    { label: 'n=3',  args: [3],  expected: ['1','2','Fizz'] },
    { label: 'n=5',  args: [5],  expected: ['1','2','Fizz','4','Buzz'] },
    { label: 'n=15', args: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'] },
  ],
  runnerPy: `
sol = Solution()
cases = [(3,['1','2','Fizz']),(5,['1','2','Fizz','4','Buzz']),(15,['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'])]
results = [sol.fizzBuzz(n) == exp for n,exp in cases]
print(results)
`,
  runnerJs: `
const sol = fizzBuzz;
const cases=[[3,['1','2','Fizz']],[5,['1','2','Fizz','4','Buzz']]];
return cases.map(([n,exp])=>JSON.stringify(sol(n))===JSON.stringify(exp));
`,
  hint: 'Check divisible by BOTH 3 and 5 first (i % 15 == 0), THEN check 3 alone, THEN 5 alone.',
  studyGuide: {
    concept: 'Loops & Conditionals — Your Very First Programs',
    tldr: 'A loop repeats instructions. An if/elif/else picks which instruction to run. The % operator gives the remainder of division.',
    explanation:
      'WHAT IS A PROGRAM?\n' +
      'A program is a list of instructions you give a computer. The computer follows them one by one, from top to bottom.\n\n' +
      'WHAT IS A VARIABLE?\n' +
      'A variable is like a labeled box. You give it a name and put a value inside:\n' +
      '  score = 0          # box named "score" holds the number 0\n' +
      '  name = "Alice"     # box named "name" holds the text "Alice"\n\n' +
      'WHAT IS A LOOP?\n' +
      'A loop repeats a block of code multiple times without you writing it over and over.\n' +
      '  for i in range(1, 4):   # i takes values 1, 2, 3\n' +
      '      print(i)             # prints 1, then 2, then 3\n\n' +
      'WHAT IS A CONDITIONAL?\n' +
      'A conditional runs different code depending on whether something is true or false.\n' +
      '  if score > 10:\n' +
      '      print("Win!")        # only runs if score > 10\n' +
      '  elif score == 10:\n' +
      '      print("Tie!")        # only runs if score == 10\n' +
      '  else:\n' +
      '      print("Lose!")       # runs if neither above is true\n\n' +
      'THE % OPERATOR (MODULO):\n' +
      '  9 % 3 = 0   → 9 is exactly divisible by 3 (no remainder)\n' +
      '  10 % 3 = 1  → 10 divided by 3 leaves remainder 1\n' +
      '  15 % 5 = 0  → 15 is exactly divisible by 5',
    approaches: [
      { name: 'If/elif/else in a loop', time: 'O(n)', space: 'O(n)', description: 'Single pass from 1 to n, pick the right string per number.', works: true },
    ],
    visualExample:
`For n = 5, trace through the loop:

i=1: 1%15≠0, 1%3≠0, 1%5≠0  → "1"
i=2: 2%15≠0, 2%3≠0, 2%5≠0  → "2"
i=3: 3%15≠0, 3%3=0          → "Fizz"
i=4: 4%15≠0, 4%3≠0, 4%5≠0  → "4"
i=5: 5%15≠0, 5%3≠0, 5%5=0  → "Buzz"

Result: ["1","2","Fizz","4","Buzz"]`,
    keyInsight: '15 = 3 × 5. If i % 15 == 0 it is divisible by BOTH. You must check this BEFORE checking 3 or 5 alone, otherwise "15" would print "Fizz" instead of "FizzBuzz".',
    patternHint: 'Use a for loop when you know how many times to repeat. Use if/elif/else when you need to pick between multiple options.',
    pitfalls: ['Checking 3 before 15 — i=15 would match the 3-check and print "Fizz" instead of "FizzBuzz".', 'Using range(n) instead of range(1, n+1) — range(n) starts at 0, not 1.', 'Forgetting str(i) — append the number as a string, not an integer.'],
  },
};

const RUNNING_SUM: DSAProblem = {
  id: 'BP_1480_RUNNING_SUM',
  leetcodeNum: 1480,
  leetcodeSlug: 'running-sum-of-1d-array',
  leetcodeUrl: 'https://leetcode.com/problems/running-sum-of-1d-array/',
  difficulty: 'Easy',
  tags: ['Array', 'Prefix Sum'],
  statement: 'Given an array nums, return the running sum of nums where runningSum[i] = sum(nums[0]…nums[i]).',
  examples: [
    { input: 'nums = [1,2,3,4]',    output: '[1,3,6,10]',    explanation: 'Running sum: 1, 1+2=3, 1+2+3=6, 1+2+3+4=10.' },
    { input: 'nums = [1,1,1,1,1]',  output: '[1,2,3,4,5]' },
    { input: 'nums = [3,1,2,10,1]', output: '[3,4,6,16,17]' },
  ],
  constraints: ['1 <= nums.length <= 1000', '−10⁶ <= nums[i] <= 10⁶'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        total = 0
        result = []
        for num in nums:
            total += num          # add current number to running total
            result.append(total)  # record total so far
        return result
`,
    javascript:
`/**
 * @param {number[]} nums
 * @return {number[]}
 */
var runningSum = function(nums) {
    let total = 0;
    return nums.map(n => (total += n));
};`,
  },
  testCases: [
    { label: '[1,2,3,4]',    args: [[1,2,3,4]],    expected: [1,3,6,10] },
    { label: '[1,1,1,1,1]',  args: [[1,1,1,1,1]],  expected: [1,2,3,4,5] },
    { label: '[3,1,2,10,1]', args: [[3,1,2,10,1]], expected: [3,4,6,16,17] },
  ],
  runnerPy: `
sol = Solution()
cases=[([1,2,3,4],[1,3,6,10]),([1,1,1,1,1],[1,2,3,4,5]),([3,1,2,10,1],[3,4,6,16,17])]
results=[sol.runningSum(n)==e for n,e in cases]
print(results)
`,
  runnerJs: `
const sol=runningSum;
const cases=[[[1,2,3,4],[1,3,6,10]],[[1,1,1,1,1],[1,2,3,4,5]]];
return cases.map(([n,e])=>JSON.stringify(sol(n))===JSON.stringify(e));
`,
  hint: 'Keep one variable called total that starts at 0. After adding each number, append total to the result list.',
  studyGuide: {
    concept: 'Arrays & Accumulation — Keeping a Running Total',
    tldr: 'Walk through a list one item at a time, keeping a variable that grows with each step.',
    explanation:
      'WHAT IS A LIST (ARRAY)?\n' +
      'A list stores many values in one variable, separated by commas in square brackets:\n' +
      '  scores = [10, 20, 5, 30]\n' +
      'You access individual items by their position number (index), starting at 0:\n' +
      '  scores[0] → 10  (first item)\n' +
      '  scores[1] → 20  (second item)\n\n' +
      'HOW TO LOOP OVER A LIST:\n' +
      '  for num in scores:    # "num" takes each value in turn\n' +
      '      print(num)        # prints 10, then 20, then 5, then 30\n\n' +
      'ACCUMULATION PATTERN:\n' +
      'You will use this pattern constantly in programming:\n' +
      '  total = 0           # start at zero\n' +
      '  for num in scores:\n' +
      '      total += num    # += means "add to itself"\n' +
      '  print(total)        # 65',
    approaches: [
      { name: 'Running total variable', time: 'O(n)', space: 'O(n)', description: 'One loop, one counter variable.', works: true },
      { name: 'In-place modification', time: 'O(n)', space: 'O(1)', description: 'Add nums[i-1] to nums[i] directly. Modifies input.', works: true },
    ],
    visualExample:
`nums   = [1,  2,  3,  4]
           ↓   ↓   ↓   ↓
total  → 1   3   6   10

Step 1: total = 0 + 1  = 1  → append 1
Step 2: total = 1 + 2  = 3  → append 3
Step 3: total = 3 + 3  = 6  → append 6
Step 4: total = 6 + 4  = 10 → append 10

result = [1, 3, 6, 10]`,
    keyInsight: 'You only need ONE extra variable (total) no matter how long the list is. This is the "accumulation" or "prefix sum" pattern.',
    patternHint: 'Any time you need a running count, running total, or running maximum, create one variable before the loop and update it inside.',
    pitfalls: ['Forgetting to initialise total = 0 before the loop.', 'Appending BEFORE adding: append total first, then add → wrong order.'],
  },
};

const CONCAT_ARRAY: DSAProblem = {
  id: 'BP_1929_CONCAT_ARRAY',
  leetcodeNum: 1929,
  leetcodeSlug: 'concatenation-of-array',
  leetcodeUrl: 'https://leetcode.com/problems/concatenation-of-array/',
  difficulty: 'Easy',
  tags: ['Array', 'Simulation'],
  statement: 'Given an integer array nums of length n, you want to create an array ans of length 2n where ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n. Return the array ans.',
  examples: [
    { input: 'nums = [1,2,1]',   output: '[1,2,1,1,2,1]' },
    { input: 'nums = [1,3,2,1]', output: '[1,3,2,1,1,3,2,1]' },
  ],
  constraints: ['n == nums.length', '1 <= n <= 1000', '1 <= nums[i] <= 1000'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        return nums + nums   # Python list concatenation
`,
    javascript:
`var getConcatenation = function(nums) {
    return nums.concat(nums);
};`,
  },
  testCases: [
    { label: '[1,2,1]',   args: [[1,2,1]],   expected: [1,2,1,1,2,1] },
    { label: '[1,3,2,1]', args: [[1,3,2,1]], expected: [1,3,2,1,1,3,2,1] },
    { label: '[1]',        args: [[1]],        expected: [1,1] },
  ],
  runnerPy: `
sol=Solution()
cases=[([1,2,1],[1,2,1,1,2,1]),([1,3,2,1],[1,3,2,1,1,3,2,1])]
results=[sol.getConcatenation(n)==e for n,e in cases]
print(results)
`,
  runnerJs: `
const sol=getConcatenation;
const cases=[[[1,2,1],[1,2,1,1,2,1]],[[1,3,2,1],[1,3,2,1,1,3,2,1]]];
return cases.map(([n,e])=>JSON.stringify(sol(n))===JSON.stringify(e));
`,
  hint: 'In Python, you can join two lists with +. In JavaScript, use .concat(). Or build it with a loop.',
  studyGuide: {
    concept: 'Creating New Lists — Building Output Programmatically',
    tldr: 'You can join (concatenate) two lists together to form a longer one.',
    explanation:
      'CREATING A NEW LIST:\n' +
      '  empty = []           # start with an empty list\n' +
      '  empty.append(1)      # add items one at a time\n' +
      '  empty.append(2)      # → [1, 2]\n\n' +
      'JOINING TWO LISTS (concatenation):\n' +
      '  a = [1, 2, 3]\n' +
      '  b = [4, 5, 6]\n' +
      '  c = a + b            # [1, 2, 3, 4, 5, 6]\n\n' +
      'LIST INDEXING:\n' +
      '  nums = [10, 20, 30]\n' +
      '  nums[0]  → 10\n' +
      '  nums[-1] → 30  (last element)\n' +
      '  len(nums) → 3  (how many items)',
    approaches: [
      { name: 'Concatenation operator', time: 'O(n)', space: 'O(n)', description: 'nums + nums — simplest one-liner.', works: true },
      { name: 'Loop and append', time: 'O(n)', space: 'O(n)', description: 'Build answer list manually with a for loop.', works: true },
    ],
    visualExample:
`nums = [1, 2, 1]

nums + nums

= [1, 2, 1]  +  [1, 2, 1]
= [1, 2, 1, 1, 2, 1]
    ↑ first copy ↑   ↑ second copy ↑`,
    keyInsight: 'In Python, + on two lists produces a new list containing all elements of the first, then all elements of the second. No loops needed.',
    patternHint: 'When you see "create a list by repeating or combining other lists", reach for concatenation or list multiplication (nums * 2 in Python).',
    pitfalls: ['Confusing + for lists (join) vs + for numbers (add).', 'Modifying nums directly instead of creating a new list.'],
  },
};

// S1E2_A9 ── Text & Characters ────────────────────────────────────────────────

const REVERSE_STRING: DSAProblem = {
  id: 'BP_344_REVERSE_STRING',
  leetcodeNum: 344,
  leetcodeSlug: 'reverse-string',
  leetcodeUrl: 'https://leetcode.com/problems/reverse-string/',
  difficulty: 'Easy',
  tags: ['Two Pointers', 'String'],
  statement: 'Write a function that reverses a string. The input is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
  examples: [
    { input: 's = ["h","e","l","l","o"]',          output: '["o","l","l","e","h"]' },
    { input: 's = ["H","a","n","n","a","h"]',       output: '["h","a","n","n","a","H"]' },
  ],
  constraints: ['1 <= s.length <= 10⁵', 's[i] is a printable ASCII character'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]  # swap
            left += 1
            right -= 1
`,
    javascript:
`var reverseString = function(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++; right--;
    }
};`,
  },
  testCases: [
    { label: '["h","e","l","l","o"]',    args: [['h','e','l','l','o']],    expected: ['o','l','l','e','h'] },
    { label: '["H","a","n","n","a","h"]', args: [['H','a','n','n','a','h']], expected: ['h','a','n','n','a','H'] },
    { label: '["a"]',                     args: [['a']],                     expected: ['a'] },
  ],
  runnerPy: `
sol=Solution()
cases=[(['h','e','l','l','o'],['o','l','l','e','h']),(['H','a','n','n','a','h'],['h','a','n','n','a','H'])]
results=[]
for arr,exp in cases:
    a=arr[:]
    sol.reverseString(a)
    results.append(a==exp)
print(results)
`,
  runnerJs: `
const sol=reverseString;
const cases=[[['h','e','l','l','o'],['o','l','l','e','h']],[['H','a','n','n','a','h'],['h','a','n','n','a','H']]];
return cases.map(([s,e])=>{const a=[...s];sol(a);return JSON.stringify(a)===JSON.stringify(e);});
`,
  hint: 'Start with one pointer at the front (index 0) and one at the back (index len-1). Swap them, then move both pointers toward the middle.',
  studyGuide: {
    concept: 'String Indexing & Two-Pointer Technique',
    tldr: 'Use two pointers starting at opposite ends and swap elements, moving inward until they meet.',
    explanation:
      'WHAT IS AN INDEX?\n' +
      'An index is the position number of an item in a list or string. Counting STARTS AT 0:\n' +
      '  word = ["h","e","l","l","o"]\n' +
      '  word[0] → "h"   (position 0 = first)\n' +
      '  word[4] → "o"   (position 4 = fifth = last)\n' +
      '  word[-1] → "o"  (Python shortcut: -1 is the last item)\n\n' +
      'ACCESSING LENGTH:\n' +
      '  len(word) → 5   (how many characters)\n' +
      'So the last index is always len(word) - 1.\n\n' +
      'SWAPPING TWO VALUES:\n' +
      '  a, b = 1, 2\n' +
      '  a, b = b, a    # now a=2, b=1  ← Python simultaneous assignment\n\n' +
      'THE TWO-POINTER PATTERN:\n' +
      '  left = 0              # pointer at front\n' +
      '  right = len(s) - 1   # pointer at back\n' +
      '  while left < right:  # keep going until they meet\n' +
      '      swap s[left] and s[right]\n' +
      '      left += 1\n' +
      '      right -= 1',
    approaches: [
      { name: 'Two pointers (in-place)', time: 'O(n)', space: 'O(1)', description: 'Swap from both ends moving inward.', works: true },
      { name: 'Python slice s[::-1]',    time: 'O(n)', space: 'O(n)', description: 'Creates a new reversed list — but violates the in-place requirement.', works: false },
    ],
    visualExample:
`s = ["h","e","l","l","o"]
      ↑              ↑
    left=0        right=4

Step 1: swap s[0] ↔ s[4]  → ["o","e","l","l","h"]
        left=1, right=3
Step 2: swap s[1] ↔ s[3]  → ["o","l","l","e","h"]
        left=2, right=2
left == right → STOP (middle element stays)`,
    keyInsight: 'Two pointers that start at opposite ends and move inward — you only need n/2 swaps to reverse the whole array.',
    patternHint: 'The two-pointer technique works whenever you need to process items from both ends simultaneously.',
    pitfalls: ['Using < instead of <= in the while condition is fine here — when left == right it is the middle element which does not need swapping.', 'Forgetting to increment left AND decrement right each iteration (infinite loop!).'],
  },
};

const VALID_ANAGRAM: DSAProblem = {
  id: 'BP_242_VALID_ANAGRAM',
  leetcodeNum: 242,
  leetcodeSlug: 'valid-anagram',
  leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
  difficulty: 'Easy',
  tags: ['Hash Table', 'String', 'Sorting'],
  statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.',
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true' },
    { input: 's = "rat",     t = "car"',     output: 'false' },
  ],
  constraints: ['1 <= s.length, t.length <= 5 × 10⁴', 's and t consist of lowercase English letters'],
  starterCode: {
    python:
`class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = {}
        for c in s:
            count[c] = count.get(c, 0) + 1
        for c in t:
            if c not in count or count[c] == 0:
                return False
            count[c] -= 1
        return True
`,
    javascript:
`var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;
    for (const c of t) {
        if (!count[c]) return false;
        count[c]--;
    }
    return true;
};`,
  },
  testCases: [
    { label: '"anagram","nagaram"', args: ['anagram','nagaram'], expected: true },
    { label: '"rat","car"',         args: ['rat','car'],         expected: false },
    { label: '"a","a"',             args: ['a','a'],             expected: true },
    { label: '"ab","a"',            args: ['ab','a'],            expected: false },
  ],
  runnerPy: `
sol=Solution()
cases=[('anagram','nagaram',True),('rat','car',False),('a','a',True),('ab','a',False)]
results=[sol.isAnagram(s,t)==e for s,t,e in cases]
print(results)
`,
  runnerJs: `
const sol=isAnagram;
const cases=[['anagram','nagaram',true],['rat','car',false],['a','a',true],['ab','a',false]];
return cases.map(([s,t,e])=>sol(s,t)===e);
`,
  hint: 'Count how many times each letter appears in s. Then go through t and subtract. If any count goes negative, return False.',
  studyGuide: {
    concept: 'Dictionaries (Hash Maps) — Counting Things',
    tldr: 'A dictionary maps keys to values. Use one to count how often each letter appears.',
    explanation:
      'WHAT IS A DICTIONARY?\n' +
      'A dictionary stores key-value pairs — like a real dictionary where the word is the key and the definition is the value:\n' +
      '  ages = {"Alice": 30, "Bob": 25}\n' +
      '  ages["Alice"] → 30\n\n' +
      'COUNTING CHARACTERS IN A STRING:\n' +
      '  count = {}\n' +
      '  for char in "hello":\n' +
      '      if char in count:\n' +
      '          count[char] += 1   # already seen, add 1\n' +
      '      else:\n' +
      '          count[char] = 1    # first time, set to 1\n' +
      '  # count = {"h":1, "e":1, "l":2, "o":1}\n\n' +
      'SHORTCUT — dict.get(key, default):\n' +
      '  count[c] = count.get(c, 0) + 1\n' +
      '  # If c is in count, get its value; otherwise use 0 as default.',
    approaches: [
      { name: 'Character count dictionary', time: 'O(n)', space: 'O(1)', description: 'O(26) = O(1) space since only lowercase letters.', works: true },
      { name: 'Sort both strings',          time: 'O(n log n)', space: 'O(1)', description: 'sorted(s) == sorted(t). Simple but slower.', works: true },
    ],
    visualExample:
`s = "anagram"    t = "nagaram"

Count letters in s:
{"a":3, "n":1, "g":1, "r":1, "m":1}

Subtract letters in t:
n→{"a":3,"n":0,"g":1,"r":1,"m":1}
a→{"a":2,...}
g→{"a":2,"g":0,...}
a→{"a":1,...}
r→{"a":1,"r":0,...}
a→{"a":0,...}
m→{"a":0,"m":0,...}

All counts reached 0 → TRUE ✓`,
    keyInsight: 'If two strings are anagrams, every letter appears the SAME number of times in both. Counting frequencies makes this checkable in one pass.',
    patternHint: 'Any time you need to count "how many of X" or check if two collections have the same items, reach for a dictionary.',
    pitfalls: ['Not checking len(s) == len(t) first — different lengths can never be anagrams.', 'Forgetting that count can go to 0 vs negative: 0 means the budget is used up, negative means t has more than s.'],
  },
};

const JEWELS_STONES: DSAProblem = {
  id: 'BP_771_JEWELS_STONES',
  leetcodeNum: 771,
  leetcodeSlug: 'jewels-and-stones',
  leetcodeUrl: 'https://leetcode.com/problems/jewels-and-stones/',
  difficulty: 'Easy',
  tags: ['Hash Table', 'String'],
  statement: 'You\'re given strings jewels representing the types of stones that are jewels, and stones representing the stones you have. Each character in stones is a type of stone you have. You want to know how many of the stones you have are also jewels.\n\nLetters are case sensitive, so "a" is considered a different type of stone from "A".',
  examples: [
    { input: 'jewels = "aA", stones = "aAAbbbb"', output: '3' },
    { input: 'jewels = "z",  stones = "ZZZ"',     output: '0' },
  ],
  constraints: ['1 <= jewels.length, stones.length <= 50', 'jewels and stones consist of English letters', 'All characters in jewels are unique'],
  starterCode: {
    python:
`class Solution:
    def numJewelsInStones(self, jewels: str, stones: str) -> int:
        jewel_set = set(jewels)   # O(1) lookup
        count = 0
        for stone in stones:
            if stone in jewel_set:
                count += 1
        return count
`,
    javascript:
`var numJewelsInStones = function(jewels, stones) {
    const jewel_set = new Set(jewels);
    let count = 0;
    for (const stone of stones) {
        if (jewel_set.has(stone)) count++;
    }
    return count;
};`,
  },
  testCases: [
    { label: '"aA","aAAbbbb"', args: ['aA','aAAbbbb'], expected: 3 },
    { label: '"z","ZZZ"',      args: ['z','ZZZ'],      expected: 0 },
    { label: '"a","a"',        args: ['a','a'],         expected: 1 },
  ],
  runnerPy: `
sol=Solution()
cases=[('aA','aAAbbbb',3),('z','ZZZ',0),('a','a',1)]
results=[sol.numJewelsInStones(j,s)==e for j,s,e in cases]
print(results)
`,
  runnerJs: `
const sol=numJewelsInStones;
const cases=[['aA','aAAbbbb',3],['z','ZZZ',0],['a','a',1]];
return cases.map(([j,s,e])=>sol(j,s)===e);
`,
  hint: 'Convert jewels to a set. Then loop over each character in stones and check if it is in the set. A set has O(1) lookup.',
  studyGuide: {
    concept: 'Sets — Instant Membership Testing',
    tldr: 'A set stores unique items and checks if something is inside in O(1) — much faster than searching a list.',
    explanation:
      'WHAT IS A SET?\n' +
      'A set is like a bag that only keeps unique items and answers "is X in here?" instantly:\n' +
      '  fruits = {"apple", "banana", "cherry"}\n' +
      '  "apple" in fruits   → True\n' +
      '  "grape" in fruits   → False\n\n' +
      'SET VS LIST FOR SEARCHING:\n' +
      '  list_version = ["apple","banana","cherry"]\n' +
      '  "apple" in list_version  → True, but scans all items (O(n))\n\n' +
      '  set_version = {"apple","banana","cherry"}\n' +
      '  "apple" in set_version   → True, instant lookup (O(1))\n\n' +
      'BUILDING A SET FROM A STRING:\n' +
      '  set("aA") → {"a", "A"}   # each character becomes an element',
    approaches: [
      { name: 'Set + loop', time: 'O(n)', space: 'O(m)', description: 'Convert jewels to set, iterate stones once. n=len(stones), m=len(jewels).', works: true },
      { name: 'Nested loops', time: 'O(n×m)', space: 'O(1)', description: 'For each stone, scan all jewels. Correct but slower.', works: true },
    ],
    visualExample:
`jewels = "aA"    stones = "aAAbbbb"

jewel_set = {"a", "A"}

Loop over stones:
 "a" in {"a","A"} → YES  count=1
 "A" in {"a","A"} → YES  count=2
 "A" in {"a","A"} → YES  count=3
 "b" in {"a","A"} → NO
 "b" in {"a","A"} → NO
 "b" in {"a","A"} → NO
 "b" in {"a","A"} → NO

Result: 3`,
    keyInsight: 'Converting jewels to a set before checking reduces each lookup from O(m) to O(1). This is the "precompute once, query many times" pattern.',
    patternHint: 'Whenever you need to check membership repeatedly ("is X in this collection?"), convert the collection to a set first.',
    pitfalls: ['"a" and "A" are DIFFERENT in this problem. Sets are case-sensitive by default in Python.', 'Building the set inside the inner loop (defeats the purpose of using a set).'],
  },
};

// S1E3_A9 ── Functions & Logic ────────────────────────────────────────────────

const PALINDROME_NUMBER: DSAProblem = {
  id: 'BP_9_PALINDROME',
  leetcodeNum: 9,
  leetcodeSlug: 'palindrome-number',
  leetcodeUrl: 'https://leetcode.com/problems/palindrome-number/',
  difficulty: 'Easy',
  tags: ['Math'],
  statement: 'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not.',
  examples: [
    { input: 'x = 121',  output: 'true',  explanation: '121 reads as 121 from left to right and from right to left.' },
    { input: 'x = -121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.' },
    { input: 'x = 10',   output: 'false', explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.' },
  ],
  constraints: ['-2³¹ <= x <= 2³¹ - 1'],
  starterCode: {
    python:
`class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False         # negative numbers are never palindromes
        s = str(x)               # convert integer to string
        return s == s[::-1]      # compare with its reverse
`,
    javascript:
`var isPalindrome = function(x) {
    if (x < 0) return false;
    const s = String(x);
    return s === s.split('').reverse().join('');
};`,
  },
  testCases: [
    { label: '121',  args: [121],  expected: true },
    { label: '-121', args: [-121], expected: false },
    { label: '10',   args: [10],   expected: false },
    { label: '0',    args: [0],    expected: true },
  ],
  runnerPy: `
sol=Solution()
cases=[(121,True),(-121,False),(10,False),(0,True)]
results=[sol.isPalindrome(x)==e for x,e in cases]
print(results)
`,
  runnerJs: `
const sol=isPalindrome;
const cases=[[121,true],[-121,false],[10,false],[0,true]];
return cases.map(([x,e])=>sol(x)===e);
`,
  hint: 'Convert the number to a string. Then check if the string equals its own reverse. In Python: s[::-1] reverses a string.',
  studyGuide: {
    concept: 'Functions — Writing Reusable, Named Code Blocks',
    tldr: 'A function packages code under a name. You call it by name, pass inputs, and get an output back.',
    explanation:
      'WHAT IS A FUNCTION?\n' +
      'A function is a reusable named block of code. You define it once and call it many times:\n' +
      '  def greet(name):         # "def" defines it, "name" is the input (parameter)\n' +
      '      message = "Hello " + name\n' +
      '      return message       # "return" sends the result back\n\n' +
      '  greet("Alice") → "Hello Alice"\n' +
      '  greet("Bob")   → "Hello Bob"\n\n' +
      'BOOLEAN RETURN VALUES:\n' +
      'Functions can return True or False:\n' +
      '  def is_even(n):\n' +
      '      return n % 2 == 0   # returns True or False\n\n' +
      'CONVERTING TYPES:\n' +
      '  str(123)    → "123"     # integer → string\n' +
      '  int("123")  → 123       # string → integer\n\n' +
      'REVERSING A STRING IN PYTHON:\n' +
      '  s = "hello"\n' +
      '  s[::-1] → "olleh"       # [::-1] is slice syntax meaning "backwards"',
    approaches: [
      { name: 'String conversion + reverse', time: 'O(log n)', space: 'O(log n)', description: 'Convert to string, compare with its reverse. Simple and clean.', works: true },
      { name: 'Math (no string)',             time: 'O(log n)', space: 'O(1)',      description: 'Reverse the number mathematically using % and //.', works: true },
    ],
    visualExample:
`x = 121

Step 1: s = str(121) = "121"
Step 2: reversed = "121"[::-1] = "121"
Step 3: "121" == "121" → True ✓

x = -121
Step 1: x < 0 → return False immediately ✗

x = 10
Step 1: s = "10"
Step 2: reversed = "01"
Step 3: "10" == "01" → False ✗`,
    keyInsight: 'A negative number can never be a palindrome (the "-" sign has no mirror on the other end). Handle this edge case first to avoid bugs.',
    patternHint: 'When a problem says "return true/false", write a function that uses if/else and returns True or False. Python\'s == operator returns a boolean you can return directly.',
    pitfalls: ['Forgetting the negative number edge case (x < 0 → False).', 'Not converting to string before reversing — you cannot use [::-1] on an integer.'],
  },
};

const LENGTH_LAST_WORD: DSAProblem = {
  id: 'BP_58_LENGTH_LAST_WORD',
  leetcodeNum: 58,
  leetcodeSlug: 'length-of-last-word',
  leetcodeUrl: 'https://leetcode.com/problems/length-of-last-word/',
  difficulty: 'Easy',
  tags: ['String'],
  statement: 'Given a string s consisting of words and spaces, return the length of the last word in the string.\n\nA word is a maximal substring consisting of non-space characters only.',
  examples: [
    { input: 's = "Hello World"',             output: '5' },
    { input: 's = "   fly me   to   the moon  "', output: '4' },
    { input: 's = "luffy is still joyboy"',   output: '6' },
  ],
  constraints: ['1 <= s.length <= 10⁴', 's consists of only English letters and spaces', 'There will be at least one word in s'],
  starterCode: {
    python:
`class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        parts = s.strip().split()  # strip trailing spaces, split on whitespace
        return len(parts[-1])      # last element, -1 means "last"
`,
    javascript:
`var lengthOfLastWord = function(s) {
    const parts = s.trim().split(/\s+/);
    return parts[parts.length - 1].length;
};`,
  },
  testCases: [
    { label: '"Hello World"',              args: ['Hello World'],             expected: 5 },
    { label: '"   fly me   to   the moon  "', args: ['   fly me   to   the moon  '], expected: 4 },
    { label: '"luffy is still joyboy"',    args: ['luffy is still joyboy'],   expected: 6 },
  ],
  runnerPy: `
sol=Solution()
cases=[('Hello World',5),('   fly me   to   the moon  ',4),('luffy is still joyboy',6)]
results=[sol.lengthOfLastWord(s)==e for s,e in cases]
print(results)
`,
  runnerJs: `
const sol=lengthOfLastWord;
const cases=[['Hello World',5],['   fly me   to   the moon  ',4],['luffy is still joyboy',6]];
return cases.map(([s,e])=>sol(s)===e);
`,
  hint: 'strip() removes leading/trailing spaces. split() with no arguments splits on any whitespace and ignores extra spaces. Then take the last element.',
  studyGuide: {
    concept: 'String Methods — Tools Built Into Every String',
    tldr: 'Strings come with built-in tools like .strip(), .split(), and .upper(). Call them with a dot after the string variable.',
    explanation:
      'STRING METHODS:\n' +
      'Every string in Python has built-in methods you call with a dot (.):\n' +
      '  s = "  hello world  "\n' +
      '  s.strip()          → "hello world"    # remove leading/trailing spaces\n' +
      '  s.upper()          → "  HELLO WORLD  " # uppercase\n' +
      '  s.replace("l","L") → "  heLLo worLd  " # replace characters\n\n' +
      'SPLIT — turn one string into a list of parts:\n' +
      '  "hello world".split()         → ["hello","world"]  # split on whitespace\n' +
      '  "a,b,c".split(",")            → ["a","b","c"]       # split on comma\n' +
      '  "a   b   c".split()           → ["a","b","c"]       # ignores extra spaces!\n\n' +
      'NEGATIVE INDEXING:\n' +
      '  parts = ["one","two","three"]\n' +
      '  parts[-1]  → "three"   # last element\n' +
      '  parts[-2]  → "two"     # second-to-last',
    approaches: [
      { name: '.strip().split()[-1]', time: 'O(n)', space: 'O(n)', description: 'Most readable. One line using built-in methods.', works: true },
      { name: 'Walk from end',        time: 'O(n)', space: 'O(1)', description: 'Scan from the right, skip spaces, count non-space characters.', works: true },
    ],
    visualExample:
`s = "   fly me   to   the moon  "

Step 1: s.strip()   → "fly me   to   the moon"
Step 2: .split()    → ["fly","me","to","the","moon"]
Step 3: [-1]        → "moon"
Step 4: len("moon") → 4`,
    keyInsight: '.split() without arguments handles ALL whitespace (spaces, tabs, multiple spaces) and ignores leading/trailing spaces — exactly what you need here.',
    patternHint: 'Learn a dozen string methods (strip, split, join, replace, find, startswith, endswith) and most string problems become one-liners.',
    pitfalls: ['Using s.split(" ") instead of s.split() — this does NOT collapse multiple spaces, giving you empty strings in the list.', 'Not calling strip() first — trailing spaces would make the last element an empty string.'],
  },
};

const FIBONACCI: DSAProblem = {
  id: 'BP_509_FIBONACCI',
  leetcodeNum: 509,
  leetcodeSlug: 'fibonacci-number',
  leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/',
  difficulty: 'Easy',
  tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
  statement: 'The Fibonacci numbers, commonly denoted F(n), form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n-1) + F(n-2) for n > 1\n\nGiven n, calculate F(n).',
  examples: [
    { input: 'n = 2', output: '1',  explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
    { input: 'n = 3', output: '2',  explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
    { input: 'n = 4', output: '3',  explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' },
  ],
  constraints: ['0 <= n <= 30'],
  starterCode: {
    python:
`class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n               # base cases: F(0)=0, F(1)=1
        a, b = 0, 1
        for _ in range(2, n + 1): # iterate from 2 to n
            a, b = b, a + b       # a=prev, b=new_fib
        return b
`,
    javascript:
`var fib = function(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
};`,
  },
  testCases: [
    { label: 'n=0',  args: [0],  expected: 0 },
    { label: 'n=1',  args: [1],  expected: 1 },
    { label: 'n=6',  args: [6],  expected: 8 },
    { label: 'n=10', args: [10], expected: 55 },
  ],
  runnerPy: `
sol=Solution()
cases=[(0,0),(1,1),(6,8),(10,55)]
results=[sol.fib(n)==e for n,e in cases]
print(results)
`,
  runnerJs: `
const sol=fib;
const cases=[[0,0],[1,1],[6,8],[10,55]];
return cases.map(([n,e])=>sol(n)===e);
`,
  hint: 'Keep track of just the two previous numbers. Each step: new_value = a + b, then shift: a becomes old b, b becomes new_value.',
  studyGuide: {
    concept: 'Recursion vs Iteration — Two Ways to Solve the Same Problem',
    tldr: 'Fibonacci can be defined recursively (F(n) = F(n-1) + F(n-2)) but an iterative loop with two variables is simpler and much faster.',
    explanation:
      'THE FIBONACCI SEQUENCE:\n' +
      '  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...\n' +
      'Each number is the sum of the two before it.\n\n' +
      'RECURSION (calling a function inside itself):\n' +
      '  def fib(n):\n' +
      '      if n <= 1: return n   # base case — MUST have this to stop\n' +
      '      return fib(n-1) + fib(n-2)\n\n' +
      'This is correct but SLOW — it recalculates the same values many times.\n' +
      'fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2). fib(3) is computed twice!\n\n' +
      'ITERATIVE (loop with two variables):\n' +
      '  a, b = 0, 1      # a=F(0), b=F(1)\n' +
      '  for i in range(n - 1):\n' +
      '      a, b = b, a + b   # slide the window forward\n' +
      '  return b\n\n' +
      'This is O(n) time and O(1) space — much better.',
    approaches: [
      { name: 'Naive recursion',         time: 'O(2ⁿ)', space: 'O(n)',  description: 'Intuitive but exponential — fib(30) makes ~10⁹ calls.', works: true },
      { name: 'Iterative (two vars)',    time: 'O(n)',   space: 'O(1)',  description: 'Keep only prev and curr. Best approach.', works: true },
      { name: 'Memoized recursion',      time: 'O(n)',   space: 'O(n)',  description: 'Cache already-computed values. Same speed as iterative.', works: true },
    ],
    visualExample:
`Tracing the iterative solution for n=6:

Start: a=0, b=1
i=2: a,b = 1, 0+1=1   → a=1, b=1
i=3: a,b = 1, 1+1=2   → a=1, b=2
i=4: a,b = 2, 1+2=3   → a=2, b=3
i=5: a,b = 3, 2+3=5   → a=3, b=5
i=6: a,b = 5, 3+5=8   → a=5, b=8

return b = 8 ✓   (F(6) = 8)`,
    keyInsight: 'You only ever need the LAST TWO Fibonacci numbers to compute the next one. So instead of storing the entire sequence, keep just two variables and update them.',
    patternHint: 'When a recursive solution is correct but slow (overlapping sub-problems), either add memoization or convert to an iterative loop.',
    pitfalls: ['Forgetting the base case in recursive solutions — without "if n <= 1: return n", the recursion never stops.', 'In the iterative version, the loop should run n-1 times starting at index 2, not n times.'],
  },
};

// S1E4_A9 ── Lists & Searching ────────────────────────────────────────────────

const CONTAINS_DUPLICATE: DSAProblem = {
  id: 'BP_217_CONTAINS_DUP',
  leetcodeNum: 217,
  leetcodeSlug: 'contains-duplicate',
  leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table', 'Sorting'],
  statement: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
  examples: [
    { input: 'nums = [1,2,3,1]',           output: 'true' },
    { input: 'nums = [1,2,3,4]',           output: 'false' },
    { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
  ],
  constraints: ['1 <= nums.length <= 10⁵', '-10⁹ <= nums[i] <= 10⁹'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for num in nums:
            if num in seen:
                return True    # found a duplicate!
            seen.add(num)
        return False
`,
    javascript:
`var containsDuplicate = function(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
};`,
  },
  testCases: [
    { label: '[1,2,3,1]',           args: [[1,2,3,1]],           expected: true },
    { label: '[1,2,3,4]',           args: [[1,2,3,4]],           expected: false },
    { label: '[1,1,1,3,3,4,3,2,4,2]', args: [[1,1,1,3,3,4,3,2,4,2]], expected: true },
  ],
  runnerPy: `
sol=Solution()
cases=[([1,2,3,1],True),([1,2,3,4],False),([1,1,1,3,3,4,3,2,4,2],True)]
results=[sol.containsDuplicate(n)==e for n,e in cases]
print(results)
`,
  runnerJs: `
const sol=containsDuplicate;
const cases=[[[1,2,3,1],true],[[1,2,3,4],false]];
return cases.map(([n,e])=>sol(n)===e);
`,
  hint: 'Use a set to remember all numbers you have already seen. If you try to add a number that is already in the set, you found a duplicate.',
  studyGuide: {
    concept: 'Searching in Lists — Brute Force vs Smart Lookup',
    tldr: 'A set remembers everything you have already seen and checks membership in O(1). Use it whenever you need to detect "have I seen this before?"',
    explanation:
      'THE BRUTE FORCE APPROACH (SLOW):\n' +
      '  For every element, check all OTHER elements:\n' +
      '  for i in range(len(nums)):\n' +
      '      for j in range(i+1, len(nums)):\n' +
      '          if nums[i] == nums[j]: return True\n' +
      '  This is O(n²) — too slow for large lists.\n\n' +
      'THE SMART APPROACH (SET LOOKUP):\n' +
      '  A set stores items and answers "is X in here?" instantly (O(1)).\n' +
      '  seen = set()\n' +
      '  for num in nums:\n' +
      '      if num in seen: return True   # duplicate!\n' +
      '      seen.add(num)                 # remember for later\n' +
      '  return False\n\n' +
      'ADDING TO A SET:\n' +
      '  s = set()\n' +
      '  s.add(5)     # s = {5}\n' +
      '  s.add(3)     # s = {5, 3}\n' +
      '  5 in s       → True\n' +
      '  7 in s       → False',
    approaches: [
      { name: 'Nested loops (brute force)', time: 'O(n²)', space: 'O(1)', description: 'Compare every pair. Correct but slow for large inputs.', works: true },
      { name: 'Set membership tracking',   time: 'O(n)',   space: 'O(n)', description: 'Add each number to a set; return True on first repeat.', works: true },
      { name: 'Sort then compare adjacent', time: 'O(n log n)', space: 'O(1)', description: 'Sort list, then check if adjacent elements are equal.', works: true },
    ],
    visualExample:
`nums = [1, 2, 3, 1]

seen = {}
Step 1: 1 not in seen → add 1  → seen={1}
Step 2: 2 not in seen → add 2  → seen={1,2}
Step 3: 3 not in seen → add 3  → seen={1,2,3}
Step 4: 1 IN seen! → return True ✓`,
    keyInsight: '"Have I seen this before?" is the canonical use case for a set. Process items one at a time, checking membership before adding.',
    patternHint: 'When you need to track "previously seen" items, use a set. When you need to track "how many times seen", use a dictionary.',
    pitfalls: ['Adding to the set BEFORE checking — should check first, then add.', 'Using a list instead of set for seen — list membership check is O(n), making the whole thing O(n²).'],
  },
};

const TWO_SUM: DSAProblem = {
  id: 'BP_1_TWO_SUM',
  leetcodeNum: 1,
  leetcodeSlug: 'two-sum',
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table'],
  statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9',  output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].' },
    { input: 'nums = [3,2,4],     target = 6',  output: '[1,2]' },
    { input: 'nums = [3,3],       target = 6',  output: '[0,1]' },
  ],
  constraints: ['2 <= nums.length <= 10⁴', '-10⁹ <= nums[i] <= 10⁹', '-10⁹ <= target <= 10⁹', 'Only one valid answer exists'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}   # maps number → its index
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
`,
    javascript:
`var twoSum = function(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in seen) return [seen[complement], i];
        seen[nums[i]] = i;
    }
    return [];
};`,
  },
  testCases: [
    { label: '[2,7,11,15] t=9', args: [[2,7,11,15], 9], expected: [0,1] },
    { label: '[3,2,4] t=6',     args: [[3,2,4], 6],     expected: [1,2] },
    { label: '[3,3] t=6',       args: [[3,3], 6],       expected: [0,1] },
  ],
  runnerPy: `
sol=Solution()
cases=[([2,7,11,15],9,[0,1]),([3,2,4],6,[1,2]),([3,3],6,[0,1])]
results=[sorted(sol.twoSum(n,t))==sorted(e) for n,t,e in cases]
print(results)
`,
  runnerJs: `
const sol=twoSum;
const cases=[[[2,7,11,15],9,[0,1]],[[3,2,4],6,[1,2]],[[3,3],6,[0,1]]];
return cases.map(([n,t,e])=>JSON.stringify([...sol(n,t)].sort())==JSON.stringify([...e].sort()));
`,
  hint: 'For each number x, you need target - x. Store every number you have seen in a dictionary (number → index). Before storing x, check if target - x is already there.',
  studyGuide: {
    concept: 'Hash Map Lookup — Trading Space for Speed',
    tldr: 'Store past values in a dictionary. For each new element, check if its "complement" (what you need to pair with it) is already stored.',
    explanation:
      'THE KEY INSIGHT:\n' +
      'For nums[i] = x, you need to find j such that nums[j] = target - x.\n' +
      'Instead of searching for that value each time (O(n)), store all seen values in a dictionary and look up instantly (O(1)).\n\n' +
      'ENUMERATE — loop with index AND value:\n' +
      '  for i, val in enumerate([10, 20, 30]):\n' +
      '      print(i, val)   # 0 10, then 1 20, then 2 30\n\n' +
      'DICTIONARY WITH INDEX:\n' +
      '  seen = {}\n' +
      '  seen[7] = 1    # "the number 7 lives at index 1"\n' +
      '  7 in seen      → True\n' +
      '  seen[7]        → 1  (its index)\n\n' +
      'ALGORITHM:\n' +
      '  for i, num in enumerate(nums):\n' +
      '      complement = target - num\n' +
      '      if complement in seen:\n' +
      '          return [seen[complement], i]  # found the pair!\n' +
      '      seen[num] = i',
    approaches: [
      { name: 'Brute force',     time: 'O(n²)', space: 'O(1)', description: 'Check every pair (i, j). Simple but too slow for large inputs.', works: true },
      { name: 'Hash map (1 pass)', time: 'O(n)', space: 'O(n)', description: 'Store each number in a dict as you go. Check complement before storing.', works: true },
    ],
    visualExample:
`nums = [2, 7, 11, 15],  target = 9

i=0: num=2, complement=9-2=7
     7 not in seen → store: seen={2:0}

i=1: num=7, complement=9-7=2
     2 IS in seen (at index 0)!
     return [seen[2], 1] = [0, 1] ✓`,
    keyInsight: 'You do not need to check all pairs. For each element you process, its partner either came before it (already in seen) or comes after it (will be found when processing that partner).',
    patternHint: '"Two Sum" is the gateway to hash-map thinking. Whenever you need to find two elements satisfying a relationship, build a dictionary as you scan.',
    pitfalls: ['Checking complement AFTER storing num — then [3,3], target=6 would incorrectly find index 0 pairing with itself (seen[3]=0, but we just stored it).', 'Using a list instead of dict for seen — you would lose the index information.'],
  },
};

const BEST_TIME_STOCK: DSAProblem = {
  id: 'BP_121_BEST_TIME_STOCK',
  leetcodeNum: 121,
  leetcodeSlug: 'best-time-to-buy-and-sell-stock',
  leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  difficulty: 'Easy',
  tags: ['Array', 'Dynamic Programming'],
  statement: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' },
    { input: 'prices = [7,6,4,3,1]',   output: '0', explanation: 'No transaction gives a profit, so return 0.' },
  ],
  constraints: ['1 <= prices.length <= 10⁵', '0 <= prices[i] <= 10⁴'],
  starterCode: {
    python:
`from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = prices[0]   # cheapest price seen so far
        max_profit = 0          # best profit seen so far
        for price in prices:
            min_price = min(min_price, price)           # update if cheaper
            max_profit = max(max_profit, price - min_price)  # update if better profit
        return max_profit
`,
    javascript:
`var maxProfit = function(prices) {
    let min_price = prices[0], max_profit = 0;
    for (const price of prices) {
        min_price = Math.min(min_price, price);
        max_profit = Math.max(max_profit, price - min_price);
    }
    return max_profit;
};`,
  },
  testCases: [
    { label: '[7,1,5,3,6,4]', args: [[7,1,5,3,6,4]], expected: 5 },
    { label: '[7,6,4,3,1]',   args: [[7,6,4,3,1]],   expected: 0 },
    { label: '[1,2]',          args: [[1,2]],          expected: 1 },
    { label: '[2,1]',          args: [[2,1]],          expected: 0 },
  ],
  runnerPy: `
sol=Solution()
cases=[([7,1,5,3,6,4],5),([7,6,4,3,1],0),([1,2],1),([2,1],0)]
results=[sol.maxProfit(p)==e for p,e in cases]
print(results)
`,
  runnerJs: `
const sol=maxProfit;
const cases=[[[7,1,5,3,6,4],5],[[7,6,4,3,1],0],[[1,2],1],[[2,1],0]];
return cases.map(([p,e])=>sol(p)===e);
`,
  hint: 'Track the minimum price seen so far as you scan left to right. At each day, compute profit = current_price - min_price. Track the maximum profit.',
  studyGuide: {
    concept: 'Single-Pass Tracking — Keep the Best Seen So Far',
    tldr: 'Walk through the array once. Keep two variables: the minimum value seen so far and the best result so far. Update both as you go.',
    explanation:
      'THE CONSTRAINT:\n' +
      'You must buy BEFORE you sell. So you cannot scan right-to-left.\n\n' +
      'NAIVE APPROACH (too slow):\n' +
      '  Try every pair of days (buy i, sell j where j > i).\n' +
      '  O(n²) pairs — too slow for large inputs.\n\n' +
      'SMART APPROACH — TRACKING MINIMUM AS YOU SCAN:\n' +
      '  If we are at day j and want to maximise profit = prices[j] - prices[i],\n' +
      '  we want prices[i] to be as SMALL AS POSSIBLE for all i < j.\n' +
      '  So just keep track of the minimum price seen so far!\n\n' +
      '  min_price = prices[0]     # cheapest buying opportunity\n' +
      '  max_profit = 0\n' +
      '  for price in prices:\n' +
      '      min_price = min(min_price, price)        # cheapest to buy\n' +
      '      profit = price - min_price               # profit if sold today\n' +
      '      max_profit = max(max_profit, profit)     # best profit so far\n\n' +
      'min() and max() FUNCTIONS:\n' +
      '  min(3, 7) → 3    (return the smaller)\n' +
      '  max(3, 7) → 7    (return the larger)',
    approaches: [
      { name: 'Brute force (all pairs)', time: 'O(n²)', space: 'O(1)', description: 'Try every (i, j) pair. Too slow for n=10⁵.', works: true },
      { name: 'One-pass with min tracking', time: 'O(n)', space: 'O(1)', description: 'Single scan, track min_price and max_profit.', works: true },
    ],
    visualExample:
`prices = [7, 1, 5, 3, 6, 4]
           ↑  ↑  ↑  ↑  ↑  ↑ day

Day 1: price=7, min=7,  profit=0,  max_profit=0
Day 2: price=1, min=1,  profit=0,  max_profit=0  ← new min!
Day 3: price=5, min=1,  profit=4,  max_profit=4
Day 4: price=3, min=1,  profit=2,  max_profit=4
Day 5: price=6, min=1,  profit=5,  max_profit=5  ← new best!
Day 6: price=4, min=1,  profit=3,  max_profit=5

Answer: 5`,
    keyInsight: 'You do not need to remember all past prices — only the MINIMUM so far. The optimal buy day is always the cheapest day before the current sell day.',
    patternHint: '"Maximum/minimum over a range with a constraint (order)" → single-pass tracking. Keep one variable for the best seen so far, update it greedily.',
    pitfalls: ['Returning min_price instead of max_profit (completely different thing!).', 'Not initialising max_profit to 0 — if prices are always decreasing, no profitable trade exists and the answer is 0, not a negative number.'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  ARC 1 REMAINING — ALGORITHMS  (brief study guides, DSA-level audience)
// ─────────────────────────────────────────────────────────────────────────────

const mkDSA = (p: DSAProblem): DSAProblem => p;

const FIND_PATH = mkDSA({ id:'DSA_1971_FIND_PATH', leetcodeNum:1971, leetcodeSlug:'find-if-path-exists-in-graph', leetcodeUrl:'https://leetcode.com/problems/find-if-path-exists-in-graph/', difficulty:'Easy', tags:['BFS','DFS','Graph'], statement:'There is a bi-directional graph with n vertices. You are given an integer n and a 2D integer array edges where edges[i]=[u,v] denotes a bi-directional edge between vertices u and v. Return true if there is a valid path from source to destination, or false otherwise.', examples:[{input:'n=3, edges=[[0,1],[1,2],[2,0]], source=0, destination=2',output:'true'},{input:'n=6, edges=[[0,1],[0,2],[3,5],[5,4],[4,3]], source=0, destination=5',output:'false'}], constraints:['1 <= n <= 2×10⁵'], starterCode:{python:`class Solution:\n    def validPath(self, n, edges, source, destination):\n        if source == destination: return True\n        adj = {i:[] for i in range(n)}\n        for u,v in edges:\n            adj[u].append(v); adj[v].append(u)\n        visited = set()\n        stack = [source]\n        while stack:\n            node = stack.pop()\n            if node == destination: return True\n            if node in visited: continue\n            visited.add(node)\n            stack.extend(adj[node])\n        return False\n`,javascript:`var validPath=function(n,edges,source,destination){if(source===destination)return true;const adj=Array.from({length:n},()=>[]);edges.forEach(([u,v])=>{adj[u].push(v);adj[v].push(u)});const visited=new Set(),stack=[source];while(stack.length){const node=stack.pop();if(node===destination)return true;if(visited.has(node))continue;visited.add(node);stack.push(...adj[node])}return false};`}, testCases:[{label:'n=3 src=0 dst=2',args:[3,[[0,1],[1,2],[2,0]],0,2],expected:true},{label:'n=6 src=0 dst=5',args:[6,[[0,1],[0,2],[3,5],[5,4],[4,3]],0,5],expected:false}], runnerPy:`sol=Solution()\nresults=[sol.validPath(3,[[0,1],[1,2],[2,0]],0,2)==True,sol.validPath(6,[[0,1],[0,2],[3,5],[5,4],[4,3]],0,5)==False]\nprint(results)\n`, runnerJs:`const sol=validPath;return[sol(3,[[0,1],[1,2],[2,0]],0,2)===true,sol(6,[[0,1],[0,2],[3,5],[5,4],[4,3]],0,5)===false];`, hint:'DFS or BFS from source. Mark visited. If you reach destination, return True.', studyGuide:{concept:'Graph Traversal — DFS & BFS',tldr:'Build an adjacency list, then explore nodes from the source using a stack (DFS) or queue (BFS).',explanation:'An adjacency list stores each node\'s neighbors. DFS uses a stack (or recursion), BFS uses a queue. Mark nodes visited to avoid cycles.',approaches:[{name:'DFS (stack)',time:'O(V+E)',space:'O(V+E)',description:'Stack-based exploration.',works:true},{name:'BFS (queue)',time:'O(V+E)',space:'O(V+E)',description:'Level-by-level exploration.',works:true}],visualExample:'Build adj list → push source onto stack → pop node → if destination: return True → push unvisited neighbors.',keyInsight:'Both DFS and BFS visit every reachable node. Use DFS for simplicity, BFS when you need shortest path.',patternHint:'Graph connectivity = DFS/BFS from a source node.',pitfalls:['Not marking nodes visited → infinite loop on cycles.','Building undirected graph as directed (add edge both ways).']}});

const COURSE_SCHEDULE = mkDSA({ id:'DSA_207_COURSE_SCHED', leetcodeNum:207, leetcodeSlug:'course-schedule', leetcodeUrl:'https://leetcode.com/problems/course-schedule/', difficulty:'Medium', tags:['DFS','Topological Sort','Graph'], statement:'There are numCourses courses (0..numCourses-1). prerequisites[i]=[a,b] means you must take b before a. Return true if you can finish all courses.', examples:[{input:'numCourses=2, prerequisites=[[1,0]]',output:'true'},{input:'numCourses=2, prerequisites=[[1,0],[0,1]]',output:'false'}], constraints:['1 <= numCourses <= 2000'], starterCode:{python:`from typing import List\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        adj = [[] for _ in range(numCourses)]\n        for a,b in prerequisites:\n            adj[b].append(a)\n        # 0=unvisited 1=visiting 2=visited\n        state = [0] * numCourses\n        def dfs(node):\n            if state[node] == 1: return False  # cycle!\n            if state[node] == 2: return True\n            state[node] = 1\n            for nxt in adj[node]:\n                if not dfs(nxt): return False\n            state[node] = 2\n            return True\n        return all(dfs(i) for i in range(numCourses))\n`,javascript:`var canFinish=function(n,pre){const adj=Array.from({length:n},()=>[]);pre.forEach(([a,b])=>adj[b].push(a));const state=new Array(n).fill(0);function dfs(node){if(state[node]===1)return false;if(state[node]===2)return true;state[node]=1;for(const nxt of adj[node])if(!dfs(nxt))return false;state[node]=2;return true;}return Array.from({length:n},(_,i)=>i).every(dfs);};`}, testCases:[{label:'2 courses [[1,0]]',args:[2,[[1,0]]],expected:true},{label:'2 courses cycle',args:[2,[[1,0],[0,1]]],expected:false}], runnerPy:`sol=Solution()\nresults=[sol.canFinish(2,[[1,0]])==True,sol.canFinish(2,[[1,0],[0,1]])==False]\nprint(results)\n`, runnerJs:`const sol=canFinish;return[sol(2,[[1,0]])===true,sol(2,[[1,0],[0,1]])===false];`, hint:'Model as directed graph. Cycle detection via DFS with three states: unvisited, visiting (in current path), visited (fully processed).', studyGuide:{concept:'Cycle Detection in Directed Graphs',tldr:'DFS with three node states (unvisited/visiting/done). A back-edge to a "visiting" node means a cycle.',explanation:'Topological ordering exists if and only if the directed graph is acyclic (DAG). DFS with coloring: white=0, gray=1 (in stack), black=2 (done).',approaches:[{name:'DFS cycle detection',time:'O(V+E)',space:'O(V+E)',description:'Three-state DFS. Standard approach.',works:true},{name:'Kahn\'s BFS (in-degree)',time:'O(V+E)',space:'O(V)',description:'Process nodes with in-degree 0. Cycle if any node is left.',works:true}],visualExample:'Node in state 1 (gray) means its DFS is still in progress. Encountering it again = back-edge = cycle.',keyInsight:'If DFS encounters a node currently on the recursion stack, the graph has a cycle.',patternHint:'Scheduling / dependency problems → topological sort → cycle detection.',pitfalls:['Using visited bool instead of three states — misses back-edges.','Forgetting to call DFS on all nodes, not just node 0.']}});

const REDUNDANT_CONN = mkDSA({ id:'DSA_684_REDUNDANT_CONN', leetcodeNum:684, leetcodeSlug:'redundant-connection', leetcodeUrl:'https://leetcode.com/problems/redundant-connection/', difficulty:'Medium', tags:['Union-Find','DFS','Graph'], statement:'In an undirected graph that started as a tree, one extra edge was added. Find and return that edge. If multiple answers exist, return the last one in the input.', examples:[{input:'edges=[[1,2],[1,3],[2,3]]',output:'[2,3]'},{input:'edges=[[1,2],[2,3],[3,4],[1,4],[1,5]]',output:'[1,4]'}], constraints:['n == edges.length, 3 <= n <= 1000'], starterCode:{python:`from typing import List\nclass Solution:\n    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:\n        parent = list(range(len(edges)+1))\n        def find(x):\n            while parent[x] != x: parent[x]=parent[parent[x]]; x=parent[x]\n            return x\n        def union(x,y):\n            px,py=find(x),find(y)\n            if px==py: return False\n            parent[px]=py; return True\n        for u,v in edges:\n            if not union(u,v): return [u,v]\n        return []\n`,javascript:`var findRedundantConnection=function(edges){const parent=Array.from({length:edges.length+1},(_,i)=>i);function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}for(const[u,v]of edges){const pu=find(u),pv=find(v);if(pu===pv)return[u,v];parent[pu]=pv;}return[];};`}, testCases:[{label:'[[1,2],[1,3],[2,3]]',args:[[[1,2],[1,3],[2,3]]],expected:[2,3]},{label:'[[1,2],[2,3],[3,4],[1,4],[1,5]]',args:[[[1,2],[2,3],[3,4],[1,4],[1,5]]],expected:[1,4]}], runnerPy:`sol=Solution()\nresults=[sol.findRedundantConnection([[1,2],[1,3],[2,3]])==[2,3],sol.findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])==[1,4]]\nprint(results)\n`, runnerJs:`const sol=findRedundantConnection;return[JSON.stringify(sol([[1,2],[1,3],[2,3]]))==='[2,3]',JSON.stringify(sol([[1,2],[2,3],[3,4],[1,4],[1,5]]))==='[1,4]'];`, hint:'Union-Find: process edges one by one. If both endpoints already share the same root, this edge creates a cycle — it is the answer.', studyGuide:{concept:'Union-Find (Disjoint Set Union)',tldr:'Union-Find tracks connected components. find(x) returns the root of x\'s component. union(x,y) merges two components. A cycle exists when find(x)==find(y) before union.',explanation:'parent[i] = i initially (each node is its own root). find() follows parent pointers to the root (with path compression). union() makes one root point to the other.',approaches:[{name:'Union-Find',time:'O(n·α(n))',space:'O(n)',description:'Near-linear. The standard algorithm for this problem.',works:true},{name:'DFS',time:'O(n²)',space:'O(n)',description:'For each edge, DFS check if u and v are already connected.',works:true}],visualExample:'Edge [2,3]: find(2)=1, find(3)=2 → different roots, union. Edge [1,2] cycle: find(1)=1, find(2)=1 → same root → REDUNDANT.',keyInsight:'Union-Find detects cycles in O(1) amortized per edge. The redundant edge is the one that tries to merge two already-connected nodes.',patternHint:'Connected components, cycle detection in undirected graphs, minimum spanning tree → Union-Find.',pitfalls:['Path compression in find() is optional but speeds things up significantly.','Processing edges in order matters — return the LAST offending edge.']}});

const SUBSETS = mkDSA({ id:'DSA_78_SUBSETS', leetcodeNum:78, leetcodeSlug:'subsets', leetcodeUrl:'https://leetcode.com/problems/subsets/', difficulty:'Medium', tags:['Array','Backtracking','Bit Manipulation'], statement:'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.', examples:[{input:'nums=[1,2,3]',output:'[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'},{input:'nums=[0]',output:'[[],[0]]'}], constraints:['1 <= nums.length <= 10'], starterCode:{python:`from typing import List\nclass Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        result = []\n        def backtrack(start, path):\n            result.append(path[:])   # record current subset\n            for i in range(start, len(nums)):\n                path.append(nums[i])\n                backtrack(i+1, path)\n                path.pop()           # undo choice\n        backtrack(0, [])\n        return result\n`,javascript:`var subsets=function(nums){const result=[];function bt(start,path){result.push([...path]);for(let i=start;i<nums.length;i++){path.push(nums[i]);bt(i+1,path);path.pop();}}bt(0,[]);return result;};`}, testCases:[{label:'[1,2,3]',args:[[1,2,3]],expected:[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]},{label:'[0]',args:[[0]],expected:[[],[0]]}], runnerPy:`sol=Solution()\ng1=sol.subsets([1,2,3])\ng2=sol.subsets([0])\nresults=[sorted([sorted(s) for s in g1])==sorted([sorted(s) for s in [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]]),sorted([sorted(s) for s in g2])==sorted([sorted(s) for s in [[],[0]]])]\nprint(results)\n`, runnerJs:`const sol=subsets;const g=sol([1,2,3]);return[g.length===8];`, hint:'Backtracking: at each step choose to include or exclude nums[i]. Record the current path at every recursive call (not just the base case).', studyGuide:{concept:'Backtracking — Exploring All Choices',tldr:'Backtracking builds all solutions by trying each choice, recursing, then undoing (backtracking) to try the next choice.',explanation:'Template: choose → recurse → unchoose. For subsets, at index i you decide to include nums[i] or skip it. Record every path (subset) immediately.',approaches:[{name:'Backtracking',time:'O(2ⁿ·n)',space:'O(n)',description:'Classic approach. Explore include/exclude tree.',works:true},{name:'Iterative BFS',time:'O(2ⁿ·n)',space:'O(2ⁿ·n)',description:'Start with [[]], then for each num add it to all existing subsets.',works:true}],visualExample:'nums=[1,2,3]: tree has 2³=8 leaves. Each leaf is a subset.',keyInsight:'Record the current state at EVERY node of the recursion tree, not just leaves.',patternHint:'Generate all combinations/permutations/subsets → backtracking with choose/recurse/unchoose template.',pitfalls:['Appending path directly (it gets mutated) — always append path[:] (a copy).','Starting inner loop at 0 instead of start — creates duplicates.']}});

const PERMUTATIONS = mkDSA({ id:'DSA_46_PERMUTATIONS', leetcodeNum:46, leetcodeSlug:'permutations', leetcodeUrl:'https://leetcode.com/problems/permutations/', difficulty:'Medium', tags:['Array','Backtracking'], statement:'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.', examples:[{input:'nums=[1,2,3]',output:'[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'}], constraints:['1 <= nums.length <= 6'], starterCode:{python:`from typing import List\nclass Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        result = []\n        def backtrack(start):\n            if start == len(nums):\n                result.append(nums[:])\n                return\n            for i in range(start, len(nums)):\n                nums[start], nums[i] = nums[i], nums[start]\n                backtrack(start+1)\n                nums[start], nums[i] = nums[i], nums[start]\n        backtrack(0)\n        return result\n`,javascript:`var permute=function(nums){const result=[];function bt(start){if(start===nums.length){result.push([...nums]);return;}for(let i=start;i<nums.length;i++){[nums[start],nums[i]]=[nums[i],nums[start]];bt(start+1);[nums[start],nums[i]]=[nums[i],nums[start]];}}bt(0);return result;};`}, testCases:[{label:'[1,2,3]',args:[[1,2,3]],expected:[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]}], runnerPy:`sol=Solution()\ng=sol.permute([1,2,3])\nresults=[sorted([sorted(p) for p in g])==sorted([sorted(p) for p in [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]])]\nprint(results)\n`, runnerJs:`const sol=permute;return[sol([1,2,3]).length===6];`, hint:'Swap nums[start] with each nums[i] for i>=start, recurse for start+1, then swap back.', studyGuide:{concept:'Permutations via Swap-Based Backtracking',tldr:'Fix each position by trying every remaining element. Swap in, recurse, swap back.',explanation:'At position start, try placing each nums[i] (i >= start) there by swapping with nums[start]. Recurse for start+1. Undo swap.',approaches:[{name:'Swap backtracking',time:'O(n!·n)',space:'O(n)',description:'n! permutations, each of length n.',works:true}],visualExample:'[1,2,3]: fix pos 0 with 1,2,3. For pos 0=1, fix pos 1 with 2,3. For pos 1=2, fix pos 2 with 3. → [1,2,3].',keyInsight:'Swapping elements lets you use the array itself as the "current permutation" without extra storage.',patternHint:'Permutations = all orderings = fix-each-position backtracking.',pitfalls:['Forgetting the swap-back step — the undo is critical.','Recording nums instead of nums[:] — records a reference, not a snapshot.']}});

const COMBINATION_SUM = mkDSA({ id:'DSA_39_COMBINATION_SUM', leetcodeNum:39, leetcodeSlug:'combination-sum', leetcodeUrl:'https://leetcode.com/problems/combination-sum/', difficulty:'Medium', tags:['Array','Backtracking'], statement:'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.', examples:[{input:'candidates=[2,3,6,7], target=7',output:'[[2,2,3],[7]]'}], constraints:['1 <= candidates.length <= 30'], starterCode:{python:`from typing import List\nclass Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        result = []\n        def backtrack(start, path, remaining):\n            if remaining == 0:\n                result.append(path[:])\n                return\n            for i in range(start, len(candidates)):\n                if candidates[i] > remaining: continue\n                path.append(candidates[i])\n                backtrack(i, path, remaining - candidates[i])  # i not i+1, allow reuse\n                path.pop()\n        backtrack(0, [], target)\n        return result\n`,javascript:`var combinationSum=function(candidates,target){const result=[];function bt(start,path,rem){if(rem===0){result.push([...path]);return;}for(let i=start;i<candidates.length;i++){if(candidates[i]>rem)continue;path.push(candidates[i]);bt(i,path,rem-candidates[i]);path.pop();}}bt(0,[],target);return result;};`}, testCases:[{label:'[2,3,6,7] t=7',args:[[2,3,6,7],7],expected:[[2,2,3],[7]]}], runnerPy:`sol=Solution()\ng=sol.combinationSum([2,3,6,7],7)\nresults=[sorted([sorted(c) for c in g])==sorted([[2,2,3],[7]])]\nprint(results)\n`, runnerJs:`const sol=combinationSum;const g=sol([2,3,6,7],7);return[g.length===2];`, hint:'Pass start index to avoid going back to earlier candidates (prevents duplicates). Pass i (not i+1) to allow reuse of the same element.', studyGuide:{concept:'Combination Sum — Backtracking with Reuse',tldr:'Same as Subsets backtracking but you track remaining sum and allow revisiting the same index.',explanation:'Pass remaining=target-chosen. At each step add candidates[i] and recurse. Allow reuse by recursing with i (not i+1). Prune when candidates[i] > remaining.',approaches:[{name:'Backtracking with pruning',time:'O(n^(T/m))',space:'O(T/m)',description:'T=target, m=min candidate. Prune early.',works:true}],visualExample:'[2,3,6,7] t=7: try 2→rem=5, try 2→rem=3, try 2→rem=1 (prune), try 3→rem=0 → [2,2,3] found!',keyInsight:'Using i (not i+1) for recursion allows the same candidate to be used multiple times.',patternHint:'Combinations with reuse = Combination Sum. Without reuse = Subsets/Permutations.',pitfalls:['Using i+1 accidentally prevents reuse.','Not pruning when candidate > remaining makes it slower.']}});

// Arc 1 S1E4: Dijkstra
const NETWORK_DELAY = mkDSA({ id:'DSA_743_NETWORK_DELAY', leetcodeNum:743, leetcodeSlug:'network-delay-time', leetcodeUrl:'https://leetcode.com/problems/network-delay-time/', difficulty:'Medium', tags:["Graph","Shortest Path","Heap (Priority Queue)","Dijkstra"], statement:'You have a network of n nodes (labeled 1 to n). times[i]=[u,v,w] is a directed edge from u to v with travel time w. Determine how long it takes for all nodes to receive a signal sent from node k. Return -1 if not all nodes receive it.', examples:[{input:'times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2',output:'2'}], constraints:['1 <= k <= n <= 100'], starterCode:{python:`import heapq\nfrom typing import List\nclass Solution:\n    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:\n        adj = {i:[] for i in range(1,n+1)}\n        for u,v,w in times:\n            adj[u].append((v,w))\n        dist = {}\n        heap = [(0, k)]   # (distance, node)\n        while heap:\n            d, node = heapq.heappop(heap)\n            if node in dist: continue\n            dist[node] = d\n            for nxt, w in adj[node]:\n                if nxt not in dist:\n                    heapq.heappush(heap, (d+w, nxt))\n        return max(dist.values()) if len(dist)==n else -1\n`,javascript:`var networkDelayTime=function(times,n,k){const adj=new Map();for(let i=1;i<=n;i++)adj.set(i,[]);times.forEach(([u,v,w])=>adj.get(u).push([v,w]));const dist={};const heap=[[0,k]];while(heap.length){heap.sort((a,b)=>a[0]-b[0]);const[d,node]=heap.shift();if(dist[node]!==undefined)continue;dist[node]=d;for(const[nxt,w]of adj.get(node))if(dist[nxt]===undefined)heap.push([d+w,nxt]);}return Object.keys(dist).length===n?Math.max(...Object.values(dist)):-1;};`}, testCases:[{label:'[[2,1,1],[2,3,1],[3,4,1]] n=4 k=2',args:[[[2,1,1],[2,3,1],[3,4,1]],4,2],expected:2}], runnerPy:`import heapq\nsol=Solution()\nresults=[sol.networkDelayTime([[2,1,1],[2,3,1],[3,4,1]],4,2)==2]\nprint(results)\n`, runnerJs:`const sol=networkDelayTime;return[sol([[2,1,1],[2,3,1],[3,4,1]],4,2)===2];`, hint:"Dijkstra's algorithm: greedy shortest-path. Use a min-heap keyed by distance. When you pop a node for the first time, that is its shortest distance.", studyGuide:{concept:"Dijkstra's Shortest Path Algorithm",tldr:"Min-heap processes the closest unvisited node first. Greedy: once a node is popped, its distance is final.",explanation:"Build adj list. Push (0, k) to heap. Pop min-distance node. If already visited, skip. Else record dist and push all neighbors with updated distance.",approaches:[{name:"Dijkstra (min-heap)",time:"O((V+E) log V)",space:"O(V+E)",description:"Standard. Optimal for sparse graphs.",works:true}],visualExample:"Graph: 2→1 (w=1), 2→3 (w=1), 3→4 (w=1). From k=2: dist[2]=0, dist[1]=1, dist[3]=1, dist[4]=2. max=2.",keyInsight:"Dijkstra only works with non-negative weights. The greedy invariant: when a node is first popped from the heap, no shorter path exists.",patternHint:"Shortest path in weighted graph with non-negative weights → Dijkstra. With negative weights → Bellman-Ford.",pitfalls:["Using a 'visited' list incorrectly — check AFTER pop, not before push.","Forgetting -1 case when not all nodes are reachable."]},});

const MIN_EFFORT = mkDSA({ id:'DSA_1631_MIN_EFFORT', leetcodeNum:1631, leetcodeSlug:'path-with-minimum-effort', leetcodeUrl:'https://leetcode.com/problems/path-with-minimum-effort/', difficulty:'Medium', tags:["Array","Binary Search","Graph","Heap (Priority Queue)","Dijkstra"], statement:'A 2D grid of heights. The effort of a path is the maximum absolute difference between adjacent cells. Find the minimum effort path from top-left to bottom-right.', examples:[{input:'heights=[[1,2,2],[3,8,2],[5,3,5]]',output:'2'},{input:'heights=[[1,2,3],[3,8,4],[5,3,5]]',output:'1'}], constraints:['rows,cols <= 100'], starterCode:{python:`import heapq\nfrom typing import List\nclass Solution:\n    def minimumEffortPath(self, heights: List[List[int]]) -> int:\n        rows, cols = len(heights), len(heights[0])\n        dist = [[float('inf')]*cols for _ in range(rows)]\n        dist[0][0] = 0\n        heap = [(0,0,0)]  # (effort, r, c)\n        while heap:\n            eff,r,c = heapq.heappop(heap)\n            if eff > dist[r][c]: continue\n            if r==rows-1 and c==cols-1: return eff\n            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n                nr,nc=r+dr,c+dc\n                if 0<=nr<rows and 0<=nc<cols:\n                    new_eff=max(eff,abs(heights[nr][nc]-heights[r][c]))\n                    if new_eff<dist[nr][nc]:\n                        dist[nr][nc]=new_eff\n                        heapq.heappush(heap,(new_eff,nr,nc))\n        return 0\n`,javascript:`var minimumEffortPath=function(h){const R=h.length,C=h[0].length,dist=Array.from({length:R},()=>new Array(C).fill(Infinity));dist[0][0]=0;const heap=[[0,0,0]];while(heap.length){heap.sort((a,b)=>a[0]-b[0]);const[eff,r,c]=heap.shift();if(eff>dist[r][c])continue;if(r===R-1&&c===C-1)return eff;for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<R&&nc>=0&&nc<C){const ne=Math.max(eff,Math.abs(h[nr][nc]-h[r][c]));if(ne<dist[nr][nc]){dist[nr][nc]=ne;heap.push([ne,nr,nc]);}}}}return 0;};`}, testCases:[{label:'[[1,2,2],[3,8,2],[5,3,5]]',args:[[[1,2,2],[3,8,2],[5,3,5]]],expected:2},{label:'[[1,2,3],[3,8,4],[5,3,5]]',args:[[[1,2,3],[3,8,4],[5,3,5]]],expected:1}], runnerPy:`import heapq\nsol=Solution()\nresults=[sol.minimumEffortPath([[1,2,2],[3,8,2],[5,3,5]])==2,sol.minimumEffortPath([[1,2,3],[3,8,4],[5,3,5]])==1]\nprint(results)\n`, runnerJs:`const sol=minimumEffortPath;return[sol([[1,2,2],[3,8,2],[5,3,5]])===2,sol([[1,2,3],[3,8,4],[5,3,5]])===1];`, hint:'Modified Dijkstra where the "distance" is the max edge weight seen so far. Heap entry: (max_diff, row, col).', studyGuide:{concept:'Modified Dijkstra — Minimise the Maximum',tldr:"Instead of minimising the sum of edge weights, minimise the maximum. Dijkstra's greedy property still holds.",explanation:"dist[r][c] = min effort to reach (r,c). Edge weight = |h[nr][nc] - h[r][c]|. New effort = max(current_effort, edge_weight). Relax if new_eff < dist[nr][nc].",approaches:[{name:'Dijkstra (modified)',time:'O(R·C·log(R·C))',space:'O(R·C)',description:'Standard choice.',works:true},{name:'Binary search + BFS',time:'O(R·C·log(maxH))',space:'O(R·C)',description:'Binary search on answer, BFS to verify feasibility.',works:true}],visualExample:'Path going right: [1→2]: diff=1, [2→2]: diff=0, [2→2]: diff=0. Path going down: hits [3,8] which has diff 5. Right path wins with effort=1.',keyInsight:"Dijkstra's greedy approach works for ANY monotone path metric (sum, max, min) as long as adding an edge never improves already-visited nodes.",patternHint:'Path problems on grids = Dijkstra on a graph where nodes are cells and edges connect adjacent cells.',pitfalls:['Using BFS (not Dijkstra) gives wrong answer — different efforts, need priority queue.','Off-by-one in grid boundary checks.']}});

const CHEAPEST_FLIGHTS = mkDSA({ id:'DSA_787_CHEAP_FLIGHTS', leetcodeNum:787, leetcodeSlug:'cheapest-flights-within-k-stops', leetcodeUrl:'https://leetcode.com/problems/cheapest-flights-within-k-stops/', difficulty:'Medium', tags:["Dynamic Programming","Graph","Shortest Path","BFS"], statement:'There are n cities connected by some flights. flights[i]=[from,to,price]. You start at city src and want to reach dst with at most k stops. Find cheapest price. Return -1 if no such route.', examples:[{input:'n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1',output:'700'}], constraints:['1 <= n <= 100, 0 <= k < n'], starterCode:{python:`from typing import List\nclass Solution:\n    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:\n        prices = [float('inf')] * n\n        prices[src] = 0\n        for _ in range(k+1):\n            temp = prices[:]\n            for u,v,w in flights:\n                if prices[u] != float('inf') and prices[u]+w < temp[v]:\n                    temp[v] = prices[u]+w\n            prices = temp\n        return prices[dst] if prices[dst] != float('inf') else -1\n`,javascript:`var findCheapestPrice=function(n,flights,src,dst,k){let prices=new Array(n).fill(Infinity);prices[src]=0;for(let i=0;i<=k;i++){const temp=[...prices];for(const[u,v,w]of flights)if(prices[u]!==Infinity&&prices[u]+w<temp[v])temp[v]=prices[u]+w;prices=temp;}return prices[dst]===Infinity?-1:prices[dst];};`}, testCases:[{label:'n=4 k=1',args:[4,[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],0,3,1],expected:700}], runnerPy:`sol=Solution()\nresults=[sol.findCheapestPrice(4,[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],0,3,1)==700]\nprint(results)\n`, runnerJs:`const sol=findCheapestPrice;return[sol(4,[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],0,3,1)===700];`, hint:'Bellman-Ford limited to k+1 edge relaxations. Use a copy of prices each round to prevent chaining updates within one round.', studyGuide:{concept:'Bellman-Ford with Limited Relaxations',tldr:'Bellman-Ford relaxes all edges iteratively. Doing it k+1 times finds the shortest path using at most k+1 edges (k stops).',explanation:'prices[v] = min cost to reach v. Each round: for every edge (u,v,w), if prices[u]+w < prices[v], update. Key: use PREVIOUS round prices to avoid chaining. k stops = k+1 edges.',approaches:[{name:'Bellman-Ford (k rounds)',time:'O(k·E)',space:'O(n)',description:'Standard approach.',works:true}],visualExample:'Round 1 (1 edge): src→0=0, 0→1=100, 0→3=600 (via 0→1→3 needs 2). Round 2 (2 edges): 0→1→2→3=400 valid with k=1.',keyInsight:'Copying prices before each round prevents cascade: relaxing u→v then v→w in the same round would use 2 edges but look like 1.',patternHint:'Shortest path with edge count constraint → Bellman-Ford with limited iterations.',pitfalls:['Not copying prices each round → chaining → incorrect edge count.','k stops = k+1 edges: run k+1 rounds.']}});

// Arc 1 S1E5: BFS/DFS
const NUM_ISLANDS = mkDSA({ id:'DSA_200_NUM_ISLANDS', leetcodeNum:200, leetcodeSlug:'number-of-islands', leetcodeUrl:'https://leetcode.com/problems/number-of-islands/', difficulty:'Medium', tags:['Array','DFS','BFS','Union-Find'], statement:"Given an m×n 2D binary grid of '1' (land) and '0' (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent (horizontal/vertical) land cells.", examples:[{input:"grid=[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]",output:'1'},{input:"grid=[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]",output:'3'}], constraints:['m,n between 1 and 300'], starterCode:{python:`from typing import List\nclass Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        def dfs(r, c):\n            if r<0 or r>=rows or c<0 or c>=cols or grid[r][c]!='1': return\n            grid[r][c] = '0'   # mark visited\n            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n                dfs(r+dr, c+dc)\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n        return count\n`,javascript:`var numIslands=function(grid){const R=grid.length,C=grid[0].length;let count=0;function dfs(r,c){if(r<0||r>=R||c<0||c>=C||grid[r][c]!=='1')return;grid[r][c]='0';[[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr,dc])=>dfs(r+dr,c+dc));}for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(grid[r][c]==='1'){count++;dfs(r,c);}return count;};`}, testCases:[{label:'4x5 one island',args:[[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]],expected:1},{label:'4x5 three islands',args:[[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]],expected:3}], runnerPy:`sol=Solution()\ng1=[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]\ng2=[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]\nresults=[sol.numIslands([r[:] for r in g1])==1, sol.numIslands([r[:] for r in g2])==3]\nprint(results)\n`, runnerJs:`const sol=numIslands;const g1=[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']];const g2=[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];return[sol(g1.map(r=>[...r]))===1,sol(g2.map(r=>[...r]))===3];`, hint:"DFS from each '1' cell. Mark every connected '1' as visited ('0') so you don't count it twice.", studyGuide:{concept:'Flood Fill — DFS/BFS on a Grid',tldr:"Visit every '1' cell reachable from a starting cell and mark them all visited. Each 'flood fill' = one island.",explanation:"Scan grid left-to-right, top-to-bottom. When you find an unvisited '1', increment count and flood-fill all its connected '1' cells (mark as '0' = visited). Four-directional adjacency.",approaches:[{name:'DFS (recursive)',time:'O(m·n)',space:'O(m·n)',description:'Clean recursion. Each cell visited at most once.',works:true},{name:'BFS (queue)',time:'O(m·n)',space:'O(min(m,n))',description:'Queue-based. Avoids recursion stack overflow for huge grids.',works:true}],visualExample:"Grid has '1' at (0,0). DFS visits (0,0)→(0,1)→(0,2)→(1,0)→(1,2)→(2,0) etc., marking all as '0'. count=1.",keyInsight:'Flood fill is DFS/BFS restricted to a 2D grid. Marking visited cells prevents counting the same island twice.',patternHint:'Connected components in a grid → flood fill. Count flood fills = count islands/regions.',pitfalls:['Not marking cells as visited → infinite recursion.','Using visited array separately vs marking grid in-place (both work, in-place saves space).']}});

const ROTTING_ORANGES = mkDSA({ id:'DSA_994_ROTTING_ORANGES', leetcodeNum:994, leetcodeSlug:'rotting-oranges', leetcodeUrl:'https://leetcode.com/problems/rotting-oranges/', difficulty:'Medium', tags:['Array','BFS','Matrix'], statement:'0=empty, 1=fresh, 2=rotten. Every minute, any fresh orange adjacent (4-dirs) to a rotten one becomes rotten. Return minimum minutes for all fresh oranges to rot. Return -1 if impossible.', examples:[{input:'grid=[[2,1,1],[1,1,0],[0,1,1]]',output:'4'},{input:'grid=[[2,1,1],[0,1,1],[1,0,1]]',output:'-1'},{input:'grid=[[0,2]]',output:'0'}], constraints:['1 <= m,n <= 10'], starterCode:{python:`from typing import List\nfrom collections import deque\nclass Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        rows,cols=len(grid),len(grid[0])\n        fresh=0; queue=deque()\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c]==2: queue.append((r,c,0))\n                elif grid[r][c]==1: fresh+=1\n        if fresh==0: return 0\n        minutes=0\n        while queue:\n            r,c,t=queue.popleft()\n            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n                nr,nc=r+dr,c+dc\n                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:\n                    grid[nr][nc]=2; fresh-=1; minutes=t+1\n                    queue.append((nr,nc,t+1))\n        return minutes if fresh==0 else -1\n`,javascript:`var orangesRotting=function(grid){const R=grid.length,C=grid[0].length;let fresh=0;const queue=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++){if(grid[r][c]===2)queue.push([r,c,0]);else if(grid[r][c]===1)fresh++;}if(!fresh)return 0;let minutes=0;while(queue.length){const[r,c,t]=queue.shift();for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1){grid[nr][nc]=2;fresh--;minutes=t+1;queue.push([nr,nc,t+1]);}}}return fresh===0?minutes:-1;};`}, testCases:[{label:'[[2,1,1],[1,1,0],[0,1,1]]',args:[[[2,1,1],[1,1,0],[0,1,1]]],expected:4},{label:'[[2,1,1],[0,1,1],[1,0,1]]',args:[[[2,1,1],[0,1,1],[1,0,1]]],expected:-1},{label:'[[0,2]]',args:[[[0,2]]],expected:0}], runnerPy:`from collections import deque\nsol=Solution()\ng1=[[2,1,1],[1,1,0],[0,1,1]]\ng2=[[2,1,1],[0,1,1],[1,0,1]]\ng3=[[0,2]]\nresults=[sol.orangesRotting([r[:] for r in g1])==4,sol.orangesRotting([r[:] for r in g2])==-1,sol.orangesRotting([r[:] for r in g3])==0]\nprint(results)\n`, runnerJs:`const sol=orangesRotting;return[sol([[2,1,1],[1,1,0],[0,1,1]])===4,sol([[2,1,1],[0,1,1],[1,0,1]])===-1,sol([[0,2]])===0];`, hint:'Multi-source BFS: enqueue ALL initially rotten oranges at time 0. BFS spreads rot level-by-level. Track fresh count.', studyGuide:{concept:'Multi-Source BFS — Spreading From Multiple Origins',tldr:'Start BFS from all sources simultaneously. Each BFS level = 1 unit of time. All sources spread in parallel.',explanation:'Enqueue all rotten oranges (row, col, time=0). BFS spreads to adjacent fresh oranges (mark rotten, decrement fresh count). Answer = max time reached. If fresh > 0 at end → -1.',approaches:[{name:'Multi-source BFS',time:'O(m·n)',space:'O(m·n)',description:'Classic approach for simultaneous spread problems.',works:true}],visualExample:'Start: queue=[(0,0,t=0)]. Spread to (0,1,1),(1,0,1). From those spread further. After 4 BFS levels all fresh oranges rot.',keyInsight:'When multiple sources spread simultaneously, put ALL of them in the queue at t=0. BFS guarantees minimum time.',patternHint:'Spreading / contagion problems from multiple sources → multi-source BFS.',pitfalls:['Starting BFS from only ONE rotten orange → gives wrong time if multiple sources exist.','Not checking if fresh==0 at the end for the -1 case.']}});

const LEVEL_ORDER = mkDSA({ id:'DSA_102_LEVEL_ORDER', leetcodeNum:102, leetcodeSlug:'binary-tree-level-order-traversal', leetcodeUrl:'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty:'Medium', tags:['Tree','BFS','Binary Tree'], statement:'Given the root of a binary tree, return the level order traversal of its node values (left to right, level by level).', examples:[{input:'root=[3,9,20,null,null,15,7]',output:'[[3],[9,20],[15,7]]'},{input:'root=[1]',output:'[[1]]'}], constraints:['0 <= nodes <= 2000'], starterCode:{python:`from typing import List, Optional\nfrom collections import deque\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val=val; self.left=left; self.right=right\nclass Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        if not root: return []\n        result=[]; queue=deque([root])\n        while queue:\n            level_size=len(queue)\n            level=[]\n            for _ in range(level_size):\n                node=queue.popleft()\n                level.append(node.val)\n                if node.left: queue.append(node.left)\n                if node.right: queue.append(node.right)\n            result.append(level)\n        return result\n`,javascript:`var levelOrder=function(root){if(!root)return[];const result=[],queue=[root];while(queue.length){const size=queue.length,level=[];for(let i=0;i<size;i++){const node=queue.shift();level.push(node.val);if(node.left)queue.push(node.left);if(node.right)queue.push(node.right);}result.push(level);}return result;};`}, testCases:[{label:'[3,9,20,null,null,15,7]',args:[[3,9,20,null,null,15,7]],expected:[[3],[9,20],[15,7]]}], runnerPy:`from collections import deque\nsol=Solution()\ndef build(vals):\n    if not vals: return None\n    nodes=[TreeNode(v) if v is not None else None for v in vals]\n    for i in range(len(nodes)):\n        if nodes[i]:\n            li,ri=2*i+1,2*i+2\n            if li<len(nodes): nodes[i].left=nodes[li]\n            if ri<len(nodes): nodes[i].right=nodes[ri]\n    return nodes[0]\nroot=build([3,9,20,None,None,15,7])\nresults=[sol.levelOrder(root)==[[3],[9,20],[15,7]]]\nprint(results)\n`, runnerJs:`function buildTree(a){if(!a||!a.length)return null;const n=a.map(v=>v!==null&&v!==undefined?{val:v,left:null,right:null}:null);for(let i=0;i<n.length;i++)if(n[i]){if(2*i+1<n.length)n[i].left=n[2*i+1];if(2*i+2<n.length)n[i].right=n[2*i+2];}return n[0];}const sol=levelOrder;return[JSON.stringify(sol(buildTree([3,9,20,null,null,15,7])))==='[[3],[9,20],[15,7]]'];`, hint:'BFS with level tracking: before processing a level, record queue.length. Process exactly that many nodes for the current level.', studyGuide:{concept:'BFS Level-by-Level — Snapshotting Queue Size',tldr:'BFS naturally visits nodes level by level. Snapshot queue.length before each level to process exactly that many nodes.',explanation:'Queue starts with root. Each iteration: n = current queue size. Process n nodes (add their values to level list, enqueue their children). After n nodes, the current level is done. Append level to result.',approaches:[{name:'BFS with level size snapshot',time:'O(n)',space:'O(n)',description:'Classic BFS with level grouping.',works:true}],visualExample:'Queue=[3]. Level 1: size=1, process 3, enqueue 9,20. Result=[[3]]. Queue=[9,20]. Level 2: size=2, process 9,20, enqueue 15,7. Result=[[3],[9,20]].',keyInsight:"At the start of each BFS iteration, all nodes in the queue are exactly the current level. 'Snapshotting' the queue size tells you where this level ends.",patternHint:'Any time you need BFS organized by depth/level, snapshot the queue size before each level.',pitfalls:['Processing one-by-one without snapshoting mixes levels together.','Checking queue.length during the loop (it changes as you add children).']}});

// Arc 1 S2E1: Divide & Conquer
const MAJORITY = mkDSA({ id:'DSA_169_MAJORITY', leetcodeNum:169, leetcodeSlug:'majority-element', leetcodeUrl:'https://leetcode.com/problems/majority-element/', difficulty:'Easy', tags:['Array','Hash Table','Divide and Conquer','Sorting','Counting'], statement:'Given an array nums of size n, return the majority element. The majority element appears more than ⌊n/2⌋ times. You may assume the majority element always exists.', examples:[{input:'nums=[3,2,3]',output:'3'},{input:'nums=[2,2,1,1,1,2,2]',output:'2'}], constraints:['n >= 1'], starterCode:{python:`from typing import List\nclass Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        candidate, count = nums[0], 1\n        for num in nums[1:]:\n            if count == 0:\n                candidate = num\n                count = 1\n            elif num == candidate:\n                count += 1\n            else:\n                count -= 1\n        return candidate\n`,javascript:`var majorityElement=function(nums){let c=nums[0],cnt=1;for(let i=1;i<nums.length;i++){if(cnt===0){c=nums[i];cnt=1;}else if(nums[i]===c)cnt++;else cnt--;}return c;};`}, testCases:[{label:'[3,2,3]',args:[[3,2,3]],expected:3},{label:'[2,2,1,1,1,2,2]',args:[[2,2,1,1,1,2,2]],expected:2}], runnerPy:`sol=Solution()\nresults=[sol.majorityElement([3,2,3])==3,sol.majorityElement([2,2,1,1,1,2,2])==2]\nprint(results)\n`, runnerJs:`const sol=majorityElement;return[sol([3,2,3])===3,sol([2,2,1,1,1,2,2])===2];`, hint:"Boyer-Moore Voting: maintain a candidate and count. When count hits 0, switch candidate. The majority element always survives.", studyGuide:{concept:"Boyer-Moore Voting — O(1) Space Majority",tldr:"Pair up different elements and cancel them. The majority element (appearing >n/2 times) always has survivors after all cancellations.",explanation:"count tracks 'net advantage' of candidate. A different element decrements it. When count=0 the old candidate lost its advantage — pick new candidate. The true majority always survives.",approaches:[{name:'Boyer-Moore Voting',time:'O(n)',space:'O(1)',description:'Optimal.',works:true},{name:'Hash map count',time:'O(n)',space:'O(n)',description:'Count frequencies, return the element with count > n/2.',works:true}],visualExample:'[2,2,1,1,1,2,2]: c=2,cnt=1 → 2,2 → 1,1 → 0 switch c=1,1 → 1,2 → 2 switch c=2,2 → 3. Return 2.',keyInsight:'Non-majority elements cannot "outvote" the majority element because the majority has more than half the votes.',patternHint:'Majority vote = Boyer-Moore for O(1) space.',pitfalls:['Boyer-Moore only works when majority is GUARANTEED to exist.','When count=0, the candidate must be updated BEFORE processing the next element.']}});

const MAX_SUBARRAY = mkDSA({ id:'DSA_53_MAX_SUBARRAY', leetcodeNum:53, leetcodeSlug:'maximum-subarray', leetcodeUrl:'https://leetcode.com/problems/maximum-subarray/', difficulty:'Medium', tags:['Array','Divide and Conquer','Dynamic Programming'], statement:"Given an integer array nums, find the subarray with the largest sum and return its sum.", examples:[{input:'nums=[-2,1,-3,4,-1,2,1,-5,4]',output:'6',explanation:'[4,-1,2,1] has the largest sum = 6.'},{input:'nums=[1]',output:'1'},{input:'nums=[5,4,-1,7,8]',output:'23'}], constraints:['1 <= nums.length <= 10⁵'], starterCode:{python:`from typing import List\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        curr = nums[0]   # current subarray sum\n        best = nums[0]   # best sum seen so far\n        for x in nums[1:]:\n            curr = max(x, curr + x)   # extend or restart\n            best = max(best, curr)\n        return best\n`,javascript:`var maxSubArray=function(nums){let curr=nums[0],best=nums[0];for(let i=1;i<nums.length;i++){curr=Math.max(nums[i],curr+nums[i]);best=Math.max(best,curr);}return best;};`}, testCases:[{label:'[-2,1,-3,4,-1,2,1,-5,4]',args:[[-2,1,-3,4,-1,2,1,-5,4]],expected:6},{label:'[1]',args:[[1]],expected:1},{label:'[5,4,-1,7,8]',args:[[5,4,-1,7,8]],expected:23}], runnerPy:`sol=Solution()\nresults=[sol.maxSubArray([-2,1,-3,4,-1,2,1,-5,4])==6,sol.maxSubArray([1])==1,sol.maxSubArray([5,4,-1,7,8])==23]\nprint(results)\n`, runnerJs:`const sol=maxSubArray;return[sol([-2,1,-3,4,-1,2,1,-5,4])===6,sol([1])===1,sol([5,4,-1,7,8])===23];`, hint:"Kadane's: at each position decide whether to extend the current subarray or start a new one from here.", studyGuide:{concept:"Kadane's Algorithm — Local vs Global Maximum",tldr:"At each position: is it better to extend the running subarray or start fresh? Track both the current sum and the best seen.",explanation:"curr = max(x, curr+x). If curr+x < x, the previous subarray is dragging down — discard it and start fresh at x. best tracks the overall maximum.",approaches:[{name:"Kadane's (DP)",time:'O(n)',space:'O(1)',description:'Optimal.',works:true},{name:'Divide and Conquer',time:'O(n log n)',space:'O(log n)',description:'Recursively split, combine. Classic D&C approach.',works:true}],visualExample:'[-2,1,-3,4,-1,2,1,-5,4]: curr=-2,best=-2 → max(1,-1)=1,best=1 → max(-3,-2)=-2,best=1 → max(4,2)=4,best=4 → max(-1,3)=3,best=4 → max(2,5)=5,best=5 → max(1,6)=6,best=6.',keyInsight:"max(x, curr+x) — if curr is negative, it HURTS the sum. Start over. This is Kadane's key insight.",patternHint:'Maximum contiguous subarray = Kadane\'s. Many DP problems reduce to "keep extending or restart".',pitfalls:['Initialising curr and best to 0 instead of nums[0] — fails with all-negative arrays.','Using curr=0 restart instead of curr=x — misses the case where the optimal subarray starts here.']}});

const SORT_ARRAY = mkDSA({ id:'DSA_912_SORT_ARRAY', leetcodeNum:912, leetcodeSlug:'sort-an-array', leetcodeUrl:'https://leetcode.com/problems/sort-an-array/', difficulty:'Medium', tags:['Array','Divide and Conquer','Sorting','Merge Sort','Heap Sort','Quicksort'], statement:'Given an array of integers nums, sort the array in ascending order and return it. You must solve the problem without using any built-in functions in O(n log n) time complexity and with the smallest space complexity possible.', examples:[{input:'nums=[5,2,3,1]',output:'[1,2,3,5]'},{input:'nums=[5,1,1,2,0,0]',output:'[0,0,1,1,2,5]'}], constraints:['1 <= nums.length <= 5×10⁴'], starterCode:{python:`from typing import List\nclass Solution:\n    def sortArray(self, nums: List[int]) -> List[int]:\n        if len(nums) <= 1: return nums\n        mid = len(nums) // 2\n        left = self.sortArray(nums[:mid])\n        right = self.sortArray(nums[mid:])\n        # Merge two sorted halves\n        result = []\n        i = j = 0\n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]: result.append(left[i]); i+=1\n            else: result.append(right[j]); j+=1\n        return result + left[i:] + right[j:]\n`,javascript:`var sortArray=function(nums){if(nums.length<=1)return nums;const mid=nums.length>>1,l=sortArray(nums.slice(0,mid)),r=sortArray(nums.slice(mid));const res=[];let i=0,j=0;while(i<l.length&&j<r.length)l[i]<=r[j]?res.push(l[i++]):res.push(r[j++]);return res.concat(l.slice(i)).concat(r.slice(j));};`}, testCases:[{label:'[5,2,3,1]',args:[[5,2,3,1]],expected:[1,2,3,5]},{label:'[5,1,1,2,0,0]',args:[[5,1,1,2,0,0]],expected:[0,0,1,1,2,5]}], runnerPy:`sol=Solution()\nresults=[sol.sortArray([5,2,3,1])==[1,2,3,5],sol.sortArray([5,1,1,2,0,0])==[0,0,1,1,2,5]]\nprint(results)\n`, runnerJs:`const sol=sortArray;return[JSON.stringify(sol([5,2,3,1]))==='[1,2,3,5]',JSON.stringify(sol([5,1,1,2,0,0]))==='[0,0,1,1,2,5]'];`, hint:'Merge sort: split in half, sort each half recursively, then merge the two sorted halves into one sorted array.', studyGuide:{concept:'Merge Sort — Classic Divide and Conquer',tldr:'Split array in half, sort each half (recursively), then merge the two sorted halves. O(n log n) guaranteed.',explanation:'Base case: length ≤ 1, already sorted. Divide: split at mid. Conquer: sort each half. Combine: merge two sorted arrays by comparing front elements.',approaches:[{name:'Merge sort',time:'O(n log n)',space:'O(n)',description:'Stable, guaranteed O(n log n).',works:true},{name:'Quicksort',time:'O(n log n) avg',space:'O(log n)',description:'Faster in practice but O(n²) worst case.',works:true},{name:'Heap sort',time:'O(n log n)',space:'O(1)',description:'In-place, not stable.',works:true}],visualExample:'[5,2,3,1] → split [5,2],[3,1] → sort each [2,5],[1,3] → merge: compare 2vs1: 1, then 2vs3: 2, then 5vs3: 3, then 5. → [1,2,3,5].',keyInsight:'Merging two sorted arrays is O(n). Sorting halves takes T(n/2) each. Recurrence T(n)=2T(n/2)+O(n) solves to O(n log n).',patternHint:'When a problem says "implement sorting" without built-ins, use merge sort (guaranteed complexity) or quicksort (faster average).',pitfalls:['Forgetting base case → infinite recursion.','Merging with wrong indices → off-by-one errors.']}});

// ─────────────────────────────────────────────────────────────────────────────
//  ARC 5 — DATA STRUCTURES  (brief study guides)
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_ANAGRAMS = mkDSA({ id:'DSA_49_GROUP_ANAGRAMS', leetcodeNum:49, leetcodeSlug:'group-anagrams', leetcodeUrl:'https://leetcode.com/problems/group-anagrams/', difficulty:'Medium', tags:['Hash Table','String','Sorting'], statement:'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An anagram contains the same letters with the same frequencies.', examples:[{input:'strs=["eat","tea","tan","ate","nat","bat"]',output:'[["bat"],["nat","tan"],["ate","eat","tea"]]'}], constraints:['1 <= strs.length <= 10⁴'], starterCode:{python:`from typing import List\nfrom collections import defaultdict\nclass Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        groups = defaultdict(list)\n        for s in strs:\n            key = tuple(sorted(s))\n            groups[key].append(s)\n        return list(groups.values())\n`,javascript:`var groupAnagrams=function(strs){const g={};for(const s of strs){const k=s.split('').sort().join('');(g[k]=g[k]||[]).push(s);}return Object.values(g);};`}, testCases:[{label:'["eat","tea","tan","ate","nat","bat"]',args:[['eat','tea','tan','ate','nat','bat']],expected:[['bat'],['nat','tan'],['ate','eat','tea']]}], runnerPy:`from collections import defaultdict\nsol=Solution()\ng=sol.groupAnagrams(['eat','tea','tan','ate','nat','bat'])\nresults=[sorted([sorted(x) for x in g])==sorted([sorted(x) for x in [['bat'],['nat','tan'],['ate','eat','tea']]])]\nprint(results)\n`, runnerJs:`const sol=groupAnagrams;const g=sol(['eat','tea','tan','ate','nat','bat']);return[g.length===3];`, hint:'Sort each string alphabetically — all anagrams produce the same sorted key. Use that as the dictionary key.', studyGuide:{concept:'Hash Map Grouping — Same-Key → Same-Group',tldr:"Anagrams have identical sorted forms. Use sorted(s) as a dictionary key; all anagrams hash to the same bucket.",explanation:'defaultdict(list): for each word, compute key = tuple(sorted(word)). Append word to groups[key]. Return groups.values().',approaches:[{name:'Sort + hash map',time:'O(n·k log k)',space:'O(n·k)',description:'k = max string length. Standard approach.',works:true},{name:'Frequency tuple key',time:'O(n·k)',space:'O(n·k)',description:'26-element frequency tuple as key. No sorting.',works:true}],visualExample:'"eat"→"aet", "tea"→"aet", "tan"→"ant", "ate"→"aet", "nat"→"ant", "bat"→"abt". Groups: aet→[eat,tea,ate], ant→[tan,nat], abt→[bat].',keyInsight:'Two strings are anagrams if and only if their sorted character sequences are identical.',patternHint:'Group elements with the same "signature" → compute canonical form as dictionary key.',pitfalls:['Using list as key (unhashable) — use tuple(sorted(s)) instead.','Not using defaultdict → KeyError on first access.']}});

const RANSOM_NOTE = mkDSA({ id:'DSA_383_RANSOM_NOTE', leetcodeNum:383, leetcodeSlug:'ransom-note', leetcodeUrl:'https://leetcode.com/problems/ransom-note/', difficulty:'Easy', tags:['Hash Table','String','Counting'], statement:'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine. Each letter in magazine may only be used once.', examples:[{input:'ransomNote="a", magazine="b"',output:'false'},{input:'ransomNote="aa", magazine="ab"',output:'false'},{input:'ransomNote="aa", magazine="aab"',output:'true'}], constraints:['1 <= lengths <= 10⁵'], starterCode:{python:`from collections import Counter\nclass Solution:\n    def canConstruct(self, ransomNote: str, magazine: str) -> bool:\n        mag = Counter(magazine)\n        for c in ransomNote:\n            mag[c] -= 1\n            if mag[c] < 0: return False\n        return True\n`,javascript:`var canConstruct=function(r,m){const cnt={};for(const c of m)cnt[c]=(cnt[c]||0)+1;for(const c of r){if(!cnt[c])return false;cnt[c]--;}return true;};`}, testCases:[{label:'"a","b"',args:['a','b'],expected:false},{label:'"aa","ab"',args:['aa','ab'],expected:false},{label:'"aa","aab"',args:['aa','aab'],expected:true}], runnerPy:`from collections import Counter\nsol=Solution()\nresults=[sol.canConstruct('a','b')==False,sol.canConstruct('aa','ab')==False,sol.canConstruct('aa','aab')==True]\nprint(results)\n`, runnerJs:`const sol=canConstruct;return[sol('a','b')===false,sol('aa','ab')===false,sol('aa','aab')===true];`, hint:'Count letters in magazine. Then for each letter in ransomNote, decrement its count. If any count goes below 0, return False.', studyGuide:{concept:'Character Frequency Counting',tldr:'Count how many of each letter magazine provides. Then check if ransomNote consumes within budget.',explanation:'Counter(magazine) builds a frequency map. For each char in ransomNote: mag[c] -= 1; if < 0 then magazine ran out of that letter.',approaches:[{name:'Counter subtraction',time:'O(n)',space:'O(1)',description:'O(26) = O(1) for lowercase letters.',works:true}],visualExample:'"aa","aab": mag={a:2,b:1}. ransomNote r=a: a→1. r=a: a→0. All ok → True.',keyInsight:'The magazine is a "budget" of each letter. Ransoming means spending from that budget.',patternHint:'Can A be constructed from B? → Count B, subtract A, check no negatives.',pitfalls:['Checking magazine length < ransomNote length as an early return is a valid optimisation.','Using Counter directly: Counter(ransomNote) <= Counter(magazine) works in one line.']}});

const ISOMORPHIC = mkDSA({ id:'DSA_205_ISOMORPHIC', leetcodeNum:205, leetcodeSlug:'isomorphic-strings', leetcodeUrl:'https://leetcode.com/problems/isomorphic-strings/', difficulty:'Easy', tags:['Hash Table','String'], statement:'Two strings s and t are isomorphic if characters in s can be replaced to get t while preserving order. No two characters may map to the same character, but a character may map to itself.', examples:[{input:'s="egg", t="add"',output:'true'},{input:'s="foo", t="bar"',output:'false'},{input:'s="paper", t="title"',output:'true'}], constraints:['1 <= s.length <= 5×10⁴'], starterCode:{python:`class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        s_to_t, t_to_s = {}, {}\n        for a, b in zip(s, t):\n            if (a in s_to_t and s_to_t[a] != b) or \\\n               (b in t_to_s and t_to_s[b] != a):\n                return False\n            s_to_t[a] = b\n            t_to_s[b] = a\n        return True\n`,javascript:`var isIsomorphic=function(s,t){const st={},ts={};for(let i=0;i<s.length;i++){const a=s[i],b=t[i];if((a in st&&st[a]!==b)||(b in ts&&ts[b]!==a))return false;st[a]=b;ts[b]=a;}return true;};`}, testCases:[{label:'"egg","add"',args:['egg','add'],expected:true},{label:'"foo","bar"',args:['foo','bar'],expected:false},{label:'"paper","title"',args:['paper','title'],expected:true}], runnerPy:`sol=Solution()\nresults=[sol.isIsomorphic('egg','add')==True,sol.isIsomorphic('foo','bar')==False,sol.isIsomorphic('paper','title')==True]\nprint(results)\n`, runnerJs:`const sol=isIsomorphic;return[sol('egg','add')===true,sol('foo','bar')===false,sol('paper','title')===true];`, hint:'Maintain TWO maps: s→t and t→s. If either mapping conflicts with what we have, return False.', studyGuide:{concept:'Bijective Mapping — Two Dictionaries for Consistency',tldr:'A valid character substitution is a one-to-one mapping. Use two dictionaries to enforce both directions.',explanation:"s_to_t maps s's chars to t's chars. t_to_s does the reverse. For each (a,b) pair: if s_to_t[a] exists and ≠ b, conflict. If t_to_s[b] exists and ≠ a, conflict.",approaches:[{name:'Two dictionaries',time:'O(n)',space:'O(1)',description:'O(26²) = O(1) for lowercase letters.',works:true}],visualExample:'"egg","add": e→a,a←e; g→d,d←g; g→d (consistent),d←g (consistent) → True. "foo","bar": f→b; o→a; o→r CONFLICT (o already mapped to a) → False.',keyInsight:'One map alone is not enough — "foo","bar" would seem ok with just s→t but "o" maps to two different targets.',patternHint:'Any bijective/one-to-one mapping verification needs two maps: forward and backward.',pitfalls:["Using only one direction → misses 'foo'→'bar' type failures.","zip(s,t) only works when len(s)==len(t) — guaranteed by constraints here."]}});

// Arc 5: Heaps
const KTH_LARGEST_STREAM = mkDSA({ id:'DSA_703_KTH_LARGEST_STREAM', leetcodeNum:703, leetcodeSlug:'kth-largest-element-in-a-stream', leetcodeUrl:'https://leetcode.com/problems/kth-largest-element-in-a-stream/', difficulty:'Easy', tags:['Tree','Design','Binary Search Tree','Heap (Priority Queue)','Data Stream'], statement:'Design a class KthLargest. The constructor takes an integer k and an initial array of numbers. It has a method add(val) which inserts val and returns the kth largest element in the current collection.', examples:[{input:'KthLargest(3,[4,5,8,2]), add(3)→4, add(5)→5, add(10)→8, add(9)→8, add(4)→8',output:'[4,5,8,8,8]'}], constraints:['1 <= k <= 10⁴'], starterCode:{python:`import heapq\nfrom typing import List\nclass KthLargest:\n    def __init__(self, k: int, nums: List[int]):\n        self.k = k\n        self.heap = []\n        for n in nums:\n            self.add(n)\n    def add(self, val: int) -> int:\n        heapq.heappush(self.heap, val)\n        if len(self.heap) > self.k:\n            heapq.heappop(self.heap)  # remove smallest if over k\n        return self.heap[0]            # kth largest = min of top-k heap\n`,javascript:`var KthLargest=function(k,nums){this.k=k;this.heap=[];for(const n of nums)this.add(n);};KthLargest.prototype.add=function(val){this.heap.push(val);this.heap.sort((a,b)=>a-b);if(this.heap.length>this.k)this.heap.shift();return this.heap[0];};`}, testCases:[{label:'k=3 init=[4,5,8,2] add=3',args:[3,[4,5,8,2],3],expected:4}], runnerPy:`import heapq\nkl=KthLargest(3,[4,5,8,2])\nresults=[kl.add(3)==4,kl.add(5)==5,kl.add(10)==8,kl.add(9)==8,kl.add(4)==8]\nprint(results)\n`, runnerJs:`const kl=new KthLargest(3,[4,5,8,2]);return[kl.add(3)===4,kl.add(5)===5,kl.add(10)===8];`, hint:'Maintain a min-heap of size exactly k. The root (smallest element) of this heap is the kth largest overall.', studyGuide:{concept:'Min-Heap of Fixed Size — The kth Largest Window',tldr:'Keep only the k largest elements in a min-heap. The heap root is the kth largest.',explanation:'A min-heap of size k: heap[0] is the smallest of the top-k = the kth largest. Push every new element. If heap > k, pop (discard the smallest, which is now rank k+1).',approaches:[{name:'Min-heap size k',time:'O(log k) per add',space:'O(k)',description:'Optimal for streaming data.',works:true}],visualExample:'k=3, init=[4,5,8,2]: heap=[2,4,5] after adding 8 size=4 → pop min(2) → heap=[4,5,8]. add(3): push 3 → [3,4,5,8] → pop 3 → [4,5,8]. heap[0]=4.',keyInsight:'A min-heap of size k holds the k largest elements. Its minimum (root) is the kth largest.',patternHint:'"kth largest in a stream" or "top k elements" → fixed-size min-heap.',pitfalls:['Max-heap would give kth smallest. Need MIN-heap for kth largest.','Checking heap size strictly after every push.']}});

const TOP_K_FREQUENT = mkDSA({ id:'DSA_347_TOP_K_FREQUENT', leetcodeNum:347, leetcodeSlug:'top-k-frequent-elements', leetcodeUrl:'https://leetcode.com/problems/top-k-frequent-elements/', difficulty:'Medium', tags:['Array','Hash Table','Divide and Conquer','Sorting','Heap'], statement:'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.', examples:[{input:'nums=[1,1,1,2,2,3], k=2',output:'[1,2]'},{input:'nums=[1], k=1',output:'[1]'}], constraints:['1 <= nums.length <= 10⁵, 1 <= k <= unique elements'], starterCode:{python:`from typing import List\nfrom collections import Counter\nclass Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        count = Counter(nums)\n        # Bucket sort: bucket[freq] = [numbers with that freq]\n        bucket = [[] for _ in range(len(nums)+1)]\n        for num, freq in count.items():\n            bucket[freq].append(num)\n        result = []\n        for freq in range(len(bucket)-1, 0, -1):  # high freq first\n            for num in bucket[freq]:\n                result.append(num)\n                if len(result) == k: return result\n        return result\n`,javascript:`var topKFrequent=function(nums,k){const cnt={};for(const n of nums)cnt[n]=(cnt[n]||0)+1;const buck=Array.from({length:nums.length+1},()=>[]);for(const[n,f]of Object.entries(cnt))buck[f].push(+n);const res=[];for(let f=buck.length-1;f>=1;f--){for(const n of buck[f]){res.push(n);if(res.length===k)return res;}}return res;};`}, testCases:[{label:'[1,1,1,2,2,3] k=2',args:[[1,1,1,2,2,3],2],expected:[1,2]}], runnerPy:`from collections import Counter\nsol=Solution()\ng=sol.topKFrequent([1,1,1,2,2,3],2)\nresults=[set(g)=={1,2}]\nprint(results)\n`, runnerJs:`const sol=topKFrequent;const g=sol([1,1,1,2,2,3],2);return[new Set(g).has(1)&&new Set(g).has(2)&&g.length===2];`, hint:'Count frequencies with Counter. Bucket sort by frequency. Scan from highest frequency to lowest, picking k elements.', studyGuide:{concept:'Bucket Sort by Frequency — O(n) Counting Sort',tldr:'Instead of sorting elements, sort frequencies. Bucket[f] holds all numbers that appear exactly f times.',explanation:'Counter gives frequency of each number. Bucket[freq] = list of numbers with that frequency. Scan bucket from high to low, collect k numbers.',approaches:[{name:'Bucket sort (O(n))',time:'O(n)',space:'O(n)',description:'Optimal. Frequency can be at most n.',works:true},{name:'Heap (O(n log k))',time:'O(n log k)',space:'O(n)',description:'Use heapq.nlargest(k, count.keys(), key=count.get).',works:true}],visualExample:'[1,1,1,2,2,3] k=2: count={1:3,2:2,3:1}. bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]. Scan: freq=3→take 1(result=[1]); freq=2→take 2(result=[1,2]); len=k=2 return.',keyInsight:'Bucket sort replaces comparison sorting (O(n log n)) with counting (O(n)) by exploiting bounded frequency range.',patternHint:'"Top k by frequency" → Counter + nlargest, or Counter + bucket sort for O(n).',pitfalls:['Bucket size must be n+1 (frequency ranges from 1 to n).','Scanning from high frequency to low, not low to high.']}});

const KTH_LARGEST = mkDSA({ id:'DSA_215_KTH_LARGEST', leetcodeNum:215, leetcodeSlug:'kth-largest-element-in-an-array', leetcodeUrl:'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty:'Medium', tags:['Array','Divide and Conquer','Sorting','Heap (Priority Queue)','Quickselect'], statement:'Given an integer array nums and integer k, return the kth largest element in the array. Note that it is the kth largest in sorted order, not the kth distinct element.', examples:[{input:'nums=[3,2,1,5,6,4], k=2',output:'5'},{input:'nums=[3,2,3,1,2,4,5,5,6], k=4',output:'4'}], constraints:['1 <= k <= nums.length <= 10⁵'], starterCode:{python:`import heapq\nfrom typing import List\nclass Solution:\n    def findKthLargest(self, nums: List[int], k: int) -> int:\n        heap = []\n        for num in nums:\n            heapq.heappush(heap, num)\n            if len(heap) > k:\n                heapq.heappop(heap)\n        return heap[0]\n`,javascript:`var findKthLargest=function(nums,k){const h=[];for(const n of nums){h.push(n);h.sort((a,b)=>a-b);if(h.length>k)h.shift();}return h[0];};`}, testCases:[{label:'[3,2,1,5,6,4] k=2',args:[[3,2,1,5,6,4],2],expected:5},{label:'[3,2,3,1,2,4,5,5,6] k=4',args:[[3,2,3,1,2,4,5,5,6],4],expected:4}], runnerPy:`import heapq\nsol=Solution()\nresults=[sol.findKthLargest([3,2,1,5,6,4],2)==5,sol.findKthLargest([3,2,3,1,2,4,5,5,6],4)==4]\nprint(results)\n`, runnerJs:`const sol=findKthLargest;return[sol([3,2,1,5,6,4],2)===5,sol([3,2,3,1,2,4,5,5,6],4)===4];`, hint:'Maintain a min-heap of size k. After processing all elements, the root is the kth largest.', studyGuide:{concept:'Kth Order Statistic — Heap vs Quickselect',tldr:'Min-heap of size k: O(n log k). Quickselect partitions to find the kth largest without full sorting: O(n) average.',explanation:'Heap approach: push every element, pop minimum when heap exceeds k. heap[0] is kth largest. Quickselect: partition around pivot, recurse only on the side containing kth largest.',approaches:[{name:'Min-heap size k',time:'O(n log k)',space:'O(k)',description:'Simple and reliable.',works:true},{name:'Quickselect',time:'O(n) avg, O(n²) worst',space:'O(1)',description:'Faster average, but worst-case is poor without randomization.',works:true}],visualExample:'[3,2,1,5,6,4] k=2: push all, keep top 2: heap=[5,6]. heap[0]=5.',keyInsight:'A size-k min-heap always holds the k largest elements seen so far. Its minimum = kth largest.',patternHint:'"kth largest/smallest" → fixed-size heap. "kth order statistic efficiently" → Quickselect.',pitfalls:['Confusing kth largest (size-k min-heap) with kth smallest (size-k max-heap).','Quickselect worst-case O(n²) without random pivot.']}});

// Arc 5: BSTs
const SEARCH_BST = mkDSA({ id:'DSA_700_SEARCH_BST', leetcodeNum:700, leetcodeSlug:'search-in-a-binary-search-tree', leetcodeUrl:'https://leetcode.com/problems/search-in-a-binary-search-tree/', difficulty:'Easy', tags:['Tree','Binary Search Tree','Binary Tree'], statement:'You are given the root of a BST and an integer val. Find the node with value val. Return the subtree rooted at that node. If val does not exist, return null.', examples:[{input:'root=[4,2,7,1,3], val=2',output:'[2,1,3]'},{input:'root=[4,2,7,1,3], val=5',output:'null'}], constraints:['1 <= nodes <= 5000'], starterCode:{python:`from typing import Optional\nclass TreeNode:\n    def __init__(self,val=0,left=None,right=None):\n        self.val=val;self.left=left;self.right=right\nclass Solution:\n    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:\n        if not root: return None\n        if root.val == val: return root\n        if val < root.val: return self.searchBST(root.left, val)\n        return self.searchBST(root.right, val)\n`,javascript:`var searchBST=function(root,val){if(!root)return null;if(root.val===val)return root;return val<root.val?searchBST(root.left,val):searchBST(root.right,val);};`}, testCases:[{label:'val=2 in BST',args:[[4,2,7,1,3],2],expected:2},{label:'val=5 not in BST',args:[[4,2,7,1,3],5],expected:null}], runnerPy:`sol=Solution()\ndef build(vals):\n    if not vals: return None\n    nodes=[TreeNode(v) if v is not None else None for v in vals]\n    for i in range(len(nodes)):\n        if nodes[i]:\n            if 2*i+1<len(nodes): nodes[i].left=nodes[2*i+1]\n            if 2*i+2<len(nodes): nodes[i].right=nodes[2*i+2]\n    return nodes[0]\nroot=build([4,2,7,1,3])\nr=sol.searchBST(root,2)\nresults=[r is not None and r.val==2, sol.searchBST(build([4,2,7,1,3]),5) is None]\nprint(results)\n`, runnerJs:`function b(a){if(!a||!a.length)return null;const n=a.map(v=>v!=null?{val:v,left:null,right:null}:null);for(let i=0;i<n.length;i++)if(n[i]){if(2*i+1<n.length)n[i].left=n[2*i+1];if(2*i+2<n.length)n[i].right=n[2*i+2];}return n[0];}const sol=searchBST;return[sol(b([4,2,7,1,3]),2)?.val===2,sol(b([4,2,7,1,3]),5)===null];`, hint:'BST property: left subtree values < root, right subtree values > root. If val < root.val, search left; if > root.val, search right.', studyGuide:{concept:'Binary Search Tree — O(log n) Search',tldr:'BST property: all left descendants < node < all right descendants. Follow left/right based on comparison.',explanation:'At each node: if val == node.val return it; if val < node.val recurse left; else recurse right. At most O(height) = O(log n) comparisons for balanced tree.',approaches:[{name:'Recursive',time:'O(h)',space:'O(h)',description:'h = tree height. O(log n) for balanced, O(n) for degenerate.',works:true},{name:'Iterative',time:'O(h)',space:'O(1)',description:'While loop, no recursion stack.',works:true}],visualExample:'Search val=2 in [4,2,7,1,3]: 2<4 go left → node=2, 2==2 found! Return node.',keyInsight:'BST eliminates half the remaining nodes at each step — same idea as binary search on a sorted array.',patternHint:'Any BST lookup/insert/delete follows left-if-smaller, right-if-larger navigation.',pitfalls:['Returning node.val instead of node (problem asks for the subtree/node itself).','Not handling root=None (empty tree or val not found).']}});

const VALIDATE_BST = mkDSA({ id:'DSA_98_VALIDATE_BST', leetcodeNum:98, leetcodeSlug:'validate-binary-search-tree', leetcodeUrl:'https://leetcode.com/problems/validate-binary-search-tree/', difficulty:'Medium', tags:['Tree','Depth-First Search','Binary Search Tree'], statement:'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has each node with all left descendants strictly less than the node, and all right descendants strictly greater.', examples:[{input:'root=[2,1,3]',output:'true'},{input:'root=[5,1,4,null,null,3,6]',output:'false',explanation:'Root is 5 but right child is 4 < 5.'}], constraints:['1 <= nodes <= 10⁴'], starterCode:{python:`from typing import Optional\nclass TreeNode:\n    def __init__(self,val=0,left=None,right=None):\n        self.val=val;self.left=left;self.right=right\nclass Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        def validate(node, min_val, max_val):\n            if not node: return True\n            if not (min_val < node.val < max_val): return False\n            return (validate(node.left, min_val, node.val) and\n                    validate(node.right, node.val, max_val))\n        return validate(root, float('-inf'), float('inf'))\n`,javascript:`var isValidBST=function(root){function v(node,min,max){if(!node)return true;if(node.val<=min||node.val>=max)return false;return v(node.left,min,node.val)&&v(node.right,node.val,max);}return v(root,-Infinity,Infinity);};`}, testCases:[{label:'[2,1,3] valid',args:[[2,1,3]],expected:true},{label:'[5,1,4,null,null,3,6] invalid',args:[[5,1,4,null,null,3,6]],expected:false}], runnerPy:`sol=Solution()\ndef build(vals):\n    if not vals: return None\n    nodes=[TreeNode(v) if v is not None else None for v in vals]\n    for i in range(len(nodes)):\n        if nodes[i]:\n            if 2*i+1<len(nodes): nodes[i].left=nodes[2*i+1]\n            if 2*i+2<len(nodes): nodes[i].right=nodes[2*i+2]\n    return nodes[0]\nresults=[sol.isValidBST(build([2,1,3]))==True, sol.isValidBST(build([5,1,4,None,None,3,6]))==False]\nprint(results)\n`, runnerJs:`function b(a){if(!a.length)return null;const n=a.map(v=>v!=null?{val:v,left:null,right:null}:null);for(let i=0;i<n.length;i++)if(n[i]){if(2*i+1<n.length)n[i].left=n[2*i+1];if(2*i+2<n.length)n[i].right=n[2*i+2];}return n[0];}const sol=isValidBST;return[sol(b([2,1,3]))===true,sol(b([5,1,4,null,null,3,6]))===false];`, hint:'Pass allowed range [min_val, max_val] to each recursive call. Left subtree: max narrows to node.val. Right subtree: min widens to node.val.', studyGuide:{concept:'BST Validation with Range Propagation',tldr:'Each node must lie in a strict range (min_val, max_val). Pass narrowing bounds down the tree.',explanation:'validate(node, min_val, max_val): if node.val not in (min_val, max_val) → invalid. Recurse left with max=node.val, recurse right with min=node.val.',approaches:[{name:'Range propagation (DFS)',time:'O(n)',space:'O(h)',description:'Visit each node once.',works:true},{name:'In-order traversal',time:'O(n)',space:'O(n)',description:'In-order of valid BST is strictly increasing. Check each element > previous.',works:true}],visualExample:'[5,1,4,null,null,3,6]: validate(5,-inf,+inf)→ok. validate(1,-inf,5)→ok. validate(4,5,+inf)→4 not in (5,+inf) → FALSE.',keyInsight:'The common mistake is only comparing a node to its direct parent. You must propagate constraints from ALL ancestors.',patternHint:'BST properties that span multiple levels → pass bounds through recursion.',pitfalls:['Only comparing node to parent (misses cases like right child of root being less than root\'s ancestor).','Using <= instead of < (BST requires strict inequality).']}});

const KTH_SMALLEST_BST = mkDSA({ id:'DSA_230_KTH_SMALLEST_BST', leetcodeNum:230, leetcodeSlug:'kth-smallest-element-in-a-bst', leetcodeUrl:'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', difficulty:'Medium', tags:['Tree','Depth-First Search','Binary Search Tree','Binary Tree'], statement:'Given the root of a BST and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.', examples:[{input:'root=[3,1,4,null,2], k=1',output:'1'},{input:'root=[5,3,6,2,4,null,null,1], k=3',output:'3'}], constraints:['1 <= k <= nodes <= 10⁴'], starterCode:{python:`from typing import Optional\nclass TreeNode:\n    def __init__(self,val=0,left=None,right=None):\n        self.val=val;self.left=left;self.right=right\nclass Solution:\n    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        stack = []\n        node = root\n        count = 0\n        while stack or node:\n            while node:\n                stack.append(node)\n                node = node.left\n            node = stack.pop()\n            count += 1\n            if count == k: return node.val\n            node = node.right\n        return -1\n`,javascript:`var kthSmallest=function(root,k){const stack=[];let node=root,cnt=0;while(stack.length||node){while(node){stack.push(node);node=node.left;}node=stack.pop();if(++cnt===k)return node.val;node=node.right;}return -1;};`}, testCases:[{label:'[3,1,4,null,2] k=1',args:[[3,1,4,null,2],1],expected:1},{label:'[5,3,6,2,4,null,null,1] k=3',args:[[5,3,6,2,4,null,null,1],3],expected:3}], runnerPy:`sol=Solution()\ndef build(vals):\n    if not vals: return None\n    nodes=[TreeNode(v) if v is not None else None for v in vals]\n    for i in range(len(nodes)):\n        if nodes[i]:\n            if 2*i+1<len(nodes): nodes[i].left=nodes[2*i+1]\n            if 2*i+2<len(nodes): nodes[i].right=nodes[2*i+2]\n    return nodes[0]\nresults=[sol.kthSmallest(build([3,1,4,None,2]),1)==1,sol.kthSmallest(build([5,3,6,2,4,None,None,1]),3)==3]\nprint(results)\n`, runnerJs:`function b(a){const n=a.map(v=>v!=null?{val:v,left:null,right:null}:null);for(let i=0;i<n.length;i++)if(n[i]){if(2*i+1<n.length)n[i].left=n[2*i+1];if(2*i+2<n.length)n[i].right=n[2*i+2];}return n[0];}const sol=kthSmallest;return[sol(b([3,1,4,null,2]),1)===1,sol(b([5,3,6,2,4,null,null,1]),3)===3];`, hint:'In-order traversal of a BST visits nodes in ascending sorted order. Count nodes as you visit; return when count reaches k.', studyGuide:{concept:'In-Order Traversal — BST as Sorted Sequence',tldr:'In-order traversal (left→root→right) of any BST visits nodes in ascending order. The kth visited node is the kth smallest.',explanation:'Iterative in-order: go as far left as possible (pushing to stack), pop (= visit), then go right. Count visits; at count=k return node.val.',approaches:[{name:'Iterative in-order',time:'O(H+k)',space:'O(H)',description:'Stop early at k. H = tree height.',works:true},{name:'Recursive in-order',time:'O(n)',space:'O(n)',description:'Cleaner code. Can use a nonlocal counter.',works:true}],visualExample:'BST [3,1,4,null,2]: in-order visits 1,2,3,4. k=1 → return 1.',keyInsight:'In-order traversal converts a BST into its sorted sequence without explicitly sorting.',patternHint:'Any problem requiring BST elements in sorted order → in-order traversal.',pitfalls:['Off-by-one: counting visits, not nodes pushed onto stack.','Not stopping early at k (traverses entire tree unnecessarily).']}});

// Arc 5: Arrays & Prefix Sums
const PRODUCT_EXCEPT_SELF = mkDSA({ id:'DSA_238_PRODUCT_EXCEPT', leetcodeNum:238, leetcodeSlug:'product-of-array-except-self', leetcodeUrl:'https://leetcode.com/problems/product-of-array-except-self/', difficulty:'Medium', tags:['Array','Prefix Sum'], statement:'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm must run in O(n) without using the division operation.', examples:[{input:'nums=[1,2,3,4]',output:'[24,12,8,6]'},{input:'nums=[-1,1,0,-3,3]',output:'[0,0,9,0,0]'}], constraints:['2 <= nums.length <= 10⁵'], starterCode:{python:`from typing import List\nclass Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        n = len(nums)\n        answer = [1] * n\n        # Left pass: answer[i] = product of nums[0..i-1]\n        prefix = 1\n        for i in range(n):\n            answer[i] = prefix\n            prefix *= nums[i]\n        # Right pass: multiply by product of nums[i+1..n-1]\n        suffix = 1\n        for i in range(n-1, -1, -1):\n            answer[i] *= suffix\n            suffix *= nums[i]\n        return answer\n`,javascript:`var productExceptSelf=function(nums){const n=nums.length,ans=new Array(n).fill(1);let pre=1;for(let i=0;i<n;i++){ans[i]=pre;pre*=nums[i];}let suf=1;for(let i=n-1;i>=0;i--){ans[i]*=suf;suf*=nums[i];}return ans;};`}, testCases:[{label:'[1,2,3,4]',args:[[1,2,3,4]],expected:[24,12,8,6]},{label:'[-1,1,0,-3,3]',args:[[-1,1,0,-3,3]],expected:[0,0,9,0,0]}], runnerPy:`sol=Solution()\nresults=[sol.productExceptSelf([1,2,3,4])==[24,12,8,6],sol.productExceptSelf([-1,1,0,-3,3])==[0,0,9,0,0]]\nprint(results)\n`, runnerJs:`const sol=productExceptSelf;return[JSON.stringify(sol([1,2,3,4]))==='[24,12,8,6]',JSON.stringify(sol([-1,1,0,-3,3]))==='[0,0,9,0,0]'];`, hint:'Two passes. Left pass: answer[i] = product of everything to the left of i. Right pass: multiply answer[i] by product of everything to the right.', studyGuide:{concept:'Prefix and Suffix Products — Two-Pass O(n) No Division',tldr:'answer[i] = prefix[i] × suffix[i]. Build prefix left-to-right and suffix right-to-left in two passes.',explanation:'Pass 1 (left→right): answer[i] = product of nums[0..i-1]. Pass 2 (right→left): answer[i] *= product of nums[i+1..n-1]. Uses O(1) extra space.',approaches:[{name:'Two-pass prefix×suffix',time:'O(n)',space:'O(1)',description:'Optimal. No division.',works:true},{name:'Division (not allowed)',time:'O(n)',space:'O(1)',description:'total_product / nums[i]. Fails when nums contains 0.',works:false}],visualExample:'[1,2,3,4] left pass: [1,1,2,6]. Right pass: suffix=1,4→1; suffix=4,3→4; suffix=12,2→8; suffix=24→24. Final: [24,12,8,6].',keyInsight:'answer[i] = (product of all to the left) × (product of all to the right). Two passes compute each factor separately.',patternHint:'When you need a product/sum/max excluding current element → prefix + suffix passes.',pitfalls:['Using division (breaks on zeros and is disallowed).','Off-by-one: answer[i] = product of nums BEFORE i, not including i.']}});

const RANGE_SUM_QUERY = mkDSA({ id:'DSA_303_RANGE_SUM', leetcodeNum:303, leetcodeSlug:'range-sum-query-immutable', leetcodeUrl:'https://leetcode.com/problems/range-sum-query-immutable/', difficulty:'Easy', tags:['Array','Design','Prefix Sum'], statement:'Given an integer array nums, design a class to handle multiple queries efficiently. sumRange(left, right) returns the sum of elements between indices left and right inclusive.', examples:[{input:'NumArray([-2,0,3,-5,2,-1]), sumRange(0,2)→1, sumRange(2,5)→-1, sumRange(0,5)→-3',output:'[1,-1,-3]'}], constraints:['1 <= nums.length <= 10⁴, up to 10⁴ calls to sumRange'], starterCode:{python:`from typing import List\nclass NumArray:\n    def __init__(self, nums: List[int]):\n        self.prefix = [0] * (len(nums)+1)\n        for i, n in enumerate(nums):\n            self.prefix[i+1] = self.prefix[i] + n\n    def sumRange(self, left: int, right: int) -> int:\n        return self.prefix[right+1] - self.prefix[left]\n`,javascript:`class NumArray{constructor(nums){this.p=[0];for(const n of nums)this.p.push(this.p[this.p.length-1]+n);}sumRange(l,r){return this.p[r+1]-this.p[l];}}`}, testCases:[{label:'sumRange(0,2)',args:[[-2,0,3,-5,2,-1],0,2],expected:1},{label:'sumRange(2,5)',args:[[-2,0,3,-5,2,-1],2,5],expected:-1}], runnerPy:`na=NumArray([-2,0,3,-5,2,-1])\nresults=[na.sumRange(0,2)==1,na.sumRange(2,5)==-1,na.sumRange(0,5)==-3]\nprint(results)\n`, runnerJs:`const na=new NumArray([-2,0,3,-5,2,-1]);return[na.sumRange(0,2)===1,na.sumRange(2,5)===-1];`, hint:'prefix[i] = sum of nums[0..i-1]. sumRange(l,r) = prefix[r+1] - prefix[l]. O(n) build, O(1) each query.', studyGuide:{concept:'Prefix Sum Array — O(1) Range Queries',tldr:'Precompute cumulative sums. Any range sum is then a simple subtraction.',explanation:'prefix[0]=0, prefix[i]=nums[0]+...+nums[i-1]. sumRange(l,r) = prefix[r+1] - prefix[l].',approaches:[{name:'Prefix sum array',time:'O(n) build, O(1) query',space:'O(n)',description:'Best for many queries on static data.',works:true}],visualExample:'nums=[-2,0,3,-5,2,-1]: prefix=[0,-2,-2,1,-4,-2,-3]. sumRange(0,2)=prefix[3]-prefix[0]=1-0=1.',keyInsight:'prefix[r+1]-prefix[l] gives sum of nums[l..r] because prefix[i] accumulates from index 0.',patternHint:'Multiple range sum/average queries on static array → prefix sums.',pitfalls:['Off-by-one: prefix has length n+1, prefix[0]=0.','Using prefix[r]-prefix[l] instead of prefix[r+1]-prefix[l] (misses nums[r]).']}});

const PIVOT_INDEX = mkDSA({ id:'DSA_724_PIVOT_INDEX', leetcodeNum:724, leetcodeSlug:'find-pivot-index', leetcodeUrl:'https://leetcode.com/problems/find-pivot-index/', difficulty:'Easy', tags:['Array','Prefix Sum'], statement:'The pivot index is where the sum of all numbers strictly to the left equals the sum strictly to the right. Return the leftmost pivot index, or -1 if none.', examples:[{input:'nums=[1,7,3,6,5,6]',output:'3',explanation:'Left of index 3: 1+7+3=11. Right: 5+6=11.'},{input:'nums=[1,2,3]',output:'-1'},{input:'nums=[2,1,-1]',output:'0'}], constraints:['1 <= nums.length <= 10⁴'], starterCode:{python:`from typing import List\nclass Solution:\n    def pivotIndex(self, nums: List[int]) -> int:\n        total = sum(nums)\n        left_sum = 0\n        for i, num in enumerate(nums):\n            if left_sum == total - left_sum - num:\n                return i\n            left_sum += num\n        return -1\n`,javascript:`var pivotIndex=function(nums){const total=nums.reduce((a,b)=>a+b,0);let left=0;for(let i=0;i<nums.length;i++){if(left===total-left-nums[i])return i;left+=nums[i];}return -1;};`}, testCases:[{label:'[1,7,3,6,5,6]',args:[[1,7,3,6,5,6]],expected:3},{label:'[1,2,3]',args:[[1,2,3]],expected:-1},{label:'[2,1,-1]',args:[[2,1,-1]],expected:0}], runnerPy:`sol=Solution()\nresults=[sol.pivotIndex([1,7,3,6,5,6])==3,sol.pivotIndex([1,2,3])==-1,sol.pivotIndex([2,1,-1])==0]\nprint(results)\n`, runnerJs:`const sol=pivotIndex;return[sol([1,7,3,6,5,6])===3,sol([1,2,3])===-1,sol([2,1,-1])===0];`, hint:'right_sum = total - left_sum - nums[i]. Check if left_sum == right_sum.', studyGuide:{concept:'Prefix Sum — Balance Point',tldr:'At each index i: right_sum = total - left_sum - nums[i]. Pivot when left_sum == right_sum.',explanation:'Precompute total. Walk left-to-right tracking left_sum. At i: right_sum = total - left_sum - nums[i]. Return i if equal.',approaches:[{name:'Total sum + running left',time:'O(n)',space:'O(1)',description:'Two passes (one for total, one for scan).',works:true}],visualExample:'[1,7,3,6,5,6] total=28. i=0: left=0,right=27≠0. i=1: left=1,right=20≠1. i=2: left=8,right=17≠8. i=3: left=11,right=11=11 → return 3.',keyInsight:'right_sum = total - left_sum - nums[i]. No need to compute right sum separately.',patternHint:'Any "balance point" or "partition equal sum" problem → track left sum, derive right from total.',pitfalls:['Including nums[i] in left_sum before checking — subtract nums[i] from total-left_sum.','Updating left_sum AFTER the check.']}});

export const DSA_PROBLEMS: Record<string, DSAProblem> = {
  [JUMP_GAME.id]:             JUMP_GAME,
  [COIN_CHANGE.id]:           COIN_CHANGE,
  [MIN_COST_STAIRS.id]:       MIN_COST_STAIRS,
  // Arc 9 — Basic Programming
  [FIZZBUZZ.id]:              FIZZBUZZ,
  [RUNNING_SUM.id]:           RUNNING_SUM,
  [CONCAT_ARRAY.id]:          CONCAT_ARRAY,
  [REVERSE_STRING.id]:        REVERSE_STRING,
  [VALID_ANAGRAM.id]:         VALID_ANAGRAM,
  [JEWELS_STONES.id]:         JEWELS_STONES,
  [PALINDROME_NUMBER.id]:     PALINDROME_NUMBER,
  [LENGTH_LAST_WORD.id]:      LENGTH_LAST_WORD,
  [FIBONACCI.id]:             FIBONACCI,
  [CONTAINS_DUPLICATE.id]:    CONTAINS_DUPLICATE,
  [TWO_SUM.id]:               TWO_SUM,
  [BEST_TIME_STOCK.id]:       BEST_TIME_STOCK,
  // Arc 1 remaining
  [FIND_PATH.id]:             FIND_PATH,
  [COURSE_SCHEDULE.id]:       COURSE_SCHEDULE,
  [REDUNDANT_CONN.id]:        REDUNDANT_CONN,
  [SUBSETS.id]:               SUBSETS,
  [PERMUTATIONS.id]:          PERMUTATIONS,
  [COMBINATION_SUM.id]:       COMBINATION_SUM,
  [NETWORK_DELAY.id]:         NETWORK_DELAY,
  [MIN_EFFORT.id]:            MIN_EFFORT,
  [CHEAPEST_FLIGHTS.id]:      CHEAPEST_FLIGHTS,
  [NUM_ISLANDS.id]:           NUM_ISLANDS,
  [ROTTING_ORANGES.id]:       ROTTING_ORANGES,
  [LEVEL_ORDER.id]:           LEVEL_ORDER,
  [MAJORITY.id]:              MAJORITY,
  [MAX_SUBARRAY.id]:          MAX_SUBARRAY,
  [SORT_ARRAY.id]:            SORT_ARRAY,
  // Arc 5 — Data Structures
  [GROUP_ANAGRAMS.id]:        GROUP_ANAGRAMS,
  [RANSOM_NOTE.id]:           RANSOM_NOTE,
  [ISOMORPHIC.id]:            ISOMORPHIC,
  [KTH_LARGEST_STREAM.id]:    KTH_LARGEST_STREAM,
  [TOP_K_FREQUENT.id]:        TOP_K_FREQUENT,
  [KTH_LARGEST.id]:           KTH_LARGEST,
  [SEARCH_BST.id]:            SEARCH_BST,
  [VALIDATE_BST.id]:          VALIDATE_BST,
  [KTH_SMALLEST_BST.id]:      KTH_SMALLEST_BST,
  [PRODUCT_EXCEPT_SELF.id]:   PRODUCT_EXCEPT_SELF,
  [RANGE_SUM_QUERY.id]:       RANGE_SUM_QUERY,
  [PIVOT_INDEX.id]:           PIVOT_INDEX,
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
