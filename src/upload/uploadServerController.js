export const NETWORK_RETRY_MS = 5000;

export function createUploadServerController({
  readNetworkAddress,
  startUploadServer,
  buildRequestHandler,
  onStateChange,
  schedule = setTimeout,
  cancelSchedule = clearTimeout,
}) {
  let runningServer = null;
  let isStarting = false;
  let shouldRun = false;
  let retryTimer = null;

  function scheduleRetry() {
    cancelSchedule(retryTimer);
    retryTimer = schedule(() => {
      retryTimer = null;
      startServer();
    }, NETWORK_RETRY_MS);
  }

  async function startServer() {
    if (!shouldRun || runningServer || isStarting) {
      return;
    }
    isStarting = true;
    try {
      const ipAddress = await readNetworkAddress();
      if (!shouldRun) {
        return;
      }
      if (!ipAddress) {
        onStateChange({ status: 'noNetwork' });
        scheduleRetry();
        return;
      }
      const startedServer = await startUploadServer(buildRequestHandler());
      if (!shouldRun) {
        startedServer.stop();
        return;
      }
      runningServer = startedServer;
      onStateChange({ status: 'ready', url: `http://${ipAddress}:${startedServer.port}/` });
    } catch {
      if (shouldRun) {
        onStateChange({ status: 'unavailable' });
      }
    } finally {
      isStarting = false;
    }
  }

  function stopServer() {
    cancelSchedule(retryTimer);
    retryTimer = null;
    if (runningServer) {
      runningServer.stop();
      runningServer = null;
    }
  }

  return {
    resume() {
      shouldRun = true;
      startServer();
    },
    pause() {
      shouldRun = false;
      stopServer();
    },
  };
}
