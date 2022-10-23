/// <reference path="./types/global.d.ts"/>
/// <reference path="./types/jquery.selection.d.ts"/>

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS209: Avoid top-level return
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

// import * as jQuery from 'jquery'

import jQuery = require('jquery');
const $ = jQuery
import selection from './jquery.selection';

selection(jQuery, window, window.document)

// KeyDownHandlerのオリジナル
//
// $(document).on('keydown', 'textarea', function (e: JQuery.KeyDownEvent) {
//   switch (e.which || e.keyCode) {
//     case 9:
//       handleTabKey(e);
//       break;
//     case 13:
//       handleEnterKey(e);
//       break;
//     case 32:
//       handleSpaceKey(e);
//       break;
//   }
// });

export const KeyDownHandler = function (this: HTMLTextAreaElement, e: KeyboardEvent): any {
  switch (e.which || e.keyCode) {
    case 9:
      handleTabKey(e);
      break;
    case 13:
      handleEnterKey(e);
      break;
    case 32:
      handleSpaceKey(e);
      break;
  }
};

const handleTabKey = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement

  let newPos;
  e.preventDefault();

  const currentLine = getCurrentLine(e);
  const text = $(target).val() as string;
  const pos = $(target).selection('getPos');
  if (currentLine) { $(target).selection('setPos', { start: currentLine.start, end: currentLine.end }); }
  if (e.shiftKey) {
    if (currentLine && (currentLine.text.charAt(0) === '|')) {
      // prev cell in table
      newPos = text.lastIndexOf('|', pos.start - 1);
      if (newPos > 1) { newPos -= 1; }
      $(target).selection('setPos', { start: newPos, end: newPos });
    } else {
      // re indent
      const reindentedText = $(target).selection().replace(/^ {1,4}/gm, '');
      const reindentedCount = $(target).selection().length - reindentedText.length;
      replaceText(target, reindentedText);
      if (currentLine) {
        $(target).selection('setPos', { start: pos.start - reindentedCount, end: pos.start - reindentedCount });
      } else {
        $(target).selection('setPos', { start: pos.start, end: pos.start + reindentedText.length });
      }
    }

  } else {
    if (currentLine && (currentLine.text.charAt(0) === '|')) {
      // next cell in table
      newPos = text.indexOf('|', pos.start + 1);
      if ((newPos < 0) || (newPos === text.lastIndexOf('|', currentLine.end - 1))) {
        $(target).selection('setPos', { start: currentLine.end, end: currentLine.end });
      } else {
        $(target).selection('setPos', { start: newPos + 2, end: newPos + 2 });
      }
    } else {
      // indent
      const indentedText = '    ' + $(target).selection().split("\n").join("\n    ");
      replaceText(target, indentedText);
      if (currentLine) {
        $(target).selection('setPos', { start: pos.start + 4, end: pos.start + 4 });
      } else {
        $(target).selection('setPos', { start: pos.start, end: pos.start + indentedText.length });
      }
    }
  }
  return $(target).trigger('input');
};

const handleEnterKey = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement

  let currentLine, match;
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return; } // for cmd + enter
  if (!(currentLine = getCurrentLine(e))) { return; }
  if (currentLine.start === currentLine.caret) { return; }
  if (match = currentLine.text.match(/^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] )?)\s*\S/)) {
    // smart indent with list
    let listMarkMatch;
    if (currentLine.text.match(/^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] ))\s*$/)) {
      // empty task list
      $(target).selection('setPos', { start: currentLine.start, end: (currentLine.end - 1) });
      return;
    }
    e.preventDefault();
    let listMark = match[1].replace(/\[x\]/, '[ ]');
    if (listMarkMatch = listMark.match(/^(\s*)(\d+)\./)) {
      const indent = listMarkMatch[1];
      const num = parseInt(listMarkMatch[2]);
      if (num !== 1) { listMark = listMark.replace(/\s*\d+/, `${indent}${num + 1}`); }
    }
    replaceText(target, "\n" + listMark);
    const caretTo = currentLine.caret + listMark.length + 1;
    $(target).selection('setPos', { start: caretTo, end: caretTo });
  } else if (currentLine.text.match(/^(\s*(?:-|\+|\*|\d+\.) )/)) {
    // remove list
    $(target).selection('setPos', { start: currentLine.start, end: (currentLine.end) });
  } else if (currentLine.text.match(/^.*\|\s*$/)) {
    // new row for table
    if (currentLine.text.match(/^[\|\s]+$/)) {
      $(target).selection('setPos', { start: currentLine.start, end: (currentLine.end) });
      return;
    }
    if (!currentLine.endOfLine) { return; }
    e.preventDefault();
    const row: string[] = [];
    const m = currentLine.text.match(/\|/g)
    if (m === null) { return; }

    for (match of Array.from(m)) { row.push("|"); }
    const prevLine = getPrevLine(e);
    if (!prevLine || (!currentLine.text.match(/---/) && !prevLine.text.match(/\|/g))) {
      replaceText(target, "\n" + row.join(' --- ') + "\n" + row.join('  '));
      $(target).selection('setPos', { start: (currentLine.caret + (6 * row.length)) - 1, end: (currentLine.caret + (6 * row.length)) - 1 });
    } else {
      replaceText(target, "\n" + row.join('  '));
      $(target).selection('setPos', { start: currentLine.caret + 3, end: currentLine.caret + 3 });
    }
  }
  return $(target).trigger('input');
};

var handleSpaceKey = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement

  let currentLine, match;
  if (!e.shiftKey || !e.altKey) { return; }
  if (!(currentLine = getCurrentLine(e))) { return; }
  if (match = currentLine.text.match(/^(\s*)(-|\+|\*|\d+\.) (?:\[(x| )\] )(.*)/)) {
    e.preventDefault();
    const checkMark = match[3] === ' ' ? 'x' : ' ';
    const replaceTo = `${match[1]}${match[2]} [${checkMark}] ${match[4]}`;
    $(target).selection('setPos', { start: currentLine.start, end: currentLine.end });
    replaceText(target, replaceTo);
    $(target).selection('setPos', { start: currentLine.caret, end: currentLine.caret });
    return $(target).trigger('input');
  }
};

const getCurrentLine = function (e: KeyboardEvent) {
  if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement

  const text = $(target).val() as string;
  const pos = $(target).selection('getPos');

  if (!text) { return null; }
  if (pos.start !== pos.end) { return null; }

  const startPos = text.lastIndexOf("\n", pos.start - 1) + 1;
  let endPos = text.indexOf("\n", pos.start);
  if (endPos === -1) { endPos = text.length; }
  return {
    text: text.slice(startPos, endPos),
    start: startPos,
    end: endPos,
    caret: pos.start,
    endOfLine: !$.trim(text.slice(pos.start, endPos))
  };
};

var getPrevLine = function (e: KeyboardEvent) {
    if (e.target === null) return;

  const target = e.target as HTMLTextAreaElement

  const currentLine = getCurrentLine(e);

  if (currentLine === null || typeof currentLine === 'undefined') { return null; }

  const text = ($(target).val() as string).slice(0, currentLine.start);

  const startPos = text.lastIndexOf("\n", currentLine.start - 2) + 1;
  const endPos = currentLine.start;
  return {
    text: text.slice(startPos, endPos),
    start: startPos,
    end: endPos
  };
};

// @see https://mimemo.io/m/mqLXOlJe7ozQ19r
const replaceText = function (target: HTMLTextAreaElement, str: string) {
  let e;
  const pos = $(target).selection('getPos');
  const fromIdx = pos.start;
  const toIdx = pos.end;
  let inserted = false;

  if (str) {
    const expectedLen = (target.value.length - Math.abs(toIdx - fromIdx)) + str.length;
    target.focus();
    target.selectionStart = fromIdx;
    target.selectionEnd = toIdx;
    try {
      inserted = document.execCommand('insertText', false, str);
    } catch (error) {
      e = error;
      inserted = false;
    }
    if (inserted && ((target.value.length !== expectedLen) || (target.value.substr(fromIdx, str.length) !== str))) {
      //firefoxでなぜかうまくいってないくせにinsertedがtrueになるので失敗を検知してfalseに…
      inserted = false;
    }
  }
  if (!inserted) {
    try {
      document.execCommand('ms-beginUndoUnit');
    } catch (error1) { e = error1; }
    const {
      value
    } = target;
    target.value = '' + value.substring(0, fromIdx) + str + value.substring(toIdx);
    try {
      document.execCommand('ms-endUndoUnit');
    } catch (error2) { e = error2; }
  }
  $(target).trigger('blur').trigger('focus');
};
