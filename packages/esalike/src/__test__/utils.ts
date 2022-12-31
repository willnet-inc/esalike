import { ApplyMarkdownInputAssist } from '../index';

const editorTestId = 'editor';

type Options = {
  esareaDisabled: boolean
}

const defaultOptions: Options = {
  esareaDisabled: true
}

export const setUpTextArea = (options = defaultOptions): HTMLTextAreaElement => {
  const newEditor = document.createElement('textarea') as HTMLTextAreaElement;

  newEditor.dataset.testid = editorTestId;

  if (options.esareaDisabled) {
    newEditor.dataset.esareaDisabled = 'true'
  }

  document.body.appendChild(newEditor);

  ApplyMarkdownInputAssist(newEditor);

  return newEditor;
};
