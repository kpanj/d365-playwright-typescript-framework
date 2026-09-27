import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/environment';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly passwordInput: Locator;
  readonly staySignedInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="loginfmt"]');
    this.submitButton = page.locator('input[type="submit"]');
    this.passwordInput = page.locator('input[name="passwd"]');
    this.staySignedInButton = page.locator('#idSIButton9, input[value="Yes"]');
  }

  async login(username = config.username, password = config.password): Promise<void> {
    await this.navigateTo(config.baseUrl);

    // If redirected to Microsoft SSO Login
    if (this.page.url().includes('login.microsoftonline.com')) {
      await this.emailInput.waitFor({ state: 'visible', timeout: 20000 });
      await this.emailInput.fill(username);
      await this.submitButton.click();

      await this.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
      await this.passwordInput.fill(password);
      await this.submitButton.click();

      // Handle "Stay signed in?" prompt if presented
      try {
        await this.staySignedInButton.waitFor({ state: 'visible', timeout: 8000 });
        await this.staySignedInButton.click();
      } catch (e) {
        // Prompt may not appear if previously accepted
      }
    }

    // Wait for redirect to Dynamics 365 app URL
    await this.page.waitForURL(url => url.toString().includes('dynamics.com') && !url.toString().includes('login.microsoftonline'), { timeout: 60000 });
  }
}
