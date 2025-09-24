import { validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { articleResponseSchema } from '@/schemas/schemas';
import { validateWithSchema } from '@/utils/helpers/validate-schema';
import { APIResponse, expect } from '@playwright/test';

test.describe('Get Article API', () => {
  let slug: string;
  let resp: APIResponse;
  let authorUsername: string;
  let testTag: string = 'test-search-tag';

  test.beforeAll(async ({ article, user }) => {
    const userResponse = await user.getUserInfo();
    const userData = await userResponse.json();
    authorUsername = userData.user.username;

    const articleData = {
      ...validArticle(),
      tagList: [testTag, 'automation'],
    };
    const createResponse = await article.create(articleData);
    const responseBody = await createResponse.json();
    slug = responseBody.article.slug;
  });

  test('LWIO-50 Article response schema validation', async ({ article }) => {
    const response = await article.getBySlug(slug);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const { isValid, errors } = validateWithSchema(
      responseBody.article,
      articleResponseSchema
    );
    expect(isValid).toBe(true);
    if (!isValid) console.log(errors);
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
      expect(responseBody.articles).toBeDefined();
    }
  );

  test(
    'LWIO-032: Filter articles by current author',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getList({ author: authorUsername });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      const foundArticle = responseBody.articles.find(
        (art: any) => art.slug === slug
      );
      expect(foundArticle).toBeDefined();
      expect(foundArticle.author.username).toEqual(authorUsername);
    }
  );

  test(
    'LWIO-033: Filter articles by tag',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getList({ tag: testTag });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody.articles).toBeDefined();
      const foundArticle = responseBody.articles.find(
        (art: any) => art.slug === slug
      );
      expect(foundArticle).toBeDefined();
      expect(foundArticle.tagList).toContain(testTag);
    }
  );

  test(
    'LWIO-034: Filter articles by tag and autor',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ article }) => {
      const response = await article.getList({
        tag: testTag,
        author: authorUsername,
      });

      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();

      const foundArticle = responseBody.articles.find(
        (art: any) => art.slug === slug
      );
      expect(foundArticle).toBeDefined();
      expect(foundArticle.tagList).toContain(testTag);
      expect(foundArticle.author.username).toEqual(authorUsername);
    }
  );
});
