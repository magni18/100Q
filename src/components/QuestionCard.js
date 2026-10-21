import { StyleSheet, Text } from 'react-native';
import { CHEERS_TEXT } from '../game/buildCardSequence';

const LINE_HEIGHT_RATIO = 1.25;

export function QuestionCard({ card, theme, cardLayout }) {
  const isCheers = card.kind === 'cheers';
  const sizeStyle = isCheers
    ? { fontSize: cardLayout.cheersFontSize }
    : { fontSize: cardLayout.questionFontSize, lineHeight: Math.round(cardLayout.questionFontSize * LINE_HEIGHT_RATIO) };
  return (
    <Text
      style={[isCheers ? styles.cheers : styles.question, sizeStyle, { color: theme.textColor }]}
      numberOfLines={isCheers ? 1 : 6}
      adjustsFontSizeToFit
      minimumFontScale={0.4}
    >
      {isCheers ? CHEERS_TEXT : card.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  question: { fontWeight: '700', textAlign: 'center', textAlignVertical: 'center' },
  cheers: { fontWeight: '900', textAlign: 'center', textAlignVertical: 'center' },
});
