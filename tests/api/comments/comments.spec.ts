import { commentData } from '@/data/comment.data';
import { test } from '@/fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Article comments', { tag: ['@regression', '@positive'] }, () => {
  test(
    'LWIO-037: Add a comment to an article',
    { tag: '@smoke' },
    async ({ comment, seededArticle }) => {
      const { slug } = seededArticle;
      const payload = commentData();
      const add = await comment.add(slug, payload);
      expect(add.status()).toBe(200);
      const created = (await add.json()).comment;
      expect(created.id).toEqual(expect.anything());
      expect(created.body).toBe(payload.comment.body);

      const read = await comment.list(slug);
      expect(read.status()).toBe(200);
      expect((await read.json()).comments).toContainEqual(
        expect.objectContaining({
          id: created.id,
          body: payload.comment.body,
          author: expect.objectContaining({
            username: seededArticle.author.username,
          }),
        })
      );
    }
  );

  test('LWIO-038: Delete an owned comment', async ({
    comment,
    seededArticle,
  }) => {
    const { slug } = seededArticle;
    const add = await comment.add(slug, commentData());
    expect(add.status()).toBe(200);
    const { id } = (await add.json()).comment;
    expect(id).toEqual(expect.anything());

    const before = await comment.list(slug);
    expect(before.status()).toBe(200);
    expect((await before.json()).comments).toContainEqual(
      expect.objectContaining({ id })
    );

    const remove = await comment.delete(slug, id);
    expect(remove.status()).toBe(204);
    const after = await comment.list(slug);
    expect(after.status()).toBe(200);
    const { comments } = await after.json();
    expect(comments).toEqual(expect.any(Array));
    expect(comments).not.toContainEqual(expect.objectContaining({ id }));
  });
});
