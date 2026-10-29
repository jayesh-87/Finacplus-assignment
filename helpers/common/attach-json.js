const REDACTED_KEYS = new Set(['token', 'password']);

const redact = (key, value) => (REDACTED_KEYS.has(key) && value ? '<redacted>' : value);

export async function attachJson(testInfo, name, data) {
  await testInfo.attach(name, { body: JSON.stringify(data, redact, 2), contentType: 'application/json' });
}
