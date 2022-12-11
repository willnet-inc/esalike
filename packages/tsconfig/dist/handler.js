"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyDownHandler = void 0;
var enter_1 = require("./handlers/enter");
var space_1 = require("./handlers/space");
var tab_1 = require("./handlers/tab");
var esareaDetected = false;
var isEsareaInstalled = function () {
    if (esareaDetected)
        return true;
    var meta = document.querySelector('meta[name="esarea"]');
    if (meta) {
        esareaDetected = true;
    }
    return esareaDetected;
};
var KeyDownHandler = function (e) {
    // Check a meta tag inserted by esarea in this handler
    // because the tag insertion seems to be asynchronous.
    if (isEsareaInstalled())
        return;
    var key = e.key.toLowerCase();
    if (key === 'tab') {
        (0, tab_1.handleTabKey)(e);
    }
    else if (key === 'enter') {
        (0, enter_1.handleEnterKey)(e);
    }
    else if (
    // FIXME: Strangely `e.key === ' '`  does not work.
    e.code === 'Space' &&
        e.shiftKey &&
        e.altKey) {
        (0, space_1.handleSpaceKey)(e);
    }
};
exports.KeyDownHandler = KeyDownHandler;
//# sourceMappingURL=handler.js.map