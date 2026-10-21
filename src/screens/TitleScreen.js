import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';

const LARGEST_TITLE_SIZE = 88;
const TITLE_WIDTH_RATIO = 8.5;

export function TitleScreen({ theme, onPlay, onOpenSettings }) {
  const { width } = useWindowDimensions();
  const titleSize = Math.min(LARGEST_TITLE_SIZE, width / TITLE_WIDTH_RATIO);
  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { color: theme.textColor, fontSize: titleSize }]}>100 Questions</Text>
      <FocusableButton label="Play" onPress={onPlay} theme={theme} isLarge hasTVPreferredFocus />
      <FocusableButton label="Settings" onPress={onOpenSettings} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '900', marginBottom: 40, textAlign: 'center' },
});
