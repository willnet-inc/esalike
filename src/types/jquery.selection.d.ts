type Caret = "keep" | "start" | "end"
type Mode ="before" | "after"

interface JQuery {
    selection(): string;
    selection(mode: 'getPos'): { start: number, end: number };
    selection(mode: 'setPos', { start: number, end: number }): void;
    selection(mode: 'replace', { text: string, caret: Caret }): void;
    selection(mode: 'insert', { text: string, caret: Caret, mode: Mode }): void;
    selection(mode: 'get'): string;
    selection(mode: string): string;
}
