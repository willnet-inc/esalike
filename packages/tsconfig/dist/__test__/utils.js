"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpTextArea = void 0;
var index_1 = require("../index");
var editorTestId = 'editor';
var setUpTextArea = function () {
    var editorElement = document.querySelector("[data-testid=\"".concat(editorTestId, "\"]"));
    if (editorElement) {
        // ApplyMarkdownInputAssist(editorElement)
        return editorElement;
    }
    var newEditor = document.createElement('textarea');
    newEditor.dataset.testid = editorTestId;
    document.body.appendChild(newEditor);
    (0, index_1.ApplyMarkdownInputAssist)(newEditor);
    return newEditor;
};
exports.setUpTextArea = setUpTextArea;
//# sourceMappingURL=utils.js.map