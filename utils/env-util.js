import 'dotenv/config';

const DEFAULT_BASE_URL = 'https://demoqa.com';
const DEFAULT_REQRES_BASE_URL = 'https://reqres.in';
const DEFAULT_REQRES_API_KEY = 'reqres-free-v1';
const PLACEHOLDER_PATTERN = /^<ENTER_.+>$/;

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value || PLACEHOLDER_PATTERN.test(value)) {
    throw new Error(`Missing required env var ${name}; copy .env.example to .env and fill it in`);
  }
  return value;
}

export function getBaseUrl() {
  return process.env.BASE_URL?.trim() || DEFAULT_BASE_URL;
}

export function getReqresBaseUrl() {
  return process.env.REQRES_BASE_URL?.trim() || DEFAULT_REQRES_BASE_URL;
}

export function getReqresApiKey() {
  return process.env.REQRES_API_KEY?.trim() || DEFAULT_REQRES_API_KEY;
}

export function isHeadless() {
  return process.env.HEADLESS !== 'false';
}

export function getBookStoreCredentials() {
  return { userName: requireEnv('DEMOQA_USERNAME'), password: requireEnv('DEMOQA_PASSWORD') };
}
