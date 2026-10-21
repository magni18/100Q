import { useCallback, useRef } from 'react';
import { parseUploadedQuestionsText } from '../questions/parseUploadedQuestionsText';

export function useUploadServer(onQuestionsReceived) {
  const questionsCallbackRef = useRef(onQuestionsReceived);
  questionsCallbackRef.current = onQuestionsReceived;

  const submitQuestionsText = useCallback(async (questionsText) => {
    const parsed = parseUploadedQuestionsText(questionsText);
    if (!parsed.ok) {
      return parsed.reason;
    }
    try {
      await questionsCallbackRef.current(parsed.questions);
    } catch {
      return 'Could not save questions';
    }
    return `Loaded ${parsed.questions.length} questions`;
  }, []);

  return { status: 'browser', submitQuestionsText };
}
