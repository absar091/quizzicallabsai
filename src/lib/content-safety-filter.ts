/**
 * Content Safety Filter for harmful/inappropriate content detection
 */

export class ContentSafetyFilter {
  private static readonly HARMFUL_PATTERNS = [
    // Adult/Sexual content
    /\b(porn|sex|nude|naked|breast|penis|vagina|masturbat|orgasm|erotic)\b/i,
    /\b(xxx|adult|18\+|nsfw|sexual|intercourse)\b/i,
    
    // Violence/Harm
    /\b(kill|murder|suicide|bomb|weapon|gun|knife|violence|torture|abuse)\b/i,
    /\b(hurt|harm|attack|fight|blood|death|die|dead)\b/i,
    
    // Child safety
    /\b(child|kid|minor|underage|young|baby|toddler).*(abuse|harm|hurt|sexual|naked|inappropriate)/i,
    /\b(pedophile|grooming|predator|molest)\b/i,
    
    // Hate speech
    /\b(racist|nazi|hitler|genocide|terrorist|extremist)\b/i,
    /\b(hate|discriminat|supremacist|radical)\b/i,
    
    // Illegal activities
    /\b(drug|cocaine|heroin|meth|illegal|criminal|steal|rob|fraud)\b/i,
    /\b(hack|exploit|breach|unauthorized|piracy)\b/i,
    
    // Self-harm
    /\b(self.harm|cut.myself|end.my.life|want.to.die)\b/i,
    /\b(depression|anxiety|mental.health).*(harm|hurt|kill|die)/i
  ];

  private static readonly BIOLOGY_EXCEPTIONS = [
    // Allow legitimate biology terms
    /\b(reproduction|reproductive|anatomy|physiology|organism|species)\b/i,
    /\b(cell|tissue|organ|system|biology|science|medical|health)\b/i,
    /\b(human.body|animal|plant|evolution|genetics|dna|rna)\b/i,
    /\b(educational|academic|scientific|research|study)\b/i
  ];

  /**
   * Check if content contains harmful patterns
   */
  static checkContent(content: string, subject?: string): {
    isSafe: boolean;
    reason?: string;
    suggestion?: string;
  } {
    const normalizedContent = content.toLowerCase().trim();
    
    // Check if it's biology-related content
    const isBiology = subject?.toLowerCase().includes('biology') || 
                     this.BIOLOGY_EXCEPTIONS.some(pattern => pattern.test(normalizedContent));
    
    // Check for harmful patterns
    for (const pattern of this.HARMFUL_PATTERNS) {
      if (pattern.test(normalizedContent)) {
        // Allow biology exceptions for educational content
        if (isBiology && this.isBiologyException(normalizedContent)) {
          continue;
        }
        
        return {
          isSafe: false,
          reason: 'Content contains inappropriate or harmful material',
          suggestion: 'Please rephrase your request to focus on educational content only'
        };
      }
    }

    return { isSafe: true };
  }

  /**
   * Check if biology content is educational
   */
  private static isBiologyException(content: string): boolean {
    // Must contain educational context
    const hasEducationalContext = this.BIOLOGY_EXCEPTIONS.some(pattern => 
      pattern.test(content)
    );
    
    // Must not contain explicit sexual language
    const explicitSexual = /\b(sexy|hot|aroused|pleasure|climax)\b/i.test(content);
    
    return hasEducationalContext && !explicitSexual;
  }

  /**
   * Sanitize content by removing harmful parts
   */
  static sanitizeContent(content: string): string {
    let sanitized = content;
    
    // Remove URLs that might contain harmful content
    sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, '[URL_REMOVED]');
    
    // Remove email addresses
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REMOVED]');
    
    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REMOVED]');
    
    return sanitized.trim();
  }

  /**
   * Get content safety score (0-100, higher is safer)
   */
  static getSafetyScore(content: string): number {
    const normalizedContent = content.toLowerCase();
    let score = 100;
    
    // Deduct points for each harmful pattern match
    for (const pattern of this.HARMFUL_PATTERNS) {
      if (pattern.test(normalizedContent)) {
        score -= 20;
      }
    }
    
    // Add points for educational indicators
    if (this.BIOLOGY_EXCEPTIONS.some(pattern => pattern.test(normalizedContent))) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}