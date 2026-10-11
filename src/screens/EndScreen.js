import { StyleSheet, Text, View } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';
import { useRemoteKeys } from '../remote/useRemoteKeys';

export function EndScreen({ theme, onPlayAgain, onBackToTitle }) {
  useRemoteKeys({ onBack: onBackToTitle });
  return (
    <View style={styles.screen}>
      <Text style={[styles.heading, { color: theme.textColor }]}>That's all!</Text>
      <FocusableButton label="Play again" onPress={onPlayAgain} theme={theme} isLarge hasTVPreferredFocus />
      <FocusableButton label="Back to title" onPress={onBackToTitle} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 72, fontWeight: '900', marginBottom: 40 },
});
