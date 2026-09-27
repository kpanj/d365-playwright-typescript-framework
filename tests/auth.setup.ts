import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/environment';

setup('Authenticate & Save Storage State', async ({ page }) => {
  console.log('Running Authentication Setup Project...');
  const loginPage = new LoginPage(page);
  await loginPage.login(config.username, config.password);

  // Allow D365 app frame to load and set session cookies
  await page.waitForTimeout(8000);

  await page.context().storageState({ path: config.storageStatePath });
  console.log(`Saved authenticated state to ${config.storageStatePath}`);
});
