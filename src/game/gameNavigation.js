export function stepForward(currentIndex, cardCount, isTransitioning = false) {
  if (isTransitioning) {
    return { type: 'ignore' };
  }
  const isOnLastCard = currentIndex >= cardCount - 1;
  return isOnLastCard ? { type: 'finish' } : { type: 'move', index: currentIndex + 1 };
}

export function stepBackward(currentIndex, isTransitioning = false) {
  if (isTransitioning) {
    return { type: 'ignore' };
  }
  const isOnFirstCard = currentIndex <= 0;
  return isOnFirstCard ? { type: 'stay' } : { type: 'move', index: currentIndex - 1 };
}

export function countQuestionCards(cards) {
  return cards.filter((card) => card.kind === 'question').length;
}
