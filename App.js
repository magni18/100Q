import { useCallback, useMemo, useState } from 'react';
import { Background } from './src/components/Background';
import { Toast } from './src/components/Toast';
import { createTheme } from './src/theme/createTheme';
import { shuffle } from './src/game/shuffle';
import { buildCardSequence } from './src/game/buildCardSequence';
import { DEFAULT_QUESTIONS } from './src/questions/defaultQuestions';
import { useActiveQuestions } from './src/state/useActiveQuestions';
import { useBackgroundColor } from './src/state/useBackgroundColor';
import { useToast } from './src/state/useToast';
import { useUploadServer } from './src/upload/useUploadServer';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GameScreen } from './src/screens/GameScreen';
import { EndScreen } from './src/screens/EndScreen';

export default function App() {
  const background = useBackgroundColor();
  const activeQuestions = useActiveQuestions();
  const { toastMessage, showToast } = useToast();
  const [currentScreen, setCurrentScreen] = useState('title');
  const [gameCards, setGameCards] = useState([]);
  const [gameNumber, setGameNumber] = useState(0);
  const theme = useMemo(() => createTheme(background.backgroundHex), [background.backgroundHex]);

  const { replaceWithUploadedQuestions, restoreDefaultQuestions } = activeQuestions;
  const handleQuestionsReceived = useCallback(async (questions) => {
    await replaceWithUploadedQuestions(questions);
    showToast(`Loaded ${questions.length} questions`);
  }, [replaceWithUploadedQuestions, showToast]);
  const uploadServer = useUploadServer(handleQuestionsReceived);

  function startNewGame() {
    setGameCards(buildCardSequence(shuffle(activeQuestions.questions)));
    setGameNumber((previousGameNumber) => previousGameNumber + 1);
    setCurrentScreen('game');
  }

  async function resetQuestions() {
    await restoreDefaultQuestions();
    showToast(`Restored ${DEFAULT_QUESTIONS.length} default questions`);
  }

  const goToTitle = () => setCurrentScreen('title');
  const isReady = background.isLoaded && activeQuestions.isLoaded;

  return (
    <Background theme={theme}>
      {isReady && currentScreen === 'title' && (
        <TitleScreen theme={theme} onPlay={startNewGame} onOpenSettings={() => setCurrentScreen('settings')} />
      )}
      {isReady && currentScreen === 'settings' && (
        <SettingsScreen
          theme={theme}
          questionCount={activeQuestions.questions.length}
          questionSource={activeQuestions.source}
          uploadServer={uploadServer}
          onChooseColor={background.chooseBackgroundHex}
          onResetQuestions={resetQuestions}
          onBack={goToTitle}
        />
      )}
      {isReady && currentScreen === 'game' && (
        <GameScreen key={gameNumber} theme={theme} cards={gameCards} onFinished={() => setCurrentScreen('end')} onExit={goToTitle} />
      )}
      {isReady && currentScreen === 'end' && (
        <EndScreen theme={theme} onPlayAgain={startNewGame} onBackToTitle={goToTitle} />
      )}
      <Toast message={toastMessage} theme={theme} />
    </Background>
  );
}
