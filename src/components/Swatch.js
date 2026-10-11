import { Pressable, StyleSheet, View } from 'react-native';

export function Swatch({ hex, name, isSelected, onPress, theme, hasTVPreferredFocus = false }) {
  return (
    <Pressable
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityLabel={name}
      style={({ focused }) => [
        styles.ring,
        { borderColor: focused ? theme.textColor : 'transparent' },
        focused && styles.focusedRing,
      ]}
    >
      <View style={[styles.swatch, { backgroundColor: hex, borderColor: theme.textColor }]} />
      <View style={[styles.selectedDot, { backgroundColor: isSelected ? theme.textColor : 'transparent' }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 3, borderRadius: 40, padding: 4, marginHorizontal: 4, alignItems: 'center' },
  focusedRing: { transform: [{ scale: 1.15 }] },
  swatch: { width: 48, height: 48, borderRadius: 24, borderWidth: 1 },
  selectedDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
