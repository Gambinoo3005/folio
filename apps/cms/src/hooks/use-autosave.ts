'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAutosaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

interface UseAutosaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  save: () => Promise<void>;
  markAsChanged: () => void;
  markAsSaved: () => void;
}

export function useAutosave<T>(
  data: T,
  options: UseAutosaveOptions
): UseAutosaveReturn {
  const { delay = 5000, onSave, onError, onSuccess } = options;
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef<T>(data);
  const isInitialMount = useRef(true);

  // Mark data as changed when it differs from last saved version
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastDataRef.current = data;
      return;
    }

    if (JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
      setHasUnsavedChanges(true);
      lastDataRef.current = data;
    }
  }, [data]);

  // Autosave when data changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      await save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, hasUnsavedChanges, delay]);

  const save = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, onSave, onSuccess, onError]);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    save,
    markAsChanged,
    markAsSaved
  };
}
