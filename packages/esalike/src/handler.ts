import { handleEnterKey } from './handlers/enter';
import { handleSpaceKey } from './handlers/space';
import { handleTabKey } from './handlers/tab';


export const KeyDownHandler = function (
  this: HTMLTextAreaElement,
  e: KeyboardEvent
): void {
  // textarea inputs should have`data-esarea-disabled=true` to prevent conflicts with esarea.
  //
  // As it seems that the load timing of Chrome extension seems asynchronous,
  // both esalike and esarea should watch this attribute.
  if (this.dataset.esareaDisabled !== 'true') return

  // Skip processing if IME is composing
  if (e.isComposing) return;

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
