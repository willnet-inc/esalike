import 'expect-puppeteer';

describe('Test the assist for table', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001');
  });

  beforeEach(async () => {
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '';
    });
  });

  it('should add a new row for a table when the table header is entered', async () => {
    await page.type('#editor', '|foo|bar|');

    await page.keyboard.press('Enter');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('|foo|bar|\n| --- | --- |\n|  |  |');
  });

  it('should move to the next cell when the tab key is pressed inside a table cell', async () => {
    await page.type('#editor', '|foo|bar|');

    await page.keyboard.press('Enter');
    await page.keyboard.type('abc');
    await page.keyboard.press('Tab');
    await page.keyboard.type('xyz');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('|foo|bar|\n| --- | --- |\n| abc | xyz |');
  });

  it('should delete a row which contains no text in all cells when the enter key is pressed at the tail of the row', async () => {
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '|foo|bar|\n| --- | --- |\n|  |  |';
    });

    await page.focus('#editor');
    await page.keyboard.press('Enter');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('|foo|bar|\n| --- | --- |\n\n');
  });

  it('should add new row when the enter key is pressed at the tail of the last row', async () => {
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '|foo|bar|\n| --- | --- |\n| abc |  |';
    });

    await page.focus('#editor');
    await page.keyboard.press('Enter');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('|foo|bar|\n| --- | --- |\n| abc |  |\n|  |  |');
  });

  it('should NOT move to next cell when Tab is pressed during IME composition in table', async () => {
    // Set initial table with Japanese text
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '|名前|値|\n| --- | --- |\n| テスト | xyz |';
      // Set cursor in first cell of data row
      editor.setSelectionRange(24, 24); // After "テスト"
    });

    await page.focus('#editor');

    // Simulate composition start (IME begins)
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      const compositionStartEvent = new CompositionEvent('compositionstart', {
        data: '',
        bubbles: true,
        cancelable: true
      });
      editor.dispatchEvent(compositionStartEvent);
    });

    // Press Tab during composition (should not move to next cell)
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        bubbles: true,
        cancelable: true
      });
      // Override isComposing property
      Object.defineProperty(tabEvent, 'isComposing', {
        value: true,
        writable: false
      });
      editor.dispatchEvent(tabEvent);
    });

    // Verify table structure remained unchanged
    const valueAfterTab = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(valueAfterTab).toBe('|名前|値|\n| --- | --- |\n| テスト | xyz |');

    // End composition (IME confirms input)
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      const compositionEndEvent = new CompositionEvent('compositionend', {
        data: '',
        bubbles: true,
        cancelable: true
      });
      editor.dispatchEvent(compositionEndEvent);
    });

    // Restore cursor position for normal Tab behavior test
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.setSelectionRange(24, 24); // After "テスト"
    });

    // Now verify normal Tab key behavior works after composition ends
    await page.keyboard.press('Tab');
    const finalValue = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(finalValue).toBe('|名前|値|\n| --- | --- |\n| テスト | xyz |');

    // Verify cursor moved to next cell
    const cursorPosition = await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      return editor.selectionStart;
    });
    expect(cursorPosition).toBe(29); // Should be in the "xyz" cell
  });
});
