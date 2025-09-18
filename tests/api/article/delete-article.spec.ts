import { validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { Article } from '@/types/types';
import { expect } from '@playwright/test';

test.describe('Delete Article API', () => {
  let createdArticle: Article;
  let slug: string;

  test.beforeEach(async ({ article }) => {
    const response = await article.create(validArticle());
    createdArticle = (await response.json()).article;
    slug = createdArticle.slug as string;
  });

  test(
    'LWIO-025: Delete own article return 204',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      await test.step('Delete article', async () => {
        const response = await article.delete(slug);
        expect(response.status()).toBe(204);
      });

      await test.step('Check that article deleted', async () => {
        const response = await article.getBySlug(slug);
        expect(response.status()).toBe(404);
      });
    }
  );

  test(
    'LWIO-027: Delete for Unauthorized user returns 401',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ request }) => {
      const invalidToken = 'invalid-token-123';
      const response = await request.delete(`articles/${slug}`, {
        headers: {
          Authorization: `Token ${invalidToken}`,
        },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.errors).toBeDefined();
    }
  );
});
