import { Pressable, StyleSheet, Text } from 'react-native';

const BACK_ARROW = '←';

export function BackButton({ onPress, theme }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      style={({ focused, hovered }) => [
        styles.button,
        { borderColor: theme.textColor },
        (focused || hovered) && { backgroundColor: theme.textColor },
      ]}
    >
      {({ focused, hovered }) => (
        <Text style={[styles.arrow, { color: focused || hovered ? theme.backgroundHex : theme.textColor }]}>
          {BACK_ARROW}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
    width: 56,
    height: 56,
    borderWidth: 3,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  arrow: { fontSize: 28, fontWeight: '800', lineHeight: 32 },
});
