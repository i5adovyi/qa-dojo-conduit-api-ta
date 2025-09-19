import { validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { APIResponse, expect } from '@playwright/test';

test.describe('Favourite articles -  Article API', () => {
  let slug: string;
  let resp: APIResponse;
  let authorUsername: string;

  test.beforeAll(async ({ article, user }) => {
    const userResponse = await user.getUserInfo();
    const userData = await userResponse.json();
    authorUsername = userData.user.username;
    resp = await article.create(validArticle());
    slug = (await resp.json()).article.slug as string;
  });

  test(
    'LWIO-035: Add article to favourites',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ favourite }) => {
      const response = await favourite.favoriteArticle(slug);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.favorited).toBeTruthy();
    }
  );

    test(
    'LWIO-036: Remove article from favourites',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ favourite }) => {
      await favourite.favoriteArticle(slug);
      const response = await favourite.unfavoriteArticle(slug);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.favorited).toBeFalsy();
    }
  );
});
