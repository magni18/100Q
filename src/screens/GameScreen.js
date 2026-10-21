import { useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { QuestionCard } from '../components/QuestionCard';
import { cardLayoutForWidth } from '../game/cardLayout';
import { RemoteFocusHolder } from '../components/RemoteFocusHolder';
import { countQuestionCards, stepBackward, stepForward } from '../game/gameNavigation';
import { useRemoteKeys } from '../remote/useRemoteKeys';
import { useCardTransition } from '../transition/useCardTransition';

const DIRECTION_RIGHT = 1;
const DIRECTION_LEFT = -1;

export function GameScreen({ theme, cards, onFinished, onExit }) {
  const cardIndexRef = useRef(0);
  const hasFinishedRef = useRef(false);
  const totalQuestions = useMemo(() => countQuestionCards(cards), [cards]);
  const transition = useCardTransition(cards[0]);

  function moveTo(index, direction) {
    const didStart = transition.showCard(cards[index], direction);
    if (didStart) {
      cardIndexRef.current = index;
    }
  }

  function goForward() {
    const step = stepForward(cardIndexRef.current, cards.length, transition.isAnimating());
    if (step.type === 'finish' && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinished();
    }
    if (step.type === 'move') {
      moveTo(step.index, DIRECTION_RIGHT);
    }
  }

  function goBackward() {
    const step = stepBackward(cardIndexRef.current, transition.isAnimating());
    if (step.type === 'move') {
      moveTo(step.index, DIRECTION_LEFT);
    }
  }

  useRemoteKeys({ onNext: goForward, onPrevious: goBackward, onBack: onExit });

  const { currentCard, outgoingCard, incomingStyle, outgoingStyle } = transition;
  const isShowingQuestion = currentCard.kind === 'question';
  const { width } = useWindowDimensions();
  const cardLayout = cardLayoutForWidth(width);
  const cardPaddingStyle = { paddingHorizontal: cardLayout.horizontalPadding };

  return (
    <View style={styles.screen}>
      <RemoteFocusHolder onTapLeft={goBackward} onTapRight={goForward} />
      {outgoingCard && (
        <Animated.View style={[styles.cardLayer, cardPaddingStyle, outgoingStyle]}>
          <QuestionCard card={outgoingCard} theme={theme} cardLayout={cardLayout} />
        </Animated.View>
      )}
      <Animated.View style={[styles.cardLayer, cardPaddingStyle, incomingStyle]}>
        <QuestionCard card={currentCard} theme={theme} cardLayout={cardLayout} />
      </Animated.View>
      {isShowingQuestion && (
        <Text style={[styles.counter, { color: theme.textColor }]}>
          {currentCard.questionNumber} / {totalQuestions}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  cardLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  counter: { position: 'absolute', top: 27, right: 48, fontSize: 24, fontWeight: '600', opacity: 0.7 },
});
