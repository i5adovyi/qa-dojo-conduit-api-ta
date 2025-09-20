import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('User Profile Management', () => {
  test('Update user profile', async ({ user }) => {

    const updateData = {
      bio: 'Updated bio for testing',
      image: 'https://example.com/updated-avatar.jpg'
    };

    const response = await user.update(updateData);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.user.bio).toBe(updateData.bio);
    expect(responseBody.user.image).toBe(updateData.image);
  });
});