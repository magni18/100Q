import { Pressable, StyleSheet } from 'react-native';

export function RemoteFocusHolder() {
  return <Pressable hasTVPreferredFocus focusable style={StyleSheet.absoluteFill} />;
}
