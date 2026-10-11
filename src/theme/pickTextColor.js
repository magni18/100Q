const LIGHT_TEXT_HEX = '#FFFFFF';
const DARK_TEXT_HEX = '#111111';

function hexToChannels(hex) {
  const digits = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(digits.slice(offset, offset + 2), 16));
}

function channelToLinear(channelValue) {
  const normalized = channelValue / 255;
  if (normalized <= 0.03928) {
    return normalized / 12.92;
  }
  return ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const [red, green, blue] = hexToChannels(hex).map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(hexA, hexB) {
  const luminanceA = relativeLuminance(hexA);
  const luminanceB = relativeLuminance(hexB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function pickTextColor(backgroundHex) {
  const lightContrast = contrastRatio(backgroundHex, LIGHT_TEXT_HEX);
  const darkContrast = contrastRatio(backgroundHex, DARK_TEXT_HEX);
  return lightContrast >= darkContrast ? LIGHT_TEXT_HEX : DARK_TEXT_HEX;
}
