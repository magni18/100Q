import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';

const MAX_PASTED_CHARACTERS = 600000;

function readFileAsText(chosenFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(chosenFile);
  });
}

export function UploadPanel({ theme, uploadServer }) {
  const [questionsText, setQuestionsText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const textStyle = { color: theme.textColor };

  async function loadChosenFile(changeEvent) {
    const chosenFile = changeEvent.target.files?.[0];
    if (!chosenFile) {
      return;
    }
    try {
      setQuestionsText(await readFileAsText(chosenFile));
      setStatusMessage('File read, press Load questions');
    } catch {
      setStatusMessage('Could not read that file');
    }
  }

  async function submitQuestions() {
    setStatusMessage(await uploadServer.submitQuestionsText(questionsText));
  }

  return (
    <View style={styles.panel}>
      <Text style={[styles.hint, textStyle]}>Paste a JSON list like ["Question one", "Question two"] or pick a .json file.</Text>
      <input type="file" accept=".json,application/json" onChange={loadChosenFile} style={{ color: theme.textColor, marginBottom: 8 }} />
      <TextInput
        multiline
        value={questionsText}
        onChangeText={setQuestionsText}
        maxLength={MAX_PASTED_CHARACTERS}
        placeholder='["Question one", "Question two"]'
        style={[styles.textBox, { color: theme.textColor, borderColor: theme.textColor }]}
      />
      <FocusableButton label="Load questions" onPress={submitQuestions} theme={theme} />
      <Text style={[styles.status, textStyle]}>{statusMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { alignSelf: 'stretch' },
  hint: { fontSize: 18, marginBottom: 8, opacity: 0.8 },
  textBox: { minHeight: 160, borderWidth: 2, borderRadius: 12, padding: 12, fontSize: 16, fontFamily: 'monospace' },
  status: { fontSize: 20, marginTop: 8, minHeight: 28 },
});
