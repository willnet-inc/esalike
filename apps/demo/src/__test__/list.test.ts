import "expect-puppeteer";

describe("Test the assist for list", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3001");
  });

  beforeEach(async () => {
    await page.evaluate(() => {
      const editor = document.querySelector("#editor") as HTMLTextAreaElement;
      editor.value = "";
    });
  });

  it("should add a new entry for a list when the enter key is pressed", async () => {
    await page.type("#editor", "- aaa");
    await page.keyboard.press("Enter");
    await expect(
      await page.$eval("#editor", (el) => (el as HTMLTextAreaElement).value)
    ).toBe("- aaa\n- ");
  });

  it("should insert an indent of four spaces when the tab key is pressed", async () => {
    await page.type("#editor", "- aaa");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(
      await page.$eval("#editor", (el) => (el as HTMLTextAreaElement).value)
    ).toBe("- aaa\n    - ");
  });

  it("should unindent when the shift + tab key is pressed", async () => {
    // Set the default text by JS because '\n' in text triggers the keydown
    // event of the enter key when we use page.type().
    await page.evaluate(() => {
      const editor = document.querySelector("#editor") as HTMLTextAreaElement;
      editor.value = "- aaa\n    - ";
    });

    await page.focus("#editor");
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");

    await expect(
      await page.$eval("#editor", (el) => (el as HTMLTextAreaElement).value)
    ).toBe("- aaa\n- ");
  });

  it("should toggle a task list entry when shift + alt + space is pressed", async () => {
    await page.focus("#editor");
    await page.type("#editor", "- [ ] Write a test");
    await page.keyboard.down("Shift");
    await page.keyboard.down("Alt");
    await page.keyboard.press("Space");
    await page.keyboard.up("Shift");
    await page.keyboard.up("Alt");

    await expect(
      await page.$eval("#editor", (el) => (el as HTMLTextAreaElement).value)
    ).toBe("- [x] Write a test");
  });
});
