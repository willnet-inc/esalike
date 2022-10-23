/*!
 * jQuery.selection - jQuery Plugin
 *
 * Copyright (c) 2010-2014 IWASAKI Koji (@madapaja).
 * http://blog.madapaja.net/
 * Under The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { ToRange, Operation, Options, SetPosOptions, ReplaceOptions, InsertOptions } from "./types/jquery.selection";


export default function ($: JQueryStatic, win: Window, doc: Document) {
    /**
     * get caret status of the selection of the element
     *
     * @param   {Element}   element         target DOM element
     * @return  {Object}    return
     * @return  {String}    return.text     selected text
     * @return  {Number}    return.start    start position of the selection
     * @return  {Number}    return.end      end position of the selection
     */
    var _getCaretInfo = function (element: HTMLTextAreaElement) {
        var res = {
            text: '',
            start: 0,
            end: 0
        };

        if (!element.value) {
            /* no value or empty string */
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

    /**
     * caret operation for the element
     * @type {Object}
     */
    var _CaretOperation = {
        /**
         * get caret position
         *
         * @param   {Element}   element         target element
         * @return  {Object}    return
         * @return  {Number}    return.start    start position for the selection
         * @return  {Number}    return.end      end position for the selection
         */
        getPos: function (element: HTMLTextAreaElement) {
            var tmp = _getCaretInfo(element);
            return { start: tmp.start, end: tmp.end };
        },

        /**
         * set caret position
         *
         * @param   {Element}   element         target element
         * @param   {Object}    toRange         caret position
         * @param   {Number}    toRange.start   start position for the selection
         * @param   {Number}    toRange.end     end position for the selection
         * @param   {String}    caret           caret mode: any of the following: "keep" | "start" | "end"
         */
        setPos: function (element: HTMLTextAreaElement, toRange: ToRange, caret: Caret) {
            caret = this._caretMode(caret);

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

        /**
         * get selected text
         *
         * @param   {Element}   element         target element
         * @return  {String}    return          selected text
         */
        getText: function (element: HTMLTextAreaElement) {
            return _getCaretInfo(element).text;
        },

        /**
         * get caret mode
         *
         * @param   {String}    caret           caret mode
         * @return  {String}    return          any of the following: "keep" | "start" | "end"
         */
        _caretMode: function (caret: Caret): Caret {
            // if (caret === false) return 'end'
            if (caret === undefined) return 'keep'
            return caret
        },

        /**
         * replace selected text
         *
         * @param   {Element}   element         target element
         * @param   {String}    text            replacement text
         * @param   {String}    caret           caret mode: any of the following: "keep" | "start" | "end"
         */
        replace: function (element: HTMLTextAreaElement, text: string, caret: Caret) {
            var tmp = _getCaretInfo(element),
                orig = element.value,
                pos = $(element).scrollTop(),
                range = { start: tmp.start, end: tmp.start + text.length };

            element.value = orig.substr(0, tmp.start) + text + orig.substr(tmp.end);

            if (pos === undefined ) return

            $(element).scrollTop(pos);
            this.setPos(element, range, caret);
        },

        /**
         * insert before the selected text
         *
         * @param   {Element}   element         target element
         * @param   {String}    text            insertion text
         * @param   {String}    caret           caret mode: any of the following: "keep" | "start" | "end"
         */
        insertBefore: function (element: HTMLTextAreaElement, text: string, caret: Caret) {
            var tmp = _getCaretInfo(element),
                orig = element.value,
                pos = $(element).scrollTop(),
                range = { start: tmp.start + text.length, end: tmp.end + text.length };

            element.value = orig.substr(0, tmp.start) + text + orig.substr(tmp.start);

            if (pos === undefined ) return

            $(element).scrollTop(pos);
            this.setPos(element, range, caret);
        },

        /**
         * insert after the selected text
         *
         * @param   {Element}   element         target element
         * @param   {String}    text            insertion text
         * @param   {String}    caret           caret mode: any of the following: "keep" | "start" | "end"
         */
        insertAfter: function (element: HTMLTextAreaElement, text: string, caret: Caret) {
            var tmp = _getCaretInfo(element),
                orig = element.value,
                pos = $(element).scrollTop(),
                range = { start: tmp.start, end: tmp.end };

            element.value = orig.substr(0, tmp.end) + text + orig.substr(tmp.end);

            if (pos === undefined ) return

            $(element).scrollTop(pos);
            this.setPos(element, range, caret);
        }
    };

    /* add jQuery.selection */
    $.extend({
        /**
         * get selected text on the window
         *
         * @param   {String}    mode            selection mode: any of the following: "text" | "html"
         * @return  {String}    return
         */
        selection: function (mode: Mode): string {
            var getText = ((mode || 'text').toLowerCase() === 'text');

            try {
                if (getText) {
                    // get text
                    return (win.getSelection()?.toString() || '')
                } else {
                    // get html
                    var sel = win.getSelection()
                    var range;

                    if (sel === null || sel.anchorNode === null || sel.focusNode === null) return ''

                    if (sel.getRangeAt) {
                        range = sel.getRangeAt(0);
                    } else {
                        range = doc.createRange();
                        range.setStart(sel.anchorNode, sel.anchorOffset);
                        range.setEnd(sel.focusNode, sel.focusOffset);
                    }

                    return $('<div></div>').append(range.cloneContents()).html();
                }
            } catch (e) {
                /* give up */
            }

            return '';
        }
    });

    /* add selection */
    $.fn.extend({
        selection: function (mode: Operation, opts: Options | undefined) {
            const elements = this as HTMLTextAreaElement[]

            switch (mode) {
                /**
                 * selection('getPos')
                 * get caret position
                 *
                 * @return  {Object}    return
                 * @return  {Number}    return.start    start position for the selection
                 * @return  {Number}    return.end      end position for the selection
                 */
                case 'getPos':
                    return _CaretOperation.getPos(elements[0]);

                /**
                 * selection('setPos', opts)
                 * set caret position
                 *
                 * @param   {Number}    opts.start      start position for the selection
                 * @param   {Number}    opts.end        end position for the selection
                 */
                case 'setPos':
                    return Array.prototype.forEach.call(elements, function (elem) {
                        _CaretOperation.setPos(elem, opts as SetPosOptions, 'end');
                    });

                /**
                 * selection('replace', opts)
                 * replace the selected text
                 *
                 * @param   {String}    opts.text            replacement text
                 * @param   {String}    opts.caret           caret mode: any of the following: "keep" | "start" | "end"
                 */
                case 'replace':
                    const replaceOpts = opts as ReplaceOptions
                    return Array.prototype.forEach.call(elements, function (elem) {
                        _CaretOperation.replace(elem, replaceOpts.text, replaceOpts.caret);
                    });

                /**
                 * selection('insert', opts)
                 * insert before/after the selected text
                 *
                 * @param   {String}    opts.text            insertion text
                 * @param   {String}    opts.caret           caret mode: any of the following: "keep" | "start" | "end"
                 * @param   {String}    opts.mode            insertion mode: any of the following: "before" | "after"
                 */
                case 'insert':
                    const insertOptions = opts as InsertOptions
                    return Array.prototype.forEach.call(elements, function (elem) {
                        if (insertOptions.mode === 'before') {
                            _CaretOperation.insertBefore(elem, insertOptions.text, insertOptions.caret);
                        } else {
                            _CaretOperation.insertAfter(elem, insertOptions.text, insertOptions.caret);
                        }
                    });

                /**
                 * selection('get')
                 * get selected text
                 *
                 * @return  {String}    return
                 */
                case 'get':
                /* falls through */
                default:
                    return _CaretOperation.getText(elements[0]);
            }

            // return elements;
        }
    });
}
