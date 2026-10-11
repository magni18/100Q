export const MAX_QUESTION_COUNT = 1000;
export const MAX_QUESTION_LENGTH = 300;

function extractQuestionList(candidate) {
  if (Array.isArray(candidate)) {
    return candidate;
  }
  const isObjectWithList = candidate !== null && typeof candidate === 'object' && Array.isArray(candidate.questions);
  return isObjectWithList ? candidate.questions : null;
}

function findEntryProblem(entry, position) {
  if (typeof entry !== 'string') {
    return `Question ${position} is not text`;
  }
  const trimmed = entry.trim();
  if (trimmed.length === 0) {
    return `Question ${position} is empty`;
  }
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return `Question ${position} is longer than ${MAX_QUESTION_LENGTH} characters`;
  }
  return null;
}

export function validateQuestions(candidate) {
  const questionList = extractQuestionList(candidate);
  if (questionList === null) {
    return { ok: false, reason: 'Expected a list of questions' };
  }
  if (questionList.length === 0) {
    return { ok: false, reason: 'No questions found' };
  }
  if (questionList.length > MAX_QUESTION_COUNT) {
    return { ok: false, reason: `Too many questions (max ${MAX_QUESTION_COUNT})` };
  }
  for (let index = 0; index < questionList.length; index += 1) {
    const problem = findEntryProblem(questionList[index], index + 1);
    if (problem) {
      return { ok: false, reason: problem };
    }
  }
  return { ok: true, questions: questionList.map((entry) => entry.trim()) };
}
