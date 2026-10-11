import { StyleSheet, Text, View } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';
import { Swatch } from '../components/Swatch';
import { SWATCHES } from '../theme/palette';
import { useRemoteKeys } from '../remote/useRemoteKeys';
import { UploadPanel } from './UploadPanel';

function describeQuestionSet(questionCount, questionSource) {
  const sourceLabel = questionSource === 'uploaded' ? 'uploaded' : 'default';
  return `Active set: ${questionCount} questions (${sourceLabel})`;
}

export function SettingsScreen({ theme, questionCount, questionSource, uploadServer, onChooseColor, onResetQuestions, onBack }) {
  useRemoteKeys({ onBack });
  const textStyle = { color: theme.textColor };
  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <Text style={[styles.heading, textStyle]}>Background</Text>
        <View style={styles.swatchRow}>
          {SWATCHES.map((swatch) => (
            <Swatch
              key={swatch.hex}
              hex={swatch.hex}
              name={swatch.name}
              theme={theme}
              isSelected={swatch.hex === theme.backgroundHex}
              hasTVPreferredFocus={swatch.hex === theme.backgroundHex}
              onPress={() => onChooseColor(swatch.hex)}
            />
          ))}
        </View>
        <Text style={[styles.heading, textStyle]}>Questions</Text>
        <Text style={[styles.body, textStyle]}>{describeQuestionSet(questionCount, questionSource)}</Text>
        <FocusableButton label="Reset to default questions" onPress={onResetQuestions} theme={theme} />
      </View>
      <View style={styles.column}>
        <Text style={[styles.heading, textStyle]}>Add questions from your phone</Text>
        <UploadPanel theme={theme} uploadServer={uploadServer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: 'row', paddingHorizontal: 48, paddingVertical: 27 },
  column: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  heading: { fontSize: 28, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  body: { fontSize: 22, marginBottom: 8 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
