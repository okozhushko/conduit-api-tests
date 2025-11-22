import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://conduit.bondaracademy.com',
    trace: 'on-all-retries'
  },

  projects: [
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
      dependencies: ['api-smoke-tests']
    },
    {
      name: 'api-smoke-tests',
      testDir: './tests/api-tests',
      testMatch: 'example*'
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui-tests',
      use: {
        defaultBrowserType: 'chromium'
      }
    }
  ],
});
