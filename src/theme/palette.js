export const SWATCHES = [
  { name: 'Dark gray', hex: '#2B2B2B' },
  { name: 'Charcoal', hex: '#121212' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Teal', hex: '#0F5257' },
  { name: 'Forest', hex: '#1E4D2B' },
  { name: 'Wine', hex: '#5A1A2B' },
  { name: 'Purple', hex: '#3D2463' },
  { name: 'Burnt orange', hex: '#B5521B' },
  { name: 'Mustard', hex: '#D4A62A' },
  { name: 'Cream', hex: '#F2EAD3' },
];

export const DEFAULT_BACKGROUND_HEX = SWATCHES[0].hex;

export function isKnownSwatch(hex) {
  return SWATCHES.some((swatch) => swatch.hex === hex);
}
