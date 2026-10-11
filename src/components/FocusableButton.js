import { Pressable, StyleSheet, Text } from 'react-native';

export function FocusableButton({ label, onPress, theme, isLarge = false, hasTVPreferredFocus = false }) {
  return (
    <Pressable
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={({ focused }) => [
        styles.button,
        isLarge && styles.largeButton,
        { borderColor: theme.textColor },
        focused && { backgroundColor: theme.textColor, transform: [{ scale: 1.08 }] },
      ]}
    >
      {({ focused }) => (
        <Text style={[isLarge ? styles.largeLabel : styles.label, { color: focused ? theme.backgroundHex : theme.textColor }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderWidth: 3, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center', marginVertical: 8 },
  largeButton: { paddingVertical: 20, paddingHorizontal: 80, borderRadius: 24 },
  label: { fontSize: 24, fontWeight: '600' },
  largeLabel: { fontSize: 44, fontWeight: '800' },
});
