import TcpSocket from 'react-native-tcp-socket';

const PROBE_HOST = '1.1.1.1';
const PROBE_PORT = 80;
const PROBE_TIMEOUT_MS = 3000;

export function readRoutedAddress() {
  return new Promise((resolve) => {
    let isSettled = false;
    let timeoutId = null;
    let probeSocket = null;

    function finish(address) {
      if (isSettled) {
        return;
      }
      isSettled = true;
      clearTimeout(timeoutId);
      probeSocket?.destroy();
      resolve(address);
    }

    timeoutId = setTimeout(() => finish(null), PROBE_TIMEOUT_MS);
    probeSocket = TcpSocket.createConnection({ host: PROBE_HOST, port: PROBE_PORT }, () => {
      finish(probeSocket.localAddress ?? null);
    });
    probeSocket.on('error', () => finish(null));
  });
}
