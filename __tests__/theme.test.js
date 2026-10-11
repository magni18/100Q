import { pickTextColor } from '../src/theme/pickTextColor';
import { SWATCHES, isKnownSwatch } from '../src/theme/palette';

test('dark backgrounds get white text, light ones get dark text', () => {
  expect(pickTextColor('#2B2B2B')).toBe('#FFFFFF');
  expect(pickTextColor('#B5521B')).toBe('#FFFFFF');
  expect(pickTextColor('#D4A62A')).toBe('#111111');
  expect(pickTextColor('#F2EAD3')).toBe('#111111');
});

test('ten swatches, dark gray first, unknown colors rejected', () => {
  expect(SWATCHES).toHaveLength(10);
  expect(SWATCHES[0].hex).toBe('#2B2B2B');
  expect(isKnownSwatch('#123456')).toBe(false);
});
