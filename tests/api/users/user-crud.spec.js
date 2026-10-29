import { test } from '#fixtures/baseTest.js';
import { attachJson } from '#helpers/common/attach-json.js';
import { UsersApi } from '#helpers/users/api/users-api.js';
import { REGISTER_CREDENTIALS, REGISTERED_USER_PROFILE, UPDATED_USER } from '#test-data/users/users.js';

test.describe('Users API', {
  tag: ['@api', '@regression', '@users'],
}, () => {
  test('RQ-UserCrud-P-Test', async ({ request, testLog }, testInfo) => {
    testLog.start();
    const usersApi = UsersApi(request);

    const userId = await test.step('Create a user, validate the HTTP status and store the userId', async () => {
      testLog.api(`POST /api/register for ${REGISTER_CREDENTIALS.email}`);
      const response = await usersApi.registerUser(REGISTER_CREDENTIALS);
      await attachJson(testInfo, '01-create-user-response', response);
      const id = usersApi.expectUserRegistered(response);
      testLog.api(`Stored userId=${id}`);
      return id;
    });

    await test.step('Get the created user and validate its details', async () => {
      testLog.api(`GET /api/users/${userId}`);
      const response = await usersApi.getUser(userId);
      await attachJson(testInfo, '02-get-user-response', response);
      usersApi.expectUserDetails(response, userId, REGISTERED_USER_PROFILE);
    });

    await test.step("Update the user's name and validate it", async () => {
      testLog.api(`PUT /api/users/${userId} ${JSON.stringify(UPDATED_USER)}`);
      const response = await usersApi.updateUser(userId, UPDATED_USER);
      await attachJson(testInfo, '03-update-user-response', response);
      usersApi.expectUserUpdated(response, UPDATED_USER);
    });

    testLog.end();
  });
});
