// hooks/usePreventDuplicate.js
import { useRef, useCallback } from 'react';

export const usePreventDuplicate = () => {
  const isRunning = useRef(false);

  const executeOnce = useCallback((asyncFunction) => {
    return async (...args) => {
      if (isRunning.current) return;
      
      isRunning.current = true;
      try {
        const result = await asyncFunction(...args);
        return result;
      } finally {
        // Timeout pequeno para garantir que não há conflitos
        setTimeout(() => {
          isRunning.current = false;
        }, 500);
      }
    };
  }, []);

  return { executeOnce };
};