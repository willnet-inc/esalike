"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTabKey = void 0;
var caret_operation_1 = require("../caret_operation");
var utils_1 = require("../utils");
var handleTabKey = function (e) {
    if (e.target === null)
        return;
    var target = e.target;
    var newPos;
    e.preventDefault();
    var currentLine = (0, utils_1.getCurrentLine)(e);
    var text = target.value;
    var pos = caret_operation_1.CaretOperation.getPos(target);
    if (currentLine) {
        caret_operation_1.CaretOperation.setPos(target, {
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
            caret_operation_1.CaretOperation.setPos(target, { start: newPos, end: newPos });
        }
        else {
            // re indent
            var currentText = caret_operation_1.CaretOperation.getText(target);
            var reindentedText = currentText.replace(/^ {1,4}/gm, '');
            var reindentedCount = currentText.length - reindentedText.length;
            (0, utils_1.replaceText)(target, reindentedText);
            if (currentLine) {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: pos.start - reindentedCount,
                    end: pos.start - reindentedCount,
                });
            }
            else {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: pos.start,
                    end: pos.start + reindentedText.length,
                });
            }
        }
    }
    else {
        if (currentLine && currentLine.text.charAt(0) === '|') {
            // next cell in table
            newPos = text.indexOf('|', pos.start + 1);
            if (newPos < 0 ||
                newPos === text.lastIndexOf('|', currentLine.end - 1)) {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: currentLine.end,
                    end: currentLine.end,
                });
            }
            else {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: newPos + 2,
                    end: newPos + 2,
                });
            }
        }
        else {
            // indent
            var indentedText = '    ' +
                caret_operation_1.CaretOperation.getText(target).split('\n').join('\n    ');
            (0, utils_1.replaceText)(target, indentedText);
            if (currentLine) {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: pos.start + 4,
                    end: pos.start + 4,
                });
            }
            else {
                caret_operation_1.CaretOperation.setPos(target, {
                    start: pos.start,
                    end: pos.start + indentedText.length,
                });
            }
        }
    }
    document.dispatchEvent(new Event('input'));
};
exports.handleTabKey = handleTabKey;
//# sourceMappingURL=tab.js.map