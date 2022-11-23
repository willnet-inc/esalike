import { CaretOperation } from './caret_operation'

export const getCurrentLine = function (e: KeyboardEvent) {
    if (e.target === null) return

    const target = e.target as HTMLTextAreaElement
    const text = target.value
    const pos = CaretOperation.getPos(target)

    if (!text) {
        return null
    }
    if (pos.start !== pos.end) {
        return null
    }

    const startPos = text.lastIndexOf('\n', pos.start - 1) + 1
    let endPos = text.indexOf('\n', pos.start)
    if (endPos === -1) {
        endPos = text.length
    }
    return {
        text: text.slice(startPos, endPos),
        start: startPos,
        end: endPos,
        caret: pos.start,
        endOfLine: !text.slice(pos.start, endPos).trim(),
    }
}

export const getPrevLine = function (e: KeyboardEvent) {
    if (e.target === null) return

    const target = e.target as HTMLTextAreaElement

    const currentLine = getCurrentLine(e)

    if (currentLine === null || typeof currentLine === 'undefined') {
        return null
    }

    const text = target.value.slice(0, currentLine.start)

    const startPos = text.lastIndexOf('\n', currentLine.start - 2) + 1
    const endPos = currentLine.start
    return {
        text: text.slice(startPos, endPos),
        start: startPos,
        end: endPos,
    }
}

// @see https://mimemo.io/m/mqLXOlJe7ozQ19r
export const replaceText = function (target: HTMLTextAreaElement, str: string) {
    const pos = CaretOperation.getPos(target)
    const fromIdx = pos.start
    const toIdx = pos.end

    if (str === '') return

    target.focus()
    target.selectionStart = fromIdx
    target.selectionEnd = toIdx
    const startText = target.value.slice(0, fromIdx)
    const endText = target.value.slice(toIdx)
    target.value = startText + str + endText
}
