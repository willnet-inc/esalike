"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyMarkdownInputAssist = void 0;
var handler_1 = require("./handler");
var ApplyMarkdownInputAssist = function (editor) {
    editor.addEventListener('keydown', handler_1.KeyDownHandler);
};
exports.ApplyMarkdownInputAssist = ApplyMarkdownInputAssist;
//# sourceMappingURL=index.js.map