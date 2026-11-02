import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Delete articles', { tag: '@regression' }, () => {
  test(
    'LWIO-025 / LWIO-027: Delete an owned article and reject a second deletion',
    { tag: ['@smoke', '@positive'] },
    async ({ article, seededArticle }) => {
      const response = await article.delete(seededArticle.slug);
      expect(response.status()).toBe(204);
      const read = await article.getBySlug(seededArticle.slug);
      expect(read.status()).toBe(404);
      const repeat = await article.delete(seededArticle.slug);
      expect(repeat.status()).toBe(404);
    }
  );

  test(
    'Invalid token cannot delete the article',
    { tag: '@negative' },
    async ({ request, article, seededArticle }) => {
      const response = await request.delete(`articles/${seededArticle.slug}`, {
        headers: { Authorization: 'Token invalid-token' },
      });
      expect(response.status()).toBe(401);
      expect((await response.json()).errors).toBeDefined();

      const read = await article.getBySlug(seededArticle.slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article.slug).toBe(seededArticle.slug);
    }
  );
});
