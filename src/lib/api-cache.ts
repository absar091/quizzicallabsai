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
