export interface CodexItem {
  title: string;
  syntax: string;
  explanation: string;
  example: string;
}

export const CODEX_DATA: Record<string, CodexItem[]> = {
  WEB: [
    {
      title: "SQL Injection Authentication Bypass",
      syntax: "' OR '1'='1",
      explanation: "Closes the current string parameter in the SQL query and introduces an OR condition that is always true, bypassing username/password validation.",
      example: "SELECT * FROM operators WHERE user = 'admin' OR '1'='1' AND pass = '...';"
    },
    {
      title: "SQL Comments (Truncating Queries)",
      syntax: "' -- or ' # or ' /*",
      explanation: "Appended immediately after your injection payload to turn the remaining part of the original developer query into a comment, ignoring syntax errors from unmatched quotes.",
      example: "SELECT * FROM operators WHERE user = 'admin' --' AND pass = '';"
    },
    {
      title: "Union-Based SQL Injection",
      syntax: "UNION SELECT null, username, password FROM users --",
      explanation: "Appends the results of an attacker-crafted SELECT query to the results of the original query, letting you dump entire databases in one shot.",
      example: "SELECT id, name FROM items WHERE cat = '1' UNION SELECT 1, passcode FROM operators;"
    }
  ],
  REVERSE: [
    {
      title: "Bitwise XOR Reversibility",
      syntax: "A ^ B = C  ===>  C ^ B = A",
      explanation: "XOR (Exclusive OR) is completely reversible. If you XOR a ciphertext byte C with the secret XOR key B, you instantly retrieve the original character byte A.",
      example: "0x11 ^ 0x5A = 0x4B (ASCII 'K')"
    },
    {
      title: "ASCII Character Index Mapping",
      syntax: "char.charCodeAt(0) or String.fromCharCode(code)",
      explanation: "Converts characters to decimal ASCII integers, and vice versa. Crucial for understanding decompiled array calculations.",
      example: "'A' has ASCII value 65; 'a' has value 97; '0' has value 48."
    },
    {
      title: "Hexadecimal to Decimal Convert",
      syntax: "0x1234 = (1 * 16^3) + (2 * 16^2) + (3 * 16^1) + (4 * 16^0)",
      explanation: "Hex (base-16) values use digits 0-9 and A-F. Preceded by '0x' in code. Used extensively for memory address offsets.",
      example: "0x1234 in decimal is 4660. 0xFF in decimal is 255."
    }
  ],
  SCRIPTING: [
    {
      title: "Zero-Based Array Indexing",
      syntax: "array[index]",
      explanation: "In modern programming (Python, Javascript, C++), list indexing starts at 0. The last element in an array of length N is always located at index N - 1.",
      example: "let list = ['A', 'B', 'C']; list[0] is 'A'; list[2] is 'C'; list[3] throws Out of Bounds!"
    },
    {
      title: "Safe String Type Casting",
      syntax: "int('10') (Python) or parseInt('10') (JS)",
      explanation: "Forces a string variable containing numerical characters to turn into a mathematical integer, preventing implicit string concat crashes.",
      example: "'10' + 20 results in '1020' (coercion error). int('10') + 20 results in 30."
    },
    {
      title: "List Slicing (Intervals)",
      syntax: "list[start:end] (Python)",
      explanation: "Extracts a sub-range from a list. It is inclusive of the 'start' index but exclusive of the 'end' index.",
      example: "nums = [5, 10, 15, 20]; nums[0:3] yields [5, 10, 15]."
    }
  ],
  PWN: [
    {
      title: "File Descriptors (FD)",
      syntax: "0 = stdin, 1 = stdout, 2 = stderr",
      explanation: "Unix systems map low integer indexes to IO channels. If a vulnerable C program reads from a dynamic file descriptor, setting it to 0 binds it directly to keyboard input (stdin).",
      example: "int fd = input_arg - 4660; // if input_arg is 4660, fd is 0, reading directly from stdin."
    },
    {
      title: "Buffer Overflow Foundation",
      syntax: "[Padding buffer] + [EBP overwrite] + [EIP Target Return Address]",
      explanation: "Writing more data than a stack buffer's size overwrites adjacent memory, allowing control of the Instruction Pointer (EIP) to hijack execution flow.",
      example: "char buffer[64]; // entering 80 bytes will overflow the stack control registers."
    }
  ],
  CRYPTO: [
    {
      title: "RSA Encryption Mechanics",
      syntax: "c = m^e mod n  &  m = c^d mod n",
      explanation: "Public exponent 'e' and modulus 'n' encrypt messages. Decryption key 'd' requires computing the modular inverse using the totient of factored primes (p, q).",
      example: "If n = 3233, factoring gives p = 53, q = 61. Totient = 52 * 60 = 3120."
    },
    {
      title: "Caesar Shift Rotation (ROT)",
      syntax: "c = (p + shift) mod 26",
      explanation: "Rotates alphabet letters forward by a set integer offset. ROT-13 rotates letters by exactly half the alphabet, making it its own inverse.",
      example: "With shift=13, 'G' (6) + 13 = 'T' (19). 'O' (14) + 13 = 'B' (1). 'GOMU' becomes 'TBZH'."
    }
  ],
  ML_SECURITY: [
    {
      title: "Fast Gradient Sign Method (FGSM)",
      syntax: "x_adv = x + epsilon * sign(grad(loss(x, y)))",
      explanation: "A one-shot adversarial perturbation that computes the gradient of loss with respect to the input image, shifting pixel values in the direction of max loss.",
      example: "Slightly tweaks a pixel array by epsilon to fool deep neural networks while remaining visually identical."
    },
    {
      title: "Model Training vs Inference Mode",
      syntax: "model.eval() vs model.train()",
      explanation: "Model layers like Dropout and BatchNormalization act stochastically during training. For stable production inference, they must be set to evaluation mode.",
      example: "In train mode, dropout randomly deactivates neurons, resulting in chaotic, non-deterministic predictions for the same input."
    }
  ],
  NETWORKS: [
    {
      title: "Stealth SYN Port Scanning",
      syntax: "SYN Scan (Half-Open)",
      explanation: "Sends a SYN packet to probe a port. If a SYN-ACK returns, the port is open; the scanner instantly aborts with a RST packet to avoid completing the handshake.",
      example: "Avoids standard server logging by never completing the three-way connection handshake."
    },
    {
      title: "DNS Spoofing (Poisoning)",
      syntax: "First Response Wins",
      explanation: "DNS relies on connectionless UDP. An attacker sniffing queries sends a forged IP response faster than the authentic DNS resolver, redirecting client traffic.",
      example: "Interceptor sends IP 10.42.99.1 before 192.168.1.100 is received."
    }
  ]
};
