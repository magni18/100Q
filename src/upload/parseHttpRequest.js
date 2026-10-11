import { Buffer } from 'buffer';

export const MAX_BODY_BYTES = 512 * 1024;
export const MAX_HEADER_BYTES = 8192;

const HEADER_TERMINATOR = Buffer.from('\r\n\r\n', 'latin1');
const DIGITS_ONLY = /^\d+$/;

function parseHeaderLines(headerLines) {
  const headers = {};
  headerLines.forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex > 0) {
      headers[line.slice(0, separatorIndex).trim().toLowerCase()] = line.slice(separatorIndex + 1).trim();
    }
  });
  return headers;
}

function parseRequestLine(requestLine) {
  const parts = requestLine.split(' ');
  if (parts.length !== 3 || !parts[2].startsWith('HTTP/')) {
    return null;
  }
  return { method: parts[0].toUpperCase(), path: parts[1].split('?')[0] };
}

function readContentLength(headers) {
  const declaredLength = headers['content-length'];
  if (declaredLength === undefined) {
    return 0;
  }
  return DIGITS_ONLY.test(declaredLength) ? Number(declaredLength) : null;
}

export function parseHttpRequest(receivedBytes) {
  const headerEnd = receivedBytes.indexOf(HEADER_TERMINATOR);
  if (headerEnd === -1) {
    return receivedBytes.length > MAX_HEADER_BYTES ? { status: 'malformed' } : { status: 'incomplete' };
  }
  const [requestLine, ...headerLines] = receivedBytes.toString('latin1', 0, headerEnd).split('\r\n');
  const requestTarget = parseRequestLine(requestLine);
  const headers = parseHeaderLines(headerLines);
  const contentLength = readContentLength(headers);
  if (requestTarget === null || contentLength === null) {
    return { status: 'malformed' };
  }
  if (contentLength > MAX_BODY_BYTES) {
    return { status: 'tooLarge' };
  }
  const bodyStart = headerEnd + HEADER_TERMINATOR.length;
  if (receivedBytes.length < bodyStart + contentLength) {
    return { status: 'incomplete' };
  }
  const body = receivedBytes.toString('utf8', bodyStart, bodyStart + contentLength);
  return { status: 'complete', ...requestTarget, headers, body };
}
