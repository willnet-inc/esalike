"use strict";
// Extracted from jquery.selection.js
// https://github.com/madapaja/jquery.selection/blob/ae8581d9e84951922268e1d95eff3247b38479d1/src/jquery.selection.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaretOperation = void 0;
var getCaretInfo = function (element) {
    var res = {
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
    }
    catch (e) {
        /* give up */
    }
    return res;
};
exports.CaretOperation = {
    getPos: function (element) {
        var tmp = getCaretInfo(element);
        return { start: tmp.start, end: tmp.end };
    },
    setPos: function (element, toRange, caret) {
        if (caret === void 0) { caret = 'keep'; }
        if (caret === 'start') {
            toRange.end = toRange.start;
        }
        else if (caret === 'end') {
            toRange.start = toRange.end;
        }
        element.focus();
        try {
            element.setSelectionRange(toRange.start, toRange.end);
        }
        catch (e) {
            /* give up */
        }
    },
    getText: function (element) {
        return getCaretInfo(element).text;
    },
};
//# sourceMappingURL=caret_operation.js.map