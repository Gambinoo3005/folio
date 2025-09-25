'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface UsePerformanceMonitorReturn {
  startTimer: (name: string, metadata?: Record<string, any>) => void;
  endTimer: (name: string) => number | null;
  getMetrics: () => PerformanceMetric[];
  clearMetrics: () => void;
  getAverageTime: (name: string) => number;
  isSlowOperation: (name: string, threshold?: number) => boolean;
}

export function usePerformanceMonitor(): UsePerformanceMonitorReturn {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const activeTimers = useRef<Map<string, PerformanceMetric>>(new Map());

  const startTimer = useCallback((name: string, metadata?: Record<string, any>) => {
    const timer: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    
    activeTimers.current.set(name, timer);
  }, []);

  const endTimer = useCallback((name: string): number | null => {
    const timer = activeTimers.current.get(name);
    if (!timer) {
      console.warn(`Timer "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    const completedTimer: PerformanceMetric = {
      ...timer,
      endTime,
      duration
    };

    setMetrics(prev => [...prev, completedTimer]);
    activeTimers.current.delete(name);
    
    return duration;
  }, []);

  const getMetrics = useCallback(() => {
    return [...metrics];
  }, [metrics]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
    activeTimers.current.clear();
  }, []);

  const getAverageTime = useCallback((name: string): number => {
    const namedMetrics = metrics.filter(m => m.name === name && m.duration);
    if (namedMetrics.length === 0) return 0;
    
    const total = namedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / namedMetrics.length;
  }, [metrics]);

  const isSlowOperation = useCallback((name: string, threshold: number = 1000): boolean => {
    const averageTime = getAverageTime(name);
    return averageTime > threshold;
  }, [getAverageTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeTimers.current.clear();
    };
  }, []);

  return {
    startTimer,
    endTimer,
    getMetrics,
    clearMetrics,
    getAverageTime,
    isSlowOperation
  };
}

// Hook for monitoring component render performance
export function useRenderPerformance(componentName: string) {
  const { startTimer, endTimer } = usePerformanceMonitor();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    startTimer(`${componentName}-render-${renderCount.current}`);
    
    return () => {
      endTimer(`${componentName}-render-${renderCount.current}`);
    };
  });
}

// Hook for monitoring async operations
export function useAsyncPerformance() {
  const { startTimer, endTimer, getAverageTime, isSlowOperation } = usePerformanceMonitor();

  const monitorAsync = useCallback(async <T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    startTimer(name, metadata);
    try {
      const result = await operation();
      endTimer(name);
      return result;
    } catch (error) {
      endTimer(name);
      throw error;
    }
  }, [startTimer, endTimer]);

  return {
    monitorAsync,
    getAverageTime,
    isSlowOperation
  };
}
