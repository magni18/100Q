import { shuffle } from '../src/game/shuffle';
import { buildCardSequence } from '../src/game/buildCardSequence';
import { stepBackward, stepForward } from '../src/game/gameNavigation';

function makeQuestions(count) {
  return Array.from({ length: count }, (unused, index) => `Q${index + 1}`);
}

function cheersPositions(cards) {
  return cards.flatMap((card, index) => (card.kind === 'cheers' ? [index] : []));
}

test('shuffle keeps every item and does not mutate input', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];
  expect([...shuffle(items)].sort()).toEqual(items);
  expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
});

test('cheers after every 10th question, numbering continues', () => {
  const cards = buildCardSequence(makeQuestions(25));
  expect(cheersPositions(cards)).toEqual([10, 21]);
  expect(cards[11]).toEqual({ kind: 'question', text: 'Q11', questionNumber: 11 });
});

test('no cheers after the last question or in short games', () => {
  expect(cheersPositions(buildCardSequence(makeQuestions(20)))).toEqual([10]);
  expect(cheersPositions(buildCardSequence(makeQuestions(10)))).toEqual([]);
  expect(cheersPositions(buildCardSequence(makeQuestions(7)))).toEqual([]);
});

test('presses during a running transition are ignored, so the last question cannot be skipped', () => {
  expect(stepForward(2, 3, true)).toEqual({ type: 'ignore' });
  expect(stepBackward(2, true)).toEqual({ type: 'ignore' });
});

test('navigation finishes at the end and stays at the start', () => {
  expect(stepForward(0, 3)).toEqual({ type: 'move', index: 1 });
  expect(stepForward(2, 3)).toEqual({ type: 'finish' });
  expect(stepBackward(0)).toEqual({ type: 'stay' });
  expect(stepBackward(2)).toEqual({ type: 'move', index: 1 });
});
