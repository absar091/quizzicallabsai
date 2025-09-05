// API Key Rotation System for Google AI
// Cycles through multiple API keys to prevent overloading

class ApiKeyManager {
  private static instance: ApiKeyManager;
  private apiKeys: string[];
  private currentKeyIndex: number = 0;
  private usageCount: number = 0;
  private readonly maxUsagePerKey: number = 50; // Rotate after 50 requests per key

  private constructor() {
    // Initialize with API keys from environment variables
    this.apiKeys = this.loadApiKeysFromEnv();

    // Load saved state from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      this.loadState();
    }
  }

  private loadApiKeysFromEnv(): string[] {
    const keys: string[] = [];

    // Load all GEMINI_API_KEY_# environment variables
    for (let i = 1; i <= 10; i++) { // Support up to 10 keys
      const envKey = process.env[`GEMINI_API_KEY_${i}`];
      if (envKey && envKey.trim() && !envKey.includes('Dummy')) {
        keys.push(envKey.trim());
      }
    }

    // Fallback to single GEMINI_API_KEY if no numbered keys found
    if (keys.length === 0) {
      const singleKey = process.env.GEMINI_API_KEY;
      if (singleKey && singleKey.trim() && !singleKey.includes('Dummy')) {
        keys.push(singleKey.trim());
      }
    }

    if (keys.length === 0) {
      console.warn('⚠️ No valid Gemini API keys found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
      // Don't provide demo key - let it fail gracefully
      return [];
    }

    console.log(`🔑 Loaded ${keys.length} API keys from environment`);
    return keys;
  }

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('apiKeyState');
      if (saved) {
        const state = JSON.parse(saved);
        this.currentKeyIndex = state.currentKeyIndex || 0;
        this.usageCount = state.usageCount || 0;
      }
    } catch (error) {
      console.warn('Failed to load API key state:', error);
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;

    try {
      const state = {
        currentKeyIndex: this.currentKeyIndex,
        usageCount: this.usageCount,
        lastUpdated: Date.now()
      };
      localStorage.setItem('apiKeyState', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save API key state:', error);
    }
  }

  getCurrentKey(): string {
    return this.apiKeys[this.currentKeyIndex];
  }

  getNextKey(): string {
    // Increment usage count
    this.usageCount++;

    // Check if we need to rotate to next key
    if (this.usageCount >= this.maxUsagePerKey) {
      this.rotateToNextKey();
    }

    this.saveState();
    return this.getCurrentKey();
  }

  private rotateToNextKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    this.usageCount = 0;

    console.log(`🔄 Rotated to API Key ${this.currentKeyIndex + 1}/${this.apiKeys.length}`);
    this.saveState();
  }

  // Force rotate to next key (useful for manual rotation or error handling)
  forceRotate(): string {
    this.rotateToNextKey();
    return this.getCurrentKey();
  }

  // Get current status
  getStatus() {
    return {
      currentKeyIndex: this.currentKeyIndex + 1,
      totalKeys: this.apiKeys.length,
      usageCount: this.usageCount,
      maxUsagePerKey: this.maxUsagePerKey,
      currentKey: this.getCurrentKey().substring(0, 20) + '...' // Mask for security
    };
  }

  // Reset usage count for current key
  resetUsageCount() {
    this.usageCount = 0;
    this.saveState();
  }

  // Handle API errors - rotate to next key
  handleApiError() {
    console.warn(`⚠️ API Error detected, rotating to next key`);
    this.forceRotate();
  }
}

// Export singleton instance
export const apiKeyManager = ApiKeyManager.getInstance();

// Utility functions for easy access
export const getCurrentApiKey = () => apiKeyManager.getCurrentKey();
export const getNextApiKey = () => apiKeyManager.getNextKey();
export const rotateApiKey = () => apiKeyManager.forceRotate();
export const getApiKeyStatus = () => apiKeyManager.getStatus();
export const handleApiKeyError = () => apiKeyManager.handleApiError();
