import { CaretOperation } from './caret_operation'

export const KeyDownHandler = function (
    this: HTMLTextAreaElement,
    e: KeyboardEvent
): void {
    switch (e.code) {
        case 'Tab':
            handleTabKey(e)
            break
        case 'Enter':
            handleEnterKey(e)
            break
        case 'Space':
            handleSpaceKey(e)
            break
    }
}

const handleTabKey = function (e: KeyboardEvent) {
    if (e.target === null) return

    const target = e.target as HTMLTextAreaElement

    let newPos
    e.preventDefault()

    const currentLine = getCurrentLine(e)
    const text = target.value
    const pos = CaretOperation.getPos(target)

    if (currentLine) {
        CaretOperation.setPos(target, {
            start: currentLine.start,
            end: currentLine.end,
        })
    }

    if (e.shiftKey) {
        if (currentLine && currentLine.text.charAt(0) === '|') {
            // prev cell in table
            newPos = text.lastIndexOf('|', pos.start - 1)
            if (newPos > 1) {
                newPos -= 1
            }
            CaretOperation.setPos(target, { start: newPos, end: newPos })
        } else {
            // re indent
            const currentText = CaretOperation.getText(target)
            const reindentedText = currentText.replace(/^ {1,4}/gm, '')
            const reindentedCount = currentText.length - reindentedText.length

            replaceText(target, reindentedText)

            if (currentLine) {
                CaretOperation.setPos(target, {
                    start: pos.start - reindentedCount,
                    end: pos.start - reindentedCount,
                })
            } else {
                CaretOperation.setPos(target, {
                    start: pos.start,
                    end: pos.start + reindentedText.length,
                })
            }
        }
    } else {
        if (currentLine && currentLine.text.charAt(0) === '|') {
            // next cell in table
            newPos = text.indexOf('|', pos.start + 1)
            if (
                newPos < 0 ||
                newPos === text.lastIndexOf('|', currentLine.end - 1)
            ) {
                CaretOperation.setPos(target, {
                    start: currentLine.end,
                    end: currentLine.end,
                })
            } else {
                CaretOperation.setPos(target, {
                    start: newPos + 2,
                    end: newPos + 2,
                })
            }
        } else {
            // indent
            const indentedText =
                '    ' +
                CaretOperation.getText(target).split('\n').join('\n    ')
            replaceText(target, indentedText)
            if (currentLine) {
                CaretOperation.setPos(target, {
                    start: pos.start + 4,
                    end: pos.start + 4,
                })
            } else {
                CaretOperation.setPos(target, {
                    start: pos.start,
                    end: pos.start + indentedText.length,
                })
            }
        }
    }
    document.dispatchEvent(new Event('input'))
}

const handleEnterKey = function (e: KeyboardEvent) {
    if (e.target === null) return

    const target = e.target as HTMLTextAreaElement

    let currentLine, match
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return
    } // for cmd + enter
    if (!(currentLine = getCurrentLine(e))) {
        return
    }
    if (currentLine.start === currentLine.caret) {
        return
    }
    if (
        (match = currentLine.text.match(
            /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] )?)\s*\S/
        ))
    ) {
        // smart indent with list
        let listMarkMatch
        if (
            currentLine.text.match(
                /^(\s*(?:-|\+|\*|\d+\.) (?:\[(?:x| )\] ))\s*$/
            )
        ) {
            // empty task list
            CaretOperation.setPos(target, {
                start: currentLine.start,
                end: currentLine.end - 1,
            })
            return
        }
        e.preventDefault()
        let listMark = match[1].replace(/\[x\]/, '[ ]')
        if ((listMarkMatch = listMark.match(/^(\s*)(\d+)\./))) {
            const indent = listMarkMatch[1]
            const num = parseInt(listMarkMatch[2])
            if (num !== 1) {
                listMark = listMark.replace(/\s*\d+/, `${indent}${num + 1}`)
            }
        }
        replaceText(target, '\n' + listMark)
        const caretTo = currentLine.caret + listMark.length + 1
        CaretOperation.setPos(target, { start: caretTo, end: caretTo })
    } else if (currentLine.text.match(/^(\s*(?:-|\+|\*|\d+\.) )/)) {
        // remove list
        CaretOperation.setPos(target, {
            start: currentLine.start,
            end: currentLine.end,
        })
    } else if (currentLine.text.match(/^.*\|\s*$/)) {
        // new row for table
        if (currentLine.text.match(/^[|\s]+$/)) {
            CaretOperation.setPos(target, {
                start: currentLine.start,
                end: currentLine.end,
            })
            return
        }
        if (!currentLine.endOfLine) {
            return
        }
        e.preventDefault()
        const row: string[] = []
        const m = currentLine.text.match(/\|/g)
        if (m === null) {
            return
        }

        for (match of Array.from(m)) {
            row.push('|')
        }
        const prevLine = getPrevLine(e)
        if (
            !prevLine ||
            (!currentLine.text.match(/---/) && !prevLine.text.match(/\|/g))
        ) {
            replaceText(
                target,
                '\n' + row.join(' --- ') + '\n' + row.join('  ')
            )
            CaretOperation.setPos(target, {
                start: currentLine.caret + 6 * row.length - 1,
                end: currentLine.caret + 6 * row.length - 1,
            })
        } else {
            replaceText(target, '\n' + row.join('  '))
            CaretOperation.setPos(target, {
                start: currentLine.caret + 3,
                end: currentLine.caret + 3,
            })
        }
    }
    document.dispatchEvent(new Event('input'))
}

const handleSpaceKey = function (e: KeyboardEvent) {
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

const getCurrentLine = function (e: KeyboardEvent) {
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

const getPrevLine = function (e: KeyboardEvent) {
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
const replaceText = function (target: HTMLTextAreaElement, str: string) {
    const pos = CaretOperation.getPos(target)
    const fromIdx = pos.start
    const toIdx = pos.end
    let inserted = false

    if (str) {
        const expectedLen =
            target.value.length - Math.abs(toIdx - fromIdx) + str.length
        target.focus()
        target.selectionStart = fromIdx
        target.selectionEnd = toIdx

        // NOTE: Without this `return`, new empty list item is highlighted.
        // return

        try {
            inserted = document.execCommand('insertText', false, str)
        } catch (_e) {
            inserted = false
        }

        if (
            inserted &&
            (target.value.length !== expectedLen ||
                target.value.substr(fromIdx, str.length) !== str)
        ) {
            //firefoxでなぜかうまくいってないくせにinsertedがtrueになるので失敗を検知してfalseに…
            inserted = false
        }
    }
    if (!inserted) {
        const { value } = target
        target.value =
            '' + value.substring(0, fromIdx) + str + value.substring(toIdx)
    }
    target.dispatchEvent(new Event('blur'))
    target.dispatchEvent(new Event('focus'))
}
