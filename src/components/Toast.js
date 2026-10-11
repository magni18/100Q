import { StyleSheet, Text, View } from 'react-native';

export function Toast({ message, theme }) {
  if (!message) {
    return null;
  }
  return (
    <View pointerEvents="none" style={styles.container}>
      <Text style={[styles.toast, { backgroundColor: theme.textColor, color: theme.backgroundHex }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 48, left: 0, right: 0, alignItems: 'center' },
  toast: { fontSize: 24, fontWeight: '600', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12, overflow: 'hidden' },
});
