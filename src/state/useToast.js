import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_VISIBLE_MS = 3000;

export function useToast() {
  const [toastMessage, setToastMessage] = useState(null);
  const hideTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(hideTimerRef.current);
    setToastMessage(message);
    hideTimerRef.current = setTimeout(() => setToastMessage(null), TOAST_VISIBLE_MS);
  }, []);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  return { toastMessage, showToast };
}
