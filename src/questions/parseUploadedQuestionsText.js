import { validateQuestions } from './validateQuestions';

export function parseUploadedQuestionsText(questionsText) {
  let parsedQuestions;
  try {
    parsedQuestions = JSON.parse(questionsText);
  } catch {
    return { ok: false, reason: 'That is not valid JSON' };
  }
  return validateQuestions(parsedQuestions);
}
