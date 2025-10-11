import { useEffect, useState } from 'react';

/**
 * Hook to access the OpenAI Apps SDK global API
 * Provides access to window.openai for tool calls, state, and messaging
 */
export function useOpenAiGlobal() {
  const [openai, setOpenai] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).openai) {
      setOpenai((window as any).openai);
    }
  }, []);

  return openai;
}
