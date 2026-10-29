import { expect } from '@playwright/test';

const userNameValue = (page) => page.locator('#userName-value');
const logoutButton = (page) => page.getByRole('button', { name: 'Logout', exact: true });
const goToBookStoreButton = (page) => page.getByRole('button', { name: 'Go To Book Store', exact: true });

export function ProfilePage(page) {
  return {
    async expectLoggedInAs(userName) {
      await expect(userNameValue(page), 'logged-in username').toHaveText(userName);
      await expect(logoutButton(page), 'Logout button').toBeVisible();
      await expect(logoutButton(page), 'Logout button').toBeEnabled();
    },

    async goToBookStore() {
      await goToBookStoreButton(page).click();
      await expect(page, 'navigated to the book store').toHaveURL(/\/books$/);
    },
  };
}
