type SelectionRange = {
  start: number;
  end: number;
};
type Caret = "keep" | "start" | "end";
export declare const CaretOperation: {
  getPos: (element: HTMLTextAreaElement) => {
    start: number;
    end: number;
  };
  setPos: (
    element: HTMLTextAreaElement,
    toRange: SelectionRange,
    caret?: Caret
  ) => void;
  getText: (element: HTMLTextAreaElement) => string;
};
export {};
