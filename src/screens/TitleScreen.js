import { StyleSheet, Text, View } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';

export function TitleScreen({ theme, onPlay, onOpenSettings }) {
  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { color: theme.textColor }]}>100 Questions</Text>
      <FocusableButton label="Play" onPress={onPlay} theme={theme} isLarge hasTVPreferredFocus />
      <FocusableButton label="Settings" onPress={onOpenSettings} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 88, fontWeight: '900', marginBottom: 40 },
});
