import { expect } from '@playwright/test';

const bookStoreApplicationCard = (page) => page.locator('.card').filter({ hasText: /^Book Store Application$/ });

export function HomePage(page) {
  return {
    async goto() {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(bookStoreApplicationCard(page), 'Book Store Application card').toBeVisible();
    },

    async openBookStoreApplication() {
      await bookStoreApplicationCard(page).click();
      await expect(page, 'Book Store Application opened').toHaveURL(/\/books$/);
    },
  };
}
