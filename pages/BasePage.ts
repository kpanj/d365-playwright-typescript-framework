import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async getRecordIdFromUrl(): Promise<string | null> {
    const url = this.page.url();
    const match = url.match(/[\?&]id=([a-f0-9-]{36})/i);
    return match ? match[1] : null;
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.clear();
    await locator.fill(value);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.click();
  }

  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }
}
