import { Buffer } from 'buffer';

const REASON_PHRASES = {
  200: 'OK',
  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  413: 'Payload Too Large',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};

export function formatHttpResponse({ statusCode, contentType, body }) {
  const bodyBytes = Buffer.from(body, 'utf8');
  const reasonPhrase = REASON_PHRASES[statusCode] ?? 'Error';
  const headerText = [
    `HTTP/1.1 ${statusCode} ${reasonPhrase}`,
    `Content-Type: ${contentType}`,
    `Content-Length: ${bodyBytes.length}`,
    'Cache-Control: no-store',
    'X-Content-Type-Options: nosniff',
    'Connection: close',
    '',
    '',
  ].join('\r\n');
  return Buffer.concat([Buffer.from(headerText, 'latin1'), bodyBytes]);
}
