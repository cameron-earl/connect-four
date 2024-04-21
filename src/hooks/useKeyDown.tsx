import { useEffect } from 'react';

export const useKeyDown = (callback: (key: string) => void, keys: string[]) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const wasAnyKeyPressed = keys.some((key) => event.key === key);
      if (wasAnyKeyPressed) {
        event.preventDefault();
        callback(event.key);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });
};
