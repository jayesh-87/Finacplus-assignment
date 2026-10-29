import { test as base, expect } from '@playwright/test';
import { blockThirdPartyRequests } from '#helpers/common/third-party-blocker.js';
import { createTestLog } from '#utils/log.js';

export const test = base.extend({
  testLog: async ({}, use, testInfo) => {
    await use(createTestLog(testInfo));
  },

  page: async ({ page }, use) => {
    await blockThirdPartyRequests(page);
    await use(page);
  },
});

export { expect };
