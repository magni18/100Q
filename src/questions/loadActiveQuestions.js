import { readUploadedQuestions } from '../storage/questionStore';
import { DEFAULT_QUESTIONS } from './defaultQuestions';

export async function loadActiveQuestions() {
  const uploadedQuestions = await readUploadedQuestions();
  if (uploadedQuestions) {
    return { questions: uploadedQuestions, source: 'uploaded' };
  }
  return { questions: DEFAULT_QUESTIONS, source: 'default' };
}
