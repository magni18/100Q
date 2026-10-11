import { validateQuestions } from '../questions/validateQuestions';
import { pinsMatch } from './pin';

const PLAIN_TEXT = 'text/plain; charset=utf-8';
const HTML = 'text/html; charset=utf-8';

function textResponse(statusCode, message) {
  return { statusCode, contentType: PLAIN_TEXT, body: message };
}

function parseJsonBody(bodyText) {
  try {
    return JSON.parse(bodyText);
  } catch {
    return undefined;
  }
}

async function handleQuestionUpload(request, { expectedPin, pinLimiter, onQuestionsReceived }) {
  const uploadRequest = parseJsonBody(request.body);
  if (uploadRequest === undefined || uploadRequest === null || typeof uploadRequest !== 'object') {
    return textResponse(400, 'Body is not valid JSON');
  }
  if (pinLimiter.isLocked()) {
    return textResponse(429, 'Too many wrong PINs, wait 30 seconds');
  }
  if (!pinsMatch(expectedPin, uploadRequest.pin)) {
    pinLimiter.recordFailure();
    return textResponse(403, 'Wrong PIN');
  }
  pinLimiter.recordSuccess();
  const validation = validateQuestions(uploadRequest.questions);
  if (!validation.ok) {
    return textResponse(400, validation.reason);
  }
  try {
    await onQuestionsReceived(validation.questions);
  } catch {
    return textResponse(500, 'Could not save questions');
  }
  return textResponse(200, `Loaded ${validation.questions.length} questions`);
}

export function createRouteHandler(routeOptions) {
  return async function handleRequest(request) {
    const isPageRequest = request.method === 'GET' && request.path === '/';
    const isUploadRequest = request.method === 'POST' && request.path === '/questions';
    if (isPageRequest) {
      return { statusCode: 200, contentType: HTML, body: routeOptions.uploadPageHtml };
    }
    if (isUploadRequest) {
      return handleQuestionUpload(request, routeOptions);
    }
    return textResponse(404, 'Not found');
  };
}
