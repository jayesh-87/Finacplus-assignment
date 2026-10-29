import { test } from '#fixtures/baseTest.js';
import { writeBookDetailsFile } from '#helpers/book-store/book-details-file.js';
import { BookStorePage } from '#helpers/book-store/pages/book-store-page.js';
import { HomePage } from '#helpers/book-store/pages/home-page.js';
import { LoginPage } from '#helpers/book-store/pages/login-page.js';
import { ProfilePage } from '#helpers/book-store/pages/profile-page.js';
import { attachStepScreenshot } from '#helpers/common/step-screenshot.js';
import { LEARNING_JAVASCRIPT_DESIGN_PATTERNS as BOOK, BOOK_DETAILS_OUTPUT_FILE } from '#test-data/book-store/books.js';
import * as EnvUtil from '#utils/env-util.js';

test.describe('BookStore Search', {
  tag: ['@regression', '@smoke', '@book_store', '@book_store_search'],
}, () => {
  test('BS-BookSearch-P-Test', async ({ page, testLog }, testInfo) => {
    testLog.start();
    const { userName, password } = EnvUtil.getBookStoreCredentials();
    const homePage = HomePage(page);
    const loginPage = LoginPage(page);
    const profilePage = ProfilePage(page);
    const bookStorePage = BookStorePage(page);

    await test.step('Navigate to demoqa and open the Book Store Application', async () => {
      testLog.ui('Navigate to / and open Book Store Application');
      await homePage.goto();
      await homePage.openBookStoreApplication();
      await bookStorePage.expectBookListLoaded();
      await attachStepScreenshot(page, testInfo, '01-book-store-application');
    });

    await test.step('Log in with the manually registered user', async () => {
      testLog.ui(`Log in as ${userName}`);
      await bookStorePage.openLogin();
      await loginPage.expectLoaded();
      await loginPage.login(userName, password);
    });

    await test.step('Validate the username and Logout button after login', async () => {
      await profilePage.expectLoggedInAs(userName);
      await attachStepScreenshot(page, testInfo, '02-logged-in-profile');
    });

    await test.step('Click Go To Book Store', async () => {
      testLog.ui('Click Go To Book Store');
      await profilePage.goToBookStore();
      await bookStorePage.expectLoaded(userName);
    });

    await test.step(`Search "${BOOK.title}" and validate it is in the results`, async () => {
      testLog.ui(`Search "${BOOK.title}"`);
      await bookStorePage.searchBook(BOOK.title);
      await bookStorePage.expectBookInResults(BOOK.title);
      await attachStepScreenshot(page, testInfo, '03-search-result');
    });

    const bookDetails = await test.step('Read and validate Title, Author and Publisher of the book', async () => {
      return bookStorePage.expectBookDetails(BOOK);
    });

    await test.step('Print Title, Author and Publisher into a file', async () => {
      testLog.file(`Write book details to ${BOOK_DETAILS_OUTPUT_FILE}`);
      const content = await writeBookDetailsFile(BOOK_DETAILS_OUTPUT_FILE, bookDetails);
      testLog.file(`Book details:\n${content}`);
      await testInfo.attach('book-details.txt', { body: content, contentType: 'text/plain' });
    });

    await test.step('Log out', async () => {
      testLog.ui('Click Log out');
      await bookStorePage.logOut();
      await loginPage.expectLoaded();
      await attachStepScreenshot(page, testInfo, '04-logged-out');
    });

    testLog.end();
  });
});
