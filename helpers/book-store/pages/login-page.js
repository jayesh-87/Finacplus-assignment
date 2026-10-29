import { expect } from '@playwright/test';

// why: demoqa's login regularly takes 6-13s, too close to the 15s default expect timeout.
const LOGIN_TIMEOUT_MS = 30_000;

const userNameInput = (page) => page.locator('#userName');
const passwordInput = (page) => page.locator('#password');
const loginButton = (page) => page.locator('#login');
const newUserButton = (page) => page.locator('#newUser');

export function LoginPage(page) {
  return {
    async expectLoaded() {
      await expect(page, 'on the login page').toHaveURL(/\/login$/);
      await expect(userNameInput(page), 'UserName field').toBeVisible();
      await expect(passwordInput(page), 'Password field').toBeVisible();
      await expect(loginButton(page), 'Login button').toBeEnabled();
      await expect(newUserButton(page), 'New User button').toBeVisible();
    },

    async login(userName, password) {
      await userNameInput(page).fill(userName);
      await passwordInput(page).fill(password);
      await loginButton(page).click();
      await expect(page, 'redirected to the profile page').toHaveURL(/\/profile$/, { timeout: LOGIN_TIMEOUT_MS });
    },
  };
}
