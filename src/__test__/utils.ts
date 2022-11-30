import { ApplyMarkdownInputAssist } from '../index'
import userEvent from '@testing-library/user-event'
import { screen, prettyDOM } from '@testing-library/dom'

const editorTestId = 'editor'

export const setUpTextArea = (): HTMLTextAreaElement => {
    const editorElement = document.querySelector(
        `[data-testid="${editorTestId}"]`
    ) as HTMLTextAreaElement

    if (editorElement) {
        // ApplyMarkdownInputAssist(editorElement)
        return editorElement
    }

    const newEditor = document.createElement('textarea') as HTMLTextAreaElement

    newEditor.dataset.testid = editorTestId
    document.body.appendChild(newEditor)

    ApplyMarkdownInputAssist(newEditor)

    return newEditor
}
