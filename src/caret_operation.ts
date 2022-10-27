// Extracted from jquery.selection.js
// https://github.com/madapaja/jquery.selection/blob/ae8581d9e84951922268e1d95eff3247b38479d1/src/jquery.selection.js

type SelectionRange = {
    start: number
    end: number
}

type Caret = 'keep' | 'start' | 'end'

const getCaretInfo = function (element: HTMLTextAreaElement) {
    var res = {
        text: '',
        start: 0,
        end: 0,
    }

    if (!element.value) {
        /* no value or empty string */
        return res
    }

    try {
        res.start = element.selectionStart
        res.end = element.selectionEnd
        res.text = element.value.slice(res.start, res.end)
    } catch (e) {
        /* give up */
    }

    return res
}

export const CaretOperation = {
    /**
     * get caret position
     */
    getPos: function (element: HTMLTextAreaElement) {
        const tmp = getCaretInfo(element)
        return { start: tmp.start, end: tmp.end }
    },

    /**
     * set caret position
     */
    setPos: function (
        element: HTMLTextAreaElement,
        toRange: SelectionRange,
        caret: Caret = 'keep'
    ) {
        if (caret === 'start') {
            toRange.end = toRange.start
        } else if (caret === 'end') {
            toRange.start = toRange.end
        }

        element.focus()
        try {
            element.setSelectionRange(toRange.start, toRange.end)
        } catch (e) {
            /* give up */
        }
    },

    /**
     * get selected text
     */
    getText: function (element: HTMLTextAreaElement) {
        return getCaretInfo(element).text
    },

    /**
     * replace selected text
     *
     * @param   {Element}   element         target element
     * @param   {String}    text            replacement text
     * @param   {String}    caret           caret mode: any of the following: "keep" | "start" | "end"
     */
    replace: function (
        element: HTMLTextAreaElement,
        text: string,
        caret: Caret
    ) {
        const tmp = getCaretInfo(element),
            orig = element.value,
            pos = element.scrollTop,
            range = { start: tmp.start, end: tmp.start + text.length }

        element.value = orig.substr(0, tmp.start) + text + orig.substr(tmp.end)

        if (pos === undefined) return

        element.scrollTop = pos
        this.setPos(element, range, caret)
    },

    /**
     * insert before the selected text
     */
    insertBefore: function (
        element: HTMLTextAreaElement,
        text: string,
        caret: Caret
    ) {
        const tmp = getCaretInfo(element),
            orig = element.value,
            pos = element.scrollTop,
            range = {
                start: tmp.start + text.length,
                end: tmp.end + text.length,
            }

        element.value =
            orig.substr(0, tmp.start) + text + orig.substr(tmp.start)

        if (pos === undefined) return

        element.scrollTop = pos
        this.setPos(element, range, caret)
    },

    /**
     * insert after the selected text
     */
    insertAfter: function (
        element: HTMLTextAreaElement,
        text: string,
        caret: Caret
    ) {
        const tmp = getCaretInfo(element),
            orig = element.value,
            pos = element.scrollTop,
            range = { start: tmp.start, end: tmp.end }

        element.value = orig.substr(0, tmp.end) + text + orig.substr(tmp.end)

        if (pos === undefined) return

        element.scrollTop = pos
        this.setPos(element, range, caret)
    },
}
