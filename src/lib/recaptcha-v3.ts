// reCAPTCHA v3 Service for Advanced Bot Protection
// Invisible, score-based protection that works seamlessly with Whop

export interface RecaptchaV3Config {
  siteKey: string;
  secretKey: string;
  minimumScore: number; // 0.0 to 1.0 (higher = more human-like)
}

export interface RecaptchaV3Response {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

class RecaptchaV3Service {
  private config: RecaptchaV3Config;

  constructor() {
    this.config = {
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || '',
      secretKey: process.env.RECAPTCHA_V3_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY || '',
      minimumScore: 0.5 // Default threshold (0.5 = balanced, 0.7 = strict, 0.3 = lenient)
    };
  }

  /**
   * Execute reCAPTCHA v3 challenge (client-side)
   */
  async executeRecaptcha(action: string = 'submit'): Promise<string | null> {
    try {
      if (typeof window === 'undefined') {
        console.warn('reCAPTCHA v3: Cannot execute on server-side');
        return null;
      }

      // Check if we're in Whop iframe - bypass if so
      if (this.isInWhopEnvironment()) {
        console.log('🔒 reCAPTCHA v3: Bypassing for Whop integration');
        return 'whop-bypass-token';
      }

      // Wait for grecaptcha to be ready
      await this.waitForRecaptcha();

      // Execute reCAPTCHA v3
      const token = await (window as any).grecaptcha.execute(this.config.siteKey, { action });
      
      console.log('✅ reCAPTCHA v3: Token generated successfully');
      return token;

    } catch (error) {
      console.error('❌ reCAPTCHA v3: Execution failed:', error);
      return null;
    }
  }

  /**
   * Verify reCAPTCHA v3 token (server-side)
   */
  async verifyToken(token: string, expectedAction?: string): Promise<{
    success: boolean;
    score: number;
    isHuman: boolean;
    error?: string;
  }> {
    try {
      // Bypass verification for Whop tokens
      if (token === 'whop-bypass-token') {
        return {
          success: true,
          score: 0.9, // High score for Whop users
          isHuman: true
        };
      }

      if (!this.config.secretKey) {
        throw new Error('reCAPTCHA v3 secret key not configured');
      }

      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: this.config.secretKey,
          response: token,
        }),
      });

      const data: RecaptchaV3Response = await response.json();

      if (!data.success) {
        return {
          success: false,
          score: 0,
          isHuman: false,
          error: data['error-codes']?.join(', ') || 'Verification failed'
        };
      }

      // Check action if specified
      if (expectedAction && data.action !== expectedAction) {
        return {
          success: false,
          score: data.score,
          isHuman: false,
          error: `Action mismatch: expected ${expectedAction}, got ${data.action}`
        };
      }

      const isHuman = data.score >= this.config.minimumScore;

      console.log(`🔍 reCAPTCHA v3: Score ${data.score} (${isHuman ? 'HUMAN' : 'BOT'})`);

      return {
        success: true,
        score: data.score,
        isHuman
      };

    } catch (error: any) {
      console.error('❌ reCAPTCHA v3: Verification error:', error);
      return {
        success: false,
        score: 0,
        isHuman: false,
        error: error.message
      };
    }
  }

  /**
   * Check if running in Whop environment
   */
  private isInWhopEnvironment(): boolean {
    if (typeof window === 'undefined') return false;

    return (
      window.location.hostname.includes('whop.com') ||
      window.parent !== window || // Inside iframe
      document.referrer.includes('whop.com') ||
      window.location.search.includes('whop=true')
    );
  }

  /**
   * Wait for grecaptcha to be ready
   */
  private waitForRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('reCAPTCHA v3: Timeout waiting for grecaptcha'));
      }, 10000);

      const checkRecaptcha = () => {
        if ((window as any).grecaptcha && (window as any).grecaptcha.execute) {
          clearTimeout(timeout);
          resolve();
        } else {
          setTimeout(checkRecaptcha, 100);
        }
      };

      checkRecaptcha();
    });
  }

  /**
   * Load reCAPTCHA v3 script
   */
  loadRecaptchaScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // Skip loading in Whop environment
      if (this.isInWhopEnvironment()) {
        console.log('🔒 reCAPTCHA v3: Skipping script load for Whop');
        resolve();
        return;
      }

      // Check if already loaded
      if ((window as any).grecaptcha) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.config.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ reCAPTCHA v3: Script loaded successfully');
        resolve();
      };

      script.onerror = () => {
        console.error('❌ reCAPTCHA v3: Script failed to load');
        reject(new Error('Failed to load reCAPTCHA v3 script'));
      };

      document.head.appendChild(script);
    });
  }
}

// Export singleton instance
export const recaptchaV3Service = new RecaptchaV3Service();

// Helper functions
export const executeRecaptcha = (action: string = 'submit') => 
  recaptchaV3Service.executeRecaptcha(action);

export const verifyRecaptchaToken = (token: string, expectedAction?: string) => 
  recaptchaV3Service.verifyToken(token, expectedAction);

export const loadRecaptchaScript = () => 
  recaptchaV3Service.loadRecaptchaScript();