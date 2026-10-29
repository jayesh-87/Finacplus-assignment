import { expect } from '@playwright/test';

const bookTable = (page) => page.getByRole('table');
const columnHeaders = (page) => bookTable(page).locator('thead th');
const bookRows = (page) => bookTable(page).locator('tbody tr');
const bookRowByTitle = (page, title) =>
  bookRows(page).filter({ has: page.getByRole('link', { name: title, exact: true }) });
const searchInput = (page) => page.getByPlaceholder('Type to search');
const loginButton = (page) => page.getByRole('button', { name: 'Login', exact: true });
const logOutButton = (page) => page.getByRole('button', { name: 'Log out', exact: true });
const loggedInUserName = (page) => page.locator('#userName-value');

export function BookStorePage(page) {
  async function columnIndexes(columnNames) {
    const headers = (await columnHeaders(page).allInnerTexts()).map((text) => text.trim());
    return columnNames.map((columnName) => {
      const index = headers.indexOf(columnName);
      expect(index, `"${columnName}" column present in the book table`).toBeGreaterThanOrEqual(0);
      return index;
    });
  }

  async function readBookDetails(title) {
    const cells = bookRowByTitle(page, title).getByRole('cell');
    const [titleIndex, authorIndex, publisherIndex] = await columnIndexes(['Title', 'Author', 'Publisher']);
    return {
      title: (await cells.nth(titleIndex).innerText()).trim(),
      author: (await cells.nth(authorIndex).innerText()).trim(),
      publisher: (await cells.nth(publisherIndex).innerText()).trim(),
    };
  }

  async function expectBookListLoaded() {
    await expect(searchInput(page), 'search box').toBeVisible();
    await expect(bookRows(page).first(), 'book list rendered').toBeVisible();
  }

  return {
    expectBookListLoaded,

    async openLogin() {
      await loginButton(page).click();
    },

    async expectLoaded(userName) {
      await expect(loggedInUserName(page), 'logged-in username on the book store').toHaveText(userName);
      await expectBookListLoaded();
    },

    async searchBook(searchText) {
      await searchInput(page).fill(searchText);
      await expect(searchInput(page), 'search box value').toHaveValue(searchText);
    },

    async expectBookInResults(title) {
      await expect(bookRowByTitle(page, title), `exactly one result row for "${title}"`).toHaveCount(1);
      await expect(bookRowByTitle(page, title), `result row for "${title}"`).toBeVisible();
    },

    async expectBookDetails(expected) {
      const actual = await readBookDetails(expected.title);
      expect(actual, `details shown for "${expected.title}"`).toEqual(expected);
      return actual;
    },

    async logOut() {
      await logOutButton(page).click();
      await expect(page, 'redirected to the login page after log out').toHaveURL(/\/login$/);
      await expect
        .poll(async () => (await page.context().cookies()).some((cookie) => cookie.name === 'token'), {
          message: 'auth token cookie cleared after log out',
        })
        .toBe(false);
    },
  };
}
