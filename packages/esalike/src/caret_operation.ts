// Extracted from jquery.selection.js
// https://github.com/madapaja/jquery.selection/blob/ae8581d9e84951922268e1d95eff3247b38479d1/src/jquery.selection.js

type SelectionRange = {
  start: number;
  end: number;
};

type Caret = 'keep' | 'start' | 'end';

const getCaretInfo = function (element: HTMLTextAreaElement) {
  const res = {
    text: '',
    start: 0,
    end: 0,
  };

  if (!element.value) {
    return res;
  }

  try {
    res.start = element.selectionStart;
    res.end = element.selectionEnd;
    res.text = element.value.slice(res.start, res.end);
  } catch (e) {
    /* give up */
  }

  return res;
};

export const CaretOperation = {
  getPos: function (element: HTMLTextAreaElement) {
    const tmp = getCaretInfo(element);
    return { start: tmp.start, end: tmp.end };
  },

  setPos: function (
    element: HTMLTextAreaElement,
    toRange: SelectionRange,
    caret: Caret = 'keep'
  ) {
    if (caret === 'start') {
      toRange.end = toRange.start;
    } else if (caret === 'end') {
      toRange.start = toRange.end;
    }

    element.focus();
    try {
      element.setSelectionRange(toRange.start, toRange.end);
    } catch (e) {
      /* give up */
    }
  },

  getText: function (element: HTMLTextAreaElement) {
    return getCaretInfo(element).text;
  },
};
