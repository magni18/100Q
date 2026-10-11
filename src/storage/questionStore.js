import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateQuestions } from '../questions/validateQuestions';

const UPLOADED_QUESTIONS_KEY = 'uploadedQuestions';

export async function readUploadedQuestions() {
  try {
    const storedText = await AsyncStorage.getItem(UPLOADED_QUESTIONS_KEY);
    if (storedText === null) {
      return null;
    }
    const validation = validateQuestions(JSON.parse(storedText));
    return validation.ok ? validation.questions : null;
  } catch {
    return null;
  }
}

export async function saveUploadedQuestions(questions) {
  await AsyncStorage.setItem(UPLOADED_QUESTIONS_KEY, JSON.stringify(questions));
}

export async function clearUploadedQuestions() {
  await AsyncStorage.removeItem(UPLOADED_QUESTIONS_KEY);
}
