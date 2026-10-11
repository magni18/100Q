import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const TRANSITION_DURATION_MS = 250;
export const SLIDE_DISTANCE = 120;
export const SHRUNK_SCALE = 0.85;

function buildIncomingStyle(progress) {
  return {
    opacity: progress,
    transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [SHRUNK_SCALE, 1] }) }],
  };
}

function buildOutgoingStyle(progress, direction) {
  return {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, direction * SLIDE_DISTANCE] }) },
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, SHRUNK_SCALE] }) },
    ],
  };
}

export function useCardTransition(initialCard) {
  const progress = useRef(new Animated.Value(1)).current;
  const isAnimatingRef = useRef(false);
  const [cardState, setCardState] = useState({ currentCard: initialCard, outgoingCard: null, direction: 1 });

  const showCard = useCallback((nextCard, direction) => {
    if (isAnimatingRef.current) {
      return false;
    }
    isAnimatingRef.current = true;
    progress.setValue(0);
    setCardState((previous) => ({ currentCard: nextCard, outgoingCard: previous.currentCard, direction }));
    Animated.timing(progress, {
      toValue: 1,
      duration: TRANSITION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      isAnimatingRef.current = false;
      setCardState((previous) => ({ ...previous, outgoingCard: null }));
    });
    return true;
  }, [progress]);

  const incomingStyle = useMemo(() => buildIncomingStyle(progress), [progress]);
  const outgoingStyle = useMemo(() => buildOutgoingStyle(progress, cardState.direction), [progress, cardState.direction]);

  const isAnimating = useCallback(() => isAnimatingRef.current, []);

  return { ...cardState, incomingStyle, outgoingStyle, showCard, isAnimating };
}
