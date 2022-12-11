import { CaretOperation } from '../caret_operation';
import { getCurrentLine, replaceText, getPrevLine } from '../utils';

const RegExpList = {
  listMarker: /^(\s*(?:-|\+|\*|\d+\.) )/,
  listMarkerWithPossibleCheckbox:
    /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] )?)\s*\S/,
  emptyListItem: /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] ))\s*$/,
} as const;

export const handleEnterKey = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement;

  let currentLine, match;
  if (e.metaKey || e.ctrlKey || e.shiftKey) {
    return;
  } // for cmd + enter
  if (!(currentLine = getCurrentLine(e))) {
    return;
  }
  if (currentLine.start === currentLine.caret) {
    return;
  }
  if (
    (match = currentLine.text.match(RegExpList.listMarkerWithPossibleCheckbox))
  ) {
    // smart indent with list
    let listMarkMatch;
    if (currentLine.text.match(RegExpList.emptyListItem)) {
      // empty task list
      CaretOperation.setPos(target, {
        start: currentLine.start,
        end: currentLine.end - 1,
      });
      return;
    }
    e.preventDefault();
    let listMark = match[1].replace(/\[x\]/, '[ ]');
    if ((listMarkMatch = listMark.match(/^(\s*)(\d+)\./))) {
      const indent = listMarkMatch[1];
      const num = parseInt(listMarkMatch[2]);
      if (num !== 1) {
        listMark = listMark.replace(/\s*\d+/, `${indent}${num + 1}`);
      }
    }
    replaceText(target, '\n' + listMark);
    const caretTo = currentLine.caret + listMark.length + 1;
    CaretOperation.setPos(target, { start: caretTo, end: caretTo });
  } else if (currentLine.text.match(RegExpList.listMarker)) {
    // remove list
    CaretOperation.setPos(target, {
      start: currentLine.start,
      end: currentLine.end,
    });
  } else if (currentLine.text.match(/^.*\|\s*$/)) {
    // new row for table
    if (currentLine.text.match(/^[|\s]+$/)) {
      CaretOperation.setPos(target, {
        start: currentLine.start,
        end: currentLine.end,
      });
      return;
    }
    if (!currentLine.endOfLine) {
      return;
    }
    e.preventDefault();
    const row: string[] = [];
    const m = currentLine.text.match(/\|/g);
    if (m === null) {
      return;
    }

    for (match of Array.from(m)) {
      row.push('|');
    }
    const prevLine = getPrevLine(e);
    if (
      !prevLine ||
      (!currentLine.text.match(/---/) && !prevLine.text.match(/\|/g))
    ) {
      replaceText(target, '\n' + row.join(' --- ') + '\n' + row.join('  '));
      CaretOperation.setPos(target, {
        start: currentLine.caret + 6 * row.length - 1,
        end: currentLine.caret + 6 * row.length - 1,
      });
    } else {
      replaceText(target, '\n' + row.join('  '));
      CaretOperation.setPos(target, {
        start: currentLine.caret + 3,
        end: currentLine.caret + 3,
      });
    }
  }
  document.dispatchEvent(new Event('input'));
};
