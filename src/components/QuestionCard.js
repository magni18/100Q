import { StyleSheet, Text } from 'react-native';
import { CHEERS_TEXT } from '../game/buildCardSequence';

export function QuestionCard({ card, theme }) {
  const isCheers = card.kind === 'cheers';
  return (
    <Text
      style={[isCheers ? styles.cheers : styles.question, { color: theme.textColor }]}
      numberOfLines={isCheers ? 1 : 6}
      adjustsFontSizeToFit
      minimumFontScale={0.4}
    >
      {isCheers ? CHEERS_TEXT : card.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  question: { fontSize: 64, fontWeight: '700', textAlign: 'center', textAlignVertical: 'center', lineHeight: 80 },
  cheers: { fontSize: 120, fontWeight: '900', textAlign: 'center', textAlignVertical: 'center' },
});
