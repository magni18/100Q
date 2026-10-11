import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { buildQrMatrix } from '../upload/qrMatrix';

const QUIET_ZONE_CELLS = 4;

export function QrCode({ text, cellSize = 6 }) {
  const matrix = useMemo(() => buildQrMatrix(text), [text]);
  return (
    <View style={[styles.frame, { padding: QUIET_ZONE_CELLS * cellSize }]}>
      {matrix.map((rowCells, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowCells.map((isDark, columnIndex) => (
            <View
              key={columnIndex}
              style={{ width: cellSize, height: cellSize, backgroundColor: isDark ? '#000000' : '#FFFFFF' }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: '#FFFFFF', alignSelf: 'center' },
  row: { flexDirection: 'row' },
});
