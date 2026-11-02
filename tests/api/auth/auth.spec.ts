import { userInfo } from '@/data/user.data';
import { test } from '@/fixtures/fixtures';
import { UserController } from '@/utils/controllers/user.controller';
import { expect } from '@playwright/test';

test.describe('Authentication', () => {
  test(
    'Register a user with valid credentials',
    { tag: '@smoke' },
    async ({ request }) => {
      const credentials = userInfo();
      const response = await new UserController(request).create(credentials);
      expect(response.status()).toBe(200);

      const { user } = await response.json();
      expect(user.username).toBe(credentials.username);
      expect(user.email).toBe(credentials.email);
      expect(typeof user.token === 'string' && user.token.length > 0).toBe(
        true
      );
    }
  );

  test(
    'Log in and fetch the registered user',
    { tag: '@smoke' },
    async ({ request, owner }) => {
      const { email, password, username } = owner.credentials;
      const login = await new UserController(request).login({
        email,
        password,
      });
      expect(login.status()).toBe(200);
      const token = (await login.json()).user?.token;
      expect(typeof token === 'string' && token.length > 0).toBe(true);

      const profile = await new UserController(request, token).getUserInfo();
      expect(profile.status()).toBe(200);
      const { user } = await profile.json();
      expect(user.email).toBe(email);
      expect(user.username).toBe(username);
    }
  );

  for (const scenario of [
    'wrong password',
    'non-existent user',
    'empty email',
  ] as const) {
    test(`LWIO-044: Login fails with ${scenario}`, async ({
      request,
      owner,
    }) => {
      const credentials = owner.credentials;
      const other = userInfo();
      const login = {
        'wrong password': {
          email: credentials.email,
          password: other.password,
        },
        'non-existent user': {
          email: other.email,
          password: credentials.password,
        },
        'empty email': { email: '', password: credentials.password },
      }[scenario];
      const response = await new UserController(request).login(login);

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(Boolean(body.errors)).toBe(true);
      expect(Boolean(body.user?.token)).toBe(false);
    });
  }
});
