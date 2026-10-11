import { remoteActionForEvent } from '../src/remote/remoteKeyAction';

test('right and left key releases map to next and previous, key presses and other keys are ignored', () => {
  expect(remoteActionForEvent({ eventType: 'right', eventKeyAction: 1 })).toBe('next');
  expect(remoteActionForEvent({ eventType: 'left', eventKeyAction: 1 })).toBe('previous');
  expect(remoteActionForEvent({ eventType: 'right' })).toBe('next');
  expect(remoteActionForEvent({ eventType: 'right', eventKeyAction: 0 })).toBeNull();
  expect(remoteActionForEvent({ eventType: 'select', eventKeyAction: 1 })).toBeNull();
});
