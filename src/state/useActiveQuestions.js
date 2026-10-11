import { useCallback, useEffect, useState } from 'react';
import { loadActiveQuestions } from '../questions/loadActiveQuestions';
import { DEFAULT_QUESTIONS } from '../questions/defaultQuestions';
import { clearUploadedQuestions, saveUploadedQuestions } from '../storage/questionStore';

export function useActiveQuestions() {
  const [questionState, setQuestionState] = useState({ questions: [], source: 'default', isLoaded: false });

  useEffect(() => {
    let isMounted = true;
    loadActiveQuestions().then((loaded) => {
      if (isMounted) {
        setQuestionState({ ...loaded, isLoaded: true });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const replaceWithUploadedQuestions = useCallback(async (questions) => {
    await saveUploadedQuestions(questions);
    setQuestionState({ questions, source: 'uploaded', isLoaded: true });
  }, []);

  const restoreDefaultQuestions = useCallback(async () => {
    await clearUploadedQuestions();
    setQuestionState({ questions: DEFAULT_QUESTIONS, source: 'default', isLoaded: true });
  }, []);

  return { ...questionState, replaceWithUploadedQuestions, restoreDefaultQuestions };
}
