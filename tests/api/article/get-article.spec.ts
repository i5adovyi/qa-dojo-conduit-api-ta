import { validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { Article } from '@/types/types';
import { APIResponse, expect } from '@playwright/test';

test.describe('Get Article API', () => {
  let createdArticle: Article;
  let slug: string;
  let resp: APIResponse

  test.beforeEach(async ({ article }) => {
    resp = await article.create(validArticle());
    slug = (await resp.json()).article.slug as string;
  });

  test(
    'LWIO-029: Get existing article returns 200',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getBySlug(slug);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.article).toBeDefined();
    }
  );


  test(
    'LWIO-030: Non-existent article returns 404',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getBySlug('123bob');

      expect(response.status()).toBe(404);
      const responseBody = await response.text();

      expect(responseBody).toEqual('Not Found');
    }
  );

    test(
    'LWIO-028: Get list of all articles returns 200',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getList();

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect
    }
  );
});
