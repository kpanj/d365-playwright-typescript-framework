import { defineConfig, devices } from '@playwright/test';
import { config } from './config/environment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Dynamics 365 UI actions should run sequentially per worker to prevent session conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker recommended for CRM tenant session safety
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  timeout: 120000,
  expect: {
    timeout: 20000
  },
  use: {
    baseURL: config.baseUrl,
    headless: false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    actionTimeout: 20000,
    navigationTimeout: 60000
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: config.storageStatePath
      },
      dependencies: ['setup']
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        storageState: config.storageStatePath
      },
      dependencies: ['setup']
    },
    {
      name: 'hybrid',
      testMatch: /.*\.hybrid\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: config.storageStatePath
      },
      dependencies: ['setup']
    }
  ]
});
