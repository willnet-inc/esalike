import { handleEnterKey } from './handlers/enter'
import { handleSpaceKey } from './handlers/space'
import { handleTabKey } from './handlers/tab'

let esareaDetected = false

const isEsareaInstalled = (): boolean => {
    if (esareaDetected) return true

    const meta = document.querySelector('meta[name="esarea"]')

    if (meta) {
        esareaDetected = true
    }

    return esareaDetected
}

export const KeyDownHandler = function (
    this: HTMLTextAreaElement,
    e: KeyboardEvent
): void {
    // Check a meta tag inserted by esarea in this handler
    // because the tag insertion seems to be asynchronous.
    if (isEsareaInstalled()) return

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

export const ApplyMarkdownInputAssist = function (
    editor: HTMLTextAreaElement
): void {
    editor.addEventListener('keydown', KeyDownHandler)
}
