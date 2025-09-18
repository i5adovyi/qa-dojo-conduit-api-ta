import { invalidArticle, validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { Article } from '@/types/types';
import { expect } from '@playwright/test';

test.describe('Update Article API', () => {
  let createdArticle: Article;
  let slug: string;

  test.beforeEach(async ({ article }) => {
    const response = await article.create(validArticle());
    createdArticle = (await response.json()).article;
    slug = createdArticle.slug as string;
  });

  test(
    'LWIO-013: Update article with all required fields',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      let payload = validArticle();
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article).toMatchObject({
        slug: expect.any(String),
        title: payload.title,
        description: payload.description,
        body: payload.body,
        tagList: payload.tagList,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: expect.any(Boolean),
        favoritesCount: expect.any(Number),
        author: {
          username: expect.any(String),
          image: expect.any(String),
          following: expect.any(Boolean),
        },
      });
    }
  );

  test(
    'LWIO-014: Update article title only',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      let payload = validArticle({
        title: `Updated title ${Date.now()}`,
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.title).toEqual(payload.title);
    }
  );

  test(
    'LWIO-015: Update article description only',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      let payload = validArticle({
        description: `Updated description ${Date.now()}`,
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.description).toEqual(payload.description);
    }
  );

  test(
    'LWIO-016: Update article body only',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      let payload = validArticle({
        body: `Updated body ${Date.now()}`,
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.body).toEqual(payload.body);
    }
  );

  test(
    'LWIO-017: Update article taglist',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      let payload = validArticle({
        tagList: ['qaDojo', 'bestCourseEver', 'apiTestingIsGreatAgain'],
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article.tagList).toEqual(payload.tagList);
    }
  );

  test(
    'LWIO-018: Update non existing article returns 404',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      let slug = 'abc123';
      const response = await article.update(slug, validArticle());

      expect(response.status()).toBe(404);
      let responseBody = await response.text();

      expect(responseBody).toEqual('Not Found');
    }
  );

  test(
    'LWIO-020: Update with empty title returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      let payload = validArticle({
        title: '',
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(422);
      const responseBody = await response.json();

      expect(responseBody.errors.message).toEqual('Title cannot be empty');
    }
  );

  test(
    'LWIO-021: Update with empty body returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      let payload = validArticle({
        body: '',
      });
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(422);
      const responseBody = await response.json();

      expect(responseBody.errors.message).toEqual('Content cannot be empty');
    }
  );

  test(
    'LWIO-022: Update with missing title returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      let payload = invalidArticle({}, ['title']);
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(422);
      const responseBody = await response.json();

      expect(responseBody.errors.message).toEqual(
        'Missing requred property Title'
      );
    }
  );

  test(
    'LWIO-023: Update with missing body returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      let payload = invalidArticle({}, ['title']);
      const response = await article.update(slug, payload);

      expect(response.status()).toBe(422);
      const responseBody = await response.json();

      expect(responseBody.errors.message).toEqual(
        'Missing requred property Body'
      );
    }
  );

  test(
    'LWIO-024: Update for Unauthorized user returns 401',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ request }) => {
      let payload = validArticle();
      const invalidToken = 'invalid-token-123';
      const response = await request.put(`articles/${slug}`, {
        data: { article: validArticle() },
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
