declare global {
  const ESAREA: boolean;
}

import { ApplyMarkdownInputAssist } from 'esalike';

const editor = document.getElementById('editor') as HTMLTextAreaElement;

ApplyMarkdownInputAssist(editor);
