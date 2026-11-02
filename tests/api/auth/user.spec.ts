import { test } from '@/fixtures/fixtures';
import { UserController } from '@/utils/controllers/user.controller';
import { expect } from '@playwright/test';

test('Update and read back the current user profile', async ({
  request,
  registeredUser,
}) => {
  const profile = new UserController(request, registeredUser.token);
  const changes = {
    bio: 'Updated bio for testing',
    image: 'https://example.com/updated-avatar.jpg',
  };
  const response = await profile.update(changes);
  expect(response.status()).toBe(200);

  const persisted = await profile.getUserInfo();
  expect(persisted.status()).toBe(200);
  const { user } = await persisted.json();
  expect(user.username).toBe(registeredUser.credentials.username);
  expect(user.bio).toBe(changes.bio);
  expect(user.image).toBe(changes.image);
});
