import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe(
  'Article favourites',
  { tag: ['@regression', '@positive'] },
  () => {
    test(
      'LWIO-035: Add an article to favourites',
      { tag: '@smoke' },
      async ({ article, favourite, seededArticle }) => {
        const { slug } = seededArticle;
        expect(seededArticle).toMatchObject({
          favorited: false,
          favoritesCount: 0,
        });

        const response = await favourite.favoriteArticle(slug);
        expect(response.status()).toBe(200);
        const expected = { slug, favorited: true, favoritesCount: 1 };
        expect((await response.json()).article).toMatchObject(expected);

        const read = await article.getBySlug(slug);
        expect(read.status()).toBe(200);
        expect((await read.json()).article).toMatchObject(expected);
      }
    );

    test('LWIO-036: Remove an article from favourites', async ({
      article,
      favourite,
      seededArticle,
    }) => {
      const { slug } = seededArticle;
      const add = await favourite.favoriteArticle(slug);
      expect(add.status()).toBe(200);
      expect((await add.json()).article).toMatchObject({
        slug,
        favorited: true,
        favoritesCount: 1,
      });

      const remove = await favourite.unfavoriteArticle(slug);
      expect(remove.status()).toBe(200);
      const expected = { slug, favorited: false, favoritesCount: 0 };
      expect((await remove.json()).article).toMatchObject(expected);

      const read = await article.getBySlug(slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).article).toMatchObject(expected);
    });
  }
);
