// Performance optimization utilities

import { useCallback, useMemo, useRef } from 'react';

// Memoization utilities
export const createMemoizedSelector = <T, R>(
  selector: (data: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) => {
  let lastInput: T;
  let lastResult: R;
  
  return (input: T): R => {
    if (input !== lastInput) {
      const newResult = selector(input);
      if (!equalityFn || !equalityFn(lastResult, newResult)) {
        lastResult = newResult;
      }
      lastInput = input;
    }
    return lastResult;
  };
};

// Debounced callback hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized value hook with custom equality
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const memoizedValue = useMemo(factory, deps);
  const lastValueRef = useRef<T>(memoizedValue);
  
  if (!equalityFn) {
    return memoizedValue;
  }
  
  if (!equalityFn(lastValueRef.current, memoizedValue)) {
    lastValueRef.current = memoizedValue;
  }
  
  return lastValueRef.current;
};

// Image optimization utilities
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  if (!url) return '';
  
  // If it's a local image, return as is
  if (url.startsWith('file://') || url.startsWith('data:')) {
    return url;
  }
  
  // For external URLs, you might want to use a service like Cloudinary
  // This is a placeholder implementation
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
};

// List optimization utilities
export const getItemLayout = (itemHeight: number) => (
  data: any,
  index: number
) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

export const keyExtractor = (item: any, index: number): string => {
  return item.id || item.key || index.toString();
};

// Memory management utilities
export const createWeakCache = <K extends object, V>(): {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  has: (key: K) => boolean;
  delete: (key: K) => boolean;
} => {
  const cache = new WeakMap<K, V>();
  
  return {
    get: (key: K) => cache.get(key),
    set: (key: K, value: V) => cache.set(key, value),
    has: (key: K) => cache.has(key),
    delete: (key: K) => cache.delete(key),
  };
};

// Bundle size optimization
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

// Network optimization
export const createRequestCache = <T>(ttl: number = 5 * 60 * 1000) => {
  const cache = new Map<string, { data: T; timestamp: number }>();
  
  return {
    get: (key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;
      
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        return null;
      }
      
      return entry.data;
    },
    set: (key: string, data: T): void => {
      cache.set(key, { data, timestamp: Date.now() });
    },
    clear: (): void => {
      cache.clear();
    },
    delete: (key: string): boolean => {
      return cache.delete(key);
    },
  };
};

// Animation performance
export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();
  
  const animate = useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  const start = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);
  
  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);
  
  return { start, stop };
};

// React import for lazy loading
import React from 'react';
