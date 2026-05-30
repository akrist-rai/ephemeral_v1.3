export interface CTFChapter {
  id: string;
  title: string;
  description: string;
  question: string;
  placeholder?: string;
  answer: string;
  hint: string;
}

export const EXPLICIT_CHAPTERS: Record<string, CTFChapter[]> = {
  'WEB_SQLI_001': [
    {
      id: 'sqli_ch1',
      title: 'Chapter 1: Target Profiling',
      description: 'Analyze the intercepted authentication schema dump and server query logs. Find the exact column identifier in the database operators table that stores clearance permissions.',
      question: 'What is the exact column name storing security clearances?',
      placeholder: 'column_name…',
      answer: 'security_clearance',
      hint: 'Inspect the columns listed in the SYSTEM DUMP table headers.'
    },
    {
      id: 'sqli_ch2',
      title: 'Chapter 2: Syntactic Injection Analysis',
      description: 'The authentication gateway interpolates user input directly into single quotes. To inject our payload successfully, we must terminate the username string. Identify the SQL string delimiter character.',
      question: 'Submit the single character that terminates string inputs in SQL.',
      placeholder: 'character…',
      answer: "'",
      hint: 'It is a single quote.'
    },
    {
      id: 'sqli_ch3',
      title: 'Chapter 3: Database Privilege Bypass',
      description: 'Now, construct the full injection payload. Use the string delimiter to exit the username field, then append a logic condition that forces the query to return TRUE regardless of the password field, allowing admin login.',
      question: 'Submit the SQL injection payload to bypass the login portal (Flag).',
      placeholder: "admin' OR…",
      answer: "admin' OR '1'='1",
      hint: "Remember to use single quotes to balance the query structure."
    }
  ],
  'PWN_STACK_001': [
    {
      id: 'pwn_ch1',
      title: 'Chapter 1: POSIX Descriptors',
      description: 'The setuid binary utilizes integer indexes for standard descriptors. In Unix-like systems, standard input, standard output, and standard error are assigned indices 0, 1, and 2. What integer index represents standard input (stdin)?',
      question: 'What is the file descriptor integer for stdin?',
      placeholder: '0, 1, or 2…',
      answer: '0',
      hint: 'It is the floor of descriptor allocations.'
    },
    {
      id: 'pwn_ch2',
      title: 'Chapter 2: Hexadecimal Offset Conversion',
      description: 'The binary subtracts 0x1234 from your numeric argument to assign the file descriptor. Convert 0x1234 to decimal so we can calculate the argument required to open standard input.',
      question: 'What is 0x1234 in decimal?',
      placeholder: 'decimal value…',
      answer: '4660',
      hint: 'Convert 1234 hex to base 10 (1*16^3 + 2*16^2 + 3*16^1 + 4).'
    },
    {
      id: 'pwn_ch3',
      title: 'Chapter 3: Memory Hijacking',
      description: 'Now, pass the decimal offset as an argument to set the file descriptor to 0. The binary will then read standard input. Provide the specific 9-character buffer string required to print the flag.',
      question: 'Submit the buffer string that triggers flag output (Flag).',
      placeholder: 'buffer string…',
      answer: 'LETMEWIN',
      hint: 'Inspect the strcmp check in FD.C source code.'
    }
  ],
  'REV_XOR_001': [
    {
      id: 'rev_ch1',
      title: 'Chapter 1: Symmetric XOR Logic',
      description: 'XOR logic is symmetric: if A ^ B = C, then A ^ C = B. Calculate the hexadecimal value of the first character by XORing the target signature byte (0x11) with the mask (0x5A).',
      question: 'What is 0x11 XOR 0x5A? (Submit as hex prefix like 0x4B)',
      placeholder: '0xXX…',
      answer: '0x4B',
      hint: 'Do a bitwise XOR: 00010001 ^ 01011010.'
    },
    {
      id: 'rev_ch2',
      title: 'Chapter 2: Character Translation',
      description: 'Translate the computed hexadecimal byte (0x4B) to its ASCII character representation. This corresponds to the first letter of the license key.',
      question: 'What ASCII character corresponds to 0x4B?',
      placeholder: 'uppercase char…',
      answer: 'K',
      hint: '0x4B in decimal is 75. Look up ASCII character 75.'
    },
    {
      id: 'rev_ch3',
      title: 'Chapter 3: Complete Decryption',
      description: 'Decipher the remaining bytes by XORing the target array [0x11, 0x1F, 0x03, 0x0A, 0x0D, 0x14] against the key mask (0x5A). Combine them to obtain the full 6-character license key.',
      question: 'Submit the full decrypted 6-character license key (Flag).',
      placeholder: 'KEY…',
      answer: 'KEYPWN',
      hint: 'Perform the XOR decryption for all 6 indexes.'
    }
  ],
  'CRY_PADDING_001': [
    {
      id: 'cry_ch1',
      title: 'Chapter 1: PKCS#1 Structure',
      description: 'PKCS#1 v1.5 padding structures decrypted blocks by starting with two specific bytes indicating an encryption block. Identify the first two bytes in hexadecimal.',
      question: 'Submit the first two bytes of a valid block (e.g. 0x00 0x02).',
      placeholder: '0xXX 0xXX…',
      answer: '0x00 0x02',
      hint: 'Check standard PKCS#1 block layouts; it begins with zero and a block type byte.'
    },
    {
      id: 'cry_ch2',
      title: 'Chapter 2: Cryptanalyst Identification',
      description: 'Identify the Swiss cryptographer who published this padding oracle attack in 1998, demonstrating that attackers could decrypt RSA streams by querying padding state.',
      question: 'Submit the last name of the cryptographer (Flag).',
      placeholder: 'name…',
      answer: 'Bleichenbacher',
      hint: 'The attack is also known as the Million Message Attack.'
    }
  ],
  'ML_ADVERSARIAL_001': [
    {
      id: 'ml_ch1',
      title: 'Chapter 1: Gradient Descent vs Ascent',
      description: 'Adversarial attacks seek to maximize the classification loss of the model. To maximize the loss of a neural network with respect to input pixels, we must follow the direction of the gradient.',
      question: 'Do we move the input pixels in the "direction" or "opposite" to the gradient?',
      placeholder: 'direction or opposite…',
      answer: 'direction',
      hint: 'Gradient descent minimizes loss, while gradient ascent maximizes it.'
    },
    {
      id: 'ml_ch2',
      title: 'Chapter 2: Adversarial Taxonomy',
      description: 'Identify the specific acronym for the Fast Gradient Sign Method shown in the formula, which computes the sign of gradients to perturb inputs in a single step.',
      question: 'Submit the 4-letter acronym for this algorithm (Flag).',
      placeholder: 'acronym…',
      answer: 'FGSM',
      hint: 'It stands for Fast Gradient Sign Method.'
    }
  ]
};

export function getChaptersForChallenge(challengeId: string, finalFlag: string): CTFChapter[] {
  if (EXPLICIT_CHAPTERS[challengeId]) {
    return EXPLICIT_CHAPTERS[challengeId];
  }

  // Generate generic 2-chapter structure dynamically for any other challenge
  return [
    {
      id: `${challengeId}_ch1`,
      title: 'Chapter 1: Technical Analysis',
      description: 'Analyze the system parameters, logs, and trace artifacts. Identify the primary parameter value or indicator of vulnerability described in the scenario.',
      question: 'Perform the core analysis. Submit the target indicator or primary configuration value.',
      placeholder: 'value…',
      answer: finalFlag,
      hint: 'Look closely at the logs and configurations to locate the target flag.'
    }
  ];
}
