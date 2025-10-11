import { useState, useEffect } from 'react';
import { useOpenAiGlobal } from './useOpenAiGlobal';

/**
 * Hook for managing widget state with OpenAI Apps SDK
 * Provides persistent state management under 4k token limit
 *
 * @param initialState - Initial state object
 * @returns [state, setState] tuple similar to useState
 */
export function useWidgetState<T>(initialState: T) {
  const openai = useOpenAiGlobal();
  const [state, setStateInternal] = useState<T>(initialState);

  // Load persisted state on mount
  useEffect(() => {
    if (openai?.widgetState) {
      const savedState = openai.widgetState.get();
      if (savedState && Object.keys(savedState).length > 0) {
        setStateInternal({ ...initialState, ...savedState });
      }
    }
  }, [openai]);

  // Persist state on change
  const setState = (updates: Partial<T> | ((prev: T) => Partial<T>)) => {
    setStateInternal(prev => {
      const updatesToApply = typeof updates === 'function' ? updates(prev) : updates;
      const newState = { ...prev, ...updatesToApply };

      // Persist to OpenAI widget state
      if (openai?.widgetState) {
        openai.widgetState.set(newState);
      }

      return newState;
    });
  };

  return [state, setState] as const;
}
