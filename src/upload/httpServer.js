import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';
import { parseHttpRequest } from './parseHttpRequest';
import { formatHttpResponse } from './formatHttpResponse';

const FIRST_PORT = 8080;
const LAST_PORT = 8089;
const SOCKET_IDLE_TIMEOUT_MS = 15000;
const PLAIN_TEXT = 'text/plain; charset=utf-8';

async function responseForParsedRequest(parsedRequest, handleRequest) {
  if (parsedRequest.status === 'tooLarge') {
    return { statusCode: 413, contentType: PLAIN_TEXT, body: 'Upload too large (max 512 KB)' };
  }
  if (parsedRequest.status === 'malformed') {
    return { statusCode: 400, contentType: PLAIN_TEXT, body: 'Bad request' };
  }
  try {
    return await handleRequest(parsedRequest);
  } catch {
    return { statusCode: 500, contentType: PLAIN_TEXT, body: 'Server error' };
  }
}

function sendAndClose(socket, responseBytes) {
  if (socket.destroyed) {
    return;
  }
  try {
    socket.end(responseBytes);
  } catch {
    socket.destroy();
  }
}

function serveConnection(socket, handleRequest) {
  let receivedBytes = Buffer.alloc(0);
  let hasResponded = false;
  socket.setTimeout(SOCKET_IDLE_TIMEOUT_MS, () => socket.destroy());
  socket.on('error', () => socket.destroy());
  socket.on('data', async (chunk) => {
    if (hasResponded) {
      return;
    }
    receivedBytes = Buffer.concat([receivedBytes, Buffer.from(chunk)]);
    const parsedRequest = parseHttpRequest(receivedBytes);
    if (parsedRequest.status === 'incomplete') {
      return;
    }
    hasResponded = true;
    const response = await responseForParsedRequest(parsedRequest, handleRequest);
    sendAndClose(socket, formatHttpResponse(response));
  });
}

function listenOnPort(port, handleRequest) {
  return new Promise((resolve, reject) => {
    const server = TcpSocket.createServer((socket) => serveConnection(socket, handleRequest));
    server.on('error', reject);
    server.listen({ port, host: '0.0.0.0' }, () => resolve(server));
  });
}

export async function startUploadServer(handleRequest) {
  for (let port = FIRST_PORT; port <= LAST_PORT; port += 1) {
    try {
      const server = await listenOnPort(port, handleRequest);
      return { port, stop: () => server.close() };
    } catch {
      continue;
    }
  }
  throw new Error('No free port');
}
