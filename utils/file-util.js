import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeKeyValueFile(filePath, record) {
  const content = `${Object.entries(record)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}\n`;
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf-8');
  return content;
}

export async function readTextFile(filePath) {
  return readFile(filePath, 'utf-8');
}
