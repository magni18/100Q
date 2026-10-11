export const PIN_LENGTH = 4;
export const MAX_FAILED_PIN_ATTEMPTS = 5;
export const PIN_LOCKOUT_MS = 30000;

export function generatePin(random = Math.random) {
  let pin = '';
  for (let digitIndex = 0; digitIndex < PIN_LENGTH; digitIndex += 1) {
    pin += String(Math.floor(random() * 10));
  }
  return pin;
}

export function pinsMatch(expectedPin, providedPin) {
  return typeof providedPin === 'string' && providedPin === expectedPin;
}

export function createPinAttemptLimiter(now = Date.now) {
  let failedAttempts = 0;
  let lockedUntil = 0;
  return {
    isLocked() {
      return now() < lockedUntil;
    },
    recordFailure() {
      failedAttempts += 1;
      if (failedAttempts >= MAX_FAILED_PIN_ATTEMPTS) {
        lockedUntil = now() + PIN_LOCKOUT_MS;
        failedAttempts = 0;
      }
    },
    recordSuccess() {
      failedAttempts = 0;
    },
  };
}
