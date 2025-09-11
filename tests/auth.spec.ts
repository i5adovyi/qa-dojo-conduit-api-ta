import { expect, test } from '@playwright/test';

test.describe('Auth', () => {
  test('Create User with valid credentials', async ({ request }) => {
    const response = await request.post('users', {
      data: {
        user: {
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
          username: process.env.USERNAME,
        },
      },
    });
    console.log(await response.json());
    expect(response.status()).toBe(200);
    // const responseBody = await response.json();
    // expect(responseBody.user).toBeDefined();
    // expect(responseBody.user.email).toBe(process.env.USER_EMAIL);
  });

  test('Login with valid credentials', async ({ request }) => {
    const response = await request.post('users/login', {
      data: {
        user: {
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
          username: process.env.USERNAME,
        },
      },
    });
    console.log(await response.json());
    expect(response.status()).toBe(200);
    // const responseBody = await response.json();
    // expect(responseBody.user).toBeDefined();
    // expect(responseBody.user.email).toBe(process.env.USER_EMAIL);
  });
});
