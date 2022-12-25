"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSpaceKey = void 0;
var caret_operation_1 = require("../caret_operation");
var utils_1 = require("../utils");
var handleSpaceKey = function (e) {
    if (e.target === null)
        return;
    var currentLine = (0, utils_1.getCurrentLine)(e);
    if (!currentLine)
        return;
    var target = e.target;
    var match = currentLine.text.match(/^(\s*)(-|\+|\*|\d+\.) (?:\[(x| )\] )(.*)/);
    if (match) {
        e.preventDefault();
        var checkMark = match[3] === ' ' ? 'x' : ' ';
        var replaceTo = "".concat(match[1]).concat(match[2], " [").concat(checkMark, "] ").concat(match[4]);
        caret_operation_1.CaretOperation.setPos(target, {
            start: currentLine.start,
            end: currentLine.end,
        });
        (0, utils_1.replaceText)(target, replaceTo);
        caret_operation_1.CaretOperation.setPos(target, {
            start: currentLine.caret,
            end: currentLine.caret,
        });
        document.dispatchEvent(new Event('input'));
    }
};
exports.handleSpaceKey = handleSpaceKey;
//# sourceMappingURL=space.js.map