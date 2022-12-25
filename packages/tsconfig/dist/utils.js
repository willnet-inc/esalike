"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceText = exports.getPrevLine = exports.getCurrentLine = void 0;
var caret_operation_1 = require("./caret_operation");
var getCurrentLine = function (e) {
    if (e.target === null)
        return;
    var target = e.target;
    var text = target.value;
    var pos = caret_operation_1.CaretOperation.getPos(target);
    if (!text) {
        return null;
    }
    if (pos.start !== pos.end) {
        return null;
    }
    var startPos = text.lastIndexOf('\n', pos.start - 1) + 1;
    var endPos = text.indexOf('\n', pos.start);
    if (endPos === -1) {
        endPos = text.length;
    }
    return {
        text: text.slice(startPos, endPos),
        start: startPos,
        end: endPos,
        caret: pos.start,
        endOfLine: !text.slice(pos.start, endPos).trim(),
    };
};
exports.getCurrentLine = getCurrentLine;
var getPrevLine = function (e) {
    if (e.target === null)
        return;
    var target = e.target;
    var currentLine = (0, exports.getCurrentLine)(e);
    if (currentLine === null || typeof currentLine === 'undefined') {
        return null;
    }
    var text = target.value.slice(0, currentLine.start);
    var startPos = text.lastIndexOf('\n', currentLine.start - 2) + 1;
    var endPos = currentLine.start;
    return {
        text: text.slice(startPos, endPos),
        start: startPos,
        end: endPos,
    };
};
exports.getPrevLine = getPrevLine;
var replaceText = function (target, str) {
    var pos = caret_operation_1.CaretOperation.getPos(target);
    var fromIdx = pos.start;
    var toIdx = pos.end;
    if (str === '')
        return;
    target.focus();
    target.selectionStart = fromIdx;
    target.selectionEnd = toIdx;
    // execCommand('insertText') is a deprecated API, but apparently it is
    // the only way to support undo / redo for text set in JS.
    //
    // execCommand('insertText') has been supported by Firefox since 89.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
    if (!document.execCommand('insertText', false, str)) {
        // It should not happen because most browsers support execCommand('insertText').
        // But just in case, we use the fallback.
        // See https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand for more details.
        var startText = target.value.slice(0, fromIdx);
        var endText = target.value.slice(toIdx);
        target.value = startText + str + endText;
    }
};
exports.replaceText = replaceText;
//# sourceMappingURL=utils.js.map