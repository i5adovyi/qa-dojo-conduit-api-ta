import { randomUUID } from 'node:crypto';
import { invalidArticle, validArticle } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Update articles', { tag: '@regression' }, () => {
  test(
    'LWIO-013: Update all article fields',
    { tag: ['@smoke', '@positive'] },
    async ({ article, seededArticle }) => {
      const payload = validArticle();
      const response = await article.update(seededArticle.slug, payload);
      expect(response.status()).toBe(200);
      const updated = (await response.json()).article;
      expect(updated).toMatchObject({
        ...payload,
        slug: expect.any(String),
        createdAt: seededArticle.createdAt,
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: expect.objectContaining({
          username: seededArticle.author.username,
          image: expect.any(String),
          following: expect.any(Boolean),
        }),
      });

      const read = await article.getBySlug(updated.slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article).toMatchObject(payload);
    }
  );

  for (const [id, field] of [
    ['014', 'title'],
    ['015', 'description'],
    ['016', 'body'],
    ['017', 'tagList'],
  ] as const) {
    test(
      `LWIO-${id}: Change only the article's ${field}`,
      { tag: '@positive' },
      async ({ article, seededArticle }) => {
        const { title, description, body, tagList, slug } = seededArticle;
        // This PUT contract expects the full editable payload. Only the selected value changes.
        const newValue = validArticle({ title: `updated-${randomUUID()}` })[
          field
        ];
        expect(newValue).not.toEqual(seededArticle[field]);
        const payload = {
          title,
          description,
          body,
          tagList,
          [field]: newValue,
        };
        const response = await article.update(slug, payload);
        expect(response.status()).toBe(200);
        const updated = (await response.json()).article;
        expect(updated).toMatchObject(payload);

        const read = await article.getBySlug(updated.slug);
        expect(read.status()).toBe(200);
        expect((await read.json()).article).toMatchObject(payload);
      }
    );
  }

  test(
    'LWIO-018: Updating an unknown article returns 404',
    { tag: '@negative' },
    async ({ article }) => {
      const response = await article.update(
        `missing-${randomUUID()}`,
        validArticle()
      );
      expect(response.status()).toBe(404);
      expect(await response.text()).toBe('Not Found');
    }
  );

  test(
    'LWIO-019: Another user cannot update an owned article',
    { tag: '@negative' },
    async ({ request, article, seededArticle, registeredUser }) => {
      const { slug, title, description, body, tagList } = seededArticle;
      const response = await request.put(`articles/${slug}`, {
        data: {
          article: {
            title,
            description,
            tagList,
            body: `unauthorized-${randomUUID()}`,
          },
        },
        headers: { Authorization: `Token ${registeredUser.token}` },
      });
      expect(response.status()).toBe(403);
      const read = await article.getBySlug(slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article).toMatchObject({
        slug,
        title,
        description,
        body,
        tagList,
      });
    }
  );

  for (const [id, field, message] of [
    ['020', 'title', 'Title cannot be empty'],
    ['021', 'body', 'Content cannot be empty'],
  ] as const) {
    test(
      `LWIO-${id}: Updating with an empty ${field} returns 422`,
      { tag: '@negative' },
      async ({ article, seededArticle }) => {
        const response = await article.update(
          seededArticle.slug,
          validArticle({ [field]: '' })
        );
        expect(response.status()).toBe(422);
        expect((await response.json()).errors.message).toBe(message);
      }
    );
  }

  for (const [id, field, message] of [
    ['022', 'title', 'Missing requred property Title'],
    ['023', 'body', 'Missing requred property Body'],
  ] as const) {
    test(
      `LWIO-${id}: Updating without ${field} returns 422`,
      { tag: '@negative' },
      async ({ article, seededArticle }) => {
        const response = await article.update(
          seededArticle.slug,
          invalidArticle({}, [field])
        );
        expect(response.status()).toBe(422);
        expect((await response.json()).errors.message).toBe(message);
      }
    );
  }

  test(
    'LWIO-024: Invalid token cannot update the article',
    { tag: '@negative' },
    async ({ request, article, seededArticle }) => {
      const { slug, title, body, description, tagList } = seededArticle;
      const response = await request.put(`articles/${slug}`, {
        data: {
          article: {
            title,
            description,
            tagList,
            body: `unauthorized-${randomUUID()}`,
          },
        },
        headers: { Authorization: 'Token invalid-token' },
      });
      expect(response.status()).toBe(401);
      expect((await response.json()).errors).toBeDefined();

      const read = await article.getBySlug(slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article).toMatchObject({
        slug,
        title,
        body,
        description,
        tagList,
      });
    }
  );
});
