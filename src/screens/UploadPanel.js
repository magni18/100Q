import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FocusableButton } from '../components/FocusableButton';
import { QrCode } from '../components/QrCode';

const STATUS_MESSAGES = {
  starting: 'Starting upload server...',
  noNetwork: 'Connect TV to the internet',
  unavailable: 'Upload unavailable',
};

export function UploadPanel({ theme, uploadServer }) {
  const [isUrlVisible, setIsUrlVisible] = useState(false);
  const textStyle = { color: theme.textColor };

  if (uploadServer.status !== 'ready') {
    return <Text style={[styles.message, textStyle]}>{STATUS_MESSAGES[uploadServer.status]}</Text>;
  }

  return (
    <View style={styles.panel}>
      <QrCode text={`${uploadServer.url}#pin=${uploadServer.pin}`} />
      <FocusableButton
        label={isUrlVisible ? 'Hide URL' : 'Show URL'}
        onPress={() => setIsUrlVisible((wasVisible) => !wasVisible)}
        theme={theme}
      />
      {isUrlVisible && <Text style={[styles.message, textStyle]}>{uploadServer.url}</Text>}
      {isUrlVisible && <Text style={[styles.message, textStyle]}>PIN {uploadServer.pin}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { alignItems: 'center' },
  message: { fontSize: 22, marginTop: 8, textAlign: 'center' },
});
