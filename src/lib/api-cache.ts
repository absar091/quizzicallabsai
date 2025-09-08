// API Caching utilities for better performance

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private readonly MAX_AGE = 5 * 60 * 1000; // 5 minutes default

  // Check if cached data is still valid
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  // Generate cache key from request details
  private generateKey(method: string, url: string, body?: any): string {
    const bodyStr = body ? JSON.stringify(body) : '';
    return `${method}:${url}:${bodyStr}`;
  }

  // Store data in cache
  set(method: string, url: string, data: any, maxAge = this.MAX_AGE, body?: any): void {
    const key = this.generateKey(method, url, body);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + maxAge,
    };
    this.cache.set(key, entry);

    // Auto-cleanup old entries
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  // Retrieve cached data
  get(method: string, url: string, body?: any): any | null {
    const key = this.generateKey(method, url, body);
    const entry = this.cache.get(key);

    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Check if data exists in cache
  has(method: string, url: string, body?: any): boolean {
    const key = this.generateKey(method, url, body);
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const apiCache = new ApiCache();

// Enhanced fetch with caching
export async function cachedFetch(
  url: string,
  options: RequestInit = {},
  cacheTime = 5 * 60 * 1000 // 5 minutes
): Promise<Response> {
  const method = options.method || 'GET';

  // Only cache GET requests
  if (method === 'GET' && apiCache.has(method, url)) {
    const cachedData = apiCache.get(method, url);
    if (cachedData) {
      // Return cached response
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
      });
    }
  }

  // Fetch from network
  const response = await fetch(url, options);

  // Cache successful GET responses
  if (method === 'GET' && response.ok) {
    try {
      const data = await response.clone().json();
      apiCache.set(method, url, data, cacheTime);
    } catch (e) {
      // If response isn't JSON, don't cache it
    }
  }

  return response;
}

// Request deduplication - prevent multiple identical requests
const pendingRequests = new Map<string, Promise<any>>();

export async function deduplicatedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(JSON.parse(options.body as string)) : '';
  const key = `${method}:${url}:${body}`;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .finally(() => {
      // Remove from pending requests after completion
      setTimeout(() => pendingRequests.delete(key), 100);
    });

  pendingRequests.set(key, promise);
  return promise;
}

// Clear cache periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (apiCache.size() > 50) {
      console.log('Clearing API cache to prevent memory issues');
      apiCache.clear();
    }
  }, 10 * 60 * 1000); // Every 10 minutes
}
