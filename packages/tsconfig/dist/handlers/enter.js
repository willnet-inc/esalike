"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEnterKey = void 0;
var caret_operation_1 = require("../caret_operation");
var utils_1 = require("../utils");
var RegExpList = {
    listMarker: /^(\s*(?:-|\+|\*|\d+\.) )/,
    listMarkerWithPossibleCheckbox: /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] )?)\s*\S/,
    emptyListItem: /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] ))\s*$/,
};
var handleEnterKey = function (e) {
    if (e.target === null)
        return;
    var target = e.target;
    var currentLine, match;
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return;
    } // for cmd + enter
    if (!(currentLine = (0, utils_1.getCurrentLine)(e))) {
        return;
    }
    if (currentLine.start === currentLine.caret) {
        return;
    }
    if ((match = currentLine.text.match(RegExpList.listMarkerWithPossibleCheckbox))) {
        // smart indent with list
        var listMarkMatch = void 0;
        if (currentLine.text.match(RegExpList.emptyListItem)) {
            // empty task list
            caret_operation_1.CaretOperation.setPos(target, {
                start: currentLine.start,
                end: currentLine.end - 1,
            });
            return;
        }
        e.preventDefault();
        var listMark = match[1].replace(/\[x\]/, '[ ]');
        if ((listMarkMatch = listMark.match(/^(\s*)(\d+)\./))) {
            var indent = listMarkMatch[1];
            var num = parseInt(listMarkMatch[2]);
            if (num !== 1) {
                listMark = listMark.replace(/\s*\d+/, "".concat(indent).concat(num + 1));
            }
        }
        (0, utils_1.replaceText)(target, '\n' + listMark);
        var caretTo = currentLine.caret + listMark.length + 1;
        caret_operation_1.CaretOperation.setPos(target, { start: caretTo, end: caretTo });
    }
    else if (currentLine.text.match(RegExpList.listMarker)) {
        // remove list
        caret_operation_1.CaretOperation.setPos(target, {
            start: currentLine.start,
            end: currentLine.end,
        });
    }
    else if (currentLine.text.match(/^.*\|\s*$/)) {
        // new row for table
        if (currentLine.text.match(/^[|\s]+$/)) {
            caret_operation_1.CaretOperation.setPos(target, {
                start: currentLine.start,
                end: currentLine.end,
            });
            return;
        }
        if (!currentLine.endOfLine) {
            return;
        }
        e.preventDefault();
        var row = [];
        var m = currentLine.text.match(/\|/g);
        if (m === null) {
            return;
        }
        for (var _i = 0, _a = Array.from(m); _i < _a.length; _i++) {
            match = _a[_i];
            row.push('|');
        }
        var prevLine = (0, utils_1.getPrevLine)(e);
        if (!prevLine ||
            (!currentLine.text.match(/---/) && !prevLine.text.match(/\|/g))) {
            (0, utils_1.replaceText)(target, '\n' + row.join(' --- ') + '\n' + row.join('  '));
            caret_operation_1.CaretOperation.setPos(target, {
                start: currentLine.caret + 6 * row.length - 1,
                end: currentLine.caret + 6 * row.length - 1,
            });
        }
        else {
            (0, utils_1.replaceText)(target, '\n' + row.join('  '));
            caret_operation_1.CaretOperation.setPos(target, {
                start: currentLine.caret + 3,
                end: currentLine.caret + 3,
            });
        }
    }
    document.dispatchEvent(new Event('input'));
};
exports.handleEnterKey = handleEnterKey;
//# sourceMappingURL=enter.js.map