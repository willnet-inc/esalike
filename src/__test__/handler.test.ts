import userEvent from '@testing-library/user-event'
import { setUpTextArea } from './utils'
import { handleEnterKey } from '../handlers/enter'
import { handleSpaceKey } from '../handlers/space'
import { handleTabKey } from '../handlers/tab'

jest.mock('../handlers/enter')
jest.mock('../handlers/space')
jest.mock('../handlers/tab')

describe('ApplyMarkdownInputAssist', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('Should watch enter key events', async () => {
        const textarea = setUpTextArea()
        const user = userEvent.setup()

        textarea.focus()

        expect(handleEnterKey).not.toBeCalled()
        expect(handleTabKey).not.toBeCalled()
        expect(handleSpaceKey).not.toBeCalled()

        await user.type(
            textarea,
            `
        - foobar{enter}
        `
        )

        expect(handleEnterKey).toBeCalledTimes(1)
        expect(handleTabKey).toBeCalledTimes(0)
        expect(handleSpaceKey).toBeCalledTimes(0)
    })

    test('Should watch tab key events', async () => {
        const textarea = setUpTextArea()
        const user = userEvent.setup()

        textarea.focus()

        expect(handleEnterKey).not.toBeCalled()
        expect(handleTabKey).not.toBeCalled()
        expect(handleSpaceKey).not.toBeCalled()

        await user.type(
            textarea,
            `
            - foobar
            -{tab}
            `
        )

        expect(handleEnterKey).toBeCalledTimes(0)
        expect(handleTabKey).toBeCalledTimes(1)
        expect(handleSpaceKey).toBeCalledTimes(0)
    })
})
