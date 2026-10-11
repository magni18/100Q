import { createUploadServerController } from '../src/upload/uploadServerController';

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

function buildController({ addresses }) {
  const states = [];
  const scheduledCallbacks = [];
  const startedServers = [];
  const remainingAddresses = [...addresses];
  const controller = createUploadServerController({
    readNetworkAddress: async () => remainingAddresses.shift() ?? null,
    startUploadServer: async () => {
      const server = { port: 8080, stop: jest.fn() };
      startedServers.push(server);
      return server;
    },
    buildRequestHandler: () => () => {},
    onStateChange: (state) => states.push(state),
    schedule: (callback) => scheduledCallbacks.push(callback),
    cancelSchedule: () => {},
  });
  return { controller, states, scheduledCallbacks, startedServers };
}

test('no network at first is retried until an address appears', async () => {
  const { controller, states, scheduledCallbacks } = buildController({ addresses: [null, '192.168.1.20'] });
  controller.resume();
  await flushPromises();
  expect(states.at(-1)).toEqual({ status: 'noNetwork' });
  scheduledCallbacks.shift()();
  await flushPromises();
  expect(states.at(-1)).toEqual({ status: 'ready', url: 'http://192.168.1.20:8080/' });
});

test('going to background while starting stops the server once it has started', async () => {
  const { controller, states, startedServers } = buildController({ addresses: ['192.168.1.20'] });
  controller.resume();
  controller.pause();
  await flushPromises();
  expect(startedServers.every((server) => server.stop.mock.calls.length === 1)).toBe(true);
  expect(states.some((state) => state.status === 'ready')).toBe(false);
});

test('going to background stops a running server', async () => {
  const { controller, startedServers } = buildController({ addresses: ['192.168.1.20'] });
  controller.resume();
  await flushPromises();
  controller.pause();
  expect(startedServers[0].stop).toHaveBeenCalledTimes(1);
});
