import { Pressable, StyleSheet, View } from 'react-native';

export function RemoteFocusHolder({ onTapLeft, onTapRight }) {
  return (
    <View style={styles.tapZones}>
      <Pressable accessibilityLabel="Previous question" onPress={onTapLeft} style={styles.tapZone} />
      <Pressable accessibilityLabel="Next question" onPress={onTapRight} style={styles.tapZone} />
    </View>
  );
}

const styles = StyleSheet.create({
  tapZones: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row', zIndex: 1 },
  tapZone: { flex: 1, cursor: 'pointer' },
});
