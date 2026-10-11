import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateQuestions } from '../src/questions/validateQuestions';
import { DEFAULT_QUESTIONS } from '../src/questions/defaultQuestions';
import { loadActiveQuestions } from '../src/questions/loadActiveQuestions';
import { saveUploadedQuestions } from '../src/storage/questionStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
});

test('accepts a plain list or an object with questions, trimmed', () => {
  expect(validateQuestions([' One ', 'Two'])).toEqual({ ok: true, questions: ['One', 'Two'] });
  expect(validateQuestions({ questions: ['One'] })).toEqual({ ok: true, questions: ['One'] });
});

test('rejects bad uploads with a reason', () => {
  expect(validateQuestions('text').reason).toBe('Expected a list of questions');
  expect(validateQuestions([]).reason).toBe('No questions found');
  expect(validateQuestions(['Ok', 5]).reason).toBe('Question 2 is not text');
  expect(validateQuestions(['Ok', null]).reason).toBe('Question 2 is not text');
  expect(validateQuestions(['x'.repeat(301)]).reason).toBe('Question 1 is longer than 300 characters');
});

test('bundled set has 100 valid questions', () => {
  expect(DEFAULT_QUESTIONS).toHaveLength(100);
  expect(validateQuestions(DEFAULT_QUESTIONS).ok).toBe(true);
});

test('uses uploaded set when saved, defaults otherwise', async () => {
  expect((await loadActiveQuestions()).source).toBe('default');
  await saveUploadedQuestions(['Mine']);
  expect(await loadActiveQuestions()).toEqual({ questions: ['Mine'], source: 'uploaded' });
});

test('corrupt saved data falls back to defaults', async () => {
  await AsyncStorage.setItem('uploadedQuestions', '{not json');
  expect((await loadActiveQuestions()).source).toBe('default');
});
