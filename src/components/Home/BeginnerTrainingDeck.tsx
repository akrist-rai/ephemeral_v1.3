import React, { useState } from 'react';

interface LanguageDeck {
  id: string;
  name: string;
  creator: string;
  accColor: string;
  logo: string;
  description: string;
  curseWord: string; // The primary beginner pitfall
  bestFor: string;
  starterChallengeId: string;
  startingEpisodeId: string;
  quickSnippet: string;
  sandboxExercises: {
    title: string;
    description: string;
    initialInput: string;
    expectedAnswer: string;
    successMessage: string;
    failureMessage: string;
    runLogic: (val: string) => { success: boolean; output: string[] };
  }[];
}

const LANGUAGES_DATA: LanguageDeck[] = [
  {
    id: 'python',
    name: 'PYTHON',
    creator: 'THE SERPENT COIL',
    accColor: '#4fc3f7',
    logo: '🐍',
    description: 'Beautifully expressive, dynamically typed, and highly readable. Python uses clean indentation in place of brackets, making it the perfect starting point for learning syntax and programming fundamentals.',
    curseWord: 'Dynamic Type Confusion (TypeError)',
    bestFor: 'AI research, quick scripting, automation, algorithms.',
    starterChallengeId: 'PY_001',
    startingEpisodeId: 'S1E1_A9',
    quickSnippet: `def compute_sum(a, b):
    # Dynamic type checking required!
    if isinstance(a, str):
        a = int(a)
    return a + b

print(compute_sum("10", 20))`,
    sandboxExercises: [
      {
        title: 'Exercise 1: Safe Type Adding',
        description: 'Fix a runtime error in dynamic addition. You want to add "10" (string) and 20 (integer). If you just return a + b, Python throws a TypeError. Type a conversion expression or return statement to yield 30.',
        initialInput: 'a = "10"\nb = 20\n# How do you safely sum them? Type: int(a) + b',
        expectedAnswer: 'int(a) + b',
        successMessage: 'SUCCESS // Python interpreter evaluates: int("10") + 20 = 30. Correct type conversion!',
        failureMessage: 'RUNTIME ERROR: TypeError: can only concatenate str (not "int") to str. You must explicitly cast the string variable "a" using int(a).',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('int(a)+b') || clean.includes('b+int(a)') || clean.includes('int("10")+20')) {
            return { success: true, output: ['[INFO] Booting Serpent Interpreter...', '[EVAL] a = "10"', '[EVAL] b = 20', '[EXEC] Evaluated: int("10") + 20', '[OUT] 30', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[INFO] Booting Serpent Interpreter...', '[EVAL] a = "10"', '[EVAL] b = 20', '[EXEC] Evaluated: a + b', '[FATAL] TypeError: unsupported operand type(s) for +: \'str\' and \'int\''] };
        }
      },
      {
        title: 'Exercise 2: List Slicing Matrix',
        description: 'Extract the first three elements of the array [5, 10, 15, 20, 25] using Python slicing syntax. Fill in the slice: nums[0:3] or nums[:3].',
        initialInput: 'nums = [5, 10, 15, 20, 25]\n# Slice here. Type: nums[:3]',
        expectedAnswer: 'nums[:3]',
        successMessage: 'SUCCESS // Slice evaluated successfully: [5, 10, 15]. Python slices are exclusive of the end index.',
        failureMessage: 'INDEX WARNING: Incorrect slice. Remember, to get elements 0, 1, and 2, write nums[:3] or nums[0:3].',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('nums[:3]') || clean.includes('nums[0:3]')) {
            return { success: true, output: ['[EVAL] nums = [5, 10, 15, 20, 25]', '[EXEC] Slice nums[:3]', '[OUT] [5, 10, 15]', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[EVAL] nums = [5, 10, 15, 20, 25]', '[EXEC] Evaluating custom input', `[OUT] ${val}`, '[ERROR] Returned slice did not equal [5, 10, 15]. Try: nums[:3]'] };
        }
      }
    ]
  },
  {
    id: 'c',
    name: 'C LANGUAGE',
    creator: 'THE IRON CORE',
    accColor: '#ef5350',
    logo: '⚙️',
    description: 'The absolute foundation of modern operating systems and hardware control. C is a statically typed, compiled language that teaches you how memory, pointers, compiling, and CPU cache works at the metal.',
    curseWord: 'Null Pointer Dereference & Segmentation Fault',
    bestFor: 'Operating systems, device drivers, embedded systems, high-performance engines.',
    starterChallengeId: 'C_001',
    startingEpisodeId: 'S1E2_A9',
    quickSnippet: `#include <stdio.h>

int main() {
    int val = 42;
    int *ptr = &val;  // Point to memory address
    *ptr = 99;        // Mutate memory
    printf("%d", val); // Prints 99
    return 0;
}`,
    sandboxExercises: [
      {
        title: 'Exercise 1: Dereference Mutation',
        description: 'To modify a variable through a pointer, you must dereference the pointer using the "*" operator. If we have: int *p = &x;, write the statement to change x\'s value to 1337.',
        initialInput: 'int x = 10;\nint *p = &x;\n// Dereference pointer p to set x to 1337. Type: *p = 1337;',
        expectedAnswer: '*p = 1337;',
        successMessage: 'SUCCESS // Compilation: GCC. Run: Memory address updated. *p is dereferenced, x is mutated from 10 to 1337!',
        failureMessage: 'COMPILATION ERROR: Invalid pointer operation. To assign a value to the address pointed to, use: *p = 1337;',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('*p=1337')) {
            return { success: true, output: ['[CC] gcc -O3 sandbox.c -o sandbox', '[EXEC] Initialized x = 10', '[EXEC] Pointer p assigned address of x (&x)', '[EXEC] Dereferenced pointer (*p = 1337)', '[OUT] x value: 1337', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[CC] gcc -O3 sandbox.c -o sandbox', '[EXEC] Initialized x = 10', '[EXEC] Pointer p assigned &x', `[EXEC] Error executing expression: ${val}`, '[FATAL] Compiler Warning: assignment makes pointer from integer without a cast / type mismatch'] };
        }
      },
      {
        title: 'Exercise 2: Address-Of Operator',
        description: 'To store the address of variable "y" in pointer "ptr", you must use the address-of operator "&". Write the pointer assignment statement.',
        initialInput: 'int y = 50;\nint *ptr;\n// Assign address of y to ptr. Type: ptr = &y;',
        expectedAnswer: 'ptr = &y;',
        successMessage: 'SUCCESS // Pointer assignment correct. ptr now holds the memory location: 0x7ffd58c2a4fc.',
        failureMessage: 'COMPILATION ERROR: ptr is of type int*. You must assign the address of y by prefixing y with "&", like: ptr = &y;',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('ptr=&y')) {
            return { success: true, output: ['[CC] gcc sandbox.c', '[EXEC] ptr initialized as NULL', '[EXEC] Assigned address: ptr = &y', '[OUT] ptr value: 0x7ffd58c2a4fc', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[CC] gcc sandbox.c', '[FATAL] error: incompatible types when assigning to type \'int *\' from type \'int\''] };
        }
      }
    ]
  },
  {
    id: 'go',
    name: 'GO LANG',
    creator: 'SWIFT MESSENGER',
    accColor: '#00e5ff',
    logo: '🐹',
    description: 'Google\'s highly concurrent, clean, statically typed server language. Go provides a incredibly simple syntax, lightning-fast compilation, and first-class primitives for concurrent tasks: channels and goroutines.',
    curseWord: 'Deadlocks & Race Conditions',
    bestFor: 'Microservices, cloud engineering, high-throughput network backend.',
    starterChallengeId: 'GO_001',
    startingEpisodeId: 'S1E3_A9',
    quickSnippet: `package main

import "fmt"

func main() {
    ch := make(chan string)
    go func() {
        ch <- "PING" // Send to channel
    }()
    fmt.Println(<-ch) // Read from channel
}`,
    sandboxExercises: [
      {
        title: 'Exercise 1: Goroutine Dispatcher',
        description: 'To spawn a concurrent thread in Go, you simply prepend the function call with the "go" keyword. Write the statement to execute the function calculate() concurrently.',
        initialInput: '// Run calculate() in a concurrent goroutine. Type: go calculate()',
        expectedAnswer: 'go calculate()',
        successMessage: 'SUCCESS // Go Runtime spawned a new lightweight goroutine. calculate() executes in parallel!',
        failureMessage: 'SYNTAX ERROR: To execute concurrently, use the "go" keyword. E.g. go calculate()',
        runLogic: (val) => {
          const clean = val.trim();
          if (clean.includes('go calculate()') || clean.includes('go calculate()')) {
            return { success: true, output: ['[GO] go run sandbox.go', '[SYS] Spawned new goroutine scheduler...', '[EXEC] Launched thread calculate() concurrently', '[OUT] Goroutine #1 status: active', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[GO] go run sandbox.go', '[EXEC] Executing calculate() synchronously in main thread', '[OUT] Main blocks until calculate completes', '[WARN] Concurrent execution was not invoked. Prefix with "go".'] };
        }
      },
      {
        title: 'Exercise 2: Channel Communication',
        description: 'Send the string value "SIGNAL" into the channel variable named "ch" using the send operator (<-).',
        initialInput: 'ch := make(chan string)\n// Send "SIGNAL" to ch. Type: ch <- "SIGNAL"',
        expectedAnswer: 'ch <- "SIGNAL"',
        successMessage: 'SUCCESS // Message sent successfully. Go scheduler will block until another goroutine reads from ch.',
        failureMessage: 'SYNTAX ERROR: To send to a channel, use: channel <- value. E.g., ch <- "SIGNAL"',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('ch<-"SIGNAL"') || clean.includes('ch<-`SIGNAL`')) {
            return { success: true, output: ['[GO] make(chan string)', '[EXEC] Sending payload: "SIGNAL"', '[EXEC] Channel queued packet successfully.', '>>> SUCCESS!'] };
          }
          return { success: false, output: ['[GO] make(chan string)', `[EXEC] Error parsing expression: ${val}`, '[FATAL] syntax error: unexpected channel operator or mismatch'] };
        }
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JAVASCRIPT',
    creator: 'THE ASYNC LOOM',
    accColor: '#ffd54f',
    logo: '⚡',
    description: 'The native language of the web. JavaScript is lightweight, interpreted, and runs on an single-threaded event loop that excels at non-blocking, asynchronous tasks like event handling, UI renders, and HTTP requests.',
    curseWord: 'Loose Coercion (==) & Promise Rejections',
    bestFor: 'Web apps, interactive UI interfaces, REST APIs, full-stack tools.',
    starterChallengeId: 'JS_001',
    startingEpisodeId: 'S1E4_A9',
    quickSnippet: `// The magic event loop
console.log("Start");

setTimeout(() => {
    console.log("Async Task");
}, 0);

console.log("End");
// Output: Start -> End -> Async Task`,
    sandboxExercises: [
      {
        title: 'Exercise 1: Coercion Pitfall',
        description: 'JavaScript Double Equals (==) performs implicit type coercion, leading to bizarre results. What does [] == ![] evaluate to? Type true or false.',
        initialInput: '// What is the output? Type: true',
        expectedAnswer: 'true',
        successMessage: 'SUCCESS // Loose equality coerces ![] to false, and [] to 0. Both become 0 == 0 which is true! UNBELIEVABLE. Always use triple equals (===)!',
        failureMessage: 'INCORRECT // Believe it or not, [] == ![] is actually "true". Double equals performs crazy implicit coercion.',
        runLogic: (val) => {
          const clean = val.trim().toLowerCase();
          if (clean.includes('true')) {
            return { success: true, output: ['[JS] node sandbox.js', '[EVAL] ![] evaluated to: false', '[EVAL] [] coerced to: 0', '[EVAL] false coerced to: 0', '[EXEC] 0 == 0', '[OUT] true', '>>> SUCCESS! ALWAYS USE ==='] };
          }
          return { success: false, output: ['[JS] node sandbox.js', '[EVAL] [] == ![]', '[OUT] true', '[ERROR] Your guess was false, but JS engine returned true. Coercion is cursed!'] };
        }
      },
      {
        title: 'Exercise 2: Strict Equality',
        description: 'Verify strict equality (no coercion) between number 5 and string "5". Write the comparison expression using triple equals.',
        initialInput: 'let num = 5;\nlet str = "5";\n// Perform strict comparison. Type: num === str',
        expectedAnswer: 'num === str',
        successMessage: 'SUCCESS // Evaluation results in false! Triple equals guarantees that values of different types are never equal.',
        failureMessage: 'COERCION DANGER: Do not use double equals (==) here! Use the strict triple equals operator: num === str',
        runLogic: (val) => {
          const clean = val.replace(/\s+/g, '');
          if (clean.includes('num===str')) {
            return { success: true, output: ['[EVAL] num = 5 (Number)', '[EVAL] str = "5" (String)', '[EXEC] Comparison num === str', '[OUT] false', '>>> SUCCESS! Safe comparison completed.'] };
          }
          return { success: false, output: ['[EVAL] num = 5', '[EVAL] str = "5"', '[WARN] Loose equality or invalid syntax used. Type: num === str'] };
        }
      }
    ]
  }
];

interface BeginnerTrainingDeckProps {
  navigate: (path: string) => void;
}

export const BeginnerTrainingDeck: React.FC<BeginnerTrainingDeckProps> = ({ navigate }) => {
  const [activeLangId, setActiveLangId] = useState<string>('python');
  const [activeExIdx, setActiveExIdx] = useState<number>(0);
  const [consoleInput, setConsoleInput] = useState<string>(LANGUAGES_DATA[0].sandboxExercises[0].initialInput);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['[SYS] Ready to compile. Select a training block above.']);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simSuccess, setSimSuccess] = useState<boolean | null>(null);

  const activeLang = LANGUAGES_DATA.find((l) => l.id === activeLangId) || LANGUAGES_DATA[0];
  const activeExercise = activeLang.sandboxExercises[activeExIdx] || activeLang.sandboxExercises[0];

  const handleLangChange = (id: string) => {
    setActiveLangId(id);
    setActiveExIdx(0);
    const target = LANGUAGES_DATA.find((l) => l.id === id) || LANGUAGES_DATA[0];
    setConsoleInput(target.sandboxExercises[0].initialInput);
    setConsoleLogs([`[SYS] Switched compilation environment to ${target.name}.`, '[SYS] Select an exercise and type your answer.']);
    setSimSuccess(null);
    setSimRunning(false);
  };

  const handleExerciseChange = (idx: number) => {
    setActiveExIdx(idx);
    const targetEx = activeLang.sandboxExercises[idx];
    setConsoleInput(targetEx.initialInput);
    setConsoleLogs([`[SYS] Selected ${targetEx.title}.`, '[SYS] Read the scenario and run the compiler.']);
    setSimSuccess(null);
    setSimRunning(false);
  };

  const runSimulation = () => {
    setSimRunning(true);
    setSimSuccess(null);
    setConsoleLogs((prev) => [...prev, '[SYS] Compiling script...', '[SYS] Executing binary in sandbox environment...']);

    setTimeout(() => {
      const res = activeExercise.runLogic(consoleInput);
      setConsoleLogs((prev) => [...prev, ...res.output, res.success ? `[SUCCESS] ${activeExercise.successMessage}` : `[FATAL] ${activeExercise.failureMessage}`]);
      setSimSuccess(res.success);
      setSimRunning(false);
    }, 900);
  };

  return (
    <div className="elden-widget-wrap beginner-deck-wrap" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(180deg, #050a12 0%, #000408 100%)' }}>
      {/* Header */}
      <div className="elden-widget-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="ew-hdr-left">
          <div className="ew-hdr-gold-dot" style={{ background: '#4fc3f7', boxShadow: '0 0 10px #4fc3f7' }} />
          <span className="ew-hdr-title" style={{ color: '#fff' }}>BEGINNER TRAINING CORE // LANGUAGE INTERACTIVE DECKS</span>
        </div>
        <div className="ew-hdr-badge" style={{ color: '#4fc3f7', borderColor: 'rgba(79, 195, 247, 0.3)' }}>
          LEVEL: FRESHMAN INITIATE
        </div>
      </div>

      {/* Tabs */}
      <div className="beginner-lang-tabs" style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem 1rem', gap: '0.8rem' }}>
        {LANGUAGES_DATA.map((lang) => {
          const isActive = lang.id === activeLangId;
          return (
            <button
              key={lang.id}
              className={`beginner-lang-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleLangChange(lang.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? lang.accColor : 'rgba(255,255,255,0.4)',
                fontSize: '0.55rem',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderBottom: isActive ? `2px solid ${lang.accColor}` : '2px solid transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              <span>{lang.logo}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      <div className="beginner-deck-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.2rem' }}>
        
        {/* Left column: Learn Pedagogy */}
        <div className="beginner-learn-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div className="elden-perk-box" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem' }}>
            <div className="ep-box-title" style={{ color: activeLang.accColor, fontSize: '0.48rem', letterSpacing: '0.12em' }}>
              // ARCHITECT DESCRIPTION
            </div>
            <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: '0.4rem 0' }}>
              {activeLang.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <div className="elden-perk-box" style={{ padding: '0.6rem', background: 'rgba(239, 83, 80, 0.03)', border: '1px solid rgba(239, 83, 80, 0.15)' }}>
              <div className="ep-box-title" style={{ color: '#ef5350', fontSize: '0.38rem' }}>PRIMARY BEGINNER PITFALL</div>
              <div className="ep-box-desc" style={{ fontSize: '0.48rem', color: '#fff', marginTop: '0.2rem' }}>{activeLang.curseWord}</div>
            </div>
            <div className="elden-perk-box" style={{ padding: '0.6rem', background: 'rgba(79, 195, 247, 0.03)', border: '1px solid rgba(79, 195, 247, 0.15)' }}>
              <div className="ep-box-title" style={{ color: '#4fc3f7', fontSize: '0.38rem' }}>EXCELLENT USE CASE</div>
              <div className="ep-box-desc" style={{ fontSize: '0.48rem', color: '#fff', marginTop: '0.2rem' }}>{activeLang.bestFor}</div>
            </div>
          </div>

          {/* Quick Snippet View */}
          <div className="beginner-snippet-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.4rem', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)' }}>// CONCEPT COMPILATION SIGNATURE</span>
            </div>
            <pre style={{
              margin: 0,
              padding: '0.6rem',
              background: '#01050a',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '3px',
              fontFamily: 'var(--mono)',
              fontSize: '0.45rem',
              color: '#a5d6ff',
              lineHeight: '1.5',
              overflowX: 'auto',
              flex: 1
            }}>
              <code>{activeLang.quickSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Right column: Interactive Sandbox Simulator */}
        <div className="beginner-sandbox-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '1rem' }}>
          
          {/* Exercises Selection */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.44rem', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)' }}>SELECT TASK:</span>
            {activeLang.sandboxExercises.map((ex, idx) => (
              <button
                key={ex.title}
                onClick={() => handleExerciseChange(idx)}
                style={{
                  background: activeExIdx === idx ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: `1px solid ${activeExIdx === idx ? activeLang.accColor : 'rgba(255,255,255,0.1)'}`,
                  color: activeExIdx === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '0.45rem',
                  fontFamily: 'var(--mono)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '2px',
                  transition: 'all 0.15s'
                }}
              >
                {ex.title.split(': ')[0]}
              </button>
            ))}
          </div>

          {/* Exercise Goal */}
          <div className="elden-perk-box" style={{ background: '#02060c', border: '1px solid rgba(255,255,255,0.03)', padding: '0.6rem', margin: 0 }}>
            <div className="ep-box-title" style={{ color: activeLang.accColor, fontSize: '0.42rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>⚔ MISSION TARGET</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.38rem' }}>TIER 1 INITIATE</span>
            </div>
            <p style={{ fontSize: '0.5rem', color: '#fff', margin: '0.2rem 0 0', lineHeight: '1.5' }}>
              {activeExercise.description}
            </p>
          </div>

          {/* Input Editor Box */}
          <div className="sandbox-editor-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.4rem', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)' }}>// COMPILE BUFFER ENTRY</span>
            </div>
            <div style={{ position: 'relative' }}>
              <textarea
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '70px',
                  background: '#01050a',
                  border: `1px solid ${simSuccess === true ? '#66bb6a' : simSuccess === false ? '#ef5350' : 'rgba(255,255,255,0.08)'}`,
                  color: '#fff',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.48rem',
                  padding: '0.5rem',
                  borderRadius: '3px',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.4'
                }}
              />
            </div>
          </div>

          {/* Controls & Challenge Action */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              onClick={runSimulation}
              disabled={simRunning}
              style={{
                flex: 1,
                background: activeLang.accColor,
                color: '#000',
                border: 'none',
                fontFamily: 'var(--mono)',
                fontSize: '0.5rem',
                fontWeight: 'bold',
                padding: '0.5rem',
                cursor: simRunning ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
                textAlign: 'center',
                boxShadow: `0 0 10px ${activeLang.accColor}44`
              }}
            >
              {simRunning ? 'COMPILING...' : '⚡ RUN SIMULATION'}
            </button>

            <button
              onClick={() => navigate(`/episode/9/${activeLang.startingEpisodeId}/ctf/${activeLang.starterChallengeId}`)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeLang.accColor}55`,
                color: activeLang.accColor,
                fontFamily: 'var(--mono)',
                fontSize: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              ⚔ GO TO CHALLENGE ⚔
            </button>
          </div>

          {/* Output Terminal Console */}
          <div className="sandbox-console-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.4rem', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>// DECK CONSOLE LOGS</span>
            <div style={{
              background: '#000205',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '2px',
              padding: '0.6rem',
              fontFamily: 'var(--mono)',
              fontSize: '0.45rem',
              color: '#00ff41',
              overflowY: 'auto',
              maxHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              flex: 1
            }}>
              {consoleLogs.map((log, index) => {
                let color = '#00ff41';
                if (log.startsWith('[FATAL]') || log.startsWith('[ERROR]')) color = '#ef5350';
                if (log.startsWith('[SYS]')) color = 'rgba(255,255,255,0.4)';
                if (log.startsWith('[SUCCESS]')) color = '#66bb6a';
                if (log.startsWith('[EVAL]')) color = '#4fc3f7';
                return (
                  <div key={index} style={{ color, wordBreak: 'break-all' }}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
