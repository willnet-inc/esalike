export declare const getCurrentLine: (e: KeyboardEvent) =>
  | {
      text: string;
      start: number;
      end: number;
      caret: number;
      endOfLine: boolean;
    }
  | null
  | undefined;
export declare const getPrevLine: (e: KeyboardEvent) =>
  | {
      text: string;
      start: number;
      end: number;
    }
  | null
  | undefined;
export declare const replaceText: (
  target: HTMLTextAreaElement,
  str: string
) => void;
