import { parseUploadedQuestionsText } from '../src/questions/parseUploadedQuestionsText';

test('accepts a JSON list and rejects text that is not JSON or not questions', () => {
  expect(parseUploadedQuestionsText('[" One ", "Two"]')).toEqual({ ok: true, questions: ['One', 'Two'] });
  expect(parseUploadedQuestionsText('{oops')).toEqual({ ok: false, reason: 'That is not valid JSON' });
  expect(parseUploadedQuestionsText('["A", 7]')).toEqual({ ok: false, reason: 'Question 2 is not text' });
});
