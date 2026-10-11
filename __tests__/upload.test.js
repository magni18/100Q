import { Buffer } from 'buffer';
import { MAX_BODY_BYTES, parseHttpRequest } from '../src/upload/parseHttpRequest';
import { formatHttpResponse } from '../src/upload/formatHttpResponse';
import { createPinAttemptLimiter, generatePin } from '../src/upload/pin';
import { createRouteHandler } from '../src/upload/routes';
import { isUsableIpv4Address } from '../src/upload/isUsableIpv4Address';

function postRequestBytes(bodyText) {
  const bodyBytes = Buffer.from(bodyText, 'utf8');
  const headerText = `POST /questions HTTP/1.1\r\nContent-Length: ${bodyBytes.length}\r\n\r\n`;
  return Buffer.concat([Buffer.from(headerText, 'latin1'), bodyBytes]);
}

function buildHandler() {
  const onQuestionsReceived = jest.fn().mockResolvedValue();
  const handleRequest = createRouteHandler({
    expectedPin: '1234',
    pinLimiter: createPinAttemptLimiter(() => 0),
    uploadPageHtml: '<html>upload</html>',
    onQuestionsReceived,
  });
  return { handleRequest, onQuestionsReceived };
}

function post(body) {
  return { method: 'POST', path: '/questions', headers: {}, body: JSON.stringify(body) };
}

test('parses a request whose multi-byte body arrives in two chunks', () => {
  const bodyText = '{"questions":["Skål 🍻"]}';
  const fullBytes = postRequestBytes(bodyText);
  expect(parseHttpRequest(fullBytes.subarray(0, fullBytes.length - 3))).toEqual({ status: 'incomplete' });
  expect(parseHttpRequest(fullBytes)).toMatchObject({ status: 'complete', method: 'POST', path: '/questions', body: bodyText });
});

test('parses when subarray returns a plain Uint8Array, as on the TV', () => {
  const bytes = postRequestBytes('{"pin":"1234"}');
  bytes.subarray = (start, end) => new Uint8Array(bytes.buffer, bytes.byteOffset + start, (end ?? bytes.length) - start);
  expect(parseHttpRequest(bytes)).toMatchObject({ status: 'complete', path: '/questions', body: '{"pin":"1234"}' });
});

test('rejects oversized and malformed requests', () => {
  const oversized = Buffer.from(`POST / HTTP/1.1\r\nContent-Length: ${MAX_BODY_BYTES + 1}\r\n\r\n`);
  expect(parseHttpRequest(oversized)).toEqual({ status: 'tooLarge' });
  expect(parseHttpRequest(Buffer.from('HELLO\r\n\r\n'))).toEqual({ status: 'malformed' });
});

test('response counts body length in bytes', () => {
  const responseText = formatHttpResponse({ statusCode: 200, contentType: 'text/plain', body: 'Skål' }).toString('utf8');
  expect(responseText.startsWith('HTTP/1.1 200 OK\r\n')).toBe(true);
  expect(responseText).toContain('Content-Length: 5\r\n');
});

test('only real IPv4 addresses are usable for the QR link', () => {
  expect(isUsableIpv4Address('192.168.1.20')).toBe(true);
  expect(isUsableIpv4Address('0.0.0.0')).toBe(false);
  expect(isUsableIpv4Address('fe80::1')).toBe(false);
  expect(isUsableIpv4Address(null)).toBe(false);
});

test('pin is four digits', () => {
  expect(generatePin()).toMatch(/^\d{4}$/);
});

test('valid upload with correct pin is saved', async () => {
  const { handleRequest, onQuestionsReceived } = buildHandler();
  const response = await handleRequest(post({ pin: '1234', questions: [' A ', 'B'] }));
  expect(response).toMatchObject({ statusCode: 200, body: 'Loaded 2 questions' });
  expect(onQuestionsReceived).toHaveBeenCalledWith(['A', 'B']);
});

test('wrong pin is refused, and five wrong pins lock uploads', async () => {
  const { handleRequest, onQuestionsReceived } = buildHandler();
  expect((await handleRequest(post({ pin: '0000', questions: ['A'] }))).statusCode).toBe(403);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await handleRequest(post({ pin: '0000', questions: ['A'] }));
  }
  expect((await handleRequest(post({ pin: '1234', questions: ['A'] }))).statusCode).toBe(429);
  expect(onQuestionsReceived).not.toHaveBeenCalled();
});

test('invalid questions and unknown paths are refused', async () => {
  const { handleRequest } = buildHandler();
  expect(await handleRequest(post({ pin: '1234', questions: ['A', 7] }))).toMatchObject({ statusCode: 400, body: 'Question 2 is not text' });
  expect((await handleRequest({ method: 'GET', path: '/secret', headers: {}, body: '' })).statusCode).toBe(404);
});
