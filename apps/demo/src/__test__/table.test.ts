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
});
