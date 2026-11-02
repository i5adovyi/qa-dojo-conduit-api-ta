import { invalidArticle, validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Create articles', { tag: '@regression' }, () => {
  test(
    'LWIO-003: Create an article with all fields',
    { tag: ['@smoke', '@positive'] },
    async ({ article }) => {
      const payload = validArticle();
      const response = await article.create(payload);
      expect(response.status()).toBe(200);
      const created = (await response.json()).article;
      expect(created).toMatchObject({
        ...payload,
        slug: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: expect.any(String),
          image: expect.any(String),
          following: false,
        },
      });

      const read = await article.getBySlug(created.slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article).toMatchObject(payload);
    }
  );

  for (const [id, field, empty] of [
    ['004', 'description', ''],
    ['005', 'tagList', []],
    ['006', 'title', ''],
    ['007', 'body', ''],
  ] as const) {
    test(
      `LWIO-${id}: Accept an empty ${field} on creation`,
      { tag: '@positive' },
      async ({ article }) => {
        const response = await article.create(validArticle({ [field]: empty }));
        expect(response.status()).toBe(200);
        expect((await response.json()).article[field]).toEqual(empty);
      }
    );
  }

  for (const [id, field] of [
    ['008', 'title'],
    ['009', 'description'],
    ['010', 'body'],
  ] as const) {
    test(
      `LWIO-${id}: Creating without ${field} returns 422`,
      { tag: '@negative' },
      async ({ article }) => {
        const response = await article.create(invalidArticle({}, [field]));
        expect(response.status()).toBe(422);
        expect((await response.json()).errors.message).toEqual(
          expect.stringMatching(/\S/)
        );
      }
    );
  }

  test(
    'LWIO-011: Invalid token cannot create an article',
    { tag: '@negative' },
    async ({ request }) => {
      const response = await request.post('articles', {
        data: { article: validArticle() },
        headers: { Authorization: 'Token invalid-token' },
      });
      expect(response.status()).toBe(401);
      expect((await response.json()).errors).toBeDefined();
    }
  );
});
