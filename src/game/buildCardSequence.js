export const QUESTIONS_BETWEEN_CHEERS = 10;
export const CHEERS_TEXT = 'Cheers!';

export function buildCardSequence(questions) {
  const cards = [];
  questions.forEach((text, index) => {
    const questionNumber = index + 1;
    cards.push({ kind: 'question', text, questionNumber });
    const isCheersPoint = questionNumber % QUESTIONS_BETWEEN_CHEERS === 0;
    const isLastQuestion = questionNumber === questions.length;
    if (isCheersPoint && !isLastQuestion) {
      cards.push({ kind: 'cheers' });
    }
  });
  return cards;
}
