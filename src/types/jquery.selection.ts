export type ToRange = {
    start: number
    end: number
}

export type Caret = "keep" | "start" | "end"
export type Mode = "text" | "html"
export type Operation = "replace" | "insert" | "delete" | 'getPos' | 'setPos' | 'get'
export type InsertMode = 'before' | 'after'

export type ReplaceOptions =  { text: string; caret: Caret }
export type InsertOptions =  { text: string; caret: Caret; mode: InsertMode }
export type SetPosOptions = { start: number; end: number}
export type Options = ReplaceOptions | InsertOptions | SetPosOptions
