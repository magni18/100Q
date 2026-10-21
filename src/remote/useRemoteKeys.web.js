import { useEffect, useRef } from 'react';

const ACTION_BY_KEY = {
  ArrowRight: 'next',
  ArrowLeft: 'previous',
  Escape: 'back',
  Backspace: 'back',
};

function isTypingInField(keyEvent) {
  const tagName = keyEvent.target?.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA';
}

export function useRemoteKeys({ onNext, onPrevious, onBack }) {
  const handlersRef = useRef({ onNext, onPrevious, onBack });
  handlersRef.current = { onNext, onPrevious, onBack };

  useEffect(() => {
    function runActionForKey(keyEvent) {
      const action = ACTION_BY_KEY[keyEvent.key];
      if (!action || isTypingInField(keyEvent)) {
        return;
      }
      const handlerByAction = {
        next: handlersRef.current.onNext,
        previous: handlersRef.current.onPrevious,
        back: handlersRef.current.onBack,
      };
      const handler = handlerByAction[action];
      if (handler) {
        keyEvent.preventDefault();
        handler();
      }
    }
    window.addEventListener('keydown', runActionForKey);
    return () => window.removeEventListener('keydown', runActionForKey);
  }, []);
}
