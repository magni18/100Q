import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { startUploadServer } from './httpServer';
import { readNetworkAddress } from './readNetworkAddress';
import { createRouteHandler } from './routes';
import { createPinAttemptLimiter, generatePin } from './pin';
import { buildUploadPageHtml } from './uploadPage';
import { createUploadServerController } from './uploadServerController';

function buildRequestHandler(pin, questionsCallbackRef) {
  return createRouteHandler({
    expectedPin: pin,
    pinLimiter: createPinAttemptLimiter(),
    uploadPageHtml: buildUploadPageHtml(),
    onQuestionsReceived: (questions) => questionsCallbackRef.current(questions),
  });
}

export function useUploadServer(onQuestionsReceived) {
  const [pin] = useState(() => generatePin());
  const [serverState, setServerState] = useState({ status: 'starting' });
  const questionsCallbackRef = useRef(onQuestionsReceived);
  questionsCallbackRef.current = onQuestionsReceived;

  useEffect(() => {
    const controller = createUploadServerController({
      readNetworkAddress,
      startUploadServer,
      buildRequestHandler: () => buildRequestHandler(pin, questionsCallbackRef),
      onStateChange: setServerState,
    });
    controller.resume();
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        controller.resume();
      } else {
        controller.pause();
      }
    });
    return () => {
      appStateSubscription.remove();
      controller.pause();
    };
  }, [pin]);

  return { ...serverState, pin };
}
