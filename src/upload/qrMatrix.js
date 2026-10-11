import { create as createQrCode } from 'qrcode/lib/core/qrcode';

export function buildQrMatrix(text) {
  const qrCode = createQrCode(text, { errorCorrectionLevel: 'M' });
  const size = qrCode.modules.size;
  const matrix = [];
  for (let row = 0; row < size; row += 1) {
    const cells = [];
    for (let column = 0; column < size; column += 1) {
      cells.push(Boolean(qrCode.modules.get(row, column)));
    }
    matrix.push(cells);
  }
  return matrix;
}
