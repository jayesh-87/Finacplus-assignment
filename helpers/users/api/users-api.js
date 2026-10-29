import { expect } from '@playwright/test';

const REGISTER_ENDPOINT = '/api/register';
const USERS_ENDPOINT = '/api/users';

function parseBody(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { nonJsonBody: text.slice(0, 200) };
  }
}

async function toResult(response) {
  return { status: response.status(), body: parseBody(await response.text()) };
}

export function UsersApi(request) {
  return {
    async registerUser(credentials) {
      return toResult(await request.post(REGISTER_ENDPOINT, { data: credentials }));
    },

    async getUser(userId) {
      return toResult(await request.get(`${USERS_ENDPOINT}/${userId}`));
    },

    async updateUser(userId, user) {
      return toResult(await request.put(`${USERS_ENDPOINT}/${userId}`, { data: user }));
    },

    expectUserRegistered({ status, body }) {
      expect(status, 'register user HTTP status').toBe(200);
      expect(
        Number.isInteger(body.id) && body.id > 0,
        `registered user id is a positive integer (got ${body.id})`,
      ).toBe(true);
      expect(typeof body.token === 'string' && body.token.length > 0, 'register user token issued').toBe(true);
      return body.id;
    },

    expectUserDetails({ status, body }, userId, expectedProfile) {
      expect(status, `GET user ${userId} HTTP status`).toBe(200);
      expect(body.data?.id, 'returned user id matches the stored userId').toBe(userId);
      expect(body.data, `user ${userId} details`).toMatchObject(expectedProfile);
      expect(body.data.avatar, `user ${userId} avatar URL`).toMatch(/^https:\/\/.+/);
    },

    expectUserUpdated({ status, body }, expected) {
      expect(status, 'update user HTTP status').toBe(200);
      expect(body, 'updated user echoes the new values').toMatchObject(expected);
    },
  };
}
