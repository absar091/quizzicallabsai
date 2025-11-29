/**
 * Answer Encryption Utility
 * Obfuscates quiz answers to prevent easy cheating via network inspection
 */

// Simple XOR cipher with rotating key
function xorEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

// Base64 encode for safe transport
function toBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str, 'utf-8').toString('base64');
}

function fromBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(atob(str)));
  }
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Generate deterministic key from quizId
function generateSessionKey(quizId: string): string {
  // Use a fixed salt for consistent key generation
  const salt = 'QuizzicalLabz_2025';
  const combined = `${salt}_${quizId}`;
  
  // Simple hash function for deterministic key
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate 32-char key from hash
  const baseKey = Math.abs(hash).toString(36).padStart(16, '0');
  return (baseKey + baseKey).substring(0, 32);
}

/**
 * Encrypt answer data
 */
export function encryptAnswer(answer: string, explanation: string | undefined, quizId: string): string {
  const sessionKey = generateSessionKey(quizId);
  const data = JSON.stringify({ a: answer, e: explanation || '' });
  const encrypted = xorEncrypt(data, sessionKey);
  const encoded = toBase64(encrypted);
  return encoded;
}

/**
 * Decrypt answer data
 */
export function decryptAnswer(encryptedData: string, quizId: string): { answer: string; explanation?: string } {
  try {
    const sessionKey = generateSessionKey(quizId);
    const encrypted = fromBase64(encryptedData);
    const decrypted = xorEncrypt(encrypted, sessionKey);
    const data = JSON.parse(decrypted);
    
    return {
      answer: data.a,
      explanation: data.e || undefined
    };
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt answer');
  }
}

/**
 * Obfuscate entire quiz
 */
export function obfuscateQuiz(quiz: any[], quizId: string) {
  return quiz.map((q, index) => {
    if (q.correctAnswer) {
      const encrypted = encryptAnswer(q.correctAnswer, q.explanation, `${quizId}_${index}`);
      return {
        ...q,
        correctAnswer: undefined,
        explanation: undefined,
        _enc: encrypted // Encrypted answer
      };
    }
    return q;
  });
}

/**
 * Check if user answer is correct (client-side)
 */
export function checkAnswer(userAnswer: string, encryptedData: string, questionId: string): boolean {
  try {
    const { answer } = decryptAnswer(encryptedData, questionId);
    return userAnswer.trim().toLowerCase() === answer.trim().toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Get explanation after answering (client-side)
 */
export function getExplanation(encryptedData: string, questionId: string): string | undefined {
  try {
    const { explanation } = decryptAnswer(encryptedData, questionId);
    return explanation;
  } catch {
    return undefined;
  }
}
