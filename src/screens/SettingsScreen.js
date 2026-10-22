import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BackButton } from '../components/BackButton';
import { FocusableButton } from '../components/FocusableButton';
import { Swatch } from '../components/Swatch';
import { SWATCHES } from '../theme/palette';
import { useRemoteKeys } from '../remote/useRemoteKeys';
import { UploadPanel } from './UploadPanel';

const NARROW_SCREEN_WIDTH = 760;
const UPLOAD_HEADING = Platform.OS === 'web' ? 'Add your own questions' : 'Add questions from your phone';

function describeQuestionSet(questionCount, questionSource) {
  const sourceLabel = questionSource === 'uploaded' ? 'uploaded' : 'default';
  return `Active set: ${questionCount} questions (${sourceLabel})`;
}

function SettingsColumns({ theme, questionCount, questionSource, uploadServer, onChooseColor, onResetQuestions, isNarrow }) {
  const textStyle = { color: theme.textColor };
  return (
    <View style={[styles.columns, isNarrow && styles.stackedColumns]}>
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
        <Text style={[styles.heading, textStyle]}>{UPLOAD_HEADING}</Text>
        <UploadPanel theme={theme} uploadServer={uploadServer} />
      </View>
    </View>
  );
}

function SettingsBody({ isNarrow, ...settingsProps }) {
  if (!isNarrow) {
    return <SettingsColumns {...settingsProps} isNarrow={false} />;
  }
  return (
    <ScrollView>
      <SettingsColumns {...settingsProps} isNarrow />
    </ScrollView>
  );
}

export function SettingsScreen({ onBack, ...settingsProps }) {
  useRemoteKeys({ onBack });
  const { width } = useWindowDimensions();
  const isNarrow = width < NARROW_SCREEN_WIDTH;
  return (
    <View style={styles.screen}>
      <SettingsBody {...settingsProps} isNarrow={isNarrow} />
      <BackButton onPress={onBack} theme={settingsProps.theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  columns: { flex: 1, flexDirection: 'row', paddingHorizontal: 48, paddingVertical: 27 },
  stackedColumns: { flexDirection: 'column', paddingHorizontal: 16, paddingTop: 72 },
  column: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  heading: { fontSize: 28, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  body: { fontSize: 22, marginBottom: 8 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
