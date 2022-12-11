import { CaretOperation } from '../caret_operation';
import { getCurrentLine, replaceText } from '../utils';

export const handleTabKey = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement;

  let newPos: number;

  e.preventDefault();

  const currentLine = getCurrentLine(e);
  const text = target.value;
  const pos = CaretOperation.getPos(target);

  if (currentLine) {
    CaretOperation.setPos(target, {
      start: currentLine.start,
      end: currentLine.end,
    });
  }

  if (e.shiftKey) {
    if (currentLine && currentLine.text.charAt(0) === '|') {
      // prev cell in table
      newPos = text.lastIndexOf('|', pos.start - 1);
      if (newPos > 1) {
        newPos -= 1;
      }
      CaretOperation.setPos(target, { start: newPos, end: newPos });
    } else {
      // re indent
      const currentText = CaretOperation.getText(target);
      const reindentedText = currentText.replace(/^ {1,4}/gm, '');
      const reindentedCount = currentText.length - reindentedText.length;

      replaceText(target, reindentedText);

      if (currentLine) {
        CaretOperation.setPos(target, {
          start: pos.start - reindentedCount,
          end: pos.start - reindentedCount,
        });
      } else {
        CaretOperation.setPos(target, {
          start: pos.start,
          end: pos.start + reindentedText.length,
        });
      }
    }
  } else {
    if (currentLine && currentLine.text.charAt(0) === '|') {
      // next cell in table
      newPos = text.indexOf('|', pos.start + 1);
      if (newPos < 0 || newPos === text.lastIndexOf('|', currentLine.end - 1)) {
        CaretOperation.setPos(target, {
          start: currentLine.end,
          end: currentLine.end,
        });
      } else {
        CaretOperation.setPos(target, {
          start: newPos + 2,
          end: newPos + 2,
        });
      }
    } else {
      // indent
      const indentedText =
        '    ' + CaretOperation.getText(target).split('\n').join('\n    ');
      replaceText(target, indentedText);
      if (currentLine) {
        CaretOperation.setPos(target, {
          start: pos.start + 4,
          end: pos.start + 4,
        });
      } else {
        CaretOperation.setPos(target, {
          start: pos.start,
          end: pos.start + indentedText.length,
        });
      }
    }
  }
  document.dispatchEvent(new Event('input'));
};
