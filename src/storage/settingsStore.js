import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_BACKGROUND_HEX, isKnownSwatch } from '../theme/palette';

const BACKGROUND_HEX_KEY = 'backgroundHex';

export async function readBackgroundHex() {
  try {
    const storedHex = await AsyncStorage.getItem(BACKGROUND_HEX_KEY);
    return isKnownSwatch(storedHex) ? storedHex : DEFAULT_BACKGROUND_HEX;
  } catch {
    return DEFAULT_BACKGROUND_HEX;
  }
}

export async function saveBackgroundHex(hex) {
  await AsyncStorage.setItem(BACKGROUND_HEX_KEY, hex);
}
