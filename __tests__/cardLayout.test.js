import { cardLayoutForWidth } from '../src/game/cardLayout';

test('TV width keeps the original sizes, phone width shrinks padding and text', () => {
  expect(cardLayoutForWidth(960)).toEqual({ horizontalPadding: 120, questionFontSize: 64, cheersFontSize: 120 });
  const phoneLayout = cardLayoutForWidth(375);
  expect(phoneLayout.horizontalPadding).toBeLessThanOrEqual(24);
  expect(phoneLayout.questionFontSize).toBeLessThanOrEqual(34);
  expect(phoneLayout.cheersFontSize).toBeLessThanOrEqual(80);
});
