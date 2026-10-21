const TV_SCREEN_WIDTH = 960;
const TV_HORIZONTAL_PADDING = 120;
const TV_QUESTION_FONT_SIZE = 64;
const TV_CHEERS_FONT_SIZE = 120;
const SMALLEST_FONT_SCALE = 0.5;

export function cardLayoutForWidth(screenWidth) {
  const sizeScale = Math.min(1, screenWidth / TV_SCREEN_WIDTH);
  const paddingScale = sizeScale * sizeScale;
  const fontScale = Math.max(SMALLEST_FONT_SCALE, sizeScale);
  return {
    horizontalPadding: Math.round(TV_HORIZONTAL_PADDING * paddingScale),
    questionFontSize: Math.round(TV_QUESTION_FONT_SIZE * fontScale),
    cheersFontSize: Math.round(TV_CHEERS_FONT_SIZE * fontScale),
  };
}
