import { expect } from '@playwright/test';
import { readTextFile, writeKeyValueFile } from '#utils/file-util.js';

export async function writeBookDetailsFile(filePath, book) {
  const content = await writeKeyValueFile(filePath, {
    Title: book.title,
    Author: book.author,
    Publisher: book.publisher,
  });
  expect(await readTextFile(filePath), `book details written to ${filePath}`).toBe(content);
  return content;
}
