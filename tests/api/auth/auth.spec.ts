import { userInfo } from '@/data/user.data';
import { User } from '@/types/types';
import { expect, test } from '@playwright/test';
import { UserController } from '../../utils/controllers/user.controller';
import { loggedUser } from '@/fixtures/fixtures';
const data: User = userInfo();

test.describe.serial('Auth', () => {
  let user: UserController;
  // test.beforeAll(async () => {
  //   data = userInfo();
  // });

  test('Create User with valid credentials', async ({ request }) => {
    user = new UserController(request);
    const response = await user.create(data);
    console.log(data);

    console.log(await response.json());

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.user).toBeDefined();
  });

  test('Login with valid credentials', async ({ request }) => {
    user = new UserController(request);
    const response = await user.login(data);
    console.log(data);

    console.log(await response.json());
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.user).toBeDefined();
  });
});
