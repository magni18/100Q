import { StyleSheet, View } from 'react-native';
import { GrainOverlay } from './GrainOverlay';

export function Background({ theme, children }) {
  return (
    <View style={[styles.background, { backgroundColor: theme.backgroundHex }]}>
      <GrainOverlay />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, overflow: 'hidden' },
});
