import { handleEnterKey } from './handlers/enter';
import { handleSpaceKey } from './handlers/space';
import { handleTabKey } from './handlers/tab';

let esareaDetected = false;

const isEsareaInstalled = (): boolean => {
  if (esareaDetected) return true;

  const meta = document.querySelector('meta[name="esarea"]');

  if (meta) {
    esareaDetected = true;
  }

  return esareaDetected;
};

export const KeyDownHandler = function (
  this: HTMLTextAreaElement,
  e: KeyboardEvent
): void {
  // Check a meta tag inserted by esarea in this handler
  // because the tag insertion seems to be asynchronous.
  if (isEsareaInstalled()) return;

  const key = e.key.toLowerCase();

  if (key === 'tab') {
    handleTabKey(e);
  } else if (key === 'enter') {
    handleEnterKey(e);
  } else if (
    // FIXME: Strangely `e.key === ' '`  does not work.
    e.code === 'Space' &&
    e.shiftKey &&
    e.altKey
  ) {
    handleSpaceKey(e);
  }
};
