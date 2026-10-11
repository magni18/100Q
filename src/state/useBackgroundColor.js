import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_BACKGROUND_HEX } from '../theme/palette';
import { readBackgroundHex, saveBackgroundHex } from '../storage/settingsStore';

export function useBackgroundColor() {
  const [backgroundHex, setBackgroundHex] = useState(DEFAULT_BACKGROUND_HEX);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    readBackgroundHex().then((storedHex) => {
      if (isMounted) {
        setBackgroundHex(storedHex);
        setIsLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const chooseBackgroundHex = useCallback((hex) => {
    setBackgroundHex(hex);
    saveBackgroundHex(hex).catch(() => {});
  }, []);

  return { backgroundHex, isLoaded, chooseBackgroundHex };
}
