const KEY_PRESS_ACTION = 0;

const ACTION_BY_EVENT_TYPE = {
  right: 'next',
  left: 'previous',
};

export function remoteActionForEvent(event) {
  if (!event) {
    return null;
  }
  const isKeyPress = event.eventKeyAction === KEY_PRESS_ACTION;
  if (isKeyPress) {
    return null;
  }
  return ACTION_BY_EVENT_TYPE[event.eventType] ?? null;
}
