import { userInfo } from '@/data/user.data';
import { User } from '@/types/types';
import { expect, test } from '@playwright/test';
import { UserController } from '../../utils/controllers/user.controller';

const data: User = userInfo();

test.describe('User Profile Management', () => {
  let user: UserController;

  test('Update user profile', async ({ request }) => {
    user = new UserController(request);

    // Login to get token first
    const loginResponse = await user.login(data);
    const loginBody = await loginResponse.json();
    const token = loginBody.user.token;

    // Create user controller with token
    const authenticatedUser = new UserController(request, token);

    const updateData = {
      bio: 'Updated bio for testing',
      image: 'https://example.com/updated-avatar.jpg'
    };

    const response = await authenticatedUser.update(updateData);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.user.bio).toBe(updateData.bio);
    expect(responseBody.user.image).toBe(updateData.image);
  });
});