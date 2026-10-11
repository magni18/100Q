import { buildQrMatrix } from '../src/upload/qrMatrix';
import { buildUploadPageHtml } from '../src/upload/uploadPage';

test('qr matrix is square with a dark finder pattern corner', () => {
  const matrix = buildQrMatrix('http://192.168.1.20:8080/#pin=1234');
  expect(matrix.length).toBeGreaterThanOrEqual(21);
  matrix.forEach((row) => expect(row).toHaveLength(matrix.length));
  expect(matrix[0].slice(0, 7)).toEqual([true, true, true, true, true, true, true]);
});

test('upload page reads pin from link, posts questions, never uses innerHTML', () => {
  const html = buildUploadPageHtml();
  expect(html).toContain('location.hash');
  expect(html).toContain("fetch('/questions'");
  expect(html).not.toContain('innerHTML');
});
