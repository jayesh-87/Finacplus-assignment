import { defineConfig, devices } from '@playwright/test';
import * as EnvUtil from './utils/env-util.js';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: isCi,
  timeout: 120_000,
  retries: 0,
  workers: 1,
  outputDir: 'test-results',
  expect: {
    timeout: 15_000,
  },
  reporter: isCi
    ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    headless: EnvUtil.isHeadless(),
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testMatch: /\/ui\/.*\.spec\.js$/,
      use: { ...devices['Desktop Chrome'], baseURL: EnvUtil.getBaseUrl(), viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'reqres',
      testMatch: /\/api\/.*\.spec\.js$/,
      use: {
        baseURL: EnvUtil.getReqresBaseUrl(),
        extraHTTPHeaders: { 'x-api-key': EnvUtil.getReqresApiKey(), Accept: 'application/json' },
      },
    },
  ],
});
