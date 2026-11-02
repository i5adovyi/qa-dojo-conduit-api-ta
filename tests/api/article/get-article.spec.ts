import { randomUUID } from 'node:crypto';
import { test } from '@/fixtures/fixtures';
import { articleResponseSchema } from '@/schemas/schemas';
import { validateWithSchema } from '@/utils/helpers/validate-schema';
import { expect } from '@playwright/test';

test.describe('Read and filter articles', { tag: '@regression' }, () => {
  test(
    'LWIO-050: Article response satisfies the schema',
    { tag: '@positive' },
    async ({ article, seededArticle }) => {
      const response = await article.getBySlug(seededArticle.slug);
      expect(response.status()).toBe(200);
      const { isValid, errors } = validateWithSchema(
        (await response.json()).article,
        articleResponseSchema
      );
      expect(isValid, JSON.stringify(errors)).toBe(true);
    }
  );

  test(
    'LWIO-029: Read the article by its slug',
    { tag: ['@smoke', '@positive'] },
    async ({ article, seededArticle }) => {
      const response = await article.getBySlug(seededArticle.slug);
      expect(response.status()).toBe(200);
      expect((await response.json()).article).toMatchObject({
        slug: seededArticle.slug,
        title: seededArticle.title,
        description: seededArticle.description,
        body: seededArticle.body,
        tagList: seededArticle.tagList,
        author: { username: seededArticle.author.username },
      });
    }
  );

  test(
    'LWIO-030: Unknown slug returns 404',
    { tag: ['@negative', '@read-only'] },
    async ({ request }) => {
      const response = await request.get(`articles/missing-${randomUUID()}`);
      expect(response.status()).toBe(404);
      expect(await response.text()).toBe('Not Found');
    }
  );

  test(
    'LWIO-028: List articles',
    { tag: ['@positive', '@read-only'] },
    async ({ request }) => {
      const limit = 5;
      const response = await request.get('articles', { params: { limit } });
      expect(response.status()).toBe(200);
      const { articles, articlesCount } = await response.json();
      expect(articles).toEqual(expect.any(Array));
      expect(articles.length).toBeLessThanOrEqual(limit);
      expect(Number.isInteger(articlesCount)).toBe(true);
      for (const item of articles) {
        expect(item).toMatchObject({
          slug: expect.any(String),
          title: expect.any(String),
        });
      }
      expect(articlesCount).toBeGreaterThanOrEqual(articles.length);
    }
  );

  test(
    'LWIO-032: Filter by author',
    { tag: '@positive' },
    async ({ article, seededArticle }) => {
      const author = seededArticle.author.username;
      const match = await article.getList({ author });
      expect(match.status()).toBe(200);
      const { articles } = await match.json();
      expect(articles).toContainEqual(
        expect.objectContaining({ slug: seededArticle.slug })
      );
      for (const item of articles) {
        expect(item.author.username).toBe(author);
      }

      const miss = await article.getList({ author: `absent-${randomUUID()}` });
      expect(miss.status()).toBe(200);
      expect((await miss.json()).articles).toEqual([]);
    }
  );

  test(
    'LWIO-033: Filter by tag',
    { tag: '@positive' },
    async ({ article, seededArticle }) => {
      const tag = seededArticle.tagList[0];
      const match = await article.getList({ tag });
      expect(match.status()).toBe(200);
      const { articles } = await match.json();
      expect(articles).toContainEqual(
        expect.objectContaining({ slug: seededArticle.slug })
      );
      for (const item of articles) {
        expect(item.tagList).toContain(tag);
      }

      const miss = await article.getList({ tag: `absent-${randomUUID()}` });
      expect(miss.status()).toBe(200);
      expect((await miss.json()).articles).toEqual([]);
    }
  );

  test(
    'LWIO-034: Filter by both author and tag',
    { tag: '@positive' },
    async ({ article, seededArticle }) => {
      const author = seededArticle.author.username;
      const tag = seededArticle.tagList[0];
      const match = await article.getList({ author, tag });
      expect(match.status()).toBe(200);
      const { articles } = await match.json();
      expect(articles).toContainEqual(
        expect.objectContaining({ slug: seededArticle.slug })
      );
      for (const item of articles) {
        expect(item.author.username).toBe(author);
        expect(item.tagList).toContain(tag);
      }

      // Either mismatched predicate must exclude the seeded article.
      const missing = `absent-${randomUUID()}`;
      for (const filters of [
        { author, tag: missing },
        { author: missing, tag },
      ]) {
        const miss = await article.getList(filters);
        expect(miss.status()).toBe(200);
        expect((await miss.json()).articles).toEqual([]);
      }
    }
  );
});
