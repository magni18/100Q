import { pickTextColor } from './pickTextColor';

export function createTheme(backgroundHex) {
  return {
    backgroundHex,
    textColor: pickTextColor(backgroundHex),
  };
}
