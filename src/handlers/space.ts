import { CaretOperation } from '../caret_operation'
import { getCurrentLine, replaceText } from '../utils'

export const handleSpaceKey = function (e: KeyboardEvent) {
    if (e.target === null) return

    const target = e.target as HTMLTextAreaElement

    let currentLine, match
    if (!e.shiftKey || !e.altKey) {
        return
    }
    if (!(currentLine = getCurrentLine(e))) {
        return
    }
    if (
        (match = currentLine.text.match(
            /^(\s*)(-|\+|\*|\d+\.) (?:\[(x| )\] )(.*)/
        ))
    ) {
        e.preventDefault()
        const checkMark = match[3] === ' ' ? 'x' : ' '
        const replaceTo = `${match[1]}${match[2]} [${checkMark}] ${match[4]}`
        CaretOperation.setPos(target, {
            start: currentLine.start,
            end: currentLine.end,
        })
        replaceText(target, replaceTo)
        CaretOperation.setPos(target, {
            start: currentLine.caret,
            end: currentLine.caret,
        })
        document.dispatchEvent(new Event('input'))
    }
}
