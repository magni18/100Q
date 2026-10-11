import { useEffect, useRef } from 'react';
import { BackHandler, useTVEventHandler } from 'react-native';
import { remoteActionForEvent } from './remoteKeyAction';

export function useRemoteKeys({ onNext, onPrevious, onBack }) {
  const handlersRef = useRef({ onNext, onPrevious, onBack });
  handlersRef.current = { onNext, onPrevious, onBack };

  useTVEventHandler((event) => {
    const action = remoteActionForEvent(event);
    if (action === 'next') {
      handlersRef.current.onNext?.();
    }
    if (action === 'previous') {
      handlersRef.current.onPrevious?.();
    }
  });

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!handlersRef.current.onBack) {
        return false;
      }
      handlersRef.current.onBack();
      return true;
    });
    return () => subscription.remove();
  }, []);
}
