'use client';

import { useCallback, useEffect, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

interface UseEditorCacheOptions {
  key: string;
  version?: string;
  ttl?: number; // Time to live in milliseconds
}

interface UseEditorCacheReturn<T> {
  data: T | null;
  setData: (data: T) => void;
  clearCache: () => void;
  isStale: boolean;
  lastUpdated: Date | null;
}

const CACHE_PREFIX = 'folio-editor-cache-';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function useEditorCache<T>(
  options: UseEditorCacheOptions
): UseEditorCacheReturn<T> {
  const { key, version = '1.0.0', ttl = DEFAULT_TTL } = options;
  const cacheKey = `${CACHE_PREFIX}${key}`;
  
  const [data, setDataState] = useState<T | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Load from cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is expired
        if (now - entry.timestamp > ttl) {
          localStorage.removeItem(cacheKey);
          setIsStale(true);
          return;
        }
        
        // Check version compatibility
        if (entry.version !== version) {
          localStorage.removeItem(cacheKey);
          setIsStale(true);
          return;
        }
        
        setDataState(entry.data);
        setLastUpdated(new Date(entry.timestamp));
        setIsStale(false);
      }
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      localStorage.removeItem(cacheKey);
    }
  }, [cacheKey, version, ttl]);

  const setData = useCallback((newData: T) => {
    try {
      const entry: CacheEntry<T> = {
        data: newData,
        timestamp: Date.now(),
        version
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(entry));
      setDataState(newData);
      setLastUpdated(new Date());
      setIsStale(false);
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }, [cacheKey, version]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
      setDataState(null);
      setLastUpdated(null);
      setIsStale(false);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }, [cacheKey]);

  return {
    data,
    setData,
    clearCache,
    isStale,
    lastUpdated
  };
}

// Utility function to clear all editor cache
export function clearAllEditorCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all cache:', error);
  }
}

// Utility function to get cache size
export function getCacheSize(): number {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(CACHE_PREFIX))
      .reduce((size, key) => {
        const value = localStorage.getItem(key);
        return size + (value ? value.length : 0);
      }, 0);
  } catch (error) {
    console.warn('Failed to get cache size:', error);
    return 0;
  }
}
