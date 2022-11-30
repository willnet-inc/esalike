import { KeyDownHandler } from './handler'

export const ApplyMarkdownInputAssist = function (
    editor: HTMLTextAreaElement
): void {
    editor.addEventListener('keydown', KeyDownHandler)
}
