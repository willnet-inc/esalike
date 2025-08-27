import 'expect-puppeteer';

describe('Test the assist for list', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001');
  });

  beforeEach(async () => {
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '';
    });
  });

  it('should add a new entry for a list when the enter key is pressed', async () => {
    await page.type('#editor', '- aaa');
    await page.keyboard.press('Enter');
    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('- aaa\n- ');
  });

  it('should insert an indent of four spaces when the tab key is pressed', async () => {
    await page.type('#editor', '- aaa');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('- aaa\n    - ');
  });

  it('should unindent when the shift + tab key is pressed', async () => {
    // Set the default text by JS because '\n' in text triggers the keydown
    // event of the enter key when we use page.type().
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '- aaa\n    - ';
    });

    await page.focus('#editor');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('- aaa\n- ');
  });

  it('should toggle a task list entry when shift + alt + space is pressed', async () => {
    await page.focus('#editor');
    await page.type('#editor', '- [ ] Write a test');
    await page.keyboard.down('Shift');
    await page.keyboard.down('Alt');
    await page.keyboard.press('Space');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Alt');

    await expect(
      await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value)
    ).toBe('- [x] Write a test');
  });

  it('should NOT create new list item when IME composition is active (Japanese input)', async () => {
    // Set initial text with Japanese content
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      editor.value = '- 日本語のテスト';
      editor.setSelectionRange(editor.value.length, editor.value.length);
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

    // Press Enter during composition (should not create new list item)
    await page.evaluate(() => {
      const editor = document.querySelector('#editor') as HTMLTextAreaElement;
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        isComposing: true,
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(enterEvent, 'target', { value: editor });
      editor.dispatchEvent(enterEvent);
    });

    // Verify no new list item was created
    const valueAfterEnter = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(valueAfterEnter).toBe('- 日本語のテスト');

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

    // Now verify normal Enter key behavior works after composition ends
    await page.keyboard.press('Enter');
    const finalValue = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(finalValue).toBe('- 日本語のテスト\n- ');
  });

  it('should handle Japanese text in lists correctly', async () => {
    // Type Japanese text in a list item
    await page.type('#editor', '- これは日本語のテストです');
    
    // Press Enter to create new list item
    await page.keyboard.press('Enter');
    
    // Verify new list item was created with Japanese content preserved
    const valueAfterFirstEnter = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(valueAfterFirstEnter).toBe('- これは日本語のテストです\n- ');

    // Add more Japanese text to the new list item
    await page.type('#editor', '２番目のアイテム');
    
    // Press Enter again
    await page.keyboard.press('Enter');
    
    // Verify both Japanese list items exist
    const finalValueJapanese = await page.$eval('#editor', (el) => (el as HTMLTextAreaElement).value);
    expect(finalValueJapanese).toBe('- これは日本語のテストです\n- ２番目のアイテム\n- ');
  });
});
