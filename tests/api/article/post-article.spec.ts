import { invalidArticle, validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Create Article API', async () => {
  test(
    'LWIO-003  Create article with all fields',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const payload = validArticle();
      const response = await article.create(payload);

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
    'LWIO-004 Create Article with empty description',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.create(
        validArticle({
          description: '',
        })
      );

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.article.description).toEqual('');
    }
  );

  test(
    'LWIO-005: Create article with empty tagList',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.create(
        validArticle({
          tagList: [],
        })
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.article.tagList).toEqual([]);
      console.log(body);
    }
  );

  test(
    'LWIO-006: Create article with empty title',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.create(
        validArticle({
          title: '',
        })
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.article.title).toEqual('');
    }
  );

  test(
    'LWIO-007: Create article with empty body',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.create(
        validArticle({
          body: '',
        })
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.article.body).toEqual('');
    }
  );

  test(
    'LWIO-008: Missing title returns 500',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      // @ts-expect-error - Testing invalid data intentionally
      const response = await article.create(invalidArticle({}, ['title']));
      expect(response.status()).toBe(500);
      const body = await response.json();
      expect(body.errors.message).toEqual(
        "Cannot read property 'toString' of undefined"
      );
    }
  );

  test(
    'LWIO-009: Missing description returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      const response = await article.create(
        // @ts-expect-error - Testing invalid data intentionally
        invalidArticle({}, ['description'])
      );
      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors.message).toEqual(
        "Cannot read property 'toString' of undefined"
      );
    }
  );

  test(
    'LWIO-010: Missing body returns 422',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ article }) => {
      // @ts-expect-error - Testing invalid data intentionally
      const response = await article.create(invalidArticle({}, ['body']));
      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(body.errors.message).toEqual(
        "Cannot read property 'toString' of undefined"
      );
    }
  );

  test(
    'LWIO-011: Unauthorized user returns 401',
    {
      tag: ['@smoke', '@regression', '@negative'],
    },
    async ({ request }) => {
      const invalidToken = 'invalid-token-123';
      const response = await request.post('articles', {
        data: { article: validArticle() },
        headers: {
          Authorization: `Token ${invalidToken}`
        },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.errors).toBeDefined();
    }
  );
});
