import { handleEnterKey } from './handlers/enter'
import { handleSpaceKey } from './handlers/space'
import { handleTabKey } from './handlers/tab'

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
